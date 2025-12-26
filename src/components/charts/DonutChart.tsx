import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatKES } from '@/lib/formatters';
import type { CostBreakdown } from '@/types/dashboard';
import { Wheat, Users, Package, MoreHorizontal } from 'lucide-react';

interface DonutChartProps {
  data: CostBreakdown;
  className?: string;
  height?: number;
}

// Blue/Orange/Purple/Cyan color palette
const COLORS = {
  feeds: '#3B82F6',      // Primary blue
  salaries: '#F97316',   // Secondary orange
  supplies: '#8B5CF6',   // Purple
  miscellaneous: '#06B6D4', // Cyan
};

const ICONS = {
  feeds: Wheat,
  salaries: Users,
  supplies: Package,
  miscellaneous: MoreHorizontal,
};

const LABELS = {
  feeds: 'Feeds',
  salaries: 'Salaries',
  supplies: 'Supplies',
  miscellaneous: 'Misc',
};

export function DonutChart({ data, className = '', height = 280 }: DonutChartProps) {
  const chartData = [
    { name: 'feeds', value: data.feeds, label: LABELS.feeds },
    { name: 'salaries', value: data.salaries, label: LABELS.salaries },
    { name: 'supplies', value: data.supplies, label: LABELS.supplies },
    { name: 'miscellaneous', value: data.miscellaneous, label: LABELS.miscellaneous },
  ].filter(item => item.value > 0);
  
  const renderCustomLabel = ({ cx, cy }: { cx: number; cy: number }) => {
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} y={cy - 10} fontSize="22" fontWeight="700" fill="hsl(210 40% 98%)">
          {formatKES(data.total)}
        </tspan>
        <tspan x={cx} y={cy + 14} fontSize="11" fill="hsl(215 20% 55%)">
          Total Costs
        </tspan>
      </text>
    );
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload?.map((entry: any, index: number) => {
          const Icon = ICONS[entry.value as keyof typeof ICONS];
          return (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {LABELS[entry.value as keyof typeof LABELS]}
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <defs>
            {Object.entries(COLORS).map(([key, color]) => (
              <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1}/>
                <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            isAnimationActive={true}
            animationDuration={800}
            stroke="hsl(222 40% 9%)"
            strokeWidth={2}
          >
            {chartData.map((entry) => (
              <Cell 
                key={`cell-${entry.name}`} 
                fill={`url(#gradient-${entry.name})`}
                className="hover:opacity-90 transition-opacity cursor-pointer"
                style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' }}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                const percentage = ((item.value / data.total) * 100).toFixed(1);
                const Icon = ICONS[item.name as keyof typeof ICONS];
                return (
                  <div className="bg-card/95 backdrop-blur-md p-4 rounded-xl shadow-modal border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" style={{ color: COLORS[item.name as keyof typeof COLORS] }} />
                      <p className="text-sm font-medium">{item.label}</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {formatKES(item.value)} KES
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage}% of total
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            content={CustomLegend}
            verticalAlign="bottom"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
