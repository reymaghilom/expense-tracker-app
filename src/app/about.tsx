import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontSize, Radius, Shadow, Spacing } from '@/constants/theme';
import { useAppSettings } from '@/contexts/app-settings';
import { useThemeColors } from '@/hooks/use-theme-colors';

const DEVELOPERS = ['Rey C. Maghilom', 'Cris S. Basco'];

export default function AboutScreen() {
  const colors = useThemeColors();
  const { t } = useAppSettings();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t.legal.aboutTitle} onBack={() => router.back()} centered />

      <View style={styles.content}>
        <View style={[styles.logoBadge, Shadow.card, { backgroundColor: colors.surface }]}>
          <Image
            source={require('@/assets/expense-tracker-icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.appName, { color: colors.text }]}>{t.dashboard.appTitle}</Text>
        <Text style={[styles.version, { color: colors.textMuted }]}>
          {t.legal.version} {version}
        </Text>

        <View style={[styles.card, Shadow.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.developedBy, { color: colors.textSecondary }]}>{t.legal.developedBy}</Text>
          {DEVELOPERS.map((name) => (
            <Text key={name} style={[styles.developerName, { color: colors.text }]}>
              {name}
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.sm,
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  version: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.xl,
  },
  card: {
    width: '100%',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  developedBy: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  developerName: {
    fontSize: FontSize.base,
    fontWeight: '600',
  },
});
