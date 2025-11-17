from flask import Blueprint, request, jsonify
from config.database import db

users_collection = db["users"]

user_routes = Blueprint("user_routes", __name__)

@user_routes.route("/signup", methods=["POST"])
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
        "embedding": data["embedding"],
    }

    users_collection.insert_one(new_user)

    return jsonify({"message": "Signup successful"})
