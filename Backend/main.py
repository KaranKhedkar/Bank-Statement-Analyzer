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



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, anomalies  # ← add anomalies
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Bank Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(anomalies.router, prefix="/api", tags=["anomalies"])  # ← add this

@app.get("/")
def root():
    return {"status": "Bank Analyzer API is running"}