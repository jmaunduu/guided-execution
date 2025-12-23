import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/stores/dashboardStore';
import { formatKES, formatDateStacked } from '@/lib/formatters';
import { CATEGORY_CONFIG } from '@/types/dashboard';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function RecentExpenses() {
  const { getRecentExpenses, deleteExpense, openExpenseModal } = useDashboardStore();
  const [swipedId, setSwipedId] = useState<string | null>(null);
  
  const recentExpenses = getRecentExpenses(10);
  
  const handleDelete = (id: string) => {
    deleteExpense(id);
    setSwipedId(null);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-heading">Recent Expenses</CardTitle>
        <Button 
          variant="success" 
          size="sm"
          onClick={openExpenseModal}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-label text-muted-foreground font-medium p-4 py-3 w-16">Date</th>
                <th className="text-left text-label text-muted-foreground font-medium p-4 py-3">Category</th>
                <th className="text-right text-label text-muted-foreground font-medium p-4 py-3">Amount</th>
                <th className="text-left text-label text-muted-foreground font-medium p-4 py-3 hidden sm:table-cell">Notes</th>
                <th className="w-12 p-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((expense, index) => {
                const dateInfo = formatDateStacked(expense.date);
                const config = CATEGORY_CONFIG[expense.category];
                const isHighValue = expense.amount > 50000;
                
                return (
                  <tr 
                    key={expense.id}
                    className={`border-b border-border last:border-0 transition-colors ${
                      index % 2 === 1 ? 'bg-muted/10' : ''
                    } ${
                      isHighValue ? 'bg-danger/5' : ''
                    }`}
                  >
                    <td className="p-4 py-3">
                      <div className="flex flex-col items-center justify-center w-12">
                        <span className="text-micro text-muted-foreground uppercase">{dateInfo.month}</span>
                        <span className="text-lg font-semibold text-foreground">{dateInfo.day}</span>
                      </div>
                    </td>
                    <td className="p-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-${config.color}/10`}>
                          {config.icon}
                        </span>
                        <span className="font-medium text-sm">{config.label}</span>
                      </div>
                    </td>
                    <td className={`p-4 py-3 text-right font-semibold text-sm ${
                      isHighValue ? 'text-danger' : 'text-foreground'
                    }`}>
                      {formatKES(expense.amount, true)} <span className="text-muted-foreground font-normal">KES</span>
                    </td>
                    <td className="p-4 py-3 text-sm text-muted-foreground hidden sm:table-cell max-w-[150px] truncate">
                      {expense.notes || '—'}
                    </td>
                    <td className="p-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-danger"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              
              {recentExpenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <p className="mb-2">No expenses recorded yet</p>
                    <Button variant="success" size="sm" onClick={openExpenseModal}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add First Expense
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
