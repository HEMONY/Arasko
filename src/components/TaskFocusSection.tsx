import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, User, BookOpen, Layers, CheckCircle2, Sparkles, SlidersHorizontal } from 'lucide-react';
import { LanguageCode, TaskCategory, TaskItem } from '../types';
import { translations } from '../i18n/translations';

interface TaskFocusSectionProps {
  tasks: TaskItem[];
  categories: TaskCategory[];
  language: LanguageCode;
}

export const TaskFocusSection: React.FC<TaskFocusSectionProps> = ({
  tasks,
  categories,
  language,
}) => {
  const t = translations[language];
  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks created today or scheduled for today
  const activeTodayTasks = tasks.filter((task) => {
    if (task.isArchived) return false;
    const taskDate = task.dueDate ? task.dueDate.split('T')[0] : '';
    const createdDate = task.createdAt ? task.createdAt.split('T')[0] : '';
    return taskDate === todayStr || createdDate === todayStr || task.recurrence === 'daily';
  });

  // Categorize each task into Work, Personal, or Study
  let workCount = 0;
  let personalCount = 0;
  let studyCount = 0;

  activeTodayTasks.forEach((task) => {
    const cat = categories.find((c) => c.id === task.categoryId);
    const catId = (task.categoryId || '').toLowerCase();
    const catNameEn = (cat?.name.en || '').toLowerCase();
    const catNameAr = (cat?.name.ar || '').toLowerCase();

    // Check Study
    if (
      catId.includes('study') ||
      catId.includes('learn') ||
      catId.includes('book') ||
      catNameEn.includes('study') ||
      catNameEn.includes('learn') ||
      catNameAr.includes('دراسة') ||
      catNameAr.includes('تطوير') ||
      catNameAr.includes('قراءة')
    ) {
      studyCount++;
    }
    // Check Work
    else if (
      catId.includes('work') ||
      catId.includes('finance') ||
      catId.includes('job') ||
      catId.includes('project') ||
      catNameEn.includes('work') ||
      catNameEn.includes('finance') ||
      catNameAr.includes('عمل') ||
      catNameAr.includes('مشاريع') ||
      catNameAr.includes('مالية')
    ) {
      workCount++;
    }
    // Check Personal / Health / Life (Default)
    else {
      personalCount++;
    }
  });

  const total = workCount + personalCount + studyCount;
  const workPct = total > 0 ? Math.round((workCount / total) * 100) : 0;
  const personalPct = total > 0 ? Math.round((personalCount / total) * 100) : 0;
  const studyPct = total > 0 ? Math.max(0, 100 - workPct - personalPct) : 0;

  // Generate balance insight feedback
  const getBalanceInsight = () => {
    if (total === 0) {
      return language === 'ar'
        ? 'أضف مهام اليوم لمعاينة التوزيع بين العمل والدراسة والحياة الشخصية.'
        : language === 'fr'
        ? 'Ajoutez des tâches aujourd’hui pour visualiser votre équilibre travail, vie et études.'
        : 'Add tasks for today to visualize your work, personal, and study balance.';
    }
    if (workPct >= 65) {
      return language === 'ar'
        ? '💼 تركيز مكثف على العمل والمشاريع اليوم. تذكر أخذ استراحات قصيرة.'
        : language === 'fr'
        ? '💼 Focus intense sur le travail aujourd’hui. Pensez à prendre de courtes pauses.'
        : '💼 Heavy focus on work & projects today. Remember to take short mindful breaks.';
    }
    if (studyPct >= 50) {
      return language === 'ar'
        ? '📚 يوم حافل بالتعلم والتطوير المعرفي. استمر في بناء خبراتك!'
        : language === 'fr'
        ? '📚 Journée riche en apprentissage et études. Continuez ainsi !'
        : '📚 Great day for learning and study. Keep expanding your knowledge!';
    }
    if (personalPct >= 60) {
      return language === 'ar'
        ? '🌱 أولوية ممتازة للعناية بالصحة والروتين الشخصي والأسري اليوم.'
        : language === 'fr'
        ? '🌱 Priorité accordée à la santé et au bien-être personnel aujourd’hui.'
        : '🌱 High priority on health, personal wellness, and life routine today.';
    }
    return language === 'ar'
      ? '🌟 توزيع متوازن ومثالي بين متطلبات العمل والصحة والتعلم.'
      : language === 'fr'
      ? '🌟 Répartition équilibrée et harmonieuse entre travail, vie et apprentissage.'
      : '🌟 Harmonious and healthy balance across work, life, and study.';
  };

  return (
    <div
      className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#071126] border border-slate-200 dark:border-blue-900/40 shadow-sm space-y-3.5 transition-all"
      id="today-task-focus-section"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/40">
            <SlidersHorizontal size={15} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {t.taskFocus}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {t.dailyBalance}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
          {total} {language === 'ar' ? 'مهام اليوم' : 'tasks today'}
        </span>
      </div>

      {/* Multi-color Progress Bar (Work vs Personal vs Study) */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden flex p-0.5 border border-slate-200 dark:border-slate-700/50 shadow-inner">
          {total === 0 ? (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-700/40 rounded-full" />
          ) : (
            <>
              {/* Work Segment */}
              {workPct > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${workPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-l-full first:rounded-l-full last:rounded-r-full"
                  title={`${t.workTasks}: ${workPct}%`}
                />
              )}

              {/* Personal Segment */}
              {personalPct > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${personalPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 first:rounded-l-full last:rounded-r-full"
                  title={`${t.personalTasks}: ${personalPct}%`}
                />
              )}

              {/* Study Segment */}
              {studyPct > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${studyPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-r-full first:rounded-l-full last:rounded-r-full"
                  title={`${t.studyTasks}: ${studyPct}%`}
                />
              )}
            </>
          )}
        </div>

        {/* Legend / Category breakdown badges */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Work */}
          <div className="p-2 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-start flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="truncate">{t.workTasks}</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                {workCount}
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-sky-300">
                {workPct}%
              </span>
            </div>
          </div>

          {/* Personal */}
          <div className="p-2 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 text-start flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">{t.personalTasks}</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                {personalCount}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300">
                {personalPct}%
              </span>
            </div>
          </div>

          {/* Study */}
          <div className="p-2 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30 text-start flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-700 dark:text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
              <span className="truncate">{t.studyTasks}</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                {studyCount}
              </span>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300">
                {studyPct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Footer */}
      <div className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
        <Sparkles size={13} className="text-sky-500 shrink-0" />
        <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
          {getBalanceInsight()}
        </span>
      </div>
    </div>
  );
};
