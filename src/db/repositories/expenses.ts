import type { SQLiteDatabase } from 'expo-sqlite';

import {
  type ExpenseWithCategory,
  type ExpenseWithCategoryRow,
  mapExpenseWithCategoryRow,
  type PaymentMethod,
  type TransactionType,
} from '@/db/schema';
import { generateId } from '@/utils/id';

// LEFT JOIN (not INNER JOIN): a transaction must never disappear from query
// results just because its category_id no longer resolves to a category row.
// COALESCE fills in a graceful fallback so orphaned rows still render.
const SELECT_WITH_CATEGORY = `
  SELECT
    e.*,
    COALESCE(c.name, 'Uncategorized') AS category_name,
    COALESCE(c.icon, 'help-circle-outline') AS category_icon,
    COALESCE(c.color, '#9E9E9E') AS category_color,
    COALESCE(c.type, e.type) AS category_type,
    COALESCE(c.is_default, 0) AS category_is_default,
    COALESCE(c.sort_order, 0) AS category_sort_order,
    COALESCE(c.created_at, e.created_at) AS category_created_at
  FROM expenses e
  LEFT JOIN categories c ON c.id = e.category_id
`;

export async function listExpensesInRange(
  db: SQLiteDatabase,
  startISO: string,
  endISO: string,
  type?: TransactionType
): Promise<ExpenseWithCategory[]> {
  const rows = type
    ? await db.getAllAsync<ExpenseWithCategoryRow>(
        `${SELECT_WITH_CATEGORY} WHERE e.date BETWEEN ? AND ? AND e.type = ? ORDER BY e.date DESC`,
        [startISO, endISO, type]
      )
    : await db.getAllAsync<ExpenseWithCategoryRow>(
        `${SELECT_WITH_CATEGORY} WHERE e.date BETWEEN ? AND ? ORDER BY e.date DESC`,
        [startISO, endISO]
      );
  return rows.map(mapExpenseWithCategoryRow);
}

/** All transactions with category info, unfiltered — used by CSV export. */
export async function listAllExpensesWithCategory(db: SQLiteDatabase): Promise<ExpenseWithCategory[]> {
  const rows = await db.getAllAsync<ExpenseWithCategoryRow>(`${SELECT_WITH_CATEGORY} ORDER BY e.date DESC`);
  return rows.map(mapExpenseWithCategoryRow);
}

export async function getExpense(
  db: SQLiteDatabase,
  id: string
): Promise<ExpenseWithCategory | null> {
  const row = await db.getFirstAsync<ExpenseWithCategoryRow>(
    `${SELECT_WITH_CATEGORY} WHERE e.id = ?`,
    [id]
  );
  return row ? mapExpenseWithCategoryRow(row) : null;
}

export interface ExpenseInput {
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  paymentMethod: PaymentMethod;
  note: string | null;
  receiptUri: string | null;
}

export async function createExpense(db: SQLiteDatabase, input: ExpenseInput): Promise<string> {
  const id = generateId();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO expenses (id, type, amount, category_id, date, payment_method, note, receipt_uri, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.type,
      input.amount,
      input.categoryId,
      input.date,
      input.paymentMethod,
      input.note,
      input.receiptUri,
      now,
      now,
    ]
  );
  return id;
}

export async function updateExpense(
  db: SQLiteDatabase,
  id: string,
  input: ExpenseInput
): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE expenses
     SET type = ?, amount = ?, category_id = ?, date = ?, payment_method = ?, note = ?, receipt_uri = ?, updated_at = ?
     WHERE id = ?`,
    [
      input.type,
      input.amount,
      input.categoryId,
      input.date,
      input.paymentMethod,
      input.note,
      input.receiptUri,
      now,
      id,
    ]
  );
}

export async function deleteExpense(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}

export async function getTotalInRange(
  db: SQLiteDatabase,
  startISO: string,
  endISO: string,
  type: TransactionType
): Promise<number> {
  const row = await db.getFirstAsync<{ total: number | null }>(
    'SELECT SUM(amount) as total FROM expenses WHERE date BETWEEN ? AND ? AND type = ?',
    [startISO, endISO, type]
  );
  return row?.total ?? 0;
}

/** Income and expense totals for a range in a single query, for balance/dashboard use. */
export async function getIncomeExpenseTotals(
  db: SQLiteDatabase,
  startISO: string,
  endISO: string
): Promise<{ income: number; expense: number }> {
  const rows = await db.getAllAsync<{ type: TransactionType; total: number }>(
    `SELECT type, SUM(amount) as total FROM expenses WHERE date BETWEEN ? AND ? GROUP BY type`,
    [startISO, endISO]
  );
  const totals = { income: 0, expense: 0 };
  for (const row of rows) {
    totals[row.type] = row.total;
  }
  return totals;
}

export interface DailyTotal {
  day: string; // 'yyyy-MM-dd'
  total: number;
}

export async function getDailyTotals(
  db: SQLiteDatabase,
  startISO: string,
  endISO: string,
  type: TransactionType
): Promise<DailyTotal[]> {
  const rows = await db.getAllAsync<{ day: string; total: number }>(
    `SELECT substr(date, 1, 10) AS day, SUM(amount) as total
     FROM expenses
     WHERE date BETWEEN ? AND ? AND type = ?
     GROUP BY day
     ORDER BY day ASC`,
    [startISO, endISO, type]
  );
  return rows;
}

/** Net (income - expense) per day, for the dashboard balance trend sparkline. */
export async function getDailyNetTotals(
  db: SQLiteDatabase,
  startISO: string,
  endISO: string
): Promise<DailyTotal[]> {
  const rows = await db.getAllAsync<{ day: string; total: number }>(
    `SELECT substr(date, 1, 10) AS day,
            SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as total
     FROM expenses
     WHERE date BETWEEN ? AND ?
     GROUP BY day
     ORDER BY day ASC`,
    [startISO, endISO]
  );
  return rows;
}

export interface CategoryTotal {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  total: number;
}

export async function getCategoryTotals(
  db: SQLiteDatabase,
  startISO: string,
  endISO: string,
  type: TransactionType
): Promise<CategoryTotal[]> {
  const rows = await db.getAllAsync<{
    category_id: string;
    category_name: string;
    category_color: string;
    category_icon: string;
    total: number;
  }>(
    `SELECT c.id as category_id, c.name as category_name, c.color as category_color, c.icon as category_icon,
            SUM(e.amount) as total
     FROM expenses e
     JOIN categories c ON c.id = e.category_id
     WHERE e.date BETWEEN ? AND ? AND e.type = ?
     GROUP BY c.id
     ORDER BY total DESC`,
    [startISO, endISO, type]
  );
  return rows.map((r) => ({
    categoryId: r.category_id,
    categoryName: r.category_name,
    categoryColor: r.category_color,
    categoryIcon: r.category_icon,
    total: r.total,
  }));
}

export async function deleteAllExpenses(db: SQLiteDatabase): Promise<void> {
  await db.runAsync('DELETE FROM expenses');
}
