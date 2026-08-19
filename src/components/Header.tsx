import React from 'react';
import {
  Bell,
  Plus,
  Moon,
  Sun,
  Timer,
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

  return (
    <header
      className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs"
      id="app-header"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pomodoro Focus Timer Quick Button */}
          {onOpenPomodoro && (
            <button
              type="button"
              onClick={onOpenPomodoro}
              className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200/60 dark:border-indigo-800/60 transition-all active:scale-95 flex items-center gap-1.5"
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
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
              className="py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer appearance-none text-center"
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
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
            className="px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 active:scale-95"
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
