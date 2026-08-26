
// import React from 'react';
// import { Filter, Download } from 'lucide-react';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
// import { useAppStore } from '../store/useAppStore'



// const PIE_COLORS = ['#6366f1', '#8b5cf6', '#38bdf8', '#10b981', '#f43f5e', '#475569', '#a8a29e'];

// export default function Categories() {
//   const { categoryData } = useAppStore();
//   const totalSpend = categoryData.reduce((acc, curr) => acc + curr.spend, 0);
//   const maxSpend = Math.max(...categoryData.map(c => c.spend));

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
//               <span className="text-stone-100 font-mono">₹{data.spend.toLocaleString('en-IN')}</span>
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
//           <p className="text-stone-400 mt-1 text-sm">TF-IDF + SVM global distribution vectors.</p>
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

//       {/* Main Analytics Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Distribution Pie Chart */}
//         <div className="lg:col-span-1 bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col h-120">
//           <div className="mb-2">
//             <h2 className="text-sm font-bold text-white">Spend Distribution</h2>
//             <p className="text-xs text-stone-500 font-mono mt-0.5">Categorized Volume</p>
//           </div>
          
//           <div className="flex-1 w-full relative flex items-center justify-center" style={{ minHeight: '280px' }}>
//             <ResponsiveContainer width="100%" height={280}>
//               <PieChart>
//                 <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
//                 <Pie 
//                   data={categoryData} 
//                   cx="50%" 
//                   cy="50%" 
//                   innerRadius={80} 
//                   outerRadius={120} 
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
//               <p className="text-2xl font-mono font-bold text-white">₹{(totalSpend / 1000).toFixed(1)}k</p>
//             </div>
//           </div>
//         </div>

//         {/* Absolute Expenditure Horizontal Bars */}
//         <div className="lg:col-span-2 bg-stone-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col h-120">
//           <div className="mb-6 flex justify-between items-end border-b border-white/5 pb-4">
//             <div>
//               <h2 className="text-sm font-bold text-white">Expenditure by Taxonomy</h2>
//               <p className="text-xs text-stone-500 font-mono mt-0.5">Absolute volume mapping sorted by magnitude</p>
//             </div>
//           </div>

//           {/* Scrollable list with explicitly hidden scrollbars */}
//           <div className="flex-1 overflow-y-auto space-y-6 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//             {[...categoryData].sort((a, b) => b.spend - a.spend).map((cat, index) => {
//               const percentageOfMax = (cat.spend / maxSpend) * 100;
//               const distributionPct = ((cat.spend / totalSpend) * 100).toFixed(1);
//               const colorHex = PIE_COLORS[categoryData.indexOf(cat) % PIE_COLORS.length];

//               return (
//                 <div key={cat.name} className="group">
//                   <div className="flex justify-between items-end mb-2">
                    
//                     {/* Squeezed Category Name */}
//                     <div className="flex items-center gap-2.5 w-1/3 pr-4">
//                       <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colorHex }}></div>
//                       <span className="text-sm font-medium text-stone-200 truncate" title={cat.name}>
//                         {cat.name}
//                       </span>
//                     </div>
                    
//                     {/* Aligned Metrics */}
//                     <div className="flex items-center justify-end gap-3 sm:gap-6 flex-1">
//                       <span className="text-xs text-stone-500 font-mono w-16 text-right hidden sm:block">
//                         {cat.count} txns
//                       </span>
//                       <span className="text-xs text-stone-400 font-mono w-12 text-right">
//                         {distributionPct}%
//                       </span>
//                       <span className="text-sm font-mono font-bold text-stone-300 w-24 text-right">
//                         ₹{cat.spend.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
//                       </span>
//                     </div>
                    
//                   </div>
                  
//                   {/* Progress Track */}
//                   <div className="h-1.5 w-full bg-stone-950 rounded-full overflow-hidden border border-white/5">
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
//     </div>
//   );
// }








//new code - gemini
import React, { useEffect, useState } from 'react';
import { Filter, Download, Loader2 } from 'lucide-react'; // Added Loader2
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabaseClient'; // Adjust this path to wherever your Supabase client is!

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#38bdf8', '#10b981', '#f43f5e', '#475569', '#a8a29e'];

export default function Categories() {
  // 1. Pull setTransactions from the store as well
  const { categoryData, setTransactions } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // 2. Fetch data automatically if the store is empty (like after a refresh)
  useEffect(() => {
    const fetchExistingData = async () => {
      // If we already have data in memory, skip fetching
      if (categoryData && categoryData.length > 0) return;
      if (hasFetched) return;

      setIsLoading(true);
      try {
        // Because of RLS, this automatically only fetches THIS user's transactions
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        
        if (data) {
          setTransactions(data); // This will auto-calculate your categoryData in the store!
        }
      } catch (err) {
        console.error("Failed to fetch data on refresh:", err);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    };

    fetchExistingData();
  }, [categoryData, setTransactions, hasFetched]);

  // 3. Safety Check: If data is empty, Math.max will crash the page. Default to 0.
  const totalSpend = categoryData.reduce((acc, curr) => acc + curr.spend, 0);
  const maxSpend = categoryData.length > 0 ? Math.max(...categoryData.map(c => c.spend)) : 0;

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
              <span className="text-stone-100 font-mono">₹{data.spend.toLocaleString('en-IN')}</span>
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

  // 4. Show a loading state while fetching from the database
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-stone-400 font-medium">Rehydrating data...</p>
      </div>
    );
  }

  // 5. Show an empty state if they truly have no data in the database
  if (categoryData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 bg-stone-900/30 rounded-3xl border border-white/5">
        <p className="text-stone-400 font-medium">No transaction data found. Please upload a statement.</p>
      </div>
    );
  }

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
          
          <div className="flex-1 w-full relative flex items-center justify-center" style={{ minHeight: '280px' }}>
            <ResponsiveContainer width="100%" height={280}>
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
              <p className="text-2xl font-mono font-bold text-white">₹{(totalSpend / 1000).toFixed(1)}k</p>
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
                <div key={cat.name} className="group">
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
                        ₹{cat.spend.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
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

