import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatMonthYear } from '@/utils/date';

interface MonthSelectorProps {
  month: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export function MonthSelector({ month, onPrevious, onNext }: MonthSelectorProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable onPress={onPrevious} hitSlop={8}>
        <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
      </Pressable>
      <Text style={[styles.label, { color: colors.text }]}>{formatMonthYear(month)}</Text>
      <Pressable onPress={onNext} hitSlop={8}>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.lg,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: '600',
  },
});
