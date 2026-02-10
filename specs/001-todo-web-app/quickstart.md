# Quickstart Guide

**Feature**: Todo Full-Stack Web Application
**Date**: 2026-02-09
**Estimated Setup Time**: 30 minutes

This guide walks you through setting up the development environment and running the Todo application locally.

---

## Prerequisites

### Required Software

- **Python 3.9+**: Backend runtime
- **Node.js 18+**: Frontend runtime
- **npm or yarn**: Package manager
- **Git**: Version control
- **PostgreSQL client** (optional): For database inspection

### Required Accounts

- **Neon Account**: For serverless PostgreSQL database
  - Sign up at https://neon.tech
  - Create a new project and database

---

## Environment Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Generate Shared Secret

Generate a secure secret for JWT signing (used by both frontend and backend):

```bash
# Linux/Mac
openssl rand -hex 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Save this value - you'll need it for both backend and frontend configuration.

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**requirements.txt** should contain:
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlmodel==0.0.14
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic[email]==2.5.3
```

### 4. Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:password@neon-host/dbname

# Authentication
BETTER_AUTH_SECRET=<your-generated-secret-from-step-2>

# CORS (adjust for production)
FRONTEND_URL=http://localhost:3000

# Server
HOST=0.0.0.0
PORT=8000
```

**Get DATABASE_URL from Neon**:
1. Go to Neon dashboard
2. Select your project
3. Copy connection string
4. Replace `postgresql://` with `postgresql+asyncpg://`

### 5. Initialize Database

Run database migrations to create tables:

```bash
# If using Alembic (recommended)
alembic upgrade head

# Or run SQL directly
psql $DATABASE_URL -f ../specs/001-todo-web-app/data-model.md
# (Extract SQL from data-model.md)
```

### 6. Run Backend Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Verify backend is running**:
- Open http://localhost:8000/docs
- You should see FastAPI Swagger UI with API documentation

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd ../frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

**package.json** should include:
```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "better-auth": "^1.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### 3. Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication (same secret as backend)
BETTER_AUTH_SECRET=<your-generated-secret-from-step-2>

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Frontend Development Server

```bash
npm run dev
# or
yarn dev
```

**Verify frontend is running**:
- Open http://localhost:3000
- You should see the landing/signin page

---

## Verify Installation

### 1. Test Backend API

```bash
# Health check (if implemented)
curl http://localhost:8000/health

# API docs
open http://localhost:8000/docs
```

### 2. Test Full Flow

1. **Sign Up**:
   - Navigate to http://localhost:3000/signup
   - Create account with email and password
   - Should redirect to task list

2. **Create Task**:
   - Click "Add Task" button
   - Enter task title
   - Task should appear in list

3. **Update Task**:
   - Click edit icon on task
   - Modify title or description
   - Changes should persist

4. **Complete Task**:
   - Click checkbox on task
   - Task should show as completed

5. **Delete Task**:
   - Click delete icon on task
   - Task should be removed from list

6. **Sign Out**:
   - Click sign out button
   - Should redirect to signin page

7. **Sign In**:
   - Enter credentials from step 1
   - Should see your tasks again

---

## Database Inspection

### Connect to Neon Database

```bash
psql $DATABASE_URL
```

### Useful Queries

```sql
-- List all tables
\dt

-- View users
SELECT id, email, created_at FROM users;

-- View tasks
SELECT id, user_id, title, is_completed, created_at FROM tasks;

-- Count tasks per user
SELECT user_id, COUNT(*) as task_count
FROM tasks
GROUP BY user_id;
```

---

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Activate virtual environment and reinstall dependencies
  ```bash
  source venv/bin/activate  # or venv\Scripts\activate on Windows
  pip install -r requirements.txt
  ```

**Problem**: `sqlalchemy.exc.OperationalError: could not connect to server`
- **Solution**: Check DATABASE_URL in `.env` file
- Verify Neon database is running and accessible
- Check firewall/network settings

**Problem**: `401 Unauthorized` on all task endpoints
- **Solution**: Verify BETTER_AUTH_SECRET matches between frontend and backend
- Check JWT token is being sent in Authorization header

### Frontend Issues

**Problem**: `Error: Cannot find module 'next'`
- **Solution**: Install dependencies
  ```bash
  npm install
  ```

**Problem**: API requests fail with CORS error
- **Solution**: Check backend CORS configuration includes frontend URL
- Verify NEXT_PUBLIC_API_URL in `.env.local` is correct

**Problem**: Authentication not working
- **Solution**: Verify BETTER_AUTH_SECRET matches backend
- Clear browser cookies and local storage
- Check browser console for errors

### Database Issues

**Problem**: Tables don't exist
- **Solution**: Run database migrations or SQL schema
  ```bash
  psql $DATABASE_URL -f schema.sql
  ```

**Problem**: UUID extension not available
- **Solution**: Enable extension in Neon console or run:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```

