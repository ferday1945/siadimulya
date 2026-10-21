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
  currentView: 'public' | 'login' | 'register' | 'otp' | 'citizen' | 'admin';
  setCurrentView: (view: 'public' | 'login' | 'register' | 'otp' | 'citizen' | 'admin') => void;
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
  login: (emailOrNik: string, pass: string) => { success: boolean; message: string; role: 'warga' | 'admin' };
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
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'public' | 'login' | 'register' | 'otp' | 'citizen' | 'admin'>('public');
  const [activeCitizenTab, setActiveCitizenTab] = useState<string>('dashboard');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [pendingOtpEmail, setPendingOtpEmail] = useState<string>('budi.santoso@gmail.com');

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

  const [submissions, setSubmissions] = useState<ApplicationSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : initialSubmissions;
    } catch {
      return initialSubmissions;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : initialNotifications;
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
    } catch (e) {
      console.warn('Storage sync issue', e);
    }
  }, [citizen, allCitizens, familyCards, submissions, notifications]);

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

  // Auth
  const login = (emailOrNik: string, pass: string): { success: boolean; message: string; role: 'warga' | 'admin' } => {
    const cleanInput = emailOrNik.trim().toLowerCase();
    // Admin check
    if (cleanInput.includes('admin') || cleanInput === 'admin@desa-adimulya.id') {
      setCurrentView('admin');
      setActiveAdminTab('dashboard');
      showToast('Berhasil masuk sebagai Petugas Pelayanan Desa Adimulya', 'info');
      return { success: true, message: 'Masuk sebagai Admin Perangkat Desa', role: 'admin' };
    }

    // Citizen check
    const found = allCitizens.find(
      (c) => c.email.toLowerCase() === cleanInput || c.nik === cleanInput
    );

    if (found || cleanInput === 'budi' || cleanInput.includes('budi') || pass === '123456' || pass.length >= 6) {
      const activeUser = found || defaultCitizenProfile;
      setCitizen(activeUser);
      setCurrentView('citizen');
      setActiveCitizenTab('dashboard');
      showToast(`Selamat datang kembali, ${activeUser.nama}!`, 'success');
      
      // Auto-open onboarding if not completed yet
      if (!hasCompletedOnboarding) {
        setIsOnboardingOpen(true);
      }
      return { success: true, message: 'Login berhasil', role: 'warga' };
    }

    return { success: false, message: 'Email / NIK atau password tidak sesuai. Coba akun demo atau klik tombol cepat.', role: 'warga' };
  };

  const register = (data: Partial<CitizenProfile> & { password: string }) => {
    if (!data.nik || data.nik.length < 16) {
      return { success: false, message: 'NIK harus berjumlah 16 digit angka.', email: '' };
    }
    if (!data.nama) {
      return { success: false, message: 'Nama lengkap wajib diisi.', email: '' };
    }
    if (!data.email) {
      return { success: false, message: 'Email aktif wajib diisi.', email: '' };
    }

    const newCitizen: CitizenProfile = {
      ...defaultCitizenProfile,
      ...data,
      id: `cit-${Date.now()}`,
      nik: data.nik,
      noKk: data.noKk || '3301022809080015',
      nama: data.nama,
      email: data.email,
      noHp: data.noHp || '0812-3456-7890',
    };

    setCitizen(newCitizen);
    setAllCitizens((prev) => [newCitizen, ...prev]);
    setPendingOtpEmail(data.email);
    setCurrentView('otp');
    return { success: true, message: 'Pendaftaran berhasil. Silakan verifikasi OTP.', email: data.email };
  };

  const verifyOtp = (code: string) => {
    if (code.trim() === '123456' || code.length === 6) {
      setCurrentView('citizen');
      setActiveCitizenTab('dashboard');
      showToast('Verifikasi akun berhasil! Selamat datang di Portal Warga Desa Adimulya.', 'success');
      if (!hasCompletedOnboarding) {
        setIsOnboardingOpen(true);
      }
      return { success: true, message: 'Akun Anda berhasil diverifikasi.' };
    }
    return { success: false, message: 'Kode OTP tidak sesuai. Gunakan kode simulasi demo 123456.' };
  };

  const logout = () => {
    setCurrentView('public');
    showToast('Anda telah keluar dari sistem pelayanan.', 'info');
  };

  const switchRole = (role: 'warga' | 'admin') => {
    if (role === 'warga') {
      setCurrentView('citizen');
      setActiveCitizenTab('dashboard');
      showToast('Beralih ke mode Warga (Budi Santoso)', 'info');
    } else {
      setCurrentView('admin');
      setActiveAdminTab('dashboard');
      showToast('Beralih ke mode Petugas Desa (Admin Pelayanan)', 'info');
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

    // Send notification
    const newNotifWarga: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: isDraft ? `Draf Disimpan: ${service.title}` : `Pengajuan Terkirim: ${service.title}`,
      message: isDraft
        ? `Draf nomor ${regNum} tersimpan. Anda dapat melanjutkannya kapan saja.`
        : `Pengajuan nomor ${regNum} berhasil dikirim ke Kantor Desa Adimulya. Petugas akan segera memverifikasi berkas Anda.`,
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
      statusLabel = 'Pengajuan Disetujui';
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
            adminNotes: adminNotes || sub.adminNotes,
            officialLetterNo: officialLetterNo || sub.officialLetterNo,
            timeline: [
              ...sub.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp: nowIso,
                title: statusLabel,
                description:
                  adminNotes ||
                  (status === 'selesai'
                    ? 'Surat resmi telah selesai diterbitkan dengan tanda tangan elektronik Kepala Desa Adimulya.'
                    : `Status permohonan diubah menjadi: ${status}.`),
                actor: 'Drs. Hendro Wibowo (Petugas Pelayanan)',
                status,
              },
            ],
          };

          // Also notify citizen
          const notifMsg: NotificationItem = {
            id: `notif-update-${Date.now()}`,
            title: `${statusLabel}: ${sub.serviceTitle}`,
            message:
              adminNotes ||
              `Status pengajuan Anda nomor ${sub.registrationNo} telah diperbarui menjadi ${status}.`,
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
    setSubmissions(initialSubmissions);
    setNotifications(initialNotifications);
    setHasCompletedOnboarding(false);
    setIsOnboardingOpen(false);
    showToast('Data demo berhasil di-reset ke data awal.', 'info');
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
        login,
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
