import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionRow } from '@/components/ui/ActionRow';
import { FormRow } from '@/components/ui/FormRow';
import { OptionPickerModal, type PickerOption } from '@/components/ui/OptionPickerModal';
import { FontSize, Radius, Shadow, Spacing } from '@/constants/theme';
import { useAppSettings, type ThemeMode } from '@/contexts/app-settings';
import { listAllExpensesWithCategory } from '@/db/repositories/expenses';
import { clearAllData } from '@/db/repositories/settings';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { LANGUAGE_LABELS, type Language } from '@/i18n/translations';
import { buildTransactionsCsv } from '@/utils/csv';
import { DATE_FORMAT_KEYS, formatDateForDisplay, type DateFormatKey } from '@/utils/date';
import { writeAndShareFile } from '@/utils/share-file';

export default function SettingsScreen() {
  const colors = useThemeColors();
  const db = useSQLiteContext();
  const { themeMode, setThemeMode, language, setLanguage, dateFormat, setDateFormat, t } = useAppSettings();
  const { formatFullDate } = useDateFormatter();
  const [clearing, setClearing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [appearancePickerOpen, setAppearancePickerOpen] = useState(false);
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [dateFormatPickerOpen, setDateFormatPickerOpen] = useState(false);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const appearanceOptions: PickerOption[] = [
    { key: 'system', label: t.settings.appearanceSystem, icon: 'phone-portrait-outline' },
    { key: 'light', label: t.settings.appearanceLight, icon: 'sunny-outline' },
    { key: 'dark', label: t.settings.appearanceDark, icon: 'moon-outline' },
  ];
  const appearanceValue =
    appearanceOptions.find((o) => o.key === themeMode)?.label ?? t.settings.appearanceSystem;

  const languageOptions: PickerOption[] = [
    { key: 'en', label: LANGUAGE_LABELS.en, icon: 'language-outline' },
    { key: 'ceb', label: LANGUAGE_LABELS.ceb, icon: 'language-outline' },
  ];
  const languageValue = LANGUAGE_LABELS[language];

  const today = new Date();
  const dateFormatOptions: PickerOption[] = DATE_FORMAT_KEYS.map((key) => ({
    key,
    label: `${key}  (${formatDateForDisplay(today, key)})`,
    icon: 'calendar-outline',
  }));
  const dateFormatValue = formatFullDate(today);

  const handleClearAllData = () => {
    Alert.alert(t.settings.clearAllTitle, t.settings.clearAllMessage, [
      { text: t.common.cancel, style: 'cancel' },
      {
        text: t.settings.clearAllConfirm,
        style: 'destructive',
        onPress: async () => {
          setClearing(true);
          await clearAllData(db);
          setClearing(false);
          Alert.alert(t.settings.clearAllDoneTitle, t.settings.clearAllDoneMessage);
        },
      },
    ]);
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const expenses = await listAllExpensesWithCategory(db);
      if (expenses.length === 0) {
        Alert.alert(t.export.emptyTitle, t.export.emptyMessage);
        return;
      }
      const stamp = new Date().toISOString().slice(0, 10);
      await writeAndShareFile(
        `income-expense-export-${stamp}.csv`,
        buildTransactionsCsv(expenses, formatFullDate),
        'text/csv',
        t.settings.exportData
      );
      Alert.alert(t.export.successTitle, t.export.successMessage(expenses.length));
    } catch {
      Alert.alert(t.export.errorTitle, t.export.errorMessage);
    } finally {
      setExporting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t.settings.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionLabel label={t.settings.sectionPreferences} />
        <View style={[styles.card, Shadow.card, { backgroundColor: colors.surface }]}>
          <FormRow label={t.settings.appearance} value={appearanceValue} onPress={() => setAppearancePickerOpen(true)} />
          <Divider />
          <FormRow
            label={t.settings.language}
            value={languageValue}
            icon="language-outline"
            onPress={() => setLanguagePickerOpen(true)}
          />
          <Divider />
          <FormRow
            label={t.settings.dateFormat}
            value={dateFormatValue}
            onPress={() => setDateFormatPickerOpen(true)}
          />
        </View>

        <SectionLabel label={t.settings.sectionData} />
        <View style={[styles.card, Shadow.card, { backgroundColor: colors.surface }]}>
          <FormRow label={t.settings.currency} value={t.settings.currencyValue} showChevron={false} />
          <Divider />
          <FormRow
            label={t.settings.manageCategories}
            value={t.settings.manageCategoriesSubtitle}
            onPress={() => router.push('/categories')}
          />
          <Divider />
          <FormRow
            label={t.settings.backupRestore}
            value={t.settings.backupRestoreSubtitle}
            onPress={() => router.push('/backup-restore')}
          />
          <Divider />
          <FormRow
            label={exporting ? t.settings.exporting : t.settings.exportData}
            value={t.settings.exportDataSubtitle}
            onPress={exporting ? undefined : handleExportData}
          />
        </View>

        <SectionLabel label={t.settings.sectionLegal} />
        <View style={[styles.card, Shadow.card, { backgroundColor: colors.surface }]}>
          <ActionRow label={t.settings.termsOfUse} onPress={() => router.push('/terms')} />
          <Divider />
          <ActionRow label={t.settings.privacyPolicy} onPress={() => router.push('/privacy')} />
          <Divider />
          <ActionRow label={t.settings.about} onPress={() => router.push('/about')} />
          <Divider />
          <FormRow label={t.settings.appVersion} value={appVersion} showChevron={false} />
        </View>

        <SectionLabel label={t.settings.sectionDanger} />
        <View
          style={[styles.card, styles.dangerCard, Shadow.card, { backgroundColor: colors.surface, borderColor: colors.danger }]}>
          <ActionRow
            label={clearing ? t.settings.clearing : t.settings.clearAllData}
            labelColor={colors.danger}
            onPress={handleClearAllData}
            showChevron={false}
          />
        </View>
      </ScrollView>

      <OptionPickerModal
        visible={appearancePickerOpen}
        title={t.settings.appearance}
        options={appearanceOptions}
        selectedKey={themeMode}
        onSelect={(key) => {
          setThemeMode(key as ThemeMode);
          setAppearancePickerOpen(false);
        }}
        onClose={() => setAppearancePickerOpen(false)}
      />

      <OptionPickerModal
        visible={languagePickerOpen}
        title={t.settings.language}
        options={languageOptions}
        selectedKey={language}
        onSelect={(key) => {
          setLanguage(key as Language);
          setLanguagePickerOpen(false);
        }}
        onClose={() => setLanguagePickerOpen(false)}
      />

      <OptionPickerModal
        visible={dateFormatPickerOpen}
        title={t.settings.dateFormat}
        options={dateFormatOptions}
        selectedKey={dateFormat}
        onSelect={(key) => {
          setDateFormat(key as DateFormatKey);
          setDateFormatPickerOpen(false);
        }}
        onClose={() => setDateFormatPickerOpen(false)}
      />
    </SafeAreaView>
  );
}

function SectionLabel({ label }: { label: string }) {
  const colors = useThemeColors();
  return <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{label}</Text>;
}

function Divider() {
  const colors = useThemeColors();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  card: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
  },
  dangerCard: {
    marginTop: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
