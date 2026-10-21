import React from 'react';
import { useApp } from '../../context/AppContext';
import { RotateCcw, User, Shield, Globe, Check, AlertCircle, Info } from 'lucide-react';

export const TopBannerDemo: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    switchRole,
    resetDemoData,
    toastMessage,
    submissions,
    citizen,
  } = useApp();

  const pendingCount = submissions.filter((s) => s.status === 'menunggu_verifikasi').length;

  return (
    <>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 transition-all transform animate-in fade-in slide-in-from-top-4">
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
      )}

      {/* Demo Controller Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Prototype Mode
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Sistem Informasi Pelayanan Desa Adimulya
          </span>
        </div>

        {/* View Switcher buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setCurrentView('public')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
              currentView === 'public'
                ? 'bg-emerald-600 text-white font-medium'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Halaman Publik
          </button>

          <button
            onClick={() => switchRole('warga')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
              currentView === 'citizen'
                ? 'bg-emerald-600 text-white font-medium'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Portal Warga ({citizen.nama})
          </button>

          <button
            onClick={() => switchRole('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
              currentView === 'admin'
                ? 'bg-emerald-600 text-white font-medium'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Portal Petugas Desa
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          <button
            onClick={resetDemoData}
            title="Reset data lokal ke setelan awal"
            className="flex items-center gap-1 px-2.5 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Data
          </button>
        </div>
      </div>
    </>
  );
};
