# Research & Technical Decisions: Frontend Interface & Responsive UX

**Feature**: 001-frontend-responsive-ux
**Date**: 2026-02-10
**Status**: Completed

## Overview

This document resolves all technical clarifications identified in the implementation plan and establishes the technical foundation for the frontend implementation.

## Research Tasks & Decisions

### 1. Better Auth Client SDK Integration with Next.js 16+ App Router

**Decision**: Use Better Auth React SDK with Next.js App Router middleware for authentication

**Rationale**:
- Better Auth provides official React SDK with Next.js 16+ App Router support
- Middleware pattern allows protecting routes at the edge before page rendering
- SDK handles token management, refresh, and session state automatically
- Integrates seamlessly with React Server Components and Client Components

**Alternatives Considered**:
- **Manual JWT handling**: More control but requires implementing token refresh, storage, and session management from scratch
- **NextAuth.js**: Popular but adds unnecessary complexity when Better Auth is already mandated by project requirements

**Implementation Approach**:
- Install `@better-auth/react` package
- Configure Better Auth provider in root layout
- Use middleware.ts for route protection
- Leverage `useSession()` hook for client-side auth state

---

### 2. JWT Token Storage Best Practices

**Decision**: Use httpOnly cookies for JWT token storage (if Better Auth supports), fallback to sessionStorage

**Rationale**:
- **httpOnly cookies**: Most secure option, immune to XSS attacks, automatically sent with requests
- **sessionStorage**: Acceptable fallback, cleared on tab close, better than localStorage for security
- **localStorage**: Avoid due to XSS vulnerability and persistence across sessions

**Security Considerations**:
- httpOnly cookies prevent JavaScript access, mitigating XSS risks
- SameSite=Strict attribute prevents CSRF attacks
- Secure flag ensures transmission only over HTTPS
- If using sessionStorage, implement proper cleanup on logout

**Implementation**:
- Check Better Auth SDK default behavior (likely uses httpOnly cookies)
- If manual implementation needed, use sessionStorage with proper cleanup
- Never expose tokens in URL parameters or localStorage

---

### 3. Backend API Base URL and Endpoint Structure

**Decision**: Use environment variable for API base URL with RESTful endpoint structure

**Backend API Base URL**:
- Development: `http://localhost:8000` (FastAPI default)
- Production: Set via `NEXT_PUBLIC_API_BASE_URL` environment variable

**Endpoint Structure** (RESTful conventions):
```
GET    /api/users/{userId}/tasks           # List all tasks for user
POST   /api/users/{userId}/tasks           # Create new task
GET    /api/users/{userId}/tasks/{taskId}  # Get single task
PUT    /api/users/{userId}/tasks/{taskId}  # Update task (full)
PATCH  /api/users/{userId}/tasks/{taskId}  # Update task (partial, e.g., completion)
DELETE /api/users/{userId}/tasks/{taskId}  # Delete task
```

**Rationale**:
- RESTful structure is standard, predictable, and aligns with FastAPI conventions
- User ID in path ensures explicit user context for backend validation
- Environment variables allow different configurations per environment
- NEXT_PUBLIC_ prefix makes variable available to browser code

**Alternatives Considered**:
- **GraphQL**: Overkill for simple CRUD operations, adds complexity
- **Flat endpoints** (e.g., /api/tasks): Less explicit about user context, harder to validate

---

### 4. JWT Token Format and Authorization Header

**Decision**: Use `Authorization: Bearer <token>` header format

**Token Format**:
- Standard JWT format: `header.payload.signature`
- Payload includes: `userId`, `email`, `exp` (expiration), `iat` (issued at)
- Signed with `BETTER_AUTH_SECRET` shared between frontend and backend

**Header Format**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Rationale**:
- Industry standard for JWT authentication
- Supported by all HTTP clients and frameworks
- FastAPI has built-in support for Bearer token extraction
- Better Auth SDK likely uses this format by default

