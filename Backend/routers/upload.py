# routers/upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from supabase import create_client
from parsers.pdf_parser import parse_pdf
from parsers.csv_parser import parse_csv
from categorizer.rules import categorize_transactions
from categorizer.ai_categorizer import ai_categorize_batch
import os, io
from dotenv import load_dotenv

load_dotenv()  # ← add this here too

router = APIRouter()

# ← Move this AFTER load_dotenv()
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pdf', '.csv')):
        raise HTTPException(status_code=400, detail="Only PDF or CSV files allowed")
    
    supabase.table("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    supabase.table("uploads").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    contents = await file.read()
    
    if file.filename.endswith('.pdf'):
        transactions, bank_name = parse_pdf(contents)
    else:
        transactions, bank_name = parse_csv(contents, file.filename)
    if not transactions:
        raise HTTPException(status_code=422, detail="No transactions found in file")

    transactions = categorize_transactions(transactions)   # Layer 1: Rules
    transactions = ai_categorize_batch(transactions)        # Layer 2: AI

    upload_record = supabase.table("uploads").insert({
        "file_name": file.filename,
        "bank_detected": bank_name,
        "total_transactions": len(transactions)
    }).execute()

    upload_id = upload_record.data[0]["id"]

    rows = [{**t, "upload_id": upload_id} for t in transactions]
    supabase.table("transactions").insert(rows).execute()

    return {
        "upload_id": upload_id,
        "bank_detected": bank_name,
        "total_transactions": len(transactions),
        "transactions": transactions[:5]
    }


@router.get("/transactions/{upload_id}")
async def get_transactions(upload_id: str):
    result = supabase.table("transactions")\
        .select("*")\
        .eq("upload_id", upload_id)\
        .order("date", desc=False)\
        .execute()
    return {"transactions": result.data}