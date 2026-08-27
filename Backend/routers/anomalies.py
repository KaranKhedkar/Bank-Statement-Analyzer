# from fastapi import APIRouter, HTTPException, Header
# from supabase import create_client
# import os
# import pandas as pd
# import numpy as np
# from sklearn.ensemble import IsolationForest
# from sklearn.preprocessing import LabelEncoder
# from dotenv import load_dotenv

# load_dotenv()

# router = APIRouter()

# supabase = create_client(
#     os.getenv("SUPABASE_URL"),
#     os.getenv("SUPABASE_KEY")
# )

# def get_user_id(authorization: str) -> str:
#     if not authorization or not authorization.startswith("Bearer "):
#         raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
#     token = authorization.split(" ")[1]
#     try:
#         user_response = supabase.auth.get_user(token)
#         return user_response.user.id
#     except Exception:
#         raise HTTPException(status_code=401, detail="Invalid token")


# def run_isolation_forest(transactions: list) -> list:
#     if len(transactions) < 10:
#         return []

#     df = pd.DataFrame(transactions)

#     # Feature engineering
#     df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
#     df["day_of_week"] = pd.to_datetime(df["date"], errors="coerce").dt.dayofweek
#     df["day_of_week"] = df["day_of_week"].fillna(0).astype(int)

#     # Encode category as numeric
#     le = LabelEncoder()
#     df["category_encoded"] = le.fit_transform(
#         df["category"].fillna("Uncategorized").astype(str)
#     )

#     # Only use debit transactions for anomaly detection
#     debit_df = df[df["type"] == "debit"].copy()

#     if len(debit_df) < 10:
#         return []

#     features = debit_df[["amount", "day_of_week", "category_encoded"]].values

#     # Train Isolation Forest
#     # contamination = expected % of anomalies (5% is a good starting point)
#     clf = IsolationForest(
#         n_estimators=100,
#         contamination=0.05,
#         random_state=42
#     )
#     clf.fit(features)

#     # Get scores — more negative = more anomalous
#     raw_scores = clf.decision_function(features)
#     predictions = clf.predict(features)  # -1 = anomaly, 1 = normal

#     # Normalize scores to 0–1 range (higher = more anomalous)
#     min_score = raw_scores.min()
#     max_score = raw_scores.max()
#     score_range = max_score - min_score if max_score != min_score else 1
#     normalized = 1 - ((raw_scores - min_score) / score_range)

#     anomalies = []
#     for i, (idx, row) in enumerate(debit_df.iterrows()):
#         if predictions[i] == -1:  # flagged as anomaly
#             score = float(normalized[i])
#             amount = float(row["amount"])

#             # Generate human-readable reason
#             mean_amount = float(debit_df["amount"].mean())
#             std_amount = float(debit_df["amount"].std())

#             if amount > mean_amount + 2 * std_amount:
#                 reason = f"Amount ₹{amount:,.0f} is unusually large (mean: ₹{mean_amount:,.0f})"
#                 reason_type = "large_amount"
#             elif row.get("category") in [None, "Uncategorized", ""]:
#                 reason = "Merchant could not be categorized"
#                 reason_type = "uncategorized"
#             else:
#                 reason = f"Unusual pattern for {row.get('category', 'this category')}"
#                 reason_type = "pattern"

#             anomalies.append({
#                 "transaction_id": str(row["id"]),
#                 "anomaly_score": round(score, 4),
#                 "reason": reason,
#                 "reason_type": reason_type,
#                 "status": "pending"
#             })

#     return anomalies


# @router.post("/anomalies/detect")
# async def detect_anomalies(authorization: str = Header(None)):
#     user_id = get_user_id(authorization)

#     # Fetch this user's transactions
#     result = supabase.table("transactions") \
#         .select("id, date, amount, type, category") \
#         .eq("user_id", user_id) \
#         .execute()

#     transactions = result.data
#     if not transactions:
#         raise HTTPException(status_code=404, detail="No transactions found")

#     # Run model
#     anomalies = run_isolation_forest(transactions)

#     if not anomalies:
#         return {"detected": 0, "message": "No anomalies detected"}

#     # Wipe old anomalies for this user before inserting new ones
#     supabase.table("anomalies") \
#         .delete() \
#         .eq("user_id", user_id) \
#         .execute()

#     # Get upload_id from first transaction
#     first_tx = supabase.table("transactions") \
#         .select("upload_id") \
#         .eq("user_id", user_id) \
#         .limit(1) \
#         .execute()
#     upload_id = first_tx.data[0]["upload_id"] if first_tx.data else None

#     # Insert with user_id and upload_id
#     rows = [
#         {**a, "user_id": user_id, "upload_id": upload_id}
#         for a in anomalies
#     ]
#     supabase.table("anomalies").insert(rows).execute()

