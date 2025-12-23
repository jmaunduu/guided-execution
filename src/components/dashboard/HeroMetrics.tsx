import { MetricCard } from '@/components/ui/card';
import { Sparkline } from '@/components/charts/Sparkline';
import { useDashboardStore } from '@/stores/dashboardStore';
import { formatKES } from '@/lib/formatters';
import { ArrowUp, ArrowDown, AlertCircle, Banknote, TrendingUp } from 'lucide-react';

export function HeroMetrics() {
  const { 
    getTodayMetrics, 
    getCashOnHand, 
    getDaysUntilFeedRestock,
    getLast7DaysRevenue,
    getLast7DaysProfit,
    bankBalances,
    expenses,
  } = useDashboardStore();
  
  const todayMetrics = getTodayMetrics();
  const cashOnHand = getCashOnHand();
  const daysUntilFeedRestock = getDaysUntilFeedRestock();
  const last7DaysRevenue = getLast7DaysRevenue();
  const last7DaysProfit = getLast7DaysProfit();
  
  // Calculate cash runway days
  const avgDailyExpenses = expenses.slice(0, 30).reduce((sum, e) => sum + e.amount, 0) / 30;
  const cashRunwayDays = avgDailyExpenses > 0 ? Math.floor(cashOnHand / avgDailyExpenses) : 999;
  
  // Determine status colors
  const getCashStatus = () => {
    if (cashRunwayDays >= 30) return 'success';
    if (cashRunwayDays >= 10) return 'warning';
    return 'danger';
  };
  
  const getFeedStatus = () => {
    if (daysUntilFeedRestock >= 14) return 'success';
    if (daysUntilFeedRestock >= 7) return 'warning';
    return 'danger';
  };
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Revenue */}
      <MetricCard interactive className="relative overflow-hidden">
        <p className="text-label text-muted-foreground mb-1">Today's Revenue</p>
        <h2 className="text-4xl lg:text-hero font-semibold text-foreground tracking-tight">
          {formatKES(todayMetrics.revenue)}
        </h2>
        <p className="text-micro text-muted-foreground mt-1">KES</p>
        
        <div className="flex items-center mt-3 text-sm">
          {todayMetrics.revenueChange >= 0 ? (
            <>
              <ArrowUp className="w-4 h-4 text-success mr-1" />
              <span className="text-success font-medium">
                {todayMetrics.revenueChange.toFixed(1)}%
              </span>
            </>
          ) : (
            <>
              <ArrowDown className="w-4 h-4 text-danger mr-1" />
              <span className="text-danger font-medium">
                {Math.abs(todayMetrics.revenueChange).toFixed(1)}%
              </span>
            </>
          )}
          <span className="text-muted-foreground ml-2 text-xs">vs yesterday</span>
        </div>
        
        <Sparkline 
          data={last7DaysRevenue} 
          color="#3B82F6"
          height={40}
          className="mt-4"
        />
        
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-info/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-info" />
        </div>
      </MetricCard>
      
      {/* Today's Profit */}
      <MetricCard 
        interactive 
        status={todayMetrics.profit >= 0 ? 'success' : 'danger'}
        className="relative overflow-hidden"
      >
        <p className="text-label text-muted-foreground mb-1">Today's Profit</p>
        <h2 className={`text-4xl lg:text-hero font-semibold tracking-tight ${
          todayMetrics.profit >= 0 ? 'text-success' : 'text-danger'
        }`}>
          {formatKES(todayMetrics.profit)}
        </h2>
        <p className="text-micro text-muted-foreground mt-1">KES</p>
        
        <div className="mt-3 text-sm">
          <span className="text-muted-foreground">
            Margin: {todayMetrics.revenue > 0 
              ? Math.round((todayMetrics.profit / todayMetrics.revenue) * 100) 
              : 0}%
          </span>
        </div>
        
        <Sparkline 
          data={last7DaysProfit} 
          color={todayMetrics.profit >= 0 ? "#10B981" : "#EF4444"}
          height={40}
          className="mt-4"
        />
        
        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
          todayMetrics.profit >= 0 ? 'bg-success/10' : 'bg-danger/10'
        }`}>
          <span className="text-lg">{todayMetrics.profit >= 0 ? '💚' : '📉'}</span>
        </div>
      </MetricCard>
      
      {/* Cash on Hand */}
      <MetricCard 
        interactive 
        status={getCashStatus()}
        className="relative overflow-hidden"
      >
        <p className="text-label text-muted-foreground mb-1">Cash Available</p>
        <h2 className="text-4xl lg:text-hero font-semibold text-foreground tracking-tight">
          {formatKES(cashOnHand)}
        </h2>
        <p className="text-micro text-muted-foreground mt-1">KES</p>
        
        <div className={`mt-3 text-sm flex items-center ${
          cashRunwayDays >= 30 ? 'text-success' :
          cashRunwayDays >= 10 ? 'text-warning' :
          'text-danger'
        }`}>
          {cashRunwayDays < 30 && (
            <AlertCircle className="w-4 h-4 mr-1" />
          )}
          <span className="font-medium">
            Covers {cashRunwayDays} days
          </span>
        </div>
        
        {/* Bank breakdown */}
        <div className="mt-4 text-micro text-muted-foreground space-y-1">
          {bankBalances.map((balance) => (
            <div key={balance.account} className="flex justify-between">
              <span className="capitalize">{balance.account === 'mpesa' ? 'M-Pesa' : balance.account.toUpperCase()}:</span>
              <span className="font-medium">{formatKES(balance.balance)}</span>
            </div>
          ))}
        </div>
        
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <Banknote className="w-4 h-4 text-muted-foreground" />
        </div>
      </MetricCard>
      
      {/* Feed Inventory */}
      <MetricCard 
        interactive 
        status={getFeedStatus()}
        className="relative overflow-hidden"
      >
        <p className="text-label text-muted-foreground mb-1">Feed Inventory</p>
        <h2 className="text-4xl lg:text-hero font-semibold text-foreground tracking-tight">
          {daysUntilFeedRestock}
        </h2>
        <p className="text-micro text-muted-foreground mt-1">Days remaining</p>
        
        {daysUntilFeedRestock <= 7 && (
          <div className="mt-3 text-sm text-danger flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span className="font-medium">Reorder NOW</span>
          </div>
        )}
        
        {daysUntilFeedRestock > 7 && daysUntilFeedRestock <= 14 && (
          <div className="mt-3 text-sm text-warning">
            <span className="font-medium">Reorder in {daysUntilFeedRestock - 7} days</span>
          </div>
        )}
        
        {daysUntilFeedRestock > 14 && (
          <div className="mt-3 text-sm text-success">
            <span className="font-medium">Stock healthy</span>
          </div>
        )}
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                daysUntilFeedRestock < 7 ? 'bg-danger' :
                daysUntilFeedRestock < 14 ? 'bg-warning' :
                'bg-success'
              }`}
              style={{ width: `${Math.min(100, (daysUntilFeedRestock / 30) * 100)}%` }}
            />
          </div>
        </div>
        
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-lg">🌾</span>
        </div>
      </MetricCard>
    </div>
  );
}
