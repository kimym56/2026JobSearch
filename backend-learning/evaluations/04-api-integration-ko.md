# API 통합 가이드

이 가이드는 프론트엔드 애플리케이션에서 모청 백엔드 API와 통합하기 위한 실용적인 예제와 완전한 코드를 제공합니다.

## 목차

1. [REST API 클라이언트 설정](#rest-api-클라이언트-설정)
2. [인증](#인증)
3. [Socket.IO 클라이언트 설정](#socket-io-클라이언트-설정)
4. [완전한 통합 예시](#완전한-통합-예시)
5. [에러 처리 패턴](#에러-처리-패턴)

## REST API 클라이언트 설정

### Axios 사용

#### 기본 구성

```typescript
// src/lib/api.ts
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined'
          ? localStorage.getItem('token')
          : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // 토큰 삭제 및 로그인으로 리디렉션
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

### Fetch 사용

```typescript
// src/lib/api-fetch.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      const error = await response.json().catch(() => ({ message: '네트워크 에러' }));
      throw new Error(error.message || '요청 실패');
    }
    return response.json();
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    const response = await fetch(`${API_BASE_URL}${url}${queryString}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
```

## 인증

### 로그인 플로우

```typescript
// src/lib/auth.ts
import { apiClient } from './api';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    isAdmin: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
}

export const login = async (email: string, password: string): Promise<User> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  // 토큰 저장
  localStorage.setItem('token', response.access_token);
  localStorage.setItem('user', JSON.stringify(response.user));

  return response.user;
};

export const register = async (
  email: string,
  password: string,
  name?: string
): Promise<User> => {
  const response = await apiClient.post<User>('/auth/register', {
    email,
    password,
    name,
  });

  return response;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};
```

### React Auth Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, logout, getCurrentUser, User } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const loggedInUser = await login(email, password);
    setUser(loggedInUser);
    router.push('/dashboard');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/');
  };

  return {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!user,
  };
};
```

## Socket.IO 클라이언트 설정

### 기본 Socket.IO 설정

```typescript
// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002';

class SocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      path: '/chat',
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('소켓 연결됨:', this.socket?.id);
      this.emit('connect');
    });

    this.socket.on('disconnect', () => {
      console.log('소켓 연결 끊김');
      this.emit('disconnect');
    });

    this.socket.on('connect_error', (error) => {
      console.error('소켓 연결 에러:', error.message);
      this.emit('error', error);
    });

    // 등록된 모든 리스너로 이벤트 전달
    this.socket?.onAny((event, ...args) => {
      const eventListeners = this.listeners.get(event) || [];
      eventListeners.forEach((listener) => listener(...args));
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinRoom(room: string, userId: string, weddingId?: string) {
    this.socket?.emit('joinRoom', {
      room,
      userId,
      wedding_id: weddingId,
    });
  }

  leaveRoom(room: string, userId: string) {
    this.socket?.emit('leaveRoom', { room, userId });
  }

  sendChatMessage(data: {
    text: string;
    session_id: string;
    room: string;
    userId: string;
    wedding_id?: string;
    chat_history?: any[];
  }) {
    this.socket?.emit('chat-message', {
      ...data,
      timestamp: Date.now(),
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    // 정리: 구독 취소 함수 반환
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  private emit(event: string, ...args: any[]) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach((listener) => listener(...args));
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketClient = new SocketClient();
```

### React Socket Hook

```typescript
// src/hooks/useChatSocket.ts
import { useEffect, useState, useCallback } from 'react';
import { socketClient } from '@/lib/socket';
import { getToken } from '@/lib/auth';

export interface Message {
  type: 'text' | 'component';
  content?: string;
  component?: any;
  timestamp: number;
}

export const useChatSocket = (room: string, userId: string, weddingId?: string) => {
  const [connected, setConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const token = getToken();

  // 소켓 연결
  useEffect(() => {
    if (!token) return;

    socketClient.connect(token);
    setConnected(socketClient.isConnected);

    // 언마운트 시 정리
    return () => {
      socketClient.disconnect();
    };
  }, [token]);

  // 연결 시 방 참여
  useEffect(() => {
    if (!connected || !room) return;

    socketClient.joinRoom(room, userId, weddingId);

    return () => {
      socketClient.leaveRoom(room, userId);
    };
  }, [connected, room, userId, weddingId]);

  // 세션 정보 수신 대기
  useEffect(() => {
    const unsubscribe = socketClient.on('session-info', (data: any) => {
      setSessionId(data.session_id);
    });

    return () => unsubscribe();
  }, []);

  // 새 메시지 수신 대기
  useEffect(() => {
    const unsubscribe = socketClient.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      setIsTyping(false);
    });

    return () => unsubscribe();
  }, []);

  // 메시지 수락 수신 대기
  useEffect(() => {
    const unsubscribe = socketClient.on('message-accepted', () => {
      setIsTyping(true);
    });

    return () => unsubscribe();
  }, []);

  // 에러 수신 대기
  useEffect(() => {
    const unsubscribe = socketClient.on('message-error', (error: any) => {
      console.error('메시지 에러:', error);
      setIsTyping(false);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!sessionId || !room) return;

    socketClient.sendChatMessage({
      text,
      session_id: sessionId,
      room,
      userId,
      wedding_id: weddingId,
    });
  }, [sessionId, room, userId, weddingId]);

  return {
    connected,
    sessionId,
    messages,
    isTyping,
    sendMessage,
  };
};
```

## 완전한 통합 예시

### 예시: 로그인 페이지

```typescript
// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('유효하지 않은 이메일 또는 비밀번호입니다');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      {error && <p>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
```

### 예시: 채팅 컴포넌트

```typescript
// src/components/Chat.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatSocket } from '@/hooks/useChatSocket';

interface ChatProps {
  room: string;
  userId: string;
  weddingId?: string;
}

export default function Chat({ room, userId, weddingId }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    connected,
    messages,
    isTyping,
    sendMessage,
  } = useChatSocket(room, userId, weddingId);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div>
      <div>
        연결 상태: {connected ? '연결됨' : '연결 안됨'}
      </div>

      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.type === 'text' ? (
              <p>{msg.content}</p>
            ) : (
              <ComponentRenderer component={msg.component} />
            )}
          </div>
        ))}
        {isTyping && <p>AI가 입력 중...</p>}
        <div ref={messagesEndRef} />
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="메시지를 입력하세요..."
        disabled={!connected}
      />
      <button onClick={handleSend} disabled={!connected || !input.trim()}>
        전송
      </button>
    </div>
  );
}

