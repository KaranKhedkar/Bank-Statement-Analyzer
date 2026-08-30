from fastapi import APIRouter, HTTPException, Header
from supabase import create_client, ClientOptions
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv

from fastapi.concurrency import run_in_threadpool
from agent.copilot_engine import run_copilot_turn
from agent.tools import (
    simulate_what_if,
    get_spending_summary,
    get_anomalies_analysis,
    get_recurring_subscriptions
)
from models.forecast_model import predict_all_categories

load_dotenv()

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_user_supabase(authorization: str):
    """Creates a secure, request-scoped client for RLS."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
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
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Pydantic Schemas
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

class WhatIfRequest(BaseModel):
    adjustments: Dict[str, float]
    monthly_investment: Optional[float] = 0.0
    expected_annual_return_pct: Optional[float] = 8.0
    projection_months: Optional[int] = 6

class NaturalWhatIfRequest(BaseModel):
    query: str

class ExplainAnomalyRequest(BaseModel):
    anomaly_id: str

@router.post("/copilot/chat")
async def chat_with_copilot(
    payload: ChatRequest,
    authorization: str = Header(None)
):
    user_supabase, user_id = get_user_supabase(authorization)

    # 1. Fetch user's transactions
    tx_res = user_supabase.table("transactions")\
        .select("id, date, description, raw_description, amount, type, category")\
        .eq("user_id", user_id)\
        .order("date", desc=True)\
        .execute()
    
    transactions = tx_res.data or []

    # 2. Fetch anomalies
    anom_res = user_supabase.table("anomalies")\
        .select("*, transactions(date, description, amount, category)")\
        .eq("user_id", user_id)\
        .execute()
    
    anomalies = anom_res.data or []

    user_data = {
        "user_id": user_id,
        "transactions": transactions,
        "anomalies": anomalies,
        "forecast_data": {}
    }

    # 3. Run copilot agentic turn in threadpool
    result = await run_in_threadpool(
        run_copilot_turn, 
        user_message=payload.message, 
        conversation_history=payload.history, 
        user_data=user_data
    )
    return result

@router.post("/copilot/what-if")
async def run_what_if_scenario(
    payload: WhatIfRequest,
    authorization: str = Header(None)
):
    user_supabase, user_id = get_user_supabase(authorization)

    tx_res = user_supabase.table("transactions")\
        .select("date, amount, type, category")\
        .eq("user_id", user_id)\
        .execute()
    
    transactions = tx_res.data or []
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found to simulate.")

    sim_result = simulate_what_if(
        transactions=transactions,
        forecast_data={},
        adjustments=payload.adjustments,
        monthly_investment=payload.monthly_investment or 0.0,
        expected_annual_return_pct=payload.expected_annual_return_pct or 8.0,
        projection_months=payload.projection_months or 6
    )

    return sim_result

@router.post("/copilot/what-if/natural")
async def run_natural_what_if_scenario(
    payload: NaturalWhatIfRequest,
    authorization: str = Header(None)
):
    import json
    from agent.copilot_engine import get_groq_client, MODEL_NAME

    user_supabase, user_id = get_user_supabase(authorization)

    client = get_groq_client()
    if not client:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured on the server.")

    # 1. Parse the natural language query using Groq
    system_prompt = """
    You are a financial NLP parser. Extract simulation parameters from the user's natural language query.
    Return a STRICT JSON object matching this schema exactly:
    {
        "adjustments": { "Category Name": -0.20 },  // Percentage cut as a negative decimal. MUST match real categories like "Food & Dining", "Shopping", "Entertainment", "Transport", "Bills", "Other".
        "monthly_investment": 5000, // Absolute currency amount to invest monthly (integer/float)
        "expected_annual_return_pct": 12.0, // Expected return percentage (default 8.0 if not specified)
        "projection_months": 12 // Projection timeframe (default 12 if not specified)
    }
    Only output valid JSON. No markdown, no conversational text.
    """

    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": payload.query}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        parsed_args = json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Error parsing what-if NLP: {e}")
        raise HTTPException(status_code=400, detail="Could not parse simulation parameters from query.")

    tx_res = user_supabase.table("transactions")\
        .select("date, amount, type, category")\
        .eq("user_id", user_id)\
        .execute()
    
    transactions = tx_res.data or []
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found to simulate.")

    debit_txs = [t for t in transactions if t.get("type") == "debit"]
    forecast_data = {}
    if debit_txs:
        try:
            forecast_data = predict_all_categories(debit_txs)
        except Exception as e:
            print(f"Forecast error in what-if: {e}")

    sim_result = simulate_what_if(
        transactions=transactions,
        forecast_data=forecast_data,
        adjustments=parsed_args.get("adjustments", {}),
        monthly_investment=float(parsed_args.get("monthly_investment", 0.0)),
        expected_annual_return_pct=float(parsed_args.get("expected_annual_return_pct", 8.0)),
        projection_months=int(parsed_args.get("projection_months", 12))
    )

    # Attach the parsed parameters to the result so the frontend knows what was interpreted
    sim_result["interpreted_query"] = parsed_args
    return sim_result

@router.get("/copilot/proactive-insights")
async def get_proactive_insights(authorization: str = Header(None)):
    user_supabase, user_id = get_user_supabase(authorization)

    tx_res = user_supabase.table("transactions")\
        .select("id, date, description, amount, type, category")\
        .eq("user_id", user_id)\
        .order("date", desc=True)\
        .execute()
    
    transactions = tx_res.data or []
    if not transactions:
        return {"insights": []}

    anom_res = user_supabase.table("anomalies")\
        .select("*, transactions(date, description, amount, category)")\
        .eq("user_id", user_id)\
        .eq("status", "pending")\
        .execute()
    
    anomalies = anom_res.data or []
    subs = get_recurring_subscriptions(transactions)
    spending_summary = get_spending_summary(transactions, timeframe="30d")

    insights = []

    # 1. Anomaly alerts
    if anomalies:
        highest_anom = max(anomalies, key=lambda x: x.get("anomaly_score", 0))
        tx_info = highest_anom.get("transactions") or {}
        insights.append({
            "id": "anomaly_alert",
            "type": "warning",
            "title": "Unusual Transaction Flagged",
            "description": f"A ₹{tx_info.get('amount', 0):,.0f} charge at '{tx_info.get('description', 'Unknown')}' was flagged by the ML model.",
            "action_text": "Audit Anomaly",
            "action_path": "/dashboard/anomalies"
        })

    # 2. Subscription summary
    if subs.get("total_detected", 0) > 0:
        insights.append({
            "id": "subscriptions_detected",
            "type": "info",
            "title": f"{subs['total_detected']} Recurring Subscriptions Detected",
            "description": f"You spend ~₹{subs['total_recurring_monthly']:,.0f}/month across recurring services.",
            "action_text": "Ask Copilot to optimize",
            "prompt": "What recurring subscriptions do I have and how can I reduce them?"
        })

    # 3. Top category spend check
    cat_breakdown = spending_summary.get("category_breakdown", {})
    if cat_breakdown:
        top_cat = list(cat_breakdown.items())[0]
        insights.append({
            "id": "top_spend_driver",
            "type": "trend",
            "title": f"Top Expense: {top_cat[0]}",
            "description": f"{top_cat[0]} accounts for {top_cat[1]['percentage']}% of your recent expenses (₹{top_cat[1]['total']:,.0f}).",
            "action_text": "Simulate Budget Cut",
            "prompt": f"What if I reduce {top_cat[0]} expenses by 20%?"
        })

    return {"insights": insights}

@router.post("/copilot/explain-anomaly")
async def explain_anomaly_detail(
    payload: ExplainAnomalyRequest,
    authorization: str = Header(None)
):
    user_supabase, user_id = get_user_supabase(authorization)

    anom_res = user_supabase.table("anomalies")\
        .select("*, transactions(*)")\
        .eq("id", payload.anomaly_id)\
        .eq("user_id", user_id)\
        .execute()

    if not anom_res.data:
        raise HTTPException(status_code=404, detail="Anomaly not found.")

    anomaly = anom_res.data[0]
    tx = anomaly.get("transactions") or {}

    # Fetch context transactions for the same category
    all_tx_res = user_supabase.table("transactions")\
        .select("amount, date, category")\
        .eq("user_id", user_id)\
        .eq("type", "debit")\
        .execute()
    
    debits = all_tx_res.data or []
    cat_debits = [d for d in debits if d.get("category") == tx.get("category")]

    avg_all = sum([float(d.get("amount", 0)) for d in debits]) / len(debits) if debits else 0
    avg_cat = sum([float(d.get("amount", 0)) for d in cat_debits]) / len(cat_debits) if cat_debits else avg_all
    tx_amt = float(tx.get("amount", 0))

    multiplier = round(tx_amt / avg_cat, 1) if avg_cat > 0 else 1.0

    prompt = f"""
