// import React, { useMemo } from 'react';
// import { TrendingUp, TrendingDown, Activity, AlertCircle, Calendar } from 'lucide-react';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
// } from 'recharts';

// export default function TrendsView({ data }) {

//   // --- Core Aggregation & Mathematics ---
//   const { chartData, insights, rankedDays, heatmap } = useMemo(() => {
//     const dailyMap = {};
//     let peakSpend = { date: null, amount: 0 };
//     let highestInflow = { date: null, amount: 0 };

//     // Group and aggregate
//     data.forEach(tx => {
//       const date = tx.date;
//       if (!dailyMap[date]) {
//         dailyMap[date] = { date, income: 0, expense: 0, net: 0, count: 0 };
//       }

//       dailyMap[date].count += 1;

//       if (tx.amount > 0) {
//         dailyMap[date].income += tx.amount;
//         if (tx.amount > highestInflow.amount) {
//           highestInflow = { date, amount: tx.amount };
//         }
//       } else {
//         const absExp = Math.abs(tx.amount);
//         dailyMap[date].expense += absExp;
//         if (absExp > peakSpend.amount) {
//           peakSpend = { date, amount: absExp };
//         }
//       }
//       dailyMap[date].net = dailyMap[date].income - dailyMap[date].expense;
//     });

//     const sortedData = Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));

//     // Calculate ranked spending days
//     const ranked = [...sortedData]
//       .sort((a, b) => b.expense - a.expense)
//       .filter(day => day.expense > 0)
//       .slice(0, 5);

//     // Generate 28-day heatmap matrix ending on the latest transaction date
//     const latestDate = sortedData.length > 0 ? new Date(sortedData[sortedData.length - 1].date) : new Date();
//     const heatmapArray = Array.from({ length: 28 }).map((_, i) => {
//       const d = new Date(latestDate);
//       d.setDate(d.getDate() - (27 - i));
//       const dateStr = d.toISOString().split('T')[0];
//       return {
//         date: dateStr,
//         count: dailyMap[dateStr] ? dailyMap[dateStr].count : 0
//       };
//     });

//     return {
//       chartData: sortedData,
//       insights: { peakSpend, highestInflow },
//       rankedDays: ranked,
//       heatmap: heatmapArray
//     };
//   }, [data]);

//   // Dynamically calculate the zero-crossing for the dual-color line gradient
//   const maxNet = Math.max(...chartData.map(d => d.net), 0);
//   const minNet = Math.min(...chartData.map(d => d.net), 0);
//   const gradientOffset = (maxNet === 0 && minNet === 0) ? 0 : maxNet / (maxNet - minNet);

//   // --- Strict Tooltip UI ---
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       const val = payload[0].value;
//       const isPositive = val >= 0;
//       return (
//         <div className="bg-stone-900 border border-white/10 p-3 rounded-lg shadow-xl z-50 min-w-[140px]">
//           <p className="text-stone-400 text-xs mb-2 font-mono">{label}</p>
//           <div className="flex items-center justify-between gap-3">
//             <span className="text-stone-200 text-sm font-medium">Net Flow</span>
//             <span className={`text-sm font-mono font-bold ${isPositive ? 'text-indigo-400' : 'text-rose-400'}`}>
//               {isPositive ? '+' : '-'}${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </span>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="space-y-6">

//       {/* 70/30 Hero Chart Section */}
//       <div className="bg-stone-900/50 backdrop-blur-md rounded-3xl border border-white/5 shadow-sm overflow-hidden flex flex-col lg:flex-row">

//         {/* Left: 70% Chart */}
//         <div className="flex-1 p-6 lg:border-r border-white/5">
//           <div className="mb-6">
//             <h2 className="text-sm font-bold text-white">Net Flow Momentum</h2>
//             <p className="text-xs text-stone-500 font-mono mt-0.5">Absolute cashflow trajectory</p>
//           </div>
//           <div className="h-[280px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
//                 <defs>
//                   <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset={gradientOffset} stopColor="#6366f1" stopOpacity={1} />
//                     <stop offset={gradientOffset} stopColor="#e11d48" stopOpacity={1} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" vertical={false} />
//                 <XAxis dataKey="date" stroke="#78716c" tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
//                 <YAxis stroke="#78716c" tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`} />
//                 <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 1 }} />
//                 <ReferenceLine y={0} stroke="#ffffff20" strokeWidth={1} />
//                 <Line type="monotone" dataKey="net" stroke="url(#splitColor)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#1c1917', stroke: '#a8a29e', strokeWidth: 2 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Right: 30% Insights Panel */}
//         <div className="w-full lg:w-72 bg-stone-950/30 p-6 flex flex-col gap-6">
//           <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider font-mono">Key Insights</h3>

