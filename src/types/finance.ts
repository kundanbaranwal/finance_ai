export type TransactionCategory = 
  | 'food'
  | 'rent'
  | 'transport'
  | 'shopping'
  | 'subscriptions'
  | 'utilities'
  | 'entertainment'
  | 'healthcare'
  | 'income'
  | 'other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  userId?: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory | 'total';
  amount: number;
  spent: number;
  userId?: string;
}

export interface SpendingInsight {
  summary: string;
  topCategories: { category: TransactionCategory; amount: number; percentage: number }[];
  savingTips: string[];
  suggestedSavingGoal: number;
  alerts: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  food: 'Food & Dining',
  rent: 'Rent & Housing',
  transport: 'Transportation',
  shopping: 'Shopping',
  subscriptions: 'Subscriptions',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  healthcare: 'Healthcare',
  income: 'Income',
  other: 'Other',
};

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  food: 'hsl(162, 72%, 45%)',
  rent: 'hsl(200, 70%, 50%)',
  transport: 'hsl(280, 65%, 60%)',
  shopping: 'hsl(38, 92%, 50%)',
  subscriptions: 'hsl(0, 72%, 51%)',
  utilities: 'hsl(180, 60%, 45%)',
  entertainment: 'hsl(320, 70%, 55%)',
  healthcare: 'hsl(142, 76%, 36%)',
  income: 'hsl(120, 60%, 45%)',
  other: 'hsl(220, 30%, 50%)',
};

export const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  food: '🍔',
  rent: '🏠',
  transport: '🚗',
  shopping: '🛍️',
  subscriptions: '📱',
  utilities: '💡',
  entertainment: '🎬',
  healthcare: '🏥',
  income: '💰',
  other: '📦',
};
