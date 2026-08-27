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
#     date_str = date_str.strip()
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
#         return float(cleaned)
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

# def extract_transactions_from_table(table, bank_name):
#     transactions = []
#     if not table or len(table) < 2:
#         return transactions

#     # --- Find real header row ---
#     header_row_idx = 0
#     for i, row in enumerate(table[:5]):  # check first 5 rows
#         row_text = ' '.join(str(cell).lower() for cell in row if cell)
#         if 'date' in row_text and any(x in row_text for x in ['debit', 'credit', 'narration', 'details', 'particulars']):
#             header_row_idx = i
#             break

#     header = [str(cell).strip().lower() if cell else '' for cell in table[header_row_idx]]
#     print(f"✅ Real header row {header_row_idx}: {header}")

#     # --- Map column indices ---
#     balance_idx = next((i for i, h in enumerate(header)
#                         if any(x in h for x in ['balance', 'closing', 'running'])), None)

#     date_idx = next((i for i, h in enumerate(header)
#                      if any(x in h for x in ['date', 'value date', 'post date'])), None)

#     desc_idx = next((i for i, h in enumerate(header)
#                      if any(x in h for x in ['description', 'narration', 'particulars',
#                                               'details', 'remarks'])), None)

#     debit_idx = next((i for i, h in enumerate(header)
#                       if any(x in h for x in ['debit', 'dr', 'withdrawal', 'withdrawl'])
#                       and i != balance_idx), None)

#     credit_idx = next((i for i, h in enumerate(header)
#                        if any(x in h for x in ['credit', 'cr', 'deposit'])
#                        and i != balance_idx), None)

#     amount_idx = next((i for i, h in enumerate(header)
#                        if h in ['amount', 'transaction amount']
#                        and i != balance_idx), None)

#     # --- SBI fallback: hardcode known positions if headers not detected ---
#     # SBI format: Value Date | Post Date | Details | Ref No | ₹ Debit | ₹ Credit | Balance
#     if date_idx is None and desc_idx is None:
#         print("⚠️ Headers not detected — using SBI default column positions")
#         date_idx = 0
#         desc_idx = 2
#         debit_idx = 4
#         credit_idx = 5
#         balance_idx = 6

#     print(f"📊 Columns → date:{date_idx} desc:{desc_idx} debit:{debit_idx} credit:{credit_idx} balance:{balance_idx}")

#     # --- Process data rows ---
#     for row in table[header_row_idx + 1:]:
#         try:
#             if not row or all(cell is None or str(cell).strip() == '' for cell in row):
#                 continue

#             # Skip summary/header rows
#             row_text = ' '.join(str(c) for c in row if c).lower()
#             if any(x in row_text for x in ['total', 'opening balance', 'closing balance',
#                                              'brought forward', 'carried forward',
#                                              'statement summary']):
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

#             elif amount_idx is not None:
#                 amount_raw = str(row[amount_idx]) if amount_idx < len(row) else ''
#                 amount = clean_amount(amount_raw)
#                 txn_type = detect_transaction_type(' '.join(str(c) for c in row), amount_raw)

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











import pdfplumber
import re
import io
from datetime import datetime

DATE_FORMATS = [
    "%d/%m/%Y", "%d-%m-%Y", "%d/%m/%y", "%d-%m-%y",
    "%Y-%m-%d", "%d %b %Y", "%d %B %Y", "%d-%b-%Y",
    "%d/%b/%Y", "%d %b %y", "%d-%b-%y",
]

