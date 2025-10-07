import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyStateProps?: {
    icon: LucideIcon;
    title: string;
    description: string;
  };
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
  variant?: 'default' | 'elevated';
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  emptyStateProps,
  pagination,
  className,
  variant = 'default'
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <EnhancedCard variant={variant} className={className}>
        <EnhancedCardContent className="flex items-center justify-center p-12">
          <LoadingSpinner size="lg" />
        </EnhancedCardContent>
      </EnhancedCard>
    );
  }

  if (data.length === 0 && emptyStateProps) {
    return (
      <EnhancedCard variant={variant} className={className}>
        <EnhancedCardContent className="p-0">
          <EmptyState
            icon={emptyStateProps.icon}
            title={emptyStateProps.title}
            description={emptyStateProps.description}
          />
        </EnhancedCardContent>
      </EnhancedCard>
    );
  }

  return (
    <EnhancedCard variant={variant} className={className}>
      <EnhancedCardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-surface-50">
                {columns.map((column) => (
                  <TableHead 
                    key={String(column.key)} 
                    style={{ width: column.width }}
                    className={`font-semibold text-foreground ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow 
                  key={index} 
                  className="border-b border-border hover:bg-surface-50 transition-colors"
                >
                  {columns.map((column) => {
                    const value = row[column.key as keyof T];
                    return (
                      <TableCell 
                        key={String(column.key)}
                        className={`py-4 ${
                          column.align === 'center' ? 'text-center' : 
                          column.align === 'right' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {column.render ? column.render(value, row) : String(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-border bg-surface-50">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <EnhancedButton
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </EnhancedButton>
              <EnhancedButton
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </EnhancedButton>
            </div>
          </div>
        )}
      </EnhancedCardContent>
    </EnhancedCard>
  );
}

export default DataTable;