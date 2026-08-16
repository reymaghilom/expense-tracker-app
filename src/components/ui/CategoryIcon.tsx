import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: number;
}

/** The colored rounded-square glyph used everywhere a category is shown. */
export function CategoryIcon({ icon, color, size = 40 }: CategoryIconProps) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color, width: size, height: size, borderRadius: size * 0.3 },
      ]}>
      <Ionicons name={icon as any} size={size * 0.5} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
});
