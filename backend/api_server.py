"""FastAPI server to expose backend functionality for frontend."""
import asyncio
import pathlib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from config import API_PORT, API_HOST, FRONTEND_PORT, DEMO_QUERIES, CORS_ORIGINS
from traditional_llm_prompt import call_traditional_llm, TRADITIONAL_HUGE_PROMPT
from parlant_client_utils import (
    create_client as create_parlant_client,
    create_session as create_parlant_session,
    send_user_message as send_parlant_user_message,
    await_ai_reply as await_parlant_ai_reply,
    get_session_reasoning as get_parlant_reasoning,
)

app = FastAPI(title="Parlant Comparison API", version="1.0.0")

# Global exception handler for unhandled exceptions
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "status_code": 422,
            "status": False,
            "message": f"Validation error: {str(exc)}",
            "path": str(request.url.path),
            "data": {}
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    error_msg = str(exc)
    print(f"Unhandled exception in {request.url.path}: {error_msg}")
    print(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={
            "status_code": 500,
            "status": False,
            "message": f"Internal server error: {error_msg}",
            "path": str(request.url.path),
            "data": {}
        }
    )

# Enable CORS for Next.js frontend
# CORS origins are configured via CORS_ORIGINS environment variable
# Defaults to FRONTEND_URL for development, or specify comma-separated list for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,  # Configured via CORS_ORIGINS env variable
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for Parlant client and agent ID
parlant_client = None
agent_id = None


# Standard Response Model
class StandardResponse(BaseModel):
    status_code: int
    status: bool
    message: str
    path: str
    data: dict

# Pydantic models for request/response
class CompareRequest(BaseModel):
    query: str


class CompareData(BaseModel):
    query: str
    traditional_response: str
    parlant_response: str
    reasoning: str


class HealthData(BaseModel):
    initialized: bool
    parlant_ready: bool
    error: Optional[str] = None


class DemoQueriesData(BaseModel):
    queries: list[str]


async def initialize_parlant():
    """Initialize Parlant client and load agent ID."""
    global parlant_client, agent_id
    
    if parlant_client is None:
        parlant_client = await create_parlant_client()
    
    if agent_id is None:
        # parlant-data is now in backend/ directory
        agent_id_path = pathlib.Path(__file__).parent / "parlant-data" / "agent_id.txt"
        if not agent_id_path.exists():
            raise RuntimeError("agent_id.txt not found. Please start parlant_agent_server.py first.")
        with open(agent_id_path, "r", encoding="utf-8") as f:
            agent_id = f.read().strip()
    
    return parlant_client, agent_id


@app.post("/api/initialize", response_model=StandardResponse)
async def initialize_assistant():
    """Initialize the assistant and check if documents are processed."""
    try:
        client, agent_id = await initialize_parlant()
        
        # Check if agent_id.txt exists (indicates initialization)
        agent_id_path = pathlib.Path(__file__).parent / "parlant-data" / "agent_id.txt"
        initialized = agent_id_path.exists() and agent_id is not None
        
        # Check for document processing (you can enhance this based on your actual document processing logic)
        parlant_data_dir = pathlib.Path(__file__).parent / "parlant-data"
        document_processed = initialized  # Simplified - adjust based on your actual logic
        
        # Try to get current document name (if available)
        current_document = "AI_Research_Assistant_Sample_Document.pdf"  # Default or extract from config
        
        return StandardResponse(
            status_code=200,
            status=True,
            message="Assistant initialized successfully",
            path="/api/initialize",
            data={
                "initialized": initialized,
                "document_processed": document_processed,
                "current_document": current_document
            }
        )
    except Exception as e:
        error_msg = str(e)
        print(f"Initialize error: {error_msg}")
        return StandardResponse(
            status_code=500,
            status=False,
            message=f"Failed to initialize assistant: {error_msg}",
            path="/api/initialize",
            data={
                "initialized": False,
                "document_processed": False,
                "current_document": None
            }
        )


