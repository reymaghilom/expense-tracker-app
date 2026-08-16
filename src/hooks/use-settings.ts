import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { getSetting, setSetting } from '@/db/repositories/settings';

/** Reads/writes a single key in the `settings` table, backed by local state. */
export function useSetting(key: string, fallback: string) {
  const db = useSQLiteContext();
  const [value, setValue] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSetting(db, key, fallback).then((result) => {
      if (!cancelled) {
        setValue(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [db, key, fallback]);

  const update = useCallback(
    async (next: string) => {
      setValue(next);
      await setSetting(db, key, next);
    },
    [db, key]
  );

  return { value, setValue: update, loading };
}
