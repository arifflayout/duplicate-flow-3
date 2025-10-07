import React, { useState, useRef, useEffect } from 'react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X, 
  Filter, 
  SlidersHorizontal, 
  Clock, 
  TrendingUp, 
  MapPin,
  Building,
  Star,
  Users,
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'location' | 'consultant' | 'project' | 'feature' | 'category';
  category?: string;
  count?: number;
  metadata?: Record<string, any>;
}

interface QuickFilter {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
  count?: number;
}

interface AdvancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  quickFilters?: QuickFilter[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  onQuickFilterSelect?: (filter: QuickFilter) => void;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
  size = 'default',
  suggestions = [],
  recentSearches = [],
  quickFilters = [],
  onSuggestionSelect,
  onQuickFilterSelect,
  onFilterClick,
  showFilterButton = true,
  showSuggestions = true,
  autoFocus = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    onChange('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSuggestionSelect?.(suggestion);
    setShowDropdown(false);
  };

  const handleRecentSearchClick = (search: string) => {
    onChange(search);
    setShowDropdown(false);
  };

  const handleQuickFilterClick = (filter: QuickFilter) => {
    onQuickFilterSelect?.(filter);
    setShowDropdown(false);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'location': return <MapPin className="h-4 w-4 text-primary" />;
      case 'consultant': return <Users className="h-4 w-4 text-success" />;
      case 'project': return <Building className="h-4 w-4 text-info" />;
      case 'feature': return <Star className="h-4 w-4 text-warning" />;
      case 'category': return <Filter className="h-4 w-4 text-purple-600" />;
      default: return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSuggestionTypeLabel = (type: string) => {
    switch (type) {
      case 'location': return 'Location';
      case 'consultant': return 'Consultant';
      case 'project': return 'Project Type';
      case 'feature': return 'Feature';
      case 'category': return 'Category';
      default: return 'Search';
    }
  };

  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    const type = suggestion.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  const hasContent = value.length > 0 || recentSearches.length > 0 || quickFilters.length > 0;

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <EnhancedInput
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowDropdown(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={placeholder}
          icon={<Search className="h-4 w-4" />}
          variant="search"
          inputSize={size}
          className={cn(
            "pr-20 transition-all duration-200",
            isFocused && "ring-2 ring-primary/20 border-primary/50 shadow-lg"
          )}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && (
            <EnhancedButton
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-6 w-6 hover:bg-surface-100"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </EnhancedButton>
          )}
          
          {showFilterButton && (
            <EnhancedButton
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
              onClick={onFilterClick}
            >
              <SlidersHorizontal className="h-3 w-3" />
            </EnhancedButton>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {showDropdown && showSuggestions && hasContent && (
          <EnhancedCard className="absolute top-full left-0 right-0 mt-2 z-50 shadow-2xl border border-border/50 bg-background/95 backdrop-blur-sm max-h-96 overflow-hidden">
            <EnhancedCardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {/* Quick Filters */}
                {quickFilters.length > 0 && value.length === 0 && (
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Quick Filters</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quickFilters.map((filter) => (
                        <EnhancedButton
                          key={filter.id}
                          variant="outline"
                          size="sm"
                          className="gap-2 hover:bg-primary/5 hover:border-primary/30"
                          onClick={() => handleQuickFilterClick(filter)}
                        >
                          {filter.icon}
                          <span>{filter.label}</span>
                          {filter.count && (
                            <Badge variant="secondary" className="text-xs">
                              {filter.count}
                            </Badge>
                          )}
                        </EnhancedButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && value.length === 0 && (
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors group"
                          onClick={() => handleRecentSearchClick(search)}
                        >
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{search}</span>
                          </div>
                          <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions by Type */}
                {value.length > 0 && Object.keys(groupedSuggestions).length > 0 && (
                  <div className="p-2">
                    {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
                      <div key={type} className="mb-4 last:mb-0">
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {getSuggestionTypeLabel(type)}
                        </div>
                        <div className="space-y-1">
                          {typeSuggestions.slice(0, 4).map((suggestion) => (
                            <div
                              key={suggestion.id}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors group"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <div className="flex items-center gap-3">
                                {getSuggestionIcon(suggestion.type)}
                                <div>
                                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {suggestion.text}
                                  </span>
                                  {suggestion.category && (
                                    <div className="text-xs text-muted-foreground">{suggestion.category}</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {suggestion.count && (
                                  <Badge variant="secondary" className="text-xs">
                                    {suggestion.count}
                                  </Badge>
                                )}
                                <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {value.length > 0 && suggestions.length === 0 && (
                  <div className="p-6 text-center">
                    <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No suggestions found</p>
                    <p className="text-xs text-muted-foreground">Try a different search term</p>
                  </div>
                )}
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearchBar;