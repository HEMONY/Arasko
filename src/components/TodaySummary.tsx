import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';
import { LanguageCode, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import { AraskoMark } from './Logo';

interface TodaySummaryProps {
  tasks: TaskItem[];
  todayTasks: TaskItem[];
  language: LanguageCode;
}

export interface HeatMapDay {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  dayName: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4; // 0=none, 1=low, 2=medium, 3=high, 4=max
  isToday: boolean;
  isFuture: boolean;
}

/**
 * Pure streak calculation algorithm using current date and completedAt timestamps of task items
 */
export function calculateCurrentStreak(tasks: TaskItem[], referenceDate = new Date()): number {
  const completedDateSet = new Set<string>();

  tasks.forEach((task) => {
    if (task.isArchived) return;

    if (task.completedAt) {
      const datePart = task.completedAt.split('T')[0];
      if (datePart) completedDateSet.add(datePart);
    } else if (task.status === 'completed' && task.dueDate) {
      const datePart = task.dueDate.split('T')[0];
      if (datePart) completedDateSet.add(datePart);
    }
  });

  if (completedDateSet.size === 0) return 0;

  const formatDateKey = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayKey = formatDateKey(referenceDate);
  const yesterday = new Date(referenceDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  let streak = 0;
  let checkCursor = new Date(referenceDate);

  if (completedDateSet.has(todayKey)) {
    // Today has completed tasks -> count backwards starting today
    while (true) {
      const key = formatDateKey(checkCursor);
      if (completedDateSet.has(key)) {
        streak++;
        checkCursor.setDate(checkCursor.getDate() - 1);
      } else {
        break;
      }
    }
  } else if (completedDateSet.has(yesterdayKey)) {
    // Today has not yet had completed tasks, but yesterday was completed -> streak holds unbroken
    checkCursor = new Date(yesterday);
    while (true) {
      const key = formatDateKey(checkCursor);
      if (completedDateSet.has(key)) {
        streak++;
        checkCursor.setDate(checkCursor.getDate() - 1);
      } else {
        break;
      }
    }
  } else {
    streak = 0;
  }

  return streak;
}

/**
 * Calculates the longest streak achieved in task history
 */
export function calculateLongestStreak(tasks: TaskItem[]): number {
  const completedDateSet = new Set<string>();

  tasks.forEach((task) => {
    if (task.isArchived) return;
    if (task.completedAt) {
      const datePart = task.completedAt.split('T')[0];
      if (datePart) completedDateSet.add(datePart);
    } else if (task.status === 'completed' && task.dueDate) {
      const datePart = task.dueDate.split('T')[0];
      if (datePart) completedDateSet.add(datePart);
    }
  });

  if (completedDateSet.size === 0) return 0;

  const sortedDates = Array.from(completedDateSet).sort();
  let maxStreak = 0;
  let currentStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const currentDate = new Date(y, m - 1, d);

    if (prevDate) {
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
    prevDate = currentDate;
  }

  return maxStreak;
}

export const TodaySummary: React.FC<TodaySummaryProps> = ({
  tasks,
  todayTasks,
  language,
}) => {
  const t = translations[language];
  const [activeViewMode, setActiveViewMode] = useState<'ring' | 'heatmap' | 'both'>('both');
  const [selectedHeatMapDay, setSelectedHeatMapDay] = useState<HeatMapDay | null>(null);

  // Dynamic calculations based on tasks and completedAt timestamps
  const {
    totalCount,
    completedCount,
    pendingCount,
    inProgressCount,
    completionRate,
    streakCount,
    longestStreak,
  } = useMemo(() => {
    const total = todayTasks.length;
    const completed = todayTasks.filter((t) => t.status === 'completed').length;
    const inProgress = todayTasks.filter((t) => t.status === 'in_progress').length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const streak = calculateCurrentStreak(tasks, new Date());
    const longest = calculateLongestStreak(tasks);

    return {
      totalCount: total,
      completedCount: completed,
      pendingCount: pending,
      inProgressCount: inProgress,
      completionRate: rate,
      streakCount: streak,
      longestStreak: longest,
    };
  }, [tasks, todayTasks]);

  // 30-Day Heat-Map Data Generator
  const { heatMapDays, activeDays30, total30DayCompleted, consistencyRate30 } = useMemo(() => {
    const map: { [dateStr: string]: number } = {};

    tasks.forEach((t) => {
      if (t.isArchived) return;
      if (t.completedAt) {
        const d = t.completedAt.split('T')[0];
        if (d) map[d] = (map[d] || 0) + 1;
      } else if (t.status === 'completed' && t.dueDate) {
        const d = t.dueDate.split('T')[0];
        if (d) map[d] = (map[d] || 0) + 1;
      }
    });

    const days: HeatMapDay[] = [];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;

    let totalComp = 0;

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      const count = map[dateStr] || 0;
      totalComp += count;

      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 5) intensity = 4;
      else if (count >= 3) intensity = 3;
      else if (count >= 2) intensity = 2;
      else if (count >= 1) intensity = 1;

      days.push({
        date: dateStr,
        dayOfMonth: d.getDate(),
        dayName: d.toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US', {
          weekday: 'short',
        }),
        count,
        intensity,
        isToday: dateStr === todayStr,
        isFuture: false,
      });
    }

    const activeDaysCount = days.filter((d) => d.count > 0).length;
    const consistencyRate = Math.round((activeDaysCount / 30) * 100);

    return {
      heatMapDays: days,
      activeDays30: activeDaysCount,
      total30DayCompleted: totalComp,
      consistencyRate30: consistencyRate,
    };
  }, [tasks, language]);

  const getFormattedDate = () => {
    const d = new Date();
    return d.toLocaleDateString(
      language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US',
      {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }
    );
  };

  // Motivational caption based on completion rate
  const getMotivationalMessage = () => {
    if (totalCount === 0) {
      return language === 'ar'
        ? 'لا توجد مهام مجدولة لليوم. استمتع بيومك أو أضف مهاماً جديدة!'
        : language === 'fr'
        ? 'Aucune tâche aujourd\'hui. Profitez de votre journée ou ajoutez de nouveaux objectifs !'
        : 'No tasks scheduled for today. Enjoy your day or add new goals!';
    }
    if (completionRate === 100) {
      return language === 'ar'
        ? '🎉 إنجاز أسطوري! أنهيت جميع مهام اليوم بنجاح باهر.'
        : language === 'fr'
        ? '🎉 Bravo ! Vous avez terminé toutes les tâches aujourd\'hui.'
        : '🎉 Legendary! You have accomplished all tasks today.';
    }
    if (completionRate >= 75) {
      return language === 'ar'
        ? '⚡ اقتربت جداً من إنهاء كافة أهداف اليوم، واصل التألق!'
        : language === 'fr'
        ? '⚡ Vous y êtes presque ! Continuez sur cette belle lancée.'
        : '⚡ Almost there! Finishing strong on your daily goals.';
    }
    if (completionRate >= 50) {
      return language === 'ar'
        ? '🚀 تقدم ممتاز! أنجزت أكثر من نصف المهام.'
        : language === 'fr'
        ? '🚀 Excellent progrès ! Plus de la moitié est complétée.'
        : '🚀 Great momentum! More than halfway done.';
    }
    if (completionRate > 0) {
      return language === 'ar'
        ? '🌱 بداية موفقة! خطوة بعد خطوة نحو إنجاز اليوم.'
        : language === 'fr'
        ? '🌱 Bon début ! Pas à pas vers l\'accomplissement de la journée.'
        : '🌱 Nice start! Step by step towards finishing today.';
    }
    return language === 'ar'
      ? '🎯 جاهز للبدء؟ حوّل خططك إلى إنجازات واقعية.'
      : language === 'fr'
      ? '🎯 Prêt à démarrer ? Transformez vos plans en réussites.'
      : '🎯 Ready to begin? Turn your plans into reality.';
  };

  // Intensity Styling Map for Heat-Map Cells
  const getIntensityStyles = (intensity: 0 | 1 | 2 | 3 | 4, isToday: boolean) => {
    switch (intensity) {
      case 4:
        return 'bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-400/40 border-emerald-300';
      case 3:
        return 'bg-emerald-500/90 text-white font-bold shadow-xs shadow-emerald-500/25 border-emerald-400/70';
      case 2:
        return 'bg-emerald-600/70 text-emerald-100 font-semibold border-emerald-500/40';
      case 1:
        return 'bg-emerald-700/45 text-emerald-200 border-emerald-600/30';
      case 0:
      default:
        return isToday
          ? 'bg-indigo-900/60 text-indigo-300 border-indigo-400 ring-2 ring-indigo-400/50'
          : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10';
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-tr from-[#161338] via-[#24205B] to-[#3B349E] text-white shadow-floating-4k card-floating-4k select-none border border-indigo-500/20"
      id="today-summary-component"
    >
      {/* 3D Ambient Specular Lighting Effects */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* TOP BAR: Date + Streak Pill + View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                <CalendarIcon size={13} className="text-indigo-300" />
                <span>{getFormattedDate()}</span>
              </span>

              {/* Dynamic Streak Badge based on completedAt timestamps */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-xs backdrop-blur-xs"
                title={language === 'ar' ? 'أيام الإنجاز المتتالية' : 'Consecutive Completion Streak'}
                id="today-summary-streak-badge"
              >
                <Flame size={14} className="text-amber-400 fill-amber-400 animate-pulse" />
                <span>
                  {streakCount} {t.streakDays}
                </span>
              </div>

              {/* Consistency Pill */}
              <div
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold"
                title={language === 'ar' ? 'نسبة الاستمرارية لآخر 30 يوماً' : '30-Day Consistency Score'}
              >
                <TrendingUp size={12} className="text-emerald-400" />
                <span>{consistencyRate30}% {language === 'ar' ? 'استمرارية' : 'Consistency'}</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 pt-0.5">
              <span>{completionRate === 100 && totalCount > 0 ? t.greatJobAllDone : t.todayProgress}</span>
            </h2>

            <p className="text-xs sm:text-sm text-indigo-200 font-medium">
              {getMotivationalMessage()}
            </p>
          </div>

          {/* View Mode Toggle Switch (Ring / Both / HeatMap) */}
          <div className="flex items-center bg-black/30 backdrop-blur-md p-1 rounded-2xl border border-white/10 text-xs self-stretch sm:self-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={() => setActiveViewMode('ring')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeViewMode === 'ring'
                  ? 'bg-white/20 text-white shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'حلقة اليوم' : 'Ring'}
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('both')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeViewMode === 'both'
                  ? 'bg-white/20 text-white shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'الكل' : 'Overview'}
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('heatmap')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeViewMode === 'heatmap'
                  ? 'bg-white/20 text-white shadow-xs'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'خريطة 30 يوماً' : '30-Day Map'}
            </button>
          </div>
        </div>

        {/* SECTION 1: 3D DUAL PROGRESS RING & METRICS DISPLAY */}
        {(activeViewMode === 'ring' || activeViewMode === 'both') && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center pt-2">
            {/* 3D Visual Progress Ring Card */}
            <div className="sm:col-span-5 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-sm flex items-center justify-center gap-4">
              {/* SVG 3D Concentric Rings */}
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="ringGradToday" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="50%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                    <linearGradient id="ringGradConsistency" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>

                  {/* Outer Track: Consistency (30 days) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="5"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#ringGradConsistency)"
                    strokeWidth="5"
                    strokeDasharray={`${Math.round((consistencyRate30 / 100) * 264)}, 264`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out opacity-80"
                  />

                  {/* Inner Track: Today's Completion */}
                  <circle
                    cx="50"
                    cy="50"
                    r="32"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.18)"
                    strokeWidth="7"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="32"
                    fill="none"
                    stroke="url(#ringGradToday)"
                    strokeWidth="7"
                    strokeDasharray={`${Math.round((completionRate / 100) * 201)}, 201`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-md"
                  />
                </svg>

                {/* Inner Center Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-black text-white leading-none">
                    {completionRate}%
                  </span>
                  <span className="text-[9px] font-bold text-emerald-300 mt-0.5">
                    {completedCount}/{totalCount}
                  </span>
                </div>
              </div>

              {/* Ring Legend & Task Breakdown */}
              <div className="space-y-1 text-start">
                <div>
                  <span className="block text-[10px] text-indigo-200 uppercase font-bold tracking-wider">
                    {t.todayProgress}
                  </span>
                  <span className="text-xs font-black text-white flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    {completedCount} / {totalCount} {t.completed}
                  </span>
                </div>

                <div className="pt-1">
                  <span className="block text-[10px] text-indigo-200 uppercase font-bold tracking-wider">
                    {language === 'ar' ? 'الاستمرارية (30 يوم)' : '30-Day Consistency'}
                  </span>
                  <span className="text-xs font-black text-indigo-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                    {consistencyRate30}% ({activeDays30}/30 {language === 'ar' ? 'يوم نشط' : 'active days'})
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="sm:col-span-7 grid grid-cols-3 gap-2">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
                <div className="text-[10px] uppercase font-bold text-indigo-200 truncate">
                  {t.completed}
                </div>
                <div className="text-lg sm:text-xl font-black text-emerald-300 mt-0.5">
                  {completedCount}
                </div>
                <div className="text-[10px] text-emerald-200/80 font-medium">
                  {completionRate}% {t.completionRate}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
                <div className="text-[10px] uppercase font-bold text-indigo-200 truncate">
                  {t.notStarted}
                </div>
                <div className="text-lg sm:text-xl font-black text-amber-300 mt-0.5">
                  {pendingCount}
                </div>
                <div className="text-[10px] text-amber-200/80 font-medium">
                  {inProgressCount} {t.inProgress}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
                <div className="text-[10px] uppercase font-bold text-indigo-200 truncate">
                  {t.streakDays}
                </div>
                <div className="text-lg sm:text-xl font-black text-orange-300 mt-0.5 flex items-center justify-center gap-1">
                  <Flame size={16} className="fill-current text-amber-400" />
                  <span>{streakCount}</span>
                </div>
                <div className="text-[10px] text-indigo-200 font-medium truncate">
                  {language === 'ar' ? `الأفضل: ${longestStreak}` : `Best: ${longestStreak}d`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: 30-DAY CALENDAR HEAT-MAP GRID */}
        {(activeViewMode === 'heatmap' || activeViewMode === 'both') && (
          <div
            className="p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 space-y-3 shadow-inner"
            id="today-summary-30day-heatmap"
          >
            {/* Heatmap Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon size={14} className="text-indigo-300" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-100">
                  {language === 'ar' ? 'خريطة إنجازات الـ 30 يوماً الماضية' : '30-Day Activity Heat-Map'}
                </h4>
              </div>

              {/* Quick Heatmap Stats */}
              <div className="flex items-center gap-3 text-[11px] font-semibold text-indigo-200">
                <span className="flex items-center gap-1">
                  <Trophy size={12} className="text-amber-400" />
                  <span>{total30DayCompleted} {language === 'ar' ? 'مهمة منجزة' : 'tasks done'}</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Award size={12} className="text-emerald-400" />
                  <span>{activeDays30}/30 {language === 'ar' ? 'يوماً نشطاً' : 'days active'}</span>
                </span>
              </div>
            </div>

            {/* 30 Days Interactive Grid (6 Columns x 5 Rows on mobile, or 10 Columns x 3 Rows on desktop) */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 sm:gap-2">
              {heatMapDays.map((day, idx) => {
                const isSelected = selectedHeatMapDay?.date === day.date;
                const styleClasses = getIntensityStyles(day.intensity, day.isToday);

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedHeatMapDay(isSelected ? null : day)}
                    className={`relative p-2 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${styleClasses} ${
                      isSelected ? 'ring-2 ring-white scale-105 z-10' : 'hover:scale-105'
                    }`}
                    title={`${day.date} (${day.dayName}): ${day.count} ${language === 'ar' ? 'مهام منجزة' : 'tasks completed'}`}
                  >
                    <span className="text-[11px] font-mono leading-none">
                      {day.dayOfMonth}
                    </span>
                    <span className="text-[8px] font-medium opacity-80 mt-0.5 leading-none">
                      {day.dayName}
                    </span>

                    {/* Today indicator dot */}
                    {day.isToday && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-indigo-950 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Micro Details Bar (if tapped) */}
            {selectedHeatMapDay && (
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 flex items-center justify-between text-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">
                    {selectedHeatMapDay.date} ({selectedHeatMapDay.dayName}):
                  </span>
                  <span className="text-emerald-300 font-semibold">
                    {selectedHeatMapDay.count > 0
                      ? `${selectedHeatMapDay.count} ${language === 'ar' ? 'مهمة منجزة بنجاح' : 'tasks completed'}`
                      : language === 'ar'
                      ? 'لا توجد مهام منجزة في هذا اليوم'
                      : 'No tasks completed on this day'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHeatMapDay(null)}
                  className="text-white/70 hover:text-white text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white/10"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Heat-Map Legend */}
            <div className="flex items-center justify-between text-[10px] text-indigo-200/80 pt-1 border-t border-white/10">
              <span>{language === 'ar' ? 'أقل نشاطاً' : 'Less active'}</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-white/10 border border-white/10" title="0" />
                <span className="w-3 h-3 rounded-md bg-emerald-700/45 border border-emerald-600/30" title="1-2" />
                <span className="w-3 h-3 rounded-md bg-emerald-600/70 border border-emerald-500/40" title="2-3" />
                <span className="w-3 h-3 rounded-md bg-emerald-500/90 border border-emerald-400/70" title="3-4" />
                <span className="w-3 h-3 rounded-md bg-emerald-400 border border-emerald-300" title="5+" />
              </div>
              <span>{language === 'ar' ? 'أكثر نشاطاً (5+ مهام)' : 'More active (5+)'}</span>
            </div>
          </div>
        )}

        {/* Dynamic Horizontal Progress Bar */}
        <div className="pt-2 border-t border-white/10 space-y-1.5" id="today-summary-progress-bar">
          <div className="flex items-center justify-between text-xs text-indigo-200 font-medium">
            <span className="flex items-center gap-1.5">
              <AraskoMark size={15} variant="white" />
              <span>
                {completionRate}% {language === 'ar' ? 'معدل إنجاز اليوم' : 'completion rate'}
              </span>
            </span>
            <span className="text-[11px] font-bold text-white/90">
              {pendingCount} {t.notStarted}
            </span>
          </div>

          <div className="relative h-2.5 w-full bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/15 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-sm transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${Math.max(totalCount > 0 ? completionRate : 0, 0)}%` }}
              id="today-summary-progress-fill"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
