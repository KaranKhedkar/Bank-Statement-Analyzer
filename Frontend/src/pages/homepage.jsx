

import React from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Github,
  Network,
  Activity,
  Database,
  ArrowRight,
  UploadCloud,
  Filter,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default function Homepage() {
const pipelineSteps = [
    { icon: UploadCloud, label: "Ingestion", sub: "CSV / PDF" },
    { icon: Filter, label: "Sanitization", sub: "Regex / NLP" },
    { icon: Network, label: "Categorization", sub: "TF-IDF + SVM" },
    { icon: TrendingUp, label: "Forecasting", sub: "Prophet" },
    { icon: AlertTriangle, label: "Detection", sub: "iForest" }
  ];

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-300 selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col relative overflow-hidden">
      
      {/* Background Grid Texture */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-32px_32px mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>

      {/* =========================================
          SECTION 1: HERO
          ========================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-1">
        
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono tracking-wide shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.0 ML Pipeline Active
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
            AI-Powered <br />
            <span className="text-indigo-400 drop-shadow-sm">
              Bank Statement
            </span> Intelligence
          </h1>

          <p className="text-lg text-stone-400 max-w-lg leading-relaxed font-medium">
            An AI system that processes raw bank statements, automatically categorizes transactions, predicts future spending, and detects unusual activity.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
            <Link
              to="/dashboard/overview"
              className="flex items-center justify-center gap-2 bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-500 w-full sm:w-auto"
            >
              <Play size={18} fill="currentColor" /> Initialize Dashboard
            </Link>
            <button className="flex items-center justify-center gap-2 bg-stone-900 text-stone-300 border border-white/10 px-8 py-3.5 rounded-xl font-bold hover:bg-stone-800 hover:text-white transition-colors w-full sm:w-auto">
              <Github size={18} /> View Source
            </button>
          </div>
        </div>

        {/* Floating Technical Visual (with 3D physics mapping) */}
        <div className="relative w-full h-full flex justify-center lg:justify-end perspective-[2000px] group md:flex">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          
          <div className="w-full max-w-md bg-stone-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10 transform transition-transform duration-700 ease-out group-hover:-rotate-y-12 group-hover:rotate-x-6 group-hover:scale-[1.02]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-stone-950/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-teal-500/50"></div>
              </div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">inference_engine.json</span>
            </div>
            
            <div className="p-6 font-mono text-sm space-y-4">
              <div>
                <span className="text-stone-500 text-xs block mb-1">{"// Raw Ingestion"}</span>
                <div className="text-stone-400 bg-stone-950 p-3 rounded-lg border border-white/5 truncate">
                  <span className="text-rose-400">ACH</span> DEBIT UBER *TRIP SFO 2441
                </div>
              </div>
              
              <div className="flex justify-center text-stone-600">
                <ArrowRight size={18} className="rotate-90 md:rotate-0" />
              </div>

              <div>
                <span className="text-stone-500 text-xs block mb-1">{"// ML Output"}</span>
                <div className="bg-stone-950 p-4 rounded-lg border border-white/5 space-y-1.5">
                  <p><span className="text-indigo-400">"merchant"</span>: <span className="text-teal-300">"Uber"</span>,</p>
                  <p><span className="text-indigo-400">"category"</span>: <span className="text-teal-300">"Transport"</span>,</p>
                  <p><span className="text-indigo-400">"confidence"</span>: <span className="text-amber-300">0.98</span>,</p>
                  <p className="flex items-center gap-2">
                    <span className="text-indigo-400">"flagged"</span>: <span className="text-rose-400">false</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* =========================================
          SECTION 2: PIPELINE FLOW
          ========================================= */}
      <section className="relative z-10 py-16 border-y border-white/5 bg-stone-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest font-mono">
              // Autonomous Processing Sequence
            </h2>
          </div>

          <div className="relative w-full overflow-x-auto no-scrollbar pb-4">
            <div className="flex items-start justify-between min-w-225 gap-2 relative z-10">
              {pipelineSteps.map((step, index) => (
                <React.Fragment key={index}>
                  
                  {/* Pipeline Node */}
                  <div className="flex flex-col items-center w-36 group cursor-default">
                    <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-center mb-4 shadow-lg group-hover:-translate-y-1 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors"></div>
                      <step.icon size={24} className="text-stone-400 group-hover:text-indigo-400 transition-colors relative z-10" strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors text-center">
                      {step.label}
                    </h3>
                    <p className="text-[10px] font-mono text-stone-500 mt-1.5 text-center bg-stone-950/50 px-2.5 py-1 rounded border border-white/5">
                      {step.sub}
                    </p>
                  </div>

                  {/* Connecting Vector */}
                  {index < pipelineSteps.length - 1 && (
                    <div className="flex-1 mt-7.75 relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-dashed border-stone-800/80"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-stone-950 px-2 flex items-center justify-center">
                          <ArrowRight size={16} className="text-stone-700 group-hover:text-indigo-500/50 transition-colors" />
                        </div>
                      </div>
                    </div>
                  )}

                </React.Fragment>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          SECTION 3: CORE CAPABILITIES
          ========================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Network, title: "Vector Categorization", desc: "TF-IDF + SVM pipeline mapping messy strings to clean entities.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
            { icon: Activity, title: "Time-Series Forecast", desc: "Prophet additive models projecting 90-day expenditure horizons.", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
            { icon: Database, title: "Isolation Forest", desc: "Unsupervised anomaly detection flagging statistical outliers.", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" }
          ].map((item, i) => (
            <div key={i} className="bg-stone-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 ${item.bg}`}>
                <item.icon size={24} className={item.color} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          SECTION 4: MINIMAL FOOTER
          ========================================= */}
      <footer className="relative z-10 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 font-mono">
            &copy; {new Date().getFullYear()} LOGO. All systems nominal.
          </p>
          <div className="flex gap-6 text-xs font-medium text-stone-500">
            <button className="hover:text-stone-300 transition-colors cursor-pointer">API Documentation</button>
            <button className="hover:text-stone-300 transition-colors cursor-pointer">GitHub</button>
          </div>
        </div>
      </footer>

    </div>
  );
}