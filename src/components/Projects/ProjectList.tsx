import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { migrateToProjectSchema } from '@/utils/projectMigration';
import { formatCurrency } from '@/utils/formatters';
import { PROJECT_STAGES } from '@/utils/constants';
import EmptyState from '@/components/common/EmptyState';
import StatusBadge from '@/components/common/StatusBadge';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import ProgressIndicator from '@/components/common/ProgressIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Clock,
  Building,
  TrendingUp,
  Eye,
  Settings,
  MoreHorizontal,
  Star
} from 'lucide-react';
import { Project } from '@/types';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { projects, addProject } = useProject();
  
  // Use projects from context, or create mock data if empty
  const projectsToShow = projects.length > 0 ? projects : (() => {
    const mockProjects = [
    {
      id: '1',
      name: 'Sunshine Residences',
      stage: 'design-approval',
      status: 'active',
      landListing: {
        id: '1',
        title: 'Residential Land - Shah Alam',
        location: 'Shah Alam, Selangor',
        coordinates: { lat: 3.0738, lng: 101.5183 },
        price: 8500000,
        size: 5.2,
        zoning: 'Residential',
        description: '',
        images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
        documents: [],
        ownerId: '',
        features: [],
        isActive: true
      },
      brief: {
        id: '1',
        landId: '1',
        developerId: '1',
        projectName: 'Sunshine Residences',
        projectType: 'residential',
        userType: 'developer',
        projectDescription: 'Medium-density residential development with modern amenities',
        estimatedBudget: '15000000',
        timelineStart: new Date('2024-01-15'),
        timelineCompletion: new Date('2025-06-30'),
        units: 120,
        features: ['Swimming Pool', 'Gymnasium', 'Security System', 'Landscaped Gardens'],
        createdAt: new Date().toISOString(),
        status: 'submitted'
      },
      participants: {
        developer: {
          id: '1',
          name: 'John Developer',
          email: 'john@example.com',
          role: 'developer'
        },
        consultant: {
          id: '2',
          name: 'Sarah Architect',
          email: 'sarah@architecture.com',
          role: 'consultant'
        }
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Metro Commercial Plaza',
      stage: 'construction',
      status: 'active',
      landListing: {
        id: '2',
        title: 'Commercial Land - KLCC',
        location: 'Kuala Lumpur',
        coordinates: { lat: 3.1478, lng: 101.6953 },
        price: 15000000,
        size: 2.5,
        zoning: 'Commercial',
        description: '',
        images: ['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'],
        documents: [],
        ownerId: '',
        features: [],
        isActive: true
      },
      brief: {
        id: '2',
        landId: '2',
        developerId: '1',
        projectName: 'Metro Commercial Plaza',
        projectType: 'commercial',
        userType: 'developer',
        projectDescription: 'Mixed-use commercial development with retail and office space',
        estimatedBudget: '25000000',
        timelineStart: new Date('2023-08-20'),
        timelineCompletion: new Date('2025-02-28'),
        units: 1,
        features: ['Retail Space', 'Office Space', 'Parking', 'Food Court'],
        createdAt: new Date().toISOString(),
        status: 'submitted'
      },
      participants: {
        developer: {
          id: '1',
          name: 'John Developer',
          email: 'john@example.com',
          role: 'developer'
        },
        consultant: {
          id: '3',
          name: 'Mike Engineer',
          email: 'mike@engineering.com',
          role: 'consultant'
        },
        contractor: {
          id: '4',
          name: 'BuildCorp Ltd',
          email: 'contact@buildcorp.com',
          role: 'contractor'
        }
      },
      createdAt: new Date('2023-08-20'),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Eco Gardens Strata',
      stage: 'consultant-selection',
      status: 'active',
      landListing: {
        id: '3',
        title: 'Strata Development Land - Penang',
        location: 'George Town, Penang',
        coordinates: { lat: 5.4164, lng: 100.3327 },
        price: 18000000,
        size: 4.2,
        zoning: 'Strata',
        description: '',
        images: ['https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg'],
        documents: [],
        ownerId: '',
        features: [],
        isActive: true
      },
      brief: {
        id: '3',
        landId: '3',
        developerId: '1',
        projectName: 'Eco Gardens Strata',
        projectType: 'strata',
        userType: 'developer',
        projectDescription: 'Sustainable high-rise residential development',
        estimatedBudget: '35000000',
        timelineStart: new Date('2024-04-01'),
        timelineCompletion: new Date('2026-12-31'),
        units: 280,
        features: ['Green Building', 'Sky Garden', 'Smart Home', 'EV Charging'],
        createdAt: new Date().toISOString(),
        status: 'submitted'
      },
      participants: {
        developer: {
          id: '1',
          name: 'John Developer',
          email: 'john@example.com',
          role: 'developer'
        }
      },
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date()
    }
  ];
    
    // Migrate mock projects to new schema
    return mockProjects.map(p => migrateToProjectSchema(p));
  })();
  
  const mockProjects = projectsToShow;

  const getStageLabel = (stage: string) => {
    const stageLabels = {
      [PROJECT_STAGES.LAND_SELECTION]: 'Land Selection',
      [PROJECT_STAGES.PROJECT_BRIEF]: 'Project Brief',
      [PROJECT_STAGES.CONSULTANT_SELECTION]: 'Consultant Selection',
      [PROJECT_STAGES.DESIGN_APPROVAL]: 'Design & Approval',
      [PROJECT_STAGES.CONTRACTOR_SELECTION]: 'Contractor Selection',
      [PROJECT_STAGES.CONSTRUCTION]: 'Construction',
      [PROJECT_STAGES.COMPLIANCE]: 'Compliance',
      [PROJECT_STAGES.HANDOVER]: 'Handover'
    };
    return stageLabels[stage as keyof typeof stageLabels] || stage;
  };

  const getStageProgress = (stage: string) => {
    const stageProgress = {
      [PROJECT_STAGES.LAND_SELECTION]: 10,
      [PROJECT_STAGES.PROJECT_BRIEF]: 20,
      [PROJECT_STAGES.CONSULTANT_SELECTION]: 30,
      [PROJECT_STAGES.DESIGN_APPROVAL]: 50,
      [PROJECT_STAGES.CONTRACTOR_SELECTION]: 60,
      [PROJECT_STAGES.CONSTRUCTION]: 80,
      [PROJECT_STAGES.COMPLIANCE]: 90,
      [PROJECT_STAGES.HANDOVER]: 100
    };
    return stageProgress[stage as keyof typeof stageProgress] || 0;
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'residential': return '🏠';
      case 'commercial': return '🏢';
      case 'strata': return '🏗️';
      case 'mixed': 
      case 'development': return '🏙️';
      default: return '🏗️';
    }
  };

  const calculateDaysRemaining = (completionDate: string) => {
    const today = new Date();
    const diffTime = new Date(completionDate).getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header Section */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Projects</h1>
              <p className="text-lg text-muted-foreground">
                Manage your development projects from start to finish
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <EnhancedButton variant="outline" className="gap-2">
                <Building className="h-4 w-4" />
                Browse Land
              </EnhancedButton>
              <EnhancedButton 
                variant="gradient" 
                className="gap-2"
                onClick={() => navigate('/?view=land-marketplace')}
              >
                <Plus className="h-4 w-4" />
                New Project
              </EnhancedButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {mockProjects.length > 0 ? (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <EnhancedCard variant="metric">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{mockProjects.length}</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
              </EnhancedCard>
              <EnhancedCard variant="metric">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    RM {(mockProjects.reduce((sum, p) => sum + (p.budget || 0), 0) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">Total Investment</div>
                </div>
              </EnhancedCard>
              <EnhancedCard variant="metric">
                <div className="text-center">
                  <div className="text-2xl font-bold text-info">
                    {mockProjects.length * 50} {/* Mock units calculation */}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Units</div>
                </div>
              </EnhancedCard>
              <EnhancedCard variant="metric">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">
                    {Math.round(mockProjects.reduce((sum, p) => {
                      const completed = p.milestones.filter(m => m.status === 'completed').length;
                      return sum + (p.milestones.length > 0 ? (completed / p.milestones.length) * 100 : 0);
                    }, 0) / mockProjects.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Progress</div>
                </div>
              </EnhancedCard>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {mockProjects.map((project) => {
                const progress = project.milestones.length > 0 
                  ? Math.round((project.milestones.filter(m => m.status === 'completed').length / project.milestones.length) * 100)
                  : 0;
                const daysRemaining = project.endDate 
                  ? calculateDaysRemaining(project.endDate)
                  : 0;
                
                return (
                  <EnhancedCard key={project.id} variant="project" className="group">
                    {/* Project Header */}
                    <EnhancedCardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center text-white text-xl">
                            {getProjectTypeIcon(project.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <div className="flex items-center text-muted-foreground mt-1">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span className="text-sm">{project.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <StatusBadge status={project.status} size="sm" />
                          <EnhancedButton variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </EnhancedButton>
                        </div>
                      </div>
                    </EnhancedCardHeader>

                    <EnhancedCardContent className="space-y-6">
                      {/* Progress Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </h4>
                            <p className="text-sm text-muted-foreground">Current Phase</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{progress}%</div>
                            <p className="text-xs text-muted-foreground">Complete</p>
                          </div>
                        </div>
                        <ProgressIndicator 
                          value={progress} 
                          variant="default"
                          size="md"
                        />
                      </div>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium text-muted-foreground">Budget</span>
                          </div>
                          <div className="font-bold text-foreground">
                            {project.budget ? 
                              `RM ${(project.budget / 1000000).toFixed(1)}M` : 
                              'N/A'
                            }
                          </div>
                        </div>

                        <div className="bg-surface-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="h-4 w-4 text-info" />
                            <span className="text-sm font-medium text-muted-foreground">Units</span>
                          </div>
                          <div className="font-bold text-foreground">
                            50 {/* Mock units */}
                          </div>
                        </div>

                        <div className="bg-surface-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-warning" />
                            <span className="text-sm font-medium text-muted-foreground">Timeline</span>
                          </div>
                          <div className="font-bold text-foreground">
                            {project.startDate && project.endDate ? 
                              Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)) + ' months'
                              : 'N/A'
                            }
                          </div>
                        </div>

                        <div className="bg-surface-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">Remaining</span>
                          </div>
                          <div className="font-bold text-foreground">
                            {daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue'}
                          </div>
                        </div>
                      </div>

                      {/* Team Members */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Project Team
                        </h4>
                        <div className="flex items-center gap-3">
                          {project.participants.slice(0, 3).map((member) => (
                            <div key={member.id} className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{member.name}</div>
                                  <div className="text-xs text-muted-foreground capitalize">{member.role}</div>
                                </div>
                              </div>
                          ))}
                          
                          {project.participants.length < 4 && (
                            <EnhancedButton variant="outline" size="sm" className="gap-2">
                              <Plus className="h-3 w-3" />
                              Add Team Member
                            </EnhancedButton>
                          )}
                        </div>
                      </div>

                      {/* Project Features */}
                      {project.milestones.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Milestones</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.milestones.slice(0, 3).map((milestone) => (
                              <EnhancedBadge key={milestone.id} variant="neutral" size="sm">
                                {milestone.title}
                              </EnhancedBadge>
                            ))}
                            {project.milestones.length > 3 && (
                              <EnhancedBadge variant="neutral" size="sm">
                                +{project.milestones.length - 3} more
                              </EnhancedBadge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-border">
                        <EnhancedButton 
                          variant="outline" 
                          className="flex-1 group/btn"
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </EnhancedButton>
                        <EnhancedButton 
                          variant="default" 
                          className="flex-1"
                          onClick={() => navigate(`/project/${project.id}/manage`)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </EnhancedButton>
                      </div>
                    </EnhancedCardContent>
                  </EnhancedCard>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <EmptyState
              icon={Plus}
              title="No projects yet"
              description="Start your first development project by browsing available land opportunities"
              actionLabel="Browse Land Marketplace"
              onAction={() => navigate('/?view=land-marketplace')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;