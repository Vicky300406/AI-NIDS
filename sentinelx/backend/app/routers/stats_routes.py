from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.services.state_manager import state_manager

router = APIRouter(prefix="/api/stats", tags=["Statistics"])

@router.get("")
def get_stats_overview(current_user: dict = Depends(get_current_user)):
    """Retrieve security metrics and system performance overview."""
    return state_manager.get_stats()

@router.get("/history")
def get_traffic_history(current_user: dict = Depends(get_current_user)):
    """Retrieve time-series traffic and attack flow history."""
    with state_manager.lock:
        return {
            "count": len(state_manager.traffic_history),
            "history": list(state_manager.traffic_history),
        }

@router.post("/toggle-monitoring")
async def toggle_monitoring(current_user: dict = Depends(get_current_user)):
    """Toggle background monitoring engine state."""
    with state_manager.lock:
        state_manager.is_running = not state_manager.is_running
        status_state = state_manager.is_running

    await state_manager.broadcast({
        "type": "MONITORING_TOGGLED",
        "data": {"is_running": status_state}
    })

    return {
        "status": "success",
        "is_running": status_state,
        "message": "Monitoring " + ("resumed" if status_state else "paused")
    }
