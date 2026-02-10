# Tasks: Frontend Interface & Responsive UX

**Input**: Design documents from `/specs/003-responsive-frontend/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/` for source code
- **Tests**: `frontend/tests/` for test files
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify Next.js 16+ project structure exists in frontend/ directory
- [x] T002 Install required dependencies: React 18+, TypeScript 5.x, Tailwind CSS, Jest, React Testing Library, Playwright
- [x] T003 [P] Configure TypeScript with strict mode in frontend/tsconfig.json
- [x] T004 [P] Configure Tailwind CSS with responsive breakpoints in frontend/tailwind.config.js
- [x] T005 [P] Create environment configuration file frontend/.env.example with NEXT_PUBLIC_API_URL and BETTER_AUTH_SECRET
- [x] T006 [P] Setup global styles with Tailwind directives in frontend/app/globals.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create TypeScript type definitions for Task entity in frontend/src/types/task.ts
- [x] T008 [P] Create TypeScript type definitions for API requests/responses in frontend/src/types/api.ts
- [x] T009 [P] Create TypeScript type definitions for UI components in frontend/src/types/ui.ts
- [x] T010 Implement centralized API client with JWT authentication in frontend/src/lib/api.ts
- [x] T011 [P] Implement form validation utilities in frontend/src/lib/validation.ts
- [x] T012 [P] Create reusable Button component with variants (primary, secondary, danger, ghost) in frontend/src/components/ui/Button.tsx
- [x] T013 [P] Create reusable Input component with label and error display in frontend/src/components/ui/Input.tsx
- [x] T014 [P] Create reusable LoadingSpinner component with size variants in frontend/src/components/ui/LoadingSpinner.tsx
- [x] T015 [P] Create responsive Container layout component in frontend/src/components/layout/Container.tsx
- [x] T016 [P] Create Header layout component with navigation in frontend/src/components/layout/Header.tsx
- [x] T017 Create root layout with Header and Container in frontend/app/layout.tsx
- [x] T018 [P] Configure Next.js middleware for route protection in frontend/middleware.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Task List (Priority: P1) 🎯 MVP

**Goal**: Display authenticated user's task list with proper loading and empty states

**Independent Test**: Sign in as a user, navigate to /tasks, verify task list loads and displays correctly with all tasks visible

### Implementation for User Story 1

- [x] T019 [P] [US1] Create TaskList container component in frontend/src/components/tasks/TaskList.tsx
- [x] T020 [P] [US1] Create TaskItem display component with title, description, and completion status in frontend/src/components/tasks/TaskItem.tsx
- [x] T021 [P] [US1] Create EmptyState component for no tasks message in frontend/src/components/tasks/EmptyState.tsx
- [x] T022 [US1] Create tasks page with GET /tasks API integration in frontend/app/tasks/page.tsx
- [x] T023 [US1] Implement loading state with LoadingSpinner during task fetch in frontend/app/tasks/page.tsx
- [x] T024 [US1] Implement error state display for failed task fetch in frontend/app/tasks/page.tsx
- [x] T025 [US1] Add visual distinction for completed vs incomplete tasks (strikethrough styling) in frontend/src/components/tasks/TaskItem.tsx
- [x] T026 [US1] Implement page refresh handling to reload current task state in frontend/app/tasks/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - users can view their task list

---

## Phase 4: User Story 2 - Create New Task (Priority: P2)

**Goal**: Allow users to create new tasks with validation and immediate feedback

**Independent Test**: Sign in, click "Create Task" button, fill in title and description, submit, verify new task appears in list without page refresh

### Implementation for User Story 2

- [x] T027 [P] [US2] Create Modal component with overlay and close functionality in frontend/src/components/ui/Modal.tsx
- [x] T028 [P] [US2] Create TaskForm component with create mode in frontend/src/components/tasks/TaskForm.tsx
- [x] T029 [US2] Add "Create Task" button to TaskList component in frontend/src/components/tasks/TaskList.tsx
- [x] T030 [US2] Implement modal state management for create form in frontend/app/tasks/page.tsx
- [x] T031 [US2] Integrate POST /tasks API endpoint with optimistic UI update in frontend/app/tasks/page.tsx
- [x] T032 [US2] Implement client-side validation for title (required, max 200 chars) in frontend/src/components/tasks/TaskForm.tsx
- [x] T033 [US2] Implement client-side validation for description (max 1000 chars) in frontend/src/components/tasks/TaskForm.tsx
- [x] T034 [US2] Add form submission loading state with disabled button in frontend/src/components/tasks/TaskForm.tsx
- [x] T035 [US2] Implement error handling with rollback on failed creation in frontend/app/tasks/page.tsx
- [x] T036 [US2] Add cancel button to close form without creating task in frontend/src/components/tasks/TaskForm.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can view and create tasks

