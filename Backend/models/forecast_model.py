


import pandas as pd
import numpy as np
from prophet import Prophet
from dateutil.relativedelta import relativedelta
from datetime import datetime

# ── Updated to match your exact DB Categories ──────────────────────────────
CATEGORIES = [
    "Food & Dining", "Shopping", "Transport", "Health & Medical",
    "Utilities", "Telecom", "Entertainment", "Finance & Investment",
    "Education", "Rent & Housing", "Groceries", "Travel & Hotel",
    "Transfers", "Government & Taxes", "Other"
]

MIN_MONTHS_PROPHET = 3   # below this → weighted average
MIN_MONTHS_SEASONAL = 6  # below this → Prophet without yearly seasonality

# ── Step 1: Build per-category monthly series ────────────────────────────────
def build_category_series(transactions: list[dict]) -> dict[str, pd.DataFrame]:
    df = pd.DataFrame(transactions)
    # Convert string dates from Supabase to pandas datetime
    df["date"] = pd.to_datetime(df["date"])
    
    # Ensure amount is a float and positive (we are forecasting spend volume)
    df["amount"] = pd.to_numeric(df["amount"], errors='coerce').fillna(0).abs()
    
    # Group by month
    df["month"] = df["date"].dt.to_period("M").dt.to_timestamp()

    series = {}
    for category in CATEGORIES:
        cat_df = df[df["category"] == category]
        if cat_df.empty:
            continue
        monthly = (
            cat_df.groupby("month")["amount"]
            .sum()
            .reset_index()
            .rename(columns={"amount": "amount"})
            .sort_values("month")
        )
        series[category] = monthly

    return series

# ── Step 2: Choose model per category ────────────────────────────────────────
def choose_model(monthly_df: pd.DataFrame) -> str:
    months = monthly_df["month"].nunique()
    if months >= MIN_MONTHS_SEASONAL:
        return "prophet_full"
    elif months >= MIN_MONTHS_PROPHET:
        return "prophet_basic"
    else:
        return "weighted_avg"

# ── Step 3a: Prophet forecast ─────────────────────────────────────────────────
def forecast_prophet(monthly_df: pd.DataFrame, model_type: str) -> list[dict]:
    prophet_df = monthly_df.rename(columns={"month": "ds", "amount": "y"})
    yearly_seasonality = (model_type == "prophet_full")

    model = Prophet(
        yearly_seasonality=yearly_seasonality,
        weekly_seasonality=False,
        daily_seasonality=False,
        seasonality_mode="multiplicative",
        interval_width=0.80,         # 80% confidence band (Lower/Upper bounds)
        changepoint_prior_scale=0.1, 
    )
    model.fit(prophet_df)

    # Predict 6 months into the future
    future = model.make_future_dataframe(periods=6, freq="MS")
    forecast = model.predict(future)

    # Keep only the future months
    today = pd.Timestamp.today().normalize()
    future_rows = forecast[forecast["ds"] > today].head(6)

    return [
        {
            "month": row["ds"].strftime("%Y-%m-%d"),
            "predicted_amount": round(max(float(row["yhat"]), 0), 2),
            "lower_bound":      round(max(float(row["yhat_lower"]), 0), 2),
            "upper_bound":      round(max(float(row["yhat_upper"]), 0), 2),
            "model": model_type,
        }
        for _, row in future_rows.iterrows()
    ]

# ── Step 3b: Weighted average forecast ───────────────────────────────────────
def forecast_weighted_avg(monthly_df: pd.DataFrame) -> list[dict]:
    amounts = monthly_df["amount"].values
    n = len(amounts)

    # Weights: More recent months matter more
    weights = np.arange(1, n + 1, dtype=float)
    wma = float(np.average(amounts, weights=weights))
    std = float(np.std(amounts)) if n > 1 else wma * 0.20

    results = []
    base = pd.Timestamp.today().normalize()
    for i in range(1, 7):
        month = (base + relativedelta(months=i)).replace(day=1)
        results.append({
            "month": month.strftime("%Y-%m-%d"),
            "predicted_amount": round(max(wma, 0), 2),
            "lower_bound":      round(max(wma - std, 0), 2),
            "upper_bound":      round(wma + std, 2),
            "model": "weighted_avg",
        })
    return results

# ── Step 4: Anomaly & trend flag ─────────────────────────────────────────────
def add_trend_flags(predictions: list[dict], monthly_df: pd.DataFrame) -> list[dict]:
    hist_mean = float(monthly_df["amount"].mean())
    hist_std  = float(monthly_df["amount"].std()) or hist_mean * 0.20

    for p in predictions:
        # Avoid division by zero if all historical months had exactly the same spend
        if hist_std == 0:
            z = 0
        else:
            z = (p["predicted_amount"] - hist_mean) / hist_std
            
        p["anomaly"] = abs(z) > 1.5
        p["trend"]   = "high" if z > 1.5 else ("low" if z < -1.5 else "normal")
        p["hist_avg"] = round(hist_mean, 2) 

    return predictions

# ── Step 5: Master function ──────────────────────────────────────────────────
def predict_all_categories(transactions: list[dict]) -> dict[str, list[dict]]:
    series = build_category_series(transactions)
    results = {}

    for category, monthly_df in series.items():
        model_type = choose_model(monthly_df)

        try:
            if model_type in ("prophet_full", "prophet_basic"):
                predictions = forecast_prophet(monthly_df, model_type)
            else:
                predictions = forecast_weighted_avg(monthly_df)
        except Exception as e:
            print(f"Prophet failed for {category}, falling back to WMA. Error: {e}")
            predictions = forecast_weighted_avg(monthly_df)

        predictions = add_trend_flags(predictions, monthly_df)
        results[category] = predictions

    return results