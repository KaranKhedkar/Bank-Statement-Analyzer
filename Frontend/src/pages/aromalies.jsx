
import React, { useState } from 'react';
import { Filter, Check, X, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// --- Mock Anomaly Data ---
const mockAnomalies = [
  {
    id: 'anm_001',
    date: '2026-02-24 03:14 AM',
    merchant: 'AWS EMEA SARL',
    category: 'Cloud Infra',
    actualAmount: 4250.00,
    expectedRange: '$800 - $1,200',
    anomalyScore: 0.94,
    reason: 'Amount > 3σ from historical mean',
    status: 'pending',
    direction: 'high'
  },
  {
    id: 'anm_002',
    date: '2026-02-22 11:45 PM',
    merchant: 'UNKNOWN_WIRE_INTL',
    category: 'Uncategorized',
    actualAmount: 850.00,
    expectedRange: 'N/A',
    anomalyScore: 0.88,
    reason: 'Unrecognized vendor + offshore routing',
    status: 'pending',
    direction: 'high'
  },
  {
    id: 'anm_004',
    date: '2026-02-20 09:00 AM',
    merchant: 'Slack Technologies',
    category: 'SaaS Tools',
    actualAmount: 0.00,
    expectedRange: '$120 - $130',
    anomalyScore: 0.85,
    reason: 'Missing expected recurring payment',
    status: 'pending',
    direction: 'low'
  },
  {
    id: 'anm_003',
    date: '2026-02-18 14:20 PM',
    merchant: 'Uber *Trip',
    category: 'Transport',
    actualAmount: 412.50,
    expectedRange: '$15 - $45',
    anomalyScore: 0.82,
    reason: 'Velocity spike (4th transport charge in 2hrs)',
    status: 'pending',
    direction: 'high'
  }
];

export default function Anomalies() {
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced contrast mapping
  const getScoreColor = (score) => {
    if (score >= 0.9) return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    if (score >= 0.8) return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
    return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
  };

  return (
    <div className="space-y-6">
      
      {/* Header (Stripped of table-specific actions) */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Outlier Detection</h1>
        <p className="text-stone-400 mt-1 text-sm">Isolation Forest unassisted anomaly flagging requiring manual audit.</p>
      </div>

      {/* Quantitative KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">Total Scanned</h3>
          </div>
          <p className="text-3xl font-semibold text-white">12,450</p>
        </div>

        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">Active Anomalies</h3>
            <span className="text-[10px] font-bold text-rose-400/70 bg-rose-400/10 px-2 py-1 rounded-md uppercase tracking-wider border border-rose-400/20">Action Req</span>
          </div>
          <p className="text-3xl font-semibold text-white">4</p>
        </div>

        <div className="bg-stone-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-stone-400 text-sm font-medium">Contamination Rate</h3>
          </div>
          <p className="text-3xl font-semibold text-white">0.03%</p>
        </div>
        
      </div>

      {/* Audit Queue Table */}
      <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm overflow-hidden flex flex-col">
        
        {/* Encapsulated Toolbar */}
        <div className="p-4 border-b border-white/5 bg-stone-950/20 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Review Queue</h2>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-white/10 hover:border-white/20 text-stone-300 text-xs font-medium rounded-lg transition-colors cursor-pointer">
            <Filter size={14} /> Filter Queue
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-950/40 border-b border-white/5 text-stone-500 font-medium text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Deviation</th>
                <th className="px-6 py-4 text-center">IF Score</th>
                <th className="px-6 py-4">Flag Reason</th>
                <th className="px-6 py-4 text-center">Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockAnomalies.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/2 transition-colors group">
                  
                  <td className="px-6 py-4 text-stone-400 font-mono text-xs">
                    {tx.date}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-200">{tx.merchant}</span>
                      <span className="text-[11px] text-stone-500 mt-0.5">{tx.category}</span>
                    </div>
                  </td>

                  {/* Directional Deviation Logic */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-medium ${tx.direction === 'low' ? 'text-amber-400' : 'text-rose-400'}`}>
                          ${tx.actualAmount.toFixed(2)}
                        </span>
                        {tx.direction === 'low' ? (
                          <ArrowDownRight size={14} className="text-amber-500/50" />
                        ) : (
                          <ArrowUpRight size={14} className="text-rose-500/50" />
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 font-mono mt-0.5">Exp: {tx.expectedRange}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center font-mono text-[11px] font-bold px-2 py-1 rounded border ${getScoreColor(tx.anomalyScore)}`}>
                      {tx.anomalyScore.toFixed(2)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-stone-500" />
                      <span className="text-[13px] text-stone-400 max-w-55 truncate" title={tx.reason}>
                        {tx.reason}
                      </span>
                    </div>
                  </td>

                  {/* Enhanced Hover Affordances */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="p-1.5 rounded-md text-stone-500 hover:text-teal-300 hover:bg-teal-500/15 transition-all border border-transparent hover:border-teal-500/30 cursor-pointer"
                        title="Mark as Valid (False Positive)"
                      >
                        <Check size={16} strokeWidth={2.5} />
                      </button>
                      <button 
                        className="p-1.5 rounded-md text-stone-500 hover:text-rose-300 hover:bg-rose-500/15 transition-all border border-transparent hover:border-rose-500/30 cursor-pointer"
                        title="Confirm Anomaly"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
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