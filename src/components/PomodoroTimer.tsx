import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Clock,
  Coffee,
  Brain,
  ListTodo,
  Check,
} from 'lucide-react';
import { LanguageCode, PomodoroMode, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import { playAlertSound, triggerVibration } from '../services/soundEngine';
import { AraskoMark } from './Logo';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  tasks: TaskItem[];
  initialTaskId?: string;
  onTaskComplete?: (taskId: string) => void;
  onNotify?: (title: string, body: string) => void;
}

const PRESET_DURATIONS: Record<PomodoroMode, number[]> = {
  focus: [15, 25, 30, 45, 60],
  shortBreak: [3, 5, 10],
  longBreak: [10, 15, 20, 30],
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isOpen,
  onClose,
  language,
  tasks,
  initialTaskId,
  onTaskComplete,
  onNotify,
}) => {
  const t = translations[language];

  // Modes: focus (25m), shortBreak (5m), longBreak (15m)
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(initialTaskId);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initialTaskId when opened
  useEffect(() => {
    if (initialTaskId) {
      setSelectedTaskId(initialTaskId);
    }
  }, [initialTaskId]);

  // Handle Mode Change
  const handleModeChange = (newMode: PomodoroMode) => {
    triggerVibration(15);
    setMode(newMode);
    setIsRunning(false);
    let defaultMin = 25;
    if (newMode === 'shortBreak') defaultMin = 5;
    if (newMode === 'longBreak') defaultMin = 15;
    setSelectedMinutes(defaultMin);
    setTimeLeft(defaultMin * 60);
  };

  // Handle Duration Selection
  const handleDurationSelect = (mins: number) => {
    triggerVibration(15);
    setSelectedMinutes(mins);
    setIsRunning(false);
    setTimeLeft(mins * 60);
  };

  // Timer Tick Logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedMinutes, selectedTaskId]);

  // Handle Timer Finished
  const handleTimerFinished = () => {
    setIsRunning(false);
    triggerVibration([200, 100, 200, 100, 300]);

    if (soundEnabled) {
      playAlertSound('chime');
    }

    const currentTask = tasks.find((tk) => tk.id === selectedTaskId);
    const taskName = currentTask ? ` (${currentTask.title})` : '';

    if (mode === 'focus') {
      const newCycles = completedCycles + 1;
      setCompletedCycles(newCycles);
      setTotalFocusMinutes((prev) => prev + selectedMinutes);

      const title = t.pomodoroCompleted;
      const body = `${t.pomodoroCompletedDesc}${taskName}`;

      if (onNotify) {
        onNotify(title, body);
      }

      // Automatically offer or transition to short break
      if (newCycles % 4 === 0) {
        setMode('longBreak');
        setSelectedMinutes(15);
        setTimeLeft(15 * 60);
      } else {
        setMode('shortBreak');
        setSelectedMinutes(5);
        setTimeLeft(5 * 60);
      }
    } else {
      // Break Finished
      const title = language === 'ar' ? 'انتهت فترة الاستراحة ☕' : language === 'fr' ? 'Pause terminée ☕' : 'Break completed ☕';
      const body = language === 'ar' ? 'جاهز للعودة إلى جلسة التركيز القادمة؟' : language === 'fr' ? 'Prêt pour la prochaine session ?' : 'Ready to resume your next focus sprint?';
      if (onNotify) onNotify(title, body);

      setMode('focus');
      setSelectedMinutes(25);
      setTimeLeft(25 * 60);
    }
  };

  const handleTogglePlay = () => {
    triggerVibration(25);
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    triggerVibration(20);
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const handleSkip = () => {
    triggerVibration(20);
    handleTimerFinished();
  };

  const handleAddMinutes = (mins: number) => {
    triggerVibration(15);
    setTimeLeft((prev) => Math.max(0, prev + mins * 60));
  };

  // Formatted Strings
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDurationSeconds = selectedMinutes * 60;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalDurationSeconds - timeLeft) / totalDurationSeconds) * 100)
  );

  // Selected Task
  const activeTask = useMemo(() => tasks.find((t) => t.id === selectedTaskId), [tasks, selectedTaskId]);

  if (!isOpen) return null;

  // Minimized Floating Widget
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-20 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200"
        id="pomodoro-minimized-floating-widget"
      >
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 text-white shadow-2xl shadow-indigo-950/40">
          <div className="relative flex items-center justify-center w-8 h-8">
            <svg className="w-8 h-8 -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="13"
                className="stroke-slate-700"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="16"
                cy="16"
                r="13"
                className={mode === 'focus' ? 'stroke-indigo-400' : 'stroke-emerald-400'}
                strokeWidth="3"
                strokeDasharray="81.68"
                strokeDashoffset={81.68 - (81.68 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-[10px] font-bold">
              {mode === 'focus' ? '🎯' : '☕'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight font-mono text-indigo-200">
              {formattedTime}
            </span>
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
              {activeTask ? activeTask.title : mode === 'focus' ? t.focusSession : t.shortBreak}
            </span>
          </div>

          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              title={isRunning ? t.pauseFocus : t.startFocus}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
              title={t.pomodoro}
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full Screen 4K/3D Focus Modal
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      id="pomodoro-modal-backdrop"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-2xl shadow-blue-950/30 overflow-hidden flex flex-col max-h-[92vh]"
        id="pomodoro-modal-container"
      >
        {/* 3D Top Ambient Gradient Glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-600/10 via-sky-600/5 to-transparent pointer-events-none" />

        {/* Header Bar */}
        <div className="relative px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-600 text-white shadow-md shadow-blue-900/30 border border-white/20">
              <AraskoMark size={22} variant="white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                {t.pomodoroTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t.pomodoroDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sound Mute Toggle */}
            <button
              type="button"
              onClick={() => {
                triggerVibration(15);
                setSoundEnabled(!soundEnabled);
              }}
              className={`p-2 rounded-xl transition-colors ${
                soundEnabled
                  ? 'text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60'
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="تفعيل/تعطيل الصوت"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Minimize Button */}
            <button
              type="button"
              onClick={() => {
                triggerVibration(15);
                setIsMinimized(true);
              }}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.minimizeTimer}
            >
              <Minimize2 size={18} />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                triggerVibration(15);
                onClose();
              }}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="إغلاق"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Mode Selector Tabs (Focus, Short Break, Long Break) */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => handleModeChange('focus')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'focus'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Brain size={15} />
              <span>{t.focusSession}</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('shortBreak')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'shortBreak'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Coffee size={15} />
              <span>{t.shortBreak}</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('longBreak')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'longBreak'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Clock size={15} />
              <span>{t.longBreak}</span>
            </button>
          </div>

          {/* Quick Preset Durations */}
          <div className="flex items-center justify-center gap-2">
            {PRESET_DURATIONS[mode].map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => handleDurationSelect(min)}
                className={`py-1 px-3 rounded-xl text-xs font-bold transition-all border ${
                  selectedMinutes === min
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {min} {language === 'ar' ? 'دقيقة' : 'min'}
              </button>
            ))}
          </div>

          {/* 3D 4K Circular Timer Gauge */}
          <div className="relative flex items-center justify-center py-2">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Outer 3D Ambient Ring & Glow */}
              <div
                className={`absolute inset-0 rounded-full blur-2xl opacity-20 transition-colors duration-500 ${
                  mode === 'focus' ? 'bg-blue-600' : 'bg-emerald-500'
                }`}
              />

              {/* SVG Circular Progress Ring */}
              <svg className="w-full h-full -rotate-90 filter drop-shadow-lg" viewBox="0 0 240 240">
                <defs>
                  <linearGradient id="focusProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1E3A8A" />
                  </linearGradient>
                  <linearGradient id="breakProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>

                {/* Track Background */}
                <circle
                  cx="120"
                  cy="120"
                  r="100"
                  className="stroke-slate-100 dark:stroke-slate-800/80"
                  strokeWidth="12"
                  fill="none"
                />

                {/* Animated Progress Path */}
                <circle
                  cx="120"
                  cy="120"
                  r="100"
                  stroke={mode === 'focus' ? 'url(#focusProgressGrad)' : 'url(#breakProgressGrad)'}
                  strokeWidth="12"
                  strokeDasharray="628.3"
                  strokeDashoffset={628.3 - (628.3 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center Metrics */}
              <div className="absolute flex flex-col items-center justify-center text-center p-4">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white tabular-nums drop-shadow-sm">
                  {formattedTime}
                </span>

                <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>{mode === 'focus' ? '🎯' : '☕'}</span>
                  <span>
                    {mode === 'focus'
                      ? language === 'ar'
                        ? 'تركيز نشط'
                        : 'Deep Focus'
                      : language === 'ar'
                      ? 'استراحة منعشة'
                      : 'Rest Break'}
                  </span>
                </div>

                {/* Quick +1m / +5m chips */}
                <div className="mt-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddMinutes(1)}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    +1 {language === 'ar' ? 'د' : 'm'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddMinutes(5)}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    +5 {language === 'ar' ? 'د' : 'm'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Controls */}
          <div className="flex items-center justify-center gap-4">
            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
              title={t.resetFocus}
            >
              <RotateCcw size={20} />
            </button>

            {/* Big 3D Play/Pause Action Button */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`px-8 py-4 rounded-2xl font-black text-white text-base shadow-xl flex items-center gap-3 transition-all transform active:scale-95 ${
                isRunning
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-500/30'
                  : mode === 'focus'
                  ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 shadow-blue-600/35 border border-white/20'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 shadow-emerald-600/35 border border-white/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause size={22} className="stroke-[2.5]" />
                  <span>{t.pauseFocus}</span>
                </>
              ) : (
                <>
                  <Play size={22} className="stroke-[2.5]" />
                  <span>{t.startFocus}</span>
                </>
              )}
            </button>

            {/* Skip to Next Button */}
            <button
              type="button"
              onClick={handleSkip}
              className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
              title="تخطي للجلسة القادمة"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Associated Task Selector */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <ListTodo size={15} className="text-blue-600 dark:text-sky-400" />
              <span>{t.selectTaskForPomodoro}</span>
            </label>

            <div className="relative">
              <select
                value={selectedTaskId || ''}
                onChange={(e) => {
                  triggerVibration(15);
                  setSelectedTaskId(e.target.value || undefined);
                }}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  -- {language === 'ar' ? 'تركيز عام بدون مهمة محددة' : 'General Focus Session'} --
                </option>
                {tasks
                  .filter((tk) => !tk.isArchived && tk.status !== 'completed')
                  .map((tk) => (
                    <option key={tk.id} value={tk.id}>
                      {tk.title}
                    </option>
                  ))}
              </select>
            </div>

            {/* If task is selected, show option to complete it */}
            {activeTask && onTaskComplete && (
              <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
                <span className="text-xs font-bold text-blue-900 dark:text-sky-200 truncate">
                  {activeTask.title}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    triggerVibration([30, 50, 30]);
                    onTaskComplete(activeTask.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0"
                >
                  <Check size={13} />
                  <span>{t.markCompleted}</span>
                </button>
              </div>
            )}
          </div>

          {/* Daily Focus Summary Counters */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
                {t.completedCyclesCount}
              </span>
              <span className="text-xl font-black text-blue-600 dark:text-sky-400 font-mono">
                {completedCycles}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
                {language === 'ar' ? 'دقائق التركيز اليوم' : 'Focus Minutes Today'}
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {totalFocusMinutes} {language === 'ar' ? 'د' : 'm'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
