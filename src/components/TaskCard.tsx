import React from 'react';
import {
  AlertTriangle,
  Calendar,
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
} from 'lucide-react';
import { LanguageCode, TaskCategory, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import { CategoryIcon } from './CategoryIcon';

interface TaskCardProps {
  task: TaskItem;
  category?: TaskCategory;
  language: LanguageCode;
  onToggleComplete: (task: TaskItem, e: React.MouseEvent) => void;
  onEdit: (task: TaskItem) => void;
  onPostpone?: (task: TaskItem) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  category,
  language,
  onToggleComplete,
  onEdit,
  onPostpone,
}) => {
  const t = translations[language];
  const isCompleted = task.status === 'completed';
  const nowMs = Date.now();
  const dueMs = task.dueDate ? new Date(task.dueDate).getTime() : 0;
  const isOverdue = !isCompleted && dueMs > 0 && dueMs < nowMs;

  const totalSubs = task.subTasks?.length || 0;
  const completedSubs = task.subTasks?.filter((s) => s.isCompleted).length || 0;

  const priorityColors = {
    urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
    important:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    normal:
      'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50',
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
    <div
      className={`group relative rounded-2xl border transition-all duration-200 p-3.5 sm:p-4 card-floating-4k ${
        isCompleted
          ? 'bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/40 opacity-75 shadow-floating-4k'
          : isOverdue
          ? 'bg-rose-50/70 dark:bg-slate-900/80 border-rose-300 dark:border-rose-500/60 ring-1 ring-rose-500/20 shadow-floating-4k'
          : 'bg-white dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 shadow-floating-4k'
      }`}
      id={`task-card-${task.id}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox Trigger with tactile burst */}
        <button
          type="button"
          onClick={(e) => onToggleComplete(task, e)}
          className={`mt-0.5 shrink-0 rounded-full transition-transform active:scale-90 ${
            isCompleted
              ? 'text-emerald-500 hover:text-slate-400'
              : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
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

        {/* Card Main Clickable Body */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(task)}>
          {/* Title & Priority Badge & Overdue indicator */}
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-semibold leading-snug transition-colors ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                  : 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'
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
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-300"
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
                className="inline-flex items-center gap-0.5 text-purple-600 dark:text-purple-400"
                title={t.customToneLabel}
              >
                <Music size={11} />
              </span>
            )}

            {/* Recurrence Indicator */}
            {task.recurrence && task.recurrence !== 'none' && (
              <span className="inline-flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400">
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
          </div>
        </div>
      </div>
    </div>
  );
};
