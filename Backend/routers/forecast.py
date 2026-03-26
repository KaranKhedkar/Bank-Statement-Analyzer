from fastapi import APIRouter, HTTPException, Header
from supabase import create_client, ClientOptions
import os
# Import your master function from the file you just saved
from models.forecast_model import predict_all_categories 

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_user_supabase(authorization: str):
    """Secure client for RLS."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing header")
    token = authorization.split(" ")[1]
    user_supabase = create_client(
        SUPABASE_URL,
        SUPABASE_KEY,
        options=ClientOptions(headers={"Authorization": f"Bearer {token}"})
    )
    try:
        user_response = user_supabase.auth.get_user(token)
        return user_supabase, user_response.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/forecast")
async def generate_forecast(authorization: str = Header(None)):
    user_supabase, user_id = get_user_supabase(authorization)

    # 1. Fetch only DEBIT transactions for the user
    res = user_supabase.table("transactions") \
        .select("date, amount, type, category") \
        .eq("user_id", user_id) \
        .eq("type", "debit") \
        .execute()

    if not res.data:
        return {"forecast": {}}

    # 2. Pass the data to your Prophet/Weighted Avg model
    try:
        forecast_results = predict_all_categories(res.data)
        return {"forecast": forecast_results}
    except Exception as e:
        print(f"Model Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate forecast")