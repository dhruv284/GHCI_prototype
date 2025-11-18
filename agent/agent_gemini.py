from openai import OpenAI
import requests


BASE_URL = "http://localhost:8001"


client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=""
)

MODEL_NAME = "google/gemini-2.0-flash-exp:free"


def llm(query):
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": query}]
    )
    return response.choices[0].message.content


def detect_intent(query):
    prompt = f"""
    You are a banking assistant. Identify the user intent.
    Possible intents:
    - balance
    - loan
    - transactions
    - other
    User query: {query}
    Return only the intent word.
    """

    return llm(prompt).lower().strip()


def bank_action(intent, username="spandan"):

    if intent == "balance":
        r = requests.get(f"{BASE_URL}/balance?username={username}")
        return f"Your balance is {r.json()['balance']} rupees."

    if intent == "loan":
        r = requests.get(f"{BASE_URL}/loan?username={username}")
        return f"You qualify for a loan of {r.json()['eligibility']} rupees."

    if intent == "transactions":
        r = requests.get(f"{BASE_URL}/transactions?username={username}")
        tx = ", ".join(r.json()["transactions"])
        return f"Your last transactions: {tx}"

    return None


def agent_reply(query):
    intent = detect_intent(query)

    if intent in ["balance", "loan", "transactions"]:
        return bank_action(intent)

    return llm(query)
