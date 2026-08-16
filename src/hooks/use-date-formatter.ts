import { useCallback } from 'react';

import { useAppSettings } from '@/contexts/app-settings';
import { formatDayLabel as formatDayLabelBase, formatFullDate as formatFullDateBase } from '@/utils/date';

/**
 * Drop-in replacements for the plain `formatFullDate`/`formatDayLabel` utils
 * that read the user's selected Date Format (and, for day labels, the
 * localized Today/Yesterday words) from AppSettingsProvider — so screens
 * don't each have to look up and thread `dateFormat` themselves. Both
 * functions are stable (via `useCallback`) so they're safe to drop into a
 * `useMemo` dependency array without forcing a recompute on every render.
 */
export function useDateFormatter() {
  const { dateFormat, t } = useAppSettings();

  const formatFullDate = useCallback((date: Date): string => formatFullDateBase(date, dateFormat), [dateFormat]);
  const formatDayLabel = useCallback(
    (date: Date): string => formatDayLabelBase(date, dateFormat, t.common.today, t.common.yesterday),
    [dateFormat, t]
  );

  return { formatFullDate, formatDayLabel, dateFormat };
}
