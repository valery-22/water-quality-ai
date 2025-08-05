from fastapi import File, UploadFile
from .image_model import load_image_model, preprocess_image, predict_image_quality
import os

# Lazy load
image_model = None
CLASS_NAMES = ["clear", "turbid", "algae_bloom"]  # adjust to your training labels

@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    global image_model
    if image_model is None:
        if not os.path.exists("image_classifier"):
            return {"error": "Image model not trained/deployed yet"}
        image_model = load_image_model()
    content = await file.read()
    img_arr = preprocess_image(content)
    label, confidence, all_probs = predict_image_quality(image_model, img_arr, CLASS_NAMES)
    return {
        "label": label,
        "confidence": confidence,
        "probabilities": dict(zip(CLASS_NAMES, all_probs)),
        "timestamp": datetime.utcnow().isoformat()
    }
