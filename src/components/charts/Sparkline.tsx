import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SparklineProps {
  data: number[];
  color?: 'blue' | 'orange';
  height?: number;
  className?: string;
  showArea?: boolean;
}

const COLORS = {
  blue: {
    stroke: '#3B82F6',
    gradient: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0)'],
  },
  orange: {
    stroke: '#F97316',
    gradient: ['rgba(249, 115, 22, 0.3)', 'rgba(249, 115, 22, 0)'],
  },
};

export function Sparkline({ 
  data, 
  color = 'blue', 
  height = 40, 
  className = '',
  showArea = true 
}: SparklineProps) {
  // Convert array of numbers to chart data format
  const chartData = data.map((value, index) => ({ value, index }));
  const colorConfig = COLORS[color];
  
  if (data.length === 0) {
    return <div className={`h-[${height}px] ${className}`} />;
  }
  
  if (showArea) {
    return (
      <div className={className} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`sparklineGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorConfig.gradient[0]} stopOpacity={1}/>
                <stop offset="95%" stopColor={colorConfig.gradient[1]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={colorConfig.stroke}
              strokeWidth={2}
              fill={`url(#sparklineGradient-${color})`}
              isAnimationActive={true}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={colorConfig.stroke}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
