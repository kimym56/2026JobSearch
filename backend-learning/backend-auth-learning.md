# Backend Learning Notes (Auth First)

This note is for frontend engineers starting to read the NestJS backend. It walks through the auth flow end-to-end using the current code, with extra stack context so the code feels familiar.

## 0) Mental model (NestJS in 60 seconds)
- **Controller**: defines HTTP routes (like React Router for API). Example: `AuthController`.
  It maps URL + method to a handler and should stay thin (mostly call services).
- **Service**: business logic (like a shared hook or service layer). Example: `AuthService`.
  Services are injected into controllers and can be reused across modules.
- **Guard**: runs before route handlers to allow/deny requests. Example: `LocalAuthGuard`, `JwtAuthGuard`.
  Think of it as a route-level gatekeeper; if it fails, the handler never runs.
- **Strategy**: Passport strategy implementation for auth (local login, JWT). Example: `LocalStrategy`, `JwtStrategy`.
  This is where credential checks happen (password validation or JWT verification).
- **DTO**: request validation schema. Example: `LoginDto`, `RegisterDto`.
  DTOs define expected input and are validated by pipes.
- **Repository/Entity**: database access and schema. Example: `UserRepository`, `User`.
  Entities map to tables; repositories are the query layer.

## 1) NestJS + stack primer (frontend-friendly)
### 1.1 Core building blocks (glossary)
- **Module**: feature container that wires controllers + providers. Example: `AuthModule`.
  Similar to a React feature folder, but also declares DI bindings.
- **Provider**: injectable class created by Nest's DI container. Services + repositories are providers.
  Providers are singletons by default, so avoid storing request-specific state in them.
- **Controller**: route definitions (`@Controller`, `@Get`, `@Post`).
  Controllers receive validated data and call services.
- **Guard**: auth/permission gate (`@UseGuards`).
  Guards run before any handler logic.
- **Pipe**: validation/transformation (`ValidationPipe`, `class-validator`).
  Pipes can reject invalid input or transform types (e.g., string -> number).
- **Filter**: error handling (like a global error boundary).
  Filters shape error responses and can log errors consistently.
- **Interceptor**: response mapping, logging, caching, timing (none configured globally here).
  Interceptors wrap a handler like middleware around a function call.

### 1.2 Request lifecycle (typical order)
1. Express receives the request (Nest uses `@nestjs/platform-express` here).
2. Guards run (auth checks).
3. Pipes validate/transform DTOs.
4. Controller method runs -> calls Services -> Repositories -> DB.
5. Response is sent. Errors are caught by exception filters.

In this repo, global `ValidationPipe` and `HttpExceptionFilter` are set in
`backend/src/main.ts`.

### 1.3 Module + DI wiring in this repo
Root module: `backend/src/app.module.ts`
- Imports `ConfigModule` (global), `TypeOrmModule`, and feature modules
  (`AuthModule`, `PaymentModule`, `InvitationModule`, `FileModule`,
  `AdminModule`, `ChatModule`).
- Providers and controllers inside each module are created via DI.
  You rarely `new` classes manually; Nest constructs them for you.

### 1.4 Stack components you will see in backend
- **NestJS** for routing + DI + app structure.
- **Passport** strategies for auth (local + JWT).
- **TypeORM + Postgres** for persistence.
- **Socket.IO + Redis** for real-time chat (see `backend/src/chat`).
- **Swagger** for API docs (`/api/docs`).
- **Winston** for structured logging.

### 1.5 Config and environment
Config is loaded by `ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })`
in `backend/src/app.module.ts`.

- Secrets like `JWT_SECRET` are read by `AuthModule` and `JwtStrategy`.
- DB settings (`DB_HOST`, `DB_PORT`, etc.) are read in `TypeOrmModule` config.
- The repo includes example env files under `.env/backend/` for reference.
  The `setup-env.sh` script can generate local env files from templates.
  If you run the backend directly from `backend/`, make sure a `backend/.env`
  exists (or export environment variables). In Docker, env files are usually
  read from `.env/backend/.env`.

### 1.6 TypeORM basics (how DB code maps)
- **Entity** = database table schema (e.g. `User`).
- **Repository** = query entrypoint (customized here in `UserRepository`).
- This repo uses a small `BaseRepository` for common CRUD helpers.
- `synchronize` is enabled in non-production by default (see `AppModule`).
  That means schema can auto-sync in dev; production should use migrations.

### 1.7 Error handling + logging
- Global error format is handled by `HttpExceptionFilter`
  (`backend/src/common/http-exception.filter.ts`).
