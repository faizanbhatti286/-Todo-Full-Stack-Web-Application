# Research & Technology Decisions

**Feature**: Todo Full-Stack Web Application
**Date**: 2026-02-09
**Status**: Completed

This document captures architectural decisions, technology choices, and implementation patterns for the Todo web application.

---

## 1. Better Auth JWT Configuration for Next.js 16+ App Router

**Decision**: Use Better Auth with JWT plugin configured for Next.js App Router with API routes for authentication endpoints.

**Rationale**:
- Better Auth provides built-in JWT support with secure token generation
- App Router requires server-side authentication handling via Route Handlers
- Better Auth integrates seamlessly with Next.js middleware for protected routes
- Supports both client and server components authentication checks

**Implementation Pattern**:
```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  jwt: {
    enabled: true,
    expiresIn: "24h",
    algorithm: "HS256"
  }
})
```

**Alternatives Considered**:
- NextAuth.js: More complex setup, heavier dependency
- Custom JWT implementation: Reinventing the wheel, security risks
- Auth0/Clerk: Third-party services excluded by spec requirements

---

## 2. FastAPI JWT Validation Middleware Patterns

**Decision**: Implement dependency injection pattern with `Depends()` for JWT validation on protected routes.

**Rationale**:
- FastAPI's dependency injection provides clean, reusable authentication
- Centralized token validation logic reduces code duplication
- Easy to test and mock for unit tests
- Automatic 401 responses for invalid/missing tokens

**Implementation Pattern**:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from jose import JWTError, jwt

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Usage in routes
@app.get("/tasks")
async def get_tasks(user_id: str = Depends(get_current_user)):
    # user_id automatically extracted from JWT
    pass
```

**Alternatives Considered**:
- Middleware approach: Less granular control, harder to exclude specific routes
- Manual token validation in each route: Code duplication, error-prone
- OAuth2PasswordBearer: Overkill for simple JWT validation

---

## 3. SQLModel with Neon Serverless PostgreSQL Connection Pooling

**Decision**: Use SQLModel with asyncpg driver and connection pooling via SQLAlchemy's async engine.

**Rationale**:
- Neon Serverless PostgreSQL works best with connection pooling to handle serverless scaling
- asyncpg provides better performance than psycopg2 for async operations
- SQLModel's async support integrates cleanly with FastAPI's async endpoints
- Connection pooling reduces latency and handles concurrent requests efficiently

**Implementation Pattern**:
```python
from sqlmodel import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

DATABASE_URL = "postgresql+asyncpg://user:pass@neon-host/db"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True  # Verify connections before use
)

async def get_session():
    async with AsyncSession(engine) as session:
        yield session
```

**Alternatives Considered**:
- Synchronous psycopg2: Blocks event loop, poor performance with FastAPI
- Direct asyncpg without SQLModel: Loses ORM benefits, more boilerplate
- No connection pooling: Poor performance, connection exhaustion under load

---

## 4. Next.js App Router Authentication Patterns (Protected Routes)

**Decision**: Use middleware for route protection with token validation and redirect logic.

**Rationale**:
- Middleware runs before page rendering, preventing unauthorized access
- Centralized authentication logic for all protected routes
- Supports both client and server component protection
- Clean separation of auth concerns from page components

**Implementation Pattern**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token && request.nextUrl.pathname.startsWith('/tasks')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/tasks/:path*']
}
```

**Alternatives Considered**:
- Client-side only protection: Security risk, flash of unauthorized content
- Per-page authentication checks: Code duplication, inconsistent behavior
- Server components with redirect: Works but less efficient than middleware

---

## 5. FastAPI CORS Configuration for Next.js Frontend

**Decision**: Configure CORS middleware with specific origin allowlist for development and production.

**Rationale**:
- Required for browser to allow cross-origin API requests
- Specific origin allowlist more secure than wildcard
- Credentials support needed for cookie-based auth (if used)
- Different configs for dev (localhost) and prod (deployed domain)

**Implementation Pattern**:
```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",  # Next.js dev server
    "https://yourdomain.com",  # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Alternatives Considered**:
- Wildcard origins: Security risk, allows any domain
- No CORS: Browser blocks all requests, app doesn't work
- Proxy through Next.js: Adds complexity, defeats purpose of separate backend

---

## 6. Password Hashing Best Practices (bcrypt vs argon2)

**Decision**: Use bcrypt with passlib for password hashing.

**Rationale**:
- bcrypt is industry standard, well-tested, and widely supported
- passlib provides clean API with automatic salt generation
- Sufficient security for this application's threat model
- Better ecosystem support and documentation than argon2

**Implementation Pattern**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

**Alternatives Considered**:
- argon2: More modern but less ecosystem support, overkill for this use case
- Plain SHA-256: Insecure without salt, vulnerable to rainbow tables
- scrypt: Good but less common, fewer libraries and examples

---

## 7. JWT Token Expiration and Refresh Strategies

**Decision**: Use 24-hour token expiration without refresh tokens for MVP.

**Rationale**:
- Simpler implementation for hackathon timeline
- 24 hours balances security and user convenience
- Users can re-authenticate daily without significant friction
- Refresh tokens add complexity (storage, rotation, revocation)

**Implementation Pattern**:
```python
from datetime import datetime, timedelta
from jose import jwt

