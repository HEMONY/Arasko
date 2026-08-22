import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDurationMs = 900,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, minDurationMs);

    const finishTimer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, minDurationMs + 350);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [minDurationMs, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] text-white transition-opacity duration-300 pointer-events-none select-none ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      id="arasko-splash-screen"
    >
      {/* Background Radial Midnight Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/40 via-[#030712]/90 to-[#020617] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered High-Resolution Arasko Logo & Branding */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative mb-5 transform transition-transform duration-500 hover:scale-105">
          {/* Outer Ambient Glowing Aura */}
          <div className="absolute -inset-3 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-3xl blur-2xl opacity-50 animate-pulse pointer-events-none" />
          
          <Logo size="xl" showText={false} variant="gradient" />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-sky-300">
          Arasko
        </h1>

        {/* Arabic Subtitle / Slogan */}
        <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-300 tracking-wide font-arabic">
          رفيقك اليومي للإنتاجية والتركيز
        </p>

        {/* Dynamic Loading Progress Bar */}
        <div className="mt-8 w-36 sm:w-44 h-1.5 rounded-full bg-slate-800/80 border border-blue-950 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700 rounded-full animate-[shimmer_1.5s_infinite_ease-in-out] w-full" />
        </div>

        {/* Discreet Version Tag */}
        <span className="mt-6 text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">
          v2.0 • 4K HDR Ultra-Fidelity • Offline Ready
        </span>
      </div>
    </div>
  );
};
