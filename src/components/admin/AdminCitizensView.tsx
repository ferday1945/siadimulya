import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenProfile } from '../../types';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  User,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

export const AdminCitizensView: React.FC = () => {
  const { allCitizens, updateCitizenByAdmin } = useApp();
  const [search, setSearch] = useState('');
  const [dusunFilter, setDusunFilter] = useState('semua');
  const [selectedCitizenDetail, setSelectedCitizenDetail] = useState<CitizenProfile | null>(null);
  const [citizenToEdit, setCitizenToEdit] = useState<CitizenProfile | null>(null);

  const filtered = allCitizens.filter((c) => {
    const matchesSearch =
      c.nama.toLowerCase().includes(search.toLowerCase()) ||
      c.nik.includes(search) ||
      c.noKk.includes(search);
    const matchesDusun = dusunFilter === 'semua' || c.dusun === dusunFilter;
    return matchesSearch && matchesDusun;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenToEdit) return;
    updateCitizenByAdmin(citizenToEdit);
    setCitizenToEdit(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Master Data Kependudukan Warga
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Basis data penduduk Desa Adimulya yang terdaftar dalam sistem administrasi digital
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Total Terdata: {allCitizens.length} Warga
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nama, NIK, atau nomor KK..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={dusunFilter}
              onChange={(e) => setDusunFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:outline-none"
            >
              <option value="semua">Semua Dusun</option>
              <option value="Dusun Krajan">Dusun Krajan</option>
              <option value="Dusun Cikuning">Dusun Cikuning</option>
              <option value="Dusun Margasari">Dusun Margasari</option>
              <option value="Dusun Mekarsari">Dusun Mekarsari</option>
            </select>
          </div>
        </div>
      </div>

      {/* Citizens Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Nama Warga</th>
                <th className="px-5 py-3.5">NIK & No KK</th>
                <th className="px-4 py-3.5">JK</th>
                <th className="px-5 py-3.5">Dusun / RT-RW</th>
                <th className="px-5 py-3.5">Pekerjaan</th>
                <th className="px-5 py-3.5">Kontak</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{c.nama}</div>
                    <div className="text-[11px] text-slate-400">
                      {c.tempatLahir}, {new Date(c.tanggalLahir).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono">
                    <div className="text-slate-800 font-bold">{c.nik}</div>
                    <div className="text-[11px] text-slate-400">KK: {c.noKk}</div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {c.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-800">{c.dusun}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      RT {c.rt} / RW {c.rw}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {c.pekerjaan}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-800 font-mono">{c.noHp}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{c.email}</div>
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedCitizenDetail(c)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Lihat Detail Profil"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setCitizenToEdit(c)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit Data Warga"
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

      {/* DETAIL CITIZEN MODAL */}
      {selectedCitizenDetail && (
        <Modal
          isOpen={!!selectedCitizenDetail}
          onClose={() => setSelectedCitizenDetail(null)}
          title={`Profil Warga: ${selectedCitizenDetail.nama}`}
          subtitle={`NIK: ${selectedCitizenDetail.nik}`}
          maxWidth="lg"
        >
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Nama Lengkap</span>
              <span className="col-span-7 font-bold text-slate-900">{selectedCitizenDetail.nama}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Nomor KK</span>
              <span className="col-span-7 font-mono font-bold text-slate-800">{selectedCitizenDetail.noKk}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Jenis Kelamin</span>
              <span className="col-span-7 text-slate-800">{selectedCitizenDetail.jenisKelamin}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Tempat, Tgl Lahir</span>
              <span className="col-span-7 text-slate-800">
                {selectedCitizenDetail.tempatLahir}, {selectedCitizenDetail.tanggalLahir}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Alamat Domisili</span>
              <span className="col-span-7 text-slate-800">
                {selectedCitizenDetail.alamat}, RT {selectedCitizenDetail.rt}/RW {selectedCitizenDetail.rw}, {selectedCitizenDetail.dusun}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-100">
              <span className="col-span-5 text-slate-500">Pekerjaan & Pendidikan</span>
              <span className="col-span-7 text-slate-800">
                {selectedCitizenDetail.pekerjaan} ({selectedCitizenDetail.pendidikan})
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5">
              <span className="col-span-5 text-slate-500">No. HP & Email</span>
              <span className="col-span-7 text-slate-800">
                {selectedCitizenDetail.noHp} · {selectedCitizenDetail.email}
              </span>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCitizenDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT CITIZEN MODAL */}
      {citizenToEdit && (
        <Modal
          isOpen={!!citizenToEdit}
          onClose={() => setCitizenToEdit(null)}
          title={`Edit Data Warga: ${citizenToEdit.nama}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={citizenToEdit.nama}
                  onChange={(e) => setCitizenToEdit({ ...citizenToEdit, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pekerjaan</label>
                <input
                  type="text"
                  required
                  value={citizenToEdit.pekerjaan}
                  onChange={(e) => setCitizenToEdit({ ...citizenToEdit, pekerjaan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nomor HP</label>
                <input
                  type="text"
                  required
                  value={citizenToEdit.noHp}
                  onChange={(e) => setCitizenToEdit({ ...citizenToEdit, noHp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Dusun</label>
                <select
                  value={citizenToEdit.dusun}
                  onChange={(e) => setCitizenToEdit({ ...citizenToEdit, dusun: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  <option value="Dusun Krajan">Dusun Krajan</option>
                  <option value="Dusun Cikuning">Dusun Cikuning</option>
                  <option value="Dusun Margasari">Dusun Margasari</option>
                  <option value="Dusun Mekarsari">Dusun Mekarsari</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCitizenToEdit(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-2xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
