// import React, { useState, useEffect, useMemo } from "react";
// import {
//   TrendingUp,
//   TrendingDown,
//   Activity,
//   Settings2,
//   ArrowUpRight,
//   ArrowDownRight,
//   Loader2,
// } from "lucide-react";
// import {
//   ComposedChart,
//   Line,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   ReferenceLine,
// } from "recharts";
// import { useAppStore } from "../store/useAppStore";

// export default function Forecast() {
//   const [timeframe, setTimeframe] = useState("all");
//   const { transactions, forecastData, fetchForecast, isForecastLoading } =
//     useAppStore();

//   // Fetch forecast if it hasn't been loaded yet
//   useEffect(() => {
//     if (transactions.length > 0 && Object.keys(forecastData).length === 0) {
//       fetchForecast();
//     }
//   }, [transactions.length, forecastData, fetchForecast]);

//   // Transform Database Data -> Chart Data with Timeframe Filter
//   const { chartData, kpis, drivers } = useMemo(() => {
//     if (!transactions.length || Object.keys(forecastData).length === 0) {
//       return { chartData: [], kpis: {}, drivers: [] };
//     }

//     const now = new Date();
//     // Determine how many days of HISTORY to show
//     const lookbackDays =
//       timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : 365;
//     const cutoffDate = new Date(
//       now.getTime() - lookbackDays * 24 * 60 * 60 * 1000,
//     );

//     // 1. Aggregate historical transactions (Filtered by timeframe)
//     const histMap = {};
//     transactions.forEach((tx) => {
//       if (tx.type !== "debit") return;
//       const date = new Date(tx.date);
//       if (date < cutoffDate && timeframe !== "all") return; // Filter history

//       const mKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
//       histMap[mKey] = (histMap[mKey] || 0) + Number(tx.amount);
//     });

//     // 2. Aggregate forecast (Always show full 6 months)
//     const futMap = {};
//     Object.entries(forecastData).forEach(([cat, predictions]) => {
//       predictions.forEach((p) => {
//         const mKey = p.month.substring(0, 7);
//         if (!futMap[mKey]) futMap[mKey] = { predicted: 0, lower: 0, upper: 0 };
//         futMap[mKey].predicted += p.predicted_amount;
//         futMap[mKey].lower += p.lower_bound;
//         futMap[mKey].upper += p.upper_bound;
//       });
//     });

//     // 3. Merge & Align
//     const allKeys = Array.from(
//       new Set([...Object.keys(histMap), ...Object.keys(futMap)]),
//     ).sort();
//     const lastHistKey = Object.keys(histMap).sort().pop();

//     const combined = allKeys.map((key) => {
//       const date = new Date(`${key}-02`);
//       const label =
//         date.toLocaleString("default", { month: "short" }) +
//         " " +
//         date.getFullYear().toString().slice(-2);
//       const actual = histMap[key] || null;
//       let predicted = futMap[key]?.predicted || null;
//       let range = futMap[key] ? [futMap[key].lower, futMap[key].upper] : null;

//       if (key === lastHistKey) {
//         predicted = actual;
//         range = [actual, actual];
//       }

//       return {
//         month: label,
//         actual: actual ? Math.round(actual) : null,
//         predicted: predicted ? Math.round(predicted) : null,
//         range: range ? [Math.round(range[0]), Math.round(range[1])] : null,
//         rawKey: key,
//       };
//     });

//     // 4. KPI Calcs
//     const nextMonthKey = Object.keys(futMap).sort()[0];
//     const nextMonthProj = futMap[nextMonthKey]?.predicted || 0;
//     const lastMonthActual = histMap[lastHistKey] || 0;
//     const momTrend = lastMonthActual
//       ? ((nextMonthProj - lastMonthActual) / lastMonthActual) * 100
//       : 0;

