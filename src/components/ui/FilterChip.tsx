import { Pressable, StyleSheet, Text } from 'react-native';

import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  /** Defaults to the brand primary color; pass to give a chip its own active color (e.g. income green). */
  activeColor?: string;
  activeTextColor?: string;
}

export function FilterChip({ label, active, onPress, activeColor, activeTextColor }: FilterChipProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? (activeColor ?? colors.primary) : colors.surface,
          borderColor: colors.border,
        },
      ]}>
      <Text
        style={[
          styles.label,
          { color: active ? (activeTextColor ?? colors.onPrimary) : colors.textSecondary },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
