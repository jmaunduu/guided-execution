import { ReactNode, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  accentColor?: 'blue' | 'orange';
}

export function ExpandableCardModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  accentColor = 'blue',
}: ExpandableCardModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="fixed inset-4 md:inset-8 lg:inset-12 xl:inset-16 z-50 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="expanded-card w-full h-full max-h-[90vh] overflow-auto animate-modal-in">
          {/* Header */}
          <div className={cn(
            "sticky top-0 z-10 p-6 border-b border-border/30",
            "bg-gradient-to-r",
            accentColor === 'blue' 
              ? "from-primary/10 via-transparent to-transparent" 
              : "from-secondary/10 via-transparent to-transparent"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {icon && (
                  <div className={cn(
                    "p-3 rounded-xl",
                    accentColor === 'blue' ? "icon-glow" : "icon-glow-orange"
                  )}>
                    {icon}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat item component for use in expanded views
interface StatItemProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  accentColor?: 'blue' | 'orange';
}

export function StatItem({ 
  label, 
  value, 
  subtext, 
  trend, 
  trendValue,
  icon,
  accentColor = 'blue' 
}: StatItemProps) {
  return (
    <div className="stat-item group hover:border-primary/30 transition-all duration-300">
      {icon && (
        <div className={cn(
          "mx-auto mb-3 w-10 h-10 rounded-lg flex items-center justify-center",
          accentColor === 'blue' 
            ? "bg-primary/10 text-primary" 
            : "bg-secondary/10 text-secondary"
        )}>
          {icon}
        </div>
      )}
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={cn(
        "text-2xl font-bold",
        accentColor === 'blue' ? "text-gradient-blue" : "text-gradient-orange"
      )}>
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      )}
      {trend && trendValue && (
        <div className={cn(
          "inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium",
          trend === 'up' && "bg-primary/15 text-primary",
          trend === 'down' && "bg-danger/15 text-danger",
          trend === 'neutral' && "bg-muted text-muted-foreground"
        )}>
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          {trendValue}
        </div>
      )}
    </div>
  );
}

// Chart section wrapper for expanded views
interface ChartSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function ChartSection({ title, children, icon }: ChartSectionProps) {
  return (
    <div className="sub-card mt-6">
      <div className="flex items-center gap-3 mb-4">
        {icon || <BarChart3 className="w-5 h-5 text-primary" />}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Insight item for expanded views
interface InsightItemProps {
  title: string;
  description: string;
  type?: 'info' | 'warning' | 'success';
}

export function InsightItem({ title, description, type = 'info' }: InsightItemProps) {
  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover:border-primary/30",
      type === 'info' && "bg-primary/5 border-primary/20",
      type === 'warning' && "bg-secondary/5 border-secondary/20",
      type === 'success' && "bg-primary/5 border-primary/20"
    )}>
      <Activity className={cn(
        "w-5 h-5 mt-0.5 flex-shrink-0",
        type === 'info' && "text-primary",
        type === 'warning' && "text-secondary",
        type === 'success' && "text-primary"
      )} />
      <div>
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
