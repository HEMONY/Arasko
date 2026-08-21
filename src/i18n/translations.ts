import { LanguageCode } from '../types';

export interface Translations {
  appName: string;
  appTagline: string;
  aboutText: string;
  developedBy: string;

  // Nav tabs
  today: string;
  calendar: string;
  assistant: string;
  health: string;
  settings: string;
  archive: string;
  analytics: string;

  // Header & common
  streakDays: string;
  dayStreak: string;
  searchPlaceholder: string;
  filterAll: string;
  filterUrgent: string;
  filterImportant: string;
  filterNormal: string;
  addNewTask: string;
  noTasksFound: string;
  noTasksToday: string;
  greatJobAllDone: string;
  completionRate: string;
  todayProgress: string;
  tasksCompleted: string;
  offlineStatus: string;
  onlineStatus: string;
  offlineCachedBadge: string;
  offlineTooltip: string;
  onlineTooltip: string;

  // Task Focus & Goal Milestone
  taskFocus: string;
  taskFocusDesc: string;
  workTasks: string;
  personalTasks: string;
  studyTasks: string;
  dailyBalance: string;
  goalMilestone: string;
  dailyGoalCompleted: string;
  milestoneAlmostDone: string;
  milestoneHalfway: string;
  milestoneGoodStart: string;
  milestoneNotStarted: string;

  // Focus Mode & Pomodoro
  focusMode: string;
  focusModeActive: string;
  focusModeDesc: string;
  focusModeHint: string;
  exitFocusMode: string;
  focusModeEmpty: string;
  pomodoro: string;
  pomodoroTitle: string;
  pomodoroDesc: string;
  focusSession: string;
  shortBreak: string;
  longBreak: string;
  startFocus: string;
  pauseFocus: string;
  resumeFocus: string;
  resetFocus: string;
  pomodoroCompleted: string;
  pomodoroCompletedDesc: string;
  selectTaskForPomodoro: string;
  focusTimeRemaining: string;
  completedCyclesCount: string;
  startPomodoroForTask: string;
  minimizeTimer: string;

  // Priority & Status
  urgent: string;
  important: string;
  normal: string;
  priority: string;
  status: string;
  notStarted: string;
  inProgress: string;
  completed: string;
  postponed: string;
  markCompleted: string;
  markInProgress: string;
  markPostponed: string;
  undoComplete: string;

  // Task Details Modal
  createTask: string;
  editTask: string;
  taskTitle: string;
  taskTitlePlaceholder: string;
  taskDescription: string;
  taskDescPlaceholder: string;
  category: string;
  startDate: string;
  dueDate: string;
  startTime: string;
  dueTime: string;
  recurrence: string;
  recurrenceNone: string;
  recurrenceDaily: string;
  recurrenceWeekly: string;
  recurrenceMonthly: string;
  recurrenceYearly: string;
  recurrenceCustom: string;
  subTasks: string;
  addSubTask: string;
  subTaskPlaceholder: string;
  reminders: string;
  addReminder: string;
  reminderAtTime: string;
  reminder5Min: string;
  reminder15Min: string;
  reminder30Min: string;
  reminder1Hour: string;
  reminder1Day: string;
  notes: string;
  notesPlaceholder: string;
  attachImage: string;
  cancel: string;
  save: string;
  delete: string;
  archiveTask: string;
  unarchiveTask: string;
  deleteConfirmation: string;

  // Calendar Views
  dailyView: string;
  monthlyView: string;
  yearlyView: string;
  monthOverview: string;
  yearMilestones: string;
  tasksOnDate: string;
  noTasksThisDay: string;
  prevMonth: string;
  nextMonth: string;
  prevYear: string;
  nextYear: string;
  dayProductivityHeatmap: string;

  // Smart Assistant (Offline Rule-Based)
  smartAssistantTitle: string;
  smartAssistantDesc: string;
  smartPriorityOrder: string;
  smartPriorityDesc: string;
  scheduleConflicts: string;
  noConflictsFound: string;
  conflictDetected: string;
  overdueAccumulation: string;
  noOverdueTasks: string;
  overdueTasksCount: string;
  rescheduleSuggested: string;
  quickRescheduleToToday: string;
  taskBreakdownGenerator: string;
  breakdownDesc: string;
  selectTemplate: string;
  applyBreakdown: string;
  breakdownAppliedSuccess: string;
  productivitySummary: string;
  weeklySummary: string;
  monthlySummary: string;
  peakProductivityTime: string;
  morningPeak: string;
  afternoonPeak: string;
  eveningPeak: string;
  contextualTips: string;
  offlineNotice: string;

  // Health & Fitness Module
  healthTitle: string;
  waterIntake: string;
  waterGoal: string;
  waterCurrent: string;
  drinkWater: string;
  add250ml: string;
  add500ml: string;
  customWaterAmount: string;
  waterReminderPrompt: string;
  sleepSchedule: string;
  bedTime: string;
  wakeTime: string;
  sleepHours: string;
  sleepQuality: string;
  logSleep: string;
  workoutLibrary: string;
  workoutBeginner: string;
  workoutIntermediate: string;
  workoutAdvanced: string;
  startWorkout: string;
  currentExercise: string;
  setsCompleted: string;
  reps: string;
  restTimer: string;
  seconds: string;
  finishWorkout: string;
  nextExercise: string;
  prevExercise: string;
  workoutCompletedMsg: string;
  habitTracker: string;
  habitSleep: string;
  habitWater: string;
  habitWorkout: string;
  habitMeals: string;
  habitMindfulness: string;
  steps: string;
  stepCountGoal: string;
  weeklyHabitMatrix: string;

  // Settings Screen
  settingsTitle: string;
  generalSettings: string;
  language: string;
  theme: string;
  themeDark: string;
  themeLight: string;
  themeSystem: string;
  categoriesManagement: string;
  addCategory: string;
  categoryName: string;
  notificationsTitle: string;
  enableNotifications: string;
  soundAlerts: string;
  soundChime: string;
  soundBell: string;
  soundPing: string;
  soundZen: string;
  soundHarp: string;
  soundNone: string;
  vibrationAlerts: string;
  defaultReminderTime: string;

  // Sad Overdue Tones & Custom Audio Studio
  overdueSadSoundTitle: string;
  overdueSadSoundDesc: string;
  enableOverdueSadSound: string;
  selectSadTone: string;
  araskoSad1: string;
  araskoSad2: string;
  sadOudLament: string;
  sadQanunSigh: string;
  defaultSadToneBadge: string;
  sadViolin: string;
  sadPiano: string;
  sadSigh: string;
  sadRain: string;
  sadDefeat: string;
  sadAlarm: string;
  customRingtonesTitle: string;
  customRingtonesDesc: string;
  uploadAudioFile: string;
  toneNamePlaceholder: string;
  selectAudioFile: string;
  saveTone: string;
  previewTone: string;
  stopPreview: string;
  deleteTone: string;
  noCustomTones: string;
  toneAddedSuccess: string;
  toneDeletedSuccess: string;
  overdueBadge: string;
  taskOverdueAlertTitle: string;
  taskOverdueAlertBody: string;
  playingAudio: string;
  audioDuration: string;
  customToneLabel: string;
  taskSoundChoice: string;
  defaultAppSound: string;

  healthGoalsTitle: string;
  dailyWaterGoal: string;
  dailySleepGoal: string;
  dailyStepsGoal: string;
  dataManagementTitle: string;
  exportData: string;
  importData: string;
  exportSuccess: string;
  importSuccess: string;
  importError: string;
  copyBackupJson: string;
  copiedToClipboard: string;
  pasteBackupJson: string;
  backupStatsInfo: string;
  pasteJsonPlaceholder: string;
  importConfirmWarning: string;
  resetAllData: string;
  resetConfirm: string;
  clearAllUserData: string;
  clearAllUserDataDesc: string;
  clearUserDataConfirm: string;
  clearUserDataSuccess: string;
  aboutTitle: string;
  contactUs: string;
  version: string;
  telegramChannel: string;
  followOnTelegram: string;
  joinTelegramBtn: string;
  telegramCommunityDesc: string;
  viewOnboardingAgain: string;

  // Onboarding
  onboardingWelcomeTitle: string;
  onboardingWelcomeDesc: string;
  onboardingPlanningTitle: string;
  onboardingPlanningDesc: string;
  onboardingAssistantTitle: string;
  onboardingAssistantDesc: string;
  onboardingHealthTitle: string;
  onboardingHealthDesc: string;
  getStarted: string;
  skip: string;
  next: string;

  // Notifications drawer
  notificationsTray: string;
  noNotifications: string;
  clearAll: string;
  testNotification: string;
  notificationSimulated: string;

  // Categories Default Names
  catWork: string;
  catPersonal: string;
  catHealth: string;
  catStudy: string;
  catFinance: string;
  catHome: string;

  // Templates
  tplStudy: string;
  tplPresentation: string;
  tplMarketing: string;
  tplCleaning: string;
  tplMealPrep: string;
  tplCoding: string;

  // Gestures & Swiping
  swipeComplete: string;
  swipeDelete: string;
  swipeHint: string;

  // Spiritual / Islamic Routine
  spiritual: string;
  spiritualTitle: string;
  spiritualDesc: string;
  quranWardsTitle: string;
  quranWardsSubtitle: string;
  athkarTitle: string;
  wakingAthkar: string;
  morningAthkar: string;
  eveningAthkar: string;
  sleepingAthkar: string;
  readSurah: string;
  closeSurah: string;
  markSurahRead: string;
  surahCompleted: string;
  surahCompletedMsg: string;
  virtueLabel: string;
  tasbihCounter: string;
  tasbihCompleted: string;
  addToTodayTasks: string;
  addedToTasksSuccess: string;
  todaySpiritualProgress: string;
  completedSpiritualItems: string;
  allSpiritualDone: string;
  spiritualRemindersTitle: string;
  enableSpiritualReminders: string;
  remindAfterPrayer: string;
  setReminderTime: string;
  testSpiritualSound: string;
  dailyAthkarReminders: string;
  quranWardReminders: string;

