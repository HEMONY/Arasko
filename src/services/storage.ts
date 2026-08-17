import {
  AppSettings,
  HabitEntry,
  LocalNotificationAlert,
  SleepLog,
  TaskCategory,
  TaskItem,
  WaterLog,
  WorkoutRoutine,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'arasko_settings_v1',
  TASKS: 'arasko_tasks_v1',
  CATEGORIES: 'arasko_categories_v1',
  WATER_LOGS: 'arasko_water_logs_v1',
  SLEEP_LOGS: 'arasko_sleep_logs_v1',
  HABIT_LOGS: 'arasko_habit_logs_v1',
  NOTIFICATIONS: 'arasko_notifications_v1',
  ACTIVE_STREAK: 'arasko_streak_v1',
};

// In-Memory Fallback Cache to ensure zero data loss or crashes during quota exhaustion
const memoryCache: Record<string, string> = {};

/**
 * Safe JSON parser with custom validator
 */
function safeJsonParse<T>(jsonStr: string | null, validator?: (val: unknown) => boolean): T | null {
  if (!jsonStr) return null;
  try {
    const parsed = JSON.parse(jsonStr);
    if (validator && !validator(parsed)) {
      console.warn('Storage: Data failed schema validation, resetting to fallback.');
      return null;
    }
    return parsed as T;
  } catch (err) {
    console.warn('Storage: Corrupted JSON detected, recovering gracefully:', err);
    return null;
  }
}

/**
 * Atomic Write implementation to prevent half-written/corrupted localStorage entries
 * and gracefully handle browser quota exceeded limits.
 */
function atomicSetItem(key: string, value: unknown): boolean {
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch (err) {
    console.error(`Storage: Failed to stringify value for key ${key}:`, err);
    return false;
  }

  // Always keep in-memory cache synchronized as instant safety net
  memoryCache[key] = serialized;

  if (typeof window === 'undefined' || !window.localStorage) {
    return true;
  }

  const stagingKey = `${key}_staging_tmp`;

  try {
    // 1. Write to temporary staging key first
    localStorage.setItem(stagingKey, serialized);

    // 2. Commit to final destination key
    localStorage.setItem(key, serialized);

    // 3. Clean up staging key
    localStorage.removeItem(stagingKey);
    return true;
  } catch (err: unknown) {
    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED');

    console.warn(
      `Storage: LocalStorage write failed for key "${key}" (Quota: ${isQuota}). Falling back to memory cache:`,
      err
    );

    // Clean up staging key if left over
    try {
      localStorage.removeItem(stagingKey);
    } catch {
      // ignore
    }

    if (isQuota) {
      // Attempt quota recovery: prune old read notifications or excess temp keys
      try {
        const notifs = safeJsonParse<LocalNotificationAlert[]>(
          localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
        );
        if (notifs && notifs.length > 15) {
          // Retain only latest 15 notifications
          const pruned = notifs.slice(0, 15);
          localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(pruned));
        }

        // Retry writing the essential data after pruning
        localStorage.setItem(key, serialized);
        return true;
      } catch {
        console.warn('Storage: Memory cache active, user session remains uninterrupted.');
      }
    }

    return false;
  }
}

/**
 * Safe getItem with fallback to memoryCache
 */
function safeGetItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const data = localStorage.getItem(key);
      if (data) return data;
    } catch (e) {
      console.warn(`Storage: Failed to read key ${key} from localStorage:`, e);
    }
  }
  return memoryCache[key] || null;
}

