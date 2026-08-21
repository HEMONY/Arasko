import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Heart,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { Logo } from './Logo';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  language: LanguageCode;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  language,
}) => {
  const t = translations[language];
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#030712] via-[#0f172a] to-[#1e3a8a] flex items-center justify-center text-white shadow-xl shadow-blue-950/40 border border-blue-900/40">
          <Logo size="lg" showText={false} variant="gradient" />
        </div>
      ),
      title: t.onboardingWelcomeTitle,
      desc: t.onboardingWelcomeDesc,
      tag: 'Arasko v1.0',
    },
    {
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center shadow-lg border border-blue-200 dark:border-blue-800/60">
          <Calendar size={38} />
        </div>
      ),
      title: t.onboardingPlanningTitle,
      desc: t.onboardingPlanningDesc,
      tag: 'Daily · Monthly · Yearly',
    },
    {
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-lg border border-sky-200 dark:border-sky-800/60">
          <Zap size={38} />
        </div>
      ),
      title: t.onboardingAssistantTitle,
      desc: t.onboardingAssistantDesc,
      tag: '100% Offline & Private',
    },
    {
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg border border-emerald-200 dark:border-emerald-800/60">
          <Heart size={38} />
        </div>
      ),
      title: t.onboardingHealthTitle,
      desc: t.onboardingHealthDesc,
      tag: 'Water · Sleep · Workouts',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      id="onboarding-modal-backdrop"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-floating-4k card-floating-4k relative flex flex-col items-center text-center space-y-6 overflow-hidden"
        id="onboarding-modal-content"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-blue-500/20 to-sky-500/0 rounded-full blur-3xl pointer-events-none" />

        {/* Skip button */}
        {currentSlide < slides.length - 1 && (
          <button
            type="button"
            onClick={onComplete}
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {t.skip}
          </button>
        )}

        {/* Slide Icon */}
        <div className="pt-4">{slide.icon}</div>

        {/* Content */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold">
            {slide.tag}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {slide.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            {slide.desc}
          </p>
        </div>

        {/* Dots Indicators */}
        <div className="flex items-center gap-2 pt-2">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-6 bg-blue-600'
                  : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="w-full flex items-center justify-between gap-3 pt-2">
          {currentSlide > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {language === 'ar' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          ) : (
            <div className="w-10" />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-1.5"
            id="onboarding-next-btn"
          >
            <span>{currentSlide === slides.length - 1 ? t.getStarted : t.next}</span>
            {currentSlide < slides.length - 1 && (
              <span className="rtl:rotate-180">
                <ChevronRight size={16} />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
