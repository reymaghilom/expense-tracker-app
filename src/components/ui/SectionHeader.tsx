import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatPeso } from '@/utils/currency';

interface SectionHeaderProps {
  label: string;
  total?: number;
}

/** A label + optional peso subtotal, used above grouped list sections. */
export function SectionHeader({ label, total }: SectionHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.header}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      {total !== undefined ? (
        <Text style={[styles.total, { color: colors.text }]}>{formatPeso(total)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  total: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
