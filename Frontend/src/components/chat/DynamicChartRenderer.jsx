import React from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const DEFAULT_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#64748b'  // Slate
];

const fmtINR = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  return `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-900/95 backdrop-blur-md border border-white/15 p-3 rounded-xl shadow-2xl z-50 text-xs">
        {label && <p className="text-stone-300 font-semibold mb-1.5">{label}</p>}
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 my-0.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-stone-400 capitalize">{entry.name}:</span>
            <span className="text-stone-100 font-mono font-semibold">{fmtINR(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DynamicChartRenderer({ chart }) {
  if (!chart || !chart.data || chart.data.length === 0) {
    return null;
  }

  const { type = 'bar', title, data, xKey = 'name', yKeys = [{ key: 'value', name: 'Amount (₹)', color: '#6366f1' }] } = chart;

  return (
    <div className="my-3 p-4 bg-stone-900/80 border border-white/10 rounded-2xl shadow-lg backdrop-blur-md">
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            {title}
          </h4>
          <span className="text-[10px] text-stone-400 font-mono uppercase bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
            {type} chart
          </span>
        </div>
      )}

      <div className="w-full h-56 min-h-[220px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          {type === 'pie' ? (
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey={yKeys[0]?.key || 'value'}
                nameKey={xKey}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', color: '#a8a29e', paddingTop: '6px' }}
              />
            </PieChart>
          ) : type === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis
                dataKey={xKey}
                stroke="#78716c"
                tick={{ fill: '#78716c', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#78716c"
                tick={{ fill: '#78716c', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff15', strokeWidth: 1 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#a8a29e' }} />
              {yKeys.map((yk, idx) => (
                <Line
                  key={yk.key}
                  type="monotone"
                  dataKey={yk.key}
                  name={yk.name || yk.key}
                  stroke={yk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: yk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          ) : type === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="copilotAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis
                dataKey={xKey}
                stroke="#78716c"
                tick={{ fill: '#78716c', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#78716c"
                tick={{ fill: '#78716c', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={yKeys[0]?.key || 'value'}
                name={yKeys[0]?.name || 'Amount'}
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#copilotAreaGrad)"
                strokeWidth={2.5}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis
                dataKey={xKey}
                stroke="#78716c"
                tick={{ fill: '#78716c', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#78716c"
                tick={{ fill: '#78716c', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#a8a29e' }} />
              {yKeys.map((yk, idx) => (
                <Bar
                  key={yk.key}
                  dataKey={yk.key}
                  name={yk.name || yk.key}
                  fill={yk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
