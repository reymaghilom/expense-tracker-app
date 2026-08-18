import { StyleSheet, View } from 'react-native';

import { FilterChip } from '@/components/ui/FilterChip';
import { Spacing } from '@/constants/theme';
import type { TransactionType } from '@/db/schema';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';

interface TransactionTypeToggleProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
  disabled?: boolean;
}

/** Segmented Expense/Income switch, used on the Add Transaction and category forms. */
export function TransactionTypeToggle({ value, onChange, disabled }: TransactionTypeToggleProps) {
  const colors = useThemeColors();
  const t = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.item}>
        <FilterChip
          label={t.common.income}
          active={value === 'income'}
          activeColor={colors.income}
          onPress={() => !disabled && onChange('income')}
        />
      </View>
      <View style={styles.item}>
        <FilterChip
          label={t.common.expense}
          active={value === 'expense'}
          activeColor={colors.expense}
          onPress={() => !disabled && onChange('expense')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'stretch',
  },
});
