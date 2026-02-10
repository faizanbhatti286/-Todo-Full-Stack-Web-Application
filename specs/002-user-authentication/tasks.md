# Tasks: User Authentication & JWT Integration

**Input**: Design documents from `/specs/002-user-authentication/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Current State**: Authentication infrastructure already exists. Tasks focus on validation, refinement, and comprehensive testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment validation and documentation review

- [x] T001 Verify backend dependencies installed (FastAPI, python-jose, passlib, SQLModel, asyncpg) in backend/requirements.txt
- [x] T002 Verify frontend dependencies installed (Next.js 14+, React 18+, TypeScript 5+) in frontend/package.json
- [x] T003 [P] Review .env.example and ensure BETTER_AUTH_SECRET is documented for both backend and frontend
- [x] T004 [P] Verify database connection to Neon PostgreSQL using DATABASE_URL from backend/.env
- [x] T005 [P] Review existing User model in backend/src/models/user.py for compliance with data-model.md
- [x] T006 [P] Review existing Task model in backend/src/models/task.py for compliance with data-model.md

**Checkpoint**: ✅ Environment validated, dependencies confirmed, existing code reviewed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure changes that MUST be complete before ANY user story validation can begin

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Update JWT token expiry from 24 hours to 7 days (168 hours) in backend/src/services/auth_service.py (change ACCESS_TOKEN_EXPIRE_HOURS = 24 to 168)
- [x] T008 Add password maximum length validation (128 characters) in backend/src/api/auth.py signup endpoint
- [x] T009 Add email maximum length validation (255 characters) in backend/src/schemas/auth.py
- [x] T010 [P] Enhance JWTError handling to distinguish between expired tokens and invalid tokens in backend/src/services/auth_service.py get_current_user_id function
- [x] T011 [P] Add specific "Token expired" error message for expired JWT tokens in backend/src/services/auth_service.py
- [x] T012 [P] Add specific "Invalid token format" error message for malformed JWT tokens in backend/src/services/auth_service.py
- [x] T013 [P] Verify all task endpoints use get_current_user_id dependency in backend/src/api/tasks.py
- [x] T014 [P] Create pytest configuration file backend/pytest.ini with async test settings
- [x] T015 [P] Create test fixtures for user creation and authentication in backend/tests/conftest.py

**Checkpoint**: ✅ Foundation ready - token expiry updated, error messages enhanced, test infrastructure ready

---

## Phase 3: User Story 1 - New User Registration (Priority: P1) 🎯 MVP

**Goal**: Users can create accounts with email and password, receive JWT tokens, and access the application

**Independent Test**: Visit signup page, enter valid credentials, verify account created in database and JWT token received

### Validation for User Story 1

- [x] T016 [P] [US1] Verify signup endpoint returns 201 Created with JWT token in backend/src/api/auth.py
- [x] T017 [P] [US1] Verify password hashing works correctly (bcrypt) in backend/src/services/auth_service.py
- [x] T018 [P] [US1] Verify email uniqueness constraint enforced in backend/src/models/user.py
- [x] T019 [US1] Verify signup endpoint validates password minimum length (8 chars) in backend/src/api/auth.py

### Testing for User Story 1

- [x] T020 [P] [US1] Create test_auth_signup.py in backend/tests/ with test for successful signup
- [x] T021 [P] [US1] Add test for signup with duplicate email (expect 409 Conflict) in backend/tests/test_auth_signup.py
- [x] T022 [P] [US1] Add test for signup with password too short (expect 400 Bad Request) in backend/tests/test_auth_signup.py
- [x] T023 [P] [US1] Add test for signup with invalid email format (expect 422 Unprocessable Entity) in backend/tests/test_auth_signup.py
- [x] T024 [P] [US1] Add test for signup with password too long (>128 chars, expect 400 Bad Request) in backend/tests/test_auth_signup.py
- [x] T025 [P] [US1] Add test for concurrent signup with same email (expect one success, one 409) in backend/tests/test_auth_signup.py

### Frontend Validation for User Story 1

- [x] T026 [P] [US1] Verify signup page exists and renders correctly at frontend/src/app/signup/page.tsx
- [x] T027 [P] [US1] Verify AuthForm component handles signup flow in frontend/src/components/AuthForm.tsx
- [x] T028 [US1] Verify frontend validates email format before submission in frontend/src/components/AuthForm.tsx
- [x] T029 [US1] Verify frontend validates password length (min 8 chars) in frontend/src/components/AuthForm.tsx
- [x] T030 [US1] Verify JWT token is saved to localStorage after successful signup in frontend/src/lib/api.ts
- [x] T031 [US1] Verify user is redirected to tasks page after successful signup in frontend/src/app/signup/page.tsx
- [x] T032 [US1] Verify error messages are displayed for signup failures in frontend/src/components/AuthForm.tsx

**Checkpoint**: ✅ User Story 1 complete - users can successfully register and receive JWT tokens

---

## Phase 4: User Story 2 - Returning User Sign In (Priority: P2)

**Goal**: Registered users can sign in with email and password, receive JWT tokens valid for 7 days

**Independent Test**: Create account, sign out, sign back in with correct credentials, verify JWT token received and valid for 7 days

### Validation for User Story 2

- [ ] T033 [P] [US2] Verify signin endpoint authenticates users correctly in backend/src/api/auth.py
- [ ] T034 [P] [US2] Verify signin endpoint returns 401 for invalid credentials in backend/src/api/auth.py
- [ ] T035 [P] [US2] Verify password verification works correctly in backend/src/services/auth_service.py authenticate_user function
- [ ] T036 [US2] Verify JWT token expiry is set to 7 days in backend/src/services/auth_service.py create_access_token function

### Testing for User Story 2

- [ ] T037 [P] [US2] Create test_auth_signin.py in backend/tests/ with test for successful signin
- [ ] T038 [P] [US2] Add test for signin with incorrect password (expect 401 Unauthorized) in backend/tests/test_auth_signin.py
- [ ] T039 [P] [US2] Add test for signin with non-existent email (expect 401 Unauthorized) in backend/tests/test_auth_signin.py
- [ ] T040 [P] [US2] Add test to verify JWT token expiry is 7 days in backend/tests/test_auth_signin.py
- [ ] T041 [P] [US2] Add test for signout endpoint (expect 200 OK) in backend/tests/test_auth_signin.py

### Frontend Validation for User Story 2

- [ ] T042 [P] [US2] Verify signin page exists and renders correctly at frontend/src/app/signin/page.tsx
- [ ] T043 [P] [US2] Verify AuthForm component handles signin flow in frontend/src/components/AuthForm.tsx
- [ ] T044 [US2] Verify JWT token is saved to localStorage after successful signin in frontend/src/lib/api.ts
- [ ] T045 [US2] Verify user is redirected to tasks page after successful signin in frontend/src/app/signin/page.tsx
- [ ] T046 [US2] Verify error message "Invalid email or password" displayed for failed signin in frontend/src/components/AuthForm.tsx
- [ ] T047 [US2] Verify token persists across browser sessions (within 7 days) by checking localStorage in frontend/src/lib/auth.ts

**Checkpoint**: User Story 2 complete - users can sign in and receive 7-day JWT tokens

---

## Phase 5: User Story 3 - Protected Task Access (Priority: P3)

**Goal**: Authenticated users can only access their own tasks; unauthenticated requests are rejected with 401; cross-user access rejected with 403

**Independent Test**: Create two users, have each create tasks, verify User A cannot access User B's tasks, verify unauthenticated requests rejected

### Validation for User Story 3

- [ ] T048 [P] [US3] Verify GET /tasks endpoint filters by authenticated user_id in backend/src/services/task_service.py get_user_tasks function
- [ ] T049 [P] [US3] Verify POST /tasks endpoint associates tasks with authenticated user_id in backend/src/services/task_service.py create_task function
- [ ] T050 [P] [US3] Verify GET /tasks/{task_id} endpoint checks task ownership in backend/src/services/task_service.py get_task_by_id function
- [ ] T051 [P] [US3] Verify PUT /tasks/{task_id} endpoint checks task ownership in backend/src/services/task_service.py update_task function
- [ ] T052 [P] [US3] Verify PATCH /tasks/{task_id} endpoint checks task ownership in backend/src/services/task_service.py update_task function
- [ ] T053 [P] [US3] Verify DELETE /tasks/{task_id} endpoint checks task ownership in backend/src/services/task_service.py delete_task function
- [ ] T054 [US3] Verify all task endpoints return 403 Forbidden for cross-user access attempts in backend/src/services/task_service.py

### Testing for User Story 3

- [ ] T055 [P] [US3] Create test_tasks_auth.py in backend/tests/ with test for authenticated task list retrieval
- [ ] T056 [P] [US3] Add test for unauthenticated task access (expect 401 Unauthorized) in backend/tests/test_tasks_auth.py
- [ ] T057 [P] [US3] Add test for cross-user task access (expect 403 Forbidden) in backend/tests/test_tasks_auth.py
- [ ] T058 [P] [US3] Add test for task creation with authenticated user in backend/tests/test_tasks_auth.py
- [ ] T059 [P] [US3] Add test for task update by owner (expect 200 OK) in backend/tests/test_tasks_auth.py
- [ ] T060 [P] [US3] Add test for task update by non-owner (expect 403 Forbidden) in backend/tests/test_tasks_auth.py
- [ ] T061 [P] [US3] Add test for task deletion by owner (expect 204 No Content) in backend/tests/test_tasks_auth.py
- [ ] T062 [P] [US3] Add test for task deletion by non-owner (expect 403 Forbidden) in backend/tests/test_tasks_auth.py

### Security Testing for User Story 3

- [ ] T063 [P] [US3] Create test_security.py in backend/tests/ with test for invalid JWT token (expect 401)
- [ ] T064 [P] [US3] Add test for malformed JWT token (expect 401 with "Invalid token format") in backend/tests/test_security.py
- [ ] T065 [P] [US3] Add test for JWT token with invalid signature (expect 401) in backend/tests/test_security.py
- [ ] T066 [P] [US3] Add test for JWT token with non-existent user_id (expect 401 with "User not found") in backend/tests/test_security.py
- [ ] T067 [P] [US3] Add test to verify user_id filtering in all task queries in backend/tests/test_security.py

### Frontend Validation for User Story 3

- [ ] T068 [P] [US3] Verify middleware protects /tasks route in frontend/middleware.ts
- [ ] T069 [P] [US3] Verify API client attaches Authorization header to all requests in frontend/src/lib/api.ts
- [ ] T070 [US3] Verify unauthenticated users are redirected to signin page in frontend/middleware.ts
- [ ] T071 [US3] Verify tasks page displays only authenticated user's tasks in frontend/src/app/tasks/page.tsx
- [ ] T072 [US3] Verify task operations (create, update, delete) work correctly in frontend/src/components/TaskList.tsx

**Checkpoint**: User Story 3 complete - task access is properly secured with user isolation

---

## Phase 6: User Story 4 - Token Expiry and Session Management (Priority: P4)

**Goal**: JWT tokens expire after 7 days; expired tokens are rejected; users are prompted to sign in again

**Independent Test**: Create user, sign in, manually expire token (or wait 7 days), verify subsequent requests rejected and user redirected to signin

### Validation for User Story 4

- [x] T073 [P] [US4] Verify JWT token includes correct expiry timestamp (7 days from issuance) in backend/src/services/auth_service.py create_access_token function
- [x] T074 [P] [US4] Verify expired tokens are rejected with 401 and "Token expired" message in backend/src/services/auth_service.py get_current_user_id function
- [x] T075 [US4] Verify token expiry is checked on every protected endpoint request in backend/src/services/auth_service.py

### Testing for User Story 4

- [x] T076 [P] [US4] Create test_token_expiry.py in backend/tests/ with test for expired token rejection
- [x] T077 [P] [US4] Add test to manually create expired token and verify 401 response in backend/tests/test_token_expiry.py
- [x] T078 [P] [US4] Add test to verify token expiry timestamp is exactly 7 days in backend/tests/test_token_expiry.py
- [x] T079 [P] [US4] Add test for valid token within 7-day window (expect success) in backend/tests/test_token_expiry.py

### Frontend Validation for User Story 4

- [x] T080 [P] [US4] Add token expiry detection in API client error handling in frontend/src/lib/api.ts
- [x] T081 [P] [US4] Implement redirect to signin page on 401 Unauthorized response in frontend/src/lib/api.ts
- [x] T082 [US4] Display user-friendly message "Your session has expired. Please sign in again." in frontend/src/lib/api.ts
- [x] T083 [US4] Clear localStorage token on 401 response in frontend/src/lib/api.ts

**Checkpoint**: User Story 4 complete - token expiry is properly enforced and handled

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final validation, and cross-story improvements

### Documentation

- [x] T084 [P] Update README.md with authentication setup instructions including BETTER_AUTH_SECRET generation
- [x] T085 [P] Verify quickstart.md is accurate and all steps work in specs/002-user-authentication/quickstart.md
- [x] T086 [P] Add API documentation comments to all authentication endpoints in backend/src/api/auth.py
- [x] T087 [P] Add API documentation comments to all task endpoints in backend/src/api/tasks.py
- [x] T088 [P] Document environment variables in .env.example for both backend and frontend
- [x] T089 [P] Create troubleshooting guide for common authentication issues in README.md

### Final Validation

- [ ] T090 [P] Run all backend tests and verify 100% pass: pytest backend/tests/ -v
- [x] T091 [P] Verify all 20 functional requirements (FR-001 to FR-020) are met per spec.md
- [ ] T092 [P] Verify all 10 success criteria (SC-001 to SC-010) are met per spec.md
- [ ] T093 [P] Test authentication flow on desktop browser (Chrome, Firefox, Safari)
- [ ] T094 [P] Test authentication flow on mobile browser (responsive design)
- [ ] T095 [P] Verify BETTER_AUTH_SECRET is identical in backend and frontend .env files
- [ ] T096 [P] Test concurrent user registration (100 users) for data integrity
- [x] T097 [P] Verify no security vulnerabilities using OWASP top 10 checklist

### Performance & Security

- [ ] T098 [P] Measure authentication endpoint latency (target: <500ms p95) using load testing tool
- [ ] T099 [P] Measure JWT verification latency (target: <50ms per request) using profiling
- [x] T100 [P] Verify password hashing uses bcrypt with 12 rounds in backend/src/services/auth_service.py
- [x] T101 [P] Verify all error messages are user-friendly and don't leak sensitive information
- [ ] T102 [P] Test with 100+ concurrent users to verify system stability

### Code Quality

- [ ] T103 [P] Run backend linter and fix any issues: pylint backend/src/
- [ ] T104 [P] Run frontend linter and fix any issues: npm run lint in frontend/
- [x] T105 [P] Review all code for hardcoded secrets (should use environment variables)
- [x] T106 [P] Verify all database queries use parameterized queries (SQL injection prevention)

**Checkpoint**: All polish tasks complete - system ready for demo

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 but builds on same auth infrastructure
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Requires US1 and US2 to be testable (need users to sign in)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Requires US1 and US2 to be testable (need tokens to expire)

### Within Each User Story

- Validation tasks before testing tasks
- Backend tests before frontend validation
- Core implementation validation before integration testing
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T005, T006)
- All Foundational tasks marked [P] can run in parallel (T010-T015)
- Within each user story, all tasks marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members after Foundational phase

---

## Parallel Example: User Story 1

```bash
# Launch all validation tasks for User Story 1 together:
Task: "Verify signup endpoint returns 201 Created with JWT token in backend/src/api/auth.py"
Task: "Verify password hashing works correctly (bcrypt) in backend/src/services/auth_service.py"
Task: "Verify email uniqueness constraint enforced in backend/src/models/user.py"

