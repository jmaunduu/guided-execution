import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDashboardStore } from '@/stores/dashboardStore';
import { toast } from 'sonner';
import type { ProductType, PaymentMethod, PaymentStatus } from '@/types/dashboard';

export function AddRevenueModal() {
  const { isRevenueModalOpen, closeRevenueModal, addRevenue } = useDashboardStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    product_type: 'eggs' as ProductType,
    quantity: '',
    unit_price: '360',
    customer_name: '',
    payment_method: 'mpesa' as PaymentMethod,
    payment_status: 'paid' as PaymentStatus,
  });
  
  const totalAmount = parseFloat(formData.quantity || '0') * parseFloat(formData.unit_price || '0');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      toast.error('Please enter quantity');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const dueDate = formData.payment_status === 'pending' 
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : undefined;
        
      await addRevenue({
        date: formData.date,
        product_type: formData.product_type,
        quantity: parseFloat(formData.quantity),
        unit_price: parseFloat(formData.unit_price),
        total_amount: totalAmount,
        customer_name: formData.customer_name || undefined,
        payment_method: formData.payment_method,
        payment_status: formData.payment_status,
        due_date: dueDate,
      });
      
      toast.success(`Sale recorded: ${totalAmount.toLocaleString()} KES`);
      closeRevenueModal();
      setFormData({ date: new Date().toISOString().split('T')[0], product_type: 'eggs', quantity: '', unit_price: '360', customer_name: '', payment_method: 'mpesa', payment_status: 'paid' });
    } catch {
      toast.error('Failed to record sale');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isRevenueModalOpen} onOpenChange={closeRevenueModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-heading">Record Sale</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="rev-date">Date</Label>
            <Input type="date" id="rev-date" value={formData.date} max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="mt-1.5" />
          </div>
          
          <div>
            <Label>Product</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {[{ value: 'eggs' as ProductType, label: 'Eggs (crates)', icon: '🥚' }, { value: 'broilers' as ProductType, label: 'Broilers', icon: '🐔' }].map((p) => (
                <button key={p.value} type="button"
                  className={`flex items-center gap-2 p-3 rounded-button border-2 transition-all ${
                    formData.product_type === p.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setFormData({ ...formData, product_type: p.value, unit_price: p.value === 'eggs' ? '360' : '820' })}>
                  <span className="text-xl">{p.icon}</span>
                  <span className="text-sm font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{formData.product_type === 'eggs' ? 'Crates' : 'Birds'}</Label>
              <Input type="number" placeholder="50" value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Price (KES)</Label>
              <Input type="number" value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })} className="mt-1.5" />
            </div>
          </div>
          
          <div className="bg-success/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-success">{totalAmount.toLocaleString()} KES</p>
          </div>
          
          <div>
            <Label>Customer Name</Label>
            <Input type="text" placeholder="Hotel Savanna" value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} className="mt-1.5" />
          </div>
          
          <div>
            <Label>Payment Status</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {[{ value: 'paid' as PaymentStatus, label: 'Paid Now', icon: '✓' }, { value: 'pending' as PaymentStatus, label: 'Due in 7 days', icon: '⏳' }].map((s) => (
                <button key={s.value} type="button"
                  className={`flex items-center gap-2 p-3 rounded-button border-2 transition-all ${
                    formData.payment_status === s.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setFormData({ ...formData, payment_status: s.value })}>
                  <span>{s.icon}</span>
                  <span className="text-sm font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeRevenueModal} className="flex-1">Cancel</Button>
            <Button type="submit" variant="success" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : 'Record Sale'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
