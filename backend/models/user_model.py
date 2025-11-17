# This file only defines your User schema structure

def user_schema(name, email, password, embedding):
    return {
        "name": name,
        "email": email,
        "password": password,
        "embedding": embedding  # vector (list of floats)
    }

