import React, { useEffect, useRef, useState } from 'react';
import {
  ActiveTab,
  AppSettings,
  HabitEntry,
  LanguageCode,
  LocalNotificationAlert,
  PriorityLevel,
  SleepLog,
  TaskCategory,
  TaskItem,
  WaterLog,
} from './types';
import { StorageService } from './services/storage';
import { translations } from './i18n/translations';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayView } from './components/TodayView';
import { CalendarView } from './components/CalendarView';
import { SmartAssistantView } from './components/SmartAssistantView';
import { HealthModuleView } from './components/HealthModuleView';
import { SpiritualRoutineView } from './components/SpiritualRoutineView';
import { SettingsView } from './components/SettingsView';
import { ArchiveView } from './components/ArchiveView';
import { TaskModal } from './components/TaskModal';
import { OnboardingModal } from './components/OnboardingModal';
import { NotificationTray } from './components/NotificationTray';
import { PomodoroTimer } from './components/PomodoroTimer';
import { SplashScreen } from './components/SplashScreen';
import { TaskBreakdownTemplate } from './services/smartAssistant';
import {
  playAlertSound,
  playCustomAudioUrl,
  playSadOverdueSound,
  stopAllAudio,
  triggerVibration,
} from './services/soundEngine';
import { AudioStorageService } from './services/audioStorage';
import { fireTaskDoneConfetti } from './utils/confetti';

