export type UserRole = 'warga' | 'admin';

export type Gender = 'Laki-laki' | 'Perempuan';

export type ApplicationStatus =
  | 'draft'
  | 'menunggu_verifikasi'
  | 'diproses'
  | 'perlu_perbaikan'
  | 'disetujui'
  | 'ditolak'
  | 'selesai';

export type ServiceCategory =
  | 'semua'
  | 'keterangan'
  | 'pengantar'
  | 'kependudukan'
  | 'kelahiran_kematian'
  | 'umum';

export interface CitizenProfile {
  id: string;
  nik: string;
  noKk: string;
  nama: string;
  jenisKelamin: Gender;
  tempatLahir: string;
  tanggalLahir: string;
  statusPerkawinan: 'Kawin' | 'Belum Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  pendidikan: string;
  pekerjaan: string;
  golDarah: string;
  email: string;
  noHp: string;
  alamat: string;
  rt: string;
  rw: string;
  dusun: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  avatarUrl?: string;
}

export interface FamilyMember {
  id: string;
  noKk: string;
  nik: string;
  nama: string;
  jenisKelamin: Gender;
  tempatLahir: string;
  tanggalLahir: string;
  hubungan: 'Kepala Keluarga' | 'Istri' | 'Anak' | 'Orang Tua' | 'Mertua' | 'Famili Lain';
  statusPerkawinan: 'Kawin' | 'Belum Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  pekerjaan: string;
  pendidikan: string;
  agama: string;
  isRegisteredAccount?: boolean;
}

export interface FamilyCard {
  noKk: string;
  kepalaKeluarga: string;
  alamat: string;
  rt: string;
  rw: string;
  dusun: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  members: FamilyMember[];
}

export interface ServiceItem {
  id: string;
  code: string;
  title: string;
  category: ServiceCategory;
  description: string;
  estimate: string;
  requirements: string[];
  iconName: string;
  recommendedRole?: string;
}

export interface ApplicationTimelineItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  status: ApplicationStatus;
}

export interface AttachedFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  docType: string;
  verified?: boolean;
}

export interface ApplicationSubmission {
  id: string;
  registrationNo: string;
  serviceId: string;
  serviceTitle: string;
  category: ServiceCategory;
  applicantNik: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantAddress: string;
  createdAt: string;
  updatedAt: string;
  status: ApplicationStatus;
  adminNotes?: string;
  officialLetterNo?: string;
  formData: Record<string, any>;
  attachedFiles: AttachedFile[];
  timeline: ApplicationTimelineItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  applicationId?: string;
  registrationNo?: string;
  recipientRole: UserRole;
  recipientNik?: string;
}

export interface VillageStats {
  totalPenduduk: number;
  totalKk: number;
  totalDusun: number;
  luasWilayah: string;
  jamPelayanan: string;
  alamatKantor: string;
  kontakTelepon: string;
  kontakWa: string;
  emailDesa: string;
  kepalaDesa: string;
}
