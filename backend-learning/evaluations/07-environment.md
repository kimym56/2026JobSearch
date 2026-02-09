# Environment & Configuration Guide

This guide explains the environment variables and configuration for running the Mocheong backend.

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Local Development Setup](#local-development-setup)
3. [Docker Services](#docker-services)
4. [Port Configurations](#port-configurations)

## Environment Variables

### Common Variables

Create a `.env` file in the project root:

```bash
# API Keys
OPENAI_API_KEY=your-openai-api-key-here
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your-s3-bucket-name
KAKAO_MAP_API_KEY=your-kakao-map-api-key
PORTONE_IMP_KEY=your-portone-imp-key
PORTONE_SECRET_KEY=your-portone-secret-key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-db-password
DB_DATABASE=mocheong_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Agent Manager
AGENT_MGR_URL=http://agent-server:8000

# Application
NODE_ENV=development
PORT=3002
```

## Local Development Setup

### Prerequisites

- Node.js 18+
- Python 3.13+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Starting Services

1. **Start Docker services**:
```bash
docker-compose up -d postgres redis agent-server celery-worker
```

2. **Start NestJS backend**:
```bash
cd backend
npm install
npm run start:dev
```

3. **Verify services**:
```bash
# Backend health
curl http://localhost:3002/api

# Agent Manager health
curl http://localhost:8000/health
```

## Docker Services

### Service Overview

```yaml
services:
  postgres:
    image: postgres:15-alpine
    port: 5432
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    port: 6379
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    port: 3002:3000
    depends_on:
      - postgres
      - redis
      - agent-server

  agent-server:
    build: ./agent_mgr
    port: 8000
    depends_on:
      - redis

  celery-worker:
    build: ./agent_mgr
    depends_on:
      - redis
      - agent-server
```

## Port Configurations

| Service | Internal Port | External Port |
|---------|---------------|---------------|
| UI | 3000 | 3001 |
| Backend | 3000 | 3002 |
| Agent Manager | 8000 | 8000 |
| PostgreSQL | 5432 | 5432 |
| Redis | 6379 | 6379 |

## Next Steps

- [08-debugging.md](./08-debugging.md) - Troubleshooting guide
