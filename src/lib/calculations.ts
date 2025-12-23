import type { Expense, Revenue, CostBreakdown, WeekComparison, FinancialHealthData, DailyDataPoint } from '@/types/dashboard';
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval, subDays } from 'date-fns';

/**
 * Calculate today's totals
 */
export function calculateTodayTotals(revenue: Revenue[], expenses: Expense[]) {
  const today = new Date().toISOString().split('T')[0];
  
  const todayRevenue = revenue
    .filter(r => r.date === today)
    .reduce((sum, r) => sum + r.total_amount, 0);
  
  const todayExpenses = expenses
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);
  
  return {
    revenue: todayRevenue,
    expenses: todayExpenses,
    profit: todayRevenue - todayExpenses,
  };
}

/**
 * Calculate yesterday's totals for comparison
 */
export function calculateYesterdayTotals(revenue: Revenue[], expenses: Expense[]) {
  const yesterday = subDays(new Date(), 1).toISOString().split('T')[0];
  
  const yesterdayRevenue = revenue
    .filter(r => r.date === yesterday)
    .reduce((sum, r) => sum + r.total_amount, 0);
  
  const yesterdayExpenses = expenses
    .filter(e => e.date === yesterday)
    .reduce((sum, e) => sum + e.amount, 0);
  
  return {
    revenue: yesterdayRevenue,
    expenses: yesterdayExpenses,
    profit: yesterdayRevenue - yesterdayExpenses,
  };
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate this week vs last week comparison
 */
export function calculateWeekComparison(revenue: Revenue[], expenses: Expense[]): WeekComparison {
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = subWeeks(thisWeekStart, 1);
  const lastWeekEnd = subWeeks(thisWeekEnd, 1);
  
  const isInThisWeek = (dateStr: string) => 
    isWithinInterval(new Date(dateStr), { start: thisWeekStart, end: thisWeekEnd });
  
  const isInLastWeek = (dateStr: string) =>
    isWithinInterval(new Date(dateStr), { start: lastWeekStart, end: lastWeekEnd });
  
  const thisWeekRevenue = revenue.filter(r => isInThisWeek(r.date)).reduce((sum, r) => sum + r.total_amount, 0);
  const lastWeekRevenue = revenue.filter(r => isInLastWeek(r.date)).reduce((sum, r) => sum + r.total_amount, 0);
  
  const thisWeekCosts = expenses.filter(e => isInThisWeek(e.date)).reduce((sum, e) => sum + e.amount, 0);
  const lastWeekCosts = expenses.filter(e => isInLastWeek(e.date)).reduce((sum, e) => sum + e.amount, 0);
  
  const thisWeekCrates = revenue.filter(r => isInThisWeek(r.date) && r.product_type === 'eggs').reduce((sum, r) => sum + r.quantity, 0);
  const lastWeekCrates = revenue.filter(r => isInLastWeek(r.date) && r.product_type === 'eggs').reduce((sum, r) => sum + r.quantity, 0);
  
  return {
    thisWeek: {
      revenue: thisWeekRevenue,
      costs: thisWeekCosts,
      profit: thisWeekRevenue - thisWeekCosts,
      crates: thisWeekCrates,
    },
    lastWeek: {
      revenue: lastWeekRevenue,
      costs: lastWeekCosts,
      profit: lastWeekRevenue - lastWeekCosts,
      crates: lastWeekCrates,
    },
    percentageChanges: {
      revenue: calculatePercentageChange(thisWeekRevenue, lastWeekRevenue),
      costs: calculatePercentageChange(thisWeekCosts, lastWeekCosts),
      profit: calculatePercentageChange(thisWeekRevenue - thisWeekCosts, lastWeekRevenue - lastWeekCosts),
      crates: calculatePercentageChange(thisWeekCrates, lastWeekCrates),
    },
  };
}

/**
 * Calculate cost breakdown by category
 */
export function calculateCostBreakdown(expenses: Expense[], days = 30): CostBreakdown {
  const cutoffDate = subDays(new Date(), days);
  const recentExpenses = expenses.filter(e => new Date(e.date) >= cutoffDate);
  
  const breakdown: CostBreakdown = {
    feeds: 0,
    salaries: 0,
    supplies: 0,
    miscellaneous: 0,
    total: 0,
  };
  
  recentExpenses.forEach(expense => {
    breakdown[expense.category] += expense.amount;
    breakdown.total += expense.amount;
  });
  
  return breakdown;
}

/**
 * Calculate Financial Health Score (0-100)
 * Based on: Profit Margin (40%), Cash Runway (30%), Cost Trend (30%)
 */
export function calculateFinancialHealth(
  revenue: Revenue[],
  expenses: Expense[],
  cashOnHand: number
): FinancialHealthData {
  const last30Days = subDays(new Date(), 30);
  
  // Calculate profit margin (last 30 days)
  const recentRevenue = revenue
    .filter(r => new Date(r.date) >= last30Days)
    .reduce((sum, r) => sum + r.total_amount, 0);
  
  const recentExpenses = expenses
    .filter(e => new Date(e.date) >= last30Days)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const profitMargin = recentRevenue > 0 
    ? ((recentRevenue - recentExpenses) / recentRevenue) * 100 
    : 0;
  
  // Profit margin score (40% weight)
  let marginScore = 0;
  if (profitMargin > 25) marginScore = 100;
  else if (profitMargin >= 15) marginScore = 70;
  else marginScore = 40;
  
  // Cash runway calculation (30% weight)
  const avgDailyExpenses = recentExpenses / 30;
  const cashRunwayDays = avgDailyExpenses > 0 ? cashOnHand / avgDailyExpenses : 999;
  
  let runwayScore = 0;
  if (cashRunwayDays > 90) runwayScore = 100;
  else if (cashRunwayDays >= 30) runwayScore = 60;
  else runwayScore = 20;
  
  // Cost trend calculation (30% weight)
  const first15DaysCutoff = subDays(new Date(), 15);
  const first15Days = expenses
    .filter(e => {
      const date = new Date(e.date);
      return date >= last30Days && date <= first15DaysCutoff;
    })
    .reduce((sum, e) => sum + e.amount, 0);
  
  const second15Days = expenses
    .filter(e => new Date(e.date) > first15DaysCutoff)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const costChange = first15Days > 0 
    ? ((second15Days - first15Days) / first15Days) * 100 
    : 0;
  
  let costTrend: 'decreasing' | 'stable' | 'increasing' = 'stable';
  let trendScore = 70;
  if (costChange < -5) {
    costTrend = 'decreasing';
    trendScore = 100;
  } else if (costChange > 10) {
    costTrend = 'increasing';
    trendScore = 40;
  }
  
  // Calculate final score
  const score = Math.round(marginScore * 0.4 + runwayScore * 0.3 + trendScore * 0.3);
  
  // Determine status
  let status: FinancialHealthData['status'] = 'excellent';
  if (score < 60) status = 'danger';
  else if (score < 70) status = 'warning';
  else if (score < 80) status = 'good';
  
  // Generate recommendation
  let recommendation = 'Your farm finances are in great shape. Keep up the excellent work!';
  if (costTrend === 'increasing') {
    recommendation = `Feed costs increased ${Math.abs(costChange).toFixed(0)}% recently. Consider bulk purchasing or negotiating with suppliers.`;
  } else if (cashRunwayDays < 30) {
    recommendation = `Cash runway is only ${Math.floor(cashRunwayDays)} days. Focus on collecting pending payments and reducing non-essential expenses.`;
  } else if (profitMargin < 15) {
    recommendation = `Profit margin is low at ${profitMargin.toFixed(0)}%. Consider reviewing pricing or reducing costs.`;
  }
  
  return {
    score,
    status,
    profitMargin,
    cashRunwayDays: Math.floor(cashRunwayDays),
    costTrend,
    recommendation,
  };
}

/**
 * Generate daily data points for charts
 */
export function generateDailyDataPoints(revenue: Revenue[], expenses: Expense[], days = 30): DailyDataPoint[] {
  const data: DailyDataPoint[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i).toISOString().split('T')[0];
    const dayRevenue = revenue
      .filter(r => r.date === date)
      .reduce((sum, r) => sum + r.total_amount, 0);
    const dayExpenses = expenses
      .filter(e => e.date === date)
      .reduce((sum, e) => sum + e.amount, 0);
    
    data.push({
      date,
      revenue: dayRevenue,
      expenses: dayExpenses,
      profit: dayRevenue - dayExpenses,
    });
  }
  
  return data;
}

