# Data Model

**Feature**: Todo Full-Stack Web Application
**Date**: 2026-02-09
**Database**: Neon Serverless PostgreSQL

This document defines the database schema, entities, relationships, and validation rules.

---

## Entity Relationship Diagram

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password_hash   │
│ created_at      │
└─────────────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│      Task       │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ title           │
│ description     │
│ is_completed    │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

---

## Entity: User

**Purpose**: Represents a registered user account with authentication credentials.

**Table Name**: `users`

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT uuid_generate_v4() | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email address (used for login) |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt-hashed password |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

### Indexes

- Primary key index on `id`
- Unique index on `email` (for fast lookup during signin)

### Validation Rules

- **Email**: Must be valid email format (validated at application layer)
- **Password**: Minimum 8 characters (validated before hashing)
- **Email uniqueness**: Enforced at database level with UNIQUE constraint

### SQLModel Definition

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## Entity: Task

**Purpose**: Represents a todo item belonging to a specific user.

**Table Name**: `tasks`

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT uuid_generate_v4() | Unique task identifier |
| `user_id` | UUID | FOREIGN KEY (users.id), NOT NULL, ON DELETE CASCADE | Owner of the task |
| `title` | VARCHAR(500) | NOT NULL | Task title/summary |
| `description` | TEXT | NULL | Optional detailed description |
| `is_completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Task creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Indexes

- Primary key index on `id`
- Index on `user_id` (for fast filtering by user)
- Composite index on `(user_id, created_at)` (for sorted user task lists)

### Foreign Keys

- `user_id` references `users(id)` with `ON DELETE CASCADE`
  - When a user is deleted, all their tasks are automatically deleted

### Validation Rules

- **Title**: Required, max 500 characters
- **Description**: Optional, unlimited length (TEXT type)
- **User ownership**: All queries must filter by `user_id` from JWT token

### SQLModel Definition

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=500)
    description: Optional[str] = Field(default=None)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## Database Schema SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at DESC);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Pydantic Schemas (Request/Response)

### Authentication Schemas

```python
from pydantic import BaseModel, EmailStr

class UserSignupRequest(BaseModel):
    email: EmailStr
    password: str  # Min 8 chars validated in endpoint

class UserSigninRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
```

### Task Schemas

```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class TaskCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None

class TaskUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

---

## Data Access Patterns

### User Isolation Enforcement

**Critical Security Rule**: All task queries MUST filter by `user_id` extracted from JWT token.

```python
# ✅ CORRECT - Filters by authenticated user
async def get_user_tasks(user_id: UUID, session: AsyncSession):
    result = await session.execute(
        select(Task).where(Task.user_id == user_id)
    )
    return result.scalars().all()

# ❌ INCORRECT - Returns all tasks (security violation)
async def get_all_tasks(session: AsyncSession):
    result = await session.execute(select(Task))
    return result.scalars().all()
```

### Query Examples

**Get user's tasks (sorted by creation date)**:
```python
select(Task)
    .where(Task.user_id == user_id)
    .order_by(Task.created_at.desc())
```

**Get single task with ownership check**:
```python
task = await session.get(Task, task_id)
if task.user_id != user_id:
    raise HTTPException(status_code=403, detail="Not authorized")
```

**Update task with ownership enforcement**:
```python
task = await session.get(Task, task_id)
if not task or task.user_id != user_id:
    raise HTTPException(status_code=404, detail="Task not found")
task.title = new_title
task.updated_at = datetime.utcnow()
await session.commit()
```

---

## Migration Strategy

### Initial Setup

1. Create database in Neon console
2. Run schema SQL to create tables and indexes
3. Verify tables created: `\dt` in psql

### Future Migrations

Use Alembic for schema changes:
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

---

## Data Integrity Rules

1. **Referential Integrity**: User deletion cascades to tasks (ON DELETE CASCADE)
2. **Email Uniqueness**: Enforced at database level, prevents duplicate accounts
3. **User Ownership**: Application layer enforces user can only access their own tasks
4. **Timestamp Consistency**: `updated_at` automatically updated via trigger
5. **Required Fields**: Title is required; description is optional

---

## Performance Considerations

1. **Indexes**:
   - `user_id` index enables fast task filtering
   - Composite `(user_id, created_at)` index optimizes sorted lists
   - Email index speeds up signin lookups

2. **Connection Pooling**: Use SQLAlchemy async engine with pool_size=5, max_overflow=10

3. **Query Optimization**:
   - Always filter by `user_id` first (indexed)
   - Use `select()` instead of `query()` for async
   - Limit result sets for large task lists (pagination if needed)

4. **Neon-Specific**:
   - Connection pooling essential for serverless scaling
   - Use `pool_pre_ping=True` to verify connections
   - Consider read replicas for high read loads (future enhancement)

---

## Security Considerations

1. **Password Storage**: Never store plain passwords; always use bcrypt hash
2. **User Isolation**: Every task query MUST include `user_id` filter from JWT
3. **SQL Injection**: SQLModel/SQLAlchemy parameterizes queries automatically
4. **Cascade Deletion**: User deletion removes all tasks (data cleanup)
5. **Token Claims**: JWT `sub` claim contains `user_id` for authorization

---

## Testing Data

### Test Users

```python
test_users = [
    {"email": "alice@example.com", "password": "password123"},
    {"email": "bob@example.com", "password": "password456"},
]
```

### Test Tasks

```python
test_tasks = [
    {"user_id": alice_id, "title": "Buy groceries", "is_completed": False},
    {"user_id": alice_id, "title": "Finish report", "is_completed": True},
    {"user_id": bob_id, "title": "Call dentist", "is_completed": False},
]
```

---

## Validation Summary

| Validation | Layer | Enforcement |
|------------|-------|-------------|
| Email format | Application | Pydantic EmailStr |
| Email uniqueness | Database | UNIQUE constraint |
| Password length | Application | FastAPI endpoint |
| Title required | Database | NOT NULL constraint |
| Title max length | Application | Pydantic validation |
| User ownership | Application | JWT + query filter |
| Foreign key integrity | Database | FOREIGN KEY constraint |
