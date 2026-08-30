# # backend/main.py
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routers import upload
# from dotenv import load_dotenv


# load_dotenv()


# app = FastAPI(title="Bank Analyzer API", version="1.0.0")

# # CORS — allows your React frontend to talk to this API
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # Vite default port
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(upload.router, prefix="/api", tags=["upload"])

# @app.get("/")
# def root():
#     return {"status": "Bank Analyzer API is running"}

import sys

# Ensure UTF-8 stdout/stderr on Windows to prevent UnicodeEncodeError with charmap
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, anomalies, forecast, copilot
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Bank Analyzer API", version="1.0.0")

import os

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://finsight-bank-ai.vercel.app",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.extend([url.strip().rstrip("/") for url in frontend_url.split(",") if url.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|http://localhost:.*|http://127\.0\.0\.1:.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(anomalies.router, prefix="/api", tags=["anomalies"])
app.include_router(forecast.router, prefix="/api", tags=["forecast"])
app.include_router(copilot.router, prefix="/api", tags=["copilot"])

@app.get("/")
def root():
    return {"status": "Bank Analyzer API is running"}