# 데이터 흐름 가이드

이 가이드는 일반적인 작업에 대해 데이터가 모청 시스템을 통해 어떻게 흐르는지에 대한 상세한 설명을 제공합니다.

## 목차

1. [사용자 등록 플로우](#사용자-등록-플로우)
2. [로그인 및 인증 플로우](#로그인-및-인증-플로우)
3. [채팅 메시지 플로우 (완전)](#채팅-메시지-플로우-완전)
4. [파일 업로드 플로우](#파일-업로드-플로우)
5. [페이지 게시 플로우](#페이지-게시-플로우)

## 사용자 등록 플로우

```mermaid
sequenceDiagram
    participant Frontend as 프론트엔드
    participant NestJS as NestJS API
    participant Postgres as PostgreSQL
    Frontend->>NestJS: POST /api/auth/register (email, password, name)
    NestJS->>NestJS: 이메일/비밀번호 검증
    NestJS->>NestJS: 비밀번호 해싱 (bcrypt)
    NestJS->>Postgres: INSERT INTO users
    Postgres-->>NestJS: 생성된 사용자
    NestJS-->>Frontend: 201 Created (user payload)
```

### 단계별 설명

1. **프론트엔드**: 사용자가 등록 폼 작성
2. **프론트엔드**: `{ email, password, name }`으로 `POST /api/auth/register` 전송
3. **NestJS**: 이메일 형식과 비밀번호 강도 검증
4. **NestJS**: bcrypt로 비밀번호 해싱 (10 라운드)
5. **PostgreSQL**: 해시된 비밀번호로 User 레코드 생성
6. **NestJS**: User 객체 반환 (비밀번호 제외)
7. **프론트엔드**: 성공 메시지 표시 또는 로그인으로 리디렉션

## 로그인 및 인증 플로우

```mermaid
sequenceDiagram
    participant Frontend as 프론트엔드
    participant NestJS as NestJS API
    participant Postgres as PostgreSQL
    participant JWT as JWT Service
    Frontend->>NestJS: POST /api/auth/login (email, password)
    NestJS->>NestJS: DTO 검증
    NestJS->>Postgres: 이메일로 사용자 조회
    Postgres-->>NestJS: 사용자 레코드 (해시 비밀번호 포함)
    NestJS->>NestJS: bcrypt.compare(plain, hashed)
    NestJS->>JWT: jwt.sign(payload)
    JWT-->>NestJS: 서명된 토큰
    NestJS-->>Frontend: 200 OK (token + user)
    Note over Frontend: 토큰을 localStorage에 저장하고 후속 요청의 Authorization Bearer 토큰으로 사용.
```

### 단계별 설명

1. **프론트엔드**: 사용자가 이메일과 비밀번호 입력
2. **프론트엔드**: `{ email, password }`로 `POST /api/auth/login` 전송
3. **NestJS**: 요청 DTO 검증
4. **NestJS**: 이메일로 PostgreSQL에서 사용자 조회
5. **PostgreSQL**: 사용자 레코드 반환 (해시된 비밀번호 포함)
6. **NestJS**: bcrypt로 제공된 비밀번호와 해시 비교
7. **NestJS JWT Service**: 페이로드 `{ email, sub: id }`로 JWT 토큰 생성
8. **NestJS**: `{ access_token, user }` 반환
9. **프론트엔드**: 토큰을 localStorage에 저장
10. **프론트엔드**: 모든 후속 요청에 `Authorization: Bearer {token}` 헤더에 토큰 포함

## 채팅 메시지 플로우 (완전)

가장 복잡한 플로우로, Socket.IO, HTTP, Redis, Celery, LangChain 에이전트가 포함됩니다.

```mermaid
sequenceDiagram
    participant FE as FE
    participant NB as NB
    participant FA as FA
    participant CW as CW
    participant LC as LC
    participant RD as RD
    FE->>NB: chat-message
    NB->>NB: 웨딩 컨텍스트 조회
    NB->>FA: POST /chat
    FA->>CW: Celery 작업 큐잉
    FA-->>NB: 202 Accepted
    NB-->>FE: message-accepted
    NB->>RD: chat 채널 구독
    CW->>LC: AI 에이전트 처리
    LC-->>CW: 생성된 응답
    CW->>RD: 응답 스트리밍 게시
    RD-->>NB: 구독 메시지 전달
    NB-->>FE: newMessage
```
약어: `FE` = 프론트엔드, `NB` = NestJS 백엔드, `FA` = FastAPI Agent Manager, `CW` = Celery Worker, `LC` = LangChain, `RD` = Redis.

### 상세 단계

1. **프론트엔드**: 사용자가 "결혼식이 언제인가요?" 입력
2. **프론트엔드 → NestJS**: 텍스트, 세션 정보로 Socket.IO emit `chat-message`
3. **NestJS**: 메시지 수신, `session_id` 및 `wedding_id` 추출
4. **NestJS → PostgreSQL**: 웨딩 페이지 컨텍스트 가져오기 (이름, 날짜, 장소 등)
5. **NestJS → FastAPI**: 메시지, session_id, wedding_context으로 HTTP POST `/chat`
6. **FastAPI**: Celery 작업 큐 `process_chat_message.delay(request_data)`
7. **FastAPI → NestJS**: `message_id`와 함께 202 Accepted 반환
8. **NestJS → 프론트엔드**: Socket.IO을 통해 `message-accepted` emit
9. **NestJS → Redis**: `chat:{session_id}` 채널 구독
10. **Celery Worker**: 큐에서 작업 수신
11. **Celery Worker → LangChain**: Main Agent로 메시지 처리
12. **Main Agent**: 호출할 하위 에이전트 결정 (Context, Map, Output)
13. **Context Agent**: 웨딩 정보 가져오기
14. **Main Agent**: 응답 생성
15. **Celery Worker → Redis**: `chat:{session_id}`에 응답 게시
16. **Redis → NestJS**: 구독자에게 메시지 전달
17. **NestJS → 프론트엔드**: Socket.IO을 통해 `newMessage` emit
18. **프론트엔드**: AI 응답 표시

## 파일 업로드 플로우

```mermaid
sequenceDiagram
    participant Frontend as 프론트엔드
    participant NestJS as NestJS API
    participant S3 as AWS S3
    participant Postgres as PostgreSQL
    Frontend->>NestJS: POST /api/file/upload (multipart/form-data)
    NestJS->>NestJS: 파일 검증 및 고유 파일명 생성
    NestJS->>S3: 업로드 파일 PUT
    S3-->>NestJS: 공개 URL 반환
    NestJS->>Postgres: 파일 메타데이터 INSERT
    NestJS-->>Frontend: 201 Created (file metadata payload)
```

## 페이지 게시 플로우

```mermaid
sequenceDiagram
    participant Frontend as 프론트엔드
    participant NestJS as NestJS API
    participant Postgres as PostgreSQL
    Frontend->>NestJS: POST /api/page/publish (title, slug, componentData)
    NestJS->>NestJS: 페이지 데이터 검증 및 slug 생성
    NestJS->>Postgres: BEGIN TRANSACTION
    NestJS->>Postgres: INSERT INTO pages
    NestJS->>Postgres: COMMIT
    Postgres-->>NestJS: 생성된 Page 레코드
    NestJS-->>Frontend: 201 Created (page payload)
```

## 다음 단계

- [03-agent-manager-ko.md](./03-agent-manager-ko.md) - AI 에이전트 처리 심층 분석
- [04-api-integration-ko.md](./04-api-integration-ko.md) - 통합을 위한 코드 예시
- [08-debugging-ko.md](./08-debugging-ko.md) - 데이터 흐름 문제 해결
