from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class SensorIngest(BaseModel):
    sensor_id: str
    timestamp: datetime
    temperature: float
    ph: float
    conductivity: float
    turbidity: Optional[float] = None
    location: Dict[str, float]  # {"lat": ..., "lon": ...}

class PredictionRequest(BaseModel):
    sensor_id: str
    recent_features: Dict[str, float]  # simplified

class PredictionResponse(BaseModel):
    contaminant: str
    point_estimate: float
    interval: Dict[str, float]
    risk_score: str
    timestamp: datetime