//           <div className="space-y-1">
//             <div className="flex items-center gap-2 text-stone-400 mb-1">
//               <TrendingDown size={14} className="text-rose-400" />
//               <span className="text-xs font-medium">Peak Spend</span>
//             </div>
//             <p className="text-lg font-extrabold text-white">
//               ${insights.peakSpend.amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
//             </p>
//             <p className="text-[11px] text-stone-500 font-mono">{insights.peakSpend.date || 'N/A'}</p>
//           </div>

//           <div className="space-y-1">
//             <div className="flex items-center gap-2 text-stone-400 mb-1">
//               <TrendingUp size={14} className="text-indigo-400" />
//               <span className="text-xs font-medium">Highest Inflow</span>
//             </div>
//             <p className="text-lg font-extrabold text-white">
//               ${insights.highestInflow.amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
//             </p>
//             <p className="text-[11px] text-stone-500 font-mono">{insights.highestInflow.date || 'N/A'}</p>
//           </div>

//           <div className="space-y-1 mt-auto pt-4 border-t border-white/5">
//             <div className="flex items-center gap-2 text-stone-400 mb-1">
//               <AlertCircle size={14} className="text-stone-500" />
//               <span className="text-xs font-medium">Volatility Index</span>
//             </div>
//             <p className="text-sm font-bold text-stone-300">Moderate</p>
//           </div>
//         </div>
//       </div>

//       {/* Secondary Analytics Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         {/* Ranked Spending Days */}
//         <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col h-[320px]">
//           <div className="mb-6 flex justify-between items-end border-b border-white/5 pb-4">
//             <div>
//               <h2 className="text-sm font-bold text-white">Highest Burn Days</h2>
//               <p className="text-xs text-stone-500 font-mono mt-0.5">Top 5 daily expenditure aggregations</p>
//             </div>
//           </div>

//           <div className="flex-1 flex flex-col justify-center space-y-5">
//             {rankedDays.length > 0 ? rankedDays.map((day, i) => {
//               const maxVal = rankedDays[0].expense;
//               const pct = (day.expense / maxVal) * 100;
//               return (
//                 <div key={i} className="group">
//                   <div className="flex justify-between items-end mb-1.5">
//                     <span className="text-sm font-medium text-stone-200">{day.date}</span>
//                     <span className="text-sm font-mono font-bold text-rose-400">
//                       ${day.expense.toLocaleString(undefined, { minimumFractionDigits: 0 })}
//                     </span>
//                   </div>
//                   <div className="h-1.5 w-full bg-stone-950 rounded-full overflow-hidden border border-white/5">
//                     <div className="h-full bg-rose-500/80 rounded-full opacity-80 group-hover:opacity-100 transition-opacity" style={{ width: `${pct}%` }}></div>
//                   </div>
//                 </div>
//               );
//             }) : (
//               <div className="text-center text-sm text-stone-500 font-mono">Insufficient data</div>
//             )}
//           </div>
//         </div>

//         {/* Transaction Velocity Heatmap */}
//         <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col h-[320px]">
//           <div className="mb-6 border-b border-white/5 pb-4 flex justify-between items-end">
//             <div>
//               <h2 className="text-sm font-bold text-white">Transaction Velocity</h2>
//               <p className="text-xs text-stone-500 font-mono mt-0.5">28-day ledger activity density</p>
//             </div>
//             <Activity size={16} className="text-stone-500 mb-1" />
//           </div>

//           <div className="flex-1 flex flex-col items-center justify-center">
//             {/* 4 weeks x 7 days Grid */}
//             <div className="grid grid-flow-col grid-rows-7 gap-2">
//               {heatmap.map((cell, i) => {
//                 let bgClass = "bg-stone-950 border border-white/5"; // 0
//                 if (cell.count === 1) bgClass = "bg-indigo-500/20 border border-indigo-500/10";
//                 if (cell.count === 2) bgClass = "bg-indigo-500/40 border border-indigo-500/20";
//                 if (cell.count >= 3) bgClass = "bg-indigo-500/80 border border-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.2)]";