//     return {
//       chartData: combined,
//       kpis: {
//         projected: nextMonthProj,
//         trend: momTrend,
//         lastHistMonth: combined.find((d) => d.rawKey === lastHistKey)?.month,
//       },
//       drivers: Object.entries(forecastData)
//         .map(([category, preds]) => {
//           const p = preds[0];
//           return {
//             category,
//             trend: `${(((p.predicted_amount - p.hist_avg) / p.hist_avg) * 100).toFixed(1)}%`,
//             amount: `₹${Math.round(p.predicted_amount).toLocaleString()}`,
//             direction: p.predicted_amount > p.hist_avg ? "up" : "down",
//             impact: p.predicted_amount > 10000 ? "High" : "Medium",
//           };
//         })
//         .sort((a, b) => b.amount - a.amount),
//     };
//   }, [transactions, forecastData, timeframe]); // Added timeframe to dependencies

//   // Formatting Helpers
//   const fmt = (val) =>
//     `₹${Number(val).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
//   const fmtK = (val) => `₹${(val / 1000).toFixed(0)}k`;

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-stone-900 border border-white/10 p-4 rounded-xl shadow-xl z-50 min-w-40">
//           <p className="text-stone-200 font-bold mb-3">{label}</p>
//           {payload.map((entry, index) => {
//             if (entry.dataKey === "range") return null;

//             return (
//               <div
//                 key={index}
//                 className="flex items-center justify-between gap-4 text-sm mt-1.5"
//               >
//                 <div className="flex items-center gap-2">
//                   <div
//                     className="w-2 h-2 rounded-full"
//                     style={{ backgroundColor: entry.color }}
//                   />
//                   <span className="text-stone-400 capitalize">
//                     {entry.name === "actual"
//                       ? "Actual Spend"
//                       : "Prophet Forecast"}
//                   </span>
//                 </div>
//                 <span className="text-stone-100 font-mono font-medium">
//                   {fmt(entry.value)}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       );
//     }
//     return null;
//   };

//   if (isForecastLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 space-y-4">
//         <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
//         <p className="text-stone-400 font-medium">
//           Generating Prophet forecast models...
//         </p>
//       </div>
//     );
//   }

//   if (!chartData.length) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 space-y-4">
//         <Activity className="w-8 h-8 text-stone-600" />
//         <p className="text-stone-400 font-medium">
//           Upload transactions to generate a forecast.
//         </p>
//       </div>
//     );
//   }

//   const presentNode = kpis.lastHistMonth;

//   return (
//     <div className="space-y-6 pb-10">
//       {/* Header & Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-white tracking-tight">
//             Predictive Forecast
//           </h1>
//           <p className="text-stone-400 mt-1 text-sm">
//             Time-series projection utilizing Python's Prophet algorithm.
//           </p>
//         </div>
//       </div>

//       {/* KPI Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5 shadow-sm">
//           <h3 className="text-stone-400 text-sm font-medium mb-2">
//             Projected Next Month
//           </h3>
//           <p className="text-3xl font-semibold text-white">
//             {fmt(kpis.projected)}
//           </p>
//         </div>

//         <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5 shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-stone-400 text-sm font-medium">
//               Trajectory (MoM)
//             </h3>
//             <span
//               className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md border ${kpis.trend > 0 ? "text-rose-400 bg-rose-400/10 border-rose-400/20" : "text-teal-400 bg-teal-400/10 border-teal-400/20"}`}
//             >
//               {kpis.trend > 0 ? (
//                 <ArrowUpRight size={14} />
//               ) : (
//                 <ArrowDownRight size={14} />
//               )}
//               {Math.abs(kpis.trend).toFixed(1)}%
//             </span>
//           </div>
//           <p className="text-3xl font-semibold text-white">
//             {kpis.trend > 0 ? "Accelerating" : "Cooling Down"}
//           </p>
//         </div>

//         <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5 shadow-sm">
//           <h3 className="text-stone-400 text-sm font-medium mb-2">
//             Model Engine
//           </h3>
//           <p className="text-lg font-extrabold text-white mt-2">
//             Prophet + WMA
//           </p>
//           <p className="text-xs text-stone-500 font-mono mt-0.5">
//             80% Confidence bounds (ŷ)
//           </p>
//         </div>
//       </div>

