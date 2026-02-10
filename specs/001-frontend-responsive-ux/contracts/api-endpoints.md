# API Endpoints Specification

**Feature**: Frontend Interface & Responsive UX
**Backend**: FastAPI
**Base URL**: `http://localhost:8000` (development)
**Date**: 2026-02-10

## Authentication

All endpoints except `/auth/login` and `/auth/signup` require JWT authentication via the `Authorization` header.

**Header Format**:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication Endpoints

#### POST /auth/signup

Create a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "uuid-or-integer",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-02-11T12:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid email format or password too short
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input",
      "details": "Password must be at least 8 characters"
    }
  }
  ```
- `409 Conflict`: Email already exists
  ```json
  {
    "error": {
      "code": "EMAIL_EXISTS",
      "message": "Email already registered",
      "details": "An account with this email already exists"
    }
  }
  ```

---

#### POST /auth/login

Authenticate an existing user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "uuid-or-integer",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-02-11T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
  ```json
  {
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "Invalid email or password",
      "details": "The email or password you entered is incorrect"
    }
  }
  ```

---

### Task Endpoints

#### GET /api/users/{userId}/tasks

List all tasks for the authenticated user.

**Path Parameters**:
- `userId` (string): User ID (must match authenticated user)

**Query Parameters** (optional):
- `completed` (boolean): Filter by completion status
- `limit` (integer): Maximum number of tasks to return (default: 100)
- `offset` (integer): Number of tasks to skip (default: 0)

**Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": "task-uuid-1",
      "title": "Complete project documentation",
      "description": "Write comprehensive docs for the API",
      "completed": false,
      "userId": "user-uuid",
      "createdAt": "2026-02-10T10:00:00Z",
      "updatedAt": "2026-02-10T10:00:00Z"
    },
    {
      "id": "task-uuid-2",
      "title": "Review pull requests",
      "description": "",
      "completed": true,
      "userId": "user-uuid",
      "createdAt": "2026-02-09T14:30:00Z",
      "updatedAt": "2026-02-10T09:15:00Z"
    }
  ],
  "total": 2
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User ID in path doesn't match authenticated user

---

#### POST /api/users/{userId}/tasks

Create a new task for the authenticated user.

**Path Parameters**:
- `userId` (string): User ID (must match authenticated user)

**Request**:
```json
{
  "title": "New task title",
  "description": "Optional task description"
}
```

**Response** (201 Created):
```json
{
  "task": {
    "id": "task-uuid-3",
    "title": "New task title",
    "description": "Optional task description",
    "completed": false,
    "userId": "user-uuid",
    "createdAt": "2026-02-10T12:00:00Z",
    "updatedAt": "2026-02-10T12:00:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation error
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input",
      "details": "Title is required and cannot be empty"
    }
  }
  ```
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User ID in path doesn't match authenticated user

---

#### GET /api/users/{userId}/tasks/{taskId}

Get a single task by ID.

**Path Parameters**:
- `userId` (string): User ID (must match authenticated user)
- `taskId` (string): Task ID

**Response** (200 OK):
```json
{
  "task": {
    "id": "task-uuid-1",
    "title": "Complete project documentation",
    "description": "Write comprehensive docs for the API",
    "completed": false,
    "userId": "user-uuid",
    "createdAt": "2026-02-10T10:00:00Z",
    "updatedAt": "2026-02-10T10:00:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Task belongs to different user
- `404 Not Found`: Task doesn't exist

---

#### PUT /api/users/{userId}/tasks/{taskId}

Update a task (full update - all fields required).

**Path Parameters**:
- `userId` (string): User ID (must match authenticated user)
- `taskId` (string): Task ID

**Request**:
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": false
}
```

**Response** (200 OK):
```json
{
  "task": {
    "id": "task-uuid-1",
    "title": "Updated task title",
    "description": "Updated description",
    "completed": false,
    "userId": "user-uuid",
    "createdAt": "2026-02-10T10:00:00Z",
    "updatedAt": "2026-02-10T12:30:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Task belongs to different user
- `404 Not Found`: Task doesn't exist

---

#### PATCH /api/users/{userId}/tasks/{taskId}

Partially update a task (only provided fields are updated).

**Path Parameters**:
- `userId` (string): User ID (must match authenticated user)
- `taskId` (string): Task ID

**Request** (any combination of fields):
```json
{
  "completed": true
}
```

**Response** (200 OK):
```json
{
  "task": {
    "id": "task-uuid-1",
    "title": "Complete project documentation",
    "description": "Write comprehensive docs for the API",
    "completed": true,
    "userId": "user-uuid",
    "createdAt": "2026-02-10T10:00:00Z",
    "updatedAt": "2026-02-10T13:00:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Task belongs to different user
- `404 Not Found`: Task doesn't exist

---

#### DELETE /api/users/{userId}/tasks/{taskId}

Delete a task.

**Path Parameters**:
- `userId` (string): User ID (must match authenticated user)
- `taskId` (string): Task ID

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Task belongs to different user
- `404 Not Found`: Task doesn't exist

---

## Error Response Format

All error responses follow this consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": "Additional details about the error"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required or token invalid |
| `FORBIDDEN` | 403 | User not authorized to access resource |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `INVALID_CREDENTIALS` | 401 | Login credentials incorrect |
| `INTERNAL_ERROR` | 500 | Server-side error |

---

## CORS Configuration

The backend must be configured to allow requests from the frontend origin:

**Development**:
- Allowed Origin: `http://localhost:3000`
- Allowed Methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- Allowed Headers: `Content-Type, Authorization`
- Allow Credentials: `true`

**Production**:
- Allowed Origin: Frontend production URL (configured via environment variable)
- Same methods and headers as development

---

## Rate Limiting

**Note**: Rate limiting details to be determined by backend implementation.

Suggested limits:
- Authentication endpoints: 5 requests per minute per IP
- Task endpoints: 100 requests per minute per user

---

## Notes for Frontend Implementation

1. **Base URL Configuration**: Use environment variable `NEXT_PUBLIC_API_BASE_URL`
2. **Token Storage**: Store JWT token securely (httpOnly cookie or sessionStorage)
3. **Token Expiration**: Check `expiresAt` and refresh/re-authenticate before expiration
4. **Error Handling**: Parse error response and display user-friendly messages
5. **User ID Validation**: Always use authenticated user's ID in API paths
6. **Optimistic Updates**: Update UI immediately, revert on API failure
