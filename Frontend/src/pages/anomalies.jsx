import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Check, X, AlertTriangle, ArrowUpRight, Loader2, ShieldAlert, RefreshCw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ExplainAnomalyModal from '../components/widgets/ExplainAnomalyModal';

const getScoreColor = (score) => {
  if (score >= 0.9) return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  if (score >= 0.8) return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
  return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
};

export default function Anomalies() {
  const { 
    anomalies, 
    fetchAnomalies, 
    updateAnomalyStatus, 
    runDetection, 
    isAnomaliesLoading,
    isProcessing,
    hasFetchedAnomalies 
  } = useAppStore();

  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnomalyForAi, setSelectedAnomalyForAi] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const itemsPerPage = 10;
  useEffect(() => {
    if (anomalies.length === 0 && !hasFetchedAnomalies) {
      fetchAnomalies();
    }
  }, [anomalies.length, hasFetchedAnomalies, fetchAnomalies]);

  // Pagination Logic
  const pendingItems = useMemo(
    () => anomalies.filter((a) => a.status === 'pending'),
    [anomalies]
  );

  const totalPages = Math.ceil(pendingItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = pendingItems.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [pendingItems.length, totalPages, currentPage]);

  const handleDetect = async () => {
    setError('');
    try { 
      await runDetection(); 
      setCurrentPage(1); 
    } catch (err) { 
      setError(err.message || 'Detection failed'); 
    }
  };

  const openAiExplanation = (anomaly) => {
    setSelectedAnomalyForAi(anomaly);
    setIsAiModalOpen(true);
  };

  const fmt = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  if (isAnomaliesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-stone-400 font-medium">Fetching anomaly data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900/60 backdrop-blur-xl p-5 rounded-3xl border border-white/5 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Outlier & Anomaly Audit</h1>
          <p className="text-stone-400 mt-1 text-xs">
            Isolation Forest unsupervised anomaly detection with AI explanation triggers.
          </p>
        </div>
        <button
          onClick={handleDetect}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-indigo-600/30"
        >
          {isProcessing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          {isProcessing ? "Auditing..." : "Run ML Detection"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 rounded-2xl px-4 py-3">
          {error}
        </p>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900/50 p-6 rounded-3xl border border-white/5 shadow-sm">
          <h3 className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Total Flagged</h3>
          <p className="text-3xl font-extrabold text-white mt-1">{anomalies.length}</p>
          <p className="text-[11px] text-stone-400 mt-1">all historical statement runs</p>
        </div>
        <div className="bg-stone-900/50 p-6 rounded-3xl border border-white/5 shadow-sm">
          <h3 className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Pending Review</h3>
          <p className="text-3xl font-extrabold text-rose-400 mt-1">{pendingItems.length}</p>
          <p className="text-[11px] text-stone-400 mt-1">require user confirmation</p>
        </div>
        <div className="bg-stone-900/50 p-6 rounded-3xl border border-white/5 shadow-sm">
          <h3 className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Model Precision</h3>
          <p className="text-lg font-extrabold text-white mt-1">Isolation Forest (5%)</p>
          <p className="text-[11px] text-stone-400 mt-1">Categorical & amount variance scoring</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-stone-900/50 rounded-3xl border border-white/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-stone-950/40 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Review Queue</h2>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              <span className="text-[11px] text-stone-400">High Risk (≥0.9)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-[11px] text-stone-400">Moderate (≥0.8)</span>
            </div>
          </div>
        </div>

        {pendingItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <ShieldAlert size={36} className="text-teal-500/40" />
            <p className="text-stone-400 text-sm font-medium">
              {anomalies.length === 0 ? 'Click Run ML Detection to analyze statement for outliers' : 'All anomalies resolved!'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-stone-950/40 border-b border-white/5 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4">Anomaly Reason</th>
                    <th className="px-6 py-4 text-center">AI Diagnosis</th>
                    <th className="px-6 py-4 text-center">Resolution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedItems.map((anomaly) => {
                    const tx = anomaly.transactions || {};
                    return (
                      <tr key={anomaly.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-stone-200 truncate max-w-xs">{tx.description || '—'}</p>
                          <p className="text-[10px] text-stone-400 font-mono">{tx.date || '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-medium text-stone-300 bg-stone-800 border border-white/5 px-2 py-0.5 rounded-md">
                            {tx.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-rose-400">
                          {fmt(tx.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold font-mono ${getScoreColor(anomaly.anomaly_score)}`}>
                            {anomaly.anomaly_score?.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-stone-400 italic text-[11px] max-w-xs truncate">
                          {anomaly.reason}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openAiExplanation(anomaly)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-semibold rounded-lg transition-all cursor-pointer shadow-sm group"
                          >
                            <Sparkles size={12} className="text-purple-400 group-hover:scale-110 transition-transform" />
                            <span>Explain with AI</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => updateAnomalyStatus(anomaly.id, 'dismissed')}
                              className="p-1.5 rounded-lg hover:bg-teal-500/15 text-stone-400 hover:text-teal-300 border border-transparent hover:border-teal-500/20 transition-all cursor-pointer"
                              title="Dismiss / Legitimate"
                            >
                              <Check size={15} />
                            </button>
                            <button
                              onClick={() => updateAnomalyStatus(anomaly.id, 'confirmed')}
                              className="p-1.5 rounded-lg hover:bg-rose-500/15 text-stone-400 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                              title="Confirm Outlier"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/5 bg-stone-950/30 flex items-center justify-between">
                <p className="text-xs text-stone-400 font-mono">Page {currentPage} of {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-stone-800 rounded-xl text-stone-400 disabled:opacity-20 cursor-pointer hover:bg-stone-700"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-stone-800 rounded-xl text-stone-400 disabled:opacity-20 cursor-pointer hover:bg-stone-700"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* AI Explanation Modal */}
      <ExplainAnomalyModal
        anomaly={selectedAnomalyForAi}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
