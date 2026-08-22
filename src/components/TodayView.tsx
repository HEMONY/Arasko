import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  CheckCircle2,
  Search,
  Zap,
  X,
  Layers,
  Timer,
  CheckSquare,
  Square,
  Archive,
  Trash2,
  AlertCircle,
  Send,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { LanguageCode, PriorityLevel, TaskCategory, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import { TaskCard } from './TaskCard';
import { CategoryIcon } from './CategoryIcon';
import { TodaySummary, calculateCurrentStreak } from './TodaySummary';
import { GoalMilestone } from './GoalMilestone';
import { TaskFocusSection } from './TaskFocusSection';
import { playAlertSound, triggerVibration } from '../services/soundEngine';
import { AraskoMark } from './Logo';

interface TodayViewProps {
  tasks: TaskItem[];
  categories: TaskCategory[];
  language: LanguageCode;
  onAddTask: () => void;
  onEditTask: (task: TaskItem) => void;
  onToggleComplete: (task: TaskItem, e?: React.MouseEvent) => void;
  onDeleteTask?: (taskId: string) => void;
  onStartPomodoro?: (task?: TaskItem) => void;
  onBatchUpdateTasks?: (taskIds: string[], update: Partial<TaskItem>) => void;
  onBatchDeleteTasks?: (taskIds: string[]) => void;
  onQuickAddTask?: (title: string, categoryId?: string, priority?: PriorityLevel) => void;
  userName?: string;
  userProfession?: string;
  userStudyTrack?: string;
  streakCount?: number;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  categories,
  language,
  onAddTask,
  onEditTask,
  onToggleComplete,
  onDeleteTask,
  onStartPomodoro,
  onBatchUpdateTasks,
  onBatchDeleteTasks,
  onQuickAddTask,
  userName,
  userProfession,
  userStudyTrack,
  streakCount,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Multi-Select Mode State
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState<boolean>(false);

  // Floating Quick Add State
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState<boolean>(false);
  const [quickTitle, setQuickTitle] = useState<string>('');
  const [quickCategory, setQuickCategory] = useState<string>(categories[0]?.id || 'cat_work');
  const [quickPriority, setQuickPriority] = useState<PriorityLevel>('normal');

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

  const completedTodayCount = todayTasks.filter((t) => t.status === 'completed').length;
  const totalTodayCount = todayTasks.length;
  const effectiveStreak = streakCount ?? calculateCurrentStreak(tasks);

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

  const handleCategorySelect = (catId: string) => {
    triggerVibration(15);
    setSelectedCategory(catId);
  };

  const handlePrioritySelect = (p: string) => {
    triggerVibration(15);
    setSelectedPriority(p);
  };

  const handleToggleFocusMode = () => {
    triggerVibration(25);
    setIsFocusMode((prev) => !prev);
  };

  // Multi-Select Handlers
  const toggleSelectMode = () => {
    triggerVibration(25);
    setIsSelectMode((prev) => !prev);
    setSelectedTaskIds([]);
    setShowPriorityDropdown(false);
  };

  const handleToggleSelectTask = (taskId: string) => {
    triggerVibration(15);
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    triggerVibration(20);
    const allFilteredIds = filteredTasks.map((t) => t.id);
    if (selectedTaskIds.length === allFilteredIds.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(allFilteredIds);
    }
  };

  const handleBulkComplete = () => {
    if (selectedTaskIds.length === 0 || !onBatchUpdateTasks) return;
    triggerVibration([40, 30, 40]);
    playAlertSound('chime');
    onBatchUpdateTasks(selectedTaskIds, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      overdueAlertTriggered: true,
    });
    setSelectedTaskIds([]);
    setIsSelectMode(false);
  };

  const handleBulkChangePriority = (p: PriorityLevel) => {
    if (selectedTaskIds.length === 0 || !onBatchUpdateTasks) return;
    triggerVibration(25);
    onBatchUpdateTasks(selectedTaskIds, { priority: p });
    setShowPriorityDropdown(false);
    setSelectedTaskIds([]);
    setIsSelectMode(false);
  };

  const handleBulkArchive = () => {
    if (selectedTaskIds.length === 0 || !onBatchUpdateTasks) return;
    triggerVibration(35);
    onBatchUpdateTasks(selectedTaskIds, { isArchived: true });
    setSelectedTaskIds([]);
    setIsSelectMode(false);
  };

  const handleBulkDelete = () => {
    if (selectedTaskIds.length === 0 || !onBatchDeleteTasks) return;
    triggerVibration([50, 40, 50]);
    onBatchDeleteTasks(selectedTaskIds);
    setSelectedTaskIds([]);
    setIsSelectMode(false);
  };

  // Quick Add Handler
  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    triggerVibration(20);
    playAlertSound('ping');
    if (onQuickAddTask) {
      onQuickAddTask(quickTitle.trim(), quickCategory, quickPriority);
    }
    setQuickTitle('');
    setIsQuickAddExpanded(false);
  };

  return (
    <div className="space-y-5 pb-28 animate-fade-in relative" id="today-view-container">
      {/* Header Area: Personalized Greeting with Role Badge (if set) */}
      {userName && (
        <div className="flex items-center justify-between px-1 py-0.5" id="user-personalized-greeting">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              {language === 'ar' ? `مرحباً، ${userName}` : `Welcome, ${userName}`} 🌟
            </span>
            {(userProfession || userStudyTrack) && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                {userProfession || userStudyTrack}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Goal Milestone Header Component */}
      <GoalMilestone
        completedCount={completedTodayCount}
        totalCount={totalTodayCount}
        language={language}
        streakCount={effectiveStreak}
      />

      {/* Task Focus Distribution Section */}
      <TaskFocusSection
        tasks={tasks}
        categories={categories}
        language={language}
      />

      {/* 1. Dynamic Summary Component */}
      <TodaySummary
        tasks={tasks}
        todayTasks={todayTasks}
        language={language}
      />

      {/* 2. Category-based Filtering Tabs (Work, Personal, Health, Spiritual, etc.) */}
      <div className="space-y-2 bg-white dark:bg-slate-900/90 p-3 sm:p-3.5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-floating-4k card-floating-4k" id="today-category-tabs-container">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-sky-400">
              <Filter size={13} />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'تصنيف المهام والتركيز' : language === 'fr' ? 'Catégories & Focus' : 'Category Focus Tabs'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Multi-Select Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleSelectMode}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all flex items-center gap-1.5 ${
                isSelectMode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-600 dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-950/50'
              }`}
              id="toggle-multi-select-btn"
            >
              <CheckSquare size={13} />
              <span>{isSelectMode ? (language === 'ar' ? 'إلغاء التحديد' : 'Cancel Select') : (language === 'ar' ? 'تحديد متعدد' : 'Multi-Select')}</span>
            </button>

            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => handleCategorySelect('all')}
                className="text-[11px] text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 font-bold underline"
              >
                {language === 'ar' ? 'إعادة ضبط' : 'Reset'}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Category Filter Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none snap-x" id="today-category-horizontal-chips">
          {/* "All" Tab */}
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`snap-start inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 shadow-xs shrink-0 border ${
              selectedCategory === 'all'
                ? 'bg-blue-600 border-blue-600 text-white shadow-blue-900/30 ring-2 ring-blue-500/20'
                : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="today-chip-all"
          >
            <Layers size={13} className={selectedCategory === 'all' ? 'text-white' : 'text-slate-400'} />
            <span>{t.filterAll}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                selectedCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {todayTasks.length}
            </span>
          </button>

          {/* Individual Category Tabs */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const countForCat = todayTasks.filter((t) => t.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`snap-start inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 shadow-xs shrink-0 border ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-sky-300 ring-2 ring-blue-500/20 shadow-blue-500/10'
                    : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
                id={`today-chip-${cat.id}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <CategoryIcon name={cat.icon} size={14} style={{ color: isSelected ? undefined : cat.color }} />
                <span>{cat.name[language] || cat.name.en}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isSelected
                      ? 'bg-blue-200/60 dark:bg-blue-900/80 text-blue-900 dark:text-sky-200'
                      : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {countForCat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Category Filter Feedback Indicator */}
        {selectedCategory !== 'all' && (
          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-blue-50/60 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700/50 text-[11px] animate-fade-in">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Filter size={12} className="text-blue-500" />
              <span>
                {language === 'ar' ? 'تصفية حسب:' : 'Filtered by:'}{' '}
                <strong className="text-blue-600 dark:text-sky-400 font-bold">
                  {categories.find((c) => c.id === selectedCategory)?.name[language] || selectedCategory}
                </strong>{' '}
                ({filteredTasks.length} {language === 'ar' ? 'مهام' : 'tasks'})
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className="text-xs text-blue-600 dark:text-sky-400 font-bold hover:underline"
            >
              {language === 'ar' ? 'إلغاء التصفية' : 'Clear filter'}
            </button>
          </div>
        )}
      </div>

      {/* Focus Mode Banner */}
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
            onClick={handleToggleFocusMode}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-floating-4k active:scale-95"
            id="exit-focus-mode-btn"
          >
            {t.exitFocusMode}
          </button>
        </div>
      )}

      {/* Multi-Select Floating Action Bar */}
      {isSelectMode && (
        <div
          className="sticky top-2 z-40 p-3 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 text-white border border-blue-500/30 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-2 animate-fade-in"
          id="multi-select-toolbar"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-1"
            >
              {selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0 ? (
                <>
                  <Square size={13} /> {language === 'ar' ? 'إلغاء الكل' : 'Deselect All'}
                </>
              ) : (
                <>
                  <CheckSquare size={13} /> {language === 'ar' ? 'تحديد الكل' : 'Select All'}
                </>
              )}
            </button>
            <span className="text-xs font-bold text-sky-300">
              ({selectedTaskIds.length} {language === 'ar' ? 'محددة' : 'selected'})
            </span>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-1.5">
            {/* Bulk Complete */}
            <button
              type="button"
              onClick={handleBulkComplete}
              disabled={selectedTaskIds.length === 0}
              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              title={language === 'ar' ? 'إكمال المحددة' : 'Complete Selected'}
            >
              <CheckCircle2 size={13} />
              <span className="hidden sm:inline">{language === 'ar' ? 'إكمال' : 'Complete'}</span>
            </button>

            {/* Change Priority dropdown trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                disabled={selectedTaskIds.length === 0}
                className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <AlertCircle size={13} />
                <span className="hidden sm:inline">{language === 'ar' ? 'الأولوية' : 'Priority'}</span>
                <ChevronDown size={11} />
              </button>

              {showPriorityDropdown && (
                <div className="absolute top-full mt-1 right-0 sm:left-0 z-50 p-1.5 rounded-xl bg-slate-800 border border-slate-700 shadow-xl min-w-[130px] space-y-1">
                  <button
                    type="button"
                    onClick={() => handleBulkChangePriority('urgent')}
                    className="w-full text-left rtl:text-right px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-950/60"
                  >
                    🔥 {t.urgent}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkChangePriority('important')}
                    className="w-full text-left rtl:text-right px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-300 hover:bg-amber-950/60"
                  >
                    ⭐ {t.important}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkChangePriority('normal')}
                    className="w-full text-left rtl:text-right px-2.5 py-1 rounded-lg text-xs font-semibold text-sky-300 hover:bg-blue-950/60"
                  >
                    ✓ {t.normal}
                  </button>
                </div>
              )}
            </div>

            {/* Bulk Archive */}
            <button
              type="button"
              onClick={handleBulkArchive}
              disabled={selectedTaskIds.length === 0}
              className="px-2.5 py-1 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              title={language === 'ar' ? 'أرشفة المحددة' : 'Archive Selected'}
            >
              <Archive size={13} />
              <span className="hidden sm:inline">{language === 'ar' ? 'أرشفة' : 'Archive'}</span>
            </button>

            {/* Bulk Delete */}
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={selectedTaskIds.length === 0}
              className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              title={language === 'ar' ? 'حذف المحددة' : 'Delete Selected'}
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">{language === 'ar' ? 'حذف' : 'Delete'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Search & Priority Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-8 rtl:pr-9 rtl:pl-8 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 shadow-floating-4k transition-all"
            id="today-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        {!isFocusMode && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['all', 'urgent', 'important', 'normal'].map((p) => {
              const isSel = selectedPriority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePrioritySelect(p)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 shadow-floating-4k ${
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

      {/* Tasks List */}
      <div className="space-y-4" id="today-tasks-container">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                {isFocusMode && <Zap size={13} className="text-amber-500 fill-amber-500" />}
                <span>
                  {isFocusMode
                    ? language === 'ar'
                      ? 'المهام العاجلة قيد التركيز'
                      : 'Focus Priority Tasks'
                    : t.today}{' '}
                  ({pendingTasks.length})
                </span>
              </h3>
            </div>
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {pendingTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.94,
                      y: 10,
                      transition: { duration: 0.22, ease: 'easeInOut' },
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 30,
                      mass: 0.8,
                    }}
                  >
                    <TaskCard
                      task={task}
                      category={categories.find((c) => c.id === task.categoryId)}
                      language={language}
                      onToggleComplete={onToggleComplete}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onStartPomodoro={onStartPomodoro}
                      isSelectMode={isSelectMode}
                      isSelected={selectedTaskIds.includes(task.id)}
                      onToggleSelect={handleToggleSelectTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Completed Tasks Section */}
        {!isFocusMode && completedTasksList.length > 0 && (
          <div className="space-y-2.5 pt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>
                {t.completed} ({completedTasksList.length})
              </span>
            </h3>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {completedTasksList.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.94,
                      y: 8,
                      transition: { duration: 0.2, ease: 'easeInOut' },
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 30,
                      mass: 0.8,
                    }}
                  >
                    <TaskCard
                      task={task}
                      category={categories.find((c) => c.id === task.categoryId)}
                      language={language}
                      onToggleComplete={onToggleComplete}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onStartPomodoro={onStartPomodoro}
                      isSelectMode={isSelectMode}
                      isSelected={selectedTaskIds.includes(task.id)}
                      onToggleSelect={handleToggleSelectTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty State */}
        <AnimatePresence mode="wait">
          {filteredTasks.length === 0 && (
            <motion.div
              key="today-empty-state"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center">
                {isFocusMode ? <Zap size={24} className="text-amber-500" /> : <AraskoMark size={26} variant="gradient" />}
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {isFocusMode
                  ? t.focusModeEmpty
                  : searchQuery
                  ? t.noTasksFound
                  : selectedCategory !== 'all'
                  ? language === 'ar'
                    ? 'لا توجد مهام في هذا التصنيف اليوم'
                    : 'No tasks in this category today'
                  : t.noTasksToday}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                {isFocusMode
                  ? language === 'ar'
                    ? 'يمكنك إيقاف وضع التركيز أو إضافة مهمة جديدة ذات أولوية عاجلة.'
                    : 'You can exit Focus Mode or add a new urgent task.'
                  : searchQuery
                  ? ''
                  : t.appTagline}
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                {isFocusMode && (
                  <button
                    type="button"
                    onClick={handleToggleFocusMode}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
                  >
                    {t.exitFocusMode}
                  </button>
                )}
                {selectedCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('all')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
                  >
                    {language === 'ar' ? 'عرض كافة التصنيفات' : 'View All Categories'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onAddTask}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
                  id="today-empty-add-btn"
                >
                  <Plus size={15} /> {t.addNewTask}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pinned Floating Quick Add Button (FAB) & Rapid Task Input */}
      <div className="fixed bottom-20 right-4 sm:right-6 rtl:right-auto rtl:left-4 sm:rtl:left-6 z-40" id="floating-quick-add-container">
        {isQuickAddExpanded ? (
          <form
            onSubmit={handleQuickAddSubmit}
            className="w-72 sm:w-80 p-3.5 rounded-3xl bg-slate-900/95 dark:bg-slate-900/95 text-white border border-blue-500/40 shadow-2xl backdrop-blur-xl animate-fade-in space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                <AraskoMark size={14} variant="gradient" className="shrink-0" />
                <span>{language === 'ar' ? 'إضافة مهمة سريعة' : 'Quick Add Task'}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickAddExpanded(false);
                    onAddTask();
                  }}
                  className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10"
                >
                  {language === 'ar' ? 'النموذج الكامل' : 'Full Modal'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsQuickAddExpanded(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder={language === 'ar' ? 'ما الذي تريد إنجازه؟...' : 'What needs to be done?...'}
                autoFocus
                className="w-full pl-3 pr-10 rtl:pr-3 rtl:pl-10 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={!quickTitle.trim()}
                className="absolute right-1.5 rtl:right-auto rtl:left-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all"
              >
                <Send size={12} className="rtl:-rotate-90" />
              </button>
            </div>

            {/* Quick Priority Chips */}
            <div className="flex items-center justify-between gap-1 text-[10px]">
              <div className="flex items-center gap-1">
                {(['normal', 'important', 'urgent'] as PriorityLevel[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setQuickPriority(p)}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                      quickPriority === p
                        ? p === 'urgent'
                          ? 'bg-rose-500 text-white'
                          : p === 'important'
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-600 text-white'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {t[p]}
                  </button>
                ))}
              </div>

              {/* Category selector */}
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                className="bg-white/10 border border-white/20 text-slate-200 text-[10px] rounded-lg px-2 py-0.5 focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name[language] || c.name.en}
                  </option>
                ))}
              </select>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              triggerVibration(20);
              setIsQuickAddExpanded(true);
            }}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 hover:from-blue-600 hover:to-sky-400 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all ring-4 ring-blue-500/20"
            title={language === 'ar' ? 'إضافة مهمة سريعة' : 'Quick Add Task'}
            id="pinned-quick-add-fab"
          >
            <Plus size={26} className="stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
