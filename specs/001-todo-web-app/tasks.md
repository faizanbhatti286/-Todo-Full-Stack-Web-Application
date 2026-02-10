# Tasks: Todo Full-Stack Web Application

**Input**: Design documents from `/specs/001-todo-web-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.openapi.yaml

**Tests**: Tests are not explicitly requested in the specification, so test tasks are omitted. Focus is on implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/` for source code, `backend/tests/` for tests
- **Frontend**: `frontend/src/` for source code, `frontend/tests/` for tests
- Paths follow the web application structure defined in plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure with src/, tests/, and configuration files
- [x] T002 Initialize Python project with requirements.txt including FastAPI, SQLModel, python-jose, passlib, asyncpg
- [x] T003 [P] Create frontend directory structure with Next.js 16+ App Router layout
- [x] T004 [P] Initialize Node.js project with package.json including Next.js 16+, React 18+, Better Auth, Tailwind CSS
- [x] T005 [P] Create backend/.env.example with DATABASE_URL, BETTER_AUTH_SECRET, FRONTEND_URL placeholders
- [x] T006 [P] Create frontend/.env.local.example with NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET placeholders
- [x] T007 [P] Configure Tailwind CSS in frontend/tailwind.config.js for responsive design (320px-1920px)
- [x] T008 [P] Create root .env.example with shared environment variable documentation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Setup database connection and session management in backend/src/database.py using SQLAlchemy async engine with connection pooling
- [x] T010 [P] Create configuration management in backend/src/config.py to load DATABASE_URL and BETTER_AUTH_SECRET from environment
- [x] T011 [P] Initialize FastAPI application in backend/src/main.py with CORS middleware configured for frontend origin
- [x] T012 [P] Create base Pydantic schemas directory structure in backend/src/schemas/
- [x] T013 [P] Setup Next.js root layout in frontend/src/app/layout.tsx with metadata and basic HTML structure
- [x] T014 [P] Create API client utility in frontend/src/lib/api.ts with base URL configuration and error handling
- [x] T015 [P] Create TypeScript type definitions in frontend/src/types/task.ts for User and Task interfaces
- [x] T016 Create database migration SQL script based on data-model.md schema (users and tasks tables with indexes)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to register accounts, sign in with credentials, and sign out securely using JWT authentication

**Independent Test**: Register a new account, sign out, sign back in with credentials, verify JWT token issued and accepted

### Implementation for User Story 1

- [x] T017 [P] [US1] Create User model in backend/src/models/user.py with SQLModel (id, email, password_hash, created_at)
- [x] T018 [P] [US1] Create Pydantic request schemas in backend/src/schemas/auth.py (UserSignupRequest, UserSigninRequest)
- [x] T019 [P] [US1] Create Pydantic response schemas in backend/src/schemas/auth.py (AuthResponse with access_token, user_id, email)
- [x] T020 [US1] Implement authentication service in backend/src/services/auth_service.py with password hashing (bcrypt), JWT creation, and token validation
- [x] T021 [US1] Create JWT dependency function in backend/src/services/auth_service.py using FastAPI Depends() pattern for token extraction and validation
- [x] T022 [US1] Implement POST /auth/signup endpoint in backend/src/api/auth.py with email uniqueness validation and password hashing
- [x] T023 [US1] Implement POST /auth/signin endpoint in backend/src/api/auth.py with credential verification and JWT token issuance
- [x] T024 [US1] Implement POST /auth/signout endpoint in backend/src/api/auth.py (client-side token removal, returns success message)
- [x] T025 [US1] Register auth routes in backend/src/main.py FastAPI application
- [x] T026 [P] [US1] Configure Better Auth in frontend/src/lib/auth.ts with JWT plugin and BETTER_AUTH_SECRET
- [x] T027 [P] [US1] Create AuthForm component in frontend/src/components/AuthForm.tsx with email and password fields
- [x] T028 [P] [US1] Create signup page in frontend/src/app/signup/page.tsx using AuthForm component
- [x] T029 [P] [US1] Create signin page in frontend/src/app/signin/page.tsx using AuthForm component
- [x] T030 [US1] Implement authentication API calls in frontend/src/lib/api.ts (signup, signin, signout with JWT token storage)
- [x] T031 [US1] Create Next.js middleware in frontend/middleware.ts for route protection and authentication checks
- [x] T032 [US1] Create home page in frontend/src/app/page.tsx with redirect logic (authenticated → tasks, unauthenticated → signin)
- [x] T033 [US1] Add signout functionality to frontend layout with button and API call

