import { BarChart } from 'react-native-gifted-charts';
import { View } from 'react-native';
import { format } from 'date-fns';

import { FontSize } from '@/constants/theme';
import type { DailyTotal } from '@/db/repositories/expenses';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';
import { parseLocalISOString } from '@/utils/date';
import { EmptyState } from '@/components/ui/EmptyState';

interface DailyBarChartProps {
  dailyTotals: DailyTotal[];
}

export function DailyBarChart({ dailyTotals }: DailyBarChartProps) {
  const colors = useThemeColors();
  const t = useTranslation();

  if (dailyTotals.length === 0) {
    return <EmptyState icon="bar-chart-outline" title={t.charts.noSpendingTitle} message={t.charts.noDailyTrendMessage} />;
  }

  const data = dailyTotals.map((entry) => ({
    value: entry.total,
    label: format(parseLocalISOString(entry.day), 'd'),
    frontColor: colors.primary,
  }));

  return (
    <View>
      <BarChart
        data={data}
        barWidth={data.length > 20 ? 10 : 18}
        barBorderRadius={4}
        spacing={data.length > 20 ? 10 : 18}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: FontSize.xs }}
        yAxisTextStyle={{ color: colors.textMuted, fontSize: FontSize.xs }}
        noOfSections={4}
        height={160}
        initialSpacing={12}
        yAxisLabelPrefix="₱"
      />
    </View>
  );
}
