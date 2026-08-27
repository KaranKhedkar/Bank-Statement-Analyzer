// import React from 'react';
// import { 
//   DollarSign, TrendingUp, AlertTriangle, Activity, 
//   ArrowDownRight, ArrowUpRight 
// } from 'lucide-react';
// import { 
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend
// } from 'recharts';
// import StatCard from '../components/widgets/StatCard'; 


// const trendData = [
//   { month: 'Jan', actual: 4200, predicted: 4100 },
//   { month: 'Feb', actual: 3800, predicted: 3900 },
//   { month: 'Mar', actual: 5100, predicted: 4800 },
//   { month: 'Apr', actual: 4600, predicted: 4700 },
//   { month: 'May', actual: 5400, predicted: 5200 },
//   { month: 'Jun', actual: 4800, predicted: 5000 },
// ];

// const categoryData = [
//   { name: 'Cloud Infra', value: 2400 },
//   { name: 'SaaS Tools', value: 1800 },
//   { name: 'Marketing', value: 3200 },
//   { name: 'Travel', value: 900 },
// ];

// const PIE_COLORS = [
//   '#6366f1', // Indigo 500
//   '#8b5cf6', // Violet 500
//   '#4f46e5', // Indigo 600 (deeper)
//   '#475569'  // Slate 600
// ];

// export default function Overview() {
  
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-stone-900 border border-white/10 p-4 rounded-xl shadow-xl z-50">
//           <p className="text-stone-200 font-bold mb-2">{label}</p>
//           {payload.map((entry, index) => (
//             <div key={index} className="flex items-center gap-2 text-sm mt-1">
//               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
//               <span className="text-stone-400 capitalize">{entry.name}:</span>
//               <span className="text-stone-100 font-mono font-medium">${entry.value}</span>
//             </div>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

  
//   const statCardsData = [
//     {
//       id: 1,
//       title: "Total Spend (30d)",
//       value: "$24,892",
//       icon: DollarSign,
//       iconColor: "text-stone-300",
//       iconBg: "bg-stone-800 border-white/5",
//       badgeNode: (
//         <span className="flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md border border-purple-400/20">
//           <ArrowDownRight size={14} /> 12%
//         </span>
//       )
//     },
//     {
//       id: 2,
//       title: "Predicted Next Month",
//       value: "$26,100",
//       icon: TrendingUp,
//       iconColor: "text-indigo-400",
//       iconBg: "bg-indigo-500/10 border-indigo-500/20",
  
//     },
//     {
//       id: 3,
//       title: "Anomalies Detected",
//       value: "3",
//       valueSuffix: "flagged",
//       icon: AlertTriangle,
//       iconColor: "text-rose-400",
//       iconBg: "bg-rose-500/10 border-rose-500/20",

//     },
//     {
//       id: 4,
//       title: "Auto-Categorization",
//       value: "98.4%",
//       valueSuffix: "acc",
//       icon: Activity,
//       iconColor: "text-stone-300",
//       iconBg: "bg-stone-800 border-white/5",
//     }
//   ];

//   return (
//     <div className="space-y-6">
      
//       {/* 1. MAPPED METRIC CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCardsData.map((card) => (
//           <StatCard key={card.id} {...card} />
//         ))}
//       </div>

//       {/* 2. CHARTS ROW */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Line Chart */}
//         <div className="lg:col-span-2 bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-lg font-semibold text-white">Spend Forecast</h2>
//               <p className="text-sm text-stone-400">Actual expenses vs Prophet predictions</p>
//             </div>
//             <button className="text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg border border-white/5 transition-colors cursor-pointer">
//               View Report
//             </button>
//           </div>
          
//           <div className="flex-1 min-h-75 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
//                 <XAxis dataKey="month" stroke="#a8a29e" tick={{ fill: '#a8a29e', fontSize: 12 }} axisLine={false} tickLine={false} />
//                 <YAxis stroke="#a8a29e" tick={{ fill: '#a8a29e', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
//                 <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
//                 <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a8a29e' }} />
//                 <Line type="monotone" dataKey="actual" name="Actual Spend" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
//                 <Line type="monotone" dataKey="predicted" name="AI Prediction" stroke="#ec4899" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#ec4899', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Pie Chart */}
//         <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col">
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold text-white">Expense Breakdown</h2>
//             <p className="text-sm text-stone-400">Categorized via TF-IDF</p>
//           </div>
          
