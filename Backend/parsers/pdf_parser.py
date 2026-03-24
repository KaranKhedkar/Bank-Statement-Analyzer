import pdfplumber
import re
import io
from datetime import datetime

BANK_PATTERNS = {
    "HDFC Bank": ["HDFC", "HDFC BANK", "hdfcbank.com"],
    "SBI": ["STATE BANK OF INDIA", "SBI", "onlinesbi.com"],
    "ICICI Bank": ["ICICI", "ICICI BANK", "icicibank.com"],
    "Axis Bank": ["AXIS BANK", "axisbank.com"],
    "Kotak Bank": ["KOTAK", "KOTAK MAHINDRA", "kotak.com"],
    "IDFC Bank": ["IDFC", "IDFC FIRST", "idfcfirstbank.com"],
    "Yes Bank": ["YES BANK", "yesbank.in"],
    "IndusInd Bank": ["INDUSIND", "indusind.com"],
    "Bank of Baroda": ["BANK OF BARODA", "BOB", "bankofbaroda.in"],
    "Punjab National Bank": ["PUNJAB NATIONAL", "PNB", "pnbindia.in"],
    "Canara Bank": ["CANARA BANK", "canarabank.com"],
}

DATE_FORMATS = [
    "%d/%m/%Y", "%d-%m-%Y", "%d/%m/%y", "%d-%m-%y",
    "%Y-%m-%d", "%d %b %Y", "%d %B %Y", "%d-%b-%Y",
    "%d/%b/%Y", "%d %b %y", "%d-%b-%y",
]

def detect_bank(text):
    text_upper = text.upper()
    for bank_name, keywords in BANK_PATTERNS.items():
        for keyword in keywords:
            if keyword.upper() in text_upper:
                return bank_name
    return "Unknown Bank"

def parse_date(date_str):
    date_str = date_str.strip()
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None

def clean_amount(amount_str):
    if not amount_str:
        return None
    cleaned = re.sub(r'[₹$,\s]', '', str(amount_str)).strip()
    cleaned = re.sub(r'(Dr|CR|dr|cr)$', '', cleaned).strip()
    try:
        return float(cleaned)
    except ValueError:
        return None

def detect_transaction_type(row_text, amount_str):
    row_upper = str(row_text).upper()
    amount_str = str(amount_str).upper()
    if any(x in row_upper or x in amount_str for x in ['DR', 'DEBIT', 'DR.']):
        return 'debit'
    if any(x in row_upper or x in amount_str for x in ['CR', 'CREDIT', 'CR.']):
        return 'credit'
    return 'debit'

