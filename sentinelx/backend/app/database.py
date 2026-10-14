import os
import sqlite3
import datetime
from app.config import settings

def get_db():
    conn = sqlite3.connect(settings.DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Ensure tables exist and seed default admin user."""
    os.makedirs(os.path.dirname(settings.DB_PATH), exist_ok=True)
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                username      TEXT UNIQUE NOT NULL COLLATE NOCASE,
                email         TEXT UNIQUE NOT NULL COLLATE NOCASE,
                full_name     TEXT NOT NULL,
                role          TEXT NOT NULL DEFAULT 'analyst',
                password_hash TEXT NOT NULL,
                salt          TEXT NOT NULL,
                created_at    TEXT NOT NULL,
                last_login    TEXT,
                is_active     INTEGER NOT NULL DEFAULT 1
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS login_log (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                username    TEXT NOT NULL,
                event       TEXT NOT NULL,
                ip_hint     TEXT,
                ts          TEXT NOT NULL
            )
        """)
        conn.commit()

        # Seed admin if no users exist
        count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        if count == 0:
            import bcrypt
            salt_bytes = bcrypt.gensalt(rounds=12)
            pw_hash = bcrypt.hashpw("Admin@1234".encode("utf-8"), salt_bytes).decode("utf-8")
            now = datetime.datetime.now().isoformat(timespec="seconds")
            conn.execute("""
                INSERT INTO users (username, email, full_name, role, password_hash, salt, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, ("admin", "admin@nids.local", "System Administrator", "admin", pw_hash, salt_bytes.decode("utf-8"), now))
            conn.commit()
            print("[Database] Seeded default administrator user: admin")
