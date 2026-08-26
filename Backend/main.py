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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
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