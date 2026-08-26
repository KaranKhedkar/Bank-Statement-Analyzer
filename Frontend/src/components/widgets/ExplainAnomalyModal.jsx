import React, { useEffect, useState } from 'react';
import { X, Sparkles, Loader2, AlertTriangle, ShieldCheck, ArrowUpRight, BarChart2 } from 'lucide-react';
import { explainAnomaly } from '../../lib/api';

export default function ExplainAnomalyModal({ anomaly, isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !anomaly) {
      setData(null);
      setError('');
      return;
    }

    const fetchExplanation = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await explainAnomaly(anomaly.id);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to generate explanation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplanation();
  }, [isOpen, anomaly]);

  if (!isOpen || !anomaly) return null;

  const tx = anomaly.transactions || {};
  const fmtINR = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-stone-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Anomaly Diagnosis</h3>
              <p className="text-[11px] text-stone-400">Root-cause breakdown & risk analysis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans">
          {/* Transaction Summary Card */}
          <div className="p-4 bg-stone-950/60 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-stone-400">{tx.date}</p>
                <h4 className="text-sm font-bold text-white mt-0.5">{tx.description || tx.raw_description}</h4>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-medium">
                  {tx.category || 'Uncategorized'}
                </span>
              </div>
              <p className="text-lg font-extrabold text-rose-400 font-mono">
                {fmtINR(tx.amount)}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
              <p className="text-xs text-stone-400 font-medium">Synthesizing statistical context with Gemini...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300">
              {error}
            </div>
          ) : data ? (
            <div className="space-y-4">
              {/* Metrics Snapshot */}
              {data.metrics && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-800/40 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-stone-400">Category Avg Spend</span>
                    <p className="text-sm font-bold text-stone-200 font-mono mt-0.5">
                      {fmtINR(data.metrics.category_avg)}
                    </p>
                  </div>
                  <div className="p-3 bg-stone-800/40 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-stone-400">Deviation Multiplier</span>
                    <p className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                      {data.metrics.multiplier}x normal
                    </p>
                  </div>
                </div>
              )}

              {/* AI Explanation Text */}
              <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Sparkles size={14} className="text-purple-400" />
                  <span>AI Model Assessment</span>
                </div>
                <div className="text-xs text-stone-300 leading-relaxed whitespace-pre-line">
                  {data.explanation}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-stone-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
