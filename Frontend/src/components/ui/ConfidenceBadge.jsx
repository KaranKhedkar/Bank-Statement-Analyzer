import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ConfidenceBadge({ score }) {
  const isHighConfidence = score >= 0.9;
  const colorClass = isHighConfidence ? 'text-teal-400/80' : score >= 0.7 ? 'text-indigo-400' : 'text-rose-400';

  return (
    <div className="flex items-center justify-center gap-1.5">
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
}