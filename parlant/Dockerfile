FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directory for persistent data
RUN mkdir -p parlant-data

# Expose the port your server will use
EXPOSE 8001

# Run the Parlant agent (use Python instead of uvicorn)
CMD ["python", "parlant_agent_server.py"]
