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

#main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, anomalies  # ← add anomalies
from routers import upload, anomalies, forecast
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Bank Analyzer API", version="1.0.0")

import os

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(anomalies.router, prefix="/api", tags=["anomalies"])  # ← add this
app.include_router(forecast.router, prefix="/api", tags=["forecast"])

@app.get("/")
def root():
    return {"status": "Bank Analyzer API is running"}