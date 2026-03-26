
// import React, { useEffect, useState, useMemo } from 'react';
// import { Check, X, AlertTriangle, ArrowUpRight, Loader2, ShieldAlert } from 'lucide-react';
// import { useAppStore } from '../store/useAppStore';
// import { supabase } from '../lib/supabaseClient';

// function detectAnomalies(transactions) {
//   if (!transactions.length) return [];

//   const debits = transactions.filter((tx) => tx.type === 'debit');

//   // --- Rule 1: Unusually large transactions (amount > mean + 2σ) ---
//   const amounts = debits.map((tx) => Number(tx.amount));
//   const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
//   const variance = amounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / amounts.length;
//   const stdDev = Math.sqrt(variance);
//   const threshold = mean + 2 * stdDev;

//   const anomalies = [];

//   debits.forEach((tx) => {
//     const amount = Number(tx.amount);
//     const reasons = [];

//     if (amount > threshold) {
//       reasons.push({
//         type: 'large',
//         label: `Amount > 2σ above mean (mean: ₹${Math.round(mean).toLocaleString('en-IN')})`,
//         score: Math.min(0.99, 0.7 + ((amount - threshold) / threshold) * 0.3),
//       });
//     }

//     // --- Rule 2: Uncategorized / unknown merchant ---
//     if (!tx.category || tx.category === 'Uncategorized'){
//       reasons.push({
//         type: 'unknown',
//         label: 'Merchant could not be categorized',
//         score: 0.75,
//       });
//     }

//     if (reasons.length > 0) {
//       const topReason = reasons.sort((a, b) => b.score - a.score)[0];
//       anomalies.push({
//         ...tx,
//         anomalyScore: topReason.score,
//         reason: topReason.label,
//         reasonType: topReason.type,
//         status: 'pending',
//       });
//     }
//   });

//   return anomalies.sort((a, b) => b.anomalyScore - a.anomalyScore);
// }

// const getScoreColor = (score) => {
//   if (score >= 0.9) return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
//   if (score >= 0.8) return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
//   return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
// };

// export default function Anomalies() {
//   const { transactions, setTransactions } = useAppStore();
//   const [isLoading, setIsLoading] = useState(false);
//   const [dismissed, setDismissed] = useState(new Set());
//   const [confirmed, setConfirmed] = useState(new Set());

//   // Rehydrate if store is empty
//   useEffect(() => {
//     const fetchData = async () => {
//       if (transactions && transactions.length > 0) return;
//       setIsLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from('transactions')
//           .select('*')
//           .order('date', { ascending: true });
//         if (error) throw error;
//         if (data) setTransactions(data);
//       } catch (err) {
//         console.error('Failed to fetch transactions:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [transactions, setTransactions]);

//   const allAnomalies = useMemo(() => detectAnomalies(transactions), [transactions]);

//   const visibleAnomalies = useMemo(
//     () => allAnomalies.filter((tx) => !dismissed.has(tx.id) && !confirmed.has(tx.id)),
//     [allAnomalies, dismissed, confirmed]
//   );

//   const contaminationRate = transactions.length
//     ? ((allAnomalies.length / transactions.length) * 100).toFixed(1)
//     : '0.0';

//   const fmt = (val) =>
//     `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 space-y-4">
//         <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
//         <p className="text-stone-400 font-medium">Running anomaly detection...</p>
//       </div>
//     );
//   }

//   if (!transactions || transactions.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 space-y-4 bg-stone-900/30 rounded-3xl border border-white/5">
//         <p className="text-stone-400 font-medium">No transaction data found. Please upload a statement.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 pb-10">

//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-extrabold text-white tracking-tight">Outlier Detection</h1>
//         <p className="text-stone-400 mt-1 text-sm">
//           Rule-based anomaly flagging — unusually large transactions and uncategorized merchants.
//         </p>
//       </div>

//       {/* KPI Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
//           <h3 className="text-stone-400 text-sm font-medium mb-2">Total Scanned</h3>
//           <p className="text-3xl font-extrabold text-white">
//             {transactions.length.toLocaleString('en-IN')}
//           </p>
//           <p className="text-xs text-stone-500 font-mono mt-1">debit transactions analysed</p>
//         </div>

//         <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-stone-400 text-sm font-medium">Active Anomalies</h3>
//             {visibleAnomalies.length > 0 && (
//               <span className="text-[10px] font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md uppercase border border-rose-400/20">
//                 Action Req
//               </span>
//             )}
//           </div>
//           <p className="text-3xl font-extrabold text-white">{visibleAnomalies.length}</p>
//           <p className="text-xs text-stone-500 font-mono mt-1">
//             {confirmed.size} confirmed · {dismissed.size} dismissed
//           </p>
//         </div>

//         <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
//           <h3 className="text-stone-400 text-sm font-medium mb-2">Contamination Rate</h3>
//           <p className="text-3xl font-extrabold text-white">{contaminationRate}%</p>
//           <p className="text-xs text-stone-500 font-mono mt-1">of total transactions flagged</p>
//         </div>
//       </div>