  // User Profile & Personalized Smart Guidance
  userProfileTitle: string;
  userProfileSubtitle: string;
  userName: string;
  userNamePlaceholder: string;
  userRole: string;
  roleProfessional: string;
  roleStudent: string;
  roleOther: string;
  professionSelect: string;
  trackSelect: string;
  customFieldPrompt: string;
  customFieldPlaceholder: string;
  personalizedTips: string;
  specializedTemplates: string;
  applyTemplate: string;
  templateAppliedSuccess: string;
  onboardingRoleTitle: string;
  onboardingRoleDesc: string;
  onboardingProfileNamePrompt: string;
  domainTipsTitle: string;
}

export const translations: Record<LanguageCode, Translations> = {
  ar: {
    appName: "أراسكو",
    appTagline: "تنظيم احترافي للمهام والروتين الصحي",
    aboutText: "أراسكو هو تطبيق ذكي وبسيط لإدارة المهام والوقت مصمم لمساعدتك في تنظيم يومك وشهرك وسنتك بكل احترافية وسهولة. تم تطويره بواسطة فريق Fallt. تابع قناتنا الرسمية على تلجرام: t.me/fallt_tec",
    developedBy: "تم التطوير بواسطة فريق Fallt",

    today: "اليوم",
    calendar: "التقويم",
    assistant: "المساعد الذكي",
    health: "الصحة واللياقة",
    spiritual: "الورد والأذكار",
    settings: "الإعدادات",
    archive: "الأرشيف",
    analytics: "التحليلات",

    streakDays: "أيام متتالية",
    dayStreak: "سلسلة الإنجاز",
    searchPlaceholder: "ابحث في المهام والملاحظات...",
    filterAll: "الكل",
    filterUrgent: "عاجل",
    filterImportant: "مهم",
    filterNormal: "عادي",
    addNewTask: "إضافة مهمة جديدة",
    noTasksFound: "لم يتم العثور على مهام مطابقة",
    noTasksToday: "لا توجد مهام مجدولة لليوم. استمتع بيومك أو أضف مهام جديدة!",
    greatJobAllDone: "رائع جداً! لقد أنجزت جميع مهام اليوم بنجاح.",
    completionRate: "نسبة الإنجاز",
    todayProgress: "إنجاز اليوم",
    tasksCompleted: "مهام مكتملة",
    offlineStatus: "أوفلاين",
    onlineStatus: "متصل",
    offlineCachedBadge: "أوفلاين (محتوى مخزن)",
    offlineTooltip: "التطبيق يعمل أوفلاين بالكامل عبر ميزة التخزين المؤقت للبيانات والأصول",
    onlineTooltip: "التطبيق متصل بالإنترنت ومحدث تلقائياً",

    // Task Focus & Goal Milestone
    taskFocus: "توزيع التركيز اليومي",
    taskFocusDesc: "تحليل توزيع المهام المنشأة والمجدولة لليوم لموازنة العمل والحياة الشخصية والتعلم.",
    workTasks: "عمل ومشاريع",
    personalTasks: "شخصي وصحة",
    studyTasks: "دراسة وتطوير",
    dailyBalance: "توازن اليوم",
    goalMilestone: "محطة الهدف اليومي",
    dailyGoalCompleted: "تم تحقيق الهدف اليومي بنجاح!",
    milestoneAlmostDone: "على وشك إنجاز الهدف كاملاً",
    milestoneHalfway: "في منتصف طريق الإنجاز اليومي",
    milestoneGoodStart: "بداية ممتازة ليومك!",
    milestoneNotStarted: "ابدأ بإنجاز أولى مهامك اليوم",

    // Focus Mode & Pomodoro
    focusMode: "وضع التركيز الفائق",
    focusModeActive: "وضع التركيز مفعّل",
    focusModeDesc: "إخفاء المهام المكتملة وغير العاجلة للتركيز على الأهم والمستعجل",
    focusModeHint: "يعرض فقط المهام العاجلة والمتأخرة قيد التنفيذ",
    exitFocusMode: "إلغاء التركيز",
    focusModeEmpty: "لا توجد مهام عاجلة متبقية لليوم. كل شيء تحت السيطرة!",
    pomodoro: "مؤقت بومودورو",
    pomodoroTitle: "مؤقت التركيز وبومودورو 4K",
    pomodoroDesc: "جلسات تركيز عميق لمدة 25 دقيقة متبوعة بفترات استراحة قصيرة لزيادة إنتاجيتك.",
    focusSession: "جلسة تركيز (25 دقيقة)",
    shortBreak: "استراحة قصيرة (5 دقائق)",
    longBreak: "استراحة طويلة (15 دقيقة)",
    startFocus: "بدء التركيز",
    pauseFocus: "إيقاف مؤقت",
    resumeFocus: "استئناف الجلسة",
    resetFocus: "إعادة ضبط",
    pomodoroCompleted: "🎉 أحسنت! اكتملت جلسة التركيز بنجاح",
    pomodoroCompletedDesc: "لقد أتممت جلسة عمل مركزة بنجاح، خذ استراحة قصيرة لتجديد طاقتك.",
    selectTaskForPomodoro: "ربط الجلسة بمهمة محددة",
    focusTimeRemaining: "الوقت المتبقي للجلسة",
    completedCyclesCount: "الجلسات المكتملة اليوم",
    startPomodoroForTask: "بدء مؤقت تركيز 25 دقيقة",
    minimizeTimer: "تصغير المؤقت والشاشة",

    urgent: "عاجل",
    important: "مهم",
    normal: "عادي",
    priority: "الأولوية",
    status: "الحالة",
    notStarted: "لم تبدأ",
    inProgress: "قيد التنفيذ",
    completed: "مكتملة",
    postponed: "مؤجلة",
    markCompleted: "تحديد كمكتملة",
    markInProgress: "بدء التنفيذ",
    markPostponed: "تأجيل المهمة",
    undoComplete: "إلغاء الإكمال",

    createTask: "إنشاء مهمة جديدة",
    editTask: "تعديل المهمة",
    taskTitle: "عنوان المهمة",
    taskTitlePlaceholder: "مثال: مراجعة خطة العمل الفصلية...",
    taskDescription: "الوصف والتفاصيل",
    taskDescPlaceholder: "اكتب وصفاً أو خطوات أو أهدافاً هنا...",
    category: "التصنيف",
    startDate: "تاريخ البدء",
    dueDate: "تاريخ الاستحقاق",
    startTime: "وقت البدء",
    dueTime: "وقت الاستحقاق",
    recurrence: "التكرار",
    recurrenceNone: "بدون تكرار",
    recurrenceDaily: "يومياً",
    recurrenceWeekly: "أسبوعياً",
    recurrenceMonthly: "شهرياً",
    recurrenceYearly: "سنوياً",
    recurrenceCustom: "مخصص",
    subTasks: "قائمة المهام الفرعية",
    addSubTask: "إضافة خطوة فرعية",
    subTaskPlaceholder: "اكتب خطوة عمل واضغط إضافة...",
    reminders: "التنبيهات والتذكيرات",
    addReminder: "إضافة تذكير",
    reminderAtTime: "في موعد الاستحقاق",
    reminder5Min: "قبل 5 دقائق",
    reminder15Min: "قبل 15 دقيقة",
    reminder30Min: "قبل 30 دقيقة",
    reminder1Hour: "قبل ساعة واحدة",
    reminder1Day: "قبل يوم واحد",
    notes: "ملاحظات إضافية",
    notesPlaceholder: "أي روابط أو معلومات إضافية...",
    attachImage: "إرفاق صورة أو مستند",
    cancel: "إلغاء",
    save: "حفظ المهمة",
    delete: "حذف",
    archiveTask: "أرشفة",
    unarchiveTask: "استعادة من الأرشيف",
    deleteConfirmation: "هل أنت متأكد من حذف هذه المهمة نهائياً؟",

    dailyView: "يومي",
    monthlyView: "شهري",
    yearlyView: "سنوي",
    monthOverview: "نظرة الشهر",
    yearMilestones: "محطات وإنجازات السنة",
    tasksOnDate: "المهام المجدولة لتاريخ",
    noTasksThisDay: "لا توجد مهام مسجلة لهذا اليوم.",
    prevMonth: "الشهر السابق",
    nextMonth: "الشهر القادم",
    prevYear: "السنة السابقة",
    nextYear: "السنة القادمة",
    dayProductivityHeatmap: "خريطة إنتاجية الأيام",

    smartAssistantTitle: "المساعد الذكي (محلي وبدون إنترنت)",
    smartAssistantDesc: "خوارزميات ذكية محلية ترتب أولوياتك، تحذرك من التعارضات، وتجزئ المهام الكبيرة مجاناً وبأمان تام على جهازك.",
    smartPriorityOrder: "الترتيب الذكي المقترح للمهام",
    smartPriorityDesc: "مرتبة وفق قرب الموعد النهائي، درجة الأهمية، وحالة التقدم الحالية.",
    scheduleConflicts: "فحص تعارض المواعيد",
    noConflictsFound: "ممتاز! لا يوجد أي تداخل زمني بين مهامك الحالية.",
    conflictDetected: "تم اكتشاف تعارض في التوقيت بين مهامك",
    overdueAccumulation: "مراقبة المهام المتراكمة والمتأخرة",
    noOverdueTasks: "رائع! ليس لديك أي مهام متأخرة عن موعدها.",
    overdueTasksCount: "مهام متأخرة بحاجة لإعادة جدولة",
    rescheduleSuggested: "اقتراح إعادة الجدولة",
    quickRescheduleToToday: "نقل المهام المتأخرة إلى اليوم",
    taskBreakdownGenerator: "مولد تفكيك المهام الكبيرة",
    breakdownDesc: "اختر قالباً لتفكيك هدفك إلى خطوات فرعية قابلة للتنفيذ الفوري:",
    selectTemplate: "اختر قالب المهمة",
    applyBreakdown: "تطبيق التفكيك كمهام فرعية",
    breakdownAppliedSuccess: "تم إضافة خطوات التفكيك بنجاح!",
    productivitySummary: "ملخص الإنتاجية الدوري",
    weeklySummary: "تقرير الأسبوع",
    monthlySummary: "تقرير الشهر",
    peakProductivityTime: "فترة الإنتاجية القصوى",
    morningPeak: "الصباح الباكر (08:00 - 12:00)",
    afternoonPeak: "فترة الظهيرة (12:00 - 17:00)",
    eveningPeak: "الفترة المسائية (18:00 - 22:00)",
    contextualTips: "نصائح ذكية مخصصة لنمطك",
    offlineNotice: "يعمل بنسبة 100% بدون إنترنت وعلى جهازك فقط",

    healthTitle: "الصحة واللياقة البدنية",
    waterIntake: "شرب الماء",
    waterGoal: "الهدف اليومي للماء",
    waterCurrent: "المستهلك اليوم",
    drinkWater: "تسجيل كوب ماء",
    add250ml: "+250 مل (كوب)",
    add500ml: "+500 مل (زجاجة)",
    customWaterAmount: "كمية مخصصة",
    waterReminderPrompt: "حافظ على ترطيب جسمك لزيادة التركيز والنشاط الذهني!",
    sleepSchedule: "تتبع النوم والراحة",
    bedTime: "وقت النوم",
    wakeTime: "وقت الاستيقاظ",
    sleepHours: "ساعات النوم",
    sleepQuality: "جودة النوم",
    logSleep: "تسجيل بيانات النوم",
    workoutLibrary: "مكتبة التمارين المجدولة",
    workoutBeginner: "مبتدئ: مرونة وإطالة وتنشيط",
    workoutIntermediate: "متوسط: تمارين قوة ولياقة بدنية",
    workoutAdvanced: "متقدم: قوة متفجرة وتحمل رياضي",
    startWorkout: "بدء التمرين التفاعلي",
    currentExercise: "التمرين الحالي",
    setsCompleted: "المجموعات المنجزة",
    reps: "تكرار",
    restTimer: "مؤقت الراحة",
    seconds: "ثوانٍ",
    finishWorkout: "إنهاء التمرين وحفظ التقدم",
    nextExercise: "التالي",
    prevExercise: "السابق",
    workoutCompletedMsg: "عمل استثنائي! أكملت حصتك التدريبية بنجاح وحافظت على نشاطك.",
    habitTracker: "متتبع العادات الأسبوعي",
    habitSleep: "النوم الكافي",
    habitWater: "ترطيب الماء",
    habitWorkout: "النشاط الرياضي",
    habitMeals: "وجبات صحية",
    habitMindfulness: "التركيز والصفاء",
    steps: "الخطوات اليومية",
    stepCountGoal: "هدف الخطوات",
    weeklyHabitMatrix: "جدول التزام العادات خلال الأسبوع",

    settingsTitle: "الإعدادات والتخصيص",
    generalSettings: "الإعدادات العامة",
    language: "اللغة (Language)",
    theme: "المظهر والألوان",
    themeDark: "داكن (Dark)",
    themeLight: "فاتح (Light)",
    themeSystem: "تلقائي حسب النظام",
    categoriesManagement: "إدارة التصنيفات والألوان",
    addCategory: "إضافة تصنيف جديد",
    categoryName: "اسم التصنيف",
    notificationsTitle: "التنبيهات والإشعارات",
    enableNotifications: "تفعيل التنبيهات المحلية",
    soundAlerts: "نغمة الإشعارات الأساسية",
    soundChime: "نغمة هادئة (Chime)",
    soundBell: "جرس واضح (Bell)",
    soundPing: "نبضة رقمية (Ping)",
    soundZen: "وعاء التأمل (Zen Bowl)",
    soundHarp: "قيثارة النجاح (Harp)",
    soundNone: "صامت",
    vibrationAlerts: "الاهتزاز عند التنبيه",
    defaultReminderTime: "وقت التذكير الافتراضي",

    // Sad Overdue Tones & Custom Audio Studio
    overdueSadSoundTitle: "نغمات التنبيه الحزينة عند فوات الوقت",
    overdueSadSoundDesc: "تشغيل لحن حزين ومؤثر في حال لم يتم إنجاز المهمة في الوقت المحدد لتحفيزك وتنبيهك (يمكنك تفعيله أو إيقافه واختيار النغمة المناسبة)",
    enableOverdueSadSound: "تفعيل نغمة التأخير الحزينة عند فوات الموعد",
    selectSadTone: "اختر نغمة التأخير الحزينة",
    araskoSad1: "اراسكو الحزين 1 (لحن الناي والكمان الشجي)",
    araskoSad2: "اراسكو الحزين 2 (مرثية الأوتار والتشيلو العميقة)",
    sadOudLament: "تقاسيم عود أندلسية حزينة (Sad Oriental Oud & Strings)",
    sadQanunSigh: "شجن القانون والكمان الحزين (Melancholic Qanun Echo)",
    defaultSadToneBadge: "النغمة الافتراضية",
    sadViolin: "كمان الحزن والشجن (Emotional Violin)",
    sadPiano: "بيانو الحزن الرقيق (Melancholy Piano)",
    sadSigh: "تنهيدة هادئة (Poignant Sigh)",
    sadRain: "أجراس المطر الحزينة (Somber Rain Bells)",
    sadDefeat: "نغمة الإحباط (Defeat Chime)",
    sadAlarm: "نبض تحذيري كئيب (Gloomy Pulse)",
    customRingtonesTitle: "استوديو النغمات والأصوات المخصصة",
    customRingtonesDesc: "ارفع نغماتك وملفاتك الصوتية الخاصة (MP3, WAV, M4A) لتخصيص نغمات التنبيه والإنجاز أو التنبيه الحزين",
    uploadAudioFile: "رفع نغمة صوتية خاصة",
    toneNamePlaceholder: "اسم النغمة (مثال: نغمتي الحزينة المفضلة)",
    selectAudioFile: "اختر ملف صوتي من جهازك",
    saveTone: "حفظ النغمة في التطبيق",
    previewTone: "استماع",
    stopPreview: "إيقاف",
    deleteTone: "حذف النغمة",
    noCustomTones: "لا توجد نغمات مخصصة مرفوعة بعد. يمكنك رفع أي نغمة صوتية بصيغة MP3 أو WAV واستخدامها في التطبيق!",
    toneAddedSuccess: "تمت إضافة النغمة الصوتية بنجاح إلى مكتبتك.",
    toneDeletedSuccess: "تم حذف النغمة الصوتية.",
    overdueBadge: "فات الموعد!",
    taskOverdueAlertTitle: "تنبيه: فات موعد إنجاز المهمة!",
    taskOverdueAlertBody: "انتهى الوقت المحدد للمهمة دون إنجازها. لا تدع التراكم يعطلك، يمكنك إنجازها الآن أو جدولتها!",
    playingAudio: "جاري التشغيل...",
    audioDuration: "المدة",
    customToneLabel: "نغمة مخصصة",
    taskSoundChoice: "نغمة تنبيه المهمة",
    defaultAppSound: "النغمة العامة الافتراضية",

    healthGoalsTitle: "أهداف الصحة واللياقة",
    dailyWaterGoal: "هدف الماء اليومي (مل)",
    dailySleepGoal: "هدف ساعات النوم",
    dailyStepsGoal: "هدف الخطوات اليومي",
    dataManagementTitle: "إدارة البيانات والنسخ الاحتياطي",
    exportData: "تصدير نسخة احتياطية (JSON)",
    importData: "استيراد نسخة احتياطية",
    exportSuccess: "تم تصدير بياناتك بنجاح وحفظ الملف.",
    importSuccess: "تم استيراد البيانات وتحديث التطبيق بنجاح.",
    importError: "الملف غير صالح أو تالف. يرجى اختيار ملف نسخة أراسكو صالح.",
    copyBackupJson: "نسخ محتوى النسخة الاحتياطية",
    copiedToClipboard: "تم نسخ كود النسخة الاحتياطية إلى الحافظة!",
    pasteBackupJson: "لصق واستيراد نص JSON مباشرة",
    backupStatsInfo: "حجم البيانات المحفوظة محلياً",
    pasteJsonPlaceholder: "الصق كود النسخة الاحتياطية (JSON) هنا لاستيراده فوراً...",
    importConfirmWarning: "سيتم استعادة وتحديث بيانات التطبيق والإعدادات من هذه النسخة الاحتياطية.",
    resetAllData: "إعادة ضبط المصنع ومسح كل البيانات",
    resetConfirm: "تحذير: سيتم مسح كافة المهام والبيانات نهائياً!",
    clearAllUserData: "مسح بيانات المستخدم (المهام، الصحة، والورد)",
    clearAllUserDataDesc: "حذف كافة المهام والسجلات الصحية والورد اليومي مع الإبقاء على الإعدادات الافتراضية للتطبيق ليكون التطبيق نظيفاً وجديداً.",
    clearUserDataConfirm: "هل أنت متأكد من رغبتك في مسح كافة المهام والأنشطة الصحية والورد اليومي؟ سيتم تجهيز التطبيق كأنه جديد لمستخدم جديد مع الإبقاء على إعداداتك العامة.",
    clearUserDataSuccess: "تم تفريغ كافة بيانات المستخدم والمهام بنجاح! التطبيق الآن نظيف وجاهز للاستخدام.",
    aboutTitle: "حول تطبيق أراسكو",
    contactUs: "تواصل معنا والمجتمع",
    version: "الإصدار 1.0.0",
    telegramChannel: "t.me/fallt_tec",
    followOnTelegram: "قناة التلجرام الرسمية",
    joinTelegramBtn: "انضم إلى قناتنا على تلجرام",
    telegramCommunityDesc: "انضم إلى مجتمعنا وقناتنا الرسمية على تلجرام لمتابعة آخر التحديثات، مناقشة الميزات الجديدة، والتواصل المباشر مع فريق التطوير.",
    viewOnboardingAgain: "عرض جولة التعريف بالتطبيق",

    onboardingWelcomeTitle: "مرحباً بك في أراسكو",
    onboardingWelcomeDesc: "تطبيقك الاحترافي الشامل لإدارة المهام اليومية، التخطيط الشهري والسنوي، وتعزيز روتينك الصحي بكل بساطة.",
    onboardingPlanningTitle: "تخطيط مرن: يومي، شهري، وسنوي",
    onboardingPlanningDesc: "انتقل بسلاسة بين قائمة اليوم التفاعلية، والتقويم الشهري، ومحطات الإنجاز السنوية مع دعم الأولويات والتكرار والتنبيهات المخصصة.",
    onboardingAssistantTitle: "مساعد ذكي محلي ومجاني 100%",
    onboardingAssistantDesc: "خوارزميات محلية تكتشف تعارض المواعيد، ترتب أولوياتك تلقائياً، وتجزئ المهام الكبيرة إلى خطوات عملية بدون الحاجة لأي اتصال بالإنترنت.",
    onboardingHealthTitle: "روتين متكامل للصحة واللياقة",
    onboardingHealthDesc: "تتبع شرب الماء، ساعات النوم، برامج التمارين الرياضية بمؤقتات تفاعلية، ومتتبع عادات أسبوعي لتعزيز طاقتك وإنتاجيتك.",
    getStarted: "ابدأ الآن",
    skip: "تخطي",
    next: "التالي",

    notificationsTray: "مركز التنبيهات",
    noNotifications: "لا توجد تنبيهات جديدة حالياً",
    clearAll: "مسح الكل",
    testNotification: "اختبار نغمة وتنبيه محلي",
    notificationSimulated: "تم إطلاق تنبيه تجريبي بنجاح!",

    catWork: "العمل والمشاريع",
    catPersonal: "شخصي وحياة",
    catHealth: "صحة ورياضة",
    catStudy: "دراسة وتطوير",
    catFinance: "مالية وميزانية",
    catHome: "المنزل والأسرة",

    tplStudy: "الاستعداد للاختبار / دراسة موضوع",
    tplPresentation: "إعداد وتقديم عرض تقديمي",
    tplMarketing: "إطلاق حملة تسويقية",
    tplCleaning: "ترتيب وتنظيف شامل للمنزل",
    tplMealPrep: "التخطيط وإعداد الوجبات الأسبوعية",
    tplCoding: "تطوير ميزة برمجية واختبارها",

    // Gestures & Swiping
    swipeComplete: "اسحب لليمين للإكمال",
    swipeDelete: "اسحب لليسار للحذف",
    swipeHint: "اسحب البطاقة يميناً للإكمال أو يساراً للحذف",

    // Spiritual / Islamic Routine
    spiritualTitle: "الروتين الديني والورد القرآني",
    spiritualDesc: "أذكار الصباح والمساء والاستيقاظ والنوم وقراءة السور المأثورة الموزعة على الصلوات الخمس",
    quranWardsTitle: "الورد القرآني اليومي (حسب الصلوات)",
    quranWardsSubtitle: "سورة مخصصة بعد كل صلاة لتيسير القراءة ونيل البركة",
    athkarTitle: "الأذكار اليومية وحصن المسلم",
    wakingAthkar: "أذكار الاستيقاظ",
    morningAthkar: "أذكار الصباح",
    eveningAthkar: "أذكار المساء",
    sleepingAthkar: "أذكار النوم",
    readSurah: "قراءة السورة كاملة",
    closeSurah: "إغلاق المصحف",
    markSurahRead: "تحديد الورد كمقروء",
    surahCompleted: "تمت القراءة",
    surahCompletedMsg: "تقبل الله طاعتكم وبارك في يومكم وأثابكم خيراً.",
    virtueLabel: "فضل السورة والوقت",
    tasbihCounter: "المسبحة الإلكترونية",
    tasbihCompleted: "اكتمل الذكر المبارك",
    addToTodayTasks: "إضافة الورد والأذكار إلى مهام اليوم",
    addedToTasksSuccess: "تمت إضافة السور والأذكار إلى قائمة مهامك بنجاح!",
    todaySpiritualProgress: "إنجاز الورد الديني لليوم",
    completedSpiritualItems: "أوراد وأذكار منجزة",
    allSpiritualDone: "ما شاء الله! أنجزت كامل وردك القرآني وأذكارك اليومية المباركة.",
    spiritualRemindersTitle: "تنبيهات الورد القرآني والأذكار المأثورة",
    enableSpiritualReminders: "تفعيل التذكير اليومي التلقائي بالورد والأذكار",
    remindAfterPrayer: "تذكير بعد الصلاة",
    setReminderTime: "وقت التنبيه",
    testSpiritualSound: "تجربة نغمة التنبيه",
    dailyAthkarReminders: "تنبيهات أذكار اليوم (استيقاظ، صباح، مساء، نوم)",
    quranWardReminders: "تنبيهات أوراد السور الخمس بعد الصلوات المكتوبة",

    // User Profile & Personalized Smart Guidance
    userProfileTitle: "الملف الشخصي والمسار المخصص",
    userProfileSubtitle: "خصص تجربتك باسمك ومجالك المهني أو الدراسي لتقديم نصائح وتوجيهات تناسب دورك تماماً",
    userName: "اسمك الكريم",
    userNamePlaceholder: "اكتب اسمك هنا (مثال: أحمد، سارة، م. عمر...)",
    userRole: "نوع الدور الحالي",
    roleProfessional: "مهني / موظف",
    roleStudent: "طالب علم",
    roleOther: "مجال آخر",
    professionSelect: "اختر مجالك المهني من القائمة",
    trackSelect: "اختر تخصصك أو مساقك الدراسي",
    customFieldPrompt: "اكتب مجالك أو تخصصك بدقة",
    customFieldPlaceholder: "مثال: ذكاء اصطناعي، تسويق رقمي، أدب مقارن...",
    personalizedTips: "إرشادات ونصائح مخصصة لمجالك",
    specializedTemplates: "قوالب وخطط عمل مخصصة لمجالك",
    applyTemplate: "إضافة كمهام عملية لليوم",
    templateAppliedSuccess: "تمت إضافة خطوات النموذج كمهام لليوم بنجاح!",
    onboardingRoleTitle: "أخبرنا عنك لتخصيص تجربتك",
    onboardingRoleDesc: "أدخل اسمك ومجالك المهني أو الدراسي لنقدم لك إرشادات ونماذج عمل تناسب أهدافك تماماً.",
    onboardingProfileNamePrompt: "ما هو اسمك الكريم؟",
    domainTipsTitle: "توجيهات وإرشادات خاصة بمسارك",
  },
  en: {
    appName: "Arasko",
    appTagline: "Professional Task & Health Management",
    aboutText: "Arasko is a smart, simple task and time management app designed to help you organize your day, month, and year professionally and effortlessly. Developed by Team Fallt. Official Telegram: t.me/fallt_tec",
    developedBy: "Developed by Team Fallt",

    today: "Today",
    calendar: "Calendar",
    assistant: "Smart Assistant",
    health: "Health & Fitness",
    spiritual: "Spiritual & Quran",
    settings: "Settings",
    archive: "Archive",
    analytics: "Analytics",

    streakDays: "Day Streak",
    dayStreak: "Day Streak",
    searchPlaceholder: "Search tasks, notes...",
    filterAll: "All",
    filterUrgent: "Urgent",
    filterImportant: "Important",
    filterNormal: "Normal",
    addNewTask: "Add New Task",
    noTasksFound: "No matching tasks found",
    noTasksToday: "No tasks scheduled for today. Enjoy your day or add new goals!",
    greatJobAllDone: "Outstanding! You completed all tasks scheduled for today.",
    completionRate: "Completion Rate",
    todayProgress: "Today's Progress",
    tasksCompleted: "Tasks Completed",
    offlineStatus: "Offline",
    onlineStatus: "Online",
    offlineCachedBadge: "Offline (Cached)",
    offlineTooltip: "App is running offline with cached data and static assets via Service Worker",
    onlineTooltip: "App is connected to the network and synced",

    // Task Focus & Goal Milestone
    taskFocus: "Task Focus Balance",
    taskFocusDesc: "Analysis of tasks created and scheduled for today to help you visualize your work, personal, and study balance.",
    workTasks: "Work & Projects",
    personalTasks: "Personal & Life",
    studyTasks: "Study & Learning",
    dailyBalance: "Daily Balance",
    goalMilestone: "Goal Milestone",
    dailyGoalCompleted: "Daily goal achieved! All done!",
    milestoneAlmostDone: "Almost there! Finish the final steps.",
    milestoneHalfway: "Halfway through your daily tasks.",
    milestoneGoodStart: "Great momentum! Keep it going.",
    milestoneNotStarted: "Ready to start your first task today.",

    // Focus Mode & Pomodoro
    focusMode: "Focus Mode",
    focusModeActive: "Focus Mode Active",
    focusModeDesc: "Hides completed tasks and non-urgent items to help you concentrate on top priorities",
    focusModeHint: "Showing only pending urgent and overdue tasks",
    exitFocusMode: "Exit Focus",
    focusModeEmpty: "No urgent tasks remaining today. You're completely on top of things!",
    pomodoro: "Pomodoro Timer",
    pomodoroTitle: "4K Pomodoro Focus Timer",
    pomodoroDesc: "25-minute deep focus intervals followed by restorative breaks to maximize productivity.",
    focusSession: "Focus Session (25 min)",
    shortBreak: "Short Break (5 min)",
    longBreak: "Long Break (15 min)",
    startFocus: "Start Focus",
    pauseFocus: "Pause",
    resumeFocus: "Resume",
    resetFocus: "Reset",
    pomodoroCompleted: "🎉 Great job! Focus session completed",
    pomodoroCompletedDesc: "You completed a deep work block. Take a well-deserved short break.",
    selectTaskForPomodoro: "Link session with task",
    focusTimeRemaining: "Time remaining",
    completedCyclesCount: "Completed cycles today",
    startPomodoroForTask: "Start 25m Focus Timer",
    minimizeTimer: "Minimize Timer",

    urgent: "Urgent",
    important: "Important",
    normal: "Normal",
    priority: "Priority",
    status: "Status",
    notStarted: "Not Started",
    inProgress: "In Progress",
    completed: "Completed",
    postponed: "Postponed",
    markCompleted: "Mark as Completed",
    markInProgress: "Start Working",
    markPostponed: "Postpone Task",
    undoComplete: "Undo Completion",

    createTask: "Create New Task",
    editTask: "Edit Task",
    taskTitle: "Task Title",
    taskTitlePlaceholder: "e.g., Review quarterly financial report...",
    taskDescription: "Description & Details",
    taskDescPlaceholder: "Write instructions, goals, or notes here...",
    category: "Category",
    startDate: "Start Date",
    dueDate: "Due Date",
    startTime: "Start Time",
    dueTime: "Due Time",
    recurrence: "Recurrence",
    recurrenceNone: "None",
    recurrenceDaily: "Daily",
    recurrenceWeekly: "Weekly",
    recurrenceMonthly: "Monthly",
    recurrenceYearly: "Yearly",
    recurrenceCustom: "Custom",
    subTasks: "Sub-tasks Checklist",
    addSubTask: "Add Sub-task",
    subTaskPlaceholder: "Enter actionable step...",
    reminders: "Reminders & Alerts",
    addReminder: "Add Reminder",
    reminderAtTime: "At due time",
    reminder5Min: "5 minutes before",
    reminder15Min: "15 minutes before",
    reminder30Min: "30 minutes before",
    reminder1Hour: "1 hour before",
    reminder1Day: "1 day before",
    notes: "Attached Notes",
    notesPlaceholder: "Any links, references, or additional notes...",
    attachImage: "Attach Photo / Document",
    cancel: "Cancel",
    save: "Save Task",
    delete: "Delete",
    archiveTask: "Archive",
    unarchiveTask: "Restore",
    deleteConfirmation: "Are you sure you want to permanently delete this task?",

    dailyView: "Daily",
    monthlyView: "Monthly",
    yearlyView: "Yearly",
    monthOverview: "Month Overview",
    yearMilestones: "Year Milestones",
    tasksOnDate: "Tasks for",
    noTasksThisDay: "No tasks scheduled for this day.",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    dayProductivityHeatmap: "Daily Productivity Heatmap",

    smartAssistantTitle: "Smart Assistant (Local & Offline)",
    smartAssistantDesc: "Intelligent offline algorithms that auto-prioritize tasks, detect schedule conflicts, and generate step-by-step breakdowns securely on your device.",
    smartPriorityOrder: "Smart Priority Order",
    smartPriorityDesc: "Sorted by deadline proximity, priority weight, and current progress status.",
    scheduleConflicts: "Schedule Conflict Detector",
    noConflictsFound: "All clear! No overlapping time slots detected in your schedule.",
    conflictDetected: "Time conflict detected between overlapping tasks",
    overdueAccumulation: "Overdue & Backlog Monitor",
    noOverdueTasks: "Great! You have zero overdue tasks.",
    overdueTasksCount: "overdue tasks need your attention",
    rescheduleSuggested: "Suggested Reschedule",
    quickRescheduleToToday: "Move Overdue Tasks to Today",
    taskBreakdownGenerator: "Task Breakdown Wizard",
    breakdownDesc: "Select a proven template to instantly break down large goals into actionable checklists:",
    selectTemplate: "Select Template",
    applyBreakdown: "Apply as Sub-tasks",
    breakdownAppliedSuccess: "Sub-task checklist added successfully!",
    productivitySummary: "Productivity Summary",
    weeklySummary: "Weekly Report",
    monthlySummary: "Monthly Report",
    peakProductivityTime: "Peak Productivity Time",
    morningPeak: "Morning (08:00 - 12:00)",
    afternoonPeak: "Afternoon (12:00 - 17:00)",
    eveningPeak: "Evening (18:00 - 22:00)",
    contextualTips: "Smart Contextual Tips",
    offlineNotice: "100% on-device, private, and offline",

    healthTitle: "Health & Fitness Routine",
    waterIntake: "Water Intake",
    waterGoal: "Daily Water Goal",
    waterCurrent: "Logged Today",
    drinkWater: "Log Glass of Water",
    add250ml: "+250 ml (Glass)",
    add500ml: "+500 ml (Bottle)",
    customWaterAmount: "Custom Amount",
    waterReminderPrompt: "Stay hydrated to maintain peak mental focus and energy throughout the day!",
    sleepSchedule: "Sleep Schedule & Rest",
    bedTime: "Bed Time",
    wakeTime: "Wake Time",
    sleepHours: "Sleep Hours",
    sleepQuality: "Sleep Quality",
    logSleep: "Log Sleep Session",
    workoutLibrary: "Workout Routines",
    workoutBeginner: "Beginner: Full Body Mobility & Core",
    workoutIntermediate: "Intermediate: Strength & HIIT Circuit",
    workoutAdvanced: "Advanced: Athletic Power & Endurance",
    startWorkout: "Start Interactive Workout",
    currentExercise: "Current Exercise",
    setsCompleted: "Sets Completed",
    reps: "Reps",
    restTimer: "Rest Countdown",
    seconds: "sec",
    finishWorkout: "Finish & Save Session",
    nextExercise: "Next",
    prevExercise: "Previous",
    workoutCompletedMsg: "Fantastic workout! You crushed your session and recharged your body.",
    habitTracker: "Weekly Habit Matrix",
    habitSleep: "Restful Sleep",
    habitWater: "Hydration Goal",
    habitWorkout: "Physical Exercise",
    habitMeals: "Healthy Meals",
    habitMindfulness: "Mindfulness",
    steps: "Daily Steps",
    stepCountGoal: "Step Goal",
    weeklyHabitMatrix: "7-Day Habit Consistency",

    settingsTitle: "Settings & Preferences",
    generalSettings: "General",
    language: "Language",
    theme: "Theme & Appearance",
    themeDark: "Dark Mode",
    themeLight: "Light Mode",
    themeSystem: "System Default",
    categoriesManagement: "Manage Categories & Colors",
    addCategory: "Add New Category",
    categoryName: "Category Name",
    notificationsTitle: "Notifications & Alerts",
    enableNotifications: "Enable Local Notifications",
    soundAlerts: "Primary Notification Sound",
    soundChime: "Gentle Chime",
    soundBell: "Crisp Bell",
    soundPing: "Digital Ping",
    soundZen: "Zen Singing Bowl",
    soundHarp: "Success Harp",
    soundNone: "Silent",
    vibrationAlerts: "Vibration Alerts",
    defaultReminderTime: "Default Reminder Window",

    // Sad Overdue Tones & Custom Audio Studio
    overdueSadSoundTitle: "Overdue Task Sad Alert Melodies",
    overdueSadSoundDesc: "Plays an emotional, melancholic tone if a task is not completed by its scheduled due time (you can customize or disable this feature at any time)",
    enableOverdueSadSound: "Enable Sad Melody for Overdue Tasks",
    selectSadTone: "Select Overdue Sad Tone",
    araskoSad1: "Arasko The Sad 1 (Melancholic Ney & Violin)",
    araskoSad2: "Arasko The Sad 2 (Elegiac Cello & Strings)",
    sadOudLament: "Sad Oriental Oud & Strings (Andalusian Lament)",
    sadQanunSigh: "Melancholic Qanun & Violin Echo",
    defaultSadToneBadge: "Default Melody",
    sadViolin: "Violin of Sorrow",
    sadPiano: "Melancholy Piano",
    sadSigh: "Poignant Sigh",
    sadRain: "Somber Rain Bells",
    sadDefeat: "Defeat Chime",
    sadAlarm: "Gloomy Warning Pulse",
    customRingtonesTitle: "Custom Audio & Ringtone Studio",
    customRingtonesDesc: "Upload your personal audio files (MP3, WAV, M4A) to customize task completion, alarms, and overdue tones",
    uploadAudioFile: "Upload Custom Audio Ringtone",
    toneNamePlaceholder: "Tone Name (e.g., My Favorite Melody)",
    selectAudioFile: "Select audio file from your device",
    saveTone: "Save Ringtone",
    previewTone: "Listen",
    stopPreview: "Stop",
    deleteTone: "Delete Ringtone",
    noCustomTones: "No custom audio files uploaded yet. You can upload any MP3 or WAV file!",
    toneAddedSuccess: "Custom audio ringtone saved to your library.",
    toneDeletedSuccess: "Custom ringtone deleted.",
    overdueBadge: "Overdue!",
    taskOverdueAlertTitle: "Task Overdue Reminder!",
    taskOverdueAlertBody: "The due time for this task has passed without completion. Don't fall behind—take action or reschedule!",
    playingAudio: "Playing...",
    audioDuration: "Duration",
    customToneLabel: "Custom Tone",
    taskSoundChoice: "Task Alert Sound",
    defaultAppSound: "Default App Sound",

    healthGoalsTitle: "Health & Routine Targets",
    dailyWaterGoal: "Daily Water Target (ml)",
    dailySleepGoal: "Daily Sleep Target (hrs)",
    dailyStepsGoal: "Daily Step Target",
    dataManagementTitle: "Data Backup & Storage",
    exportData: "Export Backup (JSON)",
    importData: "Import Backup File",
    exportSuccess: "Your Arasko data was exported and saved successfully.",
    importSuccess: "Data imported successfully. The app has updated.",
    importError: "Invalid or corrupted backup file. Please provide a valid Arasko JSON file.",
    copyBackupJson: "Copy Backup JSON",
    copiedToClipboard: "Backup data copied to clipboard!",
    pasteBackupJson: "Paste & Import JSON Directly",
    backupStatsInfo: "Locally Stored Data Size",
    pasteJsonPlaceholder: "Paste your Arasko backup JSON code here to restore...",
    importConfirmWarning: "Your tasks, routines, and preferences will be updated with this backup.",
    resetAllData: "Reset All Data to Factory Default",
    resetConfirm: "Warning: All tasks, routines, and custom settings will be permanently erased!",
    clearAllUserData: "Clear All User Data (Tasks, Health & Spiritual)",
    clearAllUserDataDesc: "Explicitly removes all existing task, health, and spiritual logs, leaving only default configuration so the app is pristine for a new user.",
    clearUserDataConfirm: "Are you sure you want to clear all user tasks, health logs, and spiritual records? Default app configuration will be retained.",
    clearUserDataSuccess: "All user tasks, health records, and spiritual logs have been successfully cleared!",
    aboutTitle: "About Arasko",
    contactUs: "Contact Us & Community",
    version: "Version 1.0.0",
    telegramChannel: "t.me/fallt_tec",
    followOnTelegram: "Official Telegram Channel",
    joinTelegramBtn: "Join our Telegram Channel",
    telegramCommunityDesc: "Join our official Telegram community for the latest announcements, feature updates, and direct support.",
    viewOnboardingAgain: "Replay Onboarding Guide",

    onboardingWelcomeTitle: "Welcome to Arasko",
    onboardingWelcomeDesc: "Your complete, professional personal task manager and daily wellness companion designed for peak focus and health.",
    onboardingPlanningTitle: "Daily, Monthly & Yearly Planning",
    onboardingPlanningDesc: "Effortlessly switch between your daily task board, interactive monthly calendar, and yearly progress milestones.",
    onboardingAssistantTitle: "100% Offline Smart Assistant",
    onboardingAssistantDesc: "Intelligent rule-based algorithms detect overlapping schedules, auto-prioritize tasks, and break down complex projects—free & private.",
    onboardingHealthTitle: "Integrated Health & Routines",
    onboardingHealthDesc: "Log water intake, monitor sleep quality, run guided workouts with rest timers, and build steady weekly habits.",
    getStarted: "Get Started",
    skip: "Skip",
    next: "Next",

    notificationsTray: "Notification Tray",
    noNotifications: "No new notifications right now",
    clearAll: "Clear All",
    testNotification: "Test Local Notification & Sound",
    notificationSimulated: "Test alert triggered successfully!",

    catWork: "Work & Projects",
    catPersonal: "Personal Life",
    catHealth: "Health & Fitness",
    catStudy: "Study & Learning",
    catFinance: "Finance & Budget",
    catHome: "Home & Family",

    tplStudy: "Exam Preparation & Topic Review",
    tplPresentation: "Create & Rehearse Slide Deck",
    tplMarketing: "Launch Marketing & Social Campaign",
    tplCleaning: "Deep Home Clean & Organization",
    tplMealPrep: "Weekly Meal Planning & Grocery Prep",
    tplCoding: "Build & Test Software Feature",

    // Gestures & Swiping
    swipeComplete: "Swipe right to complete",
    swipeDelete: "Swipe left to delete",
    swipeHint: "Swipe task right to complete or left to delete",

    // Spiritual / Islamic Routine
    spiritualTitle: "Daily Spiritual Routine & Quran",
    spiritualDesc: "Morning, evening, waking & sleeping Athkar, plus daily prayer-scheduled Quran Surahs",
    quranWardsTitle: "Daily Quran Reading (By Prayer)",
    quranWardsSubtitle: "Scheduled Surahs after each prayer for consistency and blessing",
    athkarTitle: "Daily Athkar & Fortress of the Muslim",
    wakingAthkar: "Waking Up Athkar",
    morningAthkar: "Morning Athkar",
    eveningAthkar: "Evening Athkar",
    sleepingAthkar: "Sleeping Athkar",
    readSurah: "Read Full Surah",
    closeSurah: "Close Quran Reader",
    markSurahRead: "Mark as Completed",
    surahCompleted: "Completed",
    surahCompletedMsg: "May Allah accept your devotion, grant ease and bless your day.",
    virtueLabel: "Virtue & Timing",
    tasbihCounter: "Digital Tasbih",
    tasbihCompleted: "Dhikr Completed",
    addToTodayTasks: "Add Routine to Today's Tasks",
    addedToTasksSuccess: "Quran wards and Athkar added to today's task list!",
    todaySpiritualProgress: "Today's Spiritual Progress",
    completedSpiritualItems: "Completed Wards & Athkar",
    allSpiritualDone: "All daily Athkar and Quran wards completed!",
    spiritualRemindersTitle: "Daily Quran & Athkar Reminders",
    enableSpiritualReminders: "Enable Daily Quran & Athkar Reminders",
    remindAfterPrayer: "Remind After Prayer",
    setReminderTime: "Reminder Time",
    testSpiritualSound: "Test Alert Sound",
    dailyAthkarReminders: "Daily Athkar Reminders (Waking, Morning, Evening, Sleep)",
    quranWardReminders: "5 Daily Quran Wards Reminders (After Prescribed Prayers)",

    // User Profile & Personalized Smart Guidance
    userProfileTitle: "Personal Profile & Custom Track",
    userProfileSubtitle: "Personalize Arasko with your name, profession or academic track for tailored tips and task plans",
    userName: "Your Name",
    userNamePlaceholder: "e.g. John, Dr. Sarah, Eng. Alex...",
    userRole: "Current Role",
    roleProfessional: "Professional / Employee",
    roleStudent: "Student / Scholar",
    roleOther: "Other Field",
    professionSelect: "Select Your Profession / Industry",
    trackSelect: "Select Your Academic Major / Track",
    customFieldPrompt: "Specify Your Domain / Major",
    customFieldPlaceholder: "e.g. AI Research, Digital Marketing, Literature...",
    personalizedTips: "Tailored Guidance for Your Field",
    specializedTemplates: "Specialized Action Plans & Templates",
    applyTemplate: "Add Steps to Today's Tasks",
    templateAppliedSuccess: "Template steps added to today's tasks!",
    onboardingRoleTitle: "Personalize Your Experience",
    onboardingRoleDesc: "Tell us your name and profession/major to receive tailored tips, greetings, and domain templates.",
    onboardingProfileNamePrompt: "What is your name?",
    domainTipsTitle: "Domain-Specific Tips & Strategies",
  },
  fr: {
    appName: "Arasko",
    appTagline: "Gestion professionnelle des tâches et de la santé",
    aboutText: "Arasko est une application intelligente et simple de gestion des tâches et du temps conçue pour vous aider à organiser votre journée, votre mois et votre année de manière professionnelle et sans effort. Développé par Team Fallt. Telegram officiel : t.me/fallt_tec",
    developedBy: "Développé par Team Fallt",

    today: "Aujourd'hui",
    calendar: "Calendrier",
    assistant: "Assistant Intelligent",
    health: "Santé & Forme",
    spiritual: "Routine Spirituelle",
    settings: "Paramètres",
    archive: "Archives",
    analytics: "Statistiques",

    streakDays: "Jours consécutifs",
    dayStreak: "Série d'accomplissement",
    searchPlaceholder: "Rechercher des tâches, notes...",
    filterAll: "Tous",
    filterUrgent: "Urgent",
    filterImportant: "Important",
    filterNormal: "Normal",
    addNewTask: "Nouvelle tâche",
    noTasksFound: "Aucune tâche correspondante trouvée",
    noTasksToday: "Aucune tâche prévue aujourd'hui. Profitez de votre journée ou ajoutez de nouveaux objectifs !",
    greatJobAllDone: "Excellent ! Vous avez accompli toutes les tâches du jour.",
    completionRate: "Taux de réussite",
    todayProgress: "Progression du jour",
    tasksCompleted: "Tâches terminées",
    offlineStatus: "Hors ligne",
    onlineStatus: "En ligne",
    offlineCachedBadge: "Hors ligne (En cache)",
    offlineTooltip: "L'application fonctionne hors ligne avec le contenu mis en cache via Service Worker",
    onlineTooltip: "L'application est connectée au réseau et synchronisée",

    // Task Focus & Goal Milestone
    taskFocus: "Équilibre et Focus du Jour",
    taskFocusDesc: "Analyse des tâches créées et planifiées aujourd'hui pour visualiser l'équilibre travail, vie personnelle et études.",
    workTasks: "Travail & Projets",
    personalTasks: "Vie & Santé",
    studyTasks: "Études & Savoir",
    dailyBalance: "Équilibre Quotidien",
    goalMilestone: "Étape de l'Objectif",
    dailyGoalCompleted: "Objectif du jour accompli avec succès !",
    milestoneAlmostDone: "Presque terminé ! Dernier coup d'accélérateur.",
    milestoneHalfway: "À mi-chemin de vos objectifs du jour.",
    milestoneGoodStart: "Bonne impulsion pour démarrer la journée !",
    milestoneNotStarted: "Prêt pour entamer votre première tâche.",

    // Focus Mode & Pomodoro
    focusMode: "Mode Focus",
    focusModeActive: "Mode Focus Actif",
    focusModeDesc: "Masque les tâches terminées et non urgentes pour vous concentrer sur l'essentiel",
    focusModeHint: "Affichage uniquement des tâches urgentes et en retard",
    exitFocusMode: "Quitter le focus",
    focusModeEmpty: "Aucune tâche urgente restante pour aujourd'hui. Tout est sous contrôle !",
    pomodoro: "Minuteur Pomodoro",
    pomodoroTitle: "Minuteur Focus Pomodoro 4K",
    pomodoroDesc: "Sessions de 25 minutes de concentration intense suivies de courtes pauses régénératrices.",
    focusSession: "Session de Focus (25 min)",
    shortBreak: "Courte Pause (5 min)",
    longBreak: "Longue Pause (15 min)",
    startFocus: "Démarrer le Focus",
    pauseFocus: "Mettre en Pause",
    resumeFocus: "Reprendre",
    resetFocus: "Réinitialiser",
    pomodoroCompleted: "🎉 Bravo ! Session de focus terminée",
    pomodoroCompletedDesc: "Vous avez complété une session de travail intense. Prenez une courte pause bien méritée.",
    selectTaskForPomodoro: "Associer à une tâche",
    focusTimeRemaining: "Temps restant",
    completedCyclesCount: "Cycles terminés aujourd'hui",
    startPomodoroForTask: "Lancer le Pomodoro 25 min",
    minimizeTimer: "Réduire le minuteur",

    urgent: "Urgent",
    important: "Important",
    normal: "Normal",
    priority: "Priorité",
    status: "Statut",
    notStarted: "Non commencée",
    inProgress: "En cours",
    completed: "Terminée",
    postponed: "Reportée",
    markCompleted: "Marquer comme terminée",
    markInProgress: "Commencer",
    markPostponed: "Reporter la tâche",
    undoComplete: "Annuler l'achèvement",

    createTask: "Créer une nouvelle tâche",
    editTask: "Modifier la tâche",
    taskTitle: "Titre de la tâche",
    taskTitlePlaceholder: "Ex : Revoir le rapport financier trimestriel...",
    taskDescription: "Description et détails",
    taskDescPlaceholder: "Écrivez les détails, étapes ou notes...",
    category: "Catégorie",
    startDate: "Date de début",
    dueDate: "Date d'échéance",
    startTime: "Heure de début",
    dueTime: "Heure d'échéance",
    recurrence: "Répétition",
    recurrenceNone: "Aucune",
    recurrenceDaily: "Tous les jours",
    recurrenceWeekly: "Toutes les semaines",
    recurrenceMonthly: "Tous les mois",
    recurrenceYearly: "Tous les ans",
    recurrenceCustom: "Personnalisé",
    subTasks: "Sous-tâches",
    addSubTask: "Ajouter une sous-tâche",
    subTaskPlaceholder: "Écrire une étape d'action...",
    reminders: "Rappels & Alertes",
    addReminder: "Ajouter un rappel",
    reminderAtTime: "À l'échéance",
    reminder5Min: "5 minutes avant",
    reminder15Min: "15 minutes avant",
    reminder30Min: "30 minutes avant",
    reminder1Hour: "1 heure avant",
    reminder1Day: "1 jour avant",
    notes: "Notes annexes",
    notesPlaceholder: "Liens, références ou notes supplémentaires...",
    attachImage: "Joindre une photo / document",
    cancel: "Annuler",
    save: "Enregistrer la tâche",
    delete: "Supprimer",
    archiveTask: "Archiver",
    unarchiveTask: "Restaurer",
    deleteConfirmation: "Êtes-vous sûr de vouloir supprimer définitivement cette tâche ?",

    dailyView: "Quotidien",
    monthlyView: "Mensuel",
    yearlyView: "Annuel",
    monthOverview: "Aperçu du mois",
    yearMilestones: "Jalons de l'année",
    tasksOnDate: "Tâches pour le",
    noTasksThisDay: "Aucune tâche prévue pour ce jour.",
    prevMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    prevYear: "Année précédente",
    nextYear: "Année suivante",
    dayProductivityHeatmap: "Carte thermique de productivité",

    smartAssistantTitle: "Assistant Intelligent (Local & Hors Ligne)",
    smartAssistantDesc: "Des algorithmes locaux intelligents hiérarchisent vos tâches, détectent les conflits d'horaire et décomposent vos grands projets en toute sécurité sur votre appareil.",
    smartPriorityOrder: "Ordre de priorité intelligent",
    smartPriorityDesc: "Classé selon la proximité de l'échéance, le poids de la priorité et le statut actuel.",
    scheduleConflicts: "Détecteur de conflits d'horaire",
    noConflictsFound: "Tout va bien ! Aucun créneau horaire en conflit détecté.",
    conflictDetected: "Conflit d'horaire détecté entre des tâches",
    overdueAccumulation: "Surveillance des tâches en retard",
    noOverdueTasks: "Super ! Vous n'avez aucune tâche en retard.",
    overdueTasksCount: "tâches en retard nécessitent votre attention",
    rescheduleSuggested: "Reprogrammation suggérée",
    quickRescheduleToToday: "Déplacer les tâches en retard à aujourd'hui",
    taskBreakdownGenerator: "Générateur de décomposition",
    breakdownDesc: "Choisissez un modèle pour diviser instantanément votre objectif en sous-tâches concrètes :",
    selectTemplate: "Sélectionner un modèle",
    applyBreakdown: "Appliquer comme sous-tâches",
    breakdownAppliedSuccess: "Sous-tâches ajoutées avec succès !",
    productivitySummary: "Résumé de productivité",
    weeklySummary: "Rapport hebdomadaire",
    monthlySummary: "Rapport mensuel",
    peakProductivityTime: "Période de productivité maximale",
    morningPeak: "Matinée (08:00 - 12:00)",
    afternoonPeak: "Après-midi (12:00 - 17:00)",
    eveningPeak: "Soirée (18:00 - 22:00)",
    contextualTips: "Conseils contextuels personnalisés",
    offlineNotice: "100% sur l'appareil, privé et hors ligne",

    healthTitle: "Routine Santé & Forme",
    waterIntake: "Hydratation",
    waterGoal: "Objectif d'eau quotidien",
    waterCurrent: "Enregistré aujourd'hui",
    drinkWater: "Boire un verre d'eau",
    add250ml: "+250 ml (Verre)",
    add500ml: "+500 ml (Bouteille)",
    customWaterAmount: "Quantité personnalisée",
    waterReminderPrompt: "Restez bien hydraté pour maintenir votre concentration et votre énergie toute la journée !",
    sleepSchedule: "Sommeil & Récupération",
    bedTime: "Heure du coucher",
    wakeTime: "Heure du réveil",
    sleepHours: "Heures de sommeil",
    sleepQuality: "Qualité du sommeil",
    logSleep: "Enregistrer le sommeil",
    workoutLibrary: "Bibliothèque d'entraînements",
    workoutBeginner: "Débutant : Mobilité globale & Gainage",
    workoutIntermediate: "Intermédiaire : Force & Circuit HIIT",
    workoutAdvanced: "Avancé : Puissance athlétique & Endurance",
    startWorkout: "Démarrer l'entraînement interactif",
    currentExercise: "Exercice en cours",
    setsCompleted: "Séries terminées",
    reps: "Répétitions",
    restTimer: "Minuteur de repos",
    seconds: "sec",
    finishWorkout: "Terminer et sauvegarder la séance",
    nextExercise: "Suivant",
    prevExercise: "Précédent",
    workoutCompletedMsg: "Séance formidable ! Vous avez complété votre entraînement avec succès.",
    habitTracker: "Matrice d'habitudes hebdomadaire",
    habitSleep: "Sommeil réparateur",
    habitWater: "Hydratation optimale",
    habitWorkout: "Activité physique",
    habitMeals: "Repas équilibrés",
    habitMindfulness: "Pleine conscience",
    steps: "Nombre de pas",
    stepCountGoal: "Objectif de pas",
    weeklyHabitMatrix: "Régularité des 7 derniers jours",

    settingsTitle: "Paramètres & Préférences",
    generalSettings: "Général",
    language: "Langue (Language)",
    theme: "Thème et apparence",
    themeDark: "Mode sombre",
    themeLight: "Mode clair",
    themeSystem: "Automatique (Système)",
    categoriesManagement: "Gestion des catégories et couleurs",
    addCategory: "Ajouter une catégorie",
    categoryName: "Nom de la catégorie",
    notificationsTitle: "Notifications & Alertes",
    enableNotifications: "Activer les notifications locales",
    soundAlerts: "Sonnerie de notification principale",
    soundChime: "Carillon doux",
    soundBell: "Cloche nette",
    soundPing: "Signal digital",
    soundZen: "Bol Tibétain Zen",
    soundHarp: "Harpe du Succès",
    soundNone: "Silencieux",
    vibrationAlerts: "Alertes par vibration",
    defaultReminderTime: "Délai de rappel par défaut",

    // Sad Overdue Tones & Custom Audio Studio
    overdueSadSoundTitle: "Mélodies d'alerte triste pour tâches en retard",
    overdueSadSoundDesc: "Joue un air mélancolique si une tâche dépasse son heure prévue sans être terminée (désactivable ou personnalisable à tout moment)",
    enableOverdueSadSound: "Activer la mélodie triste pour le retard",
    selectSadTone: "Choisir la sonnerie triste",
    araskoSad1: "Arasko Le Triste 1 (Ney & Violon Mélancolique)",
    araskoSad2: "Arasko Le Triste 2 (Élégie Violoncelle & Cordes)",
    sadOudLament: "Oud Oriental Triste & Cordes Andalouses",
    sadQanunSigh: "Écho de Qanun & Violon Mélancolique",
    defaultSadToneBadge: "Mélodie par défaut",
    sadViolin: "Violon Émouvant & Triste",
    sadPiano: "Piano Mélancolique",
    sadSigh: "Soupir Poignant",
    sadRain: "Cloches de Pluie Sombres",
    sadDefeat: "Sonnerie de Défaite",
    sadAlarm: "Pulsion d'Avertissement Sombre",
    customRingtonesTitle: "Studio Audio & Sonneries Personnalisées",
    customRingtonesDesc: "Importez vos propres fichiers audio (MP3, WAV, M4A) pour personnaliser les rappels, réussites ou alertes de retard",
    uploadAudioFile: "Importer un fichier audio",
    toneNamePlaceholder: "Nom de la sonnerie (ex. Ma Mélodie)",
    selectAudioFile: "Sélectionner un fichier sur votre appareil",
    saveTone: "Enregistrer la sonnerie",
    previewTone: "Écouter",
    stopPreview: "Arrêter",
    deleteTone: "Supprimer",
    noCustomTones: "Aucun fichier audio personnalisé pour le moment. Importez vos musiques MP3 ou WAV !",
    toneAddedSuccess: "Sonnerie ajoutée à votre bibliothèque locale.",
    toneDeletedSuccess: "Sonnerie supprimée avec succès.",
    overdueBadge: "En retard !",
    taskOverdueAlertTitle: "Rappel : Tâche en retard !",
    taskOverdueAlertBody: "L'heure prévue pour cette tâche est dépassée. Reprenez le contrôle et validez-la !",
    playingAudio: "Lecture en cours...",
    audioDuration: "Durée",
    customToneLabel: "Sonnerie personnalisée",
    taskSoundChoice: "Sonnerie de la tâche",
    defaultAppSound: "Sonnerie par défaut de l'app",

    healthGoalsTitle: "Objectifs Santé & Routine",
    dailyWaterGoal: "Objectif d'eau quotidien (ml)",
    dailySleepGoal: "Objectif de sommeil (heures)",
    dailyStepsGoal: "Objectif quotidien de pas",
    dataManagementTitle: "Sauvegarde & Données locales",
    exportData: "Exporter une sauvegarde (JSON)",
    importData: "Importer un fichier de sauvegarde",
    exportSuccess: "Vos données Arasko ont été exportées avec succès.",
    importSuccess: "Données importées avec succès. L'application est à jour.",
    importError: "Fichier de sauvegarde invalide ou corrompu.",
    copyBackupJson: "Copier la sauvegarde JSON",
    copiedToClipboard: "Sauvegarde copiée dans le presse-papiers !",
    pasteBackupJson: "Coller & Importer le code JSON",
    backupStatsInfo: "Taille des données stockées localement",
    pasteJsonPlaceholder: "Collez le code JSON de sauvegarde ici pour restaurer...",
    importConfirmWarning: "Vos données et réglages seront mis à jour avec cette sauvegarde.",
    resetAllData: "Réinitialiser aux valeurs d'usine",
    resetConfirm: "Attention : Toutes vos tâches et configurations seront définitivement effacées !",
    clearAllUserData: "Effacer toutes les données utilisateur (Tâches, Santé, Spirituel)",
    clearAllUserDataDesc: "Supprime toutes les tâches et journaux tout en conservant la configuration par défaut.",
    clearUserDataConfirm: "Êtes-vous sûr de vouloir effacer toutes les données de tâches, santé et spirituelles ?",
    clearUserDataSuccess: "Toutes les données utilisateur ont été effacées avec succès !",
    aboutTitle: "À propos d'Arasko",
    contactUs: "Contact & Communauté",
    version: "Version 1.0.0",
    telegramChannel: "t.me/fallt_tec",
    followOnTelegram: "Chaîne Telegram Officielle",
    joinTelegramBtn: "Rejoindre notre canal Telegram",
    telegramCommunityDesc: "Rejoignez notre communauté Telegram officielle pour les dernières nouveautés, l'assistance et les échanges.",
    viewOnboardingAgain: "Revoir le guide d'accueil",

    onboardingWelcomeTitle: "Bienvenue sur Arasko",
    onboardingWelcomeDesc: "Votre gestionnaire de tâches professionnel et compagnon de bien-être quotidien pour organiser votre temps avec clarté.",
    onboardingPlanningTitle: "Planification Quotidienne, Mensuelle & Annuelle",
    onboardingPlanningDesc: "Basculez facilement entre la vue du jour, le calendrier mensuel interactif et les jalons annuels avec gestion des priorités et rappels.",
    onboardingAssistantTitle: "Assistant Intelligent 100% Hors Ligne",
    onboardingAssistantDesc: "Des algorithmes intelligents détectent les conflits, ordonnent vos priorités et décomposent vos grands projets sans connexion internet.",
    onboardingHealthTitle: "Routine Santé & Forme Intégrée",
    onboardingHealthDesc: "Suivez votre hydratation, enregistrez votre sommeil, lancez des séances de sport guidées avec minuteur et consolidez vos habitudes.",
    getStarted: "Commencer",
    skip: "Passer",
    next: "Suivant",

    notificationsTray: "Centre de notifications",
    noNotifications: "Aucune nouvelle notification pour le moment",
    clearAll: "Tout effacer",
    testNotification: "Tester une alerte sonore et locale",
    notificationSimulated: "Alerte test déclenchée avec succès !",

    catWork: "Travail & Projets",
    catPersonal: "Vie Personnelle",
    catHealth: "Santé & Sport",
    catStudy: "Études & Savoir",
    catFinance: "Finances & Budget",
    catHome: "Maison & Famille",

    tplStudy: "Révision d'examen et apprentissage",
    tplPresentation: "Création et répétition d'une présentation",
    tplMarketing: "Lancement d'une campagne de communication",
    tplCleaning: "Grand nettoyage et rangement de la maison",
    tplMealPrep: "Planification et préparation des repas de la semaine",
    tplCoding: "Développement et test d'une fonctionnalité",

    // Gestures & Swiping
    swipeComplete: "Glisser vers la droite pour terminer",
    swipeDelete: "Glisser vers la gauche pour supprimer",
    swipeHint: "Glissez la carte à droite pour valider ou à gauche pour supprimer",

    // Spiritual / Islamic Routine
    spiritualTitle: "Routine Spirituelle & Coran Quotidien",
    spiritualDesc: "Invocations du matin, soir, réveil et sommeil, avec lecture des sourates réparties sur les 5 prières",
    quranWardsTitle: "Lecture Quotidienne du Coran (Par Prière)",
    quranWardsSubtitle: "Sourates programmées après chaque prière pour la régularité et la bénédiction",
    athkarTitle: "Invocations Quotidiennes & Citadelle du Musulman",
    wakingAthkar: "Invocations du réveil",
    morningAthkar: "Invocations du matin",
    eveningAthkar: "Invocations du soir",
    sleepingAthkar: "Invocations avant de dormir",
    readSurah: "Lire la sourate complète",
    closeSurah: "Fermer la lecture",
    markSurahRead: "Marquer comme lu",
    surahCompleted: "Lecture accomplie",
    surahCompletedMsg: "Qu'Allah accepte vos bonnes actions et bénisse votre journée.",
    virtueLabel: "Mérites et timing",
    tasbihCounter: "Chapelet Électronique (Tasbih)",
    tasbihCompleted: "Évocation accomplie",
    addToTodayTasks: "Ajouter la routine aux tâches d'aujourd'hui",
    addedToTasksSuccess: "Sourates et invocations ajoutées à la liste du jour !",
    todaySpiritualProgress: "Progression spirituelle du jour",
    completedSpiritualItems: "Invocations & lectures terminées",
    allSpiritualDone: "Toutes les invocations et sourates du jour sont accomplies !",
    spiritualRemindersTitle: "Rappels Quotidiens du Coran et des Invocations",
    enableSpiritualReminders: "Activer les rappels quotidiens du Coran et des Adhkar",
    remindAfterPrayer: "Rappel après la prière",
    setReminderTime: "Heure du rappel",
    testSpiritualSound: "Tester la tonalité de rappel",
    dailyAthkarReminders: "Rappels des Invocations (Réveil, Matin, Soir, Sommeil)",
    quranWardReminders: "Rappels des 5 Sourates Quotidiennes (Après les Prières)",

    // User Profile & Personalized Smart Guidance
    userProfileTitle: "Profil Personnel & Parcours Métier",
    userProfileSubtitle: "Personnalisez Arasko avec votre nom, profession ou filière d'études pour un accompagnement sur mesure",
    userName: "Votre Nom",
    userNamePlaceholder: "Ex. Ahmed, Sarah, Dr. Thomas...",
    userRole: "Rôle Actuel",
    roleProfessional: "Professionnel / Salarié",
    roleStudent: "Étudiant / Scolaire",
    roleOther: "Autre domaine",
    professionSelect: "Sélectionnez votre profession",
    trackSelect: "Sélectionnez votre filière d'études",
    customFieldPrompt: "Précisez votre domaine d'activité",
    customFieldPlaceholder: "Ex. IA, Marketing Digital, Droit...",
    personalizedTips: "Conseils & Stratégies pour votre profil",
    specializedTemplates: "Plans d'action & modèles spécifiques",
    applyTemplate: "Ajouter aux tâches du jour",
    templateAppliedSuccess: "Étapes du modèle ajoutées aux tâches du jour !",
    onboardingRoleTitle: "Personnalisons votre expérience",
    onboardingRoleDesc: "Indiquez votre nom et domaine d'activité pour recevoir des conseils et modèles sur mesure.",
    onboardingProfileNamePrompt: "Quel est votre prénom / nom ?",
    domainTipsTitle: "Conseils et astuces dédiés à votre domaine",
  }
};

