# voice_embedder.py
import torch
import librosa
import numpy as np
import noisereduce as nr
from transformers import WavFeatureExtractor, Wav2Vec2Model
from sklearn.metrics.pairwise import cosine_similarity

device = "cuda" if torch.cuda.is_available() else "cpu"

# Correct: use feature extractor for WavLM
feature_extractor = WavFeatureExtractor.from_pretrained("microsoft/wavlm-base-plus-sv")
model = Wav2Vec2Model.from_pretrained("microsoft/wavlm-base-plus-sv").to(device)
model.eval()

def preprocess(path):
    y, sr = librosa.load(path, sr=16000)
    y = nr.reduce_noise(y=y, sr=sr)
    y, _ = librosa.effects.trim(y, top_db=30)
    y = librosa.util.normalize(y)
    return y

def get_embedding(path):
    y = preprocess(path)
    inputs = feature_extractor(y, sampling_rate=16000, return_tensors="pt", padding=True)
    input_values = inputs.input_values.to(device)
    
    with torch.no_grad():
        outputs = model(input_values)
        emb = outputs.last_hidden_state.mean(dim=1).squeeze().cpu().numpy()
        emb = emb / np.linalg.norm(emb)
    return emb.astype(np.float32)

def cosine_match(saved_emb, new_emb, thresholds=(0.75, 0.55)):
    saved = np.array(saved_emb).reshape(1, -1)
    new = np.array(new_emb).reshape(1, -1)
    score = float(cosine_similarity(saved, new)[0][0])
    high, low = thresholds
    if score >= high:
        return score, "Authenticated"
    elif score >= low:
        return score, "Ask for PIN"
    else:
        return score, "Failed"