//       {/* Main Chart Architecture */}
//       <div className="bg-stone-900/50 p-6 rounded-3xl border border-white/5 shadow-sm">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-lg font-bold text-white">
//               Expenditure Projection
//             </h2>
//             <p className="text-sm text-stone-400">
//               Historical actuals vs bounded future predictions
//             </p>
//           </div>
//               <div className="flex items-center bg-stone-900 border border-white/10 rounded-lg p-1 shadow-sm">
//           {["30d", "90d", "all"].map((period) => (
//             <button
//               key={period}
//               onClick={() => setTimeframe(period)}
//               className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer capitalize ${
//                 timeframe === period
//                   ? "bg-stone-800 text-white shadow-sm border border-white/5"
//                   : "text-stone-400 hover:text-stone-200"
//               }`}
//             >
//               {period}
//             </button>
//           ))}
//         </div>
//         </div>

   

//         <div style={{ width: "100%", height: 350 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <ComposedChart
//               data={chartData}
//               margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
//             >
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="#ffffff08"
//                 vertical={false}
//               />
//               <XAxis
//                 dataKey="month"
//                 stroke="#78716c"
//                 tick={{ fill: "#78716c", fontSize: 12 }}
//                 axisLine={false}
//                 tickLine={false}
//                 dy={10}
//               />
//               <YAxis
//                 stroke="#78716c"
//                 tick={{ fill: "#78716c", fontSize: 12 }}
//                 axisLine={false}
//                 tickLine={false}
//                 tickFormatter={fmtK}
//                 dx={-10}
//               />
//               <Tooltip
//                 content={<CustomTooltip />}
//                 cursor={{ stroke: "#ffffff10", strokeWidth: 1 }}
//               />

//               <ReferenceLine
//                 x={presentNode}
//                 stroke="#78716c"
//                 strokeDasharray="3 3"
//                 opacity={0.5}
//                 label={{
//                   position: "top",
//                   value: "Today",
//                   fill: "#78716c",
//                   fontSize: 10,
//                 }}
//               />

//               <Area
//                 type="monotone"
//                 dataKey="range"
//                 stroke="none"
//                 fill="#ec4899"
//                 fillOpacity={0.08}
//                 activeDot={false}
//                 connectNulls
//               />
//               <Line
//                 type="monotone"
//                 dataKey="actual"
//                 stroke="#6366f1"
//                 strokeWidth={2.5}
//                 dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
//                 activeDot={{ r: 6, strokeWidth: 0 }}
//                 connectNulls
//               />
//               <Line
//                 type="monotone"
//                 dataKey="predicted"
//                 stroke="#ec4899"
//                 strokeWidth={2.5}
//                 strokeDasharray="5 5"
//                 dot={{ r: 4, fill: "#ec4899", strokeWidth: 0 }}
//                 activeDot={{ r: 6, strokeWidth: 0 }}
//                 connectNulls
//               />
//             </ComposedChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Driver Analysis Table */}
//       <div className="bg-stone-900/50 rounded-2xl border border-white/5 shadow-sm overflow-hidden">
//         <div className="p-5 border-b border-white/5">
//           <h2 className="text-sm font-bold text-white">Forecast Drivers</h2>
//           <p className="text-xs text-stone-500 mt-0.5">
//             Category-level volatility contributing to the projected trend vs
//             historical averages.
//           </p>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm whitespace-nowrap">
//             <thead className="bg-stone-950/40 border-b border-white/5 text-stone-500 font-medium text-[11px] uppercase tracking-wider">
//               <tr>
//                 <th className="px-5 py-3">Category</th>
//                 <th className="px-5 py-3 text-right">Predicted Volume</th>
//                 <th className="px-5 py-3 text-center">Trend (vs Avg)</th>
//                 <th className="px-5 py-3 text-right">Model Impact</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {drivers.map((item, index) => (
//                 <tr key={index} className="hover:bg-white/2 transition-colors">
//                   <td className="px-5 py-3 font-medium text-stone-200">
//                     {item.category}
//                   </td>
//                   <td className="px-5 py-3 font-mono text-stone-400 text-xs text-right">
//                     {item.amount}
//                   </td>
//                   <td className="px-5 py-3 text-center">
//                     <span
//                       className={`inline-flex items-center justify-center w-20 gap-1 font-mono text-xs ${item.direction === "up" ? "text-rose-400" : "text-teal-400"}`}
//                     >
//                       {item.direction === "up" ? (
//                         <ArrowUpRight size={14} />
//                       ) : (
//                         <ArrowDownRight size={14} />
//                       )}
//                       {item.trend}
//                     </span>
//                   </td>
//                   <td className="px-5 py-3 text-right">
//                     <span
//                       className={`text-[10px] font-bold uppercase tracking-wider ${item.impact === "High" ? "text-rose-400" : item.impact === "Medium" ? "text-indigo-400" : "text-stone-500"}`}
//                     >
//                       {item.impact}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }










