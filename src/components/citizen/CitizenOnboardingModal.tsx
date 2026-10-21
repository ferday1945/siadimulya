import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { serviceCatalog } from '../../data/mockData';
import {
  Sparkles,
  Layers,
  FileEdit,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight,
  ArrowLeft,
  X,
  Send,
  Download,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { VillageLogo } from '../common/VillageLogo';

export const CitizenOnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    completeOnboarding,
    setActiveCitizenTab,
    setSelectedServiceForForm,
  } = useApp();

  const [currentStep, setCurrentStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      badge: 'Selamat Datang',
      title: 'Selamat Datang di Portal Warga Desa Adimulya',
      subtitle: 'Pelayanan administrasi kependudukan mandiri, cepat, transparan, dan tanpa antrean.',
      icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Pemerintah Desa Adimulya kini menghadirkan platform digital resmi agar warga dapat mengajukan permohonan surat keterangan, pengantar, dan administrasi kependudukan langsung dari ponsel atau komputer, 24 jam sehari.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
              <span className="font-bold text-slate-900 text-xs block">Tanpa Antre</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Ajukan berkas kapan saja dari rumah</span>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
              <span className="font-bold text-slate-900 text-xs block">Transparan</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Lacak status tiap tahap verifikasi</span>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
              <span className="font-bold text-slate-900 text-xs block">Dokumen Sah</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Dilengkapi Tanda Tangan Elektronik</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 2,
      badge: 'Langkah 1: Memilih Layanan',
      title: 'Temukan Surat yang Anda Butuhkan',
      subtitle: 'Tersedia 11+ jenis layanan surat keterangan dan pengantar resmi desa.',
      icon: <Layers className="w-6 h-6 text-emerald-600" />,
      content: (
        <div className="space-y-3.5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Buka menu <strong>Katalog Layanan</strong> pada bilah navigasi. Anda dapat mencari jenis surat yang diinginkan seperti Surat Pengantar Akta Kelahiran, Surat Keterangan Usaha (SKU), SKCK, SKTM, atau Pengantar KTP.
          </p>

          {/* Visual Mini Mockup */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                Contoh: Surat Pengantar Akta Kelahiran
              </span>
              <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                1 Hari Kerja
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Setiap kartu layanan mencantumkan dokumen persyaratan yang perlu disiapkan sebelum pengisian formulir.
            </p>
            <div className="flex justify-end pt-1">
              <span className="px-3 py-1 bg-[#198754] text-white text-[11px] font-semibold rounded-md flex items-center gap-1">
                Tombol "Ajukan Surat" <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 3,
      badge: 'Langkah 2: Pengisian Formulir',
      title: 'Lengkapi Data & Unggah Berkas Persyaratan',
      subtitle: 'Identitas pemohon terisi otomatis, cukup lengkapi data pendukung.',
      icon: <FileEdit className="w-6 h-6 text-emerald-600" />,
      content: (
        <div className="space-y-3.5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Data diri Anda (NIK, nama, alamat, no KK) otomatis terhubung dari profil kependudukan. Anda hanya perlu melengkapi data spesifik permohonan (misal: data bayi untuk Akta Kelahiran, atau nama tempat usaha untuk SKU).
          </p>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2.5">
            <div className="flex items-start gap-2 text-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </div>
              <p className="text-[11px]">
                <strong>Unggah Foto/Scan Berkas:</strong> Pastikan dokumen pendukung (KTP, Kartu Keluarga, Surat Bidan/RS) terbaca jelas.
              </p>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </div>
              <p className="text-[11px]">
                <strong>Simpan sebagai Draf:</strong> Jika dokumen Anda belum lengkap saat mengisi, Anda dapat menyimpan formulir sebagai draf dan melanjutkannya nanti.
              </p>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </div>
              <p className="text-[11px]">
                <strong>Nomor Registrasi Unik:</strong> Setelah dikirim, sistem akan menerbitkan nomor tiket seperti <code className="font-mono font-bold text-emerald-800">REG-ADM-2026-xxxx</code>.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 4,
      badge: 'Langkah 3: Pemantauan Berkas',
      title: 'Pantau Status & Perjalanan Surat (Tracking)',
      subtitle: 'Ketahui posisi berkas Anda secara transparan dari menit ke menit.',
      icon: <Clock className="w-6 h-6 text-emerald-600" />,
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Melalui menu <strong>Riwayat & Lacak</strong>, Anda dapat melihat riwayat pengajuan dan timeline penelaahan berkas oleh perangkat desa.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="font-bold text-amber-800 block text-[11px]">Menunggu Verifikasi</span>
              <span className="text-[10px] text-amber-900/80 mt-0.5 block">
                Berkas masuk ke antrean verifikator desa.
              </span>
            </div>
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="font-bold text-blue-800 block text-[11px]">Sedang Diproses</span>
              <span className="text-[10px] text-blue-900/80 mt-0.5 block">
                Pemeriksaan data dan persiapan paraf pengesahan.
              </span>
            </div>
            <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-lg">
              <span className="font-bold text-orange-800 block text-[11px]">Perlu Perbaikan</span>
              <span className="text-[10px] text-orange-900/80 mt-0.5 block">
                Ada dokumen yang kurang pas. Anda bisa langsung unggah revisi di tombol "Perbaiki".
              </span>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="font-bold text-emerald-800 block text-[11px]">Selesai / Terbit</span>
              <span className="text-[10px] text-emerald-900/80 mt-0.5 block">
                Surat telah disahkan secara digital & siap diunduh!
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 5,
      badge: 'Langkah 4: Notifikasi & Dokumen Sah',
      title: 'Notifikasi Otomatis & Unduh Surat Resmi TTE',
      subtitle: 'Surat resmi langsung terbit dengan Tanda Tangan Elektronik Kepala Desa.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Setiap ada perubahan status atau catatan dari petugas desa, Anda akan menerima pemberitahuan di <strong>ikon lonceng notifikasi</strong> di pojok kanan atas.
          </p>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Surat Resmi Siap Digunakan Langsung:</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Ketika berstatus <strong>Selesai</strong>, klik tombol <strong>"Unduh Surat Resmi"</strong> untuk melihat dan mencetak dokumen lengkap dengan Kop Resmi Desa Adimulya, nomor surat dinas, dan QR Code verifikasi TTE dari BSrE.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDirectApply = () => {
    completeOnboarding();
    setSelectedServiceForForm(serviceCatalog[0]);
    setActiveCitizenTab('formulir');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 z-10">
        {/* Top Header Bar */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <VillageLogo size="sm" showSubtitle={false} />
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              Panduan Layanan Warga
            </span>
          </div>

          <button
            onClick={completeOnboarding}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            title="Lewati panduan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          {/* Step Icon & Category Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              {currentData.icon}
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {currentData.badge}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {currentData.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            {currentData.subtitle}
          </p>

          {/* Dynamic Step Content */}
          <div className="min-h-[160px]">
            {currentData.content}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Step Dots Indicator */}
          <div className="flex items-center gap-1.5 order-2 sm:order-1">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === currentStep
                    ? 'w-6 bg-emerald-600'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Langkah ${idx + 1}`}
              />
            ))}
            <span className="text-[11px] font-mono text-slate-400 ml-2">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Sebelumnya
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-xs font-bold text-white bg-[#198754] hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                Selanjutnya
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={completeOnboarding}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Selesai
                </button>
                <button
                  type="button"
                  onClick={handleDirectApply}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#198754] hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Coba Buat Pengajuan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
