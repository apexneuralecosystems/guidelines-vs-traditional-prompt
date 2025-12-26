# Parlant Agent Server

This directory contains the Parlant agent server code, separate from the FastAPI backend for better production deployment.

## Setup

### Install Dependencies

```bash
cd parlant
uv sync
```

### Configure Environment

```bash
cp env.example .env
# Edit .env and add your API key and configuration
```

**Configuration Options:**

1. **Use OpenRouter (recommended - access to multiple models):**
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key-here
   # OPENAI_BASE_URL will default to https://openrouter.ai/api/v1 automatically
   ```

2. **Use OpenAI directly:**
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   # Leave OPENAI_BASE_URL empty or omit it
   ```

**Note:** 
- If `OPENROUTER_API_KEY` is set, Parlant will automatically use OpenRouter
- If only `OPENAI_API_KEY` is set, Parlant will use OpenAI directly
- The OpenAI SDK (used internally by Parlant) respects the `OPENAI_BASE_URL` environment variable

## Running the Server

### Development

```bash
cd parlant
uv run parlant_agent_server.py
```

### Production (PM2)

The server is configured in the root `ecosystem.config.cjs` file.

```bash
pm2 start parlant-agent
```

## Files

- `parlant_agent_server.py` - Main Parlant agent server with tools and guidelines
- `parlant_client_utils.py` - Client utilities for connecting to Parlant server
- `parlant-data/` - Runtime data directory (agent_id.txt, sessions, cache)
- `pyproject.toml` - Python dependencies for Parlant
- `env.example` - Environment variables template

## Agent ID

The agent ID is saved to `parlant-data/agent_id.txt` when the server starts. This file is used by the FastAPI backend to connect to the agent.

