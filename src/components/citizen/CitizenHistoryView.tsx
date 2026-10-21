import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { ApplicationStatus, ApplicationSubmission } from '../../types';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  Eye,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  UploadCloud,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const CitizenHistoryView: React.FC = () => {
  const {
    citizen,
    submissions,
    selectedSubmission,
    setSelectedSubmission,
    setSelectedOfficialDoc,
    resubmitRevision,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [detailModalOpen, setDetailModalOpen] = useState(!!selectedSubmission);
  const [activeSubForDetail, setActiveSubForDetail] = useState<ApplicationSubmission | null>(
    selectedSubmission
  );

  // Revision state
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [revisedFiles, setRevisedFiles] = useState<{ name: string; size: string; docType: string }[]>([
    { name: 'Pasfoto_Merah_Perbaikan.jpg', size: '1.2 MB', docType: 'Pas Foto Latar Merah' },
  ]);

  const mySubmissions = submissions.filter((s) => s.applicantNik === citizen.nik);

  const filtered = mySubmissions.filter((sub) => {
    const matchesSearch =
      sub.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      sub.serviceTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'semua' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (sub: ApplicationSubmission) => {
    setActiveSubForDetail(sub);
    setSelectedSubmission(sub);
    setDetailModalOpen(true);
  };

  const handleOpenRevision = (sub: ApplicationSubmission) => {
    setActiveSubForDetail(sub);
    setIsRevisionModalOpen(true);
  };

  const handleSendRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubForDetail) return;
    resubmitRevision(activeSubForDetail.id, revisedFiles, revisionNotes);
    setIsRevisionModalOpen(false);
    setDetailModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Riwayat & Pelacakan Permohonan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pantau status penelaahan berkas administrasi dan unduh surat resmi yang telah terbit
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Total: {mySubmissions.length} Berkas</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor pengajuan (REG-ADM-...) atau nama surat..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Status Buttons Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'semua', label: 'Semua Status' },
              { id: 'menunggu_verifikasi', label: 'Menunggu' },
              { id: 'diproses', label: 'Diproses' },
              { id: 'perlu_perbaikan', label: 'Perlu Perbaikan' },
              { id: 'selesai', label: 'Selesai' },
              { id: 'draft', label: 'Draf' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === st.id
                    ? 'bg-[#198754] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions List / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada pengajuan yang sesuai kriteria.</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">No. Registrasi</th>
                  <th className="px-6 py-3.5">Layanan Surat</th>
                  <th className="px-6 py-3.5">Tanggal Pengajuan</th>
                  <th className="px-6 py-3.5">Status Saat Ini</th>
                  <th className="px-6 py-3.5">Catatan Petugas</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {sub.registrationNo}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{sub.serviceTitle}</div>
                      <div className="text-[11px] text-slate-400">
                        {sub.attachedFiles.length} berkas lampiran
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      {sub.adminNotes || 'Berkas dalam antrean telaah.'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {sub.status === 'selesai' && (
                          <button
                            onClick={() => setSelectedOfficialDoc(sub)}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-md hover:bg-emerald-100 transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <Download className="w-3 h-3" />
                            Surat Resmi
                          </button>
                        )}
                        {sub.status === 'perlu_perbaikan' && (
                          <button
                            onClick={() => handleOpenRevision(sub)}
                            className="px-2.5 py-1 text-[11px] font-bold text-orange-800 bg-orange-50 border border-orange-300 rounded-md hover:bg-orange-100 transition-colors flex items-center gap-1"
                          >
                            <UploadCloud className="w-3 h-3" />
                            Perbaiki
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenDetail(sub)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Detail
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

      {/* DETAIL MODAL WITH TIMELINE */}
      {detailModalOpen && activeSubForDetail && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Detail Pengajuan: ${activeSubForDetail.registrationNo}`}
          subtitle={activeSubForDetail.serviceTitle}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Status and Action banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={activeSubForDetail.status} size="lg" />
                <div>
                  <p className="font-bold text-slate-900 text-xs">
                    Nomor: {activeSubForDetail.registrationNo}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Diajukan pada{' '}
                    {new Date(activeSubForDetail.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {activeSubForDetail.status === 'selesai' && (
                <button
                  onClick={() => {
                    setSelectedOfficialDoc(activeSubForDetail);
                  }}
                  className="px-4 py-2 bg-[#198754] text-white text-xs font-bold rounded-lg hover:bg-emerald-700 shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  Pratinjau & Unduh Surat Resmi
                </button>
              )}
            </div>

            {/* Admin Notes Box */}
            {activeSubForDetail.adminNotes && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
                <p className="font-bold text-xs flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Catatan dari Petugas Pelayanan Desa:
                </p>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {activeSubForDetail.adminNotes}
                </p>
                {activeSubForDetail.status === 'perlu_perbaikan' && (
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      setIsRevisionModalOpen(true);
                    }}
                    className="mt-2.5 px-3 py-1.5 bg-amber-700 text-white font-semibold rounded-md text-xs hover:bg-amber-800 transition-colors"
                  >
                    Unggah Dokumen Perbaikan Sekarang
                  </button>
                )}
              </div>
            )}

            {/* TIMELINE PELACAKAN */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                Perjalanan / Timeline Berkas
              </h4>
              <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeSubForDetail.timeline.map((item, idx) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(item.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{item.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Oleh: {item.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ATTACHED DOCUMENTS */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-700" />
                Dokumen yang Dilampirkan ({activeSubForDetail.attachedFiles.length})
              </h4>
              <div className="space-y-2">
                {activeSubForDetail.attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                      <div className="truncate">
                        <p className="font-medium text-slate-800 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-400">{file.docType} · {file.size}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold px-2 py-0.5 bg-emerald-50 rounded">
                      Terunggah
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* REVISION UPLOAD MODAL */}
      {isRevisionModalOpen && activeSubForDetail && (
        <Modal
          isOpen={isRevisionModalOpen}
          onClose={() => setIsRevisionModalOpen(false)}
          title={`Unggah Dokumen Perbaikan: ${activeSubForDetail.registrationNo}`}
          subtitle={activeSubForDetail.serviceTitle}
          maxWidth="md"
        >
          <form onSubmit={handleSendRevision} className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
              <p className="font-semibold text-xs mb-1">Catatan Permintaan Petugas:</p>
              <p className="text-[11px] text-amber-800">
                {activeSubForDetail.adminNotes || 'Mohon lengkapi atau perbaiki berkas yang belum sesuai.'}
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Catatan Penjelasan Warga
              </label>
              <textarea
                rows={2}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Contoh: Sudah saya unggah pas foto latar belakang merah sesuai arahan."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <p className="font-semibold text-slate-700 mb-2">Berkas Pengganti yang Diunggah:</p>
              <div className="space-y-2">
                {revisedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-800">{f.name}</p>
                        <p className="text-[10px] text-slate-500">{f.docType} · {f.size}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-semibold">Siap Kirim</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#198754] text-white rounded-lg font-bold hover:bg-emerald-700 shadow-2xs"
              >
                Kirim Dokumen Perbaikan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
