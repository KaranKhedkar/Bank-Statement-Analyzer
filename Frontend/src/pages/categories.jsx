// import React, { useState } from 'react';
// import { Search, Filter, Download, PieChart as PieIcon, Layers, BrainCircuit } from 'lucide-react';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// import ConfidenceBadge from '../components/ui/ConfidenceBadge';

// // --- Mock Aggregated Category Data ---
// const categoryData = [
//   { id: 'cat_1', name: 'Cloud Infra', spend: 12400, count: 42, avgConfidence: 0.96 },
//   { id: 'cat_2', name: 'Marketing', spend: 8200, count: 18, avgConfidence: 0.91 },
//   { id: 'cat_3', name: 'SaaS Tools', spend: 4100, count: 56, avgConfidence: 0.98 },
//   { id: 'cat_4', name: 'Travel', spend: 2800, count: 12, avgConfidence: 0.84 },
//   { id: 'cat_5', name: 'Meals & Ent', spend: 1200, count: 34, avgConfidence: 0.88 },
//   { id: 'cat_6', name: 'Uncategorized', spend: 850, count: 3, avgConfidence: 0.42 },
// ];

// // Elegant Data Vis Palette: Indigo, Violet, Muted Blue, Emerald, Rose, Slate
// const PIE_COLORS = ['#6366f1', '#8b5cf6', '#38bdf8', '#10b981', '#f43f5e', '#475569'];

// export default function Categories() {
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const totalSpend = categoryData.reduce((acc, curr) => acc + curr.spend, 0);
//   const maxSpend = Math.max(...categoryData.map(c => c.spend)); // Add this line

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div className="bg-stone-900 border border-white/10 p-4 rounded-xl shadow-xl z-50 min-w-45">
//           <div className="flex items-center gap-2 mb-2">
//             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
//             <p className="text-stone-200 font-bold">{data.name}</p>
//           </div>
//           <div className="space-y-1 text-sm">
//             <div className="flex justify-between text-stone-400">
//               <span>Volume:</span>
//               <span className="text-stone-100 font-mono">${data.spend.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between text-stone-400">
//               <span>Transactions:</span>
//               <span className="text-stone-100 font-mono">{data.count}</span>
//             </div>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="space-y-6 pb-10">
      
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-extrabold text-white tracking-tight">Categorical Analysis</h1>
//           <p className="text-stone-400 mt-1 text-sm">TF-IDF + SVM global distribution and confidence vectors.</p>
//         </div>
        
//         <div className="flex items-center gap-2 w-full sm:w-auto">
//           <button className="flex items-center gap-2 px-3 py-2 bg-stone-900 border border-white/10 hover:border-white/20 text-stone-300 text-sm font-medium rounded-lg transition-colors cursor-pointer">
//             <Filter size={14} /> Filter
//           </button>
//           <button className="flex items-center gap-2 px-3 py-2 bg-stone-900 border border-white/10 hover:border-white/20 text-stone-300 text-sm font-medium rounded-lg transition-colors cursor-pointer">
//             <Download size={14} /> Export
//           </button>
//         </div>
//       </div>

//       {/* Analytics Top Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Distribution Chart */}
//         <div className="lg:col-span-1 bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col h-95">
//           <div className="mb-2">
//             <h2 className="text-sm font-bold text-white">Spend Distribution</h2>
//             <p className="text-xs text-stone-500 font-mono mt-0.5">Categorized Volume</p>
//           </div>
          
//           <div className="flex-1 w-full relative flex items-center justify-center">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
//                 <Pie 
//                   data={categoryData} 
//                   cx="50%" 
//                   cy="50%" 
//                   innerRadius={70} 
//                   outerRadius={100} 
//                   paddingAngle={4} 
//                   dataKey="spend" 
//                   stroke="none"
//                 >
//                   {categoryData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="absolute text-center pointer-events-none">
//               <p className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">Total</p>
//               <p className="text-xl font-mono font-bold text-white">${(totalSpend / 1000).toFixed(1)}k</p>
//             </div>
//           </div>
//         </div>