def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    payload = {
        "sub": user_id,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
```

**Future Enhancement**: Add refresh tokens if longer sessions needed in production.

**Alternatives Considered**:
- Refresh tokens: More complex, requires additional storage and endpoints
- Shorter expiration (1 hour): Poor UX, frequent re-authentication
- No expiration: Security risk, tokens valid indefinitely

---

## 8. Error Handling Patterns for RESTful APIs

**Decision**: Use FastAPI's HTTPException with standard HTTP status codes and structured error responses.

**Rationale**:
- Consistent error format across all endpoints
- Standard HTTP status codes (400, 401, 403, 404, 500)
- FastAPI automatically formats exceptions as JSON
- Easy to parse and handle on frontend

**Implementation Pattern**:
```python
from fastapi import HTTPException, status

# Usage in endpoints
if not task:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Task not found"
    )

if task.user_id != current_user_id:
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Not authorized to access this task"
    )
```

**Error Response Format**:
```json
{
  "detail": "Error message here"
}
```

**Alternatives Considered**:
- Custom error classes: More complex, unnecessary for this scope
- String error messages: Inconsistent format, harder to parse
- Exception handlers: Overkill for simple error cases

---

## 9. Responsive Design Patterns for Task Management UI

**Decision**: Use Tailwind CSS with mobile-first responsive utilities.

**Rationale**:
- Tailwind provides utility classes for responsive breakpoints
- Mobile-first approach ensures good mobile experience
- No custom CSS needed for basic responsive layouts
- Works seamlessly with Next.js and React components

**Implementation Pattern**:
```tsx
// Mobile-first responsive task list
<div className="w-full px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  </div>
</div>
```

**Breakpoints**:
- Mobile: < 640px (default)
- Tablet: 640px - 1024px (sm, md)
- Desktop: > 1024px (lg, xl)

**Alternatives Considered**:
- Custom CSS media queries: More code, harder to maintain
- CSS frameworks (Bootstrap): Heavier, less flexible
- CSS-in-JS (styled-components): Adds complexity, runtime overhead

---

## 10. Testing Strategies for Authenticated Endpoints

**Decision**: Use pytest with test fixtures for authenticated requests and test database.

**Rationale**:
- Fixtures provide reusable test users and auth tokens
- Test database ensures isolation between tests
- FastAPI's TestClient supports dependency overrides
- Easy to test both authenticated and unauthenticated scenarios

**Implementation Pattern**:
```python
import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def test_user(test_db):
    user = User(email="test@example.com", password_hash=hash_password("password"))
    test_db.add(user)
    test_db.commit()
    return user

@pytest.fixture
def auth_token(test_user):
    return create_access_token(test_user.id)

@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}

def test_get_tasks_authenticated(client, auth_headers):
    response = client.get("/tasks", headers=auth_headers)
    assert response.status_code == 200

def test_get_tasks_unauthenticated(client):
    response = client.get("/tasks")
    assert response.status_code == 401
```

**Alternatives Considered**:
- Manual token creation in each test: Code duplication
- Shared test user across tests: Test pollution, race conditions
- Mocking authentication: Doesn't test real auth flow

---

## Summary of Key Decisions

| Area | Decision | Primary Rationale |
|------|----------|-------------------|
| Frontend Auth | Better Auth with JWT | Native Next.js integration, secure JWT handling |
| Backend Auth | FastAPI Depends() pattern | Clean dependency injection, reusable |
| Database | SQLModel + asyncpg + pooling | Performance, async support, Neon compatibility |
| Route Protection | Next.js middleware | Centralized, runs before rendering |
| CORS | Specific origin allowlist | Security while enabling cross-origin requests |
| Password Hashing | bcrypt via passlib | Industry standard, well-tested |
| Token Expiration | 24-hour, no refresh | Simple, adequate security for MVP |
| Error Handling | HTTPException + status codes | Consistent, standard HTTP semantics |
| Responsive Design | Tailwind CSS mobile-first | Utility-first, no custom CSS needed |
| Testing | pytest fixtures + TestClient | Reusable, isolated, comprehensive |

---

## Implementation Priorities

1. **Phase 1 (Foundation)**: Database models, authentication service, JWT middleware
2. **Phase 2 (Core Features)**: Task CRUD endpoints, user isolation enforcement
3. **Phase 3 (Frontend)**: Auth pages, task list UI, API integration
4. **Phase 4 (Polish)**: Error handling, responsive design, testing

All decisions align with the constitution principles: security, reproducibility, tech stack compliance, and spec-driven development.
