import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontSize, Spacing } from '@/constants/theme';
import { buildBackupPayload, isValidBackupPayload, restoreFromBackup } from '@/db/repositories/backup';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';
import { writeAndShareFile } from '@/utils/share-file';

function backupFilename(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `income-expense-backup-${stamp}.json`;
}

export default function BackupRestoreScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const { formatFullDate } = useDateFormatter();
  const db = useSQLiteContext();
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const payload = await buildBackupPayload(db);
      await writeAndShareFile(
        backupFilename(),
        JSON.stringify(payload, null, 2),
        'application/json',
        t.backup.title
      );
      Alert.alert(t.backup.createSuccessTitle, t.backup.createSuccessMessage);
    } catch {
      Alert.alert(t.backup.createErrorTitle, t.backup.createErrorMessage);
    } finally {
      setCreating(false);
    }
  };

  const handleRestoreBackup = async () => {
    const picked = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/plain', '*/*'],
      copyToCacheDirectory: true,
    });
    if (picked.canceled || picked.assets.length === 0) {
      return;
    }

    setRestoring(true);
    try {
      const raw = await new File(picked.assets[0].uri).text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }

      if (!isValidBackupPayload(parsed)) {
        Alert.alert(t.backup.restoreErrorTitle, t.backup.restoreInvalidMessage);
        return;
      }

      const backup = parsed;
      const confirmed = await new Promise<boolean>((resolve) => {
        Alert.alert(
          t.backup.restoreConfirmTitle,
          t.backup.restoreConfirmMessage(formatFullDate(new Date(backup.exportedAt)), backup.data.transactions.length),
          [
            { text: t.common.cancel, style: 'cancel', onPress: () => resolve(false) },
            { text: t.backup.restoreBackup, style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      });
      if (!confirmed) {
        return;
      }

      await restoreFromBackup(db, backup);
      Alert.alert(t.backup.restoreSuccessTitle, t.backup.restoreSuccessMessage, [
        { text: t.common.ok, onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert(t.backup.restoreErrorTitle, t.backup.restoreInvalidMessage);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t.backup.title} onBack={() => router.back()} centered />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.explainer, { color: colors.textSecondary }]}>{t.backup.explainer}</Text>

        <Card title={t.backup.createBackup}>
          <PrimaryButton
            label={creating ? t.backup.creatingBackup : t.backup.createBackup}
            onPress={handleCreateBackup}
            loading={creating}
          />
        </Card>

        <Card title={t.backup.restoreBackup}>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>{t.backup.restoreExplainer}</Text>
          <View style={styles.spacer} />
          <PrimaryButton
            label={restoring ? t.backup.restoring : t.backup.restoreBackup}
            onPress={handleRestoreBackup}
            loading={restoring}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 0,
    gap: Spacing.lg,
  },
  explainer: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  cardText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  spacer: {
    height: Spacing.xs,
  },
});
