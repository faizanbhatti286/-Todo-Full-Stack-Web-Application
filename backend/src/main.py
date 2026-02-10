"""FastAPI application entry point.

This module initializes the FastAPI application with CORS middleware
and registers all API routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings

# Create FastAPI application
app = FastAPI(
    title="Todo Application API",
    description="RESTful API for multi-user todo application with JWT authentication",
    version="1.0.0",
)

# Configure CORS
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",  # Development frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {"message": "Todo API is running", "status": "healthy"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Event handlers for database lifecycle
@app.on_event("startup")
async def startup_event():
    """Initialize database on application startup."""
    from .database import init_db
    await init_db()


@app.on_event("shutdown")
async def shutdown_event():
    """Close database connections on application shutdown."""
    from .database import close_db
    await close_db()


# Import and register routers
from .api import auth, tasks

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(tasks.router, prefix="/api/users", tags=["Tasks"])