---

## Phase 5: User Story 3 - Mark Task as Complete/Incomplete (Priority: P3)

**Goal**: Toggle task completion status with immediate visual feedback

**Independent Test**: Create a task, click checkbox to mark complete, verify visual change (strikethrough), click again to mark incomplete, verify change persists after refresh

### Implementation for User Story 3

- [ ] T037 [P] [US3] Create Checkbox component with checked state and onChange handler in frontend/src/components/ui/Checkbox.tsx
- [ ] T038 [US3] Add Checkbox to TaskItem component for completion toggle in frontend/src/components/tasks/TaskItem.tsx
- [ ] T039 [US3] Implement PATCH /tasks/{id} API integration for is_completed field in frontend/src/app/tasks/page.tsx
- [ ] T040 [US3] Implement optimistic UI update for completion toggle in frontend/src/app/tasks/page.tsx
- [ ] T041 [US3] Add completion styling (strikethrough, checkmark) to TaskItem in frontend/src/components/tasks/TaskItem.tsx
- [ ] T042 [US3] Implement rollback on failed completion update in frontend/src/app/tasks/page.tsx
- [ ] T043 [US3] Ensure completion state persists across page refreshes in frontend/src/app/tasks/page.tsx

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should work - users can view, create, and complete tasks

---

## Phase 6: User Story 4 - Edit Task Details (Priority: P4)

**Goal**: Allow users to modify existing task title and description

**Independent Test**: Create a task, click "Edit" button, modify title/description, save, verify changes appear immediately without page refresh

### Implementation for User Story 4

- [ ] T044 [US4] Add edit mode support to TaskForm component with initialValues prop in frontend/src/components/tasks/TaskForm.tsx
- [ ] T045 [US4] Add "Edit" button to TaskItem component in frontend/src/components/tasks/TaskItem.tsx
- [ ] T046 [US4] Implement edit modal state management in frontend/src/app/tasks/page.tsx
- [ ] T047 [US4] Integrate PATCH /tasks/{id} API endpoint for title and description updates in frontend/src/app/tasks/page.tsx
- [ ] T048 [US4] Pre-fill TaskForm with current task data in edit mode in frontend/src/components/tasks/TaskForm.tsx
- [ ] T049 [US4] Implement optimistic UI update for task edits in frontend/src/app/tasks/page.tsx
- [ ] T050 [US4] Implement validation for edit form (title required, length limits) in frontend/src/components/tasks/TaskForm.tsx
- [ ] T051 [US4] Implement error handling with rollback on failed update in frontend/src/app/tasks/page.tsx
- [ ] T052 [US4] Add cancel button to close edit form without saving in frontend/src/components/tasks/TaskForm.tsx

**Checkpoint**: At this point, User Stories 1-4 should work - users can view, create, complete, and edit tasks

---

## Phase 7: User Story 5 - Delete Task (Priority: P5)

**Goal**: Allow users to permanently remove tasks with confirmation

**Independent Test**: Create a task, click "Delete" button, confirm deletion, verify task disappears immediately without page refresh

### Implementation for User Story 5

- [ ] T053 [P] [US5] Create DeleteConfirmDialog component with confirmation message in frontend/src/components/tasks/DeleteConfirmDialog.tsx
- [ ] T054 [US5] Add "Delete" button to TaskItem component in frontend/src/components/tasks/TaskItem.tsx
- [ ] T055 [US5] Implement delete confirmation dialog state management in frontend/src/app/tasks/page.tsx
- [ ] T056 [US5] Integrate DELETE /tasks/{id} API endpoint with optimistic UI removal in frontend/src/app/tasks/page.tsx
- [ ] T057 [US5] Display task title in confirmation dialog message in frontend/src/components/tasks/DeleteConfirmDialog.tsx
- [ ] T058 [US5] Implement loading state during deletion with disabled buttons in frontend/src/components/tasks/DeleteConfirmDialog.tsx
- [ ] T059 [US5] Implement rollback on failed deletion (restore task to list) in frontend/src/app/tasks/page.tsx
- [ ] T060 [US5] Add cancel button to close dialog without deleting in frontend/src/components/tasks/DeleteConfirmDialog.tsx

**Checkpoint**: At this point, User Stories 1-5 should work - full CRUD operations complete

---

## Phase 8: User Story 6 - Responsive Design Across Devices (Priority: P6)

**Goal**: Ensure optimal experience on all device sizes (320px-1920px+)

**Independent Test**: Access application on desktop (1920px), tablet (768px), and mobile (375px), verify all features work and layout adapts appropriately

### Implementation for User Story 6

