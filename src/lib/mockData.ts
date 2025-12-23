import type { Expense, Revenue, BankBalance, FeedInventory } from '@/types/dashboard';

// Realistic mock data for Magolla Farm (Kenyan poultry operation)
// All amounts in KES (Kenyan Shillings)

const today = new Date();
const formatDate = (daysAgo: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const MOCK_EXPENSES: Expense[] = [
  { id: '1', date: formatDate(0), category: 'feeds', amount: 45000, payment_method: 'mpesa', notes: 'Supplier A bulk', created_at: formatDate(0) },
  { id: '2', date: formatDate(1), category: 'salaries', amount: 20000, payment_method: 'kcb', notes: 'Worker 1 - December', created_at: formatDate(1) },
  { id: '3', date: formatDate(2), category: 'supplies', amount: 8500, payment_method: 'cash', notes: 'Vaccines batch 3', created_at: formatDate(2) },
  { id: '4', date: formatDate(3), category: 'feeds', amount: 42000, payment_method: 'mpesa', notes: 'Weekly restock', created_at: formatDate(3) },
  { id: '5', date: formatDate(4), category: 'miscellaneous', amount: 3500, payment_method: 'cash', notes: 'Transport', created_at: formatDate(4) },
  { id: '6', date: formatDate(5), category: 'salaries', amount: 18000, payment_method: 'kcb', notes: 'Worker 2 - December', created_at: formatDate(5) },
  { id: '7', date: formatDate(6), category: 'feeds', amount: 48000, payment_method: 'mpesa', notes: 'Supplier B', created_at: formatDate(6) },
  { id: '8', date: formatDate(7), category: 'supplies', amount: 12000, payment_method: 'absa', notes: 'Equipment repair', created_at: formatDate(7) },
  { id: '9', date: formatDate(8), category: 'feeds', amount: 44000, payment_method: 'mpesa', notes: 'Regular order', created_at: formatDate(8) },
  { id: '10', date: formatDate(9), category: 'miscellaneous', amount: 5500, payment_method: 'cash', notes: 'Electricity', created_at: formatDate(9) },
  { id: '11', date: formatDate(10), category: 'feeds', amount: 46000, payment_method: 'mpesa', notes: 'Supplier A', created_at: formatDate(10) },
  { id: '12', date: formatDate(11), category: 'salaries', amount: 15000, payment_method: 'kcb', notes: 'Worker 3', created_at: formatDate(11) },
  { id: '13', date: formatDate(12), category: 'feeds', amount: 43000, payment_method: 'mpesa', notes: 'Weekly order', created_at: formatDate(12) },
  { id: '14', date: formatDate(13), category: 'supplies', amount: 6800, payment_method: 'cash', notes: 'Cleaning supplies', created_at: formatDate(13) },
  { id: '15', date: formatDate(14), category: 'feeds', amount: 47000, payment_method: 'mpesa', notes: 'Bulk purchase', created_at: formatDate(14) },
];

export const MOCK_REVENUE: Revenue[] = [
  { id: '1', date: formatDate(0), product_type: 'eggs', quantity: 50, unit_price: 360, total_amount: 18000, customer_name: 'Hotel Savanna', payment_method: 'mpesa', payment_status: 'paid', created_at: formatDate(0) },
  { id: '2', date: formatDate(0), product_type: 'broilers', quantity: 100, unit_price: 825, total_amount: 82500, customer_name: 'Nairobi Butchery', payment_method: 'kcb', payment_status: 'paid', created_at: formatDate(0) },
  { id: '3', date: formatDate(1), product_type: 'eggs', quantity: 45, unit_price: 360, total_amount: 16200, customer_name: 'Restaurant Jambo', payment_method: 'mpesa', payment_status: 'paid', created_at: formatDate(1) },
  { id: '4', date: formatDate(1), product_type: 'broilers', quantity: 80, unit_price: 800, total_amount: 64000, customer_name: 'City Market', payment_method: 'absa', payment_status: 'paid', created_at: formatDate(1) },
  { id: '5', date: formatDate(2), product_type: 'eggs', quantity: 55, unit_price: 360, total_amount: 19800, customer_name: 'Supermart Kenya', payment_method: 'mpesa', payment_status: 'pending', due_date: formatDate(-5), created_at: formatDate(2) },
  { id: '6', date: formatDate(3), product_type: 'broilers', quantity: 150, unit_price: 850, total_amount: 127500, customer_name: 'Hotel Intercontinental', payment_method: 'kcb', payment_status: 'paid', created_at: formatDate(3) },
  { id: '7', date: formatDate(4), product_type: 'eggs', quantity: 48, unit_price: 360, total_amount: 17280, customer_name: 'Local Shop Karibu', payment_method: 'cash', payment_status: 'paid', created_at: formatDate(4) },
  { id: '8', date: formatDate(5), product_type: 'eggs', quantity: 42, unit_price: 355, total_amount: 14910, customer_name: 'Mama Njeri Kiosk', payment_method: 'mpesa', payment_status: 'overdue', due_date: formatDate(12), created_at: formatDate(5) },
  { id: '9', date: formatDate(6), product_type: 'broilers', quantity: 120, unit_price: 820, total_amount: 98400, customer_name: 'Westlands Butcher', payment_method: 'absa', payment_status: 'paid', created_at: formatDate(6) },
  { id: '10', date: formatDate(7), product_type: 'eggs', quantity: 60, unit_price: 360, total_amount: 21600, customer_name: 'Hotel Savanna', payment_method: 'mpesa', payment_status: 'paid', created_at: formatDate(7) },
  { id: '11', date: formatDate(8), product_type: 'broilers', quantity: 90, unit_price: 810, total_amount: 72900, customer_name: 'Nairobi Butchery', payment_method: 'kcb', payment_status: 'pending', due_date: formatDate(-2), created_at: formatDate(8) },
  { id: '12', date: formatDate(9), product_type: 'eggs', quantity: 52, unit_price: 360, total_amount: 18720, customer_name: 'Restaurant Jambo', payment_method: 'mpesa', payment_status: 'paid', created_at: formatDate(9) },
  { id: '13', date: formatDate(10), product_type: 'broilers', quantity: 110, unit_price: 830, total_amount: 91300, customer_name: 'Karen Meats', payment_method: 'absa', payment_status: 'overdue', due_date: formatDate(17), created_at: formatDate(10) },
  { id: '14', date: formatDate(11), product_type: 'eggs', quantity: 46, unit_price: 360, total_amount: 16560, customer_name: 'Local Shop Karibu', payment_method: 'cash', payment_status: 'paid', created_at: formatDate(11) },
  { id: '15', date: formatDate(12), product_type: 'eggs', quantity: 58, unit_price: 360, total_amount: 20880, customer_name: 'Supermart Kenya', payment_method: 'mpesa', payment_status: 'paid', created_at: formatDate(12) },
];

export const MOCK_BANK_BALANCES: BankBalance[] = [
  { id: '1', account: 'mpesa', balance: 180000, as_of_date: formatDate(0) },
  { id: '2', account: 'kcb', balance: 650000, as_of_date: formatDate(0) },
  { id: '3', account: 'absa', balance: 380000, as_of_date: formatDate(0) },
  { id: '4', account: 'cash', balance: 30000, as_of_date: formatDate(0) },
];

export const MOCK_FEED_INVENTORY: FeedInventory = {
  id: '1',
  date: formatDate(0),
  bags_remaining: 24,
  kg_per_bag: 50,
  daily_consumption_rate: 100, // 100kg per day for 5000 birds
};

// Helper to generate 30 days of trend data
export function generateTrendData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = formatDate(i);
    const baseRevenue = 80000 + Math.random() * 60000;
    const baseExpenses = 40000 + Math.random() * 25000;
    data.push({
      date,
      revenue: Math.round(baseRevenue),
      expenses: Math.round(baseExpenses),
      profit: Math.round(baseRevenue - baseExpenses),
    });
  }
  return data;
}