//           <div className="flex-1 min-h-75 w-full relative flex items-center justify-center">
//             <div className="absolute text-center pointer-events-none">
//               <p className="text-stone-400 text-xs font-medium">Top Category</p>
//               <p className="text-xl font-semibold text-white">Marketing</p>
//             </div>
            
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Tooltip content={<CustomTooltip />} />
//                 <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
//                   {categoryData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
        
//       </div>
//     </div>
//   );
// }








import React, { useMemo, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, AlertTriangle, Activity, 
  ArrowDownRight, ArrowUpRight 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../components/widgets/StatCard'; 
import { useAppStore } from '../store/useAppStore'; // <-- Imported Store

const PIE_COLORS = [
  '#6366f1', // Indigo 500
  '#8b5cf6', // Violet 500
  '#ec4899', // Pink 500
  '#f43f5e', // Rose 500
  '#14b8a6', // Teal 500
  '#475569'  // Slate 600 (Other)
];

export default function Overview() {
  const { 
    transactions, 
    categoryData, 
    forecastData, 
    anomalies, 
    fetchForecast, 
    fetchAnomalies 
  } = useAppStore();

  // Ensure background data is loaded if we land on Overview directly
  useEffect(() => {
    if (transactions.length > 0) {
      if (Object.keys(forecastData).length === 0) fetchForecast();
      if (anomalies.length === 0) fetchAnomalies();
    }
  }, [transactions.length, forecastData, anomalies.length, fetchForecast, fetchAnomalies]);

  // --- Core Calculations ---
  const { kpis, chartData, pieData } = useMemo(() => {
    if (!transactions.length) {
      return { kpis: null, chartData: [], pieData: [] };
    }

    // 1. Calculate 30-day Spend Trends based on the most recent transaction date
    const validDates = transactions.map(t => new Date(t.date).getTime()).filter(t => !isNaN(t));
    const maxDate = validDates.length > 0 ? new Date(Math.max(...validDates)) : new Date();
    
    const thirtyDaysAgo = new Date(maxDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(maxDate.getTime() - 60 * 24 * 60 * 60 * 1000);

    let spend30d = 0;
    let spendPrev30d = 0;

    transactions.forEach(t => {
      if (t.type !== 'debit') return;
      const tDate = new Date(t.date);
      if (tDate >= thirtyDaysAgo) spend30d += Number(t.amount);
      else if (tDate >= sixtyDaysAgo && tDate < thirtyDaysAgo) spendPrev30d += Number(t.amount);
    });

    const spendTrend = spendPrev30d ? ((spend30d - spendPrev30d) / spendPrev30d) * 100 : 0;

    // 2. Calculate Next Month Predicted Spend
    let predictedNextMonth = 0;
    if (Object.keys(forecastData).length > 0) {
      // Find the first future month key
      const firstCat = Object.values(forecastData)[0];
      if (firstCat && firstCat.length > 0) {
        const nextMonthStr = firstCat[0].month;
        Object.values(forecastData).forEach(preds => {
          const p = preds.find(x => x.month === nextMonthStr);
          if (p) predictedNextMonth += p.predicted_amount;
        });
      }
    }

    // 3. Auto-Categorization Accuracy
    const categorizedCount = transactions.filter(t => t.category && t.category !== 'Uncategorized').length;
    const catAccuracy = (categorizedCount / transactions.length) * 100;

    // 4. Build Pie Chart Data (Top 5 + Other)
    const sortedCategories = [...categoryData].sort((a, b) => b.spend - a.spend);
    let topPie = sortedCategories.slice(0, 5).map(c => ({ name: c.name, value: c.spend }));
    
    if (sortedCategories.length > 5) {
      const otherSpend = sortedCategories.slice(5).reduce((sum, c) => sum + c.spend, 0);
      topPie.push({ name: 'Other', value: otherSpend });
    }

    // 5. Build Spend Forecast Line Chart
    const histMap = {};
    transactions.forEach(t => {
      if (t.type !== 'debit') return;
      const month = t.date.substring(0, 7); // YYYY-MM
      histMap[month] = (histMap[month] || 0) + Number(t.amount);
    });

    const futMap = {};
    Object.entries(forecastData).forEach(([cat, preds]) => {
      preds.forEach(p => {
        const month = p.month.substring(0, 7);
        futMap[month] = (futMap[month] || 0) + p.predicted_amount;
      });
    });

    const allMonths = Array.from(new Set([...Object.keys(histMap), ...Object.keys(futMap)])).sort();
    const lastHistKey = Object.keys(histMap).sort().pop();

    const mergedTrend = allMonths.map(m => {
      const d = new Date(`${m}-02`);
      let actual = histMap[m] ? Math.round(histMap[m]) : null;
      let predicted = futMap[m] ? Math.round(futMap[m]) : null;

      // Anchor prediction line to historical actuals for visual continuity
      if (m === lastHistKey) predicted = actual;

      return {
        month: d.toLocaleString('default', { month: 'short' }),
        actual,
        predicted
      };
    });

    return {
      kpis: {
        spend30d,
        spendTrend,
        predictedNextMonth,
        catAccuracy,
        pendingAnomalies: anomalies.filter(a => a.status === 'pending').length
      },
      chartData: mergedTrend,
      pieData: topPie
    };
  }, [transactions, categoryData, forecastData, anomalies]);

  // --- Formatters ---
  const fmt = (val) => `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const fmtK = (val) => `₹${(val / 1000).toFixed(1)}k`;

  // --- Empty State ---
  if (!kpis) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <Activity className="w-12 h-12 text-stone-700" />
        <p className="text-stone-400 font-medium">Upload a bank statement to generate your dashboard.</p>
      </div>
    );
  }

  // --- Render Configuration ---
  const statCardsData = [
    {
      id: 1,
      title: "Total Spend (30d)",
      value: fmt(kpis.spend30d),
      icon: DollarSign,
      iconColor: "text-stone-300",
      iconBg: "bg-stone-800 border-white/5",
      badgeNode: (
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md border ${kpis.spendTrend > 0 ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : 'text-teal-400 bg-teal-400/10 border-teal-400/20'}`}>
          {kpis.spendTrend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
          {Math.abs(kpis.spendTrend).toFixed(1)}%
        </span>
      )
    },
    {
      id: 2,
      title: "Predicted Next Month",
      value: kpis.predictedNextMonth > 0 ? fmt(kpis.predictedNextMonth) : "Pending...",
      icon: TrendingUp,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      id: 3,
      title: "Action Required",
      value: kpis.pendingAnomalies.toString(),
      valueSuffix: "flags",
      icon: AlertTriangle,
      iconColor: kpis.pendingAnomalies > 0 ? "text-rose-400" : "text-teal-400",
      iconBg: kpis.pendingAnomalies > 0 ? "bg-rose-500/10 border-rose-500/20" : "bg-teal-500/10 border-teal-500/20",
    },
    {
      id: 4,
      title: "AI Categorization",
      value: `${kpis.catAccuracy.toFixed(1)}%`,
      valueSuffix: "acc",
      icon: Activity,
      iconColor: "text-stone-300",
      iconBg: "bg-stone-800 border-white/5",
    }
  ];

  const topCategoryName = pieData.length > 0 ? pieData[0].name : "No Data";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 border border-white/10 p-4 rounded-xl shadow-xl z-50">
          <p className="text-stone-200 font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-stone-400 capitalize">{entry.name}:</span>
              <span className="text-stone-100 font-mono font-medium">{fmt(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. MAPPED METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCardsData.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* 2. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Spend Timeline</h2>
              <p className="text-sm text-stone-400">Historical sequence & Prophet outlook</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="month" stroke="#78716c" tick={{ fill: '#78716c', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#78716c" tick={{ fill: '#78716c', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={fmtK} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a8a29e', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="actual" name="Actual Spend" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} connectNulls />
                <Line type="monotone" dataKey="predicted" name="AI Prediction" stroke="#ec4899" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#ec4899', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Expense Breakdown</h2>
            <p className="text-sm text-stone-400">Categorical density</p>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full relative flex items-center justify-center">
            <div className="absolute text-center pointer-events-none z-10">
              <p className="text-stone-500 text-[10px] uppercase font-bold tracking-wider mb-1">Top Category</p>
              <p className="text-lg font-semibold text-white max-w-[100px] leading-tight truncate">{topCategoryName}</p>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={75} 
                  outerRadius={105} 
                  paddingAngle={3} 
                  dataKey="value" 
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}