def extract_transactions_from_table(table, bank_name):
    transactions = []
    if not table or len(table) < 2:
        return transactions

    # --- Find real header row ---
    header_row_idx = 0
    for i, row in enumerate(table[:5]):  # check first 5 rows
        row_text = ' '.join(str(cell).lower() for cell in row if cell)
        if 'date' in row_text and any(x in row_text for x in ['debit', 'credit', 'narration', 'details', 'particulars']):
            header_row_idx = i
            break

    header = [str(cell).strip().lower() if cell else '' for cell in table[header_row_idx]]
    print(f"✅ Real header row {header_row_idx}: {header}")

    # --- Map column indices ---
    balance_idx = next((i for i, h in enumerate(header)
                        if any(x in h for x in ['balance', 'closing', 'running'])), None)

    date_idx = next((i for i, h in enumerate(header)
                     if any(x in h for x in ['date', 'value date', 'post date'])), None)

    desc_idx = next((i for i, h in enumerate(header)
                     if any(x in h for x in ['description', 'narration', 'particulars',
                                              'details', 'remarks'])), None)

    debit_idx = next((i for i, h in enumerate(header)
                      if any(x in h for x in ['debit', 'dr', 'withdrawal', 'withdrawl'])
                      and i != balance_idx), None)

    credit_idx = next((i for i, h in enumerate(header)
                       if any(x in h for x in ['credit', 'cr', 'deposit'])
                       and i != balance_idx), None)

    amount_idx = next((i for i, h in enumerate(header)
                       if h in ['amount', 'transaction amount']
                       and i != balance_idx), None)

    # --- SBI fallback: hardcode known positions if headers not detected ---
    # SBI format: Value Date | Post Date | Details | Ref No | ₹ Debit | ₹ Credit | Balance
    if date_idx is None and desc_idx is None:
        print("⚠️ Headers not detected — using SBI default column positions")
        date_idx = 0
        desc_idx = 2
        debit_idx = 4
        credit_idx = 5
        balance_idx = 6

    print(f"📊 Columns → date:{date_idx} desc:{desc_idx} debit:{debit_idx} credit:{credit_idx} balance:{balance_idx}")

    # --- Process data rows ---
    for row in table[header_row_idx + 1:]:
        try:
            if not row or all(cell is None or str(cell).strip() == '' for cell in row):
                continue

            # Skip summary/header rows
            row_text = ' '.join(str(c) for c in row if c).lower()
            if any(x in row_text for x in ['total', 'opening balance', 'closing balance',
                                             'brought forward', 'carried forward',
                                             'statement summary']):
                continue

            date_raw = str(row[date_idx]).strip() if date_idx < len(row) and row[date_idx] else ''
            parsed_date = parse_date(date_raw)
            if not parsed_date:
                continue

            description = str(row[desc_idx]).strip() if desc_idx < len(row) and row[desc_idx] else ''
            if not description or description.lower() in ['', 'none', 'nan']:
                continue

            amount = None
            txn_type = 'debit'

            if debit_idx is not None and credit_idx is not None:
                debit_val = clean_amount(row[debit_idx]) if debit_idx < len(row) else None
                credit_val = clean_amount(row[credit_idx]) if credit_idx < len(row) else None

                if not debit_val and not credit_val:
                    continue

                if debit_val and debit_val > 0:
                    amount = debit_val
                    txn_type = 'debit'
                elif credit_val and credit_val > 0:
                    amount = credit_val
                    txn_type = 'credit'

            elif amount_idx is not None:
                amount_raw = str(row[amount_idx]) if amount_idx < len(row) else ''
                amount = clean_amount(amount_raw)
                txn_type = detect_transaction_type(' '.join(str(c) for c in row), amount_raw)

            if amount is None or amount <= 0:
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

        except Exception as e:
            print(f"Row error: {e}")
            continue

    return transactions


def parse_pdf(contents):
    transactions = []
    bank_name = "Unknown Bank"

    try:
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            full_text = ""

            for page in pdf.pages:
                page_text = page.extract_text() or ""
                full_text += page_text

                if bank_name == "Unknown Bank":
                    bank_name = detect_bank(full_text)

                tables = page.extract_tables()
                for table in tables:
                    page_transactions = extract_transactions_from_table(table, bank_name)
                    transactions.extend(page_transactions)

            if not transactions and full_text:
                transactions = parse_text_based(full_text, bank_name)

    except Exception as e:
        print(f"PDF parsing error: {e}")
        return [], "Unknown Bank"

    print(f"✅ Parsed {len(transactions)} transactions from PDF — Bank: {bank_name}")
    return transactions, bank_name


def parse_text_based(text, bank_name):
    transactions = []
    lines = text.split('\n')

    pattern = re.compile(
        r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+\w{3}\s+\d{2,4})'
        r'\s+(.+?)\s+'
        r'([\d,]+\.?\d*)\s*$'
    )

    for line in lines:
        match = pattern.search(line)
        if match:
            date_str, description, amount_str = match.groups()
            parsed_date = parse_date(date_str)
            amount = clean_amount(amount_str)

            if parsed_date and amount and amount > 0:
                txn_type = detect_transaction_type(line, amount_str)
                transactions.append({
                    "date": parsed_date,
                    "description": description.strip(),
                    "raw_description": description.strip(),
                    "amount": round(amount, 2),
                    "type": txn_type,
                    "bank_name": bank_name,
                    "category": "Uncategorized"
                })

    return transactions






