import { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { formatKES } from '@/lib/formatters';
import { Sparkline } from '@/components/charts/Sparkline';
import { ExpandableCardModal, StatItem, ChartSection, InsightItem } from './ExpandableCardModal';
import { 
  ArrowUp, 
  ArrowDown, 
  AlertCircle, 
  TrendingUp,
  BarChart3,
  Package,
  Wallet,
  Calendar,
  Target,
  PiggyBank,
  Smartphone,
  Landmark,
  Building2,
  Banknote,
} from 'lucide-react';

const BANK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  mpesa: Smartphone,
  kcb: Landmark,
  absa: Building2,
  cash: Banknote,
};

const BANK_COLORS: Record<string, string> = {
  mpesa: 'text-success',
  kcb: 'text-info',
  absa: 'text-warning',
  cash: 'text-muted-foreground',
};

export function HeroMetrics() {
  const [expandedCard, setExpandedCard] = useState<'revenue' | 'profit' | 'cash' | 'feed' | null>(null);
  
  const { 
    getTodayMetrics, 
    getDaysUntilFeedRestock,
    getLast7DaysRevenue,
    getLast7DaysProfit,
    getCashOnHand,
    bankBalances,
    expenses,
    revenue,
    feedInventory,
  } = useDashboardStore();
  
  const todayMetrics = getTodayMetrics();
  const daysUntilFeedRestock = getDaysUntilFeedRestock();
  const last7DaysRevenue = getLast7DaysRevenue();
  const last7DaysProfit = getLast7DaysProfit();
  const cashOnHand = getCashOnHand();
  
  // Calculate cash runway
  const avgDailyExpenses = expenses.slice(0, 30).reduce((sum, e) => sum + e.amount, 0) / 30;
  const cashRunwayDays = avgDailyExpenses > 0 ? Math.floor(cashOnHand / avgDailyExpenses) : 999;
  
  const getFeedStatus = () => {
    if (daysUntilFeedRestock >= 14) return 'success';
    if (daysUntilFeedRestock >= 7) return 'warning';
    return 'danger';
  };
  
  const getCashStatus = () => {
    if (cashRunwayDays >= 30) return 'success';
    if (cashRunwayDays >= 10) return 'warning';
    return 'danger';
  };
  
  const feedStatus = getFeedStatus();
  const cashStatus = getCashStatus();
  
  // Calculate additional metrics for expanded views
  const weeklyRevenue = last7DaysRevenue.reduce((sum, val) => sum + val, 0);
  const weeklyProfit = last7DaysProfit.reduce((sum, val) => sum + val, 0);
  const avgDailyRevenue = weeklyRevenue / 7;
  const profitMargin = weeklyRevenue > 0 ? (weeklyProfit / weeklyRevenue) * 100 : 0;
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div 
          className="card-futuristic p-6 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
          onClick={() => setExpandedCard('revenue')}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-label text-muted-foreground">Today's Revenue</p>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          
          <h2 className="text-4xl lg:text-hero font-bold text-foreground tracking-tight animate-count-up">
            {formatKES(todayMetrics.revenue)}
          </h2>
          <p className="text-micro text-muted-foreground mt-1">KES</p>
          
          <div className="flex items-center mt-4">
            {todayMetrics.revenueChange >= 0 ? (
              <span className="metric-badge metric-badge-success">
                <ArrowUp className="w-3 h-3" />
                {todayMetrics.revenueChange.toFixed(1)}%
              </span>
            ) : (
              <span className="metric-badge metric-badge-danger">
                <ArrowDown className="w-3 h-3" />
                {Math.abs(todayMetrics.revenueChange).toFixed(1)}%
              </span>
            )}
            <span className="text-muted-foreground ml-2 text-xs">vs yesterday</span>
          </div>
          
          {/* Insight section */}
          <div className="mt-4 pt-3 border-t border-border/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Weekly avg:</span>
              <span className="font-medium text-foreground">{formatKES(last7DaysRevenue.reduce((a, b) => a + b, 0) / 7)}</span>
            </div>
            <Sparkline 
              data={last7DaysRevenue} 
              color="blue"
              height={32}
              className="mt-2"
            />
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-muted-foreground">7-day trend</span>
              <span className={`font-medium ${last7DaysRevenue[6] > last7DaysRevenue[0] ? 'text-primary' : 'text-secondary'}`}>
                {last7DaysRevenue[6] > last7DaysRevenue[0] ? '↑ Growing' : '↓ Declining'}
              </span>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Today's Profit */}
        <div 
          className={`card-futuristic p-6 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-200 ${
            todayMetrics.profit >= 0 ? 'card-metric-success' : 'card-metric-danger'
          }`}
          onClick={() => setExpandedCard('profit')}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-label text-muted-foreground">Today's Profit</p>
            <BarChart3 className={`w-5 h-5 ${
              todayMetrics.profit >= 0 ? 'text-primary' : 'text-secondary'
            }`} />
          </div>
          
          <h2 className={`text-4xl lg:text-hero font-bold tracking-tight animate-count-up ${
            todayMetrics.profit >= 0 ? 'text-success' : 'text-danger'
          }`}>
            {formatKES(todayMetrics.profit)}
          </h2>
          <p className="text-micro text-muted-foreground mt-1">KES</p>
          
          <div className="mt-4">
            <span className="text-muted-foreground text-sm">
              Margin: <span className="font-semibold text-foreground">
                {todayMetrics.revenue > 0 
                  ? Math.round((todayMetrics.profit / todayMetrics.revenue) * 100) 
                  : 0}%
              </span>
            </span>
          </div>
          
          {/* Insight section */}
          <div className="mt-4 pt-3 border-t border-border/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Weekly total:</span>
              <span className={`font-medium ${weeklyProfit >= 0 ? 'text-primary' : 'text-secondary'}`}>{formatKES(weeklyProfit)}</span>
            </div>
            <Sparkline 
              data={last7DaysProfit} 
              color={todayMetrics.profit >= 0 ? "blue" : "orange"}
              height={32}
              className="mt-2"
            />
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-muted-foreground">Avg margin</span>
              <span className="font-medium text-foreground">{profitMargin.toFixed(0)}%</span>
            </div>
          </div>
          
          <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            todayMetrics.profit >= 0 
              ? 'from-primary/5 to-transparent' 
              : 'from-secondary/5 to-transparent'
          }`} />
        </div>
        
        {/* Cash Available */}
        <div 
          className={`card-futuristic p-6 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-200 ${
            cashStatus === 'success' ? 'card-metric-success' :
            cashStatus === 'warning' ? 'card-metric-warning' :
            'card-metric-danger'
          }`}
          onClick={() => setExpandedCard('cash')}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-label text-muted-foreground">Cash Available</p>
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          
          <h2 className="text-4xl lg:text-hero font-bold text-foreground tracking-tight animate-count-up">
            {formatKES(cashOnHand)}
          </h2>
          <p className="text-micro text-muted-foreground mt-1">KES</p>
          
          <div className={`mt-4 flex items-center gap-2 text-sm ${
            cashStatus === 'success' ? 'text-success' :
            cashStatus === 'warning' ? 'text-warning' :
            'text-danger'
          }`}>
            {cashRunwayDays < 30 && <AlertCircle className="w-4 h-4" />}
            <span className="font-medium">Covers {cashRunwayDays} days</span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-info/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Feed Inventory */}
        <div 
          className={`card-futuristic p-6 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-200 ${
            feedStatus === 'success' ? 'card-metric-success' :
            feedStatus === 'warning' ? 'card-metric-warning' :
            'card-metric-danger'
          }`}
          onClick={() => setExpandedCard('feed')}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-label text-muted-foreground">Feed Inventory</p>
            <Package className={`w-5 h-5 ${
              feedStatus === 'success' ? 'text-primary' :
              feedStatus === 'warning' ? 'text-secondary' :
              'text-secondary'
            }`} />
          </div>
          
          <h2 className="text-4xl lg:text-hero font-bold text-foreground tracking-tight animate-count-up">
            {daysUntilFeedRestock}
          </h2>
          <p className="text-micro text-muted-foreground mt-1">Days remaining</p>
          
          {daysUntilFeedRestock <= 7 && (
            <div className="mt-4 flex items-center gap-2 text-danger">
              <AlertCircle className="w-4 h-4" />
              <span className="font-semibold text-sm">Reorder NOW</span>
            </div>
          )}
          
          {daysUntilFeedRestock > 7 && daysUntilFeedRestock <= 14 && (
            <div className="mt-4 text-warning">
              <span className="font-semibold text-sm">Reorder in {daysUntilFeedRestock - 7} days</span>
            </div>
          )}
          
          {daysUntilFeedRestock > 14 && (
            <div className="mt-4 flex items-center gap-2 text-success">
              <span className="font-semibold text-sm">Stock healthy</span>
            </div>
          )}
          
          <div className="mt-4">
            <div className="w-full h-2 rounded-full border border-border/50 bg-transparent">
              <div 
                className="h-full rounded-full transition-all duration-500 bg-primary"
                style={{ width: `${Math.min(100, (daysUntilFeedRestock / 30) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            feedStatus === 'success' ? 'from-success/5 to-transparent' :
            feedStatus === 'warning' ? 'from-warning/5 to-transparent' :
            'from-danger/5 to-transparent'
          }`} />
        </div>
      </div>

      {/* Revenue Expanded Modal */}
      <ExpandableCardModal
        isOpen={expandedCard === 'revenue'}
        onClose={() => setExpandedCard(null)}
        title="Revenue Insights"
        subtitle="Detailed breakdown of your income"
        icon={<TrendingUp className="w-6 h-6 text-info" />}
        accentColor="blue"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatItem 
            label="Today" 
            value={formatKES(todayMetrics.revenue)} 
            trend={todayMetrics.revenueChange >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(todayMetrics.revenueChange).toFixed(1)}%`}
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatItem 
            label="This Week" 
            value={formatKES(weeklyRevenue)} 
            icon={<Target className="w-5 h-5" />}
          />
          <StatItem 
            label="Daily Average" 
            value={formatKES(avgDailyRevenue)} 
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <StatItem 
            label="Transactions" 
            value={revenue.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length}
            subtext="today"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>
        
        <ChartSection title="7-Day Revenue Trend">
          <Sparkline data={last7DaysRevenue} color="blue" height={80} showArea />
        </ChartSection>
        
        <div className="mt-6 space-y-3">
          <InsightItem 
            title="Peak Performance" 
            description="Revenue typically peaks mid-week. Consider adjusting inventory accordingly."
            type="info"
          />
          <InsightItem 
            title="Growth Opportunity" 
            description="Weekend sales show potential for improvement with targeted promotions."
            type="warning"
          />
        </div>
      </ExpandableCardModal>

      {/* Profit Expanded Modal */}
      <ExpandableCardModal
        isOpen={expandedCard === 'profit'}
        onClose={() => setExpandedCard(null)}
        title="Profit Analysis"
        subtitle="Understanding your margins"
        icon={<BarChart3 className={`w-6 h-6 ${todayMetrics.profit >= 0 ? 'text-success' : 'text-danger'}`} />}
        accentColor={todayMetrics.profit >= 0 ? 'blue' : 'orange'}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatItem 
            label="Today's Profit" 
            value={formatKES(todayMetrics.profit)} 
            trend={todayMetrics.profit >= 0 ? 'up' : 'down'}
            icon={<PiggyBank className="w-5 h-5" />}
            accentColor={todayMetrics.profit >= 0 ? 'blue' : 'orange'}
          />
          <StatItem 
            label="Weekly Profit" 
            value={formatKES(weeklyProfit)} 
            icon={<Target className="w-5 h-5" />}
          />
          <StatItem 
            label="Profit Margin" 
            value={`${profitMargin.toFixed(1)}%`} 
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <StatItem 
            label="Today's Margin" 
            value={`${todayMetrics.revenue > 0 ? Math.round((todayMetrics.profit / todayMetrics.revenue) * 100) : 0}%`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>
        
        <ChartSection title="7-Day Profit Trend">
          <Sparkline data={last7DaysProfit} color={todayMetrics.profit >= 0 ? "blue" : "orange"} height={80} showArea />
        </ChartSection>
        
        <div className="mt-6 space-y-3">
          <InsightItem 
            title="Margin Health" 
            description={profitMargin >= 30 ? "Your profit margin is healthy. Keep monitoring expenses." : "Consider reviewing expenses to improve margins."}
            type={profitMargin >= 30 ? 'success' : 'warning'}
          />
        </div>
      </ExpandableCardModal>

      {/* Cash Available Expanded Modal */}
      <ExpandableCardModal
        isOpen={expandedCard === 'cash'}
        onClose={() => setExpandedCard(null)}
        title="Cash Position"
        subtitle="Your liquidity breakdown"
        icon={<Wallet className="w-6 h-6 text-info" />}
        accentColor="blue"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatItem 
            label="Total Cash" 
            value={formatKES(cashOnHand)} 
            icon={<Wallet className="w-5 h-5" />}
          />
          <StatItem 
            label="Runway" 
            value={`${cashRunwayDays} days`} 
            trend={cashRunwayDays >= 30 ? 'up' : 'down'}
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatItem 
            label="Daily Burn" 
            value={formatKES(avgDailyExpenses)} 
            subtext="avg expenses"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatItem 
            label="Accounts" 
            value={bankBalances.length}
            subtext="connected"
            icon={<Building2 className="w-5 h-5" />}
          />
        </div>
        
        <ChartSection title="Bank Account Breakdown">
          <div className="grid grid-cols-2 gap-4">
            {bankBalances.map((balance) => {
              const IconComponent = BANK_ICONS[balance.account] || Wallet;
              const colorClass = BANK_COLORS[balance.account] || 'text-muted-foreground';
              const percentage = cashOnHand > 0 ? ((balance.balance / cashOnHand) * 100).toFixed(1) : '0';
              
              return (
                <div key={balance.account} className="sub-card">
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <span className="font-medium capitalize">
                      {balance.account === 'mpesa' ? 'M-Pesa' : balance.account.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">{formatKES(balance.balance)}</span>
                    <span className="metric-badge metric-badge-info">{percentage}%</span>
                  </div>
                  <div className="mt-3 w-full h-2 rounded-full border border-border/50 bg-transparent">
                    <div 
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartSection>
        
        <div className="mt-6 space-y-3">
          <InsightItem 
            title="Runway Status" 
            description={cashRunwayDays >= 30 ? "Healthy cash position. You're covered for the next month." : `Low runway warning. Only ${cashRunwayDays} days of operations covered.`}
            type={cashRunwayDays >= 30 ? 'success' : 'warning'}
          />
        </div>
      </ExpandableCardModal>

      {/* Feed Inventory Expanded Modal */}
      <ExpandableCardModal
        isOpen={expandedCard === 'feed'}
        onClose={() => setExpandedCard(null)}
        title="Feed Inventory"
        subtitle="Stock levels and projections"
        icon={<Package className={`w-6 h-6 ${feedStatus === 'success' ? 'text-success' : feedStatus === 'warning' ? 'text-warning' : 'text-danger'}`} />}
        accentColor={feedStatus === 'success' ? 'blue' : 'orange'}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatItem 
            label="Days Left" 
            value={daysUntilFeedRestock} 
            trend={feedStatus === 'success' ? 'up' : 'down'}
            icon={<Calendar className="w-5 h-5" />}
            accentColor={feedStatus === 'success' ? 'blue' : 'orange'}
          />
          <StatItem 
            label="Current Stock" 
            value={`${feedInventory ? feedInventory.bags_remaining * feedInventory.kg_per_bag : 0} kg`} 
            icon={<Package className="w-5 h-5" />}
          />
          <StatItem 
            label="Daily Usage" 
            value={`${feedInventory?.daily_consumption_rate || 0} kg`} 
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatItem 
            label="Bags Remaining" 
            value={feedInventory?.bags_remaining || 0}
            icon={<AlertCircle className="w-5 h-5" />}
          />
        </div>
        
        <div className="sub-card">
          <h4 className="font-semibold mb-4">Stock Level</h4>
          <div className="w-full h-4 rounded-full border border-border/50 bg-transparent">
            <div 
              className="h-full rounded-full transition-all duration-500 bg-primary"
              style={{ width: `${Math.min(100, (daysUntilFeedRestock / 30) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Empty</span>
            <span>30 days</span>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <InsightItem 
            title={feedStatus === 'danger' ? 'Critical Stock Level' : feedStatus === 'warning' ? 'Stock Running Low' : 'Stock Healthy'}
            description={
              feedStatus === 'danger' 
                ? 'Order feed immediately to avoid disruption.' 
                : feedStatus === 'warning' 
                  ? `Plan to reorder within the next ${daysUntilFeedRestock - 7} days.`
                  : 'No immediate action required. Monitor daily consumption.'
            }
            type={feedStatus === 'danger' ? 'warning' : feedStatus === 'warning' ? 'info' : 'success'}
          />
        </div>
      </ExpandableCardModal>
    </>
  );
}