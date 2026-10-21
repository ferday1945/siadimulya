import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Info,
  Clock,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';

export const AdminNotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedSubmission,
    submissions,
    setActiveAdminTab,
  } = useApp();

  const adminNotifs = notifications.filter((n) => n.recipientRole === 'admin');

  const handleOpenSubmission = (notifId: string, appId?: string) => {
    markNotificationAsRead(notifId);
    if (appId) {
      const found = submissions.find((s) => s.id === appId);
      if (found) {
        setSelectedSubmission(found);
        setActiveAdminTab('pengajuan');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Notifikasi Petugas Pelayanan Desa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pemberitahuan permohonan baru masuk dan pembaruan berkas dari warga
          </p>
        </div>

        <button
          onClick={() => markAllNotificationsAsRead('admin')}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
          Tandai Semua Dibaca
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {adminNotifs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Belum ada notifikasi petugas.
          </div>
        ) : (
          adminNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-5 transition-colors flex items-start gap-4 ${
                !n.isRead ? 'bg-amber-50/40' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</h3>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Belum dibaca" />
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
                      onClick={() => handleOpenSubmission(n.id, n.applicationId)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      Buka & Verifikasi Berkas
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!n.isRead && (
                    <button
                      onClick={() => markNotificationAsRead(n.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                    >
                      Tandai dibaca
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
