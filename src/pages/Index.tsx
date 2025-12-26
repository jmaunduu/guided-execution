import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { HeroMetrics } from '@/components/dashboard/HeroMetrics';
import { WeekComparison } from '@/components/dashboard/WeekComparison';
import { TrendCharts } from '@/components/dashboard/TrendCharts';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { QuickMetrics } from '@/components/dashboard/QuickMetrics';
import { HealthScore } from '@/components/dashboard/HealthScore';
import { PaymentTracker } from '@/components/dashboard/PaymentTracker';
import { FAB } from '@/components/dashboard/FAB';
import { AddExpenseModal } from '@/components/modals/AddExpenseModal';
import { AddRevenueModal } from '@/components/modals/AddRevenueModal';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { WelcomePreloader } from '@/components/WelcomePreloader';
import { Leaf } from 'lucide-react';

const Index = () => {
  const { fetchDashboardData, isLoading } = useDashboardStore();
  const [showPreloader, setShowPreloader] = useState(true);
  const [userName] = useState('Farmer'); // Can be dynamic later
  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  if (showPreloader) {
    return (
      <WelcomePreloader 
        userName={userName} 
        onComplete={() => setShowPreloader(false)} 
        duration={3000}
      />
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AnimatedBackground intensity="low" />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground intensity="low" />
      
      {/* Header */}
      <header className="bg-card/80 border-b border-border sticky top-0 z-30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-heading font-bold text-foreground">Magolla Farm</h1>
                <p className="text-micro text-muted-foreground">Financial Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'short' })}
              </p>
              <p className="text-micro text-muted-foreground">Kenya</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24 space-y-6 relative z-10">
        <section aria-label="Key metrics">
          <HeroMetrics />
        </section>
        
        <section aria-label="Financial health">
          <HealthScore />
        </section>
        
        <section aria-label="Weekly comparison">
          <WeekComparison />
        </section>
        
        <section aria-label="Trends">
          <TrendCharts />
        </section>
        
        <section aria-label="Quick metrics">
          <QuickMetrics />
        </section>
        
        <section aria-label="Recent expenses">
          <RecentExpenses />
        </section>
        
        <section aria-label="Payment tracking">
          <PaymentTracker />
        </section>
      </main>
      
      <FAB />
      <AddExpenseModal />
      <AddRevenueModal />
    </div>
  );
};

export default Index;