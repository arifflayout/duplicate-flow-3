import React, { useState, useRef, useEffect } from 'react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, SlidersHorizontal, Clock, TrendingUp, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'location' | 'consultant' | 'project' | 'feature';
  category?: string;
  count?: number;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
  size?: 'sm' | 'default' | 'lg';
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  showSuggestions?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
  showClearButton = true,
  showFilterButton = false,
  onFilterClick,
  size = 'default',
  suggestions = [],
  recentSearches = [],
  onSuggestionSelect,
  showSuggestions = true
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(value, 300);

  // Mock suggestions based on search value
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'Kuala Lumpur', type: 'location', count: 45 },
    { id: '2', text: 'Selangor', type: 'location', count: 32 },
    { id: '3', text: 'Architect', type: 'consultant', category: 'Professional', count: 28 },
    { id: '4', text: 'Structural Engineer', type: 'consultant', category: 'Professional', count: 15 },
    { id: '5', text: 'Commercial Development', type: 'project', category: 'Project Type', count: 12 },
    { id: '6', text: 'Swimming Pool', type: 'feature', category: 'Amenity', count: 8 }
  ];

  const mockRecentSearches = [
    'Residential land Petaling Jaya',
    'Architect Kuala Lumpur',
    'Commercial development'
  ];

  const filteredSuggestions = value.length > 0 
    ? mockSuggestions.filter(s => 
        s.text.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6)
    : [];

  const displayRecentSearches = value.length === 0 && mockRecentSearches.length > 0;

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

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'location': return <MapPin className="h-4 w-4 text-primary" />;
      case 'consultant': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'project': return <Search className="h-4 w-4 text-info" />;
      case 'feature': return <Filter className="h-4 w-4 text-warning" />;
      default: return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div ref={searchRef} className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <EnhancedInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          icon={<Search className="h-4 w-4" />}
          variant="search"
          inputSize={size}
          className={cn(
            "pr-10 transition-all duration-200",
            isFocused && "ring-2 ring-primary/20 border-primary/50"
          )}
        />
        
        {showClearButton && value && (
          <EnhancedButton
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-surface-100"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </EnhancedButton>
        )}

        {/* Search Suggestions Dropdown */}
        {showDropdown && showSuggestions && (
          <EnhancedCard className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border border-border/50 bg-background/95 backdrop-blur-sm">
            <EnhancedCardContent className="p-0 max-h-80 overflow-y-auto">
              {displayRecentSearches ? (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
                  </div>
                  <div className="space-y-2">
                    {mockRecentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors"
                        onClick={() => handleRecentSearchClick(search)}
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : filteredSuggestions.length > 0 ? (
                <div className="p-2">
                  {filteredSuggestions.map((suggestion) => (
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
                      {suggestion.count && (
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.count}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : value.length > 0 ? (
                <div className="p-4 text-center">
                  <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No suggestions found</p>
                  <p className="text-xs text-muted-foreground">Try a different search term</p>
                </div>
              ) : null}
            </EnhancedCardContent>
          </EnhancedCard>
        )}
      </div>
      
      {showFilterButton && (
        <EnhancedButton
          variant="outline"
          size={size === 'sm' ? 'sm' : 'default'}
          onClick={onFilterClick}
          className="gap-2 shrink-0 hover:bg-primary/5 hover:border-primary/30"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </EnhancedButton>
      )}
    </div>
  );
};

export default SearchInput;