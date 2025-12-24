# Parlant Guidelines vs Traditional LLM Prompt: Life Insurance Agent Demo


This project demonstrates the advantages of **Parlant's structured approach** over traditional monolithic LLM prompts for building conversational agents.

## 📖 Complete Setup Guide

**New to this project?** See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed step-by-step instructions.

## Setup

**Backend:**
```bash
cd backend
uv sync  # Install Python dependencies
```

**Frontend:**
```bash
cd frontend
npm install  # Install Node.js dependencies
```

**Note:** 
- Backend commands should be run from the `backend/` directory
- Frontend commands should be run from the `frontend/` directory

## Requirements

- Python 3.12+ (required for Parlant)
- `uv` package manager
- Node.js 18+ and npm/yarn/pnpm
- OpenRouter API key in `backend/.env` file (get one from https://openrouter.ai/keys)

**Setup environment variables:**

**Backend:**
```bash
cd backend
cp env.example .env
# Edit .env and add your OPENROUTER_API_KEY
# Optionally customize: OPENROUTER_MODEL, API_PORT, FRONTEND_PORT, PARLANT_BASE_URL
```

**Frontend:**
```bash
cd frontend
cp env.example .env.local
# Edit .env.local if you need to change API_URL (default: http://localhost:5000)
```

**Environment Variables:**
- `OPENROUTER_API_KEY` (required) - Your OpenRouter API key (get from https://openrouter.ai/keys)
- `OPENROUTER_MODEL` (default: openai/gpt-4) - Model to use via OpenRouter (see https://openrouter.ai/models)
- `API_PORT` (default: 5000) - FastAPI server port
- `FRONTEND_PORT` (default: 3300) - Next.js frontend port
- `PARLANT_BASE_URL` (default: http://127.0.0.1:8800) - Parlant server URL
- `NEXT_PUBLIC_API_URL` (default: http://localhost:5000) - Backend API URL for frontend


## Quick Start

### Option 1: Web Frontend (Recommended)

**Terminal 1 - Start the Parlant agent server:**
```bash
cd backend
uv run parlant_agent_server.py
```

**Terminal 2 - Start the FastAPI server:**
```bash
cd backend
uv run api_server.py
```

**Terminal 3 - Start the Next.js frontend:**
```bash
cd frontend
npm install  # First time only
npm run dev
```

**Open your browser:**
Navigate to `http://localhost:3300` to access the web interface.

### Option 2: Command Line Demo

**Terminal 1 - Start the server:**
```bash
cd backend
uv run parlant_agent_server.py
```

**Terminal 2 - Run the comparison:**
```bash
cd backend
uv run demo_comparison.py
```

## Demo Queries

The demo tests 5 realistic scenarios:
- Policy replacement with critical warnings
- Coverage calculation with specific parameters  
- Health condition impact assessment
- Mixed topics with boundary maintenance
- Decision making with conflicting rules

## Project Structure

```
guidelines-vs-traditional-prompt/
├── backend/                      # Backend Python code
│   ├── parlant_agent_server.py  # Parlant agent with tools & guidelines
│   ├── api_server.py            # FastAPI server for frontend
│   ├── demo_comparison.py        # Main comparison demo runner
│   ├── traditional_llm_prompt.py # Monolithic prompt approach
│   ├── parlant_client_utils.py  # Parlant API client utilities
│   ├── rich_table_formatter.py  # Beautiful console table rendering
│   ├── pyproject.toml           # Project dependencies (uv)
│   ├── uv.lock                  # Dependency lock file (uv)
│   ├── .python-version          # Python version specification
│   ├── .venv/                   # Virtual environment
│   ├── .env                     # Environment variables (API keys)
│   ├── .env.example             # Example environment file
│   ├── parlant-data/            # Parlant session data (generated)
│   └── __pycache__/             # Python bytecode cache
├── frontend/                     # Next.js React frontend
│   ├── app/                     # Next.js app directory
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── demo/page.tsx       # Demo page
│   │   └── globals.css         # Global styles
│   ├── package.json            # Node.js dependencies
│   └── next.config.js          # Next.js configuration
└── README.md                    # This file
```