# import pdfplumber
# import re
# import io
# from datetime import datetime

# BANK_PATTERNS = {
#     "HDFC Bank": ["HDFC", "HDFC BANK", "hdfcbank.com"],
#     "SBI": ["STATE BANK OF INDIA", "SBI", "onlinesbi.com"],
#     "ICICI Bank": ["ICICI", "ICICI BANK", "icicibank.com"],
#     "Axis Bank": ["AXIS BANK", "axisbank.com"],
#     "Kotak Bank": ["KOTAK", "KOTAK MAHINDRA", "kotak.com"],
#     "IDFC Bank": ["IDFC", "IDFC FIRST", "idfcfirstbank.com"],
#     "Yes Bank": ["YES BANK", "yesbank.in"],
#     "IndusInd Bank": ["INDUSIND", "indusind.com"],
#     "Bank of Baroda": ["BANK OF BARODA", "BOB", "bankofbaroda.in"],
#     "Punjab National Bank": ["PUNJAB NATIONAL", "PNB", "pnbindia.in"],
#     "Canara Bank": ["CANARA BANK", "canarabank.com"],
# }

# DATE_FORMATS = [
#     "%d/%m/%Y", "%d-%m-%Y", "%d/%m/%y", "%d-%m-%y",
#     "%Y-%m-%d", "%d %b %Y", "%d %B %Y", "%d-%b-%Y",
#     "%d/%b/%Y", "%d %b %y", "%d-%b-%y",
# ]

# def detect_bank(text):
#     text_upper = text.upper()
#     for bank_name, keywords in BANK_PATTERNS.items():
#         for keyword in keywords:
#             if keyword.upper() in text_upper:
#                 return bank_name
#     return "Unknown Bank"

# def parse_date(date_str):
#     date_str = str(date_str).strip()
#     for fmt in DATE_FORMATS:
#         try:
#             return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
#         except ValueError:
#             continue
#     return None

# def clean_amount(amount_str):
#     if not amount_str:
#         return None
#     cleaned = re.sub(r'[₹$,\s]', '', str(amount_str)).strip()
#     cleaned = re.sub(r'(Dr|CR|dr|cr)$', '', cleaned).strip()
#     try:
#         val = float(cleaned)
#         return val if val > 0 else None
#     except ValueError:
#         return None
    
# def detect_transaction_type(row_text, amount_str):
#     row_upper = str(row_text).upper()
#     amount_str = str(amount_str).upper()
#     if any(x in row_upper or x in amount_str for x in ['DR', 'DEBIT', 'DR.']):
#         return 'debit'
#     if any(x in row_upper or x in amount_str for x in ['CR', 'CREDIT', 'CR.']):
#         return 'credit'
#     return 'debit'

# def is_date(val):
#     """Check if a cell value looks like a date."""
#     if not val:
#         return False
#     return parse_date(str(val)) is not None

# def is_amount(val):
#     """Check if a cell value looks like a monetary amount."""
#     if not val:
#         return False
#     cleaned = re.sub(r'[₹$,\s]', '', str(val)).strip()
#     cleaned = re.sub(r'(Dr|CR|dr|cr)$', '', cleaned).strip()
#     try:
#         float(cleaned)
#         return True
#     except ValueError:
#         return False

# def is_description(val):
#     """Check if a cell looks like a transaction description."""
#     if not val:
#         return False
#     val = str(val).strip()
#     # Description: at least 5 chars, not purely numeric
#     return len(val) >= 5 and not re.match(r'^[\d.,₹\s]+$', val)

# def detect_columns_from_data(table):
#     """
#     Smart column detection — scans actual data rows to figure out
#     which column contains dates, descriptions, and amounts.
#     Works for ANY bank format without hardcoding.
#     """
#     if not table or len(table) < 3:
#         return None

#     num_cols = max(len(row) for row in table)

#     # Score each column for what type of data it contains
#     date_scores = [0] * num_cols
#     desc_scores = [0] * num_cols
#     amount_scores = [0] * num_cols