function ComponentRenderer({ component }: { component: any }) {
  switch (component?.type) {
    case 'AgentSuggestMessage':
      return (
        <div>
          {component.props.suggestions.map((suggestion: any, idx: number) => (
            <button key={idx}>
              {suggestion.displayText}
            </button>
          ))}
        </div>
      );
    default:
      return <pre>{JSON.stringify(component, null, 2)}</pre>;
  }
}
```

## 에러 처리 패턴

### API 에러 핸들러

```typescript
// src/lib/errors.ts
import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as any;

    switch (status) {
      case 401:
        return {
          message: '로그인이 필요합니다',
          status: 401,
          code: 'UNAUTHORIZED',
        };
      case 403:
        return {
          message: '이 작업을 수행할 권한이 없습니다',
          status: 403,
          code: 'FORBIDDEN',
        };
      case 404:
        return {
          message: '리소스를 찾을 수 없습니다',
          status: 404,
          code: 'NOT_FOUND',
        };
      case 409:
        return {
          message: data.message || '리소스가 이미 존재합니다',
          status: 409,
          code: 'CONFLICT',
        };
      default:
        return {
          message: data.message || '예기치 않은 에러가 발생했습니다',
          status,
          code: 'UNKNOWN_ERROR',
        };
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'CLIENT_ERROR',
    };
  }

  return {
    message: '예기치 않은 에러가 발생했습니다',
    code: 'UNKNOWN_ERROR',
  };
};

export const showErrorToast = (error: ApiError) => {
  // 토스트 라이브러리 사용
  console.error('[API Error]', error.message);
  alert(error.message);
};
```

### 사용 예시

```typescript
import { apiClient } from '@/lib/api';
import { handleApiError, showErrorToast } from '@/lib/errors';

const someApiCall = async () => {
  try {
    const result = await apiClient.post('/some-endpoint', { data: 'value' });
    return result;
  } catch (error) {
    const apiError = handleApiError(error);
    showErrorToast(apiError);
    throw apiError;
  }
};
```

## 다음 단계

- [05-data-flow-ko.md](./05-data-flow-ko.md) - 완전한 데이터 흐름 이해
- [02-nestjs-backend-ko.md](./02-nestjs-backend-ko.md) - REST 엔드포인트에 대해 더 알아보기
- [03-agent-manager-ko.md](./03-agent-manager-ko.md) - AI 에이전트 시스템 학습
