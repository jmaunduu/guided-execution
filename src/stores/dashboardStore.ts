import { create } from 'zustand';
import type { 
  Expense, 
  Revenue, 
  BankBalance, 
  FeedInventory, 
  NewExpense, 
  NewRevenue,
  WeekComparison,
  CostBreakdown,
  FinancialHealthData,
  DailyDataPoint,
} from '@/types/dashboard';
import { 
  MOCK_EXPENSES, 
  MOCK_REVENUE, 
  MOCK_BANK_BALANCES, 
  MOCK_FEED_INVENTORY 
} from '@/lib/mockData';
import {
  calculateTodayTotals,
  calculateYesterdayTotals,
  calculatePercentageChange,
  calculateWeekComparison,
  calculateCostBreakdown,
  calculateFinancialHealth,
  generateDailyDataPoints,
  calculateQuickMetrics,
} from '@/lib/calculations';

interface DashboardState {
  // Data
  expenses: Expense[];
  revenue: Revenue[];
  bankBalances: BankBalance[];
  feedInventory: FeedInventory | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Modal states
  isExpenseModalOpen: boolean;
  isRevenueModalOpen: boolean;
  
  // Actions
  fetchDashboardData: () => Promise<void>;
  addExpense: (expense: NewExpense) => Promise<void>;
  addRevenue: (revenue: NewRevenue) => Promise<void>;
  deleteExpense: (id: string) => void;
  deleteRevenue: (id: string) => void;
  updatePaymentStatus: (id: string, status: 'paid' | 'pending' | 'overdue') => void;
  
  // Modal actions
  openExpenseModal: () => void;
  closeExpenseModal: () => void;
  openRevenueModal: () => void;
  closeRevenueModal: () => void;
  
  // Computed getters
  getTodayMetrics: () => { revenue: number; expenses: number; profit: number; revenueChange: number; profitChange: number };
  getCashOnHand: () => number;
  getDaysUntilFeedRestock: () => number;
  getWeekComparison: () => WeekComparison;
  getCostBreakdown: () => CostBreakdown;
  getFinancialHealth: () => FinancialHealthData;
  getTrendData: () => DailyDataPoint[];
  getQuickMetrics: () => { avgEggPrice: number; feedCostPerCrate: number; breakEvenPrice: number; profitPerCrate: number };
  getRecentExpenses: (limit?: number) => Expense[];
  getPaymentsByStatus: () => { paid: Revenue[]; pending: Revenue[]; overdue: Revenue[] };
  getLast7DaysRevenue: () => number[];
  getLast7DaysProfit: () => number[];
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  expenses: [],
  revenue: [],
  bankBalances: [],
  feedInventory: null,
  isLoading: false,
  error: null,
  isExpenseModalOpen: false,
  isRevenueModalOpen: false,
  
  // Fetch all data (using mock data for now)
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({
        expenses: MOCK_EXPENSES,
        revenue: MOCK_REVENUE,
        bankBalances: MOCK_BANK_BALANCES,
        feedInventory: MOCK_FEED_INVENTORY,
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  // Add expense with optimistic update
  addExpense: async (newExpense: NewExpense) => {
    const tempId = crypto.randomUUID();
    const optimisticExpense: Expense = {
      id: tempId,
      ...newExpense,
      created_at: new Date().toISOString(),
    };
    
    // Optimistic update
    set(state => ({
      expenses: [optimisticExpense, ...state.expenses],
    }));
    
    // In real app, would sync with Supabase here
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  // Add revenue with optimistic update
  addRevenue: async (newRevenue: NewRevenue) => {
    const tempId = crypto.randomUUID();
    const optimisticRevenue: Revenue = {
      id: tempId,
      ...newRevenue,
      created_at: new Date().toISOString(),
    };
    
    set(state => ({
      revenue: [optimisticRevenue, ...state.revenue],
    }));
    
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  // Delete expense
  deleteExpense: (id: string) => {
    set(state => ({
      expenses: state.expenses.filter(e => e.id !== id),
    }));
  },
  
  // Delete revenue
  deleteRevenue: (id: string) => {
    set(state => ({
      revenue: state.revenue.filter(r => r.id !== id),
    }));
  },
  
  // Update payment status
  updatePaymentStatus: (id: string, status: 'paid' | 'pending' | 'overdue') => {
    set(state => ({
      revenue: state.revenue.map(r => 
        r.id === id ? { ...r, payment_status: status } : r
      ),
    }));
  },
  
  // Modal actions
  openExpenseModal: () => set({ isExpenseModalOpen: true }),
  closeExpenseModal: () => set({ isExpenseModalOpen: false }),
  openRevenueModal: () => set({ isRevenueModalOpen: true }),
  closeRevenueModal: () => set({ isRevenueModalOpen: false }),
  
  // Computed getters
  getTodayMetrics: () => {
    const { revenue, expenses } = get();
    const today = calculateTodayTotals(revenue, expenses);
    const yesterday = calculateYesterdayTotals(revenue, expenses);
    
    return {
      ...today,
      revenueChange: calculatePercentageChange(today.revenue, yesterday.revenue),
      profitChange: calculatePercentageChange(today.profit, yesterday.profit),
    };
  },
  
  getCashOnHand: () => {
    const { bankBalances } = get();
    return bankBalances.reduce((sum, b) => sum + b.balance, 0);
  },
  
  getDaysUntilFeedRestock: () => {
    const { feedInventory } = get();
    if (!feedInventory) return 0;
    
    const totalKg = feedInventory.bags_remaining * feedInventory.kg_per_bag;
    return Math.floor(totalKg / feedInventory.daily_consumption_rate);
  },
  
  getWeekComparison: () => {
    const { revenue, expenses } = get();
    return calculateWeekComparison(revenue, expenses);
  },
  
  getCostBreakdown: () => {
    const { expenses } = get();
    return calculateCostBreakdown(expenses, 30);
  },
  
  getFinancialHealth: () => {
    const { revenue, expenses } = get();
    const cashOnHand = get().getCashOnHand();
    return calculateFinancialHealth(revenue, expenses, cashOnHand);
  },
  
  getTrendData: () => {
    const { revenue, expenses } = get();
    return generateDailyDataPoints(revenue, expenses, 30);
  },
  
  getQuickMetrics: () => {
    const { revenue, expenses } = get();
    return calculateQuickMetrics(revenue, expenses);
  },
  
  getRecentExpenses: (limit = 10) => {
    const { expenses } = get();
    return expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },
  
  getPaymentsByStatus: () => {
    const { revenue } = get();
    return {
      paid: revenue.filter(r => r.payment_status === 'paid'),
      pending: revenue.filter(r => r.payment_status === 'pending'),
      overdue: revenue.filter(r => r.payment_status === 'overdue'),
    };
  },
  
  getLast7DaysRevenue: () => {
    const { revenue } = get();
    const data: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = revenue
        .filter(r => r.date === dateStr)
        .reduce((sum, r) => sum + r.total_amount, 0);
      
      data.push(dayRevenue);
    }
    
    return data;
  },
  
  getLast7DaysProfit: () => {
    const { revenue, expenses } = get();
    const data: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = revenue
        .filter(r => r.date === dateStr)
        .reduce((sum, r) => sum + r.total_amount, 0);
      
      const dayExpenses = expenses
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
      
      data.push(dayRevenue - dayExpenses);
    }
    
    return data;
  },
}));
