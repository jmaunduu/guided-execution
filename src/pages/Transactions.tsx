import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useDashboardStore } from '@/stores/dashboardStore';
import { formatKES, formatDateStacked } from '@/lib/formatters';
import { CATEGORY_CONFIG, PAYMENT_METHOD_CONFIG } from '@/types/dashboard';
import { 
  Plus, Search, Filter, Download, ChevronDown, ChevronUp, 
  Trash2, TrendingUp, TrendingDown, ArrowUpDown, DollarSign 
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['income', 'expense']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const { expenses, revenue, openExpenseModal, openRevenueModal, deleteExpense, deleteRevenue } = useDashboardStore();
  const isMobile = useIsMobile();

  // Combine and sort transactions
  const allTransactions = useMemo(() => {
    const incomeItems = revenue.map(r => ({
      id: r.id,
      date: r.date,
      description: `${r.product_type} sale - ${r.customer_name || 'Customer'}`,
      category: r.product_type,
      amount: r.total_amount,
      type: 'income' as const,
      account: r.payment_method,
    }));

    const expenseItems = expenses.map(e => ({
      id: e.id,
      date: e.date,
      description: e.notes || CATEGORY_CONFIG[e.category].label,
      category: e.category,
      amount: -e.amount,
      type: 'expense' as const,
      account: e.payment_method,
    }));

    let combined = [...incomeItems, ...expenseItems];

    // Apply filters
    if (selectedTypes.length < 2) {
      combined = combined.filter(t => selectedTypes.includes(t.type));
    }
    
    if (searchQuery) {
      combined = combined.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      combined = combined.filter(t => selectedCategories.includes(t.category));
    }

    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, revenue, selectedTypes, searchQuery, selectedCategories]);

  const stats = useMemo(() => {
    const totalIncome = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = Math.abs(allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    return {
      totalIncome,
      totalExpenses,
      netCashFlow: totalIncome - totalExpenses,
      count: allTransactions.length,
    };
  }, [allTransactions]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? allTransactions.map(t => t.id) : []);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedItems(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
  };

  const handleDelete = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      deleteRevenue(id);
    } else {
      deleteExpense(id);
    }
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <Card className="card-glass">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={openRevenueModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
            
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/50 border-border/50"
              />
            </div>
            
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filter
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Panel */}
      <Collapsible open={showFilters}>
        <CollapsibleContent>
          <Card className="card-glass">
            <CardContent className="p-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Type</p>
                  <div className="flex flex-wrap gap-2">
                    {['income', 'expense'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox 
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <span className="text-sm capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox 
                          checked={selectedCategories.includes(key)}
                          onCheckedChange={(checked) => {
                            setSelectedCategories(prev => 
                              checked ? [...prev, key] : prev.filter(c => c !== key)
                            );
                          }}
                        />
                        <span className="text-sm">{config.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <p className="text-sm font-medium mb-2">Date Range</p>
                  <div className="flex gap-2">
                    <Input type="date" className="bg-muted/50 border-border/50 text-sm" />
                    <Input type="date" className="bg-muted/50 border-border/50 text-sm" />
                  </div>
                </div>

                {/* Account Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Account</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(PAYMENT_METHOD_CONFIG).map(([key, config]) => (
                      <span key={key} className="px-2 py-1 rounded-lg bg-muted/50 text-xs cursor-pointer hover:bg-muted">
                        {config.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Total Income</span>
            </div>
            <p className="text-lg font-bold text-success">{formatKES(stats.totalIncome)}</p>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-danger" />
              <span className="text-xs text-muted-foreground">Total Expenses</span>
            </div>
            <p className="text-lg font-bold text-danger">{formatKES(stats.totalExpenses)}</p>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpDown className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Net Cash Flow</span>
            </div>
            <p className={`text-lg font-bold ${stats.netCashFlow >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatKES(stats.netCashFlow)}
            </p>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Transactions</span>
            </div>
            <p className="text-lg font-bold text-foreground">{stats.count}</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table/Cards */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            // Mobile Card Layout
            <div className="space-y-3">
              {allTransactions.slice(0, 20).map((transaction) => (
                <div 
                  key={transaction.id}
                  className={`p-4 rounded-xl bg-muted/30 border ${
                    transaction.type === 'income' ? 'border-l-success border-l-4' : 'border-l-danger border-l-4'
                  } border-border/50`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm text-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground capitalize">{transaction.category}</p>
                    </div>
                    <p className={`font-bold ${transaction.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                      {transaction.amount >= 0 ? '+' : ''}{formatKES(Math.abs(transaction.amount))}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDateStacked(transaction.date).day} {formatDateStacked(transaction.date).month}</span>
                    <span className="capitalize">{PAYMENT_METHOD_CONFIG[transaction.account]?.label || transaction.account}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop Table Layout
            <div className="overflow-x-auto">
              <table className="table-futuristic">
                <thead>
                  <tr>
                    <th className="p-3 text-left">
                      <Checkbox 
                        checked={selectedItems.length === allTransactions.length && allTransactions.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase">Date</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase">Description</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase">Category</th>
                    <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase">Account</th>
                    <th className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allTransactions.slice(0, 20).map((transaction) => {
                    const dateFormatted = formatDateStacked(transaction.date);
                    return (
                      <tr key={transaction.id} className="group">
                        <td className="p-3">
                          <Checkbox 
                            checked={selectedItems.includes(transaction.id)}
                            onCheckedChange={(checked) => handleSelectItem(transaction.id, checked as boolean)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="text-xs">
                            <span className="font-medium text-foreground">{dateFormatted.day}</span>
                            <span className="text-muted-foreground ml-1">{dateFormatted.month}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-foreground">{transaction.description}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground capitalize">
                            {transaction.category}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-semibold text-sm ${transaction.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                            {transaction.amount >= 0 ? '+' : ''}{formatKES(Math.abs(transaction.amount))}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-xs text-muted-foreground">
                            {PAYMENT_METHOD_CONFIG[transaction.account]?.label || transaction.account}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(transaction.id, transaction.type)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
