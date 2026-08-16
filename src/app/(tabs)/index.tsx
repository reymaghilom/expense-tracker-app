import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { subDays } from 'date-fns';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { IncomeVsExpenseChart } from '@/components/charts/IncomeVsExpenseChart';
import { ExpenseSection } from '@/components/expense/ExpenseSection';
import { MonthSelector } from '@/components/home/MonthSelector';
import { TotalExpensesCard } from '@/components/home/TotalExpensesCard';
import { FontSize, Spacing } from '@/constants/theme';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { useExpensesInRange, useIncomeExpenseStats } from '@/hooks/use-expenses';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';
import { useMonthStore } from '@/store/month-store';
import { getMonthBounds } from '@/utils/date';
import { groupExpensesByDay } from '@/utils/group-expenses';

const RECENT_DAYS_WINDOW = 14;
const RECENT_GROUPS_TO_SHOW = 2;

export default function HomeScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const { formatDayLabel } = useDateFormatter();
  const { selectedMonth, goToPreviousMonth, goToNextMonth } = useMonthStore();
  const { start: monthStart, end: monthEnd } = useMemo(() => getMonthBounds(selectedMonth), [selectedMonth]);

  const { income, expense, balance, dailyNetTotals } = useIncomeExpenseStats(monthStart, monthEnd);

  const recentStart = useMemo(() => subDays(new Date(), RECENT_DAYS_WINDOW), []);
  const { expenses: recentExpenses } = useExpensesInRange(recentStart, new Date());

  const sparkline = useMemo(() => {
    let running = 0;
    return dailyNetTotals.map((entry) => {
      running += entry.total;
      return running;
    });
  }, [dailyNetTotals]);

  const recentGroups = useMemo(
    () => groupExpensesByDay(recentExpenses, formatDayLabel).slice(0, RECENT_GROUPS_TO_SHOW),
    [recentExpenses, formatDayLabel]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {t.dashboard.appTitle}
        </Text>
        <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <MonthSelector month={selectedMonth} onPrevious={goToPreviousMonth} onNext={goToNextMonth} />

        <TotalExpensesCard balance={balance} income={income} expense={expense} sparkline={sparkline} />

        <Card title={t.dashboard.incomeVsExpense}>
          <IncomeVsExpenseChart income={income} expense={expense} />
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.dashboard.recentTransactions}</Text>
        {recentGroups.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={t.dashboard.emptyTitle}
            message={t.dashboard.emptyMessage}
          />
        ) : (
          recentGroups.map((group) => (
            <ExpenseSection
              key={group.key}
              group={group}
              onPressExpense={(id) => router.push({ pathname: '/add-expense', params: { id } })}
            />
          ))
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => router.push('/add-expense')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
    gap: Spacing.xl,
  },
});
