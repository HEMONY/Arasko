export type PriorityLevel = 'urgent' | 'important' | 'normal';

export type CompletionStatus = 'not_started' | 'in_progress' | 'completed' | 'postponed';

export type RecurrenceOption = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export type LanguageCode = 'ar' | 'en' | 'fr';

export type ThemeMode = 'dark' | 'light' | 'system';

export type SoundChoice = 'chime' | 'bell' | 'ping' | 'zen' | 'harp' | 'none' | string;

export type SadSoundChoice =
  | 'arasko_sad_1'
  | 'arasko_sad_2'
  | 'sad_oud_lament'
  | 'sad_qanun_sigh'
  | 'sad_violin'
  | 'sad_piano'
  | 'sad_sigh'
  | 'sad_rain'
  | 'sad_defeat'
  | 'sad_alarm'
  | 'none'
  | string;

export interface CustomToneItem {
  id: string;
  name: string;
  category?: 'general' | 'sad' | 'workout';
  durationSeconds?: number;
  dataUrl?: string; // base64 or blob URL
  fileName?: string;
  fileSizeKb?: number;
  createdAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface ReminderItem {
  id: string;
  minutesBefore: number; // e.g. 5, 15, 60, 1440
  label?: string;
  triggered?: boolean;
}

export interface TaskCategory {
  id: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  color: string; // Hex or tailwind color
  icon: string; // Lucide icon name
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  priority: PriorityLevel;
  status: CompletionStatus;
  startDate?: string; // YYYY-MM-DDTHH:mm
  dueDate: string; // YYYY-MM-DDTHH:mm or YYYY-MM-DD
  recurrence: RecurrenceOption;
  subTasks: SubTask[];
  reminders: ReminderItem[];
  notes?: string;
  imageAttachment?: string; // Base64 or preset image url
  createdAt: string;
  completedAt?: string;
  isArchived?: boolean;
  estimatedMinutes?: number;
  overdueAlertTriggered?: boolean;
  customSoundChoice?: string;
}

export interface WaterLog {
  date: string; // YYYY-MM-DD
  amountMl: number;
  logs: { time: string; amount: number }[];
}

export interface SleepLog {
  date: string; // YYYY-MM-DD
  bedTime: string; // HH:mm
  wakeTime: string; // HH:mm
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5; // 1 to 5 stars
  notes?: string;
}

export interface ExerciseItem {
  id: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  repsOrDuration: string;
  sets: number;
  restSeconds: number;
  targetMuscle: string;
  instructions: {
    ar: string;
    en: string;
    fr: string;
  };
}

export interface WorkoutRoutine {
  id: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  category: 'mobility' | 'strength' | 'hiit' | 'cardio';
  description: {
    ar: string;
    en: string;
    fr: string;
  };
  exercises: ExerciseItem[];
}

export interface HabitEntry {
  date: string; // YYYY-MM-DD
  waterMet: boolean;
  sleepMet: boolean;
  workoutMet: boolean;
  mealsLogged: number; // 0-3
  mindfulnessDone: boolean;
  stepCount: number;
}

export interface SpiritualDailyLog {
  date?: string;
  completedSurahs?: string[];
  completedAthkar?: string[];
  overallCompleted?: boolean;
  [key: string]: unknown;
}

export interface AppSettings {
  language: LanguageCode;
  theme: ThemeMode;
  notificationsEnabled: boolean;
  soundChoice: SoundChoice;
  vibrationEnabled: boolean;
  defaultReminderMinutes: number;
  // Overdue Sad Reminder Melody Feature
  overdueSadSoundEnabled: boolean;
  overdueSadSoundChoice: SadSoundChoice;
  customTones?: CustomToneItem[];
  waterGoalMl: number;
  sleepGoalHours: number;
  stepGoal: number;
  // Hydration Push Notifications
  hydrationPushEnabled?: boolean;
  hydrationReminderIntervalMinutes?: number; // e.g. 60, 120, 180
  hasCompletedOnboarding: boolean;
  // User Profile Personalization
  userName?: string;
  userRoleType?: 'professional' | 'student' | 'other';
  userProfession?: string;
  userProfessionId?: string;
  userStudyTrack?: string;
  userStudentTrackId?: string;
  userCustomField?: string;
  // Spiritual / Islamic Routine Tracking
  spiritualTrackingEnabled?: boolean;
  spiritualRemindersEnabled?: boolean;
  spiritualItemReminders?: Record<string, boolean>; // ward/dhikr ID -> boolean
  spiritualReminderTimes?: Record<string, string>; // ward/dhikr ID -> "HH:mm"
  spiritualDailyLogs?: Record<string, SpiritualDailyLog>; // date -> daily log
  spiritualTasbihCounters?: Record<string, number>;
}

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSession {
  taskId?: string;
  taskTitle?: string;
  mode: PomodoroMode;
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  completedCycles: number;
}

export interface LocalNotificationAlert {
  id: string;
  taskId?: string;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  type: 'task' | 'water' | 'sleep' | 'workout' | 'assistant' | 'overdue' | 'spiritual' | 'pomodoro';
}

export type ActiveTab = 'today' | 'calendar' | 'spiritual' | 'assistant' | 'health' | 'settings';
export type CalendarSubView = 'monthly' | 'yearly';

