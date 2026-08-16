import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { DailyBarChart } from '@/components/charts/DailyBarChart';
import { IncomeVsExpenseChart } from '@/components/charts/IncomeVsExpenseChart';
import { Card } from '@/components/ui/Card';
import { MonthSelector } from '@/components/home/MonthSelector';
import { FontSize, Spacing } from '@/constants/theme';
import { useIncomeExpenseStats, useMonthlyStats } from '@/hooks/use-expenses';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';
import { useMonthStore } from '@/store/month-store';
import { formatPeso } from '@/utils/currency';
import { getMonthBounds } from '@/utils/date';

export default function AnalyticsScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const { selectedMonth, goToPreviousMonth, goToNextMonth } = useMonthStore();
  const { start, end } = useMemo(() => getMonthBounds(selectedMonth), [selectedMonth]);

  const { income, expense, balance } = useIncomeExpenseStats(start, end);
  const expenseStats = useMonthlyStats(start, end, 'expense');
  const incomeStats = useMonthlyStats(start, end, 'income');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t.analytics.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MonthSelector month={selectedMonth} onPrevious={goToPreviousMonth} onNext={goToNextMonth} />

        <Card>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryLabelRow}>
                <Ionicons name="arrow-up-circle" size={14} color={colors.income} />
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>{t.analytics.income}</Text>
              </View>
              <Text
                style={[styles.summaryAmount, { color: colors.income }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}>
                {formatPeso(income)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={styles.summaryLabelRow}>
                <Ionicons name="arrow-down-circle" size={14} color={colors.expense} />
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>{t.analytics.expenses}</Text>
              </View>
              <Text
                style={[styles.summaryAmount, { color: colors.expense }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}>
                {formatPeso(expense)}
              </Text>
            </View>
          </View>
          <View style={[styles.balanceRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>{t.analytics.balance}</Text>
            <Text
              style={[styles.totalAmount, { color: colors.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}>
              {formatPeso(balance)}
            </Text>
          </View>
        </Card>

        <Card title={t.analytics.incomeVsExpense}>
          <IncomeVsExpenseChart income={income} expense={expense} />
        </Card>

        <Card title={t.analytics.dailySpending}>
          <DailyBarChart dailyTotals={expenseStats.dailyTotals} />
        </Card>

        <Card title={t.analytics.expensesByCategory}>
          <CategoryDonutChart categoryTotals={expenseStats.categoryTotals} />
        </Card>

        <Card title={t.analytics.incomeByCategory}>
          <CategoryDonutChart categoryTotals={incomeStats.categoryTotals} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  summaryItem: {
    flex: 1,
    gap: 2,
  },
  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalAmount: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
});