export default function App() {
  // 1. Persistent State
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [categories, setCategories] = useState<TaskCategory[]>(() =>
    StorageService.getCategories()
  );
  const [tasks, setTasks] = useState<TaskItem[]>(() => StorageService.getTasks());
  const [waterLogs, setWaterLogs] = useState<Record<string, WaterLog>>(() =>
    StorageService.getWaterLogs()
  );
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => StorageService.getSleepLogs());
  const [habitLogs, setHabitLogs] = useState<HabitEntry[]>(() => StorageService.getHabitLogs());
  const [notifications, setNotifications] = useState<LocalNotificationAlert[]>(() =>
    StorageService.getNotifications()
  );

  // 2. Navigation & UI State
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isNotificationTrayOpen, setIsNotificationTrayOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(
    () => !settings.hasCompletedOnboarding
  );

  // 3. Task & Focus Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [selectedCalendarDateStr, setSelectedCalendarDateStr] = useState<string | undefined>();
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [pomodoroTaskId, setPomodoroTaskId] = useState<string | undefined>();

  const handleStartPomodoro = (task?: TaskItem) => {
    setPomodoroTaskId(task?.id);
    setIsPomodoroOpen(true);
  };

  const handlePomodoroNotify = (title: string, body: string) => {
    const alert: LocalNotificationAlert = {
      id: `pomodoro_${Date.now()}`,
      title,
      body,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'pomodoro',
    };
    const updated = [alert, ...notifications];
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  // 4. System & State-Driven Theme Resolution
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isDarkMode = settings.theme === 'dark' || (settings.theme === 'system' && systemPrefersDark);

  const language = settings.language || 'ar';
  const t = translations[language];

  // Ref to hold current state inside the overdue & reminder interval without stale closure
  const stateRef = useRef({ tasks, settings, notifications, language, waterLogs });
  useEffect(() => {
    stateRef.current = { tasks, settings, notifications, language, waterLogs };
  }, [tasks, settings, notifications, language, waterLogs]);

  // Sync RTL / LTR, Document Theme Class & Color Scheme
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [language, isDarkMode]);

  // Background Task Engine: Overdue Sad Tone Detection & Upcoming Reminders Check
  useEffect(() => {
    const checkScheduleAndOverdue = async () => {
      const { tasks: currentTasks, settings: curSettings, notifications: curNotifs, language: curLang } =
        stateRef.current;
      const now = new Date();
      const currentMs = now.getTime();
      let hasTasksUpdated = false;
      let hasNotifsUpdated = false;
      const updatedTasks = [...currentTasks];
      const newNotifs = [...curNotifs];
      const curT = translations[curLang];

      for (let i = 0; i < updatedTasks.length; i++) {
        const task = updatedTasks[i];
        // Strictly skip tasks that are completed, archived, or lack due dates
        if (task.status === 'completed' || task.completedAt || task.isArchived || !task.dueDate) {
          continue;
        }

        const dueMs = new Date(task.dueDate).getTime();
        if (isNaN(dueMs)) continue;

        // 1. Check Overdue Condition - trigger once only when task is active, uncompleted and past due
        if (dueMs < currentMs && !task.overdueAlertTriggered) {
          updatedTasks[i] = { ...task, overdueAlertTriggered: true };
          hasTasksUpdated = true;

          // Trigger Sad Overdue Sound if enabled
          if (curSettings.overdueSadSoundEnabled) {
            const sadChoice = curSettings.overdueSadSoundChoice || 'sad_violin';
            if (sadChoice.startsWith('custom_')) {
              const toneId = sadChoice.replace('custom_', '');
              const tone = await AudioStorageService.getTone(toneId);
              if (tone) {
                playCustomAudioUrl(tone.dataUrl, sadChoice);
              } else {
                playSadOverdueSound('sad_violin');
              }
            } else {
              playSadOverdueSound(sadChoice);
            }
            triggerVibration(curSettings.vibrationEnabled, [150, 100, 150]);
          }

          // Push local overdue notification to tray
          newNotifs.unshift({
            id: `notif_overdue_${task.id}_${Date.now()}`,
            title: `${curT.overdueBadge} ${task.title}`,
            body: curT.taskOverdueAlertBody,
            timestamp: new Date().toISOString(),
            isRead: false,
            type: 'overdue',
            taskId: task.id,
          });
          hasNotifsUpdated = true;
        }

        // 2. Check Upcoming Reminders for uncompleted tasks
        if (task.reminders && task.reminders.length > 0) {
          const updatedReminders = task.reminders.map((rem) => {
            if (rem.triggered) return rem;
            const remindMs = dueMs - rem.minutesBefore * 60 * 1000;
            if (currentMs >= remindMs && currentMs < dueMs) {
              // Trigger reminder
              if (curSettings.notificationsEnabled) {
                playAlertSound(task.customSoundChoice || curSettings.soundChoice);
                triggerVibration(curSettings.vibrationEnabled, [100, 50, 100]);
              }

              newNotifs.unshift({
                id: `notif_rem_${task.id}_${rem.id}`,
                title: task.title,
                body: `${curT.reminders}: ${rem.minutesBefore}m`,
                timestamp: new Date().toISOString(),
                isRead: false,
                type: 'task',
                taskId: task.id,
              });
              hasNotifsUpdated = true;
              return { ...rem, triggered: true };
            }
            return rem;
          });

          if (JSON.stringify(updatedReminders) !== JSON.stringify(task.reminders)) {
            updatedTasks[i] = { ...task, reminders: updatedReminders };
            hasTasksUpdated = true;
          }
        }
      }

      // 3. Check Spiritual Quran Wards & Daily Athkar Reminders
      if (curSettings.spiritualRemindersEnabled !== false && curSettings.notificationsEnabled) {
        const nowDate = new Date();
        const currentHH = nowDate.getHours().toString().padStart(2, '0');
        const currentMM = nowDate.getMinutes().toString().padStart(2, '0');
        const currentTimeStr = `${currentHH}:${currentMM}`;
        const todayDateKey = nowDate.toISOString().split('T')[0];

        const spiritualSchedule = [
          {
            id: 'ward_fajr_yasin',
            titleAr: 'ورد سورة يس (بعد صلاة الصبح)',
            titleEn: 'Surah Yasin Ward (After Fajr Prayer)',
            defaultTime: '05:30',
          },
          {
            id: 'ward_dhuhr_waqiah',
            titleAr: 'ورد سورة الواقعة (بعد صلاة الظهر)',
            titleEn: 'Surah Al-Waqiah Ward (After Dhuhr Prayer)',
            defaultTime: '12:45',
          },
          {
            id: 'ward_asr_rahman',
            titleAr: 'ورد سورة الرحمن (بعد صلاة العصر)',
            titleEn: 'Surah Ar-Rahman Ward (After Asr Prayer)',
            defaultTime: '16:00',
          },
          {
            id: 'ward_maghrib_dukhan',
            titleAr: 'ورد سورة الدخان (بعد صلاة المغرب)',
            titleEn: 'Surah Ad-Dukhan Ward (After Maghrib Prayer)',
            defaultTime: '18:30',
          },
          {
            id: 'ward_isha_mulk',
            titleAr: 'ورد سورة الملك (بعد صلاة العشاء)',
            titleEn: 'Surah Al-Mulk Ward (After Isha Prayer)',
            defaultTime: '20:15',
          },
          {
            id: 'athkar_waking',
            titleAr: 'أذكار الاستيقاظ المباركة',
            titleEn: 'Waking Up Athkar',
            defaultTime: '06:00',
          },
          {
            id: 'athkar_morning',
            titleAr: 'أذكار الصباح وحصن المسلم',
            titleEn: 'Morning Athkar',
            defaultTime: '07:00',
          },
          {
            id: 'athkar_evening',
            titleAr: 'أذكار المساء وحفظ اليوم',
            titleEn: 'Evening Athkar',
            defaultTime: '17:00',
          },
          {
            id: 'athkar_sleeping',
            titleAr: 'أذكار النوم وسور التحصين',
            titleEn: 'Bedtime & Sleep Athkar',
            defaultTime: '22:00',
          },
        ];

        const itemReminders = curSettings.spiritualItemReminders || {};
        const customTimes = curSettings.spiritualReminderTimes || {};

        for (const item of spiritualSchedule) {
          const isItemActive = itemReminders[item.id] !== false;
          if (!isItemActive) continue;

          const scheduledTime = customTimes[item.id] || item.defaultTime;
          // Trigger within the active minute if not already notified today
          if (currentTimeStr === scheduledTime) {
            const notifKey = `spiritual_${item.id}_${todayDateKey}`;
            const alreadyFired = newNotifs.some((n) => n.id.startsWith(`notif_${notifKey}`));

            if (!alreadyFired) {
              playAlertSound('chime');
              triggerVibration(curSettings.vibrationEnabled, [120, 60, 120]);

              newNotifs.unshift({
                id: `notif_${notifKey}_${Date.now()}`,
                title: curLang === 'ar' ? `🕌 ${item.titleAr}` : `🕌 ${item.titleEn}`,
                body:
                  curLang === 'ar'
                    ? 'حان موعد وردك اليومي المبارك. لا تنسَ ذكر الله وقراءة السورة.'
                    : 'Time for your blessed daily Quran/Dhikr routine.',
                timestamp: new Date().toISOString(),
                isRead: false,
                type: 'spiritual',
              });
              hasNotifsUpdated = true;
            }
          }
        }
      }

      // 4. Check Hydration Push Reminders (Active during day 08:00 - 22:00 if intake < goal)
      if (curSettings.hydrationPushEnabled !== false && curSettings.notificationsEnabled) {
        const nowDate = new Date();
        const currentHour = nowDate.getHours();
        if (currentHour >= 8 && currentHour <= 22) {
          const todayDateKey = nowDate.toISOString().split('T')[0];
          const todayLog = stateRef.current.waterLogs[todayDateKey];
          const currentWater = todayLog ? todayLog.amountMl : 0;
          const targetWater = curSettings.waterGoalMl || 2500;

          if (currentWater < targetWater) {
            const intervalMin = curSettings.hydrationReminderIntervalMinutes || 60;
            const currentMin = nowDate.getMinutes();
            const isIntervalTick = intervalMin >= 60 ? currentMin === 0 : currentMin % intervalMin === 0;

            if (isIntervalTick) {
              const hydrationNotifKey = `hydration_${todayDateKey}_${currentHour}_${Math.floor(currentMin / 15)}`;
              const alreadyFired = newNotifs.some((n) => n.id.startsWith(`notif_${hydrationNotifKey}`));

              if (!alreadyFired) {
                playAlertSound('water_droplet');
                triggerVibration(curSettings.vibrationEnabled, [80, 40, 80]);

                const remaining = targetWater - currentWater;
                const pushTitle = curT.hydrationPushReminderTitle;
                const pushBody = `${curT.hydrationPushBelowTargetAlert} (${currentWater}/${targetWater} ml - ${curT.remainingWaterToGoal}: ${remaining} ml)`;

                if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                  try {
                    new Notification(pushTitle, {
                      body: pushBody,
                      icon: '/favicon.ico',
                    });
                  } catch (e) {
                    console.warn('Native push error:', e);
                  }
                }

                newNotifs.unshift({
                  id: `notif_${hydrationNotifKey}_${Date.now()}`,
                  title: `💧 ${pushTitle}`,
                  body: pushBody,
                  timestamp: new Date().toISOString(),
                  isRead: false,
                  type: 'water',
                });
                hasNotifsUpdated = true;
              }
            }
          }
        }
      }

      if (hasTasksUpdated) {
        stateRef.current.tasks = updatedTasks;
        setTasks(updatedTasks);
        StorageService.saveTasks(updatedTasks);
      }
      if (hasNotifsUpdated) {
        stateRef.current.notifications = newNotifs;
        setNotifications(newNotifs);
        StorageService.saveNotifications(newNotifs);
      }
    };

    // Run immediately and every 15 seconds
    checkScheduleAndOverdue();
    const interval = setInterval(checkScheduleAndOverdue, 15000);
    return () => clearInterval(interval);
  }, []);

  // Today's water log helper
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWater = waterLogs[todayStr] || {
    date: todayStr,
    amountMl: 0,
    logs: [],
  };

  // Safe State Synchronizers
  const handleUpdateSettings = (newSettings: AppSettings) => {
    try {
      setSettings(newSettings);
      StorageService.saveSettings(newSettings);
    } catch (err) {
      console.warn('Failed to update settings safely:', err);
    }
  };

  const handleUpdateCategories = (newCats: TaskCategory[]) => {
    try {
      setCategories(newCats);
      StorageService.saveCategories(newCats);
    } catch (err) {
      console.warn('Failed to update categories safely:', err);
    }
  };

  const handleUpdateTasks = (newTasks: TaskItem[]) => {
    try {
      setTasks(newTasks);
      StorageService.saveTasks(newTasks);
    } catch (err) {
      console.warn('Failed to update tasks safely:', err);
    }
  };

  /**
   * Atomic handleSaveTask with quota safety and overdue state management
   */
  const handleSaveTask = (taskToSave: TaskItem) => {
    try {
      const existingTask = tasks.find((t) => t.id === taskToSave.id);
      let sanitizedTask = { ...taskToSave };

      // If user marks a task completed directly in the modal, stop overdue sounds and mark alert triggered
      if (sanitizedTask.status === 'completed') {
        stopAllAudio();
        sanitizedTask.overdueAlertTriggered = true;
        if (!sanitizedTask.completedAt) {
          sanitizedTask.completedAt = new Date().toISOString();
        }
      } else if (
        // Reset overdue alert trigger if due date has moved to the future
        existingTask &&
        existingTask.dueDate !== taskToSave.dueDate &&
        taskToSave.dueDate &&
        new Date(taskToSave.dueDate).getTime() > Date.now()
      ) {
        sanitizedTask.overdueAlertTriggered = false;
      }

      let updatedTasks: TaskItem[];
      if (existingTask) {
        updatedTasks = tasks.map((t) => (t.id === sanitizedTask.id ? sanitizedTask : t));
      } else {
        updatedTasks = [sanitizedTask, ...tasks];
        // Trigger sound feedback for new task creation
        playAlertSound(sanitizedTask.customSoundChoice || settings.soundChoice);
      }

      handleUpdateTasks(updatedTasks);
    } catch (err) {
      console.error('Error saving task atomically:', err);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    stopAllAudio();
    const updated = tasks.filter((t) => t.id !== taskId);
    handleUpdateTasks(updated);
  };

  const handleToggleComplete = (task: TaskItem, e?: React.MouseEvent) => {
    const isNowCompleted = task.status !== 'completed';

    // When marking as completed, immediately halt any playing sad overdue alerts or custom audio
    if (isNowCompleted) {
      stopAllAudio();
    }

    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return {
          ...t,
          status: (isNowCompleted ? 'completed' : 'not_started') as any,
          completedAt: isNowCompleted ? new Date().toISOString() : undefined,
          // When completed, set overdueAlertTriggered to true so it never triggers background overdue alarms.
          // When reopened, if dueDate is in the past, keep overdueAlertTriggered true so it doesn't blare immediately upon unticking.
          overdueAlertTriggered: true,
        };
      }
      return t;
    });

    handleUpdateTasks(updatedTasks);

    if (isNowCompleted) {
      const coords = e ? { x: e.clientX, y: e.clientY } : undefined;
      fireTaskDoneConfetti(coords);
      playAlertSound('chime');
      triggerVibration(settings.vibrationEnabled, [80, 40, 80]);
    }
  };

  const handleUpdateWater = (log: WaterLog) => {
    const updated = { ...waterLogs, [log.date]: log };
    setWaterLogs(updated);
    StorageService.saveWaterLogs(updated);
  };

  const handleAddSleepLog = (log: SleepLog) => {
    const updated = [log, ...sleepLogs];
    setSleepLogs(updated);
    StorageService.saveSleepLogs(updated);
  };

  const handleUpdateHabitLogs = (habits: HabitEntry[]) => {
    setHabitLogs(habits);
    StorageService.saveHabitLogs(habits);
  };

  // Task Breakdown Wizard application from Smart Assistant
  const handleApplyBreakdownToTask = (template: TaskBreakdownTemplate) => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dueTimeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}T18:00`;

    const subTasksList = template.steps.map((st, idx) => ({
      id: `sub_${Date.now()}_${idx}`,
      title: st[language] || st.en,
      isCompleted: false,
    }));

    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      title: t[template.titleKey as keyof typeof t] || template.id,
      description: t.breakdownDesc,
      categoryId: template.categoryHint || categories[0]?.id || 'cat_work',
      priority: 'important',
      status: 'not_started',
      dueDate: dueTimeStr,
      recurrence: 'none',
      subTasks: subTasksList,
      reminders: [{ id: `rem_${Date.now()}`, minutesBefore: 15 }],
      createdAt: new Date().toISOString(),
    };

    handleUpdateTasks([newTask, ...tasks]);
    playAlertSound('bell');
  };

  // Direct push notification helper
  const handleAddNotification = (alert: LocalNotificationAlert) => {
    const updated = [alert, ...notifications];
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  // Test Notification simulation
  const handleTestNotification = () => {
    playAlertSound(settings.soundChoice);
    triggerVibration(settings.vibrationEnabled, [100, 50, 100]);

    const alert: LocalNotificationAlert = {
      id: `notif_${Date.now()}`,
      title: `${t.appName} - ${t.testNotification}`,
      body: t.notificationSimulated,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'task',
    };

    const updated = [alert, ...notifications];
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  // Export JSON Backup file
  const handleExportBackup = () => {
    const jsonStr = StorageService.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arasko_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup file or raw string
  const handleImportBackup = (fileOrString: File | string) => {
    const processContent = (content: string) => {
      const success = StorageService.importBackup(content);
      if (success) {
        setSettings(StorageService.getSettings());
        setTasks(StorageService.getTasks());
        setCategories(StorageService.getCategories());
        setWaterLogs(StorageService.getWaterLogs());
        setSleepLogs(StorageService.getSleepLogs());
        setHabitLogs(StorageService.getHabitLogs());
        setNotifications(StorageService.getNotifications());
        playAlertSound('bell');
        return true;
      } else {
        return false;
      }
    };

    if (typeof fileOrString === 'string') {
      return processContent(fileOrString);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const ok = processContent(content);
        if (ok) {
          alert(t.importSuccess);
        } else {
          alert(t.importError);
        }
      };
      reader.readAsText(fileOrString);
    }
  };

  // Factory Reset
  const handleResetAllData = () => {
    StorageService.resetAllData();
    window.location.reload();
  };

  // Explicitly Clear All User Data while retaining default app config
  const handleClearUserData = () => {
    const success = StorageService.clearAllUserData();
    if (success) {
      setTasks([]);
      setWaterLogs(StorageService.getWaterLogs());
      setSleepLogs([]);
      setHabitLogs([]);
      setSettings(StorageService.getSettings());
      setNotifications(StorageService.getNotifications());
      playAlertSound('bell');
      alert(t.clearUserDataSuccess);
    }
  };

  // Add bulk tasks (e.g. from Spiritual Routine or Personalized Profile Templates)
  const handleAddBulkTasks = (tasksToAdd: Partial<TaskItem>[]) => {
    try {
      const newItems: TaskItem[] = tasksToAdd.map((t, idx) => ({
        id: `task_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        title: t.title || 'Untitled Task',
        description: t.description || '',
        priority: t.priority || 'normal',
        status: t.status || 'not_started',
        dueDate: t.dueDate || new Date().toISOString().split('T')[0],
        categoryId: t.categoryId || categories[0]?.id || 'cat_personal',
        recurrence: t.recurrence || 'none',
        subTasks: t.subTasks || [],
        reminders: t.reminders || [],
        createdAt: new Date().toISOString(),
      }));
      handleUpdateTasks([...newItems, ...tasks]);
    } catch (err) {
      console.error('Error adding bulk tasks:', err);
    }
  };

  // Batch Update Tasks (e.g. from Select Multiple mode)
  const handleBatchUpdateTasks = (taskIds: string[], update: Partial<TaskItem>) => {
    const updated = tasks.map((t) => (taskIds.includes(t.id) ? { ...t, ...update } : t));
    handleUpdateTasks(updated);
  };

  // Batch Delete Tasks
  const handleBatchDeleteTasks = (taskIds: string[]) => {
    const updated = tasks.filter((t) => !taskIds.includes(t.id));
    handleUpdateTasks(updated);
  };

  // Quick Add Task from Pinned Floating Button
  const handleQuickAddTask = (title: string, categoryId?: string, priority?: PriorityLevel) => {
    const newTask: TaskItem = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      description: '',
      priority: priority || 'normal',
      status: 'not_started',
      dueDate: new Date().toISOString().split('T')[0],
      categoryId: categoryId || categories[0]?.id || 'cat_work',
      recurrence: 'none',
      subTasks: [],
      reminders: [],
      createdAt: new Date().toISOString(),
    };
    handleUpdateTasks([newTask, ...tasks]);
  };

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggleThemeQuick = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    handleUpdateSettings({ ...settings, theme: nextTheme });
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'dark' : ''
      } bg-[var(--app-bg)] text-[var(--app-fg)] flex flex-col font-sans transition-colors duration-200 selection:bg-blue-600 selection:text-white relative overflow-x-hidden`}
      id="app-root-container"
    >
      {/* Ambient Dark-Blue & Deep-Slate Background Glow Elements */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 -z-10 w-96 h-96 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-10 -z-10 w-80 h-80 bg-sky-600/5 dark:bg-slate-800/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/3 right-1/4 -z-10 w-64 h-64 bg-slate-500/5 dark:bg-blue-950/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={(lang) => handleUpdateSettings({ ...settings, language: lang })}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleThemeQuick}
        onAddTask={() => {
          setEditingTask(null);
          setSelectedCalendarDateStr(undefined);
          setIsTaskModalOpen(true);
        }}
        onOpenNotifications={() => setIsNotificationTrayOpen(true)}
        onOpenPomodoro={() => handleStartPomodoro()}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-5">
        {isArchiveOpen ? (
          <ArchiveView
            tasks={tasks}
            categories={categories}
            language={language}
            onBack={() => setIsArchiveOpen(false)}
            onRestoreTask={(task) => {
              const updated = tasks.map((t) =>
                t.id === task.id ? { ...t, isArchived: false, status: 'not_started' as any } : t
              );
              handleUpdateTasks(updated);
            }}
            onPermanentDelete={handleDeleteTask}
          />
        ) : (
          <>
            {activeTab === 'today' && (
              <TodayView
                tasks={tasks}
                categories={categories}
                language={language}
                onAddTask={() => {
                  setEditingTask(null);
                  setSelectedCalendarDateStr(undefined);
                  setIsTaskModalOpen(true);
                }}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onStartPomodoro={handleStartPomodoro}
                onBatchUpdateTasks={handleBatchUpdateTasks}
                onBatchDeleteTasks={handleBatchDeleteTasks}
                onQuickAddTask={handleQuickAddTask}
                userName={settings.userName}
                userProfession={settings.userProfessionCustom || settings.userProfessionId}
                userStudyTrack={settings.userStudentTrackCustom || settings.userStudentTrackId}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                tasks={tasks}
                categories={categories}
                language={language}
                onAddTaskForDate={(dateStr) => {
                  setEditingTask(null);
                  setSelectedCalendarDateStr(dateStr);
                  setIsTaskModalOpen(true);
                }}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
                onToggleComplete={handleToggleComplete}
              />
            )}

            {activeTab === 'spiritual' && (
              <SpiritualRoutineView
                settings={settings}
                language={language}
                onUpdateSettings={handleUpdateSettings}
                onAddTasksToToday={handleAddBulkTasks}
              />
            )}

            {activeTab === 'assistant' && (
              <SmartAssistantView
                tasks={tasks}
                categories={categories}
                language={language}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
                onToggleComplete={handleToggleComplete}
                onUpdateTasks={handleUpdateTasks}
                onApplyBreakdownToTask={handleApplyBreakdownToTask}
              />
            )}

            {activeTab === 'health' && (
              <HealthModuleView
                waterLog={todayWater}
                sleepLogs={sleepLogs}
                habitLogs={habitLogs}
                language={language}
                waterGoalMl={settings.waterGoalMl || 2500}
                sleepGoalHours={settings.sleepGoalHours || 8}
                stepGoal={settings.stepGoal || 8000}
                onUpdateWater={handleUpdateWater}
                onAddSleepLog={handleAddSleepLog}
                onUpdateHabitLogs={handleUpdateHabitLogs}
                vibrationEnabled={settings.vibrationEnabled}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onSendNotification={handleAddNotification}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                categories={categories}
                language={language}
                onUpdateSettings={handleUpdateSettings}
                onUpdateCategories={handleUpdateCategories}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                onResetAllData={handleResetAllData}
                onClearUserData={handleClearUserData}
                onReopenOnboarding={() => setIsOnboardingOpen(true)}
                onOpenArchive={() => setIsArchiveOpen(true)}
                onApplyTemplateToTasks={handleAddBulkTasks}
              />
            )}
          </>
        )}
      </main>

      {/* Instant High-Resolution Midnight Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Bottom Ergonomic Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setIsArchiveOpen(false);
          setActiveTab(tab);
        }}
        language={language}
      />

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialTask={editingTask}
        categories={categories}
        language={language}
        selectedDateStr={selectedCalendarDateStr}
      />

      {/* Onboarding Flow Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={() => {
          setIsOnboardingOpen(false);
          handleUpdateSettings({ ...settings, hasCompletedOnboarding: true });
        }}
        language={language}
      />

      {/* Pomodoro Focus Timer Modal / Float */}
      <PomodoroTimer
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        language={language}
        tasks={tasks}
        initialTaskId={pomodoroTaskId}
        onTaskComplete={(taskId) => {
          const task = tasks.find((t) => t.id === taskId);
          if (task) {
            handleToggleComplete(task);
          }
        }}
        onNotify={handlePomodoroNotify}
      />

      {/* Notification Center Tray */}
      <NotificationTray
        isOpen={isNotificationTrayOpen}
        onClose={() => setIsNotificationTrayOpen(false)}
        notifications={notifications}
        onClearAll={() => {
          setNotifications([]);
          StorageService.saveNotifications([]);
        }}
        onTestNotification={handleTestNotification}
        language={language}
      />
    </div>
  );
}
