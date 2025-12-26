/**
 * PM2 Ecosystem Configuration
 * 
 * This file configures PM2 to run all three servers:
 * 1. Parlant Agent Server (Python)
 * 2. FastAPI Backend Server (Python)
 * 3. Next.js Frontend Server (Node.js)
 * 
 * Usage:
 *   pm2 start ecosystem.config.cjs
 *   pm2 stop ecosystem.config.cjs
 *   pm2 restart ecosystem.config.cjs
 *   pm2 delete ecosystem.config.cjs
 *   pm2 logs
 *   pm2 status
 */

module.exports = {
  apps: [
    {
      name: 'parlant-agent',
      script: 'uv',
      args: 'run parlant_agent_server.py',
      cwd: './parlant',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/parlant-agent-error.log',
      out_file: './logs/parlant-agent-out.log',
      log_file: './logs/parlant-agent-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
    },
    {
      name: 'fastapi-backend',
      script: 'uv',
      args: 'run api_server.py',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/fastapi-backend-error.log',
      out_file: './logs/fastapi-backend-out.log',
      log_file: './logs/fastapi-backend-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      wait_ready: true,
      listen_timeout: 10000,
    },
    {
      name: 'nextjs-frontend',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || '3300',
      },
      error_file: './logs/nextjs-frontend-error.log',
      out_file: './logs/nextjs-frontend-out.log',
      log_file: './logs/nextjs-frontend-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
    },
  ],
};

