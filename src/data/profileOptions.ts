export interface OptionItem {
  id: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  icon?: string;
  tips: {
    ar: string[];
    en: string[];
    fr: string[];
  };
}

export const PROFESSION_OPTIONS: OptionItem[] = [
  {
    id: 'software_engineering',
    name: {
      ar: 'هندسة البرمجيات والتقنية (Software & IT)',
      en: 'Software Engineering & Tech',
      fr: 'Génie Logiciel & Informatique',
    },
    tips: {
      ar: [
        'قسّم مهام البرمجة الصعبة إلى جلسات بومودورو 25 دقيقة لتجنب الإرهاق الذهني.',
        'احرص على جدولة فترات مراجعة الكود وتوثيقه في بداية اليوم أو نهايته.',
        'استخدم روتين شرب الماء وتليين عضلات الرقبة والظهر كل 60 دقيقة جلوس.',
      ],
      en: [
        'Break complex coding tasks into 25-min Pomodoro focus intervals.',
        'Schedule code reviews and documentation during low-distraction hours.',
        'Take regular posture and eye breaks every 45-60 minutes.',
      ],
      fr: [
        'Divisez les tâches de code complexes en sessions Pomodoro de 25 min.',
        'Planifiez les revues de code pendant les moments de calme.',
        'Faites des pauses régulières pour soulager votre dos et vos yeux.',
      ],
    },
  },
  {
    id: 'medicine_healthcare',
    name: {
      ar: 'الطب والعلوم الصحية والتمريض (Medicine & Health)',
      en: 'Medicine & Healthcare',
      fr: 'Médecine & Santé',
    },
    tips: {
      ar: [
        'رتّب المهام السريرية والتدريبية وفق أولويات عاجلة مع الحفاظ على ترطيب جسمك.',
        'سجل فترات الراحة القصيرة وحافظ على جدول نوم منتظم قدر الإمكان بعد المناوبات.',
        'استعن بمؤقت أراسكو لمتابعة أوقات القراءة العلمية وتحديث المعلومات.',
      ],
      en: [
        'Prioritize clinical and training duties with strict hydration tracking.',
        'Maintain consistent sleep recovery blocks after long shifts.',
        'Dedicate scheduled focus slots for clinical reading and updates.',
      ],
      fr: [
        'Priorisez vos tâches cliniques et maintenez une bonne hydratation.',
        'Aménagez des plages de récupération de sommeil après les gardes.',
        'Planifiez des créneaux dédiés à la veille médicale.',
      ],
    },
  },
  {
    id: 'business_management',
    name: {
      ar: 'إدارة الأعمال والتسويق والتجارة (Business & Marketing)',
      en: 'Business & Management',
      fr: 'Commerce & Gestion',
    },
    tips: {
      ar: [
        'ابدأ يومك بأهم 3 قرارات استراتيجية قبل مراجعة الرسائل والمحادثات.',
        'استخدم مصفوفة الأولويات (عاجل / هام) لتنظيم اجتماعات ومتابعة العملاء.',
        'راجع مؤشرات الأداء الأسبوعية في قسم التقارير الذكية لتحسين العائد.',
      ],
      en: [
        'Tackle your top 3 strategic priorities before checking messages.',
        'Use priority filtering to distinguish urgent deals from routine ops.',
        'Review weekly insights to optimize workflow velocity.',
      ],
      fr: [
        'Commencez par vos 3 priorités stratégiques majeures chaque matin.',
        'Distinguez les opportunités urgentes des opérations courantes.',
        'Consultez vos analyses hebdomadaires pour maximiser l’efficacité.',
      ],
    },
  },
  {
    id: 'design_creativity',
    name: {
      ar: 'التصميم والفنون وصناعة المحتوى (Design & Creative)',
      en: 'Design & Creative Arts',
      fr: 'Design & Création',
    },
    tips: {
      ar: [
        'خصّص ساعات الصباح الأولى لتوليد الأفكار والرسم دون أي مقاطعات.',
        'نظّم ملفات ومسودات المشاريع في فئات واضحة مع إرفاق الملاحظات.',
        'استخدم وضع التركيز في أراسكو لإنجاز التعديلات النهائية بدقة متناهية.',
      ],
      en: [
        'Block uninterrupted creative focus hours early in your workflow.',
        'Keep project assets and briefs structured within clear task categories.',
        'Use Focus Mode to finalize design deliverables without distractions.',
      ],
      fr: [
        'Bloquez des créneaux de travail créatif sans interruption le matin.',
        'Structurez vos livrables et inspirations par catégories claires.',
        'Activez le mode focus pour vos phases de rendu final.',
      ],
    },
  },
  {
    id: 'education_teaching',
    name: {
      ar: 'التعليم والتدريب والتدريس (Education & Teaching)',
      en: 'Education & Teaching',
      fr: 'Enseignement & Formation',
    },
    tips: {
      ar: [
        'حضّر الدروس والواجبات أسبوعياً باستخدام القوالب الجاهزة لتوفير الوقت.',
        'قسّم أوقات التصحيح والمتابعة إلى فترات مركزة ومحددة المدة.',
        'احرص على أخذ قسط وافر من شرب الماء والراحة الصوتية بين الحصص.',
      ],
      en: [
        'Batch lesson preparations ahead using recurring weekly routines.',
        'Schedule dedicated blocks for grading and student feedback.',
        'Stay well-hydrated and rest your voice between lecture periods.',
      ],
      fr: [
        'Préparez vos séances à l’avance avec des routines hebdomadaires.',
        'Allouez des blocs horaires dédiés aux corrections et évaluations.',
        'Hydratez-vous régulièrement et préservez votre voix entre les cours.',
      ],
    },
  },
  {
    id: 'law_consulting',
    name: {
      ar: 'القانون والاستشارات والمحاماة (Law & Legal)',
      en: 'Law & Legal Consulting',
      fr: 'Droit & Conseil Juridique',
    },
    tips: {
      ar: [
        'ثبّت مواعيد الجلسات ومذكرات الدفاع في التقويم مع تفعيل المنبه الصوتي.',
        'راجع القضايا الحساسة في وضع التركيز مع حظر المشتتات.',
        'دوّن الملاحظات الدقيقة لكل قضية في خانة الملاحظات داخل المهمة.',
      ],
      en: [
        'Lock in court dates and filing deadlines with audio reminders.',
        'Review critical cases in dedicated Focus Mode sessions.',
        'Keep detailed case summaries inside each task description.',
      ],
      fr: [
        'Fixez vos échéances de plaidoirie avec des rappels audios fiables.',
        'Analysez vos dossiers majeurs en mode concentration profonde.',
        'Consignez les notes détaillées directement dans chaque tâche.',
      ],
    },
  },
  {
    id: 'engineering_construction',
    name: {
      ar: 'الهندسة المدنية والمعمارية والميدانية (Engineering & Fieldwork)',
      en: 'Engineering & Construction',
      fr: 'Ingénierie & Chantier',
    },
    tips: {
      ar: [
        'تابع زيارات الموقع وجداول تسليم المخططات عبر تقويم أراسكو الشهري.',
        'قسّم مراحل المشروع الكبرى إلى مهام فرعية (Subtasks) قابلة للقياس.',
        'احرص على تسجيل شرب الماء لتجنب الجفاف أثناء العمل الميداني.',
      ],
      en: [
        'Track site inspections and milestone deadlines on the monthly calendar.',
        'Deconstruct major project phases into actionable sub-tasks.',
        'Monitor water intake diligently during intense on-site work.',
      ],
      fr: [
        'Suivez vos visites de chantier sur le calendrier mensuel.',
        'Décomposez les grands projets en sous-tâches mesurables.',
        'Suivez votre consommation d’eau pendant les journées de terrain.',
      ],
    },
  },
  {
    id: 'freelance_independent',
    name: {
      ar: 'العمل الحر وريادة الأعمال الرقمية (Freelancer & Solopreneur)',
      en: 'Freelance & Independent',
      fr: 'Freelance & Indépendant',
    },
    tips: {
      ar: [
        'حدّد ساعات عمل صارمة لنفسك وافصل بين مهام العمل والحياة الشخصية.',
        'استخدم مؤقت بومودورو لتتبع ساعات العمل على مشاريع العملاء بدقة.',
        'خصّص يوم الجمعة لمراجعة الفواتير والمدفوعات والتخطيط للأسبوع القادم.',
      ],
      en: [
        'Set strict working boundaries between client deliverables and life.',
        'Use the Pomodoro timer to maintain productive momentum on projects.',
        'Dedicate an end-of-week slot for invoices, billing, and planning.',
      ],
      fr: [
        'Fixez des limites claires entre vos missions et votre vie personnelle.',
        'Utilisez le minuteur Pomodoro pour maintenir une cadence soutenue.',
        'Réservez un créneau en fin de semaine pour la facturation et le planning.',
      ],
    },
  },
  {
    id: 'other_profession',
    name: {
      ar: 'مجال مهني آخر (مجال مخصص)',
      en: 'Other Profession / Custom Field',
      fr: 'Autre Métier / Domaine Personnalisé',
    },
    tips: {
      ar: [
        'رتّب مهامك اليومية حسب الأهمية وتدرج في إنجازها بإتقان.',
        'استغل المساعد الذكي في أراسكو لترتيب أولوياتك وتوفير وقتك الثمين.',
        'حافظ على توازنك اليومي بين المهام والعبادات والصحة البدنية.',
      ],
      en: [
        'Organize your daily workflow by importance and execute with focus.',
        'Leverage the Arasko smart assistant to optimize your schedule.',
        'Maintain balance between daily goals, spiritual routines, and wellness.',
      ],
      fr: [
        'Organisez vos priorités quotidiennes et avancez méthodiquement.',
        'Profitez de l’assistant intelligent pour optimiser votre temps.',
        'Préservez un équilibre harmonieux entre travail, santé et bien-être.',
      ],
    },
  },
];

