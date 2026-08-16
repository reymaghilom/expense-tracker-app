import { Modal, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import type { Category } from '@/db/schema';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';

interface CategoryPickerModalProps {
  visible: boolean;
  categories: Category[];
  selectedId: string | null;
  onSelect: (category: Category) => void;
  onClose: () => void;
}

export function CategoryPickerModal({
  visible,
  categories,
  selectedId,
  onSelect,
  onClose,
}: CategoryPickerModalProps) {
  const colors = useThemeColors();
  const t = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SafeAreaView style={[styles.sheet, { backgroundColor: colors.surface }]} edges={['bottom']}>
        <Text style={[styles.title, { color: colors.text }]}>{t.addTransaction.selectCategoryModalTitle}</Text>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => onSelect(category)}
              style={[
                styles.row,
                selectedId === category.id ? { backgroundColor: colors.background } : null,
              ]}>
              <CategoryIcon icon={category.icon} color={category.color} size={36} />
              <Text style={[styles.label, { color: colors.text }]}>{category.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
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
    maxHeight: '70%',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  scrollArea: {
    flexShrink: 1,
  },
  list: {
    gap: Spacing.xs,
    paddingBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.sm,
    borderRadius: Radius.md,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: '500',
  },
});
