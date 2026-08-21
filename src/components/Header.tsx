import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Moon,
  Sun,
  Timer,
  Wifi,
  WifiOff,
  CloudOff,
  CheckCircle2,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { Logo } from './Logo';

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onAddTask: () => void;
  onOpenNotifications: () => void;
  onOpenPomodoro?: () => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  onAddTask,
  onOpenNotifications,
  onOpenPomodoro,
  unreadNotificationsCount,
}) => {
  const t = translations[language];

  // Network connectivity status detection
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [hasShownOfflineNotice, setHasShownOfflineNotice] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasShownOfflineNotice(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      setHasShownOfflineNotice(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-40 bg-white/90 dark:bg-[#060b17]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-blue-950/70 transition-colors shadow-xs"
      id="app-header"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Connectivity Indicator */}
        <div className="flex items-center gap-3">
          <Logo size="md" />

          {/* Visual Connectivity Status Indicator */}
          {!isOnline ? (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-xs backdrop-blur-sm animate-pulse cursor-help"
              title={t.offlineTooltip}
              id="header-offline-badge"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <WifiOff size={13} className="shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="font-bold">{t.offlineStatus}</span>
              <span className="text-[10px] font-semibold opacity-85 hidden sm:inline">
                ({language === 'ar' ? 'مخزن' : 'Cached'})
              </span>
            </div>
          ) : (
            <div
              className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 transition-opacity"
              title={t.onlineTooltip}
              id="header-online-badge"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <Wifi size={11} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px]">{t.onlineStatus}</span>
            </div>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pomodoro Focus Timer Quick Button */}
          {onOpenPomodoro && (
            <button
              type="button"
              onClick={onOpenPomodoro}
              className="p-2 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-900/60 transition-all active:scale-95 flex items-center gap-1.5"
              title={t.pomodoroTitle}
              id="header-pomodoro-btn"
            >
              <Timer size={18} className="stroke-[2.5]" />
              <span className="text-xs font-bold hidden md:inline">{t.pomodoro}</span>
            </button>
          )}

          {/* Quick Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title={isDarkMode ? t.themeLight : t.themeDark}
            id="header-theme-toggle-btn"
          >
            {isDarkMode ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} className="text-slate-600" />}
          </button>

          {/* Language Quick Switcher */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-blue-950/80 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer appearance-none text-center"
              id="header-lang-select"
            >
              <option value="ar">العربية</option>
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title={t.notificationsTray}
            id="notifications-bell-btn"
          >
            <Bell size={19} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
            )}
          </button>

          {/* Add Task Button */}
          <button
            type="button"
            onClick={onAddTask}
            className="px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all flex items-center gap-1.5 active:scale-95"
            id="header-add-task-btn"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">{t.addNewTask}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
