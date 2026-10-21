import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBannerDemo } from './components/common/TopBannerDemo';
import { DocumentPreviewModal } from './components/common/DocumentPreviewModal';

// Public views
import { PublicNavbar } from './components/public/PublicNavbar';
import { LandingPage } from './components/public/LandingPage';
import { LoginView, RegisterView, OtpVerificationView } from './components/public/AuthViews';

// Citizen views
import { CitizenLayout } from './components/citizen/CitizenLayout';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { CitizenServiceCatalog } from './components/citizen/CitizenServiceCatalog';
import { CitizenApplicationForm } from './components/citizen/CitizenApplicationForm';
import { CitizenHistoryView } from './components/citizen/CitizenHistoryView';
import { CitizenFamilyView } from './components/citizen/CitizenFamilyView';
import { CitizenProfileView } from './components/citizen/CitizenProfileView';
import { CitizenNotificationsView } from './components/citizen/CitizenNotificationsView';
import { CitizenOnboardingModal } from './components/citizen/CitizenOnboardingModal';

// Admin views
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminApplicationsView } from './components/admin/AdminApplicationsView';
import { AdminCitizensView } from './components/admin/AdminCitizensView';
import { AdminFamilyCardsView } from './components/admin/AdminFamilyCardsView';
import { AdminNotificationsView } from './components/admin/AdminNotificationsView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';

const MainContent: React.FC = () => {
  const {
    currentView,
    activeCitizenTab,
    activeAdminTab,
    selectedOfficialDoc,
    setSelectedOfficialDoc,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Persistent Demo Controller Banner */}
      <TopBannerDemo />

      {/* VIEW ROUTER */}
      {currentView === 'public' && (
        <>
          <PublicNavbar />
          <main className="flex-1">
            <LandingPage />
          </main>
        </>
      )}

      {currentView === 'login' && (
        <>
          <PublicNavbar />
          <main className="flex-1">
            <LoginView />
          </main>
        </>
      )}

      {currentView === 'register' && (
        <>
          <PublicNavbar />
          <main className="flex-1">
            <RegisterView />
          </main>
        </>
      )}

      {currentView === 'otp' && (
        <>
          <PublicNavbar />
          <main className="flex-1">
            <OtpVerificationView />
          </main>
        </>
      )}

      {currentView === 'citizen' && (
        <CitizenLayout>
          {activeCitizenTab === 'dashboard' && <CitizenDashboard />}
          {activeCitizenTab === 'katalog' && <CitizenServiceCatalog />}
          {activeCitizenTab === 'formulir' && <CitizenApplicationForm />}
          {activeCitizenTab === 'riwayat' && <CitizenHistoryView />}
          {activeCitizenTab === 'keluarga' && <CitizenFamilyView />}
          {activeCitizenTab === 'profil' && <CitizenProfileView />}
          {activeCitizenTab === 'notifikasi' && <CitizenNotificationsView />}
        </CitizenLayout>
      )}

      {currentView === 'admin' && (
        <AdminLayout>
          {activeAdminTab === 'dashboard' && <AdminDashboard />}
          {activeAdminTab === 'pengajuan' && <AdminApplicationsView />}
          {activeAdminTab === 'warga' && <AdminCitizensView />}
          {activeAdminTab === 'keluarga' && <AdminFamilyCardsView />}
          {activeAdminTab === 'notifikasi' && <AdminNotificationsView />}
          {activeAdminTab === 'pengaturan' && <AdminSettingsView />}
        </AdminLayout>
      )}

      {/* Global Document Preview Modal */}
      <DocumentPreviewModal
        submission={selectedOfficialDoc}
        isOpen={!!selectedOfficialDoc}
        onClose={() => setSelectedOfficialDoc(null)}
      />

      {/* Citizen Step-by-Step Onboarding Tour Modal */}
      <CitizenOnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
