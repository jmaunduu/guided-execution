import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStore } from '@/stores/dashboardStore';
import { formatKES, getDaysFromDue, formatDateShort } from '@/lib/formatters';
import { Check, Clock, AlertTriangle } from 'lucide-react';
import type { Revenue } from '@/types/dashboard';

export function PaymentTracker() {
  const { getPaymentsByStatus, updatePaymentStatus } = useDashboardStore();
  const { paid, pending, overdue } = getPaymentsByStatus();
  
  const columns = [
    { 
      title: 'Paid', 
      count: paid.length, 
      items: paid.slice(0, 5), 
      icon: Check,
      color: 'success',
      borderClass: 'payment-paid',
    },
    { 
      title: 'Pending', 
      count: pending.length, 
      items: pending.slice(0, 5), 
      icon: Clock,
      color: 'warning',
      borderClass: 'payment-pending',
    },
    { 
      title: 'Overdue', 
      count: overdue.length, 
      items: overdue.slice(0, 5), 
      icon: AlertTriangle,
      color: 'danger',
      borderClass: 'payment-overdue',
    },
  ];
  
  const handleMarkPaid = (id: string) => {
    updatePaymentStatus(id, 'paid');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading">Customer Payments</CardTitle>
      </CardHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 pt-0">
        {columns.map((column) => (
          <div key={column.title} className="space-y-3">
            {/* Column header */}
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <column.icon className={`w-4 h-4 text-${column.color}`} />
                <span className="font-semibold text-sm">{column.title}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${column.color}/10 text-${column.color}`}>
                {column.count}
              </span>
            </div>
            
            {/* Payment cards */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto hide-scrollbar">
              {column.items.map((payment) => (
                <PaymentCard 
                  key={payment.id} 
                  payment={payment} 
                  borderClass={column.borderClass}
                  onMarkPaid={column.title === 'Pending' || column.title === 'Overdue' ? handleMarkPaid : undefined}
                />
              ))}
              
              {column.items.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  {column.title === 'Overdue' ? (
                    <div>
                      <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Check className="w-6 h-6 text-success" />
                      </div>
                      <p className="text-sm">No overdue payments! 🎉</p>
                    </div>
                  ) : (
                    <p className="text-sm">No {column.title.toLowerCase()} payments</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface PaymentCardProps {
  payment: Revenue;
  borderClass: string;
  onMarkPaid?: (id: string) => void;
}

function PaymentCard({ payment, borderClass, onMarkPaid }: PaymentCardProps) {
  const dueInfo = payment.due_date ? getDaysFromDue(payment.due_date) : null;
  
  return (
    <div 
      className={`bg-card rounded-lg p-3 shadow-farm ${borderClass} transition-all hover:shadow-farm-md cursor-pointer`}
      onClick={() => onMarkPaid?.(payment.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{payment.customer_name || 'Unknown Customer'}</h4>
          <p className="text-lg font-semibold text-foreground mt-1">
            {formatKES(payment.total_amount)} <span className="text-xs text-muted-foreground font-normal">KES</span>
          </p>
        </div>
        {payment.payment_status === 'paid' && (
          <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="w-3 h-3 text-success" />
          </div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        {payment.payment_status === 'paid' && (
          <span>{formatDateShort(payment.date)}</span>
        )}
        {payment.payment_status === 'pending' && dueInfo && (
          <span className="text-warning">Due: {formatDateShort(payment.due_date!)}</span>
        )}
        {payment.payment_status === 'overdue' && dueInfo && (
          <span className="text-danger font-medium">{dueInfo.label}</span>
        )}
      </div>
      
      {onMarkPaid && (
        <p className="text-micro text-muted-foreground mt-2 italic">
          Tap to mark as paid
        </p>
      )}
    </div>
  );
}
