import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatKES, formatDateShort } from '@/lib/formatters';
import type { DailyDataPoint } from '@/types/dashboard';

interface TrendAreaChartProps {
  data: DailyDataPoint[];
  className?: string;
  height?: number;
}

export function TrendAreaChart({ data, className = '', height = 250 }: TrendAreaChartProps) {
  // Show every 5th label to avoid crowding
  const formatXAxis = (dateStr: string, index: number) => {
    if (index % 5 !== 0) return '';
    return formatDateShort(dateStr);
  };
  
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {/* Blue gradient for revenue */}
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            {/* Orange gradient for profit */}
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
              <stop offset="50%" stopColor="#F97316" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
            </linearGradient>
            {/* Glow filter for lines */}
            <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(217 30% 20%)" 
            vertical={false} 
          />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }}
            axisLine={{ stroke: 'hsl(217 30% 18%)' }}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={(value) => formatKES(value)}
            tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card/95 backdrop-blur-md p-4 rounded-xl shadow-modal border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-2">{formatDateShort(label)}</p>
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium text-primary flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Revenue: {formatKES(payload[0]?.value as number)} KES
                      </p>
                      <p className="text-sm font-medium text-secondary flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        Profit: {formatKES(payload[1]?.value as number)} KES
                      </p>
                    </div>
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
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            isAnimationActive={true}
            animationDuration={1000}
            filter="url(#glow-blue)"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#F97316"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorProfit)"
            isAnimationActive={true}
            animationDuration={1000}
            filter="url(#glow-orange)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