# Launch all test creation tasks for User Story 1 together:
Task: "Create test_auth_signup.py in backend/tests/ with test for successful signup"
Task: "Add test for signup with duplicate email (expect 409 Conflict) in backend/tests/test_auth_signup.py"
Task: "Add test for signup with password too short (expect 400 Bad Request) in backend/tests/test_auth_signup.py"
Task: "Add test for signup with invalid email format (expect 422 Unprocessable Entity) in backend/tests/test_auth_signup.py"
Task: "Add test for signup with password too long (>128 chars, expect 400 Bad Request) in backend/tests/test_auth_signup.py"
Task: "Add test for concurrent signup with same email (expect one success, one 409) in backend/tests/test_auth_signup.py"

# Launch all frontend validation tasks for User Story 1 together:
Task: "Verify signup page exists and renders correctly at frontend/src/app/signup/page.tsx"
Task: "Verify AuthForm component handles signup flow in frontend/src/components/AuthForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T015) - CRITICAL
3. Complete Phase 3: User Story 1 (T016-T032)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T016-T032)
   - Developer B: User Story 2 (T033-T047)
   - Developer C: User Story 3 (T048-T072)
   - Developer D: User Story 4 (T073-T083)
3. Stories complete and integrate independently
4. Team completes Polish phase together (T084-T106)

---

## Task Summary

**Total Tasks**: 106

**By Phase**:
- Phase 1 (Setup): 6 tasks
- Phase 2 (Foundational): 9 tasks
- Phase 3 (US1 - Registration): 17 tasks
- Phase 4 (US2 - Sign In): 15 tasks
- Phase 5 (US3 - Protected Access): 25 tasks
- Phase 6 (US4 - Token Expiry): 11 tasks
- Phase 7 (Polish): 23 tasks

**Parallel Opportunities**: 78 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phases 1-3 (32 tasks) deliver User Story 1 - New User Registration

**Critical Path**: Setup → Foundational → User Stories (in priority order) → Polish

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Most code already exists - tasks focus on validation, refinement, and testing
- Main changes: token expiry (24h → 7 days), error messages, comprehensive tests
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run tests frequently to catch issues early
