import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardStore } from '@/stores/dashboardStore';
import { TrendAreaChart } from '@/components/charts/TrendAreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { Download, LineChart, BarChart3, PieChart, TrendingUp, TrendingDown, DollarSign, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatKES } from '@/lib/formatters';

const chartTypes = [
  { value: 'line', label: 'Line', icon: LineChart },
  { value: 'bar', label: 'Bar', icon: BarChart3 },
  { value: 'pie', label: 'Pie', icon: PieChart },
];

const metrics = ['Revenue', 'Profit', 'Expenses', 'Cash Flow', 'All'];

const getLastMonths = (count: number) => {
  const months = [];
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({
      value: date.toISOString().slice(0, 7),
      label: date.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }),
    });
  }
  return months;
};

const Analytics = () => {
  const [chartType, setChartType] = useState('line');
  const [selectedMonth, setSelectedMonth] = useState(getLastMonths(12)[0].value);
  const [selectedMetric, setSelectedMetric] = useState('All');
  
  const { getTrendData, getCostBreakdown, getTodayMetrics } = useDashboardStore();
  const trendData = getTrendData();
  const costBreakdown = getCostBreakdown();
  const todayMetrics = getTodayMetrics();

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
    // Export logic would go here
  };

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatKES(trendData.reduce((sum, d) => sum + d.revenue, 0)),
      trend: todayMetrics.revenueChange,
      icon: DollarSign,
      color: 'primary',
    },
    {
      title: 'Total Profit',
      value: formatKES(trendData.reduce((sum, d) => sum + d.profit, 0)),
      trend: todayMetrics.profitChange,
      icon: TrendingUp,
      color: 'success',
    },
    {
      title: 'Total Expenses',
      value: formatKES(costBreakdown.total),
      trend: -5.2,
      icon: TrendingDown,
      color: 'warning',
    },
    {
      title: 'Net Cash Flow',
      value: formatKES(trendData.reduce((sum, d) => sum + d.revenue - d.expenses, 0)),
      trend: 8.3,
      icon: ArrowUpDown,
      color: 'info',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <Card className="card-glass">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Chart Type Selector */}
            <Tabs value={chartType} onValueChange={setChartType}>
              <TabsList className="bg-muted/50">
                {chartTypes.map((type) => (
                  <TabsTrigger key={type.value} value={type.value} className="gap-2">
                    <type.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{type.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Month Selector */}
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48 bg-muted/50 border-border/50">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {getLastMonths(12).map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Metric Selector */}
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40 bg-muted/50 border-border/50">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric} value={metric}>
                    {metric}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 ml-auto">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('png')}>PNG</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="card-glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <card.icon className={`w-5 h-5 text-${card.color}`} />
                <span className={`text-xs font-medium ${card.trend >= 0 ? 'text-success' : 'text-danger'}`}>
                  {card.trend >= 0 ? '+' : ''}{card.trend.toFixed(1)}%
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedMetric === 'All' ? 'All Metrics' : selectedMetric} Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartType === 'pie' ? (
            <div className="h-80 flex items-center justify-center">
              <DonutChart data={costBreakdown} height={320} />
            </div>
          ) : (
            <div className="h-80">
              <TrendAreaChart data={trendData} height={320} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
