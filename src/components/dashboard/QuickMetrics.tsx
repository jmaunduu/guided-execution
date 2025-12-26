import { useDashboardStore } from '@/stores/dashboardStore';
import { ArrowUp, ArrowDown, Egg, Wheat, Scale, TrendingUp } from 'lucide-react';

export function QuickMetrics() {
  const { getQuickMetrics } = useDashboardStore();
  const metrics = getQuickMetrics();
  
  const cards = [
    {
      icon: Egg,
      iconColor: 'text-warning',
      label: 'Avg Egg Price',
      value: `${metrics.avgEggPrice} KES`,
      subtext: 'Per crate',
      trend: 2.8,
    },
    {
      icon: Wheat,
      iconColor: 'text-success',
      label: 'Feed Cost/Crate',
      value: `${metrics.feedCostPerCrate} KES`,
      subtext: 'Cost to produce',
      trend: -1.5,
    },
    {
      icon: Scale,
      iconColor: 'text-info',
      label: 'Break-Even Price',
      value: `${metrics.breakEvenPrice} KES`,
      subtext: 'Minimum to profit',
      trend: 0,
      isWarning: metrics.avgEggPrice < metrics.breakEvenPrice,
    },
    {
      icon: TrendingUp,
      iconColor: 'text-success',
      label: 'Profit/Crate',
      value: `${metrics.profitPerCrate} KES`,
      subtext: 'Net profit per crate',
      trend: 5.2,
      isPositive: metrics.profitPerCrate > 0,
    },
  ];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={card.label}
            className={`card-futuristic p-5 relative group ${
              card.isWarning ? 'card-metric-warning' : 
              card.isPositive === false ? 'card-metric-danger' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="icon-glow w-10 h-10">
                <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mt-3">
              {card.value}
            </h3>
            
            <p className="text-micro text-muted-foreground mt-1">{card.subtext}</p>
            
            {card.trend !== 0 && (
              <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${
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
          </div>
        );
      })}
    </div>
  );
}