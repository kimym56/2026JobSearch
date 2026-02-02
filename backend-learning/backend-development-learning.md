# Backend Development Learning Guide (Instructor Mode)

This guide expands on `docs/backend-auth-learning.md` and teaches backend
development from the ground up using this repo as the concrete example.
It is written for frontend engineers who are new to server-side work.

## 0) What a backend is (in plain terms)
A backend is a program that:
- receives requests (HTTP or WebSocket),
- checks permissions,
- validates input,
- runs business logic,
- reads/writes data,
- sends a response.

In this repo, the backend is a NestJS app that talks to Postgres, Redis,
AWS S3, and an AI agent server.

## 1) The core mental model (4 layers)
Think of every backend feature as a pipeline:
1) **Transport**: how the request arrives (HTTP or WebSocket).
2) **Boundary**: auth + validation (guards + DTOs).
3) **Business logic**: services and domain rules.
4) **Data + IO**: database, cache, files, external APIs.

If you can find these four layers in the code, you can understand any feature.

## 2) NestJS building blocks (what to recognize)
- **Module**: feature container that wires dependencies together.
- **Controller**: defines routes and delegates work to services.
- **Service**: where the real logic lives; should stay stateless.
- **Guard**: auth/permission gate before a handler runs.
- **Pipe**: input validation/transformation (DTOs + class-validator).
- **Filter**: error shaping + logging (global error handler).
- **Interceptor**: cross-cutting behavior (logging, caching, timing).
- **Repository/Entity**: database access + schema.

If you are ever lost, jump to the service file for that feature.

## 3) Request lifecycle (walkthrough)
Typical HTTP request flow in this repo:
1) Express receives the request.
2) Guard runs (auth check).
3) Pipe validates DTO.
4) Controller calls service.
5) Service uses repositories or external clients.
6) Response is returned or an exception is thrown.

Global behavior is configured in `backend/src/main.ts`:
- `ValidationPipe` handles DTO validation.
- `HttpExceptionFilter` unifies error responses.

## 4) Data flow patterns you will see
### 4.1 Synchronous HTTP API (most endpoints)
Controller -> Service -> Repository -> DB -> Service -> Response

### 4.2 Real-time chat (WebSocket + Redis)
Client -> WebSocket gateway -> ChatService -> Redis pub/sub -> Gateway -> Client

### 4.3 Async agent processing
ChatService -> AgentService -> Agent server -> Redis -> WebSocket -> Client

### 4.4 File uploads (S3)
Client -> FileController -> FileService -> S3Service -> S3 -> Response

These patterns repeat across features. Learn one and reuse it.

## 5) Backend fundamentals (teach these first)
### 5.1 HTTP basics
- **Verb**: GET, POST, PATCH, DELETE.
- **Path**: `/api/auth/login`.
- **Headers**: `Authorization: Bearer <token>`.
- **Body**: JSON payload validated via DTOs.
- **Status codes**: 200/201 OK, 400 validation errors, 401 auth errors, 409 conflict.

### 5.2 Authentication and authorization
Auth is the first real-world backend topic:
- Login/register via credentials.
- Issue a JWT.
- Protect routes with `JwtAuthGuard`.

This is already documented in `docs/backend-auth-learning.md`.

### 5.3 Validation and DTOs
- DTOs define expected input shape.
- `class-validator` rejects invalid requests.
- Validation lives at the boundary (controller), not deep in services.

### 5.4 Error handling
Use Nest exceptions (`UnauthorizedException`, `ConflictException`, etc.).
Errors are formatted by `HttpExceptionFilter`.

### 5.5 Data access
Use repositories instead of raw queries.
- Entities map to tables.
- Repositories encapsulate queries.
- Services call repositories, never the other way around.

## 6) What to inspect in this repo (guided tour)
Start with auth, then expand outward:
1) `ui/src/services/authService.ts`
2) `backend/src/auth/auth.controller.ts`
3) `backend/src/auth/local.strategy.ts`
4) `backend/src/auth/auth.service.ts`
5) `backend/src/database/user.repository.ts`
6) `backend/src/auth/jwt.strategy.ts`
7) `backend/src/entities/user.entity.ts`

Then continue:
- `backend/src/chat/chat.service.ts`
- `backend/src/chat/redis.service.ts`
- `backend/src/file/file.service.ts`
- `backend/src/file/s3.service.ts`

## 7) How to read backend code as a frontend dev
Use this checklist:
- What is the route?
- Which guard is applied?
- Which DTO is validated?
- What service is called?
- Which repository or external client is used?
- What is returned to the client?

You can trace any feature in 10 minutes with this pattern.

## 8) Environment + config (what typically breaks)
Config is loaded from `.env` via `ConfigModule`:
- JWT secret, DB host/port, AWS keys.
- Missing env values are the most common runtime errors.

If something fails in dev:
- Check `.env/backend/.env` and `backend/.env`.
- Confirm DB and Redis are running.
- Verify `VITE_API_URL` is correct in the frontend.

## 9) Testing mindset (how to teach it)
Teach testing in layers:
1) **Unit tests**: services and helpers (mock repositories).
2) **Integration tests**: controllers + real DB or test DB.
3) **E2E tests**: full HTTP flow.

Start small: test one auth service method, then expand to a controller test.

## 10) Common mistakes (and how to debug)
- **401 on login**: guard runs before DTO validation; check email/password.
- **404 on auth routes**: missing `/api` prefix mismatch.
- **500 on DB queries**: missing env or migration problems.
- **CORS errors**: frontend base URL mismatch.
- **WebSocket not working**: check Redis and gateway config.

Debug pattern:
1) Confirm route and method.
2) Inspect logs in `WinstonLoggerService`.
3) Verify DTO and validation rules.
4) Confirm DB state or external service availability.

## 11) Teaching roadmap (suggested order)
1) HTTP + REST basics
2) Auth flow (login/register/JWT)
3) Validation + DTOs
4) Service/repository pattern
5) Error handling
6) Real-time (WebSocket + Redis)
7) File uploads (S3)
8) Observability (logging, Swagger)

Each topic should include:
- One endpoint walk-through
- One service deep dive
- One test example

## 12) Practice exercises (use the repo)
1) Add a new `GET /api/auth/me` route using `JwtAuthGuard`.
2) Create a `GET /api/health/details` endpoint with DB + Redis checks.
3) Add a DTO with stricter validation rules and confirm it rejects bad input.
4) Write one unit test for a service method (mock repository).
5) Add a simple logging interceptor for request timing.

These exercises reinforce real production patterns without huge scope.

---

If you want, I can:
- turn this into a lesson plan with slides,
- add visual diagrams for each flow,
- write exercises as guided TODOs in code.
