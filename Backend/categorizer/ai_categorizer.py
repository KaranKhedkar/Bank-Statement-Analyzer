from google import genai
import json
import re
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

CATEGORIES = [
    "Food & Dining", "Shopping", "Transport", "Health & Medical",
    "Utilities", "Telecom", "Entertainment", "Finance & Investment",
    "Education", "Rent & Housing", "Groceries", "Travel & Hotel",
    "Transfers", "Government & Taxes", "Other"
]

def ai_categorize_batch(transactions):
    needs_ai = [t for t in transactions if t.get('needs_ai')]

    if not needs_ai:
        print("✅ All transactions categorized by rules — skipping AI")
        return transactions

    print(f"🤖 Sending {len(needs_ai)} transactions to Gemini...")

    txn_list = "\n".join([
        f"{i+1}. Date: {t['date']} | Amount: ₹{t['amount']} | "
        f"Type: {t['type']} | Description: {t['description']}"
        for i, t in enumerate(needs_ai)
    ])

    prompt = f"""You are an expert Indian personal finance categorizer.

Categorize each transaction into exactly one category from this list:
{json.dumps(CATEGORIES)}

Transactions:
{txn_list}

Rules:
- UPI transfers between people = "Transfers"
- EMI or loan payments = "Finance & Investment"
- Unknown merchants = use context clues from description
- Salary or income credits = "Transfers"
- When truly unsure = "Other"

Respond ONLY with a JSON array in this exact format with no explanation:
[
  {{"index": 1, "category": "Food & Dining", "confidence": "high"}},
  {{"index": 2, "category": "Transport", "confidence": "medium"}}
]"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        response_text = response.text.strip()

        if "```" in response_text:
            response_text = re.sub(r'```json?\n?', '', response_text)
            response_text = response_text.replace('```', '').strip()

        results = json.loads(response_text)

        matched = 0
        for result in results:
            idx = result['index'] - 1
            if 0 <= idx < len(needs_ai):
                needs_ai[idx]['category'] = result['category']
                needs_ai[idx]['ai_categorized'] = True
                needs_ai[idx].pop('needs_ai', None)
                matched += 1

        print(f"✅ Gemini categorized {matched} transactions")

    except json.JSONDecodeError as e:
        print(f"❌ JSON parse error: {e}")
        for t in needs_ai:
            t['category'] = 'Other'
            t.pop('needs_ai', None)

    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        for t in needs_ai:
            t['category'] = 'Other'
            t.pop('needs_ai', None)

    return transactions