---

## Development Workflow

### Making Changes

1. **Backend changes**:
   - Edit files in `backend/src/`
   - Server auto-reloads with `--reload` flag
   - Test with Swagger UI at http://localhost:8000/docs

2. **Frontend changes**:
   - Edit files in `frontend/src/`
   - Next.js auto-reloads in development
   - Test in browser at http://localhost:3000

3. **Database changes**:
   - Create Alembic migration: `alembic revision --autogenerate -m "description"`
   - Apply migration: `alembic upgrade head`
   - Update `data-model.md` documentation

### Running Tests

**Backend tests**:
```bash
cd backend
pytest
```

**Frontend tests**:
```bash
cd frontend
npm test
```

**E2E tests**:
```bash
cd frontend
npm run test:e2e
```

---

## Production Deployment

### Backend Deployment

1. **Set production environment variables**:
   ```bash
   DATABASE_URL=<production-neon-url>
   BETTER_AUTH_SECRET=<production-secret>
   FRONTEND_URL=https://yourdomain.com
   ```

2. **Run with production server**:
   ```bash
   uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

3. **Use process manager** (PM2, systemd, or Docker):
   ```bash
   # Docker example
   docker build -t todo-backend .
   docker run -p 8000:8000 --env-file .env todo-backend
   ```

### Frontend Deployment

1. **Build production bundle**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended for Next.js):
   ```bash
   vercel --prod
   ```

3. **Or deploy to any Node.js host**:
   ```bash
   npm run start
   ```

### Security Checklist

- [ ] Use HTTPS in production
- [ ] Generate new BETTER_AUTH_SECRET for production
- [ ] Restrict CORS to production frontend domain
- [ ] Enable Neon connection pooling
- [ ] Set secure cookie flags in Better Auth
- [ ] Enable rate limiting on API endpoints
- [ ] Review and update JWT expiration time
- [ ] Set up database backups in Neon
- [ ] Configure logging and monitoring
- [ ] Review and test error handling

---

## Next Steps

After completing setup:

1. **Review Documentation**:
   - [spec.md](./spec.md) - Feature requirements
   - [data-model.md](./data-model.md) - Database schema
   - [research.md](./research.md) - Technology decisions
   - [contracts/api.openapi.yaml](./contracts/api.openapi.yaml) - API specification

2. **Run Tests**:
   - Execute test suites to verify everything works
   - Check test coverage

3. **Start Development**:
   - Follow tasks in `tasks.md` (generated by `/sp.tasks`)
   - Implement features according to spec

4. **Monitor Progress**:
   - Track implementation against acceptance criteria
   - Test each user story independently

---

## Support

For issues or questions:
- Check troubleshooting section above
- Review error logs in terminal
- Inspect browser console for frontend errors
- Check Neon dashboard for database status
- Refer to technology documentation:
  - FastAPI: https://fastapi.tiangolo.com
  - Next.js: https://nextjs.org/docs
  - SQLModel: https://sqlmodel.tiangolo.com
  - Better Auth: https://better-auth.com

---

## Summary

**Setup Checklist**:
- [x] Prerequisites installed (Python, Node.js, PostgreSQL client)
- [x] Neon database created
- [x] Shared secret generated
- [x] Backend configured and running (port 8000)
- [x] Frontend configured and running (port 3000)
- [x] Database tables created
- [x] Full user flow tested (signup → create task → update → delete → signout)

**Estimated Time**: 20-30 minutes for first-time setup

**Ready for Development**: Once all checklist items are complete, you're ready to start implementing features according to the specification.
