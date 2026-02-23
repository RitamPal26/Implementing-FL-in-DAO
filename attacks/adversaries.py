import torch
import torch.nn as nn
from ml.fdao_bridge import InvestmentPredictor

def get_poisoned_update():
    """Generates a high-magnitude noise update to simulate model poisoning."""
    malicious_model = InvestmentPredictor()
    poisoned_weights = {k: torch.randn(v.shape) * 50 for k, v in malicious_model.state_dict().items()}
    return poisoned_weights

def get_low_quality_update():
    """Generates a weak update that simulates a lazy or low-data participant."""
    lazy_model = InvestmentPredictor()
    return lazy_model.state_dict()