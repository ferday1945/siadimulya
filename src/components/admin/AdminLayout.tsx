import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VillageLogo } from '../common/VillageLogo';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Home,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Shield,
  FileCheck2,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    activeAdminTab,
    setActiveAdminTab,
    setCurrentView,
    logout,
    switchRole,
    unreadCountAdmin,
    submissions,
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingSubmissionsCount = submissions.filter(
    (s) => s.status === 'menunggu_verifikasi'
  ).length;

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard Statistik', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'pengajuan',
      label: 'Kelola Pengajuan',
      icon: <Inbox className="w-4 h-4" />,
      badge: pendingSubmissionsCount > 0 ? pendingSubmissionsCount : undefined,
    },
    { id: 'warga', label: 'Data Warga Desa', icon: <Users className="w-4 h-4" /> },
    { id: 'keluarga', label: 'Data Kartu Keluarga', icon: <Home className="w-4 h-4" /> },
    {
      id: 'notifikasi',
      label: 'Notifikasi Petugas',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCountAdmin > 0 ? unreadCountAdmin : undefined,
    },
    { id: 'pengaturan', label: 'Pengaturan Desa', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelectTab = (id: string) => {
    setActiveAdminTab(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight leading-tight">
                Admin Desa Adimulya
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                Panel Kasi Pelayanan
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {adminMenuItems.map((item) => {
            const isActive = activeAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Profile Footprint */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 mb-2.5">
            <p className="text-xs font-bold text-white">Drs. Hendro Wibowo</p>
            <p className="text-[10px] text-slate-400">Kepala Seksi Pelayanan Desa</p>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">NIP: 19820415 201001 1 018</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentView('public')}
              className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded-md transition-colors flex items-center justify-center gap-1"
            >
              <Home className="w-3 h-3 text-emerald-400" />
              Halaman Utama
            </button>
            <button
              onClick={logout}
              className="py-1.5 px-2.5 bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 text-[11px] font-medium rounded-md transition-colors flex items-center gap-1"
              title="Keluar dari Akun Admin"
            >
              <LogOut className="w-3 h-3" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {adminMenuItems.find((m) => m.id === activeAdminTab)?.label || 'Panel Administrasi'}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Kantor Desa Adimulya · Penatausahaan Dokumen Pelayanan Publik
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Sistem Online Aktif</span>
            </div>

            <button
              onClick={() => setCurrentView('public')}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              Halaman Utama
            </button>
            <button
              onClick={logout}
              className="text-xs font-semibold text-rose-700 hover:text-rose-800 border border-rose-200 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* MOBILE SIDEBAR */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex">
            <div className="w-64 bg-slate-900 text-slate-200 h-full flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-sm text-white">Menu Admin Desa</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
                {adminMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                      activeAdminTab === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="p-3 border-t border-slate-800">
                <button
                  onClick={logout}
                  className="w-full py-2 px-3 bg-rose-900/60 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar Admin
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
