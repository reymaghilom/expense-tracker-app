import type { SQLiteDatabase } from 'expo-sqlite';

import { DEFAULT_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/constants/categories';
import { generateId } from '@/utils/id';

export const DATABASE_NAME = 'expense-tracker.db';

const SCHEMA_VERSION = 2;

async function seedCategories(
  db: SQLiteDatabase,
  seeds: typeof DEFAULT_CATEGORIES,
  startingSortOrder: number
): Promise<void> {
  const now = new Date().toISOString();
  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    await db.runAsync(
      `INSERT INTO categories (id, name, icon, color, type, is_default, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      [generateId(), seed.name, seed.icon, seed.color, seed.type, startingSortOrder + i, now]
    );
  }
}

/**
 * Safety net, not a migration: guarantees a default "Others" expense category
 * exists. Runs unconditionally on every launch (cheap single lookup), so it
 * self-heals regardless of how a device's history diverged, with no schema
 * version bump and no risk of duplicates.
 */
async function ensureDefaultExpenseOthersCategory(db: SQLiteDatabase): Promise<void> {
  const existing = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM categories WHERE type = 'expense' AND LOWER(name) IN ('other', 'others')`
  );
  if (existing && existing.count > 0) {
    return;
  }

  const seed = DEFAULT_EXPENSE_CATEGORIES.find((c) => c.name === 'Others');
  if (!seed) {
    return;
  }

  const maxSort = await db.getFirstAsync<{ max_sort: number | null }>(
    `SELECT MAX(sort_order) as max_sort FROM categories WHERE type = 'expense'`
  );
  await seedCategories(db, [seed], (maxSort?.max_sort ?? -1) + 1);
}

/**
 * Safety net, not a migration: guarantees a default "Savings" expense category
 * exists. Same self-healing pattern as ensureDefaultExpenseOthersCategory —
 * runs unconditionally on every launch, no schema version bump, no duplicates.
 */
async function ensureDefaultExpenseSavingsCategory(db: SQLiteDatabase): Promise<void> {
  const existing = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM categories WHERE type = 'expense' AND LOWER(name) = 'savings'`
  );
  if (existing && existing.count > 0) {
    return;
  }

  const seed = DEFAULT_EXPENSE_CATEGORIES.find((c) => c.name === 'Savings');
  if (!seed) {
    return;
  }

  const maxSort = await db.getFirstAsync<{ max_sort: number | null }>(
    `SELECT MAX(sort_order) as max_sort FROM categories WHERE type = 'expense'`
  );
  await seedCategories(db, [seed], (maxSort?.max_sort ?? -1) + 1);
}

/**
 * Safety net, not a migration: guarantees the "Others" expense category always
 * sorts after every other expense category (including "Savings", which may
 * have been seeded after "Others" already existed on upgraded devices).
 * Only reorders the single "Others" row — never touches any other category.
 */
async function ensureOthersCategoryIsLast(db: SQLiteDatabase): Promise<void> {
  const others = await db.getFirstAsync<{ id: string; sort_order: number }>(
    `SELECT id, sort_order FROM categories WHERE type = 'expense' AND LOWER(name) IN ('other', 'others') ORDER BY sort_order ASC LIMIT 1`
  );
  if (!others) {
    return;
  }

  const maxSort = await db.getFirstAsync<{ max_sort: number | null }>(
    `SELECT MAX(sort_order) as max_sort FROM categories WHERE type = 'expense' AND id != ?`,
    [others.id]
  );
  const targetSort = (maxSort?.max_sort ?? -1) + 1;
  if (others.sort_order < targetSort) {
    await db.runAsync(`UPDATE categories SET sort_order = ? WHERE id = ?`, [targetSort, others.id]);
  }
}

/** Runs once per app launch, guarded by PRAGMA user_version. Additive-only — never drops data. */
export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= SCHEMA_VERSION) {
    await ensureDefaultExpenseOthersCategory(db);
    await ensureDefaultExpenseSavingsCategory(db);
    await ensureOthersCategoryIsLast(db);
    return;
  }

  if (currentVersion === 0) {
    // Fresh install: create tables with the current schema (type column included) directly.
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'expense',
        is_default INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL DEFAULT 'expense',
        amount REAL NOT NULL,
        category_id TEXT NOT NULL REFERENCES categories(id),
        date TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        note TEXT,
        receipt_uri TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
      CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(type);
    `);

    await seedCategories(db, DEFAULT_CATEGORIES, 0);
  } else if (currentVersion === 1) {
    // Upgrading an existing v1 database: add `type` additively. Existing rows
    // automatically become type='expense' via the column DEFAULT — no data loss.
    await db.execAsync(`
      ALTER TABLE expenses ADD COLUMN type TEXT NOT NULL DEFAULT 'expense';
      ALTER TABLE categories ADD COLUMN type TEXT NOT NULL DEFAULT 'expense';
      CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(type);
    `);

    const maxSort = await db.getFirstAsync<{ max_sort: number | null }>(
      'SELECT MAX(sort_order) as max_sort FROM categories'
    );
    await seedCategories(db, DEFAULT_INCOME_CATEGORIES, (maxSort?.max_sort ?? -1) + 1);
  }

  await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  await ensureDefaultExpenseOthersCategory(db);
  await ensureDefaultExpenseSavingsCategory(db);
  await ensureOthersCategoryIsLast(db);
}
