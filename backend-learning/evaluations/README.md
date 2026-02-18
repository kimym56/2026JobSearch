# Backend Documentation for Frontend Engineers

Welcome to the Mocheong backend documentation! This guide is designed to help frontend engineers understand the backend architecture, APIs, and data flows.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Suggested Reading Order](#suggested-reading-order)
3. [Architecture Overview](#architecture-overview)
4. [Key Technologies](#key-technologies)
5. [Service Ports](#service-ports)

## Quick Start

### What is the Mocheong Backend?

The Mocheong backend is a **microservices architecture** with two main services:

1. **NestJS Backend** (TypeScript) - Main API server handling REST APIs, WebSocket, authentication, file uploads, and payments
2. **Agent Manager** (Python/FastAPI) - AI agent processing server using LangChain for intelligent conversations

### Services at a Glance

| Service | Technology | Port | Purpose |
|---------|------------|------|---------|
| **UI** | Next.js | 3001 | Frontend application |
| **Backend** | NestJS | 3002 | REST API & WebSocket server |
| **Agent Manager** | FastAPI | 8000 | AI agent processing |
| **PostgreSQL** | Database | 5432 | Data persistence |
| **Redis** | Cache/Queue | 6379 | Pub/Sub & Celery broker |

### How to Access

- **API Documentation**: http://localhost:3002/api/docs (Swagger)
- **Health Check**: http://localhost:8000/health (Agent Manager)

## Suggested Reading Order

If you're new to the backend, we recommend reading in this order:

1. **[01-architecture.md](./01-architecture.md)** - Understand the overall architecture and how services communicate
2. **[04-api-integration.md](./04-api-integration.md)** - Learn how to call APIs and handle authentication
3. **[05-data-flow.md](./05-data-flow.md)** - Understand how data flows through the system
4. **[03-agent-manager.md](./03-agent-manager.md)** - Learn about the AI agent system
5. **[02-nestjs-backend.md](./02-nestjs-backend.md)** - Deep dive into NestJS backend
6. **[06-database-guide.md](./06-database-guide.md)** - Understand the database structure
7. **[08-debugging.md](./08-debugging.md)** - Learn how to debug and troubleshoot
8. **[09-glossary.md](./09-glossary.md)** - Look up unfamiliar terms

## Architecture Overview

```mermaid
flowchart TB
    UI["React UI (Port 3001)"] <--> Nest["NestJS API (Port 3002)"]
    Nest <--> Postgres["PostgreSQL (Port 5432)"]
    Nest -->|Socket.IO (WebSocket) / HTTP/REST| AgentManager["Agent Manager FastAPI (Port 8000)"]
    AgentManager --> Celery["Celery Worker"]
    Celery --> Redis["Redis / Pub/Sub + Celery Broker / (Port 6379)"]
```

## Key Technologies

### For Frontend Developers - What You Need to Know

#### NestJS (TypeScript)
- **Like Express, but structured**: NestJS uses a modular architecture with controllers, services, and modules
- **REST APIs**: All endpoints are under `/api` prefix
- **WebSocket**: Uses Socket.IO for real-time communication
- **Authentication**: JWT-based authentication

#### FastAPI (Python)
- **Modern Python framework**: Fast, type-safe, with automatic API documentation
- **Async processing**: Uses Celery for background task processing
- **AI Agents**: Powers the LangChain-based conversational AI

#### PostgreSQL
- **Relational database**: Stores all persistent data (users, pages, chats, payments)
- **ORM**: TypeORM for database operations

#### Redis
- **Pub/Sub**: Real-time message distribution between services
- **Celery Broker**: Task queue for background processing

#### LangChain
- **AI Agent Framework**: Orchestrates multiple specialized agents
- **Agents**: Main agent, Context agent, Map agent, Output agent

## Service Ports

| Port | Service | Description |
|------|---------|-------------|
| 3001 | UI | Next.js frontend application |
| 3002 | Backend | NestJS API server (REST + WebSocket) |
| 5432 | PostgreSQL | Database server |
| 6379 | Redis | Cache and message broker |
| 8000 | Agent Manager | FastAPI server for AI agents |

## Communication Between Services

### Frontend ↔ Backend
- **REST API**: HTTP requests for CRUD operations
- **WebSocket (Socket.IO)**: Real-time chat and notifications
- **Authentication**: JWT tokens in Authorization header

### Backend ↔ Agent Manager
- **HTTP**: Backend calls Agent Manager's `/chat` endpoint
- **Async processing**: Agent Manager queues tasks in Celery

### Agent Manager → Backend
- **Redis Pub/Sub**: Agent publishes responses, Backend subscribes and forwards to frontend via Socket.IO

## Common Tasks for Frontend Developers

### Making API Calls

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3002/api';

// With authentication
const getProfile = async (token: string) => {
  const response = await axios.get(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

### Setting Up Socket.IO

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002', {
  path: '/chat',
  auth: { token: yourJwtToken }
});

socket.on('connect', () => {
  console.log('Connected to backend');
  socket.emit('joinRoom', { room: 'page-123' });
});

socket.on('newMessage', (message) => {
  console.log('New message:', message);
});
```

## Next Steps

- Read [01-architecture.md](./01-architecture.md) for detailed architecture overview
- Check [04-api-integration.md](./04-api-integration.md) for API integration examples
- See [05-data-flow.md](./05-data-flow.md) to understand data flow through the system

## Need Help?

- Check [08-debugging.md](./08-debugging.md) for troubleshooting
- Look up terms in [09-glossary.md](./09-glossary.md)
- See [Swagger API docs](http://localhost:3002/api/docs) for complete API reference