//                 return (
//                   <div
//                     key={i}
//                     className={`w-4 h-4 rounded-sm transition-colors ${bgClass}`}
//                     title={`${cell.date}: ${cell.count} transactions`}
//                   ></div>
//                 );
//               })}
//             </div>

//             <div className="flex items-center gap-2 mt-6 text-[10px] font-mono text-stone-500">
//               <span>Less</span>
//               <div className="flex gap-1">
//                 <div className="w-3 h-3 rounded-sm bg-stone-950 border border-white/5"></div>
//                 <div className="w-3 h-3 rounded-sm bg-indigo-500/20 border border-indigo-500/10"></div>
//                 <div className="w-3 h-3 rounded-sm bg-indigo-500/40 border border-indigo-500/20"></div>
//                 <div className="w-3 h-3 rounded-sm bg-indigo-500/80 border border-indigo-500/50"></div>
//               </div>
//               <span>More</span>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState, useMemo } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingDown,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function TrendsView({ data }) {
  const [barTimeframe, setBarTimeframe] = useState("daily"); // 'daily' | 'monthly'

  // --- Core Aggregation & Mathematics ---
  const { kpis, chartData, monthlyData, insights } = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const dailyMap = {};
    const monthlyMap = {};
    let cumulativeBalance = 0;

    let peakSpend = { date: null, amount: 0 };
    let highestInflow = { date: null, amount: 0 };

    // Sort chronologically for accurate cumulative math
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    sortedData.forEach((tx) => {
      const dDate = tx.date;
      const mDate = dDate.substring(0, 7); // YYYY-MM
      const amount = tx.amount;
      const absAmount = Math.abs(amount);

      // KPI Accumulation
      if (amount > 0) totalIncome += amount;
      else totalExpense += absAmount;

      // Initialize Maps
      if (!dailyMap[dDate])
        dailyMap[dDate] = { date: dDate, income: 0, expense: 0, balance: 0 };
      if (!monthlyMap[mDate])
        monthlyMap[mDate] = { date: mDate, income: 0, expense: 0 };

      // Route data
      if (amount > 0) {
        dailyMap[dDate].income += amount;
        monthlyMap[mDate].income += amount;
        if (amount > highestInflow.amount)
          highestInflow = { date: dDate, amount };
      } else {
        dailyMap[dDate].expense += absAmount;
        monthlyMap[mDate].expense += absAmount;
        if (absAmount > peakSpend.amount)
          peakSpend = { date: dDate, amount: absAmount };
      }

      // Calculate Running Balance
      cumulativeBalance += amount;
      dailyMap[dDate].balance = cumulativeBalance;
    });

    return {
      kpis: {
        income: totalIncome,
        expense: totalExpense,
        net: totalIncome - totalExpense,
      },
      chartData: Object.values(dailyMap),
      monthlyData: Object.values(monthlyMap),
      insights: { peakSpend, highestInflow },
    };
  }, [data]);

  // Zero-crossing calculation for dynamic stroke gradient
  const maxBal = Math.max(...chartData.map((d) => d.balance), 0);
  const minBal = Math.min(...chartData.map((d) => d.balance), 0);
  const gradientOffset =
    maxBal === 0 && minBal === 0 ? 0 : maxBal / (maxBal - minBal);

  // --- Tooltip Architectures ---
  const BalanceTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-stone-900 border border-white/10 p-3 rounded-lg shadow-xl z-50 min-w-35">
          <p className="text-stone-400 text-xs mb-2 font-mono">{label}</p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-stone-200 text-sm font-medium">Balance</span>
            <span
              className={`text-sm font-mono font-bold ${val >= 0 ? "text-indigo-400" : "text-rose-400"}`}
            >
              ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 border border-white/10 p-3 rounded-lg shadow-xl z-50 min-w-30">
          <p className="text-stone-400 text-xs mb-3 font-mono">{label}</p>
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 text-sm mt-1.5"
            >
              <span className="text-stone-300 capitalize">{entry.name}</span>
              <span
                className="font-mono font-bold"
                style={{ color: entry.color }}
              >
                $
                {entry.value.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const activeBarData = barTimeframe === "daily" ? chartData : monthlyData;

  return (
    <div className="space-y-6">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">Net Position</h3>
            <div className="w-8 h-8 rounded-lg bg-stone-800 border border-white/5 flex items-center justify-center">
              <Wallet size={14} className="text-stone-300" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">
            ${kpis.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">Total Inflow</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md uppercase border border-indigo-400/20">
              <ArrowUpRight size={12} /> Income
            </span>
          </div>
          <p className="text-3xl font-extrabold text-white">
            $
            {kpis.income.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">
              Total Outflow
            </h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md uppercase border border-rose-400/20">
              <ArrowDownRight size={12} /> Expense
            </span>
          </div>
          <p className="text-3xl font-extrabold text-white">
            $
            {kpis.expense.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* 70/30 Hero Chart Section: Available Balance */}
      <div className="bg-stone-900/50 backdrop-blur-md rounded-3xl border border-white/5 shadow-sm overflow-hidden flex flex-col lg:flex-row">
        {/* Left: 70% Chart */}
        <div className="flex-1 p-6 lg:border-r border-white/5">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-white">Balance Trajectory</h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Cumulative net flow analysis
            </p>
          </div>
          <div className="h-70 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset={gradientOffset}
                      stopColor="#6366f1"
                      stopOpacity={1}
                    />
                    <stop
                      offset={gradientOffset}
                      stopColor="#e11d48"
                      stopOpacity={1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff04"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#78716c"
                  tick={{ fill: "#78716c", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                  tickFormatter={(val) => val.split("-").slice(1).join("/")}
                />
                <YAxis
                  stroke="#78716c"
                  tick={{ fill: "#78716c", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  content={<BalanceTooltip />}
                  cursor={{ stroke: "#ffffff10", strokeWidth: 1 }}
                />
                <ReferenceLine y={0} stroke="#ffffff10" strokeWidth={1} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="url(#splitColor)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#1c1917",
                    stroke: "#a8a29e",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: 30% Insights Panel */}
        <div className="w-full lg:w-72 bg-stone-950/30 p-6 flex flex-col gap-6">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider font-mono">
            Key Insights
          </h3>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-400 mb-1">
              <TrendingDown size={14} className="text-rose-400" />
              <span className="text-xs font-medium">Peak Spend</span>
            </div>
            <p className="text-lg font-extrabold text-white">
              $
              {insights.peakSpend.amount.toLocaleString(undefined, {
                minimumFractionDigits: 0,
              })}
            </p>
            <p className="text-[11px] text-stone-500 font-mono">
              {insights.peakSpend.date || "N/A"}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-400 mb-1">
              <TrendingUp size={14} className="text-indigo-400" />
              <span className="text-xs font-medium">Highest Inflow</span>
            </div>
            <p className="text-lg font-extrabold text-white">
              $
              {insights.highestInflow.amount.toLocaleString(undefined, {
                minimumFractionDigits: 0,
              })}
            </p>
            <p className="text-[11px] text-stone-500 font-mono">
              {insights.highestInflow.date || "N/A"}
            </p>
          </div>

          <div className="space-y-1 mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-stone-400 mb-1">
              <AlertCircle size={14} className="text-stone-500" />
              <span className="text-xs font-medium">Volatility Index</span>
            </div>
            <p className="text-sm font-bold text-stone-300">Moderate</p>
          </div>
        </div>
      </div>

      {/* Grouped Comparative Bar Chart */}
      <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-sm font-bold text-white">Income vs Expense</h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Absolute magnitude comparison
            </p>
          </div>

          <div className="flex items-center bg-stone-950 border border-white/5 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setBarTimeframe("daily")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                barTimeframe === "daily"
                  ? "bg-stone-800 text-white shadow-sm border border-white/5"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setBarTimeframe("monthly")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                barTimeframe === "monthly"
                  ? "bg-stone-800 text-white shadow-sm border border-white/5"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-70 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeBarData}
              margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
              barGap={2}
              barSize={10}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff04"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#78716c"
                tick={{ fill: "#78716c", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                dy={10}
                tickFormatter={(val) =>
                  barTimeframe === "daily"
                    ? val.split("-").slice(1).join("/")
                    : val
                }
              />
              <YAxis
                stroke="#78716c"
                tick={{ fill: "#78716c", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                dx={-10}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<BarTooltip />}
                cursor={{ fill: "#ffffff03" }}
              />
              <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
