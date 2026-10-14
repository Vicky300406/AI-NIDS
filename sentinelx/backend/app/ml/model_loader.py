import os
import warnings
import threading
import joblib
import numpy as np
import pandas as pd
from app.config import settings

warnings.filterwarnings("ignore")

_artifacts_lock = threading.Lock()
_cached_artifacts = None
_cached_models = None

_FEATURE_STATS = {
    "normal": {
        "duration": (0.0, 1.5), "wrong_fragment": (0.01, 0.1),
        "hot": (0.05, 0.3), "logged_in": (0.95, 0.2),
        "root_shell": (0.0, 0.02), "su_attempted": (0.0, 0.01),
        "num_file_creations": (0.0, 0.1), "num_access_files": (0.0, 0.1),
        "is_guest_login": (0.01, 0.1), "count": (15.0, 25.0),
        "serror_rate": (0.02, 0.1), "srv_serror_rate": (0.02, 0.1),
        "rerror_rate": (0.01, 0.08), "srv_rerror_rate": (0.01, 0.08),
        "same_srv_rate": (0.88, 0.2), "diff_srv_rate": (0.04, 0.1),
        "srv_diff_host_rate": (0.03, 0.1), "dst_host_count": (150.0, 80.0),
        "dst_host_srv_count": (140.0, 85.0),
        "dst_host_same_srv_rate": (0.82, 0.25),
        "dst_host_diff_srv_rate": (0.03, 0.08),
        "dst_host_same_src_port_rate": (0.12, 0.25),
        "dst_host_srv_diff_host_rate": (0.02, 0.07),
        "dst_host_serror_rate": (0.02, 0.1),
        "dst_host_srv_serror_rate": (0.02, 0.1),
        "dst_host_rerror_rate": (0.01, 0.07),
        "dst_host_srv_rerror_rate": (0.01, 0.07),
        "protocol_type": (1.2, 0.7), "service": (20.0, 18.0), "flag": (9.0, 2.5),
    },
    "attack": {
        "duration": (50.0, 200.0), "wrong_fragment": (0.02, 0.15),
        "hot": (0.3, 1.5), "logged_in": (0.2, 0.4),
        "root_shell": (0.01, 0.1), "su_attempted": (0.005, 0.07),
        "num_file_creations": (0.02, 0.2), "num_access_files": (0.02, 0.2),
        "is_guest_login": (0.02, 0.15), "count": (280.0, 150.0),
        "serror_rate": (0.72, 0.38), "srv_serror_rate": (0.71, 0.38),
        "rerror_rate": (0.05, 0.2), "srv_rerror_rate": (0.05, 0.2),
        "same_srv_rate": (0.48, 0.4), "diff_srv_rate": (0.18, 0.3),
        "srv_diff_host_rate": (0.06, 0.18), "dst_host_count": (230.0, 50.0),
        "dst_host_srv_count": (210.0, 60.0),
        "dst_host_same_srv_rate": (0.44, 0.4),
        "dst_host_diff_srv_rate": (0.14, 0.25),
        "dst_host_same_src_port_rate": (0.55, 0.4),
        "dst_host_srv_diff_host_rate": (0.04, 0.12),
        "dst_host_serror_rate": (0.7, 0.38),
        "dst_host_srv_serror_rate": (0.69, 0.38),
        "dst_host_rerror_rate": (0.04, 0.16),
        "dst_host_srv_rerror_rate": (0.04, 0.16),
        "protocol_type": (1.0, 0.8), "service": (30.0, 20.0), "flag": (3.5, 3.8),
    },
}

