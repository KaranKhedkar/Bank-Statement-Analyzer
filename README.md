# AI-Powered Bank Statement Analyzer

## 1. Project Title & Overview

**Bank Statement Analyzer** is a full-stack financial telemetry web application designed to automatically parse, categorize, and analyze bank statements. It solves the problem of manual expense tracking by using a hybrid rules-and-AI approach to reliably extract data from messy bank PDFs, detects anomalous spending using unsupervised machine learning, and forecasts future expenses utilizing time-series modeling.

## 2. Key Features

* **Automated PDF Parsing**: Dynamically extracts tabular data from brittle bank statement PDFs using keyword-based column detection, resilient to formatting changes across different banks.
* **Smart Hybrid Categorization**: Processes transactions through a blazing-fast local rules engine (regex/keywords) and routes uncategorized edge-cases to a batched Google Gemini API fallback.
* **Unsupervised Anomaly Detection**: Employs an Isolation Forest algorithm to flag unusual spending behavior based on historical variance without requiring labeled training data.
* **Predictive Forecasting**: Uses Facebook Prophet (for long-term data) and Weighted Moving Average (for short-term data) to project future categorical expenses.
* **High-Performance Dashboards**: Real-time frontend built with React, Zustand, and Recharts to visualize spending insights, trends, and audit queues.

## 3. Screenshots / Demo

*(Screenshots and demo links can be added here once the repository is published.)*

## 4. Tech Stack

* **Frontend**: React, Vite, Tailwind CSS, Zustand (State Management), Recharts
* **Backend**: FastAPI, Python, Uvicorn, Pydantic
* **Database & Auth**: Supabase (PostgreSQL, Row-Level Security, Authentication)
* **AI/ML**: `scikit-learn` (IsolationForest), `prophet`, Google Gemini API
* **Data Processing**: `pandas`, `pdfplumber`

## 5. How It Works

1. **Upload & Parse**: The user uploads a PDF/CSV bank statement via the React frontend. The FastAPI backend processes the file using `pdfplumber`, dynamically mapping headers (Date, Description, Amount) to extract raw text.
2. **Categorization**: Transactions run through a Rules Engine to clean strings (like messy UPI hashes) and match known merchants. Uncategorized transactions are batched into a structured prompt and sent to the Gemini API for JSON-enforced categorization.
3. **ML Analysis**: Background tasks run `IsolationForest` to calculate anomaly scores for each transaction based on amount and frequency. Simultaneously, `Prophet` aggregates historical categorical data to forecast future expenditures.
4. **Data Persistence**: Results are saved securely in Supabase with strict Row-Level Security (RLS) policies.
5. **Visualization**: The frontend fetches these insights and visualizes the financial telemetry across dedicated dashboard views.

## 6. Project Structure

```text
.
├── Backend/
│   ├── categorizer/      # Rules engine and Gemini AI fallback logic
│   ├── routers/          # FastAPI endpoints (upload, anomalies, forecast)
│   ├── pdf_parser.py     # Dynamic PDF table extraction logic
│   ├── main.py           # FastAPI application entry point
│   └── requirements.txt  # Python dependencies
├── Frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components and application layout
│   │   ├── pages/        # Dashboard views (Transactions, Anomalies, Forecast, etc.)
│   │   ├── store/        # Zustand global state management
│   │   └── lib/          # API clients (Supabase setup, api.js)
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
└── predictor.py          # Time-series forecasting logic (Prophet/WMA)
```

## 7. Installation & Setup

### Prerequisites
* Python 3.9+
* Node.js 18+
* Supabase Account
* Google Gemini API Key

### Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your `.env` file (see Environment Variables section below).
4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Set up your frontend `.env` file.
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 8. Environment Variables

Create `.env` files in both the `Backend` and `Frontend` directories. **Never commit these files to version control.**

**Backend (`Backend/.env`):**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
```

**Frontend (`Frontend/.env`):**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 9. Usage

1. Navigate to `http://localhost:5173` in your browser.
2. Sign up or log in using the authentication screen.
3. Use the **Upload Data** page to provide a supported PDF bank statement.
4. Wait for the engine to parse, categorize, and run machine learning models against the data.
5. Explore the insights:
   * **Transactions**: View your ledger and basic insights.
   * **Categories**: Analyze your spending taxonomy and volume distributions.
   * **Anomalies**: Audit outlier transactions flagged by the AI.
   * **Forecast**: View predictive future spending bounds.

## 10. AI/ML Details

* **Hybrid Categorization**: Uses the Gemini API for NLP-based merchant identification. Transactions are intentionally batched into single prompts to minimize token usage, avoid rate limits, and reduce latency.
* **Anomaly Detection**: Powered by Scikit-Learn's `IsolationForest`. 
  * *Features*: Transaction amount, day of the week, and encoded category. 
  * *Why*: It is an unsupervised model, meaning it doesn't require pre-labeled "fraudulent" datasets. It isolates anomalies by evaluating variance against a 5% expected contamination rate.
* **Predictive Forecasting**: 
  * *6+ Months Data*: Uses Facebook `Prophet` with yearly seasonality tracking to model trends (e.g., holiday spending spikes).
  * *<3 Months Data*: Intelligently degrades to a Linear Weighted Moving Average (WMA), as complex time-series models hallucinate without sufficient historical data.

## 11. Future Improvements

1. **Broader Bank Support**: Expand the `pdf_parser` keyword mappings to support credit card statements and international banks.
2. **Custom Budget Thresholds**: Allow users to set manual limits per category and trigger UI alerts when forecasts predict a breach.
3. **Advanced ML Explanations**: Integrate SHAP (SHapley Additive exPlanations) values to give users deeper insights into exactly *why* a specific transaction was flagged as an anomaly.
4. **Export Functionality**: Implement CSV/PDF report generation for tax purposes directly from the ledger view.

## 12. Author

Karan Khedkar


