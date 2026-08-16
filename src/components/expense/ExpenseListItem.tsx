import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { FontSize, Spacing } from '@/constants/theme';
import type { ExpenseWithCategory } from '@/db/schema';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatPeso } from '@/utils/currency';
import { formatTime, parseLocalISOString } from '@/utils/date';

interface ExpenseListItemProps {
  expense: ExpenseWithCategory;
  onPress?: () => void;
}

export function ExpenseListItem({ expense, onPress }: ExpenseListItemProps) {
  const colors = useThemeColors();
  const isIncome = expense.type === 'income';
  const sign = isIncome ? '+' : '-';
  const amountColor = isIncome ? colors.income : colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? { opacity: 0.6 } : null]}>
      <CategoryIcon icon={expense.category.icon} color={expense.category.color} />
      <View style={styles.details}>
        <Text style={[styles.category, { color: colors.text }]} numberOfLines={1}>
          {expense.category.name}
        </Text>
        <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={1}>
          {expense.note || expense.category.name}
        </Text>
      </View>
      <View style={styles.amountColumn}>
        <Text style={[styles.amount, { color: amountColor }]} numberOfLines={1}>
          {sign}
          {formatPeso(expense.amount)}
        </Text>
        <Text style={[styles.time, { color: colors.textMuted }]}>
          {formatTime(parseLocalISOString(expense.date))}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  category: {
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  note: {
    fontSize: FontSize.sm,
  },
  amountColumn: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  time: {
    fontSize: FontSize.xs,
  },
});
