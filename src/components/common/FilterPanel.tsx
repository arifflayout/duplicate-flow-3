import React, { useState } from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
  description?: string;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'checkbox' | 'toggle';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  value?: any;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface FilterPanelProps {
  filters: FilterGroup[];
  activeFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
  onClearAll: () => void;
  className?: string;
  compact?: boolean;
  title?: string;
  showActiveCount?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  className,
  compact = false,
  title = "Filters",
  showActiveCount = true
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const activeFilterCount = Object.keys(activeFilters).filter(key => 
    activeFilters[key] !== undefined && 
    activeFilters[key] !== '' && 
    activeFilters[key] !== null &&
    (Array.isArray(activeFilters[key]) ? activeFilters[key].length > 0 : true)
  ).length;

  const toggleSection = (filterId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  };

  const isExpanded = (filter: FilterGroup) => {
    if (!filter.collapsible) return true;
    return expandedSections[filter.id] ?? filter.defaultExpanded ?? true;
  };

  const renderFilter = (filter: FilterGroup) => {
    const value = activeFilters[filter.id];
    const expanded = isExpanded(filter);

    const filterContent = () => {
      switch (filter.type) {
        case 'select':
          return (
            <Select value={value || ''} onValueChange={(val) => onFilterChange(filter.id, val)}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.count && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {option.count}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );

        case 'multiselect':
          return (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {filter.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-50 transition-colors">
                  <Checkbox
                    id={option.id}
                    checked={Array.isArray(value) ? value.includes(option.value) : false}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = checked
                        ? [...currentValues, option.value]
                        : currentValues.filter(v => v !== option.value);
                      onFilterChange(filter.id, newValues);
                    }}
                  />
                  <Label htmlFor={option.id} className="text-sm flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{option.label}</span>
                        {option.description && (
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        )}
                      </div>
                      {option.count && (
                        <Badge variant="outline" className="text-xs ml-2">
                          {option.count}
                        </Badge>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          );

        case 'range':
          const rangeValue = Array.isArray(value) ? value : [filter.min || 0, filter.max || 100];
          return (
            <div className="space-y-4">
              <Slider
                value={rangeValue}
                onValueChange={(val) => onFilterChange(filter.id, val)}
                min={filter.min || 0}
                max={filter.max || 100}
                step={filter.step || 1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <div className="px-3 py-1 bg-surface-100 rounded-lg font-medium">
                  {rangeValue[0]?.toLocaleString()}
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="px-3 py-1 bg-surface-100 rounded-lg font-medium">
                  {rangeValue[1]?.toLocaleString()}
                </div>
              </div>
            </div>
          );

        case 'checkbox':
          return (
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-surface-50 transition-colors">
              <Checkbox
                id={filter.id}
                checked={Boolean(value)}
                onCheckedChange={(checked) => onFilterChange(filter.id, checked)}
              />
              <Label htmlFor={filter.id} className="text-sm cursor-pointer flex-1">
                <div className="font-medium">{filter.label}</div>
                {filter.options?.[0]?.description && (
                  <div className="text-xs text-muted-foreground">{filter.options[0].description}</div>
                )}
              </Label>
            </div>
          );

        case 'toggle':
          return (
            <div className="grid grid-cols-2 gap-2">
              {filter.options?.map((option) => (
                <EnhancedButton
                  key={option.id}
                  variant={value === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFilterChange(filter.id, value === option.value ? '' : option.value)}
                  className="justify-start"
                >
                  {option.label}
                </EnhancedButton>
              ))}
            </div>
          );

        default:
          return null;
      }
    };

    if (compact) {
      return (
        <div key={filter.id} className="min-w-48">
          {filterContent()}
        </div>
      );
    }

    return (
      <div key={filter.id} className="space-y-3">
        {filter.collapsible ? (
          <EnhancedButton
            variant="ghost"
            onClick={() => toggleSection(filter.id)}
            className="w-full justify-between p-0 h-auto font-medium text-left"
          >
            <div className="flex items-center gap-2">
              {filter.icon}
              <span>{filter.label}</span>
              {value && (
                <EnhancedBadge variant="primary" size="sm">
                  {Array.isArray(value) ? value.length : '1'}
                </EnhancedBadge>
              )}
            </div>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </EnhancedButton>
        ) : (
          <div className="flex items-center gap-2">
            {filter.icon}
            <Label className="text-sm font-medium">{filter.label}</Label>
            {value && (
              <EnhancedBadge variant="primary" size="sm">
                {Array.isArray(value) ? value.length : '1'}
              </EnhancedBadge>
            )}
          </div>
        )}
        
        {expanded && (
          <div className="pl-6">
            {filterContent()}
          </div>
        )}
      </div>
    );
  };

  if (compact) {
    return (
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {filters.slice(0, 3).map((filter) => renderFilter(filter))}
        {activeFilterCount > 0 && (
          <EnhancedButton
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="gap-2 hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive"
          >
            <RotateCcw className="h-3 w-3" />
            Clear ({activeFilterCount})
          </EnhancedButton>
        )}
      </div>
    );
  }

  return (
    <EnhancedCard variant="elevated" className={className}>
      <EnhancedCardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
          </div>
          {showActiveCount && activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <EnhancedBadge variant="primary">{activeFilterCount} active</EnhancedBadge>
              <EnhancedButton
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="gap-1 hover:bg-destructive/5 hover:text-destructive"
              >
                <RotateCcw className="h-3 w-3" />
                Clear All
              </EnhancedButton>
            </div>
          )}
        </div>
      </EnhancedCardHeader>
      
      <EnhancedCardContent className="space-y-6">
        {filters.map((filter, index) => (
          <div key={filter.id}>
            {renderFilter(filter)}
            {index < filters.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
        
        {activeFilterCount > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters)
                  .filter(([_, value]) => 
                    value !== undefined && 
                    value !== '' && 
                    value !== null &&
                    (Array.isArray(value) ? value.length > 0 : true)
                  )
                  .map(([key, value]) => {
                    const filter = filters.find(f => f.id === key);
                    const displayValue = Array.isArray(value) 
                      ? `${value.length} selected`
                      : typeof value === 'string' 
                      ? value 
                      : String(value);
                    
                    return (
                      <EnhancedBadge
                        key={key}
                        variant="primary"
                        className="gap-1 cursor-pointer hover:bg-primary/80"
                        onClick={() => onFilterChange(key, Array.isArray(value) ? [] : '')}
                      >
                        <span>{filter?.label}: {displayValue}</span>
                        <X className="h-3 w-3" />
                      </EnhancedBadge>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </EnhancedCardContent>
    </EnhancedCard>
  );
};

export default FilterPanel;