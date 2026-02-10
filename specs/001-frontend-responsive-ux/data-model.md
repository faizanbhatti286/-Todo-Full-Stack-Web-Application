# Data Model: Frontend Interface & Responsive UX

**Feature**: 001-frontend-responsive-ux
**Date**: 2026-02-10
**Status**: Completed

## Overview

This document defines the frontend data structures, state management approach, and data flow for the task management interface.

## Core Data Entities

### Task

Represents a todo item in the system.

```typescript
interface Task {
  id: string;              // Unique identifier (UUID or integer from backend)
  title: string;           // Task title (required, max 200 chars)
  description: string;     // Task description (optional, max 1000 chars)
  completed: boolean;      // Completion status (default: false)
  userId: string;          // Owner user ID (foreign key)
  createdAt: string;       // Creation timestamp (ISO 8601)
  updatedAt: string;       // Last update timestamp (ISO 8601)
}
```

**Validation Rules**:
- `title`: Required, 1-200 characters, cannot be only whitespace
- `description`: Optional, 0-1000 characters
- `completed`: Boolean, defaults to false
- `userId`: Must match authenticated user's ID

**State Transitions**:
- Created → Incomplete (default)
- Incomplete ↔ Complete (toggle operation)
- Any state → Deleted (permanent removal)

---

### User Session

Represents an authenticated user session.

```typescript
interface UserSession {
  userId: string;          // Unique user identifier
  email: string;           // User email address
  token: string;           // JWT authentication token
  expiresAt: string;       // Token expiration timestamp (ISO 8601)
}
```

**Session Lifecycle**:
1. User logs in → Session created with JWT token
2. Token stored securely (httpOnly cookie or sessionStorage)
3. Token included in all API requests
4. Token expires → User redirected to login
5. User logs out → Session cleared

---

## API Request/Response Types

### Task Operations

```typescript
// Create Task
interface CreateTaskRequest {
  title: string;
  description?: string;
}

interface CreateTaskResponse {
  task: Task;
}

// Update Task
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

interface UpdateTaskResponse {
  task: Task;
}

// List Tasks
interface ListTasksResponse {
  tasks: Task[];
  total: number;
}

// Delete Task
interface DeleteTaskResponse {
  success: boolean;
  message: string;
}
```

### Authentication

```typescript
// Login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
  expiresAt: string;
}

// Signup
interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
  expiresAt: string;
}
```

---

## UI State Models

### Task List State

```typescript
interface TaskListState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'active' | 'completed';  // Optional filtering
}
```

**State Management**:
- Initial load: `loading: true`, fetch tasks from API
- Success: `tasks` populated, `loading: false`, `error: null`
- Failure: `loading: false`, `error` contains message
- Optimistic updates: Update `tasks` immediately, revert on API failure

---

### Task Form State

```typescript
interface TaskFormState {
  title: string;
  description: string;
  errors: {
    title?: string;
    description?: string;
  };
  submitting: boolean;
  mode: 'create' | 'edit';
}
```

**Validation**:
- `title`: Required, min 1 char, max 200 chars, not only whitespace
- `description`: Optional, max 1000 chars
- Validate on blur and on submit
- Display inline errors below fields

---

### Authentication State

```typescript
interface AuthState {
  user: {
    id: string;
    email: string;
  } | null;
  loading: boolean;
  error: string | null;
}
```

**State Flow**:
- Unauthenticated: `user: null`
- Authenticating: `loading: true`
- Authenticated: `user` populated, `loading: false`
- Auth error: `error` contains message, `user: null`

---

### Global UI State

```typescript
interface UIState {
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  } | null;
}
```

**Toast Notifications**:
- Success: "Task created successfully", "Task deleted"
- Error: "Failed to create task", "Network error"
- Auto-dismiss after 3 seconds
- Only one toast visible at a time

---

## State Management Architecture

### Global State (React Context)

