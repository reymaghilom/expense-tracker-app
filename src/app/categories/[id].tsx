import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransactionTypeToggle } from '@/components/expense/TransactionTypeToggle';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { CATEGORY_COLOR_CHOICES, CATEGORY_ICON_CHOICES } from '@/constants/categories';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import type { TransactionType } from '@/db/schema';
import { useCategories } from '@/hooks/use-categories';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';

export default function EditCategoryScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const { id, type: typeParam } = useLocalSearchParams<{ id: string; type?: TransactionType }>();
  const isNew = id === 'new';
  const { categories, add, edit, remove, checkInUse } = useCategories();

  const existing = categories.find((c) => c.id === id);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState(CATEGORY_ICON_CHOICES[0]);
  const [color, setColor] = useState(CATEGORY_COLOR_CHOICES[0]);
  const [type, setType] = useState<TransactionType>(typeParam ?? 'expense');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setIcon(existing.icon);
      setColor(existing.color);
      setType(existing.type);
    }
  }, [existing]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t.categoryEdit.nameRequiredTitle, t.categoryEdit.nameRequiredMessage);
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await add({ name: name.trim(), icon, color, type });
      } else if (existing) {
        await edit(existing.id, { name: name.trim(), icon, color });
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert(t.categoryEdit.deleteTitle, t.categoryEdit.deleteMessage(existing.name), [
      { text: t.common.cancel, style: 'cancel' },
      {
        text: t.common.delete,
        style: 'destructive',
        onPress: async () => {
          const inUse = await checkInUse(existing.id);
          if (inUse) {
            Alert.alert(t.categoryEdit.inUseTitle, t.categoryEdit.inUseMessage);
            return;
          }
          await remove(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={isNew ? t.categoryEdit.newCategory : t.categoryEdit.editCategory}
        onBack={() => router.back()}
        centered
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.previewRow}>
          <View style={[styles.preview, { backgroundColor: color }]}>
            <Ionicons name={icon as any} size={28} color="#FFFFFF" />
          </View>
        </View>

        <TransactionTypeToggle value={type} onChange={setType} disabled={!isNew} />
        {!isNew ? (
          <Text style={[styles.typeHint, { color: colors.textMuted }]}>{t.categoryEdit.typeLockedHint}</Text>
        ) : null}

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t.categoryEdit.namePlaceholder}
          placeholderTextColor={colors.textMuted}
          style={[styles.nameInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
        />

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t.categoryEdit.icon}</Text>
        <View style={styles.grid}>
          {CATEGORY_ICON_CHOICES.map((choice) => (
            <Pressable
              key={choice}
              onPress={() => setIcon(choice)}
              style={[
                styles.iconOption,
                { borderColor: icon === choice ? colors.primary : colors.border, backgroundColor: colors.surface },
              ]}>
              <Ionicons name={choice as any} size={20} color={icon === choice ? colors.primary : colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t.categoryEdit.color}</Text>
        <View style={styles.grid}>
          {CATEGORY_COLOR_CHOICES.map((choice) => (
            <Pressable
              key={choice}
              onPress={() => setColor(choice)}
              style={[
                styles.colorOption,
                { backgroundColor: choice },
                color === choice ? { borderColor: colors.text, borderWidth: 2 } : null,
              ]}
            />
          ))}
        </View>

        {!isNew ? (
          <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <Text style={[styles.deleteLabel, { color: colors.danger }]}>{t.categoryEdit.deleteCategory}</Text>
          </Pressable>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label={t.categoryEdit.saveCategory} onPress={handleSave} loading={saving} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  previewRow: {
    alignItems: 'center',
  },
  preview: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeHint: {
    fontSize: FontSize.xs,
    marginTop: -Spacing.sm,
  },
  nameInput: {
    height: 48,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.base,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  deleteLabel: {
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  footer: {
    padding: Spacing.lg,
  },
});
