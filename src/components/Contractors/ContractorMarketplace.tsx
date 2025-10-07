import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Users, Calendar, Filter, Search, Hammer, Building, Home } from 'lucide-react';
import ContractorBidModal from './ContractorBidModal';

interface Contractor {
  id: string;
  name: string;
  company: string;
  rating: number;
  reviews: number;
  specialties: string[];
  location: string;
  experience: number;
  teamSize: number;
  hourlyRate: number;
  avatar: string;
  projects: number;
  description: string;
  certifications: string[];
  availability: 'Available' | 'Busy' | 'Booked';
}

interface ContractorMarketplaceProps {
  userRole: 'developer' | 'consultant' | 'contractor' | 'cpm';
  onBidSubmitted?: () => void;
}

const ContractorMarketplace: React.FC<ContractorMarketplaceProps> = ({ 
  userRole, 
  onBidSubmitted 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);

  const contractors: Contractor[] = [
    {
      id: '1',
      name: 'Michael Chen',
      company: 'Chen Construction Ltd',
      rating: 4.9,
      reviews: 127,
      specialties: ['Residential', 'Commercial', 'Renovation'],
      location: 'Lagos, Nigeria',
      experience: 15,
      teamSize: 25,
      hourlyRate: 50,
      avatar: '/placeholder.svg',
      projects: 89,
      description: 'Experienced contractor specializing in modern residential and commercial construction with a focus on sustainable building practices.',
      certifications: ['COREN', 'Green Building Council', 'Safety Certified'],
      availability: 'Available'
    },
    {
      id: '2',
      name: 'Sarah Okafor',
      company: 'Elite Builders',
      rating: 4.8,
      reviews: 93,
      specialties: ['Luxury Residential', 'Interior Finishing'],
      location: 'Abuja, Nigeria',
      experience: 12,
      teamSize: 18,
      hourlyRate: 65,
      avatar: '/placeholder.svg',
      projects: 67,
      description: 'High-end residential contractor known for exceptional craftsmanship and attention to detail in luxury home construction.',
      certifications: ['COREN', 'Interior Design Certified'],
      availability: 'Busy'
    },
    {
      id: '3',
      name: 'David Adebayo',
      company: 'Infrastructure Pro',
      rating: 4.7,
      reviews: 156,
      specialties: ['Infrastructure', 'Commercial', 'Industrial'],
      location: 'Port Harcourt, Nigeria',
      experience: 20,
      teamSize: 45,
      hourlyRate: 45,
      avatar: '/placeholder.svg',
      projects: 134,
      description: 'Large-scale infrastructure and commercial construction specialist with extensive experience in complex projects.',
      certifications: ['COREN', 'Project Management Professional', 'Safety Excellence'],
      availability: 'Available'
    }
  ];

  const projectListings = [
    {
      id: '1',
      title: '4-Bedroom Duplex Construction',
      location: 'Lekki, Lagos',
      budget: '₦25,000,000 - ₦30,000,000',
      timeline: '8 months',
      description: 'Modern 4-bedroom duplex with contemporary design and premium finishes.',
      requirements: ['Residential Experience', 'COREN Certification', 'Minimum 10 projects'],
      postedDate: '2 days ago',
      bids: 12
    },
    {
      id: '2',
      title: 'Commercial Office Complex',
      location: 'Victoria Island, Lagos',
      budget: '₦150,000,000 - ₦200,000,000',
      timeline: '18 months',
      description: '15-story commercial office building with modern amenities and smart building features.',
      requirements: ['Commercial Experience', 'Minimum 50 team members', 'Project Management Certification'],
      postedDate: '1 week ago',
      bids: 8
    }
  ];

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contractor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contractor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'all' || contractor.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleHireContractor = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setShowBidModal(true);
  };

  const handleBidSubmit = () => {
    setShowBidModal(false);
    setSelectedContractor(null);
    onBidSubmitted?.();
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Busy': return 'bg-yellow-100 text-yellow-800';
      case 'Booked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (userRole === 'contractor') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Available Projects</h1>
            <p className="text-muted-foreground">Find construction projects to bid on</p>
          </div>
          <Button className="flex items-center gap-2">
            <Hammer className="h-4 w-4" />
            My Active Bids
          </Button>
        </div>

        <div className="grid gap-6">
          {projectListings.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{project.bids} bids</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{project.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Budget:</span>
                    <p className="text-muted-foreground">{project.budget}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Timeline:</span>
                    <p className="text-muted-foreground">{project.timeline}</p>
                  </div>
                </div>

                <div>
                  <span className="font-semibold">Requirements:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.requirements.map((req, index) => (
                      <Badge key={index} variant="outline">{req}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-muted-foreground">Posted {project.postedDate}</span>
                  <Button onClick={() => handleHireContractor(contractors[0])}>
                    Submit Bid
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showBidModal && selectedContractor && (
          <ContractorBidModal
            isOpen={showBidModal}
            onClose={() => setShowBidModal(false)}
            contractor={selectedContractor}
            onSubmit={handleBidSubmit}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contractor Marketplace</h1>
          <p className="text-muted-foreground">Find and hire qualified contractors for your project</p>
        </div>
        <Button className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          Post Project
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search contractors by name, company, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Industrial">Industrial</SelectItem>
            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            <SelectItem value="Renovation">Renovation</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6">
        {filteredContractors.map((contractor) => (
          <Card key={contractor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={contractor.avatar} alt={contractor.name} />
                  <AvatarFallback>{contractor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{contractor.name}</h3>
                      <p className="text-muted-foreground">{contractor.company}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{contractor.rating}</span>
                          <span className="text-muted-foreground">({contractor.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {contractor.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₦{contractor.hourlyRate}/hr</div>
                      <Badge className={getAvailabilityColor(contractor.availability)}>
                        {contractor.availability}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{contractor.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {contractor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Experience:</span>
                      <p className="text-muted-foreground">{contractor.experience} years</p>
                    </div>
                    <div>
                      <span className="font-semibold">Team Size:</span>
                      <p className="text-muted-foreground">{contractor.teamSize} members</p>
                    </div>
                    <div>
                      <span className="font-semibold">Projects:</span>
                      <p className="text-muted-foreground">{contractor.projects} completed</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      {contractor.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{cert}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">View Profile</Button>
                      <Button onClick={() => handleHireContractor(contractor)}>
                        Request Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showBidModal && selectedContractor && (
        <ContractorBidModal
          isOpen={showBidModal}
          onClose={() => setShowBidModal(false)}
          contractor={selectedContractor}
          onSubmit={handleBidSubmit}
        />
      )}
    </div>
  );
};

export default ContractorMarketplace;