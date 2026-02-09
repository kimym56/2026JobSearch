# API Integration Guide

This guide provides practical examples and complete code for integrating with the Mocheong backend APIs from your frontend application.

## Table of Contents

1. [REST API Client Setup](#rest-api-client-setup)
2. [Authentication](#authentication)
3. [Socket.IO Client Setup](#socket-io-client-setup)
4. [Complete Integration Examples](#complete-integration-examples)
5. [Error Handling Patterns](#error-handling-patterns)

## REST API Client Setup

### Using Axios

#### Basic Configuration

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

    // Request interceptor
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

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
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

### Using Fetch

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
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
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

## Authentication

### Login Flow

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

  // Store token
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

## Socket.IO Client Setup

### Basic Socket.IO Setup

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
      console.log('Socket connected:', this.socket?.id);
      this.emit('connect');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.emit('disconnect');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.emit('error', error);
    });

    // Forward all events to registered listeners
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

    // Cleanup: return unsubscribe function
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
import { useEffect, useState, useCallback, useRef } from 'react';
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

  // Connect to socket
  useEffect(() => {
    if (!token) return;

    socketClient.connect(token);
    setConnected(socketClient.isConnected);

    // Cleanup on unmount
    return () => {
      socketClient.disconnect();
    };
  }, [token]);

  // Join room when connected
  useEffect(() => {
    if (!connected || !room) return;

    socketClient.joinRoom(room, userId, weddingId);

    return () => {
      socketClient.leaveRoom(room, userId);
    };
  }, [connected, room, userId, weddingId]);

  // Listen for session info
  useEffect(() => {
    const unsubscribe = socketClient.on('session-info', (data: any) => {
      setSessionId(data.session_id);
    });

    return () => unsubscribe();
  }, []);

  // Listen for new messages
  useEffect(() => {
    const unsubscribe = socketClient.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      setIsTyping(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for message accepted
  useEffect(() => {
    const unsubscribe = socketClient.on('message-accepted', () => {
      setIsTyping(true);
    });

    return () => unsubscribe();
  }, []);

  // Listen for errors
  useEffect(() => {
    const unsubscribe = socketClient.on('message-error', (error: any) => {
      console.error('Message error:', error);
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

## Complete Integration Examples

### Example: Login Page

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
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example: Chat Component

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

  // Auto-scroll to bottom
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
        Connection: {connected ? 'Connected' : 'Disconnected'}
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
        {isTyping && <p>AI is typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
        disabled={!connected}
      />
      <button onClick={handleSend} disabled={!connected || !input.trim()}>
        Send
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

## Error Handling Patterns

### API Error Handler

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
          message: 'Please log in to continue',
          status: 401,
          code: 'UNAUTHORIZED',
        };
      case 403:
        return {
          message: 'You do not have permission to perform this action',
          status: 403,
          code: 'FORBIDDEN',
        };
      case 404:
        return {
          message: 'Resource not found',
          status: 404,
          code: 'NOT_FOUND',
        };
      case 409:
        return {
          message: data.message || 'Resource already exists',
          status: 409,
          code: 'CONFLICT',
        };
      default:
        return {
          message: data.message || 'An unexpected error occurred',
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
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

export const showErrorToast = (error: ApiError) => {
  // Use your toast library here
  console.error('[API Error]', error.message);
  alert(error.message);
};
```

### Usage Example

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

## Next Steps

- [05-data-flow.md](./05-data-flow.md) - Understand complete data flows
- [02-nestjs-backend.md](./02-nestjs-backend.md) - Learn more about REST endpoints
- [03-agent-manager.md](./03-agent-manager.md) - Learn about the AI agent system
