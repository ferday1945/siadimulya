import React from 'react';

interface VillageLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const VillageLogo: React.FC<VillageLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm font-bold', sub: 'text-[10px]' },
    md: { icon: 'w-9 h-9', text: 'text-base font-bold', sub: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-xl font-bold', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl font-bold', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Emblem Icon */}
      <div
        className={`${current.icon} rounded-xl bg-gradient-to-br from-emerald-700 to-[#198754] text-white flex items-center justify-center shadow-sm shrink-0 border border-emerald-600/30 relative overflow-hidden`}
        title="Lambang Resmi Desa Adimulya"
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full p-1 fill-none stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Shield outline */}
          <path
            d="M20 4 L32 8 C32 22, 26 31, 20 36 C14 31, 8 22, 8 8 Z"
            className="fill-emerald-800/40 stroke-white/90"
          />
          {/* Star symbol */}
          <polygon
            points="20,11 21.5,15 25.5,15 22.3,17.5 23.5,21.5 20,19 16.5,21.5 17.7,17.5 14.5,15 18.5,15"
            className="fill-amber-300 stroke-none"
          />
          {/* Rice & Cotton arch */}
          <path d="M12 25 Q20 30 28 25" className="stroke-amber-200" strokeWidth="1.5" />
          {/* Ribbon */}
          <path d="M14 31 L20 29 L26 31" className="stroke-white" strokeWidth="1.5" />
        </svg>
      </div>

      <div>
        <div className={`leading-tight text-slate-900 tracking-tight ${current.text}`}>
          Desa Adimulya
        </div>
        {showSubtitle && (
          <div className={`text-slate-500 font-medium leading-tight ${current.sub}`}>
            Kec. Wanareja · Kab. Cilacap
          </div>
        )}
      </div>
    </div>
  );
};
