# Multi-stage production Dockerfile for Railway
FROM python:3.11-slim

# Set environment flags
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

# Install minimal system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy application source code
COPY . .

# Expose port (Railway overrides PORT via environment variable)
EXPOSE 8000

# Run FastAPI via Uvicorn using the dynamic PORT provided by Railway
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