**Checkpoint**: At this point, User Story 1 should be fully functional - users can register, sign in, and sign out with JWT authentication working end-to-end

---

## Phase 4: User Story 2 - Create and View Tasks (Priority: P1)

**Goal**: Enable authenticated users to create new tasks and view their personal task list with user isolation enforced

**Independent Test**: Sign in, create multiple tasks with different titles, verify all tasks appear in list and only belong to authenticated user

### Implementation for User Story 2

- [x] T034 [P] [US2] Create Task model in backend/src/models/task.py with SQLModel (id, user_id, title, description, is_completed, created_at, updated_at)
- [x] T035 [P] [US2] Create Pydantic request schema in backend/src/schemas/task.py (TaskCreateRequest with title and optional description)
- [x] T036 [P] [US2] Create Pydantic response schema in backend/src/schemas/task.py (TaskResponse with all task fields)
- [x] T037 [US2] Implement task service in backend/src/services/task_service.py with user isolation enforcement (filter all queries by user_id from JWT)
- [x] T038 [US2] Implement GET /tasks endpoint in backend/src/api/tasks.py with JWT authentication dependency and user_id filtering
- [x] T039 [US2] Implement POST /tasks endpoint in backend/src/api/tasks.py with JWT authentication, input validation, and user_id assignment
- [x] T040 [US2] Register task routes in backend/src/main.py FastAPI application
- [x] T041 [P] [US2] Create TaskList component in frontend/src/components/TaskList.tsx to display array of tasks
- [x] T042 [P] [US2] Create TaskItem component in frontend/src/components/TaskItem.tsx to render individual task with title and description
- [x] T043 [P] [US2] Create TaskForm component in frontend/src/components/TaskForm.tsx for creating new tasks with title input
- [x] T044 [US2] Create tasks page in frontend/src/app/tasks/page.tsx with TaskList and TaskForm components
- [x] T045 [US2] Implement task API calls in frontend/src/lib/api.ts (getTasks, createTask with JWT token in Authorization header)
- [x] T046 [US2] Add state management to tasks page for task list updates after creation
- [x] T047 [US2] Add empty state message to TaskList component when no tasks exist

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can authenticate and manage their personal task list

---

## Phase 5: User Story 3 - Update Task Details (Priority: P2)

**Goal**: Enable authenticated users to edit task title and description with changes persisted to database

**Independent Test**: Create a task, edit its title and description, refresh page, verify changes persisted and unauthorized users cannot edit

### Implementation for User Story 3

- [x] T048 [P] [US3] Create Pydantic request schema in backend/src/schemas/task.py (TaskUpdateRequest with optional title, description, is_completed)
- [x] T049 [US3] Implement PUT /tasks/{task_id} endpoint in backend/src/api/tasks.py with ownership validation (user_id match) and full update
- [x] T050 [US3] Implement PATCH /tasks/{task_id} endpoint in backend/src/api/tasks.py with ownership validation and partial update
- [x] T051 [US3] Add ownership check helper in backend/src/services/task_service.py to verify task belongs to authenticated user (403 if not)
- [x] T052 [US3] Add updated_at timestamp update logic in task service when task is modified
- [x] T053 [P] [US3] Add edit mode state to TaskItem component in frontend/src/components/TaskItem.tsx with inline editing UI
- [x] T054 [P] [US3] Add edit button to TaskItem component to toggle edit mode
- [x] T055 [US3] Implement updateTask API call in frontend/src/lib/api.ts with PATCH method and JWT token
- [x] T056 [US3] Add save/cancel buttons to TaskItem edit mode with API integration
- [x] T057 [US3] Add error handling for unauthorized edit attempts (403 response) with user-friendly message

**Checkpoint**: All user stories (1, 2, 3) should now work independently - users can create, view, and edit their tasks

---

## Phase 6: User Story 4 - Mark Tasks as Complete (Priority: P2)

**Goal**: Enable authenticated users to toggle task completion status with visual distinction between completed and incomplete tasks

**Independent Test**: Create tasks, mark some as complete, verify visual distinction, toggle back to incomplete, refresh page to verify persistence

### Implementation for User Story 4

