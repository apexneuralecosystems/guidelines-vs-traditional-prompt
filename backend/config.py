"""Configuration file for the application."""
import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
API_PORT = int(os.getenv('API_PORT', '5000'))
API_HOST = os.getenv('API_HOST', '0.0.0.0')

# Frontend Configuration
FRONTEND_PORT = os.getenv('FRONTEND_PORT', '3300')
FRONTEND_URL = os.getenv('FRONTEND_URL', f'http://localhost:{FRONTEND_PORT}')

# CORS Configuration
# Comma-separated list of allowed origins (e.g., "http://localhost:3300,https://example.com")
# If CORS_ORIGINS is not set, defaults to FRONTEND_URL
# Use "*" for development only (not recommended for production)
CORS_ORIGINS_ENV = os.getenv('CORS_ORIGINS')
if CORS_ORIGINS_ENV:
    # Split by comma and strip whitespace
    CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_ENV.split(',') if origin.strip()]
else:
    # Default to FRONTEND_URL for development
    CORS_ORIGINS = [FRONTEND_URL]

# Parlant Configuration
PARLANT_BASE_URL = os.getenv('PARLANT_BASE_URL', 'http://127.0.0.1:8800')

# OpenRouter Configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_MODEL = os.getenv('OPENROUTER_MODEL', 'openai/gpt-4')
OPENROUTER_HTTP_REFERER = os.getenv('OPENROUTER_HTTP_REFERER', 'https://github.com/yourusername/yourproject')
OPENROUTER_X_TITLE = os.getenv('OPENROUTER_X_TITLE', 'Life Insurance Comparison Demo')

# Demo Queries - Can be overridden via environment variable (JSON format)
# Or use default queries below
DEFAULT_DEMO_QUERIES = [
    "I want to replace my existing $500k term policy with a whole life policy. What should I do?",
    "I'm 35 years old, make $80,000 a year, and have 2 kids. How much life insurance coverage should I get?",
    "I have diabetes. Will this affect my life insurance rates?",
    "I'm really confused about insurance. My car got totaled last week and I need to file a claim, but I also want to know about life insurance for my business, and my wife is asking about health insurance options. Can you help me with all of this?",
    "I'm thinking about getting life insurance but I'm not sure if I should. I'm 30 years old, healthy, and make $60,000 a year. I don't really want to spend a lot on premiums, but I also want to make sure my family is protected. What do you think I should do?",
]

DEMO_QUERIES_ENV = os.getenv('DEMO_QUERIES')
if DEMO_QUERIES_ENV:
    import json
    try:
        DEMO_QUERIES = json.loads(DEMO_QUERIES_ENV)
    except json.JSONDecodeError:
        DEMO_QUERIES = DEFAULT_DEMO_QUERIES
else:
    DEMO_QUERIES = DEFAULT_DEMO_QUERIES

