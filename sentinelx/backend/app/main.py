import asyncio
import random
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.services.state_manager import state_manager
from app.routers import (
    auth_routes,
    predict_routes,
    alerts_routes,
    stats_routes,
    devices_routes,
    stream_routes,
)

# ── Background Task: Live Simulation & Broadcast ──────────────────────────────
async def background_monitoring_worker():
    while True:
        try:
            await asyncio.sleep(4)
            if state_manager.is_running:
                normal = random.randint(35, 110)
                attack = random.randint(0, 12) if random.random() < 0.65 else 0
                tick = state_manager.record_traffic_tick(normal, attack)

                # Broadcast traffic tick
                await state_manager.broadcast({
                    "type": "TICK",
                    "data": tick,
                })

                # Occasionally generate a live intrusion alert
                if attack > 0 and random.random() < 0.40:
                    alert = state_manager.create_alert()
                    await state_manager.broadcast({
                        "type": "ALERT",
                        "data": alert,
                    })
        except asyncio.CancelledError:
            break
        except Exception as e:
            await asyncio.sleep(2)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure DB tables and admin seed
    init_db()
    worker_task = asyncio.create_task(background_monitoring_worker())
    print(f"[SentinelX] AI-NIDS API v{settings.VERSION} initialized successfully.")
    yield
    # Shutdown
    worker_task.cancel()
    try:
        await worker_task
    except asyncio.CancelledError:
        pass

# ── FastAPI App Setup ─────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Real-time AI-Powered Network Intrusion Detection System REST & WebSocket API",
    lifespan=lifespan,
)

# ── CORS Middleware ───────────────────────────────────────────────────────────
# Restrict strictly to configured frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount Routers ─────────────────────────────────────────────────────────────
app.include_router(auth_routes.router)
app.include_router(predict_routes.router)
app.include_router(alerts_routes.router)
app.include_router(stats_routes.router)
app.include_router(devices_routes.router)
app.include_router(stream_routes.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }

@app.get("/")
def root():
    return {
        "message": f"{settings.PROJECT_NAME} is running.",
        "documentation": "/docs",
        "health": "/api/health",
    }