#     return {
#         "detected": len(anomalies),
#         "anomalies": anomalies
#     }


# @router.get("/anomalies")
# async def get_anomalies(authorization: str = Header(None)):
#     user_id = get_user_id(authorization)

#     result = supabase.table("anomalies") \
#         .select("*, transactions(date, description, amount, category, raw_description)") \
#         .eq("user_id", user_id) \
#         .order("anomaly_score", desc=True) \
#         .execute()

#     return {"anomalies": result.data}


# @router.patch("/anomalies/{anomaly_id}")
# async def update_anomaly_status(
#     anomaly_id: str,
#     body: dict,
#     authorization: str = Header(None)
# ):
#     user_id = get_user_id(authorization)

#     status = body.get("status")
#     if status not in ["pending", "confirmed", "dismissed"]:
#         raise HTTPException(status_code=400, detail="Invalid status value")

#     result = supabase.table("anomalies") \
#         .update({"status": status}) \
#         .eq("id", anomaly_id) \
#         .eq("user_id", user_id) \
#         .execute()

#     return {"updated": result.data}

















# from fastapi import APIRouter, HTTPException, Header
# from supabase import create_client, ClientOptions
# import os
# import pandas as pd
# import numpy as np
# from sklearn.ensemble import IsolationForest
# from sklearn.preprocessing import LabelEncoder
# from dotenv import load_dotenv

# load_dotenv()

# router = APIRouter()

# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# def get_user_supabase(authorization: str):
#     """Creates a secure, request-scoped client to pass RLS."""
#     if not authorization or not authorization.startswith("Bearer "):
#         raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
#     token = authorization.split(" ")[1]
    
#     user_supabase = create_client(
#         SUPABASE_URL,
#         SUPABASE_KEY,
#         options=ClientOptions(headers={"Authorization": f"Bearer {token}"})
#     )
    
#     try:
#         user_response = user_supabase.auth.get_user(token)
#         return user_supabase, user_response.user.id
#     except Exception:
#         raise HTTPException(status_code=401, detail="Invalid or expired token")

# def run_isolation_forest(transactions: list) -> list:
#     if len(transactions) < 5:  # Lowered limit slightly for testing
#         return []

#     df = pd.DataFrame(transactions)
#     df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
#     df["day_of_week"] = pd.to_datetime(df["date"], errors="coerce").dt.dayofweek.fillna(0).astype(int)

#     le = LabelEncoder()
#     df["category_encoded"] = le.fit_transform(df["category"].fillna("Uncategorized").astype(str))

#     # Focus on debits (spending anomalies)
#     debit_df = df[df["type"] == "debit"].copy()
#     if len(debit_df) < 5:
#         return []

#     features = debit_df[["amount", "day_of_week", "category_encoded"]].values
    
#     # Train Model
#     clf = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
#     clf.fit(features)

#     raw_scores = clf.decision_function(features)
#     predictions = clf.predict(features) # -1 is anomaly

#     # Normalize scores (0 to 1, higher is weirder)
#     min_s, max_s = raw_scores.min(), raw_scores.max()
#     score_range = max_s - min_s if max_s != min_s else 1
#     normalized = 1 - ((raw_scores - min_s) / score_range)

#     anomalies = []
#     mean_amount = float(debit_df["amount"].mean())
#     std_amount = float(debit_df["amount"].std())

#     for i, (idx, row) in enumerate(debit_df.iterrows()):
#         if predictions[i] == -1:
#             score = float(normalized[i])
#             amount = float(row["amount"])

#             if amount > mean_amount + 2 * std_amount:
#                 reason, r_type = f"Amount ₹{amount:,.0f} is unusually large", "large_amount"
#             elif row.get("category") in ["Uncategorized", None, ""]:
#                 reason, r_type = "Merchant could not be categorized", "uncategorized"
#             else:
#                 reason, r_type = f"Unusual pattern for {row.get('category')}", "pattern"

#             anomalies.append({
#                 "transaction_id": str(row["id"]),
#                 "anomaly_score": round(score, 4),
#                 "reason": reason,
#                 "reason_type": r_type,
#                 "status": "pending"
#             })
#     return anomalies

# @router.post("/anomalies/detect")
# async def detect_anomalies(authorization: str = Header(None)):
#     user_supabase, user_id = get_user_supabase(authorization)

#     # 1. Fetch Transactions
#     res = user_supabase.table("transactions").select("id, date, amount, type, category, upload_id").eq("user_id", user_id).execute()
#     if not res.data:
#         raise HTTPException(status_code=404, detail="No transactions found")

#     # 2. Run Isolation Forest
#     anomalies = run_isolation_forest(res.data)
    
#     # 3. Clear old anomalies
#     user_supabase.table("anomalies").delete().eq("user_id", user_id).execute()

