# NestJS Backend Guide

This guide provides a comprehensive overview of the NestJS backend, focusing on what frontend developers need to know to integrate effectively.

## Table of Contents

1. [What is NestJS?](#what-is-nestjs)
2. [Directory Structure](#directory-structure)
3. [REST API Endpoints](#rest-api-endpoints)
4. [Authentication (JWT)](#authentication-jwt)
5. [WebSocket (Socket.IO)](#websocket-socketio)
6. [Error Handling](#error-handling)

## What is NestJS?

### For Frontend Developers

**NestJS** is a TypeScript framework for building server-side applications. Think of it as:

- **Like Express, but organized**: Express gives you freedom, NestJS gives you structure
- **Modular architecture**: Code is organized into modules (like React components but for backend)
- **Built-in patterns**: Dependency injection, decorators, guards, pipes

### Key Concepts

| Concept | Description | Frontend Equivalent |
|---------|-------------|---------------------|
| **Controller** | Handles HTTP requests | React Component |
| **Service** | Business logic | Custom Hook / Utility |
| **Module** | Groups related features | Feature Folder |
| **Guard** | Protects routes | Protected Route |
| **Pipe** | Transforms/validates data | Zod / Yup validation |

### Why We Use NestJS

1. **TypeScript-first**: Type safety across frontend and backend
2. **Structured**: Easy to find code and understand the architecture
3. **Scalable**: Modular design helps the codebase grow
4. **Built-in features**: Validation, authentication, WebSockets out of the box

## Directory Structure

```
backend/src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
│
├── auth/                      # Authentication module
│   ├── auth.controller.ts     # Login/register endpoints
│   ├── auth.service.ts        # Auth logic
│   ├── jwt.strategy.ts        # JWT verification
│   ├── local.strategy.ts      # Local login strategy
│   └── dto/
│       ├── login.dto.ts       # Login request schema
│       └── register.dto.ts    # Register request schema
│
├── chat/                      # Chat & WebSocket module
│   ├── chat.gateway.ts        # Socket.IO gateway
│   ├── chat.service.ts        # Chat logic
│   ├── agent.service.ts       # Agent Manager client
│   ├── redis.service.ts       # Redis pub/sub client
│   └── session.service.ts     # Session management
│
├── page/                      # Page/CMS module
│   ├── page.controller.ts     # Page CRUD endpoints
│   ├── page.service.ts        # Page logic
│   └── markdown-converter.service.ts
│
├── file/                      # File upload module
│   ├── file.controller.ts     # Upload endpoints
│   ├── file.service.ts        # File logic
│   └── s3.service.ts          # AWS S3 integration
│
├── payment/                   # Payment module
│   ├── payment.controller.ts  # Payment endpoints
│   └── payment.service.ts
│
├── invitation/                # Invitation module
│   ├── invitation.controller.ts
│   └── invitation.service.ts
│
├── admin/                     # Admin module
│   ├── admin.controller.ts
│   └── admin.service.ts
│
├── entities/                  # Database models (TypeORM)
│   ├── user.entity.ts
│   ├── chat.entity.ts
│   ├── page.entity.ts
│   ├── payment.entity.ts
│   ├── invitation.entity.ts
│   ├── file.entity.ts
│   └── page-view.entity.ts
│
├── database/                  # Repository layer
│   ├── base-repository.ts
│   ├── user.repository.ts
│   └── ...
│
├── logger/                    # Winston logger
│   └── winston-logger.service.ts
│
└── common/                    # Shared utilities
    └── http-exception.filter.ts
```

## REST API Endpoints

### Base URL
```
http://localhost:3002/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"  // optional
}
```

**Response (201)**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "isAdmin": false,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false
  }
}
```

#### Get Profile (Protected)
```http
POST /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200)**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "isAdmin": false,
  "isActive": true
}
```

### Page Endpoints

#### Publish Page
```http
POST /api/page/publish
Authorization: Bearer {token}
Content-Type: application/json

{
  "slug": "wedding-123",
  "title": "Our Wedding",
  "componentData": { ... }
}
```

#### Get User's Pages
```http
GET /api/page/my-pages
Authorization: Bearer {token}
```

#### Get Public Page (No Auth Required)
```http
GET /api/page/public/wedding-123
```

#### Update Page
```http
PUT /api/page/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "componentData": { ... }
}
```

#### Delete Page
```http
DELETE /api/page/:id
Authorization: Bearer {token}
```

### File Endpoints

#### Upload File
```http
POST /api/file/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary data]
```

**Response (201)**:
```json
{
  "id": "uuid",
  "filename": "photo.jpg",
  "url": "https://s3.amazonaws.com/...",
  "mimeType": "image/jpeg",
  "size": 123456
}
```

#### Get User's Files
```http
GET /api/file/my-files
Authorization: Bearer {token}
```

### Payment Endpoints

#### Create Payment
```http
POST /api/payment/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 50000,
  "pageId": "uuid",
  "customerName": "Kim Cheong"
}
```

#### Verify Payment
```http
POST /api/payment/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentId": "uuid",
  "impUid": "imp_1234567890"
}
```

### Invitation Endpoints

#### Create Invitation
```http
POST /api/invitation/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "WELCOME2025",
  "maxUses": 100
}
```

#### Validate Invitation Code
```http
POST /api/invitation/validate
Content-Type: application/json

