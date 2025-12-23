import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDashboardStore } from '@/stores/dashboardStore';
import { formatKES, formatPercentage } from '@/lib/formatters';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

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
      isBetter: comparison.thisWeek.costs < comparison.lastWeek.costs, // Lower is better for costs
      invertColor: true, // Lower costs = green, higher = red
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
  
  const getChangeIcon = (change: number) => {
    if (change === 0) return <Minus className="w-3 h-3" />;
    return change > 0 
      ? <ArrowUp className="w-3 h-3" /> 
      : <ArrowDown className="w-3 h-3" />;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-heading">This Week vs Last Week</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-label text-muted-foreground font-medium p-4 pb-3"></th>
                <th className="text-right text-label text-muted-foreground font-medium p-4 pb-3">This Week</th>
                <th className="text-right text-label text-muted-foreground font-medium p-4 pb-3">Last Week</th>
                <th className="text-right text-label text-muted-foreground font-medium p-4 pb-3">Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr 
                  key={row.label}
                  className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                    index % 2 === 1 ? 'bg-muted/20' : ''
                  }`}
                >
                  <td className="p-4 py-4">
                    <span className="font-medium text-sm">{row.label}</span>
                  </td>
                  <td className={`p-4 py-4 text-right font-semibold text-sm ${
                    row.isBetter ? 'text-foreground' : ''
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
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      getChangeColor(row.change, row.invertColor)
                    } ${
                      row.change !== 0 
                        ? (row.invertColor 
                            ? (row.change < 0 ? 'bg-success/10' : 'bg-danger/10')
                            : (row.change > 0 ? 'bg-success/10' : 'bg-danger/10')
                          )
                        : 'bg-muted'
                    }`}>
                      {getChangeIcon(row.change)}
                      {formatPercentage(row.change)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
