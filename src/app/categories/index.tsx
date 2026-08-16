import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterChip } from '@/components/ui/FilterChip';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontSize, Radius, Shadow, Spacing } from '@/constants/theme';
import type { TransactionType } from '@/db/schema';
import { useCategories } from '@/hooks/use-categories';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';

export default function CategoriesScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const [type, setType] = useState<TransactionType>('expense');
  const { categories } = useCategories(type);
  const typeLabel = type === 'expense' ? t.categories.expense : t.categories.income;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={t.categories.title}
        onBack={() => router.back()}
        right={
          <Pressable
            onPress={() => router.push({ pathname: '/categories/[id]', params: { id: 'new', type } })}
            hitSlop={8}>
            <Ionicons name="add" size={26} color={colors.text} />
          </Pressable>
        }
      />

      <View style={styles.filterRow}>
        <FilterChip
          label={t.categories.expense}
          active={type === 'expense'}
          activeColor={colors.expense}
          onPress={() => setType('expense')}
        />
        <FilterChip
          label={t.categories.income}
          active={type === 'income'}
          activeColor={colors.income}
          onPress={() => setType('income')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {categories.length === 0 ? (
          <EmptyState
            icon="pricetags-outline"
            title={t.categories.emptyTitle(typeLabel.toLowerCase())}
            message={t.categories.emptyMessage}
          />
        ) : (
          <View style={[styles.card, Shadow.card, { backgroundColor: colors.surface }]}>
            {categories.map((category, index) => (
              <View key={category.id}>
                <Pressable
                  style={styles.row}
                  onPress={() =>
                    router.push({ pathname: '/categories/[id]', params: { id: category.id } })
                  }>
                  <CategoryIcon icon={category.icon} color={category.color} />
                  <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
                    {category.name}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </Pressable>
                {index < categories.length - 1 ? (
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  card: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  label: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
