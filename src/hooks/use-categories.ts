import { useCallback, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';

import {
  createCategory,
  type CategoryEditInput,
  type CategoryInput,
  deleteCategory,
  isCategoryInUse,
  listCategories,
  updateCategory,
} from '@/db/repositories/categories';
import type { Category, TransactionType } from '@/db/schema';

export function useCategories(type?: TransactionType) {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await listCategories(db, type);
    setCategories(rows);
    setLoading(false);
  }, [db, type]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const add = useCallback(
    async (input: CategoryInput) => {
      const created = await createCategory(db, input);
      await refresh();
      return created;
    },
    [db, refresh]
  );

  const edit = useCallback(
    async (id: string, input: CategoryEditInput) => {
      await updateCategory(db, id, input);
      await refresh();
    },
    [db, refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteCategory(db, id);
      await refresh();
    },
    [db, refresh]
  );

  const checkInUse = useCallback((id: string) => isCategoryInUse(db, id), [db]);

  return { categories, loading, refresh, add, edit, remove, checkInUse };
}
