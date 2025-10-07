import React, { useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';
import { TriangleAlert as AlertTriangle } from 'lucide-react';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface NavigationGuardProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresProject?: boolean;
  fallbackComponent?: React.ReactNode;
}

const NavigationGuard: React.FC<NavigationGuardProps> = ({
  children,
  requiresAuth = false,
  requiresProject = false,
  fallbackComponent
}) => {
  const { user } = useAuth();
  const { currentProject, projects, isLoading, error, clearError } = useProject();
  const { toast } = useToast();

  useEffect(() => {
    // Clear any existing errors when component mounts
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
        <EnhancedCard variant="elevated" className="max-w-md">
          <EnhancedCardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Navigation Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2">
              <EnhancedButton variant="outline" onClick={clearError} className="flex-1">
                Try Again
              </EnhancedButton>
              <EnhancedButton onClick={() => window.location.reload()} className="flex-1">
                Reload Page
              </EnhancedButton>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      </div>
    );
  }

  // Check authentication requirement
  if (requiresAuth && !user) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
        <EnhancedCard variant="elevated" className="max-w-md">
          <EnhancedCardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">
              Please sign in to access this feature.
            </p>
            <EnhancedButton onClick={() => window.location.href = '/login'}>
              Sign In
            </EnhancedButton>
          </EnhancedCardContent>
        </EnhancedCard>
      </div>
    );
  }

  // Check project requirement
  if (requiresProject && !currentProject && projects.length === 0) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
        <EnhancedCard variant="elevated" className="max-w-md">
          <EnhancedCardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground mb-4">
              Create a project to access this feature.
            </p>
            <EnhancedButton 
              onClick={() => window.dispatchEvent(new CustomEvent('app:navigateView', { detail: 'land-marketplace' }))}
            >
              Create Project
            </EnhancedButton>
          </EnhancedCardContent>
        </EnhancedCard>
      </div>
    );
  }

  return <>{children}</>;
};

export default NavigationGuard;