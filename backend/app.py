# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from config.database import db
import numpy as np
import tempfile
import os
from voice_embedder import get_embedding, cosine_match

app = Flask(__name__)
CORS(app)

users_collection = db["users"]

# ---------------- Upload PIN audio ----------------
@app.route("/upload_pin", methods=["POST"])
def upload_pin():
    if "pin_audio" not in request.files:
        return jsonify({"error": "No audio file found"}), 400

    audio_file = request.files["pin_audio"]
    temp_path = tempfile.mktemp(suffix=".wav")
    audio_file.save(temp_path)

    try:
        emb = get_embedding(temp_path).tolist()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(temp_path)

    return jsonify({"message": "PIN processed successfully", "embedding": emb})

# ---------------- Signup ----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    required = ("name", "email", "password", "embedding")
    if not all(k in data for k in required):
        return jsonify({"error": "Missing fields"}), 400

    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already exists"}), 400

    new_user = {
        "name": data["name"],
        "email": data["email"],
        "password": data["password"],
        "embedding": data["embedding"]
    }
    users_collection.insert_one(new_user)
    return jsonify({"message": "Signup successful!"})

# ---------------- Login ----------------
@app.route("/login", methods=["POST"])
def login():
    if "pin_audio" not in request.files:
        return jsonify({"error": "Audio file missing"}), 400

    email = request.form.get("email")
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    audio_file = request.files["pin_audio"]
    temp_path = tempfile.mktemp(suffix=".wav")
    audio_file.save(temp_path)

    try:
        new_emb = get_embedding(temp_path)
        saved_emb = np.array(user["embedding"], dtype=np.float32)
        score, status = cosine_match(saved_emb, new_emb)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(temp_path)

    return jsonify({"score": score, "status": status})

# ---------------- Home ----------------
@app.route("/")
def home():
    return jsonify({"message": "VoiceAuth Backend Running"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
