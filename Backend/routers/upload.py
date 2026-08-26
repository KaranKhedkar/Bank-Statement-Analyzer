# # routers/upload.py
# from fastapi import APIRouter, UploadFile, File, HTTPException
# from supabase import create_client
# from parsers.pdf_parser import parse_pdf
# from parsers.csv_parser import parse_csv
# from categorizer.rules import categorize_transactions
# from categorizer.ai_categorizer import ai_categorize_batch
# import os, io
# from dotenv import load_dotenv

# load_dotenv()  # ← add this here too

# router = APIRouter()

# # ← Move this AFTER load_dotenv()
# supabase = create_client(
#     os.getenv("SUPABASE_URL"),
#     os.getenv("SUPABASE_KEY")
# )

# @router.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     if not file.filename.endswith(('.pdf', '.csv')):
#         raise HTTPException(status_code=400, detail="Only PDF or CSV files allowed")
    
#     supabase.table("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
#     supabase.table("uploads").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
#     contents = await file.read()
    
#     if file.filename.endswith('.pdf'):
#         transactions, bank_name = parse_pdf(contents)
#     else:
#         transactions, bank_name = parse_csv(contents, file.filename)
#     if not transactions:
#         raise HTTPException(status_code=422, detail="No transactions found in file")

#     transactions = categorize_transactions(transactions)   # Layer 1: Rules
#     transactions = ai_categorize_batch(transactions)        # Layer 2: AI

#     upload_record = supabase.table("uploads").insert({
#         "file_name": file.filename,
#         "bank_detected": bank_name,
#         "total_transactions": len(transactions)
#     }).execute()

#     upload_id = upload_record.data[0]["id"]

#     rows = [{**t, "upload_id": upload_id} for t in transactions]
#     supabase.table("transactions").insert(rows).execute()

#     return {
#         "upload_id": upload_id,
#         "bank_detected": bank_name,
#         "total_transactions": len(transactions),
#         "transactions": transactions[:5]
#     }


# @router.get("/transactions/{upload_id}")
# async def get_transactions(upload_id: str):
#     result = supabase.table("transactions")\
#         .select("*")\
#         .eq("upload_id", upload_id)\
#         .order("date", desc=False)\
#         .execute()
#     return {"transactions": result.data}




#claude code

# from fastapi import APIRouter, UploadFile, File, HTTPException, Header
# from supabase import create_client
# from parsers.pdf_parser import parse_pdf
# from parsers.csv_parser import parse_csv
# from categorizer.rules import categorize_transactions
# from categorizer.ai_categorizer import ai_categorize_batch
# import os
# from dotenv import load_dotenv



# load_dotenv()

# router = APIRouter()

# supabase = create_client(
#     os.getenv("SUPABASE_URL"),
#     os.getenv("SUPABASE_KEY")
# )

# JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

# # def get_user_id(authorization: str) -> str:
# #     if not authorization or not authorization.startswith("Bearer "):
# #         raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
# #     token = authorization.split(" ")[1]
# #     try:
# #         payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"], options={"verify_aud": False})
# #         return payload["sub"]  # sub = user_id in Supabase JWTs
# #     except jwt.ExpiredSignatureError:
# #         raise HTTPException(status_code=401, detail="Token expired")
# #     except Exception:
# #         raise HTTPException(status_code=401, detail="Invalid token")

# def get_user_id(authorization: str) -> str:
#     print(f"🔑 Auth Header received: {authorization[:30]}...") 
    
#     if not authorization or not authorization.startswith("Bearer "):
#         raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
#     token = authorization.split(" ")[1]
    
#     try:
#         # Let the official Supabase client handle the cryptography and validation
#         user_response = supabase.auth.get_user(token)
#         print(f"✅ Supabase officially verified user: {user_response.user.id}")
#         return user_response.user.id
        
#     except Exception as e:
#         print(f"❌ Supabase Auth Error: {type(e).__name__} - {str(e)}")
#         raise HTTPException(status_code=401, detail="Invalid or expired token")


# @router.post("/upload")
# async def upload_file(
#     file: UploadFile = File(...),
#     authorization: str = Header(None)
# ):
#     user_id = get_user_id(authorization)

#     if not file.filename.endswith(('.pdf', '.csv')):
#         raise HTTPException(status_code=400, detail="Only PDF or CSV files allowed")

#     # Delete only THIS user's existing data
#     supabase.table("transactions").delete()\
#         .eq("user_id", user_id)\
#         .execute()
#     supabase.table("uploads").delete()\
#         .eq("user_id", user_id)\
#         .execute()

#     contents = await file.read()

#     if file.filename.endswith('.pdf'):
#         transactions, bank_name = parse_pdf(contents)
#     else:
#         transactions, bank_name = parse_csv(contents, file.filename)

#     if not transactions:
#         raise HTTPException(status_code=422, detail="No transactions found in file")

