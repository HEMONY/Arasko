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
} from 'lucide-react';
import {
  CalendarSubView,
  LanguageCode,
  TaskCategory,
  TaskItem,
} from '../types';
import { translations } from '../i18n/translations';
import { TaskCard } from './TaskCard';

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

  // Filter tasks for selected day
  const selectedDayTasks = tasks.filter((task) => {
    if (task.isArchived) return false;
    const taskDate = task.dueDate ? task.dueDate.split('T')[0] : '';
    const isDaily = task.recurrence === 'daily';
    return taskDate === selectedDate || isDaily;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-5 pb-20 animate-fade-in" id="calendar-view-container">
      {/* Sub-view switcher (Monthly / Yearly) */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSubView('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-floating-4k ${
              subView === 'monthly'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="subview-monthly-btn"
          >
            {t.monthlyView}
          </button>
          <button
            type="button"
            onClick={() => setSubView('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-floating-4k ${
              subView === 'yearly'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="subview-yearly-btn"
          >
            {t.yearlyView}
          </button>
        </div>

        {/* Month/Year Navigation */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {subView === 'monthly' ? monthName : year}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={subView === 'monthly' ? handlePrevMonth : handlePrevYear}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Previous"
              id="calendar-prev-btn"
            >
              <ChevronLeft size={16} className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={subView === 'monthly' ? handleNextMonth : handleNextYear}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Next"
              id="calendar-next-btn"
            >
              <ChevronRight size={16} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* MONTHLY VIEW */}
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
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 scale-102 ring-2 ring-indigo-500/40'
                        : isToday
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold'
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
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
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

      {/* YEARLY VIEW */}
      {subView === 'yearly' && (
        <div className="space-y-5">
          {/* Year Overview Grid (12 Months mini-matrices) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Layers size={16} className="text-indigo-600" />
              {t.monthOverview} ({year})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, mIdx) => {
                const monthDate = new Date(year, mIdx, 1);
                const mName = monthDate.toLocaleDateString(
                  language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US',
                  { month: 'short' }
                );
                const daysInM = new Date(year, mIdx + 1, 0).getDate();
                const mPad = (mIdx + 1).toString().padStart(2, '0');

                const mTasks = tasks.filter((t) => {
                  if (t.isArchived) return false;
                  return t.dueDate && t.dueDate.startsWith(`${year}-${mPad}`);
                });

                const completedM = mTasks.filter((t) => t.status === 'completed').length;

                return (
                  <div
                    key={mIdx}
                    onClick={() => {
                      setCurrentDate(new Date(year, mIdx, 1));
                      setSubView('monthly');
                    }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group shadow-floating-4k card-floating-4k"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">
                        {mName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {mTasks.length} {t.tasksCompleted.split(' ')[0]}
                      </span>
                    </div>

                    {/* Mini heatmap dots */}
                    <div className="grid grid-cols-7 gap-0.5">
                      {Array.from({ length: Math.min(daysInM, 28) }).map((_, dayIndex) => {
                        const dayStr = `${year}-${mPad}-${(dayIndex + 1)
                          .toString()
                          .padStart(2, '0')}`;
                        const hasTask = tasks.some(
                          (tk) => tk.dueDate && tk.dueDate.startsWith(dayStr)
                        );
                        return (
                          <div
                            key={dayIndex}
                            className={`w-2 h-2 rounded-xs ${
                              hasTask
                                ? 'bg-indigo-600 dark:bg-indigo-400'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        );
                      })}
                    </div>

                    {mTasks.length > 0 && (
                      <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {completedM}/{mTasks.length} {t.completed}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Yearly Milestones & Long-term Goals */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <CalendarIcon size={16} className="text-purple-600" />
              {t.yearMilestones}
            </h3>

            <div className="space-y-2.5">
              {tasks
                .filter((t) => t.recurrence === 'yearly' || t.recurrence === 'monthly')
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={categories.find((c) => c.id === task.categoryId)}
                    language={language}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEditTask}
                  />
                ))}
              {tasks.filter((t) => t.recurrence === 'yearly' || t.recurrence === 'monthly')
                .length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center">
                  {t.appTagline}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
