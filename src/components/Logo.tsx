import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gradient' | 'monochrome' | 'icon-only';
  showText?: boolean;
  className?: string;
}

/**
 * Standalone Arasko 3D Vector Brand Mark
 */
export const AraskoMark: React.FC<{
  size?: number | string;
  className?: string;
  variant?: 'gradient' | 'emerald' | 'white';
}> = ({ size = 20, className = '', variant = 'gradient' }) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      style={{ width: pixelSize, height: pixelSize }}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 inline-block drop-shadow-sm transition-transform ${className}`}
    >
      <defs>
        <linearGradient id="araskoMarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="araskoEmeraldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>

      {/* Stylized Left Leg 'A' */}
      <path
        d="M26 80L44 24C45.2 20.5 48.8 20.5 50 24L58 48"
        stroke={variant === 'white' ? 'currentColor' : 'url(#araskoMarkGrad)'}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Upward Ascending Progress Checkmark */}
      <path
        d="M34 56H64L76 22"
        stroke={variant === 'white' ? '#34D399' : 'url(#araskoEmeraldGrad)'}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Precision Spark of Achievement */}
      <circle
        cx="76"
        cy="22"
        r="5"
        fill={variant === 'white' ? '#F59E0B' : '#F59E0B'}
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'gradient',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    xs: { box: 'w-6 h-6', text: 'text-sm', sub: 'text-[9px]' },
    sm: { box: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', text: 'text-xl', sub: 'text-xs' },
    lg: { box: 'w-14 h-14', text: 'text-2xl', sub: 'text-sm' },
    xl: { box: 'w-20 h-20', text: 'text-3xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="arasko-logo-container">
      {/* 3D 4K Logo Icon Mark */}
      <div
        className={`relative ${currentSize.box} rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 ${
          variant === 'monochrome'
            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-700'
            : 'bg-gradient-to-tr from-[#020617] via-[#0f1d40] to-[#1e40af] text-white shadow-blue-900/40 border border-blue-400/30'
        }`}
        id="arasko-logo-badge"
      >
        {/* Ambient 3D Specular Highlight Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 via-transparent to-black/30 pointer-events-none" />

        {/* Geometric Stylized 'A' merged with upward checkmark/progress arrow */}
        <svg
          viewBox="0 0 100 100"
          className="w-[70%] h-[70%] drop-shadow-md z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main A Left Leg */}
          <path
            d="M26 80L44 24C45.2 20.5 48.8 20.5 50 24L58 48"
            stroke="currentColor"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Upward Ascending Progress Checkmark */}
          <path
            d="M34 56H64L76 22"
            stroke={variant === 'monochrome' ? 'currentColor' : '#34D399'}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Golden Goal / Achievement Dot */}
          <circle
            cx="76"
            cy="22"
            r="4.5"
            fill={variant === 'monochrome' ? 'currentColor' : '#FBBF24'}
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-black tracking-tight font-sans bg-clip-text text-transparent ${
              variant === 'monochrome'
                ? 'text-slate-900 dark:text-white'
                : 'bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 dark:from-white dark:via-blue-100 dark:to-sky-300'
            } ${currentSize.text}`}
          >
            Arasko
          </span>
          <span className={`text-slate-500 dark:text-slate-400 font-bold ${currentSize.sub}`}>
            أراسكو
          </span>
        </div>
      )}
    </div>
  );
};
