# Python Agent Manager 가이드

이 가이드는 LangChain 에이전트를 사용하여 AI 대화 시스템을 구동하는 Python Agent Manager에 대한 포괄적인 개요를 제공합니다.

## 목차

1. [FastAPI란 무엇인가요?](#fastapi란-무엇인가요)
2. [LangChain이란 무엇인가요?](#langchain이란-무엇인가요)
3. [에이전트 아키텍처](#에이전트-아키텍처)
4. [Celery 작업 큐](#celery-작업-큐)
5. [Redis Pub/Sub](#redis-pubsub)
6. [데이터 흐름: AI 에이전트에서 프론트엔드로](#데이터-흐름-ai-에이전트에서-프론트엔드로)

## FastAPI란 무엇인가요?

### 프론트엔드 개발자를 위해

**FastAPI**는 많은 면에서 NestJS와 비슷한 현대적 Python 웹 프레임워크입니다:

- **Express/NestJS와 비슷하지만 Python용**: 빠르고 타입 안전하며 자동 API 문서 제공
- **Async 우선**: 많은 동시 요청을 처리하기 위한 `asyncio` 기반
- **자동 검증**: 요청/응답 검증을 위한 Pydantic 사용
- **Swagger UI**: 자동 생성되는 대화형 API 문서

### 주요 기능

| 기능 | 설명 |
|---------|-------------|
| **타입 힌트** | 자동 검증을 위한 Python 타입 어노테이션 |
| **Pydantic** | Python 타입 어노테이션을 사용한 데이터 검증 |
| **Async/Await** | 비동기 요청 처리 (JavaScript 프로미스와 비슷함) |
| **자동 문서** | 자동 생성되는 OpenAPI/Swagger 문서 |
| **의존성 주입** | NestJS 의존성 주입과 비슷함 |

### FastAPI vs NestJS

| 측면 | NestJS (TS) | FastAPI (Python) |
|--------|-------------|------------------|
| **언어** | TypeScript | Python |
| **타입 시스템** | TypeScript 타입 | Python 타입 힌트 |
| **검증** | class-validator | Pydantic |
| **비동기** | async/await | async/await |
| **문서** | Swagger (수동) | Swagger (자동) |

## LangChain이란 무엇인가요?

### 개요

**LangChain**은 대형 언어 모델(LLM)로 애플리케이션을 구축하기 위한 프레임워크입니다. 다음과 같이 생각할 수 있습니다:

- **AI 에이전트용 라이브러리**: 도구를 사용할 수 있는 스마트 어시스턴트와 비슷
- **체인 오케스트레이션**: 여러 AI 작업을 연결
- **도구 통합**: 에이전트가 외부 API, 데이터베이스 등을 호출할 수 있음

### LangChain 에이전트

LangChain의 **에이전트**는 다음을 수행하는 AI입니다:
1. **사용자 메시지 수신**
2. **수행할 작업 결정** (GPT-4와 같은 LLM 사용)
3. **정보 수집 또는 작업 수행을 위해 도구 사용**
4. **응답 반환**

### LangChain을 사용하는 이유?

| 이점 | 설명 |
|---------|-------------|
| **추론** | 에이전트가 컨텍스트를 기반으로 사용할 도구 결정 |
| **확장 가능** | 새로운 도구와 기능을 쉽게 추가 |
| **메모리** | 대화 기록을 기억할 수 있음 |
| **다단계** | 복잡한 다단계 작업 수행 가능 |

## 에이전트 아키텍처

모청 시스템은 전문 에이전트가 있는 **다중 에이전트 아키텍처**를 사용합니다:

```
┌─────────────────────────────────────────────────────────────┐
│                      Main Agent                             │
│                  (오케스트레이터)                           │
│                  GPT-4o-mini                                │
├─────────────────────────────────────────────────────────────┤
│  책임:                                                      │
│  - 사용자 의도 이해                                         │
│  - 호출할 하위 에이전트 결정                                │
│  - 하위 에이전트 응답 조정                                 │
│  - 최종 응답 생성                                           │
└──────────┬──────────┬────────────┬─────────────────────────┘
           │          │            │
           ▼          ▼            ▼
    ┌──────────┐ ┌─────────┐ ┌────────────┐
    │ Context  │ │   Map   │ │   Output   │
    │  Agent   │ │ Agent   │ │   Agent    │
    └──────────┘ └─────────┘ └────────────┘
    (데이터     (위치     (응답
     가져오기)   검색)     포맷팅)
```

### 에이전트 책임

#### Main Agent (오케스트레이터)
- **모델**: GPT-4o-mini
- **목적**: 다른 에이전트 조정 및 응답 생성
- **도구**:
  - `get_context_agent_tools` - Context Agent가 할 수 있는 작업 쿼리
  - `get_map_agent_tools` - Map Agent가 할 수 있는 작업 쿼리
  - `get_output_agent_tools` - Output Agent가 할 수 있는 작업 쿼리

#### Context Agent (데이터 가져오기)
- **목적**: 데이터베이스에서 웨딩 정보 가져오기
- **도구**:
  - `get_wedding_info` - 웨딩 세부 정보 가져오기 (이름, 날짜, 장소)
  - `get_invitation_text` - 초대장 메시지 가져오기
  - `get_account_info` - 축의금 계좌 정보 가져오기
  - `get_calendar_info` - 웨딩 날짜 및 시간 가져오기

#### Map Agent (위치 서비스)
- **목적**: 장소 및 venue 검색
- **도구**:
  - `search_place` - 카카오맵 API로 장소 검색
  - `get_place_details` - 상세 장소 정보 가져오기

#### Output Agent (응답 포맷터)
- **목적**: 다양한 출력 유형용 응답 포맷
- **도구**:
  - `text_response` - 일반 텍스트 응답
  - `component_response` - UI 컴포넌트 (예: AgentSuggestMessage)
  - `map_response` - 지도/위치 표시

### 에이전트 도구 (Output Agent)

Output Agent에는 다양한 응답을 위한 **1427줄**의 도구(`output_tools.py`)가 있습니다:

| 도구 | 설명 |
|------|-------------|
| `text_response` | 간단한 텍스트 응답 |
| `agent_suggest_message` | 사용자가 클릭할 수 있는 추천 질문 |
| `cover_component` | 웨딩 표지 페이지 |
| `invitation_component` | 웨딩 초대장 텍스트 |
| `calendar_component` | 웨딩 캘린더 정보 |
| `location_component` | 웨딩 위치/지도 |
| `account_component` | 축의금 계좌 정보 |

## Celery 작업 큐

### Celery란 무엇인가요?

**Celery**는 Python용 분산 작업 큐입니다. 다음과 같이 생각할 수 있습니다:

- **백그라운드 작업 프로세서**: JavaScript의 Web Workers와 비슷
- **분산**: 여러 서버에서 실행 가능
- **비동기**: 차단 없이 백그라운드에서 작업 실행

### Celery를 사용하는 이유?

| 이점 | 설명 |
|---------|-------------|
| **비차단** | API가 즉시 반환되고 백그라운드에서 처리 |
| **확장 가능** | 트래픽 증가에 따라 더 많은 worker 추가 |
| **신뢰할 수 있음** | 실패 시 작업 재시도 |
| **모니터링** | 내장 모니터링 도구 |

### Celery 아키텍처

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│  FastAPI    │      │    Redis     │      │   Celery     │
│  (Producer) │─────>│   (Broker)   │<─────│   Worker     │
│             │      │              │      │              │
│ POST /chat  │      │  작업 큐     │      │  - 작업 실행 │
│ returns     │      │              │      │  - AI 호출   │
│ immediately │      │              │      │  - 결과 게시 │
│             │      │              │      │              │
└─────────────┘      └──────────────┘      └──────────────┘
```

### 작업 플로우

1. **FastAPI가 요청 수신** `POST /chat`
2. **Celery에 작업 큐잉**: `process_chat_message.delay(request_data)`
3. **즉시 반환**: `{ status: "accepted", message_id: "..." }`
4. **Celery worker가 작업 수신**하고 LangChain 에이전트로 처리
5. **결과 게시**를 Redis pub/sub에 실시간 스트리밍용

### Celery 구성

```python
# agent_mgr/celery_app.py

celery_app = Celery(
    "agent_manager",
    broker="redis://localhost:6379/0",  # Redis를 브로커로
    backend="redis://localhost:6379/0",  # 결과용 Redis
    include=["tasks"]  # 작업 모듈
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    task_max_retries=3,
    task_default_retry_delay=60,
)
```

## Redis Pub/Sub

### Redis Pub/Sub란 무엇인가요?

**Redis Pub/Sub**는 발행-구독 메시징 시스템입니다. 다음과 같이 생각할 수 있습니다:

- **이벤트 버스**: 분산된 Node.js의 EventEmitter와 비슷
- **실시간**: 메시지가 구독자에게 즉시 전달
- **분리됨**: 발행자는 구독자를 알지 못함

### Redis Pub/Sub를 사용하는 이유?

| 이점 | 설명 |
|---------|-------------|
| **실시간** | 프론트엔드에 즉시 메시지 전달 |
| **스트리밍** | 생성되는 부분 응답을 스트리밍 가능 |
| **분리됨** | 에이전트가 프론트엔드를 알 필요 없음 |
| **확장 가능** | 여러 서비스가 같은 채널을 구독 가능 |

### Pub/Sub 아키텍처

```
┌──────────────┐      ┌──────────────────────────────────────┐
│   Celery     │      │              Redis                   │
│   Worker     │─────>│         Pub/Sub 시스템               │
│              │      │                                      │
│  - AI 실행   │      │  채널: chat:{session_id}             │
│  - 응답 생성 │      │                                      │
│              │      │  메시지:                             │
│  - 게시     │      │  - { type: "text", content: "..." }  │
└──────────────┘      │  - { type: "component", ... }        │
                      └──────────┬───────────────────────────┘
                                   │
                                   │ 구독
                                   ▼
                         ┌──────────────────┐
                         │  NestJS 백엔드   │
                         │  (구독자)        │
                         │                  │
                         │  - 구독          │
                         │  - Socket.IO로   │
                         │    전달          │
                         └────────┬─────────┘
                                  │ Socket.IO로 emit
                                  ▼
                         ┌──────────────────┐
                         │   프론트엔드      │
                         │   (Socket.IO     │
                         │    클라이언트)    │
                         └──────────────────┘
```

### 채널 이름 지정

채널은 세션 ID로 이름이 지정됩니다:
```
chat:{session_id}
```

예시:
```
chat:abc-123-def-456
```

### 메시지 형식

Redis에 게시된 메시지는 이 형식을 가집니다:

```json
{
  "type": "text | component | error",
  "content": "메시지 내용",
  "component": {
    "type": "AgentSuggestMessage",
    "props": { ... }
  },
  "metadata": {
    "session_id": "...",
    "timestamp": 1234567890
  }
}
```

## 데이터 흐름: AI 에이전트에서 프론트엔드로

### 완전한 흐름 다이어그램

```
사용자 입력 (프론트엔드)
      │
      │ Socket.IO: chat-message
      ▼
┌─────────────────────────────────────────────────────────────┐
│                      NestJS 백엔드                           │
├─────────────────────────────────────────────────────────────┤
│  1. Socket.IO로 chat-message 수신                          │
│  2. 세션 생성/가져오기                                      │
│  3. PostgreSQL에서 웨딩 컨텍스트 가져오기                  │
│  4. Agent Manager으로 HTTP POST 전송                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP POST /chat
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Agent Manager                      │
├─────────────────────────────────────────────────────────────┤
│  5. 채팅 요청 수신                                         │
│  6. Celery에 작업 큐잉: process_chat_message.delay()      │
│  7. 즉시 202 Accepted 반환                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ NestJS로 반환
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      NestJS 백엔드                           │
├─────────────────────────────────────────────────────────────┤
│  8. Socket.IO을 통해 프론트엔드로 "message-accepted" emit  │
│  9. Redis 채널 구독: chat:{session_id}                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ (한편, 백그라운드에서...)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Celery Worker                            │
├─────────────────────────────────────────────────────────────┤
│  10. 큐에서 작업 수신                                       │
│  11. Main Agent 초기화                                     │
│  12. LangChain으로 메시지 처리:                            │
│      - Main Agent이 호출할 하위 에이전트 결정              │
│      - Context Agent이 웨딩 데이터 가져오기                │
│      - Map Agent이 위치 검색                               │
│      - Output Agent이 응답 포맷                             │
│  13. Redis pub/sub을 통해 응답 스트리밍                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Redis pubsub.publish()
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                        Redis                                │
├─────────────────────────────────────────────────────────────┤
│  채널: chat:{session_id}                                   │
│  메시지:                                                    │
│    { type: "text", content: "네! 확인해 드릴게요..." }      │
│    { type: "component", component: {...} }                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Redis 구독이 전달
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      NestJS 백엔드                           │
├─────────────────────────────────────────────────────────────┤
│  14. RedisService이 Redis에서 메시지 수신                  │
│  15. Socket.IO으로 전달                                    │
│  16. 프론트엔드로 "newMessage" emit                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Socket.IO: newMessage
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       프론트엔드                              │
├─────────────────────────────────────────────────────────────┤
│  17. Socket.IO 클라이언트가 "newMessage" 수신              │
│  18. 응답으로 UI 업데이트                                  │
└─────────────────────────────────────────────────────────────┘
```

### 타이밍 다이어그램

```
프론트엔드   NestJS      FastAPI     Celery      Redis      NestJS      프론트엔드
   │           │           │           │           │           │           │
   │chat-msg   │           │           │           │           │           │
   ├──────────>│           │           │           │           │           │
   │           │POST /chat │           │           │           │           │
   │           ├──────────>│           │           │           │           │
   │           │           │작업 큐    │           │           │           │
   │           │           ├───────────>│           │           │           │
   │           │202 OK     │           │           │           │           │
   │<──────────┴───────────│           │           │           │           │
   │           │           │           │           │           │           │
   │accepted   │           │           │           │           │           │
   │<───────────│           │           │           │           │           │
   │           │구독       │           │           │           │           │
   │           ├───────────────────────────────────────────>│           │
   │           │           │           │처리       │           │           │
   │           │           │           │AI로       │           │           │
   │           │           │           ├───────────>│           │           │
   │           │           │           │게시       │           │           │
   │           │           │           ├──────────>│           │           │
   │           │           │           │           │전달       │           │
   │           │           │           │           ├──────────>│           │
   │           │           │           │           │newMessage │           │
   │           │           │           │           ├──────────────────────>│
   │newMessage │           │           │           │           │           │
   │<──────────────────────────────────────────────────────────────────────│
```

## 프론트엔드 개발자를 위한 주요 차이점

### REST vs Agent 처리

| 측면 | REST API | AI 에이전트 |
|--------|----------|----------|
| **응답 시간** | 즉시 (ms) | 지연 (초) |
| **응답 패턴** | 요청 → 응답 | 요청 → 수락됨 → 스트림 |
| **통신** | HTTP/REST | Socket.IO + HTTP + Redis |
| **상태** | Stateless | 세션 기반 |
| **UI 업데이트** | 단일 업데이트 | 여러 스트리밍 업데이트 |

### 프론트엔드에서 에이전트 응답 처리

```typescript
// 단일 응답을 기다리는 REST API와 달리,
// 에이전트 응답은 시간이 지나면서 스트리밍됨

socket.on('message-accepted', (data) => {
  // 작업 수락됨 - 로딩 표시기 표시
  showTypingIndicator();
});

socket.on('newMessage', (message) => {
  hideTypingIndicator();

  if (message.type === 'text') {
    // 텍스트 응답 - 채팅에 추가
    appendMessage(message.content);
  } else if (message.type === 'component') {
    // 컴포넌트 응답 - UI 컴포넌트 렌더링
    renderComponent(message.component);
  }
});

socket.on('message-error', (error) => {
  hideTypingIndicator();
  showError(error.error);
});
```

## 모니터링 및 디버깅

### 헬스 체크

Agent Manager 헬스 체크:
```bash
curl http://localhost:8000/health
```

**응답**:
```json
{
  "status": "ok",
  "timestamp": 1234567890.123,
  "services": {
    "redis": "healthy",
    "celery": "healthy"
  }
}
```

### Celery 모니터링

Celery 작업 모니터링:
```bash
celery -A agent_mgr.celery_app inspect active
```

### Redis 모니터링

Redis pub/sub 모니터링:
```bash
redis-cli MONITOR
```

## 다음 단계

- [04-api-integration-ko.md](./04-api-integration-ko.md) - 완전한 API 통합 예시
- [05-data-flow-ko.md](./05-data-flow-ko.md) - 상세한 데이터 흐름 예시
- [08-debugging-ko.md](./08-debugging-ko.md) - 백엔드 이슈 디버깅
