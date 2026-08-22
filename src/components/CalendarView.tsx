import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  Target,
  Trophy,
  BarChart3,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCheck,
  CalendarDays,
} from 'lucide-react';
import {
  CalendarSubView,
  LanguageCode,
  TaskCategory,
  TaskItem,
} from '../types';
import { translations } from '../i18n/translations';
import { TaskCard } from './TaskCard';
import { AraskoMark } from './Logo';
import { ColorPaletteService } from '../services/colorPalette';

interface CalendarViewProps {
  tasks: TaskItem[];
  categories: TaskCategory[];
  language: LanguageCode;
  onAddTaskForDate: (dateStr: string) => void;
  onEditTask: (task: TaskItem) => void;
  onToggleComplete: (task: TaskItem, e: React.MouseEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  categories,
  language,
  onAddTaskForDate,
  onEditTask,
  onToggleComplete,
}) => {
  const t = translations[language];
  const [subView, setSubView] = useState<CalendarSubView>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [activeQuarterFilter, setActiveQuarterFilter] = useState<'all' | 'q1' | 'q2' | 'q3' | 'q4' | 'milestones'>('all');
  const [selectedYearlyMonth, setSelectedYearlyMonth] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handlePrevYear = () => {
    setCurrentDate(new Date(year - 1, month, 1));
  };

  const handleNextYear = () => {
    setCurrentDate(new Date(year + 1, month, 1));
  };

  // Generate days for the monthly grid
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Arabic vs Latin week day labels
  const weekDaysAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDaysFr = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const weekDayLabels = language === 'ar' ? weekDaysAr : language === 'fr' ? weekDaysFr : weekDaysEn;

  const monthName = currentDate.toLocaleDateString(
    language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US',
    { month: 'long', year: 'numeric' }
  );

  // Month grid day cells
  const monthCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    monthCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
    monthCells.push({ dayNumber: d, dateStr });
  }

  // Filter tasks for selected day in monthly view
  const selectedDayTasks = tasks.filter((task) => {
    if (task.isArchived) return false;
    const taskDate = task.dueDate ? task.dueDate.split('T')[0] : '';
    const isDaily = task.recurrence === 'daily';
    return taskDate === selectedDate || isDaily;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Yearly Aggregates & Analytics
  const yearTasks = tasks.filter((task) => {
    if (task.isArchived) return false;
    if (task.recurrence === 'yearly' || task.recurrence === 'monthly' || task.recurrence === 'daily') return true;
    return task.dueDate && task.dueDate.startsWith(`${year}-`);
  });

  const completedYearTasks = yearTasks.filter((t) => t.status === 'completed');
  const completionRate = yearTasks.length > 0
    ? Math.round((completedYearTasks.length / yearTasks.length) * 100)
    : 0;

  const urgentYearTasks = yearTasks.filter((t) => t.priority === 'urgent');
  const importantYearTasks = yearTasks.filter((t) => t.priority === 'important');

  // 12 Months Data computation
  const monthsData = Array.from({ length: 12 }).map((_, mIdx) => {
    const monthDate = new Date(year, mIdx, 1);
    const mNameLong = monthDate.toLocaleDateString(
      language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US',
      { month: 'long' }
    );
    const mNameShort = monthDate.toLocaleDateString(
      language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US',
      { month: 'short' }
    );
    const daysInM = new Date(year, mIdx + 1, 0).getDate();
    const firstDay = new Date(year, mIdx, 1).getDay();
    const mPad = (mIdx + 1).toString().padStart(2, '0');

    const mTasks = tasks.filter((t) => {
      if (t.isArchived) return false;
      if (t.recurrence === 'daily') return true;
      if (t.recurrence === 'monthly') return true;
      return t.dueDate && t.dueDate.startsWith(`${year}-${mPad}`);
    });

    const completedCount = mTasks.filter((t) => t.status === 'completed').length;
    const urgentCount = mTasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed').length;
    const progress = mTasks.length > 0 ? Math.round((completedCount / mTasks.length) * 100) : 0;
    const quarterIndex = Math.floor(mIdx / 3) + 1; // 1, 2, 3, 4

    return {
      index: mIdx,
      nameLong: mNameLong,
      nameShort: mNameShort,
      daysCount: daysInM,
      firstDay,
      pad: mPad,
      tasks: mTasks,
      totalCount: mTasks.length,
      completedCount,
      urgentCount,
      progress,
      quarterIndex,
    };
  });

  // Category distribution for this year
  const categoryStats = categories.map((cat) => {
    const catTasks = yearTasks.filter((t) => t.categoryId === cat.id);
    const catCompleted = catTasks.filter((t) => t.status === 'completed').length;
    const catPercent = yearTasks.length > 0 ? Math.round((catTasks.length / yearTasks.length) * 100) : 0;
    return {
      ...cat,
      taskCount: catTasks.length,
      completedCount: catCompleted,
      percent: catPercent,
    };
  }).filter((c) => c.taskCount > 0).sort((a, b) => b.taskCount - a.taskCount);

  // Filtered annual milestones / long-term goals
  const annualMilestones = tasks.filter((task) => {
    if (task.isArchived) return false;

    if (activeQuarterFilter === 'milestones') {
      return task.recurrence === 'yearly' || task.priority === 'urgent' || (task.subTasks && task.subTasks.length >= 3);
    }
    if (activeQuarterFilter === 'q1') {
      return task.dueDate && (task.dueDate.startsWith(`${year}-01`) || task.dueDate.startsWith(`${year}-02`) || task.dueDate.startsWith(`${year}-03`));
    }
    if (activeQuarterFilter === 'q2') {
      return task.dueDate && (task.dueDate.startsWith(`${year}-04`) || task.dueDate.startsWith(`${year}-05`) || task.dueDate.startsWith(`${year}-06`));
    }
    if (activeQuarterFilter === 'q3') {
      return task.dueDate && (task.dueDate.startsWith(`${year}-07`) || task.dueDate.startsWith(`${year}-08`) || task.dueDate.startsWith(`${year}-09`));
    }
    if (activeQuarterFilter === 'q4') {
      return task.dueDate && (task.dueDate.startsWith(`${year}-10`) || task.dueDate.startsWith(`${year}-11`) || task.dueDate.startsWith(`${year}-12`));
    }

    // Default 'all'
    return (
      task.recurrence === 'yearly' ||
      task.recurrence === 'monthly' ||
      task.priority === 'urgent' ||
      (task.dueDate && task.dueDate.startsWith(`${year}-`))
    );
  });

  return (
    <div className="space-y-5 pb-20 animate-fade-in" id="calendar-view-container">
      {/* Sub-view switcher (Monthly / Yearly) & Year Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setSubView('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-floating-4k flex items-center gap-1.5 ${
              subView === 'monthly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="subview-monthly-btn"
          >
            <CalendarIcon size={14} />
            {t.monthlyView}
          </button>
          <button
            type="button"
            onClick={() => setSubView('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-floating-4k flex items-center gap-1.5 ${
              subView === 'yearly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="subview-yearly-btn"
          >
            <Layers size={14} />
            {t.yearlyView}
          </button>
        </div>

        {/* Month/Year Navigation Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
            {subView === 'monthly' ? monthName : `${year}`}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={subView === 'monthly' ? handlePrevMonth : handlePrevYear}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title={subView === 'monthly' ? t.prevMonth : t.prevYear}
              id="calendar-prev-btn"
            >
              <ChevronLeft size={16} className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={subView === 'monthly' ? handleNextMonth : handleNextYear}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title={subView === 'monthly' ? t.nextMonth : t.nextYear}
              id="calendar-next-btn"
            >
              <ChevronRight size={16} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MONTHLY VIEW                                                          */}
      {/* ========================================================================= */}
      {subView === 'monthly' && (
        <div className="space-y-4">
          {/* Calendar Grid Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k">
            {/* Weekdays header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {weekDayLabels.map((w, idx) => (
                <div
                  key={idx}
                  className="text-[11px] font-bold text-slate-400 dark:text-slate-500 py-1"
                >
                  {w}
                </div>
              ))}
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {monthCells.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="h-10 sm:h-12 rounded-xl" />;
                }

                const isToday = cell.dateStr === todayStr;
                const isSelected = cell.dateStr === selectedDate;

                // Day tasks count & status
                const dayTasks = tasks.filter((task) => {
                  if (task.isArchived) return false;
                  return (
                    (task.dueDate && task.dueDate.split('T')[0] === cell.dateStr) ||
                    task.recurrence === 'daily'
                  );
                });

                const hasCompleted = dayTasks.some((t) => t.status === 'completed');
                const hasPending = dayTasks.some((t) => t.status !== 'completed');
                const hasUrgent = dayTasks.some((t) => t.priority === 'urgent');

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(cell.dateStr)}
                    className={`h-11 sm:h-13 rounded-2xl p-1 flex flex-col items-center justify-between transition-all relative ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 scale-102 ring-2 ring-blue-500/40'
                        : isToday
                        ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-sky-200 font-bold'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    id={`cal-cell-${cell.dateStr}`}
                  >
                    <span className="text-xs">{cell.dayNumber}</span>

                    {/* Dots indicator */}
                    {dayTasks.length > 0 && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {hasUrgent && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-rose-300' : 'bg-rose-500'
                            }`}
                          />
                        )}
                        {hasPending && !hasUrgent && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-amber-300' : 'bg-amber-500'
                            }`}
                          />
                        )}
                        {hasCompleted && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-emerald-300' : 'bg-emerald-500'
                            }`}
                          />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Task Drawer */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t.tasksOnDate}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {selectedDate} {selectedDate === todayStr && `(${t.today})`}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onAddTaskForDate(selectedDate)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                id="cal-add-date-task-btn"
              >
                <Plus size={14} /> {t.addNewTask}
              </button>
            </div>

            {/* List */}
            {selectedDayTasks.length > 0 ? (
              <div className="space-y-2.5">
                {selectedDayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={categories.find((c) => c.id === task.categoryId)}
                    language={language}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEditTask}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                <CalendarIcon size={28} className="mx-auto mb-2 opacity-50" />
                <p>{t.noTasksThisDay}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ENHANCED YEARLY VIEW (12 Months Heatmap, Distribution & Milestones)      */}
      {/* ========================================================================= */}
      {subView === 'yearly' && (
        <div className="space-y-5 animate-fade-in" id="yearly-view-content">
          {/* Annual Executive Summary Header Card */}
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-tr from-[#020617] via-[#09152e] to-[#122852] text-white shadow-floating-4k card-floating-4k border border-blue-500/25">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-inner">
                    <AraskoMark size={24} variant="gradient" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                      {t.annualStats} • {year}
                    </h2>
                    <p className="text-xs text-blue-200/80 font-medium">
                      {t.yearlyDistribution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onAddTaskForDate(`${year}-01-01`)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    id="add-yearly-milestone-btn"
                  >
                    <Plus size={14} />
                    {t.addNewTask}
                  </button>
                </div>
              </div>

              {/* High-level KPI Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] text-blue-200/70 font-semibold block mb-1">
                    {t.totalAnnualTasks}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-white">{yearTasks.length}</span>
                    <span className="text-[10px] text-slate-300">
                      {t.tasksCompleted.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] text-emerald-300/80 font-semibold block mb-1">
                    {t.annualCompletionRate}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-emerald-400">{completionRate}%</span>
                    <span className="text-[10px] text-emerald-200/70">({completedYearTasks.length}/{yearTasks.length})</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] text-rose-300/80 font-semibold block mb-1">
                    {t.urgent}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-rose-400">{urgentYearTasks.length}</span>
                    <span className="text-[10px] text-rose-200/70">{t.tasksCompleted.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] text-amber-300/80 font-semibold block mb-1">
                    {t.important}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-amber-400">{importantYearTasks.length}</span>
                    <span className="text-[10px] text-amber-200/70">{t.tasksCompleted.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Annual Completion Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-200">
                  <span>{t.annualCompletionRate}</span>
                  <span className="font-bold text-white">{completedYearTasks.length} / {yearTasks.length} ({completionRate}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.max(completionRate, 3)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 12 Months Interactive Calendar Matrix Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CalendarDays size={18} className="text-blue-600 dark:text-sky-400" />
                  {t.yearlyDistribution} ({year})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'ar' ? 'انقر على أي شهر لاستعراض مهامه والتنقل المباشر له' : 'Click any month to inspect tasks and switch views.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> {t.urgent}
                </div>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> {t.inProgress}
                </div>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> {t.completed}
                </div>
              </div>
            </div>

            {/* 12-Month Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {monthsData.map((m) => {
                const isCurrentCalendarMonth = new Date().getFullYear() === year && new Date().getMonth() === m.index;
                const isSelectedForDrawer = selectedYearlyMonth === m.index;

                return (
                  <div
                    key={m.index}
                    onClick={() => setSelectedYearlyMonth(selectedYearlyMonth === m.index ? null : m.index)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-floating-4k card-floating-4k ${
                      isSelectedForDrawer
                        ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/40 dark:bg-blue-950/40'
                        : isCurrentCalendarMonth
                        ? 'border-blue-400 dark:border-blue-700 bg-white dark:bg-[#0b162f]'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                    id={`yearly-month-card-${m.index + 1}`}
                  >
                    <div>
                      {/* Month Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {m.nameLong}
                          </span>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            Q{m.quarterIndex}
                          </span>
                        </div>

                        <span className={`text-[11px] font-bold ${
                          m.progress === 100 && m.totalCount > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {m.completedCount}/{m.totalCount}
                        </span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3">
                        <div
                          className="h-full rounded-full bg-blue-600 dark:bg-sky-400"
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>

                      {/* Mini 28-31 Day Heatmap Matrix */}
                      <div className="grid grid-cols-7 gap-1 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        {Array.from({ length: m.firstDay }).map((_, i) => (
                          <div key={`empty-${i}`} className="w-full aspect-square" />
                        ))}
                        {Array.from({ length: m.daysCount }).map((_, dayIndex) => {
                          const dayNum = dayIndex + 1;
                          const dayStr = `${year}-${m.pad}-${dayNum.toString().padStart(2, '0')}`;
                          const dayTasks = tasks.filter((tk) => !tk.isArchived && tk.dueDate && tk.dueDate.startsWith(dayStr));

                          const hasUrgent = dayTasks.some((tk) => tk.priority === 'urgent');
                          const hasCompleted = dayTasks.some((tk) => tk.status === 'completed');
                          const hasPending = dayTasks.some((tk) => tk.status !== 'completed');

                          let dotColor = 'bg-slate-200/80 dark:bg-slate-800 text-slate-400 dark:text-slate-600';
                          if (hasUrgent) {
                            dotColor = 'bg-rose-500 text-white font-bold shadow-xs';
                          } else if (hasPending) {
                            dotColor = 'bg-amber-500 text-white font-bold';
                          } else if (hasCompleted) {
                            dotColor = 'bg-emerald-500 text-white font-bold';
                          }

                          return (
                            <div
                              key={dayIndex}
                              className={`w-full aspect-square rounded-md text-[9px] flex items-center justify-center transition-transform hover:scale-125 ${dotColor}`}
                              title={`${dayStr}: ${dayTasks.length} tasks`}
                            >
                              {dayTasks.length > 0 ? dayTasks.length : ''}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Button to Switch to Month */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {m.tasks.length} {t.tasksCompleted.split(' ')[0]}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDate(new Date(year, m.index, 1));
                          setSubView('monthly');
                        }}
                        className="text-[11px] font-bold text-blue-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                      >
                        {t.viewMonthTasks} <ArrowRight size={12} className="rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Month Task Drawer (if clicked) */}
            {selectedYearlyMonth !== null && (
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900/60 mt-4 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <CheckCheck size={16} className="text-blue-600 dark:text-sky-400" />
                    {monthsData[selectedYearlyMonth].nameLong} ({year}) - {monthsData[selectedYearlyMonth].tasks.length} {t.tasksCompleted.split(' ')[0]}
                  </h4>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentDate(new Date(year, selectedYearlyMonth, 1));
                      setSubView('monthly');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    {t.viewMonthTasks}
                  </button>
                </div>

                {monthsData[selectedYearlyMonth].tasks.length > 0 ? (
                  <div className="space-y-2">
                    {monthsData[selectedYearlyMonth].tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        category={categories.find((c) => c.id === task.categoryId)}
                        language={language}
                        onToggleComplete={onToggleComplete}
                        onEdit={onEditTask}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-3 text-center">
                    {t.noTasksThisDay}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Annual Task Category Allocation Breakdown */}
          {categoryStats.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-600 dark:text-sky-400" />
                {language === 'ar' ? 'توزيع مهام السنة حسب التصنيفات' : 'Annual Category Distribution'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categoryStats.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {cat.name[language] || cat.name.en}
                      </span>
                      <span className="text-[11px] font-black text-blue-600 dark:text-sky-400">
                        {cat.percent}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 dark:bg-sky-400"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{cat.taskCount} {t.tasksCompleted.split(' ')[0]}</span>
                      <span>{cat.completedCount} {t.completed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High-Level Milestones & Annual Goals Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" />
                {t.annualMilestones} ({year})
              </h3>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
                  { id: 'milestones', label: language === 'ar' ? 'الأهداف الكبرى' : 'Major Goals' },
                  { id: 'q1', label: 'Q1' },
                  { id: 'q2', label: 'Q2' },
                  { id: 'q3', label: 'Q3' },
                  { id: 'q4', label: 'Q4' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveQuarterFilter(f.id as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      activeQuarterFilter === f.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {annualMilestones.length > 0 ? (
                annualMilestones.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={categories.find((c) => c.id === task.categoryId)}
                    language={language}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEditTask}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                  <Target size={28} className="mx-auto mb-2 opacity-50" />
                  <p>{language === 'ar' ? 'لا توجد أهداف سنوية في هذا القسم حالياً.' : 'No annual milestones recorded for this period.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
