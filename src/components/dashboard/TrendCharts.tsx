import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendAreaChart } from '@/components/charts/TrendAreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { useDashboardStore } from '@/stores/dashboardStore';

export function TrendCharts() {
  const { getTrendData, getCostBreakdown } = useDashboardStore();
  const trendData = getTrendData();
  const costBreakdown = getCostBreakdown();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Revenue & Profit Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-heading">30-Day Revenue & Profit</CardTitle>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-info" />
              <span className="text-micro text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-micro text-muted-foreground">Profit</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <TrendAreaChart data={trendData} />
        </CardContent>
      </Card>
      
      {/* Cost Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-heading">Cost Breakdown (30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <DonutChart data={costBreakdown} />
        </CardContent>
      </Card>
    </div>
  );
}
