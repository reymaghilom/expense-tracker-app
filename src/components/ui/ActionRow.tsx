import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface ActionRowProps {
  label: string;
  onPress?: () => void;
  labelColor?: string;
  showChevron?: boolean;
}

export function ActionRow({ label, onPress, labelColor, showChevron = true }: ActionRowProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? { opacity: 0.6 } : null]}>
      <Text style={[styles.label, { color: labelColor ?? colors.text }]}>{label}</Text>
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
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: '500',
  },
});