#     if not anomalies:
#         return {"detected": 0, "message": "No anomalies found"}

#     # 4. Insert new anomalies
#     upload_id = res.data[0]["upload_id"]
#     rows = [{**a, "user_id": user_id, "upload_id": upload_id} for a in anomalies]
#     user_supabase.table("anomalies").insert(rows).execute()

#     return {"detected": len(anomalies), "anomalies": anomalies}

# @router.get("/anomalies")
# async def get_anomalies(authorization: str = Header(None)):
#     user_supabase, user_id = get_user_supabase(authorization)
#     # Using foreign key join to get transaction details
#     res = user_supabase.table("anomalies").select("*, transactions(date, description, amount, category)").eq("user_id", user_id).order("anomaly_score", desc=True).execute()
#     return {"anomalies": res.data}



















from fastapi import APIRouter, HTTPException, Header
from supabase import create_client, ClientOptions
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_user_supabase(authorization: str):
    """Creates a secure, request-scoped client to pass RLS."""
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

def run_isolation_forest(transactions: list) -> list:
    if len(transactions) < 5: 
        return []

    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
    df["date_dt"] = pd.to_datetime(df["date"], errors="coerce")
    df["day_of_week"] = df["date_dt"].dt.dayofweek.fillna(0).astype(int)

    le = LabelEncoder()
    df["category_encoded"] = le.fit_transform(df["category"].fillna("Uncategorized").astype(str))

    debit_df = df[df["type"] == "debit"].copy()
    if len(debit_df) < 5:
        return []

    features = debit_df[["amount", "day_of_week", "category_encoded"]].values
    
    # Ensure at least 1 anomaly is flagged if there are debits
    contamination = max(0.05, 1.0 / len(debit_df))
    
    clf = IsolationForest(n_estimators=100, contamination=contamination, random_state=42)
    clf.fit(features)

    raw_scores = clf.decision_function(features)
    predictions = clf.predict(features) 

    min_s, max_s = raw_scores.min(), raw_scores.max()
    score_range = max_s - min_s if max_s != min_s else 1
    normalized = 1 - ((raw_scores - min_s) / score_range)

    anomalies = []
    mean_amount = float(debit_df["amount"].mean())
    std_amount = float(debit_df["amount"].std())

    for i, (idx, row) in enumerate(debit_df.iterrows()):
        if predictions[i] == -1:
            score = float(normalized[i])
            amount = float(row["amount"])

            if amount > mean_amount + 2 * std_amount:
                reason, r_type = f"Amount ₹{amount:,.0f} is unusually large", "large_amount"
            elif row.get("category") in ["Uncategorized", None, ""]:
                reason, r_type = "Merchant could not be categorized", "uncategorized"
            else:
                reason, r_type = f"Unusual pattern for {row.get('category')}", "pattern"

            anomalies.append({
                "transaction_id": str(row["id"]),
                "anomaly_score": round(score, 4),
                "reason": reason,
                "reason_type": r_type,
                "status": "pending"
            })
    return anomalies

@router.post("/anomalies/detect")
async def detect_anomalies(authorization: str = Header(None)):
    user_supabase, user_id = get_user_supabase(authorization)

    res = user_supabase.table("transactions").select("id, date, amount, type, category, upload_id").eq("user_id", user_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="No transactions found")

    anomalies_list = run_isolation_forest(res.data)
    
    user_supabase.table("anomalies").delete().eq("user_id", user_id).execute()

    if not anomalies_list:
        return {"detected": 0, "message": "No anomalies found"}

    upload_id = res.data[0]["upload_id"]
    rows = [{**a, "user_id": user_id, "upload_id": upload_id} for a in anomalies_list]
    user_supabase.table("anomalies").insert(rows).execute()

    return {"detected": len(anomalies_list), "anomalies": anomalies_list}

@router.get("/anomalies")
async def get_anomalies(authorization: str = Header(None)):
    user_supabase, user_id = get_user_supabase(authorization)
    res = user_supabase.table("anomalies").select("*, transactions(date, description, amount, category)").eq("user_id", user_id).order("anomaly_score", desc=True).execute()
    return {"anomalies": res.data}

# --- ADD THIS MISSING PATCH ROUTE ---
@router.patch("/anomalies/{anomaly_id}")
async def update_anomaly(
    anomaly_id: str, 
    body: dict, 
    authorization: str = Header(None)
):
    user_supabase, user_id = get_user_supabase(authorization)
    
    status = body.get("status")
    if status not in ["pending", "confirmed", "dismissed"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    res = user_supabase.table("anomalies") \
        .update({"status": status}) \
        .eq("id", anomaly_id) \
        .eq("user_id", user_id) \
        .execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Anomaly not found or unauthorized")

    return {"status": "success", "data": res.data[0]}