export const DEFAULT_CATEGORIES: TaskCategory[] = [
  {
    id: 'cat_work',
    name: {
      ar: 'العمل والمشاريع',
      en: 'Work & Projects',
      fr: 'Travail & Projets',
    },
    color: '#4F46E5', // Indigo
    icon: 'Briefcase',
  },
  {
    id: 'cat_personal',
    name: {
      ar: 'شخصي وحياة',
      en: 'Personal Life',
      fr: 'Vie Personnelle',
    },
    color: '#059669', // Emerald
    icon: 'User',
  },
  {
    id: 'cat_health',
    name: {
      ar: 'صحة ولياقة',
      en: 'Health & Fitness',
      fr: 'Santé & Forme',
    },
    color: '#E11D48', // Rose
    icon: 'Heart',
  },
  {
    id: 'cat_study',
    name: {
      ar: 'دراسة وتطوير',
      en: 'Study & Learning',
      fr: 'Études & Savoir',
    },
    color: '#7C3AED', // Violet
    icon: 'BookOpen',
  },
  {
    id: 'cat_finance',
    name: {
      ar: 'مالية وميزانية',
      en: 'Finance & Budget',
      fr: 'Finances & Budget',
    },
    color: '#D97706', // Amber
    icon: 'Wallet',
  },
  {
    id: 'cat_home',
    name: {
      ar: 'المنزل والأسرة',
      en: 'Home & Family',
      fr: 'Maison & Famille',
    },
    color: '#0891B2', // Cyan
    icon: 'Home',
  },
];