{
  "code": "WELCOME2025"
}
```

## Authentication (JWT)

### How JWT Works

```
┌─────────┐                   ┌──────────────┐                 ┌──────────┐
│         │                   │              │                 │          │
│ Frontend│─── POST login ────>│ NestJS API   │─── verify ────>│ Database │
│         │                   │              │    password     │          │
│         │<── JWT token ──────│              │<────────────────│          │
│         │                   │              │                 │          │
└─────────┘                   └──────────────┘                 └──────────┘
      │
      │ Store token
      │ (localStorage/cookie)
      │
      │ Use in subsequent requests
      │ Authorization: Bearer {token}
      │
```

### Using JWT in Frontend

#### Login Example
```typescript
import axios from 'axios';

const login = async (email: string, password: string) => {
  const response = await axios.post('http://localhost:3002/api/auth/login', {
    email,
    password
  });

  const { access_token, user } = response.data;

  // Store token
  localStorage.setItem('token', access_token);
  localStorage.setItem('user', JSON.stringify(user));

  return user;
};
```

#### Using Token for Authenticated Requests
```typescript
import axios from 'axios';

// Create axios instance with default headers
const api = axios.create({
  baseURL: 'http://localhost:3002/api'
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Now all requests are authenticated
const getProfile = async () => {
  const response = await api.post('/auth/profile');
  return response.data;
};
```

#### React Hook Example
```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    axios.post('http://localhost:3002/api/auth/profile', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setUser(response.data))
    .catch(() => localStorage.removeItem('token'))
    .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:3002/api/auth/login', {
      email, password
    });
    localStorage.setItem('token', response.data.access_token);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, login, logout, loading };
};
```

## WebSocket (Socket.IO)

### What is Socket.IO?

**Socket.IO** is a library that enables real-time bidirectional communication between web clients and servers.

- Unlike REST (request-response), Socket.IO maintains a persistent connection
- Both client and server can send messages at any time
- Built on top of WebSockets with fallbacks for older browsers
- Automatically handles reconnection

### Socket.IO Events

#### Connection Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connect` | Server → Client | Connection established |
| `disconnect` | Server → Client | Connection closed |

#### Room Management Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `joinRoom` | Client → Server | `{ room, userId, wedding_id? }` | Join a chat room |
| `leaveRoom` | Client → Server | `{ room, userId }` | Leave a chat room |
| `session-info` | Server → Client | `{ session_id, wedding_id }` | Session information |
| `roomHistory` | Server → Client | `Chat[]` | Recent messages |

