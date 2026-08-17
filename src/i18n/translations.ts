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

  // Focus Mode
  focusMode: string;
  focusModeActive: string;
  focusModeDesc: string;
  focusModeHint: string;
  exitFocusMode: string;
  focusModeEmpty: string;

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
  resetAllData: string;
  resetConfirm: string;
  aboutTitle: string;
  version: string;
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
}

export const translations: Record<LanguageCode, Translations> = {
  ar: {
    appName: "أراسكو",
    appTagline: "تنظيم احترافي للمهام والروتين الصحي",
    aboutText: "أراسكو هو تطبيق ذكي وبسيط لإدارة المهام والوقت مصمم لمساعدتك في تنظيم يومك وشهرك وسنتك بكل احترافية وسهولة. تم تطويره بواسطة فريق Fallt.",
    developedBy: "تم التطوير بواسطة فريق Fallt",

    today: "اليوم",
    calendar: "التقويم",
    assistant: "المساعد الذكي",
    health: "الصحة واللياقة",
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

    // Focus Mode
    focusMode: "وضع التركيز الفائق",
    focusModeActive: "وضع التركيز مفعّل",
    focusModeDesc: "إخفاء المهام المكتملة وغير العاجلة للتركيز على الأهم والمستعجل",
    focusModeHint: "يعرض فقط المهام العاجلة والمتأخرة قيد التنفيذ",
    exitFocusMode: "إلغاء التركيز",
    focusModeEmpty: "لا توجد مهام عاجلة متبقية لليوم. كل شيء تحت السيطرة!",

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
    resetAllData: "إعادة ضبط المصنع ومسح كل البيانات",
    resetConfirm: "تحذير: سيتم مسح كافة المهام والبيانات نهائياً!",
    aboutTitle: "حول تطبيق أراسكو",
    version: "الإصدار 1.0.0",
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
  },
  en: {
    appName: "Arasko",
    appTagline: "Professional Task & Health Management",
    aboutText: "Arasko is a smart, simple task and time management app designed to help you organize your day, month, and year professionally and effortlessly. Developed by Team Fallt.",
    developedBy: "Developed by Team Fallt",

    today: "Today",
    calendar: "Calendar",
    assistant: "Smart Assistant",
    health: "Health & Fitness",
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

    // Focus Mode
    focusMode: "Focus Mode",
    focusModeActive: "Focus Mode Active",
    focusModeDesc: "Hides completed tasks and non-urgent items to help you concentrate on top priorities",
    focusModeHint: "Showing only pending urgent and overdue tasks",
    exitFocusMode: "Exit Focus",
    focusModeEmpty: "No urgent tasks remaining today. You're completely on top of things!",

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
    resetAllData: "Reset All Data to Factory Default",
    resetConfirm: "Warning: All tasks, routines, and custom settings will be permanently erased!",
    aboutTitle: "About Arasko",
    version: "Version 1.0.0",
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
  },
  fr: {
    appName: "Arasko",
    appTagline: "Gestion professionnelle des tâches et de la santé",
    aboutText: "Arasko est une application intelligente et simple de gestion des tâches et du temps conçue pour vous aider à organiser votre journée, votre mois et votre année de manière professionnelle et sans effort. Développé par Team Fallt.",
    developedBy: "Développé par Team Fallt",

    today: "Aujourd'hui",
    calendar: "Calendrier",
    assistant: "Assistant Intelligent",
    health: "Santé & Forme",
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

    // Focus Mode
    focusMode: "Mode Focus",
    focusModeActive: "Mode Focus Actif",
    focusModeDesc: "Masque les tâches terminées et non urgentes pour vous concentrer sur l'essentiel",
    focusModeHint: "Affichage uniquement des tâches urgentes et en retard",
    exitFocusMode: "Quitter le focus",
    focusModeEmpty: "Aucune tâche urgente restante pour aujourd'hui. Tout est sous contrôle !",

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
    resetAllData: "Réinitialiser aux valeurs d'usine",
    resetConfirm: "Attention : Toutes vos tâches et configurations seront définitivement effacées !",
    aboutTitle: "À propos d'Arasko",
    version: "Version 1.0.0",
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
  }
};
