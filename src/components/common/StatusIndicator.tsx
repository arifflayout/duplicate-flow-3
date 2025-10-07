import React from 'react';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { CheckCircle, Clock, XCircle, AlertTriangle, Pause, Play, type LucideIcon } from 'lucide-react';

interface StatusIndicatorProps {
  status: string;
  variant?: 'badge' | 'dot' | 'icon';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  variant = 'badge',
  size = 'default',
  showIcon = true,
  className
}) => {
  const getStatusConfig = (status: string): {
    color: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    icon: LucideIcon;
    label: string;
  } => {
    const normalizedStatus = status.toLowerCase().replace(/[-_\s]/g, '');
    
    switch (normalizedStatus) {
      case 'approved':
      case 'completed':
      case 'accepted':
      case 'active':
      case 'success':
        return {
          color: 'success',
          icon: CheckCircle,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };
      
      case 'pending':
      case 'inprogress':
      case 'underreview':
      case 'submitted':
      case 'processing':
        return {
          color: 'warning',
          icon: Clock,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };
      
      case 'rejected':
      case 'cancelled':
      case 'failed':
      case 'error':
        return {
          color: 'error',
          icon: XCircle,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };
      
      case 'paused':
      case 'onhold':
        return {
          color: 'neutral',
          icon: Pause,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };

      case 'notstarted':
      case 'draft':
      case 'inactive':
        return {
          color: 'neutral',
          icon: AlertTriangle,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };
      
      default:
        return {
          color: 'info',
          icon: AlertTriangle,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  if (variant === 'dot') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${
          config.color === 'success' ? 'bg-success' :
          config.color === 'warning' ? 'bg-warning' :
          config.color === 'error' ? 'bg-destructive' :
          config.color === 'info' ? 'bg-info' :
          'bg-muted-foreground'
        }`} />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Icon className={`h-4 w-4 ${
          config.color === 'success' ? 'text-success' :
          config.color === 'warning' ? 'text-warning' :
          config.color === 'error' ? 'text-destructive' :
          config.color === 'info' ? 'text-info' :
          'text-muted-foreground'
        }`} />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  }

  return (
    <EnhancedBadge
      variant={config.color}
      size={size}
      icon={showIcon ? <Icon className="w-3 h-3" /> : undefined}
      className={className}
    >
      {config.label}
    </EnhancedBadge>
  );
};

export default StatusIndicator;