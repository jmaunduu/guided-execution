import { useDashboardStore } from '@/stores/dashboardStore';
import { formatKES } from '@/lib/formatters';
import { Sparkline } from '@/components/charts/Sparkline';
import { CashAvailableCard } from './CashAvailableCard';
import { 
  ArrowUp, 
  ArrowDown, 
  AlertCircle, 
  TrendingUp,
  BarChart3,
  Package,
} from 'lucide-react';

export function HeroMetrics() {
  const { 
    getTodayMetrics, 
    getDaysUntilFeedRestock,
    getLast7DaysRevenue,
    getLast7DaysProfit,
  } = useDashboardStore();
  
  const todayMetrics = getTodayMetrics();
  const daysUntilFeedRestock = getDaysUntilFeedRestock();
  const last7DaysRevenue = getLast7DaysRevenue();
  const last7DaysProfit = getLast7DaysProfit();
  
  const getFeedStatus = () => {
    if (daysUntilFeedRestock >= 14) return 'success';
    if (daysUntilFeedRestock >= 7) return 'warning';
    return 'danger';
  };
  
  const feedStatus = getFeedStatus();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Revenue */}
      <div className="card-futuristic p-6 relative overflow-hidden group">
        <div className="flex items-start justify-between mb-2">
          <p className="text-label text-muted-foreground">Today's Revenue</p>
          <div className="icon-glow w-10 h-10">
            <TrendingUp className="w-5 h-5 text-info" />
          </div>
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
        
        <Sparkline 
          data={last7DaysRevenue} 
          color="#3B82F6"
          height={40}
          className="mt-4"
        />
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-info/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Today's Profit */}
      <div className={`card-futuristic p-6 relative overflow-hidden group ${
        todayMetrics.profit >= 0 ? 'card-metric-success' : 'card-metric-danger'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <p className="text-label text-muted-foreground">Today's Profit</p>
          <div className={`icon-glow w-10 h-10 ${
            todayMetrics.profit >= 0 
              ? 'bg-success/10' 
              : 'bg-danger/10'
          }`}>
            <BarChart3 className={`w-5 h-5 ${
              todayMetrics.profit >= 0 ? 'text-success' : 'text-danger'
            }`} />
          </div>
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
        
        <Sparkline 
          data={last7DaysProfit} 
          color={todayMetrics.profit >= 0 ? "#10B981" : "#EF4444"}
          height={40}
          className="mt-4"
        />
        
        {/* Decorative gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          todayMetrics.profit >= 0 
            ? 'from-success/5 to-transparent' 
            : 'from-danger/5 to-transparent'
        }`} />
      </div>
      
      {/* Cash Available - Expandable */}
      <CashAvailableCard />
      
      {/* Feed Inventory */}
      <div className={`card-futuristic p-6 relative overflow-hidden group ${
        feedStatus === 'success' ? 'card-metric-success' :
        feedStatus === 'warning' ? 'card-metric-warning' :
        'card-metric-danger'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <p className="text-label text-muted-foreground">Feed Inventory</p>
          <div className={`icon-glow w-10 h-10 ${
            feedStatus === 'success' ? 'bg-success/10' :
            feedStatus === 'warning' ? 'bg-warning/10' :
            'bg-danger/10'
          }`}>
            <Package className={`w-5 h-5 ${
              feedStatus === 'success' ? 'text-success' :
              feedStatus === 'warning' ? 'text-warning' :
              'text-danger'
            }`} />
          </div>
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
        
        {/* Decorative gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          feedStatus === 'success' ? 'from-success/5 to-transparent' :
          feedStatus === 'warning' ? 'from-warning/5 to-transparent' :
          'from-danger/5 to-transparent'
        }`} />
      </div>
    </div>
  );
}