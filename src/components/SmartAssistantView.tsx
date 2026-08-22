import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
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
  PieChart as PieIcon,
  Activity,
  Calendar,
} from 'lucide-react';
import { LanguageCode, TaskCategory, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import {
  BREAKDOWN_TEMPLATES,
  SmartAssistant,
  TaskBreakdownTemplate,
} from '../services/smartAssistant';
import { TaskCard } from './TaskCard';
import { AraskoMark } from './Logo';

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

  // Time Distribution Data (Morning, Afternoon, Evening, Night)
  const timeDistributionData = useMemo(() => {
    let morning = 0;
    let afternoon = 0;
    let evening = 0;
    let night = 0;

    tasks.forEach((t) => {
      const timeStr = t.dueDate.includes('T') ? t.dueDate.split('T')[1] : '12:00';
      const hour = parseInt(timeStr.split(':')[0], 10) || 12;
      if (hour >= 5 && hour < 12) morning++;
      else if (hour >= 12 && hour < 17) afternoon++;
      else if (hour >= 17 && hour < 22) evening++;
      else night++;
    });

    return [
      { name: language === 'ar' ? 'الصباح' : 'Morning', count: morning || 3, fill: '#0284c7' },
      { name: language === 'ar' ? 'الظهيرة' : 'Afternoon', count: afternoon || 4, fill: '#2563eb' },
      { name: language === 'ar' ? 'المساء' : 'Evening', count: evening || 2, fill: '#1d4ed8' },
      { name: language === 'ar' ? 'الليل' : 'Night', count: night || 1, fill: '#0ea5e9' },
    ];
  }, [tasks, language]);

  // Category Completion Breakdown Data
  const categoryRatioData = useMemo(() => {
    return categories.map((cat) => {
      const catTasks = tasks.filter((t) => t.categoryId === cat.id);
      const completed = catTasks.filter((t) => t.status === 'completed').length;
      const total = catTasks.length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        name: cat.name[language] || cat.name.en,
        total: total || 1,
        completed: completed,
        rate: total > 0 ? rate : 100,
        color: cat.color || '#2563eb',
      };
    });
  }, [tasks, categories, language]);

  // 7-Day Completion Velocity Trend
  const weeklyVelocityData = useMemo(() => {
    const points = [];
    const today = new Date();
    const daysAr = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = language === 'ar' ? daysAr[d.getDay()] : daysEn[d.getDay()];

      const dayTasks = tasks.filter((t) => t.dueDate.startsWith(dateStr));
      const completedCount = dayTasks.filter((t) => t.status === 'completed').length;
      const totalCount = dayTasks.length;

      points.push({
        day: dayName,
        date: dateStr,
        completed: completedCount || Math.max(1, (i % 3) + 1),
        total: totalCount || Math.max(2, (i % 4) + 2),
      });
    }
    return points;
  }, [tasks, language]);

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
        className="rounded-3xl p-5 bg-gradient-to-tr from-slate-950 via-blue-950 to-slate-900 text-white shadow-floating-4k card-floating-4k border border-blue-500/20 glow-blue"
        id="assistant-offline-hero"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-sky-300 shadow-floating-4k border border-blue-400/20">
              <AraskoMark size={24} variant="gradient" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t.smartAssistantTitle}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 mt-1 shadow-floating-4k">
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
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-4 sm:p-5 shadow-floating-4k card-floating-4k">
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
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-floating-4k"
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
                  className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-floating-4k"
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
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-floating-4k card-floating-4k">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-floating-4k">
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
            className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-floating-4k transition-colors flex items-center justify-center gap-1.5"
            id="reschedule-overdue-btn"
          >
            <RefreshCw size={13} />
            {t.quickRescheduleToToday}
          </button>
        </div>
      )}

      {/* 3. SMART AUTO-PRIORITIZED TASK ORDERING */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AraskoMark size={18} variant="gradient" className="shrink-0" />
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
              <div className="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-floating-4k">
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k space-y-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-sky-600 dark:text-sky-400" />
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
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-floating-4k ${
                  isSel
                    ? 'bg-blue-50 dark:bg-blue-950/70 border border-blue-500 text-blue-700 dark:text-sky-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t[tpl.titleKey as keyof typeof t] || tpl.id}
              </button>
            );
          })}
        </div>

        {/* Template Preview Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2 shadow-floating-4k">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {t.subTasks} ({selectedTemplate.steps.length} {t.steps}):
          </span>
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {selectedTemplate.steps.map((step, sIdx) => (
              <div key={sIdx} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {sIdx + 1}
                </span>
                <span>{step[language] || step.en}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleApplyTemplate}
            className="mt-3 w-full py-2.5 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white text-xs font-bold shadow-floating-4k transition-all flex items-center justify-center gap-1.5 active:scale-98"
            id="apply-template-btn"
          >
            <AraskoMark size={16} variant="emerald" />
            {t.createTask} + {t.applyBreakdown}
          </button>
        </div>
      </div>

      {/* 5. PRODUCTIVITY SUMMARY & HEATMAP INSIGHTS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {t.productivitySummary}
          </h3>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-center shadow-floating-4k card-floating-4k">
            <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-sky-400 block">
              {t.weeklySummary}
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {stats.weeklyCompletedCount}
            </span>
            <span className="text-[10px] text-slate-400 block">{t.completed}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-center shadow-floating-4k card-floating-4k">
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

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-center shadow-floating-4k card-floating-4k">
            <span className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400 block">
              {t.dayStreak}
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-500 flex items-center justify-center gap-0.5">
              <Flame size={18} className="fill-amber-500 animate-pulse" /> {stats.currentStreak}
            </span>
            <span className="text-[10px] text-slate-400 block">{t.streakDays}</span>
          </div>
        </div>

        {/* Peak productivity time banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs shadow-floating-4k">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {t.peakProductivityTime}:
          </span>
          <span className="font-bold text-blue-600 dark:text-sky-400">
            {stats.peakPeriod === 'morning'
              ? t.morningPeak
              : stats.peakPeriod === 'afternoon'
              ? t.afternoonPeak
              : t.eveningPeak}
          </span>
        </div>

        {/* RECHARTS INSIGHT 1: Productive Times of Day Distribution */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock size={14} className="text-blue-500" />
              {language === 'ar' ? 'أوقات الإنتاجية اليومية' : 'Productive Time Slots'}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {language === 'ar' ? 'حسب ساعات المهام' : 'By task schedule'}
            </span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeDistributionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.12} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#030712',
                    borderRadius: '12px',
                    border: '1px solid #1e3a8a',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val} ${language === 'ar' ? 'مهام' : 'tasks'}`, language === 'ar' ? 'النشاط' : 'Activity']}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]}>
                  {timeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECHARTS INSIGHT 2: 7-Day Completion Velocity Trend */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Activity size={14} className="text-emerald-500" />
              {language === 'ar' ? 'معدل إنجاز المهام (7 أيام)' : '7-Day Completion Velocity'}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.completionRatePercent}% {language === 'ar' ? 'مكتمل' : 'Rate'}
            </span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyVelocityData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.12} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: '1px solid #1e293b',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                  formatter={(val: any, name: any) => [
                    `${val} ${language === 'ar' ? 'مهام' : 'tasks'}`,
                    name === 'completed' ? (language === 'ar' ? 'مكتملة' : 'Completed') : (language === 'ar' ? 'الإجمالي' : 'Total')
                  ]}
                />
                <Area type="monotone" dataKey="total" stroke="#cbd5e1" strokeDasharray="3 3" fillOpacity={0} strokeWidth={1.5} />
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2.5} fill="url(#velocityGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECHARTS INSIGHT 3: Category Completion Breakdown */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <PieIcon size={14} className="text-sky-500" />
              {language === 'ar' ? 'نسب الإنجاز حسب التصنيف' : 'Category Completion Ratios'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {categoryRatioData.map((cat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 shadow-floating-4k"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{cat.name}</span>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">{cat.completed}/{cat.total} ({cat.rate}%)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.rate}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
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
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3 shadow-floating-4k card-floating-4k"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-floating-4k">
                <AraskoMark size={18} variant="emerald" />
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
