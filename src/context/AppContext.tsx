import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CitizenProfile,
  FamilyCard,
  FamilyMember,
  ServiceItem,
  ApplicationSubmission,
  NotificationItem,
  VillageStats,
  ApplicationStatus,
} from '../types';
import {
  defaultCitizenProfile,
  otherCitizens,
  defaultFamilyCards,
  serviceCatalog,
  initialSubmissions,
  initialNotifications,
  initialVillageStats,
} from '../data/mockData';

interface AppContextType {
  currentView: 'public' | 'login' | 'register' | 'otp' | 'citizen' | 'admin' | 'admin-login';
  setCurrentView: (view: 'public' | 'login' | 'register' | 'otp' | 'citizen' | 'admin' | 'admin-login') => void;
  activeCitizenTab: string;
  setActiveCitizenTab: (tab: string) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  citizen: CitizenProfile;
  allCitizens: CitizenProfile[];
  familyCards: FamilyCard[];
  submissions: ApplicationSubmission[];
  notifications: NotificationItem[];
  villageStats: VillageStats;
  selectedSubmission: ApplicationSubmission | null;
  setSelectedSubmission: (sub: ApplicationSubmission | null) => void;
  selectedServiceForForm: ServiceItem | null;
  setSelectedServiceForForm: (service: ServiceItem | null) => void;
  selectedOfficialDoc: ApplicationSubmission | null;
  setSelectedOfficialDoc: (sub: ApplicationSubmission | null) => void;

  // Auth & Navigation
  isLoggedInWarga: boolean;
  isLoggedInAdmin: boolean;
  login: (emailOrNik: string, pass: string) => { success: boolean; message: string; role: 'warga' | 'admin' };
  loginAdmin: (username: string, pass: string) => { success: boolean; message: string };
  register: (data: Partial<CitizenProfile> & { password: string }) => { success: boolean; message: string; email: string };
  verifyOtp: (code: string) => { success: boolean; message: string };
  logout: () => void;
  switchRole: (role: 'warga' | 'admin') => void;
  pendingOtpEmail: string;

  // Citizen Operations
  updateProfile: (updated: Partial<CitizenProfile>) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMember: (member: FamilyMember) => void;
  createSubmission: (
    service: ServiceItem,
    formData: Record<string, any>,
    files: { name: string; size: string; docType: string }[],
    isDraft: boolean
  ) => ApplicationSubmission;
  resubmitRevision: (submissionId: string, updatedFiles: { name: string; size: string; docType: string }[], notes?: string) => void;

  // Admin Operations
  updateSubmissionStatus: (
    submissionId: string,
    status: ApplicationStatus,
    adminNotes?: string,
    officialLetterNo?: string
  ) => void;
  deleteSubmission: (submissionId: string) => void;
  updateCitizenByAdmin: (updated: CitizenProfile) => void;

  // Notifications
  unreadCountWarga: number;
  unreadCountAdmin: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (role: 'warga' | 'admin') => void;

  // Onboarding Tour
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  hasCompletedOnboarding: boolean;
  startOnboarding: () => void;
  completeOnboarding: () => void;

  // Demo Control
  resetDemoData: () => void;
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CITIZEN: 'desa_adimulya_citizen',
  ALL_CITIZENS: 'desa_adimulya_all_citizens',
  FAMILIES: 'desa_adimulya_family_cards',
  SUBMISSIONS: 'desa_adimulya_submissions',
  NOTIFICATIONS: 'desa_adimulya_notifications',
  ONBOARDING: 'desa_adimulya_has_seen_onboarding',
  IS_LOGGED_IN_WARGA: 'desa_adimulya_is_logged_in_warga',
  IS_LOGGED_IN_ADMIN: 'desa_adimulya_is_logged_in_admin',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'public' | 'login' | 'register' | 'otp' | 'citizen' | 'admin' | 'admin-login'>('public');
  const [activeCitizenTab, setActiveCitizenTab] = useState<string>('dashboard');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [pendingOtpEmail, setPendingOtpEmail] = useState<string>('siwi.siswanto@gmail.com');

