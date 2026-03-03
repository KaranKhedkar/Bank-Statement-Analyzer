import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, UploadCloud, Sparkles } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  
  const pageTitles = {
    '/dashboard/overview': 'Overview',
    '/dashboard/upload': 'Upload Data',
    '/dashboard/transactions': 'Transactions Ledger',
    '/dashboard/forecast': 'AI Forecast',
    '/dashboard/anomalies': 'Anomaly Detection',
    '/dashboard/model-info': 'Model Metrics'
  };

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="h-20 bg-stone-950/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 shrink-0 font-sans z-20 sticky top-0">
      
      {/* Left: Dynamic Page Title & Search */}
      <div className="flex items-center gap-10 flex-1">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {currentTitle}
        </h1>
        
        {/* FIX: Functional Input wrapped in premium styling */}
        <div className="hidden lg:flex items-center justify-between bg-stone-900/50 border border-white/10 hover:border-white/20 focus-within:bg-stone-900 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 hover:bg-stone-800/80 rounded-xl px-3 py-2 w-80 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] group cursor-text">
          <div className="flex items-center gap-2.5 w-full">
            <Search size={16} className="text-stone-400 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="bg-transparent border-none outline-none text-sm text-stone-200 w-full placeholder:text-stone-500 font-medium"
            />
          </div>
          {/* Hides the ⌘K badge when user starts typing */}
          <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-bold text-stone-400 bg-stone-950 rounded-md border border-white/5 shadow-sm group-focus-within:opacity-0 transition-opacity duration-200">
            ⌘
          </kbd>
        </div>
      </div>

      {/* Right: Quick Actions & User Profile */}
      <div className="flex items-center gap-6">
        
        <Link to="/dashboard/upload" className="hidden sm:flex items-center gap-2 bg-indigo-700/90 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 transition-all duration-300 border border-indigo-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          <UploadCloud size={18} />
          <span>Upload</span>
        </Link>

        <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

      

        <button className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-4 rounded-2xl border border-transparent hover:border-white/10 transition-all duration-300 group cursor-default">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-stone-700 to-stone-900 border border-white/10 flex items-center justify-center text-stone-200 font-bold text-sm shadow-lg group-hover:border-stone-500 transition-colors">
            TT
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-bold text-stone-100 leading-none group-hover:text-white transition-colors">Testing</span>
          
          </div>
        </button>
      </div>

    </header>
  );
}
