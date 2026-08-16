import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import { Colors, FontSize, GradientAccents, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/use-translation';
import { formatPeso } from '@/utils/currency';

interface TotalExpensesCardProps {
  balance: number;
  income: number;
  expense: number;
  sparkline: number[];
  subtitle?: string;
}

export function TotalExpensesCard({ balance, income, expense, sparkline, subtitle }: TotalExpensesCardProps) {
  const t = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - Spacing.lg * 2;
  const sparklineHeight = 44;

  const points = buildSparklinePoints(sparkline, cardWidth - Spacing.xl * 2, sparklineHeight);

  return (
    <LinearGradient
      colors={[Colors.light.primary, Colors.light.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, Shadow.card]}>
      <Text style={styles.label}>{t.common.balance.toUpperCase()}</Text>
      <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
        {formatPeso(balance)}
      </Text>
      <Text style={styles.subtitle}>{subtitle ?? t.common.thisMonth}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <Ionicons name="arrow-up-circle" size={14} color={GradientAccents.income} />
            <Text style={styles.statLabel}>{t.common.income}</Text>
          </View>
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {formatPeso(income)}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <Ionicons name="arrow-down-circle" size={14} color={GradientAccents.expense} />
            <Text style={styles.statLabel}>{t.common.expense}</Text>
          </View>
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {formatPeso(expense)}
          </Text>
        </View>
      </View>

      {points ? (
        <View style={styles.sparklineContainer}>
          <Svg width={cardWidth - Spacing.xl * 2} height={sparklineHeight}>
            <Polyline
              points={points}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85}
            />
          </Svg>
        </View>
      ) : null}
    </LinearGradient>
  );
}

function buildSparklinePoints(values: number[], width: number, height: number): string | null {
  if (values.length < 2) return null;

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = width / (values.length - 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    overflow: 'hidden',
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.lg,
  },
  statItem: {
    flex: 1,
    gap: 2,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  sparklineContainer: {
    marginTop: Spacing.lg,
  },
});
