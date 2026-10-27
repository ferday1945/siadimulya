import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VillageLogo } from '../common/VillageLogo';
import { Shield, Lock, User, ArrowRight, AlertCircle, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin, setCurrentView } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Silakan masukkan username petugas admin.');
      return;
    }
    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi admin.');
      return;
    }

    const res = loginAdmin(username, password);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleQuickFill = () => {
    setUsername('admin123*');
    setPassword('admin123*');
    setErrorMessage('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <Shield className="w-8 h-8 text-emerald-100" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Portal Pelayanan Kantor Balai Desa
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Login Petugas & Admin Desa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Khusus Perangkat Desa Adimulya, Kasi Pelayanan, dan Verifikator Dokumen
          </p>
        </div>

        {/* Official Credentials Info Box */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold flex items-center gap-1.5 text-emerald-900">
              <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
              Kredensial Akses Admin:
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              Isi Otomatis
            </button>
          </div>
          <div className="text-[11px] space-y-0.5 text-emerald-900 font-mono">
            <div>Username: <span className="font-bold bg-white/80 px-1.5 py-0.5 rounded border border-emerald-200">admin123*</span> atau <span className="font-bold bg-white/80 px-1 py-0.5 rounded border border-emerald-200">admin</span></div>
            <div>Password: <span className="font-bold bg-white/80 px-1.5 py-0.5 rounded border border-emerald-200">admin123*</span></div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username Petugas
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="admin atau admin123*"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="admin123*"
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            Masuk sebagai Petugas Desa
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => setCurrentView('public')}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Halaman Utama
          </button>

          <button
            onClick={() => setCurrentView('login')}
            className="text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            Login Warga →
          </button>
        </div>
      </div>
    </div>
  );
};
