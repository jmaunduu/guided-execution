import { MetricCard } from '@/components/ui/card';
import { useDashboardStore } from '@/stores/dashboardStore';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function QuickMetrics() {
  const { getQuickMetrics } = useDashboardStore();
  const metrics = getQuickMetrics();
  
  const cards = [
    {
      icon: '🥚',
      label: 'Avg Egg Price',
      value: `${metrics.avgEggPrice} KES`,
      subtext: 'Per crate',
      trend: 2.8,
    },
    {
      icon: '🌾',
      label: 'Feed Cost/Crate',
      value: `${metrics.feedCostPerCrate} KES`,
      subtext: 'Cost to produce',
      trend: -1.5,
    },
    {
      icon: '⚖️',
      label: 'Break-Even Price',
      value: `${metrics.breakEvenPrice} KES`,
      subtext: 'Minimum to profit',
      trend: 0,
      isWarning: metrics.avgEggPrice < metrics.breakEvenPrice,
    },
    {
      icon: '💚',
      label: 'Profit/Crate',
      value: `${metrics.profitPerCrate} KES`,
      subtext: 'Net profit per crate',
      trend: 5.2,
      isPositive: metrics.profitPerCrate > 0,
    },
  ];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <MetricCard 
          key={card.label}
          interactive
          status={card.isWarning ? 'warning' : card.isPositive === false ? 'danger' : 'neutral'}
          className="relative"
        >
          <div className="flex items-start justify-between">
            <span className="text-2xl">{card.icon}</span>
          </div>
          
          <h3 className="text-2xl font-semibold text-foreground mt-3">
            {card.value}
          </h3>
          
          <p className="text-micro text-muted-foreground mt-1">{card.subtext}</p>
          
          {card.trend !== 0 && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              card.trend > 0 ? 'text-success' : 'text-danger'
            }`}>
              {card.trend > 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              <span>{Math.abs(card.trend)}% vs last month</span>
            </div>
          )}
          
          <p className="text-label text-muted-foreground mt-3">{card.label}</p>
        </MetricCard>
      ))}
    </div>
  );
}
