import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#2F6FED',
    primaryDark: '#2457C5',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#1A1D29',
    textSecondary: '#6C757D',
    textMuted: '#9CA3AF',
    border: '#E9ECEF',
    danger: '#FA5252',
    onPrimary: '#FFFFFF',
    income: '#2F9E44',
    expense: '#FA5252',
  },
  dark: {
    primary: '#4D8AFF',
    primaryDark: '#3D7BF5',
    background: '#0F1117',
    surface: '#1A1D29',
    text: '#F5F7FA',
    textSecondary: '#9CA3AF',
    textMuted: '#6C757D',
    border: '#2A2E3A',
    danger: '#FF6B6B',
    onPrimary: '#FFFFFF',
    income: '#40C057',
    expense: '#FF6B6B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * On-gradient accent tints for the balance hero card, which always sits on
 * the fixed blue gradient regardless of light/dark mode — so these are
 * intentionally not part of `Colors.light`/`Colors.dark`.
 */
export const GradientAccents = {
  income: '#B9F6CA',
  expense: '#FFCDD2',
} as const;

/** Fixed brand colors per default category, independent of light/dark mode. */
export const CategoryColors = {
  food: '#FF9F43',
  transportation: '#4D96FF',
  utilities: '#20C997',
  shopping: '#9775FA',
  health: '#FF6B6B',
  entertainment: '#22D3EE',
  education: '#FCC419',
  household: '#F06595',
  mobileInternet: '#7048E8',
  savings: '#0B7285',
  others: '#868E96',
  salary: '#2F9E44',
  business: '#0CA678',
  freelance: '#1098AD',
  commission: '#F59F00',
  allowance: '#E64980',
  otherIncome: '#495057',
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#1A1D29',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
} as const;
