import os
import json
import re
from typing import List, Dict, Any, Optional
from google import genai
from google.genai import types
from dotenv import load_dotenv

from .tools import (
    get_spending_summary,
    search_transactions,
    compare_periods,
    get_anomalies_analysis,
    get_forecast_data,
    simulate_what_if,
    get_recurring_subscriptions
)
from .rag import build_financial_context, retrieve_relevant_transactions

load_dotenv()

# Initialize Google Gemini client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

MODEL_NAME = "gemini-2.0-flash"

SYSTEM_INSTRUCTION = """
You are the AI Financial Copilot for "Bank Statement Analyzer", a state-of-the-art personal finance telemetry platform.
Your mission is to provide accurate, insightful, empathetic, and data-grounded financial intelligence to the user.

RULES & PRINCIPLES:
1. ALWAYS base your answers on the user's actual financial data provided in the context and retrieved via tools. Never hallucinate transaction numbers or balances.
2. Format all currency in Indian Rupees (₹) with proper comma separators (e.g. ₹24,500, ₹1,42,800.50).
3. When answering questions about spending, trends, anomalies, or future projections, USE YOUR TOOLS to calculate exact numbers.
4. For visual or trend requests (e.g. "show me a chart", "plot my dining spend", "compare categories"), formulate the chart structure so the user sees interactive Recharts.
5. Provide actionable takeaways, proactive suggestions, and root-cause explanations (e.g. "Your food expenses rose 22% mainly due to 8 Swiggy orders on weekends").
6. When responding to "What If" hypothetical questions, invoke `simulate_what_if` to project real numbers and explain the compound interest/runway benefits.
7. Keep responses concise, cleanly formatted in GitHub Markdown (bullet points, bold highlights, tables when appropriate).

STRUCTURED CHART & SUGGESTIONS CONVENTION:
At the very end of your response, if you generated a visualization or have smart follow-ups, include a JSON block in this exact markdown format:
```json_copilot_meta
{
  "chart": {
    "type": "bar" | "line" | "area" | "pie",
    "title": "Chart Title",
    "data": [
      {"name": "Food & Dining", "value": 14200},
      {"name": "Shopping", "value": 8500}
    ],
    "xKey": "name" | "month" | "date",
    "yKeys": [{"key": "value", "name": "Spent (₹)", "color": "#6366f1"}]
  },
  "suggested_actions": [
    "What if I reduce Food & Dining by 20%?",
    "Compare my spending with last month",
    "Show me all recurring subscriptions"
  ]
}
```
If no chart is needed for the query, omit the `"chart"` key in `json_copilot_meta` or set it to `null`.
"""

def execute_tool_call(tool_name: str, args: dict, user_data: dict) -> dict:
    """
    Routes and executes tool calls against the user's isolated in-memory financial dataset.
    """
    txs = user_data.get("transactions", [])
    anomalies = user_data.get("anomalies", [])
    forecast = user_data.get("forecast_data", {})

    if tool_name == "get_spending_summary":
        return get_spending_summary(
            transactions=txs,
            timeframe=args.get("timeframe", "all"),
            category=args.get("category"),
            tx_type=args.get("tx_type", "all")
        )

    elif tool_name == "search_transactions":
        return search_transactions(
            transactions=txs,
            query=args.get("query"),
            category=args.get("category"),
            min_amount=args.get("min_amount"),
            max_amount=args.get("max_amount"),
            start_date=args.get("start_date"),
            end_date=args.get("end_date"),
            tx_type=args.get("tx_type"),
            limit=args.get("limit", 15)
        )

    elif tool_name == "compare_periods":
        return compare_periods(
            transactions=txs,
            period_type=args.get("period_type", "month_over_month"),
            category=args.get("category")
        )

    elif tool_name == "get_anomalies_analysis":
        return get_anomalies_analysis(
            transactions=txs,
            anomalies_data=anomalies
        )

    elif tool_name == "get_forecast_data":
        return get_forecast_data(
            forecast_data=forecast,
            category=args.get("category")
        )

    elif tool_name == "simulate_what_if":
        adjustments = args.get("adjustments", {})
        if isinstance(adjustments, str):
            try:
                adjustments = json.loads(adjustments)
            except:
                adjustments = {}
        return simulate_what_if(
            transactions=txs,
            forecast_data=forecast,
            adjustments=adjustments,
            monthly_investment=float(args.get("monthly_investment", 0.0)),
            expected_annual_return_pct=float(args.get("expected_annual_return_pct", 8.0)),
            projection_months=int(args.get("projection_months", 6))
        )

    elif tool_name == "get_recurring_subscriptions":
        return get_recurring_subscriptions(transactions=txs)

    return {"error": f"Tool '{tool_name}' not recognized."}


