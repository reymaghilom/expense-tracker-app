import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { Radius, Shadow } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
}

export function FloatingActionButton({ onPress, icon = 'add' }: FloatingActionButtonProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        Shadow.card,
        { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
      ]}>
      <Ionicons name={icon as any} size={28} color={colors.onPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
