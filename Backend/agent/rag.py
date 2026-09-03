import pandas as pd
from typing import List, Dict, Any, Optional

def build_financial_context(
    transactions: List[Dict[str, Any]], 
    anomalies: Optional[List[Dict[str, Any]]] = None,
    forecast_data: Optional[Dict[str, Any]] = None
) -> str:
    """
    Assembles a rich, compact financial summary profile of the user
    to provide the LLM with grounded factual context.
    """
    if not transactions:
        return "No transactions currently available for this user."

    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0).abs()
    df["date_dt"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date_dt"])

    if df.empty:
        return "No dated transactions available."

    min_val = df["date_dt"].min()
    max_val = df["date_dt"].max()
    min_date = min_val.strftime("%d %b %Y") if pd.notna(min_val) else "N/A"
    max_date = max_val.strftime("%d %b %Y") if pd.notna(max_val) else "N/A"
    total_days = max((max_val - min_val).days + 1, 1) if pd.notna(min_val) and pd.notna(max_val) else 30

    debits = df[df["type"] == "debit"]
    credits = df[df["type"] == "credit"]

    total_outflow = float(debits["amount"].sum())
    total_inflow = float(credits["amount"].sum())
    net_savings = total_inflow - total_outflow
    savings_rate = (net_savings / total_inflow * 100) if total_inflow > 0 else 0
    avg_daily_burn = total_outflow / total_days

    # Category distribution
    cat_summary = []
    if not debits.empty:
        cat_group = debits.groupby("category")["amount"].agg(["sum", "count"]).reset_index()
        cat_group = cat_group.sort_values(by="sum", ascending=False)
        for _, row in cat_group.iterrows():
            pct = (row["sum"] / total_outflow * 100) if total_outflow > 0 else 0
            cat_summary.append(f"- {row['category']}: ₹{row['sum']:,.0f} ({pct:.1f}%, {row['count']} txns)")

    # Top spending merchants
    merchant_col = "description" if "description" in debits.columns else "raw_description"
    top_merchants_str = []
    if not debits.empty and merchant_col in debits.columns:
        m_group = debits.groupby(merchant_col)["amount"].sum().sort_values(ascending=False).head(5)
        for m_name, amt in m_group.items():
            top_merchants_str.append(f"{str(m_name)[:30]}: ₹{amt:,.0f}")

    # Anomalies count
    pending_anomalies_count = 0
    if anomalies:
        pending_anomalies_count = len([a for a in anomalies if a.get("status") == "pending"])

    # Forecast summary
    forecast_snippet = "Not generated yet."
    if forecast_data:
        total_fut = sum([
            sum([p.get("predicted_amount", 0) for p in preds])
            for preds in forecast_data.values()
        ])
        forecast_snippet = f"Projected total outflow across next 6 months: ₹{total_fut:,.0f}"

    profile = f"""
=== USER FINANCIAL PROFILE & TELEMETRY ===
• Statement Date Range: {min_date} to {max_date} ({total_days} days)
• Total Inflow (Credits): ₹{total_inflow:,.2f} ({len(credits)} txns)
• Total Outflow (Debits): ₹{total_outflow:,.2f} ({len(debits)} txns)
• Net Cashflow: ₹{net_savings:,.2f} | Savings Rate: {savings_rate:.1f}%
• Average Daily Burn Rate: ₹{avg_daily_burn:,.2f}/day
• Unresolved Anomalies Flagged: {pending_anomalies_count}
• Future Outlook: {forecast_snippet}

Top Expense Categories:
{chr(10).join(cat_summary[:7]) if cat_summary else "None"}

Top Expense Recipients:
{", ".join(top_merchants_str) if top_merchants_str else "None"}
==========================================
"""
    return profile.strip()

def retrieve_relevant_transactions(transactions: List[Dict[str, Any]], query: str, top_k: int = 10) -> List[Dict[str, Any]]:
    """
    Fast keyword & token retrieval over transactions for specific entity queries.
    """
    if not transactions or not query:
        return []

    tokens = [t.lower().strip() for t in query.split() if len(t) > 2]
    if not tokens:
        return transactions[:top_k]

    scored = []
    for tx in transactions:
        text = f"{tx.get('description', '')} {tx.get('category', '')} {tx.get('raw_description', '')}".lower()
        score = sum(1 for tok in tokens if tok in text)
        if score > 0:
            scored.append((score, tx))

    scored.sort(key=lambda x: (x[0], x[1].get('amount', 0)), reverse=True)
    return [item[1] for item in scored[:top_k]]