//       {/* Audit Queue */}
//       <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm overflow-hidden flex flex-col">

//         <div className="p-4 border-b border-white/5 bg-stone-950/20 flex items-center justify-between">
//           <h2 className="text-sm font-bold text-white">Review Queue</h2>
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-1.5">
//               <div className="w-2 h-2 rounded-full bg-rose-400"></div>
//               <span className="text-xs text-stone-500">High (≥0.9)</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className="w-2 h-2 rounded-full bg-amber-400"></div>
//               <span className="text-xs text-stone-500">Medium (≥0.8)</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
//               <span className="text-xs text-stone-500">Low</span>
//             </div>
//           </div>
//         </div>

//         {visibleAnomalies.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 space-y-3">
//             <ShieldAlert size={32} className="text-teal-500/40" />
//             <p className="text-stone-400 font-medium">No anomalies pending review</p>
//             <p className="text-xs text-stone-600">All flagged transactions have been resolved</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm whitespace-nowrap">
//               <thead className="bg-stone-950/40 border-b border-white/5 text-stone-500 font-medium text-[11px] uppercase tracking-wider">
//                 <tr>
//                   <th className="px-6 py-4">Date</th>
//                   <th className="px-6 py-4">Description</th>
//                   <th className="px-6 py-4">Category</th>
//                   <th className="px-6 py-4 text-right">Amount</th>
//                   <th className="px-6 py-4 text-center">Score</th>
//                   <th className="px-6 py-4">Flag Reason</th>
//                   <th className="px-6 py-4 text-center">Resolution</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/5">
//                 {visibleAnomalies.map((tx) => (
//                   <tr key={tx.id} className="hover:bg-white/2 transition-colors group">

//                     <td className="px-6 py-4 text-stone-400 font-mono text-xs">{tx.date}</td>

//                     <td className="px-6 py-4">
//                       <span className="font-medium text-stone-200 max-w-xs truncate block" title={tx.description}>
//                         {tx.description}
//                       </span>
//                       {tx.raw_description && (
//                         <span className="text-[11px] text-stone-600 font-mono truncate block max-w-xs" title={tx.raw_description}>
//                           {tx.raw_description}
//                         </span>
//                       )}
//                     </td>

//                     <td className="px-6 py-4">
//                       <span className="text-xs font-medium text-stone-400 bg-stone-800 border border-white/5 px-2 py-1 rounded-md">
//                         {tx.category || 'Uncategorized'}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4 text-right">
//                       <div className="flex items-center justify-end gap-1.5">
//                         <span className="font-mono font-medium text-rose-400">{fmt(tx.amount)}</span>
//                         <ArrowUpRight size={14} className="text-rose-500/50" />
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 text-center">
//                       <span className={`inline-flex items-center justify-center font-mono text-[11px] font-bold px-2 py-1 rounded border ${getScoreColor(tx.anomalyScore)}`}>
//                         {tx.anomalyScore.toFixed(2)}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <AlertTriangle size={14} className="text-stone-500 shrink-0" />
//                         <span className="text-[13px] text-stone-400 max-w-64 truncate" title={tx.reason}>
//                           {tx.reason}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 text-center">
//                       <div className="flex items-center justify-center gap-2">
//                         <button
//                           onClick={() => setDismissed((prev) => new Set([...prev, tx.id]))}
//                           className="p-1.5 rounded-md text-stone-500 hover:text-teal-300 hover:bg-teal-500/15 transition-all border border-transparent hover:border-teal-500/30 cursor-pointer"
//                           title="Dismiss — False Positive"
//                         >
//                           <Check size={16} strokeWidth={2.5} />
//                         </button>
//                         <button
//                           onClick={() => setConfirmed((prev) => new Set([...prev, tx.id]))}
//                           className="p-1.5 rounded-md text-stone-500 hover:text-rose-300 hover:bg-rose-500/15 transition-all border border-transparent hover:border-rose-500/30 cursor-pointer"
//                           title="Confirm Anomaly"
//                         >
//                           <X size={16} strokeWidth={2.5} />
//                         </button>
//                       </div>
//                     </td>

//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }












import React, { useEffect, useState, useMemo } from 'react';
import { Check, X, AlertTriangle, ArrowUpRight, Loader2, ShieldAlert, RefreshCw } from 'lucide-react';
import { detectAnomalies, getAnomalies, updateAnomalyStatus } from '../lib/api';

const getScoreColor = (score) => {
  if (score >= 0.9) return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  if (score >= 0.8) return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
  return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
};

