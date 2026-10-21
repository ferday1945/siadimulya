import React, { useRef } from 'react';
import { Modal } from './Modal';
import { ApplicationSubmission } from '../../types';
import { Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { VillageLogo } from './VillageLogo';

interface DocumentPreviewModalProps {
  submission: ApplicationSubmission | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  submission,
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!submission) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    alert(`File dokumen ${submission.registrationNo}.pdf sedang diunduh.`);
  };

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pratinjau Dokumen Resmi Desa"
      subtitle={`Nomor Registrasi: ${submission.registrationNo}`}
      maxWidth="3xl"
    >
      <div className="flex flex-col gap-4">
        {/* Action bar */}
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dokumen ini sah dan telah ditandatangani secara elektronik (TTE).</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#198754] text-white rounded-md font-medium hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh PDF
            </button>
          </div>
        </div>

        {/* Paper Document Container */}
        <div
          ref={printRef}
          className="bg-white p-8 md:p-12 border border-slate-300 rounded-lg shadow-sm text-slate-900 font-serif leading-relaxed text-sm select-none"
        >
          {/* KOP SURAT RESMI DESA */}
          <div className="text-center pb-4 border-b-4 border-double border-slate-900 relative">
            <div className="absolute left-0 top-0">
              <VillageLogo size="md" showSubtitle={false} />
            </div>
            <p className="text-xs font-sans uppercase font-bold tracking-wider">
              Pemerintah Kabupaten Cilacap
            </p>
            <p className="text-sm font-sans uppercase font-bold tracking-wider">
              Kecamatan Wanareja
            </p>
            <h2 className="text-lg font-sans uppercase font-black tracking-wider text-emerald-900">
              Pemerintah Desa Adimulya
            </h2>
            <p className="text-[11px] font-sans text-slate-600 mt-0.5">
              Jl. Raya Adimulya No. 12 Wanareja, Cilacap 53265 · Email: pelayanan@desa-adimulya.id · Telp: (0280) 6261234
            </p>
          </div>

          {/* JUDUL DAN NOMOR SURAT */}
          <div className="text-center my-6">
            <h3 className="text-base font-bold underline uppercase tracking-wide font-sans">
              {submission.serviceTitle}
            </h3>
            <p className="text-xs font-sans text-slate-700 mt-1">
              Nomor: {submission.officialLetterNo || `470/${Math.floor(100 + Math.random() * 900)}/ADM/X/2026`}
            </p>
          </div>

          {/* PEMBUKA */}
          <p className="text-justify mb-4">
            Yang bertanda tangan di bawah ini Kepala Desa Adimulya, Kecamatan Wanareja, Kabupaten Cilacap, Provinsi Jawa Tengah menerangkan dengan sesungguhnya bahwa:
          </p>

          {/* DATA PEMOHON */}
          <div className="pl-6 space-y-1.5 mb-5 font-sans text-xs">
            <div className="grid grid-cols-12">
              <span className="col-span-4 text-slate-600">Nama Lengkap</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7 font-bold text-slate-900">{submission.applicantName}</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-4 text-slate-600">Nomor Induk Kependudukan (NIK)</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7 font-mono font-medium">{submission.applicantNik}</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-4 text-slate-600">Alamat / Dusun</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7">{submission.applicantAddress}</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-4 text-slate-600">Desa / Kecamatan</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7">Adimulya / Wanareja</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-4 text-slate-600">Kabupaten / Provinsi</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7">Cilacap / Jawa Tengah</span>
            </div>
          </div>

          {/* KONTEN DETAIL FORMULIR SPESIFIK */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-sans space-y-1.5 mb-5">
            <p className="font-semibold text-slate-700 border-b border-slate-200 pb-1">
              Keterangan Permohonan:
            </p>
            {Object.entries(submission.formData || {}).map(([key, val]) => (
              <div key={key} className="grid grid-cols-12">
                <span className="col-span-5 text-slate-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="col-span-1">:</span>
                <span className="col-span-6 font-medium text-slate-800">{String(val)}</span>
              </div>
            ))}
          </div>

          {/* PENUTUP */}
          <p className="text-justify mb-8">
            Demikian surat ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya dan kepada yang berkepentingan untuk menjadikan periksa.
          </p>

          {/* TANDA TANGAN & STEMPEL ELEKTRONIK */}
          <div className="grid grid-cols-2 mt-8 font-sans">
            <div>
              {/* QR Code Verification */}
              <div className="border border-slate-200 rounded p-2.5 max-w-[180px] bg-slate-50">
                <div className="w-24 h-24 bg-white border border-slate-300 mx-auto flex items-center justify-center p-1 relative">
                  <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-slate-900 rounded-xs">
                    <div className="bg-white col-span-2 row-span-2" />
                    <div className="bg-white col-span-1" />
                    <div className="bg-white col-span-1" />
                    <div className="bg-white col-span-2" />
                    <div className="bg-white col-span-2 row-span-2" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-emerald-600 text-[8px] text-white font-bold px-1 rounded-xs">
                      TTE
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-center text-slate-500 mt-1 font-mono">
                  Scan untuk cek keabsahan
                </p>
              </div>
            </div>

            <div className="text-center flex flex-col items-center">
              <p className="text-xs text-slate-600">
                Adimulya, {formattedDate}
              </p>
              <p className="text-xs font-bold text-slate-800 mt-1">
                KEPALA DESA ADIMULYA
              </p>

              {/* Digital Signature & Seal Badge */}
              <div className="my-2 py-1 px-3 border border-emerald-400/80 bg-emerald-50 rounded text-emerald-900 flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-semibold">TTE Sah Terverifikasi</span>
              </div>

              <p className="text-xs font-bold text-slate-900 underline mt-2">
                H. SUDARSONO, S.Sos.
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                NIP. 19740812 200212 1 004
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
