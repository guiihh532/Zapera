# backend/app/main.py
from fastapi import FastAPI

app = FastAPI(title="Zapera Backend")

@app.get("/health")
def health():
    return {"status": "ok"}
