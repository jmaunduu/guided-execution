import { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { formatKES } from '@/lib/formatters';
import { 
  ChevronDown, 
  ChevronUp, 
  Wallet, 
  Smartphone, 
  Building2, 
  Landmark,
  Banknote,
  AlertCircle
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

export function CashAvailableCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getCashOnHand, bankBalances, expenses } = useDashboardStore();
  
  const cashOnHand = getCashOnHand();
  
  // Calculate cash runway days
  const avgDailyExpenses = expenses.slice(0, 30).reduce((sum, e) => sum + e.amount, 0) / 30;
  const cashRunwayDays = avgDailyExpenses > 0 ? Math.floor(cashOnHand / avgDailyExpenses) : 999;
  
  // Determine status
  const getStatus = () => {
    if (cashRunwayDays >= 30) return 'success';
    if (cashRunwayDays >= 10) return 'warning';
    return 'danger';
  };
  
  const status = getStatus();
  
  const getStatusBorder = () => {
    if (status === 'success') return 'card-metric-success';
    if (status === 'warning') return 'card-metric-warning';
    return 'card-metric-danger';
  };
  
  return (
    <div 
      className={`card-futuristic p-6 cursor-pointer ${getStatusBorder()}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label text-muted-foreground mb-2">Cash Available</p>
          <h2 className="text-4xl lg:text-hero font-bold text-foreground tracking-tight animate-count-up">
            {formatKES(cashOnHand)}
          </h2>
          <p className="text-micro text-muted-foreground mt-1">KES</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="icon-glow w-10 h-10">
            <Wallet className="w-5 h-5 text-info" />
          </div>
          <button 
            className="p-1.5 rounded-full bg-secondary hover:bg-accent transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-info" />
            ) : (
              <ChevronDown className="w-4 h-4 text-info" />
            )}
          </button>
        </div>
      </div>
      
      {/* Cash runway status */}
      <div className={`mt-4 flex items-center gap-2 text-sm ${
        status === 'success' ? 'text-success' :
        status === 'warning' ? 'text-warning' :
        'text-danger'
      }`}>
        {cashRunwayDays < 30 && (
          <AlertCircle className="w-4 h-4" />
        )}
        <span className="font-medium">
          Covers {cashRunwayDays} days of operations
        </span>
      </div>
      
      {/* Expandable bank breakdown */}
      <div 
        className={`overflow-hidden transition-all duration-400 ease-smooth ${
          isExpanded ? 'max-h-[400px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 gap-3">
          {bankBalances.map((balance, index) => {
            const IconComponent = BANK_ICONS[balance.account] || Wallet;
            const colorClass = BANK_COLORS[balance.account] || 'text-muted-foreground';
            const percentage = cashOnHand > 0 
              ? ((balance.balance / cashOnHand) * 100).toFixed(1) 
              : '0';
            
            return (
              <div 
                key={balance.account}
                className="sub-card group"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-secondary group-hover:bg-accent transition-colors`}>
                    <IconComponent className={`w-4 h-4 ${colorClass}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground capitalize">
                    {balance.account === 'mpesa' ? 'M-Pesa' : balance.account.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-foreground">
                    {formatKES(balance.balance)}
                  </span>
                  <span className="metric-badge metric-badge-info text-[10px]">
                    {percentage}%
                  </span>
                </div>
                
                {/* Mini progress bar */}
                <div className="mt-3 w-full bg-secondary rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      balance.account === 'mpesa' ? 'bg-success' :
                      balance.account === 'kcb' ? 'bg-info' :
                      balance.account === 'absa' ? 'bg-warning' :
                      'bg-muted-foreground'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}