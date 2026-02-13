---
title: Todo Backend API
emoji: 📝
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# Todo Application Backend

FastAPI backend with JWT authentication and PostgreSQL database.

## Configuration

This Space requires the following environment variables (set in Settings → Variables):

- `DATABASE_URL`: PostgreSQL connection string with asyncpg driver
- `BETTER_AUTH_SECRET`: JWT signing secret (must match frontend)
- `FRONTEND_URL`: Your Vercel frontend URL for CORS
- `HOST`: 0.0.0.0
- `PORT`: 7860

## API Documentation

Once deployed, visit:
- `/docs` - Swagger UI
- `/health` - Health check endpoint
