import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Award, 
  FileText,
  MessageSquare,
  Eye,
  CheckCircle,
  DollarSign,
  Clock,
  Building
} from 'lucide-react';
import { ConsultantDiscipline, ProjectType, ConsultantProfile } from '@/types/consultant';
import { getDisciplineById } from '@/data/consultantDisciplines';
import { formatCurrency } from '@/utils/formatters';
import ConsultantProposalModal from './ConsultantProposalModal';
import ConsultantDetailView from './ConsultantDetailView';

interface DisciplineMarketplaceProps {
  discipline: ConsultantDiscipline;
  projectType: ProjectType;
  projectLocation: string;
  projectBudget: number;
  onConsultantAppointed: (consultantId: string) => void;
}

const DisciplineMarketplace: React.FC<DisciplineMarketplaceProps> = ({
  discipline,
  projectType,
  projectLocation,
  projectBudget,
  onConsultantAppointed
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedConsultant, setSelectedConsultant] = useState<ConsultantProfile | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const disciplineInfo = getDisciplineById(discipline);

  // Mock consultants data for this discipline
  const mockConsultants: ConsultantProfile[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'Urban Design Studio',
      discipline,
      email: 'sarah@urbandesign.com',
      phone: '+60123456789',
      location: 'Kuala Lumpur',
      coordinates: { lat: 3.1390, lng: 101.6869 },
      avatar: '/placeholder.svg',
      rating: 4.9,
      reviewCount: 127,
      projectsCompleted: 45,
      yearsExperience: 8,
      licenses: disciplineInfo?.requiredQualifications || [],
      certifications: ['Green Building Professional', 'BIM Certified'],
      memberships: ['PAM', 'LAM'],
      portfolio: [
        {
          id: '1',
          name: 'Eco Residences KL',
          type: 'residential',
          value: 15000000,
          location: 'Kuala Lumpur',
          completedDate: new Date('2023-12-01'),
          role: 'Lead Architect',
          images: ['/placeholder.svg'],
          description: 'Sustainable residential development with 80 units'
        }
      ],
      specializations: ['Sustainable Design', 'Residential Architecture', 'BIM Modeling'],
      availability: 'available',
      preferredProjectTypes: ['residential', 'strata'],
      minProjectValue: 1000000,
      maxProjectValue: 50000000,
      feeStructure: 'percentage',
      typicalFeeRange: { min: 3, max: 6 },
      sampleContracts: ['PAM Contract 2006']
    },
    {
      id: '2',
      name: 'Ahmad Rahman',
      company: 'Structural Engineering Plus',
      discipline,
      email: 'ahmad@structuralplus.com',
      phone: '+60123456790',
      location: 'Shah Alam',
      coordinates: { lat: 3.0738, lng: 101.5183 },
      rating: 4.8,
      reviewCount: 89,
      projectsCompleted: 62,
      yearsExperience: 12,
      licenses: disciplineInfo?.requiredQualifications || [],
      certifications: ['Professional Engineer', 'Seismic Design Specialist'],
      memberships: ['IEM', 'BEM'],
      portfolio: [
        {
          id: '2',
          name: 'Twin Towers Residence',
          type: 'strata',
          value: 80000000,
          location: 'Shah Alam',
          completedDate: new Date('2023-10-15'),
          role: 'Structural Engineer',
          images: ['/placeholder.svg'],
          description: 'High-rise residential towers with complex foundation'
        }
      ],
      specializations: ['High-rise Structures', 'Foundation Engineering', 'Seismic Design'],
      availability: 'limited',
      preferredProjectTypes: ['strata', 'commercial'],
      minProjectValue: 5000000,
      maxProjectValue: 200000000,
      feeStructure: 'lump-sum',
      typicalFeeRange: { min: 2, max: 4 },
      sampleContracts: ['IEM Contract']
    }
  ];

  const filteredConsultants = mockConsultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || 
                          consultant.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesExperience = experienceFilter === 'all' || (() => {
      const exp = consultant.yearsExperience;
      switch (experienceFilter) {
        case '0-5': return exp <= 5;
        case '6-10': return exp >= 6 && exp <= 10;
        case '11-15': return exp >= 11 && exp <= 15;
        case '15+': return exp > 15;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesLocation && matchesExperience;
  });

  const sortedConsultants = [...filteredConsultants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.yearsExperience - a.yearsExperience;
      case 'projects':
        return b.projectsCompleted - a.projectsCompleted;
      case 'distance':
        // Mock distance calculation
        return 0;
      default:
        return 0;
    }
  });

  const calculateDistance = (consultant: ConsultantProfile) => {
    // Mock distance calculation - in real app, use geolocation
    return Math.floor(Math.random() * 50) + 1;
  };

  const estimateFee = (consultant: ConsultantProfile) => {
    if (consultant.feeStructure === 'percentage') {
      const avgPercentage = (consultant.typicalFeeRange.min + consultant.typicalFeeRange.max) / 2;
      return (projectBudget * avgPercentage) / 100;
    }
    return consultant.typicalFeeRange.max * 10000; // Mock lump sum
  };

  return (
    <div className="space-y-6">
      {/* Discipline Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-3xl">{disciplineInfo?.icon}</span>
            <div>
              <h2 className="text-2xl">{disciplineInfo?.name} Marketplace</h2>
              <p className="text-muted-foreground">{disciplineInfo?.description}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Required Qualifications:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {disciplineInfo?.requiredQualifications.map((qual, index) => (
                  <li key={index}>• {qual}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Typical Deliverables:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {disciplineInfo?.typicalDeliverables.map((deliverable, index) => (
                  <li key={index}>• {deliverable}</li>
                ))}
              </ul>
            </div>
          </div>
          {disciplineInfo?.regulatoryRole && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Regulatory Role:</h4>
              <p className="text-sm text-blue-700">{disciplineInfo.regulatoryRole}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${disciplineInfo?.name.toLowerCase()}s...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="kuala lumpur">Kuala Lumpur</SelectItem>
                <SelectItem value="selangor">Selangor</SelectItem>
                <SelectItem value="johor">Johor</SelectItem>
                <SelectItem value="penang">Penang</SelectItem>
              </SelectContent>
            </Select>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience</SelectItem>
                <SelectItem value="0-5">0-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="11-15">11-15 years</SelectItem>
                <SelectItem value="15+">15+ years</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
                <SelectItem value="projects">Most Projects</SelectItem>
                <SelectItem value="distance">Nearest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Consultant Cards */}
      <div className="grid gap-6">
        {sortedConsultants.map((consultant) => (
          <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={consultant.avatar} />
                  <AvatarFallback>
                    {consultant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{consultant.name}</h3>
                      <p className="text-muted-foreground">{consultant.company}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{consultant.rating}</span>
                          <span className="text-muted-foreground">({consultant.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{consultant.location}</span>
                          <span>({calculateDistance(consultant)}km away)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {consultant.feeStructure === 'percentage' 
                          ? `${consultant.typicalFeeRange.min}-${consultant.typicalFeeRange.max}%`
                          : formatCurrency(estimateFee(consultant))
                        }
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {consultant.feeStructure === 'percentage' ? 'of project value' : 'estimated fee'}
                      </p>
                      <Badge 
                        variant={consultant.availability === 'available' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {consultant.availability}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {consultant.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Experience:</span>
                      <p className="text-muted-foreground">{consultant.yearsExperience} years</p>
                    </div>
                    <div>
                      <span className="font-medium">Projects:</span>
                      <p className="text-muted-foreground">{consultant.projectsCompleted} completed</p>
                    </div>
                    <div>
                      <span className="font-medium">Licenses:</span>
                      <p className="text-muted-foreground">{consultant.licenses.length} active</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      {consultant.certifications.slice(0, 2).map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{consultant.name} - {disciplineInfo?.name}</DialogTitle>
                          </DialogHeader>
                          <ConsultantDetailView consultant={consultant} />
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedConsultant(consultant);
                          setShowProposalModal(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Request Proposal
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Proposal Request Modal */}
      {selectedConsultant && (
        <ConsultantProposalModal
          isOpen={showProposalModal}
          onClose={() => {
            setShowProposalModal(false);
            setSelectedConsultant(null);
          }}
          consultant={selectedConsultant}
          discipline={discipline}
          projectType={projectType}
          projectBudget={projectBudget}
          onProposalRequested={() => {
            setShowProposalModal(false);
            setSelectedConsultant(null);
          }}
        />
      )}
    </div>
  );
};

export default DisciplineMarketplace;