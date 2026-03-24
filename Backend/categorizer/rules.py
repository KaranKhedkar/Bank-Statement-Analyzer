import re

# --- Indian Merchant & Category Rules ---
CATEGORY_RULES = {
    "Food & Dining": [
        "swiggy", "zomato", "dominos", "domino", "mcdonalds", "mcdonald",
        "kfc", "pizza hut", "pizzahut", "subway", "burger king", "burgerking",
        "dunkin", "starbucks", "cafe coffee day", "ccd", "barbeque nation",
        "behrouz", "faasos", "box8", "freshmenu", "eatsure", "eatclub",
        "restaurant", "hotel", "dhaba", "food", "dining", "bakery",
        "cafe", "canteen", "mess", "tiffin", "biryani", "pizza", "burger",
    ],
    "Shopping": [
        "amazon", "flipkart", "myntra", "ajio", "nykaa", "meesho",
        "snapdeal", "shopclues", "tatacliq", "reliance digital", "croma",
        "vijay sales", "decathlon", "ikea", "h&m", "zara", "westside",
        "shoppers stop", "lifestyle", "pantaloons", "max fashion",
        "firstcry", "lenskart", "pepperfry", "urban ladder",
        "retail", "shopping", "store", "mart", "bazaar", "mall",
    ],
    "Transport": [
        "uber", "ola", "rapido", "meru", "fasttag", "fastag",
        "irctc", "indian railway", "railway", "indigo", "spicejet",
        "air india", "vistara", "goair", "akasa", "makemytrip",
        "goibibo", "cleartrip", "yatra", "redbus", "abhibus",
        "metro", "dmrc", "bmtc", "best bus", "ksrtc", "fuel",
        "petrol", "diesel", "hp petrol", "iocl", "bpcl", "indian oil",
        "shell", "nayara", "parking", "toll", "highway",
    ],
    "Health & Medical": [
        "apollo", "fortis", "max hospital", "medanta", "aiims",
        "pharmacy", "medical", "hospital", "clinic", "doctor",
        "diagnostic", "lab", "pathology", "practo", "1mg", "netmeds",
        "pharmeasy", "medlife", "healthkart", "thyrocare", "dr lal",
        "medibuddy", "aster", "manipal", "narayana", "care hospital",
        "medicine", "health", "wellness", "chemist", "drugstore",
    ],
    "Utilities": [
        "electricity", "electric", "power", "bescom", "msedcl", "tata power",
        "adani electricity", "bses", "tneb", "water", "bwssb", "municipal",
        "gas", "mahanagar gas", "indraprastha gas", "gujarat gas",
        "broadband", "internet", "airtel", "jio", "bsnl", "act fibernet",
        "hathway", "you broadband", "wifi", "connection",
    ],
    "Telecom": [
        "airtel recharge", "jio recharge", "vodafone", "vi recharge",
        "bsnl recharge", "mobile recharge", "prepaid", "postpaid",
        "recharge", "topup", "data pack", "talktime",
    ],
    "Entertainment": [
        "netflix", "amazon prime", "hotstar", "disney", "zee5",
        "sonyliv", "voot", "jiocinema", "mxplayer", "altbalaji",
        "spotify", "gaana", "wynk", "jiosaavn", "apple music",
        "youtube premium", "bookmyshow", "pvr", "inox", "carnival",
        "cinepolis", "gaming", "steam", "playstation", "xbox",
        "dream11", "mpl", "fantasy", "ludo", "game",
    ],
    "Finance & Investment": [
        "mutual fund", "sip", "zerodha", "groww", "upstox", "kuvera",
        "paytm money", "icicidirect", "hdfc securities", "kotak securities",
        "angel broking", "motilal", "edelweiss", "nippon", "sbi mutual",
        "lic", "life insurance", "term insurance", "health insurance",
        "premium", "policy", "insurance", "nps", "ppf", "fd", "fixed deposit",
        "rd", "recurring", "emi", "loan", "mortgage", "bajaj finance",
        "hdfc credila", "creditbee", "money tap", "navi",
    ],
    "Education": [
        "school", "college", "university", "institute", "fees",
        "tuition", "coaching", "byju", "unacademy", "vedantu",
        "coursera", "udemy", "skillshare", "simplilearn", "upgrad",
        "edureka", "whitehat", "toppr", "doubtnut", "meritnation",
        "exam", "admission", "scholarship",
    ],
    "Rent & Housing": [
        "rent", "rental", "lease", "nobroker", "magicbricks",
        "99acres", "housing.com", "nestaway", "stanza living",
        "oyo rooms", "maintenance", "society", "apartment",
        "housing", "property", "pg ", "paying guest",
    ],
    "Groceries": [
        "bigbasket", "grofers", "blinkit", "zepto", "swiggy instamart",
        "dunzo", "jiomart", "dmart", "reliance fresh", "reliance smart",
        "more supermarket", "spencer", "nature basket", "lulu",
        "supermarket", "grocery", "vegetables", "fruits", "kirana",
        "provisions", "ration", "milk", "dairy", "amul",
    ],
    "Travel & Hotel": [
        "oyo", "fabhotels", "treebo", "zostel", "airbnb",
        "taj hotel", "marriott", "hyatt", "hilton", "oberoi",
        "itc hotel", "leela", "radisson", "holiday inn",
        "makemytrip hotel", "goibibo hotel", "hotel booking",
        "resort", "homestay", "lodging", "accommodation",
    ],
    "Transfers": [
        "neft", "rtgs", "imps",
        "transfer to", "transfer from",
        "self transfer", "own account",
        "trf to", "trf from",
    ],
    "Government & Taxes": [
        "income tax", "gst", "tds", "challan", "nsdl", "tin-nsdl",
        "government", "govt", "municipal tax", "property tax",
        "passport", "rto", "driving license", "aadhaar", "pan card",
        "post office", "india post",
    ],
}