- Logs are written with `WinstonLoggerService`
  (`backend/src/logger/winston-logger.service.ts`).
  When you throw NestJS exceptions (e.g., `UnauthorizedException`), the filter
  turns them into a consistent JSON shape and logs them.

### 1.8 Service layer concepts (mapped to this repo)
- **`@Injectable()` services are DI-managed singletons** by default. Keep them
  stateless and pass request-specific data as method params.
- **Constructor injection** is the standard pattern. Example: `AuthService`
  receives `UserRepository` and `JwtService` via its constructor.
- **Service composition** is common: services call repositories, other services,
  or external clients, but controllers stay thin.
- **Lifecycle hooks** show up in `RedisService`, which implements
  `OnModuleInit`/`OnModuleDestroy` to connect/disconnect Redis when the module
  starts/stops.
- **Module exports** decide which services can be used elsewhere. Example:
  `ChatModule` exports `ChatService`, `AgentService`, `RedisService`,
  `SessionService`.
- **External providers** are brought in via modules:
  `HttpModule` -> `HttpService` (Axios wrapper),
  `JwtModule` -> `JwtService`,
  `TypeOrmModule` -> repositories/entities.

Concrete examples in this codebase:
- `backend/src/auth/auth.service.ts`: validates credentials, hashes passwords,
  issues JWTs.
- `backend/src/invitation/invitation.service.ts`: creates and validates invite
  codes (UUID, expiry).
- `backend/src/payment/payment.service.ts`: payment business logic (see module).
- `backend/src/file/file.service.ts` + `backend/src/file/s3.service.ts`:
  file handling and AWS S3 integration.
- `backend/src/chat/chat.service.ts`: chat persistence (save/read messages).
- `backend/src/chat/agent.service.ts`: calls agent manager via HTTP.
- `backend/src/chat/redis.service.ts`: pub/sub with Redis, forwards to Socket.IO.
- `backend/src/chat/session.service.ts`: manages chat sessions in memory.
  
Tip: when you see a controller or gateway, look at the service it calls; the
service is usually the best place to understand the real business logic.

## 2) Auth endpoints and where they live
Controller: `backend/src/auth/auth.controller.ts`

- `POST /api/auth/register` creates a new user.
- `POST /api/auth/login` validates credentials and returns a JWT.
- `POST /api/auth/profile` returns the current user (protected).

The `/api` prefix is configured in `backend/src/main.ts` via `app.setGlobalPrefix('api')`.

## 3) Frontend entry point (what you already know)
Frontend API calls: `ui/src/services/authService.ts`

- `login(email, password)` -> `POST {API_BASE_URL}/api/auth/login`
- `register(name, email, password)` -> `POST {API_BASE_URL}/api/auth/register`
- `getProfile()` -> current frontend calls `POST {API_BASE_URL}/auth/profile`

Note: backend uses the global `/api` prefix, so the backend endpoint is
`/api/auth/profile`. If `API_BASE_URL` does not include `/api`, then
`getProfile()` should call `/api/auth/profile` to match the backend.
`API_BASE_URL` is read from Vite env (`VITE_API_URL`), with a localhost fallback.

## 4) Login flow (step-by-step)
**Goal**: user sends email + password, gets `access_token` (JWT).

### 4.1 Request enters the controller
File: `backend/src/auth/auth.controller.ts`

Route:
```ts
@UseGuards(LocalAuthGuard)
@Post('login')
async login(@Request() req, @Body(ValidationPipe) _loginDto: LoginDto) {
  return this.authService.login(req.user);
}
```

- `LocalAuthGuard` runs before the controller method.
- `LoginDto` validates `email` and `password` with `class-validator`.
- `_loginDto` is unused but forces validation to run on the body.
  Note: for this login route, the guard runs before pipes, so invalid payloads
  can return 401 (from the strategy) instead of a 400 validation error.

### 4.2 LocalAuthGuard triggers LocalStrategy
File: `backend/src/auth/local-auth.guard.ts`
```ts
export class LocalAuthGuard extends AuthGuard('local') {}
```

File: `backend/src/auth/local.strategy.ts`
```ts
super({ usernameField: 'email' });
```
```ts
async validate(email: string, password: string) {
  const user = await this.authService.validateUser(email, password);
  if (!user) throw new UnauthorizedException();
  return user;
}
```

- Passport reads `email` + `password` from the request body.
- `validate()` returns a user object that becomes `req.user`.
- If invalid, `UnauthorizedException` is thrown and the controller is skipped.