#     transactions = categorize_transactions(transactions)
#     transactions = ai_categorize_batch(transactions)  # uncomment when ready

#     upload_record = supabase.table("uploads").insert({
#         "file_name": file.filename,
#         "bank_detected": bank_name,
#         "total_transactions": len(transactions),
#         "user_id": user_id
#     }).execute()

#     upload_id = upload_record.data[0]["id"]

#     rows = [{**t, "upload_id": upload_id, "user_id": user_id} for t in transactions]
#     supabase.table("transactions").insert(rows).execute()

#     return {
#         "upload_id": upload_id,
#         "bank_detected": bank_name,
#         "total_transactions": len(transactions),
#         "transactions": transactions[:5]
#     }


# @router.get("/transactions/{upload_id}")
# async def get_transactions(
#     upload_id: str,
#     authorization: str = Header(None)
# ):
#     user_id = get_user_id(authorization)

#     result = supabase.table("transactions")\
#         .select("*")\
#         .eq("upload_id", upload_id)\
#         .eq("user_id", user_id)\
#         .order("date", desc=False)\
#         .execute()

#     return {"transactions": result.data}









#new code by gemini
from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from fastapi.concurrency import run_in_threadpool
from supabase import create_client, ClientOptions
from parsers.pdf_parser import parse_pdf
from parsers.csv_parser import parse_csv
from categorizer.rules import categorize_transactions
from categorizer.ai_categorizer import ai_categorize_batch
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Define credentials globally, but do NOT create the global client here
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_user_supabase(authorization: str):
    """
    Creates a temporary, request-scoped Supabase client that injects 
    the user's JWT so Row Level Security (RLS) policies pass successfully.
    """
    print(f"[AUTH] Auth Header received: {authorization[:30] if authorization else 'None'}...") 
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    
    # 1. Create a specific Supabase client just for this user's request
    user_supabase = create_client(
        SUPABASE_URL,
        SUPABASE_KEY,
        options=ClientOptions(headers={"Authorization": f"Bearer {token}"})
    )
    
    try:
        user_response = user_supabase.auth.get_user(token)
        user_id = user_response.user.id
        print(f"[AUTH] User authenticated: {user_id}")
        return user_supabase, user_id
    except Exception as e:
        print(f"[AUTH ERROR] Supabase Auth Error: {type(e).__name__} - {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    authorization: str = Header(None)
):
    # Retrieve the secure client and user ID
    user_supabase, user_id = get_user_supabase(authorization)

    # --- DEDUPLICATION CHECK ---
    print(f"[UPLOAD] Checking if {file.filename} was already uploaded...")
    existing_upload = user_supabase.table("uploads")\
        .select("id")\
        .eq("user_id", user_id)\
        .eq("file_name", file.filename)\
        .execute()

    if existing_upload.data:
        print("[UPLOAD WARNING] Duplicate file detected. Rejecting upload.")
        raise HTTPException(
            status_code=409, 
            detail="You have already uploaded a statement with this exact file name."
        )

    if not file.filename.endswith(('.pdf', '.csv')):
        raise HTTPException(status_code=400, detail="Only PDF or CSV files allowed")

    print(f"[UPLOAD 1/5] Reading {file.filename}...")
    contents = await file.read()

    if file.filename.endswith('.pdf'):
        # Offload heavy parsing to threadpool to prevent ASGI event loop freezing
        transactions, bank_name = await run_in_threadpool(parse_pdf, contents)
    else:
        transactions, bank_name = parse_csv(contents, file.filename)

    if not transactions:
        raise HTTPException(status_code=422, detail="No transactions found in file")

    print("[UPLOAD 2/5] Categorizing transactions (Rules + AI)...")
    transactions = categorize_transactions(transactions)
    transactions = ai_categorize_batch(transactions)

    print("[UPLOAD 3/5] Inserting new upload record...")
    upload_record = user_supabase.table("uploads").insert({
        "file_name": file.filename,
        "bank_detected": bank_name,
        "total_transactions": len(transactions),
        "user_id": user_id
    }).execute()

    upload_id = upload_record.data[0]["id"]

    print("[UPLOAD 4/5] Inserting transaction rows...")
    rows = [{**t, "upload_id": upload_id, "user_id": user_id} for t in transactions]
    user_supabase.table("transactions").insert(rows).execute()

    print("[UPLOAD 5/5] Upload complete!")
    return {
        "upload_id": upload_id,
        "bank_detected": bank_name,
        "total_transactions": len(transactions),
        "transactions": transactions[:5]
    }


@router.get("/transactions/{upload_id}")
async def get_transactions(
    upload_id: str,
    authorization: str = Header(None)
):
    # Ensure GET requests also bypass RLS using the secure client
    user_supabase, user_id = get_user_supabase(authorization)

    result = user_supabase.table("transactions")\
        .select("*")\
        .eq("upload_id", upload_id)\
        .eq("user_id", user_id)\
        .order("date", desc=False)\
        .execute()

    return {"transactions": result.data}
