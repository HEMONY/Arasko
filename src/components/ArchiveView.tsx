import React, { useState } from 'react';
import {
  Archive,
  ArrowLeft,
  RotateCcw,
  Trash2,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { LanguageCode, TaskCategory, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import { CategoryIcon } from './CategoryIcon';

interface ArchiveViewProps {
  tasks: TaskItem[];
  categories: TaskCategory[];
  language: LanguageCode;
  onBack: () => void;
  onRestoreTask: (task: TaskItem) => void;
  onPermanentDelete: (taskId: string) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  tasks,
  categories,
  language,
  onBack,
  onRestoreTask,
  onPermanentDelete,
}) => {
  const t = translations[language];
  const [search, setSearch] = useState('');

  const archivedTasks = tasks.filter((t) => t.isArchived || t.status === 'completed');

  const filtered = archivedTasks.filter((task) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      task.title.toLowerCase().includes(q) ||
      task.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 pb-20 animate-fade-in" id="archive-view-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
          </button>
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              {t.archive}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {archivedTasks.length} {t.tasksCompleted}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute top-3 right-3 text-slate-400 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full py-2.5 px-9 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden"
        />
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {filtered.map((task) => {
          const category = categories.find((c) => c.id === task.categoryId);
          return (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 line-through">
                  {task.title}
                </h4>
                {category && (
                  <span
                    className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium"
                    style={{ color: category.color }}
                  >
                    <CategoryIcon name={category.icon} size={11} />
                    {category.name[language] || category.name.en}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onRestoreTask(task)}
                  className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1"
                  title={t.unarchiveTask}
                >
                  <RotateCcw size={14} />
                  <span className="hidden sm:inline">{t.unarchiveTask}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t.deleteConfirmation)) {
                      onPermanentDelete(task.id);
                    }
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title={t.delete}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
            <Archive size={32} className="mx-auto mb-2 opacity-50" />
            <p>{t.noTasksFound}</p>
          </div>
        )}
      </div>
    </div>
  );
};
