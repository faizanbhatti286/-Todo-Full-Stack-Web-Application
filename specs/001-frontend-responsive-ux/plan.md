# Implementation Plan: Frontend Interface & Responsive UX

**Branch**: `001-frontend-responsive-ux` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-frontend-responsive-ux/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a responsive Next.js 16+ frontend that integrates with the FastAPI backend and JWT authentication to manage user tasks. The frontend will provide full CRUD operations for tasks (create, read, update, delete, complete/incomplete toggle) with proper authentication handling, error management, and responsive design across desktop and mobile devices.

## Technical Context

**Language/Version**: TypeScript/JavaScript with Next.js 16+ (App Router), Node.js 18+ LTS
**Primary Dependencies**: Next.js 16+, React 18+, Better Auth client SDK, TailwindCSS for styling, NEEDS CLARIFICATION: HTTP client library (fetch API vs axios)
**Storage**: N/A (frontend only - backend FastAPI handles data persistence)
**Testing**: Jest + React Testing Library for component tests, Playwright for E2E tests, NEEDS CLARIFICATION: testing strategy and coverage requirements
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), responsive for mobile and desktop
**Project Type**: Web application (frontend only)
**Performance Goals**: <2s initial page load, <100ms UI response time, <3s for API operations with loading states
**Constraints**: Responsive design 320px-1920px width, JWT authentication required on all API calls, real-time UI updates, no offline mode
**Scale/Scope**: Single-user frontend interface, ~5-10 React components, ~3-5 pages/routes (login, signup, task list, task detail/edit)

**Clarifications Needed**:
- NEEDS CLARIFICATION: Backend API base URL and endpoint structure
- NEEDS CLARIFICATION: JWT token storage mechanism (localStorage, sessionStorage, httpOnly cookies)
- NEEDS CLARIFICATION: JWT token format and where to include it (Authorization header format)
- NEEDS CLARIFICATION: Backend error response format and status codes
- NEEDS CLARIFICATION: Better Auth client configuration and integration approach
- NEEDS CLARIFICATION: Task data model structure from backend API

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Check (Before Phase 0)

- ✅ **Spec-Driven Development**: Implementation will follow the defined spec with clear user stories (P1-P5), functional requirements (FR-001 to FR-015), and will proceed through plan → tasks → implementation workflow
- ✅ **Accuracy & Correctness**: All UI behaviors match spec requirements - task CRUD operations, authentication flows, error handling, and responsive design as specified in acceptance scenarios
- ✅ **Security & User Isolation**: JWT authentication will be enforced on all API requests (FR-006), 401 errors handled properly (FR-007), ensuring users only access their own data
- ✅ **Reproducibility**: Frontend setup will be documented in quickstart.md with clear installation, configuration, and deployment steps
- ✅ **Responsive Design**: UI will work across 320px-1920px screen widths (SC-004) with touch-friendly elements (SC-007) as specified
- ✅ **Tech Stack Compliance**: Using Next.js 16+ (App Router) as mandated, integrating with FastAPI backend and Better Auth for authentication

**Initial Gate Status**: ✅ PASSED

### Post-Design Check (After Phase 1)

- ✅ **Spec-Driven Development**: Research and design artifacts completed following workflow - research.md, data-model.md, contracts/, quickstart.md all generated
- ✅ **Accuracy & Correctness**: All technical decisions documented with rationale, API contracts defined, data models mapped to spec requirements
- ✅ **Security & User Isolation**: JWT token storage strategy defined (httpOnly cookies preferred), Authorization header format specified, user isolation enforced in API design
- ✅ **Reproducibility**: Comprehensive quickstart.md created with setup instructions, environment configuration, development workflow, and deployment guide
- ✅ **Responsive Design**: Mobile-first approach documented with TailwindCSS breakpoints (320px-1920px), touch optimization specified (44x44px minimum)
- ✅ **Tech Stack Compliance**: All technology choices align with mandated stack - Next.js 16+ App Router, Better Auth React SDK, TailwindCSS, TypeScript

**Final Gate Status**: ✅ PASSED - All constitution principles satisfied after design phase, no violations to justify

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-responsive-ux/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output - technical decisions and patterns
├── data-model.md        # Phase 1 output - frontend data structures and state
├── quickstart.md        # Phase 1 output - setup and development guide
├── contracts/           # Phase 1 output - API contracts and interfaces
│   ├── api-endpoints.md # Backend API endpoint specifications
│   └── types.ts         # TypeScript interfaces for API data
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/                    # Next.js 16+ App Router pages
│   │   ├── layout.tsx          # Root layout with auth provider
│   │   ├── page.tsx            # Home/landing page
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   └── tasks/              # Task management pages
│   │       ├── page.tsx        # Task list view
│   │       └── [id]/           # Task detail/edit view
│   │           └── page.tsx
│   ├── components/             # React components
│   │   ├── TaskList.tsx        # Task list display component
│   │   ├── TaskItem.tsx        # Individual task item component
│   │   ├── TaskForm.tsx        # Task create/edit form
│   │   ├── AuthForm.tsx        # Login/signup form component
│   │   ├── ErrorMessage.tsx    # Error display component
│   │   └── LoadingSpinner.tsx  # Loading indicator component
│   ├── lib/                    # Utilities and services
│   │   ├── api.ts              # API client with JWT handling
│   │   ├── auth.ts             # Better Auth integration
│   │   └── types.ts            # TypeScript type definitions
│   └── styles/                 # Global styles
│       └── globals.css         # TailwindCSS imports and global styles
├── public/                     # Static assets
├── tests/                      # Test files
│   ├── components/             # Component tests
│   └── e2e/                    # End-to-end tests
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # TailwindCSS configuration
├── next.config.js              # Next.js configuration
└── .env.local.example          # Environment variables template

