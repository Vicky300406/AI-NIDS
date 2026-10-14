import hmac
import hashlib
import time
import datetime
from typing import Optional, Dict, Tuple
from collections import defaultdict

import bcrypt
import jwt
from fastapi import HTTPException, Security, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from app.database import get_db

security = HTTPBearer(auto_error=False)

# ── In-Memory Rate Limiter for Login ──────────────────────────────────────────
# Maps IP or username -> list of timestamp attempts
_login_attempts: Dict[str, list] = defaultdict(list)

def check_login_rate_limit(client_ip: str, username: str) -> None:
    now = time.time()
    window = settings.RATE_LIMIT_LOGIN_WINDOW_SECONDS
    max_attempts = settings.RATE_LIMIT_LOGIN_MAX

    keys = [f"ip:{client_ip}", f"user:{username.lower().strip()}"]
    for key in keys:
        # Keep only timestamps within window
        _login_attempts[key] = [t for t in _login_attempts[key] if now - t < window]
        if len(_login_attempts[key]) >= max_attempts:
            retry_after = int(window - (now - _login_attempts[key][0]))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many failed login attempts. Please try again in {max(1, retry_after)} seconds.",
            )

def record_login_attempt(client_ip: str, username: str) -> None:
    now = time.time()
    _login_attempts[f"ip:{client_ip}"].append(now)
    _login_attempts[f"user:{username.lower().strip()}"].append(now)

def clear_login_attempts(client_ip: str, username: str) -> None:
    _login_attempts.pop(f"ip:{client_ip}", None)
    _login_attempts.pop(f"user:{username.lower().strip()}", None)


# ── Password Hashing & Verification (bcrypt + legacy upgrade) ─────────────────
def hash_password(password: str) -> Tuple[str, str]:
    """Generates a bcrypt hash and salt."""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8"), salt.decode("utf-8")

def verify_password(password: str, stored_hash: str, salt: str = "") -> bool:
    """Verifies password using bcrypt, falling back to PBKDF2 for legacy records."""
    if stored_hash.startswith("$2b$") or stored_hash.startswith("$2a$"):
        try:
            return bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8"))
        except Exception:
            return False
    # Legacy PBKDF2 check from original Streamlit app
    try:
        key = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            iterations=260_000,
        )
        return hmac.compare_digest(key.hex(), stored_hash)
    except Exception:
        return False


# ── JWT Token Generation & Verification ───────────────────────────────────────
def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + (
        expires_delta or datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + (
        expires_delta or datetime.timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ── FastAPI User Dependency ───────────────────────────────────────────────────
def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_token(credentials.credentials)
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type for authorization.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token subject missing.",
        )
    
    with get_db() as conn:
        user = conn.execute(
            "SELECT id, username, email, full_name, role, is_active, created_at, last_login FROM users WHERE username = ?",
            (username,),
        ).fetchone()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists.",
        )
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated.",
        )
    return dict(user)

def get_current_active_admin(user: dict = Security(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required.",
        )
    return user
