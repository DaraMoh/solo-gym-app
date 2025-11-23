# Multi-stage build for production deployment
# This is an alternative single Dockerfile approach
# Use docker-compose.yaml for local development

FROM postgres:16-alpine AS postgres-base

FROM python:3.11-slim AS backend
WORKDIR /app
RUN apt-get update && apt-get install -y gcc postgresql-client && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM node:20-alpine AS mobile
WORKDIR /app
RUN npm install -g expo-cli
COPY mobile/package.json ./
RUN npm install
COPY mobile/ .
EXPOSE 8081 19000 19001 19002
CMD ["npx", "expo", "start"]
