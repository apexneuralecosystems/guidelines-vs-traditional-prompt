# CORS Configuration Guide

## Overview

The backend FastAPI server is configured to allow Cross-Origin Resource Sharing (CORS) requests from specified frontend domains. This is essential for production deployments where the frontend and backend are hosted on different domains.

## Configuration

### Environment Variable: `CORS_ORIGINS`

Set this in your `backend/.env` file to specify which origins are allowed to make requests to your API.

### Format

Comma-separated list of URLs (no spaces around commas, or they will be stripped):

```
CORS_ORIGINS=https://example.com,https://www.example.com,https://app.example.com
```

## Examples

### Development (Local)
```env
# Option 1: Leave empty - defaults to FRONTEND_URL (http://localhost:3300)
CORS_ORIGINS=

# Option 2: Explicitly set localhost
CORS_ORIGINS=http://localhost:3300
```

### Production (Single Domain)
```env
CORS_ORIGINS=https://yourdomain.com
```

### Production (Multiple Domains)
```env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

### Production (Multiple Environments)
```env
# Allow both staging and production
CORS_ORIGINS=https://staging.yourdomain.com,https://yourdomain.com,https://www.yourdomain.com
```

## How It Works

1. **If `CORS_ORIGINS` is not set or empty:**
   - Defaults to `FRONTEND_URL` (typically `http://localhost:3300` for development)

2. **If `CORS_ORIGINS` is set:**
   - Uses the specified origins
   - Multiple origins can be specified (comma-separated)
   - Each origin is trimmed of whitespace

3. **CORS Middleware Settings:**
   - `allow_origins`: List of allowed origins (from `CORS_ORIGINS`)
   - `allow_credentials`: `True` (allows cookies/auth headers)
   - `allow_methods`: `["*"]` (allows all HTTP methods)
   - `allow_headers`: `["*"]` (allows all headers)

## Setup Instructions

### Step 1: Update `.env` File

```bash
cd backend
cp env.example .env
# Edit .env and add your production frontend URL(s)
```

### Step 2: Set CORS_ORIGINS

**For Development:**
```env
CORS_ORIGINS=http://localhost:3300
```

**For Production:**
```env
CORS_ORIGINS=https://your-production-domain.com
```

### Step 3: Restart Backend Server

After updating `.env`, restart your FastAPI server:

```bash
cd backend
uv run api_server.py
```

## Verification

### Test CORS Configuration

1. **Check CORS Headers:**
   ```bash
   curl -H "Origin: https://yourdomain.com" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        http://your-api-domain.com/api/health \
        -v
   ```

2. **Expected Response Headers:**
   ```
   Access-Control-Allow-Origin: https://yourdomain.com
   Access-Control-Allow-Credentials: true
   Access-Control-Allow-Methods: *
   Access-Control-Allow-Headers: *
   ```

### Browser Console Check

Open your browser's developer console on your frontend and check for CORS errors:

- ✅ **No CORS errors** = Configuration is correct
- ❌ **CORS error** = Check that your frontend URL is in `CORS_ORIGINS`

## Common Issues

### Issue: "Access to fetch has been blocked by CORS policy"

**Solution:**
1. Verify your frontend URL is in `CORS_ORIGINS`
2. Ensure the URL matches exactly (including `http://` vs `https://`, trailing slashes, etc.)
3. Restart the backend server after changing `.env`

### Issue: "Credentials mode is 'include' but Access-Control-Allow-Credentials is 'false'"

**Solution:**
- This shouldn't happen as `allow_credentials=True` is set
- If it does, check that your origin is in the allowed list

### Issue: Multiple domains not working

**Solution:**
- Ensure comma-separated format is correct
- No spaces around commas (they will be stripped automatically)
- Each URL should be a complete URL with protocol (`http://` or `https://`)

## Security Best Practices

1. **Never use `*` in production** - Always specify exact domains
2. **Use HTTPS in production** - Always use `https://` for production URLs
3. **Limit origins** - Only include domains that actually need access
4. **Review regularly** - Remove unused origins periodically

## Code Reference

The CORS configuration is handled in:
- `backend/config.py` - Parses `CORS_ORIGINS` environment variable
- `backend/api_server.py` - Applies CORS middleware with configured origins

## Example Production Configuration

```env
# backend/.env (production)

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-your-production-key

# FastAPI Server
API_PORT=5000
API_HOST=0.0.0.0

# Frontend
FRONTEND_URL=https://yourdomain.com
FRONTEND_PORT=3300

# CORS - Allow production frontend
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Parlant
PARLANT_BASE_URL=http://127.0.0.1:8800
```

