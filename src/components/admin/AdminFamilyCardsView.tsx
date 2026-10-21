import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FamilyCard, FamilyMember } from '../../types';
import { Modal } from '../common/Modal';
import {
  Search,
  Home,
  Users,
  Eye,
  Plus,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

export const AdminFamilyCardsView: React.FC = () => {
  const { familyCards, addFamilyMember } = useApp();
  const [search, setSearch] = useState('');
  const [selectedFamilyDetail, setSelectedFamilyDetail] = useState<FamilyCard | null>(null);
  const [addMemberToKk, setAddMemberToKk] = useState<FamilyCard | null>(null);

  const [newMemberForm, setNewMemberForm] = useState({
    nik: '',
    nama: '',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Cilacap',
    tanggalLahir: '2016-05-10',
    hubungan: 'Anak',
    statusPerkawinan: 'Belum Kawin',
    pekerjaan: 'Pelajar',
    pendidikan: 'SD / Sederajat',
    agama: 'Islam',
  });

  const filtered = familyCards.filter((card) => {
    return (
      card.noKk.includes(search) ||
      card.kepalaKeluarga.toLowerCase().includes(search.toLowerCase()) ||
      card.dusun.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMemberToKk) return;
    if (!newMemberForm.nik || newMemberForm.nik.length < 16) {
      alert('NIK harus 16 digit angka.');
      return;
    }
    if (!newMemberForm.nama) {
      alert('Nama anggota keluarga wajib diisi.');
      return;
    }

    addFamilyMember({
      noKk: addMemberToKk.noKk,
      nik: newMemberForm.nik,
      nama: newMemberForm.nama,
      jenisKelamin: newMemberForm.jenisKelamin as any,
      tempatLahir: newMemberForm.tempatLahir,
      tanggalLahir: newMemberForm.tanggalLahir,
      hubungan: newMemberForm.hubungan as any,
      statusPerkawinan: newMemberForm.statusPerkawinan as any,
      pekerjaan: newMemberForm.pekerjaan,
      pendidikan: newMemberForm.pendidikan,
      agama: newMemberForm.agama,
    });

    setAddMemberToKk(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Master Data Kartu Keluarga (KK)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Basis data registrasi kepala keluarga dan struktur keanggotaan rumah tangga Desa Adimulya
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Total KK Terdata: {familyCards.length} Keluarga
          </div>
        </div>

        <div className="mt-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor Kartu Keluarga (KK) atau nama Kepala Keluarga..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Family Cards Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Nomor Kartu Keluarga</th>
                <th className="px-5 py-3.5">Nama Kepala Keluarga</th>
                <th className="px-5 py-3.5">Alamat Rumah</th>
                <th className="px-5 py-3.5">Dusun & RT/RW</th>
                <th className="px-5 py-3.5 text-center">Jml Anggota</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((card) => (
                <tr key={card.noKk} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {card.noKk}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">
                    {card.kepalaKeluarga}
                  </td>
                  <td className="px-5 py-4 text-slate-600 max-w-xs truncate">
                    {card.alamat}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-800">{card.dusun}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      RT {card.rt} / RW {card.rw}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center font-mono font-bold text-slate-800">
                    {card.members.length} Orang
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedFamilyDetail(card)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Rincian Anggota
                      </button>
                      <button
                        onClick={() => setAddMemberToKk(card)}
                        className="p-1 text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200"
                        title="Tambah Anggota ke KK ini"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedFamilyDetail && (
        <Modal
          isOpen={!!selectedFamilyDetail}
          onClose={() => setSelectedFamilyDetail(null)}
          title={`Kartu Keluarga: ${selectedFamilyDetail.noKk}`}
          subtitle={`Kepala Keluarga: ${selectedFamilyDetail.kepalaKeluarga} · Dusun: ${selectedFamilyDetail.dusun}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[11px]">Alamat Lengkap</span>
                <span className="font-medium text-slate-800">
                  {selectedFamilyDetail.alamat}, RT {selectedFamilyDetail.rt}/RW {selectedFamilyDetail.rw}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Desa & Kecamatan</span>
                <span className="font-medium text-slate-800">
                  {selectedFamilyDetail.desa}, {selectedFamilyDetail.kecamatan}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100/80 text-slate-600 font-semibold text-[11px]">
                  <tr>
                    <th className="p-2">No</th>
                    <th className="p-2">Nama</th>
                    <th className="p-2">NIK</th>
                    <th className="p-2">Hubungan</th>
                    <th className="p-2">Pekerjaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedFamilyDetail.members.map((m, i) => (
                    <tr key={m.id}>
                      <td className="p-2 font-mono text-slate-400">{i + 1}</td>
                      <td className="p-2 font-bold text-slate-900">{m.nama}</td>
                      <td className="p-2 font-mono text-slate-700">{m.nik}</td>
                      <td className="p-2 font-medium text-emerald-800">{m.hubungan}</td>
                      <td className="p-2 text-slate-600">{m.pekerjaan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFamilyDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD MEMBER MODAL */}
      {addMemberToKk && (
        <Modal
          isOpen={!!addMemberToKk}
          onClose={() => setAddMemberToKk(null)}
          title={`Tambah Anggota KK: ${addMemberToKk.noKk}`}
          subtitle={`Kepala Keluarga: ${addMemberToKk.kepalaKeluarga}`}
          maxWidth="lg"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">NIK (16 Digit) *</label>
                <input
                  type="text"
                  maxLength={16}
                  required
                  value={newMemberForm.nik}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, nik: e.target.value.replace(/\D/g, '') })
                  }
                  placeholder="330102xxxxxxxxxx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={newMemberForm.nama}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, nama: e.target.value })}
                  placeholder="Nama sesuai akta"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hubungan Keluarga</label>
                <select
                  value={newMemberForm.hubungan}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, hubungan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  <option value="Istri">Istri</option>
                  <option value="Anak">Anak</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Mertua">Mertua</option>
                  <option value="Famili Lain">Famili Lain</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pekerjaan</label>
                <input
                  type="text"
                  value={newMemberForm.pekerjaan}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, pekerjaan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAddMemberToKk(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-2xs"
              >
                Simpan ke KK
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
