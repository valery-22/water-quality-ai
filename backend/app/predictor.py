import joblib
import numpy as np
from typing import Tuple
from .conformal import InductiveConformal

MODEL_PATH = "model.joblib"
CALIB_PATH = "calib.joblib"

def load_model():
    model = joblib.load(MODEL_PATH)
    return model

def load_conformal():
    return joblib.load(CALIB_PATH)

def predict_with_interval(features: np.ndarray) -> Tuple[float, float, float]:
    model = load_model()
    conformal: InductiveConformal = load_conformal()
    point = model.predict(features.reshape(1, -1))[0]
    lower, upper = conformal.interval(point)
    return point, lower, upper

def risk_score(point: float, lower: float, upper: float, threshold=5.0) -> str:
    # Simple rule: if point exceeds threshold or upper bound exceeds threshold
    if point >= threshold or upper >= threshold:
        return "high"
    if point >= threshold * 0.7:
        return "medium"
    return "low"
