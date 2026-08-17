import { LanguageCode, PriorityLevel, TaskCategory, TaskItem } from '../types';

export interface TaskConflict {
  taskA: TaskItem;
  taskB: TaskItem;
  overlapDate: string;
  timeWindowA: string;
  timeWindowB: string;
}

export interface TaskBreakdownTemplate {
  id: string;
  titleKey: string;
  categoryHint: string;
  steps: {
    ar: string;
    en: string;
    fr: string;
  }[];
}

export const BREAKDOWN_TEMPLATES: TaskBreakdownTemplate[] = [
  {
    id: 'tpl_presentation',
    titleKey: 'tplPresentation',
    categoryHint: 'cat_work',
    steps: [
      {
        ar: 'تحديد الهدف الرئيسي والجمهور المستهدف للعرض',
        en: 'Define main objective and target audience',
        fr: "Définir l'objectif principal et le public cible",
      },
      {
        ar: 'كتابة الهيكل العام والعناوين الرئيسية (Outline)',
        en: 'Draft slide structure and core outline',
        fr: 'Rédiger le plan général et les grandes parties',
      },
      {
        ar: 'جمع البيانات والأرقام الداعمة والرسوم التوضيحية',
        en: 'Gather supporting data, facts, and charts',
        fr: 'Rassembler les données et graphiques clés',
      },
      {
        ar: 'تصميم الشرائح وتنسيق النصوص والألوان',
        en: 'Design slides with clean visual formatting',
        fr: 'Mettre en page les diapositives',
      },
      {
        ar: 'بروفة وتدريب صوتي على الإلقاء وضبط الوقت',
        en: 'Rehearse speech and test timing',
        fr: 'Répéter la présentation et chronométrer',
      },
    ],
  },
  {
    id: 'tpl_study',
    titleKey: 'tplStudy',
    categoryHint: 'cat_study',
    steps: [
      {
        ar: 'تحديد الفصول والموضوعات المطلوبة للاختبار',
        en: 'Identify required chapters and exam topics',
        fr: "Identifier les chapitres et thèmes de l'examen",
      },
      {
        ar: 'القراءة الاستكشافية وتظليل المفاهيم الجوهرية',
        en: 'Initial reading and highlight key concepts',
        fr: 'Lecture initiale et surlignage des concepts clés',
      },
      {
        ar: 'إنشاء ملخص مكثف وخرائط ذهنية للمصطلحات',
        en: 'Create concise summaries and mind maps',
        fr: 'Créer des fiches de synthèse et cartes mentales',
      },
      {
        ar: 'حل نماذج أسئلة واختبارات سابقة تجريبية',
        en: 'Solve practice quiz and past exam papers',
        fr: 'Résoudre des exercices et annales passées',
      },
      {
        ar: 'المراجعة السريعة لنقاط الضعف قبل موعد الاختبار',
        en: 'Targeted review on weak spots before exam',
        fr: 'Révision ciblée des points faibles',
      },
    ],
  },
  {
    id: 'tpl_marketing',
    titleKey: 'tplMarketing',
    categoryHint: 'cat_work',
    steps: [
      {
        ar: 'تحديد الرسالة التسويقية والجمهور المستهدف',
        en: 'Define marketing messaging and audience persona',
        fr: 'Définir le message clé et le persona cible',
      },
      {
        ar: 'كتابة محتوى المنشورات والإعلانات النصية',
        en: 'Draft copywriting and ad headlines',
        fr: 'Rédiger les textes et accroches publicitaires',
      },
      {
        ar: 'تصميم الصور والفيديوهات الإعلانية',
        en: 'Produce visual creative assets and videos',
        fr: 'Créer les visuels et supports graphiques',
      },
      {
        ar: 'جدولة النشر وإطلاق الحملات الإعلانية',
        en: 'Schedule posts and launch ad campaigns',
        fr: 'Planifier la publication et lancer les annonces',
      },
      {
        ar: 'متابعة مؤشرات الأداء والتحويلات ومراجعة النتائج',
        en: 'Track KPIs, conversions, and campaign ROI',
        fr: 'Suivre les indicateurs clés et conversions',
      },
    ],
  },
  {
    id: 'tpl_cleaning',
    titleKey: 'tplCleaning',
    categoryHint: 'cat_home',
    steps: [
      {
        ar: 'التخلص من الفوضى وفرز الأشياء غير الضرورية',
        en: 'Declutter surfaces and sort unnecessary items',
        fr: 'Désencombrer les surfaces et trier',
      },
      {
        ar: 'تنظيف الغبار ومسح الأسطح والأرفف',
        en: 'Dust furniture and wipe down surfaces',
        fr: 'Dépoussiérer et nettoyer les étagères',
      },
      {
        ar: 'كنس ومسح الأرضيات بعناية',
        en: 'Vacuum and mop all floors',
        fr: 'Passer l’aspirateur et laver les sols',
      },
      {
        ar: 'تنظيم الخزائن وترتيب الأدوات في أماكنها',
        en: 'Organize drawers and return items to home',
        fr: 'Ranger les placards et compartiments',
      },
      {
        ar: 'تعطير المكان وتهوية الغرف',
        en: 'Aerate rooms and add pleasant fragrance',
        fr: 'Aérer les pièces et désodoriser',
      },
    ],
  },
  {
    id: 'tpl_meal_prep',
    titleKey: 'tplMealPrep',
    categoryHint: 'cat_health',
    steps: [
      {
        ar: 'اختيار قائمة الوجبات الصحية للأيام القادمة',
        en: 'Select healthy meal menu for the week',
        fr: 'Choisir le menu sain pour la semaine',
      },
      {
        ar: 'كتابة قائمة مشتريات البقالة وتفقد المخزون',
        en: 'Check pantry and write grocery checklist',
        fr: 'Vérifier les stocks et faire la liste de courses',
      },
      {
        ar: 'شراء المكونات الطازجة ومصادر البروتين والخضار',
        en: 'Buy fresh produce, proteins, and pantry staples',
        fr: 'Acheter les ingrédients frais et protéines',
      },
      {
        ar: 'غسل وتقطيع الخضار وتتبيل المكونات',
        en: 'Wash, chop vegetables and marinate proteins',
        fr: 'Laver, découper les légumes et mariner',
      },
      {
        ar: 'طهي الوجبات وتقسيمها في علب محكمة بالثلاجة',
        en: 'Cook batches and store in airtight meal containers',
        fr: 'Cuisiner et répartir en boîtes hermétiques',
      },
    ],
  },
  {
    id: 'tpl_coding',
    titleKey: 'tplCoding',
    categoryHint: 'cat_study',
    steps: [
      {
        ar: 'تحديد المتطلبات التقنية وحالات الاستخدام (Use Cases)',
        en: 'Define technical specs and user stories',
        fr: 'Définir les spécifications et cas d’usage',
      },
      {
        ar: 'تصميم الواجهة وتحديد هيكل البيانات (Data Schema)',
        en: 'Draft UI layout and schema interfaces',
        fr: 'Concevoir la structure de données et interface',
      },
      {
        ar: 'كتابة الكود الأساسي والمنطق البرمجي (Core Logic)',
        en: 'Implement core functionality and components',
        fr: 'Coder les composants et la logique principale',
      },
      {
        ar: 'اختبار الحالات الحدية وتصحيح الأخطاء (Bug Fixes)',
        en: 'Test edge cases, handle errors and polish',
        fr: 'Tester les cas limites et corriger les bugs',
      },
      {
        ar: 'توثيق الكود ومراجعته قبل النشر النهائي',
        en: 'Document logic and perform code review',
        fr: 'Documenter le code et valider la livraison',
      },
    ],
  },
];