BANK_RULES = [
    {
        "name": "State Bank of India",
        "aliases": ["SBI"],
        "domains": ["onlinesbi.sbi", "onlinesbi.com"],
        "full_names": [r"\bstate\s+bank\s+of\s+india\b"],
        "short_patterns": [r"\bsbi\b"]
    },
    {
        "name": "Bank of India",
        "aliases": ["BOI"],
        "domains": ["bankofindia.co.in", "bankofindia.com"],
        "full_names": [r"(?<!state\s)(?<!union\s)(?<!central\s)\bbank\s+of\s+india\b", r"\bboi\s+star\b", r"\bstarconnect\b"],
        "short_patterns": [r"\bboi\b"]
    },
    {
        "name": "Bank of Baroda",
        "aliases": ["BOB"],
        "domains": ["bankofbaroda.in", "bankofbaroda.co.in", "bankofbaroda.com"],
        "full_names": [r"\bbank\s+of\s+baroda\b", r"\bbaroda\s+connect\b"],
        "short_patterns": [r"\bbob\b"]
    },
    {
        "name": "Union Bank of India",
        "aliases": ["UBI"],
        "domains": ["unionbankofindia.co.in"],
        "full_names": [r"\bunion\s+bank\s+of\s+india\b"],
        "short_patterns": [r"\bunion\s+bank\b"]
    },
    {
        "name": "Punjab National Bank",
        "aliases": ["PNB"],
        "domains": ["pnbindia.in", "pnb.bank"],
        "full_names": [r"\bpunjab\s+national\s+bank\b", r"\bpunjab\s+national\b"],
        "short_patterns": [r"\bpnb\b"]
    },
    {
        "name": "Canara Bank",
        "aliases": [],
        "domains": ["canarabank.com", "canarabank.in"],
        "full_names": [r"\bcanara\s+bank\b"],
        "short_patterns": [r"\bcanara\b"]
    },
    {
        "name": "HDFC Bank",
        "aliases": [],
        "domains": ["hdfcbank.com", "hdfcbank.net"],
        "full_names": [r"\bhdfc\s+bank\b", r"\bhdfc\s+bank\s+ltd\b", r"\bhdfc\s+bank\s+limited\b"],
        "short_patterns": [r"\bhdfc\b"]
    },
    {
        "name": "ICICI Bank",
        "aliases": [],
        "domains": ["icicibank.com"],
        "full_names": [r"\bicici\s+bank\b", r"\bicici\s+bank\s+ltd\b", r"\bicici\s+bank\s+limited\b"],
        "short_patterns": [r"\bicici\b"]
    },
    {
        "name": "Axis Bank",
        "aliases": [],
        "domains": ["axisbank.com"],
        "full_names": [r"\baxis\s+bank\b", r"\baxis\s+bank\s+ltd\b"],
        "short_patterns": [r"\baxis\b"]
    },
    {
        "name": "Kotak Mahindra Bank",
        "aliases": ["Kotak Bank"],
        "domains": ["kotak.com"],
        "full_names": [r"\bkotak\s+mahindra\s+bank\b", r"\bkotak\s+mahindra\b", r"\bkotak\s+bank\b"],
        "short_patterns": [r"\bkotak\b"]
    },
    {
        "name": "IDFC FIRST Bank",
        "aliases": ["IDFC Bank"],
        "domains": ["idfcfirstbank.com"],
        "full_names": [r"\bidfc\s+first\s+bank\b", r"\bidfc\s+bank\b", r"\bidfc\s+first\b"],
        "short_patterns": [r"\bidfc\b"]
    },
    {
        "name": "Yes Bank",
        "aliases": [],
        "domains": ["yesbank.in", "yesbank.com"],
        "full_names": [r"\byes\s+bank\b"],
        "short_patterns": [r"\byes\s+bank\b"]
    },
    {
        "name": "IndusInd Bank",
        "aliases": [],
        "domains": ["indusind.com"],
        "full_names": [r"\bindusind\s+bank\b"],
        "short_patterns": [r"\bindusind\b"]
    }
]

