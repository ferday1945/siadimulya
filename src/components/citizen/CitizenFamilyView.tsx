import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { FamilyMember, Gender } from '../../types';
import {
  Users,
  Plus,
  Edit,
  Eye,
  EyeOff,
  UserCheck,
  FileQuestion,
  Info,
  ShieldCheck,
  AlertCircle,
  FilePlus,
} from 'lucide-react';

export const CitizenFamilyView: React.FC = () => {
  const { citizen, familyCards, addFamilyMember, updateFamilyMember } = useApp();

  const [simulateEmptyState, setSimulateEmptyState] = useState(false);
  const [showFullNik, setShowFullNik] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState<FamilyMember | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | null>(null);

  // Find family card of current logged in citizen
  const familyCard = familyCards.find((f) => f.noKk === citizen.noKk);

  // New member form state
  const [newMemberForm, setNewMemberForm] = useState<Omit<FamilyMember, 'id'>>({
    noKk: citizen.noKk,
    nik: '',
    nama: '',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Cilacap',
    tanggalLahir: '2015-01-01',
    hubungan: 'Anak',
    statusPerkawinan: 'Belum Kawin',
    pekerjaan: 'Pelajar',
    pendidikan: 'SD / Sederajat',
    agama: 'Islam',
  });

  const maskNik = (nik: string) => {
    if (showFullNik) return nik;
    if (nik.length < 8) return '****';
    return `${nik.slice(0, 6)}******${nik.slice(-4)}`;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.nik || newMemberForm.nik.length < 16) {
      alert('NIK harus 16 digit angka.');
      return;
    }
    if (!newMemberForm.nama) {
      alert('Nama wajib diisi.');
      return;
    }

    addFamilyMember(newMemberForm);
    setIsAddModalOpen(false);
    setNewMemberForm({
      noKk: citizen.noKk,
      nik: '',
      nama: '',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Cilacap',
      tanggalLahir: '2015-01-01',
      hubungan: 'Anak',
      statusPerkawinan: 'Belum Kawin',
      pekerjaan: 'Pelajar',
      pendidikan: 'SD / Sederajat',
      agama: 'Islam',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberToEdit) return;
    updateFamilyMember(memberToEdit);
    setMemberToEdit(null);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengujian Simulasi UI Data Keluarga:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulateEmptyState(!simulateEmptyState)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              simulateEmptyState
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {simulateEmptyState ? 'Tampilkan Data Asli' : 'Simulasi KK Belum Terdata'}
          </button>
          <button
            onClick={() => setShowFullNik(!showFullNik)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors border border-slate-200 flex items-center gap-1.5"
          >
            {showFullNik ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showFullNik ? 'Samarkan NIK' : 'Tampilkan NIK Penuh'}
          </button>
        </div>
      </div>

      {simulateEmptyState || !familyCard ? (
        /* EMPTY STATE / PANDUAN KELUARGA BELUM TERDAFTAR */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-2xs">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Data Kartu Keluarga Belum Terhubung
          </h3>
          <p className="text-xs text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
            Akun kependudukan Anda belum memiliki relasi data Kartu Keluarga (KK) yang terverifikasi dalam database pelayanan desa Adimulya.
          </p>

          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left max-w-xl mx-auto space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Petunjuk Melengkapi Data Keluarga:
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
              <li>Pastikan nomor Kartu Keluarga 16 digit yang Anda daftarkan sudah sesuai dengan lembar KK terbaru.</li>
              <li>Unggah foto/scan Kartu Keluarga melalui formulir pengajuan pembaruan data kependudukan.</li>
              <li>Atau bawa berkas fotokopi KK asli ke loket pelayanan Kantor Desa Adimulya pada jam kerja.</li>
            </ol>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setSimulateEmptyState(false)}
              className="px-4 py-2 bg-[#198754] text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 shadow-2xs"
            >
              Pulihkan Tampilan Data Keluarga Demo
            </button>
          </div>
        </div>
      ) : (
        /* POPULATED FAMILY CARD */
        <>
          {/* HEADER KK */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Salinan Digital
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Kartu Keluarga No. {familyCard.noKk}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Kepala Keluarga:{' '}
                  <span className="font-bold text-slate-800">{familyCard.kepalaKeluarga}</span>
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 bg-[#198754] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Tambah Anggota Keluarga
              </button>
            </div>

            {/* KK Meta Grid */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Alamat KK</span>
                <span className="font-medium text-slate-800 mt-0.5 block">{familyCard.alamat}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">RT / RW & Dusun</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  RT {familyCard.rt} / RW {familyCard.rw}, {familyCard.dusun}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Desa & Kecamatan</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {familyCard.desa}, {familyCard.kecamatan}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Kabupaten & Kode Pos</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {familyCard.kabupaten} {familyCard.kodePos}
                </span>
              </div>
            </div>

            {/* Linked Accounts Notice */}
            <div className="mt-6 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-900">
                <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Visualisasi Relasi Multi-Akun:</strong> Pada KK ini terdapat{' '}
                  <span className="font-bold underline">2 akun warga terdaftar</span> (Budi Santoso & Siti Aminah) yang dapat mengajukan surat secara mandiri.
                </span>
              </div>
            </div>
          </div>

          {/* TABEL ANGGOTA KELUARGA */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daftar Susunan Anggota Keluarga</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total terdaftar: {familyCard.members.length} anggota keluarga
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3.5 text-center w-12">No</th>
                    <th className="px-5 py-3.5">Nama Anggota</th>
                    <th className="px-5 py-3.5">NIK</th>
                    <th className="px-4 py-3.5">JK</th>
                    <th className="px-5 py-3.5">Tempat & Tgl Lahir</th>
                    <th className="px-5 py-3.5">Hubungan</th>
                    <th className="px-5 py-3.5">Pekerjaan</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {familyCard.members.map((member, index) => (
                    <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 text-center text-slate-500 font-mono font-bold">
                        {index + 1}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{member.nama}</span>
                          {member.isRegisteredAccount && (
                            <span
                              title="Telah memiliki akun portal online terdaftar"
                              className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded font-semibold border border-emerald-300"
                            >
                              Akun Online
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-700 whitespace-nowrap">
                        {maskNik(member.nik)}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {member.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                        {member.tempatLahir},{' '}
                        {new Date(member.tanggalLahir).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {member.hubungan}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                        {member.pekerjaan}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedMemberForDetail(member)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Lihat Detail Anggota"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setMemberToEdit(member)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Data Anggota"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* DETAIL MEMBER MODAL */}
      {selectedMemberForDetail && (
        <Modal
          isOpen={!!selectedMemberForDetail}
          onClose={() => setSelectedMemberForDetail(null)}
          title={`Detail Anggota: ${selectedMemberForDetail.nama}`}
          subtitle={`Status Hubungan: ${selectedMemberForDetail.hubungan}`}
          maxWidth="md"
        >
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">NIK</span>
              <span className="col-span-7 font-mono font-bold text-slate-900">
                {selectedMemberForDetail.nik}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Nama Lengkap</span>
              <span className="col-span-7 font-semibold text-slate-900">
                {selectedMemberForDetail.nama}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Jenis Kelamin</span>
              <span className="col-span-7 text-slate-800">
                {selectedMemberForDetail.jenisKelamin}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Tempat, Tgl Lahir</span>
              <span className="col-span-7 text-slate-800">
                {selectedMemberForDetail.tempatLahir},{' '}
                {new Date(selectedMemberForDetail.tanggalLahir).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Status Hubungan</span>
              <span className="col-span-7 font-bold text-emerald-800">
                {selectedMemberForDetail.hubungan}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Status Perkawinan</span>
              <span className="col-span-7 text-slate-800">
                {selectedMemberForDetail.statusPerkawinan}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Pekerjaan</span>
              <span className="col-span-7 text-slate-800">
                {selectedMemberForDetail.pekerjaan}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Pendidikan</span>
              <span className="col-span-7 text-slate-800">
                {selectedMemberForDetail.pendidikan}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5">
              <span className="col-span-5 text-slate-500">Agama</span>
              <span className="col-span-7 text-slate-800">
                {selectedMemberForDetail.agama}
              </span>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMemberForDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD MEMBER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Anggota Keluarga"
        subtitle={`Nomor KK: ${citizen.noKk}`}
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIK (16 Digit) *</label>
              <input
                type="text"
                maxLength={16}
                required
                value={newMemberForm.nik}
                onChange={(e) =>
                  setNewMemberForm({ ...newMemberForm, nik: e.target.value.replace(/\D/g, '') })
                }
                placeholder="330102xxxxxxxxxx"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={newMemberForm.nama}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, nama: e.target.value })}
                placeholder="Nama sesuai akta / KTP"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                value={newMemberForm.jenisKelamin}
                onChange={(e) =>
                  setNewMemberForm({ ...newMemberForm, jenisKelamin: e.target.value as Gender })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={newMemberForm.tempatLahir}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, tempatLahir: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={newMemberForm.tanggalLahir}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, tanggalLahir: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hubungan Keluarga</label>
              <select
                value={newMemberForm.hubungan}
                onChange={(e) =>
                  setNewMemberForm({ ...newMemberForm, hubungan: e.target.value as any })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Mertua">Mertua</option>
                <option value="Famili Lain">Famili Lain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan</label>
              <input
                type="text"
                value={newMemberForm.pekerjaan}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, pekerjaan: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#198754] text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-2xs"
            >
              Simpan Anggota
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT MEMBER MODAL */}
      {memberToEdit && (
        <Modal
          isOpen={!!memberToEdit}
          onClose={() => setMemberToEdit(null)}
          title={`Edit Anggota: ${memberToEdit.nama}`}
          maxWidth="lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={memberToEdit.nama}
                  onChange={(e) => setMemberToEdit({ ...memberToEdit, nama: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan</label>
                <input
                  type="text"
                  value={memberToEdit.pekerjaan}
                  onChange={(e) => setMemberToEdit({ ...memberToEdit, pekerjaan: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Perkawinan</label>
                <select
                  value={memberToEdit.statusPerkawinan}
                  onChange={(e) =>
                    setMemberToEdit({ ...memberToEdit, statusPerkawinan: e.target.value as any })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Kawin">Kawin</option>
                  <option value="Cerai Hidup">Cerai Hidup</option>
                  <option value="Cerai Mati">Cerai Mati</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pendidikan</label>
                <input
                  type="text"
                  value={memberToEdit.pendidikan}
                  onChange={(e) => setMemberToEdit({ ...memberToEdit, pendidikan: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setMemberToEdit(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#198754] text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-2xs"
              >
                Perbarui Data
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
