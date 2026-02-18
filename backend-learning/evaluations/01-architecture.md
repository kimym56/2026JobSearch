# Architecture Overview

This document provides a comprehensive overview of the Mocheong backend architecture, focusing on how services communicate and how data flows through the system.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Services Overview](#services-overview)
3. [Service Communication](#service-communication)
4. [Technology Stack](#technology-stack)
5. [Data Flow Patterns](#data-flow-patterns)

## System Architecture

Mocheong uses a **microservices architecture** with two main backend services:

```mermaid
flowchart TB
    subgraph FrontendLayer["Frontend Layer"]
        UI["Next.js UI (Port 3001) / - React Components / - Socket.IO Client / - Axios/Fetch for REST"]
    end

    subgraph ApiLayer["API Gateway Layer"]
        Nest["NestJS Backend (Port 3002)"]
        Rest["REST API Controllers / - Auth (JWT) / - Pages / - Files (S3) / - Payments (Portone) / - Invitations / - Admin"]
        Gateway["Socket.IO Gateway / - Chat rooms / - Session management / - Message routing"]
        Services["Services / - Agent Service (HTTP client) / - Redis Service (Pub/Sub) / - Session Service"]
        Nest --> Rest
        Nest --> Gateway
        Nest --> Services
    end

    subgraph AiLayer["AI Processing Layer"]
        AgentManager["FastAPI Agent Manager (Port 8000)"]
        Endpoints["HTTP Endpoints / - POST /chat (async) / - GET /health"]
        Agents["LangChain Agents / - Main Agent / - Context Agent / - Map Agent / - Output Agent"]
        Tasks["Celery Tasks / - Async processing / - Long-running tasks"]
        AgentManager --> Endpoints
        AgentManager --> Agents
        AgentManager --> Tasks
    end

    subgraph InfraLayer["Infrastructure Layer"]
        Postgres["PostgreSQL (Port 5432) / - Users / - Pages / - Chats / - Payments / - Files"]
        Redis["Redis (Port 6379) / - Pub/Sub / - Celery broker / - Cache"]
        S3["AWS S3 (File Storage) / - Uploaded images / - PDF files"]
    end

    UI -- "HTTP (REST API) / WebSocket (Socket.IO)" --> Nest
    Nest -- "HTTP (Agent API)" --> AgentManager
    AgentManager -- "Redis Pub/Sub (Streaming responses) / Celery Broker (Task queue)" --> Redis
    Nest --> Postgres
    Nest --> S3
```

## Services Overview

### 1. Next.js UI (Port 3001)
- **Purpose**: Frontend application
- **Technology**: Next.js, React, Socket.IO Client
- **Responsibilities**:
  - User interface rendering
  - API client (Axios/fetch)
  - WebSocket client (Socket.IO)
  - State management

### 2. NestJS Backend (Port 3002)
- **Purpose**: Main API server and WebSocket gateway
- **Technology**: NestJS (TypeScript), TypeORM, Socket.IO
- **Responsibilities**:
  - REST API endpoints
  - WebSocket connections
  - JWT authentication
  - Database operations (PostgreSQL)
  - File uploads (S3)
  - Integration with Agent Manager

### 3. FastAPI Agent Manager (Port 8000)
- **Purpose**: AI agent processing server
- **Technology**: FastAPI (Python), LangChain, Celery
- **Responsibilities**:
  - Accept chat messages
  - Queue Celery tasks
  - Stream AI responses via Redis pub/sub
  - Health monitoring

### 4. Celery Worker
- **Purpose**: Background task processing
- **Technology**: Celery (Python)
- **Responsibilities**:
  - Process LangChain agent tasks
  - Fetch data from external APIs
  - Generate AI responses
  - Publish responses to Redis

### 5. PostgreSQL (Port 5432)
- **Purpose**: Primary database
- **Technology**: PostgreSQL 15
- **Data**:
  - Users (authentication)
  - Pages (wedding invitations)
  - Chats (message history)
  - Payments (transactions)
  - Files (metadata)
  - Invitations

### 6. Redis (Port 6379)
- **Purpose**: Cache and message broker
- **Technology**: Redis 7
- **Uses**:
  - **Pub/Sub**: Real-time message distribution
  - **Celery Broker**: Task queue for background jobs
  - **Cache**: Session data and frequently accessed data

### 7. AWS S3
- **Purpose**: File storage
- **Uses**:
  - User uploaded images
  - PDF files
  - Static assets

## Service Communication

### Frontend → NestJS Backend

#### REST API Communication
```mermaid
sequenceDiagram
    participant Frontend
    participant NestJSBackend as NestJS Backend
    Frontend->>NestJSBackend: HTTP GET /api/page/:id
    NestJSBackend-->>Frontend: JSON response (page payload)
```

**Example**:
```typescript
// Frontend
const response = await axios.get('http://localhost:3002/api/page/123', {
  headers: { Authorization: `Bearer ${token}` }
});
```

#### WebSocket Communication (Socket.IO)
```mermaid
sequenceDiagram
    participant Frontend
    participant ChatGateway as NestJS ChatGateway
    Frontend->>ChatGateway: connect
    ChatGateway-->>Frontend: connection
    Frontend->>ChatGateway: joinRoom (room=page-123)
    ChatGateway-->>Frontend: session-info (session_id)
    Frontend->>ChatGateway: chat-message (text=Hello)
    ChatGateway-->>Frontend: message-accepted (message_id)
    ChatGateway-->>Frontend: newMessage (from AI agent)
```

**Example**:
```typescript
// Frontend
const socket = io('http://localhost:3002/chat', {
  auth: { token: yourJwtToken }
});

socket.on('connect', () => {
  socket.emit('joinRoom', { room: 'page-123', userId: 'user-123' });
});

socket.on('newMessage', (message) => {
  console.log('New message:', message);
});
```

### NestJS Backend → Agent Manager

#### HTTP Communication
```mermaid
sequenceDiagram
    participant ChatGateway as NestJS ChatGateway
    participant AgentManager as FastAPI Agent Manager
    ChatGateway->>AgentManager: POST /chat (message, session_id, wedding_context)
    AgentManager-->>ChatGateway: 202 Accepted (status: accepted, message_id)
```

**Key Point**: The Agent Manager returns **immediately** with "accepted" status. Processing happens asynchronously via Celery.

### Agent Manager → Celery Worker

#### Task Queue Communication
```mermaid
sequenceDiagram
    participant AgentManager as FastAPI Agent Manager
    participant Celery as Celery Worker
    participant LangChain as LangChain Agent
    AgentManager->>Celery: Queue task (process_chat_message)
    Celery->>LangChain: Execute task
    Note over LangChain: Process request, fetch data, and generate response.
    LangChain-->>Celery: Task result
```

### Celery Worker → NestJS Backend (via Redis)

#### Redis Pub/Sub Communication
```mermaid
sequenceDiagram
    participant Celery as Celery Worker
    participant Redis
    participant NestJS as NestJS Backend
    participant Frontend
    Celery->>Redis: publish chat channel payload
    Redis-->>NestJS: forward published message
    Note over NestJS: subscribed to channel
    NestJS-->>Frontend: emit via Socket.IO
```

## Technology Stack

### NestJS Backend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | NestJS 11.x | Structured TypeScript framework |
| **ORM** | TypeORM 0.3.x | Database abstraction |
| **Database** | PostgreSQL 15 | Data persistence |
| **WebSocket** | Socket.IO 4.x | Real-time communication |
| **Auth** | Passport + JWT | Authentication |
| **Validation** | class-validator | Input validation |
| **Logging** | Winston 3.x | Structured logging |
| **Storage** | AWS SDK S3 | File storage |

### Agent Manager

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | FastAPI 0.123.x | Modern Python web framework |
| **AI/ML** | LangChain 1.1.x | AI agent orchestration |
| **Task Queue** | Celery 5.3.x | Background processing |
| **Message Broker** | Redis 5.x | Pub/Sub & task queue |
| **Validation** | Pydantic 2.x | Data validation |
| **HTTP Client** | httpx/requests | External API calls |

## Data Flow Patterns

### 1. User Registration Flow
```mermaid
sequenceDiagram
    participant Frontend
    participant NestJS as NestJS Backend
    participant Postgres as PostgreSQL
    Frontend->>NestJS: POST /api/auth/register
    NestJS->>Postgres: create user
    Postgres-->>NestJS: user saved
    NestJS-->>Frontend: JWT token
```

### 2. Chat Message Flow (Complete)
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
    AM->>CW: queue task
    CW->>LC: process request
    LC-->>CW: generated response
    CW->>RD: publish response
    NB->>RD: subscribe channel
    RD-->>NB: streamed message
    NB-->>FE: emit via Socket.IO
```
Abbreviations: `FE` = Frontend, `NB` = NestJS Backend, `AM` = Agent Manager, `CW` = Celery Worker, `LC` = LangChain, `RD` = Redis.

### 3. File Upload Flow
```mermaid
sequenceDiagram
    participant Frontend
    participant NestJS as NestJS Backend
    participant S3 as AWS S3
    participant Postgres as PostgreSQL
    Frontend->>NestJS: POST /file/upload (multipart/form-data)
    NestJS->>S3: upload file
    S3-->>NestJS: file URL
    NestJS->>Postgres: save file metadata
    NestJS-->>Frontend: file data response
```

## Key Architectural Decisions

### Why Two Backends?

1. **Separation of Concerns**:
   - NestJS handles business logic, authentication, and data management
   - Python service specializes in AI/ML processing

2. **Independent Scaling**:
   - Scale NestJS for API traffic
   - Scale Python service for AI processing

3. **Technology Fit**:
   - TypeScript/Node.js is excellent for I/O-bound API operations
   - Python is superior for AI/ML with LangChain

4. **Async Processing**:
   - Celery allows long-running AI tasks without blocking
   - Redis pub/sub enables streaming responses

### Why Socket.IO?

- **Real-time bidirectional communication**
- **Automatic reconnection**
- **Room-based messaging** (for chat sessions)
- **Browser compatibility**

### Why PostgreSQL?

- **ACID compliance** (critical for payments)
- **Relational data** (users, pages, chats are related)
- **Strong consistency**
- **Rich ecosystem**

### Why Redis?

- **Fast pub/sub** for real-time messaging
- **Celery broker** for task queue
- **In-memory caching** for performance

## Next Steps

- [02-nestjs-backend.md](./02-nestjs-backend.md) - Deep dive into NestJS backend
- [03-agent-manager.md](./03-agent-manager.md) - Learn about the AI agent system
- [04-api-integration.md](./04-api-integration.md) - How to integrate with the backend
- [05-data-flow.md](./05-data-flow.md) - Detailed data flow examples
