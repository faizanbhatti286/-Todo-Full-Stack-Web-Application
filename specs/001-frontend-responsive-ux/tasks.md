# Tasks: Frontend Interface & Responsive UX

**Input**: Design documents from `/specs/001-frontend-responsive-ux/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are excluded per the "avoid over-engineering" principle.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend project**: `frontend/` directory at repository root
- **App Router pages**: `frontend/app/`
- **Components**: `frontend/components/`
- **Utilities**: `frontend/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Next.js 16+ project with TypeScript and App Router in frontend/ directory using create-next-app
- [x] T002 Install core dependencies: @better-auth/react, tailwindcss, and TypeScript types in frontend/package.json
- [x] T003 [P] Configure TypeScript with strict mode in frontend/tsconfig.json
- [x] T004 [P] Configure TailwindCSS with mobile-first breakpoints (md:768px, lg:1024px) in frontend/tailwind.config.js
- [x] T005 [P] Create environment variables template in frontend/.env.local.example with NEXT_PUBLIC_API_BASE_URL and BETTER_AUTH_SECRET
- [x] T006 [P] Configure Next.js for API integration in frontend/next.config.js
- [x] T007 [P] Setup ESLint configuration in frontend/.eslintrc.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Copy TypeScript type definitions from specs/001-frontend-responsive-ux/contracts/types.ts to frontend/lib/types.ts
- [x] T009 [P] Create API client with fetch wrapper and JWT injection in frontend/lib/api.ts
- [x] T010 [P] Create APIError class with error handling utilities in frontend/lib/api.ts
- [x] T011 [P] Implement Better Auth provider wrapper in frontend/lib/auth.ts
- [x] T012 [P] Create AuthContext with login, signup, logout methods in frontend/lib/auth.ts
- [x] T013 [P] Create useAuth hook for accessing auth state in frontend/lib/auth.ts
- [x] T014 Create root layout with AuthProvider in frontend/app/layout.tsx
- [ ] T015 [P] Configure global styles with TailwindCSS imports in frontend/app/globals.css
- [ ] T016 [P] Create LoadingSpinner component in frontend/components/LoadingSpinner.tsx
- [ ] T017 [P] Create ErrorMessage component in frontend/components/ErrorMessage.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Authenticated Task Viewing (Priority: P1) 🎯 MVP

**Goal**: Users can log in and view their personal task list

**Independent Test**: Log in with valid credentials and verify task list displays correctly with only user's own tasks

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create login page with email/password form in frontend/app/login/page.tsx
- [ ] T019 [P] [US1] Create signup page with email/password form in frontend/app/signup/page.tsx
- [ ] T020 [P] [US1] Create AuthForm component for login/signup forms in frontend/components/AuthForm.tsx
- [ ] T021 [US1] Implement form validation for email and password in frontend/components/AuthForm.tsx
- [ ] T022 [US1] Connect AuthForm to AuthContext login/signup methods in frontend/components/AuthForm.tsx
- [ ] T023 [US1] Add error handling and loading states to AuthForm in frontend/components/AuthForm.tsx
- [ ] T024 [US1] Create protected task list page in frontend/app/tasks/page.tsx
- [ ] T025 [US1] Implement authentication check and redirect logic in frontend/app/tasks/page.tsx
- [ ] T026 [US1] Create API method to fetch user tasks (GET /api/users/{userId}/tasks) in frontend/lib/api.ts
- [ ] T027 [US1] Create TaskList component to display tasks array in frontend/components/TaskList.tsx
- [ ] T028 [US1] Create TaskItem component to display individual task in frontend/components/TaskItem.tsx
- [ ] T029 [US1] Implement task list loading state with LoadingSpinner in frontend/components/TaskList.tsx
- [ ] T030 [US1] Implement task list error state with ErrorMessage in frontend/components/TaskList.tsx
- [ ] T031 [US1] Add responsive styling for mobile (320px+) and desktop (1024px+) to TaskList in frontend/components/TaskList.tsx
- [ ] T032 [US1] Handle 401 Unauthorized errors with redirect to login in frontend/lib/api.ts
- [ ] T033 [US1] Create home/landing page with navigation to login/signup in frontend/app/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - users can authenticate and view their tasks

