from typing import Dict, Any
import threading

# In-memory storage for demo
SENSORS = {}
PREDICTIONS = {}
LOCK = threading.Lock()

def store_sensor_reading(sensor_id: str, data: Dict[str, Any]):
    with LOCK:
        SENSORS.setdefault(sensor_id, []).append(data)

def get_latest(sensor_id: str):
    with LOCK:
        arr = SENSORS.get(sensor_id, [])
        if not arr:
            return None
        return sorted(arr, key=lambda x: x["timestamp"])[-1]

def store_prediction(sensor_id: str, prediction: Dict[str, Any]):
    with LOCK:
        PREDICTIONS.setdefault(sensor_id, []).append(prediction)

def get_predictions(sensor_id: str):
    with LOCK:
        return PREDICTIONS.get(sensor_id, [])
