import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

def get_spending_summary(
    transactions: List[Dict[str, Any]], 
    timeframe: str = "all", 
    category: Optional[str] = None, 
    tx_type: str = "all"
) -> Dict[str, Any]:
    """
    Computes total spending, income, net savings, category breakdown, and daily average.
    """
    if not transactions:
        return {"error": "No transactions found"}

    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0).abs()
    df["date_dt"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date_dt"])

    if df.empty:
        return {"error": "No valid dated transactions found"}

    max_date = df["date_dt"].max()

    # Filter timeframe
    if timeframe == "30d":
        df = df[df["date_dt"] >= (max_date - timedelta(days=30))]
    elif timeframe == "90d":
        df = df[df["date_dt"] >= (max_date - timedelta(days=90))]
    elif timeframe == "180d":
        df = df[df["date_dt"] >= (max_date - timedelta(days=180))]
    elif timeframe == "year" or timeframe == "365d":
        df = df[df["date_dt"] >= (max_date - timedelta(days=365))]

    # Filter category
    if category and category.lower() != "all":
        df = df[df["category"].str.lower() == category.lower()]

    # Filter transaction type (debit, credit, all)
    if tx_type != "all":
        df_filtered = df[df["type"] == tx_type]
    else:
        df_filtered = df

    debits = df[df["type"] == "debit"]
    credits = df[df["type"] == "credit"]

    total_spent = float(debits["amount"].sum())
    total_income = float(credits["amount"].sum())
    net_savings = total_income - total_spent
    savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0

    # Date range
    min_d = df["date_dt"].min()
    max_d = df["date_dt"].max()
    start_date = min_d.strftime("%Y-%m-%d") if pd.notna(min_d) else "N/A"
    end_date = max_d.strftime("%Y-%m-%d") if pd.notna(max_d) else "N/A"
    total_days = max((max_d - min_d).days + 1, 1) if pd.notna(min_d) and pd.notna(max_d) else 30

    # Category breakdown (for debits)
    cat_breakdown = {}
    if not debits.empty:
        cat_group = debits.groupby("category")["amount"].agg(["sum", "count"]).reset_index()
        cat_group = cat_group.sort_values(by="sum", ascending=False)
        for _, row in cat_group.iterrows():
            cat_name = row["category"] or "Uncategorized"
            pct = (row["sum"] / total_spent * 100) if total_spent > 0 else 0
            cat_breakdown[cat_name] = {
                "total": round(float(row["sum"]), 2),
                "count": int(row["count"]),
                "percentage": round(float(pct), 1)
            }

    # Top merchants by spend
    top_merchants = []
    if not debits.empty:
        merchant_col = "description" if "description" in debits.columns else "raw_description"
        if merchant_col in debits.columns:
            m_group = debits.groupby(merchant_col)["amount"].agg(["sum", "count"]).reset_index()
            m_group = m_group.sort_values(by="sum", ascending=False).head(5)
            for _, row in m_group.iterrows():
                top_merchants.append({
                    "merchant": str(row[merchant_col])[:40],
                    "total": round(float(row["sum"]), 2),
                    "count": int(row["count"])
                })

    return {
        "timeframe": timeframe,
        "date_range": {"start": start_date, "end": end_date, "days": total_days},
        "total_spent": round(total_spent, 2),
        "total_income": round(total_income, 2),
        "net_savings": round(net_savings, 2),
        "savings_rate_pct": round(savings_rate, 1),
        "avg_daily_spend": round(total_spent / total_days, 2),
        "transaction_count": len(df),
        "category_breakdown": cat_breakdown,
        "top_merchants": top_merchants
    }

def search_transactions(
    transactions: List[Dict[str, Any]], 
    query: Optional[str] = None, 
    category: Optional[str] = None, 
    min_amount: Optional[float] = None, 
    max_amount: Optional[float] = None, 
    start_date: Optional[str] = None, 
    end_date: Optional[str] = None, 
    tx_type: Optional[str] = None,
    limit: int = 15
) -> Dict[str, Any]:
    """
    Searches and filters transactions matching specific query criteria.
    """
    if not transactions:
        return {"transactions": [], "total_matches": 0}

    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0).abs()
    df["date_dt"] = pd.to_datetime(df["date"], errors="coerce")

    if query:
        q = query.lower()
        desc_match = df["description"].fillna("").str.lower().str.contains(q, regex=False)
        raw_match = df["raw_description"].fillna("").str.lower().str.contains(q, regex=False) if "raw_description" in df.columns else False
        cat_match = df["category"].fillna("").str.lower().str.contains(q, regex=False)
        df = df[desc_match | raw_match | cat_match]

    if category and category.lower() != "all":
        df = df[df["category"].fillna("").str.lower() == category.lower()]

    if min_amount is not None:
        df = df[df["amount"] >= min_amount]

    if max_amount is not None:
        df = df[df["amount"] <= max_amount]

    if start_date:
        s_dt = pd.to_datetime(start_date, errors="coerce")
        if pd.notnull(s_dt):
            df = df[df["date_dt"] >= s_dt]

    if end_date:
        e_dt = pd.to_datetime(end_date, errors="coerce")
        if pd.notnull(e_dt):
            df = df[df["date_dt"] <= e_dt]

    if tx_type and tx_type != "all":
        df = df[df["type"] == tx_type]

    df = df.sort_values(by="date_dt", ascending=False)
    total_matches = len(df)
    total_amount = float(df["amount"].sum())

    results = []
    for _, row in df.head(limit).iterrows():
        results.append({
            "id": str(row.get("id", "")),
            "date": str(row.get("date", "")),
            "description": str(row.get("description", "")),
            "category": str(row.get("category", "Uncategorized")),
            "amount": round(float(row.get("amount", 0)), 2),
            "type": str(row.get("type", "debit"))
        })

    return {
        "total_matches": total_matches,
        "total_sum": round(total_amount, 2),
        "results": results
    }