---

## Phase 4: User Story 2 - Task Creation (Priority: P2)

**Goal**: Users can create new tasks and see them appear in their list

**Independent Test**: Log in, click create task, enter title and description, verify task appears in list

### Implementation for User Story 2

- [ ] T034 [P] [US2] Create TaskForm component with title and description fields in frontend/components/TaskForm.tsx
- [ ] T035 [US2] Implement form validation (title required, 1-200 chars, description max 1000 chars) in frontend/components/TaskForm.tsx
- [ ] T036 [US2] Add inline error display for validation errors in frontend/components/TaskForm.tsx
- [ ] T037 [US2] Create API method to create task (POST /api/users/{userId}/tasks) in frontend/lib/api.ts
- [ ] T038 [US2] Implement form submission with loading state in frontend/components/TaskForm.tsx
- [ ] T039 [US2] Add optimistic update to task list on successful creation in frontend/app/tasks/page.tsx
- [ ] T040 [US2] Implement success toast notification for task creation in frontend/app/tasks/page.tsx
- [ ] T041 [US2] Implement error handling with user-friendly messages in frontend/components/TaskForm.tsx
- [ ] T042 [US2] Add "Create Task" button/modal trigger to task list page in frontend/app/tasks/page.tsx
- [ ] T043 [US2] Clear form after successful task creation in frontend/components/TaskForm.tsx
- [ ] T044 [US2] Add responsive styling for mobile form layout in frontend/components/TaskForm.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can view and create tasks

---

## Phase 5: User Story 3 - Task Completion Toggle (Priority: P3)

**Goal**: Users can mark tasks as complete/incomplete and see visual feedback

**Independent Test**: Click checkbox on task, verify visual state changes (strikethrough/checkmark) and persists on refresh

### Implementation for User Story 3

- [ ] T045 [US3] Add checkbox UI element to TaskItem component in frontend/components/TaskItem.tsx
- [ ] T046 [US3] Create API method to toggle task completion (PATCH /api/users/{userId}/tasks/{taskId}) in frontend/lib/api.ts
- [ ] T047 [US3] Implement optimistic update for completion toggle in frontend/components/TaskItem.tsx
- [ ] T048 [US3] Add visual feedback for completed tasks (strikethrough text, checkmark icon) in frontend/components/TaskItem.tsx
- [ ] T049 [US3] Implement revert logic on API failure with error toast in frontend/components/TaskItem.tsx
- [ ] T050 [US3] Add loading state during completion toggle (disable checkbox) in frontend/components/TaskItem.tsx
- [ ] T051 [US3] Ensure touch target is minimum 44x44 pixels on mobile in frontend/components/TaskItem.tsx
- [ ] T052 [US3] Add immediate UI response (<100ms) for completion toggle in frontend/components/TaskItem.tsx

**Checkpoint**: All three user stories should now work independently - users can view, create, and complete tasks

---

## Phase 6: User Story 4 - Task Management (Priority: P4)

**Goal**: Users can edit and delete tasks with full CRUD operations

**Independent Test**: Edit task details and verify changes persist, delete task and verify removal from list

### Implementation for User Story 4

