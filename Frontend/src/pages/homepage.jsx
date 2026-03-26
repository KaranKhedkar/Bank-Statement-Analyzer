

// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   Play,
//   Github,
//   Network,
//   Activity,
//   Database,
//   ArrowRight,
//   UploadCloud,
//   Filter,
//   TrendingUp,
//   AlertTriangle
// } from "lucide-react";

// export default function Homepage() {
// const pipelineSteps = [
//     { icon: UploadCloud, label: "Ingestion", sub: "CSV / PDF" },
//     { icon: Filter, label: "Sanitization", sub: "Regex / NLP" },
//     { icon: Network, label: "Categorization", sub: "TF-IDF + SVM" },
//     { icon: TrendingUp, label: "Forecasting", sub: "Prophet" },
//     { icon: AlertTriangle, label: "Detection", sub: "iForest" }
//   ];

//   return (
//     <div className="min-h-screen bg-stone-950 font-sans text-stone-300 selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col relative overflow-hidden">
      
//       {/* Background Grid Texture */}
//       <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-32px_32px mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>

//       {/* =========================================
//           SECTION 1: HERO
//           ========================================= */}
//       <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-1">
        
//         <div className="space-y-8">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono tracking-wide shadow-sm">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
//             </span>
//             v2.0 ML Pipeline Active
//           </div>

//           <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
//             AI-Powered <br />
//             <span className="text-indigo-400 drop-shadow-sm">
//               Bank Statement
//             </span> Intelligence
//           </h1>

//           <p className="text-lg text-stone-400 max-w-lg leading-relaxed font-medium">
//             An AI system that processes raw bank statements, automatically categorizes transactions, predicts future spending, and detects unusual activity.
//           </p>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
//             <Link
//               to="/dashboard/overview"
//               className="flex items-center justify-center gap-2 bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-500 w-full sm:w-auto"
//             >
//               <Play size={18} fill="currentColor" /> Initialize Dashboard
//             </Link>
//             <button className="flex items-center justify-center gap-2 bg-stone-900 text-stone-300 border border-white/10 px-8 py-3.5 rounded-xl font-bold hover:bg-stone-800 hover:text-white transition-colors w-full sm:w-auto">
//               <Github size={18} /> View Source
//             </button>
//           </div>
//         </div>

//         {/* Floating Technical Visual (with 3D physics mapping) */}
//         <div className="relative w-full h-full flex justify-center lg:justify-end perspective-[2000px] group md:flex">
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          
//           <div className="w-full max-w-md bg-stone-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10 transform transition-transform duration-700 ease-out group-hover:-rotate-y-12 group-hover:rotate-x-6 group-hover:scale-[1.02]">
//             <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-stone-950/50">
//               <div className="flex gap-1.5">
//                 <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
//                 <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
//                 <div className="w-3 h-3 rounded-full bg-teal-500/50"></div>
//               </div>
//               <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">inference_engine.json</span>
//             </div>
            
//             <div className="p-6 font-mono text-sm space-y-4">
//               <div>
//                 <span className="text-stone-500 text-xs block mb-1">{"// Raw Ingestion"}</span>
//                 <div className="text-stone-400 bg-stone-950 p-3 rounded-lg border border-white/5 truncate">
//                   <span className="text-rose-400">ACH</span> DEBIT UBER *TRIP SFO 2441
//                 </div>
//               </div>
              
//               <div className="flex justify-center text-stone-600">
//                 <ArrowRight size={18} className="rotate-90 md:rotate-0" />
//               </div>

