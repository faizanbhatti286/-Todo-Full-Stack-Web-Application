"""Configuration management for the application.

Loads environment variables and provides application settings.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str

    # Authentication
    BETTER_AUTH_SECRET: str

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Debug
    DEBUG: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
