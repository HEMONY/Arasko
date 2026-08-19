import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Compass,
  Copy,
  Database,
  Download,
  Droplet,
  FileJson,
  FileText,
  Footprints,
  Frown,
  Globe,
  HardDrive,
  Heart,
  Laptop,
  Moon,
  Music,
  Play,
  Plus,
  RotateCcw,
  Shield,
  Sparkles,
  Square,
  Sun,
  Tag,
  Trash2,
  Upload,
  Vibrate,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  AppSettings,
  CustomToneItem,
  LanguageCode,
  SadSoundChoice,
  SoundChoice,
  TaskCategory,
  TaskItem,
  ThemeMode,
} from '../types';
import { translations } from '../i18n/translations';
import { Logo } from './Logo';
import { AVAILABLE_CATEGORY_ICONS, CategoryIcon } from './CategoryIcon';
import { UserProfileSection } from './UserProfileSection';
import {
  getCurrentPlayingSoundId,
  playAlertSound,
  playCustomAudioUrl,
  playSadOverdueSound,
  stopAllAudio,
  subscribeAudioState,
  triggerVibration,
} from '../services/soundEngine';
import { AudioStorageService } from '../services/audioStorage';
import { StorageService } from '../services/storage';

interface SettingsViewProps {
  settings: AppSettings;
  categories: TaskCategory[];
  language: LanguageCode;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onUpdateCategories: (newCats: TaskCategory[]) => void;
  onExportBackup: () => void;
  onImportBackup: (fileOrString: File | string) => void;
  onResetAllData: () => void;
  onReopenOnboarding: () => void;
  onOpenArchive: () => void;
  onApplyTemplateToTasks?: (tasks: Partial<TaskItem>[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  categories,
  language,
  onUpdateSettings,
  onUpdateCategories,
  onExportBackup,
  onImportBackup,
  onResetAllData,
  onReopenOnboarding,
  onOpenArchive,
  onApplyTemplateToTasks,
}) => {
  const t = translations[language];

  // Active audio playback state
  const [playingSoundId, setPlayingSoundId] = useState<string | null>(getCurrentPlayingSoundId());

  // Data management export/import states
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedJson, setPastedJson] = useState('');
  const [backupFeedback, setBackupFeedback] = useState<{ text: string; isError?: boolean } | null>(null);

