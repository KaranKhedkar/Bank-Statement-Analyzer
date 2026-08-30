import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  
  const pageTitles = {
    '/dashboard/overview': 'Overview',
    '/dashboard/upload': 'Upload Data',
    '/dashboard/transactions': 'Transactions Ledger',
    '/dashboard/categories': 'Category Analytics',
    '/dashboard/forecast': 'AI Forecast',
    '/dashboard/anomalies': 'Anomaly Detection',
    '/dashboard/copilot': 'Conversational Copilot',
    '/dashboard/model-info': 'Model Metrics'
  };

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="h-20 bg-stone-950/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 shrink-0 font-sans z-20 sticky top-0">
      
      {/* Left: Dynamic Page Title & Search */}
      <div className="flex items-center gap-8 flex-1">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {currentTitle}
        </h1>
        
        <div className="hidden lg:flex items-center justify-between bg-stone-900/50 border border-white/10 hover:border-white/20 focus-within:bg-stone-900 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 hover:bg-stone-800/80 rounded-xl px-3 py-2 w-80 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] group cursor-text">
          <div className="flex items-center gap-2.5 w-full">
            <Search size={16} className="text-stone-400 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="bg-transparent border-none outline-none text-sm text-stone-200 w-full placeholder:text-stone-500 font-medium"
            />
          </div>
          {/* Hides the ⌘ badge when user starts typing */}
          <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-bold text-stone-400 bg-stone-950 rounded-md border border-white/5 shadow-sm group-focus-within:opacity-0 transition-opacity duration-200">
            ⌘
          </kbd>
        </div>
      </div>

      {/* Right: Live Telemetry Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium shadow-[0_0_15px_rgba(16,185,129,0.12)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="hidden sm:inline">AI Telemetry Active</span>
        </div>
      </div>

    </header>
  );
}