- [ ] T061 [P] [US6] Add mobile-first responsive classes to TaskList component (grid layout) in frontend/src/components/tasks/TaskList.tsx
- [ ] T062 [P] [US6] Add responsive padding and spacing to TaskItem component in frontend/src/components/tasks/TaskItem.tsx
- [ ] T063 [P] [US6] Ensure Button component meets 44x44px minimum touch target in frontend/src/components/ui/Button.tsx
- [ ] T064 [P] [US6] Add responsive sizing to Input component for mobile usability in frontend/src/components/ui/Input.tsx
- [ ] T065 [P] [US6] Add responsive layout to TaskForm component (single column mobile, side-by-side desktop) in frontend/src/components/tasks/TaskForm.tsx
- [ ] T066 [P] [US6] Add responsive sizing to Modal component (full screen mobile, centered desktop) in frontend/src/components/ui/Modal.tsx
- [ ] T067 [P] [US6] Add responsive navigation to Header component (hamburger menu mobile) in frontend/src/components/layout/Header.tsx
- [ ] T068 [P] [US6] Ensure Checkbox component meets 44x44px minimum touch target in frontend/src/components/ui/Checkbox.tsx
- [ ] T069 [P] [US6] Add responsive breakpoints to Container component (progressive max-width) in frontend/src/components/layout/Container.tsx
- [ ] T070 [US6] Test and verify responsive behavior on all breakpoints (320px, 640px, 768px, 1024px, 1920px) across all pages
- [ ] T071 [US6] Verify touch-friendly interactions on mobile devices (tap targets, scrolling, forms) across all components

**Checkpoint**: At this point, all features should work seamlessly across all device sizes

---

## Phase 9: User Story 7 - Error Handling and User Feedback (Priority: P7)

**Goal**: Provide clear, helpful feedback for all user actions and error scenarios

**Independent Test**: Simulate various scenarios (success, validation errors, network failures, expired session) and verify appropriate feedback is displayed

### Implementation for User Story 7

- [ ] T072 [P] [US7] Create Toast component with success, error, and info variants in frontend/src/components/ui/Toast.tsx
- [ ] T073 [P] [US7] Create ToastProvider context for global toast management in frontend/src/components/ui/ToastProvider.tsx
- [ ] T074 [US7] Add ToastProvider to root layout in frontend/src/app/layout.tsx
- [ ] T075 [US7] Add success toast for task creation in frontend/src/app/tasks/page.tsx
- [ ] T076 [US7] Add success toast for task update in frontend/src/app/tasks/page.tsx
- [ ] T077 [US7] Add success toast for task completion toggle in frontend/src/app/tasks/page.tsx
- [ ] T078 [US7] Add success toast for task deletion in frontend/src/app/tasks/page.tsx
- [ ] T079 [US7] Add error toast for network failures with user-friendly message in frontend/src/lib/api.ts
- [ ] T080 [US7] Add error toast for validation failures in frontend/src/components/tasks/TaskForm.tsx
- [ ] T081 [US7] Implement 401 error handling with redirect to signin and message in frontend/src/lib/api.ts
- [ ] T082 [US7] Implement 403 error handling with permission error message in frontend/src/lib/api.ts
- [ ] T083 [US7] Implement 500 error handling with user-friendly server error message in frontend/src/lib/api.ts
- [ ] T084 [US7] Add auto-dismiss for success toasts (3 seconds) in frontend/src/components/ui/Toast.tsx
- [ ] T085 [US7] Add manual dismiss for error toasts in frontend/src/components/ui/Toast.tsx
- [ ] T086 [US7] Add loading indicators to all async operations (create, edit, delete, complete) across all components
- [ ] T087 [US7] Implement button disable during API requests to prevent duplicate submissions across all forms

**Checkpoint**: At this point, all error scenarios should be handled gracefully with clear user feedback

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

- [ ] T088 [P] Add home page with redirect to /tasks for authenticated users in frontend/src/app/page.tsx
- [ ] T089 [P] Add 404 page for not found routes in frontend/src/app/not-found.tsx
- [ ] T090 [P] Optimize images and assets in frontend/public/ directory
- [ ] T091 [P] Configure Next.js for production build optimization in frontend/next.config.js
- [ ] T092 [P] Add meta tags and SEO configuration to root layout in frontend/src/app/layout.tsx
- [ ] T093 Verify JWT authentication is enforced on all API requests in frontend/src/lib/api.ts
- [ ] T094 Test that unauthenticated users are redirected to signin when accessing /tasks
- [ ] T095 Test that users with expired tokens are redirected to signin with appropriate message
- [ ] T096 Verify all interactive elements meet accessibility standards (keyboard navigation, focus states)
- [ ] T097 Run production build and verify no errors or warnings
- [ ] T098 Test complete user workflow end-to-end (signup → signin → create task → edit → complete → delete → signout)
- [ ] T099 Verify quickstart.md instructions are accurate and reproducible
- [ ] T100 Document any environment-specific configuration or deployment considerations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5 → P6 → P7)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 TaskItem but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Reuses TaskForm from US2 but independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Adds delete to US1 TaskItem but independently testable
- **User Story 6 (P6)**: Should start after US1-US5 complete - Applies responsive design to all components
- **User Story 7 (P7)**: Should start after US1-US5 complete - Adds error handling to all operations