//               <div>
//                 <span className="text-stone-500 text-xs block mb-1">{"// ML Output"}</span>
//                 <div className="bg-stone-950 p-4 rounded-lg border border-white/5 space-y-1.5">
//                   <p><span className="text-indigo-400">"merchant"</span>: <span className="text-teal-300">"Uber"</span>,</p>
//                   <p><span className="text-indigo-400">"category"</span>: <span className="text-teal-300">"Transport"</span>,</p>
//                   <p><span className="text-indigo-400">"confidence"</span>: <span className="text-amber-300">0.98</span>,</p>
//                   <p className="flex items-center gap-2">
//                     <span className="text-indigo-400">"flagged"</span>: <span className="text-rose-400">false</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//      {/* =========================================
//           SECTION 2: PIPELINE FLOW
//           ========================================= */}
//       <section className="relative z-10 py-16 border-y border-white/5 bg-stone-950/40 backdrop-blur-md">
//         <div className="max-w-7xl mx-auto px-6">
          
//           <div className="text-center mb-12">
//             <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest font-mono">
//               // Autonomous Processing Sequence
//             </h2>
//           </div>

//           <div className="relative w-full overflow-x-auto no-scrollbar pb-4">
//             <div className="flex items-start justify-between min-w-225 gap-2 relative z-10">
//               {pipelineSteps.map((step, index) => (
//                 <React.Fragment key={index}>
                  
//                   {/* Pipeline Node */}
//                   <div className="flex flex-col items-center w-36 group cursor-default">
//                     <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-center mb-4 shadow-lg group-hover:-translate-y-1 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] transition-all duration-300 relative overflow-hidden">
//                       <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors"></div>
//                       <step.icon size={24} className="text-stone-400 group-hover:text-indigo-400 transition-colors relative z-10" strokeWidth={1.5} />
//                     </div>
                    
//                     <h3 className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors text-center">
//                       {step.label}
//                     </h3>
//                     <p className="text-[10px] font-mono text-stone-500 mt-1.5 text-center bg-stone-950/50 px-2.5 py-1 rounded border border-white/5">
//                       {step.sub}
//                     </p>
//                   </div>

//                   {/* Connecting Vector */}
//                   {index < pipelineSteps.length - 1 && (
//                     <div className="flex-1 mt-7.75 relative">
//                       <div className="absolute inset-0 flex items-center">
//                         <div className="w-full border-t-2 border-dashed border-stone-800/80"></div>
//                       </div>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="bg-stone-950 px-2 flex items-center justify-center">
//                           <ArrowRight size={16} className="text-stone-700 group-hover:text-indigo-500/50 transition-colors" />
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                 </React.Fragment>
//               ))}
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* =========================================
//           SECTION 3: CORE CAPABILITIES
//           ========================================= */}
//       <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {[
//             { icon: Network, title: "Vector Categorization", desc: "TF-IDF + SVM pipeline mapping messy strings to clean entities.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
//             { icon: Activity, title: "Time-Series Forecast", desc: "Prophet additive models projecting 90-day expenditure horizons.", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
//             { icon: Database, title: "Isolation Forest", desc: "Unsupervised anomaly detection flagging statistical outliers.", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" }
//           ].map((item, i) => (
//             <div key={i} className="bg-stone-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
//               <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 ${item.bg}`}>
//                 <item.icon size={24} className={item.color} />
//               </div>
//               <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
//               <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* =========================================
//           SECTION 4: MINIMAL FOOTER
//           ========================================= */}
//       <footer className="relative z-10 border-t border-white/5 mt-auto">
//         <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
//           <p className="text-xs text-stone-500 font-mono">
//             &copy; {new Date().getFullYear()} LOGO. All systems nominal.
//           </p>
//           <div className="flex gap-6 text-xs font-medium text-stone-500">
//             <button className="hover:text-stone-300 transition-colors cursor-pointer">API Documentation</button>
//             <button className="hover:text-stone-300 transition-colors cursor-pointer">GitHub</button>
//           </div>
//         </div>
//       </footer>

//     </div>
//   );
// }











import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Play, Github, Network, Activity, Database,
  ArrowRight, UploadCloud, Filter, TrendingUp, AlertTriangle
} from "lucide-react";

