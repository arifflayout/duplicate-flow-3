import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Users, Calendar, Filter, Search, Construction, Building, CheckCircle, Clock, Award } from 'lucide-react';
import ProjectManagerModal from './ProjectManagerModal';

interface ProjectManager {
  id: string;
  name: string;
  company: string;
  rating: number;
  reviews: number;
  specialties: string[];
  location: string;
  experience: number;
  teamSize: number;
  dailyRate: number;
  avatar: string;
  projectsManaged: number;
  description: string;
  certifications: string[];
  availability: 'Available' | 'Limited' | 'Booked';
  successRate: number;
  avgProjectValue: number;
}

interface ProjectManagerMarketplaceProps {
  userRole: 'developer' | 'consultant' | 'contractor' | 'cpm';
  onEngagementSubmitted?: () => void;
}

const ProjectManagerMarketplace: React.FC<ProjectManagerMarketplaceProps> = ({ 
  userRole, 
  onEngagementSubmitted 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedManager, setSelectedManager] = useState<ProjectManager | null>(null);
  const [showEngagementModal, setShowEngagementModal] = useState(false);

  const projectManagers: ProjectManager[] = [
    {
      id: '1',
      name: 'Adebayo Ogundimu',
      company: 'Prime Project Solutions',
      rating: 4.9,
      reviews: 89,
      specialties: ['Residential', 'Commercial', 'Mixed-Use'],
      location: 'Lagos, Nigeria',
      experience: 18,
      teamSize: 12,
      dailyRate: 75000,
      avatar: '/placeholder.svg',
      projectsManaged: 67,
      description: 'Senior project manager with extensive experience in large-scale residential and commercial developments. Expert in stakeholder coordination and regulatory compliance.',
      certifications: ['PMP', 'PRINCE2', 'Construction Management', 'COREN'],
      availability: 'Available',
      successRate: 96,
      avgProjectValue: 85000000
    },
    {
      id: '2',
      name: 'Fatima Al-Hassan',
      company: 'Excellence PM Consultancy',
      rating: 4.8,
      reviews: 124,
      specialties: ['Infrastructure', 'Industrial', 'Public Works'],
      location: 'Abuja, Nigeria',
      experience: 15,
      teamSize: 8,
      dailyRate: 85000,
      avatar: '/placeholder.svg',
      projectsManaged: 43,
      description: 'Infrastructure project management specialist with proven track record in government and private sector projects. Expert in risk management and quality assurance.',
      certifications: ['PMP', 'Infrastructure Management', 'Risk Management Professional'],
      availability: 'Limited',
      successRate: 98,
      avgProjectValue: 150000000
    },
    {
      id: '3',
      name: 'Chukwudi Okwu',
      company: 'Pinnacle Construction Management',
      rating: 4.7,
      reviews: 156,
      specialties: ['Luxury Residential', 'Hospitality', 'Retail'],
      location: 'Port Harcourt, Nigeria',
      experience: 12,
      teamSize: 15,
      dailyRate: 65000,
      avatar: '/placeholder.svg',
      projectsManaged: 89,
      description: 'Specialized in high-end residential and hospitality projects. Known for delivering premium quality on time and within budget through innovative project management techniques.',
      certifications: ['PMP', 'Agile Project Management', 'Quality Management'],
      availability: 'Available',
      successRate: 94,
      avgProjectValue: 120000000
    }
  ];

  const projectOpportunities = [
    {
      id: '1',
      title: '25-Unit Residential Complex',
      location: 'Ikoyi, Lagos',
      budget: '₦180,000,000',
      timeline: '14 months',
      description: 'Luxury residential complex with modern amenities requiring experienced project management.',
      requirements: ['PMP Certification', 'Residential Experience', 'Minimum 50 projects'],
      complexity: 'High',
      startDate: 'March 2024',
      applications: 8
    },
    {
      id: '2',
      title: 'Shopping Mall Development',
      location: 'Wuse II, Abuja',
      budget: '₦350,000,000',
      timeline: '24 months',
      description: 'Large-scale commercial shopping mall with entertainment complex.',
      requirements: ['Commercial Experience', 'Team Leadership', 'Risk Management Certification'],
      complexity: 'Very High',
      startDate: 'April 2024',
      applications: 5
    }
  ];

  const filteredManagers = projectManagers.filter(manager => {
    const matchesSearch = manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manager.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manager.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'all' || manager.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleEngageManager = (manager: ProjectManager) => {
    setSelectedManager(manager);
    setShowEngagementModal(true);
  };

  const handleEngagementSubmit = () => {
    setShowEngagementModal(false);
    setSelectedManager(null);
    onEngagementSubmitted?.();
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Limited': return 'bg-yellow-100 text-yellow-800';
      case 'Booked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (userRole === 'cpm') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Opportunities</h1>
            <p className="text-muted-foreground">Find construction projects to manage</p>
          </div>
          <Button className="flex items-center gap-2">
            <Construction className="h-4 w-4" />
            My Active Projects
          </Button>
        </div>

        <div className="grid gap-6">
          {projectOpportunities.map((project) => (
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
                  <div className="text-right space-y-2">
                    <Badge variant="secondary">{project.applications} applications</Badge>
                    <Badge className={getComplexityColor(project.complexity)}>
                      {project.complexity} Complexity
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{project.description}</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="font-semibold">Budget:</span>
                    <p className="text-muted-foreground">{project.budget}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Timeline:</span>
                    <p className="text-muted-foreground">{project.timeline}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Start Date:</span>
                    <p className="text-muted-foreground">{project.startDate}</p>
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Applications close in 5 days
                    </span>
                  </div>
                  <Button onClick={() => handleEngageManager(projectManagers[0])}>
                    Apply for Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showEngagementModal && selectedManager && (
          <ProjectManagerModal
            isOpen={showEngagementModal}
            onClose={() => setShowEngagementModal(false)}
            manager={selectedManager}
            onSubmit={handleEngagementSubmit}
            mode="application"
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Manager Marketplace</h1>
          <p className="text-muted-foreground">Find and hire certified project managers for your development</p>
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
            placeholder="Search project managers by name, company, or specialty..."
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
            <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6">
        {filteredManagers.map((manager) => (
          <Card key={manager.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={manager.avatar} alt={manager.name} />
                  <AvatarFallback>{manager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{manager.name}</h3>
                      <p className="text-muted-foreground">{manager.company}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{manager.rating}</span>
                          <span className="text-muted-foreground">({manager.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {manager.location}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CheckCircle className="h-4 w-4" />
                          {manager.successRate}% success rate
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₦{manager.dailyRate.toLocaleString()}/day</div>
                      <Badge className={getAvailabilityColor(manager.availability)}>
                        {manager.availability}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{manager.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {manager.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Experience:</span>
                      <p className="text-muted-foreground">{manager.experience} years</p>
                    </div>
                    <div>
                      <span className="font-semibold">Team Size:</span>
                      <p className="text-muted-foreground">{manager.teamSize} members</p>
                    </div>
                    <div>
                      <span className="font-semibold">Projects:</span>
                      <p className="text-muted-foreground">{manager.projectsManaged} managed</p>
                    </div>
                    <div>
                      <span className="font-semibold">Avg. Project Value:</span>
                      <p className="text-muted-foreground">₦{(manager.avgProjectValue / 1000000).toFixed(0)}M</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      {manager.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">View Portfolio</Button>
                      <Button onClick={() => handleEngageManager(manager)}>
                        Engage Manager
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showEngagementModal && selectedManager && (
        <ProjectManagerModal
          isOpen={showEngagementModal}
          onClose={() => setShowEngagementModal(false)}
          manager={selectedManager}
          onSubmit={handleEngagementSubmit}
          mode="engagement"
        />
      )}
    </div>
  );
};

export default ProjectManagerMarketplace;