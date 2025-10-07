import React from 'react';
import { cn } from '@/lib/utils';
import Breadcrumb from './Breadcrumb';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface PageAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  icon?: React.ComponentType<{ className?: string }>;
}

interface PageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: PageAction[];
  backButton?: {
    label: string;
    onClick: () => void;
  };
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  backButton,
  children,
  className,
  headerContent
}) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Page Header */}
      <div className="bg-surface-50 border-b border-border">
        <div className="container mx-auto px-6 py-6">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-4">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}

          {/* Back Button */}
          {backButton && (
            <div className="mb-4">
              <EnhancedButton
                variant="ghost"
                size="sm"
                onClick={backButton.onClick}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {backButton.label}
              </EnhancedButton>
            </div>
          )}

          {/* Title Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
              {description && (
                <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
              )}
            </div>

            {/* Actions */}
            {actions && actions.length > 0 && (
              <div className="flex items-center gap-3">
                {actions.slice(0, 2).map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <EnhancedButton
                      key={index}
                      variant={action.variant || 'default'}
                      onClick={action.onClick}
                      className="gap-2"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {action.label}
                    </EnhancedButton>
                  );
                })}
                
                {actions.length > 2 && (
                  <EnhancedButton variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </EnhancedButton>
                )}
              </div>
            )}
          </div>

          {/* Additional Header Content */}
          {headerContent && (
            <div className="mt-6">
              {headerContent}
            </div>
          )}
        </div>
      </div>

      {/* Page Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;