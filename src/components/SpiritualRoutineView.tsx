import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Moon,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
  Volume2,
  X,
} from 'lucide-react';
import { AppSettings, LanguageCode, SpiritualDailyLog, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import {
  DAILY_ATHKAR_LIST,
  DailyAthkarItem,
  QURAN_DAILY_WARDS,
  QuranWard,
} from '../data/spiritualData';
import { playAlertSound, triggerVibration } from '../services/soundEngine';
import { fireTaskDoneConfetti } from '../utils/confetti';

interface SpiritualRoutineViewProps {
  settings: AppSettings;
  language: LanguageCode;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onAddTasksToToday: (tasks: Partial<TaskItem>[]) => void;
}

export const SpiritualRoutineView: React.FC<SpiritualRoutineViewProps> = ({
  settings,
  language,
  onUpdateSettings,
  onAddTasksToToday,
}) => {
  const t = translations[language];
  const todayStr = new Date().toISOString().split('T')[0];

  // Daily log state for today
  const dailyLogs: Record<string, SpiritualDailyLog> = settings.spiritualDailyLogs || {};
  const todayLog: SpiritualDailyLog = dailyLogs[todayStr] || {
    date: todayStr,
    completedSurahs: [],
    completedAthkar: [],
    overallCompleted: false,
  };

  const tasbihCounters = settings.spiritualTasbihCounters || {};

  // Active reading modal
  const [selectedSurah, setSelectedSurah] = useState<QuranWard | null>(null);
  const [selectedCategoryAthkar, setSelectedCategoryAthkar] = useState<
    'waking' | 'morning' | 'evening' | 'sleeping' | 'all'
  >('all');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [isRemindersExpanded, setIsRemindersExpanded] = useState<boolean>(false);

  // Defaults for spiritual reminders
  const defaultReminderTimes: Record<string, string> = {
    ward_fajr_yasin: '05:30',
    ward_dhuhr_waqiah: '12:45',
    ward_asr_rahman: '16:00',
    ward_maghrib_dukhan: '18:30',
    ward_isha_mulk: '20:15',
    athkar_waking: '06:00',
    athkar_morning: '07:00',
    athkar_evening: '17:00',
    athkar_sleeping: '22:00',
  };

  const spiritualItemReminders = settings.spiritualItemReminders || {};
  const spiritualReminderTimes = settings.spiritualReminderTimes || {};

  const handleToggleGlobalReminders = (enabled: boolean) => {
    onUpdateSettings({
      ...settings,
      spiritualRemindersEnabled: enabled,
    });
  };

  const handleToggleItemReminder = (itemId: string, enabled: boolean) => {
    onUpdateSettings({
      ...settings,
      spiritualItemReminders: {
        ...(settings.spiritualItemReminders || {}),
        [itemId]: enabled,
      },
    });
  };

  const handleChangeItemTime = (itemId: string, time: string) => {
    onUpdateSettings({
      ...settings,
      spiritualReminderTimes: {
        ...(settings.spiritualReminderTimes || {}),
        [itemId]: time,
      },
    });
  };

  const handleTestNotificationSound = () => {
    playAlertSound(settings.soundChoice || 'chime');
    if (settings.vibrationEnabled) {
      triggerVibration(100);
    }
  };

  // Helper getters
  const getSurahName = (ward: QuranWard) => {
    if (language === 'en') return ward.surahNameEnglish;
    return ward.surahNameArabic;
  };

  const getSurahVirtue = (ward: QuranWard) => {
    if (language === 'en') return ward.virtueEnglish;
    return ward.virtueArabic;
  };

  const getCategoryLabel = (cat: 'waking' | 'morning' | 'evening' | 'sleeping' | string) => {
    switch (cat) {
      case 'waking':
        return t.wakingAthkar;
      case 'morning':
        return t.morningAthkar;
      case 'evening':
        return t.eveningAthkar;
      case 'sleeping':
        return t.sleepingAthkar;
      default:
        return t.athkarTitle;
    }
  };

  // Calculate Progress
  const totalItems = QURAN_DAILY_WARDS.length + DAILY_ATHKAR_LIST.length;
  const completedCount =
    (todayLog.completedSurahs?.length || 0) + (todayLog.completedAthkar?.length || 0);
  const progressPercent = Math.min(100, Math.round((completedCount / totalItems) * 100));

  // Toggle Surah Completion
  const handleToggleSurah = (surahId: string) => {
    triggerVibration([30]);
    const completed = todayLog.completedSurahs || [];
    const isCompleted = completed.includes(surahId);
    const updatedSurahs = isCompleted
      ? completed.filter((id) => id !== surahId)
      : [...completed, surahId];

    if (!isCompleted && updatedSurahs.length + (todayLog.completedAthkar?.length || 0) >= totalItems) {
      fireTaskDoneConfetti();
    }

    const updatedTodayLog: SpiritualDailyLog = {
      ...todayLog,
      completedSurahs: updatedSurahs,
      overallCompleted:
        updatedSurahs.length === QURAN_DAILY_WARDS.length &&
        (todayLog.completedAthkar?.length || 0) === DAILY_ATHKAR_LIST.length,
    };

    onUpdateSettings({
      ...settings,
      spiritualDailyLogs: {
        ...dailyLogs,
        [todayStr]: updatedTodayLog,
      },
    });
  };

  // Toggle Athkar Category Completion
  const handleToggleAthkarItem = (athkarId: string) => {
    triggerVibration([25]);
    const completed = todayLog.completedAthkar || [];
    const isCompleted = completed.includes(athkarId);
    const updatedAthkar = isCompleted
      ? completed.filter((id) => id !== athkarId)
      : [...completed, athkarId];

    if (!isCompleted && (todayLog.completedSurahs?.length || 0) + updatedAthkar.length >= totalItems) {
      fireTaskDoneConfetti();
    }

    const updatedTodayLog: SpiritualDailyLog = {
      ...todayLog,
      completedAthkar: updatedAthkar,
      overallCompleted:
        (todayLog.completedSurahs?.length || 0) === QURAN_DAILY_WARDS.length &&
        updatedAthkar.length === DAILY_ATHKAR_LIST.length,
    };

    onUpdateSettings({
      ...settings,
      spiritualDailyLogs: {
        ...dailyLogs,
        [todayStr]: updatedTodayLog,
      },
    });
  };

  // Tasbih Increment
  const handleIncrementTasbih = (athkar: DailyAthkarItem) => {
    triggerVibration([15]);
    const currentCount = tasbihCounters[athkar.id] || 0;
    const newCount = currentCount + 1;

    const newCounters = {
      ...tasbihCounters,
      [athkar.id]: newCount,
    };

    let updatedAthkar = todayLog.completedAthkar || [];
    if (newCount >= athkar.repeatCount && !updatedAthkar.includes(athkar.id)) {
      triggerVibration([40, 50, 40]);
      updatedAthkar = [...updatedAthkar, athkar.id];
    }

    const updatedTodayLog: SpiritualDailyLog = {
      ...todayLog,
      completedAthkar: updatedAthkar,
    };

    onUpdateSettings({
      ...settings,
      spiritualTasbihCounters: newCounters,
      spiritualDailyLogs: {
        ...dailyLogs,
        [todayStr]: updatedTodayLog,
      },
    });
  };

  // Reset Tasbih for item
  const handleResetTasbih = (athkarId: string) => {
    triggerVibration([20]);
    const newCounters = { ...tasbihCounters, [athkarId]: 0 };
    onUpdateSettings({
      ...settings,
      spiritualTasbihCounters: newCounters,
    });
  };

  // Bulk add routine to Today's Tasks
  const handleBulkAddToTasks = () => {
    triggerVibration([40]);
    const tasksToAdd: Partial<TaskItem>[] = [
      ...QURAN_DAILY_WARDS.map((ward) => ({
        title: `${ward.prayerName[language] || ward.prayerName.ar}: ${getSurahName(ward)}`,
        description: `${getSurahVirtue(ward)} (${ward.totalVerses} ${language === 'ar' ? 'آية' : 'verses'})`,
        priority: 'important' as const,
        status: todayLog.completedSurahs?.includes(ward.id) ? ('completed' as const) : ('not_started' as const),
        dueDate: `${todayStr}T12:00`,
        recurrence: 'daily' as const,
      })),
      ...DAILY_ATHKAR_LIST.map((ath) => ({
        title: `${getCategoryLabel(ath.category)}: ${ath.title[language] || ath.title.ar}`,
        description: ath.arabicText,
        priority: 'normal' as const,
        status: todayLog.completedAthkar?.includes(ath.id) ? ('completed' as const) : ('not_started' as const),
        dueDate: `${todayStr}T08:00`,
        recurrence: 'daily' as const,
      })),
    ];

    onAddTasksToToday(tasksToAdd);
    setCopiedNotification(t.addedToTasksSuccess || 'تمت إضافة الروتين إلى مهام اليوم بنجاح!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const filteredAthkar =
    selectedCategoryAthkar === 'all'
      ? DAILY_ATHKAR_LIST
      : DAILY_ATHKAR_LIST.filter((a) => a.category === selectedCategoryAthkar);

  return (
    <div className="space-y-6 pb-20 animate-fade-in" id="spiritual-routine-view">
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-950 p-5 sm:p-6 text-white border border-indigo-500/20 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles size={13} className="text-emerald-400" />
              <span>{t.spiritualTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-arabic">
              {language === 'ar' ? 'الورد القرآني والأذكار المأثورة' : t.spiritualTitle}
            </h2>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              {t.spiritualDesc}
            </p>
          </div>

          {/* Add to Today Tasks CTA */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkAddToTasks}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
              id="add-spiritual-to-tasks-btn"
            >
              <Plus size={16} />
              <span>{t.addToTodayTasks}</span>
            </button>
          </div>
        </div>

        {/* Daily Progress Gauge */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-black text-sm text-emerald-300">
              {progressPercent}%
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{t.todaySpiritualProgress}</span>
                {progressPercent === 100 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-normal">
                    {t.allSpiritualDone}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-300">
                {completedCount} / {totalItems} {t.completedSpiritualItems}
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Spiritual Reminders & Audio Notifications Center */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BellRing size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{t.spiritualRemindersTitle}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                  {settings.spiritualRemindersEnabled !== false ? (language === 'ar' ? 'مفعل' : 'Active') : (language === 'ar' ? 'معطل' : 'Off')}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'ar' 
                  ? 'تنبيهات تلقائية بأوراد السور الخمس بعد الصلوات المكتوبة وأذكار اليوم المباركة' 
                  : 'Automatic reminders for the 5 Quranic surahs after daily prayers and daily Athkar'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestNotificationSound}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
              title={t.testSpiritualSound}
            >
              <Volume2 size={14} />
              <span className="hidden sm:inline">{t.testSpiritualSound}</span>
            </button>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.spiritualRemindersEnabled !== false}
                onChange={(e) => handleToggleGlobalReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>

            <button
              type="button"
              onClick={() => setIsRemindersExpanded(!isRemindersExpanded)}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              aria-label="Toggle reminder settings"
            >
              {isRemindersExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {/* Expandable detailed reminders configurator */}
        {isRemindersExpanded && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 1. Quran Wards Reminders */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen size={14} className="text-indigo-500" />
                <span>{t.quranWardReminders}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {QURAN_DAILY_WARDS.map((ward) => {
                  const isEnabled = spiritualItemReminders[ward.id] !== false;
                  const reminderTime = spiritualReminderTimes[ward.id] || defaultReminderTimes[ward.id] || '06:00';
                  return (
                    <div
                      key={ward.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                        isEnabled
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => handleToggleItemReminder(ward.id, e.target.checked)}
                          className="rounded-md text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {getSurahName(ward)}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {ward.prayerName[language] || ward.prayerName.ar}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Clock size={12} className="text-slate-400" />
                        <input
                          type="time"
                          value={reminderTime}
                          onChange={(e) => handleChangeItemTime(ward.id, e.target.value)}
                          disabled={!isEnabled}
                          className="px-1.5 py-0.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Daily Athkar Reminders */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>{t.dailyAthkarReminders}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { id: 'athkar_waking', title: t.wakingAthkar, timeKey: 'athkar_waking', defaultTime: '06:00', icon: Sun },
                  { id: 'athkar_morning', title: t.morningAthkar, timeKey: 'athkar_morning', defaultTime: '07:00', icon: Sun },
                  { id: 'athkar_evening', title: t.eveningAthkar, timeKey: 'athkar_evening', defaultTime: '17:00', icon: Moon },
                  { id: 'athkar_sleeping', title: t.sleepingAthkar, timeKey: 'athkar_sleeping', defaultTime: '22:00', icon: Moon },
                ].map((item) => {
                  const isEnabled = spiritualItemReminders[item.id] !== false;
                  const reminderTime = spiritualReminderTimes[item.id] || item.defaultTime;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                        isEnabled
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => handleToggleItemReminder(item.id, e.target.checked)}
                          className="rounded-md text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                        />
                        <div className="min-w-0 flex items-center gap-1.5">
                          <Icon size={13} className="text-amber-500 shrink-0" />
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {item.title}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Clock size={12} className="text-slate-400" />
                        <input
                          type="time"
                          value={reminderTime}
                          onChange={(e) => handleChangeItemTime(item.id, e.target.value)}
                          disabled={!isEnabled}
                          className="px-1.5 py-0.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: The 5 Scheduled Quran Wards */}
      <div className="space-y-3" id="quran-wards-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.quranWardsTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.quranWardsSubtitle}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {todayLog.completedSurahs?.length || 0} / {QURAN_DAILY_WARDS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {QURAN_DAILY_WARDS.map((ward) => {
            const isRead = todayLog.completedSurahs?.includes(ward.id);
            return (
              <div
                key={ward.id}
                className={`group relative rounded-2xl border p-4 transition-all ${
                  isRead
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/40 shadow-xs'
                    : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-sm'
                }`}
                id={`ward-card-${ward.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Prayer & Surah details */}
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleSurah(ward.id)}
                      className={`mt-0.5 shrink-0 rounded-full transition-transform active:scale-90 cursor-pointer ${
                        isRead
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500 hover:text-emerald-600'
                      }`}
                      title={isRead ? t.undoComplete : t.markSurahRead}
                    >
                      {isRead ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white dark:text-slate-950" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                          {ward.prayerName[language] || ward.prayerName.ar}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock size={11} />
                          {ward.prayerTiming}
                        </span>
                      </div>

                      <h4
                        className={`text-base font-bold font-arabic leading-snug ${
                          isRead
                            ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {getSurahName(ward)}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {getSurahVirtue(ward)}
                      </p>
                    </div>
                  </div>

                  {/* Open Surah Reader Button */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {ward.totalVerses} {language === 'ar' ? 'آية' : 'Ayahs'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedSurah(ward)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 transition-colors cursor-pointer"
                      id={`read-surah-btn-${ward.id}`}
                    >
                      <BookOpen size={13} />
                      <span>{t.readSurah}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Daily Athkar Routine & Electronic Tasbih */}
      <div className="space-y-3 pt-4" id="daily-athkar-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.athkarTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.spiritualDesc}
              </p>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all', label: t.filterAll },
              { id: 'waking', label: t.wakingAthkar },
              { id: 'morning', label: t.morningAthkar },
              { id: 'evening', label: t.eveningAthkar },
              { id: 'sleeping', label: t.sleepingAthkar },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setSelectedCategoryAthkar(
                    cat.id as 'waking' | 'morning' | 'evening' | 'sleeping' | 'all'
                  )
                }
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategoryAthkar === cat.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Athkar Cards List */}
        <div className="space-y-3">
          {filteredAthkar.map((athkar) => {
            const count = tasbihCounters[athkar.id] || 0;
            const isCompleted =
              todayLog.completedAthkar?.includes(athkar.id) || count >= athkar.repeatCount;

            return (
              <div
                key={athkar.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40'
                    : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-sm'
                }`}
                id={`athkar-card-${athkar.id}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                        {getCategoryLabel(athkar.category)}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {athkar.title[language] || athkar.title.ar}
                      </span>
                    </div>

                    {/* Arabic Text Display */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                      <p className="text-sm sm:text-base font-arabic text-slate-900 dark:text-slate-100 leading-relaxed text-right">
                        "{athkar.arabicText}"
                      </p>
                    </div>

                    {/* Virtue / Translation */}
                    {athkar.rewardOrVirtue && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {t.virtueLabel}:{' '}
                        </span>
                        {athkar.rewardOrVirtue[language] || athkar.rewardOrVirtue.ar}
                      </p>
                    )}
                  </div>

                  {/* Interactive Tasbih Counter Button */}
                  <div className="shrink-0 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleIncrementTasbih(athkar)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-black transition-all active:scale-90 shadow-md cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-gradient-to-br from-indigo-600 to-emerald-600 text-white shadow-indigo-500/20 hover:opacity-95'
                        }`}
                        title={t.tasbihCounter}
                        id={`tasbih-btn-${athkar.id}`}
                      >
                        <span className="text-base sm:text-lg leading-none">
                          {count}
                        </span>
                        <span className="text-[10px] opacity-80 mt-0.5">
                          / {athkar.repeatCount}
                        </span>
                      </button>

                      {count > 0 && (
                        <button
                          type="button"
                          onClick={() => handleResetTasbih(athkar.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 active:scale-95 cursor-pointer"
                          title="إعادة تصفير العداد"
                        >
                          <RotateCcw size={14} />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleAthkarItem(athkar.id)}
                      className={`text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                        isCompleted
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check size={14} />
                          <span>{t.surahCompleted}</span>
                        </>
                      ) : (
                        <span>{language === 'ar' ? 'تحديد كمنجز' : 'Mark done'}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL SURAH READER MODAL */}
      {selectedSurah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
            id="quran-reader-modal"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {selectedSurah.prayerName[language] || selectedSurah.prayerName.ar}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedSurah.totalVerses} {language === 'ar' ? 'آية' : 'Ayahs'}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-arabic text-slate-900 dark:text-slate-100">
                  {getSurahName(selectedSurah)}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSurah(null)}
                className="p-2 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                id="close-reader-modal-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Ayahs Content */}
            <div className="p-6 overflow-y-auto space-y-4 font-arabic text-right leading-loose">
              {/* Bismillah */}
              {selectedSurah.surahNumber !== 9 && (
                <div className="text-center py-2 text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
                </div>
              )}

              {/* Surah Text with Ayahs */}
              <div className="p-4 sm:p-6 rounded-2xl bg-amber-50/40 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-loose space-y-3">
                {selectedSurah.arabicText.map((paragraph, idx) => (
                  <p key={idx} className="leading-loose">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Virtue Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                <span className="font-bold">{t.virtueLabel}: </span>
                {getSurahVirtue(selectedSurah)}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedSurah(null)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t.closeSurah}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleSurah(selectedSurah.id);
                  setSelectedSurah(null);
                }}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                id="complete-surah-modal-btn"
              >
                <CheckCircle2 size={16} />
                <span>
                  {todayLog.completedSurahs?.includes(selectedSurah.id)
                    ? t.undoComplete
                    : t.markSurahRead}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
