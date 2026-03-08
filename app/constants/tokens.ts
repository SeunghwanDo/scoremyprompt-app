/**
 * Design tokens for JS/TS usage.
 * Mirrors CSS custom properties from styles/tokens.css.
 * Use these for inline styles, SVGs, and chart libraries.
 */

export const colors = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  accent: '#8b5cf6',
  accentHover: '#7c3aed',

  bg: '#0a0f1a',
  surface: '#0f172a',
  surfaceHover: '#1e293b',
  surfaceElevated: '#1e293b',

  text: '#f8fafc',
  textMuted: '#9ca3af',
  textSubtle: '#64748b',

  border: '#1e293b',
  borderFocus: '#3b82f6',

  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

export const gradeColors = {
  S: '#10b981',
  A: '#3b82f6',
  B: '#8b5cf6',
  C: '#f59e0b',
  D: '#ef4444',
} as const;

/** Returns grade color with opacity suffix (e.g. '#3b82f622') */
export function gradeColorAlpha(grade: keyof typeof gradeColors, alpha: string = '22'): string {
  return gradeColors[grade] + alpha;
}

/** Score-based bar color logic used in charts */
export function getScoreColor(score: number): string {
  if (score >= 85) return colors.success;
  if (score >= 70) return colors.primary;
  if (score >= 50) return colors.warning;
  return colors.error;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const transition = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  easing: 'ease-in-out',
} as const;
