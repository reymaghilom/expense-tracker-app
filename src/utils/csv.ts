import { PAYMENT_METHOD_LABELS } from '@/db/schema';
import type { ExpenseWithCategory } from '@/db/schema';
import { parseLocalISOString } from '@/utils/date';

/** Quotes a CSV field only when it contains a comma, quote, or newline — escaping inner quotes by doubling them. */
export function csvEscapeField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function csvRow(fields: string[]): string {
  return fields.map(csvEscapeField).join(',');
}

/**
 * Builds a CSV report of all transactions — for reading/reporting, not app restoration.
 * `formatDate` is injected so this stays a pure util — pass in
 * `useDateFormatter().formatFullDate` to apply the user's Date Format setting.
 */
export function buildTransactionsCsv(expenses: ExpenseWithCategory[], formatDate: (date: Date) => string): string {
  const header = csvRow(['Date', 'Type', 'Amount (PHP)', 'Category', 'Payment Method', 'Note']);
  const rows = expenses.map((expense) =>
    csvRow([
      formatDate(parseLocalISOString(expense.date)),
      expense.type === 'income' ? 'Income' : 'Expense',
      expense.amount.toFixed(2),
      expense.category.name,
      PAYMENT_METHOD_LABELS[expense.paymentMethod],
      expense.note ?? '',
    ])
  );
  return [header, ...rows].join('\r\n');
}
