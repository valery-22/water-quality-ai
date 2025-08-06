import torch
from torchvision import models, transforms
from torch import nn
import torch.nn.functional as F

def load_model(model_path: str):
    model = models.resnet50(pretrained=False)
    model.fc = nn.Linear(model.fc.in_features, 2)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

def predict_image(image, model):
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        ),
    ])
    input_tensor = preprocess(image).unsqueeze(0)
    outputs = model(input_tensor)
    probs = F.softmax(outputs, dim=1)
    class_idx = torch.argmax(probs, dim=1).item()
    confidence = probs[0][class_idx].item()
    label = "contaminated" if class_idx == 1 else "safe"
    return label, confidence
