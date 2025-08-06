from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import io

from model import WaterQualityCNN
from utils import preprocess_image

app = FastAPI()

# Allow CORS for your frontend (adjust origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once on startup
model = WaterQualityCNN()
# For demo: load pretrained weights or dummy weights here
model.eval()

CLASS_NAMES = ["Safe", "Contaminated"]

@app.post("/api/analyze")
async def analyze_image(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        input_tensor = preprocess_image(img)

        with torch.no_grad():
            outputs = model(input_tensor)
            probs = torch.softmax(outputs, dim=1)
            conf, pred_idx = torch.max(probs, dim=1)

        pred_label = CLASS_NAMES[pred_idx.item()]
        confidence = conf.item()

        # Generate a simple human-readable summary
        summary = (
            f"The AI model predicts the water quality as '{pred_label}' "
            f"with confidence {confidence:.2%}.\n"
        )
        if pred_label == "Contaminated":
            summary += (
                "Warning: The water sample shows signs of contamination. "
                "Consider further testing and notifying relevant agencies."
            )
        else:
            summary += "The water sample appears to be safe based on the AI analysis."

        return {"summary": summary}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to analyze image: {str(e)}")
