FROM python:3.11-slim

WORKDIR /app

# Install package and dependencies
COPY pyproject.toml requirements.txt ./
COPY src/ ./src/

RUN pip install --no-cache-dir .

# PORT is injected at runtime by Railway
ENV HOST=0.0.0.0

CMD ["x-search-mcp-server-http"]
