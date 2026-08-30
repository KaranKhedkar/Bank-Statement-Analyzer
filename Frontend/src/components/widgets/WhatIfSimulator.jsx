import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, TrendingUp, DollarSign, ArrowRight, RotateCcw, ShieldCheck, Zap, Send, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Bar, Line } from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { runNaturalWhatIfSimulation } from '../../lib/api';

const PRESET_QUERIES = [
  "Cut dining by 25% and invest ₹5000 per month in a 12% index fund",
  "Reduce shopping by 50% and entertainment by 20%",
  "What if I stop all miscellaneous spending and invest ₹10000 at 8%?",
];

export default function WhatIfSimulator() {
  const { transactions } = useAppStore();
  
  const [query, setQuery] = useState("");
  const [simResult, setSimResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);

  const handleSimulate = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || !transactions.length) return;
    
    setIsSimulating(true);
    setError(null);
    try {
      const result = await runNaturalWhatIfSimulation(query);
      setSimResult(result);
    } catch (err) {
      setError(err.message || "Failed to run simulation. Please try phrasing it differently.");
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const resetSimulation = () => {
    setSimResult(null);
    setQuery("");
    setError(null);
  };

  const fmtINR = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const chartData = simResult?.timeline?.map((item) => ({
    month: item.month_label,
    baselineSpend: item.baseline_spend,
    simulatedSpend: item.simulated_spend,
    cumulativeSaved: item.cumulative_cash_saved,
    investedValue: item.cumulative_invested_value,
  })) || [];

  return (
    <div className="bg-stone-900/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[680px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-stone-950/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">AI Financial Lab</h2>
            <p className="text-[11px] text-stone-400">Ask hypothetical scenario questions in natural language</p>
          </div>
        </div>
        {simResult && (
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl transition-all border border-white/5 cursor-pointer"
          >
            <RotateCcw size={13} />
            Reset Lab
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!simResult ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Sliders className="text-purple-300 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">What-If Scenarios</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                Describe a financial change you'd like to make. The AI will parse your goals, apply them to your actual ledger, and project your future wealth.
              </p>
            </div>

            <form onSubmit={handleSimulate} className="w-full relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-stone-950/80 backdrop-blur-md border border-white/10 hover:border-purple-500/30 rounded-2xl p-2 flex items-center gap-2 transition-all shadow-xl">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., 'Cut shopping by 30% and invest ₹5000 at 12%'"
                  disabled={isSimulating}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-stone-200 placeholder-stone-500 px-3 py-2 disabled:opacity-50"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isSimulating}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-stone-800 disabled:text-stone-500 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-600/20 flex items-center justify-center"
                >
                  {isSimulating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              {error && <p className="text-xs text-rose-400 mt-3 text-center">{error}</p>}
            </form>

            <div className="w-full pt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-3 text-center">Try these examples</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {PRESET_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(q)}
                    disabled={isSimulating}
                    className="px-3 py-1.5 bg-stone-900/50 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 rounded-full text-[11px] text-stone-300 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
            {/* AI Interpretation Banner */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-300 shrink-0 mt-0.5">
                <Zap size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-white mb-1">Scenario Applied</p>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  {simResult.summary}
                </p>
              </div>
            </div>

            {/* Impact KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-stone-950/40 p-5 rounded-2xl border border-white/5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp size={48} className="text-emerald-400" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 relative z-10">Cash Freed Up</p>
                <div className="flex items-end gap-2 relative z-10">
                  <h3 className="text-2xl font-bold text-emerald-400">{fmtINR(simResult.monthly_cash_freed_up)}<span className="text-xs text-stone-500 font-medium ml-1">/mo</span></h3>
                </div>
                <p className="text-[11px] text-stone-500 mt-2 relative z-10">
                  Translates to <strong className="text-emerald-300">{fmtINR(simResult.annual_projected_savings)}</strong> annually.
                </p>
              </div>

              <div className="bg-stone-950/40 p-5 rounded-2xl border border-white/5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldCheck size={48} className="text-indigo-400" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 relative z-10">New Monthly Spend</p>
                <div className="flex items-end gap-2 relative z-10">
                  <h3 className="text-2xl font-bold text-indigo-400">{fmtINR(simResult.simulated_monthly_spend)}</h3>
                </div>
                <p className="text-[11px] text-stone-500 mt-2 relative z-10">
                  Reduced from baseline of <strong className="text-stone-300">{fmtINR(simResult.baseline_monthly_spend)}</strong>.
                </p>
              </div>

              <div className="bg-stone-950/40 p-5 rounded-2xl border border-white/5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <DollarSign size={48} className="text-purple-400" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 relative z-10">Projected Portfolio</p>
                <div className="flex items-end gap-2 relative z-10">
                  <h3 className="text-2xl font-bold text-purple-400">{fmtINR(chartData[chartData.length - 1]?.investedValue)}</h3>
                </div>
                <p className="text-[11px] text-stone-500 mt-2 relative z-10">
                  After {simResult.timeline?.length} months at {simResult.expected_annual_return_pct}% ROI.
                </p>
              </div>
            </div>

            {/* Adjustments Breakdown Table */}
            {simResult.adjustments?.length > 0 && (
              <div className="bg-stone-950/40 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-white/5 bg-stone-900/30">
                  <h3 className="text-xs font-bold text-stone-200">Budget Reductions Extracted</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-stone-950/50">
                        <th className="px-5 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Category</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Cut Applied</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Saved / Mo</th>
                        <th className="px-5 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">New Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {simResult.adjustments.map((adj, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3 text-xs font-semibold text-stone-200">{adj.category}</td>
                          <td className="px-5 py-3 text-xs text-rose-400 font-medium">-{adj.percentage_change}%</td>
                          <td className="px-5 py-3 text-xs text-emerald-400 font-medium">+{fmtINR(adj.monthly_amount_saved)}</td>
                          <td className="px-5 py-3 text-xs text-stone-400">{fmtINR(adj.new_monthly_spend)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Visualization */}
            <div className="bg-stone-950/40 p-5 rounded-2xl border border-white/5 shadow-sm">
              <h3 className="text-xs font-bold text-stone-200 mb-6">Wealth Projection Trajectory</h3>
              <div className="h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#78716c', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      tick={{ fill: '#78716c', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `₹${val/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1c1917', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#e7e5e4' }}
                      formatter={(value) => [fmtINR(value)]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                    <Area type="monotone" name="Pure Cash Saved" dataKey="cumulativeSaved" stroke="#34D399" fillOpacity={1} fill="url(#colorSaved)" strokeWidth={2} />
                    <Line type="monotone" name="Invested Portfolio Value" dataKey="investedValue" stroke="#A855F7" strokeWidth={3} dot={{ fill: '#A855F7', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
