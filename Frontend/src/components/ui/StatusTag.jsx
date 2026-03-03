import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function StatusTag({ label, type = 'warning' }) {
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
}