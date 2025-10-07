import React from 'react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  icon?: LucideIcon;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  className,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'info':
        return 'border-info/20 bg-info/5';
      default:
        return '';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-info';
      default:
        return 'text-primary';
    }
  };

  return (
    <EnhancedCard 
      variant="metric" 
      className={cn(getVariantStyles(), className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && (
          <div className={cn("p-2 rounded-lg bg-background", getIconColor())}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="metric-value">{value}</div>
        {change && (
          <div className={cn(
            "metric-change",
            change.type === 'positive' && "positive",
            change.type === 'negative' && "negative"
          )}>
            {change.value}
          </div>
        )}
      </div>
    </EnhancedCard>
  );
};

export default MetricCard;