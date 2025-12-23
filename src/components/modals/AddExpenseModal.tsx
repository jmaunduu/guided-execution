import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDashboardStore } from '@/stores/dashboardStore';
import { toast } from 'sonner';
import type { ExpenseCategory, PaymentMethod } from '@/types/dashboard';

export function AddExpenseModal() {
  const { isExpenseModalOpen, closeExpenseModal, addExpense } = useDashboardStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'feeds' as ExpenseCategory,
    amount: '',
    payment_method: 'mpesa' as PaymentMethod,
    notes: '',
  });
  
  const categories: { value: ExpenseCategory; label: string; icon: string }[] = [
    { value: 'feeds', label: 'Feeds', icon: '🌾' },
    { value: 'salaries', label: 'Salaries', icon: '💰' },
    { value: 'supplies', label: 'Supplies', icon: '🏥' },
    { value: 'miscellaneous', label: 'Miscellaneous', icon: '📦' },
  ];
  
  const paymentMethods: { value: PaymentMethod; label: string; icon: string }[] = [
    { value: 'mpesa', label: 'M-Pesa', icon: '📱' },
    { value: 'kcb', label: 'KCB Bank', icon: '🏦' },
    { value: 'absa', label: 'Absa Bank', icon: '🏦' },
    { value: 'cash', label: 'Cash', icon: '💵' },
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addExpense({
        date: formData.date,
        category: formData.category,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        notes: formData.notes || undefined,
      });
      
      toast.success(`Expense added: ${parseFloat(formData.amount).toLocaleString()} KES`);
      closeExpenseModal();
      setFormData({ date: new Date().toISOString().split('T')[0], category: 'feeds', amount: '', payment_method: 'mpesa', notes: '' });
    } catch {
      toast.error('Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isExpenseModalOpen} onOpenChange={closeExpenseModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-heading">Add Expense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" value={formData.date} max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="mt-1.5" />
          </div>
          
          <div>
            <Label>Category</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {categories.map((cat) => (
                <button key={cat.value} type="button"
                  className={`flex items-center gap-2 p-3 rounded-button border-2 transition-all ${
                    formData.category === cat.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setFormData({ ...formData, category: cat.value })}>
                  <span>{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input type="number" id="amount" placeholder="45000" value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="mt-1.5 text-lg font-semibold" />
          </div>
          
          <div>
            <Label>Payment Method</Label>
            <div className="space-y-2 mt-1.5">
              {paymentMethods.map((method) => (
                <label key={method.value}
                  className={`flex items-center gap-3 p-3 rounded-button border-2 cursor-pointer transition-all ${
                    formData.payment_method === method.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                  <input type="radio" name="payment_method" value={method.value} checked={formData.payment_method === method.value}
                    onChange={() => setFormData({ ...formData, payment_method: method.value })} className="sr-only" />
                  <span>{method.icon}</span>
                  <span className="text-sm font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input type="text" id="notes" placeholder="Supplier name, details..." value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="mt-1.5" />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeExpenseModal} className="flex-1">Cancel</Button>
            <Button type="submit" variant="success" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : 'Save Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
