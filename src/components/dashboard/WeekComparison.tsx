import { useDashboardStore } from '@/stores/dashboardStore';
import { formatKES, formatPercentage } from '@/lib/formatters';
import { ArrowUp, ArrowDown, Minus, Calendar } from 'lucide-react';

export function WeekComparison() {
  const { getWeekComparison } = useDashboardStore();
  const comparison = getWeekComparison();
  
  const rows = [
    { 
      label: 'Revenue', 
      thisWeek: comparison.thisWeek.revenue, 
      lastWeek: comparison.lastWeek.revenue,
      change: comparison.percentageChanges.revenue,
      isBetter: comparison.thisWeek.revenue > comparison.lastWeek.revenue,
    },
    { 
      label: 'Costs', 
      thisWeek: comparison.thisWeek.costs, 
      lastWeek: comparison.lastWeek.costs,
      change: comparison.percentageChanges.costs,
      isBetter: comparison.thisWeek.costs < comparison.lastWeek.costs,
      invertColor: true,
    },
    { 
      label: 'Profit', 
      thisWeek: comparison.thisWeek.profit, 
      lastWeek: comparison.lastWeek.profit,
      change: comparison.percentageChanges.profit,
      isBetter: comparison.thisWeek.profit > comparison.lastWeek.profit,
    },
    { 
      label: 'Crates Sold', 
      thisWeek: comparison.thisWeek.crates, 
      lastWeek: comparison.lastWeek.crates,
      change: comparison.percentageChanges.crates,
      isBetter: comparison.thisWeek.crates > comparison.lastWeek.crates,
      isCount: true,
    },
  ];
  
  const getChangeColor = (change: number, invertColor = false) => {
    if (change === 0) return 'text-muted-foreground';
    const positive = invertColor ? change < 0 : change > 0;
    return positive ? 'text-success' : 'text-danger';
  };
  
  const getChangeBadge = (change: number, invertColor = false) => {
    if (change === 0) return 'bg-secondary text-muted-foreground';
    const positive = invertColor ? change < 0 : change > 0;
    return positive ? 'metric-badge-success' : 'metric-badge-danger';
  };
  
  const getChangeIcon = (change: number) => {
    if (change === 0) return <Minus className="w-3 h-3" />;
    return change > 0 
      ? <ArrowUp className="w-3 h-3" /> 
      : <ArrowDown className="w-3 h-3" />;
  };
  
  return (
    <div className="card-futuristic overflow-hidden">
      <div className="p-5 pb-0 flex items-center gap-3">
        <div className="icon-glow w-10 h-10">
          <Calendar className="w-5 h-5 text-info" />
        </div>
        <h2 className="text-heading">This Week vs Last Week</h2>
      </div>
      
      <div className="p-5 pt-4">
        <div className="overflow-x-auto">
          <table className="table-futuristic">
            <thead>
              <tr>
                <th className="text-left text-label text-muted-foreground font-medium p-4 pb-3"></th>
                <th className="text-right text-label text-muted-foreground font-medium p-4 pb-3">This Week</th>
                <th className="text-right text-label text-muted-foreground font-medium p-4 pb-3">Last Week</th>
                <th className="text-right text-label text-muted-foreground font-medium p-4 pb-3">Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="p-4 py-4">
                    <span className="font-medium text-sm">{row.label}</span>
                  </td>
                  <td className={`p-4 py-4 text-right font-semibold text-sm ${
                    row.isBetter ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {row.isCount 
                      ? row.thisWeek.toLocaleString() 
                      : `${formatKES(row.thisWeek)} KES`
                    }
                  </td>
                  <td className={`p-4 py-4 text-right text-sm ${
                    !row.isBetter ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {row.isCount 
                      ? row.lastWeek.toLocaleString() 
                      : `${formatKES(row.lastWeek)} KES`
                    }
                  </td>
                  <td className="p-4 py-4 text-right">
                    <span className={`metric-badge ${getChangeBadge(row.change, row.invertColor)}`}>
                      {getChangeIcon(row.change)}
                      {formatPercentage(row.change)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}