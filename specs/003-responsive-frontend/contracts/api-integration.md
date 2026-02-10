# API Integration Contract: Frontend Interface & Responsive UX

**Feature**: 003-responsive-frontend
**Date**: 2026-02-09
**Purpose**: Define backend API endpoint specifications and integration requirements

---

## Overview

This document specifies the contract between the Next.js frontend and the FastAPI backend for task management operations. All endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

**Base URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable (default: `http://localhost:8000`)

---

## Authentication

### JWT Token Format

All authenticated requests must include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

**Token Structure**:
- Issued by Better Auth on successful signin/signup
- Contains user ID and email claims
- Signed with `BETTER_AUTH_SECRET`
- Expires after configured duration (e.g., 24 hours)

**Token Handling**:
- Frontend stores token in localStorage after signin
- Frontend attaches token to all API requests
- Frontend handles 401 responses by redirecting to signin
- Frontend clears token on signout or 401 error

---

## Endpoints

### 1. GET /tasks

Retrieve all tasks belonging to the authenticated user.

**Request**:
```http
GET /tasks HTTP/1.1
Host: localhost:8000
Authorization: Bearer <jwt_token>
```

**Success Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive docs for the API",
    "is_completed": false,
    "created_at": "2026-02-09T10:30:00Z",
    "updated_at": "2026-02-09T10:30:00Z",
    "user_id": "123e4567-e89b-12d3-a456-426614174000"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Review pull requests",
    "description": null,
    "is_completed": true,
    "created_at": "2026-02-08T14:20:00Z",
    "updated_at": "2026-02-09T09:15:00Z",
    "user_id": "123e4567-e89b-12d3-a456-426614174000"
  }
]
```

**Empty List Response** (200 OK):
```json
[]
```

**Error Responses**:

- **401 Unauthorized**: Missing or invalid JWT token
```json
{
  "detail": "Could not validate credentials"
}
```

- **500 Internal Server Error**: Server error
```json
{
  "detail": "Internal server error"
}
```

**Frontend Handling**:
- Display loading spinner during request
- Render task list on success
- Show empty state if array is empty
- Redirect to signin on 401
- Show error message on other errors

---

### 2. POST /tasks

Create a new task for the authenticated user.

**Request**:
```http
POST /tasks HTTP/1.1
Host: localhost:8000
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "New task title",
  "description": "Optional task description"
}
```

**Request Body Schema**:
```typescript
{
  title: string;        // Required, max 200 characters
  description?: string; // Optional, max 1000 characters
}
```

**Success Response** (201 Created):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "New task title",
  "description": "Optional task description",
  "is_completed": false,
  "created_at": "2026-02-09T11:45:00Z",
  "updated_at": "2026-02-09T11:45:00Z",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Error Responses**:

- **400 Bad Request**: Invalid request body
```json
{
  "detail": "Title is required"
}
```

- **401 Unauthorized**: Missing or invalid JWT token
```json
{
  "detail": "Could not validate credentials"
}
```

- **422 Unprocessable Entity**: Validation error
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**Frontend Handling**:
- Validate title is not empty before sending
- Disable submit button during request
- Add task to list optimistically
- Replace with server response on success
- Remove optimistic task and show error on failure
- Show success toast on completion

---

### 3. PATCH /tasks/{id}

Update an existing task. Only provided fields are updated.

**Request**:
```http
PATCH /tasks/770e8400-e29b-41d4-a716-446655440002 HTTP/1.1
Host: localhost:8000
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated task title",
  "is_completed": true
}
```

**Request Body Schema**:
```typescript
{
  title?: string;        // Optional, max 200 characters
  description?: string;  // Optional, max 1000 characters, null to clear
  is_completed?: boolean; // Optional
}
```

**Success Response** (200 OK):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "Updated task title",
  "description": "Optional task description",
  "is_completed": true,
  "created_at": "2026-02-09T11:45:00Z",
  "updated_at": "2026-02-09T12:00:00Z",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Error Responses**:

- **400 Bad Request**: Invalid request body
```json
{
  "detail": "Title cannot be empty"
}
```

- **401 Unauthorized**: Missing or invalid JWT token
```json
{
  "detail": "Could not validate credentials"
}
```

- **403 Forbidden**: User does not own this task
```json
{
  "detail": "Not authorized to update this task"
}
```

- **404 Not Found**: Task does not exist
```json
{
  "detail": "Task not found"
}
```

**Frontend Handling**:
- Update task in list optimistically
- Disable interaction during request
- Confirm update with server response
- Rollback to previous state on error
- Show success toast on completion
- Show error message on failure

---

### 4. DELETE /tasks/{id}

Permanently delete a task.

**Request**:
```http
DELETE /tasks/770e8400-e29b-41d4-a716-446655440002 HTTP/1.1
Host: localhost:8000
Authorization: Bearer <jwt_token>
```

**Success Response** (204 No Content):
```
(No response body)
```

**Error Responses**:

- **401 Unauthorized**: Missing or invalid JWT token
```json
{
  "detail": "Could not validate credentials"
}
```

- **403 Forbidden**: User does not own this task
```json
{
  "detail": "Not authorized to delete this task"
}
```

- **404 Not Found**: Task does not exist
```json
{
  "detail": "Task not found"
}
```

**Frontend Handling**:
- Show confirmation dialog before deletion
- Remove task from list optimistically
- Confirm deletion on 204 response
- Restore task to list on error
- Show success toast on completion
- Show error message on failure

---

## Error Handling Strategy

### HTTP Status Codes

| Status Code | Meaning | Frontend Action |
|------------|---------|-----------------|
| 200 OK | Request successful | Process response data |
| 201 Created | Resource created | Add to local state |
| 204 No Content | Deletion successful | Remove from local state |
| 400 Bad Request | Invalid request | Show validation error |
| 401 Unauthorized | Authentication failed | Redirect to signin |
| 403 Forbidden | Not authorized | Show permission error |
| 404 Not Found | Resource not found | Show not found error |
| 422 Unprocessable Entity | Validation error | Show field errors |
| 500 Internal Server Error | Server error | Show generic error |
| 503 Service Unavailable | Service down | Show retry message |

### Error Response Format

All error responses follow this format:

```typescript
interface ErrorResponse {
  detail: string | ValidationError[];
}

interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}
```

### Frontend Error Messages

Map backend errors to user-friendly messages:

| Backend Error | User-Friendly Message |
|--------------|----------------------|
| "Could not validate credentials" | "Your session has expired. Please sign in again." |
| "Title is required" | "Title is required" |
| "Not authorized to update this task" | "You don't have permission to modify this task" |
| "Task not found" | "This task no longer exists" |
| Network timeout | "Request timeout. Please check your connection." |
| Network error | "Network error. Please check your connection and try again." |
| 500 error | "Something went wrong. Please try again later." |

---

## Request/Response Flow

### Successful Create Task Flow

```
1. User fills form and clicks "Create"
2. Frontend validates input (title not empty)
3. Frontend creates optimistic task with temp ID
4. Frontend adds optimistic task to list
5. Frontend sends POST /tasks request
6. Backend validates request
7. Backend creates task in database
8. Backend returns created task (201)
9. Frontend replaces optimistic task with real task
10. Frontend shows success toast
```

### Failed Create Task Flow (Network Error)

```
1. User fills form and clicks "Create"
2. Frontend validates input (title not empty)
3. Frontend creates optimistic task with temp ID
4. Frontend adds optimistic task to list
5. Frontend sends POST /tasks request
6. Network error occurs (timeout, no connection)
7. Frontend catches error
8. Frontend removes optimistic task from list
9. Frontend shows error toast
10. Form remains open with user's input
```

### Failed Update Task Flow (403 Forbidden)

```
1. User clicks "Edit" and modifies task
2. Frontend validates input
3. Frontend updates task in list optimistically
4. Frontend sends PATCH /tasks/{id} request
5. Backend checks authorization
6. Backend returns 403 Forbidden
7. Frontend catches error
8. Frontend rolls back to previous task state
9. Frontend shows error toast
```

---

## Performance Considerations

### Request Timeouts

- Default timeout: 10 seconds
- Retry transient failures (network errors) up to 3 times
- Exponential backoff: 1s, 2s, 4s

### Caching Strategy

- No caching for task list (always fetch fresh data)
- Optimistic updates provide instant feedback
- Refetch task list after navigation back to page

### Rate Limiting

- Backend may implement rate limiting
- Frontend should handle 429 Too Many Requests
- Show appropriate message: "Too many requests. Please wait a moment."

---

## Security Considerations

### JWT Token Security

- Store token in localStorage (not cookies to avoid CSRF)
- Clear token on signout or 401 error
- Never log or expose token in console
- Use HTTPS in production to prevent token interception

### Input Validation

- Client-side validation for UX (immediate feedback)
- Server-side validation for security (never trust client)
- Sanitize user input to prevent XSS
- Enforce length limits on title and description

### CORS Configuration

Backend must allow frontend origin:

```python
# Backend CORS configuration
allow_origins = [
    "http://localhost:3000",  # Development
    "https://yourdomain.com"  # Production
]
```

---

## Testing Contracts

### Mock API Responses

For testing, use these mock responses:

```typescript
// Mock successful task list
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    is_completed: false,
    created_at: '2026-02-09T10:00:00Z',
    updated_at: '2026-02-09T10:00:00Z',
    user_id: 'user-1'
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: null,
    is_completed: true,
    created_at: '2026-02-08T10:00:00Z',
    updated_at: '2026-02-09T09:00:00Z',
    user_id: 'user-1'
  }
];

// Mock error responses
export const mockErrors = {
  unauthorized: { detail: 'Could not validate credentials' },
  notFound: { detail: 'Task not found' },
  forbidden: { detail: 'Not authorized to update this task' },
  validation: { detail: 'Title is required' }
};
```

---

## API Client Implementation Reference

```typescript
// lib/api.ts
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth_token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/signin?expired=true';
      throw new Error('Your session has expired. Please sign in again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: 'An error occurred'
      }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // GET /tasks
  getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks', { method: 'GET' });
  }

  // POST /tasks
  createTask(data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PATCH /tasks/{id}
  updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE /tasks/{id}
  deleteTask(id: string): Promise<void> {
    return this.request<void>(`/tasks/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
);
```

---

## Summary

This contract defines:
- **4 API endpoints**: GET, POST, PATCH, DELETE for task management
- **Authentication**: JWT token via Authorization header
- **Error handling**: Comprehensive error responses and frontend handling
- **Optimistic updates**: Immediate UI feedback with rollback on error
- **Security**: Token management, input validation, CORS configuration
- **Testing**: Mock responses for unit and integration tests

All implementations must adhere to this contract to ensure proper integration between frontend and backend.
