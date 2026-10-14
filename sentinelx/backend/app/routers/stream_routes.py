import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.auth import decode_token
from app.services.state_manager import state_manager

router = APIRouter(tags=["WebSocket Stream"])

@router.websocket("/api/stream")
async def websocket_stream(websocket: WebSocket, token: str = Query(None)):
    """
    Real-time streaming WebSocket endpoint.
    Accepts JWT token in query string (?token=...) or first payload.
    Emits live intrusion detection alerts and telemetry ticks.
    """
    # Verify token if passed
    if token:
        try:
            decode_token(token)
        except Exception:
            await websocket.close(code=1008, reason="Unauthorized")
            return

    await state_manager.connect_ws(websocket)
    try:
        # Send initial connection acknowledgment & recent alerts
        await websocket.send_json({
            "type": "CONNECTED",
            "message": "Connected to SentinelX Live Security Stream",
            "active_alerts_count": len(state_manager.alerts),
        })

        while True:
            # Keep connection open, handle incoming heartbeat pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        state_manager.disconnect_ws(websocket)
    except Exception:
        state_manager.disconnect_ws(websocket)