export const STUDENT_TRACK_OPTIONS: OptionItem[] = [
  {
    id: 'computer_science_it',
    name: {
      ar: 'علوم الحاسوب وتكنولوجيا المعلومات (CS & IT)',
      en: 'Computer Science & Software',
      fr: 'Informatique & Technologies',
    },
    tips: {
      ar: [
        'قسّم مشاريع البرمجة إلى مهام فرعية (تصميم، كود، اختبار) لتسليمها مبكراً.',
        'استخدم جلسات تركيز بومودورو 25 دقيقة أثناء حل الخوارزميات والواجبات.',
        'حافظ على تنظيم وقت المذاكرة اليومية لتجنب تراكم مواد الفاينل.',
      ],
      en: [
        'Break lab assignments into design, coding, and testing phases.',
        'Use 25-minute Pomodoro sprints for algorithm practice and problem solving.',
        'Maintain steady daily review blocks to avoid exam-season overload.',
      ],
      fr: [
        'Découpez vos TP en étapes claires : conception, code et tests.',
        'Appliquez des sessions Pomodoro de 25 min pour résoudre vos exercices.',
        'Révisez régulièrement pour éviter les révisions de dernière minute.',
      ],
    },
  },
  {
    id: 'medicine_pharmacy',
    name: {
      ar: 'الطب البشري وطب الأسنان والصيدلة (Medical & Pharmacy)',
      en: 'Medicine, Dentistry & Pharmacy',
      fr: 'Médecine, Dentaire & Pharmacie',
    },
    tips: {
      ar: [
        'طبّق تقنية التكرار المتباعد (Spaced Repetition) بمراجعة الفصول أسبوعياً.',
        'ثبّت أوقات النوم والصلاة في جدولك لأن صحتك هي سر تركيزك وحفظك.',
        'استخدم وضع التركيز لمذاكرة المواد ذات الحجم الكبير كالتشريح والأدوية.',
      ],
      en: [
        'Adopt spaced repetition routines by scheduling weekly review cycles.',
        'Guard your sleep and wellness habits to sustain high memory retention.',
        'Use Focus Mode for heavy subjects like anatomy and pharmacology.',
      ],
      fr: [
        'Pratiquez la répétition espacée en planifiant des révisions régulières.',
        'Préservez votre sommeil et vos routines pour une rétention optimale.',
        'Activez le mode concentration pour les matières denses comme l’anatomie.',
      ],
    },
  },
  {
    id: 'engineering_student',
    name: {
      ar: 'الهندسة بكافة فروعها (Engineering Sciences)',
      en: 'Engineering Studies',
      fr: 'Études d’Ingénierie',
    },
    tips: {
      ar: [
        'ابدأ بحل المسائل الصعبة والمعادلات عندما يكون تركيزك في قمته صباحاً.',
        'رتّب مشاريع التخرج والتكليفات وفق مواعيد نهائية صارمة مع تذكيرات.',
        'احرص على أخذ استراحات قصيرة لإراحة العينين أثناء الرسم الهندسي والـ CAD.',
      ],
      en: [
        'Tackle complex mathematical derivations during peak morning hours.',
        'Set firm milestone dates for capstone projects with proactive alerts.',
        'Take regular visual breaks during intensive CAD and modeling sessions.',
      ],
      fr: [
        'Résolvez les calculs complexes durant vos heures de pic de forme.',
        'Planifiez des échéances rigoureuses pour vos projets et rendus.',
        'Prenez des pauses visuelles lors de vos sessions intensives de CAO.',
      ],
    },
  },
  {
    id: 'business_economics',
    name: {
      ar: 'إدارة الأعمال والاقتصاد والمحاسبة (Business & Economics)',
      en: 'Business, Economics & Finance',
      fr: 'Commerce, Économie & Finance',
    },
    tips: {
      ar: [
        'جهّز دراسات الحالة والعروض التقديمية عبر تقسيمها لخطوات سهلة الإنجاز.',
        'استخدم تقويم أراسكو لمتابعة تواريخ الاختبارات النصفية والنهائية بدقة.',
        'راجع المفاهيم الأساسية والأرقام المالية في جلسات تركيز صباحية.',
      ],
      en: [
        'Deconstruct case studies and group presentations into bite-sized tasks.',
        'Track midterm and final exam schedules on the Arasko calendar.',
        'Review core finance formulas and economic models during morning blocks.',
      ],
      fr: [
        'Décomposez vos études de cas et exposés en étapes progressives.',
        'Suivez le planning de vos examens partiels sur le calendrier.',
        'Révisez les modèles économiques lors de sessions matinales dédiées.',
      ],
    },
  },
  {
    id: 'humanities_languages',
    name: {
      ar: 'العلوم الإنسانية واللغات والقانون (Humanities & Languages)',
      en: 'Humanities, Arts & Law',
      fr: 'Sciences Humaines, Langues & Droit',
    },
    tips: {
      ar: [
        'خصّص أوقاتاً ثابتة للقراءة المعمقة والتلخيص وتدوين الملاحظات.',
        'استعن بمؤقت بومودورو للتدرب على الكتابة الأكاديمية وحفظ المصطلحات.',
        'راجع ملخصاتك بصوت مسموع لترسيخ المعلومات بسرعة وسهولة.',
      ],
      en: [
        'Reserve dedicated daily reading and essay synthesis blocks.',
        'Use Pomodoro sessions to practice vocabulary and legal arguments.',
        'Review study summaries actively to solidify conceptual retention.',
      ],
      fr: [
        'Consacrez des plages horaires régulières à la lecture et à la synthèse.',
        'Utilisez la méthode Pomodoro pour rédiger et mémoriser le vocabulaire.',
        'Relisez vos fiches activement pour ancrer les concepts clés.',
      ],
    },
  },
  {
    id: 'highschool_secondary',
    name: {
      ar: 'المرحلة الثانوية والبكالوريا / التوجيهي (Secondary & High School)',
      en: 'High School & Secondary School',
      fr: 'Lycée & Baccalauréat',
    },
    tips: {
      ar: [
        'نظّم جدول مذاكرة يومي يشمل حل نماذج الامتحانات السابقة باستمرار.',
        'احرص على أذكار الصباح والمساء والصلوات في وقتها لتنال التوفيق والسكينة.',
        'ابتعد عن المشتتات أثناء المذاكرة واستخدم مؤقت التركيز 25 دقيقة.',
      ],
      en: [
        'Build a daily study plan dedicated to solving past exam papers.',
        'Keep up with your daily prayer and spiritual routine for inner focus.',
        'Remove phone distractions and rely on 25-minute Pomodoro intervals.',
      ],
      fr: [
        'Établissez un planning quotidien axé sur les annales d’examens.',
        'Préservez votre sérénité grâce à vos routines régulières.',
        'Éloignez les distractions et travaillez par blocs de 25 minutes.',
      ],
    },
  },
  {
    id: 'other_student_track',
    name: {
      ar: 'تخصص أو مساق دراسي آخر (مساق مخصص)',
      en: 'Other Academic Track / Major',
      fr: 'Autre Filière / Cursus Personnalisé',
    },
    tips: {
      ar: [
        'قسّم المنهاج الدراسي إلى أجزاء يومية صغيرة لتصل إلى أعلى درجات التفوق.',
        'استعن بأراسكو لجدولة أوقات المذاكرة والواجبات والمراجعة الأسبوعية.',
        'حافظ على شرب الماء والنوم الكافي لتنشيط الذاكرة وسرعة الاستيعاب.',
      ],
      en: [
        'Break your curriculum into consistent daily milestones to excel.',
        'Use Arasko to schedule homework, lectures, and weekly reviews.',
        'Stay well-hydrated and well-rested for optimal cognitive retention.',
      ],
      fr: [
        'Fractionnez votre programme en objectifs quotidiens atteignables.',
        'Planifiez vos cours, devoirs et révisions avec méthode.',
        'Hydratez-vous et dormez suffisamment pour booster votre mémoire.',
      ],
    },
  },
];
