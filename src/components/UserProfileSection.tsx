import React, { useState } from 'react';
import {
  Briefcase,
  Check,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Plus,
  Sparkles,
  User,
  UserCheck,
} from 'lucide-react';
import { AppSettings, LanguageCode, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import {
  PROFESSION_OPTIONS,
  STUDENT_TRACK_OPTIONS,
  getUserPersonalizedAdvice,
  getUserPersonalizedGreeting,
  getUserPersonalizedTemplates,
} from '../data/userProfileData';
import { triggerVibration } from '../services/soundEngine';

interface UserProfileSectionProps {
  settings: AppSettings;
  language: LanguageCode;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onApplyTemplateToTasks?: (tasks: Partial<TaskItem>[]) => void;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  settings,
  language,
  onUpdateSettings,
  onApplyTemplateToTasks,
}) => {
  const t = translations[language];
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const userName = settings.userName || '';
  const roleType = settings.userRoleType || 'professional';
  const professionId = settings.userProfessionId || 'software_dev';
  const trackId = settings.userStudentTrackId || 'cs_ai';
  const customField = settings.userCustomField || '';

  const personalizedGreeting = getUserPersonalizedGreeting(settings, language);
  const personalizedAdvice = getUserPersonalizedAdvice(settings, language);
  const personalizedTemplates = getUserPersonalizedTemplates(settings, language);

  const handleNameChange = (newName: string) => {
    onUpdateSettings({
      ...settings,
      userName: newName,
    });
  };

  const handleRoleTypeChange = (type: 'professional' | 'student' | 'other') => {
    triggerVibration(20);
    onUpdateSettings({
      ...settings,
      userRoleType: type,
    });
  };

  const handleProfessionChange = (pId: string) => {
    triggerVibration(15);
    onUpdateSettings({
      ...settings,
      userProfessionId: pId,
    });
  };

  const handleTrackChange = (trId: string) => {
    triggerVibration(15);
    onUpdateSettings({
      ...settings,
      userStudentTrackId: trId,
    });
  };

  const handleCustomFieldChange = (val: string) => {
    onUpdateSettings({
      ...settings,
      userCustomField: val,
    });
  };

  const handleApplyTemplate = (tpl: { title: string; steps: string[] }) => {
    if (!onApplyTemplateToTasks) return;
    triggerVibration(35);
    const todayStr = new Date().toISOString().split('T')[0];

    const newTasks: Partial<TaskItem>[] = tpl.steps.map((step, idx) => ({
      title: `${tpl.title}: ${step}`,
      priority: idx === 0 ? ('urgent' as const) : ('important' as const),
      status: 'not_started' as const,
      dueDate: `${todayStr}T${String(9 + idx * 2).padStart(2, '0')}:00`,
    }));

    onApplyTemplateToTasks(newTasks);
    setSuccessToast(t.templateAppliedSuccess);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6" id="user-profile-personalization-section">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Greeting Preview Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 border border-blue-900/50 p-5 text-white shadow-xl glow-blue">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
            {roleType === 'student' ? (
              <GraduationCap size={24} className="text-sky-300" />
            ) : (
              <Briefcase size={24} className="text-sky-300" />
            )}
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-300 flex items-center gap-1">
              <Sparkles size={12} />
              {language === 'ar' ? 'المساعد الشخصي المخصص' : 'Personalized Profile'}
            </span>
            <h3 className="text-lg sm:text-xl font-black">{personalizedGreeting}</h3>
          </div>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User size={16} className="text-blue-600 dark:text-sky-400" />
            <span>{t.userProfileTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.userProfileSubtitle}
          </p>
        </div>

        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>{t.userName}</span>
            <span className="text-[10px] text-blue-600 dark:text-sky-400 font-normal">
              ({language === 'ar' ? 'ليخاطبك التطبيق باسمك' : 'For personalized greetings'})
            </span>
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={t.userNamePlaceholder}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
            id="profile-user-name-input"
          />
        </div>

        {/* Role Type Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {t.userRole}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleTypeChange('professional')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                roleType === 'professional'
                  ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-sky-300 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
              id="role-btn-professional"
            >
              <Briefcase size={18} />
              <span>{t.roleProfessional}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTypeChange('student')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                roleType === 'student'
                  ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-sky-300 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
              id="role-btn-student"
            >
              <GraduationCap size={18} />
              <span>{t.roleStudent}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTypeChange('other')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                roleType === 'other'
                  ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-sky-300 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
              id="role-btn-other"
            >
              <Sparkles size={18} />
              <span>{t.roleOther}</span>
            </button>
          </div>
        </div>

        {/* Dropdown for Professional */}
        {roleType === 'professional' && (
          <div className="space-y-1.5 animate-fade-in">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.professionSelect}
            </label>
            <select
              value={professionId}
              onChange={(e) => handleProfessionChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              id="profession-select-dropdown"
            >
              {PROFESSION_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label[language] || opt.label.ar}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dropdown for Student */}
        {roleType === 'student' && (
          <div className="space-y-1.5 animate-fade-in">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.trackSelect}
            </label>
            <select
              value={trackId}
              onChange={(e) => handleTrackChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              id="student-track-select-dropdown"
            >
              {STUDENT_TRACK_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label[language] || opt.label.ar}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Custom field if Other or custom */}
        {(roleType === 'other' || professionId === 'other' || trackId === 'other') && (
          <div className="space-y-1.5 animate-fade-in">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.customFieldPrompt}
            </label>
            <input
              type="text"
              value={customField}
              onChange={(e) => handleCustomFieldChange(e.target.value)}
              placeholder={t.customFieldPlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              id="custom-field-input"
            />
          </div>
        )}
      </div>

      {/* Personalized Domain Tips & Guidance */}
      <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400 font-bold text-sm">
          <Lightbulb size={18} />
          <span>{t.domainTipsTitle}</span>
        </div>

        <div className="space-y-2">
          {personalizedAdvice.map((advice, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p>{advice}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Specialized Task Templates for Domain */}
      {personalizedTemplates.length > 0 && onApplyTemplateToTasks && (
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <Sparkles size={18} />
            <span>{t.specializedTemplates}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {personalizedTemplates.map((tpl, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {tpl.title}
                  </h4>
                  <ul className="mt-2 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {tpl.steps.slice(0, 3).map((s, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                        <span className="truncate">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>{t.applyTemplate}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