**Implementation**:
- API client automatically adds Authorization header to all requests
- Extract token from Better Auth session state
- Handle 401 responses by triggering re-authentication

---

### 5. Backend Error Response Format and Status Codes

**Decision**: Standardized JSON error format with HTTP status codes

**Error Response Format**:
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": "JWT token is missing or invalid"
  }
}
```

**HTTP Status Codes**:
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Validation error (e.g., missing required fields)
- `401 Unauthorized`: Authentication required or token invalid
- `403 Forbidden`: User not authorized to access resource
- `404 Not Found`: Resource doesn't exist
- `500 Internal Server Error`: Server-side error

**Rationale**:
- Consistent error format simplifies frontend error handling
- HTTP status codes provide semantic meaning
- Details field allows specific error messages for debugging
- Aligns with REST API best practices

**Frontend Handling**:
- Parse error response and display user-friendly messages
- 401 → Redirect to login
- 400 → Show validation errors on form
- 500 → Show generic error message with retry option

---

### 6. HTTP Client Selection

**Decision**: Use native `fetch` API with custom wrapper

**Rationale**:
- Native to browsers and Node.js 18+, no additional dependencies
- Sufficient for simple REST API calls
- Smaller bundle size compared to axios
- Modern async/await syntax

**Wrapper Features**:
- Automatic Authorization header injection
- Base URL configuration
- Error response parsing
- Request/response logging (development only)
- Retry logic for network failures

**Alternatives Considered**:
- **axios**: More features but adds 13KB to bundle, unnecessary for this project
- **SWR/React Query**: Overkill for simple CRUD, adds caching complexity

**Implementation**:
```typescript
// lib/api.ts
async function apiRequest(endpoint: string, options: RequestInit) {
  const token = getSessionToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new APIError(error, response.status);
  }

  return response.json();
}
```

---

### 7. State Management Approach

**Decision**: React Context for auth state + component-level state for UI

**Rationale**:
- Simple application with limited global state needs
- React Context sufficient for sharing auth session across components
- Component-level state (useState) for task list, forms, loading states
- Avoids over-engineering with Redux/Zustand for small-scale app
- Aligns with "avoid over-engineering" principle from CLAUDE.md

**State Structure**:
- **Global (Context)**: User session (token, userId, email)
- **Component-level**: Task list, form data, loading states, error messages

**Optimistic Updates**:
- Update UI immediately on user action (e.g., mark task complete)
- Revert if API call fails
- Show loading indicator during API call

**Alternatives Considered**:
- **Redux**: Too complex for this scale, adds boilerplate
- **Zustand**: Simpler than Redux but still unnecessary
- **React Query**: Excellent for data fetching but adds caching complexity we don't need

---

### 8. Responsive Design Strategy with TailwindCSS

**Decision**: Mobile-first approach with TailwindCSS utility classes

**Breakpoints**:
- Mobile: `< 768px` (default, no prefix)
- Tablet: `768px - 1023px` (md: prefix)
- Desktop: `≥ 1024px` (lg: prefix)

**Mobile-First Approach**:
- Design for mobile by default
- Add complexity for larger screens using `md:` and `lg:` prefixes
- Ensures mobile experience is prioritized

**Touch Optimization**:
- Minimum touch target: 44x44 pixels (SC-007)
- Adequate spacing between interactive elements
- Larger tap areas for checkboxes and buttons on mobile

**Layout Strategy**:
- Single column on mobile
- Multi-column grid on tablet/desktop
- Responsive typography (text-sm on mobile, text-base on desktop)
- Flexible containers with max-width constraints

**Rationale**:
- Mobile-first ensures core functionality works on smallest screens
- TailwindCSS utilities make responsive design straightforward
- Aligns with spec requirement for 320px-1920px support

**Example**:
```tsx
<div className="p-4 md:p-6 lg:p-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Task items */}
  </div>
