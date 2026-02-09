# 환경 및 구성 가이드

이 가이드는 모청 백엔드 실행을 위한 환경 변수와 구성을 설명합니다.

## 목차

1. [환경 변수](#환경-변수)
2. [로컬 개발 설정](#로컬-개발-설정)
3. [Docker 서비스](#docker-서비스)
4. [포트 구성](#포트-구성)

## 환경 변수

### 공통 변수

프로젝트 루트에 `.env` 파일 생성:

```bash
# API 키
OPENAI_API_KEY=your-openai-api-key-here
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your-s3-bucket-name
KAKAO_MAP_API_KEY=your-kakao-map-api-key
PORTONE_IMP_KEY=your-portone-imp-key
PORTONE_SECRET_KEY=your-portone-secret-key

# 데이터베이스
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

# 애플리케이션
NODE_ENV=development
PORT=3002
```

## 로컬 개발 설정

### 필수 조건

- Node.js 18+
- Python 3.13+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### 서비스 시작

1. **Docker 서비스 시작**:
```bash
docker-compose up -d postgres redis agent-server celery-worker
```

2. **NestJS 백엔드 시작**:
```bash
cd backend
npm install
npm run start:dev
```

3. **서비스 확인**:
```bash
# 백엔드 헬스
curl http://localhost:3002/api

# Agent Manager 헬스
curl http://localhost:8000/health
```

## Docker 서비스

### 서비스 개요

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

## 포트 구성

| 서비스 | 내부 포트 | 외부 포트 |
|---------|---------------|---------------|
| UI | 3000 | 3001 |
| Backend | 3000 | 3002 |
| Agent Manager | 8000 | 8000 |
| PostgreSQL | 5432 | 5432 |
| Redis | 6379 | 6379 |

## 다음 단계

- [08-debugging-ko.md](./08-debugging-ko.md) - 문제 해결 가이드
