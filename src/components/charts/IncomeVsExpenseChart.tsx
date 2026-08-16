import { BarChart } from 'react-native-gifted-charts';
import { View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { FontSize } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';

interface IncomeVsExpenseChartProps {
  income: number;
  expense: number;
}

export function IncomeVsExpenseChart({ income, expense }: IncomeVsExpenseChartProps) {
  const colors = useThemeColors();
  const t = useTranslation();

  if (income === 0 && expense === 0) {
    return (
      <EmptyState
        icon="swap-vertical-outline"
        title={t.charts.noActivityTitle}
        message={t.charts.noActivityMessage}
      />
    );
  }

  const data = [
    { value: income, label: t.common.income, frontColor: colors.income },
    { value: expense, label: t.common.expense, frontColor: colors.expense },
  ];

  return (
    <View>
      <BarChart
        data={data}
        barWidth={48}
        barBorderRadius={6}
        spacing={40}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: FontSize.xs, fontWeight: '600' }}
        yAxisTextStyle={{ color: colors.textMuted, fontSize: FontSize.xs }}
        noOfSections={4}
        height={160}
        initialSpacing={24}
        yAxisLabelPrefix="₱"
      />
    </View>
  );
}