# --- UPI Pattern Extraction ---
UPI_PATTERNS = [
    r'upi[/-]?(?:dr|cr)?[/-]?\d*[/-]?(.+?)[/-]\w+[/-]\w+',
    r'(?:phonepe|gpay|paytm|bhim)[/-](.+?)[/-]',
    r'upi[/-](.+?)(?:[/-]|$)',
]

# def extract_upi_merchant(description):
#     desc_lower = description.lower()
#     for pattern in UPI_PATTERNS:
#         match = re.search(pattern, desc_lower)
#         if match:
#             return match.group(1).strip()
#     return description

def extract_upi_merchant(description):
    desc_lower = description.lower()
    
    # SBI UPI format: UPI/DR/123456789/MerchantName/BANKNAME/ref
    # We want the 4th segment (index 3)
    if 'upi/' in desc_lower or 'upi-' in desc_lower:
        parts = re.split(r'[/\-]', desc_lower)
        # Filter out: 'upi', 'dr', 'cr', numeric strings, bank names
        skip = {'upi', 'dr', 'cr', 'neft', 'imps', 'rtgs', 'sbi', 'hdfc', 
                'icici', 'axis', 'kotak', 'ybl', 'oksbi', 'okaxis', 'okicici',
                'okhdfcbank', 'paytm', 'ibl', 'upi', 'gpay', 'phonepe'}
        for part in parts:
            part = part.strip()
            if part and not part.isdigit() and part not in skip and len(part) > 2:
                return part
    
    return desc_lower

def rule_based_categorize(description):
    desc_lower = description.lower()
    merchant = extract_upi_merchant(desc_lower)

    # Check all specific categories FIRST (skip Transfers)
    for category, keywords in CATEGORY_RULES.items():
        if category == "Transfers":
            continue  # skip for now
        for keyword in keywords:
            if keyword in desc_lower or keyword in merchant:
                return category

    # Only fall back to Transfers if nothing else matched
    for keyword in CATEGORY_RULES["Transfers"]:
        if keyword in desc_lower:
            return "Transfers"

    return None

def categorize_transactions(transactions):
    """
    Layer 1: Rule-based categorization.
    Marks unmatched transactions for AI categorization.
    """
    matched = 0
    unmatched = 0

    for txn in transactions:
        category = rule_based_categorize(txn['description'])
        if category:
            txn['category'] = category
            matched += 1
        else:
            txn['category'] = 'Uncategorized'
            txn['needs_ai'] = True
            unmatched += 1

    print(f"✅ Rules matched: {matched} | Needs AI: {unmatched}")
    return transactions