import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Clock,
  Phone,
  Mail,
  RotateCcw,
  ShieldCheck,
  Check,
  FileText,
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { villageStats, resetDemoData, showToast } = useApp();
  const [stats, setStats] = useState(villageStats);
  const [letterTemplateFormat, setLetterTemplateFormat] = useState('470/[NO]/ADM/[BLN]/[THN]');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Konfigurasi pelayanan desa berhasil disimpan secara lokal.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Sistem & Identitas Desa
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kelola parameter resmi kop surat, penandatanganan TTE Kepala Desa, dan jam operasional pelayanan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Profil Kantor Desa */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            Informasi Pemerintahan Desa
          </h3>

          <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Nama Kepala Desa (Penandatangan TTE)
              </label>
              <input
                type="text"
                value={stats.kepalaDesa}
                onChange={(e) => setStats({ ...stats, kepalaDesa: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Alamat Balai / Kantor Desa Adimulya
              </label>
              <input
                type="text"
                value={stats.alamatKantor}
                onChange={(e) => setStats({ ...stats, alamatKantor: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Telepon Kantor
                </label>
                <input
                  type="text"
                  value={stats.kontakTelepon}
                  onChange={(e) => setStats({ ...stats, kontakTelepon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  WhatsApp Pelayanan
                </label>
                <input
                  type="text"
                  value={stats.kontakWa}
                  onChange={(e) => setStats({ ...stats, kontakWa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Email Resmi Pelayanan
              </label>
              <input
                type="email"
                value={stats.emailDesa}
                onChange={(e) => setStats({ ...stats, emailDesa: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Jam Operasional Loket Balai Desa
              </label>
              <input
                type="text"
                value={stats.jamPelayanan}
                onChange={(e) => setStats({ ...stats, jamPelayanan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        </div>

        {/* Template Penomoran & Reset Data */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              Format Penomoran Surat Resmi
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Pola Nomor Surat Keluar:
                </label>
                <input
                  type="text"
                  value={letterTemplateFormat}
                  onChange={(e) => setLetterTemplateFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Contoh hasil: 470/128/ADM/X/2026
                </span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950">
                <p className="font-semibold flex items-center gap-1.5 mb-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Sertifikasi Tanda Tangan Elektronik
                </p>
                <p className="text-[11px] text-emerald-800">
                  Modul TTE terintegrasi dengan Balai Sertifikasi Elektronik (BSrE) / Diskominfo Kabupaten Cilacap.
                </p>
              </div>
            </div>
          </div>

          {/* Reset Demo State Box */}
          <div className="bg-white rounded-xl border border-rose-200 p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-rose-900 pb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              Reset Data Prototype Demo
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Mengembalikan seluruh data warga, pengajuan surat, status verifikasi, dan notifikasi ke kondisi awal bawaan prototype.
            </p>
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin me-reset seluruh data simulasi ke setelan awal?')) {
                  resetDemoData();
                }
              }}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset ke Data Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
