# 프론트엔드 엔지니어를 위한 백엔드 문서

모청(Mocheong) 백엔드 문서에 오신 것을 환영합니다! 이 가이드는 프론트엔드 엔지니어가 백엔드 아키텍처, API, 데이터 흐름을 이해할 수 있도록 설계되었습니다.

## 목차

1. [빠른 시작](#빠른-start)
2. [읽기 순서](#읽기-순서)
3. [아키텍처 개요](#아키텍처-개요)
4. [주요 기술](#주요-기술)
5. [서비스 포트](#서비스-포트)

## 빠른 시작

### 모청 백엔드란?

모청 백엔드는 **마이크로서비스 아키텍처**로, 두 개의 주요 서비스로 구성됩니다:

1. **NestJS 백엔드** (TypeScript) - REST API, WebSocket, 인증, 파일 업로드, 결제를 처리하는 메인 API 서버
2. **Agent Manager** (Python/FastAPI) - 지능적인 대화를 위한 LangChain 기반 AI 에이전트 처리 서버

### 서비스 한눈에 보기

| 서비스 | 기술 | 포트 | 용도 |
|---------|------------|------|---------|
| **UI** | Next.js | 3001 | 프론트엔드 애플리케이션 |
| **Backend** | NestJS | 3002 | REST API & WebSocket 서버 |
| **Agent Manager** | FastAPI | 8000 | AI 에이전트 처리 |
| **PostgreSQL** | Database | 5432 | 데이터 영구 저장 |
| **Redis** | Cache/Queue | 6379 | Pub/Sub & Celery 브로커 |

### 접근 방법

- **API 문서**: http://localhost:3002/api/docs (Swagger)
- **헬스 체크**: http://localhost:8000/health (Agent Manager)

## 읽기 순서

백엔드가 처음이라면 다음 순서로 읽는 것을 추천합니다:

1. **[01-architecture-ko.md](./01-architecture-ko.md)** - 전체 아키텍처와 서비스 통신 방식 이해
2. **[04-api-integration-ko.md](./04-api-integration-ko.md)** - API 호출 방법과 인증 처리 학습
3. **[05-data-flow-ko.md](./05-data-flow-ko.md)** - 시스템을 통한 데이터 흐름 이해
4. **[03-agent-manager-ko.md](./03-agent-manager-ko.md)** - AI 에이전트 시스템 학습
5. **[02-nestjs-backend-ko.md](./02-nestjs-backend-ko.md)** - NestJS 백엔드 심층 분석
6. **[06-database-guide-ko.md](./06-database-guide-ko.md)** - 데이터베이스 구조 이해
7. **[08-debugging-ko.md](./08-debugging-ko.md)** - 디버깅 및 문제 해결 방법 학습
8. **[09-glossary-ko.md](./09-glossary-ko.md)** - 낯선 용어 찾아보기

## 아키텍처 개요

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│             │      │              │      │              │
│   React UI  │◄────►│ NestJS API   │◄────►│  PostgreSQL  │
│  (Port 3001)│      │  (Port 3002) │      │  (Port 5432) │
│             │      │              │      │              │
└─────────────┘      └──────┬───────┘      └──────────────┘
                            │
                            │ Socket.IO (WebSocket)
                            │ HTTP/REST
                            │
                    ┌───────▼────────┐
                    │                │
                    │ Agent Manager  │
                    │   FastAPI      │
                    │  (Port 8000)   │
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │                │
                    │   Celery       │
                    │   Worker       │
                    │                │
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │                │
                    │     Redis      │
                    │  (Pub/Sub)     │
                    │  (Celery Broker)│
                    │  (Port 6379)   │
                    └────────────────┘
```

## 주요 기술

### 프론트엔드 개발자를 위해 - 알아야 할 것

#### NestJS (TypeScript)
- **Express와 비슷하지만 구조화됨**: NestJS는 컨트롤러, 서비스, 모듈을 사용하는 모듈식 아키텍처를 사용
- **REST API**: 모든 엔드포인트는 `/api` 접두사 하위에 있음
- **WebSocket**: 실시간 통신을 위해 Socket.IO 사용
- **인증**: JWT 기반 인증

#### FastAPI (Python)
- **현대적 Python 프레임워크**: 빠르고 타입 안전하며 자동 API 문서 제공
- **비동기 처리**: 백그라운드 작업 처리를 위해 Celery 사용
- **AI 에이전트**: LangChain 기반 대화형 AI 구동

#### PostgreSQL
- **관계형 데이터베이스**: 모든 영구 데이터 저장 (사용자, 페이지, 채팅, 결제)
- **ORM**: 데이터베이스 작업을 위한 TypeORM

#### Redis
- **Pub/Sub**: 서비스 간 실시간 메시지 분배
- **Celery 브로커**: 백그라운드 처리를 위한 작업 큐

#### LangChain
- **AI 에이전트 프레임워크**: 여러 전문 에이전트 오케스트레이션
- **에이전트**: 메인 에이전트, 컨텍스트 에이전트, 맵 에이전트, 출력 에이전트

## 서비스 포트

| 포트 | 서비스 | 설명 |
|------|---------|-------------|
| 3001 | UI | Next.js 프론트엔드 애플리케이션 |
| 3002 | Backend | NestJS API 서버 (REST + WebSocket) |
| 5432 | PostgreSQL | 데이터베이스 서버 |
| 6379 | Redis | 캐시 및 메시지 브로커 |
| 8000 | Agent Manager | AI 에이전트용 FastAPI 서버 |

## 서비스 간 통신

### 프론트엔드 ↔ 백엔드
- **REST API**: CRUD 작업을 위한 HTTP 요청
- **WebSocket (Socket.IO)**: 실시간 채팅 및 알림
- **인증**: Authorization 헤더의 JWT 토큰

### 백엔드 ↔ Agent Manager
- **HTTP**: 백엔드가 Agent Manager의 `/chat` 엔드포인트 호출
- **비동기 처리**: Agent Manager가 Celery에 작업 큐잉

### Agent Manager → 백엔드
- **Redis Pub/Sub**: 에이전트가 응답 게시, 백엔드가 구독하고 Socket.IO를 통해 프론트엔드로 전달

## 프론트엔드 개발자를 위한 일반적인 작업

### API 호출

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3002/api';

// 인증과 함께
const getProfile = async (token: string) => {
  const response = await axios.get(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

### Socket.IO 설정

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002', {
  path: '/chat',
  auth: { token: yourJwtToken }
});

socket.on('connect', () => {
  console.log('백엔드에 연결됨');
  socket.emit('joinRoom', { room: 'page-123' });
});

socket.on('newMessage', (message) => {
  console.log('새 메시지:', message);
});
```

## 다음 단계

- 상세 아키텍처 개요는 [01-architecture-ko.md](./01-architecture-ko.md) 읽기
- API 통합 예시는 [04-api-integration-ko.md](./04-api-integration-ko.md) 확인
- 시스템을 통한 데이터 흐름 이해는 [05-data-flow-ko.md](./05-data-flow-ko.md) 참조

## 도움이 필요하신가요?

- 문제 해결은 [08-debugging-ko.md](./08-debugging-ko.md) 확인
- 용어 찾아보기는 [09-glossary-ko.md](./09-glossary-ko.md) 참조
- 전체 API 레퍼런스는 [Swagger API 문서](http://localhost:3002/api/docs) 확인
