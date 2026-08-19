import React from 'react';
import {
  CheckSquare,
  Calendar,
  Heart,
  BookOpen,
  Settings,
} from 'lucide-react';
import { ActiveTab, LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { AraskoMark } from './Logo';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  language: LanguageCode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const t = translations[language];

  const tabs = [
    { id: 'today', label: t.today, icon: CheckSquare },
    { id: 'calendar', label: t.calendar, icon: Calendar },
    { id: 'spiritual', label: t.spiritual, icon: BookOpen },
    { id: 'assistant', label: t.assistant, isLogo: true },
    { id: 'health', label: t.health, icon: Heart },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 transition-colors py-1.5 shadow-2xl shadow-slate-950/20"
      id="bottom-navigation-bar"
    >
      <div className="max-w-md mx-auto px-4 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id as ActiveTab)}
              className={`flex-1 py-1 px-1 rounded-2xl flex flex-col items-center gap-1 transition-all duration-200 ${
                isSel
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              id={`nav-tab-${tab.id}`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isSel ? 'bg-indigo-50 dark:bg-indigo-950/60' : ''
                }`}
              >
                {tab.isLogo ? (
                  <AraskoMark
                    size={20}
                    variant={isSel ? 'gradient' : 'white'}
                    className={isSel ? '' : 'opacity-60 grayscale'}
                  />
                ) : (
                  Icon && <Icon size={19} className={isSel ? 'stroke-[2.5]' : 'stroke-2'} />
                )}
              </div>
              <span className="text-[10px] leading-none truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