#     # Sample up to 20 data rows (skip first 2 which might be headers)
#     sample_rows = table[2:22]

#     for row in sample_rows:
#         for i, cell in enumerate(row):
#             if i >= num_cols:
#                 continue
#             val = str(cell).strip() if cell else ''
#             if not val or val.lower() in ['none', 'nan', '']:
#                 continue
#             if is_date(val):
#                 date_scores[i] += 1
#             if is_description(val):
#                 desc_scores[i] += 1
#             if is_amount(val):
#                 amount_scores[i] += 1

#     print(f"📊 Date scores:   {date_scores}")
#     print(f"📊 Desc scores:   {desc_scores}")
#     print(f"📊 Amount scores: {amount_scores}")

#     # Pick best column for each type
#     date_idx = date_scores.index(max(date_scores)) if max(date_scores) > 0 else None
    
#     # Description: highest desc score, but NOT the date column
#     desc_scores_filtered = [(s if i != date_idx else 0) for i, s in enumerate(desc_scores)]
#     desc_idx = desc_scores_filtered.index(max(desc_scores_filtered)) if max(desc_scores_filtered) > 0 else None

#     # Amounts: find columns with high amount scores, exclude date/desc columns
#     amount_cols = []
#     for i, score in enumerate(amount_scores):
#         if i not in [date_idx, desc_idx] and score > 0:
#             amount_cols.append((score, i))
#     amount_cols.sort(reverse=True)

#     # Last amount column is usually Balance — exclude it
#     # Second-to-last and third-to-last are Credit and Debit
#     debit_idx = None
#     credit_idx = None
#     balance_idx = None

#     if len(amount_cols) >= 3:
#         # Multiple amount columns — last is balance, others are debit/credit
#         balance_idx = amount_cols[0][1]  # highest index = rightmost = balance
#         # Find the actual rightmost by column index
#         sorted_by_position = sorted(amount_cols, key=lambda x: x[1])
#         balance_idx = sorted_by_position[-1][1]
        
#         if len(sorted_by_position) >= 2:
#             credit_idx = sorted_by_position[-2][1]
#         if len(sorted_by_position) >= 3:
#             debit_idx = sorted_by_position[-3][1]

#     elif len(amount_cols) == 2:
#         # Two amount columns — balance and one combined amount
#         sorted_by_position = sorted(amount_cols, key=lambda x: x[1])
#         balance_idx = sorted_by_position[-1][1]
#         debit_idx = sorted_by_position[0][1]

#     elif len(amount_cols) == 1:
#         # Single amount column
#         debit_idx = amount_cols[0][1]

#     print(f"✅ Smart detection → date:{date_idx} desc:{desc_idx} debit:{debit_idx} credit:{credit_idx} balance:{balance_idx}")

#     return {
#         'date_idx': date_idx,
#         'desc_idx': desc_idx,
#         'debit_idx': debit_idx,
#         'credit_idx': credit_idx,
#         'balance_idx': balance_idx
#     }

# def find_data_start_row(table):
#     """
#     Find the row index where actual transaction data starts.
#     Skips header rows, title rows, summary rows etc.
#     """
#     for i, row in enumerate(table):
#         row_vals = [str(c).strip() for c in row if c]
#         if not row_vals:
#             continue
#         # A data row must have at least one date-like value
#         if any(is_date(v) for v in row_vals):
#             return i
#     return 1  # fallback

# def extract_transactions_from_table(table, bank_name):
#     transactions = []
#     if not table or len(table) < 3:
#         return transactions

#     # Smart column detection
#     cols = detect_columns_from_data(table)
#     if not cols or cols['date_idx'] is None or cols['desc_idx'] is None:
#         print("❌ Could not detect columns — skipping table")
#         return transactions

#     date_idx = cols['date_idx']
#     desc_idx = cols['desc_idx']
#     debit_idx = cols['debit_idx']
#     credit_idx = cols['credit_idx']

#     # Find where data actually starts
#     data_start = find_data_start_row(table)
#     print(f"📍 Data starts at row {data_start}")