# Tool Declarations for Gemini Function Calling
AGENT_TOOLS = [
    {
        "name": "get_spending_summary",
        "description": "Calculates total inflow, outflow, net savings, average daily burn, and categorical spend distribution for a given timeframe (30d, 90d, 180d, year, all) and optional category.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "timeframe": {"type": "STRING", "description": "Time window: '30d', '90d', '180d', 'year', or 'all'"},
                "category": {"type": "STRING", "description": "Optional category filter like 'Food & Dining', 'Shopping', etc."},
                "tx_type": {"type": "STRING", "description": "'debit', 'credit', or 'all'"}
            }
        }
    },
    {
        "name": "search_transactions",
        "description": "Searches and filters specific individual transactions by keyword, merchant name, category, date range, or amount range.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "query": {"type": "STRING", "description": "Search keyword (merchant, note, description)"},
                "category": {"type": "STRING", "description": "Specific category name"},
                "min_amount": {"type": "NUMBER", "description": "Minimum transaction amount in INR"},
                "max_amount": {"type": "NUMBER", "description": "Maximum transaction amount in INR"},
                "start_date": {"type": "STRING", "description": "Start date YYYY-MM-DD"},
                "end_date": {"type": "STRING", "description": "End date YYYY-MM-DD"},
                "limit": {"type": "INTEGER", "description": "Max results to return (default 15)"}
            }
        }
    },
    {
        "name": "compare_periods",
        "description": "Compares spending between two time periods (e.g. Current Month vs Previous Month or Last 30d vs Prior 30d) and highlights the biggest categorical drivers of increase/decrease.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "period_type": {"type": "STRING", "description": "'month_over_month' or '30d'"},
                "category": {"type": "STRING", "description": "Optional category filter"}
            }
        }
    },
    {
        "name": "get_anomalies_analysis",
        "description": "Retrieves transactions flagged as outliers/anomalies by the Isolation Forest model along with statistical deviations (z-scores, variance from category mean).",
        "parameters": {
            "type": "OBJECT",
            "properties": {}
        }
    },
    {
        "name": "get_forecast_data",
        "description": "Retrieves future monthly expense projections and confidence intervals modeled by Facebook Prophet / Weighted Moving Average.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "category": {"type": "STRING", "description": "Optional specific category to inspect"}
            }
        }
    },
    {
        "name": "simulate_what_if",
        "description": "Simulates hypothetical changes in spending (e.g. reduce Food & Dining by 20%, Shopping by 15%) and projects monthly cash savings, compound investment growth, and future trajectory.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "adjustments": {
                    "type": "OBJECT", 
                    "description": "Category reduction decimals, e.g. {'Food & Dining': -0.20, 'Shopping': -0.15}"
                },
                "monthly_investment": {"type": "NUMBER", "description": "Additional monthly SIP / investment amount in INR"},
                "expected_annual_return_pct": {"type": "NUMBER", "description": "Expected annual ROI percentage (default 8.0)"},
                "projection_months": {"type": "INTEGER", "description": "Months to project forward (default 6)"}
            },
            "required": ["adjustments"]
        }
    },
    {
        "name": "get_recurring_subscriptions",
        "description": "Scans statement transactions to detect fixed repeating charges (e.g. Netflix, Spotify, gym, rent, utility bills, SIPs).",
        "parameters": {
            "type": "OBJECT",
            "properties": {}
        }
    }
]

