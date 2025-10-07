import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
              )}
              
              <div className={cn(
                "flex items-center gap-1.5",
                isLast 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground hover:text-foreground transition-colors"
              )}>
                {Icon && <Icon className="h-4 w-4" />}
                {item.href && !isLast ? (
                  <a 
                    href={item.href} 
                    className="hover:underline"
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;