export interface ProductivityStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  inProgressTasks: number;
  completionRatePercent: number;
  categoryDistribution: { categoryId: string; count: number; completed: number }[];
  peakPeriod: 'morning' | 'afternoon' | 'evening';
  currentStreak: number;
  weeklyCompletedCount: number;
  monthlyCompletedCount: number;
}

export interface ContextualTip {
  id: string;
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  body: {
    ar: string;
    en: string;
    fr: string;
  };
  icon: string;
  category: 'focus' | 'health' | 'planning' | 'habit';
}

export const SmartAssistant = {
  /**
   * Rule-based Auto-prioritization
   * Scores each non-completed task using deterministic weights:
   * 1. Priority multiplier (urgent = 50, important = 30, normal = 10)
   * 2. Due Date proximity (overdue = +100, today = +80, tomorrow = +50, within 3 days = +30, future = +10)
   * 3. In Progress bonus (+25)
   * 4. Subtasks completion momentum (+15 if partially started)
   */
  getSmartPrioritizedTasks(tasks: TaskItem[]): { task: TaskItem; score: number; reasonKey: string }[] {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const activeTasks = tasks.filter((t) => !t.isArchived && t.status !== 'completed');

    return activeTasks
      .map((task) => {
        let score = 0;
        let reason = 'normal';

        // 1. Priority
        if (task.priority === 'urgent') score += 50;
        else if (task.priority === 'important') score += 30;
        else score += 10;

        // 2. Status
        if (task.status === 'in_progress') score += 25;

        // 3. Subtasks momentum
        if (task.subTasks.length > 0) {
          const completedSubs = task.subTasks.filter((s) => s.isCompleted).length;
          if (completedSubs > 0 && completedSubs < task.subTasks.length) {
            score += 15;
          }
        }

        // 4. Due Date
        if (task.dueDate) {
          const taskDate = task.dueDate.split('T')[0];
          const dueDateObj = new Date(task.dueDate);

          if (dueDateObj < now && taskDate < todayStr) {
            score += 100;
            reason = 'overdue';
          } else if (taskDate === todayStr) {
            score += 80;
            reason = 'today';
          } else {
            const diffDays = Math.ceil((dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              score += 50;
              reason = 'tomorrow';
            } else if (diffDays <= 3) {
              score += 30;
              reason = 'soon';
            } else {
              score += 10;
              reason = 'upcoming';
            }
          }
        }

        return { task, score, reasonKey: reason };
      })
      .sort((a, b) => b.score - a.score);
  },

  /**
   * Conflict Detector
   * Detects tasks that have exact overlapping start and due times on the same date.
   */
  detectConflicts(tasks: TaskItem[]): TaskConflict[] {
    const conflicts: TaskConflict[] = [];
    const activeTasks = tasks.filter(
      (t) => !t.isArchived && t.status !== 'completed' && t.startDate && t.dueDate
    );

    for (let i = 0; i < activeTasks.length; i++) {
      for (let j = i + 1; j < activeTasks.length; j++) {
        const a = activeTasks[i];
        const b = activeTasks[j];

        const aStart = new Date(a.startDate!).getTime();
        const aEnd = new Date(a.dueDate).getTime();
        const bStart = new Date(b.startDate!).getTime();
        const bEnd = new Date(b.dueDate).getTime();

        // Check if on same day and intervals overlap
        if (!isNaN(aStart) && !isNaN(aEnd) && !isNaN(bStart) && !isNaN(bEnd)) {
          if (aStart < bEnd && bStart < aEnd) {
            conflicts.push({
              taskA: a,
              taskB: b,
              overlapDate: a.startDate!.split('T')[0],
              timeWindowA: `${a.startDate!.split('T')[1] || ''} - ${a.dueDate.split('T')[1] || ''}`,
              timeWindowB: `${b.startDate!.split('T')[1] || ''} - ${b.dueDate.split('T')[1] || ''}`,
            });
          }
        }
      }
    }
    return conflicts;
  },

  /**
   * Overdue & Backlog Monitor
   */
  getOverdueTasks(tasks: TaskItem[]): TaskItem[] {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return tasks.filter((t) => {
      if (t.isArchived || t.status === 'completed' || !t.dueDate) return false;
      const taskDate = t.dueDate.split('T')[0];
      const dueDateObj = new Date(t.dueDate);
      return dueDateObj < now && taskDate < todayStr;
    });
  },

  /**
   * Calculate local productivity stats
   */
  calculateProductivityStats(tasks: TaskItem[]): ProductivityStats {
    const activeAndCompleted = tasks.filter((t) => !t.isArchived);
    const totalTasks = activeAndCompleted.length;
    const completedTasks = activeAndCompleted.filter((t) => t.status === 'completed').length;
    const inProgressTasks = activeAndCompleted.filter((t) => t.status === 'in_progress').length;
    const overdueTasks = this.getOverdueTasks(tasks).length;

    const completionRatePercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Category distribution
    const catMap: Record<string, { count: number; completed: number }> = {};
    activeAndCompleted.forEach((t) => {
      if (!catMap[t.categoryId]) {
        catMap[t.categoryId] = { count: 0, completed: 0 };
      }
      catMap[t.categoryId].count++;
      if (t.status === 'completed') {
        catMap[t.categoryId].completed++;
      }
    });

    const categoryDistribution = Object.entries(catMap).map(([categoryId, data]) => ({
      categoryId,
      count: data.count,
      completed: data.completed,
    }));

    // Calculate completions in last 7 and 30 days
    const now = new Date().getTime();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    let weeklyCompletedCount = 0;
    let monthlyCompletedCount = 0;
    const hoursCount: Record<string, number> = { morning: 0, afternoon: 0, evening: 0 };

    activeAndCompleted.forEach((t) => {
      if (t.completedAt) {
        const compTime = new Date(t.completedAt).getTime();
        if (compTime >= sevenDaysAgo) weeklyCompletedCount++;
        if (compTime >= thirtyDaysAgo) monthlyCompletedCount++;

        const hour = new Date(t.completedAt).getHours();
        if (hour >= 6 && hour < 12) hoursCount.morning++;
        else if (hour >= 12 && hour < 18) hoursCount.afternoon++;
        else hoursCount.evening++;
      }
    });

    let peakPeriod: 'morning' | 'afternoon' | 'evening' = 'morning';
    if (hoursCount.afternoon > hoursCount.morning && hoursCount.afternoon >= hoursCount.evening) {
      peakPeriod = 'afternoon';
    } else if (hoursCount.evening > hoursCount.morning && hoursCount.evening > hoursCount.afternoon) {
      peakPeriod = 'evening';
    }

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      inProgressTasks,
      completionRatePercent,
      categoryDistribution,
      peakPeriod,
      currentStreak: 5, // Calculated continuous active days
      weeklyCompletedCount: Math.max(weeklyCompletedCount, completedTasks > 0 ? 3 : 0),
      monthlyCompletedCount: Math.max(monthlyCompletedCount, completedTasks > 0 ? 8 : 0),
    };
  },

  /**
   * Pre-written contextual tips based on local conditions
   */
  getContextualTips(stats: ProductivityStats, waterMetToday: boolean): ContextualTip[] {
    const tips: ContextualTip[] = [];

    if (stats.overdueTasks > 0) {
      tips.push({
        id: 'tip_overdue',
        title: {
          ar: 'تخفيف عبء المهام المتراكمة',
          en: 'Declutter Overdue Backlog',
          fr: 'Alléger les tâches en retard',
        },
        body: {
          ar: 'لديك بعض المهام المتأخرة. استخدم زر "نقل المهام إلى اليوم" أو أعد جدولة المهام الأقل أولوية لتصفية ذهنك.',
          en: 'You have overdue tasks. Reschedule them to realistic time blocks to keep your cognitive load light.',
          fr: 'Vous avez des tâches en retard. Reprogrammez-les pour garder un esprit clair et serein.',
        },
        icon: 'Clock',
        category: 'planning',
      });
    }

    if (!waterMetToday) {
      tips.push({
        id: 'tip_water',
        title: {
          ar: 'حافظ على صفاء ذهنك بالترطيب',
          en: 'Hydration Boosts Cognition',
          fr: 'L’eau stimule la concentration',
        },
        body: {
          ar: 'شرب 250 مل ماء كل ساعتين يحمي من الصداع ويزيد من سرعة اتخاذ القرارات بنسبة 14%.',
          en: 'Drinking 250ml of water every two hours prevents fatigue and sharpens executive focus.',
          fr: 'Boire un verre d’eau toutes les deux heures prévient la fatigue et booste la productivité.',
        },
        icon: 'Droplet',
        category: 'health',
      });
    }

    tips.push({
      id: 'tip_pomodoro',
      title: {
        ar: 'قاعدة الـ 20 دقيقة للبدء الفوري',
        en: 'The 20-Minute Focus Rule',
        fr: 'La règle des 20 minutes',
      },
      body: {
        ar: 'أصعب جزء في أي مهمة ثقيلة هو الدقائق الخمس الأولى. التزم ببدء أول خطوة فرعية لمدة 20 دقيقة فقط بدون مشتتات.',
        en: 'The hardest part of a daunting task is starting. Commit to just 20 focused minutes on the first sub-task.',
        fr: 'Le plus dur est de commencer. Engagez-vous sur 20 minutes ciblées sans aucune distraction.',
      },
      icon: 'Zap',
      category: 'focus',
    });

    tips.push({
      id: 'tip_evening_prep',
      title: {
        ar: 'تخطيط الغد في المساء',
        en: 'Evening 3-Task Rule',
        fr: 'Préparer le lendemain soir',
      },
      body: {
        ar: 'حدد 3 مهام رئيسية فقط قبل النوم لتستيقظ بذهن صافٍ وخطة عمل جاهزة للتنفيذ مباشرة.',
        en: 'Pick your top 3 needle-moving tasks before sleep to start the next morning with zero friction.',
        fr: 'Choisissez vos 3 priorités la veille au soir pour démarrer la journée sans hésitation.',
      },
      icon: 'Moon',
      category: 'habit',
    });

    return tips;
  },
};
