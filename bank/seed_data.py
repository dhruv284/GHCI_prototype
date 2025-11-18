import sqlite3

con = sqlite3.connect("bank.db")
cur = con.cursor()

cur.execute("INSERT OR REPLACE INTO users VALUES ('spandan', 25400, 200000)")
cur.execute("INSERT INTO transactions (username, description) VALUES ('spandan', 'Paid electricity bill')")
cur.execute("INSERT INTO transactions (username, description) VALUES ('spandan', 'Received salary')")
cur.execute("INSERT INTO transactions (username, description) VALUES ('spandan', 'Bought groceries')")

con.commit()
con.close()

print("Database seeded!")
