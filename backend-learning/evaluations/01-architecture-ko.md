# 아키텍처 개요

이 문서는 모청 백엔드 아키텍처에 대한 포괄적인 개요를 제공하며, 서비스가 어떻게 통신하는지와 시스템을 통해 데이터가 어떻게 흐르는지에 중점을 둡니다.

## 목차

1. [시스템 아키텍처](#시스템-아키텍처)
2. [서비스 개요](#서비스-개요)
3. [서비스 통신](#서비스-통신)
4. [기술 스택](#기술-스택)
5. [데이터 흐름 패턴](#데이터-흐름-패턴)

## 시스템 아키텍처

모청은 두 개의 주요 백엔드 서비스가 있는 **마이크로서비스 아키텍처**를 사용합니다:

```mermaid
flowchart TB
    subgraph FrontendLayer["프론트엔드 레이어"]
        UI["Next.js UI (포트 3001) / - React 컴포넌트 / - Socket.IO 클라이언트 / - REST용 Axios/Fetch"]
    end

    subgraph ApiLayer["API 게이트웨이 레이어"]
        Nest["NestJS 백엔드 (포트 3002)"]
        Rest["REST API 컨트롤러 / - Auth (JWT) / - Pages / - Files (S3) / - Payments (Portone) / - Invitations / - Admin"]
        Gateway["Socket.IO 게이트웨이 / - 채팅 방 / - 세션 관리 / - 메시지 라우팅"]
        Services["서비스 / - Agent Service (HTTP 클라이언트) / - Redis Service (Pub/Sub) / - Session Service"]
        Nest --> Rest
        Nest --> Gateway
        Nest --> Services
    end

    subgraph AiLayer["AI 처리 레이어"]
        AgentManager["FastAPI Agent Manager (포트 8000)"]
        Endpoints["HTTP 엔드포인트 / - POST /chat (비동기) / - GET /health"]
        Agents["LangChain 에이전트 / - Main Agent / - Context Agent / - Map Agent / - Output Agent"]
        Tasks["Celery 작업 / - 비동기 처리 / - 장기 실행 작업"]
        AgentManager --> Endpoints
        AgentManager --> Agents
        AgentManager --> Tasks
    end

    subgraph InfraLayer["인프라 레이어"]
        Postgres["PostgreSQL (포트 5432) / - Users / - Pages / - Chats / - Payments / - Files"]
        Redis["Redis (포트 6379) / - Pub/Sub / - Celery broker / - Cache"]
        S3["AWS S3 (파일 저장소) / - 업로드된 이미지 / - PDF 파일"]
    end

    UI -- "HTTP (REST API) / WebSocket (Socket.IO)" --> Nest
    Nest -- "HTTP (Agent API)" --> AgentManager
    AgentManager -- "Redis Pub/Sub (스트리밍 응답) / Celery Broker (작업 큐)" --> Redis
    Nest --> Postgres
    Nest --> S3
```

## 서비스 개요

### 1. Next.js UI (포트 3001)
- **목적**: 프론트엔드 애플리케이션
- **기술**: Next.js, React, Socket.IO Client
- **책임**:
  - 사용자 인터페이스 렌더링
  - API 클라이언트 (Axios/fetch)
  - WebSocket 클라이언트 (Socket.IO)
  - 상태 관리

### 2. NestJS 백엔드 (포트 3002)
- **목적**: 메인 API 서버 및 WebSocket 게이트웨이
- **기술**: NestJS (TypeScript), TypeORM, Socket.IO
- **책임**:
  - REST API 엔드포인트
  - WebSocket 연결
  - JWT 인증
  - 데이터베이스 작업 (PostgreSQL)
  - 파일 업로드 (S3)
  - Agent Manager와의 통합

### 3. FastAPI Agent Manager (포트 8000)
- **목적**: AI 에이전트 처리 서버
- **기술**: FastAPI (Python), LangChain, Celery
- **책임**:
  - 채팅 메시지 수신
  - Celery 작업 큐잉
  - Redis pub/sub을 통한 AI 응답 스트리밍
  - 헬스 모니터링

### 4. Celery Worker
- **목적**: 백그라운드 작업 처리
- **기술**: Celery (Python)
- **책임**:
  - LangChain 에이전트 작업 처리
  - 외부 API에서 데이터 가져오기
  - AI 응답 생성
  - Redis에 응답 게시

### 5. PostgreSQL (포트 5432)
- **목적**: 기본 데이터베이스
- **기술**: PostgreSQL 15
- **데이터**:
  - Users (인증)
  - Pages (웨딩 청첩장)
  - Chats (메시지 기록)
  - Payments (거래)
  - Files (메타데이터)
  - Invitations

### 6. Redis (포트 6379)
- **목적**: 캐시 및 메시지 브로커
- **기술**: Redis 7
- **용도**:
  - **Pub/Sub**: 실시간 메시지 분배
  - **Celery Broker**: 백그라운드 작업을 위한 작업 큐
  - **캐시**: 세션 데이터와 자주 액세스하는 데이터

### 7. AWS S3
- **목적**: 파일 저장소
- **용도**:
  - 사용자 업로드 이미지
  - PDF 파일
  - 정적 자산

## 서비스 통신

### 프론트엔드 → NestJS 백엔드

#### REST API 통신
```mermaid
sequenceDiagram
    participant Frontend as 프론트엔드
    participant NestJSBackend as NestJS 백엔드
    Frontend->>NestJSBackend: HTTP GET /api/page/:id
    NestJSBackend-->>Frontend: JSON 응답 (page payload)
```

**예시**:
```typescript
// 프론트엔드
const response = await axios.get('http://localhost:3002/api/page/123', {
  headers: { Authorization: `Bearer ${token}` }
});
```

#### WebSocket 통신 (Socket.IO)
```mermaid
sequenceDiagram
    participant Frontend as 프론트엔드
    participant ChatGateway as NestJS ChatGateway
    Frontend->>ChatGateway: connect
    ChatGateway-->>Frontend: connection
    Frontend->>ChatGateway: joinRoom (room=page-123)
    ChatGateway-->>Frontend: session-info (session_id)
    Frontend->>ChatGateway: chat-message (text=Hello)
    ChatGateway-->>Frontend: message-accepted (message_id)
    ChatGateway-->>Frontend: newMessage (from AI agent)
```

**예시**:
```typescript
// 프론트엔드
const socket = io('http://localhost:3002/chat', {
  auth: { token: yourJwtToken }
});

socket.on('connect', () => {
  socket.emit('joinRoom', { room: 'page-123', userId: 'user-123' });
});

socket.on('newMessage', (message) => {
  console.log('새 메시지:', message);
});
```

### NestJS 백엔드 → Agent Manager

#### HTTP 통신
```mermaid
sequenceDiagram
    participant ChatGateway as NestJS ChatGateway
    participant AgentManager as FastAPI Agent Manager
    ChatGateway->>AgentManager: POST /chat (message, session_id, wedding_context)
    AgentManager-->>ChatGateway: 202 Accepted (status: accepted, message_id)
```

**핵심 포인트**: Agent Manager는 "accepted" 상태로 **즉시** 응답합니다. 처리는 Celery를 통해 비동기적으로 수행됩니다.

### Agent Manager → Celery Worker

#### 작업 큐 통신
```mermaid
sequenceDiagram
    participant AgentManager as FastAPI Agent Manager
    participant Celery as Celery Worker
    participant LangChain as LangChain Agent
    AgentManager->>Celery: 작업 큐잉 (process_chat_message)
    Celery->>LangChain: 작업 실행
    Note over LangChain: 요청 처리, 데이터 가져오기, 응답 생성.
    LangChain-->>Celery: 작업 결과
```

### Celery Worker → NestJS 백엔드 (Redis 경유)

#### Redis Pub/Sub 통신
```mermaid
sequenceDiagram
    participant Celery as Celery Worker
    participant Redis
    participant NestJS as NestJS 백엔드
    participant Frontend as 프론트엔드
    Celery->>Redis: chat 채널 payload publish
    Redis-->>NestJS: 게시 메시지 전달
    Note over NestJS: 채널 구독 중
    NestJS-->>Frontend: Socket.IO로 emit
```

## 기술 스택

### NestJS 백엔드

| 레이어 | 기술 | 목적 |
|-------|-----------|---------|
| **프레임워크** | NestJS 11.x | 구조화된 TypeScript 프레임워크 |
| **ORM** | TypeORM 0.3.x | 데이터베이스 추상화 |
| **데이터베이스** | PostgreSQL 15 | 데이터 영구 저장 |
| **WebSocket** | Socket.IO 4.x | 실시간 통신 |
| **인증** | Passport + JWT | 인증 |
| **검증** | class-validator | 입력 검증 |
| **로깅** | Winston 3.x | 구조화된 로깅 |
| **저장소** | AWS SDK S3 | 파일 저장 |

### Agent Manager

| 레이어 | 기술 | 목적 |
|-------|-----------|---------|
| **프레임워크** | FastAPI 0.123.x | 현대적 Python 웹 프레임워크 |
| **AI/ML** | LangChain 1.1.x | AI 에이전트 오케스트레이션 |
| **작업 큐** | Celery 5.3.x | 백그라운드 처리 |
| **메시지 브로커** | Redis 5.x | Pub/Sub 및 작업 큐 |
| **검증** | Pydantic 2.x | 데이터 검증 |
| **HTTP 클라이언트** | httpx/requests | 외부 API 호출 |

## 데이터 흐름 패턴

### 1. 사용자 등록 플로우
```mermaid
sequenceDiagram
    participant Frontend as 프론트엔드
    participant NestJS as NestJS 백엔드
    participant Postgres as PostgreSQL
    Frontend->>NestJS: POST /api/auth/register
    NestJS->>Postgres: User 생성
    Postgres-->>NestJS: user 저장됨
    NestJS-->>Frontend: JWT 토큰
```

### 2. 채팅 메시지 플로우 (완전)
```mermaid
sequenceDiagram
    participant FE as FE
    participant NB as NB
    participant AM as AM
    participant CW as CW
    participant LC as LC
    participant RD as RD
    FE->>NB: chat-message
    NB->>AM: POST /chat
    AM->>CW: 작업 큐잉
    CW->>LC: 요청 처리
    LC-->>CW: 응답 생성 결과
    CW->>RD: 응답 publish
    NB->>RD: 채널 구독
    RD-->>NB: 스트리밍 메시지 전달
    NB-->>FE: Socket.IO로 emit
```
약어: `FE` = 프론트엔드, `NB` = NestJS 백엔드, `AM` = Agent Manager, `CW` = Celery Worker, `LC` = LangChain, `RD` = Redis.

### 3. 파일 업로드 플로우
```mermaid
sequenceDiagram
    participant Frontend as 프론트엔드
    participant NestJS as NestJS 백엔드
    participant S3 as AWS S3
    participant Postgres as PostgreSQL
    Frontend->>NestJS: POST /file/upload (multipart/form-data)
    NestJS->>S3: 파일 업로드
    S3-->>NestJS: 파일 URL
    NestJS->>Postgres: 파일 메타데이터 저장
    NestJS-->>Frontend: 파일 데이터 응답
```

## 주요 아키텍처 결정

### 왜 두 개의 백엔드인가요?

1. **관심사 분리**:
   - NestJS는 비즈니스 로직, 인증, 데이터 관리 처리
   - Python 서비스는 AI/ML 처리 전문

2. **독립적 확장**:
   - API 트래픽을 위해 NestJS 확장
   - AI 처리를 위해 Python 서비스 확장

3. **기술 적합성**:
   - TypeScript/Node.js는 I/O 바운드 API 작업에 탁월
   - Python은 LangChain으로 AI/ML에 우수

4. **비동기 처리**:
   - Celery는 장기 실행 AI 작업을 차단 없이 처리
   - Redis pub/sub는 스트리밍 응답 가능

### 왜 Socket.IO인가요?

- **실시간 양방향 통신**
- **자동 재연결**
- **방 기반 메시징** (채팅 세션용)
- **브라우저 호환성**

### 왜 PostgreSQL인가요?

- **ACID 준수** (결제에 중요)
- **관계형 데이터** (사용자, 페이지, 채팅이 관련됨)
- **강력한 일관성**
- **풍부한 생태계**

### 왜 Redis인가요?

- **실시간 메시징을 위한 빠른 pub/sub**
- **작업 큐용 Celery broker**
- **성능을 위한 인메모리 캐시**

## 다음 단계

- [02-nestjs-backend-ko.md](./02-nestjs-backend-ko.md) - NestJS 백엔드 심층 분석
- [03-agent-manager-ko.md](./03-agent-manager-ko.md) - AI 에이전트 시스템 학습
- [04-api-integration-ko.md](./04-api-integration-ko.md) - 백엔드와 통합하는 방법
- [05-data-flow-ko.md](./05-data-flow-ko.md) - 상세한 데이터 흐름 예시
