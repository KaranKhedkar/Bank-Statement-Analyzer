import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UploadCloud,
  ReceiptText,
  TrendingUp,
  ShieldAlert,
  Cpu,
  LogOut,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { path: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
    { path: "/dashboard/upload", label: "Upload Data", icon: UploadCloud },
    {
      path: "/dashboard/transactions",
      label: "Transactions",
      icon: ReceiptText,
    },
    { path: "/dashboard/forecast", label: "Forecast", icon: TrendingUp },
    { path: "/dashboard/categories", label: "Categories", icon: ShieldAlert },
    { path: "/dashboard/anomalies", label: "Anomalies", icon: ShieldAlert },
    { path: "/dashboard/model-info", label: "Model Info", icon: Cpu },
  ];

  return (
    <aside className="w-64 h-screen bg-stone-950/40 backdrop-blur-xl border-r border-white/5 flex flex-col font-sans shrink-0 relative z-20">
      {/* Brand & Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-indigo-400/30 transition-all duration-300">
            <Cpu size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            LOGO
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        <div className="px-2 mb-5">
          <p className="text-[10px] font-bold tracking-widest text-stone-500 uppercase">
            Analytics Engine
          </p>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 overflow-hidden
                ${
                  isActive
                    ? "bg-linear-to-r from-indigo-500/15 to-transparent text-indigo-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ring-1 ring-indigo-500/20"
                    : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Glowing Left Indicator for Active State */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-indigo-500 rounded-r-md shadow-[0_0_10px_rgba(79,70,229,0.8)]"></div>
                  )}

                  <Icon
                    size={18}
                    className={isActive ? "text-indigo-400" : "text-stone-500"}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-1">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-stone-400 hover:bg-white/5 hover:text-stone-200 rounded-xl font-medium transition-colors border border-transparent hover:border-white/5">
            <Settings size={16} />
          </button>

          <Link to="/">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-stone-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl font-medium transition-colors border border-transparent hover:border-rose-500/20">
              <LogOut size={16} />
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
