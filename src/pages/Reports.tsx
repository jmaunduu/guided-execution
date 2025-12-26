import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, TrendingUp, Wallet, Receipt, Plus, Trash2, 
  Save, Eye, Download, Printer, X 
} from 'lucide-react';
import { formatKES } from '@/lib/formatters';

interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  items: LineItem[];
  notes: string;
  taxRate: number;
}

const reportCards = [
  {
    id: 'pnl',
    title: 'Profit & Loss Statement',
    description: 'View income, expenses, and net profit for a period',
    icon: TrendingUp,
    color: 'primary',
  },
  {
    id: 'cashflow',
    title: 'Cash Flow Statement',
    description: 'Track money movement in and out of your accounts',
    icon: Wallet,
    color: 'success',
  },
  {
    id: 'invoice',
    title: 'Invoice Generator',
    description: 'Create and send professional invoices to customers',
    icon: Receipt,
    color: 'warning',
  },
  {
    id: 'expense',
    title: 'Expense Report',
    description: 'Detailed breakdown of all business expenses',
    icon: FileText,
    color: 'info',
  },
];

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientName: '',
    clientAddress: '',
    items: [{ id: '1', description: '', qty: 1, rate: 0, amount: 0 }],
    notes: '',
    taxRate: 16,
  });

  const handleGenerateReport = (reportId: string) => {
    if (reportId === 'invoice') {
      setShowInvoiceModal(true);
    } else {
      setSelectedReport(reportId);
    }
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: '',
      qty: 1,
      rate: 0,
      amount: 0,
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeLineItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
      }));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'qty' || field === 'rate') {
            updated.amount = updated.qty * updated.rate;
          }
          return updated;
        }
        return item;
      }),
    }));
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      {/* Report Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((report) => (
          <Card 
            key={report.id} 
            className="card-futuristic group cursor-pointer"
            onClick={() => handleGenerateReport(report.id)}
          >
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-xl bg-${report.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <report.icon className={`w-6 h-6 text-${report.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{report.description}</p>
              <Button className="w-full" size="sm">
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Display Area */}
      {selectedReport && (
        <Card className="card-glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {reportCards.find(r => r.id === selectedReport)?.title}
                </CardTitle>
                <CardDescription>
                  Generated on {new Date().toLocaleDateString('en-KE', { dateStyle: 'full' })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setSelectedReport(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
              <p>Report content would be rendered here based on data</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Generator Modal */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice #</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Client Details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={invoiceData.clientName}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Enter client name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Client Address</Label>
                <Input
                  id="clientAddress"
                  value={invoiceData.clientAddress}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, clientAddress: e.target.value }))}
                  placeholder="Enter client address"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Line Items */}
            <div>
              <Label>Line Items</Label>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground px-2">
                  <span className="col-span-5">Description</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-2 text-center">Rate</span>
                  <span className="col-span-2 text-right">Amount</span>
                  <span className="col-span-1"></span>
                </div>
                {invoiceData.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                    <Input
                      className="col-span-5"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    />
                    <Input
                      className="col-span-2 text-center"
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateLineItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                    />
                    <Input
                      className="col-span-2 text-center"
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                    <span className="col-span-2 text-right text-sm font-medium">
                      {formatKES(item.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="col-span-1"
                      onClick={() => removeLineItem(item.id)}
                      disabled={invoiceData.items.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="gap-2" onClick={addLineItem}>
                  <Plus className="w-4 h-4" />
                  Add Line Item
                </Button>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatKES(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoiceData.taxRate}%)</span>
                  <span>{formatKES(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                  <span>Total</span>
                  <span>{formatKES(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes..."
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-end border-t border-border pt-4">
              <Button variant="outline" className="gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Generate PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
