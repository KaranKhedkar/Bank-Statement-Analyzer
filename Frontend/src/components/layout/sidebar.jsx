import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UploadCloud,
  ReceiptText,
  TrendingUp,
  ShieldAlert,
  Cpu,
  LogOut,
  Settings,
  Sparkles,
  PieChart
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAppStore();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
    { 
      path: "/dashboard/copilot", 
      label: "AI Copilot", 
      icon: Sparkles, 
      badge: "AI Agent",
      glow: true 
    },
    { path: "/dashboard/upload", label: "Upload Data", icon: UploadCloud },
    {
      path: "/dashboard/transactions",
      label: "Transactions",
      icon: ReceiptText,
    },
    { path: "/dashboard/categories", label: "Categories", icon: PieChart },
    { path: "/dashboard/forecast", label: "Forecast", icon: TrendingUp },
    { path: "/dashboard/anomalies", label: "Anomalies", icon: ShieldAlert },
    // { path: "/dashboard/model-info", label: "Model Info", icon: Cpu },
  ];

  return (
    <aside className="w-64 h-screen bg-stone-950/40 backdrop-blur-xl border-r border-white/5 flex flex-col font-sans shrink-0 relative z-20">
      {/* Brand & Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <Link to="/dashboard/overview" className="flex items-center gap-2.5 group cursor-pointer select-none">
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
                    className={isActive ? "text-indigo-400" : (item.glow ? "text-purple-400" : "text-stone-500")}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
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

          <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-stone-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl font-medium transition-colors border border-transparent hover:border-rose-500/20 cursor-pointer">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