#     for row in table[data_start:]:
#         try:
#             if not row or all(cell is None or str(cell).strip() == '' for cell in row):
#                 continue

#             # Skip summary rows
#             row_text = ' '.join(str(c) for c in row if c).lower()
#             if any(x in row_text for x in ['total', 'opening balance', 'closing balance',
#                                              'brought forward', 'carried forward',
#                                              'statement summary', 'subtotal']):
#                 continue

#             date_raw = str(row[date_idx]).strip() if date_idx < len(row) and row[date_idx] else ''
#             parsed_date = parse_date(date_raw)
#             if not parsed_date:
#                 continue

#             description = str(row[desc_idx]).strip() if desc_idx < len(row) and row[desc_idx] else ''
#             if not description or description.lower() in ['', 'none', 'nan']:
#                 continue

#             amount = None
#             txn_type = 'debit'

#             if debit_idx is not None and credit_idx is not None:
#                 debit_val = clean_amount(row[debit_idx]) if debit_idx < len(row) else None
#                 credit_val = clean_amount(row[credit_idx]) if credit_idx < len(row) else None

#                 if not debit_val and not credit_val:
#                     continue
#                 if debit_val and debit_val > 0:
#                     amount = debit_val
#                     txn_type = 'debit'
#                 elif credit_val and credit_val > 0:
#                     amount = credit_val
#                     txn_type = 'credit'

#             elif debit_idx is not None:
#                 # Single amount column
#                 amount = clean_amount(row[debit_idx]) if debit_idx < len(row) else None
#                 txn_type = detect_transaction_type(row_text, str(row[debit_idx]))

#             if amount is None or amount <= 0:
#                 continue

#             transactions.append({
#                 "date": parsed_date,
#                 "description": description,
#                 "raw_description": description,
#                 "amount": round(amount, 2),
#                 "type": txn_type,
#                 "bank_name": bank_name,
#                 "category": "Uncategorized"
#             })

#         except Exception as e:
#             print(f"Row error: {e}")
#             continue

#     return transactions


# def parse_pdf(contents):
#     transactions = []
#     bank_name = "Unknown Bank"

#     try:
#         with pdfplumber.open(io.BytesIO(contents)) as pdf:
#             full_text = ""

#             for page in pdf.pages:
#                 page_text = page.extract_text() or ""
#                 full_text += page_text

#                 if bank_name == "Unknown Bank":
#                     bank_name = detect_bank(full_text)

#                 tables = page.extract_tables()
#                 for table in tables:
#                     page_transactions = extract_transactions_from_table(table, bank_name)
#                     transactions.extend(page_transactions)

#             if not transactions and full_text:
#                 transactions = parse_text_based(full_text, bank_name)

#     except Exception as e:
#         print(f"PDF parsing error: {e}")
#         return [], "Unknown Bank"

#     print(f"✅ Parsed {len(transactions)} transactions from PDF — Bank: {bank_name}")
#     return transactions, bank_name


# def parse_text_based(text, bank_name):
#     """Fallback text-based parser for banks where pdfplumber can't extract tables."""
#     transactions = []
#     lines = text.split('\n')

#     pattern = re.compile(
#         r'(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+\w{3}\s+\d{2,4})'
#         r'\s+(.+?)\s+'
#         r'([\d,]+\.?\d*)\s*$'
#     )

#     for line in lines:
#         match = pattern.search(line)
#         if match:
#             date_str, description, amount_str = match.groups()
#             parsed_date = parse_date(date_str)
#             amount = clean_amount(amount_str)

#             if parsed_date and amount and amount > 0:
#                 txn_type = detect_transaction_type(line, amount_str)
#                 transactions.append({
#                     "date": parsed_date,
#                     "description": description.strip(),
#                     "raw_description": description.strip(),
#                     "amount": round(amount, 2),
#                     "type": txn_type,
#                     "bank_name": bank_name,
#                     "category": "Uncategorized"
#                 })

#     return transactions