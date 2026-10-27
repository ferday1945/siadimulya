import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { ApplicationSubmission } from '../../types';
import {
  Inbox,
  Clock,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Filter,
  Eye,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { submissions, setActiveAdminTab, setSelectedSubmission } = useApp();
  const [dateFilter, setDateFilter] = useState<'semua' | 'hari_ini' | 'bulan_ini'>('semua');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('semua');

  // Stats calculation
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'menunggu_verifikasi').length;
  const inProgressCount = submissions.filter((s) => s.status === 'diproses').length;
  const needFixCount = submissions.filter((s) => s.status === 'perlu_perbaikan').length;
  const approvedCount = submissions.filter((s) => s.status === 'selesai' || s.status === 'disetujui').length;
  const rejectedCount = submissions.filter((s) => s.status === 'ditolak').length;

  // By service distribution calculation based on real submissions or dynamic categories
  const categoriesCount = {
    kelahiran_kematian: submissions.filter((s) => s.category === 'kelahiran_kematian').length,
    keterangan: submissions.filter((s) => s.category === 'keterangan').length,
    pengantar: submissions.filter((s) => s.category === 'pengantar').length,
    kependudukan: submissions.filter((s) => s.category === 'kependudukan').length,
  };

  const serviceStats = [
    { name: 'Kelahiran & Kematian', count: categoriesCount.kelahiran_kematian, color: 'bg-emerald-600' },
    { name: 'Surat Keterangan (SKU/SKTM/Domisili)', count: categoriesCount.keterangan, color: 'bg-blue-600' },
    { name: 'Surat Pengantar (KTP/SKCK/Keramaian)', count: categoriesCount.pengantar, color: 'bg-amber-600' },
    { name: 'Administrasi Kependudukan', count: categoriesCount.kependudukan, color: 'bg-purple-600' },
  ];

  const maxServiceCount = Math.max(1, ...serviceStats.map((s) => s.count));

  // Filter recent submissions
  const recentSubmissions = submissions.filter((sub) => {
    if (serviceTypeFilter !== 'semua' && sub.category !== serviceTypeFilter) {
      return false;
    }
    return true;
  }).slice(0, 6);

  const handleOpenDetail = (sub: ApplicationSubmission) => {
    setSelectedSubmission(sub);
    setActiveAdminTab('pengajuan');
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold">Total Pengajuan</span>
            <Inbox className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {totalCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Seluruh berkas masuk</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-[11px] font-semibold">Menunggu</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black text-amber-800 font-mono tabular-nums">
            {pendingCount}
          </div>
          <span className="text-[10px] text-amber-700/80 mt-1 block">Butuh telaah berkas</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-[11px] font-semibold">Diproses</span>
            <RotateCw className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black text-blue-800 font-mono tabular-nums">
            {inProgressCount}
          </div>
          <span className="text-[10px] text-blue-700/80 mt-1 block">Verifikasi & paraf</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-orange-200 bg-orange-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-orange-700 mb-2">
            <span className="text-[11px] font-semibold">Perlu Revisi</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black text-orange-800 font-mono tabular-nums">
            {needFixCount}
          </div>
          <span className="text-[10px] text-orange-700/80 mt-1 block">Tunggu warga</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-semibold">Disetujui / Selesai</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono tabular-nums">
            {approvedCount}
          </div>
          <span className="text-[10px] text-emerald-700/80 mt-1 block">Dokumen terbit</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-[11px] font-semibold">Ditolak</span>
            <XCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black text-rose-800 font-mono tabular-nums">
            {rejectedCount}
          </div>
          <span className="text-[10px] text-rose-700/80 mt-1 block">Tidak memenuhi syarat</span>
        </div>
      </div>

      {/* 2. STATS BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Distribusi Kategori Layanan Riil</h3>
              <p className="text-xs text-slate-500 mt-0.5">Proporsi jenis surat yang diajukan oleh warga</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="mt-6 space-y-4">
            {serviceStats.map((item, idx) => {
              const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-mono text-slate-500 font-semibold">
                      {item.count} berkas ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${totalCount > 0 ? (item.count / maxServiceCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Alur Penanganan Surat */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Standar Operasional Prosedur (SOP) Desa</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tata cara pelayanan administrasi kependudukan Desa Adimulya</p>
          </div>

          <div className="mt-5 space-y-3.5 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-bold text-slate-800">Verifikasi Dokumen Pemohon</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Periksa kesesuaian NIK, nomor KK, dan kelengkapan dokumen persyaratan yang diunggah warga.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-bold text-slate-800">Ubah Status Menjadi &quot;Diproses&quot; / &quot;Perlu Revisi&quot;</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Setiap perubahan status otomatis memicu notifikasi langsung ke akun warga pemohon beserta catatan petugas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-bold text-slate-800">Penerbitan & Penyelesaian Surat</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Terbitkan nomor surat resmi. Warga dapat mengunduh surat resmi bertanda tangan digital atau mengambil langsung di Balai Desa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT INCOMING SUBMISSIONS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Antrean Berkas Pengajuan Terbaru</h3>
            <p className="text-xs text-slate-500 mt-0.5">Daftar permohonan terkini yang masuk ke sistem pelayanan desa</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg text-slate-700 bg-slate-50 focus:outline-none"
            >
              <option value="semua">Semua Kategori</option>
              <option value="kelahiran_kematian">Kelahiran & Kematian</option>
              <option value="keterangan">Surat Keterangan</option>
              <option value="pengantar">Surat Pengantar</option>
              <option value="kependudukan">Kependudukan</option>
            </select>
            <button
              onClick={() => setActiveAdminTab('pengajuan')}
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
            >
              Buka Semua
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">No. Registrasi</th>
                <th className="px-6 py-3.5">Nama Pemohon</th>
                <th className="px-6 py-3.5">Jenis Layanan</th>
                <th className="px-6 py-3.5">Tanggal Masuk</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Tindakan Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-slate-700">Belum ada permohonan surat masuk</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Pengajuan baru dari warga akan tampil secara real-time di sini saat diajukan
                    </p>
                  </td>
                </tr>
              ) : (
                recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {sub.registrationNo}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{sub.applicantName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">NIK: {sub.applicantNik}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {sub.serviceTitle}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono tabular-nums whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetail(sub)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 ml-auto shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        Detail & Proses
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
