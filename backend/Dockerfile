# Python ka lightweight version
FROM python:3.11-slim

WORKDIR /app

# System requirements for PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Dependencies install karein
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Pura backend ka code copy karein
COPY . .

EXPOSE 5000

# Production server run karne ki command
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]