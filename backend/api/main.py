from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
from torchvision import models, transforms
import io

from utils.explain import generate_gradcam
from utils.model import load_model, predict_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("models/water_quality_resnet50.pth")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    prediction, prob = predict_image(image, model)
    gradcam_path = generate_gradcam(image, model)

    return {
        "prediction": prediction,
        "confidence": float(prob),
        "gradcam_path": gradcam_path
    }
