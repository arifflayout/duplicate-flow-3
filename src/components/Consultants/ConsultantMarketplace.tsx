import React, { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { formatCurrency } from '@/utils/formatters';
import EmptyState from '@/components/common/EmptyState';
import StatusBadge from '@/components/common/StatusBadge';
import SearchInput from '@/components/common/SearchInput';
import FilterPanel from '@/components/common/FilterPanel';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Users, 
  Award, 
  Building, 
  Eye, 
  MessageCircle,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { User } from '@/types';
import BidSubmissionModal from './BidSubmissionModal';
import ConsultantDetailView from './ConsultantDetailView';

interface ConsultantMarketplaceProps {
  selectedProject?: {
    id: string;
    name: string;
    type: string;
    budget: string;
  };
}

const ConsultantMarketplace: React.FC<ConsultantMarketplaceProps> = ({ selectedProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    experience: '',
    budget: '',
    availability: '',
    rating: [0, 5] as number[]
  });

  const mockConsultants = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@architectstudio.com',
      role: 'consultant' as const,
      company: 'Chen Architecture & Design',
      specialties: ['Residential Design', 'Sustainable Architecture', 'Interior Design'],
      location: 'Kuala Lumpur',
      avatar: '/placeholder.svg',
      rating: 4.9,
      reviewCount: 127,
      projectsCompleted: 45,
      yearsExperience: 8,
      hourlyRate: 150,
      portfolio: ['/placeholder.svg'],
      certifications: ['RIBA', 'PAM Certified', 'Green Building Professional'],
      description: 'Passionate architect specializing in sustainable residential and commercial design with over 8 years of experience in Malaysian property development.',
      availability: 'Available',
      responseTime: '2-4 hours',
      languages: ['English', 'Mandarin', 'Bahasa Malaysia'],
      recentProjects: [
        { name: 'Eco Residences KL', type: 'Residential', value: 15000000, year: 2023 },
        { name: 'Green Office Complex', type: 'Commercial', value: 25000000, year: 2023 }
      ]
    },
    {
      id: '2',
      name: 'Ahmad Rahman',
      email: 'ahmad@structuralplus.com',
      role: 'consultant' as const,
      company: 'Structural Engineering Plus',
      specialties: ['Structural Engineering', 'Foundation Design', 'Construction Management'],
      location: 'Shah Alam',
      avatar: '/placeholder.svg',
      rating: 4.8,
      reviewCount: 89,
      projectsCompleted: 62,
      yearsExperience: 12,
      hourlyRate: 180,
      portfolio: ['/placeholder.svg'],
      certifications: ['Professional Engineer', 'Project Management Professional', 'IEM Member'],
      description: 'Senior structural engineer with extensive experience in high-rise and residential construction projects across Malaysia.',
      availability: 'Limited',
      responseTime: '4-6 hours',
      languages: ['English', 'Bahasa Malaysia'],
      recentProjects: [
        { name: 'Twin Towers Residence', type: 'Residential', value: 80000000, year: 2023 },
        { name: 'Shopping Complex PJ', type: 'Commercial', value: 45000000, year: 2022 }
      ]
    },
    {
      id: '3',
      name: 'Linda Tan',
      email: 'linda@mepservices.com',
      role: 'consultant' as const,
      company: 'MEP Engineering Services',
      specialties: ['MEP Engineering', 'HVAC Design', 'Energy Systems'],
      location: 'Petaling Jaya',
      avatar: '/placeholder.svg',
      rating: 4.7,
      reviewCount: 156,
      projectsCompleted: 78,
      yearsExperience: 10,
      hourlyRate: 140,
      portfolio: ['/placeholder.svg'],
      certifications: ['ASHRAE Certified', 'Energy Auditor', 'BEM Registration'],
      description: 'MEP engineering specialist focused on energy-efficient building systems and smart automation for modern developments.',
      availability: 'Available',
      responseTime: '1-2 hours',
      languages: ['English', 'Mandarin'],
      recentProjects: [
        { name: 'Smart Office Tower', type: 'Commercial', value: 35000000, year: 2023 },
        { name: 'Luxury Condominiums', type: 'Residential', value: 28000000, year: 2023 }
      ]
    }
  ];

  const filterOptions = [
    {
      id: 'specialty',
      label: 'Specialty',
      type: 'multiselect' as const,
      icon: <Building className="h-4 w-4 text-primary" />,
      collapsible: true,
      defaultExpanded: true,
      options: [
        { id: 'architecture', label: 'Architecture', value: 'architecture', count: 45, description: 'Building design & planning' },
        { id: 'structural', label: 'Structural Engineering', value: 'structural', count: 32, description: 'Structural design & analysis' },
        { id: 'mep', label: 'MEP Engineering', value: 'mep', count: 28, description: 'Mechanical, electrical, plumbing' },
        { id: 'quantity', label: 'Quantity Surveying', value: 'quantity', count: 22, description: 'Cost estimation & management' },
        { id: 'landscape', label: 'Landscape Architecture', value: 'landscape', count: 18, description: 'Landscape design & planning' },
        { id: 'planning', label: 'Town Planning', value: 'planning', count: 15, description: 'Urban & regional planning' }
      ]
    },
    {
      id: 'location',
      label: 'Location',
      type: 'select' as const,
      icon: <MapPin className="h-4 w-4 text-success" />,
      collapsible: true,
      defaultExpanded: false,
      options: [
        { id: 'kl', label: 'Kuala Lumpur', value: 'kuala lumpur', count: 85 },
        { id: 'selangor', label: 'Selangor', value: 'selangor', count: 92 },
        { id: 'johor', label: 'Johor', value: 'johor', count: 34 },
        { id: 'penang', label: 'Penang', value: 'penang', count: 28 },
        { id: 'perak', label: 'Perak', value: 'perak', count: 15 }
      ]
    },
    {
      id: 'experience',
      label: 'Years of Experience',
      type: 'select' as const,
      icon: <Calendar className="h-4 w-4 text-info" />,
      collapsible: true,
      defaultExpanded: false,
      options: [
        { id: '0-2', label: '0-2 years', value: '0-2', count: 12 },
        { id: '3-5', label: '3-5 years', value: '3-5', count: 28 },
        { id: '6-10', label: '6-10 years', value: '6-10', count: 45 },
        { id: '10+', label: '10+ years', value: '10+', count: 38 }
      ]
    },
    {
      id: 'rating',
      label: 'Minimum Rating',
      type: 'range' as const,
      icon: <Star className="h-4 w-4 text-warning" />,
      collapsible: true,
      defaultExpanded: false,
      min: 0,
      max: 5,
      step: 0.1
    },
    {
      id: 'availability',
      label: 'Availability',
      type: 'toggle' as const,
      icon: <Clock className="h-4 w-4 text-warning" />,
      collapsible: false,
      options: [
        { id: 'available', label: 'Available', value: 'available' },
        { id: 'all', label: 'All', value: '' }
      ]
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredConsultants = mockConsultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         consultant.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         consultant.specialties.some(s => s.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    
    const matchesSpecialty = !filters.specialty || 
                           consultant.specialties.some(s => s.toLowerCase().includes(filters.specialty.toLowerCase()));
    
    const matchesLocation = !filters.location || 
                          consultant.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesExperience = !filters.experience || (() => {
      const exp = consultant.yearsExperience;
      switch (filters.experience) {
        case '0-2': return exp <= 2;
        case '3-5': return exp >= 3 && exp <= 5;
        case '6-10': return exp >= 6 && exp <= 10;
        case '10+': return exp > 10;
        default: return true;
      }
    })();

    const matchesAvailability = !filters.availability || consultant.availability.toLowerCase() === filters.availability.toLowerCase();
    
    const matchesRating = consultant.rating >= (filters.rating[0] || 0);
    
    return matchesSearch && matchesSpecialty && matchesLocation && matchesExperience && matchesAvailability && matchesRating;
  });

  const sortedConsultants = [...filteredConsultants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.yearsExperience - a.yearsExperience;
      case 'projects':
        return b.projectsCompleted - a.projectsCompleted;
      case 'rate-low':
        return a.hourlyRate - b.hourlyRate;
      case 'rate-high':
        return b.hourlyRate - a.hourlyRate;
      default:
        return 0;
    }
  });

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      specialty: '',
      location: '',
      experience: '',
      budget: '',
      availability: '',
      rating: [0, 5]
    });
    setSearchTerm('');
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'available': return 'success';
      case 'limited': return 'warning';
      case 'busy': return 'error';
      default: return 'neutral';
    }
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof typeof filters];
    if (Array.isArray(value)) return value.length > 0 && !(value.length === 2 && value[0] === 0 && value[1] === 5);
    return value !== undefined && value !== '' && value !== null;
  }).length;

  const ConsultantCard = ({ consultant }: { consultant: any }) => (
    <EnhancedCard variant="consultant" className="group hover:shadow-xl transition-all duration-300">
      <EnhancedCardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-lg">
              <AvatarImage src={consultant.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-info/10 text-primary font-semibold">
                {getInitials(consultant.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1">
              <EnhancedBadge 
                variant={getAvailabilityColor(consultant.availability)} 
                size="sm"
                className="shadow-lg"
              >
                {consultant.availability}
              </EnhancedBadge>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {consultant.name}
            </h3>
            <p className="text-muted-foreground font-medium">{consultant.company}</p>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{consultant.rating}</span>
                <span className="text-muted-foreground">({consultant.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{consultant.location}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{consultant.responseTime}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">RM{consultant.hourlyRate}</div>
            <div className="text-sm text-muted-foreground">per hour</div>
          </div>
        </div>
      </EnhancedCardHeader>
      
      <EnhancedCardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{consultant.description}</p>
        
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            Specialties
          </h4>
          <div className="flex flex-wrap gap-2">
            {consultant.specialties.map((specialty: string, index: number) => (
              <EnhancedBadge key={index} variant="info" size="sm">
                {specialty}
              </EnhancedBadge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 bg-surface-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Building className="h-4 w-4 text-primary" />
            </div>
            <p className="text-lg font-bold">{consultant.projectsCompleted}</p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <p className="text-lg font-bold">{consultant.yearsExperience}yr</p>
            <p className="text-xs text-muted-foreground">Experience</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <p className="text-lg font-bold">{consultant.certifications.length}</p>
            <p className="text-xs text-muted-foreground">Certificates</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Award className="h-4 w-4 text-success" />
            Certifications
          </h4>
          <div className="flex flex-wrap gap-2">
            {consultant.certifications.slice(0, 3).map((cert: string, index: number) => (
              <EnhancedBadge key={index} variant="success" size="sm">
                {cert}
              </EnhancedBadge>
            ))}
            {consultant.certifications.length > 3 && (
              <EnhancedBadge variant="neutral" size="sm">
                +{consultant.certifications.length - 3} more
              </EnhancedBadge>
            )}
          </div>
        </div>

        <div className="flex space-x-2 pt-4 border-t border-border">
          <EnhancedButton 
            variant="outline" 
            className="flex-1 group/btn hover:bg-primary/5 hover:border-primary/30"
            onClick={() => {
              setSelectedConsultant(consultant);
              setShowDetailModal(true);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </EnhancedButton>
          
          {selectedProject && (
            <EnhancedButton 
              variant="gradient"
              className="flex-1 shadow-lg hover:shadow-xl transition-shadow duration-300"
              onClick={() => {
                setSelectedConsultant(consultant);
                setShowBidModal(true);
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Request Proposal
            </EnhancedButton>
          )}
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  );

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-info text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Expert Consultants
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Connect with qualified professionals for your development project across all disciplines.
            </p>
            
            {selectedProject && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">Project: {selectedProject.name}</div>
                    <div className="text-sm text-white/80">Type: {selectedProject.type} • Budget: {selectedProject.budget}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Hero Search */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search consultants by name, company, or specialty..."
                size="lg"
                showFilterButton={true}
                onFilterClick={() => setShowFilters(!showFilters)}
                showSuggestions={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-primary">{mockConsultants.length}</div>
            <div className="text-sm text-muted-foreground">Available Consultants</div>
          </EnhancedCard>
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-success">
              {mockConsultants.filter(c => c.availability === 'Available').length}
            </div>
            <div className="text-sm text-muted-foreground">Available Now</div>
          </EnhancedCard>
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-info">
              {Math.round(mockConsultants.reduce((sum, c) => sum + c.rating, 0) / mockConsultants.length * 10) / 10}
            </div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </EnhancedCard>
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-warning">6</div>
            <div className="text-sm text-muted-foreground">Disciplines</div>
          </EnhancedCard>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 transition-all duration-300 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-24">
              <FilterPanel
                filters={filterOptions}
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
                title="Find Consultants"
                showActiveCount={true}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">
                  {filteredConsultants.length} Consultants Found
                </h2>
                <EnhancedBadge variant="info">
                  {filteredConsultants.length} of {mockConsultants.length}
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
              
              <div className="hidden md:block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experience</option>
                  <option value="projects">Most Projects</option>
                  <option value="rate-low">Lowest Rate</option>
                  <option value="rate-high">Highest Rate</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {sortedConsultants.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No consultants found"
                description="Try adjusting your search criteria or filters to find more consultants."
                actionLabel="Clear Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {sortedConsultants.map((consultant) => (
                  <ConsultantCard key={consultant.id} consultant={consultant} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBidModal && selectedConsultant && selectedProject && (
        <BidSubmissionModal
          isOpen={showBidModal}
          onClose={() => {
            setShowBidModal(false);
            setSelectedConsultant(null);
          }}
          consultant={selectedConsultant}
          project={selectedProject}
          onSubmit={(bidData) => {
            console.log('Bid submitted:', bidData);
            setShowBidModal(false);
            setSelectedConsultant(null);
          }}
        />
      )}

      {showDetailModal && selectedConsultant && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Consultant Profile</DialogTitle>
            </DialogHeader>
            <ConsultantDetailView consultant={selectedConsultant} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ConsultantMarketplace;