#### Chat Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `chat-message` | Client → Server | `{ text, session_id, room, userId, ... }` | Send message to AI |
| `message-accepted` | Server → Client | `{ message_id, session_id }` | Message accepted by agent |
| `message-error` | Server → Client | `{ error, details }` | Message processing error |
| `newMessage` | Server → Client | `{ type, content, component? }` | New message from AI/user |
| `component-message` | Client → Server | `{ component }` | Component interaction |

#### Health Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `ping` | Client → Server | - | Health check |
| `pong` | Server → Client | - | Pong response |
| `health` | Client → Server | - | Health status request |
| `health` | Server → Client | `{ status, connections }` | Health status |

### Socket.IO Client Setup

#### Basic Setup
```typescript
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:3002', {
  path: '/chat',  // Namespace
  auth: {
    token: yourJwtToken  // Send JWT token
  }
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

#### Joining a Room
```typescript
socket.emit('joinRoom', {
  room: 'page-123',
  userId: 'user-123',
  wedding_id: 'wedding-123'
});

socket.on('session-info', (data) => {
  console.log('Session ID:', data.session_id);
  const sessionId = data.session_id;
});
```

#### Sending Chat Messages
```typescript
socket.emit('chat-message', {
  text: 'When is the wedding?',
  session_id: sessionId,
  room: 'page-123',
  userId: 'user-123',
  wedding_id: 'wedding-123',
  timestamp: Date.now()
});

socket.on('message-accepted', (data) => {
  console.log('Message accepted:', data.message_id);
});

socket.on('newMessage', (message) => {
  console.log('New message:', message);

  if (message.type === 'text') {
    // Text message
    console.log('Content:', message.content);
  } else if (message.type === 'component') {
    // Component message (e.g., AgentSuggestMessage)
    console.log('Component:', message.component);
  }
});
```

#### Error Handling
```typescript
socket.on('message-error', (error) => {
  console.error('Message error:', error.error);
  console.error('Details:', error.details);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});
```

#### React Hook for Socket.IO
```typescript
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useChatSocket = (token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:3002', {
      path: '/chat',
      auth: { token }
    });

    socketInstance.on('connect', () => {
      console.log('Connected');
    });

    socketInstance.on('session-info', (data) => {
      setSessionId(data.session_id);
    });

    socketInstance.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  const joinRoom = (room: string, userId: string, weddingId?: string) => {
    socket?.emit('joinRoom', {
      room,
      userId,
      wedding_id: weddingId
    });
  };

  const sendMessage = (text: string, room: string, userId: string) => {
    socket?.emit('chat-message', {
      text,
      session_id: sessionId,
      room,
      userId,
      timestamp: Date.now()
    });
  };

  return { socket, messages, sessionId, joinRoom, sendMessage };
};
```

## Error Handling

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": "Validation failed"
}
```

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Login successful, profile retrieved |
| 201 | Created | User registered, page published |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Invalid/missing JWT token |
| 403 | Forbidden | Access denied (not admin) |
| 404 | Not Found | Page doesn't exist |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Internal server error |

### Handling Errors in Frontend

#### Axios Example
```typescript
import axios from 'axios';

const apiCall = async () => {
  try {
    const response = await axios.get('/api/page/123');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - show error
          alert('Access denied');
          break;
        case 404:
          // Not found
          alert('Resource not found');
          break;
        default:
          // Other error
          alert('An error occurred');
      }
    }
  }
};
```

## API Documentation

### Swagger UI

The backend provides interactive API documentation at:
```
http://localhost:3002/api/docs
```

Features:
- Try out API endpoints directly from the browser
- See request/response schemas
- Test authentication with JWT tokens

## Next Steps

- [03-agent-manager.md](./03-agent-manager.md) - Learn about the AI agent system
- [04-api-integration.md](./04-api-integration.md) - More API integration examples
- [05-data-flow.md](./05-data-flow.md) - Understand complete data flows
