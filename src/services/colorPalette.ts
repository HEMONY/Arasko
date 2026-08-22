/**
 * Arasko Unified Color Palette Service
 * Strictly enforces consistent color mapping across the application,
 * mapping legacy components and dynamic tokens to the CSS variables defined in index.css.
 */

import { PriorityLevel, CompletionStatus } from '../types';

export interface ThemeColors {
  appBg: string;
  appFg: string;
  appSurface: string;
  appSurfaceHover: string;
  appSurfaceSubtle: string;
  appBorder: string;
  appBorderSubtle: string;
  appMuted: string;
  appInputBg: string;
  appCardBg: string;
  appGlassBorder: string;
}

/**
 * Standard CSS Variable tokens defined in index.css
 */
export const CSS_VARIABLES = {
  appBg: 'var(--app-bg)',
  appFg: 'var(--app-fg)',
  appSurface: 'var(--app-surface)',
  appSurfaceHover: 'var(--app-surface-hover)',
  appSurfaceSubtle: 'var(--app-surface-subtle)',
  appBorder: 'var(--app-border)',
  appBorderSubtle: 'var(--app-border-subtle)',
  appMuted: 'var(--app-muted)',
  appInputBg: 'var(--app-input-bg)',
  appCardBg: 'var(--app-card-bg)',
  appGlassBorder: 'var(--app-glass-border)',
} as const;

/**
 * Canonical Arasko Theme Colors
 */
export const ARASKO_PALETTE = {
  // Brand Blues
  brandDark: '#030712',
  brandSurfaceDark: '#0a1122',
  brandSurfaceHoverDark: '#111c36',
  brandBorderDark: '#152243',
  brandPrimary: '#2563EB',
  brandSky: '#38BDF8',
  brandNavy: '#1E3A8A',

  // Light Theme Neutrals
  brandLightBg: '#f4f6fb',
  brandLightSurface: '#ffffff',
  brandLightBorder: '#cbd7e6',
  brandLightMuted: '#53657d',

  // Functional Semantic Accents
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    950: '#022c22',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    950: '#451a03',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    950: '#4c0519',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    950: '#3b0764',
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    950: '#1e1b4b',
  },
} as const;

/**
 * Returns computed CSS variable value if in DOM, or fallback
 */
export function getThemeVar(varName: keyof typeof CSS_VARIABLES, isDark = false): string {
  if (typeof window !== 'undefined' && window.getComputedStyle) {
    const computed = window.getComputedStyle(document.documentElement).getPropertyValue(varName);
    if (computed && computed.trim()) {
      return computed.trim();
    }
  }

  // Safe SSR / Fallback mapping based on dark mode state
  switch (varName) {
    case 'appBg':
      return isDark ? '#030712' : '#f4f6fb';
    case 'appFg':
      return isDark ? '#f1f5f9' : '#090f1d';
    case 'appSurface':
      return isDark ? '#0a1122' : '#ffffff';
    case 'appSurfaceHover':
      return isDark ? '#111c36' : '#e9eef7';
    case 'appSurfaceSubtle':
      return isDark ? '#060b17' : '#f8fafc';
    case 'appBorder':
      return isDark ? '#152243' : '#cbd7e6';
    case 'appBorderSubtle':
      return isDark ? '#0d172e' : '#e2eaf4';
    case 'appMuted':
      return isDark ? '#8899b2' : '#53657d';
    case 'appInputBg':
      return isDark ? 'rgba(13, 22, 44, 0.88)' : '#f8fafc';
    case 'appCardBg':
      return isDark ? 'rgba(10, 17, 34, 0.92)' : 'rgba(255, 255, 255, 0.94)';
    case 'appGlassBorder':
      return isDark ? 'rgba(30, 58, 110, 0.5)' : 'rgba(203, 215, 230, 0.85)';
    default:
      return '#2563EB';
  }
}

/**
 * Priority Level color resolver mapped to dark/light tokens
 */
export function getPriorityPalette(priority: PriorityLevel, isDark = false) {
  switch (priority) {
    case 'urgent':
      return {
        name: 'urgent',
        bg: isDark ? 'bg-rose-950/40' : 'bg-rose-50',
        text: isDark ? 'text-rose-400' : 'text-rose-700',
        border: isDark ? 'border-rose-800/60' : 'border-rose-200',
        badgeBg: isDark ? 'bg-rose-900/50' : 'bg-rose-100',
        dot: 'bg-rose-500',
        glow: 'glow-rose',
        hex: '#f43f5e',
      };
    case 'important':
      return {
        name: 'important',
        bg: isDark ? 'bg-amber-950/40' : 'bg-amber-50',
        text: isDark ? 'text-amber-400' : 'text-amber-700',
        border: isDark ? 'border-amber-800/60' : 'border-amber-200',
        badgeBg: isDark ? 'bg-amber-900/50' : 'bg-amber-100',
        dot: 'bg-amber-500',
        glow: 'glow-amber',
        hex: '#f59e0b',
      };
    case 'normal':
    default:
      return {
        name: 'normal',
        bg: isDark ? 'bg-blue-950/30' : 'bg-blue-50/60',
        text: isDark ? 'text-sky-400' : 'text-blue-700',
        border: isDark ? 'border-blue-900/50' : 'border-blue-200',
        badgeBg: isDark ? 'bg-blue-900/40' : 'bg-blue-100',
        dot: 'bg-blue-500',
        glow: 'glow-blue',
        hex: '#2563EB',
      };
  }
}

/**
 * Completion Status color resolver
 */
