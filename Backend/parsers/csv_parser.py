import pandas as pd
import re
import io
from datetime import datetime

DATE_FORMATS = [
    "%d/%m/%Y", "%d-%m-%Y", "%d/%m/%y", "%d-%m-%y",
    "%Y-%m-%d", "%d %b %Y", "%d %B %Y", "%d-%b-%Y",
    "%d/%b/%Y", "%d %b %y", "%d-%b-%y",
]

BANK_KEYWORDS = {
    "HDFC Bank": ["hdfc"],
    "SBI": ["sbi", "state bank"],
    "ICICI Bank": ["icici"],
    "Axis Bank": ["axis"],
    "Kotak Bank": ["kotak"],
    "Paytm": ["paytm"],
    "PhonePe": ["phonepe"],
    "GPay": ["gpay", "google pay"],
}

def detect_bank_from_csv(df, filename=""):
    filename_lower = filename.lower()
    for bank, keywords in BANK_KEYWORDS.items():
        for kw in keywords:
            if kw in filename_lower:
                return bank
    # Check column names
    cols = ' '.join(df.columns.tolist()).lower()
    for bank, keywords in BANK_KEYWORDS.items():
        for kw in keywords:
            if kw in cols:
                return bank
    return "Unknown Bank"

def parse_date(date_str):
    date_str = str(date_str).strip()
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None

def clean_amount(val):
    if pd.isna(val):
        return None
    cleaned = re.sub(r'[₹$,\s]', '', str(val)).strip()
    cleaned = re.sub(r'(Dr|CR|dr|cr)$', '', cleaned).strip()
    try:
        return float(cleaned)
    except ValueError:
        return None

def normalize_columns(df):
    """Auto-map messy column names to standard names."""
    col_map = {}
    for col in df.columns:
        col_lower = col.strip().lower()
        if any(x in col_lower for x in ['date', 'txn date', 'transaction date', 'value date']):
            col_map[col] = 'date'
        elif any(x in col_lower for x in ['description', 'narration', 'particulars', 'details', 'remarks', 'transaction remarks']):
            col_map[col] = 'description'
        elif any(x in col_lower for x in ['debit', 'dr', 'withdrawal', 'debit amount']):
            col_map[col] = 'debit'
        elif any(x in col_lower for x in ['credit', 'cr', 'deposit', 'credit amount']):
            col_map[col] = 'credit'
        elif col_lower in ['amount', 'transaction amount', 'net amount']:
            col_map[col] = 'amount'
    return df.rename(columns=col_map)

def parse_csv(contents, filename=""):
    transactions = []

    try:
        # Try different encodings
        for encoding in ['utf-8', 'latin-1', 'cp1252']:
            try:
                df = pd.read_csv(io.BytesIO(contents), encoding=encoding, skipinitialspace=True)
                break
            except Exception:
                continue

        # Drop fully empty rows/columns
        df = df.dropna(how='all').reset_index(drop=True)
        df.columns = df.columns.str.strip()

        bank_name = detect_bank_from_csv(df, filename)
        df = normalize_columns(df)

        if 'date' not in df.columns or 'description' not in df.columns:
            print("❌ Could not find Date or Description columns")
            return [], bank_name

        for _, row in df.iterrows():
            try:
                parsed_date = parse_date(row['date'])
                if not parsed_date:
                    continue

                description = str(row.get('description', '')).strip()
                if not description or description.lower() in ['nan', 'none', '']:
                    continue

                amount = None
                txn_type = 'debit'

                if 'debit' in df.columns and 'credit' in df.columns:
                    debit_val = clean_amount(row.get('debit'))
                    credit_val = clean_amount(row.get('credit'))
                    if debit_val and debit_val > 0:
                        amount = debit_val
                        txn_type = 'debit'
                    elif credit_val and credit_val > 0:
                        amount = credit_val
                        txn_type = 'credit'
                elif 'amount' in df.columns:
                    amount = clean_amount(row.get('amount'))
                    row_text = ' '.join(str(v) for v in row.values)
                    txn_type = 'debit' if amount and amount < 0 else 'credit'
                    if amount:
                        amount = abs(amount)

                if not amount or amount <= 0:
                    continue

                transactions.append({
                    "date": parsed_date,
                    "description": description,
                    "raw_description": description,
                    "amount": round(amount, 2),
                    "type": txn_type,
                    "bank_name": bank_name,
                    "category": "Uncategorized"
                })

            except Exception:
                continue

    except Exception as e:
        print(f"CSV parsing error: {e}")
        return [], "Unknown Bank"

    print(f"✅ Parsed {len(transactions)} transactions from CSV — Bank: {bank_name}")
    return transactions, bank_name