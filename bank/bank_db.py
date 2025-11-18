import sqlite3

DB = "bank.db"

def init_db():
    con = sqlite3.connect(DB)
    cur = con.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        balance INTEGER,
        loan_limit INTEGER
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        description TEXT
    )
    """)

    con.commit()
    con.close()

def get_balance(username):
    con = sqlite3.connect(DB)
    cur = con.cursor()
    cur.execute("SELECT balance FROM users WHERE username = ?", (username,))
    row = cur.fetchone()
    con.close()
    return row[0] if row else None

def get_loan_limit(username):
    con = sqlite3.connect(DB)
    cur = con.cursor()
    cur.execute("SELECT loan_limit FROM users WHERE username = ?", (username,))
    row = cur.fetchone()
    con.close()
    return row[0] if row else None

def get_transactions(username):
    con = sqlite3.connect(DB)
    cur = con.cursor()
    cur.execute("SELECT description FROM transactions WHERE username = ?", (username,))
    rows = cur.fetchall()
    con.close()
    return [r[0] for r in rows]
