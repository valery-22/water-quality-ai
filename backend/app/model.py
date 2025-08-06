import torch
import torch.nn as nn
import torch.nn.functional as F

class WaterQualityCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 16, 3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.fc1 = nn.Linear(32 * 64 * 64, 128)
        self.fc2 = nn.Linear(128, 2)  # 2 classes: safe, contaminated

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.max_pool2d(x, 2)  # 128x128 -> 64x64
        x = F.relu(self.conv2(x))
        x = F.max_pool2d(x, 2)  # 64x64 -> 32x32
        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return x
