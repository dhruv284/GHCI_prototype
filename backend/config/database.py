from pymongo import MongoClient
import certifi

MONGO_URI = "mongodb+srv://kataricoder_db_user:katari@cluster0.bfn51lm.mongodb.net/?retryWrites=true&w=majority"

try:
    client = MongoClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where()   # Fix SSL handshake
    )

    db = client["mydatabase"]

    client.admin.command("ping")

    # FIXED: Correct PyMongo update query
    db.users.update_many({}, {"$unset": {"voiceEmbedding": ""}})

    print("🚀 MongoDB Connected Successfully!")

except Exception as e:
    print("❌ MongoDB Connection Failed:", e)
