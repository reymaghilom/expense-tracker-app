import {
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isYesterday,
  isToday as dateFnsIsToday,
  startOfMonth,
  subMonths,
} from 'date-fns';

/**
 * Stored expense dates are "local, timezone-naive" ISO strings (no `Z` suffix)
 * so day-grouping matches the user's calendar day (PH is UTC+8) instead of
 * shifting near midnight the way `Date.toISOString()` (UTC) would.
 */
export function toLocalISOString(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS");
}

export function parseLocalISOString(value: string): Date {
  return new Date(value);
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export const DATE_FORMAT_KEYS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] as const;
export type DateFormatKey = (typeof DATE_FORMAT_KEYS)[number];

/** Maps each user-facing format key to its date-fns pattern. Display-only — never used for storage. */
const DATE_FORMAT_PATTERNS: Record<DateFormatKey, string> = {
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'DD/MM/YYYY': 'dd/MM/yyyy',
  'YYYY-MM-DD': 'yyyy-MM-dd',
};

/** Renders a date using the user's selected Date Format setting. Display-only. */
export function formatDateForDisplay(date: Date, dateFormat: DateFormatKey): string {
  return format(date, DATE_FORMAT_PATTERNS[dateFormat]);
}

export function formatFullDate(date: Date, dateFormat: DateFormatKey): string {
  return formatDateForDisplay(date, dateFormat);
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function formatDayLabel(
  date: Date,
  dateFormat: DateFormatKey,
  todayLabel: string,
  yesterdayLabel: string
): string {
  if (dateFnsIsToday(date)) return `${formatFullDate(date, dateFormat)} (${todayLabel})`;
  if (isYesterday(date)) return `${formatFullDate(date, dateFormat)} (${yesterdayLabel})`;
  return formatFullDate(date, dateFormat);
}

export function getMonthBounds(monthDate: Date): { start: Date; end: Date } {
  return { start: startOfMonth(monthDate), end: endOfMonth(monthDate) };
}

export function shiftMonth(monthDate: Date, delta: number): Date {
  return delta >= 0 ? addMonths(monthDate, delta) : subMonths(monthDate, -delta);
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return isSameDay(a, b);
}
