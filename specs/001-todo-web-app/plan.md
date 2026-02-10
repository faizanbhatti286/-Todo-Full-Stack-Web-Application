# Implementation Plan: Todo Full-Stack Web Application

**Branch**: `001-todo-web-app` | **Date**: 2026-02-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-web-app/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a multi-user Todo web application with JWT-authenticated RESTful API and responsive frontend. Users can register, sign in, and manage their personal tasks (create, read, update, delete, mark complete) with strict user isolation. Backend uses FastAPI with SQLModel ORM connected to Neon Serverless PostgreSQL. Frontend uses Next.js 16+ App Router with Better Auth for authentication. All task operations enforce JWT validation to ensure users can only access their own data.

## Technical Context

**Language/Version**:
- Backend: Python 3.9+
- Frontend: TypeScript/JavaScript with Next.js 16+

**Primary Dependencies**:
- Backend: FastAPI, SQLModel, python-jose (JWT), passlib (password hashing), psycopg2 (PostgreSQL driver)
- Frontend: Next.js 16+ (App Router), Better Auth, React 18+

**Storage**: Neon Serverless PostgreSQL (cloud-hosted PostgreSQL)

**Testing**:
- Backend: pytest, pytest-asyncio
- Frontend: Jest, React Testing Library
- E2E: Playwright or Cypress

**Target Platform**:
- Backend: Linux server (containerized deployment)
- Frontend: Web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)

**Project Type**: Web application (separate backend and frontend)

**Performance Goals**:
- API response time: <500ms for CRUD operations
- Frontend render: <3 seconds for task list display
- Support 100+ concurrent users

**Constraints**:
- JWT token validation required on all protected endpoints
- User data isolation enforced at database query level
- Responsive design: 320px (mobile) to 1920px (desktop)
- Shared BETTER_AUTH_SECRET between frontend and backend

**Scale/Scope**:
- Expected users: 100-1000 concurrent users
- Data volume: ~1000 tasks per user average
- API endpoints: ~10 endpoints (auth + CRUD)
- Frontend pages: 4-5 pages (signin, signup, task list, task detail)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Check (Pre-Phase 0)

- **Spec-Driven Development**: ✅ PASS - Implementation follows spec → plan → tasks → implementation workflow with no manual coding
- **Accuracy & Correctness**: ✅ PASS - All 23 functional requirements mapped to specific implementation components (API endpoints, UI pages, database models)
- **Security & User Isolation**: ✅ PASS - JWT authentication enforced on all task endpoints; database queries filtered by user_id from JWT claims
- **Reproducibility**: ✅ PASS - Will document database schema, environment variables (.env.example), and setup steps in quickstart.md
- **Responsive Design**: ✅ PASS - Next.js with responsive CSS/Tailwind will support 320px-1920px range
- **Tech Stack Compliance**: ✅ PASS - Using exact specified stack: Next.js 16+ App Router, FastAPI, SQLModel, Neon PostgreSQL, Better Auth

**Initial Gate Status**: ✅ PASSED - Proceed to Phase 0

### Post-Design Check (After Phase 1)

- **Spec-Driven Development**: ✅ PASS - All design artifacts (research.md, data-model.md, contracts, quickstart.md) created following spec-driven workflow
- **Accuracy & Correctness**: ✅ PASS - API contracts define all 23 functional requirements; data model supports all user scenarios; 10 endpoints mapped to spec requirements
- **Security & User Isolation**: ✅ PASS - Data model enforces user_id foreign key with CASCADE; API contracts require Bearer auth on all task endpoints; JWT validation pattern documented in research.md
- **Reproducibility**: ✅ PASS - quickstart.md provides complete setup guide with environment variables, database initialization, and verification steps
- **Responsive Design**: ✅ PASS - Frontend structure includes Tailwind CSS; responsive patterns documented in research.md with mobile-first approach
- **Tech Stack Compliance**: ✅ PASS - All design decisions use specified stack: FastAPI dependency injection, SQLModel async with asyncpg, Next.js App Router with Better Auth, Neon PostgreSQL with connection pooling

