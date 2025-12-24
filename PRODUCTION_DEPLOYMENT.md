# Production Deployment Guide

This document lists all files that **MUST be committed** to version control for production deployment.

## ✅ Files to COMMIT (Required for Production)

### Root Directory
```
✅ README.md
✅ SETUP_GUIDE.md
✅ PRODUCTION_DEPLOYMENT.md (this file)
✅ COMPARISON.md
✅ .gitignore
✅ guidelines-vs-traditional-prompt.case-study.json (if applicable)
```

### Backend Directory (`backend/`)
```
✅ api_server.py                    # FastAPI server
✅ config.py                        # Configuration module
✅ demo_comparison.py                # CLI demo script
✅ parlant_agent_server.py           # Parlant agent server
✅ parlant_client_utils.py           # Parlant client utilities
✅ traditional_llm_prompt.py         # Traditional LLM implementation
✅ rich_table_formatter.py           # Table formatting utility
✅ pyproject.toml                    # Python project dependencies (uv)
✅ uv.lock                          # Dependency lock file (ensures reproducible builds)
✅ requirements.txt                 # Alternative dependency file
✅ env.example                      # Environment variables template
✅ .python-version                  # Python version specification (if exists)
```

### Frontend Directory (`frontend/`)
```
✅ app/                              # Next.js app directory
   ✅ layout.tsx                    # Root layout
   ✅ page.tsx                      # Landing page
   ✅ demo/page.tsx                 # Demo page
   ✅ globals.css                    # Global styles
✅ package.json                     # Node.js dependencies
✅ package-lock.json                # Dependency lock file (ensures reproducible builds)
✅ next.config.js                   # Next.js configuration
✅ tsconfig.json                    # TypeScript configuration
✅ env.example                      # Environment variables template
✅ README.md                        # Frontend documentation
✅ .gitignore                       # Frontend-specific gitignore

# Note: Old vanilla JS files (index.html, demo.html, app.js, styles.css)
# are from the previous implementation. You can:
# - Keep them for reference (they won't interfere with Next.js)
# - Or remove them if you're fully migrated to Next.js
```

## ❌ Files to IGNORE (Already in .gitignore)

### Sensitive/Secret Files
```
❌ backend/.env                     # Contains API keys - NEVER commit!
❌ frontend/.env.local              # Contains API URLs - NEVER commit!
❌ backend/.env.*.local             # Any local env files
```

### Generated/Runtime Files
```
❌ backend/__pycache__/            # Python bytecode cache
❌ backend/.venv/                   # Virtual environment
❌ backend/parlant-data/            # Runtime Parlant data (sessions, cache, logs)
❌ backend/*.log                    # Log files
❌ backend/*.cache                  # Cache files
❌ frontend/node_modules/           # Node.js dependencies (install via npm)
❌ frontend/.next/                  # Next.js build output
❌ frontend/out/                    # Next.js export output
❌ frontend/.pnp/                   # Yarn PnP files
❌ frontend/.pnp.js                 # Yarn PnP files
```

### Build/Compiled Files
```
❌ backend/build/                   # Build artifacts
❌ backend/dist/                   # Distribution files
❌ frontend/build/                  # Build output
```

### IDE/Editor Files
```
❌ .vscode/                         # VS Code settings
❌ .idea/                           # IntelliJ/PyCharm settings
❌ *.swp, *.swo                    # Vim swap files
```

### OS Files
```
❌ .DS_Store                        # macOS
❌ Thumbs.db                        # Windows
❌ Desktop.ini                      # Windows
```

## 📋 Production Deployment Checklist

### 1. Pre-Deployment Verification

- [ ] All source code files are committed
- [ ] `.env` files are NOT committed (verify with `git status`)
- [ ] `env.example` files ARE committed
- [ ] `package.json` and `pyproject.toml` are committed
- [ ] Lock files (`package-lock.json`, `uv.lock`) are committed
- [ ] No sensitive data in committed files

### 2. Environment Setup on Production Server

**Backend:**
```bash
cd backend
cp env.example .env
# Edit .env with production values:
#   - OPENROUTER_API_KEY (production key)
#   - API_PORT (production port)
#   - API_HOST (0.0.0.0 for external access)
#   - FRONTEND_URL (production frontend URL)
#   - PARLANT_BASE_URL (production Parlant URL)
```

**Frontend:**
```bash
cd frontend
cp env.example .env.local
# Edit .env.local with production values:
#   - NEXT_PUBLIC_API_URL (production backend URL)
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
uv sync  # Installs Python dependencies
```

**Frontend:**
```bash
cd frontend
npm ci  # Installs Node.js dependencies (uses package-lock.json)
```

### 4. Build Frontend (if needed)

```bash
cd frontend
npm run build  # Builds Next.js for production
```

### 5. Start Services

**Terminal 1 - Parlant Agent Server:**
```bash
cd backend
uv run parlant_agent_server.py
```

**Terminal 2 - FastAPI Backend:**
```bash
cd backend
uv run api_server.py
```

**Terminal 3 - Next.js Frontend:**
```bash
cd frontend
npm run start  # Production mode (or npm run dev for development)
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They contain API keys and secrets
2. **Always use `env.example`** - Template files are safe to commit
3. **Use environment variables** - Set secrets via your hosting platform
4. **Review `.gitignore`** - Ensure sensitive files are ignored
5. **Use different API keys** - Separate keys for dev/staging/production

## 📦 What Gets Deployed

When you push to production, the repository should contain:

```
✅ All source code (.py, .tsx, .ts, .js files)
✅ Configuration files (pyproject.toml, package.json, next.config.js, tsconfig.json)
✅ Lock files (uv.lock, package-lock.json)
✅ Documentation (README.md, SETUP_GUIDE.md)
✅ Example environment files (env.example)
✅ .gitignore files
```

**NOT included:**
```
❌ .env files (created on server from env.example)
❌ node_modules (installed via npm ci)
❌ .venv (installed via uv sync)
❌ Build artifacts (generated during build)
❌ Runtime data (parlant-data/, logs, cache)
```

## 🚀 Quick Verification

Before pushing, run:
```bash
# Check what will be committed
git status

# Verify no .env files are staged
git diff --cached | grep -E "\.env$|OPENROUTER_API_KEY|API_KEY"

# List all files that will be committed
git ls-files
```

If you see any `.env` files or API keys in the output, **DO NOT COMMIT** them!

