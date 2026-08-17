import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Award,
  Flame,
  ChevronDown,
} from 'lucide-react';
import { LanguageCode, TaskCategory, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import {
  BREAKDOWN_TEMPLATES,
  SmartAssistant,
  TaskBreakdownTemplate,
} from '../services/smartAssistant';
import { TaskCard } from './TaskCard';

interface SmartAssistantViewProps {
  tasks: TaskItem[];
  categories: TaskCategory[];
  language: LanguageCode;
  onEditTask: (task: TaskItem) => void;
  onToggleComplete: (task: TaskItem, e: React.MouseEvent) => void;
  onUpdateTasks: (updated: TaskItem[]) => void;
  onApplyBreakdownToTask: (template: TaskBreakdownTemplate) => void;
}

export const SmartAssistantView: React.FC<SmartAssistantViewProps> = ({
  tasks,
  categories,
  language,
  onEditTask,
  onToggleComplete,
  onUpdateTasks,
  onApplyBreakdownToTask,
}) => {
  const t = translations[language];
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    BREAKDOWN_TEMPLATES[0].id
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute Smart Assistant Insights
  const prioritized = SmartAssistant.getSmartPrioritizedTasks(tasks);
  const conflicts = SmartAssistant.detectConflicts(tasks);
  const overdueTasks = SmartAssistant.getOverdueTasks(tasks);
  const stats = SmartAssistant.calculateProductivityStats(tasks);
  const tips = SmartAssistant.getContextualTips(stats, true);

  const selectedTemplate =
    BREAKDOWN_TEMPLATES.find((tpl) => tpl.id === selectedTemplateId) ||
    BREAKDOWN_TEMPLATES[0];

  // Quick Reschedule Overdue to Today
  const handleRescheduleOverdueToToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updated = tasks.map((task) => {
      if (overdueTasks.some((o) => o.id === task.id)) {
        const timePart = task.dueDate.split('T')[1] || '18:00';
        return {
          ...task,
          dueDate: `${todayStr}T${timePart}`,
        };
      }
      return task;
    });
    onUpdateTasks(updated);
    showToast(t.quickRescheduleToToday);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyTemplate = () => {
    onApplyBreakdownToTask(selectedTemplate);
    showToast(t.breakdownAppliedSuccess);
  };

  return (
    <div className="space-y-5 pb-20 animate-fade-in" id="smart-assistant-view-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={15} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Hero Badge - Offline & Rule-Based Guarantee */}
      <div
        className="rounded-3xl p-5 bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 text-white shadow-xl shadow-indigo-950/20"
        id="assistant-offline-hero"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t.smartAssistantTitle}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 mt-1">
                <ShieldCheck size={12} /> {t.offlineNotice}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          {t.smartAssistantDesc}
        </p>
      </div>

      {/* 1. SCHEDULE CONFLICTS ALERT (If Any) */}
      {conflicts.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm mb-2">
            <AlertTriangle size={17} />
            <h4>
              {t.conflictDetected} ({conflicts.length})
            </h4>
          </div>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {conflicts.map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    "{c.taskA.title}" ({c.timeWindowA})
                  </span>{' '}
                  <span className="text-rose-500 font-bold">⚡ vs ⚡</span>{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    "{c.taskB.title}" ({c.timeWindowB})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onEditTask(c.taskA)}
                  className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-xs"
                >
                  {t.editTask}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. OVERDUE & BACKLOG MONITOR */}
      {overdueTasks.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {overdueTasks.length} {t.overdueTasksCount}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.rescheduleSuggested}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRescheduleOverdueToToday}
            className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            id="reschedule-overdue-btn"
          >
            <RefreshCw size={13} />
            {t.quickRescheduleToToday}
          </button>
        </div>
      )}

      {/* 3. SMART AUTO-PRIORITIZED TASK ORDERING */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {t.smartPriorityOrder}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {prioritized.length} {t.filterAll}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.smartPriorityDesc}
        </p>

        <div className="space-y-2 pt-1">
          {prioritized.slice(0, 5).map(({ task, score, reasonKey }, rank) => (
            <div key={task.id} className="relative">
              <div className="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                #{rank + 1}
              </div>
              <TaskCard
                task={task}
                category={categories.find((c) => c.id === task.categoryId)}
                language={language}
                onToggleComplete={onToggleComplete}
                onEdit={onEditTask}
              />
            </div>
          ))}

          {prioritized.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400">
              <CheckCircle2 size={24} className="mx-auto mb-1 text-emerald-500" />
              {t.greatJobAllDone}
            </div>
          )}
        </div>
      </div>

      {/* 4. TASK BREAKDOWN WIZARD (Rule-based templates) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {t.taskBreakdownGenerator}
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.breakdownDesc}
        </p>

        {/* Template Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {BREAKDOWN_TEMPLATES.map((tpl) => {
            const isSel = selectedTemplateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-purple-50 dark:bg-purple-950/70 border border-purple-500 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t[tpl.titleKey as keyof typeof t] || tpl.id}
              </button>
            );
          })}
        </div>

        {/* Template Preview Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {t.subTasks} ({selectedTemplate.steps.length} {t.steps}):
          </span>
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {selectedTemplate.steps.map((step, sIdx) => (
              <div key={sIdx} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {sIdx + 1}
                </span>
                <span>{step[language] || step.en}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleApplyTemplate}
            className="mt-3 w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
            id="apply-template-btn"
          >
            <Sparkles size={14} />
            {t.createTask} + {t.applyBreakdown}
          </button>
        </div>
      </div>

      {/* 5. PRODUCTIVITY SUMMARY & HEATMAP INSIGHTS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {t.productivitySummary}
          </h3>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block">
              {t.weeklySummary}
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {stats.weeklyCompletedCount}
            </span>
            <span className="text-[10px] text-slate-400 block">{t.completed}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
              {t.completionRate}
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {stats.completionRatePercent}%
            </span>
            <span className="text-[10px] text-slate-400 block">
              {stats.completedTasks}/{stats.totalTasks}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 block">
              {t.dayStreak}
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-500 flex items-center justify-center gap-0.5">
              <Flame size={18} className="fill-amber-500 animate-pulse" /> {stats.currentStreak}
            </span>
            <span className="text-[10px] text-slate-400 block">{t.streakDays}</span>
          </div>
        </div>

        {/* Peak productivity time */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {t.peakProductivityTime}:
          </span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {stats.peakPeriod === 'morning'
              ? t.morningPeak
              : stats.peakPeriod === 'afternoon'
              ? t.afternoonPeak
              : t.eveningPeak}
          </span>
        </div>
      </div>

      {/* 6. CONTEXTUAL TIPS */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t.contextualTips}
        </h3>
        <div className="space-y-2">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3 shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={16} />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {tip.title[language] || tip.title.en}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {tip.body[language] || tip.body.en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
