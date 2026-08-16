import { CategoryColors } from '@/constants/theme';
import type { TransactionType } from '@/db/schema';

export interface DefaultCategorySeed {
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

/** Seeded into the `categories` table on first launch (expense side). */
export const DEFAULT_EXPENSE_CATEGORIES: DefaultCategorySeed[] = [
  { name: 'Food', icon: 'fast-food', color: CategoryColors.food, type: 'expense' },
  { name: 'Transportation', icon: 'car', color: CategoryColors.transportation, type: 'expense' },
  { name: 'Utilities', icon: 'flash', color: CategoryColors.utilities, type: 'expense' },
  { name: 'Shopping', icon: 'bag', color: CategoryColors.shopping, type: 'expense' },
  { name: 'Health', icon: 'heart', color: CategoryColors.health, type: 'expense' },
  { name: 'Entertainment', icon: 'film', color: CategoryColors.entertainment, type: 'expense' },
  { name: 'Education', icon: 'book', color: CategoryColors.education, type: 'expense' },
  { name: 'Household', icon: 'home', color: CategoryColors.household, type: 'expense' },
  { name: 'Mobile/Internet', icon: 'wifi', color: CategoryColors.mobileInternet, type: 'expense' },
  { name: 'Savings', icon: 'wallet', color: CategoryColors.savings, type: 'expense' },
  { name: 'Others', icon: 'ellipsis-horizontal', color: CategoryColors.others, type: 'expense' },
];

/** Seeded into the `categories` table on first launch (income side). */
export const DEFAULT_INCOME_CATEGORIES: DefaultCategorySeed[] = [
  { name: 'Salary', icon: 'cash', color: CategoryColors.salary, type: 'income' },
  { name: 'Business', icon: 'briefcase', color: CategoryColors.business, type: 'income' },
  { name: 'Freelance', icon: 'laptop', color: CategoryColors.freelance, type: 'income' },
  { name: 'Commission', icon: 'trending-up', color: CategoryColors.commission, type: 'income' },
  { name: 'Allowance', icon: 'gift', color: CategoryColors.allowance, type: 'income' },
  { name: 'Other', icon: 'ellipsis-horizontal', color: CategoryColors.otherIncome, type: 'income' },
];

/**
 * Not used directly by any screen — every screen reads categories back out of
 * the database. This combined list is only for seeding.
 */
export const DEFAULT_CATEGORIES: DefaultCategorySeed[] = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];

/** Icon choices offered when creating/editing a category. */
export const CATEGORY_ICON_CHOICES: string[] = [
  'fast-food',
  'car',
  'flash',
  'bag',
  'heart',
  'film',
  'book',
  'ellipsis-horizontal',
  'home',
  'gift',
  'paw',
  'airplane',
  'medkit',
  'card',
  'phone-portrait',
  'school',
  'fitness',
  'cafe',
  'wifi',
  'construct',
  'wallet',
  'cash',
  'briefcase',
  'laptop',
  'trending-up',
];

/** Color choices offered when creating/editing a category. */
export const CATEGORY_COLOR_CHOICES: string[] = [
  CategoryColors.food,
  CategoryColors.transportation,
  CategoryColors.utilities,
  CategoryColors.shopping,
  CategoryColors.health,
  CategoryColors.entertainment,
  CategoryColors.education,
  CategoryColors.household,
  CategoryColors.mobileInternet,
  CategoryColors.savings,
  CategoryColors.others,
  CategoryColors.salary,
  CategoryColors.business,
  CategoryColors.freelance,
  CategoryColors.commission,
  CategoryColors.allowance,
  CategoryColors.otherIncome,
];
