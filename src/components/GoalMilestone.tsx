import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap, Flame, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { AraskoMark } from './Logo';

interface GoalMilestoneProps {
  completedCount: number;
  totalCount: number;
  language: LanguageCode;
  streakCount?: number;
}

export const GoalMilestone: React.FC<GoalMilestoneProps> = ({
  completedCount,
  totalCount,
  language,
  streakCount = 0,
}) => {
  const t = translations[language];

  const percentage = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Milestone status determination
  const getMilestoneInfo = () => {
    if (totalCount === 0) {
      return {
        label: t.milestoneNotStarted,
        icon: Target,
        iconColor: 'text-sky-400',
        badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
        glowColor: 'from-blue-600/20 to-sky-500/20',
      };
    }
    if (percentage === 100) {
      return {
        label: t.dailyGoalCompleted,
        icon: Trophy,
        iconColor: 'text-amber-300',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        glowColor: 'from-emerald-500/30 to-amber-500/30',
      };
    }
    if (percentage >= 75) {
      return {
        label: t.milestoneAlmostDone,
        icon: Zap,
        iconColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        glowColor: 'from-emerald-600/25 to-sky-500/25',
      };
    }
    if (percentage >= 50) {
      return {
        label: t.milestoneHalfway,
        icon: Flame,
        iconColor: 'text-orange-400',
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        glowColor: 'from-orange-600/25 to-blue-500/25',
      };
    }
    if (percentage >= 25) {
      return {
        label: t.milestoneGoodStart,
        icon: null,
        isAraskoMark: true,
        iconColor: 'text-sky-300',
        badgeBg: 'bg-blue-500/20 text-sky-300 border-blue-500/30',
        glowColor: 'from-blue-600/20 to-indigo-500/20',
      };
    }
    return {
      label: t.milestoneNotStarted,
      icon: Target,
      iconColor: 'text-sky-400',
      badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
      glowColor: 'from-blue-600/20 to-sky-500/20',
    };
  };

  const milestone = getMilestoneInfo();
  const IconComponent = milestone.icon;

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-slate-950 via-[#07132c] to-[#0f2452] border border-blue-900/50 shadow-xl transition-all"
      id="today-goal-milestone-card"
    >
      {/* Background glow ambient */}
      <div
        className={`absolute -top-10 -right-10 w-44 h-44 rounded-full bg-gradient-to-br ${milestone.glowColor} blur-2xl pointer-events-none opacity-60`}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Animated SVG Progress Ring */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 72 72">
              <defs>
                <linearGradient id="goalMilestoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              {/* Background Track */}
              <circle
                cx="36"
                cy="36"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="5.5"
              />

              {/* Animated Progress Stroke */}
              <motion.circle
                cx="36"
                cy="36"
                r={radius}
                fill="none"
                stroke="url(#goalMilestoneGradient)"
                strokeWidth="5.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
              />
            </svg>

            {/* Inner Center Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {percentage === 100 ? (
                <CheckCircle2 size={22} className="text-emerald-400 animate-bounce" />
              ) : (
                <span className="text-base sm:text-lg font-black text-white leading-none">
                  {percentage}%
                </span>
              )}
            </div>
          </div>

          {/* Progress Metrics & Title */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                <Target size={13} className="text-sky-400 shrink-0" />
                <span>{t.goalMilestone}</span>
              </span>
              {streakCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Flame size={11} className="fill-current text-amber-400" />
                  <span>{streakCount} {t.streakDays}</span>
                </span>
              )}
            </div>

            <div className="text-sm sm:text-base font-extrabold text-white truncate">
              {completedCount} / {totalCount} {t.tasksCompleted}
            </div>

            <p className="text-xs text-slate-300 line-clamp-1">
              {milestone.label}
            </p>
          </div>
        </div>

        {/* Right Side: Milestone Status Pill */}
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 shrink-0">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold border backdrop-blur-md shadow-xs ${milestone.badgeBg}`}
          >
            {milestone.isAraskoMark ? (
              <AraskoMark size={14} variant="gradient" className="shrink-0" />
            ) : (
              IconComponent && <IconComponent size={14} className={milestone.iconColor} />
            )}
            <span>{percentage === 100 ? (language === 'ar' ? 'مكتمل بنجاح' : '100% Achieved') : `${percentage}% ${t.completionRate}`}</span>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            {totalCount - completedCount > 0
              ? `${totalCount - completedCount} ${language === 'ar' ? 'مهام متبقية' : 'tasks remaining'}`
              : (language === 'ar' ? 'لا مهام متبقية' : 'All clear!')}
          </span>
        </div>
      </div>
    </div>
  );
};
