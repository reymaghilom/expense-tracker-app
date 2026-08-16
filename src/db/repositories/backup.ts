import type { SQLiteDatabase } from 'expo-sqlite';

import type { CategoryRow, ExpenseRow } from '@/db/schema';

export const BACKUP_FORMAT_VERSION = 1;
export const BACKUP_APP_NAME = 'Income & Expense Tracker';

interface SettingRow {
  key: string;
  value: string;
}

export interface BackupPayload {
  formatVersion: number;
  app: string;
  exportedAt: string;
  data: {
    categories: CategoryRow[];
    transactions: ExpenseRow[];
    settings: SettingRow[];
  };
}

/** Reads every category, transaction, and setting into a single portable snapshot. */
export async function buildBackupPayload(db: SQLiteDatabase): Promise<BackupPayload> {
  const [categories, transactions, settings] = await Promise.all([
    db.getAllAsync<CategoryRow>('SELECT * FROM categories ORDER BY sort_order ASC'),
    db.getAllAsync<ExpenseRow>('SELECT * FROM expenses ORDER BY date ASC'),
    db.getAllAsync<SettingRow>('SELECT key, value FROM settings'),
  ]);

  return {
    formatVersion: BACKUP_FORMAT_VERSION,
    app: BACKUP_APP_NAME,
    exportedAt: new Date().toISOString(),
    data: { categories, transactions, settings },
  };
}

function isCategoryRow(value: unknown): value is CategoryRow {
  if (!value || typeof value !== 'object') return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.icon === 'string' &&
    typeof c.color === 'string' &&
    (c.type === 'income' || c.type === 'expense') &&
    typeof c.is_default === 'number' &&
    typeof c.sort_order === 'number' &&
    typeof c.created_at === 'string'
  );
}

function isExpenseRow(value: unknown): value is ExpenseRow {
  if (!value || typeof value !== 'object') return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    (e.type === 'income' || e.type === 'expense') &&
    typeof e.amount === 'number' &&
    typeof e.category_id === 'string' &&
    typeof e.date === 'string' &&
    typeof e.payment_method === 'string' &&
    (e.note === null || typeof e.note === 'string') &&
    (e.receipt_uri === null || typeof e.receipt_uri === 'string') &&
    typeof e.created_at === 'string' &&
    typeof e.updated_at === 'string'
  );
}

function isSettingRow(value: unknown): value is SettingRow {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  return typeof s.key === 'string' && typeof s.value === 'string';
}

/** Structural validation only — never trusts a file just because it parses as JSON. */
export function isValidBackupPayload(value: unknown): value is BackupPayload {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (v.formatVersion !== BACKUP_FORMAT_VERSION) return false;
  if (typeof v.exportedAt !== 'string') return false;
  if (!v.data || typeof v.data !== 'object') return false;

  const data = v.data as Record<string, unknown>;
  if (!Array.isArray(data.categories) || !Array.isArray(data.transactions) || !Array.isArray(data.settings)) {
    return false;
  }

  return (
    data.categories.every(isCategoryRow) &&
    data.transactions.every(isExpenseRow) &&
    data.settings.every(isSettingRow)
  );
}

/**
 * Replaces all local data with the backup's contents inside a single SQLite
 * transaction, so a mid-restore failure leaves the previous data untouched
 * instead of a half-written database. Caller must validate with
 * `isValidBackupPayload` first — this function trusts its input.
 */
export async function restoreFromBackup(db: SQLiteDatabase, backup: BackupPayload): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.execAsync('DELETE FROM expenses; DELETE FROM categories; DELETE FROM settings;');

    for (const c of backup.data.categories) {
      await db.runAsync(
        `INSERT INTO categories (id, name, icon, color, type, is_default, sort_order, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.name, c.icon, c.color, c.type, c.is_default, c.sort_order, c.created_at]
      );
    }

    for (const t of backup.data.transactions) {
      await db.runAsync(
        `INSERT INTO expenses (id, type, amount, category_id, date, payment_method, note, receipt_uri, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.id, t.type, t.amount, t.category_id, t.date, t.payment_method, t.note, t.receipt_uri, t.created_at, t.updated_at]
      );
    }

    for (const s of backup.data.settings) {
      await db.runAsync(`INSERT INTO settings (key, value) VALUES (?, ?)`, [s.key, s.value]);
    }
  });
}
