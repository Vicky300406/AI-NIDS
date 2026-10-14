import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Request
from typing import Optional, Dict, Any
import pandas as pd

from app.auth import get_current_user
from app.ml.predictor import predict_record, predict_batch
from app.services.state_manager import state_manager

router = APIRouter(prefix="/api/predict", tags=["Prediction"])

@router.post("")
async def predict_traffic(
    request: Request,
    file: Optional[UploadFile] = File(None),
    model_name: Optional[str] = Form("XGBoost"),
    current_user: dict = Depends(get_current_user),
):
    """
    Predict intrusion classification for network flow.
    Supports either:
    1. CSV file upload (multipart/form-data)
    2. JSON payload for single flow record
    """
    # ── CASE 1: CSV File Upload ───────────────────────────────────────────────
    if file is not None:
        if not file.filename.endswith((".csv", ".txt")):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only CSV files (.csv) are supported for traffic scanning.",
            )
        try:
            content = await file.read()
            df = pd.read_csv(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse uploaded CSV file: {str(e)}",
            )

        if df.empty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded CSV file is empty.",
            )

        # Run batch inference
        batch_results = predict_batch(df, model_name=model_name or "XGBoost")

        # Automatically record attack alerts in state manager for any high severity attacks detected
        for item in batch_results.get("results", []):
            if item["prediction"] == "ATTACK" and item["prob_attack"] >= 0.80:
                alert = state_manager.create_alert(
                    src_ip=item.get("src_ip"),
                    dst_ip=item.get("dst_ip"),
                    attack_type=item.get("attack_type"),
                    protocol=item.get("protocol"),
                    confidence=item.get("prob_attack"),
                )
                await state_manager.broadcast({"type": "ALERT", "data": alert})

        # Update stats
        state_manager.record_traffic_tick(
            normal=batch_results["normal_records"],
            attack=batch_results["attacks_detected"],
            attacks_by_type=batch_results["attack_types_breakdown"],
        )

        return {
            "type": "batch",
            "filename": file.filename,
            **batch_results
        }

    # ── CASE 2: Single JSON Record ────────────────────────────────────────────
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expected JSON body for single record prediction or CSV file upload.",
        )

    selected_model = body.get("model", model_name or "XGBoost")
    res = predict_record(body, model_name=selected_model)

    # If it is an attack, register an alert
    if res["label"] == "ATTACK":
        alert = state_manager.create_alert(
            src_ip=body.get("src_ip"),
            dst_ip=body.get("dst_ip"),
            src_port=body.get("src_port"),
            dst_port=body.get("dst_port"),
            attack_type=res["attack_type"],
            protocol=body.get("protocol_type", "tcp").upper(),
            confidence=res["prob_attack"],
        )
        await state_manager.broadcast({"type": "ALERT", "data": alert})

    return {
        "type": "single",
        **res
    }
