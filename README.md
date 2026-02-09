# Todo Full-Stack Web Application

A modern, multi-user todo application built with Next.js, FastAPI, and PostgreSQL, featuring JWT authentication and responsive design.

## 🎯 Project Overview

This application demonstrates a complete full-stack implementation following spec-driven development principles. It provides secure, user-isolated task management with a responsive web interface.

### Key Features

- ✅ User authentication (signup, signin, signout)
- ✅ JWT-based security with user data isolation
- ✅ Complete CRUD operations for tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Responsive design (320px - 1920px)
- ✅ RESTful API with OpenAPI documentation
- ✅ Persistent storage with PostgreSQL

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Better Auth (JWT)

**Backend:**
- Python 3.9+
- FastAPI
- SQLModel (ORM)
- PostgreSQL (Neon Serverless)
- JWT authentication

### Project Structure

```
.
├── backend/              # FastAPI backend
│   ├── src/
│   │   ├── api/         # Route handlers
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── main.py      # Application entry
│   ├── migrations/      # Database migrations
│   └── tests/           # Backend tests
│
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities
│   │   └── types/      # TypeScript types
│   └── middleware.ts   # Route protection
│
└── specs/              # Design documentation
    └── 001-todo-web-app/
        ├── spec.md     # Feature specification
        ├── plan.md     # Implementation plan
        ├── tasks.md    # Task breakdown
        └── contracts/  # API contracts
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL database (Neon account recommended)

### 1. Generate Shared Secret

```bash
# Linux/Mac
openssl rand -hex 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Save this value - you'll use it in both backend and frontend.

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and BETTER_AUTH_SECRET

# Initialize database
psql $DATABASE_URL -f migrations/001_initial_schema.sql

# Run server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with NEXT_PUBLIC_API_URL and BETTER_AUTH_SECRET

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📖 Documentation

- **[Specification](specs/001-todo-web-app/spec.md)** - Feature requirements and user stories
- **[Implementation Plan](specs/001-todo-web-app/plan.md)** - Architecture and design decisions
- **[Tasks](specs/001-todo-web-app/tasks.md)** - Complete task breakdown (90 tasks)
- **[API Contracts](specs/001-todo-web-app/contracts/api.openapi.yaml)** - OpenAPI 3.0 specification
- **[Data Model](specs/001-todo-web-app/data-model.md)** - Database schema
- **[Quickstart Guide](specs/001-todo-web-app/quickstart.md)** - Detailed setup instructions

## 🔒 Security

- JWT tokens for authentication
- Password hashing with bcrypt
- User data isolation at database level
- CORS configured for specific origins
- Protected routes via middleware
- Ownership validation on all operations

## 🎨 User Interface

The application features a clean, responsive design:

- **Authentication**: Signup and signin pages with form validation
- **Task Management**: Create, edit, delete, and complete tasks
- **Navigation**: Header with user info and signout button
- **Responsive**: Works seamlessly from mobile (320px) to desktop (1920px+)

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Sign in user
- `POST /auth/signout` - Sign out user

### Tasks (Authenticated)
- `GET /tasks` - Get all user's tasks
- `POST /tasks` - Create new task
- `GET /tasks/{id}` - Get specific task
- `PUT /tasks/{id}` - Update task (full)
- `PATCH /tasks/{id}` - Update task (partial)
- `DELETE /tasks/{id}` - Delete task

## 🚢 Deployment

### Backend (Production)
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend (Vercel)
```bash
vercel --prod
```

## 📝 Development Workflow

This project follows **Spec-Driven Development**:

1. **Specification** (`/sp.specify`) - Define requirements
2. **Planning** (`/sp.plan`) - Design architecture
3. **Tasks** (`/sp.tasks`) - Break down implementation
4. **Implementation** (`/sp.implement`) - Execute tasks

All phases are documented in the `specs/` directory.

## 🎯 Success Criteria

✅ All 5 basic level features implemented
✅ JWT authentication enforced on all endpoints
✅ User data isolation verified
✅ Responsive design (320px - 1920px)
✅ RESTful API with proper status codes
✅ Complete documentation and setup guides

## 📄 License

This project is part of a hackathon demonstration.

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding comprehensive test coverage
- Implementing refresh tokens
- Adding rate limiting
- Setting up CI/CD pipelines
- Implementing logging and monitoring
- Adding password reset functionality

## 📞 Support

For issues or questions, refer to:
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Quickstart Guide: `specs/001-todo-web-app/quickstart.md`
"# hackathon-2-phase-2-Todo-Full-Stack-Web-Application" 
"# hackathon-2-phase-2-" 
"# hackathon-2-phase-2-" 
