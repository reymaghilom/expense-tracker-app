import { StyleSheet, View } from 'react-native';

import { ExpenseListItem } from '@/components/expense/ExpenseListItem';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { ExpenseDayGroup } from '@/utils/group-expenses';

interface ExpenseSectionProps {
  group: ExpenseDayGroup;
  onPressExpense?: (id: string) => void;
}

export function ExpenseSection({ group, onPressExpense }: ExpenseSectionProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.section}>
      <SectionHeader label={group.label} total={group.total} />
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {group.expenses.map((expense, index) => (
          <View key={expense.id}>
            <ExpenseListItem expense={expense} onPress={() => onPressExpense?.(expense.id)} />
            {index < group.expenses.length - 1 ? (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
