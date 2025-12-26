import { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { ChevronDown, ChevronUp, Lightbulb, Activity } from 'lucide-react';

export function HealthScore() {
  const [showRecommendation, setShowRecommendation] = useState(true);
  const { getFinancialHealth, getCashOnHand, expenses } = useDashboardStore();
  const health = getFinancialHealth();
  const cashOnHand = getCashOnHand();
  
  const avgDailyExpenses = expenses.slice(0, 30).reduce((sum, e) => sum + e.amount, 0) / 30;
  const cashRunwayMonths = avgDailyExpenses > 0 
    ? (cashOnHand / avgDailyExpenses / 30).toFixed(1) 
    : '∞';
  
  const getGradientClass = () => {
    if (health.score >= 80) return 'health-excellent';
    if (health.score >= 60) return 'health-warning';
    return 'health-danger';
  };
  
  const getStatusText = () => {
    if (health.score >= 80) return 'Excellent';
    if (health.score >= 70) return 'Good';
    if (health.score >= 60) return 'Fair';
    return 'Needs Attention';
  };
  
  return (
    <div className={`card-futuristic relative overflow-hidden ${getGradientClass()} text-white`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold uppercase tracking-wider opacity-90">
            Financial Health Score
          </h2>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold">{health.score}</span>
          <span className="text-2xl opacity-70">/100</span>
        </div>
        
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 bg-white/20 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-white transition-all duration-1000"
              style={{ width: `${health.score}%` }}
            />
          </div>
          <span className="font-semibold">{getStatusText()}</span>
        </div>
        
        <p className="mt-6 text-white/90 text-sm leading-relaxed">
          Your financial health is <strong>{health.status.toUpperCase()}</strong>. 
          You have <strong>{cashRunwayMonths} months</strong> of cash reserves 
          and profit margins are {health.profitMargin >= 20 ? 'stable' : 'below target'} at <strong>{health.profitMargin.toFixed(0)}%</strong>.
        </p>
        
        {/* Expandable Recommendation */}
        <button 
          onClick={() => setShowRecommendation(!showRecommendation)}
          className="mt-4 w-full bg-white/10 hover:bg-white/15 rounded-xl p-4 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Recommendation</span>
            </div>
            {showRecommendation ? (
              <ChevronUp className="w-4 h-4 opacity-70" />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-70" />
            )}
          </div>
          
          {showRecommendation && (
            <p className="mt-3 text-sm text-white/80 pl-11">
              {health.recommendation}
            </p>
          )}
        </button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-lg" />
    </div>
  );
}