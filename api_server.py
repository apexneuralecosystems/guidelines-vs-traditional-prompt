"""Flask API server to expose backend functionality for frontend."""
import asyncio
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from traditional_llm_prompt import call_traditional_llm, TRADITIONAL_HUGE_PROMPT
from parlant_client_utils import (
    create_client as create_parlant_client,
    create_session as create_parlant_session,
    send_user_message as send_parlant_user_message,
    await_ai_reply as await_parlant_ai_reply,
    get_session_reasoning as get_parlant_reasoning,
)

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)  # Enable CORS for frontend

# Global variables for Parlant client and agent ID
parlant_client = None
agent_id = None


async def initialize_parlant():
    """Initialize Parlant client and load agent ID."""
    global parlant_client, agent_id
    
    if parlant_client is None:
        parlant_client = await create_parlant_client()
    
    if agent_id is None:
        agent_id_path = os.path.join("parlant-data", "agent_id.txt")
        if not os.path.exists(agent_id_path):
            raise RuntimeError("agent_id.txt not found. Please start parlant_agent_server.py first.")
        with open(agent_id_path, "r", encoding="utf-8") as f:
            agent_id = f.read().strip()
    
    return parlant_client, agent_id


@app.route('/api/compare', methods=['POST'])
def compare_responses():
    """Compare Traditional LLM vs Parlant agent responses for a given query."""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Run async operations
        result = asyncio.run(process_comparison(query))
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


async def process_comparison(query: str):
    """Process a single query comparison."""
    client, agent_id = await initialize_parlant()
    
    # Get traditional LLM response
    traditional_response = await call_traditional_llm(query, TRADITIONAL_HUGE_PROMPT)
    
    # Get Parlant agent response
    session_id = await create_parlant_session(client, agent_id)
    customer_event_offset = await send_parlant_user_message(client, session_id, query)
    min_offset = customer_event_offset + 1
    parlant_response = await await_parlant_ai_reply(client, session_id, min_offset) or "Error: No AI reply received from Parlant session."
    reasoning = await get_parlant_reasoning(client, session_id, min_offset)
    
    return {
        'query': query,
        'traditional_response': traditional_response,
        'parlant_response': parlant_response,
        'reasoning': reasoning
    }


@app.route('/api/demo-queries', methods=['GET'])
def get_demo_queries():
    """Get the list of demo queries."""
    demo_queries = [
        "I want to replace my existing $500k term policy with a whole life policy. What should I do?",
        "I'm 35 years old, make $80,000 a year, and have 2 kids. How much life insurance coverage should I get?",
        "I have diabetes. Will this affect my life insurance rates?",
        "I'm really confused about insurance. My car got totaled last week and I need to file a claim, but I also want to know about life insurance for my business, and my wife is asking about health insurance options. Can you help me with all of this?",
        "I'm thinking about getting life insurance but I'm not sure if I should. I'm 30 years old, healthy, and make $60,000 a year. I don't really want to spend a lot on premiums, but I also want to make sure my family is protected. What do you think I should do?",
    ]
    return jsonify({'queries': demo_queries})


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    try:
        # Try to initialize Parlant to check if backend is ready
        asyncio.run(initialize_parlant())
        return jsonify({'status': 'healthy', 'parlant_ready': True})
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'parlant_ready': False, 'error': str(e)}), 503


@app.route('/')
def index():
    """Serve the main frontend page."""
    return app.send_static_file('index.html')


if __name__ == '__main__':
    print("🚀 Starting Flask API server...")
    print("📡 API will be available at http://localhost:5000/api")
    print("🌐 Frontend will be available at http://localhost:5000")
    print("⚠️  Make sure parlant_agent_server.py is running first!")
    app.run(debug=True, port=5000, host='0.0.0.0')

