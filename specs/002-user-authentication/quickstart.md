# Quickstart Guide: User Authentication & JWT Integration

**Feature**: User Authentication & JWT Integration
**Branch**: 002-user-authentication
**Date**: 2026-02-09
**Purpose**: Step-by-step guide to set up, run, and test the authentication system

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+**: Backend runtime
- **Node.js 18+**: Frontend runtime
- **npm or yarn**: Package manager for frontend
- **PostgreSQL**: Database (or Neon Serverless PostgreSQL account)
- **Git**: Version control

## Quick Start (5 Minutes)

### 1. Clone Repository

```bash
git clone <repository-url>
cd hackathon-2-phase2
git checkout 002-user-authentication
```

### 2. Generate Shared Secret

Generate a secure secret for JWT signing (must be identical in frontend and backend):

```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use any secure random string generator
# Example output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Important**: Copy this secret - you'll need it for both backend and frontend configuration.

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env

# Edit .env and set these variables:
# DATABASE_URL=postgresql+asyncpg://user:password@host:port/database
# BETTER_AUTH_SECRET=<your-generated-secret-from-step-2>
# FRONTEND_URL=http://localhost:3000
```

**Neon PostgreSQL Setup** (if using Neon):
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string (starts with `postgresql://`)
4. Replace `postgresql://` with `postgresql+asyncpg://` in DATABASE_URL

```bash
# Initialize database (creates tables)
python -m src.database

# Start backend server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Backend should now be running at http://localhost:8000

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp ../.env.example .env.local

# Edit .env.local and set these variables:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# BETTER_AUTH_SECRET=<same-secret-from-step-2>
```

**Critical**: BETTER_AUTH_SECRET must be **identical** in both backend and frontend.

```bash
# Start frontend development server
npm run dev
```

Frontend should now be running at http://localhost:3000

### 5. Test Authentication

1. **Open browser**: Navigate to http://localhost:3000
2. **Sign up**: Click "Sign Up" and create an account
   - Email: test@example.com
   - Password: password123 (minimum 8 characters)
3. **Verify token**: Open browser DevTools → Application → Local Storage → Check for `auth_token`
4. **Access tasks**: Navigate to http://localhost:3000/tasks
5. **Sign out**: Click "Sign Out" button
6. **Sign in**: Sign back in with the same credentials

## Detailed Setup

### Backend Configuration

#### Environment Variables (.env)

```bash
# Database Configuration
DATABASE_URL=postgresql+asyncpg://username:password@host:port/database_name

# Authentication Secret (MUST match frontend)
BETTER_AUTH_SECRET=your-secure-secret-key-here

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=false
```

#### Database Initialization

The application automatically creates tables on startup. To manually initialize:

```python
# backend/src/database.py
from src.database import init_db
import asyncio

asyncio.run(init_db())
```

#### Running Tests

```bash
cd backend

# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v
```

### Frontend Configuration

#### Environment Variables (.env.local)

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication Secret (MUST match backend)
BETTER_AUTH_SECRET=your-secure-secret-key-here
```

#### Running Tests

```bash
cd frontend

# Install test dependencies (if not already installed)
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Testing Authentication Flow

### 1. User Registration (Signup)

**Manual Test**:
1. Navigate to http://localhost:3000/signup
2. Enter email: `user1@example.com`
3. Enter password: `password123`
4. Click "Sign Up"
5. Verify redirect to tasks page
6. Check localStorage for `auth_token`

**API Test** (using curl):
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "password123"
  }'

# Expected response (201 Created):
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "token_type": "bearer",
#   "user_id": "550e8400-e29b-41d4-a716-446655440000",
#   "email": "user1@example.com"
# }
```

### 2. User Sign In

**Manual Test**:
1. Navigate to http://localhost:3000/signin
2. Enter email: `user1@example.com`
3. Enter password: `password123`
4. Click "Sign In"
5. Verify redirect to tasks page

**API Test**:
```bash
curl -X POST http://localhost:8000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "password123"
  }'
```

### 3. Protected Task Access

**Manual Test**:
1. Ensure you're signed in
2. Navigate to http://localhost:3000/tasks
3. Create a new task
4. Verify task appears in list
5. Sign out and try to access /tasks
6. Verify redirect to signin page

**API Test**:
```bash
# Get JWT token from signup/signin response
TOKEN="your-jwt-token-here"

# Get all tasks
curl -X GET http://localhost:8000/tasks \
  -H "Authorization: Bearer $TOKEN"

# Create a task
curl -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "description": "This is a test task"
  }'
