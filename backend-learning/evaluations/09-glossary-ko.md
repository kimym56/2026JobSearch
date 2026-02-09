# 용어집

백엔드 및 기술 용어 설명.

## ㄱ

- **GUI (Graphical User Interface)**: 그래픽 사용자 인터페이스

## ㄷ

- **Database (데이터베이스)**: 구조화된 데이터의 체계적인 모음 (이 프로젝트에서 PostgreSQL)
- **Docker**: 컨테이너에서 애플리케이션을 개발, 배포, 실행하기 위한 플랫폼
- **DTO (Data Transfer Object)**: 프로세스 간에 데이터를 전달하는 객체

## ㅂ

- **Backend (백엔드)**: 서버 측 웹 애플리케이션
- **Broker (브로커)**: 생산자와 소비자 사이의 중재자 (Redis가 Celery 브로커 역할)

## ㅅ

- **Service (서비스)**: 비즈니스 로직을 포함하는 `@Injectable()` 데코레이터가 있는 클래스
- **Session (세션)**: 사용자와 시스템 간의 임시 상호작용 정보
- **Socket.IO**: 실시간 양방향 통신을 위한 라이브러리
- **Swagger**: API 문서화를 위한 OpenAPI 사양

## ㅇ

- **API (Application Programming Interface)**: 소프트웨어 구성 요소가 상호 작용하는 방법에 대한 규칙 세트
- **Async (비동기)**: 완료를 기다리는 동안 프로그램을 차단하지 않는 작업
- **Authentication (인증)**: 사용자 또는 시스템의 신원 확인
- **Authorization (권한 부여)**: 인증된 사용자가 수행할 수 있는 작업 결정
- **Entity (엔티티)**: TypeORM에서 데이터베이스 테이블에 매핑되는 클래스
- **Environment Variables (환경 변수)**: 코드 외부에서 설정된 구성 값

## ㅈ

- **Controller (컨트롤러)**: NestJS에서 HTTP 요청을 처리하고 응답을 반환
- **JWT (JSON Web Token)**: 전송할 클레임을 나타내는 컴팩트하고 URL 안전한 수단

## ㅊ

- **Celery**: Python용 분산 작업 큐, 백그라운드 작업 처리에 사용

## ㅍ

- **FastAPI**: API 구축을 위한 현대적 Python 웹 프레임워크
- **Frontend (프론트엔드)**: 웹 애플리케이션의 클라이언트 측 (이 프로젝트에서 React/Next.js)
- **PostgreSQL**: 강력한 오픈 소스 관계형 데이터베이스 시스템
- **Pub/Sub**: 발행-구독 메시징 패턴 (이 프로젝트에서 Redis pub/sub)
- **Pydantic**: Python 타입 어노테이션을 사용한 데이터 검증

## ㅎ

- **WebSocket**: 전이중 통신 채널을 제공하는 통신 프로토콜

## 영문

- **CORS**: Cross-Origin Resource Sharing - 웹 페이지에서 제한된 리소스를 허용하는 메커니즘
- **LangChain**: 대형 언어 모델로 애플리케이션 구축을 위한 프레임워크
- **LLM (Large Language Model)**: GPT-4와 같은 AI 모델
- **Microservices (마이크로서비스)**: 애플리케이션을 서비스 컬렉션으로 구조화하는 아키텍처 스타일
- **Module (모듈)**: 애플리케이션 구조를 정리하는 `@Module()`로 주석이 달린 클래스
- **Middleware (미들웨어)**: 요청 및 응답 객체에 액세스할 수 있는 함수
- **ORM (Object-Relational Mapping)**: 호환되지 않는 시스템 간 데이터 변환 기술 (TypeORM)
- **Redis**: 캐시 및 메시지 브로커로 사용되는 인메모리 데이터 구조 저장소
- **Repository (리포지토리)**: 데이터베이스 작업을 추상화하는 데이터 액세스 패턴
- **REST (Representational State Transfer)**: API를 위한 아키텍처 스타일
- **Task Queue (작업 큐)**: 작업을 비동기적으로 실행하는 메커니즘 (Celery)
- **TypeORM**: TypeScript 및 JavaScript용 ORM
- **Winston**: Node.js 애플리케이션용 로거

## 다음 단계

- [01-architecture-ko.md](./01-architecture-ko.md) - 시스템 아키텍처 학습