- [ ] T053 [P] [US4] Create task detail/edit page in frontend/app/tasks/[id]/page.tsx
- [ ] T054 [US4] Create API method to get single task (GET /api/users/{userId}/tasks/{taskId}) in frontend/lib/api.ts
- [ ] T055 [US4] Create API method to update task (PUT /api/users/{userId}/tasks/{taskId}) in frontend/lib/api.ts
- [ ] T056 [US4] Create API method to delete task (DELETE /api/users/{userId}/tasks/{taskId}) in frontend/lib/api.ts
- [ ] T057 [US4] Add edit mode to TaskForm component with pre-filled values in frontend/components/TaskForm.tsx
- [ ] T058 [US4] Implement update task functionality with optimistic update in frontend/app/tasks/[id]/page.tsx
- [ ] T059 [US4] Add "Edit" button to TaskItem component in frontend/components/TaskItem.tsx
- [ ] T060 [US4] Add "Delete" button to TaskItem component in frontend/components/TaskItem.tsx
- [ ] T061 [US4] Implement delete confirmation dialog (optional) in frontend/components/TaskItem.tsx
- [ ] T062 [US4] Implement optimistic delete with revert on failure in frontend/app/tasks/page.tsx
- [ ] T063 [US4] Add success toast for edit and delete operations in frontend/app/tasks/page.tsx
- [ ] T064 [US4] Add cancel button to edit form that returns to task list in frontend/app/tasks/[id]/page.tsx
- [ ] T065 [US4] Handle 404 errors for non-existent tasks in frontend/app/tasks/[id]/page.tsx

**Checkpoint**: Full CRUD operations complete - users can view, create, complete, edit, and delete tasks

---

## Phase 7: User Story 5 - Responsive Design & Error Handling (Priority: P5)

**Goal**: Interface works seamlessly on all devices with comprehensive error handling

**Independent Test**: Access app on mobile, tablet, and desktop; verify all functionality works and displays correctly

### Implementation for User Story 5

- [ ] T066 [P] [US5] Add responsive breakpoints to all components (mobile <768px, tablet 768-1023px, desktop ≥1024px) in frontend/components/*.tsx
- [ ] T067 [P] [US5] Implement mobile-first responsive grid layout for task list in frontend/components/TaskList.tsx
- [ ] T068 [P] [US5] Add responsive typography (text-sm mobile, text-base desktop) in frontend/app/globals.css
- [ ] T069 [P] [US5] Ensure all interactive elements are 44x44px minimum on mobile in frontend/components/*.tsx
- [ ] T070 [P] [US5] Add touch-friendly spacing between elements on mobile in frontend/components/*.tsx
- [ ] T071 [US5] Create React Error Boundary component in frontend/components/ErrorBoundary.tsx
- [ ] T072 [US5] Wrap app in ErrorBoundary in frontend/app/layout.tsx
- [ ] T073 [US5] Create toast notification system for success/error messages in frontend/lib/toast.ts
- [ ] T074 [US5] Implement toast auto-dismiss after 3 seconds in frontend/lib/toast.ts
- [ ] T075 [US5] Add network error handling with retry button in frontend/lib/api.ts
- [ ] T076 [US5] Add 401 error handling with automatic redirect to login in frontend/lib/api.ts
- [ ] T077 [US5] Add 400 validation error handling with field-specific messages in frontend/components/TaskForm.tsx
- [ ] T078 [US5] Add 500 server error handling with generic message in frontend/lib/api.ts
- [ ] T079 [US5] Add loading indicators for all API operations in frontend/components/*.tsx
- [ ] T080 [US5] Test layout on 320px, 768px, 1024px, and 1920px screen widths
- [ ] T081 [US5] Verify touch interactions work correctly on mobile devices

**Checkpoint**: All user stories complete with responsive design and comprehensive error handling

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T082 [P] Add logout functionality to navigation in frontend/app/layout.tsx
- [ ] T083 [P] Create navigation component with links to tasks, login, signup in frontend/components/Navigation.tsx
- [ ] T084 [P] Add user email display in navigation when authenticated in frontend/components/Navigation.tsx
- [ ] T085 [P] Implement session persistence across page refreshes in frontend/lib/auth.ts
- [ ] T086 [P] Add loading state for initial authentication check in frontend/app/layout.tsx
- [ ] T087 Code cleanup and remove console.logs from production code in frontend/**/*.tsx
- [ ] T088 [P] Add proper TypeScript types to all components and functions in frontend/**/*.tsx
- [ ] T089 [P] Verify all API requests include Authorization header in frontend/lib/api.ts
- [ ] T090 [P] Test that 401 errors trigger re-authentication flow in frontend/lib/api.ts
- [ ] T091 Verify users can only see their own tasks (user isolation) by testing with multiple accounts
- [ ] T092 [P] Add meta tags for SEO and social sharing in frontend/app/layout.tsx
- [ ] T093 [P] Optimize images and assets for performance in frontend/public/
- [ ] T094 Run production build and verify no errors with npm run build in frontend/
- [ ] T095 Test full workflow (signup → login → create task → complete → edit → delete → logout) end-to-end
- [ ] T096 Verify application meets all success criteria from spec.md (SC-001 through SC-010)
- [ ] T097 Create deployment documentation in frontend/README.md
- [ ] T098 Verify quickstart.md instructions are accurate and reproducible

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Extends US1/US2 but independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Applies to all stories but independently testable