export function getStatusPalette(status: CompletionStatus, isDark = false) {
  switch (status) {
    case 'completed':
      return {
        bg: isDark ? 'bg-emerald-950/40' : 'bg-emerald-50',
        text: isDark ? 'text-emerald-400' : 'text-emerald-700',
        border: isDark ? 'border-emerald-800/60' : 'border-emerald-200',
        badgeBg: isDark ? 'bg-emerald-900/40' : 'bg-emerald-100',
        hex: '#10B981',
      };
    case 'in_progress':
      return {
        bg: isDark ? 'bg-sky-950/40' : 'bg-sky-50',
        text: isDark ? 'text-sky-400' : 'text-sky-700',
        border: isDark ? 'border-sky-800/60' : 'border-sky-200',
        badgeBg: isDark ? 'bg-sky-900/40' : 'bg-sky-100',
        hex: '#38BDF8',
      };
    case 'postponed':
      return {
        bg: isDark ? 'bg-purple-950/40' : 'bg-purple-50',
        text: isDark ? 'text-purple-400' : 'text-purple-700',
        border: isDark ? 'border-purple-800/60' : 'border-purple-200',
        badgeBg: isDark ? 'bg-purple-900/40' : 'bg-purple-100',
        hex: '#a855f7',
      };
    case 'not_started':
    default:
      return {
        bg: isDark ? 'bg-slate-800/50' : 'bg-slate-100',
        text: isDark ? 'text-slate-400' : 'text-slate-600',
        border: isDark ? 'border-slate-700' : 'border-slate-200',
        badgeBg: isDark ? 'bg-slate-800' : 'bg-slate-200',
        hex: '#64748B',
      };
  }
}

/**
 * Legacy Color Mapper: Maps arbitrary legacy color strings/hexes safely to CSS variable-aware classes
 */
export function mapLegacyColor(rawColor: string, isDark = false) {
  const normalized = (rawColor || '').toLowerCase().trim();

  if (normalized.includes('rose') || normalized.includes('red') || normalized === '#ef4444' || normalized === '#f43f5e') {
    return {
      bg: isDark ? 'bg-rose-950/30' : 'bg-rose-50',
      text: isDark ? 'text-rose-400' : 'text-rose-700',
      border: isDark ? 'border-rose-900/60' : 'border-rose-200',
      badge: isDark ? 'bg-rose-900/50 text-rose-300' : 'bg-rose-100 text-rose-700',
      fillHex: '#f43f5e',
    };
  }

  if (normalized.includes('emerald') || normalized.includes('green') || normalized === '#10b981' || normalized === '#22c55e') {
    return {
      bg: isDark ? 'bg-emerald-950/30' : 'bg-emerald-50',
      text: isDark ? 'text-emerald-400' : 'text-emerald-700',
      border: isDark ? 'border-emerald-900/60' : 'border-emerald-200',
      badge: isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
      fillHex: '#10B981',
    };
  }

  if (normalized.includes('amber') || normalized.includes('yellow') || normalized.includes('orange') || normalized === '#f59e0b') {
    return {
      bg: isDark ? 'bg-amber-950/30' : 'bg-amber-50',
      text: isDark ? 'text-amber-400' : 'text-amber-700',
      border: isDark ? 'border-amber-900/60' : 'border-amber-200',
      badge: isDark ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700',
      fillHex: '#f59e0b',
    };
  }

  if (normalized.includes('purple') || normalized.includes('violet') || normalized === '#a855f7' || normalized === '#8b5cf6') {
    return {
      bg: isDark ? 'bg-purple-950/30' : 'bg-purple-50',
      text: isDark ? 'text-purple-400' : 'text-purple-700',
      border: isDark ? 'border-purple-900/60' : 'border-purple-200',
      badge: isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700',
      fillHex: '#a855f7',
    };
  }

  // Default Arasko Brand Blue / Sky
  return {
    bg: isDark ? 'bg-blue-950/30' : 'bg-blue-50',
    text: isDark ? 'text-sky-400' : 'text-blue-700',
    border: isDark ? 'border-blue-900/60' : 'border-blue-200',
    badge: isDark ? 'bg-blue-900/50 text-sky-300' : 'bg-blue-100 text-blue-700',
    fillHex: '#2563EB',
  };
}

/**
 * Chart & Data Visualization Color Resolution
 * Seamlessly integrates with SVG, Recharts, and Canvas
 */
export function getChartThemeColors(isDark = false) {
  return {
    background: isDark ? '#0a1122' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#090f1d',
    mutedText: isDark ? '#8899b2' : '#53657d',
    grid: isDark ? '#152243' : '#cbd7e6',
    subtleGrid: isDark ? '#0d172e' : '#e2eaf4',
    border: isDark ? '#152243' : '#cbd7e6',
    tooltipBg: isDark ? '#060b17' : '#ffffff',
    tooltipBorder: isDark ? '#1e3a8a' : '#cbd7e6',

    // Series
    primary: '#2563EB',
    sky: '#38BDF8',
    emerald: '#10B981',
    amber: '#F59E0B',
    rose: '#F43F5E',
    purple: '#A855F7',
    gradientPrimary: ['#38BDF8', '#2563EB', '#1E3A8A'],
    gradientEmerald: ['#34D399', '#10B981', '#065F46'],
  };
}

/**
 * Unified Color Palette Service Object
 */
export const ColorPaletteService = {
  CSS_VARIABLES,
  ARASKO_PALETTE,
  getThemeVar,
  getPriorityPalette,
  getStatusPalette,
  mapLegacyColor,
  getChartThemeColors,
};
