# Python Agent Manager Guide

This guide provides a comprehensive overview of the Python Agent Manager, which powers the AI conversation system using LangChain agents.

## Table of Contents

1. [What is FastAPI?](#what-is-fastapi)
2. [What is LangChain?](#what-is-langchain)
3. [Agent Architecture](#agent-architecture)
4. [Celery Task Queue](#celery-task-queue)
5. [Redis Pub/Sub](#redis-pubsub)
6. [Data Flow: AI Agent to Frontend](#data-flow-ai-agent-to-frontend)

## What is FastAPI?

### For Frontend Developers

**FastAPI** is a modern Python web framework that's similar to NestJS in many ways:

- **Like Express/NestJS, but for Python**: Fast, type-safe, with automatic API documentation
- **Async-first**: Built on `asyncio` for handling many concurrent requests
- **Automatic validation**: Uses Pydantic for request/response validation
- **Swagger UI**: Auto-generated interactive API docs

### Key Features

| Feature | Description |
|---------|-------------|
| **Type Hints** | Python type annotations for automatic validation |
| **Pydantic** | Data validation using Python type annotations |
| **Async/Await** | Asynchronous request handling (like JavaScript promises) |
| **Automatic Docs** | OpenAPI/Swagger docs generated automatically |
| **Dependency Injection** | Similar to NestJS dependency injection |

### FastAPI vs NestJS

| Aspect | NestJS (TS) | FastAPI (Python) |
|--------|-------------|------------------|
| **Language** | TypeScript | Python |
| **Type System** | TypeScript types | Python type hints |
| **Validation** | class-validator | Pydantic |
| **Async** | async/await | async/await |
| **Documentation** | Swagger (manual) | Swagger (auto) |

## What is LangChain?

### Overview

**LangChain** is a framework for building applications with large language models (LLMs). Think of it as:

- **A library for AI agents**: Like having a smart assistant that can use tools
- **Chain orchestration**: Connect multiple AI operations together
- **Tool integration**: Agents can call external APIs, databases, etc.

### LangChain Agents

An **agent** in LangChain is an AI that:
1. **Receives a user message**
2. **Decides what to do** (using an LLM like GPT-4)
3. **Uses tools** to gather information or perform actions
4. **Returns a response**

### Why LangChain?

| Benefit | Description |
|---------|-------------|
| **Reasoning** | Agent can decide which tools to use based on context |
| **Extensible** | Easy to add new tools and capabilities |
| **Memory** | Can remember conversation history |
| **Multi-step** | Can perform complex multi-step tasks |

## Agent Architecture

The Mocheong system uses a **multi-agent architecture** with specialized agents:

```
┌─────────────────────────────────────────────────────────────┐
│                      Main Agent                             │
│                  (Orchestrator)                             │
│                  GPT-4o-mini                                │
├─────────────────────────────────────────────────────────────┤
│  Responsibilities:                                          │
│  - Understand user intent                                   │
│  - Decide which sub-agent to call                           │
│  - Coordinate sub-agent responses                           │
│  - Generate final response                                  │
└──────────┬──────────┬────────────┬─────────────────────────┘
           │          │            │
           ▼          ▼            ▼
    ┌──────────┐ ┌─────────┐ ┌────────────┐
    │ Context  │ │   Map   │ │   Output   │
    │  Agent   │ │ Agent   │ │   Agent    │
    └──────────┘ └─────────┘ └────────────┘
    (Data       (Location   (Response
     Fetch)      Search)     Formatting)
```

### Agent Responsibilities

#### Main Agent (Orchestrator)
- **Model**: GPT-4o-mini
- **Purpose**: Coordinate other agents and generate responses
- **Tools**:
  - `get_context_agent_tools` - Query what Context Agent can do
  - `get_map_agent_tools` - Query what Map Agent can do
  - `get_output_agent_tools` - Query what Output Agent can do

#### Context Agent (Data Fetcher)
- **Purpose**: Fetch wedding information from database
- **Tools**:
  - `get_wedding_info` - Get wedding details (names, date, venue)
  - `get_invitation_text` - Get invitation message
  - `get_account_info` - Get account information for gifts
  - `get_calendar_info` - Get wedding date and time

#### Map Agent (Location Services)
- **Purpose**: Search for locations and venues
- **Tools**:
  - `search_place` - Search for places using Kakao Map API
  - `get_place_details` - Get detailed place information

#### Output Agent (Response Formatter)
- **Purpose**: Format responses for different output types
- **Tools**:
  - `text_response` - Plain text response
  - `component_response` - UI component (e.g., AgentSuggestMessage)
  - `map_response` - Map/location display

### Agent Tools (Output Agent)

The Output Agent has **1427 lines** of tools (`output_tools.py`) for various responses:

| Tool | Description |
|------|-------------|
| `text_response` | Simple text response |
| `agent_suggest_message` | Suggested questions for user to click |
| `cover_component` | Wedding cover page |
| `invitation_component` | Wedding invitation text |
| `calendar_component` | Wedding calendar information |
| `location_component` | Wedding location/map |
| `account_component` | Account information for gifts |

## Celery Task Queue

### What is Celery?

**Celery** is a distributed task queue for Python. Think of it as:

- **Background job processor**: Like Web Workers in JavaScript
- **Distributed**: Can run on multiple servers
- **Async**: Tasks run in the background without blocking

### Why Celery?

| Benefit | Description |
|---------|-------------|
| **Non-blocking** | API returns immediately, processing happens in background |
| **Scalable** | Can add more workers as traffic increases |
| **Reliable** | Tasks are retried on failure |
| **Monitoring** | Built-in monitoring tools |

### Celery Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│  FastAPI    │      │    Redis     │      │   Celery     │
│  (Producer) │─────>│   (Broker)   │<─────│   Worker     │
│             │      │              │      │              │
│ POST /chat  │      │  Task Queue  │      │  - Executes  │
│ returns     │      │              │      │    tasks     │
│ immediately │      │              │      │  - Calls AI  │
│             │      │              │      │  - Publishes │
└─────────────┘      └──────────────┘      │    result    │
                                            └──────────────┘
```

### Task Flow

1. **FastAPI receives request** at `POST /chat`
2. **Queue task** in Celery: `process_chat_message.delay(request_data)`
3. **Return immediately** with `{ status: "accepted", message_id: "..." }`
4. **Celery worker picks up task** and processes with LangChain agents
5. **Publishes results** to Redis pub/sub for real-time streaming

### Celery Configuration

```python
# agent_mgr/celery_app.py

celery_app = Celery(
    "agent_manager",
    broker="redis://localhost:6379/0",  # Redis as broker
    backend="redis://localhost:6379/0",  # Redis for results
    include=["tasks"]  # Task modules
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

### What is Redis Pub/Sub?

**Redis Pub/Sub** is a publish-subscribe messaging system. Think of it as:

- **Event bus**: Like EventEmitter in Node.js, but distributed
- **Real-time**: Messages are delivered immediately to subscribers
- **Decoupled**: Publishers don't know who is subscribing

### Why Redis Pub/Sub?

| Benefit | Description |
|---------|-------------|
| **Real-time** | Instant message delivery to frontend |
| **Streaming** | Can stream partial responses as they're generated |
| **Decoupled** | Agent doesn't need to know about frontend |
| **Scalable** | Multiple services can subscribe to same channel |

### Pub/Sub Architecture

```
┌──────────────┐      ┌──────────────────────────────────────┐
│   Celery     │      │              Redis                   │
│   Worker     │─────>│         Pub/Sub System              │
│              │      │                                      │
│  - Runs AI   │      │  Channel: chat:{session_id}          │
│  - Generates │      │                                      │
│    response  │      │  Messages:                           │
│              │      │  - { type: "text", content: "..." }  │
│  - Publishes │      │  - { type: "component", ... }        │
└──────────────┘      └──────────┬───────────────────────────┘
                                 │
                                 │ subscribe
                                 ▼
                       ┌──────────────────┐
                       │  NestJS Backend  │
                       │  (Subscriber)    │
                       │                  │
                       │  - Subscribes    │
                       │  - Forwards to   │
                       │    Socket.IO     │
                       └────────┬─────────┘
                                │ emit via Socket.IO
                                ▼
                       ┌──────────────────┐
                       │   Frontend       │
                       │   (Socket.IO     │
                       │    Client)       │
                       └──────────────────┘
```

### Channel Naming

Channels are named by session ID:
```
chat:{session_id}
```

Example:
```
chat:abc-123-def-456
```

### Message Format

Messages published to Redis have this format:

```json
{
  "type": "text | component | error",
  "content": "Message content",
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

## Data Flow: AI Agent to Frontend

### Complete Flow Diagram

```
User Input (Frontend)
      │
      │ Socket.IO: chat-message
      ▼
┌─────────────────────────────────────────────────────────────┐
│                      NestJS Backend                         │
├─────────────────────────────────────────────────────────────┤
│  1. Receive chat-message via Socket.IO                     │
│  2. Create/retrieve session                                │
│  3. Fetch wedding context from PostgreSQL                  │
│  4. Send HTTP POST to Agent Manager                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP POST /chat
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Agent Manager                      │
├─────────────────────────────────────────────────────────────┤
│  5. Receive chat request                                   │
│  6. Queue task in Celery: process_chat_message.delay()     │
│  7. Return 202 Accepted immediately                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Returns to NestJS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      NestJS Backend                         │
├─────────────────────────────────────────────────────────────┤
│  8. Emit "message-accepted" to frontend via Socket.IO       │
│  9. Subscribe to Redis channel: chat:{session_id}          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ (Meanwhile, in background...)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Celery Worker                            │
├─────────────────────────────────────────────────────────────┤
│ 10. Pick up task from queue                                │
│ 11. Initialize Main Agent                                   │
│ 12. Process message with LangChain:                        │
│      - Main Agent decides which sub-agents to call         │
│      - Context Agent fetches wedding data                  │
│      - Map Agent searches locations                        │
│      - Output Agent formats response                       │
│ 13. Stream responses via Redis pub/sub                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Redis pubsub.publish()
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                        Redis                                │
├─────────────────────────────────────────────────────────────┤
│  Channel: chat:{session_id}                                │
│  Messages:                                                  │
│    { type: "text", content: "Sure! Let me check..." }      │
│    { type: "component", component: {...} }                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Redis subscription delivers
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      NestJS Backend                         │
├─────────────────────────────────────────────────────────────┤
│  14. RedisService receives message from Redis               │
│  15. Forward to Socket.IO                                  │
│  16. Emit "newMessage" to frontend                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Socket.IO: newMessage
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       Frontend                              │
├─────────────────────────────────────────────────────────────┤
│  17. Socket.IO client receives "newMessage"                │
│  18. Update UI with response                               │
└─────────────────────────────────────────────────────────────┘
```

### Timing Diagram

```
Frontend    NestJS      FastAPI     Celery      Redis      NestJS      Frontend
   │           │           │           │           │           │           │
   │chat-msg   │           │           │           │           │           │
   ├──────────>│           │           │           │           │           │
   │           │POST /chat │           │           │           │           │
   │           ├──────────>│           │           │           │           │
   │           │           │queue task │           │           │           │
   │           │           ├───────────>│           │           │           │
   │           │202 OK     │           │           │           │           │
   │<──────────┴───────────│           │           │           │           │
   │           │           │           │           │           │           │
   │accepted   │           │           │           │           │           │
   │<───────────│           │           │           │           │           │
   │           │subscribe  │           │           │           │           │
   │           ├───────────────────────────────────────────>│           │
   │           │           │           │process    │           │           │
   │           │           │           │with AI    │           │           │
   │           │           │           ├───────────>│           │           │
   │           │           │           │publish    │           │           │
   │           │           │           ├──────────>│           │           │
   │           │           │           │           │forward    │           │
   │           │           │           │           ├──────────>│           │
   │           │           │           │           │newMessage │           │
   │           │           │           │           ├──────────────────────>│
   │newMessage │           │           │           │           │           │
   │<──────────────────────────────────────────────────────────────────────│
```

## Key Differences for Frontend Developers

### REST vs Agent Processing

| Aspect | REST API | AI Agent |
|--------|----------|----------|
| **Response time** | Immediate (ms) | Delayed (seconds) |
| **Response pattern** | Request → Response | Request → Accepted → Stream |
| **Communication** | HTTP/REST | Socket.IO + HTTP + Redis |
| **State** | Stateless | Session-based |
| **UI updates** | Single update | Multiple streaming updates |

### Handling Agent Responses in Frontend

```typescript
// Unlike REST APIs where you await a single response,
// agent responses stream in over time

socket.on('message-accepted', (data) => {
  // Task accepted - show loading indicator
  showTypingIndicator();
});

socket.on('newMessage', (message) => {
  hideTypingIndicator();

  if (message.type === 'text') {
    // Text response - append to chat
    appendMessage(message.content);
  } else if (message.type === 'component') {
    // Component response - render UI component
    renderComponent(message.component);
  }
});

socket.on('message-error', (error) => {
  hideTypingIndicator();
  showError(error.error);
});
```

## Monitoring and Debugging

### Health Check

Check Agent Manager health:
```bash
curl http://localhost:8000/health
```

**Response**:
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

### Celery Monitoring

Monitor Celery tasks:
```bash
celery -A agent_mgr.celery_app inspect active
```

### Redis Monitoring

Monitor Redis pub/sub:
```bash
redis-cli MONITOR
```

## Next Steps

- [04-api-integration.md](./04-api-integration.md) - Complete API integration examples
- [05-data-flow.md](./05-data-flow.md) - Detailed data flow examples
- [08-debugging.md](./08-debugging.md) - Debugging backend issues