### Within Each User Story

- Tasks marked [P] can run in parallel (different files)
- Sequential tasks must complete in order (same file or dependencies)
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004, T005, T006, T007)
- All Foundational tasks marked [P] can run in parallel (T009, T010, T011, T012, T013, T015, T016, T017)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within each story, tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch parallel tasks for User Story 1:
Task T018: "Create login page in frontend/app/login/page.tsx"
Task T019: "Create signup page in frontend/app/signup/page.tsx"
Task T020: "Create AuthForm component in frontend/components/AuthForm.tsx"

# After T020 completes, these can run in parallel:
Task T024: "Create protected task list page in frontend/app/tasks/page.tsx"
Task T026: "Create API method to fetch user tasks in frontend/lib/api.ts"
```

---

## Parallel Example: User Story 5

```bash
# Launch all responsive design tasks together:
Task T066: "Add responsive breakpoints to all components"
Task T067: "Implement mobile-first grid layout"
Task T068: "Add responsive typography"
Task T069: "Ensure 44x44px touch targets"
Task T070: "Add touch-friendly spacing"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T017) - CRITICAL
3. Complete Phase 3: User Story 1 (T018-T033)
4. **STOP and VALIDATE**: Test authentication and task viewing independently
5. Deploy/demo if ready - this is a working MVP!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP: View tasks)
3. Add User Story 2 → Test independently → Deploy/Demo (Create tasks)
4. Add User Story 3 → Test independently → Deploy/Demo (Complete tasks)
5. Add User Story 4 → Test independently → Deploy/Demo (Full CRUD)
6. Add User Story 5 → Test independently → Deploy/Demo (Responsive + Polish)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T017)
2. Once Foundational is done:
   - Developer A: User Story 1 (T018-T033)
   - Developer B: User Story 2 (T034-T044)
   - Developer C: User Story 3 (T045-T052)
3. Stories complete and integrate independently
4. Continue with US4, US5, and Polish phases

---

## Success Criteria Mapping

Each user story maps to specific success criteria from spec.md:

- **US1 (Task Viewing)**: SC-001 (2s load), SC-009 (401 handling), SC-010 (network latency)
- **US2 (Task Creation)**: SC-002 (3s creation), SC-005 (95% success), SC-006 (error messages)
- **US3 (Completion Toggle)**: SC-003 (100ms UI response), SC-005 (95% success)
- **US4 (Edit/Delete)**: SC-005 (95% success), SC-008 (full workflow)
- **US5 (Responsive/Errors)**: SC-004 (320-1920px), SC-006 (error messages), SC-007 (44x44px touch), SC-009 (401 handling), SC-010 (network latency)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are excluded per spec (not explicitly requested)
- All paths use frontend/ directory prefix
- Follow mobile-first responsive design approach
- Implement optimistic updates for better UX
- Handle all error cases with user-friendly messages