- [x] T058 [P] [US4] Add checkbox UI to TaskItem component in frontend/src/components/TaskItem.tsx for completion toggle
- [x] T059 [P] [US4] Add visual styling to TaskItem component to distinguish completed tasks (strikethrough, opacity, color)
- [x] T060 [US4] Implement completion toggle handler in TaskItem component using PATCH /tasks/{task_id} endpoint
- [x] T061 [US4] Update task list state in tasks page when completion status changes
- [x] T062 [US4] Add optimistic UI update for completion toggle with rollback on API error

**Checkpoint**: All user stories (1, 2, 3, 4) should work independently - users can create, view, edit, and complete tasks

---

## Phase 7: User Story 5 - Delete Tasks (Priority: P3)

**Goal**: Enable authenticated users to permanently delete tasks with confirmation and proper error handling

**Independent Test**: Create a task, delete it, verify it no longer appears in list, attempt to delete another user's task and verify 403 error

### Implementation for User Story 5

- [x] T063 [US5] Implement DELETE /tasks/{task_id} endpoint in backend/src/api/tasks.py with ownership validation (403 if not owner)
- [x] T064 [US5] Add 404 error handling in delete endpoint when task doesn't exist
- [x] T065 [P] [US5] Add delete button to TaskItem component in frontend/src/components/TaskItem.tsx
- [x] T066 [US5] Implement deleteTask API call in frontend/src/lib/api.ts with DELETE method and JWT token
- [x] T067 [US5] Add confirmation dialog before delete action in TaskItem component
- [x] T068 [US5] Update task list state in tasks page to remove deleted task from UI
- [x] T069 [US5] Add error handling for unauthorized delete attempts (403 response) with user-friendly message

**Checkpoint**: All user stories (1, 2, 3, 4, 5) should now be independently functional - complete feature set implemented

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and ensure production readiness

- [x] T070 [P] Add input validation to all frontend forms (email format, password length, required fields)
- [x] T071 [P] Add loading states to all API calls in frontend with spinner or skeleton UI
- [x] T072 [P] Add error toast notifications in frontend for API failures with user-friendly messages
- [x] T073 [P] Implement responsive design testing across mobile (320px), tablet (768px), and desktop (1920px) breakpoints
- [x] T074 [P] Add proper error responses for all backend endpoints (400, 401, 403, 404, 500) with consistent format
- [x] T075 [P] Add request validation middleware in backend to validate all incoming requests against schemas
- [x] T076 [P] Create backend README.md with setup instructions, environment variables, and API documentation links
- [x] T077 [P] Create frontend README.md with setup instructions, environment variables, and development workflow
- [x] T078 Verify JWT authentication enforcement on all task endpoints (401 for missing/invalid tokens)
- [x] T079 Verify user data isolation by testing cross-user access attempts (403 for unauthorized access)
- [x] T080 Test complete user flow following quickstart.md validation steps
- [x] T081 [P] Add logging for authentication events (signup, signin, failed attempts) in backend
- [x] T082 [P] Add logging for task operations (create, update, delete) with user_id in backend
- [x] T083 [P] Optimize database queries with proper indexes (user_id, created_at) as defined in data-model.md
- [x] T084 [P] Add rate limiting middleware to backend API endpoints to prevent abuse
- [x] T085 Verify CORS configuration allows frontend origin and blocks unauthorized origins
- [x] T086 Test concurrent user sessions to verify 100+ concurrent user support
- [x] T087 [P] Add accessibility attributes (ARIA labels, keyboard navigation) to frontend components
- [x] T088 [P] Add meta tags and SEO optimization to Next.js pages
- [x] T089 Verify all success criteria from spec.md are met (response times, error rates, responsive design)
- [x] T090 Create deployment documentation with production environment setup and security checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P1): Can start after Foundational - No dependencies on other stories (but typically done after US1 for auth context)
  - User Story 3 (P2): Can start after Foundational - Requires Task model from US2
  - User Story 4 (P2): Can start after Foundational - Requires Task model from US2
  - User Story 5 (P3): Can start after Foundational - Requires Task model from US2
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Independent - Can start after Foundational (Phase 2), but benefits from US1 auth context
- **User Story 3 (P2)**: Depends on US2 (Task model) - Can start after US2 completes
- **User Story 4 (P2)**: Depends on US2 (Task model) - Can start after US2 completes, can run parallel with US3
- **User Story 5 (P3)**: Depends on US2 (Task model) - Can start after US2 completes, can run parallel with US3/US4

### Within Each User Story

