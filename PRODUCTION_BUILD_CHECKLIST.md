# Production Build Checklist

## ✅ Will `npm run build` work?

**Yes, but you need to fix one issue first and ensure proper configuration.**

## 🔧 Issues Found & Fixed

### 1. Environment Variable Inconsistency (FIXED)
- **Issue:** `demo/page.tsx` was using `NEXT_PUBLIC_API_BASE_URL` but config uses `NEXT_PUBLIC_API_URL`
- **Status:** ✅ Fixed - Now uses consistent `NEXT_PUBLIC_API_URL`

## 📋 Pre-Build Checklist

### Required Before Building

1. **Environment Variables**
   ```bash
   # Create .env.local in frontend/ directory
   cd frontend
   cp env.example .env.local
   # Edit .env.local and set:
   NEXT_PUBLIC_API_URL=https://your-production-api-url.com
   ```

2. **Dependencies Installed**
   ```bash
   cd frontend
   npm install
   # or
   npm ci  # For production (uses package-lock.json)
   ```

3. **TypeScript Configuration**
   - ✅ `tsconfig.json` is properly configured
   - ✅ All TypeScript files compile without errors

4. **Next.js Configuration**
   - ✅ `next.config.js` is properly set up
   - ✅ API rewrites are configured correctly

## 🚀 Build Process

### Development Build Test
```bash
cd frontend
npm run build
```

### Production Build
```bash
cd frontend
# Set production environment variable
export NEXT_PUBLIC_API_URL=https://your-api-domain.com
# or create .env.production file
npm run build
```

### Start Production Server
```bash
npm run start
# Runs on port 3300 (or PORT env variable)
```

## ⚠️ Important Production Considerations

### 1. Environment Variables
- **Build Time:** `NEXT_PUBLIC_*` variables are embedded at build time
- **Runtime:** Cannot change `NEXT_PUBLIC_*` variables after build
- **Solution:** Rebuild if you need to change API URL

### 2. API Rewrites
- Next.js rewrites work in production
- Ensure `NEXT_PUBLIC_API_URL` points to your production backend
- Backend must be accessible from where Next.js is hosted

### 3. CORS Configuration
- Backend FastAPI must allow requests from your frontend domain
- Update `backend/api_server.py` CORS settings for production:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["https://your-frontend-domain.com"],  # Production URL
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

### 4. Static Export (Optional)
If you need a fully static site:
```bash
# In next.config.js, add:
output: 'export'
# Then build:
npm run build
```

## 🐛 Common Build Issues

### Issue: "Module not found"
**Solution:** Run `npm install` to ensure all dependencies are installed

### Issue: "Type errors"
**Solution:** Fix TypeScript errors or adjust `tsconfig.json` strictness

### Issue: "Environment variable not found"
**Solution:** 
- Ensure `.env.local` exists in `frontend/` directory
- Variables must start with `NEXT_PUBLIC_` to be available in browser
- Rebuild after changing environment variables

### Issue: "API calls fail in production"
**Solution:**
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is running and accessible
- Check CORS settings on backend
- Verify network/firewall allows connections

## ✅ Build Verification

After building, verify:

1. **Build Output**
   ```bash
   ls -la .next/  # Should contain build files
   ```

2. **Test Production Build Locally**
   ```bash
   npm run start
   # Visit http://localhost:3300
   # Test API calls work
   ```

3. **Check Bundle Size**
   ```bash
   npm run build
   # Check output for bundle sizes
   # Optimize if bundles are too large
   ```

## 📦 Production Deployment

### Option 1: Node.js Server
```bash
npm run build
npm run start
# Runs Next.js production server
```

### Option 2: Static Export (if applicable)
```bash
# Configure next.config.js for static export
npm run build
# Deploy .next/out/ directory
```

### Option 3: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3300
CMD ["npm", "start"]
```

## 🔍 Final Checklist

Before deploying to production:

- [ ] `npm run build` completes without errors
- [ ] `NEXT_PUBLIC_API_URL` is set to production backend URL
- [ ] Backend CORS allows frontend domain
- [ ] All API endpoints are accessible
- [ ] Test production build locally with `npm run start`
- [ ] Check browser console for errors
- [ ] Verify API calls work in production environment

