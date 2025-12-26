import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/stores/dashboardStore';
import { TrendAreaChart } from '@/components/charts/TrendAreaChart';
import { Sparkline } from '@/components/charts/Sparkline';
import { Download, LineChart, BarChart3, AreaChart, TrendingUp, TrendingDown, DollarSign, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatKES } from '@/lib/formatters';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type ChartType = 'line' | 'bar' | 'area';

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

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ElementType;
  color: string;
  data: number[];
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

function MetricCard({ title, value, trend, icon: Icon, color, data, chartType, onChartTypeChange }: MetricCardProps) {
  const chartData = data.map((val, i) => ({ value: val, day: `Day ${i + 1}` }));
  
  return (
    <Card className="card-glass">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 text-${color}`} />
            <span className={`text-xs font-medium ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChartTypeChange('line')}
              className={`p-1 rounded transition-colors ${chartType === 'line' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChartTypeChange('bar')}
              className={`p-1 rounded transition-colors ${chartType === 'bar' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChartTypeChange('area')}
              className={`p-1 rounded transition-colors ${chartType === 'area' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <AreaChart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-xs text-muted-foreground mb-3">{title}</p>
        
        {/* Mini Chart */}
        <div className="h-16">
          {chartType === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar 
                  dataKey="value" 
                  fill={color === 'primary' ? '#3B82F6' : color === 'success' ? '#3B82F6' : color === 'warning' ? '#F97316' : '#3B82F6'}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Sparkline 
              data={data} 
              color={color === 'warning' ? 'orange' : 'blue'} 
              height={64} 
              showArea={chartType === 'area'}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState(getLastMonths(12)[0].value);
  const [cardChartTypes, setCardChartTypes] = useState<Record<string, ChartType>>({
    revenue: 'area',
    profit: 'area',
    expenses: 'area',
    cashflow: 'area',
  });
  
  const { getTrendData, getCostBreakdown, getTodayMetrics, getLast7DaysRevenue, getLast7DaysProfit } = useDashboardStore();
  const trendData = getTrendData();
  const costBreakdown = getCostBreakdown();
  const todayMetrics = getTodayMetrics();
  const last7DaysRevenue = getLast7DaysRevenue();
  const last7DaysProfit = getLast7DaysProfit();

  // Generate expense data from trend data
  const last7DaysExpenses = trendData.slice(-7).map(d => d.expenses);
  const last7DaysCashFlow = trendData.slice(-7).map(d => d.revenue - d.expenses);

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
  };

  const handleCardChartTypeChange = (cardKey: string, type: ChartType) => {
    setCardChartTypes(prev => ({ ...prev, [cardKey]: type }));
  };

  const summaryCards = [
    {
      key: 'revenue',
      title: 'Total Revenue',
      value: formatKES(trendData.reduce((sum, d) => sum + d.revenue, 0)),
      trend: todayMetrics.revenueChange,
      icon: DollarSign,
      color: 'primary',
      data: last7DaysRevenue,
    },
    {
      key: 'profit',
      title: 'Total Profit',
      value: formatKES(trendData.reduce((sum, d) => sum + d.profit, 0)),
      trend: todayMetrics.profitChange,
      icon: TrendingUp,
      color: 'success',
      data: last7DaysProfit,
    },
    {
      key: 'expenses',
      title: 'Total Expenses',
      value: formatKES(costBreakdown.total),
      trend: -5.2,
      icon: TrendingDown,
      color: 'warning',
      data: last7DaysExpenses,
    },
    {
      key: 'cashflow',
      title: 'Net Cash Flow',
      value: formatKES(trendData.reduce((sum, d) => sum + d.revenue - d.expenses, 0)),
      trend: 8.3,
      icon: ArrowUpDown,
      color: 'info',
      data: last7DaysCashFlow,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <Card className="card-glass">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
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

      {/* Main Revenue Chart - Last 7 Days */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-lg">Revenue - Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData.slice(-7).map((d, i) => ({ 
                ...d, 
                day: new Date(d.date).toLocaleDateString('en-KE', { weekday: 'short' })
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 30% 20%)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }}
                  axisLine={{ stroke: 'hsl(217 30% 18%)' }}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => formatKES(value)}
                  tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card/95 backdrop-blur-md p-3 rounded-xl shadow-modal border border-primary/20">
                          <p className="text-xs text-muted-foreground mb-1">{label}</p>
                          <p className="text-sm font-bold text-primary">{formatKES(payload[0]?.value as number)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards with Individual Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <MetricCard
            key={card.key}
            title={card.title}
            value={card.value}
            trend={card.trend}
            icon={card.icon}
            color={card.color}
            data={card.data}
            chartType={cardChartTypes[card.key]}
            onChartTypeChange={(type) => handleCardChartTypeChange(card.key, type)}
          />
        ))}
      </div>

      {/* Detailed Trend Chart */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-lg">30-Day Trend Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <TrendAreaChart data={trendData} height={320} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
