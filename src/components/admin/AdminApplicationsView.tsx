import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus, ApplicationSubmission } from '../../types';
import { Modal } from '../common/Modal';
import {
  Home,
  Info,
  User,
  Folder,
  CheckSquare,
  Eye,
  Trash2,
  ArrowLeft,
  Search,
  AlertCircle,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  RotateCw,
  XCircle,
  AlertTriangle,
  Inbox,
  Printer,
  FileCheck2,
} from 'lucide-react';

export const AdminApplicationsView: React.FC = () => {
  const {
    submissions,
    allCitizens,
    citizen,
    updateSubmissionStatus,
    deleteSubmission,
    selectedSubmission,
    setSelectedSubmission,
    setSelectedOfficialDoc,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [activeDetailSub, setActiveDetailSub] = useState<ApplicationSubmission | null>(
    selectedSubmission
  );
  const [submissionToDelete, setSubmissionToDelete] = useState<ApplicationSubmission | null>(null);
  const [previewDocModal, setPreviewDocModal] = useState<{ title: string; docType: string; fileName: string } | null>(null);

  // Admin note input for status change
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Sync with selectedSubmission from outside (e.g. dashboard click)
  useEffect(() => {
    if (selectedSubmission) {
      setActiveDetailSub(selectedSubmission);
    }
  }, [selectedSubmission]);

  const filtered = submissions.filter((sub) => {
    const matchesSearch =
      sub.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      sub.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      sub.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
      sub.applicantNik.includes(search);
    const matchesStatus = statusFilter === 'semua' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (sub: ApplicationSubmission) => {
    setActiveDetailSub(sub);
    setSelectedSubmission(sub);
    setAdminNoteInput(sub.adminNotes || '');
  };

  const handleCloseDetail = () => {
    setActiveDetailSub(null);
    setSelectedSubmission(null);
    setAdminNoteInput('');
  };

  const handleSetStatus = (targetStatus: ApplicationStatus) => {
    if (!activeDetailSub) return;

    if (targetStatus === 'perlu_perbaikan' && !adminNoteInput.trim()) {
      alert('Mohon cantumkan rincian dokumen atau data yang perlu diperbaiki oleh warga.');
      return;
    }
    if (targetStatus === 'ditolak' && !adminNoteInput.trim()) {
      alert('Mohon cantumkan alasan penolakan berkas permohonan.');
      return;
    }

    const officialNo =
      targetStatus === 'selesai'
        ? activeDetailSub.officialLetterNo ||
          `470/${Math.floor(100 + Math.random() * 900)}/ADM/X/${new Date().getFullYear()}`
        : undefined;

    updateSubmissionStatus(
      activeDetailSub.id,
      targetStatus,
      adminNoteInput.trim() ? adminNoteInput : undefined,
      officialNo
    );

    // Update active view status locally
    setActiveDetailSub((prev) =>
      prev
        ? {
            ...prev,
            status: targetStatus,
            adminNotes: adminNoteInput.trim() ? adminNoteInput : prev.adminNotes,
            officialLetterNo: officialNo || prev.officialLetterNo,
          }
        : null
    );
  };

  const handleConfirmDelete = () => {
    if (!submissionToDelete) return;
    deleteSubmission(submissionToDelete.id);
    if (activeDetailSub?.id === submissionToDelete.id) {
      setActiveDetailSub(null);
      setSelectedSubmission(null);
    }
    setSubmissionToDelete(null);
  };

  // Helper for status badge styling matching screenshot
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'disetujui':
        return (
          <span className="bg-[#00c0ef] text-white px-3 py-1 rounded text-xs font-semibold inline-block shadow-2xs">
            Siap Diambil
          </span>
        );
      case 'menunggu_verifikasi':
        return (
          <span className="bg-[#ffc107] text-slate-900 px-3 py-1 rounded text-xs font-semibold inline-block shadow-2xs">
            Menunggu Verifikasi
          </span>
        );
      case 'diproses':
        return (
          <span className="bg-[#007bff] text-white px-3 py-1 rounded text-xs font-semibold inline-block shadow-2xs">
            Diproses
          </span>
        );
      case 'selesai':
        return (
          <span className="bg-[#28a745] text-white px-3 py-1 rounded text-xs font-semibold inline-block shadow-2xs">
            Selesai
          </span>
        );
      case 'ditolak':
        return (
          <span className="bg-[#dc3545] text-white px-3 py-1 rounded text-xs font-semibold inline-block shadow-2xs">
            Ditolak
          </span>
        );
      case 'perlu_perbaikan':
        return (
          <span className="bg-[#fd7e14] text-white px-3 py-1 rounded text-xs font-semibold inline-block shadow-2xs">
            Perlu Revisi
          </span>
        );
      default:
        return (
          <span className="bg-slate-500 text-white px-3 py-1 rounded text-xs font-semibold inline-block">
            {status}
          </span>
        );
    }
  };

  // Helper for dynamic service-specific fields in Card 3
  const renderServiceSpecificData = (sub: ApplicationSubmission) => {
    const titleLower = sub.serviceTitle.toLowerCase();
    const data = sub.formData || {};

    // 1. Pengantar KTP
    if (titleLower.includes('ktp')) {
      return (
        <>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
              Jenis Permohonan
            </td>
            <td className="px-5 py-3 text-slate-700 font-semibold">
              {data.jenisPermohonanKtp || data.jenisPermohonan || 'Pembuatan KTP-el Baru'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Alasan / Keterangan
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.alasanKtp || data.keterangan || data.alasan || 'Permohonan perekaman KTP Elektronik Warga'}
            </td>
          </tr>
        </>
      );
    }

    // 2. Surat Keterangan Domisili
    if (titleLower.includes('domisili')) {
      return (
        <>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
              Alamat Asal
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.alamatAsal || data.asal || 'Wanareja'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Alamat Domisili
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.alamatDomisili || data.domisili || 'Adimulya'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Keperluan
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.keperluanDomisili || data.keperluan || 'Melamar kerja'}
            </td>
          </tr>
        </>
      );
    }

    // 3. Pengantar SKCK
    if (titleLower.includes('skck')) {
      return (
        <>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
              Keperluan SKCK
            </td>
            <td className="px-5 py-3 text-slate-700 font-semibold">
              {data.keperluanSkck || data.keperluan || 'Pemberkasan Lamaran Kerja / PPPK'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Instansi Tujuan
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.instansiTujuan || 'Polsek Wanareja / Polres Cilacap'}
            </td>
          </tr>
        </>
      );
    }

    // 4. Izin Keramaian
    if (titleLower.includes('keramaian')) {
      return (
        <>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
              Nama Acara / Hajat
            </td>
            <td className="px-5 py-3 text-slate-700 font-semibold">
              {data.namaAcara || 'Hajatan Pernikahan / Khitanan'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Waktu & Tanggal Acara
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.waktuAcara || data.tanggalAcara || '08.00 WIB s/d Selesai'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Lokasi Acara
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.lokasiAcara || sub.applicantAddress}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Bentuk Hiburan
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.bentukHiburan || 'Musik / Sound System'}
            </td>
          </tr>
        </>
      );
    }

    // 5. Kematian Kuning & Akta Kematian
    if (titleLower.includes('kematian')) {
      return (
        <>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
              Nama Almarhum / Jenazah
            </td>
            <td className="px-5 py-3 text-slate-700 font-bold">
              {data.namaAlmarhum || '-'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              NIK Almarhum
            </td>
            <td className="px-5 py-3 text-slate-700 font-mono">
              {data.nikAlmarhum || '-'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Tanggal & Tempat Meninggal
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.tanggalMeninggal ? `${data.tanggalMeninggal}, ` : ''}{data.tempatMeninggal || 'Rumah Duka Adimulya'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Sebab Meninggal
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.sebabMeninggal || 'Sakit Biasa / Usia Lanjut'}
            </td>
          </tr>
        </>
      );
    }

    // 6. Akta Kelahiran & Keterangan Lahir
    if (titleLower.includes('lahir') || titleLower.includes('kelahiran')) {
      return (
        <>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
              Nama Bayi
            </td>
            <td className="px-5 py-3 text-slate-700 font-bold">
              {data.namaBayi || '-'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Jenis Kelamin Bayi
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.jenisKelaminBayi || '-'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Tempat & Tanggal Lahir
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.tempatLahirBayi ? `${data.tempatLahirBayi}, ` : ''}{data.tanggalLahirBayi || '-'} ({data.waktuLahirBayi || '-'})
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Orang Tua (Ayah / Ibu)
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.namaAyah || '-'} &amp; {data.namaIbu || '-'}
            </td>
          </tr>
        </>
      );
    }

    // 7. Surat Keterangan Usaha (SKU)
    if (titleLower.includes('usaha') || titleLower.includes('sku')) {
      return (
        <>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
              Nama Usaha
            </td>
            <td className="px-5 py-3 text-slate-700 font-semibold">
              {data.namaUsaha || '-'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Jenis Usaha / Komoditas
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.jenisUsaha || '-'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Alamat Usaha
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.alamatUsaha || '-'}
            </td>
          </tr>
          <tr>
            <td className="px-5 py-3 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
              Keperluan Surat
            </td>
            <td className="px-5 py-3 text-slate-700">
              {data.keperluanSurat || data.keperluan || 'Pengajuan KUR / Administrasi Usaha'}
            </td>
          </tr>
        </>
      );
    }

    // 8. General fallback: only fields that user actually filled in!
    const validEntries = Object.entries(data).filter(
      ([k, v]) => v !== undefined && v !== null && String(v).trim() !== ''
    );

    if (validEntries.length === 0) {
      return (
        <tr>
          <td colSpan={2} className="px-5 py-3 text-slate-400 italic">
            Data permohonan sesuai dengan informasi pemohon.
          </td>
        </tr>
      );
    }

    return (
      <>
        {validEntries.map(([k, v]) => (
          <tr key={k}>
            <td className="px-5 py-3 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50 capitalize">
              {k.replace(/([A-Z])/g, ' $1')}
            </td>
            <td className="px-5 py-3 text-slate-700">
              {String(v)}
            </td>
          </tr>
        ))}
      </>
    );
  };

  // Service Category Header Title helper
  const getServiceDataTitle = (sub: ApplicationSubmission) => {
    const t = sub.serviceTitle.toLowerCase();
    if (t.includes('ktp')) return 'Pengantar KTP';
    if (t.includes('domisili')) return 'Domisili';
    if (t.includes('skck')) return 'SKCK';
    if (t.includes('keramaian')) return 'Izin Keramaian';
    if (t.includes('kematian')) return 'Kematian';
    if (t.includes('lahir') || t.includes('kelahiran')) return 'Kelahiran';
    if (t.includes('usaha')) return 'Usaha';
    return sub.serviceTitle;
  };

  // Find applicant's No. KK
  const applicantCitizen = allCitizens.find((c) => c.nik === activeDetailSub?.applicantNik) || citizen;
  const applicantKk = applicantCitizen.noKk || '3301022809080015';

  // ----------------------------------------------------
  // VIEW 1: DETAIL VIEW (MATCHING USER SCREENSHOTS)
  // ----------------------------------------------------
  if (activeDetailSub) {
    return (
      <div className="space-y-5 max-w-5xl mx-auto pb-12">
        {/* Top Header Bar */}
        <div className="bg-[#198754] text-white px-5 py-3.5 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 font-bold text-base sm:text-lg">
            <Home className="w-5 h-5 shrink-0" />
            <span>Detail {activeDetailSub.serviceTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCloseDetail}
              className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Daftar
            </button>
            <button
              onClick={() => setSubmissionToDelete(activeDetailSub)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Pengajuan
            </button>
          </div>
        </div>

        {/* Card 1: Informasi Pengajuan */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="bg-[#198754] text-white px-4 py-2.5 font-semibold text-xs sm:text-sm flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Informasi Pengajuan</span>
          </div>
          <table className="w-full text-xs text-left">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-5 py-3.5 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
                  ID Pengajuan
                </td>
                <td className="px-5 py-3.5 text-slate-700 font-mono font-medium">
                  {activeDetailSub.registrationNo}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
                  Nama Akun
                </td>
                <td className="px-5 py-3.5 text-slate-700 font-medium">
                  {activeDetailSub.applicantName}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
                  Jenis Surat
                </td>
                <td className="px-5 py-3.5 text-slate-700 font-semibold">
                  {activeDetailSub.serviceTitle}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
                  Status
                </td>
                <td className="px-5 py-3.5">
                  {renderStatusBadge(activeDetailSub.status)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Card 2: Data Pemohon */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="bg-[#198754] text-white px-4 py-2.5 font-semibold text-xs sm:text-sm flex items-center gap-2">
            <User className="w-4 h-4 shrink-0" />
            <span>Data Pemohon</span>
          </div>
          <table className="w-full text-xs text-left">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-5 py-3.5 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
                  Nama Pemohon
                </td>
                <td className="px-5 py-3.5 text-slate-700 font-bold">
                  {activeDetailSub.applicantName}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
                  NIK
                </td>
                <td className="px-5 py-3.5 text-slate-700 font-mono">
                  {activeDetailSub.applicantNik}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
                  No. KK
                </td>
                <td className="px-5 py-3.5 text-slate-700 font-mono">
                  {applicantKk}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
                  Kewarganegaraan
                </td>
                <td className="px-5 py-3.5 text-slate-700">
                  WNI
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
                  No. HP / WA
                </td>
                <td className="px-5 py-3.5 text-slate-700 font-mono">
                  {activeDetailSub.applicantPhone}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
                  Alamat Pemohon
                </td>
                <td className="px-5 py-3.5 text-slate-700">
                  {activeDetailSub.applicantAddress}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Card 3: Data [Layanan] (HANYA SESUAI FORM INPUT USER) */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="bg-[#198754] text-white px-4 py-2.5 font-semibold text-xs sm:text-sm flex items-center gap-2">
            <Home className="w-4 h-4 shrink-0" />
            <span>Data {getServiceDataTitle(activeDetailSub)}</span>
          </div>
          <table className="w-full text-xs text-left">
            <tbody className="divide-y divide-slate-100">
              {renderServiceSpecificData(activeDetailSub)}
            </tbody>
          </table>
        </div>

        {/* Card 4: Dokumen Persyaratan */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="bg-[#198754] text-white px-4 py-2.5 font-semibold text-xs sm:text-sm flex items-center gap-2">
            <Folder className="w-4 h-4 shrink-0" />
            <span>Dokumen Persyaratan</span>
          </div>
          <table className="w-full text-xs text-left">
            <tbody className="divide-y divide-slate-100">
              {activeDetailSub.attachedFiles.length === 0 ? (
                <>
                  <tr>
                    <td className="px-5 py-3.5 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
                      KTP
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() =>
                          setPreviewDocModal({
                            title: 'Dokumen KTP Pemohon',
                            docType: 'KTP-el',
                            fileName: `KTP_${activeDetailSub.applicantName.replace(/\s+/g, '_')}.pdf`,
                          })
                        }
                        className="px-3.5 py-1.5 bg-[#007bff] hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Lihat KTP
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 font-bold text-slate-800 border-r border-slate-100 bg-slate-50/50">
                      Kartu Keluarga (KK)
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() =>
                          setPreviewDocModal({
                            title: 'Dokumen Kartu Keluarga (KK)',
                            docType: 'Kartu Keluarga',
                            fileName: `KK_${activeDetailSub.applicantName.replace(/\s+/g, '_')}.pdf`,
                          })
                        }
                        className="px-3.5 py-1.5 bg-[#198754] hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Lihat KK
                      </button>
                    </td>
                  </tr>
                </>
              ) : (
                activeDetailSub.attachedFiles.map((file, idx) => (
                  <tr key={file.id || idx}>
                    <td className="px-5 py-3.5 font-bold text-slate-800 w-1/3 sm:w-1/4 border-r border-slate-100 bg-slate-50/50">
                      {file.docType || file.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() =>
                          setPreviewDocModal({
                            title: file.docType || file.name,
                            docType: file.docType,
                            fileName: file.name,
                          })
                        }
                        className={`px-3.5 py-1.5 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs ${
                          idx % 2 === 0
                            ? 'bg-[#007bff] hover:bg-blue-700'
                            : 'bg-[#198754] hover:bg-emerald-700'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Lihat {file.docType || 'Dokumen'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Card 5: Status Pengajuan (ACTION BUTTONS ROW) */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="bg-[#198754] text-white px-4 py-2.5 font-semibold text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>Status Pengajuan</span>
            </div>
            <span className="text-[11px] text-emerald-100">
              Klik tombol untuk memperbarui status
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Status Buttons Row exactly matching Screenshot 2 */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSetStatus('menunggu_verifikasi')}
                className={`px-4 py-2 rounded-lg font-semibold text-xs text-slate-900 transition-all shadow-2xs ${
                  activeDetailSub.status === 'menunggu_verifikasi'
                    ? 'bg-[#ffc107] ring-2 ring-slate-900 ring-offset-1'
                    : 'bg-[#ffc107] hover:brightness-95'
                }`}
              >
                Menunggu Verifikasi
              </button>

              <button
                type="button"
                onClick={() => handleSetStatus('diproses')}
                className={`px-4 py-2 rounded-lg font-semibold text-xs text-white transition-all shadow-2xs ${
                  activeDetailSub.status === 'diproses'
                    ? 'bg-[#007bff] ring-2 ring-blue-800 ring-offset-1'
                    : 'bg-[#007bff] hover:brightness-95'
                }`}
              >
                Diproses
              </button>

              <button
                type="button"
                onClick={() => handleSetStatus('disetujui')}
                className={`px-4 py-2 rounded-lg font-semibold text-xs text-white transition-all shadow-2xs ${
                  activeDetailSub.status === 'disetujui'
                    ? 'bg-[#00c0ef] ring-2 ring-cyan-800 ring-offset-1'
                    : 'bg-[#00c0ef] hover:brightness-95'
                }`}
              >
                Siap Diambil
              </button>

              <button
                type="button"
                onClick={() => handleSetStatus('selesai')}
                className={`px-4 py-2 rounded-lg font-semibold text-xs text-white transition-all shadow-2xs ${
                  activeDetailSub.status === 'selesai'
                    ? 'bg-[#28a745] ring-2 ring-emerald-900 ring-offset-1'
                    : 'bg-[#28a745] hover:brightness-95'
                }`}
              >
                Selesai
              </button>

              <button
                type="button"
                onClick={() => handleSetStatus('ditolak')}
                className={`px-4 py-2 rounded-lg font-semibold text-xs text-white transition-all shadow-2xs ${
                  activeDetailSub.status === 'ditolak'
                    ? 'bg-[#dc3545] ring-2 ring-rose-900 ring-offset-1'
                    : 'bg-[#dc3545] hover:brightness-95'
                }`}
              >
                Ditolak
              </button>

              <button
                type="button"
                onClick={() => setSubmissionToDelete(activeDetailSub)}
                className="px-4 py-2 rounded-lg font-semibold text-xs text-white bg-rose-700 hover:bg-rose-800 flex items-center gap-1.5 transition-colors ml-auto shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Pengajuan
              </button>
            </div>

            {/* Optional Admin Note (Sent to Citizen Notification) */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Catatan Petugas (Otomatis masuk ke notifikasi pemohon saat status diubah):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Contoh: Berkas telah diverifikasi, silakan ambil surat fisik di loket pelayanan..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                {activeDetailSub.status === 'selesai' && (
                  <button
                    type="button"
                    onClick={() => setSelectedOfficialDoc(activeDetailSub)}
                    className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Cetak Surat Resmi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CONFIRM DELETE MODAL */}
        {submissionToDelete && (
          <Modal
            isOpen={!!submissionToDelete}
            onClose={() => setSubmissionToDelete(null)}
            title="Konfirmasi Hapus Pengajuan"
            maxWidth="md"
          >
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-900">
                    Apakah Anda yakin ingin menghapus permohonan surat ini?
                  </p>
                  <p className="text-rose-700 mt-1">
                    Nomor Registrasi: <span className="font-mono font-bold">{submissionToDelete.registrationNo}</span>
                  </p>
                  <p className="text-rose-700">
                    Pemohon: <span className="font-semibold">{submissionToDelete.applicantName}</span> ({submissionToDelete.serviceTitle})
                  </p>
                  <p className="text-rose-600 mt-2 text-[11px]">
                    Tindakan ini permanen dan akan menghapus data permohonan dari sistem.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmissionToDelete(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Ya, Hapus Pengajuan
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* PREVIEW DOCUMENT MODAL */}
        {previewDocModal && (
          <Modal
            isOpen={!!previewDocModal}
            onClose={() => setPreviewDocModal(null)}
            title={`Pratinjau: ${previewDocModal.title}`}
            subtitle={previewDocModal.fileName}
            maxWidth="lg"
          >
            <div className="space-y-4 text-xs">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-2xs mx-auto flex items-center justify-center text-emerald-600">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{previewDocModal.fileName}</p>
                  <p className="text-slate-500 text-xs mt-0.5">Jenis: {previewDocModal.docType} · Terverifikasi</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 max-w-sm mx-auto text-[11px] text-slate-600 text-left space-y-1">
                  <div className="flex justify-between">
                    <span>Pemohon:</span>
                    <span className="font-semibold text-slate-900">{activeDetailSub.applicantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NIK:</span>
                    <span className="font-mono text-slate-900">{activeDetailSub.applicantNik}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status Berkas:</span>
                    <span className="text-emerald-700 font-bold">Lengkap &amp; Valid</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewDocModal(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Tutup
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: TABLE LIST VIEW (KELOLA PENGAJUAN)
  // ----------------------------------------------------
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
              Daftar verifikasi permohonan riil warga, penelaahan dokumen, dan penerbitan surat resmi Desa Adimulya
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              {submissions.length} Pengajuan Riil
            </span>
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
              { id: 'disetujui', label: 'Siap Diambil' },
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
        {submissions.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Pengajuan Surat Masuk
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
              Data pengajuan surat saat ini kosong sesuai kondisi riil. Data permohonan akan otomatis tercatat di sini segera setelah warga mengajukan surat melalui Portal Pelayanan Warga.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Tidak ada permohonan yang sesuai dengan filter pencarian &quot;{search}&quot;.
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
                      {renderStatusBadge(sub.status)}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {sub.status === 'selesai' && (
                          <button
                            onClick={() => setSelectedOfficialDoc(sub)}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
                          >
                            Cetak Surat
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenDetail(sub)}
                          className="px-3 py-1.5 bg-[#198754] hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>
                        <button
                          onClick={() => setSubmissionToDelete(sub)}
                          title="Hapus permohonan surat"
                          className="px-2.5 py-1.5 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
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

      {/* CONFIRM DELETE MODAL */}
      {submissionToDelete && (
        <Modal
          isOpen={!!submissionToDelete}
          onClose={() => setSubmissionToDelete(null)}
          title="Konfirmasi Hapus Pengajuan"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">
                  Apakah Anda yakin ingin menghapus permohonan surat ini?
                </p>
                <p className="text-rose-700 mt-1">
                  Nomor Registrasi: <span className="font-mono font-bold">{submissionToDelete.registrationNo}</span>
                </p>
                <p className="text-rose-700">
                  Pemohon: <span className="font-semibold">{submissionToDelete.applicantName}</span> ({submissionToDelete.serviceTitle})
                </p>
                <p className="text-rose-600 mt-2 text-[11px]">
                  Tindakan ini permanen dan akan menghapus seluruh data permohonan dari sistem pelayanan.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSubmissionToDelete(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Ya, Hapus Pengajuan
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
