import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Github,
  Bot,
  Sliders,
  TrendingUp,
  ShieldAlert,
  FileText,
  Zap,
  ArrowRight,
  BarChart3,
  Layers,
  Database,
  Code2,
  Terminal,
  Activity,
  CheckCircle2,
  Cpu
} from "lucide-react";

export default function Homepage() {
  const [activeTab, setActiveTab] = useState("copilot");

  const terminalDemos = {
    copilot: {
      tag: "Agentic Tool Calling",
      command: 'copilot.query("Compare dining vs shopping and project impact")',
      pipeline: "LLM Reasoner -> tool_call(compare_periods) -> tool_call(simulate_what_if)",
      output: [
        { key: "execution_time", val: "380ms (Groq 120B)" },
        { key: "tool_invoked", val: "agent.tools.compare_periods(timeframe='30d')" },
        { key: "food_and_dining", val: "₹14,200 (-12% MoM shift)" },
        { key: "shopping_spend", val: "₹18,450 (+24% MoM shift)" },
        { key: "dynamic_ui_chart", val: "Recharts: BarChart(grouped=true, anim=true)" }
      ]
    },
    whatif: {
      tag: "Natural Language Simulation",
      command: 'whatif.simulate("Cut shopping by 30% and invest ₹5000/mo at 12%")',
      pipeline: "NLP Parser -> JSON Args -> agent.tools.simulate_what_if()",
      output: [
        { key: "parsed_adjustments", val: "{ 'Shopping': -0.30 }" },
        { key: "monthly_cash_freed", val: "₹5,535 / month" },
        { key: "annual_savings", val: "₹66,420 / year" },
        { key: "projected_12m_sip", val: "₹1,48,200 (at 12.0% compound return)" },
        { key: "timeline_datapoints", val: "12 forward monthly projections" }
      ]
    },
    anomalies: {
      tag: "Isolation Forest ML",
      command: 'ml.detect_anomalies(model="IsolationForest", contamination=0.03)',
      pipeline: "Pandas Feature Matrix -> sklearn.ensemble.IsolationForest -> LLM Diagnostic",
      output: [
        { key: "flagged_transaction", val: "₹24,999.00 — APPLE STORE INDIRANAGAR" },
        { key: "anomaly_score", val: "-0.742 (High statistical outlier)" },
        { key: "category_mean", val: "₹3,670 (6.8x category deviation)" },
        { key: "root_cause_summary", val: "Single-day expenditure outlier in Electronics" },
        { key: "status", val: "Pending user confirmation" }
      ]
    },
    forecast: {
      tag: "Facebook Prophet",
      command: 'models.prophet.predict_all_categories(horizon=90)',
      pipeline: "Time-Series Aggregation -> Prophet.fit() -> Seasonality Decomposition",
      output: [
        { key: "forecast_horizon", val: "90 Days (Monthly confidence intervals)" },
        { key: "seasonality_components", val: "Weekly & Monthly additive trends" },
        { key: "predicted_next_month", val: "₹48,250 ± 8.4% interval" },
        { key: "top_risk_driver", val: "Food & Dining (Upward trend +14%)" }
      ]
    }
  };

  const architectureStages = [
    {
      num: "01",
      name: "Document Ingestion",
      tech: "PDFPlumber + Regex Fallback",
      desc: "Robust extraction of date, description, debit/credit amount, and balance trajectories from non-standard statements.",
      icon: FileText,
      badge: "Parser Engine"
    },
    {
      num: "02",
      name: "LLM Classification",
      tech: "Groq (GPT-OSS 120B)",
      desc: "Few-shot prompt-engineered inference mapping messy merchant strings to 40+ standardized financial categories.",
      icon: Zap,
      badge: "LLM Inference"
    },
    {
      num: "03",
      name: "Anomaly Detection",
      tech: "Scikit-Learn IsolationForest",
      desc: "Unsupervised statistical outlier detection evaluating transaction volume, frequency, and category-level deviations.",
      icon: ShieldAlert,
      badge: "Unsupervised ML"
    },
    {
      num: "04",
      name: "Time-Series Forecasting",
      tech: "Facebook Prophet",
      desc: "Additive regression modeling spending seasonality, growth trends, and 90-day forward budget confidence intervals.",
      icon: TrendingUp,
      badge: "Time-Series"
    },
    {
      num: "05",
      name: "Agentic Copilot",
      tech: "Deterministic Tool Calling",
      desc: "Multi-turn assistant executing in-memory Pandas tools without hallucinations, rendering dynamic client-side charts.",
      icon: Bot,
      badge: "Reasoning Agent"
    }
  ];

  const techStack = [
    { category: "Frontend Engine", items: ["React 19 (Vite)", "Tailwind CSS", "Zustand State", "Recharts Visualizations", "Lucide Icons"] },
    { category: "Backend Architecture", items: ["Python 3.11", "FastAPI (ASGI)", "Pandas & NumPy", "Uvicorn Server", "Pydantic Schemas"] },
    { category: "AI & Machine Learning", items: ["Groq SDK (GPT-OSS 120B)", "Scikit-learn (IsolationForest)", "Facebook Prophet", "PDFPlumber"] },
    { category: "Database & Security", items: ["Supabase PostgreSQL", "Row-Level Security (RLS)", "JWT Authentication", "Client-Side Token Auth"] }
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col relative overflow-x-hidden">
      
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      {/* ── TOP HEADER / NAV ── */}
      <nav className="sticky top-0 z-50 bg-stone-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer select-none">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 via-indigo-600 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <div className="w-full h-full bg-stone-950 rounded-[11px] flex items-center justify-center">
                <Cpu size={15} className="text-indigo-400" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">FinSight AI</span>
              <span className="text-[10px] font-mono text-stone-500 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                v3.0-ML
              </span>
            </div>
          </Link>

          {/* Navigation Anchors */}
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-400">
            <a href="#pipeline" className="hover:text-stone-200 transition-colors">Pipeline</a>
            <a href="#terminal-preview" className="hover:text-stone-200 transition-colors">Telemetry</a>
            <a href="#features" className="hover:text-stone-200 transition-colors">Core Modules</a>
            <a href="#tech-stack" className="hover:text-stone-200 transition-colors">Tech Stack</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-xs text-stone-400 hover:text-stone-200 font-medium px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard/overview"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-500/30"
            >
              <Play size={12} fill="currentColor" />
              <span>Launch Dashboard</span>
            </Link>
          </div>

        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-20 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        
        {/* Left Column: Technical Overview */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Engineering Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Full-Stack ML & LLM Engineering Project</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
            AI-Powered <br />
            <span className="text-indigo-400">Bank Statement</span> Telemetry
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-stone-400 max-w-lg leading-relaxed font-normal">
            An end-to-end intelligence system that ingests raw bank statements (PDF/CSV), standardizes transactions with <strong>Groq (120B)</strong>, detects statistical outliers via <strong>Isolation Forest</strong>, forecasts expenditure with <strong>Prophet</strong>, and enables an <strong>agentic Copilot</strong> with deterministic tool execution and dynamic charts.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              to="/dashboard/overview"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all border border-indigo-500/40"
            >
              <Play size={13} fill="currentColor" />
              <span>Open Application</span>
            </Link>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold px-5 py-3 rounded-xl border border-white/10 transition-colors"
            >
              <Github size={14} />
              <span>View Source Code</span>
            </a>
          </div>

          {/* Technical Metric Pills */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
            <div className="bg-stone-900/60 border border-white/5 p-3 rounded-xl">
              <p className="text-xs text-stone-400">Inference</p>
              <p className="text-sm font-bold text-white font-mono mt-0.5">&lt; 0.8s (Groq)</p>
            </div>
            <div className="bg-stone-900/60 border border-white/5 p-3 rounded-xl">
              <p className="text-xs text-stone-400">ML Anomaly</p>
              <p className="text-sm font-bold text-rose-400 font-mono mt-0.5">iForest</p>
            </div>
            <div className="bg-stone-900/60 border border-white/5 p-3 rounded-xl">
              <p className="text-xs text-stone-400">Time-Series</p>
              <p className="text-sm font-bold text-indigo-400 font-mono mt-0.5">90d Prophet</p>
            </div>
          </div>

        </div>

        {/* Right Column: Live Interactive Telemetry Terminal */}
        <div id="terminal-preview" className="lg:col-span-6">
          <div className="bg-stone-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Terminal Window Bar */}
            <div className="px-4 py-3 bg-stone-950/70 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="text-[11px] font-mono text-stone-400 ml-2">telemetry_runtime.py</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-stone-400">STATUS: 200 OK</span>
              </div>
            </div>

            {/* Sub-module Switcher */}
            <div className="grid grid-cols-4 bg-stone-950/40 border-b border-white/5 p-1 gap-1">
              {[
                { id: "copilot", label: "Copilot", icon: Bot },
                { id: "whatif", label: "What-If", icon: Sliders },
                { id: "anomalies", label: "Anomalies", icon: ShieldAlert },
                { id: "forecast", label: "Forecast", icon: TrendingUp }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <tab.icon size={12} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Code / Execution Output Box */}
            <div className="p-5 font-mono text-xs space-y-3.5 bg-stone-950/60">
              
              {/* Command Invoked */}
              <div>
                <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">
                  // {terminalDemos[activeTab].tag} Execution
                </span>
                <div className="bg-stone-950 p-2.5 rounded-lg border border-white/5 text-stone-300 overflow-x-auto">
                  <span className="text-indigo-400">&gt; </span>
                  {terminalDemos[activeTab].command}
                </div>
              </div>

              {/* Execution Pipeline Route */}
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <Terminal size={12} className="text-purple-400 shrink-0" />
                <span className="truncate">{terminalDemos[activeTab].pipeline}</span>
              </div>

              {/* Parsed JSON Response */}
              <div>
                <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">// Response Payload</span>
                <div className="bg-stone-950 p-3.5 rounded-lg border border-white/5 space-y-1 text-[11px] text-stone-300">
                  {terminalDemos[activeTab].output.map((row, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 py-0.5 border-b border-white/5 last:border-none">
                      <span className="text-indigo-300 shrink-0">{row.key}:</span>
                      <span className="text-stone-200 text-right truncate">{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Status Footer */}
            <div className="px-4 py-2.5 bg-stone-950/90 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-stone-400">
              <span>Deterministic Mode: ACTIVE</span>
              <span className="text-emerald-400">Zero Hallucination Guarantee</span>
            </div>

          </div>
        </div>

      </section>

      {/* ── 5-STAGE AUTONOMOUS PIPELINE ── */}
      <section id="pipeline" className="py-16 border-t border-white/5 bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-12 space-y-2">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">// System Architecture</p>
            <h2 className="text-2xl font-bold text-white tracking-tight">5-Stage Financial Processing Sequence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {architectureStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div
                  key={idx}
                  className="bg-stone-900/60 border border-white/5 hover:border-white/15 p-4 rounded-xl transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-950 border border-white/10 flex items-center justify-center text-stone-300 group-hover:text-indigo-400 transition-colors">
                        <Icon size={16} />
                      </div>
                      <span className="text-[10px] font-mono text-stone-400 font-bold">{stage.num}</span>
                    </div>

                    <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                      {stage.name}
                    </h3>
                    <p className="text-[10px] font-mono text-indigo-400/90 mb-2">
                      {stage.tech}
                    </p>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── CORE MODULES ── */}
      <section id="features" className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-12 space-y-2">
            <p className="text-xs font-bold text-purple-400 uppercase tracking-widest font-mono">// Core Modules</p>
            <h2 className="text-2xl font-bold text-white tracking-tight">Technical Highlights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-stone-900/50 border border-white/5 hover:border-indigo-500/30 p-6 rounded-2xl transition-all space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Bot size={18} />
              </div>
              <h3 className="text-sm font-bold text-white">Agentic Copilot with Tool-Calling</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Uses Groq 120B equipped with a function-calling tool registry. Executes deterministic Python handlers (<code className="text-indigo-300 font-mono text-[10px]">compare_periods</code>, <code className="text-indigo-300 font-mono text-[10px]">simulate_what_if</code>) ensuring zero factual hallucinations.
              </p>
            </div>

            <div className="bg-stone-900/50 border border-white/5 hover:border-purple-500/30 p-6 rounded-2xl transition-all space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sliders size={18} />
              </div>
              <h3 className="text-sm font-bold text-white">Natural Language What-If Lab</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Accepts unstructured hypothetical prompts, parses target category budget reductions and SIP parameters, and simulates forward compound trajectories over custom horizons.
              </p>
            </div>

            <div className="bg-stone-900/50 border border-white/5 hover:border-rose-500/30 p-6 rounded-2xl transition-all space-y-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldAlert size={18} />
              </div>
              <h3 className="text-sm font-bold text-white">Isolation Forest Anomaly Detection</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Evaluates multi-dimensional transaction features to isolate statistical outliers. Pairs flagged transactions with automated root-cause LLM diagnostic reports.
              </p>
            </div>

            <div className="bg-stone-900/50 border border-white/5 hover:border-amber-500/30 p-6 rounded-2xl transition-all space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-sm font-bold text-white">Prophet Seasonality Forecasting</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Decomposes past expenditure into weekly and monthly cyclical seasonality, outputting 90-day forward-looking spending projections with lower/upper uncertainty intervals.
              </p>
            </div>

            <div className="bg-stone-900/50 border border-white/5 hover:border-cyan-500/30 p-6 rounded-2xl transition-all space-y-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <BarChart3 size={18} />
              </div>
              <h3 className="text-sm font-bold text-white">Dynamic Recharts Rendering</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                The agent dynamically returns Recharts configuration payloads within its response stream, rendering customized bar and area visualizations in real-time.
              </p>
            </div>

            <div className="bg-stone-900/50 border border-white/5 hover:border-emerald-500/30 p-6 rounded-2xl transition-all space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Database size={18} />
              </div>
              <h3 className="text-sm font-bold text-white">Supabase PostgreSQL & RLS</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Transactions, anomaly logs, and parsed ledgers are persisted in PostgreSQL with strict Row-Level Security (RLS) and JWT auth ensuring multi-tenant data isolation.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── TECH STACK BREAKDOWN ── */}
      <section id="tech-stack" className="py-16 border-t border-white/5 bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-10 space-y-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest font-mono">// Implementation Stack</p>
            <h2 className="text-2xl font-bold text-white tracking-tight">Technologies & Libraries</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map((col, idx) => (
              <div key={idx} className="bg-stone-900/40 border border-white/5 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Code2 size={15} className="text-indigo-400" />
                  <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider">{col.category}</h3>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-400 font-mono">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-stone-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-stone-950 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-stone-300">FinSight AI</span>
            <span>—</span>
            <span>Machine Learning & LLM Bank Statement Telemetry System</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/dashboard/overview" className="hover:text-stone-300 transition-colors">Launch Dashboard</Link>
            <Link to="/dashboard/copilot" className="hover:text-stone-300 transition-colors">Copilot Lab</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-stone-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}