</div>
```

---

### 9. Error Handling Patterns

**Decision**: Multi-layer error handling with user-friendly messages

**Error Handling Layers**:

1. **API Client Layer**: Catch network errors, parse error responses
2. **Component Layer**: Display error messages, handle retry logic
3. **Error Boundary**: Catch unexpected React errors

**User Feedback Strategy**:
- **Toast notifications**: For success/error messages (task created, deleted, etc.)
- **Inline errors**: For form validation errors
- **Error states**: For failed data loading (show retry button)
- **401 handling**: Automatic redirect to login page

**Error Message Guidelines**:
- User-friendly language (avoid technical jargon)
- Actionable (tell user what to do next)
- Specific (explain what went wrong)

**Examples**:
- Network error: "Unable to connect. Please check your internet connection and try again."
- 401 error: "Your session has expired. Please log in again."
- Validation error: "Task title is required."
- 500 error: "Something went wrong. Please try again later."

**Implementation**:
- Create `ErrorMessage` component for consistent styling
- Use React Error Boundary for unexpected errors
- Log errors to console in development for debugging

---

### 10. Testing Strategy

**Decision**: Focus on critical path testing with Jest + React Testing Library

**Testing Priorities** (aligned with "avoid over-engineering"):
1. **Critical paths**: Login, task CRUD operations, authentication flows
2. **Component tests**: Key components (TaskList, TaskForm, TaskItem)
3. **Integration tests**: API client, auth flow
4. **E2E tests**: Minimal - only happy path for full workflow

**Testing Tools**:
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing (user-centric approach)
- **MSW (Mock Service Worker)**: API mocking for tests
- **Playwright**: E2E testing (optional, if time permits)

**Coverage Goals**:
- Critical components: 80%+ coverage
- Utility functions: 90%+ coverage
- Overall: 70%+ coverage (pragmatic, not dogmatic)

**What NOT to test** (avoid over-engineering):
- Third-party library internals (Better Auth, Next.js)
- Trivial components (simple presentational components)
- CSS/styling (visual regression testing out of scope)

**Rationale**:
- Focus on business logic and critical user flows
- Avoid testing implementation details
- Pragmatic approach balances quality and velocity
- Aligns with hackathon timeline constraints

---

## Task Data Model Structure (from Backend API)

**Decision**: Based on typical FastAPI + SQLModel structure

**Task Entity**:
```typescript
interface Task {
  id: string;              // UUID or integer
  title: string;           // Required, max 200 chars
  description: string;     // Optional, max 1000 chars
  completed: boolean;      // Default: false
  userId: string;          // Foreign key to user
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

**API Request/Response Types**:
```typescript
// Create task request
interface CreateTaskRequest {
  title: string;
  description?: string;
}

// Update task request
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

// List tasks response
interface ListTasksResponse {
  tasks: Task[];
  total: number;
}
```

**Rationale**:
- Matches typical SQLModel schema structure
- Includes audit fields (createdAt, updatedAt) for tracking
- Boolean completed field for simple toggle operation
- Optional description allows minimal task creation

---

## Summary of Resolved Clarifications

| Clarification | Decision |
|---------------|----------|
| Backend API base URL | `http://localhost:8000` (dev), env var for prod |
| JWT token storage | httpOnly cookies (preferred) or sessionStorage |
| JWT token format | Standard JWT with `Authorization: Bearer <token>` |
| Backend error format | JSON with `{error: {code, message, details}}` |
| Better Auth integration | React SDK with Next.js middleware |
| Task data model | Task entity with id, title, description, completed, userId, timestamps |
| HTTP client | Native fetch with custom wrapper |
| State management | React Context for auth + component state |
| Responsive design | Mobile-first with TailwindCSS (320px-1920px) |
| Error handling | Multi-layer with user-friendly messages |
| Testing strategy | Jest + RTL for critical paths, pragmatic coverage |

## Next Steps

1. ✅ Research completed - all clarifications resolved
2. ⏳ Proceed to Phase 1: Generate data-model.md, contracts/, quickstart.md
3. ⏳ Update agent context with technology decisions
4. ⏳ Generate tasks.md via `/sp.tasks` command