def run_copilot_turn(
    user_message: str,
    conversation_history: List[Dict[str, str]],
    user_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Executes an agentic conversation turn with tool calling, context retrieval,
    and structured output synthesis.
    """
    global client
    if not client:
        GEMINI_KEY = os.getenv("GEMINI_API_KEY")
        if GEMINI_KEY:
            client = genai.Client(api_key=GEMINI_KEY)
        else:
            return {
                "response": "Gemini API Key is missing. Please set `GEMINI_API_KEY` in `Backend/.env`.",
                "tool_calls": [],
                "chart": None,
                "suggested_actions": []
            }

    transactions = user_data.get("transactions", [])
    anomalies = user_data.get("anomalies", [])
    forecast_data = user_data.get("forecast_data", {})

    # Build RAG Context
    rag_context = build_financial_context(transactions, anomalies, forecast_data)
    relevant_txs = retrieve_relevant_transactions(transactions, user_message, top_k=6)

    relevant_txs_str = ""
    if relevant_txs:
        relevant_txs_str = "\nRelevant Sample Transactions:\n" + "\n".join([
            f"- {t.get('date')}: {t.get('description')} (₹{t.get('amount')}, {t.get('type')}, {t.get('category')})"
            for t in relevant_txs
        ])

    # Convert conversation history to Gemini contents format
    contents = []
    
    # System context in first turn or instruction
    full_system_context = f"{SYSTEM_INSTRUCTION}\n\n{rag_context}\n{relevant_txs_str}"
    
    for msg in conversation_history[-6:]:
        role = "user" if msg.get("role") == "user" else "model"
        contents.append(types.Content(
            role=role,
            parts=[types.Part.from_text(text=msg.get("content", ""))]
        ))

    # Add current user prompt
    contents.append(types.Content(
        role="user",
        parts=[types.Part.from_text(text=user_message)]
    ))

    executed_tool_traces = []

    try:
        # Step 1: Initial call with function calling enabled
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=full_system_context,
                tools=[{"function_declarations": AGENT_TOOLS}],
                temperature=0.3
            )
        )

        # Step 2: Handle function calls loop (up to 3 sequential tool executions)
        max_tool_iterations = 3
        curr_iter = 0

        while response.function_calls and curr_iter < max_tool_iterations:
            curr_iter += 1
            tool_responses = []

            for fc in response.function_calls:
                fn_name = fc.name
                fn_args = fc.args or {}
                
                # Execute tool
                tool_result = execute_tool_call(fn_name, fn_args, user_data)
                
                # Record trace for UI
                executed_tool_traces.append({
                    "name": fn_name,
                    "args": fn_args,
                    "result_summary": str(tool_result)[:180] + "..." if len(str(tool_result)) > 180 else str(tool_result)
                })

                tool_responses.append(
                    types.Part.from_function_response(
                        name=fn_name,
                        response={"result": tool_result}
                    )
                )

            # Append assistant's function call message
            contents.append(response.candidates[0].content)

            # Append function response message
            contents.append(types.Content(
                role="tool",
                parts=tool_responses
            ))

            # Call Gemini with the tool outputs
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=full_system_context,
                    tools=[{"function_declarations": AGENT_TOOLS}],
                    temperature=0.3
                )
            )

        raw_text = response.text or "I have processed your financial data."

        # Parse copilot metadata (chart + suggested actions)
        chart_data = None
        suggested_actions = [
            "What if I reduce Food & Dining by 20%?",
            "Compare this month with last month",
            "Detect recurring subscriptions"
        ]

        meta_match = re.search(r"```json_copilot_meta\s*([\s\S]*?)\s*```", raw_text)
        if meta_match:
            try:
                meta_json = json.loads(meta_match.group(1).strip())
                chart_data = meta_json.get("chart")
                if meta_json.get("suggested_actions"):
                    suggested_actions = meta_json.get("suggested_actions")
            except Exception as e:
                print(f"Meta JSON parsing warning: {e}")
            
            # Clean meta block from user-visible response text
            clean_text = re.sub(r"```json_copilot_meta\s*[\s\S]*?\s*```", "", raw_text).strip()
        else:
            clean_text = raw_text.strip()

        # Fallback auto-chart generation if the user asked for a chart or category breakdown and no chart was emitted
        if not chart_data and ("chart" in user_message.lower() or "breakdown" in user_message.lower() or "compare" in user_message.lower() or "visual" in user_message.lower()):
            # Build an automatic category bar chart
            cat_summary = get_spending_summary(transactions, timeframe="all")
            cat_breakdown = cat_summary.get("category_breakdown", {})
            if cat_breakdown:
                chart_items = [
                    {"name": cat, "amount": info["total"]}
                    for cat, info in list(cat_breakdown.items())[:6]
                ]
                chart_data = {
                    "type": "bar",
                    "title": "Category Spending Distribution",
                    "data": chart_items,
                    "xKey": "name",
                    "yKeys": [{"key": "amount", "name": "Spent (₹)", "color": "#6366f1"}]
                }

        return {
            "response": clean_text,
            "tool_calls": executed_tool_traces,
            "chart": chart_data,
            "suggested_actions": suggested_actions[:4]
        }

    except Exception as e:
        print(f"❌ Gemini Copilot Error: {e}")
        # Fallback response using pure deterministic tools
        summary = get_spending_summary(transactions, timeframe="30d")
        return {
            "response": f"I analyzed your statement data. In the last 30 days, your total outflow was ₹{summary.get('total_spent', 0):,.2f} across {summary.get('transaction_count', 0)} transactions. (Note: AI generation hit an error: {str(e)[:100]})",
            "tool_calls": executed_tool_traces,
            "chart": None,
            "suggested_actions": [
                "What if I reduce Food & Dining by 20%?",
                "Show spending comparison for last month"
            ]
        }
