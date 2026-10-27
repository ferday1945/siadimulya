import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VillageLogo } from '../common/VillageLogo';
import { Menu, X, User, Shield } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const {
    setCurrentView,
    switchRole,
    isLoggedInWarga,
    isLoggedInAdmin,
    citizen,
    logout,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark / brand mark */}
          <div
            onClick={() => setCurrentView('public')}
            className="cursor-pointer shrink-0"
          >
            <VillageLogo size="md" />
          </div>

          {/* Zone 2: 4-5 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('beranda')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('layanan')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
            >
              Layanan Administrasi
            </button>
            <button
              onClick={() => scrollToSection('alur')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
            >
              Alur Pengajuan
            </button>
            <button
              onClick={() => scrollToSection('tentang')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
            >
              Tentang Desa
            </button>
            <button
              onClick={() => scrollToSection('kontak')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
            >
              Kontak Balai Desa
            </button>
          </nav>

          {/* Zone 3: 1 primary action group */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isLoggedInAdmin ? (
              <>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  Portal Petugas (Aktif)
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Keluar
                </button>
              </>
            ) : isLoggedInWarga ? (
              <>
                <button
                  onClick={() => setCurrentView('citizen')}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Portal Warga ({citizen.nama})
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentView('admin-login')}
                  className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  Petugas Desa
                </button>
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#198754] hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  Login Warga
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {!isLoggedInWarga && !isLoggedInAdmin ? (
              <button
                onClick={() => setCurrentView('login')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#198754] rounded-lg shadow-xs"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => setCurrentView(isLoggedInAdmin ? 'admin' : 'citizen')}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                Portal
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 text-sm shadow-md animate-in slide-in-from-top duration-150">
          <button
            onClick={() => scrollToSection('beranda')}
            className="block w-full text-left py-2 px-3 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
          >
            Beranda
          </button>
          <button
            onClick={() => scrollToSection('layanan')}
            className="block w-full text-left py-2 px-3 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
          >
            Layanan Administrasi
          </button>
          <button
            onClick={() => scrollToSection('alur')}
            className="block w-full text-left py-2 px-3 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
          >
            Alur Pengajuan
          </button>
          <button
            onClick={() => scrollToSection('tentang')}
            className="block w-full text-left py-2 px-3 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
          >
            Tentang Desa Adimulya
          </button>
          <button
            onClick={() => scrollToSection('kontak')}
            className="block w-full text-left py-2 px-3 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
          >
            Kontak Balai Desa
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isLoggedInWarga ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView('citizen');
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  Buka Portal Warga ({citizen.nama})
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-center text-xs font-medium text-rose-600 bg-rose-50 rounded-lg"
                >
                  Keluar dari Akun
                </button>
              </>
            ) : isLoggedInAdmin ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView('admin');
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg"
                >
                  Buka Portal Petugas Desa
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-center text-xs font-medium text-rose-600 bg-rose-50 rounded-lg"
                >
                  Keluar dari Akun
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView('login');
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-white bg-[#198754] rounded-lg shadow-xs"
                >
                  Login Warga
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView('admin-login');
                  }}
                  className="w-full py-2.5 text-center text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Petugas Desa (Admin)
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
