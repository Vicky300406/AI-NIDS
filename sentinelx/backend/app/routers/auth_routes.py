import datetime
from fastapi import APIRouter, HTTPException, status, Request, Depends
from pydantic import BaseModel, Field
from typing import Optional

from app.database import get_db
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    check_login_rate_limit,
    record_login_attempt,
    clear_login_attempts,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: str = Field(..., min_length=5, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8)
    role: Optional[str] = "analyst"

class LoginRequest(BaseModel):
    username: str
    password: str
    remember_me: Optional[bool] = False

class RefreshRequest(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest):
    username = req.username.strip()
    email = req.email.strip().lower()
    full_name = req.full_name.strip()
    password = req.password

    # Input validations
    if not all(c.isalnum() or c in "_-" for c in username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username may only contain letters, numbers, hyphens, and underscores.",
        )
    if not any(c.isupper() for c in password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one uppercase letter.",
        )
    if not any(c.isdigit() for c in password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one numeric digit.",
        )

    pw_hash, salt = hash_password(password)
    now = datetime.datetime.now().isoformat(timespec="seconds")

    with get_db() as conn:
        # Check existing
        existing = conn.execute(
            "SELECT username, email FROM users WHERE username = ? OR email = ?",
            (username, email),
        ).fetchone()
        if existing:
            if existing["username"].lower() == username.lower():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Username '{username}' is already taken.")
            if existing["email"].lower() == email.lower():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Email '{email}' is already registered.")

        cursor = conn.execute(
            """INSERT INTO users (username, email, full_name, role, password_hash, salt, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (username, email, full_name, req.role or "analyst", pw_hash, salt, now),
        )
        conn.commit()
        user_id = cursor.lastrowid

    return {
        "status": "success",
        "message": f"User '{username}' registered successfully.",
        "user": {
            "id": user_id,
            "username": username,
            "email": email,
            "full_name": full_name,
            "role": req.role or "analyst",
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    username = req.username.strip()
    password = req.password

    # Check Rate Limit
    check_login_rate_limit(client_ip, username)

    with get_db() as conn:
        user = conn.execute(
            "SELECT * FROM users WHERE username = ? AND is_active = 1",
            (username,),
        ).fetchone()

        if not user or not verify_password(password, user["password_hash"], user["salt"]):
            record_login_attempt(client_ip, username)
            now = datetime.datetime.now().isoformat(timespec="seconds")
            conn.execute(
                "INSERT INTO login_log (username, event, ip_hint, ts) VALUES (?, ?, ?, ?)",
                (username, "LOGIN_FAILED", client_ip, now),
            )
            conn.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password.",
            )

        # Successful login: clear failed attempts
        clear_login_attempts(client_ip, username)

        # Seamless upgrade: if password was stored with old PBKDF2 hash, upgrade to bcrypt
        if not user["password_hash"].startswith("$2b$"):
            new_hash, new_salt = hash_password(password)
            conn.execute(
                "UPDATE users SET password_hash = ?, salt = ? WHERE id = ?",
                (new_hash, new_salt, user["id"]),
            )

        now = datetime.datetime.now().isoformat(timespec="seconds")
        conn.execute("UPDATE users SET last_login = ? WHERE id = ?", (now, user["id"]))
        conn.execute(
            "INSERT INTO login_log (username, event, ip_hint, ts) VALUES (?, ?, ?, ?)",
            (username, "LOGIN_SUCCESS", client_ip, now),
        )
        conn.commit()

    # Generate JWT Tokens
    access_token = create_access_token({"sub": user["username"], "role": user["role"]})
    refresh_delta = datetime.timedelta(days=30 if req.remember_me else 7)
    refresh_token = create_refresh_token({"sub": user["username"]}, expires_delta=refresh_delta)

    user_data = {
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "created_at": user["created_at"],
        "last_login": now,
    }

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user_data,
    }

@router.post("/refresh")
def refresh_token(req: RefreshRequest):
    payload = decode_token(req.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid refresh token type.",
        )
    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token subject missing.",
        )

    with get_db() as conn:
        user = conn.execute(
            "SELECT username, role, is_active FROM users WHERE username = ?",
            (username,),
        ).fetchone()

    if not user or not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer active.",
        )

    new_access_token = create_access_token({"sub": user["username"], "role": user["role"]})
    return {
        "access_token": new_access_token,
        "token_type": "bearer",
    }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "role": current_user["role"],
        "created_at": current_user["created_at"],
        "last_login": current_user["last_login"],
    }