/**
 * Calculate quick metrics
 */
export function calculateQuickMetrics(revenue: Revenue[], expenses: Expense[]) {
  const last30Days = subDays(new Date(), 30);
  const recentRevenue = revenue.filter(r => new Date(r.date) >= last30Days);
  const recentExpenses = expenses.filter(e => new Date(e.date) >= last30Days);
  
  // Egg data
  const eggSales = recentRevenue.filter(r => r.product_type === 'eggs');
  const totalEggCrates = eggSales.reduce((sum, r) => sum + r.quantity, 0);
  const avgEggPrice = eggSales.length > 0 
    ? eggSales.reduce((sum, r) => sum + r.unit_price, 0) / eggSales.length 
    : 360;
  
  // Feed costs
  const feedCosts = recentExpenses
    .filter(e => e.category === 'feeds')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const feedCostPerCrate = totalEggCrates > 0 ? feedCosts / totalEggCrates : 125;
  
  // Break-even and profit per crate
  const totalCosts = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const costPerCrate = totalEggCrates > 0 ? totalCosts / totalEggCrates : 0;
  const profitPerCrate = avgEggPrice - costPerCrate;
  
  return {
    avgEggPrice: Math.round(avgEggPrice),
    feedCostPerCrate: Math.round(feedCostPerCrate),
    breakEvenPrice: Math.round(costPerCrate),
    profitPerCrate: Math.round(profitPerCrate),
  };
}
