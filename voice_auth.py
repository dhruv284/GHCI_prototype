import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import librosa
import noisereduce as nr
import torch
from transformers import AutoModelForAudioXVector

device = "cpu"
model = AutoModelForAudioXVector.from_pretrained("microsoft/wavlm-base-plus-sv").to(device)

def preprocess(path):
    y, sr = librosa.load(path, sr=16000)
    y = nr.reduce_noise(y=y, sr=sr)
    y, _ = librosa.effects.trim(y, top_db=25)
    y = librosa.util.normalize(y)
    return y

def get_embedding(path):
    y = preprocess(path)
    audio = torch.tensor(y).float().unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(audio)
        emb = outputs.embeddings.cpu().numpy().squeeze()

    emb = emb / np.linalg.norm(emb)
    return emb.astype(np.float32)

def register_user(username, audio):
    emb = get_embedding(audio)
    np.save(f"{username}_wavlm.npy", emb)
    print("registered")

def authenticate_user(username, audio):
    saved = np.load(f"{username}_wavlm.npy")
    new = get_embedding(audio)
    score = float(cosine_similarity([saved], [new])[0][0])
    print("score:", score)

    if score >= 0.75:
        print("Authenticated")
    elif score >= 0.55:
        print("Ask for PIN")
    else:
        print("Failed")

if __name__ == "__main__":
    register_user("spandan", "record_2025-11-15T16-16_46.wav")
    authenticate_user("spandan", "record_2025-11-15T17-09_30.wav")
