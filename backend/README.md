# Todo Application - Backend

FastAPI backend for the Todo application with JWT authentication and PostgreSQL database.

## Prerequisites

- Python 3.9+
- PostgreSQL database (Neon Serverless PostgreSQL recommended)
- pip (Python package manager)

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string (use `postgresql+asyncpg://` prefix)
- `BETTER_AUTH_SECRET`: Shared secret for JWT signing (must match frontend)
- `FRONTEND_URL`: Frontend URL for CORS (e.g., `http://localhost:3000`)

### 4. Initialize Database

Run the migration script to create tables:

```bash
psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

Or the database will be auto-initialized on first startup.

### 5. Run Development Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── src/
│   ├── api/          # API route handlers
│   ├── models/       # SQLModel database models
│   ├── schemas/      # Pydantic request/response schemas
│   ├── services/     # Business logic layer
│   ├── config.py     # Configuration management
│   ├── database.py   # Database connection
│   └── main.py       # FastAPI application
├── tests/            # Test files
├── migrations/       # Database migration scripts
└── requirements.txt  # Python dependencies
```

## Testing

```bash
pytest
```

## Production Deployment

1. Set production environment variables
2. Use a production WSGI server:
   ```bash
   uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```
3. Enable HTTPS
4. Configure proper CORS origins
5. Set up database backups
6. Enable logging and monitoring
