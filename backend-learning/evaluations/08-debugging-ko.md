# 디버깅 및 문제 해결 가이드

이 가이드는 백엔드 문제를 디버깅하고 해결하는 데 도움을 줍니다.

## 목차

1. [백엔드 로그 읽기](#백엔드-로그-읽기)
2. [일반적인 문제](#일반적인-문제)
3. [백엔드 테스트](#백엔드-테스트)

## 백엔드 로그 읽기

### NestJS 로그

로그는 `backend/logs/`에 저장됩니다:

```bash
# 모든 로그 보기
tail -f backend/logs/combined.log

# 에러 로그 보기
tail -f backend/logs/error.log
```

### Python Agent Manager 로그

```bash
# Celery worker 로그 보기
docker-compose logs -f celery-worker

# Agent Manager 로그 보기
docker-compose logs -f agent-server
```

## 일반적인 문제

### 문제: 데이터베이스에 연결할 수 없음

**증상**: `Connection refused` 에러

**해결책**:
1. PostgreSQL 실행 확인: `docker ps`
2. `.env`의 DB_HOST와 DB_PORT 확인
3. 데이터베이스 존재 확인: `docker exec -it postgres psql -U postgres -c "CREATE DATABASE mocheong_db;"`

### 문제: Socket.IO 연결 실패

**증상**: 프론트엔드가 WebSocket에 연결할 수 없음

**해결책**:
1. JWT 토큰 유효성 확인
2. `chat.gateway.ts`의 CORS 설정 확인
3. Socket.IO 경로 일치 확인: `/chat`

### 문제: Agent Manager 응답 없음

**증상**: 채팅 메시지 시간 초과

**해결책**:
1. Celery worker 실행 확인: `docker-compose ps celery-worker`
2. Redis 연결 확인: `docker-compose logs redis`
3. Agent Manager 헬스 확인: `curl http://localhost:8000/health`

## 백엔드 테스트

### Swagger로 API 테스트

방문: `http://localhost:3002/api/docs`

### 수동 테스트

```bash
# 헬스 테스트
curl http://localhost:3002/api

# 등록 테스트
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 로그인 테스트
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 다음 단계

- [09-glossary-ko.md](./09-glossary-ko.md) - 낯선 용어 찾아보기
