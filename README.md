# Parlant Guidelines vs Traditional LLM Prompt: Life Insurance Agent Demo

This project demonstrates the advantages of **Parlant's structured approach** over traditional monolithic LLM prompts for building conversational agents.

## Quick Start

### Option 1: Web Frontend (Recommended)

**Terminal 1 - Start the Parlant agent server:**
```bash
uv run parlant_agent_server.py
```

**Terminal 2 - Start the Flask API server (serves both API and frontend):**
```bash
uv run api_server.py
```

**Open your browser:**
Navigate to `http://localhost:5000` to access the web interface.

### Option 2: Command Line Demo

**Terminal 1 - Start the server:**
```bash
uv run parlant_agent_server.py
```

**Terminal 2 - Run the comparison:**
```bash
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
parlant-conversational-agent/
├── parlant_agent_server.py      # Parlant agent with tools & guidelines
├── api_server.py                # Flask API server for frontend
├── demo_comparison.py            # Main comparison demo runner
├── traditional_llm_prompt.py     # Monolithic prompt approach
├── parlant_client_utils.py      # Parlant API client utilities
├── rich_table_formatter.py      # Beautiful console table rendering
├── static/                      # Frontend files
│   ├── index.html               # Main HTML page
│   ├── styles.css               # Styling
│   └── app.js                   # Frontend JavaScript
└── pyproject.toml               # Project dependencies (uv)
```

## Setup

```bash
uv sync  # Install dependencies
```

## Requirements

- Python 3.10+ (required for Parlant)
- `uv` package manager
- OpenAI API key in `.env` file


