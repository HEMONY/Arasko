import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gradient' | 'monochrome' | 'icon-only';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'gradient',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', text: 'text-lg', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', text: 'text-xl', sub: 'text-xs' },
    lg: { box: 'w-14 h-14', text: 'text-2xl', sub: 'text-sm' },
    xl: { box: 'w-20 h-20', text: 'text-3xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="arasko-logo-container">
      {/* Logo Icon Mark */}
      <div
        className={`relative ${currentSize.box} rounded-2xl flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-105 ${
          variant === 'monochrome'
            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-700'
            : 'bg-gradient-to-tr from-[#1E1B4B] via-[#4338CA] to-[#7C3AED] text-white shadow-indigo-500/20'
        }`}
        id="arasko-logo-badge"
      >
        {/* Geometric Stylized 'A' merged with upward checkmark/progress arrow */}
        <svg
          viewBox="0 0 100 100"
          className="w-[68%] h-[68%]"
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

          {/* Upward Ascending Progress Checkmark (Integrated Right Leg + Crossbar) */}
          <path
            d="M34 56H64L76 22"
            stroke={variant === 'monochrome' ? 'currentColor' : '#34D399'}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Arrow Tip Dot / Sparkle of achievement */}
          <circle
            cx="76"
            cy="22"
            r="4.5"
            fill={variant === 'monochrome' ? 'currentColor' : '#F59E0B'}
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
                : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 dark:from-white dark:via-indigo-100 dark:to-indigo-300'
            } ${currentSize.text}`}
          >
            Arasko
          </span>
          <span className={`text-slate-500 dark:text-slate-400 font-medium ${currentSize.sub}`}>
            أراسكو
          </span>
        </div>
      )}
    </div>
  );
};
