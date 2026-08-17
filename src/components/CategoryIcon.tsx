import React from 'react';
import {
  Briefcase,
  User,
  Heart,
  BookOpen,
  Wallet,
  Home,
  CheckCircle2,
  Calendar,
  Sparkles,
  Flame,
  Clock,
  Award,
  Zap,
  Target,
  Smile,
  Compass,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Briefcase,
  User,
  Heart,
  BookOpen,
  Wallet,
  Home,
  CheckCircle2,
  Calendar,
  Sparkles,
  Flame,
  Clock,
  Award,
  Zap,
  Target,
  Smile,
  Compass,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = '', size = 18 }) => {
  const IconComponent = iconMap[name] || Target;
  return <IconComponent className={className} size={size} />;
};

export const AVAILABLE_CATEGORY_ICONS = [
  'Briefcase',
  'User',
  'Heart',
  'BookOpen',
  'Wallet',
  'Home',
  'CheckCircle2',
  'Calendar',
  'Sparkles',
  'Flame',
  'Clock',
  'Award',
  'Zap',
  'Target',
  'Smile',
  'Compass',
];
