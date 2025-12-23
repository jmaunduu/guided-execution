import * as React from "react";
import { cn } from "@/lib/utils";

// Base Card with Magolla Farm styling
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border-0 bg-card text-card-foreground shadow-farm transition-all duration-200",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Metric Card variant with status border support
interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  interactive?: boolean;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, status = 'neutral', interactive = false, ...props }, ref) => {
    const statusClasses = {
      success: 'border-l-4 border-l-success',
      warning: 'border-l-4 border-l-warning',
      danger: 'border-l-4 border-l-danger',
      info: 'border-l-4 border-l-info',
      neutral: '',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border-0 bg-card text-card-foreground shadow-farm p-5 transition-all duration-200",
          statusClasses[status],
          interactive && "cursor-pointer hover:shadow-farm-md hover:-translate-y-0.5",
          className
        )}
        {...props}
      />
    );
  }
);
MetricCard.displayName = "MetricCard";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-heading font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, MetricCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
