import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  CheckSquare,
  Plus,
  Trash2,
  Bell,
  Image,
  FileText,
  AlertCircle,
  Repeat,
  Music,
  Volume2,
  Play,
  Square,
  UploadCloud,
  Flame,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  CompletionStatus,
  CustomToneItem,
  LanguageCode,
  PriorityLevel,
  RecurrenceOption,
  ReminderItem,
  SubTask,
  TaskCategory,
  TaskItem,
} from '../types';
import { translations } from '../i18n/translations';
import { CategoryIcon } from './CategoryIcon';
import { AudioStorageService } from '../services/audioStorage';
import {
  playAlertSound,
  playCustomAudioUrl,
  stopAllAudio,
  subscribeAudioState,
  triggerVibration,
} from '../services/soundEngine';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskItem) => void;
  onDelete?: (taskId: string) => void;
  initialTask?: TaskItem | null;
  categories: TaskCategory[];
  language: LanguageCode;
  selectedDateStr?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialTask,
  categories,
  language,
  selectedDateStr,
}) => {
  const t = translations[language];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [status, setStatus] = useState<CompletionStatus>('not_started');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceOption>('none');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [reminders, setReminders] = useState<ReminderItem[]>([
    { id: 'rem_default', minutesBefore: 15, triggered: false },
  ]);
  const [customSoundChoice, setCustomSoundChoice] = useState<string>('');
  const [customTones, setCustomTones] = useState<CustomToneItem[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [imageAttachment, setImageAttachment] = useState<string | undefined>();
  const [errors, setErrors] = useState<{ title?: string }>({});

  // Subscribe to audio state for play/stop button synchronization
  useEffect(() => {
    const unsubscribe = subscribeAudioState((playing) => {
      setIsPlayingAudio(playing);
    });
    return () => {
      unsubscribe();
      stopAllAudio();
    };
  }, []);

  // Load custom tones from IndexedDB when modal is active
  useEffect(() => {
    if (isOpen) {
      AudioStorageService.getAllTones()
        .then((tones) => {
          setCustomTones(tones);
        })
        .catch((err) => {
          console.warn('Failed to load custom tones in TaskModal:', err);
        });

      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description || '');
        setCategoryId(initialTask.categoryId || (categories[0]?.id ?? ''));
        setPriority(initialTask.priority || 'normal');
        setStatus(initialTask.status || 'not_started');
        setStartDate(initialTask.startDate || '');
        setDueDate(initialTask.dueDate || '');
        setRecurrence(initialTask.recurrence || 'none');
        setSubTasks(initialTask.subTasks ? [...initialTask.subTasks] : []);
        setReminders(initialTask.reminders ? [...initialTask.reminders] : []);
        setCustomSoundChoice(initialTask.customSoundChoice || '');
        setNotes(initialTask.notes || '');
        setImageAttachment(initialTask.imageAttachment);
      } else {
        // New task
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const defaultDue = selectedDateStr
          ? `${selectedDateStr}T18:00`
          : `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
              now.getHours() + 1
            )}:00`;

        setTitle('');
        setDescription('');
        setCategoryId(categories[0]?.id ?? '');
        setPriority('normal');
        setStatus('not_started');
        setStartDate('');
        setDueDate(defaultDue);
        setRecurrence('none');
        setSubTasks([]);
        setReminders([{ id: `rem_${Date.now()}`, minutesBefore: 15, triggered: false }]);
        setCustomSoundChoice('');
        setNotes('');
        setImageAttachment(undefined);
      }
      setErrors({});
      setNewSubTaskTitle('');
      setUploadFeedback(null);
    } else {
      stopAllAudio();
    }
  }, [isOpen, initialTask, categories, selectedDateStr]);

  if (!isOpen) return null;

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    setSubTasks([
      ...subTasks,
      {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: newSubTaskTitle.trim(),
        isCompleted: false,
      },
    ]);
    setNewSubTaskTitle('');
  };

  const handleToggleSubTask = (id: string) => {
    setSubTasks(
      subTasks.map((s) => (s.id === id ? { ...s, isCompleted: !s.isCompleted } : s))
    );
  };

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter((s) => s.id !== id));
  };

  const handleAddReminder = (mins: number) => {
    if (reminders.some((r) => r.minutesBefore === mins)) return;
    setReminders([
      ...reminders,
      { id: `rem_${Date.now()}_${mins}`, minutesBefore: mins, triggered: false },
    ]);
  };

  const handleRemoveReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preview the currently selected alert sound
  const handlePreviewTone = async () => {
    triggerVibration(25);
    if (isPlayingAudio) {
      stopAllAudio();
      return;
    }

    const soundToPlay = customSoundChoice || 'chime';
    if (soundToPlay.startsWith('custom_')) {
      const toneId = soundToPlay.replace('custom_', '');
      const tone = customTones.find((t) => t.id === toneId) || (await AudioStorageService.getTone(toneId));
      if (tone?.dataUrl) {
        playCustomAudioUrl(tone.dataUrl, soundToPlay);
      } else {
        playAlertSound('chime');
      }
    } else {
      playAlertSound(soundToPlay);
    }
  };

  // Upload local audio file directly within TaskModal
  const handleDirectAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').trim() || 'Task Audio';
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const newTone: CustomToneItem = {
          id: `tone_${Date.now()}`,
          name: cleanName,
          category: priority === 'urgent' || priority === 'important' ? 'sad' : 'general',
          dataUrl,
          fileName: file.name,
          fileSizeKb: Math.round(file.size / 1024),
          createdAt: new Date().toISOString(),
        };

        await AudioStorageService.saveTone(newTone);
        const all = await AudioStorageService.getAllTones();
        setCustomTones(all);
        setCustomSoundChoice(`custom_${newTone.id}`);
        setUploadFeedback(t.toneAddedSuccess);
        playCustomAudioUrl(dataUrl, `custom_${newTone.id}`);
        triggerVibration([50, 50, 100]);

        setTimeout(() => setUploadFeedback(null), 3500);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to upload audio in modal:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: t.taskTitlePlaceholder });
      return;
    }

    const taskToSave: TaskItem = {
      id: initialTask?.id || `task_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      categoryId: categoryId || categories[0]?.id || 'cat_work',
      priority,
      status,
      startDate: startDate || undefined,
      dueDate: dueDate || new Date().toISOString(),
      recurrence,
      subTasks,
      reminders,
      customSoundChoice: customSoundChoice || undefined,
      notes: notes.trim() || undefined,
      imageAttachment,
      createdAt: initialTask?.createdAt || new Date().toISOString(),
      completedAt:
        status === 'completed'
          ? initialTask?.completedAt || new Date().toISOString()
          : undefined,
      isArchived: initialTask?.isArchived || false,
    };

    stopAllAudio();
    onSave(taskToSave);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in"
      id="task-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-floating-4k card-floating-4k overflow-hidden my-auto max-h-[92vh] flex flex-col"
        id="task-modal-content"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-sky-400 flex items-center justify-center">
              <CheckSquare size={18} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              {initialTask ? t.editTask : t.createTask}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            id="close-task-modal-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              {t.taskTitle} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              placeholder={t.taskTitlePlaceholder}
              className={`w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border ${
                errors.title
                  ? 'border-red-500 ring-2 ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-700'
              } text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
              autoFocus
              id="task-title-input"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.title}
              </p>
            )}
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {t.category}
              </label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  id="task-category-select"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name[language] || cat.name.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {t.priority}
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                {(['normal', 'important', 'urgent'] as PriorityLevel[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-xs font-semibold rounded-xl transition-all ${
                        isSelected
                          ? p === 'urgent'
                            ? 'bg-rose-500 text-white shadow-xs'
                            : p === 'important'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      id={`priority-btn-${p}`}
                    >
                      {t[p]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status & Recurrence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {t.status}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CompletionStatus)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:border-blue-500 transition-all cursor-pointer"
                id="task-status-select"
              >
                <option value="not_started">{t.notStarted}</option>
                <option value="in_progress">{t.inProgress}</option>
                <option value="completed">{t.completed}</option>
                <option value="postponed">{t.postponed}</option>
              </select>
            </div>

            {/* Recurrence */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Repeat size={13} /> {t.recurrence}
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as RecurrenceOption)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:border-blue-500 transition-all cursor-pointer"
                id="task-recurrence-select"
              >
                <option value="none">{t.recurrenceNone}</option>
                <option value="daily">{t.recurrenceDaily}</option>
                <option value="weekly">{t.recurrenceWeekly}</option>
                <option value="monthly">{t.recurrenceMonthly}</option>
                <option value="yearly">{t.recurrenceYearly}</option>
                <option value="custom">{t.recurrenceCustom}</option>
              </select>
            </div>
          </div>

          {/* Dates (Start & Due Date) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Calendar size={13} /> {t.startDate}
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-hidden focus:border-blue-500"
                id="task-startdate-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Clock size={13} /> {t.dueDate} *
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-hidden focus:border-blue-500"
                required
                id="task-duedate-input"
              />
            </div>
          </div>

          {/* Sub-tasks Checklist */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckSquare size={14} className="text-blue-600 dark:text-sky-400" />
                {t.subTasks} ({subTasks.filter((s) => s.isCompleted).length}/{subTasks.length})
              </label>
            </div>

            {/* List */}
            {subTasks.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {subTasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSubTask(sub.id)}
                      className="flex items-center gap-2 flex-1 text-start"
                    >
                      <input
                        type="checkbox"
                        checked={sub.isCompleted}
                        onChange={() => {}}
                        className="rounded-sm text-blue-600 focus:ring-blue-500 pointer-events-none"
                      />
                      <span
                        className={`${
                          sub.isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {sub.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubTask(sub.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Subtask Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubTaskTitle}
                onChange={(e) => setNewSubTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubTask();
                  }
                }}
                placeholder={t.subTaskPlaceholder}
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-hidden focus:border-blue-500"
                id="new-subtask-input"
              />
              <button
                type="button"
                onClick={handleAddSubTask}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                id="add-subtask-btn"
              >
                <Plus size={14} /> {t.addSubTask}
              </button>
            </div>
          </div>

          {/* Multiple Customizable Reminders */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <Bell size={13} /> {t.reminders}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                { mins: 0, label: t.reminderAtTime },
                { mins: 5, label: t.reminder5Min },
                { mins: 15, label: t.reminder15Min },
                { mins: 30, label: t.reminder30Min },
                { mins: 60, label: t.reminder1Hour },
                { mins: 1440, label: t.reminder1Day },
              ].map((opt) => {
                const isSelected = reminders.some((r) => r.minutesBefore === opt.mins);
                return (
                  <button
                    key={opt.mins}
                    type="button"
                    onClick={() =>
                      isSelected
                        ? setReminders(reminders.filter((r) => r.minutesBefore !== opt.mins))
                        : handleAddReminder(opt.mins)
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-sky-300'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {opt.label} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Custom Alert Sound Section */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Music size={13} className="text-indigo-500" />
                {t.selectCustomAlertSound}
              </label>

              {(priority === 'urgent' || priority === 'important') && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 animate-pulse">
                  <Flame size={11} className="text-amber-500" />
                  {t.highPrioritySoundRecommendation}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.selectCustomAlertSoundDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              {/* Dropdown for sound choice */}
              <div className="relative flex-1">
                <select
                  value={customSoundChoice}
                  onChange={(e) => {
                    setCustomSoundChoice(e.target.value);
                    stopAllAudio();
                  }}
                  className="w-full pl-3 pr-8 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-hidden focus:border-indigo-500 transition-colors shadow-2xs"
                  id="task-custom-sound-select"
                >
                  <option value="">{t.defaultSystemTone}</option>

                  {/* Locally stored custom audio files from IndexedDB */}
                  {customTones.length > 0 && (
                    <optgroup label={`📁 ${t.locallyStoredAudioFiles} (${customTones.length})`}>
                      {customTones.map((tone) => (
                        <option key={tone.id} value={`custom_${tone.id}`}>
                          🎵 {tone.name} {tone.durationSeconds ? `(${tone.durationSeconds}s)` : ''}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* Built-in high priority and general tones */}
                  <optgroup label={`✨ ${t.builtInMelodies}`}>
                    <option value="bell">🔔 Bell Chime (High Priority)</option>
                    <option value="chime">✨ Uplifting Harmonic Chime</option>
                    <option value="ping">⚡ Fast Resonance Ping</option>
                    <option value="zen">🧘 Peaceful Zen Bell</option>
                    <option value="harp">🎻 Elegant Harp Arpeggio</option>
                    <option value="arasko_sad_1">🚨 Arasko Urgent Alert Tone 1</option>
                    <option value="arasko_sad_2">⚠️ Arasko Urgent Alert Tone 2</option>
                    <option value="sad_alarm">⏰ Deep Alert Pulse</option>
                  </optgroup>
                </select>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Preview / Stop Button */}
                <button
                  type="button"
                  onClick={handlePreviewTone}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                    isPlayingAudio
                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}
                  id="task-sound-preview-btn"
                  title={isPlayingAudio ? t.stopSound : t.previewSound}
                >
                  {isPlayingAudio ? (
                    <>
                      <Square size={13} className="fill-current" />
                      <span>{t.stopSound}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} />
                      <span>{t.previewSound}</span>
                    </>
                  )}
                </button>

                {/* Upload Local Audio File directly */}
                <label
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  id="task-sound-upload-btn"
                  title={t.uploadNewAudioForTask}
                >
                  <UploadCloud size={13} className="text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">{t.uploadNewAudioForTask}</span>
                  <span className="sm:hidden">{t.uploadNewAudioForTask}</span>
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac"
                    onChange={handleDirectAudioUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {uploadFeedback && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 animate-fade-in">
                <Check size={12} />
                <span>{uploadFeedback}</span>
              </div>
            )}
          </div>

          {/* Description & Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <FileText size={13} /> {t.taskDescription}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.taskDescPlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-hidden focus:border-blue-500 resize-none"
              id="task-desc-textarea"
            />
          </div>

          {/* Image / Attachment upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <Image size={13} /> {t.attachImage}
            </label>
            {imageAttachment ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-36">
                <img
                  src={imageAttachment}
                  alt="Attachment"
                  className="w-full h-36 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageAttachment(undefined)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors text-xs text-slate-500 dark:text-slate-400">
                <Image size={20} className="mb-1 text-slate-400" />
                <span>{t.attachImage}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="task-image-file-input"
                />
              </label>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            {initialTask && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(t.deleteConfirmation)) {
                    onDelete(initialTask.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-1.5"
                id="delete-task-modal-btn"
              >
                <Trash2 size={15} /> {t.delete}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              id="cancel-task-modal-btn"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all"
              id="save-task-modal-btn"
            >
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
