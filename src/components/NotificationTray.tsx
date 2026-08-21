import React from 'react';
import {
  Bell,
  X,
  Trash2,
  Volume2,
  Droplet,
  Moon,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { LanguageCode, LocalNotificationAlert } from '../types';
import { translations } from '../i18n/translations';

interface NotificationTrayProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: LocalNotificationAlert[];
  onClearAll: () => void;
  onTestNotification: () => void;
  language: LanguageCode;
}

export const NotificationTray: React.FC<NotificationTrayProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onTestNotification,
  language,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'water':
        return <Droplet size={14} className="text-cyan-500" />;
      case 'sleep':
        return <Moon size={14} className="text-sky-500" />;
      case 'workout':
        return <Dumbbell size={14} className="text-emerald-500" />;
      case 'assistant':
        return <Sparkles size={14} className="text-amber-500" />;
      default:
        return <Clock size={14} className="text-blue-500" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-4 bg-slate-950/40 backdrop-blur-xs animate-fade-in"
      id="notification-tray-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-floating-4k card-floating-4k overflow-hidden mt-12 flex flex-col max-h-[80vh]"
        id="notification-tray-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-blue-600 dark:text-sky-400" />
            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {t.notificationsTray} ({notifications.length})
            </h3>
          </div>

          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                title={t.clearAll}
              >
                <Trash2 size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                  {getIcon(alert.type)}
                  <span>{alert.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-snug">
                {alert.body}
              </p>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              <CheckCircle2 size={24} className="mx-auto mb-1.5 text-emerald-500 opacity-80" />
              <p>{t.noNotifications}</p>
            </div>
          )}
        </div>

        {/* Test Alert Button */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onTestNotification}
            className="w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Volume2 size={13} /> {t.testNotification}
          </button>
        </div>
      </div>
    </div>
  );
};