import React, { useState, useEffect, useMemo } from "react";
import { useRef } from 'react';
import {
  TrendingUp,
  Activity,
  Settings2,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  ShieldAlert
} from "lucide-react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useAppStore } from "../store/useAppStore";

export default function Forecast() {
  const [timeframe, setTimeframe] = useState("all");
  const { transactions, forecastData, fetchForecast, isForecastLoading } = useAppStore();
  const hasFetched = useRef(false); // This persists across renders

  // useEffect(() => {
  //   if (transactions.length > 0) {
  //     fetchForecast(timeframe);
  //   }
  // }, [timeframe, transactions.length, fetchForecast]);

   useEffect(() => {
    // 1. Only run if we have transactions
    // 2. Only run if we haven't successfully fetched in this session
    // 3. Only run if the forecastData in the store is actually empty
    if (transactions.length > 0 && !hasFetched.current && Object.keys(forecastData).length === 0) {
      console.log("🚀 Triggering Forecast Fetch...");
      hasFetched.current = true; // Set this IMMEDIATELY before the call
      fetchForecast("all");
    }
  }, [transactions.length]); // ONLY watch transactions.length

  const { chartData, kpis, drivers } = useMemo(() => {
    if (!transactions.length || !forecastData || Object.keys(forecastData).length === 0) {
      return { chartData: [], kpis: {}, drivers: [] };
    }

    const now = new Date();
    const lookbackDays = timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : 365;
    const cutoffDate = new Date(now.getTime() - lookbackDays * 24 * 60 * 60 * 1000);

    const histMap = {};
    transactions.forEach((tx) => {
      if (tx.type !== "debit") return;
      const date = new Date(tx.date);
      if (timeframe !== "all" && date < cutoffDate) return;

      const mKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      histMap[mKey] = (histMap[mKey] || 0) + Number(tx.amount);
    });

    const futMap = {};
    Object.entries(forecastData).forEach(([cat, predictions]) => {
      if (!Array.isArray(predictions)) return;
      predictions.forEach((p) => {
        const mKey = p.month.substring(0, 7);
        if (!futMap[mKey]) futMap[mKey] = { predicted: 0, lower: 0, upper: 0 };
        futMap[mKey].predicted += p.predicted_amount || 0;
        futMap[mKey].lower += p.lower_bound || 0;
        futMap[mKey].upper += p.upper_bound || 0;
      });
    });

    const allKeys = Array.from(new Set([...Object.keys(histMap), ...Object.keys(futMap)])).sort();
    const lastHistKey = Object.keys(histMap).sort().pop();

    const combined = allKeys.map((key) => {
      const date = new Date(`${key}-02`);
      const label = date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear().toString().slice(-2);
      const actual = histMap[key] || null;
      let predicted = futMap[key]?.predicted || null;
      let range = futMap[key] ? [futMap[key].lower, futMap[key].upper] : null;

      if (key === lastHistKey) {
        predicted = actual;
        range = [actual, actual];
      }

      return {
        month: label,
        actual: actual ? Math.round(actual) : null,
        predicted: predicted ? Math.round(predicted) : null,
        range: range ? [Math.round(range[0]), Math.round(range[1])] : null,
        rawKey: key,
      };
    });

    const sortedFutKeys = Object.keys(futMap).sort();
    const nextMonthKey = sortedFutKeys[0];
    const nextMonthProj = futMap[nextMonthKey]?.predicted || 0;
    const lastMonthActual = histMap[lastHistKey] || 0;
    const momTrend = lastMonthActual ? ((nextMonthProj - lastMonthActual) / lastMonthActual) * 100 : 0;

    const driverList = Object.entries(forecastData)
      .map(([category, preds]) => {
        if (!preds || preds.length === 0) return null;
        const p = preds[0];
        const proj = p.predicted_amount || 0;
        const avg = p.hist_avg || 1; // avoid div by zero
        const trendPct = ((proj - avg) / avg) * 100;

        return {
          category,
          trend: `${trendPct > 0 ? "+" : ""}${trendPct.toFixed(1)}%`,
          amount: `₹${Math.round(proj).toLocaleString("en-IN")}`,
          direction: trendPct > 0 ? "up" : "down",
          impact: proj > 10000 ? "High" : proj > 5000 ? "Medium" : "Low",
          rawAmount: proj
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.rawAmount - a.rawAmount);

    return {
      chartData: combined,
      kpis: {
        projected: nextMonthProj,
        trend: momTrend,
        lastHistMonth: combined.find((d) => d.rawKey === lastHistKey)?.month,
      },
      drivers: driverList,
    };
  }, [transactions, forecastData, timeframe]);

  const fmt = (val) => `₹${Number(val).toLocaleString("en-IN")}`;

  if (isForecastLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-stone-400 font-medium">Training AI Model...</p>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Activity className="w-8 h-8 text-stone-600" />
        <p className="text-stone-400">No data available for this timeframe.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Predictive Forecast</h1>
          <p className="text-stone-400 mt-1 text-sm">Prophet time-series analysis</p>
        </div>

        <div className="flex items-center bg-stone-900 border border-white/10 rounded-lg p-1">
          {["30d", "90d", "all"].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer uppercase ${
                timeframe === period ? "bg-stone-800 text-white border border-white/5" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5">
          <h3 className="text-stone-400 text-sm font-medium mb-1">Projected Spend</h3>
          <p className="text-3xl font-semibold text-white">{fmt(kpis.projected)}</p>
        </div>
        <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5">
          <h3 className="text-stone-400 text-sm font-medium mb-1">Trajectory (MoM)</h3>
          <p className={`text-xl font-bold ${kpis.trend > 0 ? 'text-rose-400' : 'text-teal-400'}`}>
            {kpis.trend > 0 ? <ArrowUpRight className="inline mr-1" /> : <ArrowDownRight className="inline mr-1" />}
            {Math.abs(kpis.trend).toFixed(1)}%
          </p>
        </div>
        <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5">
          <h3 className="text-stone-400 text-sm font-medium mb-1">Engine</h3>
          <p className="text-xl font-bold text-white">Prophet L4</p>
        </div>
      </div>

      <div className="bg-stone-900/50 p-6 rounded-3xl border border-white/5">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white">Expenditure Projection</h2>
          <p className="text-sm text-stone-400">Dashed line indicates AI forecast</p>
        </div>

        {/* ✅ Container with fixed min-height to fix width(-1) error */}
        <div className="w-full min-h-[400px]">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="month" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #444', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <ReferenceLine x={kpis.lastHistMonth} stroke="#78716c" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="range" fill="#ec4899" fillOpacity={0.05} stroke="none" connectNulls />
              <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} connectNulls />
              <Line type="monotone" dataKey="predicted" stroke="#ec4899" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-stone-900/50 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-stone-950/20">
          <h2 className="text-sm font-bold text-white">Forecast Drivers</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-stone-500 text-[11px] uppercase bg-stone-950/40">
            <tr>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Proj. Volume</th>
              <th className="px-6 py-4 text-center">Trend</th>
              <th className="px-6 py-4 text-right">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {drivers.map((item, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-stone-200 font-medium">{item.category}</td>
                <td className="px-6 py-4 text-stone-400 font-mono">{item.amount}</td>
                <td className={`px-6 py-4 text-center font-mono ${item.direction === 'up' ? 'text-rose-400' : 'text-teal-400'}`}>
                  {item.trend}
                </td>
                <td className="px-6 py-4 text-right font-bold text-[10px] uppercase text-stone-500">{item.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}