### Within Each User Story

- Tasks marked [P] can run in parallel (different files, no dependencies)
- Tasks without [P] should run sequentially (dependencies on previous tasks)
- Complete all tasks in a user story before moving to next priority

### Parallel Opportunities

- **Phase 1 (Setup)**: All tasks marked [P] can run in parallel
- **Phase 2 (Foundational)**: All tasks marked [P] can run in parallel (T008-T018)
- **Phase 3 (US1)**: T019, T020, T021 can run in parallel
- **Phase 4 (US2)**: T027, T028 can run in parallel
- **Phase 5 (US3)**: T037 can run independently
- **Phase 6 (US4)**: No parallel tasks (sequential dependencies)
- **Phase 7 (US5)**: T053 can run independently
- **Phase 8 (US6)**: T061-T069 can all run in parallel (different files)
- **Phase 9 (US7)**: T072, T073 can run in parallel
- **Phase 10 (Polish)**: T088-T092 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all parallel tasks for User Story 1 together:
Task T019: "Create TaskList container component in frontend/src/components/tasks/TaskList.tsx"
Task T020: "Create TaskItem display component in frontend/src/components/tasks/TaskItem.tsx"
Task T021: "Create EmptyState component in frontend/src/components/tasks/EmptyState.tsx"

# Then complete sequential tasks:
Task T022: "Create tasks page with GET /tasks API integration"
Task T023: "Implement loading state with LoadingSpinner"
Task T024: "Implement error state display"
Task T025: "Add visual distinction for completed tasks"
Task T026: "Implement page refresh handling"
```

---

## Parallel Example: User Story 6 (Responsive Design)

```bash
# Launch all responsive design tasks together (different files):
Task T061: "Add responsive classes to TaskList"
Task T062: "Add responsive padding to TaskItem"
Task T063: "Ensure Button meets touch target minimum"
Task T064: "Add responsive sizing to Input"
Task T065: "Add responsive layout to TaskForm"
Task T066: "Add responsive sizing to Modal"
Task T067: "Add responsive navigation to Header"
Task T068: "Ensure Checkbox meets touch target minimum"
Task T069: "Add responsive breakpoints to Container"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (View Task List)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**MVP Deliverable**: Users can sign in and view their task list

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Can view + create)
4. Add User Story 3 → Test independently → Deploy/Demo (Can view + create + complete)
5. Add User Story 4 → Test independently → Deploy/Demo (Can view + create + complete + edit)
6. Add User Story 5 → Test independently → Deploy/Demo (Full CRUD)
7. Add User Story 6 → Test independently → Deploy/Demo (Full CRUD + Responsive)
8. Add User Story 7 → Test independently → Deploy/Demo (Full CRUD + Responsive + Error Handling)
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (View)
   - Developer B: User Story 2 (Create)
   - Developer C: User Story 3 (Complete)
3. After US1-US3 complete:
   - Developer A: User Story 4 (Edit)
   - Developer B: User Story 5 (Delete)
   - Developer C: User Story 6 (Responsive)
4. Final: User Story 7 (Error Handling) - applies to all stories
5. Stories complete and integrate independently

---

## Task Summary

- **Total Tasks**: 100 tasks
- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 12 tasks (BLOCKING)
- **Phase 3 (US1 - View)**: 8 tasks (MVP)
- **Phase 4 (US2 - Create)**: 10 tasks
- **Phase 5 (US3 - Complete)**: 7 tasks
- **Phase 6 (US4 - Edit)**: 9 tasks
- **Phase 7 (US5 - Delete)**: 8 tasks
- **Phase 8 (US6 - Responsive)**: 11 tasks
- **Phase 9 (US7 - Error Handling)**: 16 tasks
- **Phase 10 (Polish)**: 13 tasks

**Parallel Opportunities**: 35 tasks marked [P] can run in parallel within their phases

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (26 tasks) delivers viewable task list

**Full Feature**: All 100 tasks deliver complete responsive task management with error handling

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths are relative to repository root
- Frontend code goes in `frontend/src/` directory
- Tests go in `frontend/tests/` directory (not included in this task list as tests are optional)
