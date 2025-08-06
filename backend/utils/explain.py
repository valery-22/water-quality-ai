import torch
from torchvision import models, transforms
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import cv2
import os

def generate_gradcam(image, model):
    target_layer = model.layer4[-1]
    image_tensor = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        ),
    ])(image).unsqueeze(0)

    gradients = []
    activations = []

    def save_gradient(module, grad_in, grad_out):
        gradients.append(grad_out[0])

    def save_activation(module, input, output):
        activations.append(output)

    target_layer.register_forward_hook(save_activation)
    target_layer.register_backward_hook(save_gradient)

    output = model(image_tensor)
    class_idx = torch.argmax(output, dim=1).item()
    model.zero_grad()
    output[0, class_idx].backward()

    grad = gradients[0]
    act = activations[0]

    weights = grad.mean(dim=[2, 3], keepdim=True)
    cam = (weights * act).sum(dim=1).squeeze()

    cam = cam.detach().numpy()
    cam = np.maximum(cam, 0)
    cam = cv2.resize(cam, (224, 224))
    cam = cam - np.min(cam)
    cam = cam / np.max(cam)

    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    image_np = np.array(image.resize((224, 224)))
    superimposed_img = heatmap * 0.4 + image_np
    output_path = "static/gradcam.jpg"
    os.makedirs("static", exist_ok=True)
    cv2.imwrite(output_path, superimposed_img)

    return output_path
