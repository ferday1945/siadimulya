import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  CheckCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const CitizenNotificationsView: React.FC = () => {
  const {
    citizen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedSubmission,
    submissions,
    setActiveCitizenTab,
  } = useApp();

  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  // Automatically mark notifications as read when entering notifications view
  useEffect(() => {
    const timer = setTimeout(() => {
      markAllNotificationsAsRead('warga');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const citizenNotifs = notifications.filter(
    (n) => n.recipientRole === 'warga' && (!n.recipientNik || n.recipientNik === citizen.nik)
  );

  const displayedNotifs = filterUnreadOnly
    ? citizenNotifs.filter((n) => !n.isRead)
    : citizenNotifs;

  const handleOpenLinkedSubmission = (notifId: string, appId?: string) => {
    markNotificationAsRead(notifId);
    if (appId) {
      const found = submissions.find((s) => s.id === appId);
      if (found) {
        setSelectedSubmission(found);
        setActiveCitizenTab('riwayat');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Notifikasi Pelayanan Warga
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Informasi status terbaru terkait dokumen dan proses administrasi Anda di Desa Adimulya
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              filterUnreadOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {filterUnreadOnly ? 'Tampilkan Semua' : 'Hanya Belum Dibaca'}
          </button>
          <button
            onClick={() => markAllNotificationsAsRead('warga')}
            className="px-3 py-1.5 bg-[#198754] text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Tandai Semua Dibaca
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {displayedNotifs.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada notifikasi untuk ditampilkan.</p>
            <p className="text-xs text-slate-400 mt-1">Anda akan menerima pembaruan setiap kali petugas memproses berkas.</p>
          </div>
        ) : (
          displayedNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-5 transition-colors flex items-start gap-4 ${
                !n.isRead ? 'bg-emerald-50/30' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {n.type === 'success' && (
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {n.type === 'warning' && (
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                )}
                {n.type === 'info' && (
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Info className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</h3>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" title="Belum dibaca" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {new Date(n.timestamp).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {n.message}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  {n.applicationId && (
                    <button
                      onClick={() => handleOpenLinkedSubmission(n.id, n.applicationId)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      Buka Detail Berkas ({n.registrationNo})
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!n.isRead && (
                    <button
                      onClick={() => markNotificationAsRead(n.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                    >
                      Tandai sudah dibaca
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
