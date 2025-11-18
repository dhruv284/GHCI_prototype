import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import librosa
import noisereduce as nr
import torch
from transformers import AutoModelForAudioXVector

device = "cpu"

# Load model globally once
model = AutoModelForAudioXVector.from_pretrained(
    "microsoft/wavlm-base-plus-sv"
).to(device)


# ------------------------------------------------------------
# PREPROCESS AUDIO
# ------------------------------------------------------------
def preprocess(path):
    y, sr = librosa.load(path, sr=16000)
    y = nr.reduce_noise(y=y, sr=sr)
    y, _ = librosa.effects.trim(y, top_db=25)
    y = librosa.util.normalize(y)
    return y


# ------------------------------------------------------------
# GET EMBEDDING
# ------------------------------------------------------------
def get_embedding(path):
    y = preprocess(path)
    audio = torch.tensor(y).float().unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(audio)
        emb = outputs.embeddings.cpu().numpy().squeeze()

    emb = emb / np.linalg.norm(emb)
    return emb.astype(np.float32)


# ------------------------------------------------------------
# COSINE MATCH
# ------------------------------------------------------------
def cosine_match(saved, new, threshold=0.75):
    """Returns similarity score + authentication status"""

    score = float(cosine_similarity([saved], [new])[0][0])

    if score >= threshold:
        return score, "Authenticated"
    elif score >= 0.55:
        return score, "Ask for PIN"
    else:
        return score, "Failed"