  // Custom audio files loaded from IndexedDB
  const [customTones, setCustomTones] = useState<CustomToneItem[]>([]);
  const [uploadToneName, setUploadToneName] = useState('');
  const [selectedAudioFile, setSelectedAudioFile] = useState<{
    name: string;
    dataUrl: string;
    durationSeconds?: number;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [audioFeedbackMsg, setAudioFeedbackMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category modal state
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#4F46E5');
  const [newCatIcon, setNewCatIcon] = useState('Target');

  // Subscribe to sound engine state
  useEffect(() => {
    const unsubscribe = subscribeAudioState((isPlaying, soundId) => {
      setPlayingSoundId(isPlaying ? soundId || null : null);
    });
    return () => unsubscribe();
  }, []);

  // Load custom tones from IndexedDB
  useEffect(() => {
    const loadTones = async () => {
      const tones = await AudioStorageService.getAllTones();
      setCustomTones(tones);
    };
    loadTones();
  }, []);

  // Handle language switch
  const handleLanguageChange = (lang: LanguageCode) => {
    onUpdateSettings({ ...settings, language: lang });
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  // Handle theme switch
  const handleThemeChange = (theme: ThemeMode) => {
    onUpdateSettings({ ...settings, theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  };

  // Primary Sound test
  const handleSoundSelect = async (sound: SoundChoice) => {
    onUpdateSettings({ ...settings, soundChoice: sound });
    if (sound.startsWith('custom_')) {
      const toneId = sound.replace('custom_', '');
      const tone = customTones.find((t) => t.id === toneId) || (await AudioStorageService.getTone(toneId));
      if (tone) {
        playCustomAudioUrl(tone.dataUrl, sound);
      }
    } else {
      playAlertSound(sound);
    }
    triggerVibration(settings.vibrationEnabled, [80, 40, 80]);
  };

  // Sad sound test
  const handleSadSoundSelect = async (sound: SadSoundChoice) => {
    onUpdateSettings({ ...settings, overdueSadSoundChoice: sound });
    if (sound.startsWith('custom_')) {
      const toneId = sound.replace('custom_', '');
      const tone = customTones.find((t) => t.id === toneId) || (await AudioStorageService.getTone(toneId));
      if (tone) {
        playCustomAudioUrl(tone.dataUrl, sound);
      }
    } else {
      playSadOverdueSound(sound);
    }
    triggerVibration(settings.vibrationEnabled, [100, 50, 100]);
  };

  // File Picker change for custom ringtone
  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 8MB)
    if (file.size > 8 * 1024 * 1024) {
      alert(language === 'ar' ? 'حجم الملف الصوتي كبير جداً (الحد الأقصى 8 ميجابايت)' : 'Audio file is too large (max 8MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setUploadToneName(cleanName);

      // Measure duration with temporary Audio object
      const tempAudio = new Audio(dataUrl);
      tempAudio.onloadedmetadata = () => {
        const dur = Math.round(tempAudio.duration);
        setSelectedAudioFile({
          name: file.name,
          dataUrl,
          durationSeconds: dur || undefined,
        });
      };
      tempAudio.onerror = () => {
        setSelectedAudioFile({
          name: file.name,
          dataUrl,
        });
      };
    };
    reader.readAsDataURL(file);
  };

  // Save custom audio tone
  const handleSaveCustomTone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAudioFile || !uploadToneName.trim()) return;

    setIsUploading(true);
    const newTone: CustomToneItem = {
      id: `tone_${Date.now()}`,
      name: uploadToneName.trim(),
      dataUrl: selectedAudioFile.dataUrl,
      durationSeconds: selectedAudioFile.durationSeconds,
      createdAt: new Date().toISOString(),
    };

    await AudioStorageService.saveTone(newTone);
    const updated = await AudioStorageService.getAllTones();
    setCustomTones(updated);

    // Also sync metadata to settings
    const metaList = updated.map(({ id, name, durationSeconds, createdAt }) => ({
      id,
      name,
      durationSeconds,
      createdAt,
      dataUrl: '', // omit large binary in local storage
    }));
    onUpdateSettings({ ...settings, customTones: metaList });

    setSelectedAudioFile(null);
    setUploadToneName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsUploading(false);

    setAudioFeedbackMsg(t.toneAddedSuccess);
    setTimeout(() => setAudioFeedbackMsg(null), 3000);
  };

  // Delete custom tone
  const handleDeleteCustomTone = async (id: string) => {
    if (playingSoundId === `custom_${id}`) {
      stopAllAudio();
    }
    await AudioStorageService.deleteTone(id);
    const updated = await AudioStorageService.getAllTones();
    setCustomTones(updated);

    const metaList = updated.map(({ id: tid, name, durationSeconds, createdAt }) => ({
      id: tid,
      name,
      durationSeconds,
      createdAt,
      dataUrl: '',
    }));

    const newSettings = { ...settings, customTones: metaList };
    if (settings.soundChoice === `custom_${id}`) {
      newSettings.soundChoice = 'chime';
    }
    if (settings.overdueSadSoundChoice === `custom_${id}`) {
      newSettings.overdueSadSoundChoice = 'sad_violin';
    }
    onUpdateSettings(newSettings);

    setAudioFeedbackMsg(t.toneDeletedSuccess);
    setTimeout(() => setAudioFeedbackMsg(null), 3000);
  };

  // Add Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: TaskCategory = {
      id: `cat_${Date.now()}`,
      name: {
        ar: newCatName.trim(),
        en: newCatName.trim(),
        fr: newCatName.trim(),
      },
      color: newCatColor,
      icon: newCatIcon,
    };

    onUpdateCategories([...categories, newCat]);
    setNewCatName('');
    setShowAddCatModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) return;
    onUpdateCategories(categories.filter((c) => c.id !== id));
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
    }
  };

  // Copy full backup JSON payload to clipboard
  const handleCopyBackupJson = () => {
    try {
      const jsonStr = StorageService.exportFullBackup();
      navigator.clipboard.writeText(jsonStr);
      setCopiedBackup(true);
      triggerVibration(settings.vibrationEnabled, [40]);
      setBackupFeedback({ text: t.copiedToClipboard, isError: false });
      setTimeout(() => {
        setCopiedBackup(false);
        setBackupFeedback(null);
      }, 3500);
    } catch {
      setBackupFeedback({ text: t.importError, isError: true });
    }
  };

  // Direct paste JSON submit
  const handleDirectPasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedJson.trim()) return;

    try {
      const parsed = JSON.parse(pastedJson.trim());
      if (!parsed || typeof parsed !== 'object') {
        setBackupFeedback({ text: t.importError, isError: true });
        return;
      }
      onImportBackup(pastedJson.trim());
      setPastedJson('');
      setShowPasteModal(false);
      setBackupFeedback({ text: t.importSuccess, isError: false });
      setTimeout(() => setBackupFeedback(null), 3500);
    } catch {
      setBackupFeedback({ text: t.importError, isError: true });
    }
  };

  // Local Storage Usage diagnostics
  const storageInfo = useMemo(() => {
    let sizeBytes = 0;
    try {
      for (const k in localStorage) {
        if (k.startsWith('arasko_')) {
          sizeBytes += (localStorage.getItem(k)?.length || 0) * 2;
        }
      }
    } catch {
      sizeBytes = 1024 * 6;
    }
    const kb = Math.max(1, Math.round(sizeBytes / 1024));
    const tasksCount = StorageService.getTasks().length;
    return { kb, tasksCount };
  }, [categories]);

  return (
    <div className="space-y-6 pb-28 animate-fade-in" id="settings-view-container">
      {/* 0. Personal User Profile & Custom Domain Guidance */}
      <UserProfileSection
        settings={settings}
        language={language}
        onUpdateSettings={onUpdateSettings}
        onApplyTemplateToTasks={onApplyTemplateToTasks}
      />

      {/* 1. Language Selection */}
      <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Globe size={18} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.language}</h3>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { code: 'ar', label: 'العربية (افتراضي)', flag: '🇸🇦' },
            { code: 'en', label: 'English', flag: '🇬🇧' },
            { code: 'fr', label: 'Français', flag: '🇫🇷' },
          ].map((lang) => {
            const isSel = settings.language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code as LanguageCode)}
                className={`py-3.5 px-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  isSel
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
                id={`lang-btn-${lang.code}`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="truncate w-full text-center">{lang.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Theme & Appearance Mode */}
      <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Moon size={18} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.theme}</h3>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'dark', label: t.themeDark, icon: Moon },
            { id: 'light', label: t.themeLight, icon: Sun },
            { id: 'system', label: t.themeSystem, icon: Laptop },
          ].map((th) => {
            const Icon = th.icon;
            const isSel = settings.theme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => handleThemeChange(th.id as ThemeMode)}
                className={`py-3.5 px-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  isSel
                    ? 'bg-purple-50/90 dark:bg-purple-950/70 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm ring-2 ring-purple-500/20'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
                id={`theme-btn-${th.id}`}
              >
                <Icon size={18} />
                <span>{th.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Primary Notification Sounds & Vibration */}
      <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.notificationsTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.enableNotifications}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) =>
                onUpdateSettings({ ...settings, notificationsEnabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Primary Sound Selection with Tone Collections & Dropdown */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Volume2 size={15} className="text-indigo-600 dark:text-indigo-400" /> {t.soundAlerts}
            </label>
            {playingSoundId && (
              <button
                type="button"
                onClick={() => stopAllAudio()}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 flex items-center gap-1 transition-colors"
              >
                <Square size={11} className="fill-current text-rose-500" />
                {t.stopPreview}
              </button>
            )}
          </div>

          {/* Quick Sound Selection Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 shadow-floating-4k">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Volume2 size={15} className="text-indigo-500 shrink-0" />
              <span>{language === 'ar' ? 'اختر النغمة من القائمة المنسدلة:' : 'Select Tone From Dropdown:'}</span>
            </div>
            <select
              id="sound-selection-dropdown"
              value={settings.soundChoice}
              onChange={(e) => handleSoundSelect(e.target.value as SoundChoice)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
            >
              <optgroup label={language === 'ar' ? 'نغمات اراسكو الحزينة (المميزة)' : 'Arasko Masterpieces'}>
                <option value="arasko_sad_1">Arasko Sad 1 ({language === 'ar' ? 'الافتراضية - ناي وكمان' : 'Default - Ney & Violin'})</option>
                <option value="arasko_sad_2">Arasko Sad 2 ({language === 'ar' ? 'تشيلو وأوتار' : 'Cello & Strings'})</option>
                <option value="sad_oud_lament">{t.sadOudLament}</option>
                <option value="sad_qanun_sigh">{t.sadQanunSigh}</option>
              </optgroup>
              <optgroup label={language === 'ar' ? 'النغمات القياسية' : 'Standard Tones'}>
                <option value="chime">{t.soundChime}</option>
                <option value="bell">{t.soundBell}</option>
                <option value="ping">{t.soundPing}</option>
                <option value="zen">{t.soundZen}</option>
                <option value="harp">{t.soundHarp}</option>
                <option value="none">{t.soundNone}</option>
              </optgroup>
              <optgroup label={language === 'ar' ? 'نغمات حزينة ومؤثرة' : 'Emotional Melodies'}>
                <option value="sad_violin">{t.sadViolin}</option>
                <option value="sad_piano">{t.sadPiano}</option>
                <option value="sad_sigh">{t.sadSigh}</option>
                <option value="sad_rain">{t.sadRain}</option>
                <option value="sad_defeat">{t.sadDefeat}</option>
                <option value="sad_alarm">{t.sadAlarm}</option>
              </optgroup>
              {customTones.filter((ct) => !ct.id.startsWith('arasko_')).length > 0 && (
                <optgroup label={language === 'ar' ? 'نغماتك المرفوعة' : 'Your Custom Tones'}>
                  {customTones
                    .filter((ct) => !ct.id.startsWith('arasko_'))
                    .map((ct) => (
                      <option key={ct.id} value={`custom_${ct.id}`}>
                        {ct.name}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Classic Tones */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              {language === 'ar' ? 'نغمات التنبيه القياسية' : 'Standard Melodies'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'chime', label: t.soundChime },
                { id: 'bell', label: t.soundBell },
                { id: 'ping', label: t.soundPing },
                { id: 'zen', label: t.soundZen },
                { id: 'harp', label: t.soundHarp },
                { id: 'none', label: t.soundNone },
              ].map((snd) => {
                const isSel = settings.soundChoice === snd.id;
                const isPlaying = playingSoundId === snd.id;
                return (
                  <button
                    key={snd.id}
                    type="button"
                    onClick={() => handleSoundSelect(snd.id as SoundChoice)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between shadow-floating-4k ${
                      isSel
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/25'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                    }`}
                  >
                    <span className="truncate">{snd.label}</span>
                    {isPlaying ? (
                      <div className="flex items-center gap-0.5 ml-1.5">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full animate-wave-1"></span>
                        <span className="w-1 h-4 bg-indigo-500 rounded-full animate-wave-2"></span>
                        <span className="w-1 h-2 bg-indigo-500 rounded-full animate-wave-3"></span>
                      </div>
                    ) : (
                      snd.id !== 'none' && <Volume2 size={13} className="opacity-70 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Melancholic / Sad Tones in Main Sound Selector as well */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-1.5 flex items-center gap-1">
              <Frown size={12} /> {language === 'ar' ? 'النغمات الحزينة والكئيبة' : 'Sad & Melancholic Tones'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'arasko_sad_1', label: t.araskoSad1, isDefault: true },
                { id: 'arasko_sad_2', label: t.araskoSad2, isDefault: false },
                { id: 'sad_oud_lament', label: t.sadOudLament, isDefault: false },
                { id: 'sad_qanun_sigh', label: t.sadQanunSigh, isDefault: false },
                { id: 'sad_violin', label: t.sadViolin },
                { id: 'sad_piano', label: t.sadPiano },
                { id: 'sad_sigh', label: t.sadSigh },
                { id: 'sad_rain', label: t.sadRain },
                { id: 'sad_defeat', label: t.sadDefeat },
                { id: 'sad_alarm', label: t.sadAlarm },
              ].map((sadTone) => {
                const isSel = settings.soundChoice === sadTone.id;
                const isPlaying = playingSoundId === sadTone.id;
                return (
                  <button
                    key={sadTone.id}
                    type="button"
                    onClick={() => handleSoundSelect(sadTone.id as SoundChoice)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between shadow-floating-4k ${
                      isSel
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/25'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-300'
                    }`}
                  >
                    <span className="truncate">{sadTone.label}</span>
                    {isPlaying ? (
                      <div className="flex items-center gap-0.5 ml-1.5">
                        <span className="w-1 h-3 bg-rose-500 rounded-full animate-wave-1"></span>
                        <span className="w-1 h-4 bg-rose-500 rounded-full animate-wave-2"></span>
                        <span className="w-1 h-2 bg-rose-500 rounded-full animate-wave-3"></span>
                      </div>
                    ) : (
                      <Music size={13} className="text-rose-400 opacity-70 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vibration toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Vibrate size={16} className="text-indigo-500" /> {t.vibrationAlerts}
          </span>
          <input
            type="checkbox"
            checked={settings.vibrationEnabled}
            onChange={(e) =>
              onUpdateSettings({ ...settings, vibrationEnabled: e.target.checked })
            }
            className="rounded-md text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Overdue Task Sad Alert Melodies (Dedicated Overdue Suite) */}
      <div className="glass-panel card-floating-4k bg-gradient-to-br from-rose-50/80 via-purple-50/50 to-white/90 dark:from-rose-950/20 dark:via-purple-950/20 dark:to-slate-900/40 rounded-3xl p-5 border border-rose-200/90 dark:border-rose-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 dark:bg-rose-950/70 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-floating-4k">
              <Frown size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {t.overdueSadSoundTitle}
                <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                  {t.overdueBadge}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {t.overdueSadSoundDesc}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.overdueSadSoundEnabled}
              onChange={(e) =>
                onUpdateSettings({ ...settings, overdueSadSoundEnabled: e.target.checked })
              }
              className="sr-only peer"
              id="overdue-sad-sound-toggle"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        {/* Overdue Tone Dropdown Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/90 dark:border-rose-900/50 shadow-floating-4k">
          <div className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <Frown size={15} className="text-rose-500 shrink-0" />
            <span>{language === 'ar' ? 'قائمة اختيار نغمة التأخير:' : 'Overdue Sound Dropdown:'}</span>
          </div>
          <select
            id="overdue-sound-selection-dropdown"
            value={settings.overdueSadSoundChoice}
            onChange={(e) => handleSadSoundSelect(e.target.value as SadSoundChoice)}
            className="px-3 py-2 rounded-xl bg-rose-50/70 dark:bg-slate-800 border border-rose-300/80 dark:border-rose-700/60 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-hidden cursor-pointer"
          >
            <optgroup label={language === 'ar' ? 'نغمات اراسكو الحزينة (الموصى بها)' : 'Arasko Masterpieces'}>
              <option value="arasko_sad_1">Arasko Sad 1 ★ ({language === 'ar' ? 'الافتراضية - ناي وكمان' : 'Default - Ney & Violin'})</option>
              <option value="arasko_sad_2">Arasko Sad 2 ({language === 'ar' ? 'تشيلو وأوتار' : 'Cello & Strings'})</option>
              <option value="sad_oud_lament">{t.sadOudLament}</option>
              <option value="sad_qanun_sigh">{t.sadQanunSigh}</option>
            </optgroup>
            <optgroup label={language === 'ar' ? 'نغمات حزينة ومؤثرة' : 'Emotional Melancholy'}>
              <option value="sad_violin">{t.sadViolin}</option>
              <option value="sad_piano">{t.sadPiano}</option>
              <option value="sad_sigh">{t.sadSigh}</option>
              <option value="sad_rain">{t.sadRain}</option>
              <option value="sad_defeat">{t.sadDefeat}</option>
              <option value="sad_alarm">{t.sadAlarm}</option>
            </optgroup>
            {customTones.filter((ct) => !ct.id.startsWith('arasko_')).length > 0 && (
              <optgroup label={language === 'ar' ? 'نغمات مخصصة مرفوعة' : 'Custom Audio'}>
                {customTones
                  .filter((ct) => !ct.id.startsWith('arasko_'))
                  .map((ct) => (
                    <option key={ct.id} value={`custom_${ct.id}`}>
                      {ct.name}
                    </option>
                  ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* Sad Melodies Grid - always clearly visible and testable */}
        <div className="pt-2 border-t border-rose-100 dark:border-rose-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Music size={14} className="text-rose-500" />
              {t.selectSadTone}
            </label>

            {playingSoundId && (
              <button
                type="button"
                onClick={() => stopAllAudio()}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 flex items-center gap-1 transition-colors"
              >
                <Square size={11} className="fill-current text-rose-500" />
                {t.stopPreview}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'arasko_sad_1',
                label: t.araskoSad1,
                desc:
                  language === 'ar'
                    ? 'لحن الناي والكمان الشجي ومقام النهاوند المؤثر'
                    : 'Soulful solo ney & weeping violin phrygian phrasing',
                isDefault: true,
              },
              {
                id: 'arasko_sad_2',
                label: t.araskoSad2,
                desc:
                  language === 'ar'
                    ? 'مرثية الأوتار والتشيلو العميقة الحزينة'
                    : 'Deep somber cello elegy and descending bowed strings',
                isDefault: false,
              },
              {
                id: 'sad_oud_lament',
                label: t.sadOudLament,
                desc:
                  language === 'ar'
                    ? 'تقاسيم عود أندلسية مع وتر الأساس العميق'
                    : 'Acoustic oriental oud pluck with resonant drone base',
                isDefault: false,
              },
              {
                id: 'sad_qanun_sigh',
                label: t.sadQanunSigh,
                desc:
                  language === 'ar'
                    ? 'شجن القانون والكمان وأصداء المطر الحزينة'
                    : 'Melancholic qanun tremolos & soft weeping violin echoes',
                isDefault: false,
              },
              { id: 'sad_violin', label: t.sadViolin, desc: 'Violin phrase (D Minor)' },
              { id: 'sad_piano', label: t.sadPiano, desc: 'Gentle chords (A Minor)' },
              { id: 'sad_sigh', label: t.sadSigh, desc: 'Descending resonant sigh' },
              { id: 'sad_rain', label: t.sadRain, desc: 'Somber temple bells' },
              { id: 'sad_defeat', label: t.sadDefeat, desc: 'Descending chromatic defeat' },
              { id: 'sad_alarm', label: t.sadAlarm, desc: 'Urgent low minor pulse' },
            ].map((sadTone) => {
              const isSel = settings.overdueSadSoundChoice === sadTone.id;
              const isPlaying = playingSoundId === sadTone.id;
              return (
                <button
                  key={sadTone.id}
                  type="button"
                  onClick={() => handleSadSoundSelect(sadTone.id as SadSoundChoice)}
                  className={`p-3 rounded-2xl border text-xs text-start transition-all flex items-center justify-between shadow-floating-4k ${
                    isSel
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/25'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-300'
                  }`}
                  id={`sad-tone-${sadTone.id}`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-bold flex items-center gap-1.5 flex-wrap">
                      <span>{sadTone.label}</span>
                      {'isDefault' in sadTone && sadTone.isDefault && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-600 dark:text-amber-300 text-[9px] font-bold">
                          {t.defaultSadToneBadge}
                        </span>
                      )}
                      {isSel && <Check size={13} className="text-rose-600 dark:text-rose-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                      {sadTone.desc}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    {isPlaying ? (
                      <div className="flex items-center gap-0.5 px-2 py-1 bg-rose-500/10 rounded-md">
                        <span className="w-1 h-3 bg-rose-500 rounded-full animate-wave-1"></span>
                        <span className="w-1 h-4 bg-rose-500 rounded-full animate-wave-2"></span>
                        <span className="w-1 h-2 bg-rose-500 rounded-full animate-wave-3"></span>
                        <span className="w-1 h-3.5 bg-rose-500 rounded-full animate-wave-4"></span>
                      </div>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-500 hover:text-rose-600">
                        <Play size={12} className="fill-current" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Custom Audio & Ringtone Studio (User Feature) */}
      <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Music size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.customRingtonesTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.customRingtonesDesc}
              </p>
            </div>
          </div>
        </div>

        {audioFeedbackMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-fade-in">
            <Sparkles size={15} className="text-emerald-500" />
            {audioFeedbackMsg}
          </div>
        )}

        {/* Upload Box Form */}
        <form
          onSubmit={handleSaveCustomTone}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 space-y-3"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0">
              <Upload size={14} />
              {t.selectAudioFile}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioFileSelect}
                className="hidden"
                id="custom-audio-file-input"
              />
            </label>

            {selectedAudioFile && (
              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="text"
                  value={uploadToneName}
                  onChange={(e) => setUploadToneName(e.target.value)}
                  placeholder={t.toneNamePlaceholder}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shrink-0 transition-colors"
                  id="save-custom-tone-btn"
                >
                  {t.saveTone}
                </button>
              </div>
            )}
          </div>

          {selectedAudioFile && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <span>🎵 {selectedAudioFile.name}</span>
              {selectedAudioFile.durationSeconds && (
                <span>
                  {t.audioDuration}: {selectedAudioFile.durationSeconds}s
                </span>
              )}
            </div>
          )}
        </form>

        {/* Custom Tones List */}
        {customTones.length > 0 ? (
          <div className="space-y-2">
            {customTones.map((tone) => {
              const isDefaultChosen = settings.soundChoice === `custom_${tone.id}`;
              const isSadChosen = settings.overdueSadSoundChoice === `custom_${tone.id}`;
              const isPlaying = playingSoundId === `custom_${tone.id}`;

              return (
                <div
                  key={tone.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (isPlaying) {
                          stopAllAudio();
                        } else {
                          playCustomAudioUrl(tone.dataUrl, `custom_${tone.id}`);
                        }
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isPlaying
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 hover:bg-purple-200'
                      }`}
                    >
                      {isPlaying ? <Square size={13} className="fill-current" /> : <Play size={14} className="fill-current" />}
                    </button>

                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {tone.name}
                        {isDefaultChosen && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                            {t.soundAlerts}
                          </span>
                        )}
                        {isSadChosen && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                            {t.overdueBadge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {tone.durationSeconds ? `${tone.durationSeconds}s` : 'Audio track'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Set as general or sad tone buttons */}
                    <button
                      type="button"
                      onClick={() => handleSoundSelect(`custom_${tone.id}` as SoundChoice)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                        isDefaultChosen
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {t.soundAlerts}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSadSoundSelect(`custom_${tone.id}` as SadSoundChoice)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                        isSadChosen
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {t.overdueBadge}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCustomTone(tone.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title={t.deleteTone}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
            {t.noCustomTones}
          </p>
        )}
      </div>

      {/* 6. Health Routine Goals Configuration */}
      <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
            <Heart size={18} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {t.healthGoalsTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Droplet size={13} className="text-cyan-500" /> {t.dailyWaterGoal}
            </label>
            <input
              type="number"
              value={settings.waterGoalMl}
              onChange={(e) =>
                onUpdateSettings({ ...settings, waterGoalMl: parseInt(e.target.value, 10) || 2000 })
              }
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Moon size={13} className="text-indigo-500" /> {t.dailySleepGoal}
            </label>
            <input
              type="number"
              value={settings.sleepGoalHours}
              onChange={(e) =>
                onUpdateSettings({ ...settings, sleepGoalHours: parseInt(e.target.value, 10) || 8 })
              }
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Footprints size={13} className="text-emerald-500" /> {t.dailyStepsGoal}
            </label>
            <input
              type="number"
              value={settings.stepGoal}
              onChange={(e) =>
                onUpdateSettings({ ...settings, stepGoal: parseInt(e.target.value, 10) || 8000 })
              }
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* 7. Manage Categories & Colors */}
      <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Tag size={18} />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {t.categoriesManagement}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCatModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            id="add-cat-open-btn"
          >
            <Plus size={14} /> {t.addCategory}
          </button>
        </div>

        {/* Existing categories list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon name={cat.icon} size={15} />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {cat.name[language] || cat.name.en}
                </span>
              </div>

              {categories.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Category Form Modal */}
        {showAddCatModal && (
          <form
            onSubmit={handleAddCategory}
            className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3 animate-fade-in"
          >
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {t.addCategory}
            </h4>

            <div>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder={t.categoryName}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                required
              />
            </div>

            {/* Colors picker */}
            <div className="flex items-center gap-2">
              {[
                '#4F46E5',
                '#7C3AED',
                '#EC4899',
                '#059669',
                '#0891B2',
                '#D97706',
                '#DC2626',
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCatColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    newCatColor === c ? 'scale-125 ring-2 ring-indigo-500' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Icons picker */}
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_CATEGORY_ICONS.slice(0, 10).map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setNewCatIcon(iconName)}
                  className={`p-1.5 rounded-lg border ${
                    newCatIcon === iconName
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <CategoryIcon name={iconName} size={14} />
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddCatModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                {t.save}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 8. Local Backup & Storage (JSON Export / Import) */}
      <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
              <Shield size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t.dataManagementTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                100% {t.offlineNotice}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
            <HardDrive size={13} className="text-emerald-500" />
            <span>
              {storageInfo.tasksCount} {t.filterAll} • ~{storageInfo.kb} KB
            </span>
          </div>
        </div>

        {/* Feedback Alert Notice */}
        {backupFeedback && (
          <div
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              backupFeedback.isError
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {backupFeedback.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{backupFeedback.text}</span>
          </div>
        )}

        {/* Primary Export & Import Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* 1. Export JSON File */}
          <button
            type="button"
            onClick={onExportBackup}
            className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
            id="export-backup-btn"
          >
            <Download size={16} /> {t.exportData}
          </button>

          {/* 2. Import JSON File */}
          <label className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer">
            <Upload size={16} /> {t.importData}
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
              id="import-backup-input"
            />
          </label>
        </div>

        {/* Secondary Actions (Copy & Direct Paste Text) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Copy Backup JSON */}
          <button
            type="button"
            onClick={handleCopyBackupJson}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            id="copy-backup-btn"
          >
            {copiedBackup ? (
              <>
                <CheckCheck size={15} className="text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {t.copiedToClipboard}
                </span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>{t.copyBackupJson}</span>
              </>
            )}
          </button>

          {/* Direct Paste JSON Text */}
          <button
            type="button"
            onClick={() => setShowPasteModal(true)}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            id="paste-backup-btn"
          >
            <FileText size={15} />
            <span>{t.pasteBackupJson}</span>
          </button>
        </div>

        {/* Paste JSON Modal Form */}
        {showPasteModal && (
          <form
            onSubmit={handleDirectPasteSubmit}
            className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-900/60 space-y-3 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileJson size={15} className="text-indigo-600 dark:text-indigo-400" />
                {t.pasteBackupJson}
              </h4>
              <span className="text-[10px] text-slate-400">JSON Format</span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.importConfirmWarning}
            </p>

            <textarea
              rows={4}
              value={pastedJson}
              onChange={(e) => setPastedJson(e.target.value)}
              placeholder={t.pasteJsonPlaceholder}
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden resize-none"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasteModal(false);
                  setPastedJson('');
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {t.importData}
              </button>
            </div>
          </form>
        )}

        {/* Quick Archive & Onboarding links */}
        <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={onOpenArchive}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
          >
            📂 {t.archive}
          </button>
          <button
            type="button"
            onClick={onReopenOnboarding}
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
          >
            ✨ {t.viewOnboardingAgain}
          </button>
        </div>
      </div>

      {/* 9. About Screen Card */}
      <div className="bg-gradient-to-tr from-slate-950 via-indigo-950 to-purple-950 rounded-3xl p-6 text-white border border-indigo-900/60 shadow-xl space-y-4 glow-indigo">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/15">
            {t.version}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {t.aboutText}
        </p>

        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-300 font-semibold">
          <span>{t.developedBy}</span>
          <span>© 2026 Arasko Team Fallt</span>
        </div>
      </div>

      {/* Reset Data Danger Zone */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            if (confirm(t.resetConfirm)) {
              onResetAllData();
            }
          }}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors p-2"
          id="reset-all-data-btn"
        >
          {t.resetAllData}
        </button>
      </div>
    </div>
  );
};
