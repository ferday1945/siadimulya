import React from 'react';
import { ApplicationStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  RotateCw,
  AlertTriangle,
  XCircle,
  FileEdit,
} from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const configMap: Record<
    ApplicationStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    selesai: {
      label: 'Selesai',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    disetujui: {
      label: 'Disetujui',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    menunggu_verifikasi: {
      label: 'Menunggu Verifikasi',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    },
    diproses: {
      label: 'Sedang Diproses',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: <RotateCw className="w-3.5 h-3.5 text-blue-600 animate-spin-reverse" />,
    },
    perlu_perbaikan: {
      label: 'Perlu Perbaikan',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />,
    },
    ditolak: {
      label: 'Ditolak',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
    },
    draft: {
      label: 'Draf',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: <FileEdit className="w-3.5 h-3.5 text-slate-500" />,
    },
  };

  const item = configMap[status] || configMap.draft;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${item.bg} ${item.text} ${item.border} ${sizeClasses[size]}`}
    >
      {showIcon && <span className="shrink-0">{item.icon}</span>}
      <span className="whitespace-nowrap">{item.label}</span>
    </span>
  );
};
