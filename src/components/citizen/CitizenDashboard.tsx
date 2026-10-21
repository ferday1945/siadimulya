import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { serviceCatalog } from '../../data/mockData';
import { ServiceItem } from '../../types';
import {
  Bell,
  Check,
  Eye,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const {
    citizen,
    submissions,
    setActiveCitizenTab,
    setSelectedSubmission,
    setSelectedServiceForForm,
    setSelectedOfficialDoc,
    showToast,
  } = useApp();

  const [notificationActive, setNotificationActive] = useState(false);

  // Filter submissions for logged in citizen
  const mySubmissions = submissions.filter((s) => s.applicantNik === citizen.nik);

  // Status numbers matching screenshot categories:
  // 1. Menunggu: menunggu_verifikasi
  const waitingCount = mySubmissions.filter((s) => s.status === 'menunggu_verifikasi').length;
  // 2. Berkas Kurang: perlu_perbaikan
  const needRevisionCount = mySubmissions.filter((s) => s.status === 'perlu_perbaikan').length;
  // 3. Diproses: diproses
  const processingCount = mySubmissions.filter((s) => s.status === 'diproses').length;
  // 4. Siap Diambil: disetujui
  const readyPickupCount = mySubmissions.filter((s) => s.status === 'disetujui').length;
  // 5. Selesai: selesai
  const finishedCount = mySubmissions.filter((s) => s.status === 'selesai').length;
  // 6. Ditolak: ditolak
  const rejectedCount = mySubmissions.filter((s) => s.status === 'ditolak').length;

  const handleToggleNotification = () => {
    setNotificationActive(!notificationActive);
    if (!notificationActive) {
      showToast('Notifikasi pelayanan Desa Adimulya berhasil diaktifkan.', 'success');
    } else {
      showToast('Notifikasi dimatikan.', 'info');
    }
  };

  const handleApply = (service: ServiceItem) => {
    setSelectedServiceForForm(service);
    setActiveCitizenTab('formulir');
  };

  const handleFilterStatus = (statusName: string) => {
    setActiveCitizenTab('riwayat');
  };

  // 3 Primary featured services matching the screenshot directly:
  // 1. Surat Kematian
  // 2. Surat Domisili
  // 3. Surat Keterangan Usaha
  // Followed by other essential village services
  const deathService = serviceCatalog.find((s) => s.code === 'SRV-AKTA-MATI') || serviceCatalog[1];
  const domisiliService = serviceCatalog.find((s) => s.code === 'SRV-DOMISILI') || serviceCatalog[6];
  const skuService = serviceCatalog.find((s) => s.code === 'SRV-SKU') || serviceCatalog[2];
  const birthService = serviceCatalog.find((s) => s.code === 'SRV-AKTA-LAHIR') || serviceCatalog[0];
  const pindahService = serviceCatalog.find((s) => s.code === 'SRV-PINDAH') || serviceCatalog[9];
  const skckService = serviceCatalog.find((s) => s.code === 'SRV-SKCK') || serviceCatalog[4];

  const primaryServices = [deathService, domisiliService, skuService];
  const secondaryServices = [birthService, pindahService, skckService];

  return (
    <div className="space-y-7">
      {/* 1. GREETING HEADER EXACTLY AS IN SCREENSHOT */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          Selamat Datang, {citizen.nama} <span className="inline-block">👋</span>
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={handleToggleNotification}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
              notificationActive
                ? 'bg-emerald-700 text-white'
                : 'bg-[#168249] hover:bg-emerald-700 text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            {notificationActive ? 'Notifikasi Aktif' : 'Aktifkan Notifikasi'}
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-2 font-medium">
          Sistem Informasi Pelayanan Desa
        </p>
      </div>

      {/* 2. SIX SIMPLE STATUS METRIC CARDS EXACTLY AS IN SCREENSHOT */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Menunggu (Yellow/Amber) */}
        <div
          onClick={() => handleFilterStatus('menunggu')}
          className="bg-white rounded-xl p-4 sm:p-5 text-center border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-medium text-slate-700 mb-2">Menunggu</div>
          <div className="text-3xl font-extrabold text-amber-500 font-mono tabular-nums">
            {waitingCount}
          </div>
        </div>

        {/* Card 2: Berkas Kurang (Slate/Dark) */}
        <div
          onClick={() => handleFilterStatus('perbaikan')}
          className="bg-white rounded-xl p-4 sm:p-5 text-center border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-medium text-slate-700 mb-2">Berkas Kurang</div>
          <div className="text-3xl font-extrabold text-slate-700 font-mono tabular-nums">
            {needRevisionCount}
          </div>
        </div>

        {/* Card 3: Diproses (Blue) */}
        <div
          onClick={() => handleFilterStatus('diproses')}
          className="bg-white rounded-xl p-4 sm:p-5 text-center border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-medium text-slate-700 mb-2">Diproses</div>
          <div className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
            {processingCount}
          </div>
        </div>

        {/* Card 4: Siap Diambil (Teal/Cyan) */}
        <div
          onClick={() => handleFilterStatus('siap')}
          className="bg-white rounded-xl p-4 sm:p-5 text-center border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-medium text-slate-700 mb-2">Siap Diambil</div>
          <div className="text-3xl font-extrabold text-cyan-600 font-mono tabular-nums">
            {readyPickupCount}
          </div>
        </div>

        {/* Card 5: Selesai (Green) */}
        <div
          onClick={() => handleFilterStatus('selesai')}
          className="bg-white rounded-xl p-4 sm:p-5 text-center border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-medium text-slate-700 mb-2">Selesai</div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {finishedCount}
          </div>
        </div>

        {/* Card 6: Ditolak (Red) */}
        <div
          onClick={() => handleFilterStatus('ditolak')}
          className="bg-white rounded-xl p-4 sm:p-5 text-center border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="text-xs font-medium text-slate-700 mb-2">Ditolak</div>
          <div className="text-3xl font-extrabold text-rose-600 font-mono tabular-nums">
            {rejectedCount}
          </div>
        </div>
      </div>

      {/* 3. LAYANAN DESA SECTION EXACTLY AS IN SCREENSHOT */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Layanan Desa</h2>

        {/* Primary Row 1 (Surat Kematian, Surat Domisili, Surat Keterangan Usaha) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Surat Kematian */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-8 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-[#168249] mb-4">
              <svg
                className="w-14 h-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 10l4 4m0-4l-4 4"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-4">{deathService.title}</h3>
            <button
              onClick={() => handleApply(deathService)}
              className="px-6 py-2 bg-[#168249] hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
            >
              Ajukan
            </button>
          </div>

          {/* 2. Surat Domisili */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-8 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-[#168249] mb-4">
              <svg
                className="w-14 h-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-4">{domisiliService.title}</h3>
            <button
              onClick={() => handleApply(domisiliService)}
              className="px-6 py-2 bg-[#168249] hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
            >
              Ajukan
            </button>
          </div>

          {/* 3. Surat Keterangan Usaha */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-8 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-[#168249] mb-4">
              <svg
                className="w-14 h-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-4">{skuService.title}</h3>
            <button
              onClick={() => handleApply(skuService)}
              className="px-6 py-2 bg-[#168249] hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
            >
              Ajukan
            </button>
          </div>
        </div>

        {/* Secondary Row (Kelahiran, Surat Pindah, Pengantar SKCK) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {/* 4. Surat Kelahiran */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-8 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-[#168249] mb-4">
              <svg
                className="w-14 h-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle cx="12" cy="8" r="4" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11v3m0 0l-1.5-1.5M12 14l1.5-1.5"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-4">{birthService.title}</h3>
            <button
              onClick={() => handleApply(birthService)}
              className="px-6 py-2 bg-[#168249] hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
            >
              Ajukan
            </button>
          </div>

          {/* 5. Surat Pindah */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-8 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-[#168249] mb-4">
              <svg
                className="w-14 h-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-4">{pindahService.title}</h3>
            <button
              onClick={() => handleApply(pindahService)}
              className="px-6 py-2 bg-[#168249] hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
            >
              Ajukan
            </button>
          </div>

          {/* 6. Surat Pengantar SKCK */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-8 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-[#168249] mb-4">
              <svg
                className="w-14 h-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-4">{skckService.title}</h3>
            <button
              onClick={() => handleApply(skckService)}
              className="px-6 py-2 bg-[#168249] hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
            >
              Ajukan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
