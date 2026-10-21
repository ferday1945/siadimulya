import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { serviceCatalog } from '../../data/mockData';
import { ServiceItem } from '../../types';
import { Modal } from '../common/Modal';
import {
  FileText,
  User,
  Baby,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Send,
  Save,
  Trash2,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Edit,
  ClipboardList,
} from 'lucide-react';

export const CitizenApplicationForm: React.FC = () => {
  const {
    citizen,
    selectedServiceForForm,
    setSelectedServiceForForm,
    createSubmission,
    setActiveCitizenTab,
    setSelectedSubmission,
  } = useApp();

  // Active chosen service
  const [currentService, setCurrentService] = useState<ServiceItem>(
    selectedServiceForForm || serviceCatalog[0]
  );

  useEffect(() => {
    if (selectedServiceForForm) {
      setCurrentService(selectedServiceForForm);
    }
  }, [selectedServiceForForm]);

  // Service Type Flags
  const isKtpService = currentService.code === 'SRV-KTP';
  const isBirthService =
    currentService.code === 'SRV-AKTA-LAHIR' || currentService.code === 'SRV-KET-LAHIR';
  const isDeathService =
    currentService.code === 'SRV-AKTA-MATI' || currentService.code === 'SRV-KEMATIAN-KUNING';
  const isSkuService = currentService.code === 'SRV-SKU';
  const isSktmService = currentService.code === 'SRV-SKTM';
  const isSkckService = currentService.code === 'SRV-SKCK';
  const isKeramaianService = currentService.code === 'SRV-KERAMAIAN';
  const isDomisiliService = currentService.code === 'SRV-DOMISILI';

  // Form Fields State
  const [formData, setFormData] = useState<Record<string, any>>({
    // Generic
    keperluanSurat: 'Pemberkasan dan Keperluan Administrasi Resmi',
    keteranganTambahan: '',
    phone: citizen.noHp,
    email: citizen.email,

    // Pengantar KTP fields
    jenisPermohonanKtp: 'Perekaman KTP-el Pemula (Usia 17 Tahun)',
    alasanKtp: 'Perekaman pertama kali untuk pemenuhan identitas kependudukan warga',

    // Pengantar SKCK fields
    keperluanSkck: 'Melamar Pekerjaan Swasta / BUMN',
    pendidikanTerakhir: citizen.pendidikan,

    // Izin Keramaian fields
    namaKegiatanKeramaian: 'Resepsi Pernikahan Warga',
    penanggungJawabKeramaian: citizen.nama,
    tanggalKegiatan: '2026-11-10',
    lokasiKegiatan: 'Dusun Krajan RT 03 / RW 02 Desa Adimulya',
    jumlahUndangan: '300 Undangan',

    // Domisili fields
    jenisDomisili: 'Tempat Tinggal Warga',
    tujuanDomisili: 'Persyaratan Pembukaan Rekening Bank & Administrasi Pekerjaan',

    // Akta Kelahiran & Surat Keterangan Kelahiran fields
    namaPelapor: citizen.nama,
    nikPelapor: citizen.nik,
    hubunganPelapor: 'Ayah Kandung',
    namaBayi: 'Arka Danendra Santoso',
    jenisKelaminBayi: 'Laki-laki',
    tempatLahirBayi: 'RSUD Majenang',
    tanggalLahirBayi: '2026-10-15',
    waktuLahirBayi: '06:45',
    beratBayi: '3.4 kg',
    panjangBayi: '50 cm',
    anakKe: '3',
    namaAyah: citizen.nama,
    nikAyah: citizen.nik,
    pekerjaanAyah: citizen.pekerjaan,
    namaIbu: 'Siti Aminah',
    nikIbu: '3301025211900003',
    pekerjaanIbu: 'Guru Honorer',
    namaSaksi1: 'Agus Triono',
    nikSaksi1: '3301020803850005',
    namaSaksi2: 'Haryanto',
    nikSaksi2: '3301021709840001',

    // Kematian Kuning & Surat Pengantar Akta Kematian fields
    namaAlmarhum: 'H. Sudirman',
    nikAlmarhum: '3301021203400001',
    jenisKelaminAlmarhum: 'Laki-laki',
    tanggalMeninggal: '2026-10-14',
    tempatMeninggal: 'Rumah Duka, Desa Adimulya',
    penyebabMeninggal: 'Sakit Usia Lanjut',
    hubunganPelaporKematian: 'Anak Kandung',

    // SKU fields
    namaUsaha: 'Toko Berkah Mandiri',
    jenisUsaha: 'Perdagangan Sembako & ATK',
    alamatUsaha: 'Jl. Raya Adimulya No. 45 RT 03 / RW 02',
    tahunBerdiri: '2021',
    omsetPerBulan: 'Rp 20.000.000',

    // SKTM fields
    tujuanSktm: 'Beasiswa Pendidikan KIP Kuliah',
    namaPenerima: citizen.nama,
    penghasilanKeluarga: 'Rp 1.500.000 / bulan',
    jumlahTanggungan: '3 orang',
  });

  // Uploaded files simulation
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; size: string; docType: string }[]
  >([
    { name: 'KTP_Elektronik_Pemohon.pdf', size: '1.2 MB', docType: 'KTP Pemohon' },
    { name: 'Scan_Kartu_Keluarga_Terbaru.pdf', size: '2.4 MB', docType: 'Kartu Keluarga' },
  ]);

  const [statementAgreed, setStatementAgreed] = useState(false);
  const [showConfirmSummary, setShowConfirmSummary] = useState(false);
  const [successSubmissionResult, setSuccessSubmissionResult] = useState<any>(null);

  // File Upload Helper
  const handleAddSampleFile = (docType: string) => {
    const filename = `${docType.replace(/\s+/g, '_')}_${citizen.nama.split(' ')[0]}.pdf`;
    setUploadedFiles((prev) => [
      ...prev,
      {
        name: filename,
        size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
        docType,
      },
    ]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSimulateAutoFillSampleFiles = () => {
    const defaultList = currentService.requirements.map((req) => ({
      name: `${req.split(' ')[0]}_${req.split(' ')[1] || 'Dokumen'}_Terverifikasi.pdf`,
      size: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
      docType: req,
    }));
    setUploadedFiles(defaultList);
  };

  // Submit Logic
  const handleSaveDraft = () => {
    const sub = createSubmission(currentService, formData, uploadedFiles, true);
    setSuccessSubmissionResult(sub);
  };

  const handleFinalSubmit = () => {
    if (!statementAgreed) {
      alert('Mohon centang pernyataan kebenaran data terlebih dahulu.');
      return;
    }
    const sub = createSubmission(currentService, formData, uploadedFiles, false);
    setShowConfirmSummary(false);
    setSuccessSubmissionResult(sub);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* CARD FORMULIR UTAMA */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
        {/* 1. HEADER HIJAU UTAMA PERSIS SEPERTI SCREENSHOT */}
        <div className="bg-[#168249] text-white px-6 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentService.title}
            </h1>
          </div>

          {/* Quick Service Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-emerald-100 font-medium">Layanan:</span>
            <select
              value={currentService.id}
              onChange={(e) => {
                const found = serviceCatalog.find((s) => s.id === e.target.value);
                if (found) {
                  setCurrentService(found);
                  setSelectedServiceForForm(found);
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-800 text-white border border-emerald-500/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white max-w-xs"
            >
              {serviceCatalog.map((s) => (
                <option key={s.id} value={s.id} className="text-slate-800 bg-white">
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FORM BODY */}
        <div className="p-6 sm:p-8 space-y-7">
          {/* 2. SUB-HEADER: DATA PEMOHON PERSIS SEPERTI SCREENSHOT */}
          <div className="bg-[#168249] text-white px-4 sm:px-5 py-2.5 rounded-lg flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <User className="w-4 h-4 text-white" />
              <span>Data Pemohon</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveCitizenTab('profil')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffc107] hover:bg-amber-400 text-slate-900 font-bold text-xs sm:text-sm rounded-md shadow-2xs transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profil</span>
            </button>
          </div>

          {/* 3. DELAPAN FIELD DATA PEMOHON DENGAN TAMPILAN PERSIS SEPERTI SCREENSHOT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Row 1: Nama Lengkap & NIK */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                readOnly
                value={citizen.nama}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">NIK</label>
              <input
                type="text"
                readOnly
                value={citizen.nik}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
              />
            </div>

            {/* Row 2: Nomor KK & Tempat, Tanggal Lahir */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Nomor KK</label>
              <input
                type="text"
                readOnly
                value={citizen.noKk}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Tempat, Tanggal Lahir</label>
              <input
                type="text"
                readOnly
                value={`${citizen.tempatLahir.toUpperCase()}, ${citizen.tanggalLahir}`}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-600 bg-white text-slate-800 font-medium text-sm focus:outline-none"
              />
            </div>

            {/* Row 3: Kewarganegaraan & Agama */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Kewarganegaraan</label>
              <input
                type="text"
                readOnly
                value="WNI"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Agama</label>
              <input
                type="text"
                readOnly
                value={citizen.agama}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Row 4: Pekerjaan & Alamat */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Pekerjaan</label>
              <input
                type="text"
                readOnly
                value={citizen.pekerjaan.toUpperCase()}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Alamat</label>
              <textarea
                rows={2}
                readOnly
                value={`${citizen.alamat}, Desa Adimulya Kec Wanareja`}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none"
              />
            </div>
          </div>

          {/* 4. SUB-HEADER: INFORMASI KHUSUS PENGAJUAN */}
          <div className="bg-[#168249] text-white px-4 sm:px-5 py-2.5 rounded-lg flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <ClipboardList className="w-4 h-4 text-white" />
              <span>Informasi Khusus Pengajuan ({currentService.title})</span>
            </div>
            <span className="text-xs bg-emerald-800/80 px-2.5 py-0.5 rounded text-emerald-100 font-mono">
              Proses: {currentService.estimate}
            </span>
          </div>

          {/* KHUSUS SURAT PENGANTAR KTP */}
          {isKtpService && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Jenis Permohonan KTP-el *
                </label>
                <select
                  value={formData.jenisPermohonanKtp}
                  onChange={(e) => setFormData({ ...formData, jenisPermohonanKtp: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Perekaman KTP-el Pemula (Usia 17 Tahun)">
                    Perekaman KTP-el Pemula (Usia 17 Tahun)
                  </option>
                  <option value="Penggantian KTP-el Rusak">Penggantian KTP-el Rusak</option>
                  <option value="Penggantian KTP-el Hilang">Penggantian KTP-el Hilang</option>
                  <option value="Perubahan Data Elemen Kependudukan">
                    Perubahan Data Elemen Kependudukan
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Nomor HP / WhatsApp Aktif *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Alasan / Keperluan Permohonan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.alasanKtp}
                  onChange={(e) => setFormData({ ...formData, alasanKtp: e.target.value })}
                  placeholder="Contoh: Perekaman KTP pemula untuk keperluan pendaftaran kuliah / kerja"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          {/* KHUSUS LAYANAN KELAHIRAN (PENGANTAR AKTE KELAHIRAN / SURAT KETERANGAN KELAHIRAN) */}
          {isBirthService && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">Nama Lengkap Bayi *</label>
                  <input
                    type="text"
                    required
                    value={formData.namaBayi}
                    onChange={(e) => setFormData({ ...formData, namaBayi: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">Jenis Kelamin Bayi *</label>
                  <select
                    value={formData.jenisKelaminBayi}
                    onChange={(e) => setFormData({ ...formData, jenisKelaminBayi: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">Tempat Kelahiran *</label>
                  <input
                    type="text"
                    required
                    value={formData.tempatLahirBayi}
                    onChange={(e) => setFormData({ ...formData, tempatLahirBayi: e.target.value })}
                    placeholder="Contoh: RSUD Majenang / Puskesmas Wanareja"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">Tanggal Kelahiran *</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalLahirBayi}
                    onChange={(e) => setFormData({ ...formData, tanggalLahirBayi: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">Waktu / Jam Lahir *</label>
                  <input
                    type="time"
                    required
                    value={formData.waktuLahirBayi}
                    onChange={(e) => setFormData({ ...formData, waktuLahirBayi: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">Kelahiran Anak Ke- *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.anakKe}
                    onChange={(e) => setFormData({ ...formData, anakKe: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">Nama Lengkap Ayah Kandung *</label>
                  <input
                    type="text"
                    required
                    value={formData.namaAyah}
                    onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">Nama Lengkap Ibu Kandung *</label>
                  <input
                    type="text"
                    required
                    value={formData.namaIbu}
                    onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* KHUSUS LAYANAN KEMATIAN (KEMATIAN KUNING / SURAT PENGANTAR AKTE KEMATIAN) */}
          {isDeathService && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Nama Lengkap Almarhum/ah *</label>
                <input
                  type="text"
                  required
                  value={formData.namaAlmarhum}
                  onChange={(e) => setFormData({ ...formData, namaAlmarhum: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">NIK Almarhum/ah *</label>
                <input
                  type="text"
                  required
                  value={formData.nikAlmarhum}
                  onChange={(e) => setFormData({ ...formData, nikAlmarhum: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Jenis Kelamin Almarhum *</label>
                <select
                  value={formData.jenisKelaminAlmarhum}
                  onChange={(e) => setFormData({ ...formData, jenisKelaminAlmarhum: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Tanggal Meninggal Dunia *</label>
                <input
                  type="date"
                  required
                  value={formData.tanggalMeninggal}
                  onChange={(e) => setFormData({ ...formData, tanggalMeninggal: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Tempat Meninggal Dunia *</label>
                <input
                  type="text"
                  required
                  value={formData.tempatMeninggal}
                  onChange={(e) => setFormData({ ...formData, tempatMeninggal: e.target.value })}
                  placeholder="Contoh: Rumah Duka / RSUD"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Penyebab Kematian</label>
                <input
                  type="text"
                  value={formData.penyebabMeninggal}
                  onChange={(e) => setFormData({ ...formData, penyebabMeninggal: e.target.value })}
                  placeholder="Contoh: Sakit Medis / Usia Lanjut"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Hubungan Pelapor dengan Almarhum *</label>
                <input
                  type="text"
                  required
                  value={formData.hubunganPelaporKematian}
                  onChange={(e) => setFormData({ ...formData, hubunganPelaporKematian: e.target.value })}
                  placeholder="Contoh: Anak Kandung / Istri / Suami / Saudara"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          {/* KHUSUS PENGANTAR SKCK */}
          {isSkckService && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Keperluan Permohonan SKCK *</label>
                <input
                  type="text"
                  required
                  value={formData.keperluanSkck}
                  onChange={(e) => setFormData({ ...formData, keperluanSkck: e.target.value })}
                  placeholder="Contoh: Melamar Pekerjaan PT / Pendaftaran Seleksi CPNS"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Pendidikan Terakhir *</label>
                <input
                  type="text"
                  required
                  value={formData.pendidikanTerakhir}
                  onChange={(e) => setFormData({ ...formData, pendidikanTerakhir: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Nomor HP / WhatsApp Pemohon</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>
            </div>
          )}

          {/* KHUSUS PENGANTAR IZIN KERAMAIAN */}
          {isKeramaianService && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Nama Kegiatan / Acara *</label>
                <input
                  type="text"
                  required
                  value={formData.namaKegiatanKeramaian}
                  onChange={(e) => setFormData({ ...formData, namaKegiatanKeramaian: e.target.value })}
                  placeholder="Contoh: Resepsi Pernikahan / Khitanan / Pentas Musik"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Penanggung Jawab Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={formData.penanggungJawabKeramaian}
                  onChange={(e) => setFormData({ ...formData, penanggungJawabKeramaian: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Tanggal Pelaksanaan *</label>
                <input
                  type="date"
                  required
                  value={formData.tanggalKegiatan}
                  onChange={(e) => setFormData({ ...formData, tanggalKegiatan: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Estimasi Jumlah Hadirin / Undangan</label>
                <input
                  type="text"
                  value={formData.jumlahUndangan}
                  onChange={(e) => setFormData({ ...formData, jumlahUndangan: e.target.value })}
                  placeholder="Contoh: 300 Orang"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Lokasi / Tempat Acara *</label>
                <input
                  type="text"
                  required
                  value={formData.lokasiKegiatan}
                  onChange={(e) => setFormData({ ...formData, lokasiKegiatan: e.target.value })}
                  placeholder="Contoh: Lapangan Sepak Bola Desa Adimulya / Rumah Pemohon"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          {/* KHUSUS SURAT KETERANGAN USAHA (SKU) */}
          {isSkuService && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Nama Usaha / Toko *</label>
                <input
                  type="text"
                  required
                  value={formData.namaUsaha}
                  onChange={(e) => setFormData({ ...formData, namaUsaha: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Bidang / Jenis Usaha *</label>
                <input
                  type="text"
                  required
                  value={formData.jenisUsaha}
                  onChange={(e) => setFormData({ ...formData, jenisUsaha: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Lokasi / Alamat Usaha *</label>
                <input
                  type="text"
                  required
                  value={formData.alamatUsaha}
                  onChange={(e) => setFormData({ ...formData, alamatUsaha: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Tahun Berdiri *</label>
                <input
                  type="text"
                  required
                  value={formData.tahunBerdiri}
                  onChange={(e) => setFormData({ ...formData, tahunBerdiri: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Keperluan Pembuatan SKU *</label>
                <input
                  type="text"
                  required
                  value={formData.keperluanSurat}
                  onChange={(e) => setFormData({ ...formData, keperluanSurat: e.target.value })}
                  placeholder="Contoh: Pengajuan Kredit Usaha Rakyat (KUR) BRI / Pembukaan Rekening Giro Bank"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          {/* KHUSUS SURAT KETERANGAN TIDAK MAMPU (SKTM) */}
          {isSktmService && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Keperluan / Tujuan SKTM *</label>
                <input
                  type="text"
                  required
                  value={formData.tujuanSktm}
                  onChange={(e) => setFormData({ ...formData, tujuanSktm: e.target.value })}
                  placeholder="Contoh: Beasiswa Pendidikan KIP Kuliah / Keringanan Biaya Medis"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Nama Anggota Penerima Manfaat</label>
                <input
                  type="text"
                  value={formData.namaPenerima}
                  onChange={(e) => setFormData({ ...formData, namaPenerima: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Penghasilan Rata-rata Keluarga</label>
                <input
                  type="text"
                  value={formData.penghasilanKeluarga}
                  onChange={(e) => setFormData({ ...formData, penghasilanKeluarga: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Jumlah Anggota Tanggungan</label>
                <input
                  type="text"
                  value={formData.jumlahTanggungan}
                  onChange={(e) => setFormData({ ...formData, jumlahTanggungan: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          {/* KHUSUS SURAT DOMISILI */}
          {isDomisiliService && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Jenis Domisili *</label>
                <select
                  value={formData.jenisDomisili}
                  onChange={(e) => setFormData({ ...formData, jenisDomisili: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Tempat Tinggal Warga">Domisili Tempat Tinggal Warga</option>
                  <option value="Domisili Usaha / Badan Usaha">Domisili Usaha / Badan Usaha</option>
                  <option value="Domisili Lembaga / Organisasi">Domisili Lembaga / Organisasi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Keperluan Surat Domisili *</label>
                <input
                  type="text"
                  required
                  value={formData.tujuanDomisili}
                  onChange={(e) => setFormData({ ...formData, tujuanDomisili: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          {/* LAYANAN LAINNYA */}
          {!isKtpService &&
            !isBirthService &&
            !isDeathService &&
            !isSkuService &&
            !isSktmService &&
            !isSkckService &&
            !isKeramaianService &&
            !isDomisiliService && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Keperluan Pembuatan Surat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.keperluanSurat}
                    onChange={(e) => setFormData({ ...formData, keperluanSurat: e.target.value })}
                    placeholder="Jelaskan keperluan administrasi surat ini..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Keterangan Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.keteranganTambahan}
                    onChange={(e) => setFormData({ ...formData, keteranganTambahan: e.target.value })}
                    placeholder="Catatan tambahan untuk petugas pelayanan jika ada..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none"
                  />
                </div>
              </div>
            )}

          {/* 5. SUB-HEADER: DOKUMEN PERSYARATAN */}
          <div className="bg-[#168249] text-white px-4 sm:px-5 py-2.5 rounded-lg flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <UploadCloud className="w-4 h-4 text-white" />
              <span>Dokumen Persyaratan ({currentService.requirements.length} Berkas)</span>
            </div>
            <button
              type="button"
              onClick={handleSimulateAutoFillSampleFiles}
              className="text-xs bg-emerald-800 hover:bg-emerald-900 border border-emerald-400/40 px-3 py-1 rounded text-white font-medium transition-colors cursor-pointer"
            >
              Unggah Contoh Otomatis
            </button>
          </div>

          {/* Persyaratan Dokumen Checklist & Upload Buttons */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
            <p className="text-xs font-bold text-slate-700">Persyaratan yang wajib disiapkan:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentService.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-slate-200 text-slate-700"
                >
                  <span className="truncate text-xs font-medium">{req}</span>
                  <button
                    type="button"
                    onClick={() => handleAddSampleFile(req)}
                    className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md shrink-0 transition-colors cursor-pointer"
                  >
                    + Unggah
                  </button>
                </div>
              ))}
            </div>

            {/* Uploaded File Items */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-700 mb-2">
                Berkas Terlampir ({uploadedFiles.length}):
              </p>
              {uploadedFiles.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-white">
                  <p className="text-xs text-slate-500">
                    Belum ada berkas yang diunggah. Klik tombol "Unggah Contoh Otomatis" di atas untuk demonstrasi.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {file.docType} · {file.size} · Terverifikasi
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Hapus berkas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 6. PERNYATAAN & TOMBOL AKSI */}
          <div className="pt-2 border-t border-slate-200 space-y-5">
            <label className="flex items-start gap-3 cursor-pointer p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
              <input
                type="checkbox"
                checked={statementAgreed}
                onChange={(e) => setStatementAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                <strong>Pernyataan Kebenaran Data:</strong> Saya menyatakan bahwa seluruh informasi di atas dan dokumen yang dilampirkan adalah benar, sah, dan dapat dipertanggungjawabkan sesuai hukum kependudukan yang berlaku di Indonesia.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Draf
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmSummary(true)}
                disabled={!statementAgreed}
                className={`w-full sm:w-auto px-7 py-2.5 bg-[#168249] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  !statementAgreed ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Send className="w-4 h-4" />
                Kirim Pengajuan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI RINGKASAN */}
      <Modal
        isOpen={showConfirmSummary}
        onClose={() => setShowConfirmSummary(false)}
        title="Konfirmasi Pengajuan Surat"
        subtitle="Periksa kembali ringkasan data sebelum diteruskan ke petugas desa"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
            <p className="font-bold text-xs">{currentService.title}</p>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Pemohon: {citizen.nama} (NIK: {citizen.nik}) · Dusun: {citizen.dusun}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <p className="font-semibold text-slate-800 border-b border-slate-200 pb-1">
              Ringkasan Data Formulir:
            </p>
            {isBirthService ? (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Bayi:</span>
                  <span className="font-bold text-slate-800">{formData.namaBayi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Lahir:</span>
                  <span>{formData.tanggalLahirBayi} (Pukul {formData.waktuLahirBayi})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Ayah / Ibu:</span>
                  <span>{formData.namaAyah} & {formData.namaIbu}</span>
                </div>
              </>
            ) : isDeathService ? (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Almarhum/ah:</span>
                  <span className="font-bold text-slate-800">{formData.namaAlmarhum}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Meninggal:</span>
                  <span>{formData.tanggalMeninggal}</span>
                </div>
              </>
            ) : isKtpService ? (
              <div className="flex justify-between">
                <span className="text-slate-500">Jenis Permohonan:</span>
                <span className="font-bold text-slate-800">{formData.jenisPermohonanKtp}</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-slate-500">Keperluan:</span>
                <span className="font-bold text-slate-800">{formData.keperluanSurat}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">Jumlah Berkas Diunggah:</span>
              <span className="font-bold text-slate-800">{uploadedFiles.length} Berkas</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowConfirmSummary(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Periksa Kembali
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-5 py-2 bg-[#168249] text-white rounded-lg font-bold hover:bg-emerald-700 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Kirim Pengajuan Sekarang
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL SUKSES PENGIRIMAN */}
      {successSubmissionResult && (
        <Modal
          isOpen={!!successSubmissionResult}
          onClose={() => setSuccessSubmissionResult(null)}
          title="Pengajuan Berhasil Disimpan!"
          maxWidth="md"
        >
          <div className="text-center py-3 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-[#168249] rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                {successSubmissionResult.status === 'draft'
                  ? 'Draf Permohonan Tersimpan'
                  : 'Permohonan Berhasil Dikirim ke Desa'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Nomor Registrasi Pelayanan Anda:
              </p>
              <div className="mt-2 py-2 px-4 bg-emerald-50 border border-emerald-300 rounded-xl inline-block">
                <span className="text-base font-black font-mono text-emerald-900 tracking-wider">
                  {successSubmissionResult.registrationNo}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              {successSubmissionResult.status === 'draft'
                ? 'Draf Anda dapat dilanjutkan kembali kapan saja melalui tab Riwayat.'
                : 'Petugas Kasi Pelayanan Desa Adimulya akan meneliti berkas persyaratan Anda. Notifikasi perkembangan akan dikirimkan secara berkala.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  const res = successSubmissionResult;
                  setSuccessSubmissionResult(null);
                  setSelectedSubmission(res);
                  setActiveCitizenTab('riwayat');
                }}
                className="px-4 py-2.5 bg-[#168249] text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-2xs cursor-pointer"
              >
                Lacak Status di Riwayat
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuccessSubmissionResult(null);
                  setActiveCitizenTab('katalog');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Ajukan Surat Lain
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