**AuthContext**: Manages user authentication state
```typescript
interface AuthContextValue {
  session: UserSession | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

**Usage**:
- Wrap app in `<AuthProvider>` at root layout
- Access via `useAuth()` hook in components
- Automatically redirects to login if session is null

---

### Component-Level State

**Task List Component**:
- Uses `useState` for tasks array, loading, error
- Fetches tasks on mount with `useEffect`
- Handles CRUD operations with optimistic updates

**Task Form Component**:
- Uses `useState` for form fields and validation errors
- Validates on blur and submit
- Calls API on submit, shows loading state

**Task Item Component**:
- Receives task as prop
- Handles completion toggle with optimistic update
- Emits events for edit/delete actions

---

## Data Flow

### Task List Loading Flow

```
1. Component mounts
2. Set loading: true
3. Fetch GET /api/users/{userId}/tasks
4. On success:
   - Set tasks: response.tasks
   - Set loading: false
5. On error:
   - Set error: error.message
   - Set loading: false
```

### Task Creation Flow

```
1. User fills form
2. Validate on submit
3. If valid:
   - Set submitting: true
   - POST /api/users/{userId}/tasks
   - On success:
     - Add new task to tasks array (optimistic)
     - Show success toast
     - Clear form
     - Set submitting: false
   - On error:
     - Show error message
     - Set submitting: false
```

### Task Completion Toggle Flow

```
1. User clicks checkbox
2. Optimistically update task.completed in UI
3. PATCH /api/users/{userId}/tasks/{taskId}
4. On success:
   - Keep optimistic update
   - Show success toast (optional)
5. On error:
   - Revert task.completed to original value
   - Show error toast
```

### Task Deletion Flow

```
1. User clicks delete button
2. Show confirmation dialog (optional)
3. On confirm:
   - Optimistically remove task from UI
   - DELETE /api/users/{userId}/tasks/{taskId}
   - On success:
     - Keep task removed
     - Show success toast
   - On error:
     - Re-add task to UI
     - Show error toast
```

---

## Error Handling

### API Error Types

```typescript
interface APIError {
  code: string;           // Error code (e.g., "UNAUTHORIZED", "VALIDATION_ERROR")
  message: string;        // User-friendly error message
  details?: string;       // Additional error details
  status: number;         // HTTP status code
}
```

### Error Handling Strategy

**Network Errors**:
- Message: "Unable to connect. Please check your internet connection."
- Action: Show retry button

**401 Unauthorized**:
- Message: "Your session has expired. Please log in again."
- Action: Clear session, redirect to login

**400 Validation Error**:
- Message: Display specific field errors
- Action: Highlight invalid fields, show inline errors

**403 Forbidden**:
- Message: "You don't have permission to perform this action."
- Action: Show error message, no retry

**404 Not Found**:
- Message: "Task not found. It may have been deleted."
- Action: Remove task from UI, show toast

**500 Server Error**:
- Message: "Something went wrong. Please try again later."
- Action: Show retry button

---

## Performance Considerations

### Optimistic Updates

- Update UI immediately on user action
- Improves perceived performance (SC-003: <100ms UI response)
- Revert on API failure with error message

### Loading States

- Show loading spinner during API calls
- Disable form submit button while submitting
- Show skeleton loaders for task list (optional)

### Caching Strategy

- No client-side caching (keep it simple)
- Refetch tasks after create/update/delete operations
- Rely on browser HTTP cache for static assets

---

## Validation Rules Summary

| Field | Required | Min Length | Max Length | Additional Rules |
|-------|----------|------------|------------|------------------|
| Task Title | Yes | 1 | 200 | Cannot be only whitespace |
| Task Description | No | 0 | 1000 | - |
| Email | Yes | 5 | 100 | Valid email format |
| Password | Yes | 8 | 100 | Min 8 chars (signup only) |

---

## Next Steps

1. ✅ Data model defined
2. ⏳ Generate API contracts (contracts/api-endpoints.md, contracts/types.ts)
3. ⏳ Generate quickstart guide
4. ⏳ Update agent context
