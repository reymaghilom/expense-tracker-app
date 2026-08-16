import type { ExpenseWithCategory } from '@/db/schema';
import { parseLocalISOString } from '@/utils/date';

export interface ExpenseDayGroup {
  key: string;
  label: string;
  total: number;
  expenses: ExpenseWithCategory[];
}

/**
 * Groups expenses (already sorted by date desc) into day sections with subtotals.
 * `formatDayLabel` is injected so this stays a pure util — callers pass in
 * `useDateFormatter().formatDayLabel` to apply the user's Date Format / language.
 */
export function groupExpensesByDay(
  expenses: ExpenseWithCategory[],
  formatDayLabel: (date: Date) => string
): ExpenseDayGroup[] {
  const groups = new Map<string, ExpenseDayGroup>();

  for (const expense of expenses) {
    const date = parseLocalISOString(expense.date);
    const key = expense.date.slice(0, 10);

    let group = groups.get(key);
    if (!group) {
      group = { key, label: formatDayLabel(date), total: 0, expenses: [] };
      groups.set(key, group);
    }
    group.total += expense.amount;
    group.expenses.push(expense);
  }

  return Array.from(groups.values());
}
