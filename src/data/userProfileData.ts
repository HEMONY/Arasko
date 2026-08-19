import { AppSettings, LanguageCode } from '../types';

export interface ProfessionOption {
  id: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  icon: string; // Lucide icon name
  titlePrefix: {
    ar: string;
    en: string;
    fr: string;
  };
  tips: {
    title: { ar: string; en: string; fr: string };
    desc: { ar: string; en: string; fr: string };
    actionPrompt: { ar: string; en: string; fr: string };
  }[];
  templates: {
    id: string;
    title: { ar: string; en: string; fr: string };
    description: { ar: string; en: string; fr: string };
    steps: { ar: string; en: string; fr: string }[];
  }[];
}

export interface StudentTrackOption {
  id: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  icon: string;
  titlePrefix: {
    ar: string;
    en: string;
    fr: string;
  };
  tips: {
    title: { ar: string; en: string; fr: string };
    desc: { ar: string; en: string; fr: string };
    actionPrompt: { ar: string; en: string; fr: string };
  }[];
  templates: {
    id: string;
    title: { ar: string; en: string; fr: string };
    description: { ar: string; en: string; fr: string };
    steps: { ar: string; en: string; fr: string }[];
  }[];
}

export const PROFESSIONS_LIST: ProfessionOption[] = [
  {
    id: 'tech_software',
    name: {
      ar: 'هندسة البرمجيات وتقنية المعلومات (Software / IT)',
      en: 'Software Engineering & IT',
      fr: 'Ingénierie Logicielle & IT',
    },
    icon: 'Code2',
    titlePrefix: {
      ar: 'باشمهندس',
      en: 'Engineer',
      fr: 'Ingénieur',
    },
    tips: [
      {
        title: {
          ar: 'جلسات عمل عميق (Deep Work) للبرمجة',
          en: 'Deep Work Blocks for Coding',
          fr: 'Sessions Deep Work pour le Code',
        },
        desc: {
          ar: 'خصص 90 دقيقة متصلة لحل المشكلات المعقدة وكتابة الكود دون أي إشعارات أو مقاطعات.',
          en: 'Block 90-minute distraction-free sessions for complex algorithms and logic without notifications.',
          fr: 'Bloquez 90 minutes sans distraction pour le code complexe et la résolution de bugs.',
        },
        actionPrompt: {
          ar: 'جدولة جلسة برمجة مركزة اليوم',
          en: 'Schedule a Deep Coding Session Today',
          fr: 'Planifier une session de code aujourd’hui',
        },
      },
      {
        title: {
          ar: 'تجزئة طلبات الدمج (Small Pull Requests)',
          en: 'Atomic Commits & Modular PRs',
          fr: 'Découpage des Pull Requests',
        },
        desc: {
          ar: 'قسّم المهام البرمجية الكبيرة إلى مهام فرعية صغيرة يسهل مراجعتها واختبارها وتفادي تراكم الأخطاء.',
          en: 'Break large code features into modular subtasks to ease code review and reduce deployment risk.',
          fr: 'Divisez vos développements en sous-tâches simples à tester et valider.',
        },
        actionPrompt: {
          ar: 'مراجعة وتقسيم المهمة الحالية',
          en: 'Split Current Task into Atomic Steps',
          fr: 'Diviser la tâche actuelle',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_software_sprint',
        title: {
          ar: 'سبرنت تطوير ميزة برمجية جديدة',
          en: 'Feature Development Sprint',
          fr: 'Sprint de Développement Fonctionnalité',
        },
        description: {
          ar: 'خطوات منهجية لتصميم وكتابة واختبار الميزات البرمجية وفق أفضل الممارسات.',
          en: 'Methodical blueprint to design, code, test, and ship clean software features.',
          fr: 'Étapes pour concevoir, coder, tester et déployer du code propre.',
        },
        steps: [
          { ar: 'تحليل المتطلبات وهيكلة قاعدة البيانات/الواجهة', en: 'Requirement analysis & architecture draft', fr: 'Analyse des besoins & architecture' },
          { ar: 'كتابة الكود البرمجي الأساسي (Core Logic)', en: 'Develop core logic & API endpoints', fr: 'Développement de la logique centrale' },
          { ar: 'كتابة اختبارات الوحدة (Unit / Integration Tests)', en: 'Write Unit & Integration Tests', fr: 'Écriture des tests unitaires' },
          { ar: 'إجراء مراجعة الكود (Code Review & Refactoring)', en: 'Perform Code Review & Refactoring', fr: 'Revue de code et refactorisation' },
          { ar: 'الدمج والنشر والتحقق في بيئة الإنتاج', en: 'Merge, deploy, and verify in production', fr: 'Fusion, déploiement et vérification' },
        ],
      },
    ],
  },
  {
    id: 'medicine_health',
    name: {
      ar: 'الطب والرعاية الصحية والتمريض (Medicine & Health)',
      en: 'Medicine & Healthcare',
      fr: 'Médecine & Santé',
    },
    icon: 'Stethoscope',
    titlePrefix: {
      ar: 'دكتور',
      en: 'Dr.',
      fr: 'Dr.',
    },
    tips: [
      {
        title: {
          ar: 'قوائم التحقق السريرية لمنع الإجهاد',
          en: 'Clinical Checklists & Shift Pacing',
          fr: 'Listes de Contrôle Clinique',
        },
        desc: {
          ar: 'استخدم قوائم مهام قصيرة للحالات اليومية والمتابعات لتقليل الحمل الذهني أثناء المناوبات.',
          en: 'Use structured patient checklists to reduce cognitive fatigue during heavy clinical shifts.',
          fr: 'Utilisez des listes structurées pour soulager la charge mentale pendant les gardes.',
        },
        actionPrompt: {
          ar: 'ترتيب أولويات الحالات والمراجعات',
          en: 'Prioritize Clinical Rounds & Records',
          fr: 'Prioriser les visites et dossiers',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_medical_cases',
        title: {
          ar: 'خطة متابعة الحالات وتحديث الملفات الطبية',
          en: 'Patient Cases & Clinical Rounds',
          fr: 'Suivi des Dossiers Médicaux',
        },
        description: {
          ar: 'إدارة أوقات المرور على المرضى وكتابة التقارير الطبية.',
          en: 'Plan patient rounds, diagnostics, and medical notes efficiently.',
          fr: 'Organiser les visites cliniques et rapports médicaux.',
        },
        steps: [
          { ar: 'مراجعة التحاليل والصور الإشعاعية الصباحية', en: 'Review lab results & morning radiology', fr: 'Vérifier les bilans et radios' },
          { ar: 'المرور السريري وتدوين التطورات الطبية', en: 'Clinical ward rounds & progress notes', fr: 'Visite médicale et observations' },
          { ar: 'تحديث الخطط العلاجية وتعديل الأدوية', en: 'Adjust treatment plans & prescriptions', fr: 'Ajuster les traitements' },
          { ar: 'التواصل مع ذوي المرضى وتوثيق الخروج', en: 'Family consults & discharge paperwork', fr: 'Transmission aux familles et sorties' },
        ],
      },
    ],
  },
  {
    id: 'education_teaching',
    name: {
      ar: 'التعليم والتدريس والبحث الأكاديمي (Education)',
      en: 'Education & Teaching',
      fr: 'Éducation & Enseignement',
    },
    icon: 'GraduationCap',
    titlePrefix: {
      ar: 'أستاذ',
      en: 'Professor / Teacher',
      fr: 'Professeur',
    },
    tips: [
      {
        title: {
          ar: 'تجميع مهام التصحيح والتحضير',
          en: 'Batch Grading & Lesson Design',
          fr: 'Groupement des Corrections & Préparations',
        },
        desc: {
          ar: 'خصص فترات موحدة لتصحيح الواجبات وإعداد الدروس لرفع الكفاءة وتوفير الوقت للبحث.',
          en: 'Batch grading and lesson preparation into dedicated blocks to preserve focus.',
          fr: 'Régroupez les corrections et la préparation des cours pour gagner du temps.',
        },
        actionPrompt: {
          ar: 'تحديد فترة تحضير الدروس للأسبوع',
          en: 'Set Lesson Planning Time',
          fr: 'Fixer la préparation hebdomadaire',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_lesson_prep',
        title: {
          ar: 'تحضير وحدة دراسية تفاعلية',
          en: 'Interactive Lesson Unit Prep',
          fr: 'Préparation d’Unité Pédagogique',
        },
        description: {
          ar: 'إعداد الأهداف التعليمية، العروض التقديمية، والأنشطة التقويمية.',
          en: 'Formulate learning objectives, materials, and student assessment.',
          fr: 'Structurer les objectifs, supports et évaluations.',
        },
        steps: [
          { ar: 'تحديد نواتج التعلم المستهدفة للدرس', en: 'Define learning outcomes & core concepts', fr: 'Définir les objectifs pédagogiques' },
          { ar: 'إعداد العرض التقديمي والوسائل البصرية', en: 'Prepare interactive slides & visuals', fr: 'Créer le diaporama et les supports' },
          { ar: 'تصميم النشاط الصفي أو التمرين التطبيقي', en: 'Design classroom exercises & worksheets', fr: 'Concevoir l’exercice pratique' },
          { ar: 'وضع أسئلة التقويم النهائي وملاحظات التحسين', en: 'Formulate quiz questions & feedback rubric', fr: 'Rédiger l’évaluation formative' },
        ],
      },
    ],
  },
  {
    id: 'business_management',
    name: {
      ar: 'إدارة الأعمال والريادة والمشاريع (Business & Management)',
      en: 'Business, Management & Startups',
      fr: 'Gestion d’Entreprise & Startups',
    },
    icon: 'Briefcase',
    titlePrefix: {
      ar: 'الأستاذ',
      en: 'Leader',
      fr: 'Manager',
    },
    tips: [
      {
        title: {
          ar: 'مصفوفة أيزنهاور لتفويض وإنجاز المهام',
          en: 'Eisenhower Matrix Prioritization',
          fr: 'Matrice d’Eisenhower pour Décider',
        },
        desc: {
          ar: 'صنف مهامك إلى: عاجل ومهم (افعله فوراً)، مهم غير عاجل (جدوله)، عاجل غير مهم (فوضه).',
          en: 'Organize tasks by Urgent/Important to focus on strategic growth rather than putting out fires.',
          fr: 'Triez les urgences et priorisez les leviers stratégiques à forte valeur ajoutée.',
        },
        actionPrompt: {
          ar: 'فرز المهام الاستراتيجية لليوم',
          en: 'Filter Today’s Strategic Priorities',
          fr: 'Sélectionner les priorités stratégiques',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_project_launch',
        title: {
          ar: 'إطلاق مشروع أو مبادرة جديدة',
          en: 'Project / Initiative Launch Plan',
          fr: 'Lancement de Projet & Initiative',
        },
        description: {
          ar: 'تخطيط الموارد والجدول الزمني ومؤشرات الأداء الرئيسية (KPIs).',
          en: 'Plan budget, timeline, stakeholders, and milestone KPIs.',
          fr: 'Planifier le calendrier, budget et KPIs clés.',
        },
        steps: [
          { ar: 'تحديد وثيقة نطاق المشروع والمستهدفات (Scope & KPIs)', en: 'Define project scope & target KPIs', fr: 'Définir le périmètre et les KPIs' },
          { ar: 'توزيع المسؤوليات والجدول الزمني على الفريق', en: 'Assign roles & set timeline milestones', fr: 'Attribuer les rôles et jalons' },
          { ar: 'مراجعة الميزانية والمخاطر المحتملة وخطة الطوارئ', en: 'Budget audit, risk assessment & mitigation', fr: 'Audit budgétaire et gestion des risques' },
          { ar: 'عقد اجتماع التدشين وإطلاق المرحلة الأولى', en: 'Host kickoff meeting & launch Phase 1', fr: 'Organiser la réunion de lancement' },
        ],
      },
    ],
  },
  {
    id: 'engineering_general',
    name: {
      ar: 'الهندسة (معمارية، مدنية، ميكانيكية، كهربائية)',
      en: 'Engineering (Civil, Mech, Arch, Elec)',
      fr: 'Ingénierie (Civile, Méc, Arch, Élec)',
    },
    icon: 'Compass',
    titlePrefix: {
      ar: 'باشمهندس',
      en: 'Engineer',
      fr: 'Ingénieur',
    },
    tips: [
      {
        title: {
          ar: 'المطابقة الدقيقة للمعايير والمواصفات',
          en: 'Spec & Safety Checklist Verification',
          fr: 'Vérification des Normes & Sécurité',
        },
        desc: {
          ar: 'راجع الحسابات والمخططات الهندسية قبل الاعتماد لتفادي أي تكاليف إعادة عمل.',
          en: 'Perform systematic calculation checks and review blueprints before sign-off.',
          fr: 'Vérifiez scrupuleusement les calculs et plans avant validation finale.',
        },
        actionPrompt: {
          ar: 'مراجعة المخططات الهندسية المعلقة',
          en: 'Audit Pending Engineering Specs',
          fr: 'Auditer les plans en cours',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_eng_design',
        title: {
          ar: 'دراسة وتدقيق مخطط وتصميم هندسي',
          en: 'Engineering Design & CAD Review',
          fr: 'Étude & Revue de Plan Ingénierie',
        },
        description: {
          ar: 'فحص الحسابات، النمذجة ثلاثية الأبعاد، وإخراج التقرير الفني.',
          en: 'Calculate loads, model in CAD, and prepare technical spec sheets.',
          fr: 'Calculs de charges, modélisation CAO et rapport technique.',
        },
        steps: [
          { ar: 'جمع المعطيات الميدانية والاشتراطات الفنية', en: 'Gather field measurements & technical constraints', fr: 'Collecter les mesures et contraintes' },
          { ar: 'إجراء الحسابات الإنشائية/الميكانيكية بدقة', en: 'Run structural/mechanical calculations', fr: 'Exécuter les calculs techniques' },
          { ar: 'تعديل وتحديث المخططات والنماذج الهندسية (CAD/BIM)', en: 'Update CAD/BIM drawing sheets', fr: 'Mettre à jour les plans CAO/BIM' },
          { ar: 'إصدار التقرير الفني المعتمد والموافقة النهائية', en: 'Generate certified technical report', fr: 'Rédiger le rapport technique final' },
        ],
      },
    ],
  },
  {
    id: 'design_creative',
    name: {
      ar: 'التصميم الجرافيكي وتجربة المستخدم وصناعة المحتوى (Design & Creative)',
      en: 'Design, UI/UX & Creative Arts',
      fr: 'Design, UI/UX & Création',
    },
    icon: 'Palette',
    titlePrefix: {
      ar: 'المبدع',
      en: 'Creator',
      fr: 'Créateur',
    },
    tips: [
      {
        title: {
          ar: 'جلسات التغذية البصرية والعصف الذهني',
          en: 'Visual Inspiration & Moodboarding',
          fr: 'Veille Créative & Moodboard',
        },
        desc: {
          ar: 'ابدأ كل مشروع بجمع لوحة إلهام ومراجع بصرية قبل الشروع في التصميم الفعلي.',
          en: 'Build a solid moodboard and collect references before opening Figma/Adobe tools.',
          fr: 'Créez un moodboard solide avant de concevoir pour guider votre créativité.',
        },
        actionPrompt: {
          ar: 'إنشاء لوحة إلهام للمشروع القادم',
          en: 'Build Project Moodboard',
          fr: 'Créer le moodboard du projet',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_design_sprint',
        title: {
          ar: 'سبرنت تصميم هوية أو واجهة مستخدم (UI/UX)',
          en: 'UI/UX & Identity Design Sprint',
          fr: 'Sprint Design d’Interface UI/UX',
        },
        description: {
          ar: 'رحلة متكاملة من البحث والأفكار الأولية وحتى النماذج التفاعلية.',
          en: 'From wireframes and typography to high-fidelity interactive prototypes.',
          fr: 'Du wireframe à la maquette interactive haute fidélité.',
        },
        steps: [
          { ar: 'البحث وبناء لوحة الإلهام (Moodboard & Research)', en: 'Research & Moodboard collation', fr: 'Recherche et moodboard d’inspiration' },
          { ar: 'رسم المخططات الهيكلية السريعة (Wireframing)', en: 'Low-fi wireframing & user flow map', fr: 'Création des wireframes et flux' },
          { ar: 'تصميم الواجهات بجودة عالية (High-Fidelity UI)', en: 'High-fidelity visual design & components', fr: 'Design visuel haute fidélité' },
          { ar: 'بناء النموذج التفاعلي واختبار تجربة الاستخدام', en: 'Interactive prototyping & usability test', fr: 'Prototypage interactif et tests' },
        ],
      },
    ],
  },
  {
    id: 'marketing_sales',
    name: {
      ar: 'التسويق الرقمي والمبيعات (Marketing & Sales)',
      en: 'Digital Marketing & Sales',
      fr: 'Marketing Digital & Ventes',
    },
    icon: 'TrendingUp',
    titlePrefix: {
      ar: 'الأستاذ',
      en: 'Growth Specialist',
      fr: 'Spécialiste Growth',
    },
    tips: [
      {
        title: {
          ar: 'متابعة مؤشرات التحويل (Conversion Metrics)',
          en: 'Track Daily Funnel & Conversions',
          fr: 'Suivi du Tunnel de Conversion',
        },
        desc: {
          ar: 'راجع أداء الحملات ونسب التحويل يومياً لتحسين استهداف الميزانية الإعلانية.',
          en: 'Audit ad spend ROI, lead acquisition rates, and conversion pipelines daily.',
          fr: 'Analysez quotidiennement le ROI des campagnes et vos prospects qualifiés.',
        },
        actionPrompt: {
          ar: 'تدقيق أرقام الحملة الإعلانية',
          en: 'Audit Campaign Metrics',
          fr: 'Auditer les métriques de campagne',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_mkt_campaign',
        title: {
          ar: 'إطلاق حملة تسويقية متكاملة',
          en: 'Integrated Marketing Campaign',
          fr: 'Lancement de Campagne Marketing',
        },
        description: {
          ar: 'إعداد المحتوى، الاستهداف، الميزانية، وتتبع النتائج.',
          en: 'Prepare creative copy, audiences, budget allocation, and tracking links.',
          fr: 'Préparer le contenu, ciblage, budget et suivi des conversions.',
        },
        steps: [
          { ar: 'تحديد الشريحة المستهدفة والرسالة التسويقية', en: 'Define target persona & core message', fr: 'Définir la cible et le message clé' },
          { ar: 'تجهيز المحتوى الإبداعي والتصاميم والفيديوهات', en: 'Produce creative copies, visuals & video', fr: 'Produire les visuels et textes' },
          { ar: 'ضبط إعدادات الحملة الإعلانية وروابط التتبع', en: 'Set up ad campaigns & UTM tracking URLs', fr: 'Configurer la régie et les liens UTM' },
          { ar: 'تحليل الأداء اليومي وتحسين معدل النقرات والتحويل', en: 'Analyze CTR, CPC, and optimize conversion', fr: 'Optimiser le CTR et taux de conversion' },
        ],
      },
    ],
  },
  {
    id: 'finance_accounting',
    name: {
      ar: 'المحاسبة والمالية والمصارف (Finance & Accounting)',
      en: 'Finance, Accounting & Banking',
      fr: 'Finance, Comptabilité & Banque',
    },
    icon: 'Wallet',
    titlePrefix: {
      ar: 'المستشار المالي',
      en: 'Financial Advisor',
      fr: 'Expert Financier',
    },
    tips: [
      {
        title: {
          ar: 'المطابقة الدورية للحسابات والتدفقات النقدية',
          en: 'Daily Reconciliation & Cash Flow',
          fr: 'Rapprochement Quotidien & Trésorerie',
        },
        desc: {
          ar: 'طابق القيود المحاسبية يومياً لمنع تراكم الأخطاء وتأكيد سلامة التدفق النقدي.',
          en: 'Reconcile ledger entries and cash flows routinely to maintain audit readiness.',
          fr: 'Rapprochez les flux de trésorerie quotidiennement pour éviter les écarts.',
        },
        actionPrompt: {
          ar: 'مطابقة قيود اليوم وتدقيق الفواتير',
          en: 'Reconcile Today’s Invoices & Ledger',
          fr: 'Rapprocher les écritures du jour',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_fin_audit',
        title: {
          ar: 'إعداد التقرير المالي والإقفال الشهري',
          en: 'Monthly Financial Close & Report',
          fr: 'Clôture Financière Mensuelle',
        },
        description: {
          ar: 'مراجعة قيود اليومية، ميزان المراجعة، وقائمة الدخل.',
          en: 'Audit journal entries, trial balance, and profit & loss statements.',
          fr: 'Vérification du grand livre, balance et compte de résultat.',
        },
        steps: [
          { ar: 'مطابقة الحسابات البنكية ومستندات الصرف', en: 'Bank statement reconciliation & expense audit', fr: 'Rapprochement bancaire et factures' },
          { ar: 'تسجيل قيود التسويات والإهلاك والمستحقات', en: 'Post accruals, prepayments & depreciation', fr: 'Passer les écritures d’inventaire' },
          { ar: 'استخراج ميزان المراجعة ومراجعة الفروقات', en: 'Generate trial balance & check variances', fr: 'Éditer la balance générale et ajustements' },
          { ar: 'إعداد وعرض القوائم المالية والتقرير التحليلي', en: 'Finalize P&L, Balance Sheet & executive brief', fr: 'Finaliser le bilan et compte de résultat' },
        ],
      },
    ],
  },
  {
    id: 'law_legal',
    name: {
      ar: 'القانون والمحاماة والاستشارات (Law & Legal)',
      en: 'Law, Legal & Compliance',
      fr: 'Droit, Juridique & Avocature',
    },
    icon: 'Shield',
    titlePrefix: {
      ar: 'المستشار',
      en: 'Counsel',
      fr: 'Maître',
    },
    tips: [
      {
        title: {
          ar: 'تدقيق بنود العقود والمهل القانونية',
          en: 'Statutory Deadlines & Contract Review',
          fr: 'Délais Légaux & Examen de Contrats',
        },
        desc: {
          ar: 'تأكد من مواعيد الطعون والجلسات القضائية مع ضبط تنبيهات مسبقة قبل الموعد النهائي.',
          en: 'Never miss a filing deadline—always set 48h early reminder checkpoints.',
          fr: 'Ne manquez aucun délai de recours avec des rappels anticipés de 48h.',
        },
        actionPrompt: {
          ar: 'مراجعة المهل القانونية ومواعيد الجلسات',
          en: 'Audit Legal Deadlines & Hearings',
          fr: 'Vérifier les échéances et audiences',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_legal_brief',
        title: {
          ar: 'إعداد مذكرة قانونية أو صياغة عقد',
          en: 'Legal Brief & Contract Drafting',
          fr: 'Rédaction de Mémoire ou Contrat',
        },
        description: {
          ar: 'دراسة الوقائع، السوابق القضائية، وصياغة البنود المحكمة.',
          en: 'Examine case facts, statutory clauses, and draft enforceable terms.',
          fr: 'Étude des pièces, jurisprudence et rédaction des clauses.',
        },
        steps: [
          { ar: 'دراسة الوقائع والمستندات واستخراج النقاط القانونية', en: 'Analyze evidence & factual timeline', fr: 'Analyser les pièces et la chronologie' },
          { ar: 'البحث في السوابق القضائية والنصوص النظامية ذات الصلة', en: 'Research relevant case law & statutory articles', fr: 'Rechercher la jurisprudence et les textes' },
          { ar: 'صياغة بنود المذكرة / العقد بلغة دقيقة ومحكمة', en: 'Draft legal brief arguments & contractual clauses', fr: 'Rédiger l’argumentaire juridique' },
          { ar: 'المراجعة النهائية والتدقيق اللغوي والطباعة', en: 'Final proofreading, citations check & delivery', fr: 'Relecture finale et dépôt' },
        ],
      },
    ],
  },
  {
    id: 'freelance_other',
    name: {
      ar: 'العمل الحر والتجارة المستقلة (Freelance & Enterprise)',
      en: 'Freelancing & Independent Business',
      fr: 'Freelance & Activité Indépendante',
    },
    icon: 'Sparkles',
    titlePrefix: {
      ar: 'الأستاذ',
      en: 'Pro',
      fr: 'Expert',
    },
    tips: [
      {
        title: {
          ar: 'فصل أوقات العمل عن الحياة الشخصية',
          en: 'Boundaries & Client Time Allocation',
          fr: 'Équilibre Pro/Perso & Temps Client',
        },
        desc: {
          ar: 'حدد ساعات عمل ثابتة لتجنب الاحتراق النفسي ومضاعفة الإنتاجية والجودة للعملاء.',
          en: 'Set firm daily working hours to avoid burnout and enhance client deliverables.',
          fr: 'Fixez des horaires clairs pour éviter le surmenage et maximiser la qualité.',
        },
        actionPrompt: {
          ar: 'جدولة مهام العملاء حسب الأولوية',
          en: 'Schedule Client Tasks by Priority',
          fr: 'Planifier les livrables prioritaires',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_freelance_gig',
        title: {
          ar: 'تسليم مشروع مستقل للعميل من الألف إلى الياء',
          en: 'Client Project Lifecycle & Delivery',
          fr: 'Cycle de Projet Client & Livraison',
        },
        description: {
          ar: 'الاتفاق على المتطلبات، التنفيذ، المراجعة، وإصدار الفاتورة.',
          en: 'Scope agreement, milestones execution, client feedback, and invoicing.',
          fr: 'Cadrage, exécution des jalons, retours et facturation.',
        },
        steps: [
          { ar: 'تأكيد الشروط ونطاق العمل مع العميل واستلام الدفعة الأولى', en: 'Confirm scope, contract terms & deposit', fr: 'Valider le devis, contrat et acompte' },
          { ar: 'إنجاز المسودة الأولى أو المرحلة الأولى من المشروع', en: 'Execute Milestone 1 / First prototype', fr: 'Réaliser le premier jet / jalon' },
          { ar: 'استقبال ملاحظات العميل وتطبيق التعديلات المطلوبة', en: 'Collect client feedback & apply revisions', fr: 'Intégrer les retours du client' },
          { ar: 'تسليم الملفات النهائية وإصدار فاتورة الحساب النهائي', en: 'Deliver final production assets & invoice', fr: 'Livrer les fichiers finaux et facturer' },
        ],
      },
    ],
  },
  {
    id: 'other',
    name: {
      ar: 'مجال أو مهنة أخرى (Other Profession)',
      en: 'Other Profession',
      fr: 'Autre Profession',
    },
    icon: 'Tag',
    titlePrefix: {
      ar: 'الأستاذ',
      en: 'Member',
      fr: 'Membre',
    },
    tips: [
      {
        title: {
          ar: 'تقنية بومودورو للتركيز العالي (25 دقيقة)',
          en: 'Pomodoro High-Focus Technique',
          fr: 'Technique Pomodoro Haute Concentration',
        },
        desc: {
          ar: 'اعمل لمدة 25 دقيقة متصلة ثم خذ استراحة 5 دقائق، وكرر ذلك 4 مرات لتحقيق إنجاز هائل.',
          en: 'Work for 25 minutes uninterrupted, then take a 5-minute break. Repeat 4 times.',
          fr: 'Travaillez 25 minutes sans interruption, puis 5 minutes de pause.',
        },
        actionPrompt: {
          ar: 'بدء جلسة تركيز الآن',
          en: 'Start a Focus Session Now',
          fr: 'Lancer une session de concentration',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_general_goal',
        title: {
          ar: 'إنجاز هدف أسبوعي احترافي',
          en: 'Weekly Professional Goal Sprint',
          fr: 'Sprint d’Objectif Hebdomadaire',
        },
        description: {
          ar: 'تقسيم الهدف الكبير إلى مهام يومية قابلة للتنفيذ السريع.',
          en: 'Deconstruct a milestone into actionable daily tasks.',
          fr: 'Décomposer un objectif clé en tâches quotidiennes.',
        },
        steps: [
          { ar: 'تحديد الهدف بوضوح ومعايير النجاح القابلة للقياس', en: 'Define measurable milestone & outcome', fr: 'Définir l’objectif mesurable et le résultat' },
          { ar: 'تجهيز الأدوات والمراجع والملفات المطلوبة', en: 'Gather required tools, references & assets', fr: 'Rassembler les outils et ressources' },
          { ar: 'التنفيذ اليومي المركز بدون تسويف', en: 'Execute core tasks with daily consistency', fr: 'Exécuter avec régularité quotidienne' },
          { ar: 'تقييم النتائج والاحتفال بالإنجاز والتحسين', en: 'Review results, celebrate win & reflect', fr: 'Évaluer le résultat et célébrer l’étape' },
        ],
      },
    ],
  },
];

export const STUDENT_TRACKS_LIST: StudentTrackOption[] = [
  {
    id: 'student_cs_ai',
    name: {
      ar: 'علوم الحاسب والذكاء الاصطناعي وهندسة البرمجيات (CS & AI)',
      en: 'Computer Science, AI & Software',
      fr: 'Informatique & Intelligence Artificielle',
    },
    icon: 'Laptop',
    titlePrefix: {
      ar: 'الباشمهندس المستقبلي',
      en: 'Future Engineer',
      fr: 'Futur Ingénieur',
    },
    tips: [
      {
        title: {
          ar: 'التعلم بالتطبيق وبناء المشاريع (Project-Based)',
          en: 'Build Projects While Learning Algorithms',
          fr: 'Apprendre par la Pratique & Projets',
        },
        desc: {
          ar: 'لا تكتفِ بقراءة الأكواد النظرية؛ ابنِ مشاريع حقيقية ودوّن ملاحظاتك البرمجية على GitHub.',
          en: 'Apply data structures and theories by building real apps and sharing code on GitHub.',
          fr: 'Appliquez les concepts théoriques en construisant de vrais projets sur GitHub.',
        },
        actionPrompt: {
          ar: 'بدء تطبيق تمرين عملي اليوم',
          en: 'Code a Practical Challenge Today',
          fr: 'Coder un exercice pratique aujourd’hui',
        },
      },
      {
        title: {
          ar: 'طريقة فاينمان لشرح الخوارزميات (Feynman Technique)',
          en: 'Feynman Technique for Complex Concepts',
          fr: 'Méthode Feynman pour les Algorithmes',
        },
        desc: {
          ar: 'اشرح المفهوم المعقد (كخوارزميات البحث أو هياكل البيانات) بأسلوب مبسط جداً كأنك تشرحه لطفل.',
          en: 'Explain complex concepts in simple terms as if teaching a beginner to cement deep understanding.',
          fr: 'Expliquez les concepts complexes avec des mots simples pour valider votre maîtrise.',
        },
        actionPrompt: {
          ar: 'تلخيص مفهوم صعب بأسلوبك',
          en: 'Summarize a Concept Simply',
          fr: 'Résumer un concept simplement',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_cs_project_prep',
        title: {
          ar: 'إعداد مشروع برمجي دراسي أو تخرج',
          en: 'Academic CS Project / Capstone',
          fr: 'Projet Informatique Universitaire',
        },
        description: {
          ar: 'من اختيار الفكرة وحتى توثيق الكود والعرض النهائي.',
          en: 'From system design and prototyping to code documentation and demo presentation.',
          fr: 'Du cahier des charges à la soutenance et démonstration.',
        },
        steps: [
          { ar: 'تحديد فكرة المشروع ومخطط الـ UML والتقنيات المستخدمة', en: 'Define project scope, architecture & tech stack', fr: 'Cahier des charges, architecture & technologies' },
          { ar: 'بناء قاعدة البيانات وهيكلة واجهات الـ API', en: 'Database modeling & REST/GraphQL API setup', fr: 'Modélisation BDD et création des APIs' },
          { ar: 'برمجة الواجهة التفاعلية وربطها مع الخادم', en: 'Build responsive UI & integrate backend', fr: 'Développement de l’interface et intégration' },
          { ar: 'كتابة التوثيق الفني وتجهيز العرض التقديمي (Slides)', en: 'Write technical documentation & prepare slides', fr: 'Rédiger le rapport technique et diaporama' },
        ],
      },
    ],
  },
  {
    id: 'student_medicine',
    name: {
      ar: 'الطب البشري وطب الأسنان والصيدلة (Medicine & Health Sciences)',
      en: 'Medicine, Dentistry & Pharmacy',
      fr: 'Médecine, Dentaire & Pharmacie',
    },
    icon: 'Stethoscope',
    titlePrefix: {
      ar: 'طبيب المستقبل',
      en: 'Future Doctor',
      fr: 'Futur Médecin',
    },
    tips: [
      {
        title: {
          ar: 'التكرار المتباعد والبطاقات التعليمية (Spaced Repetition)',
          en: 'Spaced Repetition & Active Recall',
          fr: 'Répétition Espacée & Flashcards',
        },
        desc: {
          ar: 'راجع المعلومات الطبية وحفظ الأدوية والتشريح على فترات متزايدة (يوم، 3 أيام، أسبوع، شهر).',
          en: 'Use active recall flashcards (Anki style) to retain massive clinical and pharmacological data.',
          fr: 'Révisez l’anatomie et la pharmacologie avec la répétition espacée.',
        },
        actionPrompt: {
          ar: 'مراجعة بطاقات الحفظ لليوم',
          en: 'Review Today’s Flashcards',
          fr: 'Réviser les flashcards du jour',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_med_exam_prep',
        title: {
          ar: 'خطة مراجعة مادة طبية سريرية (Clinical Block)',
          en: 'Clinical Medical Block Revision',
          fr: 'Révision de Module Médical',
        },
        description: {
          ar: 'التشريح، الفيزيولوجيا، الأمراض، والعلاج الدوائي.',
          en: 'Systematic study covering pathophysiology, clinical signs, and therapeutics.',
          fr: 'Physiopathologie, sémiologie et thérapeutique.',
        },
        steps: [
          { ar: 'قراءة وفهم فسيولوجيا وتشريح الجهاز المستهدف', en: 'Study anatomy & normal physiology baseline', fr: 'Revoir l’anatomie et la physiologie normale' },
          { ar: 'دراسة الأمراض والأعراض السريرية وطرق التشخيص', en: 'Learn clinical presentations & diagnostic tests', fr: 'Étudier les pathologies et le diagnostic' },
          { ar: 'حفظ الخطط العلاجية وتداخلات الأدوية المهمة', en: 'Memorize treatment protocols & drug interactions', fr: 'Mémoriser les protocoles thérapeutiques' },
          { ar: 'حل بنك أسئلة الحالات السريرية (Clinical Cases MCQs)', en: 'Practice clinical case question banks', fr: 'Résoudre les QCM et cas cliniques' },
        ],
      },
    ],
  },
  {
    id: 'student_engineering',
    name: {
      ar: 'الهندسة بكافة تخصصاتها (Engineering Faculty)',
      en: 'Engineering (All Disciplines)',
      fr: 'Études d’Ingénierie',
    },
    icon: 'Compass',
    titlePrefix: {
      ar: 'الباشمهندس',
      en: 'Engineer',
      fr: 'Futur Ingénieur',
    },
    tips: [
      {
        title: {
          ar: 'حل المسائل بالورقة والقلم (Problem Sets)',
          en: 'Solve Problem Sets from Scratch',
          fr: 'Résoudre les Problèmes Pas à Pas',
        },
        desc: {
          ar: 'لا تكتفِ بالنظر إلى الحلول الجاهزة؛ حل كل مسألة رياضية أو فيزيائية بيدك خطوة بخطوة.',
          en: 'Never passively look at solutions; work through physics and calculus equations step by step.',
          fr: 'Résolvez les exercices de calcul et physique intégralement à la main.',
        },
        actionPrompt: {
          ar: 'حل 3 مسائل نموذجية اليوم',
          en: 'Solve 3 Problem Sets Today',
          fr: 'Résoudre 3 exercices types aujourd’hui',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_eng_midterm',
        title: {
          ar: 'استعداد لامتحان الهندسة والرياضيات التطبيقية',
          en: 'Engineering & Applied Math Exam Prep',
          fr: 'Préparation d’Examen d’Ingénierie',
        },
        description: {
          ar: 'تلخيص القوانين، حل نماذج سابقة، وفهم التطبيقات.',
          en: 'Formula sheet drafting, past exams drilling, and conceptual review.',
          fr: 'Fiche de formules, annales d’examens et révisions ciblées.',
        },
        steps: [
          { ar: 'إنشاء ورقة القوانين والمعادلات الشاملة (Formula Sheet)', en: 'Create comprehensive formula cheat sheet', fr: 'Rédiger la fiche de synthèse des formules' },
          { ar: 'حل تمارين الفصول النظرية وتطبيق القوانين', en: 'Work through chapter problem assignments', fr: 'Faire les exercices d’application du cours' },
          { ar: 'حل نموذجين من امتحانات السنوات السابقة بتوقيت محدد', en: 'Solve 2 timed past exam papers', fr: 'S’entraîner sur 2 annales en temps limité' },
          { ar: 'مراجعة الأخطاء وتثبيت النقاط الصعبة مع الزملاء', en: 'Review missed questions & clarify doubts', fr: 'Analyser les erreurs et points délicats' },
        ],
      },
    ],
  },
  {
    id: 'student_highschool',
    name: {
      ar: 'المرحلة الثانوية العامة / التوجيهي / البكالوريا (High School / Baccalaureate)',
      en: 'High School & Baccalaureate',
      fr: 'Lycée & Baccalauréat',
    },
    icon: 'BookOpen',
    titlePrefix: {
      ar: 'المتفوق',
      en: 'Scholar',
      fr: 'Bachelier',
    },
    tips: [
      {
        title: {
          ar: 'جدول المذاكرة المتوازن وإدارة التوتر',
          en: 'Balanced Revision & Stress Management',
          fr: 'Planning Équilibré & Gestion du Stress',
        },
        desc: {
          ar: 'قسّم المواد الثقيلة صباحاً مع فترات نوم كافية (7-8 ساعات) لتثبيت المعلومات في الذاكرة طويلة المدى.',
          en: 'Tackle heavy subjects in the morning and protect 7-8 hours of sleep for memory consolidation.',
          fr: 'Travaillez les matières denses le matin et préservez 7-8h de sommeil réparateur.',
        },
        actionPrompt: {
          ar: 'مراجعة المادة الأساسية لليوم',
          en: 'Review Today’s Core Subject',
          fr: 'Réviser la matière principale',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_highschool_sprint',
        title: {
          ar: 'مراجعة شاملة لدرس أو وحدة ثانوية عامة',
          en: 'High School Unit Mastery Sprint',
          fr: 'Maîtrise d’un Chapitre du Bac',
        },
        description: {
          ar: 'فهم، تلخيص، حفظ، وحل أسئلة الامتحانات الوزارية.',
          en: 'Comprehension, summary mapping, memorization, and national exam questions.',
          fr: 'Compréhension, fiche de synthèse, mémorisation et exercices types bac.',
        },
        steps: [
          { ar: 'قراءة الدرس وفهم المفاهيم الرئيسية والتعريفات', en: 'Read chapter & highlight core definitions', fr: 'Lire le cours et surligner les définitions clés' },
          { ar: 'كتابة ملخص بخط اليد أو خريطة ذهنية للوحدة', en: 'Draw a handwritten mind map / summary', fr: 'Créer une carte mentale manuscrite du chapitre' },
          { ar: 'حل جميع أسئلة الكتاب والتمارين النموذجية', en: 'Solve textbook questions & drills', fr: 'Faire tous les exercices du manuel scolaire' },
          { ar: 'حل أسئلة الامتحانات الوزارية للسنوات السابقة', en: 'Solve past national exam questions', fr: 'S’exercer sur les sujets d’annales du bac' },
        ],
      },
    ],
  },
  {
    id: 'student_business_econ',
    name: {
      ar: 'إدارة الأعمال والمحاسبة والاقتصاد (Business & Economics)',
      en: 'Business, Economics & Finance',
      fr: 'Sciences Économiques & Gestion',
    },
    icon: 'TrendingUp',
    titlePrefix: {
      ar: 'المستشار المستقبلي',
      en: 'Business Scholar',
      fr: 'Étudiant en Gestion',
    },
    tips: [
      {
        title: {
          ar: 'ربط النظريات بحالات الشركات الواقعية (Case Studies)',
          en: 'Apply Theories to Real Case Studies',
          fr: 'Lier la Théorie aux Études de Cas',
        },
        desc: {
          ar: 'حلل نماذج أعمال الشركات العالمية لفهم تطبيقات التسويق والتمويل والإدارة على أرض الواقع.',
          en: 'Analyze real business cases to bridge theoretical models with real market execution.',
          fr: 'Analysez des études de cas réelles pour ancrer la stratégie et la finance.',
        },
        actionPrompt: {
          ar: 'تحليل دراسة حالة الأسبوع',
          en: 'Analyze This Week’s Case Study',
          fr: 'Analyser l’étude de cas de la semaine',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_business_case',
        title: {
          ar: 'تحليل دراسة حالة وتقديم عرض تحليلي',
          en: 'Business Case Study & Deck',
          fr: 'Étude de Cas d’Entreprise & Présentation',
        },
        description: {
          ar: 'تحليل SWOT، المؤشرات المالية، والتوصيات الاستراتيجية.',
          en: 'SWOT analysis, financial ratios, and strategic action recommendations.',
          fr: 'Analyse SWOT, ratios financiers et recommandations stratégiques.',
        },
        steps: [
          { ar: 'قراءة معطيات الحالة وتحديد المشكلة الرئيسية', en: 'Read case scenario & pinpoint core dilemma', fr: 'Lire le cas et identifier la problématique centrale' },
          { ar: 'إجراء تحليل البيئة الداخلية والخارجية (SWOT / PESTLE)', en: 'Perform SWOT and industry competitive audit', fr: 'Réaliser le diagnostic SWOT et concurrentiel' },
          { ar: 'صياغة 3 بدائل استراتيجية ومقارنتها مالياً', en: 'Formulate 3 strategic options with financial viability', fr: 'Élaborer 3 options stratégiques et chiffrées' },
          { ar: 'إعداد التوصية النهائية والعرض التقديمي (PowerPoint)', en: 'Finalize executive recommendation & slide deck', fr: 'Rédiger les recommandations et préparer les slides' },
        ],
      },
    ],
  },
  {
    id: 'student_law_humanities',
    name: {
      ar: 'الحقوق والعلوم الإنسانية واللغات (Law, Arts & Humanities)',
      en: 'Law, Languages, Arts & Humanities',
      fr: 'Droit, Lettres & Sciences Humaines',
    },
    icon: 'BookOpen',
    titlePrefix: {
      ar: 'الباحث',
      en: 'Researcher',
      fr: 'Chercheur',
    },
    tips: [
      {
        title: {
          ar: 'القراءة النقدية وكتابة الهوامش والتلخيص',
          en: 'Critical Reading & Margin Annotations',
          fr: 'Lecture Critique & Fiches de Lecture',
        },
        desc: {
          ar: 'دوّن الملاحظات والأفكار النقدية على هوامش الكتب والمراجع لاستخدامها في الأوراق البحثية.',
          en: 'Annotate key sources actively to extract quotes and construct compelling arguments.',
          fr: 'Annotez les textes et extrayez des citations pour étayer vos dissertations.',
        },
        actionPrompt: {
          ar: 'قراءة وتلخيص مقال بحثي اليوم',
          en: 'Read & Annotate Research Paper',
          fr: 'Lire et synthétiser un article de recherche',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_essay_research',
        title: {
          ar: 'إعداد بحث أكاديمي أو مقال تحليلي',
          en: 'Academic Research Essay Blueprint',
          fr: 'Rédaction d’un Mémoire ou Essai',
        },
        description: {
          ar: 'خطة متكاملة لجمع المصادر، الصياغة، والتوثيق الأكاديمي.',
          en: 'Gather references, formulate thesis, write drafts, and format citations.',
          fr: 'Collecter les sources, formuler la thèse et rédiger.',
        },
        steps: [
          { ar: 'اختيار الموضوع وصياغة إشكالية البحث الرئيسية', en: 'Select topic & formulate central thesis question', fr: 'Choisir le sujet et formuler la problématique' },
          { ar: 'جمع المراجع الأكاديمية وفهرستها بدقة', en: 'Compile & index primary/secondary academic sources', fr: 'Rassembler et classer la bibliographie' },
          { ar: 'كتابة الهيكل العام ومسودة الفصول الأساسية', en: 'Outline arguments & write first chapter drafts', fr: 'Construire le plan détaillé et rédiger le premier jet' },
          { ar: 'المراجعة اللغوية والتوثيق النهائي للمراجع (APA / MLA)', en: 'Proofread citations, footnotes & bibliography', fr: 'Vérifier les citations, notes de bas de page et style' },
        ],
      },
    ],
  },
  {
    id: 'other_student',
    name: {
      ar: 'مساق أو تخصص دراسي آخر (Other Field of Study)',
      en: 'Other Field of Study',
      fr: 'Autre Filière d’Étude',
    },
    icon: 'Tag',
    titlePrefix: {
      ar: 'الطالب النجيب',
      en: 'Student',
      fr: 'Étudiant',
    },
    tips: [
      {
        title: {
          ar: 'الاسترجاع النشط (Active Recall) قبل الامتحانات',
          en: 'Active Recall Self-Testing',
          fr: 'Auto-Évaluation par Rappel Actif',
        },
        desc: {
          ar: 'اختبر نفسك بإغلاق الكتاب وكتابة ما تتذكره على ورقة بيضاء؛ هذه الطريقة تضاعف معدل التذكر.',
          en: 'Close your book and test yourself from memory on blank paper to maximize retention.',
          fr: 'Fermez le cours et réécrivez ce dont vous vous souvenez pour ancrer la mémoire.',
        },
        actionPrompt: {
          ar: 'جلسة استرجاع نشط لدرس الأمس',
          en: 'Run Active Recall for Yesterday’s Lesson',
          fr: 'Faire une session de rappel actif',
        },
      },
    ],
    templates: [
      {
        id: 'tpl_general_exam',
        title: {
          ar: 'خطة المراجعة الشاملة للامتحان النهائي',
          en: 'Comprehensive Final Exam Sprint',
          fr: 'Sprint Révision d’Examen Final',
        },
        description: {
          ar: 'خطة منظمة لتغطية المنهج وحل التدريبات والوصول للدرجة الكاملة.',
          en: 'Structured study schedule to review syllabus and ace the final exam.',
          fr: 'Planning pour réviser tout le programme et réussir avec brio.',
        },
        steps: [
          { ar: 'جدولة فصول المنهج على مدار أيام الأسبوع', en: 'Schedule syllabus chapters across study days', fr: 'Répartir les chapitres sur la semaine' },
          { ar: 'مراجعة الملاحظات والملخصات وحل الأسئلة المهمة', en: 'Review summary notes & solve key questions', fr: 'Réviser les fiches et faire les exercices clés' },
          { ar: 'إجراء اختبار تجريبي يحاكي وقت الامتحان الحقيقي', en: 'Take a full-length timed mock exam', fr: 'Passer un examen blanc en temps réel' },
          { ar: 'مراجعة النقاط الضعيفة والنوم المبكر ليلة الامتحان', en: 'Fix weak areas & get early restorative sleep', fr: 'Combler les lacunes et dormir tôt la veille' },
        ],
      },
    ],
  },
];

export const PROFESSION_OPTIONS = PROFESSIONS_LIST.map((p) => ({
  id: p.id,
  label: p.name,
}));

export const STUDENT_TRACK_OPTIONS = STUDENT_TRACKS_LIST.map((s) => ({
  id: s.id,
  label: s.name,
}));

/**
 * Get customized user greeting title with their name and profession/student prefix
 */
export function getUserPersonalizedGreeting(
  arg1?: string | AppSettings,
  arg2?: 'professional' | 'student' | 'other' | LanguageCode,
  arg3?: string,
  arg4?: string,
  arg5?: string,
  arg6: LanguageCode = 'ar'
): string {
  let userName = '';
  let roleType: 'professional' | 'student' | 'other' = 'professional';
  let professionId = 'tech_software';
  let trackId = 'student_cs_ai';
  let customField = '';
  let lang: LanguageCode = 'ar';

  if (typeof arg1 === 'object' && arg1 !== null) {
    const s = arg1 as AppSettings;
    userName = s.userName || '';
    roleType = s.userRoleType || 'professional';
    professionId = s.userProfessionId || s.userProfession || 'tech_software';
    trackId = s.userStudentTrackId || s.userStudyTrack || 'student_cs_ai';
    customField = s.userCustomField || '';
    lang = (arg2 as LanguageCode) || s.language || 'ar';
  } else {
    userName = (arg1 as string) || '';
    roleType = (arg2 as 'professional' | 'student' | 'other') || 'professional';
    professionId = arg3 || 'tech_software';
    trackId = arg4 || 'student_cs_ai';
    customField = arg5 || '';
    lang = arg6 || 'ar';
  }

  const cleanName = userName.trim() || (lang === 'ar' ? 'صديقنا' : lang === 'fr' ? 'Cher utilisateur' : 'Friend');

  if (roleType === 'student') {
    const track = STUDENT_TRACKS_LIST.find((s) => s.id === trackId);
    const prefix = track?.titlePrefix[lang] || (lang === 'ar' ? 'الطالب' : 'Student');
    return lang === 'ar' ? `مرحباً يا ${prefix} ${cleanName}` : `Hello, ${prefix} ${cleanName}`;
  }

  if (roleType === 'professional') {
    const prof = PROFESSIONS_LIST.find((p) => p.id === professionId);
    const prefix = prof?.titlePrefix[lang] || (lang === 'ar' ? 'الأستاذ' : 'Pro');
    return lang === 'ar' ? `مرحباً يا ${prefix} ${cleanName}` : `Hello, ${prefix} ${cleanName}`;
  }

  return lang === 'ar' ? `مرحباً يا ${cleanName}` : `Hello, ${cleanName}`;
}

/**
 * Get personalized advice and recommendations for the user's role
 */
export function getUserPersonalizedAdvice(settings: AppSettings, language: LanguageCode = 'ar'): string[] {
  const roleType = settings.userRoleType || 'professional';
  const professionId = settings.userProfessionId || settings.userProfession || 'tech_software';
  const trackId = settings.userStudentTrackId || settings.userStudyTrack || 'student_cs_ai';

  if (roleType === 'student') {
    const track = STUDENT_TRACKS_LIST.find((s) => s.id === trackId) || STUDENT_TRACKS_LIST[0];
    return track.tips.map((tip) => `${tip.title[language] || tip.title.ar}: ${tip.desc[language] || tip.desc.ar}`);
  }

  if (roleType === 'professional') {
    const prof = PROFESSIONS_LIST.find((p) => p.id === professionId) || PROFESSIONS_LIST[0];
    return prof.tips.map((tip) => `${tip.title[language] || tip.title.ar}: ${tip.desc[language] || tip.desc.ar}`);
  }

  const otherProf = PROFESSIONS_LIST.find((p) => p.id === 'other') || PROFESSIONS_LIST[0];
  return otherProf.tips.map((tip) => `${tip.title[language] || tip.title.ar}: ${tip.desc[language] || tip.desc.ar}`);
}

/**
 * Get specialized template plans for the user's role
 */
export function getUserPersonalizedTemplates(
  settings: AppSettings,
  language: LanguageCode = 'ar'
): { title: string; steps: string[] }[] {
  const roleType = settings.userRoleType || 'professional';
  const professionId = settings.userProfessionId || settings.userProfession || 'tech_software';
  const trackId = settings.userStudentTrackId || settings.userStudyTrack || 'student_cs_ai';

  if (roleType === 'student') {
    const track = STUDENT_TRACKS_LIST.find((s) => s.id === trackId) || STUDENT_TRACKS_LIST[0];
    return track.templates.map((tpl) => ({
      title: tpl.title[language] || tpl.title.ar,
      steps: tpl.steps.map((st) => st[language] || st.ar),
    }));
  }

  if (roleType === 'professional') {
    const prof = PROFESSIONS_LIST.find((p) => p.id === professionId) || PROFESSIONS_LIST[0];
    return prof.templates.map((tpl) => ({
      title: tpl.title[language] || tpl.title.ar,
      steps: tpl.steps.map((st) => st[language] || st.ar),
    }));
  }

  const otherProf = PROFESSIONS_LIST.find((p) => p.id === 'other') || PROFESSIONS_LIST[0];
  return otherProf.templates.map((tpl) => ({
    title: tpl.title[language] || tpl.title.ar,
    steps: tpl.steps.map((st) => st[language] || st.ar),
  }));
}
