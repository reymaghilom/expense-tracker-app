import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmountInput } from '@/components/expense/AmountInput';
import { CategoryPickerModal } from '@/components/expense/CategoryPickerModal';
import { TransactionTypeToggle } from '@/components/expense/TransactionTypeToggle';
import { OptionPickerModal, type PickerOption } from '@/components/ui/OptionPickerModal';
import { FormRow } from '@/components/ui/FormRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import type { PaymentMethod, TransactionType } from '@/db/schema';
import { useCategories } from '@/hooks/use-categories';
import { useExpense, useExpenseMutations } from '@/hooks/use-expenses';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useTranslation } from '@/hooks/use-translation';
import { formatPeso } from '@/utils/currency';
import { toLocalISOString } from '@/utils/date';
import { generateId } from '@/utils/id';

export default function AddExpenseScreen() {
  const colors = useThemeColors();
  const t = useTranslation();
  const { formatFullDate } = useDateFormatter();
  const PAYMENT_METHOD_OPTIONS: PickerOption[] = [
    { key: 'cash', label: t.addTransaction.paymentCash, icon: 'cash-outline' },
    { key: 'card', label: t.addTransaction.paymentCard, icon: 'card-outline' },
    { key: 'e_wallet', label: t.addTransaction.paymentEWallet, icon: 'wallet-outline' },
    { key: 'bank_transfer', label: t.addTransaction.paymentBankTransfer, icon: 'swap-horizontal-outline' },
  ];
  const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    cash: t.addTransaction.paymentCash,
    card: t.addTransaction.paymentCard,
    e_wallet: t.addTransaction.paymentEWallet,
    bank_transfer: t.addTransaction.paymentBankTransfer,
  };
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const { expense: existing, loading: loadingExisting } = useExpense(id);
  const { add, edit, remove } = useExpenseMutations();

  const [type, setType] = useState<TransactionType>('expense');
  const { categories } = useCategories(type);

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [note, setNote] = useState('');
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [paymentPickerOpen, setPaymentPickerOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Prefill the form once the existing transaction has loaded (edit mode only).
  useEffect(() => {
    if (existing) {
      setType(existing.type);
      setAmount(String(existing.amount));
      setCategoryId(existing.categoryId);
      setDate(new Date(existing.date));
      setPaymentMethod(existing.paymentMethod);
      setNote(existing.note ?? '');
      setReceiptUri(existing.receiptUri);
    }
  }, [existing]);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === categoryId) ?? null,
    [categories, categoryId]
  );

  // If the type changes and the previously selected category no longer matches, clear it.
  useEffect(() => {
    if (categoryId && !categories.some((c) => c.id === categoryId)) {
      setCategoryId(null);
    }
  }, [type, categories, categoryId]);

  const amountValue = parseFloat(amount || '0');

  const handlePickReceipt = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.addTransaction.permissionTitle, t.addTransaction.permissionMessage);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (result.canceled || result.assets.length === 0) return;

    const picked = new File(result.assets[0].uri);
    const destination = new File(Paths.document, `receipt-${generateId()}${picked.extension || '.jpg'}`);
    await picked.copy(destination);
    setReceiptUri(destination.uri);
  };

  const typeLabelLower = (type === 'income' ? t.common.income : t.common.expense).toLowerCase();

  const handleSave = async () => {
    if (!amountValue || amountValue <= 0) {
      Alert.alert(t.addTransaction.enterAmountTitle, t.addTransaction.enterAmountMessage(typeLabelLower));
      return;
    }
    if (!selectedCategory) {
      Alert.alert(t.addTransaction.selectCategoryTitle, t.addTransaction.selectCategoryMessage(typeLabelLower));
      return;
    }

    setSaving(true);
    try {
      const input = {
        type,
        amount: amountValue,
        categoryId: selectedCategory.id,
        date: toLocalISOString(date),
        paymentMethod,
        note: note.trim() ? note.trim() : null,
        receiptUri,
      };
      if (isEditing && id) {
        await edit(id, input);
      } else {
        await add(input);
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert(
      t.addTransaction.deleteTitle,
      t.addTransaction.deleteMessage(typeLabelLower, formatPeso(amountValue)),
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            await remove(id);
            router.back();
          },
        },
      ]
    );
  };

  const title = isEditing
    ? type === 'income'
      ? t.addTransaction.editIncome
      : t.addTransaction.editExpense
    : type === 'income'
      ? t.addTransaction.addIncome
      : t.addTransaction.addExpense;

  if (isEditing && loadingExisting) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t.addTransaction.loading} onBack={() => router.back()} centered />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={title}
        onBack={() => router.back()}
        centered
        right={
          isEditing ? (
            <Pressable onPress={handleDelete} hitSlop={8}>
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </Pressable>
          ) : undefined
        }
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}>
          <TransactionTypeToggle value={type} onChange={setType} />

          <AmountInput
            value={amount}
            onChangeText={setAmount}
            accentColor={type === 'income' ? colors.income : colors.expense}
          />

          <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
            <FormRow
              label={t.addTransaction.category}
              value={selectedCategory?.name ?? t.addTransaction.selectCategory}
              icon={selectedCategory?.icon}
              iconColor={selectedCategory?.color}
              placeholder={!selectedCategory}
              onPress={() => setCategoryPickerOpen(true)}
            />
            <Divider color={colors.border} />
            <FormRow
              label={t.addTransaction.date}
              value={formatFullDate(date)}
              icon="calendar-outline"
              onPress={() => setDatePickerOpen(true)}
            />
            <Divider color={colors.border} />
            <FormRow
              label={type === 'income' ? t.addTransaction.receivedVia : t.addTransaction.paymentMethod}
              value={PAYMENT_METHOD_LABELS[paymentMethod]}
              icon={PAYMENT_METHOD_OPTIONS.find((o) => o.key === paymentMethod)?.icon}
              onPress={() => setPaymentPickerOpen(true)}
            />
            <Divider color={colors.border} />
            <View style={styles.noteRow}>
              <Text style={[styles.noteLabel, { color: colors.textSecondary }]}>{t.addTransaction.noteOptional}</Text>
              <View style={styles.noteInputRow}>
                <Ionicons name="document-text-outline" size={18} color={colors.text} style={styles.noteIcon} />
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder={t.addTransaction.notePlaceholder}
                  placeholderTextColor={colors.textMuted}
                  style={[styles.noteInput, { color: colors.text }]}
                  multiline
                  textAlignVertical="top"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <Divider color={colors.border} />
            <View style={styles.receiptRow}>
              <Text style={[styles.noteLabel, { color: colors.textSecondary }]}>{t.addTransaction.receiptOptional}</Text>
              <Pressable style={styles.receiptContent} onPress={handlePickReceipt}>
                {receiptUri ? (
                  <Image source={{ uri: receiptUri }} style={styles.receiptThumb} />
                ) : (
                  <>
                    <Ionicons name="image-outline" size={18} color={colors.text} />
                    <Text style={[styles.noteInput, { color: colors.text }]}>{t.addTransaction.addReceipt}</Text>
                  </>
                )}
                <View style={[styles.addReceiptButton, { borderColor: colors.border }]}>
                  <Ionicons name="add" size={18} color={colors.textSecondary} />
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label={type === 'income' ? t.addTransaction.saveIncome : t.addTransaction.saveExpense}
            onPress={handleSave}
            loading={saving}
          />
        </View>
      </KeyboardAvoidingView>

      {datePickerOpen ? (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(_, selected) => {
            setDatePickerOpen(false);
            if (selected) setDate(selected);
          }}
        />
      ) : null}

      <CategoryPickerModal
        visible={categoryPickerOpen}
        categories={categories}
        selectedId={categoryId}
        onSelect={(category) => {
          setCategoryId(category.id);
          setCategoryPickerOpen(false);
        }}
        onClose={() => setCategoryPickerOpen(false)}
      />

      <OptionPickerModal
        visible={paymentPickerOpen}
        title={type === 'income' ? t.addTransaction.receivedVia : t.addTransaction.paymentMethod}
        options={PAYMENT_METHOD_OPTIONS}
        selectedKey={paymentMethod}
        onSelect={(key) => {
          setPaymentMethod(key as PaymentMethod);
          setPaymentPickerOpen(false);
        }}
        onClose={() => setPaymentPickerOpen(false)}
      />
    </SafeAreaView>
  );
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl * 2,
    gap: Spacing.lg,
  },
  formCard: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  noteRow: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  noteLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  noteInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  noteIcon: {
    marginTop: 2,
  },
  noteInput: {
    fontSize: FontSize.base,
    flex: 1,
    minHeight: 22,
    maxHeight: 120,
    paddingTop: 0,
  },
  receiptRow: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  receiptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  receiptThumb: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
  },
  addReceiptButton: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: Spacing.lg,
  },
});
