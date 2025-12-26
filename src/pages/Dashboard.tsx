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
import { WelcomePreloader } from '@/components/WelcomePreloader';
import { Leaf } from 'lucide-react';

const Dashboard = () => {
  const { fetchDashboardData, isLoading } = useDashboardStore();
  const [showPreloader, setShowPreloader] = useState(true);
  const [userName] = useState('Farmer');
  
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-6">
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
      </div>
      
      <FAB />
      <AddExpenseModal />
      <AddRevenueModal />
    </>
  );
};

export default Dashboard;