def detect_bank(text):
    if not text:
        return "Unknown Bank"
    
    text_lower = text.lower()
    # Check top/header area (first 1500 chars) with higher weight
    header_text = text_lower[:1500]
    
    scores = {}
    for rule in BANK_RULES:
        score = 0
        name = rule["name"]
        
        # 1. Domains: Very high confidence
        for domain in rule.get("domains", []):
            if domain in header_text:
                score += 50
            elif domain in text_lower:
                score += 25
                
        # 2. Full names regex: High confidence
        for pattern in rule.get("full_names", []):
            if re.search(pattern, header_text, re.IGNORECASE):
                score += 30
            elif re.search(pattern, text_lower, re.IGNORECASE):
                score += 15
                
        # 3. Short patterns / abbreviations (only with word boundary, lower weight)
        for pattern in rule.get("short_patterns", []):
            if re.search(pattern, header_text, re.IGNORECASE):
                score += 10
            elif re.search(pattern, text_lower, re.IGNORECASE):
                score += 2
                
        if score > 0:
            scores[name] = score
            
    if scores:
        best_bank = max(scores, key=scores.get)
        if scores[best_bank] >= 5:
            return best_bank
            
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

def extract_transactions_from_table(table, bank_name, prev_columns=None):
    transactions = []
    if not table or len(table) < 2:
        return transactions, prev_columns

    header_row_idx = 0
    has_header = False
    for i, row in enumerate(table[:5]):
        row_text = ' '.join(str(cell).lower() for cell in row if cell)
        if 'date' in row_text and any(x in row_text for x in ['debit', 'credit', 'narration', 'details', 'particulars']):
            header_row_idx = i
            has_header = True
            break

    if has_header:
        header = [str(cell).strip().lower() if cell else '' for cell in table[header_row_idx]]
        
        # --- Map column indices including Balance ---
        balance_idx = next((i for i, h in enumerate(header) if any(x in h for x in ['balance', 'closing', 'running'])), None)
        date_idx = next((i for i, h in enumerate(header) if any(x in h for x in ['date', 'value date', 'post date'])), None)
        desc_idx = next((i for i, h in enumerate(header) if any(x in h for x in ['description', 'narration', 'particulars', 'details', 'remarks'])), None)
        debit_idx = next((i for i, h in enumerate(header) if any(x in h for x in ['debit', 'dr', 'withdrawal']) and i != balance_idx), None)
        credit_idx = next((i for i, h in enumerate(header) if any(x in h for x in ['credit', 'cr', 'deposit']) and i != balance_idx), None)
        amount_idx = next((i for i, h in enumerate(header) if h in ['amount', 'transaction amount'] and i != balance_idx), None)

        # SBI Fallback
        if date_idx is None and desc_idx is None:
            date_idx, desc_idx, debit_idx, credit_idx, balance_idx = 0, 2, 4, 5, 6

        columns = {
            'balance_idx': balance_idx,
            'date_idx': date_idx,
            'desc_idx': desc_idx,
            'debit_idx': debit_idx,
            'credit_idx': credit_idx,
            'amount_idx': amount_idx
        }
    else:
        # Use previous columns if no header found (continuation table)
        if prev_columns:
            columns = prev_columns
        else:
            return transactions, prev_columns

    balance_idx = columns['balance_idx']
    date_idx = columns['date_idx']
    desc_idx = columns['desc_idx']
    debit_idx = columns['debit_idx']
    credit_idx = columns['credit_idx']
    amount_idx = columns['amount_idx']

    for row in table[header_row_idx + 1:] if has_header else table:
        try:
            if not row or all(cell is None or str(cell).strip() == '' for cell in row): continue
            row_text = ' '.join(str(c) for c in row if c).lower()
            if any(x in row_text for x in ['total', 'opening balance', 'closing balance', 'summary']): continue

            date_raw = str(row[date_idx]).strip() if date_idx < len(row) and row[date_idx] else ''
            parsed_date = parse_date(date_raw)
            if not parsed_date: continue

            description = str(row[desc_idx]).strip() if desc_idx < len(row) and row[desc_idx] else ''
            if not description or description.lower() in ['', 'none', 'nan']: continue

            amount = None
            txn_type = 'debit'
            
            if debit_idx is not None and credit_idx is not None:
                debit_val = clean_amount(row[debit_idx]) if debit_idx < len(row) else None
                credit_val = clean_amount(row[credit_idx]) if credit_idx < len(row) else None
                if debit_val:
                    amount, txn_type = debit_val, 'debit'
                elif credit_val:
                    amount, txn_type = credit_val, 'credit'
            elif amount_idx is not None:
                amount_raw = str(row[amount_idx]) if amount_idx < len(row) else ''
                amount = clean_amount(amount_raw)
                txn_type = detect_transaction_type(' '.join(str(c) for c in row), amount_raw)

            if amount is None or amount <= 0: continue

            # Capture real balance from PDF
            balance = clean_amount(row[balance_idx]) if balance_idx is not None and balance_idx < len(row) else None

            transactions.append({
                "date": parsed_date,
                "description": description,
                "raw_description": description,
                "amount": round(amount, 2),
                "type": txn_type,
                "balance": round(balance, 2) if balance is not None else None,
                "bank_name": bank_name,
                "category": "Uncategorized"
            })
        except Exception as e:
            print(f"Row error: {e}")
            continue
    return transactions, columns

