import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { serviceCatalog } from '../../data/mockData';
import { ServiceItem } from '../../types';
import { Modal } from '../common/Modal';
import {
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  ShieldCheck,
  Smartphone,
  MapPin,
  Phone,
  Mail,
  Send,
  Users,
  Baby,
  Store,
  HeartHandshake,
  Heart,
  Home,
  Coins,
  CreditCard,
  Building2,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setCurrentView,
    setSelectedServiceForForm,
    setActiveCitizenTab,
    isLoggedInWarga,
    showToast,
    villageStats,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [previewService, setPreviewService] = useState<ServiceItem | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby':
        return <Baby className="w-5 h-5 text-emerald-600" />;
      case 'Store':
        return <Store className="w-5 h-5 text-emerald-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-emerald-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-emerald-600" />;
      case 'Home':
        return <Home className="w-5 h-5 text-emerald-600" />;
      case 'Coins':
        return <Coins className="w-5 h-5 text-emerald-600" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-emerald-600" />;
    }
  };

  const filteredServices = serviceCatalog.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'semua' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAjukan = (service: ServiceItem) => {
    setSelectedServiceForForm(service);
    if (isLoggedInWarga) {
      setActiveCitizenTab('formulir');
      setCurrentView('citizen');
    } else {
      showToast(`Silakan login warga terlebih dahulu untuk mengajukan ${service.title}. Belum punya akun? Klik Daftar.`, 'info');
      setCurrentView('login');
    }
  };

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section id="beranda" className="relative bg-gradient-to-b from-emerald-50/70 via-white to-white pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Unboxed subtle kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-4 bg-emerald-100/60 px-3 py-1 rounded-full">
              <span>Pemerintah Desa Adimulya</span>
              <span aria-hidden="true">·</span>
              <span>Kecamatan Wanareja, Cilacap</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight text-balance">
              Sistem Informasi Pelayanan Desa Adimulya
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
              Layanan administrasi kependudukan dan surat pengantar desa kini lebih cepat, transparan, dan dapat diajukan secara online dari rumah tanpa perlu mengantre lama di Balai Desa.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedServiceForForm(serviceCatalog[0]);
                  if (isLoggedInWarga) {
                    setActiveCitizenTab('formulir');
                    setCurrentView('citizen');
                  } else {
                    showToast('Silakan login warga terlebih dahulu untuk mengajukan surat permohonan.', 'info');
                    setCurrentView('login');
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#198754] hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Ajukan Pelayanan Sekarang
              </button>
              <button
                onClick={() => setCurrentView('login')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl shadow-2xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Users className="w-4 h-4 text-slate-500" />
                Login Portal Warga
              </button>
            </div>

            {/* Quick Live Search Bar */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 absolute left-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari surat... contoh: Akta Kelahiran, SKU, SKCK, SKTM"
                  className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Quick Village Metric Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-center p-2 border-r border-slate-100 last:border-r-0">
              <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                {villageStats.totalPenduduk.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Jiwa Penduduk</div>
            </div>
            <div className="text-center p-2 border-r border-slate-100 last:border-r-0">
              <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                {villageStats.totalKk.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Kepala Keluarga</div>
            </div>
            <div className="text-center p-2 border-r border-slate-100 last:border-r-0">
              <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                11+ Jenis
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Layanan Online</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
                1 Hari
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Rata-rata Proses</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KATALOG LAYANAN ADMINISTRASI */}
      <section id="layanan" className="py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Katalog Administrasi
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Layanan Surat Online Desa Adimulya
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Pilih formulir permohonan yang Anda butuhkan dan siapkan dokumen persyaratannya.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'semua', label: 'Semua Layanan' },
                { id: 'kelahiran_kematian', label: 'Kelahiran & Kematian' },
                { id: 'keterangan', label: 'Surat Keterangan' },
                { id: 'pengantar', label: 'Surat Pengantar' },
                { id: 'kependudukan', label: 'Kependudukan' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#198754] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 shrink-0 group-hover:bg-emerald-100 transition-colors">
                      {getServiceIcon(service.iconName)}
                    </div>
                    {/* Unboxed metadata separator */}
                    <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {service.estimate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Persyaratan Dokumen ({service.requirements.length}):
                    </p>
                    <ul className="text-[11px] text-slate-500 space-y-1">
                      {service.requirements.slice(0, 2).map((req, i) => (
                        <li key={i} className="flex items-start gap-1.5 truncate">
                          <span className="text-emerald-500 font-bold">·</span>
                          <span className="truncate">{req}</span>
                        </li>
                      ))}
                      {service.requirements.length > 2 && (
                        <li className="text-[11px] text-emerald-700 font-medium cursor-pointer" onClick={() => setPreviewService(service)}>
                          +{service.requirements.length - 2} persyaratan lainnya...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setPreviewService(service)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-center"
                  >
                    Lihat Syarat
                  </button>
                  <button
                    onClick={() => handleAjukan(service)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-[#198754] hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    Ajukan
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ALUR PELAYANAN (4 LANGKAH) */}
      <section id="alur" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Panduan Pemohon
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Alur Pelayanan Administrasi Online
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Empat tahapan mudah untuk menyelesaikan pengurusan dokumen kependudukan dari manapun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Login / Daftar Akun',
                desc: 'Warga mendaftar dengan NIK & No KK terdaftar atau login langsung ke akun portal.',
                icon: <Users className="w-5 h-5 text-emerald-600" />,
              },
              {
                step: '02',
                title: 'Pilih Layanan Surat',
                desc: 'Temukan jenis surat yang dibutuhkan pada katalog dan pahami kelengkapan berkasnya.',
                icon: <FileText className="w-5 h-5 text-emerald-600" />,
              },
              {
                step: '03',
                title: 'Lengkapi Formulir & Unggah',
                desc: 'Isi identitas data pendukung dan unggah foto/scan berkas persyaratan yang sah.',
                icon: <Send className="w-5 h-5 text-emerald-600" />,
              },
              {
                step: '04',
                title: 'Pantau Status & Unduh',
                desc: 'Lacak proses verifikasi petugas hingga surat resmi bertanda tangan digital terbit.',
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-slate-50/80 rounded-xl p-6 border border-slate-200 relative group hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-emerald-700/60">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KEUNGGULAN PELAYANAN DIGITAL */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Transformasi Digital Desa
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Keunggulan Pelayanan Online Desa Adimulya
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Menghadirkan tata kelola pemerintahan desa yang modern, responsif, akuntabel, dan mengutamakan kenyamanan warga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Efisiensi Waktu & Bebas Antre
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Warga tidak perlu meninggalkan pekerjaan harian atau berlama-lama di kantor desa. Pengajuan dapat dilakukan 24 jam sehari dari ponsel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Transparan & Terlacak Real-Time
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap tahapan penelaahan berkas tercatat jelas dengan status timeline. Warga menerima notifikasi langsung bila ada berkas yang perlu diperbaiki.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Tanda Tangan Elektronik Sah (TTE)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dokumen resmi diterbitkan dengan nomor registrasi unik dan QR Code pengesahan digital Kepala Desa yang dapat diverifikasi keasliannya secara instan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TENTANG DESA & INFORMASI RESMI */}
      <section id="tentang" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-2 bg-emerald-100/70 px-3 py-1 rounded-full">
              <span>Profil Wilayah & Demografi</span>
              <span>·</span>
              <a
                href="https://desaadimulya.com/"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-emerald-950 font-bold"
              >
                Website Resmi: desaadimulya.com ↗
              </a>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mengenal Desa Adimulya
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Desa mandiri di Kecamatan Wanareja, Kabupaten Cilacap, dengan potensi pertanian, perkebunan, dan pelayanan masyarakat yang guyub rukun.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Demografi & Pemerintahan */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
                  <span>Struktur Pemerintahan & Kependudukan</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    Sensus Resmi Desa
                  </span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-5">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-emerald-800 font-mono">10.429</div>
                    <div className="text-[11px] text-slate-500 font-medium">Jiwa Penduduk</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-slate-800 font-mono">3.120</div>
                    <div className="text-[11px] text-slate-500 font-medium">Kepala Keluarga</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-slate-800 font-mono">10</div>
                    <div className="text-[11px] text-slate-500 font-medium">Wilayah Dusun</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-slate-800 font-mono">20 / 61</div>
                    <div className="text-[11px] text-slate-500 font-medium">RW / RT</div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700 divide-y divide-slate-200/60 font-sans">
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Kepala Desa:</span>
                    <span className="font-bold text-emerald-900">{villageStats.kepalaDesa}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Sekretaris Desa:</span>
                    <span className="font-medium text-slate-700">{villageStats.sekretarisDesa}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Komposisi Penduduk:</span>
                    <span>5.241 Laki-laki (50,3%) · 5.188 Perempuan (49,7%)</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Sejarah Pembentukan:</span>
                    <span>Tahun 1989 (Pemekaran resmi dari Desa Wanareja)</span>
                  </div>
                </div>
              </div>

              {/* 10 Dusun Adimulya Pills */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  Daftar 10 Wilayah Dusun di Desa Adimulya
                </h4>
                <div className="flex flex-wrap gap-2">
                  {villageStats.dusunList.map((dusun, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 shadow-2xs"
                    >
                      {dusun}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="font-bold block text-emerald-800">424 Ha</span>
                    <span>Persawahan</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="font-bold block text-emerald-800">350 Ha</span>
                    <span>Perkebunan</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="font-bold block text-emerald-800">175 Ha</span>
                    <span>Perladangan</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="font-bold block text-emerald-800">76 Ha</span>
                    <span>Peternakan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Card */}
            <div id="kontak" className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                Pusat Pelayanan Warga
              </div>
              <h3 className="text-xl font-bold text-white mb-5">
                Kantor Balai Desa Adimulya
              </h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Alamat Kantor:</span>
                    <span>{villageStats.alamatKantor}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Telepon & WhatsApp:</span>
                    <span>Telp: {villageStats.kontakTelepon} · WhatsApp: {villageStats.kontakWa}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Email Resmi Pelayanan:</span>
                    <span>{villageStats.emailDesa}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Jam Operasional Balai Desa:</span>
                    <span>{villageStats.jamPelayanan}</span>
                    <span className="block text-[11px] text-emerald-300 mt-0.5">
                      ✓ Pengajuan berkas online via portal warga dibuka 24 jam setiap hari.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-800 space-y-3">
                <button
                  onClick={() => {
                    if (isLoggedInWarga) {
                      setActiveCitizenTab('dashboard');
                      setCurrentView('citizen');
                    } else {
                      setCurrentView('login');
                    }
                  }}
                  className="w-full py-3 bg-[#198754] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  {isLoggedInWarga ? 'Buka Dashboard Warga' : 'Masuk ke Portal Warga'}
                </button>

                <a
                  href="https://desaadimulya.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  Kunjungi Website Resmi Desa (desaadimulya.com) ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Sistem Informasi Pelayanan Desa Adimulya
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Platform digital resmi pelayanan administrasi dan surat menyurat masyarakat Desa Adimulya, Kecamatan Wanareja, Kabupaten Cilacap, Provinsi Jawa Tengah.
              </p>
            </div>

            <div>
              <p className="text-white font-semibold text-sm mb-3">Tautan Layanan</p>
              <ul className="space-y-2">
                <li><button onClick={() => setSelectedCategory('kelahiran_kematian')} className="hover:text-emerald-400">Akta Kelahiran & Kematian</button></li>
                <li><button onClick={() => setSelectedCategory('keterangan')} className="hover:text-emerald-400">Surat Keterangan Usaha (SKU)</button></li>
                <li><button onClick={() => setSelectedCategory('keterangan')} className="hover:text-emerald-400">Surat Keterangan Tidak Mampu</button></li>
                <li><button onClick={() => setSelectedCategory('pengantar')} className="hover:text-emerald-400">Pengantar SKCK & Nikah</button></li>
              </ul>
            </div>

            <div>
              <p className="text-white font-semibold text-sm mb-3">Akses Sistem</p>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentView('login')} className="hover:text-emerald-400">Login Akun Warga</button></li>
                <li><button onClick={() => setCurrentView('admin-login')} className="hover:text-emerald-400">Portal Petugas Desa (Admin)</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 Pemerintah Desa Adimulya. Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div className="flex items-center gap-3">
              <span>Keamanan Berkas Terjamin</span>
              <span>·</span>
              <span>Standar Pelayanan Prima</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail Persyaratan Modal */}
      {previewService && (
        <Modal
          isOpen={!!previewService}
          onClose={() => setPreviewService(null)}
          title={previewService.title}
          subtitle={`Kode: ${previewService.code} · Estimasi: ${previewService.estimate}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {previewService.description}
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                Dokumen Persyaratan yang Harus Disiapkan:
              </h4>
              <ul className="text-xs text-slate-600 space-y-2">
                {previewService.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewService(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = previewService;
                  setPreviewService(null);
                  handleAjukan(s);
                }}
                className="px-4 py-2 bg-[#198754] text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 shadow-2xs flex items-center gap-1.5"
              >
                Ajukan Sekarang
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
