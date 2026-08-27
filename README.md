# Bank Statement Analyzer (AI Financial Telemetry)

Bank Statement Analyzer is an advanced, AI-powered personal finance telemetry platform. It allows users to upload raw bank statements (PDF/CSV), automatically parses and categorizes transactions using Large Language Models, detects spending anomalies via machine learning, and provides a conversational AI Copilot to interact with financial data. It bridges the gap between static bank statements and dynamic financial intelligence.

## 🚀 Key Features

* **Intelligent Document Parsing**: Automatically extracts and normalizes transaction data, amounts, dates, and closing balances from PDF or CSV bank statements using fallback-aware scraping (`pdfplumber`/regex).
* **AI Auto-Categorization**: Uses Groq's high-speed inference (`openai/gpt-oss-120b`) to instantly categorize raw merchant descriptions into clean, standardized expense categories.
* **Agentic Financial Copilot**: A multi-turn AI assistant with tool-calling capabilities that can calculate spending summaries, find specific transactions, simulate hypothetical "What If" scenarios, and dynamically render interactive UI charts based on your questions.
* **ML Anomaly Detection**: Uses Scikit-learn's Isolation Forest algorithm to detect statistical outliers in your spending, flagging unusually large expenses or abnormal categorical patterns.
* **Time-Series Forecasting**: Implements Facebook Prophet to project future monthly expenses with confidence intervals, allowing for proactive budget management.
* **Interactive Dashboards**: State-of-the-art dark-mode UI with glassmorphic elements, featuring Recharts for balance trajectories, income vs. expense bars, and category breakdown charts.

## 📸 Screenshots / Demo

*(Add links to screenshots or a demo video here)*

## 🛠 Tech Stack

**Frontend**
* React.js (Vite)
* Tailwind CSS (Styling)
* Zustand (State Management)
* Recharts (Data Visualization)
* Lucide React (Icons)

**Backend**
* Python 3 / FastAPI
* Pandas & NumPy (Data processing)
* Uvicorn (ASGI Server)

**Database & Auth**
* Supabase (PostgreSQL, Row Level Security, JWT Authentication)

**AI / Machine Learning**
* Groq SDK (`openai/gpt-oss-120b` for categorization & agentic Copilot)
* Scikit-learn (`IsolationForest` for anomaly detection)
* Facebook Prophet (Expense forecasting)
* `pdfplumber` (Document parsing)

## ⚙️ How It Works

1. **Ingestion**: The user authenticates via Supabase and uploads a bank statement (PDF/CSV).
2. **Parsing & ML Pipeline**: The FastAPI backend routes the file to `pdf_parser.py`. Text and tables are extracted. If standard tabular extraction fails, it falls back to regex-based line parsing.
3. **AI Categorization**: Uncategorized transactions are batched and sent to Groq. The LLM returns a structured JSON map assigning each transaction to a standard category (e.g., Food & Dining, Utilities).
4. **Data Persistence**: Cleaned and categorized transactions are inserted into the Supabase PostgreSQL database under the user's isolated Row Level Security (RLS) policy.
5. **Analytics & Copilot**: The frontend dashboard fetches the data. Users can chat with the Copilot, which uses function-calling to execute Python tools on the backend (e.g., `get_spending_summary`, `simulate_what_if`) and returns natural language insights mixed with interactive Recharts configurations.

## 📁 Project Structure

```text
.
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI widgets and charts
│   │   ├── lib/             # API clients (Supabase, fetch wrappers)
│   │   ├── pages/           # Main route views (Dashboard, Anomalies, Copilot, etc.)
│   │   └── store/           # Zustand global state management
│   ├── index.html
│   └── package.json
│
├── Backend/
│   ├── agent/               # Groq-powered Copilot engine and tool definitions
│   ├── categorizer/         # AI/LLM transaction categorization logic
│   ├── models/              # Prophet forecasting implementations
│   ├── parsers/             # PDF and CSV ingestion engines
│   ├── routers/             # FastAPI endpoints (upload, anomalies, copilot, forecast)
│   ├── main.py              # FastAPI application entry point
│   └── requirements.txt
```

## 💻 Installation & Setup

### Prerequisites
* Node.js (v18+)
* Python (3.10+)
* A Supabase project (URL and Anon Key)
* A Groq API Key

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Bank-Statement-Analyzer
```

### 2. Backend Setup
```bash
cd Backend
python -m venv venv
# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd Frontend
npm install
```

### 4. Environment Variables Setup
Create `.env` files in both the Frontend and Backend directories. See the **Environment Variables** section below.

### 5. Run the Application
**Start the Backend (FastAPI):**
```bash
cd Backend
# Ensure your venv is activated
uvicorn main:app --reload
```

**Start the Frontend (React/Vite):**
```bash
cd Frontend
npm run dev
```
Access the application at `http://localhost:5173`.

## 🔐 Environment Variables

**Frontend (`Frontend/.env`)**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

**Backend (`Backend/.env`)**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```
*Note: Never commit your `.env` files to version control.*

## 📖 Usage

1. **Sign Up / Log In**: Create an account using the Supabase Auth flow on the login page.
2. **Upload Data**: Navigate to the "Upload Data" section and drop your Bank PDF or CSV statement. The system will parse and categorize it automatically.
3. **View Dashboard**: Check the Transactions and Overview tabs to see your parsed closing balances, categorical spending, and net position.
4. **Detect Anomalies**: Go to the Anomalies tab and click "Run ML Detection" to identify unusual charges.
5. **Chat with Copilot**: Navigate to the AI Copilot and ask questions like "How much did I spend on Food last month?" or "What if I reduce my Shopping by 20%?" to see interactive charts and savings projections.

## 🧠 AI/ML Details

* **Auto-Categorizer**: Utilizes Groq's `openai/gpt-oss-120b` via few-shot prompting to map transaction descriptions to predefined financial categories. Ensures high accuracy for cryptic merchant names.
* **Anomaly Detection (Isolation Forest)**: An unsupervised learning algorithm from Scikit-learn. It evaluates the transaction amount, day of the week, and categorical frequency. The `contamination` factor dynamically scales based on the dataset size to isolate statistically significant outliers (e.g., a ₹40,000 charge in a category where the user normally spends ₹500).
* **Time-Series Forecasting**: Uses Facebook Prophet to decompose historical spending into trend and seasonality. It projects a forward-looking expense trajectory with confidence intervals.
* **Agentic Tool Calling**: The Copilot does not hallucinate numbers. It is provided a set of deterministic Python functions (`get_spending_summary`, `simulate_what_if`, etc.) via the OpenAI function-calling schema. It routes the user's natural language query to the appropriate tool, executes it on the in-memory dataframe, and synthesizes the exact mathematical result into its response.

## 🚀 Future Improvements

1. **Multi-Bank Plaid Integration**: Move beyond manual PDF/CSV uploads by integrating direct bank connections via Plaid or similar aggregators for real-time syncing.
2. **Custom Budget Alerts**: Allow users to set hard limits on specific categories and receive automated email/push notifications when the forecasting model predicts they will exceed the budget.
3. **Receipt Matching**: Add OCR capabilities to upload receipt images and automatically match them to their corresponding ledger transactions for tax purposes.
4. **Advanced Investment Tracking**: Expand the Copilot's "What If" simulator into a full portfolio tracker that monitors real-time market returns on detected SIPs and recurring investments.

## 📝 License

This project currently has no associated license.
