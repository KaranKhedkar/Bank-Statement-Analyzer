// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   Github,
//   Play,
//   BrainCircuit,
//   TrendingUp,
//   ShieldAlert,
//   FileJson,
//   ArrowRight,
//   Layout,
//   Server,
//   Cpu,
//   Database,
// } from "lucide-react";

// export default function Homepage() {
//   return (
//     <div className="min-h-screen bg-stone-140 font-sans text-stone-900 selection:bg-indigo-100 selection:text-indigo-900 pb-24 relative overflow-hidden">
//       {/* Engineered Background Grid Texture (Subtle on stone-100) */}
//       <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#d6d3d1_1px,transparent_1px),linear-gradient(to_bottom,#d6d3d1_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40"></div>

//       {/* =========================================
//           SECTION 1: HERO
//           ========================================= */}
//       <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//         {/* Left: Copy & Actions */}
//         <div className="space-y-8">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-widest shadow-sm">
//             <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.8)] animate-pulse"></span>
//             Machine Learning Pipeline
//           </div>

//           <h1 className="text-5xl lg:text-7xl font-extrabold text-stone-900 leading-[1.1] tracking-tight drop-shadow-sm">
//             AI-Based Bank <br />
//             <span className="text-indigo-700 drop-shadow-sm">
//               Statement
//             </span>{" "}
//             <br />
//             Analyzer
//           </h1>

//           <p className="text-lg text-stone-500 max-w-md leading-relaxed font-medium">
//             An ML-driven system that categorizes transactions, forecasts
//             expenses, and detects anomalies from raw bank statements.
//           </p>

//           <div className="flex items-center gap-4 pt-4">
//             <Link
//               to="/dashboard/overview"
//               className="flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-stone-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/20 transition-all duration-300"
//             >
//               <Play size={18} fill="currentColor" /> View Demo
//             </Link>
//             <button className="flex items-center gap-2 bg-white text-stone-700 border border-stone-200 px-8 py-4 rounded-full font-semibold hover:bg-stone-50 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
//               <Github size={18} /> View GitHub
//             </button>
//           </div>
//         </div>

//         {/* Right: Technical "3D" Visualization Card */}
//         <div className="relative h-125 w-full items-center justify-center perspective-[2000px] group hidden md:flex">
//           {/* Ambient Background Glow */}
//           <div className="absolute w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl group-hover:bg-indigo-400/25 group-hover:scale-110 transition-all duration-700"></div>

//           <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 border border-stone-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transform transition-transform duration-700 ease-out group-hover:-rotate-y-12 group-hover:rotate-x-6 group-hover:scale-[1.02]">
//             <div className="border-b border-stone-100 pb-4 mb-5 flex justify-between items-center">
//               <span className="text-xs font-mono text-stone-400 font-medium">
//                 raw_transaction.csv
//               </span>
//               <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
//                 Processed
//               </span>
//             </div>
//             <div className="space-y-5 font-mono text-sm">
//               <div>
//                 <p className="text-stone-400 text-xs mb-2">Input String</p>
//                 <p className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 text-stone-600 shadow-inner text-xs">
//                   "UPI/UBER TRIP/MUMBAI/2394"
//                 </p>
//               </div>

//               <div className="flex justify-center">
//                 <div className="bg-stone-50 p-1.5 rounded-full border border-stone-200 shadow-sm text-stone-400">
//                   <ArrowRight size={16} />
//                 </div>
//               </div>