def parse_pdf(contents):
    transactions = []
    bank_name = "Unknown Bank"
    prev_columns = None
    try:
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            full_text = ""
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                full_text += page_text
                if bank_name == "Unknown Bank":
                    bank_name = detect_bank(full_text)
                tables = page.extract_tables({
                    "vertical_strategy": "text", 
                    "horizontal_strategy": "text"
                })
                for table in tables:
                    page_transactions, prev_columns = extract_transactions_from_table(table, bank_name, prev_columns)
                    transactions.extend(page_transactions)
            if not transactions and full_text:
                transactions = parse_text_based(full_text, bank_name)
    except Exception as e:
        print(f"PDF parsing error: {e}")
        return [], "Unknown Bank"
    return transactions, bank_name

def parse_text_based(text, bank_name):
    transactions = []
    lines = text.split('\n')

    # Matches Date, Description, and extracts the last 3 possible columns (Debit, Credit, Balance)
    # where they are either numbers or dashes.
    pattern = re.compile(
        r'^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+\w{3}\s+\d{2,4})\s+(.+?)\s+([\d,]+\.\d{2}|-)(?:\s+([\d,]+\.\d{2}|-))?(?:\s+([\d,]+\.\d{2}|-))?\s*$'
    )

    for line in lines:
        match = pattern.search(line)
        if match:
            groups = match.groups()
            date_str = groups[0]
            description = groups[1]
            
            # The last 3 groups are potential debit, credit, balance
            tail_vals = [clean_amount(g) for g in groups[2:] if g and clean_amount(g) is not None]
            
            amount = None
            balance = None
            if len(tail_vals) == 3:
                # Debit, Credit, Balance
                amount = tail_vals[0] if tail_vals[0] else tail_vals[1]
                balance = tail_vals[2]
            elif len(tail_vals) == 2:
                # Amount, Balance OR Debit, Credit without balance
                # Usually last column is balance in a 2-number trailing match
                amount = tail_vals[0]
                balance = tail_vals[1]
            elif len(tail_vals) >= 1:
                # Just one number found
                amount = tail_vals[0]

            parsed_date = parse_date(date_str)

            if parsed_date and amount and amount > 0:
                txn_type = detect_transaction_type(line, str(amount))
                transactions.append({
                    "date": parsed_date,
                    "description": description.strip(),
                    "raw_description": description.strip(),
                    "amount": round(amount, 2),
                    "type": txn_type,
                    "balance": round(balance, 2) if balance is not None else None,
                    "bank_name": bank_name,
                    "category": "Uncategorized"
                })

    return transactions