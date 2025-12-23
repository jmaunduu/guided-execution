import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Plus, DollarSign } from 'lucide-react';

export function FAB() {
  const { openExpenseModal, openRevenueModal } = useDashboardStore();
  
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      {/* Record Revenue FAB */}
      <Button
        variant="fabSuccess"
        size="fab"
        onClick={openRevenueModal}
        className="group relative"
        aria-label="Record Revenue"
      >
        <DollarSign className="w-6 h-6" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-card text-foreground text-sm font-medium rounded-lg shadow-farm-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Record Sale
        </span>
      </Button>
      
      {/* Add Expense FAB */}
      <Button
        variant="fabDanger"
        size="fab"
        onClick={openExpenseModal}
        className="group relative"
        aria-label="Add Expense"
      >
        <Plus className="w-6 h-6" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-card text-foreground text-sm font-medium rounded-lg shadow-farm-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Add Expense
        </span>
      </Button>
    </div>
  );
}
