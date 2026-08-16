import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

import { FilterChip } from '@/components/ui/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { OptionPickerModal, type PickerOption } from '@/components/ui/OptionPickerModal';
import { ExpenseSection } from '@/components/expense/ExpenseSection';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import type { ExpenseWithCategory, TransactionType } from '@/db/schema';
import { useExpensesInRange } from '@/hooks/use-expenses';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';
import { groupExpensesByDay, type ExpenseDayGroup } from '@/utils/group-expenses';

type DatePeriod = 'all' | 'today' | 'week' | 'month' | 'custom';
type TypeFilterKey = 'all' | TransactionType;
type SortKey = 'newest' | 'oldest' | 'highest' | 'lowest';
type PickerStage = 'none' | 'start' | 'end';

const EARLIEST_DATE = new Date(2000, 0, 1);
const LATEST_DATE = new Date(2100, 0, 1);

function sortExpenses(expenses: ExpenseWithCategory[], sortKey: SortKey): ExpenseWithCategory[] {
  switch (sortKey) {
    case 'oldest':
      // The base list is already date-desc from SQL; reversing gives a stable date-asc order.
      return [...expenses].reverse();
    case 'highest':
      return [...expenses].sort((a, b) => b.amount - a.amount);
    case 'lowest':
      return [...expenses].sort((a, b) => a.amount - b.amount);
    default:
      return expenses;
  }
}