backend/                        # Existing backend (dependency)
├── [FastAPI backend structure - not modified by this feature]
```

**Structure Decision**: Web application structure (Option 2 from template) with separate frontend/ directory. The frontend is a standalone Next.js application that communicates with the existing FastAPI backend via REST API. This separation allows independent development and deployment of frontend and backend services.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - table not needed.

## Phase 0: Research & Technical Decisions

**Status**: To be completed

**Research Tasks**:
1. Investigate Better Auth client SDK integration with Next.js 16+ App Router
2. Determine JWT token storage best practices (security vs convenience)
3. Research Next.js 16+ App Router authentication patterns and middleware
4. Identify backend API endpoint structure and contracts
5. Determine optimal state management approach (React Context, Zustand, or native React state)
6. Research responsive design patterns with TailwindCSS for 320px-1920px range
7. Investigate error handling patterns for API failures and authentication errors
8. Determine testing strategy for Next.js App Router components

**Output**: `research.md` with decisions, rationale, and alternatives for each research task

## Phase 1: Design & Contracts

**Status**: To be completed after Phase 0

**Deliverables**:
1. **data-model.md**: Frontend data structures
   - Task interface (id, title, description, completed, userId, timestamps)
   - User session interface (token, userId, email)
   - UI state models (loading, error, form validation)
   - State management approach

2. **contracts/**: API contracts and interfaces
   - `api-endpoints.md`: Backend API endpoint specifications
     - GET /api/users/{userId}/tasks - List user tasks
     - POST /api/users/{userId}/tasks - Create task
     - PUT /api/users/{userId}/tasks/{taskId} - Update task
     - DELETE /api/users/{userId}/tasks/{taskId} - Delete task
     - PATCH /api/users/{userId}/tasks/{taskId}/complete - Toggle completion
   - `types.ts`: TypeScript interfaces for API requests/responses

3. **quickstart.md**: Development setup guide
   - Prerequisites (Node.js, npm/yarn)
   - Installation steps
   - Environment configuration (.env.local setup)
   - Development server commands
   - Build and deployment instructions

4. **Agent context update**: Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`

## Phase 2: Task Generation

**Status**: Not started (requires `/sp.tasks` command)

This phase is handled by the `/sp.tasks` command and will generate `tasks.md` with implementation tasks based on this plan.

## Key Design Decisions (To be finalized in research.md)

### Authentication Flow
- Better Auth client SDK integration approach
- JWT token storage location and security considerations
- Token refresh strategy (if applicable)
- Protected route implementation in App Router

### API Integration
- HTTP client selection (native fetch vs axios)
- API base URL configuration
- Request/response interceptors for JWT injection
- Error handling and retry logic

### State Management
- Component-level state vs global state management
- Optimistic UI updates for task operations
- Cache invalidation strategy

### Responsive Design
- Mobile-first vs desktop-first approach
- Breakpoint strategy (mobile: <768px, tablet: 768-1024px, desktop: >1024px)
- Touch interaction optimization for mobile

### Error Handling
- Error boundary implementation
- Toast/notification system for user feedback
- Validation error display strategy

## Dependencies & Integration Points

### External Dependencies
- **Backend API** (FastAPI): Must be running and accessible
  - Base URL configuration required
  - CORS configuration must allow frontend origin
- **Better Auth**: Authentication service must be configured
  - Client SDK integration required
  - JWT signing secret must match backend
- **Neon PostgreSQL**: Database must be provisioned and accessible to backend

### Integration Requirements
- Backend API must return consistent error format
- JWT tokens must be valid and verifiable by backend
- API endpoints must enforce user isolation (users can only access their own tasks)

## Risk Analysis

### Technical Risks
1. **JWT Token Expiration**: Token expires mid-session during task operations
   - Mitigation: Implement token refresh or graceful re-authentication flow
2. **API Availability**: Backend API unreachable or slow
   - Mitigation: Loading states, error messages, retry logic
3. **Browser Compatibility**: Features not supported in older browsers
   - Mitigation: Target modern browsers only (last 2 versions), document requirements
4. **Responsive Layout Issues**: Complex layouts break on certain screen sizes
   - Mitigation: Test on multiple devices, use TailwindCSS responsive utilities

### Implementation Risks
1. **Better Auth Integration Complexity**: SDK may have breaking changes or poor documentation
   - Mitigation: Research thoroughly in Phase 0, consider fallback to manual JWT handling
2. **State Management Complexity**: Over-engineering state management
   - Mitigation: Start simple with React state, add complexity only if needed
3. **Testing Coverage**: Insufficient test coverage for edge cases
   - Mitigation: Define testing strategy in Phase 0, prioritize critical paths

## Success Metrics (from spec)

- **SC-001**: Task list loads within 2 seconds
- **SC-002**: Task creation completes within 3 seconds
- **SC-003**: UI responds to completion toggle within 100ms
- **SC-004**: Layout works correctly from 320px to 1920px width
- **SC-005**: 95% of operations succeed on first attempt
- **SC-006**: Error messages appear within 1 second
- **SC-007**: Interactive elements are 44x44 pixels minimum on mobile
- **SC-008**: Full workflow (CRUD operations) works without bugs
- **SC-009**: 401 errors handled within 1 second
- **SC-010**: Application remains responsive with up to 3s network latency

## Next Steps

1. ✅ Complete this plan document
2. ⏳ Execute Phase 0: Research (generate research.md)
3. ⏳ Execute Phase 1: Design (generate data-model.md, contracts/, quickstart.md)
4. ⏳ Update agent context
5. ⏳ Run `/sp.tasks` to generate implementation tasks
6. ⏳ Execute implementation via `/sp.implement`
