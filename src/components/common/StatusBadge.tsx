import React from 'react';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { CheckCircle, Clock, XCircle, AlertCircle, Pause, Play, type LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'default';
  showIcon?: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
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
      case 'designapproval':
      case 'consultantselection':
      case 'contractorselection':
        return {
          color: 'warning',
          icon: Clock,
          label: status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')
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
      case 'landselection':
      case 'projectbrief':
        return {
          color: 'neutral',
          icon: AlertCircle,
          label: status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')
        };

      case 'construction':
      case 'compliance':
      case 'handover':
        return {
          color: 'info',
          icon: Play,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        };
      
      default:
        return {
          color: 'info',
          icon: AlertCircle,
          label: status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

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

export default StatusBadge;