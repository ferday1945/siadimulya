import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { serviceCatalog } from '../../data/mockData';
import { ServiceItem } from '../../types';
import { Modal } from '../common/Modal';
import {
  Search,
  FileText,
  Clock,
  ArrowRight,
  Baby,
  Store,
  HeartHandshake,
  ShieldCheck,
  Heart,
  Home,
  Coins,
  CreditCard,
  MapPin,
  Users,
  FileCheck,
} from 'lucide-react';

export const CitizenServiceCatalog: React.FC = () => {
  const { setSelectedServiceForForm, setActiveCitizenTab } = useApp();
  const [search, setSearch] = useState('');
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

  const filtered = serviceCatalog.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'semua' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleApply = (service: ServiceItem) => {
    setSelectedServiceForForm(service);
    setActiveCitizenTab('formulir');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Katalog Layanan Administrasi Desa
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Pilih salah satu layanan surat resmi di bawah ini untuk memulai pengisian formulir permohonan.
        </p>

        {/* Search & Category Filter */}
        <div className="mt-5 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari surat... contoh: Akta Kelahiran, SKU, SKTM, Pindah..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'semua', label: 'Semua Kategori' },
              { id: 'keterangan', label: 'Surat Keterangan' },
              { id: 'pengantar', label: 'Surat Pengantar' },
              { id: 'kependudukan', label: 'Kependudukan' },
              { id: 'kelahiran_kematian', label: 'Kelahiran & Kematian' },
              { id: 'umum', label: 'Umum' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#198754] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                  {getServiceIcon(service.iconName)}
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {service.estimate}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                {service.title}
              </h3>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                {service.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Persyaratan Dokumen ({service.requirements.length}):
                </p>
                <ul className="text-[11px] text-slate-500 space-y-1">
                  {service.requirements.slice(0, 2).map((req, i) => (
                    <li key={i} className="truncate flex items-start gap-1">
                      <span className="text-emerald-500 font-bold">·</span>
                      <span className="truncate">{req}</span>
                    </li>
                  ))}
                  {service.requirements.length > 2 && (
                    <li
                      onClick={() => setPreviewService(service)}
                      className="text-emerald-700 font-medium cursor-pointer"
                    >
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
                Detail Syarat
              </button>
              <button
                onClick={() => handleApply(service)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-[#198754] hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                Ajukan Surat
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PERSYARATAN MODAL */}
      {previewService && (
        <Modal
          isOpen={!!previewService}
          onClose={() => setPreviewService(null)}
          title={previewService.title}
          subtitle={`Estimasi Proses: ${previewService.estimate}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              {previewService.description}
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                Daftar Dokumen Persyaratan Wajib:
              </h4>
              <ul className="space-y-2 text-slate-600">
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

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPreviewService(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const s = previewService;
                  setPreviewService(null);
                  handleApply(s);
                }}
                className="px-4 py-2 bg-[#198754] text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-2xs flex items-center gap-1.5"
              >
                Lanjutkan Isi Formulir
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