**Post-Design Gate Status**: ✅ PASSED - Ready for Phase 2 (Task Breakdown)

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-web-app/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technology decisions and patterns)
├── data-model.md        # Phase 1 output (database schema and entities)
├── quickstart.md        # Phase 1 output (setup and deployment guide)
├── contracts/           # Phase 1 output (API contracts)
│   └── api.openapi.yaml # OpenAPI 3.0 specification
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Spec quality checklist (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # SQLModel database models (User, Task)
│   ├── schemas/         # Pydantic request/response schemas
│   ├── api/             # FastAPI route handlers
│   │   ├── auth.py      # Authentication endpoints (signup, signin, signout)
│   │   └── tasks.py     # Task CRUD endpoints
│   ├── services/        # Business logic layer
│   │   ├── auth_service.py    # JWT creation/validation, password hashing
│   │   └── task_service.py    # Task operations with user isolation
│   ├── database.py      # Database connection and session management
│   ├── config.py        # Environment configuration (DATABASE_URL, BETTER_AUTH_SECRET)
│   └── main.py          # FastAPI application entry point
├── tests/
│   ├── test_auth.py     # Authentication endpoint tests
│   ├── test_tasks.py    # Task CRUD endpoint tests
│   └── conftest.py      # Pytest fixtures (test database, test client)
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variable template
└── README.md            # Backend setup instructions

frontend/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── layout.tsx   # Root layout with auth provider
│   │   ├── page.tsx     # Home/landing page (redirects to signin or tasks)
│   │   ├── signin/      # Sign in page
│   │   ├── signup/      # Sign up page
│   │   └── tasks/       # Task list and management pages
│   ├── components/      # React components
│   │   ├── TaskList.tsx      # Display list of tasks
│   │   ├── TaskItem.tsx      # Individual task with actions
│   │   ├── TaskForm.tsx      # Create/edit task form
│   │   └── AuthForm.tsx      # Reusable auth form component
│   ├── lib/             # Utility functions and API client
│   │   ├── api.ts       # API client with JWT token handling
│   │   └── auth.ts      # Better Auth configuration
│   └── types/           # TypeScript type definitions
│       └── task.ts      # Task and User types
├── public/              # Static assets
├── tests/               # Frontend tests
├── package.json         # Node dependencies
├── .env.local.example   # Environment variable template
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # Frontend setup instructions

shared/
└── types/               # Shared TypeScript types (optional, for type safety)
    └── api.ts           # API request/response types

.env.example             # Root environment variables
docker-compose.yml       # Local development setup (optional)
README.md                # Project overview and setup
```

**Structure Decision**: Web application structure (Option 2) selected because the feature requires separate backend API (FastAPI) and frontend (Next.js). The backend handles authentication, business logic, and database operations. The frontend provides the user interface and communicates with the backend via RESTful API. This separation allows independent development, testing, and deployment of each layer while maintaining clear boundaries between concerns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution principles are satisfied by the planned architecture.

---

## Phase 0: Research & Technology Decisions

*Status: ✅ COMPLETED*

**Deliverable**: [research.md](./research.md)

**Completed Research**:
1. ✅ Better Auth JWT configuration for Next.js 16+ App Router
2. ✅ FastAPI JWT validation middleware patterns (Depends() pattern)
3. ✅ SQLModel with Neon Serverless PostgreSQL connection pooling (asyncpg + async engine)
4. ✅ Next.js App Router authentication patterns (middleware-based protection)
5. ✅ FastAPI CORS configuration for Next.js frontend (origin allowlist)
6. ✅ Password hashing best practices (bcrypt via passlib)
7. ✅ JWT token expiration and refresh strategies (24-hour tokens, no refresh for MVP)
8. ✅ Error handling patterns for RESTful APIs (HTTPException with status codes)
9. ✅ Responsive design patterns for task management UI (Tailwind CSS mobile-first)
10. ✅ Testing strategies for authenticated endpoints (pytest fixtures with TestClient)

**Key Decisions Summary**: All technology choices documented with rationale, implementation patterns, and alternatives considered.

---

## Phase 1: Design & Contracts

*Status: ✅ COMPLETED*

**Deliverables**:
1. ✅ [data-model.md](./data-model.md) - Complete database schema with User and Task entities, validation rules, indexes, and security patterns
2. ✅ [contracts/api.openapi.yaml](./contracts/api.openapi.yaml) - OpenAPI 3.0 specification with 10 endpoints (3 auth + 7 task operations)
3. ✅ [quickstart.md](./quickstart.md) - Comprehensive setup guide with environment configuration, database initialization, and troubleshooting

**Design Artifacts**:
- **Data Model**: 2 entities (User, Task) with proper relationships, foreign keys, indexes, and CASCADE deletion
- **API Contracts**: 10 RESTful endpoints covering all 23 functional requirements
- **Setup Guide**: Complete 30-minute setup process with verification steps

**Agent Context**: ✅ Updated CLAUDE.md with Neon Serverless PostgreSQL database information

---

## Phase 2: Task Breakdown

*Status: ⏳ READY (execute with /sp.tasks command)*

This phase is executed by the `/sp.tasks` command to generate actionable, dependency-ordered tasks.

**Prerequisites Met**:
- ✅ Specification complete (spec.md)
- ✅ Research complete (research.md)
- ✅ Data model defined (data-model.md)
- ✅ API contracts defined (contracts/api.openapi.yaml)
- ✅ Setup guide complete (quickstart.md)
- ✅ Constitution checks passed (initial and post-design)

**Next Command**: Run `/sp.tasks` to generate tasks.md with implementation tasks.
