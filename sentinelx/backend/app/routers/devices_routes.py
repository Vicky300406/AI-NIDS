from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.services.state_manager import state_manager

router = APIRouter(prefix="/api/devices", tags=["Devices & Interfaces"])

@router.get("")
def get_network_devices(current_user: dict = Depends(get_current_user)):
    """Retrieve list of active network devices and interfaces."""
    devices = state_manager.get_devices()
    return {
        "count": len(devices),
        "devices": devices,
    }
