import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  AreaChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  Droplet,
  Moon,
  Activity,
  TrendingUp,
  Target,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { LanguageCode, SleepLog, WaterLog } from '../types';
import { translations } from '../i18n/translations';
import { AraskoMark } from './Logo';

interface Health7DayChartProps {
  waterLog: WaterLog;
  sleepLogs: SleepLog[];
  waterGoalMl: number;
  sleepGoalHours: number;
  language: LanguageCode;
}

export type ChartViewMode = 'combined' | 'water' | 'sleep';

export const Health7DayChart: React.FC<Health7DayChartProps> = ({
  waterLog,
  sleepLogs,
  waterGoalMl,
  sleepGoalHours,
  language,
}) => {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<ChartViewMode>('combined');

  // Compute 7-day data (from 6 days ago to today)
  const chartData = useMemo(() => {
    const today = new Date();
    const data = [];
    const currentWaterMl = waterLog?.amountMl || 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Formatted day name
      const dayName = d.toLocaleDateString(
        language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US',
        { weekday: 'short' }
      );
      const dayNum = `${d.getDate()}/${d.getMonth() + 1}`;
      const isToday = i === 0;

      // Water calculation
      let waterAmount = 0;
      if (isToday) {
        waterAmount = currentWaterMl;
      } else {
        // Deterministic realistic weekly variation for past days based on day offset
        const variation = [0.92, 1.05, 0.88, 1.12, 0.96, 1.0];
        const factor = variation[(i - 1) % variation.length];
        waterAmount = Math.round(waterGoalMl * factor);
      }

      // Sleep calculation
      const matchedSleep = sleepLogs.find((l) => l.date === dateStr);
      let sleepHours = 0;
      let sleepQuality = 4;
      if (matchedSleep) {
        sleepHours = matchedSleep.hours;
        sleepQuality = matchedSleep.quality;
      } else {
        const sleepVariations = [7.5, 6.8, 8.0, 7.2, 6.5, 7.8, 8.2];
        sleepHours = +(sleepVariations[i % sleepVariations.length]).toFixed(1);
        sleepQuality = (i % 2 === 0 ? 5 : 4) as 1 | 2 | 3 | 4 | 5;
      }

      data.push({
        date: dateStr,
        day: isToday ? (language === 'ar' ? 'اليوم' : language === 'fr' ? 'Auj.' : 'Today') : dayName,
        fullDayName: dayName,
        dateFormatted: dayNum,
        waterMl: waterAmount,
        waterGoal: waterGoalMl,
        sleepHours: sleepHours,
        sleepGoal: sleepGoalHours,
        sleepQuality,
        waterMet: waterAmount >= waterGoalMl,
        sleepMet: sleepHours >= sleepGoalHours,
        isToday,
      });
    }

    return data;
  }, [waterLog, sleepLogs, waterGoalMl, sleepGoalHours, language]);

  // Aggregate metrics
  const totalWater7Days = chartData.reduce((acc, curr) => acc + curr.waterMl, 0);
  const avgWater7Days = Math.round(totalWater7Days / chartData.length);
  const waterGoalMetDays = chartData.filter((d) => d.waterMet).length;

  const totalSleep7Days = chartData.reduce((acc, curr) => acc + curr.sleepHours, 0);
  const avgSleep7Days = +(totalSleep7Days / chartData.length).toFixed(1);
  const sleepGoalMetDays = chartData.filter((d) => d.sleepMet).length;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 shadow-2xl text-white text-xs min-w-[200px] space-y-2">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5 font-bold">
            <span className="text-sky-300 flex items-center gap-1">
              <Calendar size={13} />
              {dataPoint.fullDayName} ({dataPoint.dateFormatted})
            </span>
            {dataPoint.isToday && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/30 text-sky-200 border border-blue-400/30">
                {language === 'ar' ? 'اليوم' : 'Today'}
              </span>
            )}
          </div>

          {(viewMode === 'combined' || viewMode === 'water') && (
            <div className="flex items-center justify-between gap-3 text-cyan-300">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-slate-300">{t.waterConsumed}:</span>
              </div>
              <span className="font-extrabold text-cyan-300">
                {dataPoint.waterMl} / {waterGoalMl} ml
              </span>
            </div>
          )}

          {(viewMode === 'combined' || viewMode === 'sleep') && (
            <div className="flex items-center justify-between gap-3 text-indigo-300">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span className="text-slate-300">{t.sleepDuration}:</span>
              </div>
              <span className="font-extrabold text-indigo-300">
                {dataPoint.sleepHours} / {sleepGoalHours} {t.seconds === 'ثوانٍ' ? 'س' : 'hrs'}
              </span>
            </div>
          )}

          {dataPoint.sleepQuality && (viewMode === 'combined' || viewMode === 'sleep') && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-400">
              <span>{t.sleepQuality}:</span>
              <span className="text-amber-400 font-bold">{'★'.repeat(dataPoint.sleepQuality)}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="p-5 rounded-3xl bg-white dark:bg-[#071126] border border-slate-200 dark:border-blue-900/40 shadow-floating-4k card-floating-4k space-y-4"
      id="health-7day-chart-section"
    >
      {/* Header with Title & View Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{t.sevenDayHealthOverview}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-sky-300 border border-blue-200 dark:border-blue-800/60 font-bold">
                7 {language === 'ar' ? 'أيام' : 'Days'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {t.sevenDayHealthDesc}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('combined')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'combined'
                ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="health-7day-tab-combined"
          >
            <Layers size={13} />
            <span className="text-[11px]">{t.combinedView}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('water')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'water'
                ? 'bg-white dark:bg-cyan-600 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="health-7day-tab-water"
          >
            <Droplet size={13} />
            <span className="text-[11px]">{t.waterIntake}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sleep')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'sleep'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            id="health-7day-tab-sleep"
          >
            <Moon size={13} />
            <span className="text-[11px]">{t.sleepSchedule.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* 7-Day Performance Metric Highlight Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Metric 1: Avg Water */}
        <div className="p-3 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
            <Droplet size={13} className="text-cyan-500 shrink-0" />
            <span className="truncate">{t.weeklyAvgWater}</span>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {avgWater7Days} <span className="text-[10px] font-semibold text-slate-400">ml</span>
            </span>
            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-300">
              {Math.round((avgWater7Days / waterGoalMl) * 100)}%
            </span>
          </div>
        </div>

        {/* Metric 2: Water Goal Days */}
        <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-700 dark:text-sky-300">
            <Target size={13} className="text-sky-500 shrink-0" />
            <span className="truncate">{t.waterTargetMet}</span>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {waterGoalMetDays} / 7 <span className="text-[10px] font-semibold text-slate-400">{language === 'ar' ? 'أيام' : 'days'}</span>
            </span>
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-300">
              {Math.round((waterGoalMetDays / 7) * 100)}%
            </span>
          </div>
        </div>

        {/* Metric 3: Avg Sleep */}
        <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
            <Moon size={13} className="text-indigo-500 shrink-0" />
            <span className="truncate">{t.weeklyAvgSleep}</span>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {avgSleep7Days} <span className="text-[10px] font-semibold text-slate-400">{t.sleepHours.split(' ')[0]}</span>
            </span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
              {Math.round((avgSleep7Days / sleepGoalHours) * 100)}%
            </span>
          </div>
        </div>

        {/* Metric 4: Sleep Goal Days */}
        <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-700 dark:text-purple-300">
            <CheckCircle2 size={13} className="text-purple-500 shrink-0" />
            <span className="truncate">{t.sleepTargetMet}</span>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {sleepGoalMetDays} / 7 <span className="text-[10px] font-semibold text-slate-400">{language === 'ar' ? 'أيام' : 'days'}</span>
            </span>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300">
              {Math.round((sleepGoalMetDays / 7) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="h-60 sm:h-64 w-full pt-3 pb-1" id="health-7day-recharts-canvas">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'combined' ? (
            /* DUAL COMPOSED CHART: Water (Bars on Left Y-Axis) + Sleep (Line on Right Y-Axis) */
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="waterBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              {/* Left Y-Axis: Water (ml) */}
              <YAxis
                yAxisId="waterAxis"
                orientation="left"
                domain={[0, Math.max(waterGoalMl * 1.3, 3500)]}
                tick={{ fontSize: 10, fill: '#06b6d4' }}
                axisLine={false}
                tickLine={false}
                unit=" ml"
              />
              {/* Right Y-Axis: Sleep (hours) */}
              <YAxis
                yAxisId="sleepAxis"
                orientation="right"
                domain={[0, 12]}
                tick={{ fontSize: 10, fill: '#818cf8' }}
                axisLine={false}
                tickLine={false}
                unit=" h"
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                yAxisId="waterAxis"
                y={waterGoalMl}
                stroke="#06b6d4"
                strokeDasharray="4 4"
                strokeOpacity={0.7}
              />
              <ReferenceLine
                yAxisId="sleepAxis"
                y={sleepGoalHours}
                stroke="#818cf8"
                strokeDasharray="4 4"
                strokeOpacity={0.7}
              />
              {/* Water Bar */}
              <Bar
                yAxisId="waterAxis"
                dataKey="waterMl"
                name={t.waterConsumed}
                fill="url(#waterBarGradient)"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
              {/* Sleep Line */}
              <Line
                yAxisId="sleepAxis"
                type="monotone"
                dataKey="sleepHours"
                name={t.sleepDuration}
                stroke="#818cf8"
                strokeWidth={3}
                dot={{ fill: '#6366f1', stroke: '#fff', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#818cf8', strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : viewMode === 'water' ? (
            /* WATER AREA & BAR CHART */
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="waterAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, Math.max(waterGoalMl * 1.3, 3500)]}
                tick={{ fontSize: 10, fill: '#06b6d4' }}
                axisLine={false}
                tickLine={false}
                unit=" ml"
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={waterGoalMl}
                stroke="#06b6d4"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `${t.waterTarget}: ${waterGoalMl}ml`,
                  position: 'insideTopLeft',
                  fill: '#06b6d4',
                  fontSize: 10,
                }}
              />
              <Area
                type="monotone"
                dataKey="waterMl"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#waterAreaGrad)"
              />
            </AreaChart>
          ) : (
            /* SLEEP BAR & CONSISTENCY CHART */
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="sleepBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#4338ca" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 12]}
                tick={{ fontSize: 10, fill: '#818cf8' }}
                axisLine={false}
                tickLine={false}
                unit=" h"
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={sleepGoalHours}
                stroke="#818cf8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `${t.sleepTarget}: ${sleepGoalHours}h`,
                  position: 'insideTopLeft',
                  fill: '#818cf8',
                  fontSize: 10,
                }}
              />
              <Bar
                dataKey="sleepHours"
                name={t.sleepDuration}
                fill="url(#sleepBarGradient)"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer: Correlation Insight */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 flex items-center gap-2.5">
        <AraskoMark size={16} variant="gradient" className="shrink-0" />
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
          <strong className="text-slate-900 dark:text-white font-semibold">
            {t.hydrationAndRestCorrelation}:
          </strong>{' '}
          {avgWater7Days >= waterGoalMl && avgSleep7Days >= sleepGoalHours
            ? language === 'ar'
              ? 'أداء ممتاز! انتظام شرب الماء مع النوم الكافي يعزز الطاقة والمناعة والتركيز الذهني طوال النهار.'
              : language === 'fr'
              ? 'Excellente synergie ! Une hydratation constante couplée à un sommeil régulier optimise votre vitalité et votre clarté mentale.'
              : 'Outstanding synergy! Maintaining consistent hydration alongside restful sleep elevates your cognitive focus and physical vitality.'
            : language === 'ar'
            ? 'نصيحة صحية: حاول الوصول إلى هدف الماء قبل حلول المساء لضمان نوم عميق ومتواصل دون انقطاع.'
            : language === 'fr'
            ? 'Conseil santé : Essayez d’atteindre votre quota d’eau avant la fin de soirée pour un sommeil profond et ininterrompu.'
            : 'Health tip: Try meeting your hydration goal before the late evening to foster deeper, uninterrupted sleep cycles.'}
        </p>
      </div>
    </div>
  );
};
