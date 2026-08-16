import type { SQLiteDatabase } from 'expo-sqlite';

import { type Category, type CategoryRow, mapCategoryRow, type TransactionType } from '@/db/schema';
import { generateId } from '@/utils/id';

export async function listCategories(
  db: SQLiteDatabase,
  type?: TransactionType
): Promise<Category[]> {
  const rows = type
    ? await db.getAllAsync<CategoryRow>(
        'SELECT * FROM categories WHERE type = ? ORDER BY sort_order ASC, name ASC',
        [type]
      )
    : await db.getAllAsync<CategoryRow>('SELECT * FROM categories ORDER BY sort_order ASC, name ASC');
  return rows.map(mapCategoryRow);
}

export async function getCategory(db: SQLiteDatabase, id: string): Promise<Category | null> {
  const row = await db.getFirstAsync<CategoryRow>('SELECT * FROM categories WHERE id = ?', [id]);
  return row ? mapCategoryRow(row) : null;
}

export interface CategoryInput {
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

/** Category `type` is immutable once created, so edits never touch it. */
export interface CategoryEditInput {
  name: string;
  icon: string;
  color: string;
}

export async function createCategory(
  db: SQLiteDatabase,
  input: CategoryInput
): Promise<Category> {
  const id = generateId();
  const now = new Date().toISOString();
  const maxSortOrder = await db.getFirstAsync<{ max_sort: number | null }>(
    'SELECT MAX(sort_order) as max_sort FROM categories WHERE type = ?',
    [input.type]
  );
  const sortOrder = (maxSortOrder?.max_sort ?? -1) + 1;

  await db.runAsync(
    `INSERT INTO categories (id, name, icon, color, type, is_default, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
    [id, input.name, input.icon, input.color, input.type, sortOrder, now]
  );

  return {
    id,
    name: input.name,
    icon: input.icon,
    color: input.color,
    type: input.type,
    isDefault: false,
    sortOrder,
    createdAt: now,
  };
}

export async function updateCategory(
  db: SQLiteDatabase,
  id: string,
  input: CategoryEditInput
): Promise<void> {
  await db.runAsync('UPDATE categories SET name = ?, icon = ?, color = ? WHERE id = ?', [
    input.name,
    input.icon,
    input.color,
    id,
  ]);
}

export async function isCategoryInUse(db: SQLiteDatabase, id: string): Promise<boolean> {
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM expenses WHERE category_id = ?',
    [id]
  );
  return (row?.count ?? 0) > 0;
}

export async function deleteCategory(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
}
