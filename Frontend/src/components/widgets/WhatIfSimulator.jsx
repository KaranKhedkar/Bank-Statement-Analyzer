import React, { useState, useMemo, useEffect } from 'react';
import { Sliders, Sparkles, TrendingUp, DollarSign, ArrowRight, RotateCcw, ShieldCheck, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { runWhatIfSimulation } from '../../lib/api';

const PRESET_SCENARIOS = [
  {
    name: "Dining & Coffee Diet",
    icon: "☕",
    description: "Cut Food & Dining by 25%",
    adjustments: { "Food & Dining": -0.25 },
    sip: 3000
  },
  {
    name: "Shopping & Entertainment Freeze",
    icon: "🛍️",
    description: "Reduce Shopping by 30% and Entertainment by 40%",
    adjustments: { "Shopping": -0.30, "Entertainment": -0.40 },
    sip: 5000
  },
  {
    name: "Aggressive FIRE Mode",
    icon: "🔥",
    description: "Cut 20% across Food, Shopping, Transport & Entertainment",
    adjustments: { "Food & Dining": -0.20, "Shopping": -0.20, "Transport": -0.20, "Entertainment": -0.30 },
    sip: 10000
  }
];

export default function WhatIfSimulator() {
  const { transactions, categoryData } = useAppStore();

  const activeCategories = useMemo(() => {
    return categoryData
      .filter((c) => c.spend > 0)
      .sort((a, b) => b.spend - a.spend)
      .map((c) => c.name);
  }, [categoryData]);

  const [adjustments, setAdjustments] = useState({
    "Food & Dining": -0.20,
    "Shopping": -0.15,
  });
  const [monthlySip, setMonthlySip] = useState(5000);
  const [expectedRoi, setExpectedRoi] = useState(10);
  const [projectionMonths, setProjectionMonths] = useState(6);
  const [simResult, setSimResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Run simulation whenever parameters change
  useEffect(() => {
    if (!transactions.length) return;

    let isMounted = true;
    const executeSim = async () => {
      setIsSimulating(true);
      try {
        const result = await runWhatIfSimulation(adjustments, monthlySip, expectedRoi, projectionMonths);
        if (isMounted) setSimResult(result);
      } catch (err) {
        console.error("Simulation error:", err);
      } finally {
        if (isMounted) setIsSimulating(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      executeSim();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [adjustments, monthlySip, expectedRoi, projectionMonths, transactions.length]);

  const handleSliderChange = (category, value) => {
    setAdjustments((prev) => ({
      ...prev,
      [category]: value / 100
    }));
  };

  const applyPreset = (preset) => {
    setAdjustments(preset.adjustments);
    if (preset.sip !== undefined) setMonthlySip(preset.sip);
  };

  const resetAdjustments = () => {
    setAdjustments({});
    setMonthlySip(0);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sliders size={16} />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">What-If Financial Simulation Lab</h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Simulate expense reductions, project compound savings, and model balance trajectory.
          </p>
        </div>

        <button
          onClick={resetAdjustments}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl transition-all border border-white/5 cursor-pointer"
        >
          <RotateCcw size={13} />
          Reset Sliders
        </button>
      </div>

      {/* Preset Chips */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">Preset Scenarios</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_SCENARIOS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="p-3.5 bg-stone-900/60 hover:bg-stone-900 border border-white/10 hover:border-purple-500/40 rounded-2xl text-left transition-all duration-200 cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{p.icon}</span>
                <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  {p.name}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls + Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Sliders & Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
              <span>Category Budget Cuts</span>
              <span className="text-purple-400 font-mono text-[11px]">
                {Object.keys(adjustments).length} Active
              </span>
            </h3>

            {activeCategories.slice(0, 7).map((cat) => {
              const currentCutPct = Math.round((adjustments[cat] || 0) * 100);
              const catSpend = categoryData.find((c) => c.name === cat)?.spend || 0;

              return (
                <div key={cat} className="space-y-1.5 p-2.5 bg-stone-950/40 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-200">{cat}</span>
                      <span className="text-stone-400 text-[10px] ml-1.5">({fmtINR(catSpend)}/mo)</span>
                    </div>
                    <span className={`font-mono font-bold text-xs ${currentCutPct < 0 ? 'text-teal-400' : (currentCutPct > 0 ? 'text-rose-400' : 'text-stone-500')}`}>
                      {currentCutPct > 0 ? `+${currentCutPct}%` : `${currentCutPct}%`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="-50"
                      max="30"
                      step="5"
                      value={currentCutPct}
                      onChange={(e) => handleSliderChange(cat, Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Investment & Horizon Panel */}
          <div className="bg-stone-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              SIP & Growth Assumptions
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-stone-400 font-medium">Extra SIP (₹/mo)</label>
                <input
                  type="number"
                  value={monthlySip}
                  onChange={(e) => setMonthlySip(Number(e.target.value))}
                  step="1000"
                  min="0"
                  className="w-full px-3 py-2 bg-stone-950/60 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-stone-400 font-medium">Expected Return (%)</label>
                <input
                  type="number"
                  value={expectedRoi}
                  onChange={(e) => setExpectedRoi(Number(e.target.value))}
                  step="1"
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 bg-stone-950/60 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-stone-400 font-medium">Projection Horizon</label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setProjectionMonths(m)}
                    className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      projectionMonths === m
                        ? 'bg-purple-600/30 border-purple-500/50 text-purple-200'
                        : 'bg-stone-950/40 border-white/5 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Simulation Metrics & Visualization */}
        <div className="lg:col-span-7 space-y-4">
          {/* KPI Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-sm">
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Monthly Cash Freed</p>
              <p className="text-xl font-extrabold text-teal-400 font-mono mt-1">
                +{fmtINR(simResult?.monthly_cash_freed_up)}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">per month</p>
            </div>

            <div className="p-4 bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-sm">
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Annual Cash Saved</p>
              <p className="text-xl font-extrabold text-indigo-400 font-mono mt-1">
                {fmtINR(simResult?.annual_projected_savings)}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">in 12 months</p>
            </div>

            <div className="p-4 bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-sm">
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Portfolio Growth</p>
              <p className="text-xl font-extrabold text-purple-400 font-mono mt-1">
                {fmtINR(simResult?.timeline?.[simResult.timeline.length - 1]?.cumulative_invested_value)}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">at {expectedRoi}% ROI in {projectionMonths}m</p>
            </div>
          </div>

          {/* Trajectory Comparison Chart */}
          <div className="p-5 bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Projected Cumulative Wealth Accumulation</h3>
                <p className="text-xs text-stone-400">Cash saved + Compounded SIP return</p>
              </div>
              <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-1 rounded-md border border-purple-500/20">
                Compound Simulation
              </span>
            </div>

            <div className="w-full h-64 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                  <XAxis dataKey="month" stroke="#78716c" tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#78716c" tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c1917', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val) => [fmtINR(val)]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#a8a29e', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="cumulativeSaved" name="Cash Saved (₹)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSaved)" />
                  <Area type="monotone" dataKey="investedValue" name="Compounded SIP (₹)" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInvested)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Summary Statement */}
          {simResult?.summary && (
            <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl text-xs text-purple-200 flex items-start gap-2.5">
              <Sparkles size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-purple-300">AI Impact Analysis: </span>
                <span>{simResult.summary}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