```

### 4. Cross-User Access Prevention

**Test Steps**:
1. Create User A: `user-a@example.com`
2. Create User B: `user-b@example.com`
3. User A creates a task (note the task_id)
4. User B attempts to access User A's task
5. Verify 403 Forbidden response

**API Test**:
```bash
# User A creates task
TOKEN_A="user-a-jwt-token"
TASK_RESPONSE=$(curl -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title": "User A task"}')

TASK_ID=$(echo $TASK_RESPONSE | jq -r '.id')

# User B tries to access User A's task
TOKEN_B="user-b-jwt-token"
curl -X GET http://localhost:8000/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN_B"

# Expected response (403 Forbidden):
# {"detail": "Not authorized to access this task"}
```

### 5. Token Expiry Validation

**Test Steps**:
1. Sign in and get JWT token
2. Decode token to check expiry (use jwt.io)
3. Verify expiry is 7 days from issuance
4. (Optional) Manually expire token and test rejection

**Token Inspection**:
```bash
# Decode JWT token (paste token at https://jwt.io)
# Or use command line:
echo "your-jwt-token" | cut -d'.' -f2 | base64 -d | jq

# Expected payload:
# {
#   "sub": "550e8400-e29b-41d4-a716-446655440000",
#   "email": "user@example.com",
#   "exp": 1739145600  # Unix timestamp (7 days from now)
# }
```

## Security Validation

### 1. Unauthenticated Access

**Test**: All task endpoints should reject requests without JWT token

```bash
# Should return 401 Unauthorized
curl -X GET http://localhost:8000/tasks

# Expected response:
# {"detail": "Not authenticated"}
```

### 2. Invalid Token

**Test**: Endpoints should reject invalid or malformed tokens

```bash
# Invalid token
curl -X GET http://localhost:8000/tasks \
  -H "Authorization: Bearer invalid-token"

# Expected response (401):
# {"detail": "Invalid authentication credentials"}
```

### 3. Password Validation

**Test**: Signup should enforce password requirements

```bash
# Password too short (< 8 characters)
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "short"
  }'

# Expected response (400):
# {"detail": "Password must be at least 8 characters long"}
```

### 4. Email Uniqueness

**Test**: Duplicate email registration should fail

```bash
# First signup (should succeed)
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "password123"
  }'

# Second signup with same email (should fail)
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "password456"
  }'

# Expected response (409):
# {"detail": "Email already registered"}
```

## Troubleshooting

### Issue: "Invalid authentication credentials"

**Cause**: BETTER_AUTH_SECRET mismatch between frontend and backend

**Solution**:
1. Verify both .env files have identical BETTER_AUTH_SECRET
2. Restart both backend and frontend servers
3. Clear browser localStorage and sign in again

### Issue: "Connection refused" or "Network error"

**Cause**: Backend server not running or wrong URL

**Solution**:
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check NEXT_PUBLIC_API_URL in frontend .env.local
3. Ensure no firewall blocking port 8000

### Issue: Database connection error

**Cause**: Invalid DATABASE_URL or database not accessible

**Solution**:
1. Verify DATABASE_URL format: `postgresql+asyncpg://user:pass@host:port/db`
2. Test database connection: `psql $DATABASE_URL`
3. For Neon: Ensure connection string is correct and database is active

### Issue: "Email already registered" on first signup

**Cause**: Database already has user with that email

**Solution**:
1. Use a different email address
2. Or clear database: `DROP TABLE users, tasks CASCADE;` (development only)
3. Restart backend to recreate tables

### Issue: Token not persisting across browser sessions

**Cause**: localStorage cleared or different browser/incognito mode

**Solution**:
1. Check browser DevTools → Application → Local Storage
2. Verify `auth_token` exists after signin
3. Don't use incognito mode (localStorage cleared on close)

### Issue: CORS errors in browser console

**Cause**: Frontend URL not in backend CORS allowed origins

**Solution**:
1. Verify FRONTEND_URL in backend .env matches frontend URL
2. Restart backend server after changing .env
3. Check backend logs for CORS configuration

## Production Deployment

### Security Checklist

- [ ] Use HTTPS for all communication (frontend and backend)
- [ ] Generate strong BETTER_AUTH_SECRET (32+ characters)
- [ ] Set DEBUG=false in backend .env
- [ ] Use environment-specific DATABASE_URL (production database)
- [ ] Enable database connection pooling
- [ ] Implement rate limiting on auth endpoints
- [ ] Add Content Security Policy (CSP) headers
- [ ] Use httpOnly cookies instead of localStorage (recommended)
- [ ] Enable database backups
- [ ] Set up monitoring and logging

### Environment Variables (Production)

**Backend**:
```bash
DATABASE_URL=postgresql+asyncpg://prod-user:secure-pass@prod-host:5432/prod-db
BETTER_AUTH_SECRET=<strong-production-secret>
FRONTEND_URL=https://yourdomain.com
HOST=0.0.0.0
PORT=8000
DEBUG=false
```

**Frontend**:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
BETTER_AUTH_SECRET=<same-as-backend>
```

### Deployment Steps

1. **Backend** (example: Railway, Render, AWS):
   - Deploy FastAPI application
   - Set environment variables
   - Run database migrations
   - Verify health endpoint: `https://api.yourdomain.com/health`

2. **Frontend** (example: Vercel, Netlify):
   - Deploy Next.js application
   - Set environment variables
   - Configure custom domain
   - Verify deployment: `https://yourdomain.com`

3. **Database** (Neon PostgreSQL):
   - Use production connection string
   - Enable connection pooling
   - Set up automated backups

## API Documentation

### Interactive API Docs

Once backend is running, access interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### OpenAPI Specifications

- Authentication API: `specs/002-user-authentication/contracts/auth-api.yaml`
- Tasks API: `specs/002-user-authentication/contracts/tasks-api.yaml`

## Next Steps

After completing setup and testing:

1. **Run `/sp.tasks`**: Generate detailed implementation tasks
2. **Implement refinements**: Adjust token expiry, enhance error messages
3. **Write tests**: Comprehensive test coverage for all scenarios
4. **Update documentation**: Add any project-specific setup instructions
5. **Demo preparation**: Prepare demo script for hackathon judges

## Support

For issues or questions:
- Check troubleshooting section above
- Review API documentation at http://localhost:8000/docs
- Consult spec.md for requirements
- Review research.md for security best practices
