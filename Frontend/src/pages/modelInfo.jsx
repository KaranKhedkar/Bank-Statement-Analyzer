
// import React from 'react';
// import { 
//   Network, 
//   Activity, 
//   Database, 
//   RefreshCw, 
//   Sliders, 
//   TerminalSquare 
// } from 'lucide-react';

// export default function ModelInfo() {
//   return (
//     <div className="space-y-6 pb-10">
      
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-extrabold text-white tracking-tight">System Telemetry</h1>
//           <p className="text-stone-400 mt-1 text-sm">Real-time performance metrics and hyperparameter configurations.</p>
//         </div>
        
//         <div className="flex items-center gap-3 w-full sm:w-auto">
//           <div className="flex items-center gap-2 px-3 py-2 bg-stone-900/50 border border-white/5 rounded-xl text-xs font-mono text-stone-400 shadow-sm">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
//             </span>
//             All Systems Operational
//           </div>
//           <button className="flex items-center gap-2 px-3 py-2 bg-stone-900 border border-white/10 hover:border-white/20 text-stone-300 text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm">
//             <RefreshCw size={14} /> Force Sync
//           </button>
//         </div>
//       </div>

//       {/* Global Infrastructure Utilization */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {[
//           { label: 'API Latency', value: '42ms' },
//           { label: 'Memory Footprint', value: '1.2GB' },
//           { label: 'Inference Queue', value: '0' },
//           { label: 'System Uptime', value: '99.98%' },
//         ].map((metric, i) => (
//           <div key={i} className="bg-stone-900/40 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
//             <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">{metric.label}</span>
//             <span className="text-lg font-mono text-stone-200">{metric.value}</span>
//           </div>
//         ))}
//       </div>

//       <div className="w-full h-px bg-white/5 my-2"></div>

//       {/* Models Card Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* Card 1: NLP Categorization */}
//         <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm flex flex-col hover:border-white/10 transition-colors">
//           <div className="p-6 border-b border-white/5">
//             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
//               <Network size={20} className="text-indigo-400" />
//             </div>
//             <h2 className="text-lg font-bold text-white leading-tight">NLP Categorization</h2>
//             <p className="text-xs text-stone-500 font-mono mt-1">TF-IDF + SVM Pipeline</p>
//           </div>
          
//           <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 flex-1">
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Global Acc</span>
//               <p className="text-xl font-extrabold text-white mt-1">98.4%</p>
//             </div>
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">F1 (Macro)</span>
//               <p className="text-xl font-extrabold text-white mt-1">0.96</p>
//             </div>
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Vocab Size</span>
//               <p className="text-xl font-extrabold text-stone-300 font-mono mt-1">12,048</p>
//             </div>
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Inference</span>
//               <p className="text-xl font-extrabold text-stone-300 font-mono mt-1">12ms</p>
//             </div>
//           </div>

//           <div className="p-4 border-t border-white/5 bg-stone-950/20">
//             <button className="w-full flex items-center justify-center gap-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-300 px-4 py-2.5 rounded-xl border border-white/10 transition-colors cursor-pointer">
//               <TerminalSquare size={14} /> View Execution Logs
//             </button>
//           </div>
//         </div>

//         {/* Card 2: Time-Series Forecast */}
//         <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm flex flex-col hover:border-white/10 transition-colors">
//           <div className="p-6 border-b border-white/5">
//             <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
//               <Activity size={20} className="text-pink-400" />
//             </div>
//             <h2 className="text-lg font-bold text-white leading-tight">Expenditure Forecast</h2>
//             <p className="text-xs text-stone-500 font-mono mt-1">Prophet (Additive)</p>
//           </div>
          
//           <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 flex-1">
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">MAPE</span>
//               <p className="text-xl font-extrabold text-white mt-1">4.2%</p>
//             </div>
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">RMSE</span>
//               <p className="text-xl font-extrabold text-stone-300 font-mono mt-1">342.10</p>
//             </div>
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Changepoint</span>
//               <p className="text-xl font-extrabold text-stone-300 font-mono mt-1">0.05</p>
//             </div>
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Seasonality</span>
//               <p className="text-xl font-extrabold text-stone-300 font-mono mt-1">10.0</p>
//             </div>
//           </div>

//           <div className="p-4 border-t border-white/5 bg-stone-950/20">
//             <button className="w-full flex items-center justify-center gap-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-300 px-4 py-2.5 rounded-xl border border-white/10 transition-colors cursor-pointer">
//               <Sliders size={14} /> Tune Hyperparameters
//             </button>
//           </div>
//         </div>

//         {/* Card 3: Anomaly Detection */}
//         <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm flex flex-col hover:border-white/10 transition-colors">
//           <div className="p-6 border-b border-white/5">
//             <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
//               <Database size={20} className="text-rose-400" />
//             </div>
//             <h2 className="text-lg font-bold text-white leading-tight">Outlier Detection</h2>
//             <p className="text-xs text-stone-500 font-mono mt-1">Isolation Forest</p>
//           </div>
          
//           <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 flex-1">
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Contamination</span>
//               <p className="text-xl font-extrabold text-white mt-1">0.02</p>
//             </div>
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">N-Estimators</span>
//               <p className="text-xl font-extrabold text-stone-300 font-mono mt-1">150</p>
//             </div>
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Max Samples</span>
//               <p className="text-xl font-extrabold text-stone-300 font-mono mt-1">Auto</p>
//             </div>
//             <div>
//               <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">False Pos Rate</span>
//               <p className="text-xl font-extrabold text-stone-300 font-mono mt-1">1.2%</p>
//             </div>
//           </div>

//           <div className="p-4 border-t border-white/5 bg-stone-950/20">
//             <button className="w-full flex items-center justify-center gap-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-300 px-4 py-2.5 rounded-xl border border-white/10 transition-colors cursor-pointer">
//               <RefreshCw size={14} /> Retrain Weights
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }




import React from 'react';
import { 
  Network, 
  Activity, 
  Database,
  ArrowRight
} from 'lucide-react';

export default function ModelInfo() {
  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">System Telemetry</h1>
          <p className="text-stone-400 mt-1 text-sm">Performance metrics for active machine learning pipelines.</p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-2 bg-stone-900/50 border border-white/5 rounded-xl text-xs font-mono text-stone-400 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          All Systems Operational
        </div>
      </div>

      {/* Models Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Card 1: NLP Categorization */}
        <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm flex flex-col hover:border-white/10 transition-colors">
          <div className="p-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Network size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-white leading-tight">NLP Categorization</h2>
            <p className="text-xs text-stone-500 font-mono mt-1">TF-IDF + SVM Pipeline</p>
          </div>
          
          <div className="p-6 flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 font-medium">Global Accuracy</span>
              <span className="text-sm font-mono font-bold text-stone-200">98.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 font-medium">F1 Score (Macro)</span>
              <span className="text-sm font-mono font-bold text-stone-200">0.96</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 font-medium">Avg Inference</span>
              <span className="text-sm font-mono font-bold text-stone-200">12ms</span>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/5 bg-stone-950/20">
            <button className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-300 transition-colors cursor-pointer">
              View details <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Card 2: Time-Series Forecast */}
        <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm flex flex-col hover:border-white/10 transition-colors">
          <div className="p-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
              <Activity size={20} className="text-pink-400" />
            </div>
            <h2 className="text-lg font-bold text-white leading-tight">Expenditure Forecast</h2>
            <p className="text-xs text-stone-500 font-mono mt-1">Prophet (Additive)</p>
          </div>
          
          <div className="p-6 flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 font-medium">MAPE</span>
              <span className="text-sm font-mono font-bold text-stone-200">4.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 font-medium">RMSE</span>
              <span className="text-sm font-mono font-bold text-stone-200">342.10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 font-medium">Prediction Horizon</span>
              <span className="text-sm font-mono font-bold text-stone-200">90 Days</span>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/5 bg-stone-950/20">
            <button className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-300 transition-colors cursor-pointer">
              View details <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Card 3: Anomaly Detection */}
        <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm flex flex-col hover:border-white/10 transition-colors">
          <div className="p-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
              <Database size={20} className="text-rose-400" />
            </div>
            <h2 className="text-lg font-bold text-white leading-tight">Outlier Detection</h2>
            <p className="text-xs text-stone-500 font-mono mt-1">Isolation Forest</p>
          </div>
          
          <div className="p-6 flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 font-medium">Contamination Rate</span>
              <span className="text-sm font-mono font-bold text-stone-200">0.02%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 font-medium">False Positive Rate</span>
              <span className="text-sm font-mono font-bold text-stone-200">1.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 font-medium">Anomalies Detected</span>
              <span className="text-sm font-mono font-bold text-rose-400">4 Active</span>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/5 bg-stone-950/20">
            <button className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-300 transition-colors cursor-pointer">
              View details <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}