- Backend models before services
- Services before API endpoints
- API endpoints before frontend integration
- Core implementation before error handling and edge cases

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T002 (backend init) || T004 (frontend init)
- T005 (backend .env) || T006 (frontend .env) || T007 (Tailwind) || T008 (root .env)

**Foundational Phase (Phase 2)**:
- T010 (config) || T011 (FastAPI) || T012 (schemas dir) || T013 (layout) || T014 (API client) || T015 (types)

**User Story 1 (Phase 3)**:
- T017 (User model) || T018 (request schemas) || T019 (response schemas)
- T026 (Better Auth) || T027 (AuthForm) || T028 (signup page) || T029 (signin page)

**User Story 2 (Phase 4)**:
- T034 (Task model) || T035 (request schema) || T036 (response schema)
- T041 (TaskList) || T042 (TaskItem) || T043 (TaskForm)

**User Story 3 (Phase 5)**:
- T053 (edit mode UI) || T054 (edit button)

**User Story 4 (Phase 6)**:
- T058 (checkbox UI) || T059 (visual styling)

**User Story 5 (Phase 7)**:
- T065 (delete button) - single component change

**Polish Phase (Phase 8)**:
- Most tasks marked [P] can run in parallel (different concerns, different files)

---

## Parallel Example: User Story 1

```bash
# Launch all models and schemas together:
Task: "Create User model in backend/src/models/user.py"
Task: "Create Pydantic request schemas in backend/src/schemas/auth.py"
Task: "Create Pydantic response schemas in backend/src/schemas/auth.py"

# Launch all frontend components together:
Task: "Configure Better Auth in frontend/src/lib/auth.ts"
Task: "Create AuthForm component in frontend/src/components/AuthForm.tsx"
Task: "Create signup page in frontend/src/app/signup/page.tsx"
Task: "Create signin page in frontend/src/app/signin/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T016) - CRITICAL
3. Complete Phase 3: User Story 1 (T017-T033) - Authentication
4. Complete Phase 4: User Story 2 (T034-T047) - Core task management
5. **STOP and VALIDATE**: Test authentication and basic task CRUD independently
6. Deploy/demo MVP with signup, signin, create tasks, view tasks

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Infrastructure ready
2. **MVP** (Phases 3-4) → Authentication + Basic Tasks → Deploy/Demo
3. **Enhanced** (Phase 5) → Add task editing → Deploy/Demo
4. **Complete** (Phases 6-7) → Add completion toggle and deletion → Deploy/Demo
5. **Production** (Phase 8) → Polish and production hardening → Final Deploy

### Parallel Team Strategy

With multiple developers after Foundational phase completes:

**Scenario 1: 2 Developers**
- Developer A: User Story 1 (Authentication) → User Story 3 (Edit) → User Story 5 (Delete)
- Developer B: User Story 2 (Tasks CRUD) → User Story 4 (Complete)

**Scenario 2: 3 Developers**
- Developer A: User Story 1 (Authentication)
- Developer B: User Story 2 (Tasks CRUD)
- Developer C: User Stories 3, 4, 5 (after US2 completes)

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **File paths**: All tasks include exact file paths based on plan.md structure
- **User isolation**: Critical security requirement - all task queries MUST filter by user_id from JWT
- **JWT authentication**: Required on all task endpoints - verify 401 for unauthenticated requests
- **Independent stories**: Each user story should be completable and testable independently
- **Checkpoints**: Stop at any checkpoint to validate story works independently before proceeding
- **Commit strategy**: Commit after each task or logical group of related tasks
- **Constitution compliance**: All tasks align with spec-driven development, security, reproducibility, and tech stack requirements

---

## Task Count Summary

- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 8 tasks (T009-T016)
- **Phase 3 (US1 - Auth)**: 17 tasks (T017-T033)
- **Phase 4 (US2 - Tasks)**: 14 tasks (T034-T047)
- **Phase 5 (US3 - Edit)**: 10 tasks (T048-T057)
- **Phase 6 (US4 - Complete)**: 5 tasks (T058-T062)
- **Phase 7 (US5 - Delete)**: 7 tasks (T063-T069)
- **Phase 8 (Polish)**: 21 tasks (T070-T090)

**Total**: 90 tasks

**MVP Scope** (Phases 1-4): 47 tasks
**Full Feature Set** (Phases 1-7): 69 tasks
**Production Ready** (All Phases): 90 tasks
