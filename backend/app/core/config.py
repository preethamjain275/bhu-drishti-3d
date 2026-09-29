import os
from typing import List
from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "BHOO-MITRA AI API"
    APP_ENV: str = "development"
    API_VERSION: str = "0.1.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # Database & PostGIS
    DATABASE_URL: str = "postgresql://bhoomitra_user:bhoomitra_pass@localhost:5432/bhoomitra_db"
    POSTGRES_DB: str = "bhoomitra_db"
    POSTGRES_USER: str = "bhoomitra_user"
    POSTGRES_PASSWORD: str = "bhoomitra_pass"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    # Repository Mode: "postgres" | "mock"
    REPOSITORY_MODE: str = "postgres"

    model_config = ConfigDict(env_file=".env", extra="ignore")

settings = Settings()