export default function ExpensesScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const { formatFullDate, formatDayLabel } = useDateFormatter();
  const SORT_OPTIONS: PickerOption[] = [
    { key: 'newest', label: t.transactions.sortNewest, icon: 'arrow-down-outline' },
    { key: 'oldest', label: t.transactions.sortOldest, icon: 'arrow-up-outline' },
    { key: 'highest', label: t.transactions.sortHighest, icon: 'trending-up-outline' },
    { key: 'lowest', label: t.transactions.sortLowest, icon: 'trending-down-outline' },
  ];
  const [datePeriod, setDatePeriod] = useState<DatePeriod>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilterKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('newest');
  const [sortPickerOpen, setSortPickerOpen] = useState(false);
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);
  const [pickerStage, setPickerStage] = useState<PickerStage>('none');
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { start, end } = useMemo(() => {
    const now = new Date();
    switch (datePeriod) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'custom':
        return customStart && customEnd
          ? { start: startOfDay(customStart), end: endOfDay(customEnd) }
          : { start: EARLIEST_DATE, end: LATEST_DATE };
      default:
        return { start: EARLIEST_DATE, end: LATEST_DATE };
    }
  }, [datePeriod, customStart, customEnd]);

  const { expenses } = useExpensesInRange(start, end, typeFilter === 'all' ? undefined : typeFilter);

  const filteredExpenses = useMemo(() => {
    if (!search.trim()) return expenses;
    const query = search.trim().toLowerCase();
    return expenses.filter(
      (expense) =>
        expense.category.name.toLowerCase().includes(query) ||
        (expense.note ?? '').toLowerCase().includes(query)
    );
  }, [expenses, search]);

  const sortedExpenses = useMemo(
    () => sortExpenses(filteredExpenses, sortKey),
    [filteredExpenses, sortKey]
  );

  const isRanked = sortKey === 'highest' || sortKey === 'lowest';

  const displayGroups = useMemo<ExpenseDayGroup[]>(() => {
    if (!isRanked) return groupExpensesByDay(sortedExpenses, formatDayLabel);
    if (sortedExpenses.length === 0) return [];
    const total = sortedExpenses.reduce((sum, e) => sum + e.amount, 0);
    return [
      {
        key: 'ranked',
        label: t.transactions.rankedResultsLabel,
        total,
        expenses: sortedExpenses,
      },
    ];
  }, [sortedExpenses, isRanked, t, formatDayLabel]);

  const isFilterActive =
    search.trim() !== '' || typeFilter !== 'all' || datePeriod !== 'all' || sortKey !== 'newest';

  const handleClearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setDatePeriod('all');
    setSortKey('newest');
    setCustomStart(null);
    setCustomEnd(null);
  };

  const handleStartCustomRange = () => {
    setPendingStart(null);
    setPickerStage('start');
  };

  const resultsLabel = t.transactions.resultsCount(sortedExpenses.length, isFilterActive);

  const emptyState = useMemo(() => {
    if (search.trim() !== '') {
      return {
        title: t.transactions.emptySearchTitle,
        message: t.transactions.emptySearchMessage(search.trim()),
      };
    }
    if (typeFilter === 'income') {
      return { title: t.transactions.emptyIncomeTitle, message: t.transactions.emptyIncomeMessage };
    }
    if (typeFilter === 'expense') {
      return { title: t.transactions.emptyExpenseTitle, message: t.transactions.emptyExpenseMessage };
    }
    if (datePeriod !== 'all') {
      return { title: t.transactions.emptyRangeTitle, message: t.transactions.emptyRangeMessage };
    }
    return { title: t.transactions.emptyAllTitle, message: t.transactions.emptyAllMessage };
  }, [search, typeFilter, datePeriod, t]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? t.transactions.sortNewest;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t.transactions.title}</Text>
        <Pressable onPress={() => setSearchOpen((v) => !v)} hitSlop={8}>
          <Ionicons name={searchOpen ? 'close' : 'search'} size={22} color={colors.text} />
        </Pressable>
      </View>

      {searchOpen ? (
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t.transactions.searchPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.text }]}
            autoFocus
          />
          {search.length > 0 ? (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <View style={[styles.filterRow, styles.typeFilterRow]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <FilterChip label={t.transactions.all} active={typeFilter === 'all'} onPress={() => setTypeFilter('all')} />
          <FilterChip
            label={t.transactions.income}
            active={typeFilter === 'income'}
            activeColor={colors.income}
            onPress={() => setTypeFilter('income')}
          />
          <FilterChip
            label={t.transactions.expense}
            active={typeFilter === 'expense'}
            activeColor={colors.expense}
            onPress={() => setTypeFilter('expense')}
          />
        </ScrollView>
      </View>

      <View style={[styles.filterRow, styles.typeFilterRow]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <FilterChip label={t.transactions.allTime} active={datePeriod === 'all'} onPress={() => setDatePeriod('all')} />
          <FilterChip label={t.transactions.today} active={datePeriod === 'today'} onPress={() => setDatePeriod('today')} />
          <FilterChip label={t.transactions.thisWeek} active={datePeriod === 'week'} onPress={() => setDatePeriod('week')} />
          <FilterChip label={t.transactions.thisMonth} active={datePeriod === 'month'} onPress={() => setDatePeriod('month')} />
          <FilterChip label={t.transactions.custom} active={datePeriod === 'custom'} onPress={handleStartCustomRange} />
        </ScrollView>
      </View>

      {datePeriod === 'custom' && customStart && customEnd ? (
        <Text style={[styles.customDateLabel, { color: colors.textSecondary }]}>
          {t.transactions.showingRange(formatFullDate(customStart), formatFullDate(customEnd))}
        </Text>
      ) : null}

      <View style={styles.metaRow}>
        <Text style={[styles.resultsLabel, { color: colors.textMuted }]}>{resultsLabel}</Text>
        <View style={styles.metaActions}>
          {isFilterActive ? (
            <Pressable onPress={handleClearFilters} hitSlop={8}>
              <Text style={[styles.clearFiltersLabel, { color: colors.primary }]}>{t.transactions.clearFilters}</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => setSortPickerOpen(true)}
            style={[styles.sortButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="swap-vertical" size={14} color={colors.textSecondary} />
            <Text style={[styles.sortButtonLabel, { color: colors.text }]}>{currentSortLabel}</Text>
          </Pressable>
        </View>
      </View>

      {pickerStage === 'start' ? (
        <DateTimePicker
          value={customStart ?? new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(_, date) => {
            setPickerStage('none');
            if (!date) return;
            setPendingStart(date);
            setPickerStage('end');
          }}
        />
      ) : null}

      {pickerStage === 'end' ? (
        <DateTimePicker
          value={customEnd ?? pendingStart ?? new Date()}
          mode="date"
          display="default"
          minimumDate={pendingStart ?? undefined}
          onChange={(_, date) => {
            setPickerStage('none');
            if (!date || !pendingStart) return;
            if (date < pendingStart) {
              Alert.alert(t.transactions.invalidRangeTitle, t.transactions.invalidRangeMessage);
              return;
            }
            setCustomStart(pendingStart);
            setCustomEnd(date);
            setDatePeriod('custom');
          }}
        />
      ) : null}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {displayGroups.length === 0 ? (
          <EmptyState icon="receipt-outline" title={emptyState.title} message={emptyState.message} />
        ) : (
          displayGroups.map((group) => (
            <ExpenseSection
              key={group.key}
              group={group}
              onPressExpense={(id) => router.push({ pathname: '/add-expense', params: { id } })}
            />
          ))
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => router.push('/add-expense')} />

      <OptionPickerModal
        visible={sortPickerOpen}
        title={t.transactions.sortBy}
        options={SORT_OPTIONS}
        selectedKey={sortKey}
        onSelect={(key) => {
          setSortKey(key as SortKey);
          setSortPickerOpen(false);
        }}
        onClose={() => setSortPickerOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.base,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  typeFilterRow: {
    marginBottom: Spacing.md,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  customDateLabel: {
    fontSize: FontSize.xs,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  resultsLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    flexShrink: 1,
  },
  metaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  clearFiltersLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sortButtonLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: 120,
    gap: Spacing.lg,
  },
});