  const [isLoggedInWarga, setIsLoggedInWarga] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN_WARGA) === 'true';
    } catch {
      return false;
    }
  });

  const [isLoggedInAdmin, setIsLoggedInAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN_ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
    } catch {
      return false;
    }
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  const [citizen, setCitizen] = useState<CitizenProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CITIZEN);
      return saved ? JSON.parse(saved) : defaultCitizenProfile;
    } catch {
      return defaultCitizenProfile;
    }
  });

  const [allCitizens, setAllCitizens] = useState<CitizenProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALL_CITIZENS);
      return saved ? JSON.parse(saved) : otherCitizens;
    } catch {
      return otherCitizens;
    }
  });

  const [familyCards, setFamilyCards] = useState<FamilyCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAMILIES);
      return saved ? JSON.parse(saved) : defaultFamilyCards;
    } catch {
      return defaultFamilyCards;
    }
  });

  // Real user submissions only; clean out any legacy hardcoded demo IDs
  const [submissions, setSubmissions] = useState<ApplicationSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item: ApplicationSubmission) =>
              !['sub-001', 'sub-002', 'sub-003', 'sub-004', 'sub-005', 'sub-006'].includes(item.id)
          );
        }
      }
      return initialSubmissions;
    } catch {
      return initialSubmissions;
    }
  });

  // Real user notifications only; clean out any legacy mock notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (n: NotificationItem) =>
              !['sub-001', 'sub-002', 'sub-003', 'sub-004', 'sub-005', 'sub-006'].includes(n.applicationId || '') &&
              !['notif-001', 'notif-002', 'notif-003', 'notif-004'].includes(n.id)
          );
        }
      }
      return initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [selectedSubmission, setSelectedSubmission] = useState<ApplicationSubmission | null>(null);
  const [selectedServiceForForm, setSelectedServiceForForm] = useState<ServiceItem | null>(null);
  const [selectedOfficialDoc, setSelectedOfficialDoc] = useState<ApplicationSubmission | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CITIZEN, JSON.stringify(citizen));
      localStorage.setItem(STORAGE_KEYS.ALL_CITIZENS, JSON.stringify(allCitizens));
      localStorage.setItem(STORAGE_KEYS.FAMILIES, JSON.stringify(familyCards));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN_WARGA, String(isLoggedInWarga));
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN_ADMIN, String(isLoggedInAdmin));
    } catch (e) {
      console.warn('Storage sync issue', e);
    }
  }, [citizen, allCitizens, familyCards, submissions, notifications, isLoggedInWarga, isLoggedInAdmin]);

  const startOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
    } catch (e) {
      console.warn('Storage issue', e);
    }
  };

  // Admin Login Handler: username & password 'admin123*'
  const loginAdmin = (username: string, pass: string): { success: boolean; message: string } => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    const isMatchUser =
      cleanUser === 'admin' ||
      cleanUser === 'admin123*' ||
      cleanUser === 'admin@desaadimulya.com' ||
      cleanUser === 'admin@desa-adimulya.id';
    const isMatchPass = cleanPass === 'admin123*';

    if (isMatchUser && isMatchPass) {
      setIsLoggedInAdmin(true);
      setCurrentView('admin');
      setActiveAdminTab('dashboard');
      showToast('Berhasil masuk sebagai Petugas Pelayanan Desa Adimulya', 'success');
      return { success: true, message: 'Masuk sebagai Admin Perangkat Desa' };
    }

    return {
      success: false,
      message: 'Username atau kata sandi admin salah. Gunakan username dan password: admin123*',
    };
  };

  // Citizen Login Handler
  const login = (emailOrNik: string, pass: string): { success: boolean; message: string; role: 'warga' | 'admin' } => {
    const cleanInput = emailOrNik.trim().toLowerCase();
    const cleanPass = pass.trim();

    // If entered admin credentials in general login
    if (
      (cleanInput === 'admin' || cleanInput === 'admin123*' || cleanInput.includes('admin')) &&
      cleanPass === 'admin123*'
    ) {
      setIsLoggedInAdmin(true);
      setCurrentView('admin');
      setActiveAdminTab('dashboard');
      showToast('Berhasil masuk sebagai Admin Desa Adimulya', 'success');
      return { success: true, message: 'Masuk sebagai Admin Desa', role: 'admin' };
    }

    // Check citizen match
    const found = allCitizens.find(
      (c) =>
        c.nik.toLowerCase() === cleanInput ||
        c.email.toLowerCase() === cleanInput ||
        c.noHp === cleanInput
    );

    if (found) {
      setCitizen(found);
      setIsLoggedInWarga(true);
      setCurrentView('citizen');
      setActiveCitizenTab('dashboard');
      showToast(`Selamat datang kembali, ${found.nama}!`, 'success');
      return { success: true, message: 'Login berhasil', role: 'warga' };
    }

    // Allow quick citizen login for prototype if valid NIK length or password provided
    if (cleanInput.length >= 4) {
      const customCitizen: CitizenProfile = {
        ...defaultCitizenProfile,
        id: `cit-${Date.now()}`,
        nik: cleanInput.length === 16 ? cleanInput : defaultCitizenProfile.nik,
        nama: cleanInput.includes('@') ? cleanInput.split('@')[0] : (citizen.nama || 'Warga Desa Adimulya'),
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@warga.desa.id`,
      };
      setCitizen(customCitizen);
      setAllCitizens((prev) => [customCitizen, ...prev]);
      setIsLoggedInWarga(true);
      setCurrentView('citizen');
      setActiveCitizenTab('dashboard');
      showToast(`Selamat datang, ${customCitizen.nama}!`, 'success');
      return { success: true, message: 'Login berhasil', role: 'warga' };
    }

    return {
      success: false,
      message: 'NIK atau Email tidak ditemukan. Silakan registrasi terlebih dahulu.',
      role: 'warga',
    };
  };

  const register = (
    data: Partial<CitizenProfile> & { password: string }
  ): { success: boolean; message: string; email: string } => {
    const existing = allCitizens.find(
      (c) => c.nik === data.nik || (data.email && c.email.toLowerCase() === data.email.toLowerCase())
    );

    if (existing) {
      return {
        success: false,
        message: 'NIK atau Email sudah terdaftar di basis data kependudukan desa.',
        email: data.email || '',
      };
    }

    const newCitizen: CitizenProfile = {
      id: `cit-${Date.now()}`,
      nik: data.nik || `330102${Date.now().toString().slice(-10)}`,
      noKk: data.noKk || '3301022809080099',
      nama: data.nama || 'Warga Baru Adimulya',
      jenisKelamin: data.jenisKelamin || 'Laki-laki',
      tempatLahir: data.tempatLahir || 'Cilacap',
      tanggalLahir: data.tanggalLahir || '1995-01-01',
      statusPerkawinan: data.statusPerkawinan || 'Belum Kawin',
      agama: data.agama || 'Islam',
      pendidikan: data.pendidikan || 'SMA / Sederajat',
      pekerjaan: data.pekerjaan || 'Wiraswasta',
      golDarah: data.golDarah || 'B',
      email: data.email || 'warga.baru@desaadimulya.com',
      noHp: data.noHp || '0812-3456-7890',
      alamat: data.alamat || 'Dusun Krajan',
      rt: data.rt || '001',
      rw: data.rw || '001',
      dusun: data.dusun || 'Dusun Cidubang',
      desa: 'Adimulya',
      kecamatan: 'Wanareja',
      kabupaten: 'Cilacap',
      provinsi: 'Jawa Tengah',
      kodePos: '53265',
    };

    setCitizen(newCitizen);
    setAllCitizens((prev) => [newCitizen, ...prev]);

    // Create initial family card
    const newFamily: FamilyCard = {
      noKk: newCitizen.noKk,
      kepalaKeluarga: newCitizen.nama,
      alamat: newCitizen.alamat,
      rt: newCitizen.rt,
      rw: newCitizen.rw,
      dusun: newCitizen.dusun,
      desa: newCitizen.desa,
      kecamatan: newCitizen.kecamatan,
      kabupaten: newCitizen.kabupaten,
      provinsi: newCitizen.provinsi,
      kodePos: newCitizen.kodePos,
      telepon: newCitizen.noHp,
      email: newCitizen.email,
      members: [
        {
          id: `mem-${Date.now()}-1`,
          noKk: newCitizen.noKk,
          nik: newCitizen.nik,
          nama: newCitizen.nama,
          jenisKelamin: newCitizen.jenisKelamin,
          hubungan: 'Kepala Keluarga',
          tempatLahir: newCitizen.tempatLahir,
          tanggalLahir: newCitizen.tanggalLahir,
          agama: newCitizen.agama,
          pendidikan: newCitizen.pendidikan,
          pekerjaan: newCitizen.pekerjaan,
          statusPerkawinan: newCitizen.statusPerkawinan,
        },
      ],
    };
    setFamilyCards((prev) => [newFamily, ...prev]);

    setPendingOtpEmail(newCitizen.email);
    setCurrentView('otp');
    return {
      success: true,
      message: 'Data registrasi tersimpan. Silakan masukkan kode verifikasi.',
      email: newCitizen.email,
    };
  };

  const verifyOtp = (code: string): { success: boolean; message: string } => {
    if (code.length === 6) {
      setIsLoggedInWarga(true);
      setCurrentView('citizen');
      setActiveCitizenTab('dashboard');
      showToast(`Pendaftaran berhasil! Selamat datang, ${citizen.nama}.`, 'success');
      return { success: true, message: 'Verifikasi akun berhasil.' };
    }
    return { success: false, message: 'Kode OTP tidak valid. Masukkan 6 digit angka.' };
  };

  const logout = () => {
    setIsLoggedInWarga(false);
    setIsLoggedInAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN_WARGA);
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN_ADMIN);
    setCurrentView('public');
    showToast('Anda telah keluar dari sistem pelayanan.', 'info');
  };

  const switchRole = (role: 'warga' | 'admin') => {
    if (role === 'admin') {
      setCurrentView('admin-login');
    } else {
      if (isLoggedInWarga) {
        setCurrentView('citizen');
      } else {
        setCurrentView('login');
      }
    }
  };

  // Citizen Profile & Family
  const updateProfile = (updated: Partial<CitizenProfile>) => {
    setCitizen((prev) => {
      const next = { ...prev, ...updated };
      setAllCitizens((all) => all.map((c) => (c.id === prev.id ? next : c)));
      return next;
    });
    showToast('Data profil berhasil diperbarui.', 'success');
  };

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: `mem-${Date.now()}`,
    };

    setFamilyCards((prev) =>
      prev.map((card) => {
        if (card.noKk === citizen.noKk) {
          return {
            ...card,
            members: [...card.members, newMember],
          };
        }
        return card;
      })
    );
    showToast(`Anggota keluarga ${member.nama} berhasil ditambahkan.`, 'success');
  };

  const updateFamilyMember = (updatedMember: FamilyMember) => {
    setFamilyCards((prev) =>
      prev.map((card) => {
        if (card.noKk === updatedMember.noKk) {
          return {
            ...card,
            members: card.members.map((m) => (m.id === updatedMember.id ? updatedMember : m)),
          };
        }
        return card;
      })
    );
    showToast(`Data anggota keluarga ${updatedMember.nama} berhasil diubah.`, 'success');
  };

  // Submissions
  const createSubmission = (
    service: ServiceItem,
    formData: Record<string, any>,
    files: { name: string; size: string; docType: string }[],
    isDraft: boolean
  ) => {
    const regNum = `REG-ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const attachedFiles = files.map((f, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      name: f.name,
      size: f.size,
      docType: f.docType,
      uploadedAt: nowIso,
      verified: false,
    }));

    const newSub: ApplicationSubmission = {
      id: `sub-${Date.now()}`,
      registrationNo: regNum,
      serviceId: service.id,
      serviceTitle: service.title,
      category: service.category,
      applicantNik: citizen.nik,
      applicantName: citizen.nama,
      applicantPhone: citizen.noHp,
      applicantEmail: citizen.email,
      applicantAddress: `${citizen.alamat}, ${citizen.dusun}`,
      createdAt: nowIso,
      updatedAt: nowIso,
      status: isDraft ? 'draft' : 'menunggu_verifikasi',
      formData,
      attachedFiles,
      timeline: [
        {
          id: `t-${Date.now()}`,
          timestamp: nowIso,
          title: isDraft ? 'Draf Pengajuan Disimpan' : 'Permohonan Berhasil Diajukan',
          description: isDraft
            ? 'Pengajuan disimpan sebagai draf sementara.'
            : 'Berkas permohonan telah dikirim dan menunggu verifikasi petugas pelayanan desa.',
          actor: citizen.nama,
          status: isDraft ? 'draft' : 'menunggu_verifikasi',
        },
      ],
    };

    setSubmissions((prev) => [newSub, ...prev]);

    // Send notification to citizen & admin
    const newNotifWarga: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: isDraft ? `Draf Disimpan: ${service.title}` : `Pengajuan Terkirim: ${service.title}`,
      message: isDraft
        ? `Draf nomor ${regNum} tersimpan. Anda dapat melanjutkannya kapan saja.`
        : `Pengajuan permohonan ${service.title} dengan nomor registrasi ${regNum} berhasil dikirim ke Kantor Desa Adimulya. Petugas akan segera memverifikasi berkas Anda.`,
      timestamp: nowIso,
      isRead: false,
      type: isDraft ? 'info' : 'success',
      applicationId: newSub.id,
      registrationNo: regNum,
      recipientRole: 'warga',
      recipientNik: citizen.nik,
    };

    const newNotifAdmin: NotificationItem = {
      id: `notif-admin-${Date.now()}`,
      title: `Permohonan Masuk: ${service.title}`,
      message: `${citizen.nama} (${citizen.dusun}) mengajukan ${service.title} dengan nomor ${regNum}.`,
      timestamp: nowIso,
      isRead: false,
      type: 'info',
      applicationId: newSub.id,
      registrationNo: regNum,
      recipientRole: 'admin',
    };

    setNotifications((prev) => [newNotifWarga, newNotifAdmin, ...prev]);
    showToast(
      isDraft ? 'Draf pengajuan tersimpan.' : `Pengajuan ${regNum} berhasil dikirim!`,
      'success'
    );
    return newSub;
  };

  const resubmitRevision = (
    submissionId: string,
    updatedFiles: { name: string; size: string; docType: string }[],
    notes?: string
  ) => {
    const nowIso = new Date().toISOString();
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          const newFiles = updatedFiles.map((f, idx) => ({
            id: `rev-file-${Date.now()}-${idx}`,
            name: f.name,
            size: f.size,
            docType: f.docType,
            uploadedAt: nowIso,
            verified: false,
          }));

          const updatedTimeline = [
            ...sub.timeline,
            {
              id: `t-${Date.now()}`,
              timestamp: nowIso,
              title: 'Perbaikan Berkas Dikirim',
              description: notes || 'Warga telah mengunggah kembali dokumen perbaikan yang diminta.',
              actor: citizen.nama,
              status: 'diproses' as ApplicationStatus,
            },
          ];

          return {
            ...sub,
            status: 'diproses',
            updatedAt: nowIso,
            attachedFiles: [...sub.attachedFiles, ...newFiles],
            timeline: updatedTimeline,
            adminNotes: 'Warga telah mengirimkan berkas revisi. Menunggu tinjauan ulang petugas.',
          };
        }
        return sub;
      })
    );

    showToast('Dokumen perbaikan berhasil dikirimkan ke petugas.', 'success');
  };

  // Admin updates submission status & generates real citizen notification
  const updateSubmissionStatus = (
    submissionId: string,
    status: ApplicationStatus,
    adminNotes?: string,
    officialLetterNo?: string
  ) => {
    const nowIso = new Date().toISOString();
    let statusLabel = 'Status Diperbarui';
    let notifType: 'info' | 'success' | 'warning' | 'alert' = 'info';

    if (status === 'diproses') {
      statusLabel = 'Berkas Terverifikasi & Sedang Diproses';
      notifType = 'info';
    } else if (status === 'perlu_perbaikan') {
      statusLabel = 'Dokumen Membutuhkan Perbaikan';
      notifType = 'warning';
    } else if (status === 'disetujui') {
      statusLabel = 'Pengajuan Disetujui (Siap Diambil)';
      notifType = 'success';
    } else if (status === 'selesai') {
      statusLabel = 'Pelayanan Selesai & Dokumen Terbit';
      notifType = 'success';
    } else if (status === 'ditolak') {
      statusLabel = 'Pengajuan Ditolak';
      notifType = 'alert';
    }

    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          const updatedSub = {
            ...sub,
            status,
            updatedAt: nowIso,
            adminNotes: adminNotes !== undefined && adminNotes.trim() ? adminNotes : sub.adminNotes,
            officialLetterNo: officialLetterNo || sub.officialLetterNo,
            timeline: [
              ...sub.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp: nowIso,
                title: statusLabel,
                description:
                  (adminNotes && adminNotes.trim()) ||
                  (status === 'selesai'
                    ? 'Surat resmi telah selesai diterbitkan dengan tanda tangan resmi Pemerintah Desa Adimulya.'
                    : `Status permohonan surat diperbarui menjadi: ${statusLabel}.`),
                actor: 'Drs. Hendro Wibowo (Petugas Pelayanan)',
                status,
              },
            ],
          };

          // Citizen Notification
          const notificationMessage =
            adminNotes && adminNotes.trim()
              ? `Catatan Petugas: "${adminNotes}". Status surat ${sub.registrationNo} kini: ${statusLabel}.`
              : `Status permohonan surat "${sub.serviceTitle}" (${sub.registrationNo}) telah diperbarui menjadi: ${statusLabel}.`;

          const notifMsg: NotificationItem = {
            id: `notif-update-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title: `${statusLabel}: ${sub.serviceTitle}`,
            message: notificationMessage,
            timestamp: nowIso,
            isRead: false,
            type: notifType,
            applicationId: sub.id,
            registrationNo: sub.registrationNo,
            recipientRole: 'warga',
            recipientNik: sub.applicantNik,
          };

          setNotifications((nPrev) => [notifMsg, ...nPrev]);

          if (selectedSubmission?.id === submissionId) {
            setSelectedSubmission(updatedSub);
          }

          return updatedSub;
        }
        return sub;
      })
    );

    showToast(`Status pengajuan berhasil diubah menjadi: ${statusLabel}`, 'success');
  };

  // Delete submission feature
  const deleteSubmission = (submissionId: string) => {
    setSubmissions((prev) => prev.filter((sub) => sub.id !== submissionId));
    setNotifications((prev) => prev.filter((n) => n.applicationId !== submissionId));
    if (selectedSubmission?.id === submissionId) {
      setSelectedSubmission(null);
    }
    showToast('Permohonan surat berhasil dihapus dari sistem.', 'success');
  };

  const updateCitizenByAdmin = (updated: CitizenProfile) => {
    setAllCitizens((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (citizen.id === updated.id) {
      setCitizen(updated);
    }
    showToast(`Data warga ${updated.nama} berhasil diperbarui.`, 'success');
  };

  // Notifications
  const unreadCountWarga = notifications.filter(
    (n) => n.recipientRole === 'warga' && !n.isRead && (!n.recipientNik || n.recipientNik === citizen.nik)
  ).length;

  const unreadCountAdmin = notifications.filter(
    (n) => n.recipientRole === 'admin' && !n.isRead
  ).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = (role: 'warga' | 'admin') => {
    setNotifications((prev) =>
      prev.map((n) => (n.recipientRole === role ? { ...n, isRead: true } : n))
    );
    showToast('Semua notifikasi telah ditandai sudah dibaca.', 'info');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.CITIZEN);
    localStorage.removeItem(STORAGE_KEYS.ALL_CITIZENS);
    localStorage.removeItem(STORAGE_KEYS.FAMILIES);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
    setCitizen(defaultCitizenProfile);
    setAllCitizens(otherCitizens);
    setFamilyCards(defaultFamilyCards);
    setSubmissions([]);
    setNotifications([]);
    setHasCompletedOnboarding(false);
    setIsOnboardingOpen(false);
    showToast('Data permohonan berhasil dikosongkan.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeCitizenTab,
        setActiveCitizenTab,
        activeAdminTab,
        setActiveAdminTab,
        citizen,
        allCitizens,
        familyCards,
        submissions,
        notifications,
        villageStats: initialVillageStats,
        selectedSubmission,
        setSelectedSubmission,
        selectedServiceForForm,
        setSelectedServiceForForm,
        selectedOfficialDoc,
        setSelectedOfficialDoc,
        isLoggedInWarga,
        isLoggedInAdmin,
        login,
        loginAdmin,
        register,
        verifyOtp,
        logout,
        switchRole,
        pendingOtpEmail,
        updateProfile,
        addFamilyMember,
        updateFamilyMember,
        createSubmission,
        resubmitRevision,
        updateSubmissionStatus,
        deleteSubmission,
        updateCitizenByAdmin,
        unreadCountWarga,
        unreadCountAdmin,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isOnboardingOpen,
        setIsOnboardingOpen,
        hasCompletedOnboarding,
        startOnboarding,
        completeOnboarding,
        resetDemoData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
