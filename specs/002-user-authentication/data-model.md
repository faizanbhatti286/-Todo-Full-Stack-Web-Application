# Data Model: User Authentication & JWT Integration

**Feature**: User Authentication & JWT Integration
**Branch**: 002-user-authentication
**Date**: 2026-02-09
**Purpose**: Define data entities, relationships, and validation rules for authentication system

## Entity Relationship Diagram

```
┌─────────────────────────────────┐
│          User                   │
│─────────────────────────────────│
│ id: UUID (PK)                   │
│ email: String (UNIQUE, INDEXED) │
│ password_hash: String           │
│ created_at: DateTime            │
└─────────────────────────────────┘
              │
              │ 1:N (one user has many tasks)
              │
              ▼
┌─────────────────────────────────┐
│          Task                   │
│─────────────────────────────────│
│ id: UUID (PK)                   │
│ user_id: UUID (FK, INDEXED)     │
│ title: String                   │
│ description: String (NULLABLE)  │
│ is_completed: Boolean           │
│ created_at: DateTime            │
│ updated_at: DateTime            │
└─────────────────────────────────┘
```

## Entities

### User Entity

**Purpose**: Represents a registered user account with authentication credentials.

**Table Name**: `users`

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL, DEFAULT uuid4() | Unique user identifier |
| email | String(255) | UNIQUE, NOT NULL, INDEXED | User's email address (login identifier) |
| password_hash | String(255) | NOT NULL | Bcrypt-hashed password (never store plain text) |
| created_at | DateTime | NOT NULL, DEFAULT utcnow() | Account creation timestamp (UTC) |

**Indexes**:
- Primary key index on `id`
- Unique index on `email` (for fast lookup and uniqueness enforcement)

**Validation Rules**:
- Email must be valid format (validated by Pydantic EmailStr)
- Email must be unique across all users (database constraint)
- Email maximum length: 255 characters
- Password (plain text, before hashing):
  - Minimum length: 8 characters (enforced in API endpoint)
  - Maximum length: 128 characters (prevent DoS attacks)
  - No complexity requirements (NIST recommendation)
- Password hash length: 60 characters (bcrypt standard)

**Business Rules**:
- Email is case-insensitive for uniqueness (handled by database)
- Passwords are hashed using bcrypt with 12 rounds
- User accounts cannot be deleted (out of scope for current spec)
- One user can own multiple tasks (one-to-many relationship)

**Security Considerations**:
- Password never stored in plain text
- Password hash uses bcrypt with automatic salt generation
- Email used as unique identifier (no separate username)
- created_at timestamp for audit trail

**SQLModel Implementation** (backend/src/models/user.py):
```python
class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Task Entity

**Purpose**: Represents a todo item owned by a specific user.

**Table Name**: `tasks`

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL, DEFAULT uuid4() | Unique task identifier |
| user_id | UUID | FOREIGN KEY (users.id), NOT NULL, INDEXED | Owner's user ID |
| title | String(500) | NOT NULL | Task title/summary |
| description | Text | NULLABLE | Optional detailed description |
| is_completed | Boolean | NOT NULL, DEFAULT false | Completion status |
| created_at | DateTime | NOT NULL, DEFAULT utcnow() | Task creation timestamp (UTC) |
| updated_at | DateTime | NOT NULL, DEFAULT utcnow() | Last update timestamp (UTC) |

**Indexes**:
- Primary key index on `id`
- Foreign key index on `user_id` (for fast user-specific queries)

**Relationships**:
- **Belongs to User**: Each task belongs to exactly one user (many-to-one)
- Foreign key constraint: `user_id` references `users.id`
- Cascade behavior: Not specified (user deletion out of scope)

**Validation Rules**:
- Title is required (cannot be null or empty)
- Title maximum length: 500 characters
- Description is optional (can be null)
- Description maximum length: Unlimited (Text type)
- is_completed defaults to false for new tasks
- user_id must reference an existing user (foreign key constraint)

**Business Rules**:
- Tasks are always associated with a user (no orphaned tasks)
- Users can only access their own tasks (enforced by API layer)
- Task ownership cannot be transferred (no user_id updates)
- updated_at automatically updated on any modification
- Completed tasks remain in database (no auto-deletion)

**Security Considerations**:
- user_id enforces data isolation between users
- All task queries filtered by authenticated user_id
- Cross-user access prevented at service layer
- Task IDs are UUIDs (not sequential, harder to guess)

**SQLModel Implementation** (backend/src/models/task.py):
```python
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

### JWT Token (Logical Entity)

**Purpose**: Represents an authentication credential issued to authenticated users.

**Storage**: Not stored in database (stateless authentication)

**Structure**: JSON Web Token (JWT) with three parts:
1. Header: Algorithm and token type
2. Payload: Claims (user data)
3. Signature: HMAC-SHA256 signature

**Payload Claims**:

| Claim | Type | Description |
|-------|------|-------------|
| sub | String | Subject (user_id as UUID string) |
| email | String | User's email address |
| exp | Integer | Expiry timestamp (Unix epoch, 7 days from issuance) |
| iat | Integer | Issued at timestamp (Unix epoch, optional) |

**Token Properties**:
- Algorithm: HS256 (HMAC with SHA-256)
- Signing key: BETTER_AUTH_SECRET (from environment)
- Expiry: 7 days (168 hours) from issuance
- Format: `eyJ...header...eyJ...payload...signature`

**Validation Rules**:
- Signature must be valid (verified with BETTER_AUTH_SECRET)
- Token must not be expired (exp > current time)
- Subject (sub) must be a valid UUID
- User referenced by sub must exist in database

