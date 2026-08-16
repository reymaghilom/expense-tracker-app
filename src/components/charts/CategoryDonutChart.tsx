import { PieChart } from 'react-native-gifted-charts';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { FontSize, Spacing } from '@/constants/theme';
import type { CategoryTotal } from '@/db/repositories/expenses';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';
import { formatPeso } from '@/utils/currency';

interface CategoryDonutChartProps {
  categoryTotals: CategoryTotal[];
}

export function CategoryDonutChart({ categoryTotals }: CategoryDonutChartProps) {
  const colors = useThemeColors();
  const t = useTranslation();

  if (categoryTotals.length === 0) {
    return (
      <EmptyState icon="pie-chart-outline" title={t.charts.noSpendingTitle} message={t.charts.noCategoryBreakdownMessage} />
    );
  }

  const total = categoryTotals.reduce((sum, entry) => sum + entry.total, 0);
  const pieData = categoryTotals.map((entry) => ({
    value: entry.total,
    color: entry.categoryColor,
  }));

  return (
    <View style={styles.container}>
      <PieChart data={pieData} donut radius={80} innerRadius={52} innerCircleColor={colors.surface} />
      <View style={styles.legend}>
        {categoryTotals.map((entry) => {
          const percent = total > 0 ? (entry.total / total) * 100 : 0;
          return (
            <View key={entry.categoryId} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: entry.categoryColor }]} />
              <View style={styles.legendText}>
                <Text style={[styles.legendName, { color: colors.text }]} numberOfLines={1}>
                  {entry.categoryName}
                </Text>
                <Text style={[styles.legendAmount, { color: colors.textSecondary }]} numberOfLines={1}>
                  {formatPeso(entry.total)}
                </Text>
              </View>
              <Text style={[styles.legendPercent, { color: colors.textMuted }]}>
                {percent.toFixed(1)}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  legend: {
    flex: 1,
    gap: Spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    flex: 1,
  },
  legendName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  legendAmount: {
    fontSize: FontSize.xs,
  },
  legendPercent: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
