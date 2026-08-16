export const PAYMENT_METHODS = ['cash', 'card', 'e_wallet', 'bank_transfer'] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'Card',
  e_wallet: 'E-Wallet',
  bank_transfer: 'Bank Transfer',
};

export const TRANSACTION_TYPES = ['income', 'expense'] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  is_default: number;
  sort_order: number;
  created_at: string;
}

export interface Expense {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  paymentMethod: PaymentMethod;
  note: string | null;
  receiptUri: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseRow {
  id: string;
  type: TransactionType;
  amount: number;
  category_id: string;
  date: string;
  payment_method: PaymentMethod;
  note: string | null;
  receipt_uri: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseWithCategory extends Expense {
  category: Category;
}

export interface ExpenseWithCategoryRow extends ExpenseRow {
  category_name: string;
  category_icon: string;
  category_color: string;
  category_type: TransactionType;
  category_is_default: number;
  category_sort_order: number;
  category_created_at: string;
}

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    type: row.type,
    isDefault: row.is_default === 1,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export function mapExpenseRow(row: ExpenseRow): Expense {
  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    categoryId: row.category_id,
    date: row.date,
    paymentMethod: row.payment_method,
    note: row.note,
    receiptUri: row.receipt_uri,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapExpenseWithCategoryRow(row: ExpenseWithCategoryRow): ExpenseWithCategory {
  return {
    ...mapExpenseRow(row),
    category: {
      id: row.category_id,
      name: row.category_name,
      icon: row.category_icon,
      color: row.category_color,
      type: row.category_type,
      isDefault: row.category_is_default === 1,
      sortOrder: row.category_sort_order,
      createdAt: row.category_created_at,
    },
  };
}
