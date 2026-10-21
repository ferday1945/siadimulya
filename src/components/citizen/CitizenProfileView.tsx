import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { CitizenProfile, Gender } from '../../types';
import {
  User,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Heart,
  Edit3,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';

export const CitizenProfileView: React.FC = () => {
  const { citizen, updateProfile } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<CitizenProfile>(citizen);

  const handleOpenEdit = () => {
    setFormData(citizen);
    setIsEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#198754] to-emerald-800 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-emerald-300/30 shrink-0">
            {citizen.nama.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{citizen.nama}</h2>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Data Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              NIK: {citizen.nik} · No. KK: {citizen.noKk}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Warga Asli · {citizen.dusun}, Desa Adimulya, Kec. Wanareja
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenEdit}
          className="px-4 py-2.5 bg-white border border-slate-300 hover:border-emerald-600 text-slate-800 hover:text-emerald-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4 text-emerald-700" />
          Edit Data Profil
        </button>
      </div>

      {/* Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identitas Diri */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-700" />
            Identitas Kependudukan
          </h3>

          <div className="mt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Nomor Induk Kependudukan (NIK)</span>
              <span className="col-span-7 font-mono font-bold text-slate-900">{citizen.nik}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Nomor Kartu Keluarga (KK)</span>
              <span className="col-span-7 font-mono font-bold text-slate-900">{citizen.noKk}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Nama Lengkap</span>
              <span className="col-span-7 font-semibold text-slate-900">{citizen.nama}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Jenis Kelamin</span>
              <span className="col-span-7 text-slate-800">{citizen.jenisKelamin}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Tempat, Tanggal Lahir</span>
              <span className="col-span-7 text-slate-800">
                {citizen.tempatLahir},{' '}
                {new Date(citizen.tanggalLahir).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Agama</span>
              <span className="col-span-7 text-slate-800">{citizen.agama}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Status Perkawinan</span>
              <span className="col-span-7 text-slate-800">{citizen.statusPerkawinan}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Pendidikan Terakhir</span>
              <span className="col-span-7 text-slate-800">{citizen.pendidikan}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Pekerjaan</span>
              <span className="col-span-7 text-slate-800">{citizen.pekerjaan}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5">
              <span className="col-span-5 text-slate-500">Golongan Darah</span>
              <span className="col-span-7 font-mono font-bold text-slate-800">{citizen.golDarah || 'O'}</span>
            </div>
          </div>
        </div>

        {/* Alamat & Kontak */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            Alamat Domisili & Kontak
          </h3>

          <div className="mt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Alamat Rumah</span>
              <span className="col-span-7 font-medium text-slate-900">{citizen.alamat}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">RT / RW</span>
              <span className="col-span-7 text-slate-800 font-mono">
                RT {citizen.rt} / RW {citizen.rw}
              </span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Dusun</span>
              <span className="col-span-7 font-medium text-slate-800">{citizen.dusun}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Desa</span>
              <span className="col-span-7 text-slate-800">{citizen.desa}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Kecamatan</span>
              <span className="col-span-7 text-slate-800">{citizen.kecamatan}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Kabupaten</span>
              <span className="col-span-7 text-slate-800">{citizen.kabupaten}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Provinsi</span>
              <span className="col-span-7 text-slate-800">{citizen.provinsi}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Kode Pos</span>
              <span className="col-span-7 font-mono text-slate-800">{citizen.kodePos}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5 border-b border-slate-50">
              <span className="col-span-5 text-slate-500">Alamat Email</span>
              <span className="col-span-7 text-emerald-800 font-medium">{citizen.email}</span>
            </div>
            <div className="grid grid-cols-12 py-1.5">
              <span className="col-span-5 text-slate-500">No. HP / WhatsApp</span>
              <span className="col-span-7 font-mono font-medium text-slate-900">{citizen.noHp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Ubah Data Profil Warga"
        subtitle="Simulasi pengkinian data kependudukan pribadi di sisi aplikasi"
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan</label>
              <input
                type="text"
                value={formData.pekerjaan}
                onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Perkawinan</label>
              <select
                value={formData.statusPerkawinan}
                onChange={(e) => setFormData({ ...formData, statusPerkawinan: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                <option value="Kawin">Kawin</option>
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pendidikan Terakhir</label>
              <input
                type="text"
                value={formData.pendidikan}
                onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Golongan Darah</label>
              <select
                value={formData.golDarah}
                onChange={(e) => setFormData({ ...formData, golDarah: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">No. HP / WhatsApp</label>
              <input
                type="text"
                value={formData.noHp}
                onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili Jalan / Rumah</label>
            <input
              type="text"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">RT</label>
              <input
                type="text"
                value={formData.rt}
                onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">RW</label>
              <input
                type="text"
                value={formData.rw}
                onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dusun</label>
              <select
                value={formData.dusun}
                onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
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
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#198754] text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-2xs"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