async def process_comparison(query: str) -> CompareData:
    """Process a single query comparison."""
    try:
        client, agent_id = await initialize_parlant()
        
        # Get traditional LLM response
        traditional_response = await call_traditional_llm(query, TRADITIONAL_HUGE_PROMPT)
        
        # Get Parlant agent response
        session_id = await create_parlant_session(client, agent_id)
        customer_event_offset = await send_parlant_user_message(client, session_id, query)
        min_offset = customer_event_offset + 1
        parlant_response = await await_parlant_ai_reply(client, session_id, min_offset) or "Error: No AI reply received from Parlant session."
        reasoning = await get_parlant_reasoning(client, session_id, min_offset)
        
        return CompareData(
            query=query,
            traditional_response=traditional_response,
            parlant_response=parlant_response,
            reasoning=reasoning
        )
    except Exception as e:
        import traceback
        error_msg = f"Error processing comparison: {str(e)}"
        print(error_msg)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)


@app.post("/api/compare", response_model=StandardResponse)
async def compare_responses(request: CompareRequest):
    """Compare Traditional LLM vs Parlant agent responses for a given query."""
    try:
        query = request.query.strip()
        
        if not query:
            return StandardResponse(
                status_code=400,
                status=False,
                message="Query is required",
                path="/api/compare",
                data={}
            )
        
        result = await process_comparison(query)
        
        return StandardResponse(
            status_code=200,
            status=True,
            message="Comparison completed successfully",
            path="/api/compare",
            data=result.model_dump()
        )
    except HTTPException as e:
        return StandardResponse(
            status_code=e.status_code,
            status=False,
            message=str(e.detail),
            path="/api/compare",
            data={}
        )
    except Exception as e:
        import traceback
        error_details = str(e)
        print(f"Error in compare_responses endpoint: {error_details}")
        print(traceback.format_exc())
        return StandardResponse(
            status_code=500,
            status=False,
            message=f"Internal server error: {error_details}",
            path="/api/compare",
            data={}
        )


@app.get("/api/demo-queries", response_model=StandardResponse)
async def get_demo_queries():
    """Get the list of demo queries from configuration."""
    return StandardResponse(
        status_code=200,
        status=True,
        message="Demo queries retrieved successfully",
        path="/api/demo-queries",
        data={"queries": DEMO_QUERIES}
    )


@app.get("/api/health", response_model=StandardResponse)
async def health_check():
    """Health check endpoint."""
    try:
        # Try to initialize Parlant to check if backend is ready
        await initialize_parlant()
        return StandardResponse(
            status_code=200,
            status=True,
            message="Service is healthy",
            path="/api/health",
            data={
                "initialized": True,
                "parlant_ready": True,
                "error": None
            }
        )
    except Exception as e:
        error_msg = str(e)
        print(f"Health check error: {error_msg}")
        return StandardResponse(
            status_code=503,
            status=False,
            message="Service is unhealthy",
            path="/api/health",
            data={
                "initialized": False,
                "parlant_ready": False,
                "error": error_msg
            }
        )


@app.get("/", response_model=StandardResponse)
async def root():
    """API root endpoint."""
    return StandardResponse(
        status_code=200,
        status=True,
        message="Parlant Comparison API is running",
        path="/",
        data={
            "api_name": "Parlant Comparison API",
            "version": "1.0.0",
            "status": "running"
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    api_url = f"http://localhost:{API_PORT}"
    
    print("🚀 Starting FastAPI server...")
    print(f"📡 API will be available at {api_url}/api")
    print(f"📚 API docs available at {api_url}/docs")
    print(f"🌐 Next.js frontend should run on http://localhost:{FRONTEND_PORT}")
    print("⚠️  Make sure parlant_agent_server.py is running first!")
    
    # Use import string format for reload to work properly
    uvicorn.run(
        "api_server:app",
        host=API_HOST,
        port=API_PORT,
        reload=True,
        log_level="info"
    )