//         {/* Aggregated KPI Metrics */}
//       {/* Absolute Expenditure Horizontal Bars */}
//         <div className="lg:col-span-2 bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col h-[380px]">
//           <div className="mb-6 flex justify-between items-end border-b border-white/5 pb-4">
//             <div>
//               <h2 className="text-sm font-bold text-white">Expenditure by Taxonomy</h2>
//               <p className="text-xs text-stone-500 font-mono mt-0.5">Absolute volume mapping sorted by magnitude</p>
//             </div>
//           </div>

//           {/* Scrollable list for categories */}
//           <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pr-2">
//             {/* Sort data descending by spend before mapping */}
//             {[...categoryData].sort((a, b) => b.spend - a.spend).map((cat, index) => {
//               // Calculate width relative to the highest spending category
//               const percentageOfMax = (cat.spend / maxSpend) * 100;
//               // Ensure color inheritance matches the Pie Chart
//               const colorHex = PIE_COLORS[categoryData.indexOf(cat) % PIE_COLORS.length];

//               return (
//                 <div key={cat.id} className="group">
//                   <div className="flex justify-between items-end mb-2">
//                     <span className="text-sm font-medium text-stone-200 flex items-center gap-2.5">
//                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorHex }}></div>
//                       {cat.name}
//                     </span>
//                     <div className="flex items-center gap-3">
//                       <span className="text-xs text-stone-500 font-mono">{cat.count} txns</span>
//                       <span className="text-sm font-mono font-bold text-stone-300 w-20 text-right">
//                         ${cat.spend.toLocaleString(undefined, { minimumFractionDigits: 0 })}
//                       </span>
//                     </div>
//                   </div>
//                   {/* Background Track */}
//                   <div className="h-1.5 w-full bg-stone-950 rounded-full overflow-hidden border border-white/5">
//                     {/* Active Bar */}
//                     <div
//                       className="h-full rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
//                       style={{ width: `${percentageOfMax}%`, backgroundColor: colorHex }}
//                     ></div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//       </div>

//       {/* Category Breakdown Table */}
//       <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm overflow-hidden flex flex-col">
        
//         <div className="p-4 border-b border-white/5 flex items-center justify-between bg-stone-950/20">
//           <div className="relative w-full max-w-sm">
//             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
//             <input 
//               type="text" 
//               placeholder="Search taxonomy..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-stone-900 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder:text-stone-500 outline-none transition-all"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm whitespace-nowrap">
//             <thead className="bg-stone-950/40 border-b border-white/5 text-stone-500 font-medium text-[11px] uppercase tracking-wider">
//               <tr>
//                 <th className="px-6 py-4">Category Name</th>
//                 <th className="px-6 py-4">Tx Count</th>
//                 <th className="px-6 py-4 text-right">Total Volume</th>
//                 <th className="px-6 py-4 w-64">Distribution %</th>
//                 <th className="px-6 py-4 text-center">Avg Confidence</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {categoryData.map((cat, index) => {
//                 const percentage = ((cat.spend / totalSpend) * 100).toFixed(1);
//                 const colorHex = PIE_COLORS[index % PIE_COLORS.length];
                
//                 return (
//                   <tr key={cat.id} className="hover:bg-white/2 transition-colors group">
                    
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorHex }}></div>
//                         <span className="font-bold text-stone-200">{cat.name}</span>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4 text-stone-400 font-mono text-xs">
//                       {cat.count}
//                     </td>

//                     <td className="px-6 py-4 text-right">
//                       <span className="font-mono font-medium text-stone-200">
//                         ${cat.spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <span className="text-xs font-mono text-stone-400 w-10 text-right">{percentage}%</span>
//                         <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
//                           <div 
//                             className="h-full rounded-full opacity-80 group-hover:opacity-100 transition-opacity" 
//                             style={{ width: `${percentage}%`, backgroundColor: colorHex }}
//                           ></div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 text-center">
//                       <ConfidenceBadge score={cat.avgConfidence} />
//                     </td>

//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }









import React from 'react';
import { Filter, Download } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// --- Mock Aggregated Category Data ---
const categoryData = [
  { id: 'cat_1', name: 'Cloud Infra', spend: 12400, count: 42 },
  { id: 'cat_2', name: 'Marketing', spend: 8200, count: 18 },
  { id: 'cat_3', name: 'SaaS Tools', spend: 4100, count: 56 },
  { id: 'cat_4', name: 'Travel', spend: 2800, count: 12 },
  { id: 'cat_5', name: 'Meals & Ent', spend: 1200, count: 34 },
  { id: 'cat_6', name: 'Uncategorized', spend: 850, count: 3 },
  { id: 'cat_7', name: 'Legal Fees', spend: 450, count: 1 },
];

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#38bdf8', '#10b981', '#f43f5e', '#475569', '#a8a29e'];

export default function Categories() {
  const totalSpend = categoryData.reduce((acc, curr) => acc + curr.spend, 0);
  const maxSpend = Math.max(...categoryData.map(c => c.spend));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 border border-white/10 p-4 rounded-xl shadow-xl z-50 min-w-45">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
            <p className="text-stone-200 font-bold">{data.name}</p>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-stone-400">
              <span>Volume:</span>
              <span className="text-stone-100 font-mono">${data.spend.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Transactions:</span>
              <span className="text-stone-100 font-mono">{data.count}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Categorical Analysis</h1>
          <p className="text-stone-400 mt-1 text-sm">TF-IDF + SVM global distribution vectors.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 py-2 bg-stone-900 border border-white/10 hover:border-white/20 text-stone-300 text-sm font-medium rounded-lg transition-colors cursor-pointer">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-stone-900 border border-white/10 hover:border-white/20 text-stone-300 text-sm font-medium rounded-lg transition-colors cursor-pointer">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Distribution Pie Chart */}
        <div className="lg:col-span-1 bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col h-120">
          <div className="mb-2">
            <h2 className="text-sm font-bold text-white">Spend Distribution</h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">Categorized Volume</p>
          </div>
          
          <div className="flex-1 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
                <Pie 
                  data={categoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={80} 
                  outerRadius={120} 
                  paddingAngle={4} 
                  dataKey="spend" 
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <p className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">Total</p>
              <p className="text-2xl font-mono font-bold text-white">${(totalSpend / 1000).toFixed(1)}k</p>
            </div>
          </div>
        </div>

        {/* Absolute Expenditure Horizontal Bars */}
        <div className="lg:col-span-2 bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col h-120">
          <div className="mb-6 flex justify-between items-end border-b border-white/5 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Expenditure by Taxonomy</h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">Absolute volume mapping sorted by magnitude</p>
            </div>
          </div>

          {/* Scrollable list with explicitly hidden scrollbars */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[...categoryData].sort((a, b) => b.spend - a.spend).map((cat, index) => {
              const percentageOfMax = (cat.spend / maxSpend) * 100;
              const distributionPct = ((cat.spend / totalSpend) * 100).toFixed(1);
              const colorHex = PIE_COLORS[categoryData.indexOf(cat) % PIE_COLORS.length];

              return (
                <div key={cat.id} className="group">
                  <div className="flex justify-between items-end mb-2">
                    
                    {/* Squeezed Category Name */}
                    <div className="flex items-center gap-2.5 w-1/3 pr-4">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colorHex }}></div>
                      <span className="text-sm font-medium text-stone-200 truncate" title={cat.name}>
                        {cat.name}
                      </span>
                    </div>
                    
                    {/* Aligned Metrics */}
                    <div className="flex items-center justify-end gap-3 sm:gap-6 flex-1">
                      <span className="text-xs text-stone-500 font-mono w-16 text-right hidden sm:block">
                        {cat.count} txns
                      </span>
                      <span className="text-xs text-stone-400 font-mono w-12 text-right">
                        {distributionPct}%
                      </span>
                      <span className="text-sm font-mono font-bold text-stone-300 w-24 text-right">
                        ${cat.spend.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    
                  </div>
                  
                  {/* Progress Track */}
                  <div className="h-1.5 w-full bg-stone-950 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ width: `${percentageOfMax}%`, backgroundColor: colorHex }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}