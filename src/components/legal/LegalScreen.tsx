import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontSize, Spacing } from '@/constants/theme';
import type { LegalSection } from '@/i18n/legal-content';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface LegalScreenProps {
  title: string;
  sections: LegalSection[];
}

export function LegalScreen({ title, sections }: LegalScreenProps) {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={title} onBack={() => router.back()} centered />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={[styles.heading, { color: colors.text }]}>{section.heading}</Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>{section.body}</Text>
          </View>
        ))}
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
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.xs,
  },
  heading: {
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  body: {
    fontSize: FontSize.sm,
    lineHeight: 21,
  },
});
