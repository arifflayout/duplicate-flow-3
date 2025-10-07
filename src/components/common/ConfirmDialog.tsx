import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive' | 'success' | 'info';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isLoading = false
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <AlertTriangle className="h-6 w-6 text-destructive" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-success" />;
      case 'info':
        return <Info className="h-6 w-6 text-info" />;
      default:
        return <Info className="h-6 w-6 text-primary" />;
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive/10';
      case 'success':
        return 'bg-success/10';
      case 'info':
        return 'bg-info/10';
      default:
        return 'bg-primary/10';
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconBg()}`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-bold text-foreground">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground mt-2 leading-relaxed">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel asChild>
            <EnhancedButton variant="outline" disabled={isLoading}>
              {cancelLabel}
            </EnhancedButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <EnhancedButton
              variant={getButtonVariant()}
              onClick={onConfirm}
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? 'Processing...' : confirmLabel}
            </EnhancedButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;