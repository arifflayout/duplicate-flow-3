import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'location' | 'consultant' | 'project' | 'feature' | 'category';
  category?: string;
  count?: number;
  metadata?: Record<string, any>;
}

export interface SearchFilters {
  [key: string]: any;
}

export interface UseAdvancedSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFunctions?: Record<string, (item: T, value: any) => boolean>;
  sortFunctions?: Record<string, (a: T, b: T) => number>;
  suggestions?: SearchSuggestion[];
  debounceMs?: number;
}

export function useAdvancedSearch<T>({
  data,
  searchFields,
  filterFunctions = {},
  sortFunctions = {},
  suggestions = [],
  debounceMs = 300
}: UseAdvancedSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load recent searches:', error);
      }
    }
  }, []);

  // Save search term to recent searches
  const saveSearchTerm = (term: string) => {
    if (!term.trim() || recentSearches.includes(term)) return;
    
    const updated = [term, ...recentSearches.slice(0, 9)]; // Keep last 10
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply text search
    if (debouncedSearchTerm) {
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
          }
          if (Array.isArray(value)) {
            return value.some(v => 
              typeof v === 'string' && 
              v.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
          }
          return false;
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === null) return;
      
      if (Array.isArray(value) && value.length === 0) return;

      const filterFn = filterFunctions[key];
      if (filterFn) {
        result = result.filter(item => filterFn(item, value));
      }
    });

    // Apply sorting
    if (sortBy && sortFunctions[sortBy]) {
      result.sort(sortFunctions[sortBy]);
    }

    return result;
  }, [data, debouncedSearchTerm, filters, sortBy, searchFields, filterFunctions, sortFunctions]);

  // Get filtered suggestions based on search term
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm) return [];
    
    return suggestions
      .filter(suggestion =>
        suggestion.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8);
  }, [searchTerm, suggestions]);

  // Update filter
  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Clear specific filter
  const clearFilter = (key: string) => {
    setFilters(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter(key => {
      const value = filters[key];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== '' && value !== null;
    }).length;
  }, [filters]);

  // Handle search submission
  const handleSearchSubmit = (term?: string) => {
    const searchValue = term || searchTerm;
    if (searchValue.trim()) {
      saveSearchTerm(searchValue.trim());
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.text);
    saveSearchTerm(suggestion.text);
    
    // Auto-apply filters based on suggestion type
    if (suggestion.type === 'location' && filterFunctions.location) {
      updateFilter('location', suggestion.text);
    } else if (suggestion.type === 'category' && filterFunctions.category) {
      updateFilter('category', suggestion.text);
    }
  };

  return {
    // Search state
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    
    // Filter state
    filters,
    updateFilter,
    clearFilter,
    clearFilters,
    activeFilterCount,
    
    // Sort state
    sortBy,
    setSortBy,
    
    // Results
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length,
    
    // Suggestions
    filteredSuggestions,
    recentSearches,
    
    // Actions
    handleSearchSubmit,
    handleSuggestionSelect,
    saveSearchTerm
  };
}

export default useAdvancedSearch;