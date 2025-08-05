import numpy as np

class InductiveConformal:
    def __init__(self, residuals: np.ndarray, alpha=0.1):
        """
        residuals: array of absolute errors on calibration set
        alpha: 1 - confidence (e.g., 0.1 for 90% intervals)
        """
        self.alpha = alpha
        # add small slack per standard approach
        n = len(residuals)
        k = int(np.ceil((n + 1) * (1 - alpha))) - 1
        self.quantile = np.sort(residuals)[min(k, n - 1)]

    def interval(self, point_pred: float):
        lower = point_pred - self.quantile
        upper = point_pred + self.quantile
        return lower, upper
