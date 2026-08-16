import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export interface PickerOption {
  key: string;
  label: string;
  icon: string;
}

interface OptionPickerModalProps {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onClose: () => void;
}

export function OptionPickerModal({
  visible,
  title,
  options,
  selectedKey,
  onSelect,
  onClose,
}: OptionPickerModalProps) {
  const colors = useThemeColors();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SafeAreaView style={[styles.sheet, { backgroundColor: colors.surface }]} edges={['bottom']}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <View style={styles.list}>
          {options.map((option) => {
            const selected = selectedKey === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => onSelect(option.key)}
                style={[styles.row, selected ? { backgroundColor: colors.background } : null]}>
                <Ionicons name={option.icon as any} size={20} color={selected ? colors.primary : colors.textSecondary} />
                <Text style={[styles.label, { color: colors.text }]}>{option.label}</Text>
                {selected ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  list: {
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: '500',
    flex: 1,
  },
});
