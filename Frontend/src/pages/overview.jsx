import React from 'react';
import { 
  DollarSign, TrendingUp, AlertTriangle, Activity, 
  ArrowDownRight, ArrowUpRight 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../components/widgets/StatCard'; 


const trendData = [
  { month: 'Jan', actual: 4200, predicted: 4100 },
  { month: 'Feb', actual: 3800, predicted: 3900 },
  { month: 'Mar', actual: 5100, predicted: 4800 },
  { month: 'Apr', actual: 4600, predicted: 4700 },
  { month: 'May', actual: 5400, predicted: 5200 },
  { month: 'Jun', actual: 4800, predicted: 5000 },
];

const categoryData = [
  { name: 'Cloud Infra', value: 2400 },
  { name: 'SaaS Tools', value: 1800 },
  { name: 'Marketing', value: 3200 },
  { name: 'Travel', value: 900 },
];

const PIE_COLORS = [
  '#6366f1', // Indigo 500
  '#8b5cf6', // Violet 500
  '#4f46e5', // Indigo 600 (deeper)
  '#475569'  // Slate 600
];

export default function Overview() {
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 border border-white/10 p-4 rounded-xl shadow-xl z-50">
          <p className="text-stone-200 font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-stone-400 capitalize">{entry.name}:</span>
              <span className="text-stone-100 font-mono font-medium">${entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  
  const statCardsData = [
    {
      id: 1,
      title: "Total Spend (30d)",
      value: "$24,892",
      icon: DollarSign,
      iconColor: "text-stone-300",
      iconBg: "bg-stone-800 border-white/5",
      badgeNode: (
        <span className="flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md border border-purple-400/20">
          <ArrowDownRight size={14} /> 12%
        </span>
      )
    },
    {
      id: 2,
      title: "Predicted Next Month",
      value: "$26,100",
      icon: TrendingUp,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
  
    },
    {
      id: 3,
      title: "Anomalies Detected",
      value: "3",
      valueSuffix: "flagged",
      icon: AlertTriangle,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/20",

    },
    {
      id: 4,
      title: "Auto-Categorization",
      value: "98.4%",
      valueSuffix: "acc",
      icon: Activity,
      iconColor: "text-stone-300",
      iconBg: "bg-stone-800 border-white/5",
    }
  ];

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
              <h2 className="text-lg font-semibold text-white">Spend Forecast</h2>
              <p className="text-sm text-stone-400">Actual expenses vs Prophet predictions</p>
            </div>
            <button className="text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg border border-white/5 transition-colors cursor-pointer">
              View Report
            </button>
          </div>
          
          <div className="flex-1 min-h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#a8a29e" tick={{ fill: '#a8a29e', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#a8a29e" tick={{ fill: '#a8a29e', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a8a29e' }} />
                <Line type="monotone" dataKey="actual" name="Actual Spend" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="predicted" name="AI Prediction" stroke="#ec4899" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#ec4899', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Expense Breakdown</h2>
            <p className="text-sm text-stone-400">Categorized via TF-IDF</p>
          </div>
          
          <div className="flex-1 min-h-75 w-full relative flex items-center justify-center">
            <div className="absolute text-center pointer-events-none">
              <p className="text-stone-400 text-xs font-medium">Top Category</p>
              <p className="text-xl font-semibold text-white">Marketing</p>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                  {categoryData.map((entry, index) => (
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