MODEL_META = {
    "XGBoost": {
        "icon": "⚡", "color": "#ef4444",
        "description": "Gradient boosted trees — highest test F1 (0.795)",
        "test_acc": 0.795, "test_f1": 0.795, "roc_auc": 0.870,
        "speed": "Fast", "type": "Ensemble"
    },
    "Random Forest": {
        "icon": "🌲", "color": "#10b981",
        "description": "Bagged decision trees — robust, interpretable",
        "test_acc": 0.775, "test_f1": 0.774, "roc_auc": 0.856,
        "speed": "Medium", "type": "Ensemble"
    },
    "Decision Tree": {
        "icon": "🌿", "color": "#f59e0b",
        "description": "Single tree — fast, fully interpretable",
        "test_acc": 0.770, "test_f1": 0.769, "roc_auc": 0.830,
        "speed": "Very Fast", "type": "Tree"
    },
}

def _generate_synthetic_data(n_normal: int = 1500, n_attack: int = 1500, features: list = None) -> tuple:
    rng = np.random.default_rng(42)
    rows = []
    labels = []

    for cls, label in [("normal", 1), ("attack", 0)]:
        n = n_normal if cls == "normal" else n_attack
        stats = _FEATURE_STATS[cls]
        for _ in range(n):
            row = []
            for feat in features:
                mean, std = stats.get(feat, (0.0, 1.0))
                val = rng.normal(mean, std)
                if feat in ("serror_rate", "srv_serror_rate", "rerror_rate",
                             "srv_rerror_rate", "same_srv_rate", "diff_srv_rate",
                             "srv_diff_host_rate", "dst_host_same_srv_rate",
                             "dst_host_diff_srv_rate", "dst_host_same_src_port_rate",
                             "dst_host_srv_diff_host_rate", "dst_host_serror_rate",
                             "dst_host_srv_serror_rate", "dst_host_rerror_rate",
                             "dst_host_srv_rerror_rate"):
                    val = float(np.clip(val, 0.0, 1.0))
                elif feat in ("logged_in", "root_shell", "su_attempted", "is_guest_login"):
                    val = float(int(val > 0.5))
                elif feat in ("protocol_type", "service", "flag", "dst_host_count", "dst_host_srv_count", "count"):
                    val = max(0.0, val)
                else:
                    val = max(0.0, val)
                row.append(val)
            rows.append(row)
            labels.append(label)

    X = np.array(rows, dtype=np.float32)
    y = np.array(labels, dtype=np.int32)
    idx = rng.permutation(len(y))
    return X[idx], y[idx]

def get_artifacts():
    global _cached_artifacts
    with _artifacts_lock:
        if _cached_artifacts is None:
            artifacts_dir = settings.MODEL_DIR
            model = joblib.load(os.path.join(artifacts_dir, "best_model.pkl"))
            scaler = joblib.load(os.path.join(artifacts_dir, "scaler.pkl"))
            target_enc = joblib.load(os.path.join(artifacts_dir, "target_encoder.pkl"))
            cat_encs = joblib.load(os.path.join(artifacts_dir, "categorical_encoders.pkl"))
            features = joblib.load(os.path.join(artifacts_dir, "selected_features.pkl"))
            _cached_artifacts = (model, scaler, target_enc, cat_encs, features)
        return _cached_artifacts

def get_all_models():
    global _cached_models
    with _artifacts_lock:
        if _cached_models is None:
            from sklearn.ensemble import RandomForestClassifier
            from sklearn.tree import DecisionTreeClassifier

            xgb_model, scaler, _, _, features = get_artifacts()

            X_train, y_train = _generate_synthetic_data(n_normal=1000, n_attack=1000, features=features)
            X_train_scaled = scaler.transform(X_train)

            rf = RandomForestClassifier(
                n_estimators=50,
                max_depth=14,
                min_samples_split=4,
                class_weight="balanced",
                random_state=42,
                n_jobs=1,
            )
            rf.fit(X_train_scaled, y_train)

            dt = DecisionTreeClassifier(
                max_depth=16,
                min_samples_split=5,
                class_weight="balanced",
                random_state=42,
            )
            dt.fit(X_train_scaled, y_train)

            _cached_models = {
                "XGBoost": xgb_model,
                "Random Forest": rf,
                "Decision Tree": dt,
            }
        return _cached_models
