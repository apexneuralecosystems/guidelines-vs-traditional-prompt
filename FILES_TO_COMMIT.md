# Files to Commit for Production

## Quick Checklist ✅

### Must Commit (Essential for Production)

**Parlant:**
- ✅ All `.py` files (parlant_agent_server.py, parlant_client_utils.py)
- ✅ `pyproject.toml` (Parlant dependencies)
- ✅ `requirements.txt` (alternative dependency file)
- ✅ `env.example` (Parlant environment template)
- ✅ `README.md` (Parlant documentation)

**Backend:**
- ✅ All `.py` files (source code)
- ✅ `pyproject.toml` (dependencies)
- ✅ `uv.lock` (lock file for reproducible builds)
- ✅ `requirements.txt` (alternative dependency file)
- ✅ `env.example` (environment template)
- ✅ `.python-version` (if exists)

**Frontend:**
- ✅ `app/` directory (all React/Next.js files)
- ✅ `package.json` (dependencies)
- ✅ `package-lock.json` (lock file - **MUST commit**)
- ✅ `next.config.js` (Next.js config)
- ✅ `tsconfig.json` (TypeScript config)
- ✅ `env.example` (environment template)
- ✅ `README.md` (documentation)

**Root:**
- ✅ `README.md`
- ✅ `SETUP_GUIDE.md`
- ✅ `PRODUCTION_DEPLOYMENT.md`
- ✅ `COMPARISON.md`
- ✅ `.gitignore` files

### Must NOT Commit (Already Ignored)

**Sensitive:**
- ❌ `.env` files (any location)
- ❌ `.env.local` files
- ❌ Any file containing API keys

**Generated:**
- ❌ `__pycache__/`
- ❌ `.venv/`
- ❌ `node_modules/`
- ❌ `.next/`
- ❌ `parlant/parlant-data/`
- ❌ `backend/parlant-data/` (old location, if exists)
- ❌ `*.log` files

## Quick Verification Command

```bash
# Check what will be committed
git status

# Verify no .env files
git ls-files | grep -E "\.env$"

# Should return nothing (no .env files)
```

## See Full Details

For complete deployment instructions, see [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)

