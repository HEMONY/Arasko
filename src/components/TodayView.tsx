import React, { useState } from 'react';
import {
  Plus,
  Flame,
  CheckCircle2,
  ListFilter,
  Search,
  SlidersHorizontal,
  Calendar as CalendarIcon,
  Sparkles,
  Trophy,
  Zap,
  Target,
  Eye,
  EyeOff,
  AlertCircle,
  X,
} from 'lucide-react';
import { LanguageCode, PriorityLevel, TaskCategory, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import { TaskCard } from './TaskCard';
import { CategoryIcon } from './CategoryIcon';

interface TodayViewProps {
  tasks: TaskItem[];
  categories: TaskCategory[];
  language: LanguageCode;
  onAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
  onToggleComplete: (task: TaskItem, e: React.MouseEvent) => void;
  streakCount: number;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  categories,
  language,
  onAddTask,
  onEditTask,
  onToggleComplete,
  streakCount,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks for Today (or recurring daily, or overdue still pending)
  const todayTasks = tasks.filter((task) => {
    if (task.isArchived) return false;
    const taskDate = task.dueDate ? task.dueDate.split('T')[0] : '';
    // Show if due today, or if recurrence is daily, or overdue not completed
    const isDueToday = taskDate === todayStr;
    const isDaily = task.recurrence === 'daily';
    const isOverduePending =
      task.status !== 'completed' && taskDate && taskDate < todayStr;

    return isDueToday || isDaily || isOverduePending;
  });

  // Calculate statistics
  const totalCount = todayTasks.length;
  const completedCount = todayTasks.filter((t) => t.status === 'completed').length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Apply focus mode, search, category, and priority filters
  const filteredTasks = todayTasks.filter((task) => {
    // Focus Mode: Strictly hide completed tasks and non-urgent items
    if (isFocusMode) {
      if (task.status === 'completed') return false;
      const isUrgentOrImportant = task.priority === 'urgent' || task.priority === 'important';
      const isOverdue = Boolean(task.dueDate && task.dueDate < todayStr);
      if (!isUrgentOrImportant && !isOverdue) return false;
    }

    if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchNotes = task.notes?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchNotes;
    }
    return true;
  });

  // Split into pending and completed
  const pendingTasks = filteredTasks.filter((t) => t.status !== 'completed');
  const completedTasksList = filteredTasks.filter((t) => t.status === 'completed');

  // Format localized today header
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

  return (
    <div className="space-y-5 pb-20 animate-fade-in" id="today-view-container">
      {/* Header Banner with Streak & Graphical Progress Bar */}
      <div
        className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-tr from-[#1E1B4B] via-[#312E81] to-[#6366F1] text-white shadow-floating-4k card-floating-4k"
        id="today-summary-banner"
      >
        {/* Background ambient shapes */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200 flex items-center gap-1">
                  <CalendarIcon size={13} /> {getFormattedDate()}
                </span>
                {/* Streak Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-xs">
                  <Flame size={14} className="text-amber-400 fill-amber-400 animate-pulse" />
                  <span>
                    {streakCount} {t.streakDays}
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {progressPercent === 100 && totalCount > 0 ? t.greatJobAllDone : t.todayProgress}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">
                {completedCount} / {totalCount} {t.tasksCompleted}
              </p>
            </div>

            {/* Radial Progress Gauge */}
            <div className="flex items-center gap-3 self-center sm:self-auto bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 transition-all duration-500"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-white">{progressPercent}%</span>
              </div>
              <div className="text-start">
                <span className="block text-[11px] text-indigo-200 uppercase font-semibold">
                  {t.completionRate}
                </span>
                <span className="text-sm font-bold text-white">
                  {totalCount - completedCount} {t.notStarted}
                </span>
              </div>
            </div>
          </div>

          {/* Graphical Accent Progress Bar */}
          <div className="pt-2 border-t border-white/10 space-y-1.5" id="today-graphical-progress-bar-container">
            <div className="flex items-center justify-between text-xs text-indigo-200 font-medium">
              <span className="flex items-center gap-1">
                <Sparkles size={13} className="text-amber-300" />
                {progressPercent === 100 && totalCount > 0 ? (
                  <span className="text-emerald-300 font-bold">{t.greatJobAllDone}</span>
                ) : (
                  <span>{progressPercent}% {language === 'ar' ? 'مكتمل من مهام اليوم' : 'of today completed'}</span>
                )}
              </span>
              <span className="text-[11px] font-bold text-white/90">
                {completedCount} / {totalCount}
              </span>
            </div>

            {/* Glowing tactile progress bar */}
            <div className="relative h-3.5 w-full bg-black/25 rounded-full overflow-hidden p-0.5 border border-white/15 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-sm transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${Math.max(totalCount > 0 ? progressPercent : 0, 0)}%` }}
                id="today-progress-bar-fill"
              >
                {/* Light shimmer animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Mode Banner (when active) */}
      {isFocusMode && (
        <div
          className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-400/40 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 shadow-floating-4k card-floating-4k animate-fade-in"
          id="focus-mode-active-banner"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-floating-4k shrink-0">
              <Zap size={18} className="fill-current animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black flex items-center gap-2">
                <span>{t.focusModeActive}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold">
                  {pendingTasks.length} {language === 'ar' ? 'مهام ذات أولوية' : 'high priority'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                {t.focusModeHint}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFocusMode(false)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-floating-4k"
            id="exit-focus-mode-btn"
          >
            <X size={13} />
            <span>{t.exitFocusMode}</span>
          </button>
        </div>
      )}

      {/* Quick Filter, Search & Focus Mode Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute top-3 right-3 text-slate-400 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full py-2.5 px-9 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-floating-4k"
            id="today-search-input"
          />
        </div>

        {/* Focus Mode Toggle Button */}
        <button
          type="button"
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center gap-2 border shadow-floating-4k card-floating-4k ${
            isFocusMode
              ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
          id="focus-mode-toggle-btn"
          title={t.focusModeDesc}
        >
          <Zap
            size={15}
            className={isFocusMode ? 'fill-white text-white' : 'text-amber-500'}
          />
          <span>{t.focusMode}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              isFocusMode
                ? 'bg-white/25 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {isFocusMode ? (language === 'ar' ? 'مفعّل' : 'ON') : (language === 'ar' ? 'إيقاف' : 'OFF')}
          </span>
        </button>

        {/* Priority Filter (Hidden or disabled styling in focus mode for clarity) */}
        {!isFocusMode && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['all', 'urgent', 'important', 'normal'].map((p) => {
              const isSel = selectedPriority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPriority(p)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-floating-4k ${
                    isSel
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p === 'all' ? t.filterAll : t[p as PriorityLevel]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors shadow-floating-4k ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.filterAll} ({isFocusMode ? pendingTasks.length : todayTasks.length})
        </button>
        {categories.map((cat) => {
          const isSel = selectedCategory === cat.id;
          const count = todayTasks.filter((t) => t.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                isSel
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              <span>{cat.name[language] || cat.name.en}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                {isFocusMode && <Zap size={13} className="text-amber-500 fill-amber-500" />}
                {isFocusMode ? (language === 'ar' ? 'المهام العاجلة قيد التركيز' : 'Focus Priority Tasks') : t.today} ({pendingTasks.length})
              </span>
            </h3>
            <div className="space-y-2.5">
              {pendingTasks.map((task) => (
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
          </div>
        )}

        {/* Completed Tasks Section (Hidden in Focus Mode) */}
        {!isFocusMode && completedTasksList.length > 0 && (
          <div className="space-y-2.5 pt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>
                {t.completed} ({completedTasksList.length})
              </span>
            </h3>
            <div className="space-y-2">
              {completedTasksList.map((task) => (
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
          </div>
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {isFocusMode ? <Zap size={24} className="text-amber-500" /> : <Sparkles size={24} />}
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {isFocusMode
                ? t.focusModeEmpty
                : searchQuery
                ? t.noTasksFound
                : t.noTasksToday}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {isFocusMode
                ? (language === 'ar' ? 'يمكنك إيقاف وضع التركيز أو إضافة مهمة جديدة ذات أولوية عاجلة.' : 'You can exit Focus Mode or add a new urgent task.')
                : searchQuery
                ? ''
                : t.appTagline}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              {isFocusMode && (
                <button
                  type="button"
                  onClick={() => setIsFocusMode(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  {t.exitFocusMode}
                </button>
              )}
              <button
                type="button"
                onClick={onAddTask}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
                id="today-empty-add-btn"
              >
                <Plus size={15} /> {t.addNewTask}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
