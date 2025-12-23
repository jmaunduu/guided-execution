import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatKES, formatDateShort } from '@/lib/formatters';
import type { DailyDataPoint } from '@/types/dashboard';

interface TrendAreaChartProps {
  data: DailyDataPoint[];
  className?: string;
}

export function TrendAreaChart({ data, className = '' }: TrendAreaChartProps) {
  // Show every 5th label to avoid crowding
  const formatXAxis = (dateStr: string, index: number) => {
    if (index % 5 !== 0) return '';
    return formatDateShort(dateStr);
  };
  
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={(value) => formatKES(value)}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card p-3 rounded-lg shadow-farm-md border border-border">
                    <p className="text-xs text-muted-foreground mb-2">{formatDateShort(label)}</p>
                    <p className="text-sm font-medium text-info">
                      Revenue: {formatKES(payload[0]?.value as number)} KES
                    </p>
                    <p className="text-sm font-medium text-success">
                      Profit: {formatKES(payload[1]?.value as number)} KES
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            isAnimationActive={true}
            animationDuration={1000}
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#10B981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorProfit)"
            isAnimationActive={true}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
