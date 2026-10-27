import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { serviceCatalog } from '../../data/mockData';
import {
  Building2,
  Bell,
  FileText,
  UserPlus,
  Home,
  Briefcase,
  Truck,
  Clock,
  User,
  Users,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Shield,
  Compass,
  LayoutDashboard,
} from 'lucide-react';

interface CitizenLayoutProps {
  children: React.ReactNode;
}

export const CitizenLayout: React.FC<CitizenLayoutProps> = ({ children }) => {
  const {
    activeCitizenTab,
    setActiveCitizenTab,
    setCurrentView,
    citizen,
    logout,
    switchRole,
    unreadCountWarga,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedSubmission,
    submissions,
    startOnboarding,
    setSelectedServiceForForm,
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Dropdown states for sidebar submenus
  const [openPengantarUmum, setOpenPengantarUmum] = useState(false);
  const [openKematian, setOpenKematian] = useState(false);
  const [openKelahiran, setOpenKelahiran] = useState(false);

  const citizenNotifs = notifications
    .filter((n) => n.recipientRole === 'warga' && (!n.recipientNik || n.recipientNik === citizen.nik))
    .slice(0, 5);

  const handleOpenService = (serviceCode: string) => {
    const found = serviceCatalog.find((s) => s.code === serviceCode) || serviceCatalog[0];
    setSelectedServiceForForm(found);
    setActiveCitizenTab('formulir');
    setMobileSidebarOpen(false);
  };

  const handleSelectTab = (tabId: string) => {
    setActiveCitizenTab(tabId);
    if (tabId === 'notifikasi') {
      markAllNotificationsAsRead('warga');
    }
    setMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#148849] text-white">
      {/* Brand Header: Building icon + SI Adimulya */}
      <div
        onClick={() => handleSelectTab('dashboard')}
        className="flex items-center gap-3 px-5 py-5 border-b border-emerald-600/40 cursor-pointer select-none"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-700/60 flex items-center justify-center shrink-0 border border-emerald-400/30">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">SI Adimulya</span>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-xs font-medium select-none">
        {/* Tombol Dashboard (Di atas Notifikasi, berisi menu selamat datang) */}
        <button
          onClick={() => handleSelectTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            activeCitizenTab === 'dashboard'
              ? 'bg-emerald-800 text-white font-bold'
              : 'text-emerald-50 hover:bg-emerald-700/60 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-emerald-100" />
          <span>Dashboard</span>
        </button>

        {/* Notifikasi */}
        <button
          onClick={() => handleSelectTab('notifikasi')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
            activeCitizenTab === 'notifikasi'
              ? 'bg-emerald-800 text-white font-bold'
              : 'text-emerald-50 hover:bg-emerald-700/60 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-emerald-100" />
            <span>Notifikasi</span>
          </div>
          {unreadCountWarga > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[11px] flex items-center justify-center">
              {unreadCountWarga}
            </span>
          )}
        </button>

        {/* Pengantar Umum (Dropdown) */}
        <div>
          <button
            onClick={() => setOpenPengantarUmum(!openPengantarUmum)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-emerald-50 hover:bg-emerald-700/60 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-emerald-100" />
              <span>Pengantar Umum</span>
            </div>
            {openPengantarUmum ? (
              <ChevronDown className="w-4 h-4 text-emerald-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-emerald-200" />
            )}
          </button>
          {openPengantarUmum && (
            <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in duration-150">
              <button
                onClick={() => handleOpenService('SRV-KTP')}
                className="w-full text-left py-1.5 px-2 text-[11px] text-emerald-100 hover:text-white hover:bg-emerald-700/50 rounded flex items-center gap-1.5"
              >
                · Pengantar KTP
              </button>
              <button
                onClick={() => handleOpenService('SRV-SKCK')}
                className="w-full text-left py-1.5 px-2 text-[11px] text-emerald-100 hover:text-white hover:bg-emerald-700/50 rounded flex items-center gap-1.5"
              >
                · Pengantar SKCK
              </button>
              <button
                onClick={() => handleOpenService('SRV-KERAMAIAN')}
                className="w-full text-left py-1.5 px-2 text-[11px] text-emerald-100 hover:text-white hover:bg-emerald-700/50 rounded flex items-center gap-1.5"
              >
                · Pengantar Izin Keramaian
              </button>
            </div>
          )}
        </div>

        {/* Surat Kematian (Dropdown) */}
        <div>
          <button
            onClick={() => setOpenKematian(!openKematian)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-emerald-50 hover:bg-emerald-700/60 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-emerald-100" />
              <span>Surat Kematian</span>
            </div>
            {openKematian ? (
              <ChevronDown className="w-4 h-4 text-emerald-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-emerald-200" />
            )}
          </button>
          {openKematian && (
            <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in duration-150">
              <button
                onClick={() => handleOpenService('SRV-KEMATIAN-KUNING')}
                className="w-full text-left py-1.5 px-2 text-[11px] text-emerald-100 hover:text-white hover:bg-emerald-700/50 rounded flex items-center gap-1.5"
              >
                · Kematian Kuning
              </button>
              <button
                onClick={() => handleOpenService('SRV-AKTA-MATI')}
                className="w-full text-left py-1.5 px-2 text-[11px] text-emerald-100 hover:text-white hover:bg-emerald-700/50 rounded flex items-center gap-1.5"
              >
                · Surat Pengantar Akte Kematian
              </button>
            </div>
          )}
        </div>

        {/* Pengantar Akte Kelahiran (Dropdown) */}
        <div>
          <button
            onClick={() => setOpenKelahiran(!openKelahiran)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-emerald-50 hover:bg-emerald-700/60 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <UserPlus className="w-4 h-4 text-emerald-100" />
              <span>Pengantar Akte Kelahiran</span>
            </div>
            {openKelahiran ? (
              <ChevronDown className="w-4 h-4 text-emerald-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-emerald-200" />
            )}
          </button>
          {openKelahiran && (
            <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in duration-150">
              <button
                onClick={() => handleOpenService('SRV-AKTA-LAHIR')}
                className="w-full text-left py-1.5 px-2 text-[11px] text-emerald-100 hover:text-white hover:bg-emerald-700/50 rounded flex items-center gap-1.5"
              >
                · Pengantar Akte Kelahiran
              </button>
              <button
                onClick={() => handleOpenService('SRV-KET-LAHIR')}
                className="w-full text-left py-1.5 px-2 text-[11px] text-emerald-100 hover:text-white hover:bg-emerald-700/50 rounded flex items-center gap-1.5"
              >
                · Surat Keterangan Kelahiran
              </button>
            </div>
          )}
        </div>

        {/* Surat Domisili */}
        <button
          onClick={() => handleOpenService('SRV-DOMISILI')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-50 hover:bg-emerald-700/60 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4 text-emerald-100" />
          <span>Surat Domisili</span>
        </button>

        {/* Surat Keterangan Usaha */}
        <button
          onClick={() => handleOpenService('SRV-SKU')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-50 hover:bg-emerald-700/60 hover:text-white transition-colors"
        >
          <Briefcase className="w-4 h-4 text-emerald-100" />
          <span>Surat Keterangan Usaha</span>
        </button>

        {/* Surat Pindah */}
        <button
          onClick={() => handleOpenService('SRV-PINDAH')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-50 hover:bg-emerald-700/60 hover:text-white transition-colors"
        >
          <Truck className="w-4 h-4 text-emerald-100" />
          <span>Surat Pindah</span>
        </button>

        {/* Riwayat Pengajuan */}
        <button
          onClick={() => handleSelectTab('riwayat')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            activeCitizenTab === 'riwayat'
              ? 'bg-emerald-800 text-white font-bold'
              : 'text-emerald-50 hover:bg-emerald-700/60 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-100" />
          <span>Riwayat Pengajuan</span>
        </button>

        {/* Data Keluarga */}
        <button
          onClick={() => handleSelectTab('keluarga')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            activeCitizenTab === 'keluarga'
              ? 'bg-emerald-800 text-white font-bold'
              : 'text-emerald-50 hover:bg-emerald-700/60 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-100" />
          <span>Data Keluarga</span>
        </button>

        {/* Profil Saya */}
        <button
          onClick={() => handleSelectTab('profil')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            activeCitizenTab === 'profil'
              ? 'bg-emerald-800 text-white font-bold'
              : 'text-emerald-50 hover:bg-emerald-700/60 hover:text-white'
          }`}
        >
          <User className="w-4 h-4 text-emerald-100" />
          <span>Profil Saya</span>
        </button>
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-emerald-600/40 bg-emerald-900/40 space-y-2">
        <button
          onClick={startOnboarding}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white text-[11px] rounded transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Panduan Layanan</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentView('public')}
            className="flex-1 py-1.5 px-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white text-[11px] rounded transition-colors flex items-center justify-center gap-1 font-medium"
          >
            <Home className="w-3 h-3" />
            <span>Halaman Utama</span>
          </button>
          <button
            onClick={logout}
            className="py-1.5 px-2 bg-emerald-800/80 hover:bg-rose-900 text-emerald-200 hover:text-rose-100 text-[11px] rounded transition-colors flex items-center gap-1 font-medium"
            title="Keluar dari Akun"
          >
            <LogOut className="w-3 h-3" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 shadow-sm border-r border-emerald-700">
        {sidebarContent}
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden sticky top-0 z-20 bg-[#148849] text-white h-14 px-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-1.5 text-white hover:bg-emerald-700 rounded-lg"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-base">SI Adimulya</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectTab('notifikasi')}
              className="p-1.5 text-white relative"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadCountWarga > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                  {unreadCountWarga}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSelectTab('profil')}
              className="w-7 h-7 rounded-full bg-white text-[#148849] font-bold text-xs flex items-center justify-center"
            >
              {citizen.nama.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex">
            <div className="w-64 h-full animate-in slide-in-from-left duration-200">
              {sidebarContent}
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
