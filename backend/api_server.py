"""FastAPI server to expose backend functionality for frontend."""
import asyncio
import pathlib
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from config import API_PORT, API_HOST, FRONTEND_PORT, FRONTEND_URL, DEMO_QUERIES, CORS_ORIGINS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
from traditional_llm_prompt import call_traditional_llm, TRADITIONAL_HUGE_PROMPT
import sys
import pathlib

# Add parlant directory to path to import parlant_client_utils
parlant_dir = pathlib.Path(__file__).parent.parent / "parlant"
sys.path.insert(0, str(parlant_dir))

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
    import logging
    
    # Log validation error for debugging
    logging.warning(f"Validation error: {str(exc)}")
    print(f"⚠️ Validation error: {str(exc)}")
    
    # Return friendly message to user
    return JSONResponse(
        status_code=422,
        content={
            "status_code": 422,
            "status": False,
            "message": "Invalid request. Please check your input and try again.",
            "path": str(request.url.path),
            "data": {}
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    import logging
    
    # Log detailed error for debugging
    error_details = {
        "error_type": type(exc).__name__,
        "error_message": str(exc),
        "path": str(request.url.path),
        "traceback": traceback.format_exc()
    }
    logging.error(f"Unhandled exception: {error_details}")
    print(f"❌ Unhandled exception: {error_details}")
    print(traceback.format_exc())
    
    # Return friendly message to user
    return JSONResponse(
        status_code=500,
        content={
            "status_code": 500,
            "status": False,
            "message": "An unexpected error occurred. Please try again or contact support if the issue persists.",
            "path": str(request.url.path),
            "data": {}
        }
    )

# Enable CORS for Next.js frontend
# CORS origins are configured via CORS_ORIGINS environment variable (REQUIRED)
# Set CORS_ORIGINS in .env file with comma-separated list of allowed origins
# Example: CORS_ORIGINS=http://localhost:3002,http://127.0.0.1:3002

# Check if CORS_ORIGINS_REGEX is set (optional, for additional flexibility)
import os
cors_regex = os.getenv('CORS_ORIGINS_REGEX')

# Configure CORS middleware
cors_config = {
    "allow_origins": CORS_ORIGINS,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

# Add regex pattern if configured (optional)
if cors_regex:
    cors_config["allow_origin_regex"] = cors_regex
    print(f"🔒 CORS regex pattern enabled: {cors_regex}")

app.add_middleware(
    CORSMiddleware,
    **cors_config
)

# Log CORS configuration on startup
print(f"🔒 CORS enabled for origins: {CORS_ORIGINS}")

# Add middleware to log CORS requests for debugging
@app.middleware("http")
async def log_cors_requests(request, call_next):
    import logging
    origin = request.headers.get("origin")
    if origin:
        logging.info(f"🌐 Request from origin: {origin}")
        print(f"🌐 Request from origin: {origin}")
    response = await call_next(request)
    # Log CORS headers in response
    if origin:
        cors_header = response.headers.get("access-control-allow-origin")
        if cors_header:
            logging.info(f"✅ CORS allowed for origin: {origin}")
            print(f"✅ CORS allowed for origin: {origin}")
    return response

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
    
    try:
        if parlant_client is None:
            parlant_client = await create_parlant_client()
        
        if agent_id is None:
            # parlant-data is now in parlant/ directory (root level)
            parlant_dir = pathlib.Path(__file__).parent.parent / "parlant"
            agent_id_path = parlant_dir / "parlant-data" / "agent_id.txt"
            if not agent_id_path.exists():
                import logging
                logging.error(f"agent_id.txt not found at {agent_id_path}. Parlant server may not be running.")
                raise RuntimeError("Parlant agent server is not initialized. Please start the Parlant agent server first.")
            with open(agent_id_path, "r", encoding="utf-8") as f:
                agent_id = f.read().strip()
        
        return parlant_client, agent_id
    except Exception as e:
        import logging
        import traceback
        logging.error(f"Failed to initialize Parlant: {type(e).__name__}: {str(e)}\n{traceback.format_exc()}")
        print(f"❌ Failed to initialize Parlant: {type(e).__name__}: {str(e)}")
        print(traceback.format_exc())
        raise


@app.post("/api/initialize", response_model=StandardResponse)
async def initialize_assistant():
    """Initialize the assistant and check if documents are processed."""
    try:
        client, agent_id = await initialize_parlant()
        
        # Check if agent_id.txt exists (indicates initialization)
        parlant_dir = pathlib.Path(__file__).parent.parent / "parlant"
        agent_id_path = parlant_dir / "parlant-data" / "agent_id.txt"
        initialized = agent_id_path.exists() and agent_id is not None
        
        # Check for document processing (you can enhance this based on your actual document processing logic)
        parlant_data_dir = parlant_dir / "parlant-data"
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
        import traceback
        import logging
        
        # Log detailed error for debugging
        error_details = {
            "error_type": type(e).__name__,
            "error_message": str(e),
            "traceback": traceback.format_exc()
        }
        logging.error(f"Failed to initialize assistant: {error_details}")
        print(f"❌ Failed to initialize assistant: {error_details}")
        print(traceback.format_exc())
        
        # Return friendly message to user
        return StandardResponse(
            status_code=500,
            status=False,
            message="Unable to initialize the assistant. Please ensure the Parlant agent server is running.",
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
        import logging
        
        # Log detailed error for debugging
        error_details = {
            "error_type": type(e).__name__,
            "error_message": str(e),
            "traceback": traceback.format_exc()
        }
        logging.error(f"Error processing comparison: {error_details}")
        print(f"❌ Error processing comparison: {error_details}")
        print(traceback.format_exc())
        
        # Return friendly message to user
        friendly_message = "Unable to process your query at this time. Please try again or contact support if the issue persists."
        raise HTTPException(status_code=500, detail=friendly_message)


@app.post("/api/compare", response_model=StandardResponse)
async def compare_responses(request: CompareRequest):
    """Compare Traditional LLM vs Parlant agent responses for a given query."""
    try:
        query = request.query.strip()
        
        if not query:
            return StandardResponse(
                status_code=400,
                status=False,
                message="Please enter a query to compare.",
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
    
    # Build API URL from configured host and port
    if API_HOST == "0.0.0.0":
        api_url = f"http://localhost:{API_PORT}"
    else:
        api_url = f"http://{API_HOST}:{API_PORT}"
    
    print("🚀 Starting FastAPI server...")
    print(f"📡 API will be available at {api_url}/api")
    print(f"📚 API docs available at {api_url}/docs")
    print(f"🌐 Next.js frontend should run on {FRONTEND_URL}")
    print("⚠️  Make sure parlant_agent_server.py is running first!")
    
    # Use import string format for reload to work properly
    uvicorn.run(
        "api_server:app",
        host=API_HOST,
        port=API_PORT,
        reload=True,
        log_level="info"
    )
