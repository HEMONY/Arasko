import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  FileText,
  Frown,
  Image as ImageIcon,
  MoreVertical,
  Music,
  Repeat,
  Timer,
  Trash2,
} from 'lucide-react';
import { LanguageCode, TaskCategory, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import { CategoryIcon } from './CategoryIcon';
import { triggerVibration } from '../services/soundEngine';

interface TaskCardProps {
  task: TaskItem;
  category?: TaskCategory;
  language: LanguageCode;
  onToggleComplete: (task: TaskItem, e: React.MouseEvent) => void;
  onEdit: (task: TaskItem) => void;
  onPostpone?: (task: TaskItem) => void;
  onDelete?: (taskId: string) => void;
  onStartPomodoro?: (task: TaskItem) => void;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  category,
  language,
  onToggleComplete,
  onEdit,
  onPostpone,
  onDelete,
  onStartPomodoro,
  isSelectMode,
  isSelected,
  onToggleSelect,
}) => {
  const t = translations[language];
  const isCompleted = task.status === 'completed';
  const nowMs = Date.now();
  const dueMs = task.dueDate ? new Date(task.dueDate).getTime() : 0;
  const isOverdue = !isCompleted && dueMs > 0 && dueMs < nowMs;

  const totalSubs = task.subTasks?.length || 0;
  const completedSubs = task.subTasks?.filter((s) => s.isCompleted).length || 0;

  // Swipe Gesture State
  const [translateX, setTranslateX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDeleteRevealed, setIsDeleteRevealed] = useState<boolean>(false);

  const dragStartX = useRef<number>(0);
  const dragStartY = useRef<number>(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    triggerVibration(15);
    dragStartX.current = e.touches[0].clientX;
    dragStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - dragStartX.current;
    const diffY = currentY - dragStartY.current;

    // Detect direction on initial movement
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (!isHorizontalSwipe.current) {
      return; // Allow native vertical scroll
    }

    // Apply translation with bounded resistance
    const startOffset = isDeleteRevealed ? -80 : 0;
    let targetX = startOffset + diffX;

    // Resistance beyond limits
    if (targetX > 110) {
      targetX = 110 + (targetX - 110) * 0.2;
    } else if (targetX < -120) {
      targetX = -120 + (targetX + 120) * 0.2;
    }

    setTranslateX(targetX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!isHorizontalSwipe.current) {
      setTranslateX(isDeleteRevealed ? -80 : 0);
      return;
    }

    // Swipe Right -> Complete Task
    if (translateX >= 70) {
      triggerVibration([30, 40]);
      // Trigger toggle complete
      const syntheticEvent = {
        stopPropagation: () => {},
        preventDefault: () => {},
      } as React.MouseEvent;
      onToggleComplete(task, syntheticEvent);
      setTranslateX(0);
      setIsDeleteRevealed(false);
      return;
    }

    // Swipe Left -> Reveal Delete or Delete
    if (translateX <= -60) {
      // Lock into revealed state
      setTranslateX(-80);
      setIsDeleteRevealed(true);
      triggerVibration(25);
      return;
    }

    // Otherwise snap back
    setTranslateX(0);
    setIsDeleteRevealed(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerVibration(35);
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const priorityColors = {
    urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
    important:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    normal:
      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
  };

  // Subtle color-coded start/left-border indicator by priority
  const priorityBorderClasses = {
    urgent: 'border-s-4 border-s-rose-500 hover:border-s-rose-600',
    important: 'border-s-4 border-s-amber-500 hover:border-s-amber-600',
    normal: 'border-s-4 border-s-blue-500/80 dark:border-s-blue-500/60 hover:border-s-blue-600',
  };

  // Format time or date cleanly
  const formatDue = (dueStr: string) => {
    if (!dueStr) return '';
    const datePart = dueStr.split('T')[0];
    const timePart = dueStr.split('T')[1]?.substring(0, 5);
    const today = new Date().toISOString().split('T')[0];

    if (datePart === today) {
      return timePart ? `${timePart}` : t.today;
    }
    return timePart ? `${datePart} ${timePart}` : datePart;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl select-none" id={`task-card-wrapper-${task.id}`}>
      {/* Background Swipe Actions Layer */}
      <div className="absolute inset-0 rounded-2xl flex items-stretch justify-between pointer-events-none">
        {/* Right Swipe: Complete (Shown on Left) */}
        <div
          className={`flex items-center px-4 bg-emerald-500 text-white rounded-l-2xl transition-opacity duration-200 ${
            translateX > 15 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: Math.max(0, translateX + 20) }}
        >
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Check size={18} className="stroke-[3]" />
            <span className="hidden sm:inline">{isCompleted ? t.undoComplete : t.completed}</span>
          </div>
        </div>

        {/* Left Swipe: Delete (Shown on Right) */}
        <div
          className={`ml-auto flex items-center justify-end px-3 sm:px-4 bg-rose-500 text-white rounded-r-2xl pointer-events-auto transition-opacity duration-200 ${
            translateX < -15 || isDeleteRevealed ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: Math.max(0, -translateX + 20) }}
        >
          <button
            type="button"
            onClick={handleDeleteClick}
            className="flex items-center gap-1 font-bold text-xs py-2 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:scale-95 transition-transform"
            title={t.delete}
            id={`swipe-delete-btn-${task.id}`}
          >
            <Trash2 size={16} />
            <span className="text-[11px]">{t.delete}</span>
          </button>
        </div>
      </div>

      {/* Foreground Swipeable Card Surface */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onPointerDown={() => triggerVibration(12)}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className={`group relative rounded-2xl border ${
          priorityBorderClasses[task.priority] || priorityBorderClasses.normal
        } p-3.5 sm:p-4 card-floating-4k will-change-transform active:scale-[0.985] sm:active:scale-[0.99] transition-all duration-150 ease-out select-none ${
          isSelected
            ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/40 shadow-floating-4k scale-[0.99]'
            : isCompleted
            ? 'bg-slate-100/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/40 opacity-75 shadow-floating-4k'
            : isOverdue
            ? 'bg-rose-50/80 dark:bg-slate-900/90 border-rose-300 dark:border-rose-500/60 ring-1 ring-rose-500/20 shadow-floating-4k'
            : 'bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 shadow-floating-4k'
        }`}
        id={`task-card-${task.id}`}
      >
        <div className="flex items-start gap-3">
          {/* Multi-Select Checkbox OR Standard Completion Trigger */}
          {isSelectMode ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerVibration(20);
                if (onToggleSelect) onToggleSelect(task.id);
              }}
              className={`mt-0.5 shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-white/50 dark:bg-slate-800/50'
              }`}
              id={`select-task-${task.id}`}
            >
              {isSelected && <Check size={13} className="stroke-[3]" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                triggerVibration(25);
                if (isDeleteRevealed) {
                  setTranslateX(0);
                  setIsDeleteRevealed(false);
                }
                onToggleComplete(task, e);
              }}
              className={`mt-0.5 shrink-0 rounded-full transition-transform active:scale-85 ${
                isCompleted
                  ? 'text-emerald-500 hover:text-slate-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-sky-400'
              }`}
              title={isCompleted ? t.undoComplete : t.markCompleted}
              id={`toggle-task-${task.id}`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white dark:text-slate-950" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Card Main Clickable Body */}
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => {
              triggerVibration(15);
              if (isSelectMode) {
                if (onToggleSelect) onToggleSelect(task.id);
                return;
              }
              if (isDeleteRevealed) {
                setTranslateX(0);
                setIsDeleteRevealed(false);
                return;
              }
              onEdit(task);
            }}
          >
            {/* Title & Priority Badge & Overdue indicator */}
            <div className="flex items-start justify-between gap-2">
              <h4
                className={`text-sm font-semibold leading-snug transition-colors ${
                  isCompleted
                    ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                    : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-sky-300'
                }`}
              >
                {task.title}
              </h4>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Overdue Badge */}
                {isOverdue && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 flex items-center gap-1 animate-pulse">
                    <Frown size={11} />
                    {t.overdueBadge}
                  </span>
                )}

                {/* Priority badge */}
                {task.priority !== 'normal' && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {t[task.priority]}
                  </span>
                )}
              </div>
            </div>

            {/* Optional Short Description */}
            {task.description && (
              <p
                className={`text-xs mt-1 line-clamp-1 ${
                  isCompleted ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Subtasks Progress Bar if has subtasks */}
            {totalSubs > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-sky-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${(completedSubs / totalSubs) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                  {completedSubs}/{totalSubs}
                </span>
              </div>
            )}

            {/* Metadata Footer: Category, Due Date, Indicators */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              {/* Category Pill */}
              {category && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60"
                  style={{ color: category.color }}
                >
                  <CategoryIcon name={category.icon} size={11} />
                  {category.name[language] || category.name.en}
                </span>
              )}

              {/* Due Time */}
              {task.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 ${
                    isOverdue ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isOverdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
                  {formatDue(task.dueDate)}
                </span>
              )}

              {/* Custom Sound attached indicator */}
              {task.customSoundChoice && (
                <span
                  className="inline-flex items-center gap-0.5 text-sky-600 dark:text-sky-400"
                  title={t.customToneLabel}
                >
                  <Music size={11} />
                </span>
              )}

              {/* Recurrence Indicator */}
              {task.recurrence && task.recurrence !== 'none' && (
                <span className="inline-flex items-center gap-0.5 text-blue-600 dark:text-sky-400">
                  <Repeat size={11} />
                </span>
              )}

              {/* Attachment indicator */}
              {task.imageAttachment && (
                <span className="inline-flex items-center text-slate-400">
                  <ImageIcon size={11} />
                </span>
              )}

              {/* Notes indicator */}
              {task.notes && (
                <span className="inline-flex items-center text-slate-400">
                  <FileText size={11} />
                </span>
              )}

              {/* Pomodoro Focus Timer Quick Action Button */}
              {!isCompleted && onStartPomodoro && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerVibration(20);
                    onStartPomodoro(task);
                  }}
                  className="ml-auto rtl:mr-auto rtl:ml-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-sky-300 border border-blue-200/80 dark:border-blue-800/60 shadow-xs transition-all active:scale-95"
                  title={t.startPomodoroForTask}
                >
                  <Timer size={11} className="text-blue-500 stroke-[2.5]" />
                  <span>25 {language === 'ar' ? 'د' : 'm'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
