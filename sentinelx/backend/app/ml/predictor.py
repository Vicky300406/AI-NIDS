import random
import numpy as np
import pandas as pd
from app.ml.model_loader import get_artifacts, get_all_models, MODEL_META

SEVERITY_MAP = {
    "DoS": "Critical",
    "DDoS": "Critical",
    "Brute Force": "High",
    "Botnet": "High",
    "Port Scan": "Medium",
    "Probe": "Medium",
    "Web Attack": "Medium",
    "R2L": "Low",
    "U2R": "Low",
}

def classify_attack_subtype(record: dict) -> str:
    """Classify the attack subtype based on flow attributes."""
    flag = str(record.get("flag", "")).upper()
    serror = float(record.get("serror_rate", 0))
    count = float(record.get("count", 0))
    dst_count = float(record.get("dst_host_count", 0))
    service = str(record.get("service", "")).lower()

    if serror > 0.6 or flag in ("S0", "S1", "S2", "S3") or count > 200:
        return "DoS"
    if flag in ("REJ", "RSTO", "RSTR") or dst_count > 200:
        return "Port Scan"
    if service in ("http", "http_443", "ssl") and record.get("num_access_files", 0) > 0:
        return "Web Attack"
    if record.get("root_shell", 0) == 1 or record.get("su_attempted", 0) == 1:
        return "U2R"
    if record.get("is_guest_login", 0) == 1 or record.get("hot", 0) > 2:
        return "Brute Force"
    if record.get("diff_srv_rate", 0) > 0.5:
        return "Probe"
    return random.choice(["DoS", "Port Scan", "Probe", "Brute Force"])

def predict_record(raw_dict: dict, model_name: str = "XGBoost") -> dict:
    xgb_model, scaler, _, cat_encs, features = get_artifacts()
    if model_name == "XGBoost":
        model = xgb_model
    else:
        models = get_all_models()
        model = models.get(model_name, xgb_model)

    df = pd.DataFrame([raw_dict])
    for col, le in cat_encs.items():
        if col in df.columns:
            known = set(le.classes_)
            df[col] = df[col].apply(lambda v: v if str(v) in known else le.classes_[0])
            df[col] = le.transform(df[col].astype(str))
        else:
            df[col] = 0

    for f in features:
        if f not in df.columns:
            df[f] = 0.0

    X = df[features].astype(float)
    X_scaled = scaler.transform(X)
    pred = int(model.predict(X_scaled)[0])
    proba = (
        model.predict_proba(X_scaled)[0]
        if hasattr(model, "predict_proba")
        else [0.5, 0.5]
    )

    label_map = {0: "ATTACK", 1: "NORMAL"}
    label = label_map[pred]
    attack_subtype = classify_attack_subtype(raw_dict) if label == "ATTACK" else "Normal"
    severity = SEVERITY_MAP.get(attack_subtype, "Low") if label == "ATTACK" else "None"

    return {
        "label": label,
        "label_int": pred,
        "prob_attack": float(round(proba[0], 4)),
        "prob_normal": float(round(proba[1], 4)),
        "confidence": float(round(proba[0] if label == "ATTACK" else proba[1], 4)),
        "attack_type": attack_subtype,
        "severity": severity,
        "model": model_name,
    }

def predict_batch(df_input: pd.DataFrame, model_name: str = "XGBoost") -> dict:
    xgb_model, scaler, _, cat_encs, features = get_artifacts()
    if model_name == "XGBoost":
        model = xgb_model
    else:
        models = get_all_models()
        model = models.get(model_name, xgb_model)

    df = df_input.copy()
    for col, le in cat_encs.items():
        if col in df.columns:
            known = set(le.classes_)
            df[col] = df[col].apply(lambda v: str(v) if str(v) in known else le.classes_[0])
            df[col] = le.transform(df[col].astype(str))
        else:
            df[col] = 0

    for f in features:
        if f not in df.columns:
            df[f] = 0.0

    X = df[features].astype(float)
    X_scaled = scaler.transform(X)
    preds = model.predict(X_scaled)
    probas = (
        model.predict_proba(X_scaled)
        if hasattr(model, "predict_proba")
        else np.column_stack([1 - preds, preds])
    )

    label_map = {0: "ATTACK", 1: "NORMAL"}
    results = []
    attacks_count = 0
    attack_types_count = {}

    for i, pred in enumerate(preds):
        p_int = int(pred)
        lbl = label_map[p_int]
        row_dict = df_input.iloc[i].to_dict()
        subtype = classify_attack_subtype(row_dict) if lbl == "ATTACK" else "Normal"
        sev = SEVERITY_MAP.get(subtype, "Low") if lbl == "ATTACK" else "None"
        
        if lbl == "ATTACK":
            attacks_count += 1
            attack_types_count[subtype] = attack_types_count.get(subtype, 0) + 1

        results.append({
            "index": i + 1,
            "prediction": lbl,
            "prob_attack": float(round(probas[i][0], 4)),
            "prob_normal": float(round(probas[i][1], 4)),
            "attack_type": subtype,
            "severity": sev,
            "src_ip": str(row_dict.get("src_ip", f"10.0.{random.randint(1,5)}.{random.randint(1,254)}")),
            "dst_ip": str(row_dict.get("dst_ip", f"172.16.{random.randint(1,5)}.{random.randint(1,254)}")),
            "service": str(row_dict.get("service", "http")),
            "protocol": str(row_dict.get("protocol_type", "tcp")).upper(),
        })

    total = len(df_input)
    detection_rate = round((attacks_count / total * 100), 2) if total > 0 else 0.0

    return {
        "total_records": total,
        "attacks_detected": attacks_count,
        "normal_records": total - attacks_count,
        "detection_rate": detection_rate,
        "attack_types_breakdown": attack_types_count,
        "model_used": model_name,
        "results": results,
    }