### 4.3 AuthService validates password
File: `backend/src/auth/auth.service.ts`
```ts
const user = await this.userRepository.findByEmailWithPassword(email);
if (user && (await bcrypt.compare(password, user.password))) {
  const { password: _password, ...result } = user;
  return result;
}
return null;
```

- Passwords are stored hashed using `bcrypt`.
- `bcrypt.compare()` safely compares the plain password to the hash.
- `findByEmailWithPassword()` pulls the `password` field explicitly so default
  queries don't accidentally expose hashes.

### 4.4 Controller returns JWT
File: `backend/src/auth/auth.service.ts`
```ts
const payload = { email: user.email, sub: user.id };
return {
  access_token: this.jwtService.sign(payload),
  user: { id, email, name, isAdmin }
};
```

- JWT contains `sub` (user id) and `email`.
- Frontend stores it in localStorage via `setToken()`.
- JWT is stateless, so the server does not keep sessions in memory.

## 5) Register flow (step-by-step)
File: `backend/src/auth/auth.controller.ts`

Route:
```ts
@Post('register')
async register(@Body(ValidationPipe) registerDto: RegisterDto) {
  return this.authService.register(
    registerDto.email,
    registerDto.password,
    registerDto.name,
  );
}
```

### 5.1 Register DTO validation
File: `backend/src/auth/dto/register.dto.ts`
- `email`: required + email format
- `password`: required + min length 6
- `name`: optional

Validation happens before the controller method is called.

### 5.2 AuthService creates user
File: `backend/src/auth/auth.service.ts`
```ts
const existingUser = await this.userRepository.findByEmail(email);
if (existingUser) throw new ConflictException('User already exists');

const hashedPassword = await bcrypt.hash(password, 10);
return this.userRepository.create({ email, password: hashedPassword, name });
```

- `bcrypt.hash(password, 10)` uses 10 salt rounds for hashing.
- If a duplicate email is found, a 409 Conflict is returned.

## 6) Profile flow (JWT protected)
File: `backend/src/auth/auth.controller.ts`

Route:
```ts
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Post('profile')
getProfile(@Request() req) {
  return req.user;
}
```

### 6.1 JwtAuthGuard triggers JwtStrategy
File: `backend/src/auth/jwt-auth.guard.ts`
```ts
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

File: `backend/src/auth/jwt.strategy.ts`
```ts
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
secretOrKey: configService.get('JWT_SECRET'),
```

- JWT is expected in `Authorization: Bearer <token>`.
- `validate()` loads the user from DB and returns `{ id, email, isAdmin }`.
- That object becomes `req.user` in the controller.
- If the token is missing or invalid, the guard responds with 401.

## 7) Data model and repository
Entity: `backend/src/entities/user.entity.ts`
- `id` (uuid)
- `email` (unique)
- `password` (hashed)
- `name`, `isAdmin`, `isActive`, timestamps

Repository: `backend/src/database/user.repository.ts`
- `findByEmail()`
- `findByEmailWithPassword()`

Base repo: `backend/src/database/base-repository.ts` provides common CRUD.
Custom repositories keep auth logic clean by hiding query details.

## 8) Auth module wiring
File: `backend/src/auth/auth.module.ts`

- Registers Passport, JWT, and TypeORM User entity
- Provides AuthService + strategies + guards
- JWT secret loaded from `JWT_SECRET` env

`JwtModule.registerAsync` reads env at runtime so secrets are not hardcoded in
source files.

## 9) Useful traces (read in this order)
1) `ui/src/services/authService.ts`
2) `backend/src/auth/auth.controller.ts`
3) `backend/src/auth/local.strategy.ts`
4) `backend/src/auth/auth.service.ts`
5) `backend/src/database/user.repository.ts`
6) `backend/src/auth/jwt.strategy.ts`
7) `backend/src/entities/user.entity.ts`

Following this order lets you trace the path from UI -> HTTP -> auth -> DB -> JWT.

## 10) Things to confirm while learning
- Base URL vs `/api` prefix: ensure frontend calls match backend routes.
- JWT expiration: `auth.module.ts` uses `expiresIn: '24h'` currently (not `JWT_EXPIRES_IN`).
- Swagger: `http://localhost:3000/api/docs` is the easiest way to test login/register.

If you see unexpected 404s, the `/api` prefix mismatch is the most common cause.

## 11) Next backend topics after auth
- Request validation + pipes
- Error handling and filters (`backend/src/common/http-exception.filter.ts`)
- WebSocket + real-time flow
- File uploads + S3

These topics explain how real-time chat, file uploads, and errors work end-to-end.

If you want, I can add a follow-up doc that explains WebSocket chat flow or database patterns in detail.
