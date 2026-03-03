import React, { useState } from 'react';
import { Search, Filter, Download, MoreHorizontal, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

// --- Extracted UI Components (Inline for portability, move to src/components/ui/ in production) ---

const ConfidenceBadge = ({ score }) => {
  const isHighConfidence = score >= 0.9;
  const colorClass = isHighConfidence ? 'text-teal-400/80' : score >= 0.7 ? 'text-indigo-400' : 'text-rose-400';

  return (
    <div className="flex items-center justify-center gap-1">
      <span className={`font-mono text-[11px] ${colorClass}`}>
        {(score * 100).toFixed(0)}%
      </span>
      {isHighConfidence ? (
        <CheckCircle2 size={12} className={colorClass} />
      ) : (
        <div className={`w-1 h-1 rounded-full ${colorClass.replace('text-', 'bg-')}`}></div>
      )}
    </div>
  );
};

const StatusTag = ({ label, type = 'warning' }) => {
  const styles = {
    warning: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    info: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    success: 'text-teal-400 bg-teal-400/10 border-teal-400/20'
  };

  return (
    <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border ${styles[type]}`}>
      {type === 'warning' && <AlertCircle size={10} />}
      {label}
    </span>
  );
};

// --- Mock Data ---

const mockTransactions = [
  {
    id: 'tx_8923',
    date: '2026-02-24',
    rawText: 'POS DEBIT 12/04/2026 14:22 UBER *TRIP SFO CA',
    amount: 42.50,
    type: 'debit',
    mlOutput: {
      merchant: 'Uber',
      category: 'Transport',
      confidence: 0.98,
      flagged: false
    }
  },
  {
    id: 'tx_8924',
    date: '2026-02-23',
    rawText: 'ACH ELECTRONIC CREDIT FROM AWS EMEA SARL',
    amount: 1420.00,
    type: 'credit',
    mlOutput: {
      merchant: 'Amazon Web Services',
      category: 'Cloud Infra',
      confidence: 0.95,
      flagged: false
    }
  },
  {
    id: 'tx_8925',
    date: '2026-02-23',
    rawText: 'TST* SWEETGREEN #492 NEW YORK NY',
    amount: 18.24,
    type: 'debit',
    mlOutput: {
      merchant: 'Sweetgreen',
      category: 'Meals & Entertainment',
      confidence: 0.88,
      flagged: false
    }
  },
  {
    id: 'tx_8926',
    date: '2026-02-21',
    rawText: 'WIRE TRANSFER FEE INTL UNKNOWN ORIGIN',
    amount: 35.00,
    type: 'debit',
    mlOutput: {
      merchant: 'Unknown',
      category: 'Bank Fees',
      confidence: 0.42,
      flagged: true
    }
  },
  {
    id: 'tx_8927',
    date: '2026-02-20',
    rawText: 'RECURRING PAYMENT GITHUB INC 877-448-4820',
    amount: 48.00,
    type: 'debit',
    mlOutput: {
      merchant: 'GitHub',
      category: 'SaaS Tools',
      confidence: 0.99,
      flagged: false
    }
  }
];

// --- Main Component ---

export default function LedgerView() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Ledger Analysis</h1>
        <p className="text-stone-400 mt-1 text-sm">Raw statement strings mapped to ML-categorized entities.</p>
      </div>

      <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm overflow-hidden flex flex-col">
        
        {/* Consolidated Table Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between bg-stone-950/20 gap-4">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input 
              type="text" 
              placeholder="Search raw text, merchant, or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-900 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder:text-stone-500 outline-none transition-all"
            />
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

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-950/40 border-b border-white/5 text-stone-500 font-medium text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Raw Input String</th>
                <th className="px-2 py-4 w-8 text-center"></th>
                <th className="px-6 py-4 min-w-65">AI Output</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Confidence</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/2 transition-colors group">
                  
                  <td className="px-6 py-4 text-stone-400 font-mono text-xs">
                    {tx.date}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate font-mono text-xs text-stone-500 bg-stone-950/50 px-2 py-1.5 rounded border border-white/5" title={tx.rawText}>
                      {tx.rawText}
                      </div>
                  </td>
                  
                  <td className="px-2 py-4 text-center text-stone-700/50 group-hover:text-indigo-500/40 transition-colors">
                    <ArrowRight size={14} className="mx-auto" />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-200">{tx.mlOutput.merchant}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[13px] text-stone-500">{tx.mlOutput.category}</span>
                        {tx.mlOutput.flagged && <StatusTag label="Review" type="warning" />}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className={`font-mono font-medium ${tx.type === 'credit' ? 'text-teal-400' : 'text-stone-300'}`}>
                      {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <ConfidenceBadge score={tx.mlOutput.confidence} />
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button className="text-stone-600 hover:text-stone-300 transition-colors cursor-pointer p-1 rounded hover:bg-white/5">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-white/5 bg-stone-950/20 flex items-center justify-between">
          <span className="text-xs text-stone-500">Showing 1 to 5 of 124 records</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 bg-stone-900 border border-white/10 rounded-md text-xs font-medium text-stone-400 hover:text-stone-200 hover:border-white/20 disabled:opacity-50 cursor-pointer transition-colors">Prev</button>
            <button className="px-3 py-1.5 bg-stone-900 border border-white/10 rounded-md text-xs font-medium text-stone-400 hover:text-stone-200 hover:border-white/20 cursor-pointer transition-colors">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}