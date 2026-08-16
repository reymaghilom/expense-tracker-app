import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { useSetting } from '@/hooks/use-settings';
import { useDeviceColorScheme } from '@/hooks/use-device-color-scheme';
import { translations, type Language } from '@/i18n/translations';
import { DATE_FORMAT_KEYS, type DateFormatKey } from '@/utils/date';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ColorScheme = 'light' | 'dark';

const THEME_MODE_KEY = 'appearance_theme_mode';
const LANGUAGE_KEY = 'app_language';
const DATE_FORMAT_KEY = 'date_format_pattern';
const DEFAULT_DATE_FORMAT: DateFormatKey = 'MM/DD/YYYY';

interface AppSettingsContextValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colorScheme: ColorScheme;
  language: Language;
  setLanguage: (language: Language) => void;
  dateFormat: DateFormatKey;
  setDateFormat: (dateFormat: DateFormatKey) => void;
  t: (typeof translations)['en'];
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

function isThemeMode(value: string): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

function isLanguage(value: string): value is Language {
  return value === 'en' || value === 'ceb';
}

function isDateFormat(value: string): value is DateFormatKey {
  return (DATE_FORMAT_KEYS as readonly string[]).includes(value);
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const { value: themeModeRaw, setValue: setThemeModeRaw } = useSetting(THEME_MODE_KEY, 'system');
  const { value: languageRaw, setValue: setLanguageRaw } = useSetting(LANGUAGE_KEY, 'en');
  const { value: dateFormatRaw, setValue: setDateFormatRaw } = useSetting(DATE_FORMAT_KEY, DEFAULT_DATE_FORMAT);

  const themeMode: ThemeMode = isThemeMode(themeModeRaw) ? themeModeRaw : 'system';
  const language: Language = isLanguage(languageRaw) ? languageRaw : 'en';
  const dateFormat: DateFormatKey = isDateFormat(dateFormatRaw) ? dateFormatRaw : DEFAULT_DATE_FORMAT;

  const colorScheme: ColorScheme =
    themeMode === 'system' ? (deviceScheme === 'dark' ? 'dark' : 'light') : themeMode;

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      themeMode,
      setThemeMode: (mode) => setThemeModeRaw(mode),
      colorScheme,
      language,
      setLanguage: (lang) => setLanguageRaw(lang),
      dateFormat,
      setDateFormat: (format) => setDateFormatRaw(format),
      t: translations[language],
    }),
    [themeMode, colorScheme, language, dateFormat, setThemeModeRaw, setLanguageRaw, setDateFormatRaw]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings(): AppSettingsContextValue {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return ctx;
}
