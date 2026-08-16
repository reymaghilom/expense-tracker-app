import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import { endOfDay, startOfDay } from 'date-fns';

import {
  type CategoryTotal,
  createExpense,
  deleteExpense,
  type DailyTotal,
  type ExpenseInput,
  getCategoryTotals,
  getDailyNetTotals,
  getDailyTotals,
  getExpense,
  getIncomeExpenseTotals,
  getTotalInRange,
  listExpensesInRange,
  updateExpense,
} from '@/db/repositories/expenses';
import type { ExpenseWithCategory, TransactionType } from '@/db/schema';
import { toLocalISOString } from '@/utils/date';

export function useExpensesInRange(start: Date, end: Date, type?: TransactionType) {
  const db = useSQLiteContext();
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const startISO = useMemo(() => toLocalISOString(startOfDay(start)), [start]);
  const endISO = useMemo(() => toLocalISOString(endOfDay(end)), [end]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const rows = await listExpensesInRange(db, startISO, endISO, type);
    setExpenses(rows);
    setLoading(false);
  }, [db, startISO, endISO, type]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { expenses, loading, refresh };
}

/** A single transaction by id, for the Add/Edit screen's edit mode. */
export function useExpense(id: string | undefined) {
  const db = useSQLiteContext();
  const [expense, setExpense] = useState<ExpenseWithCategory | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) {
      setExpense(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getExpense(db, id).then((result) => {
      if (!cancelled) {
        setExpense(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [db, id]);

  return { expense, loading };
}

/** Total/daily/category stats for a single transaction type — used by Analytics' Expense and Income sections. */
export function useMonthlyStats(monthStart: Date, monthEnd: Date, type: TransactionType) {
  const db = useSQLiteContext();
  const [total, setTotal] = useState(0);
  const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [loading, setLoading] = useState(true);

  const startISO = useMemo(() => toLocalISOString(startOfDay(monthStart)), [monthStart]);
  const endISO = useMemo(() => toLocalISOString(endOfDay(monthEnd)), [monthEnd]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [totalResult, dailyResult, categoryResult] = await Promise.all([
      getTotalInRange(db, startISO, endISO, type),
      getDailyTotals(db, startISO, endISO, type),
      getCategoryTotals(db, startISO, endISO, type),
    ]);
    setTotal(totalResult);
    setDailyTotals(dailyResult);
    setCategoryTotals(categoryResult);
    setLoading(false);
  }, [db, startISO, endISO, type]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { total, dailyTotals, categoryTotals, loading, refresh };
}

/** Income vs expense totals + net daily trend for a range — dashboard/balance use. */
export function useIncomeExpenseStats(monthStart: Date, monthEnd: Date) {
  const db = useSQLiteContext();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [dailyNetTotals, setDailyNetTotals] = useState<DailyTotal[]>([]);
  const [loading, setLoading] = useState(true);

  const startISO = useMemo(() => toLocalISOString(startOfDay(monthStart)), [monthStart]);
  const endISO = useMemo(() => toLocalISOString(endOfDay(monthEnd)), [monthEnd]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [totals, dailyNet] = await Promise.all([
      getIncomeExpenseTotals(db, startISO, endISO),
      getDailyNetTotals(db, startISO, endISO),
    ]);
    setIncome(totals.income);
    setExpense(totals.expense);
    setDailyNetTotals(dailyNet);
    setLoading(false);
  }, [db, startISO, endISO]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { income, expense, balance: income - expense, dailyNetTotals, loading };
}

export function useExpenseMutations() {
  const db = useSQLiteContext();

  const add = useCallback((input: ExpenseInput) => createExpense(db, input), [db]);
  const edit = useCallback((id: string, input: ExpenseInput) => updateExpense(db, id, input), [db]);
  const remove = useCallback((id: string) => deleteExpense(db, id), [db]);

  return { add, edit, remove };
}
