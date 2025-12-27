FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml requirements.txt ./
RUN pip install --no-cache-dir uvicorn
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p parlant-data

EXPOSE 8001

CMD ["uvicorn", "parlant_agent_server:app", "--host", "0.0.0.0", "--port", "8001"]