export default function Homepage() {
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredCap, setHoveredCap] = useState(null);

  const pipelineSteps = [
    { icon: UploadCloud,    label: "Ingestion",      sub: "CSV / PDF",    num: "01", color: "#4ade80" },
    { icon: Filter,         label: "Sanitization",   sub: "Regex / NLP",  num: "02", color: "#38bdf8" },
    { icon: Network,        label: "Categorization", sub: "TF-IDF + SVM", num: "03", color: "#a78bfa" },
    { icon: TrendingUp,     label: "Forecasting",    sub: "Prophet",      num: "04", color: "#fb923c" },
    { icon: AlertTriangle,  label: "Detection",      sub: "iForest",      num: "05", color: "#f472b6" },
  ];

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setActiveStep(p => (p + 1) % 5), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#0e0e11", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes ping {
          0%    { transform: scale(1); opacity: 0.8; }
          100%  { transform: scale(2.2); opacity: 0; }
        }

        .fade-in { opacity: 0; }
        .fade-in.go { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
        .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.17s; }
        .d3 { animation-delay: 0.3s; }  .d4 { animation-delay: 0.44s; }
        .d5 { animation-delay: 0.58s; }

        .ticker-track {
          display: flex; width: max-content;
          animation: ticker 26s linear infinite;
        }
        .ticker-track:hover { animation-play-state: paused; }

        .cursor { animation: blink 1.1s step-end infinite; }

        .step-pill {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 20px 16px;
          background: #13131a;
          transition: border-color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .step-pill.active {
          border-color: rgba(255,255,255,0.15);
          background: #1a1a24;
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
        }
        .step-pill::before {
          content: '';
          position: absolute; inset: 0;
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 12px;
        }
        .step-pill.active::before { opacity: 1; }

        .cap-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px;
          background: #13131a;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .cap-card:hover {
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.5);
        }
        .cap-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .cap-card:hover::after { opacity: 1; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #6366f1;
          color: #fff;
          border: 1px solid #6366f1;
          border-radius: 8px;
          padding: 11px 24px;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600;
          text-decoration: none;
          transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
          letter-spacing: -0.01em;
        }
        .btn-primary:hover {
          background: #818cf8;
          box-shadow: 0 0 24px rgba(99,102,241,0.35);
          transform: translateY(-1px);
        }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 8px;
          padding: 11px 22px;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          letter-spacing: -0.01em;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.09);
          color: #e2e8f0;
          border-color: rgba(255,255,255,0.16);
        }

        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px; font-weight: 500;
          color: #94a3b8;
          background: rgba(255,255,255,0.04);
          letter-spacing: 0.01em;
        }

        .tag-chip {
          display: inline-block;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 10px; font-weight: 500;
          color: #64748b;
          background: rgba(255,255,255,0.03);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); }

        .stat-num {
          font-size: 36px; font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .section-eyebrow {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #475569;
        }

        .section-title {
          font-size: 22px; font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }

        .code-surface {
          background: #0a0a0d;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          overflow: hidden;
        }

        .glow-ring {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .pipeline-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .cap-grid      { grid-template-columns: 1fr !important; }
          .split-grid    { grid-template-columns: 1fr !important; }
          .hero-grid     { grid-template-columns: 1fr !important; }
          .stats-row     { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(14,14,17,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Database size={14} color="#fff" strokeWidth={2} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", letterSpacing: "-0.01em" }}>BSI</span>
            <span style={{ fontSize: 11, color: "#475569", marginLeft: 2 }}>v2.0</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", width: 7, height: 7 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#4ade80", animation: "ping 1.8s ease-out infinite" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#4ade80" }} />
            </div>
            <span style={{ fontSize: 11, color: "#475569", letterSpacing: "0.03em" }}>Pipeline Active</span>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 64px", position: "relative" }}>

        {/* Background glows */}
        <div className="glow-ring" style={{ width: 500, height: 400, background: "rgba(99,102,241,0.07)", top: -100, left: "30%" }} />
        <div className="glow-ring" style={{ width: 300, height: 300, background: "rgba(139,92,246,0.05)", top: 0, right: 0 }} />

        <div className={`fade-in d1 ${mounted ? "go" : ""}`} style={{ marginBottom: 20 }}>
          <div className="badge">
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
            ML Engineering Project — 2024
          </div>
        </div>

        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 56, alignItems: "center" }}>

          {/* Left */}
          <div>
            <div className={`fade-in d2 ${mounted ? "go" : ""}`}>
              <h1 style={{ fontSize: "clamp(38px, 5.5vw, 64px)", fontWeight: 700, color: "#f8fafc", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20 }}>
                AI-Powered{" "}
                <span style={{ color: "#818cf8" }}>Bank Statement</span>{" "}
                Intelligence
              </h1>
            </div>

            <div className={`fade-in d3 ${mounted ? "go" : ""}`}>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.75, maxWidth: 440, marginBottom: 32 }}>
                End-to-end ML pipeline that ingests raw bank statements, categorizes transactions via TF-IDF + SVM, forecasts 90-day spending with Prophet, and detects anomalies using Isolation Forest.
              </p>
            </div>

            <div className={`fade-in d4 ${mounted ? "go" : ""}`} style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 48 }}>
              <Link to="/dashboard/overview" className="btn-primary">
                <Play size={13} fill="currentColor" /> Initialize Dashboard
              </Link>
              <button className="btn-ghost">
                <Github size={14} /> View Source
              </button>
            </div>

            {/* Stats */}
            <div className={`fade-in d5 ${mounted ? "go" : ""}`}>
              <hr className="divider" style={{ marginBottom: 28 }} />
              <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {[
                  { n: "98%",    l: "Categorization Acc." },
                  { n: "90d",    l: "Forecast Horizon"    },
                  { n: "5-Step", l: "ML Pipeline"         },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="stat-num">{s.n}</p>
                    <p style={{ fontSize: 11, color: "#475569", marginTop: 5, fontWeight: 500, letterSpacing: "0.02em" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — terminal */}
          <div className={`fade-in d4 ${mounted ? "go" : ""}`}>
            <div className="code-surface">
              {/* titlebar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d0d10" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.6 }} />)}
                </div>
                <span style={{ fontSize: 10, color: "#334155", letterSpacing: "0.08em", fontWeight: 500 }}>inference_engine.json</span>
              </div>

              {/* code */}
              <div style={{ padding: "20px 20px", fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: 12, lineHeight: 1.9, color: "#94a3b8" }}>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ color: "#334155" }}>{"// raw input"}</span><br />
                  <span style={{ color: "#f472b6" }}>ACH</span>{" DEBIT UBER *TRIP SFO 2441"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0", color: "#334155" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                  <ArrowRight size={11} />
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                </div>
                <div>
                  <span style={{ color: "#334155" }}>{"// ml output"}</span><br />
                  {"{"}<br />
                  {"  "}<span style={{ color: "#818cf8" }}>"merchant"</span>{":    "}<span style={{ color: "#4ade80" }}>"Uber"</span>{","}<br />
                  {"  "}<span style={{ color: "#818cf8" }}>"category"</span>{":    "}<span style={{ color: "#4ade80" }}>"Transport"</span>{","}<br />
                  {"  "}<span style={{ color: "#818cf8" }}>"confidence"</span>{":  "}<span style={{ color: "#fb923c" }}>0.98</span>{","}<br />
                  {"  "}<span style={{ color: "#818cf8" }}>"flagged"</span>{":     "}<span style={{ color: "#f87171" }}>false</span><br />
                  {"}"}<span className="cursor" style={{ color: "#6366f1", marginLeft: 2 }}>▋</span>
                </div>
              </div>

              {/* bottom bar */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 16px", display: "flex", justifyContent: "space-between", background: "#0a0a0d" }}>
                <span style={{ fontSize: 10, color: "#1e293b", fontFamily: "monospace" }}>tfidf-svm-v2</span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80" }} />
                  <span style={{ fontSize: 10, color: "#1e293b", fontFamily: "monospace" }}>confidence: 98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PIPELINE TICKER ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0b0b0e", overflow: "hidden" }}>
        <div className="ticker-track" style={{ padding: "13px 0" }}>
          {[...pipelineSteps,...pipelineSteps,...pipelineSteps,...pipelineSteps].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 28px", borderRight: "1px solid rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>
              <s.icon size={12} style={{ color: s.color, flexShrink: 0 }} strokeWidth={1.5} />
              <span style={{ fontSize: 11, color: "#475569", fontWeight: 500, letterSpacing: "0.04em" }}>{s.num} / {s.label}</span>
              <span style={{ fontSize: 10, color: "#1e293b", fontFamily: "monospace" }}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PIPELINE STEPS ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <p className="section-eyebrow" style={{ marginBottom: 6 }}>Processing Sequence</p>
            <h2 className="section-title">5-Stage Pipeline</h2>
          </div>
          <span className="tag-chip">Autonomous</span>
        </div>

        <div className="pipeline-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {pipelineSteps.map((step, i) => (
            <div
              key={i}
              className={`step-pill ${activeStep === i ? "active" : ""}`}
              style={{ "--step-color": step.color }}
              onMouseEnter={() => setActiveStep(i)}
            >
              {/* top accent line when active */}
              {activeStep === i && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, borderRadius: "12px 12px 0 0", background: step.color }} />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: activeStep === i ? `${step.color}18` : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${activeStep === i ? step.color + "35" : "rgba(255,255,255,0.07)"}`, transition: "all 0.25s" }}>
                  <step.icon size={16} style={{ color: activeStep === i ? step.color : "#475569", transition: "color 0.25s" }} strokeWidth={1.5} />
                </div>
                <span style={{ fontSize: 10, color: "#1e293b", fontFamily: "monospace", fontWeight: 600 }}>{step.num}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: activeStep === i ? "#f1f5f9" : "#94a3b8", marginBottom: 4, transition: "color 0.25s" }}>{step.label}</p>
              <p style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: "0.05em" }}>{step.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0b0b0e" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <p className="section-eyebrow" style={{ marginBottom: 6 }}>Core Components</p>
              <h2 className="section-title">ML Stack</h2>
            </div>
          </div>
          <div className="cap-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { icon: Network,  title: "Vector Categorization", detail: "TF-IDF + SVM",    accent: "#818cf8",
                desc: "Maps noisy bank strings to clean merchant/category entities. 98% accuracy across 40+ categories.", tags: ["TF-IDF","SVM","sklearn"] },
              { icon: Activity, title: "Expenditure Forecast",  detail: "Meta Prophet",     accent: "#fb923c",
                desc: "Additive model projecting 90-day spending horizons with weekly/monthly seasonality decomposition.", tags: ["Prophet","Time-Series","Trend"] },
              { icon: Database, title: "Anomaly Detection",     detail: "Isolation Forest", accent: "#4ade80",
                desc: "Unsupervised outlier detection flags unusual transactions with no labeled fraud data required.", tags: ["iForest","Outlier","Unsupervised"] },
            ].map((item, i) => (
              <div
                key={i}
                className="cap-card"
                style={{ "--accent": item.accent }}
                onMouseEnter={() => setHoveredCap(i)}
                onMouseLeave={() => setHoveredCap(null)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.accent}14`, border: `1px solid ${item.accent}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <item.icon size={20} style={{ color: item.accent }} strokeWidth={1.5} />
                  </div>
                  <span style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.detail}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em", marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 20 }}>{item.desc}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {item.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em", marginBottom: 6 }}>See it in action.</h2>
            <p style={{ fontSize: 13, color: "#475569" }}>Full dashboard with live pipeline output and visualizations.</p>
          </div>
          <Link to="/dashboard/overview" className="btn-primary" style={{ fontSize: 13, padding: "12px 28px" }}>
            <Play size={13} fill="currentColor" /> Open Dashboard
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 12, color: "#1e293b", fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} BSI — All systems nominal.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["API Docs", "GitHub"].map(l => (
              <button key={l} style={{ fontSize: 12, color: "#334155", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 500, transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                onMouseLeave={e => e.currentTarget.style.color = "#334155"}
              >{l}</button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}