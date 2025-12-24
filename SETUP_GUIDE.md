# Complete Setup Guide - Step by Step

This guide will walk you through setting up and running the Parlant vs Traditional LLM comparison project from scratch.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Python 3.12+** installed
- [ ] **Node.js 18+** and npm installed
- [ ] **`uv` package manager** installed ([Install uv](https://github.com/astral-sh/uv))
- [ ] **OpenRouter API key** (get one from [OpenRouter](https://openrouter.ai/keys))

---

## Step 1: Verify Prerequisites

### Check Python Version
```bash
python --version
# Should show Python 3.12 or higher
```

### Check Node.js Version
```bash
node --version
# Should show v18 or higher
npm --version
```

### Check if `uv` is Installed
```bash
uv --version
```

If `uv` is not installed:
```bash
# On Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# On macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## Step 2: Clone/Navigate to Project

```bash
cd guidelines-vs-traditional-prompt
```

---

## Step 3: Backend Setup

### 3.1 Navigate to Backend Directory
```bash
cd backend
```

### 3.2 Install Python Dependencies
```bash
uv sync
```

This will:
- Create a virtual environment
- Install all required packages (FastAPI, Parlant, OpenAI SDK, etc.)

### 3.3 Set Up Environment Variables

**Copy the example environment file:**
```bash
cp env.example .env
```

**Edit `.env` file and add your OpenRouter API key:**
```bash
# On Windows (use notepad or your preferred editor)
notepad .env

# On macOS/Linux
nano .env
# or
code .env
```

**Update the `.env` file:**
```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-openrouter-api-key-here

# Optional: Choose a model (default: openai/gpt-4)
# See https://openrouter.ai/models for available models
OPENROUTER_MODEL=openai/gpt-4

# Optional: Customize these if needed
API_PORT=5000
API_HOST=0.0.0.0
FRONTEND_PORT=3300
PARLANT_BASE_URL=http://127.0.0.1:8800
```

**Save the file.**

---

## Step 4: Frontend Setup

### 4.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

### 4.2 Install Node.js Dependencies
```bash
npm install
```

This will install:
- Next.js
- React
- TypeScript
- All other frontend dependencies

### 4.3 Set Up Frontend Environment Variables (Optional)

**Copy the example environment file:**
```bash
cp env.example .env.local
```

**Edit `.env.local` if you need to change the API URL:**
```bash
# Usually you don't need to change this
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Step 5: Running the Project

You need **3 terminal windows** open simultaneously.

### Terminal 1: Start Parlant Agent Server

```bash
cd backend
uv run parlant_agent_server.py
```

**Expected output:**
```
Parlant server version 3.0.2
Using home directory '.../backend/parlant-data'
Initialized OpenRouter Service
...
Server is ready for some serious action
Try the Sandbox UI at http://localhost:8800
```

**✅ Keep this terminal running!** Don't close it.

---

### Terminal 2: Start FastAPI Backend Server

**Open a NEW terminal window:**
```bash
cd backend
uv run api_server.py
```

**Expected output:**
```
🚀 Starting FastAPI server...
📡 API will be available at http://localhost:5000/api
📚 API docs available at http://localhost:5000/docs
🌐 Next.js frontend should run on http://localhost:3300
⚠️  Make sure parlant_agent_server.py is running first!
INFO:     Uvicorn running on http://0.0.0.0:5000
```

**✅ Keep this terminal running!** Don't close it.

**Optional:** Visit `http://localhost:5000/docs` to see the interactive API documentation.

---

### Terminal 3: Start Next.js Frontend

**Open a NEW terminal window:**
```bash
cd frontend
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3300, url: http://localhost:3300
- event compiled client and server successfully
```

**✅ Keep this terminal running!** Don't close it.

---

## Step 6: Access the Application

### Open Your Browser

Navigate to: **http://localhost:3300**

You should see:
- Landing page with hero section
- Features section
- "Try the Demo" button

### Test the Application

1. Click **"Try the Demo"** or navigate to **http://localhost:3300/demo**
2. Enter a query or click **"Load Demo Queries"**
3. Click **"Compare Responses"**
4. Wait for results to appear

---

## Step 7: Verify Everything is Working

### Check All Services

1. **Parlant Server** (Terminal 1): Should show "Server is ready"
2. **FastAPI Server** (Terminal 2): Should show "Uvicorn running"
3. **Next.js Frontend** (Terminal 3): Should show "ready started server"
4. **Browser**: Should load the landing page

### Test API Endpoints

Visit these URLs to verify:

- **API Root**: http://localhost:5000/
- **API Docs**: http://localhost:5000/docs
- **Health Check**: http://localhost:5000/api/health
- **Demo Queries**: http://localhost:5000/api/demo-queries

---

## Troubleshooting

### Problem: "uv: command not found"
**Solution:** Install `uv` (see Step 1)

### Problem: "Python version not 3.12+"
**Solution:** Install Python 3.12 or higher from [python.org](https://www.python.org/downloads/)

### Problem: "OPENROUTER_API_KEY not found"
**Solution:** Make sure you created `.env` file in `backend/` directory with your OpenRouter API key

### Problem: "agent_id.txt not found"
**Solution:** Make sure Terminal 1 (parlant_agent_server.py) is running first

### Problem: "Cannot connect to API server"
**Solution:** 
- Check Terminal 2 is running
- Verify API is accessible at http://localhost:5000/api/health
- Check firewall settings

### Problem: "Port 5000 already in use"
**Solution:** 
- Change `API_PORT` in `backend/.env` to a different port (e.g., 5001)
- Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to match

### Problem: "Port 3300 already in use"
**Solution:** 
- Change `FRONTEND_PORT` in `backend/.env`
- Update `package.json` scripts in `frontend/` to use different port

### Problem: "npm install fails"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Reference: All Commands

### Initial Setup (One Time)
```bash
# Backend
cd backend
uv sync
cp env.example .env
# Edit .env and add OPENROUTER_API_KEY

# Frontend
cd frontend
npm install
cp env.example .env.local
```

### Running the Project (Every Time)
```bash
# Terminal 1
cd backend
uv run parlant_agent_server.py

# Terminal 2
cd backend
uv run api_server.py

# Terminal 3
cd frontend
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3300
- **API Docs**: http://localhost:5000/docs
- **API Health**: http://localhost:5000/api/health

---

## Alternative: Command Line Demo

If you just want to see the comparison without the web interface:

**Terminal 1:**
```bash
cd backend
uv run parlant_agent_server.py
```

**Terminal 2:**
```bash
cd backend
uv run demo_comparison.py
```

This will run all 5 demo queries and display results in a formatted table in the terminal.

---

## Next Steps

Once everything is running:
1. Try different queries in the demo
2. Explore the API documentation at http://localhost:5000/docs
3. Check the comparison results to see the differences between approaches
4. Review the reasoning section to see which guidelines and tools were used

---

## Need Help?

- Check the main [README.md](README.md) for more details
- Review [COMPARISON.md](COMPARISON.md) to understand the differences
- Check backend logs in Terminal 2 for API errors
- Check frontend logs in Terminal 3 for frontend errors

