from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from typing import Optional, List

from app.auth import get_current_user
from app.services.state_manager import state_manager

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

class StatusUpdateRequest(BaseModel):
    status: str

@router.get("")
def list_alerts(
    severity: Optional[str] = Query(None, description="Filter by severity (Critical, High, Medium, Low)"),
    attack_type: Optional[str] = Query(None, description="Filter by attack type"),
    status: Optional[str] = Query(None, description="Filter by status (Open, Acknowledged, Resolved)"),
    limit: int = Query(100, ge=1, le=500),
    current_user: dict = Depends(get_current_user),
):
    """Retrieve security alerts with optional filtering."""
    alerts = state_manager.get_alerts(
        severity=severity,
        attack_type=attack_type,
        status=status,
        limit=limit,
    )
    return {
        "total": len(alerts),
        "alerts": alerts,
    }

@router.put("/{alert_id}/status")
async def update_alert_status(
    alert_id: int,
    req: StatusUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update status of a specific alert."""
    if req.status not in ("Open", "Acknowledged", "Resolved"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be one of: Open, Acknowledged, Resolved",
        )
    ok = state_manager.update_alert_status(alert_id, req.status)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Alert #{alert_id} not found.")

    await state_manager.broadcast({
        "type": "ALERT_UPDATE",
        "data": {"id": alert_id, "status": req.status}
    })

    return {"status": "success", "message": f"Alert #{alert_id} marked as {req.status}"}

@router.post("/simulate")
async def simulate_alert(current_user: dict = Depends(get_current_user)):
    """Simulate a new incoming intrusion detection alert."""
    alert = state_manager.create_alert()
    await state_manager.broadcast({"type": "ALERT", "data": alert})
    return {"status": "success", "alert": alert}
