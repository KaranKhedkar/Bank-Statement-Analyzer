import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Settings2,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
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
  const { transactions, forecastData, fetchForecast, isForecastLoading } =
    useAppStore();

  // Fetch forecast if it hasn't been loaded yet
  useEffect(() => {
    if (transactions.length > 0 && Object.keys(forecastData).length === 0) {
      fetchForecast();
    }
  }, [transactions.length, forecastData, fetchForecast]);

  // // Transform Database Data -> Chart Data
  // const { chartData, kpis, drivers } = useMemo(() => {
  //   // Safety check: Return empty arrays/objects if data isn't ready
  //   if (!transactions.length || Object.keys(forecastData).length === 0) {
  //     return { chartData: [], kpis: {}, drivers: [] };
  //   }

  //   // 1. Aggregate historical transactions by month (Debits only)
  //   const histMap = {};
  //   transactions.forEach((tx) => {
  //     if (tx.type !== "debit") return;
  //     const date = new Date(tx.date);
  //     const mKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  //     histMap[mKey] = (histMap[mKey] || 0) + Number(tx.amount);
  //   });

  //   // 2. Aggregate forecast by month across all categories
  //   const futMap = {};
  //   Object.entries(forecastData).forEach(([cat, predictions]) => {
  //     predictions.forEach((p) => {
  //       const mKey = p.month.substring(0, 7); // "YYYY-MM"
  //       if (!futMap[mKey]) futMap[mKey] = { predicted: 0, lower: 0, upper: 0 };
  //       futMap[mKey].predicted += p.predicted_amount;
  //       futMap[mKey].lower += p.lower_bound;
  //       futMap[mKey].upper += p.upper_bound;
  //     });
  //   });

  //   // 3. Merge into a single chronological array
  //   const allKeys = Array.from(new Set([...Object.keys(histMap), ...Object.keys(futMap)])).sort();
  //   const lastHistKey = Object.keys(histMap).sort().pop(); // The "Present" node

  //   const combined = allKeys.map((key) => {
  //     // Create a clean date label like "Jan 26"
  //     const date = new Date(`${key}-02`);
  //     const label = date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear().toString().slice(-2);

  //     const actual = histMap[key] || null;
  //     let predicted = futMap[key]?.predicted || null;
  //     let range = futMap[key] ? [futMap[key].lower, futMap[key].upper] : null;

  //     // Anchor the starting point of the prediction to the last actual month.
  //     if (key === lastHistKey) {
  //       predicted = actual;
  //       range = [actual, actual];
  //     }

  //     return {
  //       month: label,
  //       actual: actual ? Math.round(actual) : null,
  //       predicted: predicted ? Math.round(predicted) : null,
  //       range: range ? [Math.round(range[0]), Math.round(range[1])] : null,
  //       rawKey: key,
  //     };
  //   });

  //   // 4. Calculate KPIs
  //   const nextMonthKey = Object.keys(futMap).sort()[0];
  //   const nextMonthProj = futMap[nextMonthKey]?.predicted || 0;
  //   const lastMonthActual = histMap[lastHistKey] || 0;
  //   const momTrend = lastMonthActual ? ((nextMonthProj - lastMonthActual) / lastMonthActual) * 100 : 0;

  //   // 5. Driver Analysis (Category Velocity)
  //   const driverList = Object.entries(forecastData)
  //     .map(([category, preds]) => {
  //       const nextMonth = preds[0];
  //       const histAvg = nextMonth.hist_avg;
  //       const proj = nextMonth.predicted_amount;
  //       const trendPct = histAvg && histAvg > 0 ? ((proj - histAvg) / histAvg) * 100 : 0;

  //       let impact = "Low";
  //       if (Math.abs(trendPct) > 15 || proj > 10000) impact = "High";
  //       else if (Math.abs(trendPct) > 5) impact = "Medium";

  //       return {
  //         category,
  //         trend: `${trendPct > 0 ? "+" : ""}${trendPct.toFixed(1)}%`,
  //         impact,
  //         amount: `₹${Math.round(proj).toLocaleString("en-IN")}`,
  //         direction: trendPct > 0 ? "up" : "down",
  //         rawProj: proj,
  //       };
  //     })
  //     .sort((a, b) => b.rawProj - a.rawProj); // Sort by highest predicted spend

  //   return {
  //     chartData: combined,
  //     kpis: {
  //       projected: nextMonthProj,
  //       trend: momTrend,
  //       // ✅ FIX IS HERE: Use 'combined' array instead of 'chartData'
  //       lastHistMonth: combined.find((d) => d.rawKey === lastHistKey)?.month,
  //     },
  //     drivers: driverList,
  //   };
  // }, [transactions, forecastData]);

  // Transform Database Data -> Chart Data with Timeframe Filter
  const { chartData, kpis, drivers } = useMemo(() => {
    if (!transactions.length || Object.keys(forecastData).length === 0) {
      return { chartData: [], kpis: {}, drivers: [] };
    }

    const now = new Date();
    // Determine how many days of HISTORY to show
    const lookbackDays =
      timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : 365;
    const cutoffDate = new Date(
      now.getTime() - lookbackDays * 24 * 60 * 60 * 1000,
    );

    // 1. Aggregate historical transactions (Filtered by timeframe)
    const histMap = {};
    transactions.forEach((tx) => {
      if (tx.type !== "debit") return;
      const date = new Date(tx.date);
      if (date < cutoffDate && timeframe !== "all") return; // Filter history

      const mKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      histMap[mKey] = (histMap[mKey] || 0) + Number(tx.amount);
    });

    // 2. Aggregate forecast (Always show full 6 months)
    const futMap = {};
    Object.entries(forecastData).forEach(([cat, predictions]) => {
      predictions.forEach((p) => {
        const mKey = p.month.substring(0, 7);
        if (!futMap[mKey]) futMap[mKey] = { predicted: 0, lower: 0, upper: 0 };
        futMap[mKey].predicted += p.predicted_amount;
        futMap[mKey].lower += p.lower_bound;
        futMap[mKey].upper += p.upper_bound;
      });
    });

    // 3. Merge & Align
    const allKeys = Array.from(
      new Set([...Object.keys(histMap), ...Object.keys(futMap)]),
    ).sort();
    const lastHistKey = Object.keys(histMap).sort().pop();

    const combined = allKeys.map((key) => {
      const date = new Date(`${key}-02`);
      const label =
        date.toLocaleString("default", { month: "short" }) +
        " " +
        date.getFullYear().toString().slice(-2);
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

    // 4. KPI Calcs
    const nextMonthKey = Object.keys(futMap).sort()[0];
    const nextMonthProj = futMap[nextMonthKey]?.predicted || 0;
    const lastMonthActual = histMap[lastHistKey] || 0;
    const momTrend = lastMonthActual
      ? ((nextMonthProj - lastMonthActual) / lastMonthActual) * 100
      : 0;

    return {
      chartData: combined,
      kpis: {
        projected: nextMonthProj,
        trend: momTrend,
        lastHistMonth: combined.find((d) => d.rawKey === lastHistKey)?.month,
      },
      drivers: Object.entries(forecastData)
        .map(([category, preds]) => {
          const p = preds[0];
          return {
            category,
            trend: `${(((p.predicted_amount - p.hist_avg) / p.hist_avg) * 100).toFixed(1)}%`,
            amount: `₹${Math.round(p.predicted_amount).toLocaleString()}`,
            direction: p.predicted_amount > p.hist_avg ? "up" : "down",
            impact: p.predicted_amount > 10000 ? "High" : "Medium",
          };
        })
        .sort((a, b) => b.amount - a.amount),
    };
  }, [transactions, forecastData, timeframe]); // Added timeframe to dependencies

  // Formatting Helpers
  const fmt = (val) =>
    `₹${Number(val).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  const fmtK = (val) => `₹${(val / 1000).toFixed(0)}k`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 border border-white/10 p-4 rounded-xl shadow-xl z-50 min-w-40">
          <p className="text-stone-200 font-bold mb-3">{label}</p>
          {payload.map((entry, index) => {
            if (entry.dataKey === "range") return null;

            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4 text-sm mt-1.5"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-stone-400 capitalize">
                    {entry.name === "actual"
                      ? "Actual Spend"
                      : "Prophet Forecast"}
                  </span>
                </div>
                <span className="text-stone-100 font-mono font-medium">
                  {fmt(entry.value)}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (isForecastLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-stone-400 font-medium">
          Generating Prophet forecast models...
        </p>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Activity className="w-8 h-8 text-stone-600" />
        <p className="text-stone-400 font-medium">
          Upload transactions to generate a forecast.
        </p>
      </div>
    );
  }

  const presentNode = kpis.lastHistMonth;

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Predictive Forecast
          </h1>
          <p className="text-stone-400 mt-1 text-sm">
            Time-series projection utilizing Python's Prophet algorithm.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5 shadow-sm">
          <h3 className="text-stone-400 text-sm font-medium mb-2">
            Projected Next Month
          </h3>
          <p className="text-3xl font-semibold text-white">
            {fmt(kpis.projected)}
          </p>
        </div>

        <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">
              Trajectory (MoM)
            </h3>
            <span
              className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md border ${kpis.trend > 0 ? "text-rose-400 bg-rose-400/10 border-rose-400/20" : "text-teal-400 bg-teal-400/10 border-teal-400/20"}`}
            >
              {kpis.trend > 0 ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {Math.abs(kpis.trend).toFixed(1)}%
            </span>
          </div>
          <p className="text-3xl font-semibold text-white">
            {kpis.trend > 0 ? "Accelerating" : "Cooling Down"}
          </p>
        </div>

        <div className="bg-stone-900/50 p-6 rounded-2xl border border-white/5 shadow-sm">
          <h3 className="text-stone-400 text-sm font-medium mb-2">
            Model Engine
          </h3>
          <p className="text-lg font-extrabold text-white mt-2">
            Prophet + WMA
          </p>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            80% Confidence bounds (ŷ)
          </p>
        </div>
      </div>

      {/* Main Chart Architecture */}
      <div className="bg-stone-900/50 p-6 rounded-3xl border border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-white">
              Expenditure Projection
            </h2>
            <p className="text-sm text-stone-400">
              Historical actuals vs bounded future predictions
            </p>
          </div>
              <div className="flex items-center bg-stone-900 border border-white/10 rounded-lg p-1 shadow-sm">
          {["30d", "90d", "all"].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer capitalize ${
                timeframe === period
                  ? "bg-stone-800 text-white shadow-sm border border-white/5"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
        </div>

   

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff08"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#78716c"
                tick={{ fill: "#78716c", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                stroke="#78716c"
                tick={{ fill: "#78716c", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={fmtK}
                dx={-10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#ffffff10", strokeWidth: 1 }}
              />

              <ReferenceLine
                x={presentNode}
                stroke="#78716c"
                strokeDasharray="3 3"
                opacity={0.5}
                label={{
                  position: "top",
                  value: "Today",
                  fill: "#78716c",
                  fontSize: 10,
                }}
              />

              <Area
                type="monotone"
                dataKey="range"
                stroke="none"
                fill="#ec4899"
                fillOpacity={0.08}
                activeDot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#ec4899"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: "#ec4899", strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Driver Analysis Table */}
      <div className="bg-stone-900/50 rounded-2xl border border-white/5 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Forecast Drivers</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Category-level volatility contributing to the projected trend vs
            historical averages.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-950/40 border-b border-white/5 text-stone-500 font-medium text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Predicted Volume</th>
                <th className="px-5 py-3 text-center">Trend (vs Avg)</th>
                <th className="px-5 py-3 text-right">Model Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {drivers.map((item, index) => (
                <tr key={index} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3 font-medium text-stone-200">
                    {item.category}
                  </td>
                  <td className="px-5 py-3 font-mono text-stone-400 text-xs text-right">
                    {item.amount}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-20 gap-1 font-mono text-xs ${item.direction === "up" ? "text-rose-400" : "text-teal-400"}`}
                    >
                      {item.direction === "up" ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                      {item.trend}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${item.impact === "High" ? "text-rose-400" : item.impact === "Medium" ? "text-indigo-400" : "text-stone-500"}`}
                    >
                      {item.impact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
