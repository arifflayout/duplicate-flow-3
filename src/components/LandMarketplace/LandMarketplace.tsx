import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { formatCurrency } from '@/utils/formatters';
import { PROJECT_TYPES } from '@/utils/constants';
import EmptyState from '@/components/common/EmptyState';
import StatusBadge from '@/components/common/StatusBadge';
import SearchInput from '@/components/common/SearchInput';
import FilterPanel from '@/components/common/FilterPanel';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MapPin, 
  Filter, 
  Heart, 
  Building, 
  Eye, 
  Share2,
  Bookmark,
  TrendingUp,
  Calendar,
  Ruler,
  FileText,
  Star,
  ChevronRight,
  SlidersHorizontal,
  Grid3X3,
  Map as MapIcon,
  Layers
} from 'lucide-react';
import { LandListing } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';

interface LandMarketplaceProps {
  onLandSelect?: (land: any) => void;
}

const LandMarketplace: React.FC<LandMarketplaceProps> = ({ onLandSelect }) => {
  const { addProject } = useProject();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [savedListings, setSavedListings] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    priceRange: '',
    zoning: '',
    size: '',
    location: '',
    features: [] as string[]
  });

  const mockListings: LandListing[] = [
    {
      id: '1',
      title: 'Prime Commercial Land - KLCC Vicinity',
      location: 'Kuala Lumpur City Centre',
      coordinates: { lat: 3.1478, lng: 101.6953 },
      price: 15000000,
      size: 2.5,
      zoning: 'Commercial',
      description: 'Premium commercial land with excellent connectivity to KLCC and major highways. Perfect for mixed-use development with high ROI potential.',
      images: ['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'],
      documents: ['title-deed.pdf', 'survey-plan.pdf'],
      ownerId: 'owner1',
      features: ['Corner Lot', 'Highway Access', 'Utilities Available', 'High Visibility'],
      isActive: true
    },
    {
      id: '2',
      title: 'Residential Development Land - Selangor',
      location: 'Shah Alam, Selangor',
      coordinates: { lat: 3.0738, lng: 101.5183 },
      price: 8500000,
      size: 5.2,
      zoning: 'Residential',
      description: 'Ideal for medium-density residential development with approved master plan. Located in established residential area with good infrastructure.',
      images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
      documents: ['master-plan.pdf', 'approval-letter.pdf'],
      ownerId: 'owner2',
      features: ['Master Plan Approved', 'Near LRT', 'School Nearby', 'Gated Community'],
      isActive: true
    },
    {
      id: '3',
      title: 'Mixed Development Opportunity - Petaling Jaya',
      location: 'Petaling Jaya, Selangor',
      coordinates: { lat: 3.1073, lng: 101.6067 },
      price: 12000000,
      size: 3.8,
      zoning: 'Mixed Development',
      description: 'Strategic location for mixed-use development with high foot traffic. Excellent for retail-residential combination project.',
      images: ['https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg'],
      documents: ['feasibility-study.pdf', 'traffic-impact.pdf'],
      ownerId: 'owner3',
      features: ['High Visibility', 'Public Transport', 'Commercial Zone', 'Mixed Use Approved'],
      isActive: true
    },
    {
      id: '4',
      title: 'Waterfront Development Site - Johor',
      location: 'Johor Bahru, Johor',
      coordinates: { lat: 1.4927, lng: 103.7414 },
      price: 22000000,
      size: 8.1,
      zoning: 'Tourism',
      description: 'Rare waterfront development opportunity with panoramic sea views. Perfect for luxury resort or residential development.',
      images: ['https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg'],
      documents: ['environmental-clearance.pdf', 'coastal-permit.pdf'],
      ownerId: 'owner4',
      features: ['Waterfront', 'Sea View', 'Tourism Zone', 'Beach Access'],
      isActive: true
    }
  ];

  const filterOptions = [
    {
      id: 'priceRange',
      label: 'Price Range',
      type: 'select' as const,
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
      collapsible: true,
      defaultExpanded: true,
      options: [
        { id: '0-5m', label: 'RM 0 - 5M', value: '0-5m', count: 12 },
        { id: '5m-10m', label: 'RM 5M - 10M', value: '5m-10m', count: 8 },
        { id: '10m-20m', label: 'RM 10M - 20M', value: '10m-20m', count: 15 },
        { id: '20m+', label: 'RM 20M+', value: '20m+', count: 6 }
      ]
    },
    {
      id: 'zoning',
      label: 'Zoning Type',
      type: 'multiselect' as const,
      icon: <Building className="h-4 w-4 text-success" />,
      collapsible: true,
      defaultExpanded: true,
      options: [
        { id: 'commercial', label: 'Commercial', value: 'commercial', count: 18, description: 'Office, retail, business' },
        { id: 'residential', label: 'Residential', value: 'residential', count: 24, description: 'Housing, landed properties' },
        { id: 'mixed', label: 'Mixed Development', value: 'mixed', count: 12, description: 'Combined use development' },
        { id: 'industrial', label: 'Industrial', value: 'industrial', count: 8, description: 'Manufacturing, warehouse' },
        { id: 'tourism', label: 'Tourism', value: 'tourism', count: 4, description: 'Hotels, resorts, entertainment' }
      ]
    },
    {
      id: 'size',
      label: 'Land Size (Acres)',
      type: 'range' as const,
      icon: <Ruler className="h-4 w-4 text-info" />,
      collapsible: true,
      defaultExpanded: false,
      min: 0,
      max: 20,
      step: 0.5
    },
    {
      id: 'location',
      label: 'Location',
      type: 'select' as const,
      icon: <MapPin className="h-4 w-4 text-warning" />,
      collapsible: true,
      defaultExpanded: false,
      options: [
        { id: 'kl', label: 'Kuala Lumpur', value: 'kuala lumpur', count: 28 },
        { id: 'selangor', label: 'Selangor', value: 'selangor', count: 35 },
        { id: 'johor', label: 'Johor', value: 'johor', count: 18 },
        { id: 'penang', label: 'Penang', value: 'penang', count: 12 },
        { id: 'perak', label: 'Perak', value: 'perak', count: 8 }
      ]
    },
    {
      id: 'features',
      label: 'Key Features',
      type: 'multiselect' as const,
      icon: <Star className="h-4 w-4 text-warning" />,
      collapsible: true,
      defaultExpanded: false,
      options: [
        { id: 'corner-lot', label: 'Corner Lot', value: 'corner lot', count: 15 },
        { id: 'highway-access', label: 'Highway Access', value: 'highway access', count: 22 },
        { id: 'utilities', label: 'Utilities Available', value: 'utilities available', count: 38 },
        { id: 'approved-plan', label: 'Approved Master Plan', value: 'master plan approved', count: 8 },
        { id: 'waterfront', label: 'Waterfront', value: 'waterfront', count: 4 },
        { id: 'near-lrt', label: 'Near LRT/MRT', value: 'near lrt', count: 18 }
      ]
    }
  ];

  const getZoningColor = (zoning: string): "default" | "primary" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error" | "info" | "neutral" => {
    const colors: Record<string, "default" | "primary" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error" | "info" | "neutral"> = {
      'Commercial': 'info',
      'Residential': 'success',
      'Mixed Development': 'warning',
      'Industrial': 'neutral',
      'Tourism': 'info'
    };
    return colors[zoning] || 'neutral';
  };

  const toggleSaved = (listingId: string) => {
    setSavedListings(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesPriceRange = !filters.priceRange || (() => {
      const price = listing.price;
      switch (filters.priceRange) {
        case '0-5m': return price <= 5000000;
        case '5m-10m': return price > 5000000 && price <= 10000000;
        case '10m-20m': return price > 10000000 && price <= 20000000;
        case '20m+': return price > 20000000;
        default: return true;
      }
    })();
    
    const matchesZoning = !filters.zoning || listing.zoning.toLowerCase() === filters.zoning.toLowerCase();
    
    const matchesLocation = !filters.location || 
      listing.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesFeatures = !filters.features || filters.features.length === 0 ||
      filters.features.some(feature => 
        listing.features.some(listingFeature => 
          listingFeature.toLowerCase().includes(feature.toLowerCase())
        )
      );
    
    return matchesSearch && matchesPriceRange && matchesZoning && matchesLocation && matchesFeatures;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'size-large':
        return b.size - a.size;
      case 'size-small':
        return a.size - b.size;
      case 'newest':
        return new Date(b.id).getTime() - new Date(a.id).getTime(); // Mock date sorting
      default:
        return 0; // relevance - no sorting
    }
  });

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const clearAllFilters = () => {
    setFilters({ priceRange: '', zoning: '', size: '', location: '', features: [] });
    setSearchTerm('');
  };

  const handleStartProject = (listing: LandListing) => {
    // Create a new project from the land listing
    addProject({
      title: `${listing.title} Development`,
      description: listing.description,
      location: listing.location,
      type: listing.zoning.toLowerCase() as any,
      status: 'draft',
      budget: listing.price,
      participants: [],
      milestones: [],
      monitoring: [],
      compliance: []
    });

    toast({
      title: "Project Created",
      description: `New project has been created from this land listing.`
    });

    // Navigate to project brief or call the callback
    if (onLandSelect) {
      onLandSelect(listing);
    } else {
      // Navigate to project brief view
      window.dispatchEvent(new CustomEvent('app:navigateView', { detail: 'project-brief' }));
    }
  };

  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.priceRange) count++;
    if (filters.zoning) count++;
    if (filters.size) count++;
    if (filters.location) count++;
    if (filters.features && filters.features.length > 0) count += filters.features.length;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-info text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Development Land
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover premium development opportunities across Malaysia with detailed insights and verified documentation.
            </p>
            
            {/* Hero Search */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by location, features, or zoning type..."
                size="lg"
                showFilterButton={true}
                onFilterClick={() => setShowFilters(!showFilters)}
                className="mb-4"
                showSuggestions={true}
              />
              
              <div className="flex flex-wrap gap-3 mt-4">
                <EnhancedButton variant="secondary" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Kuala Lumpur
                </EnhancedButton>
                <EnhancedButton variant="secondary" size="sm">
                  <Building className="h-4 w-4 mr-2" />
                  Commercial
                </EnhancedButton>
                <EnhancedButton variant="secondary" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Under RM 10M
                </EnhancedButton>
                <EnhancedButton variant="secondary" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Highway Access
                </EnhancedButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-primary">{mockListings.length}</div>
            <div className="text-sm text-muted-foreground">Available Listings</div>
          </EnhancedCard>
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-success">15</div>
            <div className="text-sm text-muted-foreground">New This Week</div>
          </EnhancedCard>
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-info">8</div>
            <div className="text-sm text-muted-foreground">Prime Locations</div>
          </EnhancedCard>
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-warning">3</div>
            <div className="text-sm text-muted-foreground">Saved Properties</div>
          </EnhancedCard>
        </div>

        {/* View Controls */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={cn("lg:w-80 transition-all duration-300", showFilters ? "block" : "hidden lg:block")}>
            <div className="sticky top-24">
              <FilterPanel
                filters={filterOptions}
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
                title="Refine Search"
                showActiveCount={true}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Controls & Sorting */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">
                  {filteredListings.length} Properties Found
                </h2>
                <EnhancedBadge variant="info">
                  {filteredListings.length} of {mockListings.length}
                </EnhancedBadge>
                
                {/* Mobile Filter Toggle */}
                <EnhancedButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <EnhancedBadge variant="primary" size="sm">
                      {activeFilterCount}
                    </EnhancedBadge>
                  )}
                </EnhancedButton>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="hidden md:block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="size-large">Size: Largest First</option>
                    <option value="size-small">Size: Smallest First</option>
                    <option value="newest">Newest Listings</option>
                  </select>
                </div>
                
                {/* View Mode Toggle */}
                <EnhancedButton 
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="gap-2"
                >
                  <Grid3X3 className="h-4 w-4" />
                  Grid View
                </EnhancedButton>
                <EnhancedButton 
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="gap-2"
                >
                  <MapIcon className="h-4 w-4" />
                  Map View
                </EnhancedButton>
              </div>
            </div>

            {/* Listings Grid */}
            {viewMode === 'grid' && (
              <>
                {filteredListings.length === 0 ? (
                  <EmptyState
                    icon={Building}
                    title="No properties found"
                    description="Try adjusting your search criteria or filters to find more properties."
                    actionLabel="Clear Filters"
                    onAction={clearAllFilters}
                  />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sortedListings.map((listing) => (
                      <EnhancedCard 
                        key={listing.id} 
                        variant="property" 
                        className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        {/* Image Section */}
                        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-surface-100 to-surface-200">
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          
                          {/* Overlay Actions */}
                          <div className="absolute top-4 right-4 flex gap-2">
                            <EnhancedButton
                              variant="ghost"
                              size="icon-sm"
                              className="bg-white/90 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm"
                              onClick={() => toggleSaved(listing.id)}
                            >
                              <Heart 
                                className={`h-4 w-4 ${
                                  savedListings.includes(listing.id) 
                                    ? 'fill-red-500 text-red-500' 
                                    : ''
                                }`} 
                              />
                            </EnhancedButton>
                            <EnhancedButton
                              variant="ghost"
                              size="icon-sm"
                              className="bg-white/90 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm"
                            >
                              <Share2 className="h-4 w-4" />
                            </EnhancedButton>
                          </div>

                          {/* Price Badge */}
                          <div className="absolute bottom-4 left-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-white/20">
                              <div className="text-2xl font-bold text-primary">
                                {formatCurrency(listing.price)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatCurrency(listing.price / listing.size)} per acre
                              </div>
                            </div>
                          </div>

                          {/* Zoning Badge */}
                          <div className="absolute top-4 left-4">
                            <EnhancedBadge 
                              variant={getZoningColor(listing.zoning)}
                              className="shadow-lg backdrop-blur-sm"
                            >
                              {listing.zoning}
                            </EnhancedBadge>
                          </div>
                        </div>

                        {/* Content Section */}
                        <EnhancedCardContent className="p-6 bg-gradient-to-b from-background to-surface-50">
                          <div className="space-y-4">
                            {/* Title & Location */}
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                {listing.title}
                              </h3>
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-sm">{listing.location}</span>
                              </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-3 gap-4 py-4 border-y border-border bg-surface-50 rounded-lg px-4">
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Ruler className="h-4 w-4 text-primary" />
                                </div>
                                <div className="font-bold text-lg">{listing.size}</div>
                                <div className="text-xs text-muted-foreground">Acres</div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Building className="h-4 w-4 text-primary" />
                                </div>
                                <div className="font-bold text-lg">{listing.zoning}</div>
                                <div className="text-xs text-muted-foreground">Zoning</div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div className="font-bold text-lg">{listing.documents.length}</div>
                                <div className="text-xs text-muted-foreground">Documents</div>
                              </div>
                            </div>
                            
                            {/* Description */}
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                              {listing.description}
                            </p>
                            
                            {/* Features */}
                            <div className="flex flex-wrap gap-2 min-h-[2rem]">
                              {listing.features.slice(0, 3).map((feature, index) => (
                                <EnhancedBadge key={index} variant="neutral" size="sm" className="bg-primary/10 text-primary border-primary/20">
                                  {feature}
                                </EnhancedBadge>
                              ))}
                              {listing.features.length > 3 && (
                                <EnhancedBadge variant="neutral" size="sm" className="bg-info/10 text-info border-info/20">
                                  +{listing.features.length - 3} more
                                </EnhancedBadge>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                              <EnhancedButton 
                                variant="outline" 
                                className="flex-1 group/btn hover:bg-primary/5 hover:border-primary/30"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                                <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover/btn:opacity-100 transition-all duration-300 group-hover/btn:translate-x-1" />
                              </EnhancedButton>
                              <EnhancedButton 
                                variant="gradient" 
                                className="flex-1 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                onClick={() => handleStartProject(listing)}
                              >
                                Start Project
                              </EnhancedButton>
                            </div>
                          </div>
                        </EnhancedCardContent>
                      </EnhancedCard>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Map View Placeholder */}
            {viewMode === 'map' && (
              <EnhancedCard variant="elevated">
                <EnhancedCardContent className="p-8">
                  <div className="h-96 bg-gradient-to-br from-primary/5 to-info/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
                    </div>
                    
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-info rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <MapIcon className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Interactive Map Coming Soon</h3>
                      <p className="text-muted-foreground max-w-md">
                        Browse land listings with pinpoint accuracy on our interactive map with clustering and detailed property overlays
                      </p>
                      <EnhancedButton 
                        variant="outline" 
                        className="mt-6 gap-2"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 className="h-4 w-4" />
                        Switch to Grid View
                      </EnhancedButton>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandMarketplace;