import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Zap, Search, TrendingUp, AlertTriangle, Cpu, Sliders, RefreshCw } from 'lucide-react';

const getToolIcon = (name) => {
  switch (name) {
    case 'get_spending_summary':
      return <Zap size={13} className="text-amber-400" />;
    case 'search_transactions':
      return <Search size={13} className="text-sky-400" />;
    case 'compare_periods':
      return <RefreshCw size={13} className="text-emerald-400" />;
    case 'get_anomalies_analysis':
      return <AlertTriangle size={13} className="text-rose-400" />;
    case 'get_forecast_data':
      return <TrendingUp size={13} className="text-indigo-400" />;
    case 'simulate_what_if':
      return <Sliders size={13} className="text-purple-400" />;
    default:
      return <Cpu size={13} className="text-indigo-400" />;
  }
};

const formatToolLabel = (name) => {
  return name.replace(/_/g, ' ');
};

export default function ToolCallBadge({ toolCalls }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="my-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1 bg-stone-800/80 hover:bg-stone-800 border border-white/10 rounded-lg text-xs text-stone-300 transition-all duration-200 cursor-pointer shadow-sm group"
      >
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-300">
          <Zap size={12} className="text-indigo-400 fill-indigo-400/20" />
          {toolCalls.length} {toolCalls.length === 1 ? 'Action Executed' : 'Actions Executed'}
        </span>
        <div className="flex items-center gap-1">
          {toolCalls.map((tc, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-stone-900/90 rounded text-[10px] text-stone-400 border border-white/5"
              title={tc.name}
            >
              {getToolIcon(tc.name)}
              <span className="truncate max-w-[100px]">{formatToolLabel(tc.name)}</span>
            </span>
          ))}
        </div>
        {isOpen ? <ChevronDown size={13} className="text-stone-400" /> : <ChevronRight size={13} className="text-stone-400" />}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-indigo-500/30 text-xs font-mono">
          {toolCalls.map((tc, idx) => (
            <div key={idx} className="p-2.5 bg-stone-900/90 rounded-xl border border-white/10 shadow-inner">
              <div className="flex items-center justify-between text-indigo-300 font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  {getToolIcon(tc.name)}
                  {tc.name}
                </span>
                <span className="text-[10px] text-stone-500">Execution completed</span>
              </div>

              {tc.args && Object.keys(tc.args).length > 0 && (
                <div className="text-[11px] text-stone-400 mb-1">
                  <span className="text-stone-500">Parameters: </span>
                  <code className="text-stone-300 bg-stone-950 px-1 py-0.5 rounded border border-white/5">
                    {JSON.stringify(tc.args)}
                  </code>
                </div>
              )}

              {tc.result_summary && (
                <div className="text-[11px] text-stone-400">
                  <span className="text-stone-500">Result: </span>
                  <span className="text-stone-300">{tc.result_summary}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