def compare_periods(
    transactions: List[Dict[str, Any]], 
    period_type: str = "month_over_month", 
    category: Optional[str] = None
) -> Dict[str, Any]:
    """
    Compares two time periods (e.g. Current Month vs Previous Month or Last 30d vs Prior 30d)
    and pinpoints categorical spend shift drivers.
    """
    if not transactions:
        return {"error": "No transactions found"}

    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0).abs()
    df["date_dt"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date_dt"])
    debits = df[df["type"] == "debit"].copy()

    if debits.empty:
        return {"error": "No debit transactions to compare"}

    max_date = debits["date_dt"].max()

    if period_type == "month_over_month" or period_type == "monthly":
        debits["month_period"] = debits["date_dt"].dt.to_period("M")
        unique_periods = sorted(debits["month_period"].unique())
        if len(unique_periods) < 2:
            p1_start = max_date - timedelta(days=30)
            p1_end = max_date
            p0_start = max_date - timedelta(days=60)
            p0_end = max_date - timedelta(days=31)
            p1_name = "Recent 30 Days"
            p0_name = "Previous 30 Days"
            df_p1 = debits[(debits["date_dt"] >= p1_start) & (debits["date_dt"] <= p1_end)]
            df_p0 = debits[(debits["date_dt"] >= p0_start) & (debits["date_dt"] <= p0_end)]
        else:
            p1_period = unique_periods[-1]
            p0_period = unique_periods[-2]
            p1_name = str(p1_period)
            p0_name = str(p0_period)
            df_p1 = debits[debits["month_period"] == p1_period]
            df_p0 = debits[debits["month_period"] == p0_period]
    else:
        p1_name = "Current 30d"
        p0_name = "Prior 30d"
        df_p1 = debits[debits["date_dt"] >= (max_date - timedelta(days=30))]
        df_p0 = debits[(debits["date_dt"] >= (max_date - timedelta(days=60))) & (debits["date_dt"] < (max_date - timedelta(days=30)))]

    if category and category.lower() != "all":
        df_p1 = df_p1[df_p1["category"].str.lower() == category.lower()]
        df_p0 = df_p0[df_p0["category"].str.lower() == category.lower()]

    spend_p1 = float(df_p1["amount"].sum())
    spend_p0 = float(df_p0["amount"].sum())
    delta = spend_p1 - spend_p0
    pct_change = ((spend_p1 - spend_p0) / spend_p0 * 100) if spend_p0 > 0 else 0

    cats_p1 = df_p1.groupby("category")["amount"].sum().to_dict()
    cats_p0 = df_p0.groupby("category")["amount"].sum().to_dict()
    all_cats = set(list(cats_p1.keys()) + list(cats_p0.keys()))

    category_shifts = []
    for cat in all_cats:
        c1 = float(cats_p1.get(cat, 0))
        c0 = float(cats_p0.get(cat, 0))
        c_delta = c1 - c0
        c_pct = ((c1 - c0) / c0 * 100) if c0 > 0 else (100.0 if c1 > 0 else 0.0)
        category_shifts.append({
            "category": cat or "Uncategorized",
            "current_period_spend": round(c1, 2),
            "previous_period_spend": round(c0, 2),
            "absolute_change": round(c_delta, 2),
            "percentage_change": round(c_pct, 1)
        })

    category_shifts = sorted(category_shifts, key=lambda x: abs(x["absolute_change"]), reverse=True)

    return {
        "period_1_label": p1_name,
        "period_0_label": p0_name,
        "period_1_total": round(spend_p1, 2),
        "period_0_total": round(spend_p0, 2),
        "absolute_difference": round(delta, 2),
        "percentage_difference": round(pct_change, 1),
        "trend": "increased" if delta > 0 else ("decreased" if delta < 0 else "unchanged"),
        "category_shifts": category_shifts
    }

def get_anomalies_analysis(
    transactions: List[Dict[str, Any]], 
    anomalies_data: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Returns structured anomaly audit data with statistical context (mean, std dev, z-score)
    and root-cause reasoning.
    """
    if not anomalies_data:
        return {"total_anomalies": 0, "anomalies": [], "message": "No anomalies found"}

    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0).abs()
    debits = df[df["type"] == "debit"]

    mean_spend = float(debits["amount"].mean()) if not debits.empty else 0
    std_spend = float(debits["amount"].std()) if not debits.empty and len(debits) > 1 else 1

    enhanced_anomalies = []
    for a in anomalies_data:
        tx_info = a.get("transactions") or {}
        amt = float(tx_info.get("amount") or 0)
        z_score = (amt - mean_spend) / std_spend if std_spend > 0 else 0
        cat = tx_info.get("category", "Uncategorized")

        cat_df = debits[debits["category"] == cat]
        cat_mean = float(cat_df["amount"].mean()) if not cat_df.empty else mean_spend

        enhanced_anomalies.append({
            "id": a.get("id"),
            "transaction_id": a.get("transaction_id"),
            "date": tx_info.get("date"),
            "description": tx_info.get("description") or tx_info.get("raw_description"),
            "amount": amt,
            "category": cat,
            "anomaly_score": round(float(a.get("anomaly_score", 0)), 4),
            "status": a.get("status", "pending"),
            "reason": a.get("reason", "Flagged by Isolation Forest"),
            "reason_type": a.get("reason_type", "pattern"),
            "statistical_insight": {
                "overall_mean": round(mean_spend, 2),
                "category_mean": round(cat_mean, 2),
                "z_score": round(z_score, 2),
                "times_above_category_mean": round(amt / cat_mean, 1) if cat_mean > 0 else 1.0
            }
        })

    return {
        "total_anomalies": len(enhanced_anomalies),
        "pending_count": len([x for x in enhanced_anomalies if x["status"] == "pending"]),
        "anomalies": enhanced_anomalies
    }

def get_forecast_data(
    forecast_data: Dict[str, Any], 
    category: Optional[str] = None
) -> Dict[str, Any]:
    """
    Retrieves and summarizes Facebook Prophet / WMA forecasting trends.
    """
    if not forecast_data:
        return {"error": "Forecast data not available. Please run forecast first."}

    summary_by_month = {}
    category_totals = {}

    for cat_name, predictions in forecast_data.items():
        if category and category.lower() != "all" and cat_name.lower() != category.lower():
            continue

        cat_sum = 0
        for p in predictions:
            m = p["month"][:7]
            if m not in summary_by_month:
                summary_by_month[m] = {"month": m, "predicted_total": 0, "lower_bound": 0, "upper_bound": 0}
            summary_by_month[m]["predicted_total"] += p.get("predicted_amount", 0)
            summary_by_month[m]["lower_bound"] += p.get("lower_bound", 0)
            summary_by_month[m]["upper_bound"] += p.get("upper_bound", 0)
            cat_sum += p.get("predicted_amount", 0)

        category_totals[cat_name] = round(cat_sum, 2)

    sorted_months = sorted(summary_by_month.values(), key=lambda x: x["month"])
    for m in sorted_months:
        m["predicted_total"] = round(m["predicted_total"], 2)
        m["lower_bound"] = round(m["lower_bound"], 2)
        m["upper_bound"] = round(m["upper_bound"], 2)

    total_projected_spend = sum([m["predicted_total"] for m in sorted_months])
    avg_monthly_projected = total_projected_spend / len(sorted_months) if sorted_months else 0

    return {
        "target_category": category or "All Categories",
        "projection_period_months": len(sorted_months),
        "total_projected_future_spend": round(total_projected_spend, 2),
        "avg_monthly_projected_spend": round(avg_monthly_projected, 2),
        "monthly_forecasts": sorted_months,
        "category_projected_totals": category_totals
    }

def simulate_what_if(
    transactions: List[Dict[str, Any]], 
    forecast_data: Dict[str, Any], 
    adjustments: Dict[str, float], 
    monthly_investment: float = 0.0, 
    expected_annual_return_pct: float = 8.0, 
    projection_months: int = 6
) -> Dict[str, Any]:
    """
    Simulates what-if financial changes (e.g. reduce Food & Dining by 20%, Shopping by 15%,
    and invest ₹5,000/mo) and models the effect on future savings and forecast curve.
    
    `adjustments`: Dict mapping category name to decimal cut (e.g. {"Food & Dining": -0.20, "Shopping": -0.15})
    """
    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0).abs()
    debits = df[df["type"] == "debit"].copy()

    if not debits.empty:
        debits["date_dt"] = pd.to_datetime(debits["date"], errors="coerce")
        total_days = max((debits["date_dt"].max() - debits["date_dt"].min()).days + 1, 30)
        months_span = max(total_days / 30.4, 1.0)
        cat_historical_monthly = (debits.groupby("category")["amount"].sum() / months_span).to_dict()
    else:
        cat_historical_monthly = {}

    baseline_monthly_total = sum(cat_historical_monthly.values())
    
    monthly_savings = 0.0
    adjustment_breakdown = []

    for cat, pct_change in adjustments.items():
        base_cat_spend = float(cat_historical_monthly.get(cat, 0.0))
        cut_amount = base_cat_spend * abs(pct_change) if pct_change < 0 else -1 * (base_cat_spend * pct_change)
        monthly_savings += cut_amount
        adjustment_breakdown.append({
            "category": cat,
            "base_monthly_spend": round(base_cat_spend, 2),
            "percentage_change": round(pct_change * 100, 1),
            "monthly_amount_saved": round(cut_amount, 2),
            "new_monthly_spend": round(max(base_cat_spend - cut_amount, 0), 2)
        })

    new_monthly_spend = max(baseline_monthly_total - monthly_savings, 0)
    annual_savings = monthly_savings * 12

    monthly_rate = (expected_annual_return_pct / 100) / 12
    total_invested_monthly = monthly_investment + max(monthly_savings, 0)
    
    timeline = []
    accumulated_saved = 0.0
    accumulated_portfolio = 0.0

    for m in range(1, projection_months + 1):
        accumulated_saved += monthly_savings
        accumulated_portfolio = (accumulated_portfolio * (1 + monthly_rate)) + total_invested_monthly
        timeline.append({
            "month_index": m,
            "month_label": f"Month {m}",
            "baseline_spend": round(baseline_monthly_total, 2),
            "simulated_spend": round(new_monthly_spend, 2),
            "cumulative_cash_saved": round(accumulated_saved, 2),
            "cumulative_invested_value": round(accumulated_portfolio, 2)
        })

    return {
        "baseline_monthly_spend": round(baseline_monthly_total, 2),
        "simulated_monthly_spend": round(new_monthly_spend, 2),
        "monthly_cash_freed_up": round(monthly_savings, 2),
        "annual_projected_savings": round(annual_savings, 2),
        "additional_monthly_investment": round(monthly_investment, 2),
        "expected_annual_return_pct": expected_annual_return_pct,
        "adjustments": adjustment_breakdown,
        "timeline": timeline,
        "summary": f"By applying these adjustments, you will save ₹{monthly_savings:,.0f} every month (₹{annual_savings:,.0f}/year). In {projection_months} months, you will accumulate ₹{accumulated_saved:,.0f} in cash savings."
    }

def get_recurring_subscriptions(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Detects repeating fixed or near-fixed debits (e.g. Netflix, Spotify, AWS, Rent, SIP).
    """
    if not transactions:
        return {"subscriptions": [], "total_recurring_monthly": 0}

    df = pd.DataFrame(transactions)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0).abs()
    df["date_dt"] = pd.to_datetime(df["date"], errors="coerce")
    debits = df[df["type"] == "debit"].dropna(subset=["date_dt"])

    if debits.empty:
        return {"subscriptions": [], "total_recurring_monthly": 0}

    merchant_col = "description" if "description" in debits.columns else "raw_description"
    grouped = debits.groupby(merchant_col)

    subscriptions = []
    total_monthly = 0.0

    for merchant, group in grouped:
        if len(group) >= 2:
            amounts = group["amount"].values
            std_amt = np.std(amounts)
            mean_amt = np.mean(amounts)

            if std_amt / (mean_amt + 1e-6) < 0.15 or len(set(amounts)) == 1:
                dates = group["date_dt"].sort_values().values
                diffs_days = np.diff(dates) / np.timedelta64(1, 'D')
                avg_interval = np.mean(diffs_days) if len(diffs_days) > 0 else 30

                cadence = "Monthly"
                if 25 <= avg_interval <= 35:
                    cadence = "Monthly"
                elif 6 <= avg_interval <= 8:
                    cadence = "Weekly"
                elif 85 <= avg_interval <= 95:
                    cadence = "Quarterly"
                elif 350 <= avg_interval <= 380:
                    cadence = "Yearly"

                cat = group["category"].iloc[0] if "category" in group.columns else "Other"
                monthly_equiv = mean_amt * (30.4 / max(avg_interval, 1))

                subscriptions.append({
                    "merchant": str(merchant)[:45],
                    "category": cat,
                    "avg_amount": round(float(mean_amt), 2),
                    "frequency_cadence": cadence,
                    "occurrences_detected": len(group),
                    "estimated_monthly_cost": round(float(monthly_equiv), 2),
                    "last_charge_date": str(group["date_dt"].max().strftime("%Y-%m-%d")) if pd.notna(group["date_dt"].max()) else "N/A"
                })
                total_monthly += monthly_equiv

    subscriptions = sorted(subscriptions, key=lambda x: x["estimated_monthly_cost"], reverse=True)

    return {
        "total_detected": len(subscriptions),
        "total_recurring_monthly": round(total_monthly, 2),
        "subscriptions": subscriptions
    }
