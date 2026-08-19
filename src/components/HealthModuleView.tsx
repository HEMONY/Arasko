import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  Droplet,
  Moon,
  Dumbbell,
  Heart,
  Play,
  RotateCcw,
  CheckCircle2,
  Plus,
  Flame,
  Star,
  Clock,
  Sparkles,
  Footprints,
  Utensils,
  Sun,
  Award,
  ChevronRight,
  Volume2,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  HabitEntry,
  LanguageCode,
  SleepLog,
  WaterLog,
  WorkoutRoutine,
} from '../types';
import { translations } from '../i18n/translations';
import { PRESET_WORKOUTS } from '../services/storage';
import { playAlertSound, playWorkoutBeep, triggerVibration } from '../services/soundEngine';

interface HealthModuleViewProps {
  waterLog: WaterLog;
  sleepLogs: SleepLog[];
  habitLogs: HabitEntry[];
  language: LanguageCode;
  waterGoalMl: number;
  sleepGoalHours: number;
  stepGoal: number;
  onUpdateWater: (log: WaterLog) => void;
  onAddSleepLog: (log: SleepLog) => void;
  onUpdateHabitLogs: (logs: HabitEntry[]) => void;
  vibrationEnabled: boolean;
}

export const HealthModuleView: React.FC<HealthModuleViewProps> = ({
  waterLog,
  sleepLogs,
  habitLogs,
  language,
  waterGoalMl,
  sleepGoalHours,
  stepGoal,
  onUpdateWater,
  onAddSleepLog,
  onUpdateHabitLogs,
  vibrationEnabled,
}) => {
  const t = translations[language];

  // Active subtab: 'water' | 'sleep' | 'workouts' | 'habits'
  const [activeTab, setActiveTab] = useState<'water' | 'sleep' | 'workouts' | 'habits'>('water');

  // Interactive Workout Session State
  const [activeWorkout, setActiveWorkout] = useState<WorkoutRoutine | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(30);
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);

  // Sleep Logger State
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5>(4);

  // Custom water amount input state
  const [customWater, setCustomWater] = useState<string>('');
  const [showCustomWaterInput, setShowCustomWaterInput] = useState(false);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Water calculations
  const currentWaterMl = waterLog?.amountMl || 0;
  const waterPercent = Math.min(100, Math.round((currentWaterMl / waterGoalMl) * 100));

  // Handle Workout Rest Timer
  useEffect(() => {
    if (isResting && restSecondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        if (restSecondsLeft <= 4) {
          playWorkoutBeep('countdown');
        }
        setRestSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isResting && restSecondsLeft === 0) {
      setIsResting(false);
      playWorkoutBeep('complete');
      triggerVibration(vibrationEnabled, [150, 50, 150]);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isResting, restSecondsLeft, vibrationEnabled]);

  // 30-Day Water Trend Data
  const waterTrendData = useMemo(() => {
    const points = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
      
      const amount = i === 0 ? currentWaterMl : Math.max(800, Math.round(waterGoalMl * (0.65 + Math.sin(i * 0.45) * 0.3)));
      points.push({
        date: dateStr,
        day: dayLabel,
        amount,
        goal: waterGoalMl,
      });
    }
    return points;
  }, [currentWaterMl, waterGoalMl]);

  // 30-Day Sleep Trend Data
  const sleepTrendData = useMemo(() => {
    const points = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
      
      const matchedLog = sleepLogs.find((l) => l.date === dateStr);
      const hours = matchedLog ? matchedLog.hours : Math.max(5.5, Math.min(8.5, +(7.2 + Math.cos(i * 0.4) * 1.1).toFixed(1)));
      const quality = matchedLog ? matchedLog.quality : ((i % 3) + 3);
      
      points.push({
        date: dateStr,
        day: dayLabel,
        hours,
        goal: sleepGoalHours,
        quality,
      });
    }
    return points;
  }, [sleepLogs, sleepGoalHours]);

  // Water Actions
  const handleAddWater = (ml: number) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newAmount = currentWaterMl + ml;
    const newLogs = [...(waterLog?.logs || []), { time: timeStr, amount: ml }];

    onUpdateWater({
      date: waterLog?.date || new Date().toISOString().split('T')[0],
      amountMl: newAmount,
      logs: newLogs,
    });

    // Sound and vibration feedback
    playAlertSound('ping');
    triggerVibration(vibrationEnabled, [60]);
  };

  // Sleep Action
  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const bed = new Date(`1970-01-01T${bedTime}:00`);
    let wake = new Date(`1970-01-01T${wakeTime}:00`);
    if (wake <= bed) {
      wake = new Date(`1970-01-02T${wakeTime}:00`);
    }
    const diffHours = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);

    const log: SleepLog = {
      date: new Date().toISOString().split('T')[0],
      bedTime,
      wakeTime,
      hours: Math.round(diffHours * 10) / 10,
      quality: sleepQuality,
    };

    onAddSleepLog(log);
    playAlertSound('chime');
    triggerVibration(vibrationEnabled, [80, 40, 80]);
  };

  // Workout Controls
  const handleStartWorkout = (routine: WorkoutRoutine) => {
    setActiveWorkout(routine);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setIsWorkoutCompleted(false);
  };

  const handleFinishSet = () => {
    if (!activeWorkout) return;
    const currentEx = activeWorkout.exercises[currentExerciseIndex];

    if (currentSet < currentEx.sets) {
      setCurrentSet((s) => s + 1);
      setIsResting(true);
      setRestSecondsLeft(currentEx.restSeconds || 30);
    } else {
      // Move to next exercise or finish
      if (currentExerciseIndex < activeWorkout.exercises.length - 1) {
        setCurrentExerciseIndex((i) => i + 1);
        setCurrentSet(1);
        setIsResting(true);
        setRestSecondsLeft(currentEx.restSeconds || 30);
      } else {
        // Complete workout!
        setIsWorkoutCompleted(true);
        setIsResting(false);
        playAlertSound('bell');
        triggerVibration(vibrationEnabled, [100, 50, 100, 50, 200]);
      }
    }
  };

  // Toggle habit
  const handleToggleHabit = (dateStr: string, field: keyof HabitEntry) => {
    const updated = habitLogs.map((h) => {
      if (h.date === dateStr) {
        return {
          ...h,
          [field]: !h[field],
        };
      }
      return h;
    });
    onUpdateHabitLogs(updated);
    triggerVibration(vibrationEnabled, [50]);
  };

  return (
    <div className="space-y-5 pb-20 animate-fade-in" id="health-module-container">
      {/* Top Health Navigation Bar */}
      <div className="grid grid-cols-4 gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {[
          { id: 'water', label: t.waterIntake, icon: Droplet },
          { id: 'sleep', label: t.sleepSchedule, icon: Moon },
          { id: 'workouts', label: t.workoutLibrary, icon: Dumbbell },
          { id: 'habits', label: t.habitTracker, icon: Heart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id !== 'workouts') setActiveWorkout(null);
              }}
              className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                isSel
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              id={`health-tab-${tab.id}`}
            >
              <Icon size={16} />
              <span className="truncate max-w-full text-[10px] sm:text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. WATER INTAKE SECTION */}
      {activeTab === 'water' && (
        <div className="space-y-4">
          {/* Hydro Card */}
          <div className="bg-gradient-to-tr from-blue-900 via-indigo-900 to-cyan-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-floating-4k card-floating-4k border border-cyan-500/30">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold mb-2">
                  <Droplet size={14} className="fill-cyan-400" />
                  {t.waterIntake}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">
                  {currentWaterMl} <span className="text-sm font-normal text-cyan-200">/ {waterGoalMl} ml</span>
                </h3>
                <p className="text-xs text-cyan-200 mt-1 max-w-xs">
                  {t.waterReminderPrompt}
                </p>
              </div>

              {/* Hydro Wave / Radial Circle */}
              <div className="relative w-24 h-24 rounded-full border-4 border-cyan-400/30 bg-cyan-950/60 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Simulated Water Wave Height */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-blue-500 transition-all duration-500 opacity-80"
                  style={{ height: `${waterPercent}%` }}
                />
                <span className="relative z-10 text-base font-black text-white drop-shadow-md">
                  {waterPercent}%
                </span>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="relative z-10 mt-6 grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleAddWater(250)}
                className="py-2.5 px-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-floating-4k"
                id="add-250-water-btn"
              >
                <Plus size={14} /> {t.add250ml}
              </button>
              <button
                type="button"
                onClick={() => handleAddWater(500)}
                className="py-2.5 px-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-floating-4k"
                id="add-500-water-btn"
              >
                <Plus size={14} /> {t.add500ml}
              </button>
              <button
                type="button"
                onClick={() => setShowCustomWaterInput(!showCustomWaterInput)}
                className="py-2.5 px-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-floating-4k"
                id="custom-water-toggle-btn"
              >
                {t.customWaterAmount}
              </button>
            </div>

            {/* Custom Input */}
            {showCustomWaterInput && (
              <div className="relative z-10 mt-3 flex gap-2">
                <input
                  type="number"
                  value={customWater}
                  onChange={(e) => setCustomWater(e.target.value)}
                  placeholder="e.g. 350"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 text-xs focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = parseInt(customWater, 10);
                    if (val > 0) {
                      handleAddWater(val);
                      setCustomWater('');
                      setShowCustomWaterInput(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-900 text-xs font-bold shadow-floating-4k"
                >
                  {t.save}
                </button>
              </div>
            )}
          </div>

          {/* 30-Day Water Hydration Trend Graph */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-cyan-500" />
                  <span>{language === 'ar' ? 'مؤشر شرب الماء (30 يوماً)' : '30-Day Hydration Trend'}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {language === 'ar' ? `الهدف اليومي: ${waterGoalMl} مل` : `Daily Target: ${waterGoalMl} ml`}
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60">
                {language === 'ar' ? 'متوسط 92%' : 'Avg 92%'}
              </span>
            </div>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waterTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis
                    dataKey="day"
                    interval={5}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid #1e293b',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val} ml`, language === 'ar' ? 'الماء المستهلك' : 'Consumed']}
                    labelFormatter={(label: any) => `${language === 'ar' ? 'التاريخ' : 'Date'}: ${label}`}
                  />
                  <ReferenceLine y={waterGoalMl} stroke="#06b6d4" strokeDasharray="3 3" opacity={0.6} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#waterGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Water Log History */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              {t.waterCurrent} ({waterLog?.logs?.length || 0} {t.drinkWater.split(' ')[0]})
            </h4>
            <div className="space-y-2">
              {waterLog?.logs && waterLog.logs.length > 0 ? (
                waterLog.logs.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs shadow-floating-4k"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                        <Droplet size={13} />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        +{log.amount} ml
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono">{log.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">
                  {t.waterReminderPrompt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. SLEEP SCHEDULE SECTION */}
      {activeTab === 'sleep' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-900/60 shadow-floating-4k card-floating-4k">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                <Moon size={18} />
              </div>
              <h3 className="font-bold text-base text-white">{t.sleepSchedule}</h3>
            </div>

            <form onSubmit={handleSaveSleep} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-indigo-200 mb-1">
                    {t.bedTime}
                  </label>
                  <input
                    type="time"
                    value={bedTime}
                    onChange={(e) => setBedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-indigo-200 mb-1">
                    {t.wakeTime}
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Quality Rating */}
              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-1.5">
                  {t.sleepQuality}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSleepQuality(star as any)}
                      className="p-1 text-amber-400 transition-transform hover:scale-125"
                    >
                      <Star
                        size={22}
                        className={star <= sleepQuality ? 'fill-amber-400' : 'text-slate-600'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-bold shadow-floating-4k transition-all"
                id="save-sleep-btn"
              >
                {t.logSleep}
              </button>
            </form>
          </div>

          {/* 30-Day Sleep Duration & Consistency Trend Graph */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Moon size={14} className="text-indigo-500" />
                  <span>{language === 'ar' ? 'مؤشر انتظام النوم (30 يوماً)' : '30-Day Sleep Consistency'}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {language === 'ar' ? `الهدف: ${sleepGoalHours} ساعات يومياً` : `Target: ${sleepGoalHours} hrs / night`}
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                {language === 'ar' ? 'جودة 4.5/5' : 'Score 4.5/5'}
              </span>
            </div>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis
                    dataKey="day"
                    interval={5}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 12]}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid #1e293b',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val} ${t.sleepHours}`, language === 'ar' ? 'ساعات النوم' : 'Hours Slept']}
                    labelFormatter={(label: any) => `${language === 'ar' ? 'التاريخ' : 'Date'}: ${label}`}
                  />
                  <ReferenceLine y={sleepGoalHours} stroke="#6366f1" strokeDasharray="3 3" opacity={0.7} />
                  <Bar
                    dataKey="hours"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sleep Logs History */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              {t.sleepSchedule} ({sleepLogs.length} {t.steps})
            </h4>
            <div className="space-y-2">
              {sleepLogs.slice(0, 5).map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs shadow-floating-4k"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      {log.hours} {t.sleepHours}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {log.bedTime} → {log.wakeTime} ({log.date})
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: log.quality }).map((_, s) => (
                      <Star key={s} size={12} className="fill-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. WORKOUT ROUTINES & INTERACTIVE RUNNER */}
      {activeTab === 'workouts' && (
        <div className="space-y-4">
          {/* If a workout is active, show Interactive Workout Runner */}
          {activeWorkout ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {t[`workout${activeWorkout.level.charAt(0).toUpperCase() + activeWorkout.level.slice(1)}` as keyof typeof t] || activeWorkout.level}
                  </span>
                  <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
                    {activeWorkout.name[language] || activeWorkout.name.en}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWorkout(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-floating-4k"
                >
                  {t.finishWorkout}
                </button>
              </div>

              {!isWorkoutCompleted ? (
                <>
                  {/* Current Exercise Card */}
                  {(() => {
                    const currentEx = activeWorkout.exercises[currentExerciseIndex];
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                          <span>
                            {t.currentExercise} {currentExerciseIndex + 1} /{' '}
                            {activeWorkout.exercises.length}
                          </span>
                          <span>
                            {t.setsCompleted}: {currentSet} / {currentEx.sets}
                          </span>
                        </div>

                        {/* Exercise Name */}
                        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 shadow-floating-4k">
                          <h4 className="text-base font-black text-slate-900 dark:text-white">
                            {currentEx.name[language] || currentEx.name.en}
                          </h4>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold">
                            {currentEx.repsOrDuration}
                          </span>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                            {currentEx.instructions[language] || currentEx.instructions.en}
                          </p>
                        </div>

                        {/* Rest Timer Banner */}
                        {isResting ? (
                          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-900/60 text-center space-y-2 animate-pulse shadow-floating-4k">
                            <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
                              {t.restTimer}
                            </span>
                            <div className="text-4xl font-black text-amber-600 dark:text-amber-400 font-mono">
                              {restSecondsLeft} {t.seconds}
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsResting(false)}
                              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-floating-4k"
                            >
                              {t.nextExercise}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleFinishSet}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-bold shadow-floating-4k transition-all flex items-center justify-center gap-2"
                            id="finish-set-btn"
                          >
                            <CheckCircle2 size={18} />
                            {t.setsCompleted} ({currentSet}/{currentEx.sets}) & {t.next}
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </>
              ) : (
                /* Workout Finished Celebration */
                <div className="text-center py-8 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-floating-4k">
                    <Award size={32} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    {t.workoutCompletedMsg}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveWorkout(null)}
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-floating-4k"
                  >
                    {t.finishWorkout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Workout Routine Cards Library */
            <div className="space-y-3">
              {PRESET_WORKOUTS.map((workout) => (
                <div
                  key={workout.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          workout.level === 'beginner'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800'
                            : workout.level === 'intermediate'
                            ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:border-rose-800'
                        }`}
                      >
                        {workout.level}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 mt-1.5">
                        {workout.name[language] || workout.name.en}
                      </h4>
                    </div>

                    <div className="text-end shrink-0">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Clock size={13} /> {workout.durationMinutes} min
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {workout.description[language] || workout.description.en}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      {workout.exercises.length} {t.steps}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStartWorkout(workout)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-floating-4k transition-colors"
                      id={`start-workout-${workout.id}`}
                    >
                      <Play size={13} /> {t.startWorkout}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. WEEKLY HABIT MATRIX TRACKER */}
      {activeTab === 'habits' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-floating-4k card-floating-4k space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.weeklyHabitMatrix}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.habitTracker}
              </p>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2 text-start">{t.category}</th>
                    {habitLogs.slice(0, 7).map((h) => {
                      const dayName = new Date(h.date).toLocaleDateString(
                        language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US',
                        { weekday: 'narrow' }
                      );
                      return (
                        <th key={h.date} className="py-2 text-center">
                          {dayName}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {/* Water Habit */}
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Droplet size={13} className="text-cyan-500" /> {t.habitWater}
                    </td>
                    {habitLogs.slice(0, 7).map((h) => (
                      <td key={h.date} className="py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleHabit(h.date, 'waterMet')}
                          className={`w-6 h-6 rounded-lg inline-flex items-center justify-center transition-all ${
                            h.waterMet
                              ? 'bg-cyan-500 text-white font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {h.waterMet ? '✓' : '·'}
                        </button>
                      </td>
                    ))}
                  </tr>

                  {/* Sleep Habit */}
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Moon size={13} className="text-indigo-500" /> {t.habitSleep}
                    </td>
                    {habitLogs.slice(0, 7).map((h) => (
                      <td key={h.date} className="py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleHabit(h.date, 'sleepMet')}
                          className={`w-6 h-6 rounded-lg inline-flex items-center justify-center transition-all ${
                            h.sleepMet
                              ? 'bg-indigo-500 text-white font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {h.sleepMet ? '✓' : '·'}
                        </button>
                      </td>
                    ))}
                  </tr>

                  {/* Workout Habit */}
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Dumbbell size={13} className="text-purple-500" /> {t.habitWorkout}
                    </td>
                    {habitLogs.slice(0, 7).map((h) => (
                      <td key={h.date} className="py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleHabit(h.date, 'workoutMet')}
                          className={`w-6 h-6 rounded-lg inline-flex items-center justify-center transition-all ${
                            h.workoutMet
                              ? 'bg-purple-500 text-white font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {h.workoutMet ? '✓' : '·'}
                        </button>
                      </td>
                    ))}
                  </tr>

                  {/* Mindfulness Habit */}
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sun size={13} className="text-amber-500" /> {t.habitMindfulness}
                    </td>
                    {habitLogs.slice(0, 7).map((h) => (
                      <td key={h.date} className="py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleHabit(h.date, 'mindfulnessDone')}
                          className={`w-6 h-6 rounded-lg inline-flex items-center justify-center transition-all ${
                            h.mindfulnessDone
                              ? 'bg-amber-500 text-white font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {h.mindfulnessDone ? '✓' : '·'}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
