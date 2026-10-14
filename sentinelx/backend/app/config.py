import os
from typing import List
from dotenv import load_dotenv

# Load .env file from backend directory or root
load_dotenv()

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "SentinelX AI-NIDS API")
    VERSION: str = "2.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Security & JWT
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "sentinelx-super-secret-jwt-key-change-in-production-2026")
    ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:4173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:4173"
        ).split(",")
        if origin.strip()
    ]
    
    # Database
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DB_PATH: str = os.getenv("DB_PATH", os.path.join(BASE_DIR, "nids_users.db"))
    
    # Model Artifacts Directory
    MODEL_DIR: str = os.getenv("MODEL_DIR", os.path.join(BASE_DIR, "Model outputs"))
    
    # Rate Limiting (max login attempts per window)
    RATE_LIMIT_LOGIN_MAX: int = int(os.getenv("RATE_LIMIT_LOGIN_MAX", "10"))
    RATE_LIMIT_LOGIN_WINDOW_SECONDS: int = int(os.getenv("RATE_LIMIT_LOGIN_WINDOW_SECONDS", "60"))

settings = Settings()
