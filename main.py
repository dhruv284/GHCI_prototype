from fastapi import FastAPI
from agent_gemini import agent_reply

app = FastAPI()

@app.post("/agent")
async def process(data: dict):
    user_query = data["query"]
    reply = agent_reply(user_query)
    return {"reply": reply}
