import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface FormRowProps {
  label: string;
  value: string;
  icon?: string;
  iconColor?: string;
  placeholder?: boolean;
  valueColor?: string;
  onPress?: () => void;
  rightAdornment?: ReactNode;
  showChevron?: boolean;
}

export function FormRow({
  label,
  value,
  icon,
  iconColor,
  placeholder,
  valueColor,
  onPress,
  rightAdornment,
  showChevron = true,
}: FormRowProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? { opacity: 0.6 } : null]}>
      <View style={styles.textColumn}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        <View style={styles.valueRow}>
          {icon ? <Ionicons name={icon as any} size={18} color={iconColor ?? colors.text} /> : null}
          <Text
            style={[
              styles.value,
              { color: placeholder ? colors.textMuted : (valueColor ?? colors.text) },
            ]}
            numberOfLines={1}>
            {value}
          </Text>
        </View>
      </View>
      {rightAdornment}
      {showChevron && onPress ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  textColumn: {
    flex: 1,
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  value: {
    fontSize: FontSize.base,
    fontWeight: '500',
  },
});