export default function Anomalies() {
  const [anomalies, setAnomalies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');

  // Load existing anomalies from DB on mount
  useEffect(() => {
    const fetchAnomalies = async () => {
      setIsLoading(true);
      try {
        const data = await getAnomalies();
        setAnomalies(data.anomalies || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnomalies();
  }, []);

  const handleDetect = async () => {
    setIsDetecting(true);
    setError('');
    try {
      await detectAnomalies();
      // Re-fetch after detection
      const data = await getAnomalies();
      setAnomalies(data.anomalies || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleStatus = async (anomalyId, status) => {
    try {
      await updateAnomalyStatus(anomalyId, status);
      setAnomalies((prev) =>
        prev.map((a) => (a.id === anomalyId ? { ...a, status } : a))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const visible = useMemo(
    () => anomalies.filter((a) => a.status === 'pending'),
    [anomalies]
  );

  const confirmed = anomalies.filter((a) => a.status === 'confirmed').length;
  const dismissed = anomalies.filter((a) => a.status === 'dismissed').length;
  const total = anomalies.length;

  const fmt = (val) =>
    `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-stone-400 font-medium">Loading anomalies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Outlier Detection</h1>
          <p className="text-stone-400 mt-1 text-sm">
            Isolation Forest unsupervised anomaly detection on your transactions.
          </p>
        </div>
        <button
          onClick={handleDetect}
          disabled={isDetecting}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700 hover:bg-indigo-500 border border-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDetecting
            ? <><Loader2 size={16} className="animate-spin" /> Running model...</>
            : <><RefreshCw size={16} /> Run Detection</>
          }
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm">
          <h3 className="text-stone-400 text-sm font-medium mb-2">Total Flagged</h3>
          <p className="text-3xl font-extrabold text-white">{total}</p>
          <p className="text-xs text-stone-500 font-mono mt-1">across all runs</p>
        </div>
        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">Pending Review</h3>
            {visible.length > 0 && (
              <span className="text-[10px] font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md uppercase border border-rose-400/20">
                Action Req
              </span>
            )}
          </div>
          <p className="text-3xl font-extrabold text-white">{visible.length}</p>
          <p className="text-xs text-stone-500 font-mono mt-1">
            {confirmed} confirmed · {dismissed} dismissed
          </p>
        </div>
        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm">
          <h3 className="text-stone-400 text-sm font-medium mb-2">Model</h3>
          <p className="text-lg font-extrabold text-white">Isolation Forest</p>
          <p className="text-xs text-stone-500 font-mono mt-1">contamination: 5% · trees: 100</p>
        </div>
      </div>

      {/* Audit Queue */}
      <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm overflow-hidden">

        <div className="p-4 border-b border-white/5 bg-stone-950/20 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Review Queue</h2>
          <div className="flex items-center gap-3">
            {[['rose', 'High (≥0.9)'], ['amber', 'Medium (≥0.8)'], ['indigo', 'Low']].map(([color, label]) => (
              <div key={color} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full bg-${color}-400`}></div>
                <span className="text-xs text-stone-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <ShieldAlert size={32} className="text-teal-500/40" />
            <p className="text-stone-400 font-medium">
              {total === 0 ? 'No anomalies yet — click Run Detection to start' : 'All anomalies resolved'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-stone-950/40 border-b border-white/5 text-stone-500 font-medium text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">IF Score</th>
                  <th className="px-6 py-4">Flag Reason</th>
                  <th className="px-6 py-4 text-center">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visible.map((anomaly) => {
                  const tx = anomaly.transactions || {};
                  return (
                    <tr key={anomaly.id} className="hover:bg-white/2 transition-colors group">
                      <td className="px-6 py-4 text-stone-400 font-mono text-xs">{tx.date || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-stone-200 max-w-xs truncate block" title={tx.description}>
                          {tx.description || '—'}
                        </span>
                        {tx.raw_description && (
                          <span className="text-[11px] text-stone-600 font-mono truncate block max-w-xs">
                            {tx.raw_description}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-stone-400 bg-stone-800 border border-white/5 px-2 py-1 rounded-md">
                          {tx.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-mono font-medium text-rose-400">{fmt(tx.amount || 0)}</span>
                          <ArrowUpRight size={14} className="text-rose-500/50" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center font-mono text-[11px] font-bold px-2 py-1 rounded border ${getScoreColor(anomaly.anomaly_score)}`}>
                          {anomaly.anomaly_score?.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className="text-stone-500 shrink-0" />
                          <span className="text-[13px] text-stone-400 max-w-64 truncate" title={anomaly.reason}>
                            {anomaly.reason}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStatus(anomaly.id, 'dismissed')}
                            className="p-1.5 rounded-md text-stone-500 hover:text-teal-300 hover:bg-teal-500/15 transition-all border border-transparent hover:border-teal-500/30 cursor-pointer"
                            title="Dismiss — False Positive"
                          >
                            <Check size={16} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleStatus(anomaly.id, 'confirmed')}
                            className="p-1.5 rounded-md text-stone-500 hover:text-rose-300 hover:bg-rose-500/15 transition-all border border-transparent hover:border-rose-500/30 cursor-pointer"
                            title="Confirm Anomaly"
                          >
                            <X size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}