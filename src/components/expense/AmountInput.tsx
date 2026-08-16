import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface AmountInputProps {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  /** Defaults to the brand primary color; pass to tint the amount by transaction type. */
  accentColor?: string;
}

/** Big centered peso amount entry, sanitizing input to digits + a single decimal point. */
export function AmountInput({ value, onChangeText, label = 'Amount', accentColor }: AmountInputProps) {
  const colors = useThemeColors();
  const tint = accentColor ?? colors.primary;

  const handleChange = (text: string) => {
    const sanitized = text.replace(/[^0-9.]/g, '');
    const firstDot = sanitized.indexOf('.');
    const normalized =
      firstDot === -1
        ? sanitized
        : sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '');
    onChangeText(normalized);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.row}>
        <Text style={[styles.symbol, { color: tint }]}>₱</Text>
        <TextInput
          value={value}
          onChangeText={handleChange}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          style={[styles.input, { color: tint }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  symbol: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    marginRight: Spacing.xs,
  },
  input: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    minWidth: 100,
  },
});
