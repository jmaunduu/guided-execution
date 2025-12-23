import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}

export function Sparkline({ data, color = '#3B82F6', height = 40, className = '' }: SparklineProps) {
  // Convert array of numbers to chart data format
  const chartData = data.map((value, index) => ({ value, index }));
  
  if (data.length === 0) {
    return <div className={`h-[${height}px] ${className}`} />;
  }
  
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
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
