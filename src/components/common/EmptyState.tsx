import React from 'react';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'default' | 'minimal';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  variant = 'default'
}) => {
  if (variant === 'minimal') {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-surface-100 rounded-full flex items-center justify-center">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
        {actionLabel && onAction && (
          <EnhancedButton onClick={onAction} variant="default">
            {actionLabel}
          </EnhancedButton>
        )}
      </div>
    );
  }

  return (
    <EnhancedCard variant="elevated" className={className}>
      <EnhancedCardContent className="p-12 text-center">
        <div className="space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/10 to-info/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <Icon className="h-12 w-12 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              {description}
            </p>
          </div>
          
          {actionLabel && onAction && (
            <EnhancedButton onClick={onAction} variant="gradient" className="gap-2">
              {actionLabel}
            </EnhancedButton>
          )}
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  );
};

export default EmptyState;