import React, { useState } from 'react';
import SearchInput from '@/components/common/SearchInput';
import FilterPanel from '@/components/common/FilterPanel';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Star, 
  Clock, 
  DollarSign, 
  Percent, 
  Calendar,
  Search,
  Filter,
  CheckCircle,
  Shield,
  TrendingUp,
  SlidersHorizontal,
  Award,
  Users
} from 'lucide-react';

interface LenderMarketplaceProps {
  userRole?: 'developer' | 'lender';
}

const LenderMarketplace: React.FC<LenderMarketplaceProps> = ({ userRole = 'developer' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [filters, setFilters] = useState({
    loanType: '',
    lenderType: '',
    interestRate: [0, 10] as number[],
    processingTime: '',
    minAmount: [0, 50] as number[]
  });

  // Mock lender data
  const lenders = [
    {
      id: '1',
      name: 'Development Bank Malaysia',
      type: 'Government Bank',
      logo: '🏛️',
      rating: 4.8,
      reviewCount: 245,
      minRate: 4.2,
      maxRate: 5.5,
      processingTime: '14-21 days',
      minAmount: 500000,
      maxAmount: 50000000,
      specialties: ['Development Loans', 'Islamic Financing', 'Government Projects'],
      verified: true,
      description: 'Leading government bank specializing in property development financing with competitive rates.',
      loanTypes: ['development', 'construction', 'bridging'],
      requirements: {
        minExperience: 5,
        minEquity: 30,
        creditScore: 700
      },
      advantages: ['Government backing', 'Competitive rates', 'Flexible terms'],
      recentFunding: 125000000,
      successRate: 92
    },
    {
      id: '2',
      name: 'Property Finance Solutions',
      type: 'Private Lender',
      logo: '🏢',
      rating: 4.6,
      reviewCount: 189,
      minRate: 4.8,
      maxRate: 6.2,
      processingTime: '7-14 days',
      minAmount: 300000,
      maxAmount: 20000000,
      specialties: ['Quick Approval', 'Flexible Terms', 'Strata Development'],
      verified: true,
      description: 'Fast and flexible private lending solutions for property developers.',
      loanTypes: ['development', 'bridging', 'end-financing'],
      requirements: {
        minExperience: 3,
        minEquity: 25,
        creditScore: 650
      },
      advantages: ['Fast processing', 'Flexible criteria', 'Personal service'],
      recentFunding: 85000000,
      successRate: 88
    },
    {
      id: '3',
      name: 'Islamic Development Fund',
      type: 'Islamic Bank',
      logo: '🕌',
      rating: 4.7,
      reviewCount: 156,
      minRate: 4.5,
      maxRate: 5.8,
      processingTime: '10-18 days',
      minAmount: 400000,
      maxAmount: 30000000,
      specialties: ['Shariah Compliant', 'Residential Development', 'Commercial Projects'],
      verified: true,
      description: 'Shariah-compliant financing solutions for ethical property development.',
      loanTypes: ['development', 'construction'],
      requirements: {
        minExperience: 4,
        minEquity: 35,
        creditScore: 680
      },
      advantages: ['Shariah compliant', 'Ethical financing', 'Community focused'],
      recentFunding: 95000000,
      successRate: 90
    },
    {
      id: '4',
      name: 'Alternative Capital Partners',
      type: 'Alternative Lender',
      logo: '💼',
      rating: 4.4,
      reviewCount: 98,
      minRate: 5.5,
      maxRate: 8.0,
      processingTime: '5-10 days',
      minAmount: 200000,
      maxAmount: 15000000,
      specialties: ['High Risk Projects', 'Quick Turnaround', 'Unique Structures'],
      verified: true,
      description: 'Alternative financing for complex and high-risk development projects.',
      loanTypes: ['bridging', 'development'],
      requirements: {
        minExperience: 2,
        minEquity: 20,
        creditScore: 600
      },
      advantages: ['High risk tolerance', 'Creative solutions', 'Speed'],
      recentFunding: 45000000,
      successRate: 85
    }
  ];

  const filterOptions = [
    {
      id: 'loanType',
      label: 'Loan Type',
      type: 'multiselect' as const,
      icon: <DollarSign className="h-4 w-4 text-primary" />,
      collapsible: true,
      defaultExpanded: true,
      options: [
        { id: 'development', label: 'Development Loans', value: 'development', count: 12, description: 'Land development financing' },
        { id: 'construction', label: 'Construction Loans', value: 'construction', count: 15, description: 'Building construction funding' },
        { id: 'bridging', label: 'Bridging Loans', value: 'bridging', count: 8, description: 'Short-term financing' },
        { id: 'end-financing', label: 'End Financing', value: 'end-financing', count: 10, description: 'Long-term property loans' }
      ]
    },
    {
      id: 'lenderType',
      label: 'Lender Type',
      type: 'select' as const,
      icon: <Building2 className="h-4 w-4 text-success" />,
      collapsible: true,
      defaultExpanded: false,
      options: [
        { id: 'government', label: 'Government Banks', value: 'government bank', count: 8 },
        { id: 'private', label: 'Private Lenders', value: 'private lender', count: 12 },
        { id: 'islamic', label: 'Islamic Banks', value: 'islamic bank', count: 6 },
        { id: 'alternative', label: 'Alternative Lenders', value: 'alternative lender', count: 4 }
      ]
    },
    {
      id: 'interestRate',
      label: 'Interest Rate (%)',
      type: 'range' as const,
      icon: <Percent className="h-4 w-4 text-info" />,
      collapsible: true,
      defaultExpanded: false,
      min: 0,
      max: 10,
      step: 0.1
    },
    {
      id: 'processingTime',
      label: 'Processing Time',
      type: 'select' as const,
      icon: <Clock className="h-4 w-4 text-warning" />,
      collapsible: true,
      defaultExpanded: false,
      options: [
        { id: 'fast', label: 'Under 1 week', value: 'fast', count: 5 },
        { id: 'standard', label: '1-2 weeks', value: 'standard', count: 12 },
        { id: 'extended', label: '2-4 weeks', value: 'extended', count: 8 }
      ]
    }
  ];

  const filteredLenders = lenders.filter(lender => {
    const matchesSearch = lender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lender.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesLoanType = !filters.loanType || 
      lender.loanTypes.some(type => type.includes(filters.loanType));
    
    const matchesLenderType = !filters.lenderType || 
      lender.type.toLowerCase().includes(filters.lenderType.toLowerCase());
    
    const matchesRate = lender.minRate >= filters.interestRate[0] && lender.maxRate <= filters.interestRate[1];
    
    return matchesSearch && matchesLoanType && matchesLenderType && matchesRate;
  });

  const sortedLenders = [...filteredLenders].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'rate':
        return a.minRate - b.minRate;
      case 'speed':
        return parseInt(a.processingTime) - parseInt(b.processingTime);
      default:
        return 0;
    }
  });

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      loanType: '',
      lenderType: '',
      interestRate: [0, 10],
      processingTime: '',
      minAmount: [0, 50]
    });
    setSearchTerm('');
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof typeof filters];
    if (Array.isArray(value)) {
      if (key === 'interestRate') return !(value[0] === 0 && value[1] === 10);
      if (key === 'minAmount') return !(value[0] === 0 && value[1] === 50);
      return value.length > 0;
    }
    return value !== undefined && value !== '' && value !== null;
  }).length;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-info text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Financing Partners
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Connect with trusted lenders and secure funding for your development project.
            </p>
            
            {/* Hero Search */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search lenders by name, type, or specialization..."
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
            <div className="text-2xl font-bold text-primary">{lenders.length}</div>
            <div className="text-sm text-muted-foreground">Available Lenders</div>
          </EnhancedCard>
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-success">
              {Math.round(lenders.reduce((sum, l) => sum + l.successRate, 0) / lenders.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Success Rate</div>
          </EnhancedCard>
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-info">
              {Math.min(...lenders.map(l => l.minRate)).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Lowest Rate</div>
          </EnhancedCard>
          <EnhancedCard variant="metric" className="text-center">
            <div className="text-2xl font-bold text-warning">
              RM {Math.round(lenders.reduce((sum, l) => sum + l.recentFunding, 0) / 1000000)}M
            </div>
            <div className="text-sm text-muted-foreground">Total Funded</div>
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
                title="Refine Search"
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
                  {filteredLenders.length} Lenders Found
                </h2>
                <EnhancedBadge variant="info">
                  {filteredLenders.length} of {lenders.length}
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
                {userRole === 'lender' && (
                  <EnhancedButton variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Register as Lender
                  </EnhancedButton>
                )}
                
                <div className="hidden md:block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="rate">Lowest Rate</option>
                    <option value="speed">Fastest Processing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lender Cards */}
            <div className="grid gap-6">
              {sortedLenders.map((lender) => (
                <EnhancedCard key={lender.id} variant="elevated" className="hover:shadow-xl transition-all duration-300 group">
                  <EnhancedCardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Lender Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-info/10 rounded-2xl flex items-center justify-center text-3xl border border-primary/20">
                              {lender.logo}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{lender.name}</h3>
                                {lender.verified && (
                                  <EnhancedBadge variant="success" className="gap-1">
                                    <Shield className="h-3 w-3" />
                                    Verified
                                  </EnhancedBadge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{lender.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{lender.rating}</span>
                            <span className="text-sm text-muted-foreground">({lender.reviewCount})</span>
                          </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">{lender.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {lender.specialties.map((specialty) => (
                            <EnhancedBadge key={specialty} variant="info" size="sm">
                              {specialty}
                            </EnhancedBadge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {lender.advantages.map((advantage, index) => (
                            <EnhancedBadge key={index} variant="success" size="sm">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {advantage}
                            </EnhancedBadge>
                          ))}
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="lg:w-80 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-surface-50 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Percent className="h-5 w-5 text-success" />
                            </div>
                            <div className="font-bold text-lg">{lender.minRate}% - {lender.maxRate}%</div>
                            <div className="text-xs text-muted-foreground">Interest Rate</div>
                          </div>
                          <div className="bg-surface-50 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Clock className="h-5 w-5 text-info" />
                            </div>
                            <div className="font-bold text-lg">{lender.processingTime}</div>
                            <div className="text-xs text-muted-foreground">Processing</div>
                          </div>
                          <div className="bg-surface-50 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              <DollarSign className="h-5 w-5 text-primary" />
                            </div>
                            <div className="font-bold text-sm">
                              RM {(lender.minAmount / 1000000).toFixed(1)}M - {(lender.maxAmount / 1000000).toFixed(0)}M
                            </div>
                            <div className="text-xs text-muted-foreground">Loan Range</div>
                          </div>
                          <div className="bg-surface-50 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              <TrendingUp className="h-5 w-5 text-warning" />
                            </div>
                            <div className="font-bold text-lg">{lender.successRate}%</div>
                            <div className="text-xs text-muted-foreground">Success Rate</div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-info/10 to-primary/10 rounded-lg p-4 border border-info/20">
                          <h4 className="font-semibold text-info mb-2">Requirements</h4>
                          <div className="text-sm text-info/80 space-y-1">
                            <div>• Min {lender.requirements.minExperience} years experience</div>
                            <div>• {lender.requirements.minEquity}% equity contribution</div>
                            <div>• Credit score {lender.requirements.creditScore}+</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <EnhancedButton variant="outline" size="sm" className="flex-1">
                            View Details
                          </EnhancedButton>
                          <EnhancedButton variant="gradient" size="sm" className="flex-1 shadow-lg">
                            Apply Now
                          </EnhancedButton>
                        </div>
                      </div>
                    </div>
                  </EnhancedCardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LenderMarketplace;