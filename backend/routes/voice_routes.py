from flask import Blueprint, request, jsonify
import numpy as np
import tempfile
import os

from voice_embedder import get_embedding, cosine_match
from config.database import db

users_collection = db["users"]

voice_routes = Blueprint("voice_routes", __name__)

# --------------------------------------------------------
# UPLOAD PIN AUDIO FOR SIGNUP
# --------------------------------------------------------
@voice_routes.route("/upload_pin", methods=["POST"])
def upload_pin():
    if "pin_audio" not in request.files:
        return jsonify({"error": "No audio file found"}), 400

    audio_file = request.files["pin_audio"]

    temp_path = tempfile.mktemp(suffix=".wav")
    audio_file.save(temp_path)

    emb = get_embedding(temp_path).tolist()

    os.remove(temp_path)

    return jsonify({
        "message": "PIN processed successfully",
        "embedding": emb
    })


# --------------------------------------------------------
# LOGIN WITH VOICE MATCH
# --------------------------------------------------------
@voice_routes.route("/login", methods=["POST"])
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

    new_emb = get_embedding(temp_path)
    saved_emb = np.array(user["embedding"], dtype=np.float32)

    score, status = cosine_match(saved_emb, new_emb)

    os.remove(temp_path)

    return jsonify({
        "score": score,
        "status": status
    })