Explain in clear, professional, and friendly language why this bank transaction was flagged as an anomaly by the unsupervised Isolation Forest model:
- Transaction Date: {tx.get('date')}
- Merchant/Description: {tx.get('description')} ({tx.get('raw_description')})
- Category: {tx.get('category')}
- Amount: ₹{tx_amt:,.2f}
- User's Average Spend in {tx.get('category')}: ₹{avg_cat:,.2f} ({multiplier}x normal)
- Overall Average Transaction: ₹{avg_all:,.2f}
- Anomaly Score: {anomaly.get('anomaly_score')}

Provide:
1. Root-cause diagnosis (why the ML model identified it)
2. Risk assessment (is this likely legitimate or fraudulent/erroneous?)
3. Recommended action for the user (confirm or dismiss)
Keep it within 3-4 bullet points.
"""
    try:
        from agent.copilot_engine import get_groq_client, MODEL_NAME
        client = get_groq_client()
        if client:
            completion = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            explanation = completion.choices[0].message.content.strip()
        else:
            explanation = f"This transaction of ₹{tx_amt:,.2f} was flagged because it is {multiplier}x higher than your average {tx.get('category')} expense of ₹{avg_cat:,.2f}."
    except Exception as e:
        print(f"Error generating anomaly explanation: {e}")
        explanation = f"This transaction of ₹{tx_amt:,.2f} was flagged because it is {multiplier}x higher than your average {tx.get('category')} expense of ₹{avg_cat:,.2f}."

    return {
        "anomaly_id": payload.anomaly_id,
        "transaction": tx,
        "explanation": explanation,
        "metrics": {
            "amount": tx_amt,
            "category_avg": round(avg_cat, 2),
            "multiplier": multiplier,
            "score": anomaly.get("anomaly_score")
        }
    }
