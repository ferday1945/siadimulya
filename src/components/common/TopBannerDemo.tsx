import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, AlertCircle, Info } from 'lucide-react';

export const TopBannerDemo: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-4 right-4 z-50 transition-all transform animate-in fade-in slide-in-from-top-4">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
          toastMessage.type === 'success'
            ? 'bg-emerald-900 text-white border-emerald-700'
            : toastMessage.type === 'error'
            ? 'bg-rose-900 text-white border-rose-700'
            : 'bg-slate-900 text-white border-slate-700'
        }`}
      >
        {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
        {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
        {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
        <span>{toastMessage.text}</span>
      </div>
    </div>
  );
};
