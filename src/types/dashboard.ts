// ============== Core Types for Magolla Farm Dashboard ==============

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  payment_method: PaymentMethod;
  notes?: string;
  created_at: string;
}

export interface Revenue {
  id: string;
  date: string;
  product_type: ProductType;
  quantity: number;
  unit_price: number;
  total_amount: number;
  customer_name?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  due_date?: string;
  transaction_code?: string;
  created_at: string;
}

export interface BankBalance {
  id: string;
  account: BankAccount;
  balance: number;
  as_of_date: string;
}

export interface FeedInventory {
  id: string;
  date: string;
  bags_remaining: number;
  kg_per_bag: number;
  daily_consumption_rate: number;
}

// Enum types
export type ExpenseCategory = 'feeds' | 'salaries' | 'supplies' | 'miscellaneous';
export type ProductType = 'broilers' | 'eggs';
export type PaymentMethod = 'mpesa' | 'kcb' | 'absa' | 'cash';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type BankAccount = 'mpesa' | 'kcb' | 'absa' | 'cash';

// Form types for creating new entries
export interface NewExpense {
  date: string;
  category: ExpenseCategory;
  amount: number;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface NewRevenue {
  date: string;
  product_type: ProductType;
  quantity: number;
  unit_price: number;
  total_amount: number;
  customer_name?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  due_date?: string;
}

// Computed types
export interface WeekComparison {
  thisWeek: {
    revenue: number;
    costs: number;
    profit: number;
    crates: number;
  };
  lastWeek: {
    revenue: number;
    costs: number;
    profit: number;
    crates: number;
  };
  percentageChanges: {
    revenue: number;
    costs: number;
    profit: number;
    crates: number;
  };
}

export interface CostBreakdown {
  feeds: number;
  salaries: number;
  supplies: number;
  miscellaneous: number;
  total: number;
}

export interface DailyDataPoint {
  date: string;
  revenue: number;
  profit: number;
  expenses: number;
}

export interface QuickMetric {
  label: string;
  value: string;
  subtext: string;
  trend?: number;
  icon: string;
}

export type HealthStatus = 'excellent' | 'good' | 'warning' | 'danger';

export interface FinancialHealthData {
  score: number;
  status: HealthStatus;
  profitMargin: number;
  cashRunwayDays: number;
  costTrend: 'decreasing' | 'stable' | 'increasing';
  recommendation: string;
}

// Category display config
export const CATEGORY_CONFIG: Record<ExpenseCategory, { icon: string; label: string; color: string }> = {
  feeds: { icon: '🌾', label: 'Feeds', color: 'warning' },
  salaries: { icon: '💰', label: 'Salaries', color: 'info' },
  supplies: { icon: '🏥', label: 'Supplies', color: 'success' },
  miscellaneous: { icon: '📦', label: 'Miscellaneous', color: 'muted' },
};

export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, { icon: string; label: string }> = {
  mpesa: { icon: '📱', label: 'M-Pesa' },
  kcb: { icon: '🏦', label: 'KCB Bank' },
  absa: { icon: '🏦', label: 'Absa Bank' },
  cash: { icon: '💵', label: 'Cash' },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { icon: string; label: string; color: string }> = {
  paid: { icon: '✓', label: 'Paid', color: 'success' },
  pending: { icon: '⏳', label: 'Pending', color: 'warning' },
  overdue: { icon: '🚨', label: 'Overdue', color: 'danger' },
};
