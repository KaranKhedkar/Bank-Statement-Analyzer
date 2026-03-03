import React, { useState } from "react";
import {
  TrendingUp,
  Calendar,
  Activity,
  Settings2,
  ArrowUpRight,
  ArrowDownRight,
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

// --- Mock Time-Series Data ---
// The data structure links historical actuals to future predictions.
// The 'range' array drives the confidence interval shading [lowerBound, upperBound].
const forecastData = [
  { month: 'Sep', actual: 11200, range: [11200, 11200] },
  { month: 'Oct', actual: 12400, range: [12400, 12400] },
  { month: 'Nov', actual: 11800, range: [11800, 11800] },
  { month: 'Dec', actual: 14500, range: [14500, 14500] },
  { month: 'Jan', actual: 13800, predicted: 13800, range: [13800, 13800] }, // Origin node
  { month: 'Feb', predicted: 14200, range: [13500, 14900] },
  { month: 'Mar', predicted: 15100, range: [14100, 16100] },
  { month: 'Apr', predicted: 14800, range: [13500, 16200] },
  { month: 'May', predicted: 15600, range: [14000, 17200] },
];

const categoryVelocity = [
  {
    category: "Cloud Infra",
    trend: "+12.4%",
    impact: "High",
    amount: "$4,200",
    direction: "up",
  },
  {
    category: "Marketing",
    trend: "+8.1%",
    impact: "Medium",
    amount: "$3,800",
    direction: "up",
  },
  {
    category: "Travel",
    trend: "-5.2%",
    impact: "Low",
    amount: "$1,200",
    direction: "down",
  },
  {
    category: "SaaS Tools",
    trend: "+2.1%",
    impact: "Low",
    amount: "$2,400",
    direction: "up",
  },
];

export default function Forecast() {
  const [timeframe, setTimeframe] = useState("90d");

  // Custom tooltip to handle array data (confidence bounds) and scalar data simultaneously
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 border border-white/10 p-4 rounded-xl shadow-xl z-50 min-w-40">
          <p className="text-stone-200 font-bold mb-3">{label} 2026</p>
          {payload.map((entry, index) => {
            // Ignore the range data key in the tooltip list for cleaner UX,
            // but calculate it if needed. We only display scalar values here.
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
                  ${entry.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Predictive Forecast
          </h1>
          <p className="text-stone-400 mt-1 text-sm">
            Time-series projection utilizing the Prophet algorithm.
          </p>
        </div>

        <div className="flex items-center bg-stone-900 border border-white/10 rounded-lg p-1 shadow-sm">
          {["30d", "60d", "90d"].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                timeframe === period
                  ? "bg-stone-800 text-white shadow-sm border border-white/5"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {period.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

     {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Projected Spend */}
        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">
              Projected Spend ({timeframe})
            </h3>
         
          </div>
          <p className="text-3xl font-semibold text-white">$44,500</p>
        </div>

        {/* Card 2: Trajectory */}
        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">
              Trajectory (MoM)
            </h3>
            <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md border border-rose-400/20">
              <ArrowUpRight size={14} /> 8.4%
            </span>
          </div>
          <p className="text-3xl font-semibold text-white">
            Accelerating
          </p>
        </div>

        {/* Card 3: Model Error */}
        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">
              Model Error (MAPE)
            </h3>
    
          </div>
          <p className="text-3xl font-semibold text-white">4.2%</p>
        </div>
        
      </div>

      {/* Main Chart Architecture */}
      <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-white">
              Expenditure Projection
            </h2>
            <p className="text-sm text-stone-400">
              Historical sequence vs Prophet confidence intervals (ŷ)
            </p>
          </div>
          <button className="flex items-center gap-2 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg border border-white/5 transition-colors cursor-pointer">
            <Settings2 size={14} /> Tune Model
          </button>
        </div>

        <div style={{ width: '100%', height: 350 }} className="mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={forecastData}
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
                tickFormatter={(val) => `$${val / 1000}k`}
                dx={-10}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#ffffff10", strokeWidth: 1 }}
              />

              {/* Vertical line indicating the "Present" node */}
              <ReferenceLine
                x="Jan"
                stroke="#78716c"
                strokeDasharray="3 3"
                opacity={0.5}
              />

              {/* Confidence Interval (yhat_lower, yhat_upper) */}
              {/* Confidence Interval */}
              <Area
                type="monotone"
                dataKey="range"
                stroke="none"
                fill="#ec4899"
                fillOpacity={0.08}
                activeDot={false}
                connectNulls
              />

              {/* Historical Actuals */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
              />

              {/* Forecast */}
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
      <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Forecast Drivers</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Categorical velocity contributing to the projected trend.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-950/40 border-b border-white/5 text-stone-500 font-medium text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Predicted Volume</th>
                <th className="px-5 py-3 text-center">Trend (MoM)</th>
                <th className="px-5 py-3 text-right">Model Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categoryVelocity.map((item, index) => (
                <tr key={index} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3 font-medium text-stone-200">
                    {item.category}
                  </td>
                  <td className="px-5 py-3 font-mono text-stone-400 text-xs">
                    {item.amount}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-xs ${item.direction === "up" ? "text-rose-400" : "text-teal-400"}`}
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
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        item.impact === "High"
                          ? "text-rose-400"
                          : item.impact === "Medium"
                            ? "text-indigo-400"
                            : "text-stone-500"
                      }`}
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
