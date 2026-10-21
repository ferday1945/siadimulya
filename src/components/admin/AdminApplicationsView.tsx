import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { ApplicationStatus, ApplicationSubmission } from '../../types';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCw,
  AlertTriangle,
  FileText,
  FileCheck2,
  Clock,
  Printer,
  Download,
  ShieldCheck,
} from 'lucide-react';

export const AdminApplicationsView: React.FC = () => {
  const {
    submissions,
    updateSubmissionStatus,
    selectedSubmission,
    setSelectedSubmission,
    setSelectedOfficialDoc,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [activeModalSub, setActiveModalSub] = useState<ApplicationSubmission | null>(
    selectedSubmission
  );

  // Action form state
  const [actionType, setActionType] = useState<
    'selesai' | 'diproses' | 'perlu_perbaikan' | 'ditolak' | null
  >(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [officialNoInput, setOfficialNoInput] = useState('');

  const filtered = submissions.filter((sub) => {
    const matchesSearch =
      sub.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      sub.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      sub.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
      sub.applicantNik.includes(search);
    const matchesStatus = statusFilter === 'semua' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenProcess = (sub: ApplicationSubmission) => {
    setActiveModalSub(sub);
    setSelectedSubmission(sub);
    setActionType(null);
    setAdminNoteInput(sub.adminNotes || '');
    setOfficialNoInput(
      sub.officialLetterNo ||
        `470/${Math.floor(100 + Math.random() * 900)}/ADM/X/${new Date().getFullYear()}`
    );
  };

  const handleApplyAction = (targetStatus: ApplicationStatus) => {
    if (!activeModalSub) return;

    if (targetStatus === 'perlu_perbaikan' && !adminNoteInput.trim()) {
      alert('Mohon cantumkan rincian dokumen atau data yang perlu diperbaiki oleh warga.');
      return;
    }
    if (targetStatus === 'ditolak' && !adminNoteInput.trim()) {
      alert('Mohon cantumkan alasan penolakan berkas permohonan.');
      return;
    }

    updateSubmissionStatus(
      activeModalSub.id,
      targetStatus,
      adminNoteInput,
      targetStatus === 'selesai' ? officialNoInput : undefined
    );

    setActionType(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kelola Pengajuan Surat Warga
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Daftar verifikasi permohonan, penelaahan dokumen persyaratan, dan penerbitan surat resmi
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500">
            Total: {submissions.length} Berkas Masuk
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor registrasi, nama pemohon, NIK, atau layanan..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'semua', label: 'Semua' },
              { id: 'menunggu_verifikasi', label: 'Menunggu' },
              { id: 'diproses', label: 'Diproses' },
              { id: 'perlu_perbaikan', label: 'Perlu Revisi' },
              { id: 'selesai', label: 'Selesai' },
              { id: 'ditolak', label: 'Ditolak' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === st.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Tidak ada permohonan yang sesuai dengan filter pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">No. Pengajuan</th>
                  <th className="px-5 py-3.5">Nama Pemohon</th>
                  <th className="px-5 py-3.5">Jenis Layanan</th>
                  <th className="px-5 py-3.5">Tgl Pengajuan</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Catatan Terakhir</th>
                  <th className="px-5 py-3.5 text-right">Aksi Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {sub.registrationNo}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{sub.applicantName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        NIK: {sub.applicantNik}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {sub.serviceTitle}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-slate-500 max-w-xs truncate">
                      {sub.adminNotes || '-'}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {sub.status === 'selesai' && (
                          <button
                            onClick={() => setSelectedOfficialDoc(sub)}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
                          >
                            Cetak Surat
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenProcess(sub)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3 h-3" />
                          Proses
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL & ACTION MODAL */}
      {activeModalSub && (
        <Modal
          isOpen={!!activeModalSub}
          onClose={() => setActiveModalSub(null)}
          title={`Verifikasi Permohonan: ${activeModalSub.registrationNo}`}
          subtitle={`Pemohon: ${activeModalSub.applicantName} · Layanan: ${activeModalSub.serviceTitle}`}
          maxWidth="3xl"
        >
          <div className="space-y-5 text-xs">
            {/* Quick Status Bar */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Status Saat Ini:</span>
                <StatusBadge status={activeModalSub.status} size="md" />
              </div>

              {activeModalSub.status === 'selesai' && (
                <button
                  type="button"
                  onClick={() => setSelectedOfficialDoc(activeModalSub)}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Lihat Dokumen Resmi
                </button>
              )}
            </div>

            {/* Applicant & Family Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">
                  Identitas Pemohon
                </p>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Nama:</span>
                    <span className="font-bold text-slate-900">{activeModalSub.applicantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NIK:</span>
                    <span className="font-mono">{activeModalSub.applicantNik}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No. HP / WA:</span>
                    <span className="font-mono">{activeModalSub.applicantPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alamat:</span>
                    <span>{activeModalSub.applicantAddress}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">
                  Rincian Dokumen Masuk
                </p>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Layanan:</span>
                    <span className="font-semibold text-slate-900">{activeModalSub.serviceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal Registrasi:</span>
                    <span>
                      {new Date(activeModalSub.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nomor Surat Resmi:</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {activeModalSub.officialLetterNo || '(Belum Diterbitkan)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Specific Field Values */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                Data Isian Formulir Warga:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {Object.entries(activeModalSub.formData || {}).map(([k, v]) => (
                  <div key={k} className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block capitalize">
                      {k.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block truncate">
                      {String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attached Documents Checklist */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <p className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-700" />
                Dokumen Persyaratan yang Dilampirkan ({activeModalSub.attachedFiles.length}):
              </p>
              <div className="space-y-2">
                {activeModalSub.attachedFiles.map((f) => (
                  <div
                    key={f.id}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-slate-800 truncate">{f.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {f.docType} · Ukuran: {f.size}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      Dokumen Lengkap
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION PANEL */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
              <h4 className="text-xs font-bold flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Tindakan Petugas Kasi Pelayanan:
              </h4>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Catatan Petugas / Instruksi untuk Warga (Akan masuk ke notifikasi pemohon):
                </label>
                <textarea
                  rows={2}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Masukkan catatan persetujuan, alasan perbaikan, atau instruksi pengambilan fisik..."
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyAction('selesai')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Setujui & Terbitkan Surat (Selesai)
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyAction('diproses')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Tandai Sedang Diproses
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyAction('perlu_perbaikan')}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Minta Perbaikan Dokumen
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyAction('ditolak')}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Tolak Pengajuan
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalSub(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
