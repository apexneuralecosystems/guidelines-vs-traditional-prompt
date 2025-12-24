# Frontend - Next.js React Application

This is the Next.js frontend for the Parlant vs Traditional LLM comparison demo.

## Getting Started

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3300](http://localhost:3300) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx         # Landing page
│   ├── demo/
│   │   └── page.tsx     # Demo page
│   └── globals.css      # Global styles
├── package.json
├── next.config.js       # Next.js configuration
└── tsconfig.json        # TypeScript configuration
```

## API Configuration

The frontend connects to the FastAPI backend API. The API URL is configured via `NEXT_PUBLIC_API_URL` environment variable (default: `http://localhost:5000`).
The API routes are proxied through Next.js rewrites (see `next.config.js`).

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000)

Make sure the FastAPI backend is running before using the frontend.