//               <div>
//                 <p className="text-stone-400 text-xs mb-2">ML Output (JSON)</p>
//                 <div className="bg-[#0A0A0A] p-4 rounded-xl text-stone-300 text-xs leading-loose shadow-xl ring-1 ring-white/10">
//                   <p>
//                     <span className="text-pink-400">"merchant"</span>: "Uber",
//                   </p>
//                   <p>
//                     <span className="text-pink-400">"category"</span>:
//                     "Transport",
//                   </p>
//                   <p>
//                     <span className="text-pink-400">"confidence"</span>: 0.98,
//                   </p>
//                   <p>
//                     <span className="text-pink-400">"anomaly"</span>: false
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* =========================================
//           SECTION 2: CORE CAPABILITIES 
//           ========================================= */}
//       <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
//         <h2 className="text-3xl font-extrabold text-stone-900 mb-10 tracking-tight">
//           System Capabilities
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[
//             {
//               icon: BrainCircuit,
//               title: "Auto Categorization",
//               tech: "TF-IDF + Logistic Reg",
//             },
//             {
//               icon: TrendingUp,
//               title: "Time-Series Forecast",
//               tech: "Facebook Prophet",
//             },
//             {
//               icon: ShieldAlert,
//               title: "Anomaly Detection",
//               tech: "Isolation Forest",
//             },
//             {
//               icon: FileJson,
//               title: "Document Parsing",
//               tech: "CSV & PDF Extraction",
//             },
//           ].map((item, index) => (
//             <div
//               key={index}
//               className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col items-start relative overflow-hidden"
//             >
//               <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 border border-stone-100 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-300">
//                 <item.icon
//                   className="text-indigo-600"
//                   size={26}
//                   strokeWidth={1.5}
//                 />
//               </div>
//               <h3 className="font-bold text-stone-900 mb-3 text-lg leading-tight">
//                 {item.title}
//               </h3>
//               <p className="text-xs text-stone-500 font-mono bg-stone-50 p-2.5 rounded-xl border border-stone-200/50 mt-auto w-full">
//                 {item.tech}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* =========================================
//           SECTION 3: THE DARK ANCHOR ARCHITECTURE
//           ========================================= */}
//       <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
//         <div className="bg-black/95 p-12 rounded-[2.5rem] border border-stone-800 shadow-2xl overflow-x-auto relative">
//           <h2 className="text-2xl font-extrabold text-white mb-12 tracking-tight">
//             Architecture Blueprint
//           </h2>

//           {/* Dashed Connecting Line (Dark Mode version) */}
//           <div className="absolute top-42 left-24 right-24 h-0.5 bg-[linear-gradient(to_right,#44403c_50%,transparent_50%)] bg-size-[12px_100%] hidden md:block"></div>

//           <div className="flex items-center justify-between min-w-175 gap-4 relative z-10">
//             {[
//               { icon: Layout, title: "React", sub: "Frontend UI" },
//               { icon: Server, title: "FastAPI", sub: "REST API" },
//               { icon: Cpu, title: "ML Models", sub: "scikit-learn / Prophet" },
//               { icon: Database, title: "SQLite", sub: "Data Storage" },
//             ].map((node, index) => (
//               <React.Fragment key={index}>
//                 <div className="flex flex-col items-center text-center w-32 group cursor-default">
//                   <div className="w-20 h-20 bg-white border border-black rounded-full flex items-center justify-center mb-5 shadow-lg group-hover:-translate-y-2 group-hover:border-indigo-500 group-hover:shadow-indigo-500/20 transition-all duration-300 relative">
//                     <div className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors"></div>
//                     <node.icon
//                       className="text-black group-hover:text-indigo-400 transition-colors"
//                       size={28}
//                       strokeWidth={1.5}
//                     />
//                   </div>
//                   <p className="font-bold text-stone-100">{node.title}</p>
//                   <p className="text-xs text-stone-400 font-mono mt-1.5 bg-stone-900 px-2 py-1 rounded-md border border-stone-800">
//                     {node.sub}
//                   </p>
//                 </div>
//                 {index < 3 && (
//                   <div className="text-stone-700 md:hidden">
//                     <ArrowRight size={24} />
//                   </div>
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* =========================================
//           SECTION 4: TECH STACK 
//           ========================================= */}
//       <section className="relative z-10 max-w-6xl mx-auto px-6 py-6">
//         <div className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
//           <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest pl-2">
//             Core Tech Stack
//           </h2>
//           <div className="flex flex-wrap gap-2.5 justify-center md:justify-end">
//             {[
//               "Python",
//               "FastAPI",
//               "React",
//               "scikit-learn",
//               "Prophet",
//               "Pandas",
//             ].map((tech) => (
//               <span
//                 key={tech}
//                 className="px-5 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-sm font-semibold text-stone-600 hover:border-indigo-300 hover:text-indigo-700 transition-all cursor-default"
//               >
//                 {tech}
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }







// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   Play,
//   Github,
//   Network,
//   Activity,
//   Database,
//   ArrowRight,
//   Terminal,
//   Cpu,
//   Layers
// } from "lucide-react";

// export default function HomepageV1() {
//   return (
//     <div className="min-h-screen bg-stone-950 font-sans text-stone-300 selection:bg-indigo-500/30 selection:text-indigo-200 pb-24 relative overflow-hidden">
      
//       {/* Background Grid Texture */}
//       <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

//       {/* Hero Section */}
//       <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
//         <div className="space-y-8">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono tracking-wide shadow-sm">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
//             </span>
//             v2.0 ML Pipeline Active
//           </div>

//           <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
//             Financial Data, <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
//               Mathematically Structured.
//             </span>
//           </h1>

//           <p className="text-lg text-stone-400 max-w-lg leading-relaxed font-medium">
//             An autonomous engine that ingests raw bank telemetry, categorizes entities via TF-IDF, forecasts burn rates, and isolates fiscal anomalies.
//           </p>

//           <div className="flex items-center gap-4 pt-4">
//             <Link
//               to="/dashboard/overview"
//               className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-500"
//             >
//               <Play size={18} fill="currentColor" /> Initialize Dashboard
//             </Link>
//             <button className="flex items-center gap-2 bg-stone-900 text-stone-300 border border-white/10 px-8 py-3.5 rounded-xl font-bold hover:bg-stone-800 hover:text-white transition-colors">
//               <Github size={18} /> View Source
//             </button>
//           </div>
//         </div>

//         {/* Floating Technical Visual */}
//         <div className="relative w-full h-full flex justify-center lg:justify-end">
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
//           <div className="w-full max-w-md bg-stone-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10">
//             <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-stone-950/50">
//               <div className="flex gap-1.5">
//                 <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
//                 <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
//                 <div className="w-3 h-3 rounded-full bg-teal-500/50"></div>
//               </div>
//               <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">inference_engine.py</span>
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

//       {/* Core Capabilities */}
//       <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
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

//     </div>
//   );
// }



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