**Business Rules**:
- Tokens are stateless (cannot be revoked server-side)
- One user can have multiple valid tokens (multi-device support)
- Expired tokens are rejected automatically
- Token payload is signed but not encrypted (readable by anyone)

**Security Considerations**:
- No sensitive data in payload (only user_id and email)
- Signature prevents tampering
- Expiry limits token lifetime
- BETTER_AUTH_SECRET must be kept secure
- Tokens transmitted via HTTPS only (production)

**JWT Structure Example**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "exp": 1739145600
  },
  "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), BETTER_AUTH_SECRET)"
}
```

## Database Schema

### PostgreSQL DDL (Generated by SQLModel)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE INDEX idx_users_email ON users(email);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

## Data Access Patterns

### User Operations

**Create User (Signup)**:
```sql
INSERT INTO users (id, email, password_hash, created_at)
VALUES (gen_random_uuid(), $1, $2, NOW() AT TIME ZONE 'UTC')
RETURNING *;
```

**Find User by Email (Signin)**:
```sql
SELECT id, email, password_hash, created_at
FROM users
WHERE email = $1;
```

**Find User by ID (Token Validation)**:
```sql
SELECT id, email, created_at
FROM users
WHERE id = $1;
```

### Task Operations (All Filtered by user_id)

**Get All User Tasks**:
```sql
SELECT id, user_id, title, description, is_completed, created_at, updated_at
FROM tasks
WHERE user_id = $1
ORDER BY created_at DESC;
```

**Create Task**:
```sql
INSERT INTO tasks (id, user_id, title, description, is_completed, created_at, updated_at)
VALUES (gen_random_uuid(), $1, $2, $3, FALSE, NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC')
RETURNING *;
```

**Get Task by ID (with ownership check)**:
```sql
SELECT id, user_id, title, description, is_completed, created_at, updated_at
FROM tasks
WHERE id = $1 AND user_id = $2;
```

**Update Task**:
```sql
UPDATE tasks
SET title = $1, description = $2, is_completed = $3, updated_at = NOW() AT TIME ZONE 'UTC'
WHERE id = $4 AND user_id = $5
RETURNING *;
```

**Delete Task**:
```sql
DELETE FROM tasks
WHERE id = $1 AND user_id = $2;
```

## Data Validation Summary

### User Entity Validation

| Rule | Validation Layer | Error Response |
|------|------------------|----------------|
| Email format | Pydantic (EmailStr) | 422 Unprocessable Entity |
| Email uniqueness | Database constraint | 409 Conflict |
| Email max length (255) | SQLModel Field | 422 Unprocessable Entity |
| Password min length (8) | API endpoint | 400 Bad Request |
| Password max length (128) | API endpoint | 400 Bad Request |

### Task Entity Validation

| Rule | Validation Layer | Error Response |
|------|------------------|----------------|
| Title required | Pydantic | 422 Unprocessable Entity |
| Title max length (500) | SQLModel Field | 422 Unprocessable Entity |
| user_id exists | Foreign key constraint | 500 Internal Server Error |
| user_id ownership | Service layer | 403 Forbidden |

### JWT Token Validation

| Rule | Validation Layer | Error Response |
|------|------------------|----------------|
| Signature valid | python-jose | 401 Unauthorized |
| Token not expired | python-jose | 401 Unauthorized |
| User exists | Service layer | 401 Unauthorized |
| Token format valid | python-jose | 401 Unauthorized |

## Migration Strategy

**Current State**: Database schema already exists (implemented in Phase 1)

**Migration Approach**: No migrations needed for this feature

**Future Migrations** (if needed):
- Use Alembic for schema versioning
- Generate migrations: `alembic revision --autogenerate -m "description"`
- Apply migrations: `alembic upgrade head`
- Rollback: `alembic downgrade -1`

## Data Integrity Constraints

### Referential Integrity
- Tasks reference users via foreign key (user_id → users.id)
- Orphaned tasks prevented by foreign key constraint
- User deletion not implemented (out of scope)

### Data Consistency
- Email uniqueness enforced by database constraint
- UUID primary keys prevent ID collisions
- Timestamps use UTC to avoid timezone issues
- Boolean fields have explicit defaults

### Concurrency Handling
- Database handles concurrent inserts with unique constraints
- Optimistic locking not implemented (acceptable for demo)
- Last-write-wins for task updates

## Performance Considerations

### Indexes
- Primary key indexes on all tables (automatic)
- Index on users.email for fast login lookups
- Index on tasks.user_id for fast user-specific queries

### Query Optimization
- All task queries filtered by user_id (uses index)
- No N+1 query problems (single query per operation)
- Pagination not implemented (acceptable for demo scale)

### Scalability
- UUIDs allow distributed ID generation
- Stateless JWT authentication (no session storage)
- Database connection pooling via SQLModel/asyncpg

## Security & Privacy

### Data Protection
- Passwords hashed with bcrypt (never stored plain text)
- JWT tokens signed but not encrypted (no sensitive data in payload)
- User data isolated by user_id filtering

### Audit Trail
- created_at timestamp on users and tasks
- updated_at timestamp on tasks
- No audit log table (out of scope)

### Data Retention
- No automatic deletion of users or tasks
- Data retention policy not implemented (out of scope)

## Testing Considerations

### Unit Tests
- Test model validation rules
- Test password hashing and verification
- Test JWT token creation and validation

### Integration Tests
- Test user registration with duplicate emails
- Test task creation and ownership
- Test cross-user access prevention

### Data Fixtures
- Create test users with known credentials
- Create test tasks for each user
- Test with edge cases (empty descriptions, max lengths)
