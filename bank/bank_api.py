from fastapi import FastAPI
from bank_db import init_db, get_balance, get_loan_limit, get_transactions

app = FastAPI()
init_db()

@app.get("/balance")
def balance(username: str):
    bal = get_balance(username)
    return {"balance": bal}

@app.get("/loan")
def loan(username: str):
    limit = get_loan_limit(username)
    return {"eligibility": limit}

@app.get("/transactions")
def transactions(username: str):
    tx = get_transactions(username)
    return {"transactions": tx}
