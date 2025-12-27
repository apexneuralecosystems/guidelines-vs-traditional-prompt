FROM python:3.11-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Copy dependency files
COPY pyproject.toml .
COPY requirements.txt .

# Copy lock file if it exists
COPY uv.lock* .

# Install dependencies
RUN uv sync --frozen || uv pip install -r requirements.txt

# Copy application code
COPY . .

# Create data directory
RUN mkdir -p parlant-data

# Expose port
EXPOSE 8001

# Run the server
CMD ["uv", "run", "parlant_agent_server.py"]