export const PRESET_WORKOUTS: WorkoutRoutine[] = [
  {
    id: 'workout_beg_1',
    name: {
      ar: 'مرونة وإطالة وتنشيط الجسم',
      en: 'Full Body Mobility & Core',
      fr: 'Mobilité Globale & Gainage',
    },
    level: 'beginner',
    category: 'mobility',
    durationMinutes: 15,
    description: {
      ar: 'تمارين خفيفة لتليين المفاصل وتنشيط الدورة الدموية وتقوية عضلات البطن الأساسية.',
      en: 'Gentle routine to mobilize joints, boost circulation, and build stable core strength.',
      fr: 'Routine douce pour mobiliser les articulations et renforcer les abdominaux.',
    },
    exercises: [
      {
        id: 'ex_1',
        name: {
          ar: 'وضعية القطة والجمل (Cat-Cow)',
          en: 'Cat-Cow Stretch',
          fr: 'Étirement Chat-Vache',
        },
        repsOrDuration: '10 تكرارات / 10 Reps',
        sets: 2,
        restSeconds: 20,
        targetMuscle: 'العمود الفقري والظهر / Spine & Back',
        instructions: {
          ar: 'على اليدين والركبتين، تقويس الظهر لأعلى مع الزفير ثم للأسفل برفق مع الشهيق.',
          en: 'On hands and knees, slowly arch your spine up on exhale, then gently dip on inhale.',
          fr: 'À quatre pattes, arrondissez lentement le dos en expirant, puis creusez en inspirant.',
        },
      },
      {
        id: 'ex_2',
        name: {
          ar: 'بلانك على الساعدين (Plank)',
          en: 'Forearm Plank Hold',
          fr: 'Gainage sur les avant-bras',
        },
        repsOrDuration: '30 ثانية / 30 Seconds',
        sets: 3,
        restSeconds: 30,
        targetMuscle: 'عضلات الجذع والبطن / Core & Abs',
        instructions: {
          ar: 'الحفاظ على استقامة الجسم من الرأس إلى الكعبين وشد عضلات البطن بإحكام.',
          en: 'Maintain a straight line from head to heels, bracing your core tightly.',
          fr: 'Maintenez une ligne droite de la tête aux talons en contractant les abdominaux.',
        },
      },
      {
        id: 'ex_3',
        name: {
          ar: 'سكوات بوزن الجسم (Bodyweight Squats)',
          en: 'Bodyweight Squats',
          fr: 'Squats au poids du corps',
        },
        repsOrDuration: '12 تكرار / 12 Reps',
        sets: 3,
        restSeconds: 30,
        targetMuscle: 'الأرجل والأرداف / Quads & Glutes',
        instructions: {
          ar: 'النزول بالوركين للخلف كما لو كنت تجلس على كرسي مع إبقاء الصدر مرفوعاً.',
          en: 'Hinge hips back and bend knees keeping chest up and weight over mid-foot.',
          fr: 'Fléchissez les genoux en poussant les hanches vers l’arrière, torse bien droit.',
        },
      },
      {
        id: 'ex_4',
        name: {
          ar: 'تمدد الطفل المسترخي (Child’s Pose)',
          en: 'Child’s Pose Restorative Stretch',
          fr: 'Posture de l’enfant',
        },
        repsOrDuration: '45 ثانية / 45 Seconds',
        sets: 2,
        restSeconds: 20,
        targetMuscle: 'الاسترخاء والكتفين / Hips & Shoulders',
        instructions: {
          ar: 'الجلوس على الكعبين ومد الذراعين للأمام على الأرض والتنفس بعمق وهدوء.',
          en: 'Sit back on your heels, extend arms forward on the floor, and breathe deeply.',
          fr: 'Asseyez-vous sur les talons, étendez les bras vers l’avant et respirez profondément.',
        },
      },
    ],
  },
  {
    id: 'workout_int_1',
    name: {
      ar: 'قوة بدنية وحرق دهون HIIT',
      en: 'Strength & HIIT Circuit',
      fr: 'Force & Circuit HIIT',
    },
    level: 'intermediate',
    category: 'hiit',
    durationMinutes: 25,
    description: {
      ar: 'مزيج ديناميكي لتقوية العضلات ورفع معدل ضربات القلب وحرق السعرات الحرارية.',
      en: 'Dynamic mix of bodyweight strength and cardiovascular intervals to boost endurance.',
      fr: 'Mélange dynamique de renforcement musculaire et d’intervalles cardio.',
    },
    exercises: [
      {
        id: 'ex_int_1',
        name: {
          ar: 'تمرين الضغط الكلاسيكي (Push-ups)',
          en: 'Classic Push-ups',
          fr: 'Pompes classiques',
        },
        repsOrDuration: '12-15 تكرار / 12-15 Reps',
        sets: 3,
        restSeconds: 40,
        targetMuscle: 'الصدر والترايسبس / Chest & Triceps',
        instructions: {
          ar: 'إنزال الصدر حتى يقترب من الأرض ثم الدفع للأعلى بقوة وثبات.',
          en: 'Lower chest until just above the floor, then press up explosively.',
          fr: 'Descendez la poitrine près du sol puis repoussez fermement vers le haut.',
        },
      },
      {
        id: 'ex_int_2',
        name: {
          ar: 'الطعنات التبادلية (Alternating Lunges)',
          en: 'Alternating Walking Lunges',
          fr: 'Fentes alternées',
        },
        repsOrDuration: '16 تكرار (8 لكل رجل) / 16 Reps',
        sets: 3,
        restSeconds: 30,
        targetMuscle: 'الأرجل والتوازن / Legs & Balance',
        instructions: {
          ar: 'خطوة للأمام بزاوية 90 درجة للركبتين مع الحفاظ على استقامة الظهر.',
          en: 'Step forward into a 90-degree lunge, keeping your torso upright and core tight.',
          fr: 'Faites un pas en avant en fléchissant les genoux à 90°, torse vertical.',
        },
      },
      {
        id: 'ex_int_3',
        name: {
          ar: 'تسلق الجبال السريع (Mountain Climbers)',
          en: 'Fast Mountain Climbers',
          fr: 'Mountain Climbers rapides',
        },
        repsOrDuration: '30 ثانية / 30 Seconds',
        sets: 3,
        restSeconds: 30,
        targetMuscle: 'الكارديو والبطن / Core & Cardio',
        instructions: {
          ar: 'في وضع البلانك، تبادل سحب الركبتين نحو الصدر بسرعة وإيقاع منتظم.',
          en: 'In plank position, rapidly drive alternating knees towards your chest.',
          fr: 'En position de planche, amenez vivement les genoux vers la poitrine en alternance.',
        },
      },
      {
        id: 'ex_int_4',
        name: {
          ar: 'تمرين الجسر للألوية (Glute Bridges)',
          en: 'Glute Bridges with Squeeze',
          fr: 'Pont fessier avec contraction',
        },
        repsOrDuration: '15 تكرار / 15 Reps',
        sets: 3,
        restSeconds: 30,
        targetMuscle: 'الألوية وأسفل الظهر / Glutes & Hamstrings',
        instructions: {
          ar: 'الاستلقاء على الظهر ورفع الحوض للأعلى مع عصر عضلات الأرداف لمدة ثانيتين.',
          en: 'Lie on back, lift hips high driving through heels and squeeze glutes at the top.',
          fr: 'Allongé sur le dos, levez le bassin en poussant sur les talons et serrez les fessiers.',
        },
      },
    ],
  },
  {
    id: 'workout_adv_1',
    name: {
      ar: 'قوة انفجارية وتحمل رياضي متقدم',
      en: 'Athletic Power & Endurance',
      fr: 'Puissance Athlétique & Endurance',
    },
    level: 'advanced',
    category: 'strength',
    durationMinutes: 35,
    description: {
      ar: 'برنامج مكثف للرياضيين يتضمن تمارين البلايومتريك وتحفيز أقصى مستويات اللياقة.',
      en: 'High intensity conditioning program incorporating plyometrics and maximum output.',
      fr: 'Programme de conditionnement intense pour repousser vos limites physiques.',
    },
    exercises: [
      {
        id: 'ex_adv_1',
        name: {
          ar: 'بيربيز كامل مع قفزة (Full Burpees)',
          en: 'Full Burpees with Jump',
          fr: 'Burpees complets avec saut',
        },
        repsOrDuration: '12 تكرار / 12 Reps',
        sets: 4,
        restSeconds: 45,
        targetMuscle: 'كامل الجسم / Full Body Conditioning',
        instructions: {
          ar: 'النزول للضغط على الأرض، القفز بقوة للأعلى مع تصفيق فوق الرأس.',
          en: 'Drop into a chest-to-floor push-up, jump feet in, and leap high into the air.',
          fr: 'Posez la poitrine au sol en pompe, ramenez les pieds et sautez vers le haut.',
        },
      },
      {
        id: 'ex_adv_2',
        name: {
          ar: 'قفزات السكوات الانفجارية (Jump Squats)',
          en: 'Explosive Jump Squats',
          fr: 'Squats sautés explosifs',
        },
        repsOrDuration: '15 تكرار / 15 Reps',
        sets: 4,
        restSeconds: 40,
        targetMuscle: 'طاقة الأرجل / Explosive Quads',
        instructions: {
          ar: 'سكوات عميق ثم اندفاع بقفزة قوية للأعلى والهبوط بسلاسة على أطراف القدمين.',
          en: 'Squat deep and explosively leap upward, landing softly to absorb impact.',
          fr: 'Descendez en squat puis bondissez puissamment en atterrissant avec souplesse.',
        },
      },
      {
        id: 'ex_adv_3',
        name: {
          ar: 'ضغط الماس (Diamond Push-ups)',
          en: 'Diamond Push-ups',
          fr: 'Pompes diamant',
        },
        repsOrDuration: '12 تكرار / 12 Reps',
        sets: 3,
        restSeconds: 45,
        targetMuscle: 'الترايسبس والوسط / Triceps & Inner Chest',
        instructions: {
          ar: 'وضع الكفين متلاصقين تحت الصدر على شكل ماسة والنزول والارتفاع بدقة.',
          en: 'Form a diamond with your hands beneath chest, lower and press with control.',
          fr: 'Placez vos mains en losange sous le thorax, descendez et remontez avec contrôle.',
        },
      },
    ],
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'ar',
  theme: 'system',
  notificationsEnabled: true,
  soundChoice: 'chime',
  vibrationEnabled: true,
  defaultReminderMinutes: 15,
  overdueSadSoundEnabled: true,
  overdueSadSoundChoice: 'arasko_sad_1',
  waterGoalMl: 2500,
  sleepGoalHours: 8,
  stepGoal: 8000,
  hasCompletedOnboarding: false,
};

function getRelativeDateStr(offsetDays: number, hours = 9, minutes = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hours, minutes, 0, 0);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function getInitialSeedTasks(): TaskItem[] {
  return [
    {
      id: 'task_sample_1',
      title: 'مراجعة التقرير المالي وخطة الربع القادم',
      description: 'تدقيق الأرقام المالية وتجهيز العرض التقديمي للاجتماع مع الإدارة.',
      categoryId: 'cat_work',
      priority: 'urgent',
      status: 'in_progress',
      startDate: getRelativeDateStr(0, 8, 30),
      dueDate: getRelativeDateStr(0, 11, 30),
      recurrence: 'none',
      subTasks: [
        { id: 'sub_1', title: 'مراجعة بنود المصروفات والإيرادات', isCompleted: true },
        { id: 'sub_2', title: 'إعداد الرسوم البيانية والجداول المقارنة', isCompleted: true },
        { id: 'sub_3', title: 'كتابة التوصيات الاستراتيجية', isCompleted: false },
      ],
      reminders: [{ id: 'rem_1', minutesBefore: 30, triggered: false }],
      notes: 'الملفات موجودة على المجلد المشترك.',
      createdAt: new Date().toISOString(),
      estimatedMinutes: 90,
    },
    {
      id: 'task_sample_2',
      title: 'جلسة تدريب مرونة وتليين المفاصل',
      description: 'إنجاز روتين المرونة الصباحي لزيادة الطاقة وتحسين وضعية الجلوس.',
      categoryId: 'cat_health',
      priority: 'important',
      status: 'not_started',
      startDate: getRelativeDateStr(0, 16, 0),
      dueDate: getRelativeDateStr(0, 16, 45),
      recurrence: 'daily',
      subTasks: [
        { id: 'sub_2_1', title: 'إحماء خفيف 5 دقائق', isCompleted: false },
        { id: 'sub_2_2', title: 'إطالة الظهر والرقبة', isCompleted: false },
        { id: 'sub_2_3', title: 'شرب 500 مل ماء بعد التمرين', isCompleted: false },
      ],
      reminders: [{ id: 'rem_2', minutesBefore: 15, triggered: false }],
      createdAt: new Date().toISOString(),
      estimatedMinutes: 45,
    },
    {
      id: 'task_sample_3',
      title: 'قراءة فصلين من كتاب التطوير المهني',
      description: 'التركيز على مهارات إدارة الوقت والتنظيم الذاتي وتدوين أهم الأفكار.',
      categoryId: 'cat_study',
      priority: 'normal',
      status: 'not_started',
      startDate: getRelativeDateStr(0, 20, 0),
      dueDate: getRelativeDateStr(0, 21, 0),
      recurrence: 'daily',
      subTasks: [
        { id: 'sub_3_1', title: 'قراءة الفصل الخامس', isCompleted: false },
        { id: 'sub_3_2', title: 'تلخيص النقاط الذهبية', isCompleted: false },
      ],
      reminders: [{ id: 'rem_3', minutesBefore: 10, triggered: false }],
      createdAt: new Date().toISOString(),
      estimatedMinutes: 60,
    },
    {
      id: 'task_sample_4',
      title: 'شراء المستلزمات الأسبوعية والوجبات الصحية',
      description: 'شراء الخضار والفواكه ومصادر البروتين وتجهيز علب الوجبات.',
      categoryId: 'cat_home',
      priority: 'important',
      status: 'completed',
      completedAt: new Date().toISOString(),
      startDate: getRelativeDateStr(-1, 17, 0),
      dueDate: getRelativeDateStr(-1, 18, 30),
      recurrence: 'weekly',
      subTasks: [
        { id: 'sub_4_1', title: 'إعداد قائمة المشتريات', isCompleted: true },
        { id: 'sub_4_2', title: 'شراء الخضروات الطازجة', isCompleted: true },
      ],
      reminders: [],
      createdAt: new Date().toISOString(),
      estimatedMinutes: 60,
    },
    {
      id: 'task_sample_5',
      title: 'تطوير الخطة السنوية وتحقيق الأهداف الاستثمارية',
      description: 'مراجعة الحساب الادخاري والبحث عن فرص نمو للمحفظة المالية.',
      categoryId: 'cat_finance',
      priority: 'normal',
      status: 'not_started',
      startDate: getRelativeDateStr(2, 10, 0),
      dueDate: getRelativeDateStr(2, 12, 0),
      recurrence: 'monthly',
      subTasks: [
        { id: 'sub_5_1', title: 'تحديد نسبة الادخار للشهر القادم', isCompleted: false },
      ],
      reminders: [{ id: 'rem_5', minutesBefore: 60, triggered: false }],
      createdAt: new Date().toISOString(),
      estimatedMinutes: 120,
    },
  ];
}

export function getInitialSeedHabits(): HabitEntry[] {
  const habits: HabitEntry[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    habits.push({
      date: dateStr,
      waterMet: i !== 3,
      sleepMet: i % 2 === 0,
      workoutMet: i === 0 || i === 2 || i === 4 || i === 6,
      mealsLogged: 3,
      mindfulnessDone: i % 3 === 0,
      stepCount: 6500 + (7 - i) * 350,
    });
  }
  return habits;
}

export function getInitialSeedWater(): WaterLog {
  const d = new Date();
  const dateStr = d.toISOString().split('T')[0];
  return {
    date: dateStr,
    amountMl: 1250,
    logs: [
      { time: '08:15', amount: 250 },
      { time: '10:30', amount: 500 },
      { time: '13:45', amount: 250 },
      { time: '15:20', amount: 250 },
    ],
  };
}

export function getInitialSeedSleep(): SleepLog[] {
  const logs: SleepLog[] = [];
  for (let i = 5; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    logs.push({
      date: dateStr,
      bedTime: '23:30',
      wakeTime: '07:15',
      hours: 7.75,
      quality: 4,
      notes: 'نوم هادئ ومريح ومزاج ممتاز في الصباح.',
    });
  }
  return logs;
}

export const StorageService = {
  getSettings(): AppSettings {
    const data = safeGetItem(STORAGE_KEYS.SETTINGS);
    const parsed = safeJsonParse<Partial<AppSettings>>(
      data,
      (val) => typeof val === 'object' && val !== null
    );
    if (parsed) {
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        overdueSadSoundChoice: parsed.overdueSadSoundChoice || DEFAULT_SETTINGS.overdueSadSoundChoice || 'arasko_sad_1',
      };
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings): boolean {
    return atomicSetItem(STORAGE_KEYS.SETTINGS, settings);
  },

  getTasks(): TaskItem[] {
    const data = safeGetItem(STORAGE_KEYS.TASKS);
    const parsed = safeJsonParse<TaskItem[]>(data, (val) => Array.isArray(val));
    if (parsed && Array.isArray(parsed)) {
      return parsed;
    }
    const initial = getInitialSeedTasks();
    this.saveTasks(initial);
    return initial;
  },

  saveTasks(tasks: TaskItem[]): boolean {
    return atomicSetItem(STORAGE_KEYS.TASKS, tasks);
  },

  getCategories(): TaskCategory[] {
    const data = safeGetItem(STORAGE_KEYS.CATEGORIES);
    const parsed = safeJsonParse<TaskCategory[]>(data, (val) => Array.isArray(val));
    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    this.saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  },

  saveCategories(categories: TaskCategory[]): boolean {
    return atomicSetItem(STORAGE_KEYS.CATEGORIES, categories);
  },

  getWaterLogs(): Record<string, WaterLog> {
    const data = safeGetItem(STORAGE_KEYS.WATER_LOGS);
    const parsed = safeJsonParse<Record<string, WaterLog>>(
      data,
      (val) => typeof val === 'object' && val !== null && !Array.isArray(val)
    );
    if (parsed) return parsed;

    const initialWater = getInitialSeedWater();
    const map = { [initialWater.date]: initialWater };
    this.saveWaterLogs(map);
    return map;
  },

  saveWaterLogs(logs: Record<string, WaterLog>): boolean {
    return atomicSetItem(STORAGE_KEYS.WATER_LOGS, logs);
  },

  getSleepLogs(): SleepLog[] {
    const data = safeGetItem(STORAGE_KEYS.SLEEP_LOGS);
    const parsed = safeJsonParse<SleepLog[]>(data, (val) => Array.isArray(val));
    if (parsed && Array.isArray(parsed)) return parsed;

    const initial = getInitialSeedSleep();
    this.saveSleepLogs(initial);
    return initial;
  },

  saveSleepLogs(logs: SleepLog[]): boolean {
    return atomicSetItem(STORAGE_KEYS.SLEEP_LOGS, logs);
  },

  getHabitLogs(): HabitEntry[] {
    const data = safeGetItem(STORAGE_KEYS.HABIT_LOGS);
    const parsed = safeJsonParse<HabitEntry[]>(data, (val) => Array.isArray(val));
    if (parsed && Array.isArray(parsed)) return parsed;

    const initial = getInitialSeedHabits();
    this.saveHabitLogs(initial);
    return initial;
  },

  saveHabitLogs(habits: HabitEntry[]): boolean {
    return atomicSetItem(STORAGE_KEYS.HABIT_LOGS, habits);
  },

  getNotifications(): LocalNotificationAlert[] {
    const data = safeGetItem(STORAGE_KEYS.NOTIFICATIONS);
    const parsed = safeJsonParse<LocalNotificationAlert[]>(data, (val) => Array.isArray(val));
    if (parsed && Array.isArray(parsed)) return parsed;

    return [
      {
        id: 'notif_welcome',
        title: 'مرحباً بك في أراسكو!',
        body: 'ابدأ تنظيم مهامك اليومية واطلع على الترتيب المقترح في المساعد الذكي.',
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'assistant',
      },
    ];
  },

  saveNotifications(alerts: LocalNotificationAlert[]): boolean {
    return atomicSetItem(STORAGE_KEYS.NOTIFICATIONS, alerts);
  },

  exportFullBackup(): string {
    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      tasks: this.getTasks(),
      categories: this.getCategories(),
      waterLogs: this.getWaterLogs(),
      sleepLogs: this.getSleepLogs(),
      habitLogs: this.getHabitLogs(),
      notifications: this.getNotifications(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        return false;
      }
      if (parsed.settings) this.saveSettings(parsed.settings);
      if (parsed.tasks) this.saveTasks(parsed.tasks);
      if (parsed.categories) this.saveCategories(parsed.categories);
      if (parsed.waterLogs) this.saveWaterLogs(parsed.waterLogs);
      if (parsed.sleepLogs) this.saveSleepLogs(parsed.sleepLogs);
      if (parsed.habitLogs) this.saveHabitLogs(parsed.habitLogs);
      if (parsed.notifications) this.saveNotifications(parsed.notifications);
      return true;
    } catch {
      return false;
    }
  },

  resetAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => {
        try {
          localStorage.removeItem(k);
          localStorage.removeItem(`${k}_staging_tmp`);
        } catch {
          // ignore
        }
        delete memoryCache[k];
      });
    } catch {
      // ignore
    }
  },
};
