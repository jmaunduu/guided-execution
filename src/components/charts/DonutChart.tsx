import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatKES } from '@/lib/formatters';
import type { CostBreakdown } from '@/types/dashboard';

interface DonutChartProps {
  data: CostBreakdown;
  className?: string;
}

const COLORS = {
  feeds: '#EF4444',      // Red - biggest expense
  salaries: '#3B82F6',   // Blue
  supplies: '#F59E0B',   // Amber
  miscellaneous: '#10B981', // Green
};

const LABELS = {
  feeds: '🌾 Feeds',
  salaries: '💰 Salaries',
  supplies: '🏥 Supplies',
  miscellaneous: '📦 Misc',
};

export function DonutChart({ data, className = '' }: DonutChartProps) {
  const chartData = [
    { name: 'feeds', value: data.feeds, label: LABELS.feeds },
    { name: 'salaries', value: data.salaries, label: LABELS.salaries },
    { name: 'supplies', value: data.supplies, label: LABELS.supplies },
    { name: 'miscellaneous', value: data.miscellaneous, label: LABELS.miscellaneous },
  ].filter(item => item.value > 0);
  
  const renderCustomLabel = ({ cx, cy }: { cx: number; cy: number }) => {
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} y={cy - 8} fontSize="24" fontWeight="600" fill="#111827">
          {formatKES(data.total)}
        </tspan>
        <tspan x={cx} y={cy + 14} fontSize="12" fill="#6B7280">
          Total Costs
        </tspan>
      </text>
    );
  };
  
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            isAnimationActive={true}
            animationDuration={800}
          >
            {chartData.map((entry) => (
              <Cell 
                key={`cell-${entry.name}`} 
                fill={COLORS[entry.name as keyof typeof COLORS]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                const percentage = ((item.value / data.total) * 100).toFixed(1);
                return (
                  <div className="bg-card p-3 rounded-lg shadow-farm-md border border-border">
                    <p className="text-sm font-medium mb-1">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatKES(item.value)} KES ({percentage}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => LABELS[value as keyof typeof LABELS]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
