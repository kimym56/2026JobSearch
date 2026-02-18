# NestJS 백엔드 가이드

이 가이드는 NestJS 백엔드에 대한 포괄적인 개요를 제공하며, 효과적으로 통합하기 위해 프론트엔드 개발자가 알아야 할 사항에 중점을 둡니다.

## 목차

1. [NestJS란 무엇인가요?](#nestjs란-무엇인가요)
2. [디렉토리 구조](#디렉토리-구조)
3. [REST API 엔드포인트](#rest-api-엔드포인트)
4. [인증 (JWT)](#인증-jwt)
5. [WebSocket (Socket.IO)](#websocket-socketio)
6. [에러 처리](#에러-처리)

## NestJS란 무엇인가요?

### 프론트엔드 개발자를 위해

**NestJS**는 서버 사이드 애플리케이션을 구축하기 위한 TypeScript 프레임워크입니다. 다음과 같이 생각할 수 있습니다:

- **Express와 비슷하지만 정리됨**: Express는 자유를 주고, NestJS는 구조를 제공
- **모듈식 아키텍처**: 코드가 모듈로 정리됨 (백엔드용 React 컴포넌트와 비슷)
- **내장 패턴**: 의존성 주입, 데코레이터, 가드, 파이프

### 핵심 개념

| 개념 | 설명 | 프론트엔드 동등물 |
|---------|-------------|---------------------|
| **Controller** | HTTP 요청 처리 | React 컴포넌트 |
| **Service** | 비즈니스 로직 | Custom Hook / 유틸리티 |
| **Module** | 관련 기능 그룹화 | Feature 폴더 |
| **Guard** | 경로 보호 | 보호된 경로 |
| **Pipe** | 데이터 변환/검증 | Zod / Yup 검증 |

### NestJS를 사용하는 이유

1. **TypeScript 우선**: 프론트엔드와 백엔드 모두 타입 안전성
2. **구조화됨**: 코드를 찾고 아키텍처를 이해하기 쉬움
3. **확장 가능**: 모듈식 설계로 코드베이스 성장 지원
4. **내장 기능**: 검증, 인증, WebSocket을 기본으로 제공

## 디렉토리 구조

```mermaid
flowchart TD
    SRC["backend/src"]
    SRC --> CORE["Core / - main.ts / - app.module.ts"]

    SRC --> FEATURES["기능 모듈"]
    FEATURES --> AUTH["auth/ / controller, service, / jwt.strategy, local.strategy, / dto(login/register)"]
    FEATURES --> CHAT["chat/ / gateway, service, / agent, redis, session"]
    FEATURES --> PAGE["page/ / controller, service, / markdown-converter"]
    FEATURES --> FILE["file/ / controller, service, s3"]
    FEATURES --> PAYMENT["payment/ / controller, service"]
    FEATURES --> INVITATION["invitation/ / controller, service"]
    FEATURES --> ADMIN["admin/ / controller, service"]

    SRC --> DATALAYER["데이터 레이어"]
    DATALAYER --> ENTITIES["entities/ / user, chat, page, payment, / invitation, file, page-view"]
    DATALAYER --> REPOS["database/ / base-repository, user.repository, ..."]

    SRC --> PLATFORM["플랫폼/공통"]
    PLATFORM --> LOGGER["logger/ / winston-logger.service.ts"]
    PLATFORM --> COMMON["common/ / http-exception.filter.ts"]
```

## REST API 엔드포인트

### 기본 URL
```
http://localhost:3002/api
```

### 인증 엔드포인트

#### 회원가입
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"  // 선택사항
}
```

**응답 (201)**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "isAdmin": false,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답 (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "isAdmin": false
  }
}
```

#### 프로필 조회 (보호됨)
```http
POST /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**응답 (200)**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "isAdmin": false,
  "isActive": true
}
```

### 페이지 엔드포인트

#### 페이지 게시
```http
POST /api/page/publish
Authorization: Bearer {token}
Content-Type: application/json

{
  "slug": "wedding-123",
  "title": "우리의 결혼식",
  "componentData": { ... }
}
```

#### 사용자의 페이지 가져오기
```http
GET /api/page/my-pages
Authorization: Bearer {token}
```

#### 공개 페이지 가져오기 (인증 불필요)
```http
GET /api/page/public/wedding-123
```

#### 페이지 업데이트
```http
PUT /api/page/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "업데이트된 제목",
  "componentData": { ... }
}
```

#### 페이지 삭제
```http
DELETE /api/page/:id
Authorization: Bearer {token}
```

### 파일 엔드포인트

#### 파일 업로드
```http
POST /api/file/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary data]
```

**응답 (201)**:
```json
{
  "id": "uuid",
  "filename": "photo.jpg",
  "url": "https://s3.amazonaws.com/...",
  "mimeType": "image/jpeg",
  "size": 123456
}
```

#### 사용자의 파일 가져오기
```http
GET /api/file/my-files
Authorization: Bearer {token}
```

### 결제 엔드포인트

#### 결제 생성
```http
POST /api/payment/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 50000,
  "pageId": "uuid",
  "customerName": "김청"
}
```

#### 결제 확인
```http
POST /api/payment/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentId": "uuid",
  "impUid": "imp_1234567890"
}
```

### 초대 엔드포인트

#### 초대 생성
```http
POST /api/invitation/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "WELCOME2025",
  "maxUses": 100
}
```

#### 초대 코드 확인
```http
POST /api/invitation/validate
Content-Type: application/json

{
  "code": "WELCOME2025"
}
```

## 인증 (JWT)

### JWT 작동 방식

```mermaid
sequenceDiagram
    participant Frontend as 프론트엔드
    participant NestJS as NestJS API
    participant Database
    Frontend->>NestJS: POST /api/auth/login
    NestJS->>Database: 비밀번호 해시 검증
    Database-->>NestJS: 사용자 레코드
    NestJS-->>Frontend: JWT 토큰
    Note over Frontend: 토큰을 localStorage 또는 cookie에 저장하고 후속 요청에서 Authorization Bearer 토큰으로 사용.
```

### 프론트엔드에서 JWT 사용

#### 로그인 예시
```typescript
import axios from 'axios';

const login = async (email: string, password: string) => {
  const response = await axios.post('http://localhost:3002/api/auth/login', {
    email,
    password
  });

  const { access_token, user } = response.data;

  // 토큰 저장
  localStorage.setItem('token', access_token);
  localStorage.setItem('user', JSON.stringify(user));

  return user;
};
```

#### 인증된 요청에 토큰 사용
```typescript
import axios from 'axios';

// 기본 헤더가 있는 axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:3002/api'
});

// 토큰 포함을 위한 인터셉터 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 이제 모든 요청이 인증됨
const getProfile = async () => {
  const response = await api.post('/auth/profile');
  return response.data;
};
```

#### React Hook 예시
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

### Socket.IO란 무엇인가요?

**Socket.IO**는 웹 클라이언트와 서버 간의 실시간 양방향 통신을 가능하게 하는 라이브러리입니다.

- REST (요청-응답)와 달리 Socket.IO는 지속적인 연결을 유지
- 클라이언트와 서버 모두 언제든지 메시지를 보낼 수 있음
- WebSocket을 기반으로 구축되었으며 오래된 브라우저용 대체책 제공
- 자동 재연결 처리

### Socket.IO 이벤트

#### 연결 이벤트

| 이벤트 | 방향 | 설명 |
|-------|-----------|-------------|
| `connect` | 서버 → 클라이언트 | 연결 설정됨 |
| `disconnect` | 서버 → 클라이언트 | 연결 닫힘 |

#### 방 관리 이벤트

| 이벤트 | 방향 | 페이로드 | 설명 |
|-------|-----------|---------|-------------|
| `joinRoom` | 클라이언트 → 서버 | `{ room, userId, wedding_id? }` | 채팅 방 참여 |
| `leaveRoom` | 클라이언트 → 서버 | `{ room, userId }` | 채팅 방 나가기 |
| `session-info` | 서버 → 클라이언트 | `{ session_id, wedding_id }` | 세션 정보 |
| `roomHistory` | 서버 → 클라이언트 | `Chat[]` | 최근 메시지 |

#### 채팅 이벤트

| 이벤트 | 방향 | 페이로드 | 설명 |
|-------|-----------|---------|-------------|
| `chat-message` | 클라이언트 → 서버 | `{ text, session_id, room, userId, ... }` | AI에 메시지 전송 |
| `message-accepted` | 서버 → 클라이언트 | `{ message_id, session_id }` | 에이전트가 메시지 수락 |
| `message-error` | 서버 → 클라이언트 | `{ error, details }` | 메시지 처리 에러 |
| `newMessage` | 서버 → 클라이언트 | `{ type, content, component? }` | AI/사용자의 새 메시지 |
| `component-message` | 클라이언트 → 서버 | `{ component }` | 컴포넌트 상호작용 |

#### 헬스 이벤트

| 이벤트 | 방향 | 페이로드 | 설명 |
|-------|-----------|---------|-------------|
| `ping` | 클라이언트 → 서버 | - | 헬스 체크 |
| `pong` | 서버 → 클라이언트 | - | 퐁 응답 |
| `health` | 클라이언트 → 서버 | - | 헬스 상태 요청 |
| `health` | 서버 → 클라이언트 | `{ status, connections }` | 헬스 상태 |

### Socket.IO 클라이언트 설정

#### 기본 설정
```typescript
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:3002', {
  path: '/chat',  // 네임스페이스
  auth: {
    token: yourJwtToken  // JWT 토큰 전송
  }
});

socket.on('connect', () => {
  console.log('연결됨:', socket.id);
});

socket.on('disconnect', () => {
  console.log('연결 끊김');
});
```

#### 방 참여
```typescript
socket.emit('joinRoom', {
  room: 'page-123',
  userId: 'user-123',
  wedding_id: 'wedding-123'
});

socket.on('session-info', (data) => {
  console.log('세션 ID:', data.session_id);
  const sessionId = data.session_id;
});
```

#### 채팅 메시지 전송
```typescript
socket.emit('chat-message', {
  text: '결혼식이 언제인가요?',
  session_id: sessionId,
  room: 'page-123',
  userId: 'user-123',
  wedding_id: 'wedding-123',
  timestamp: Date.now()
});

socket.on('message-accepted', (data) => {
  console.log('메시지 수락됨:', data.message_id);
});

socket.on('newMessage', (message) => {
  console.log('새 메시지:', message);

  if (message.type === 'text') {
    // 텍스트 메시지
    console.log('내용:', message.content);
  } else if (message.type === 'component') {
    // 컴포넌트 메시지 (예: AgentSuggestMessage)
    console.log('컴포넌트:', message.component);
  }
});
```

#### 에러 처리
```typescript
socket.on('message-error', (error) => {
  console.error('메시지 에러:', error.error);
  console.error('세부사항:', error.details);
});

socket.on('connect_error', (error) => {
  console.error('연결 에러:', error.message);
});
```

#### Socket.IO용 React Hook
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
      console.log('연결됨');
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

## 에러 처리

### 에러 응답 형식

```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": "Validation failed"
}
```

### 일반적인 HTTP 상태 코드

| 상태 | 의미 | 예시 |
|--------|---------|---------|
| 200 | 성공 | 로그인 성공, 프로필 조회됨 |
| 201 | 생성됨 | 사용자 등록됨, 페이지 게시됨 |
| 400 | 잘못된 요청 | 검증 실패 |
| 401 | 인증 안됨 | JWT 토큰이 없거나 유효하지 않음 |
| 403 | 금지됨 | 접근 거부 (관리자 아님) |
| 404 | 찾을 수 없음 | 페이지가 존재하지 않음 |
| 409 | 충돌 | 이메일이 이미 존재함 |
| 500 | 서버 에러 | 내부 서버 에러 |

### 프론트엔드에서 에러 처리

#### Axios 예시
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
          // 인증 안됨 - 로그인으로 리디렉션
          window.location.href = '/login';
          break;
        case 403:
          // 금지됨 - 에러 표시
          alert('접근 거부');
          break;
        case 404:
          // 찾을 수 없음
          alert('리소스를 찾을 수 없음');
          break;
        default:
          // 기타 에러
          alert('에러가 발생했습니다');
      }
    }
  }
};
```

## API 문서

### Swagger UI

백엔드는 다음에서 대화형 API 문서를 제공합니다:
```
http://localhost:3002/api/docs
```

기능:
- 브라우저에서 직접 API 엔드포인트 테스트
- 요청/응답 스키마 확인
- JWT 토큰으로 인증 테스트

## 다음 단계

- [03-agent-manager-ko.md](./03-agent-manager-ko.md) - AI 에이전트 시스템 학습
- [04-api-integration-ko.md](./04-api-integration-ko.md) - 더 많은 API 통합 예시
- [05-data-flow-ko.md](./05-data-flow-ko.md) - 완전한 데이터 흐름 이해
