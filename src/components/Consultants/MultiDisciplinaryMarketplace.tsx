import React, { useState } from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import ProgressIndicator from '@/components/common/ProgressIndicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Award,
  MapPin,
  Star,
  Building,
  MessageSquare,
  Eye,
  Plus,
  Target,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { CONSULTANT_DISCIPLINES, getRequiredDisciplinesForProject } from '@/data/consultantDisciplines';
import { ConsultantDiscipline, ProjectType, AppointmentMatrix } from '@/types/consultant';
import DisciplineMarketplace from './DisciplineMarketplace';
import AppointmentMatrixView from './AppointmentMatrixView';
import ConsultantDirectory from './ConsultantDirectory';
import { formatCurrency } from '@/utils/formatters';

interface MultiDisciplinaryMarketplaceProps {
  projectId: string;
  projectType: ProjectType;
  projectLocation: string;
  projectBudget: number;
  onConsultantAppointed: (discipline: ConsultantDiscipline, consultantId: string) => void;
}

// Mock consultant data for marketplace
const mockConsultantProfiles = [
  {
    id: '1',
    name: 'Sarah Chen',
    company: 'Urban Design Studio',
    discipline: 'architect' as ConsultantDiscipline,
    email: 'sarah@urbandesign.com',
    phone: '+60123456789',
    location: 'Kuala Lumpur',
    coordinates: { lat: 3.1390, lng: 101.6869 },
    avatar: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 127,
    projectsCompleted: 45,
    yearsExperience: 8,
    licenses: ['LAM Registration', 'PAM Membership'],
    certifications: ['Green Building Professional', 'BIM Certified'],
    memberships: ['PAM', 'LAM'],
    portfolio: [],
    specializations: ['Residential Design', 'Sustainable Architecture', 'BIM Modeling'],
    availability: 'available' as const,
    preferredProjectTypes: ['residential', 'strata'] as ProjectType[],
    minProjectValue: 1000000,
    maxProjectValue: 50000000,
    feeStructure: 'percentage' as const,
    typicalFeeRange: { min: 3, max: 6 },
    sampleContracts: ['PAM Contract 2006']
  },
  {
    id: '2',
    name: 'Ahmad Rahman',
    company: 'Structural Engineering Plus',
    discipline: 'civil-structural' as ConsultantDiscipline,
    email: 'ahmad@structuralplus.com',
    phone: '+60123456790',
    location: 'Shah Alam',
    coordinates: { lat: 3.0738, lng: 101.5183 },
    rating: 4.8,
    reviewCount: 89,
    projectsCompleted: 62,
    yearsExperience: 12,
    licenses: ['BEM Registration', 'IEM Membership'],
    certifications: ['Professional Engineer', 'Seismic Design Specialist'],
    memberships: ['IEM', 'BEM'],
    portfolio: [],
    specializations: ['High-rise Structures', 'Foundation Engineering', 'Seismic Design'],
    availability: 'limited' as const,
    preferredProjectTypes: ['strata', 'commercial'] as ProjectType[],
    minProjectValue: 5000000,
    maxProjectValue: 200000000,
    feeStructure: 'lump-sum' as const,
    typicalFeeRange: { min: 2, max: 4 },
    sampleContracts: ['IEM Contract']
  }
];

const MultiDisciplinaryMarketplace: React.FC<MultiDisciplinaryMarketplaceProps> = ({
  projectId,
  projectType,
  projectLocation,
  projectBudget,
  onConsultantAppointed
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDiscipline, setSelectedDiscipline] = useState<ConsultantDiscipline | null>(null);

  // Get required disciplines for this project type
  const requiredDisciplines = getRequiredDisciplinesForProject(projectType);

  // Mock appointment matrix data
  const appointmentMatrix: AppointmentMatrix = {
    projectId,
    projectName: 'Tropicana Heights Development',
    requiredDisciplines: requiredDisciplines.map(d => d.id),
    appointments: {
      'architect': {
        consultant: mockConsultantProfiles[0],
        appointment: {
          id: 'app-1',
          projectId,
          consultantId: '1',
          discipline: 'architect',
          proposalId: 'prop-1',
          contractType: 'PAM Contract 2006',
          appointmentDate: new Date('2024-02-15'),
          contractValue: 150000,
          status: 'active',
          dashboardAccess: true,
          approvalAccess: ['development-order', 'building-plan'],
          deliverables: []
        },
        status: 'appointed'
      },
      'civil-structural': {
        consultant: mockConsultantProfiles[1],
        appointment: {
          id: 'app-2',
          projectId,
          consultantId: '2',
          discipline: 'civil-structural',
          proposalId: 'prop-2',
          contractType: 'IEM Contract',
          appointmentDate: new Date('2024-02-20'),
          contractValue: 120000,
          status: 'active',
          dashboardAccess: true,
          approvalAccess: ['building-plan', 'structural-approval'],
          deliverables: []
        },
        status: 'appointed'
      }
    },
    completionPercentage: Math.round((2 / requiredDisciplines.length) * 100),
    readyForApprovals: false
  };

  const getAppointmentStatus = (discipline: ConsultantDiscipline) => {
    const appointment = appointmentMatrix.appointments[discipline];
    if (!appointment) return 'required';
    return appointment.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'appointed':
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'required':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'appointed':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'required':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const totalContractValue = Object.values(appointmentMatrix.appointments)
    .reduce((sum, appointment) => sum + (appointment?.appointment.contractValue || 0), 0);

  const appointedCount = Object.values(appointmentMatrix.appointments).length;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header Section */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Consultant Appointment</h1>
              <p className="text-lg text-muted-foreground">
                Appoint qualified consultants for your {projectType} development project
              </p>
              <div className="flex items-center gap-4 mt-3">
                <EnhancedBadge variant="info" className="gap-2">
                  <MapPin className="h-3 w-3" />
                  {projectLocation}
                </EnhancedBadge>
                <EnhancedBadge variant="neutral" className="gap-2">
                  <Building className="h-3 w-3" />
                  {projectType.charAt(0).toUpperCase() + projectType.slice(1)}
                </EnhancedBadge>
                <EnhancedBadge variant="success" className="gap-2">
                  <DollarSign className="h-3 w-3" />
                  {formatCurrency(projectBudget)}
                </EnhancedBadge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{appointmentMatrix.completionPercentage}%</div>
              <p className="text-sm text-muted-foreground">Appointments Complete</p>
              <ProgressIndicator 
                value={appointmentMatrix.completionPercentage} 
                variant="default"
                size="sm"
                className="mt-2 w-32"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Overview */}
        <EnhancedCard variant="elevated" className="mb-8">
          <EnhancedCardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Appointment Progress</h2>
                <p className="text-muted-foreground">Track consultant appointments across all required disciplines</p>
              </div>
            </div>
          </EnhancedCardHeader>
          
          <EnhancedCardContent className="space-y-6">
            <ProgressIndicator 
              value={appointmentMatrix.completionPercentage} 
              variant="default"
              size="lg"
              showLabel={true}
              label="Overall Progress"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div className="text-2xl font-bold text-success">{appointedCount}</div>
                <div className="text-sm text-muted-foreground">Appointed</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-8 w-8 text-warning" />
                </div>
                <div className="text-2xl font-bold text-warning">
                  {requiredDisciplines.length - appointedCount}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-8 w-8 text-info" />
                </div>
                <div className="text-2xl font-bold text-info">{requiredDisciplines.length}</div>
                <div className="text-sm text-muted-foreground">Total Required</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(totalContractValue)}
                </div>
                <div className="text-sm text-muted-foreground">Contract Value</div>
              </div>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-border">
            <TabsTrigger value="overview" className="gap-2">
              <Target className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="disciplines" className="gap-2">
              <Users className="h-4 w-4" />
              By Discipline
            </TabsTrigger>
            <TabsTrigger value="matrix" className="gap-2">
              <FileText className="h-4 w-4" />
              Appointment Matrix
            </TabsTrigger>
            <TabsTrigger value="directory" className="gap-2">
              <Building className="h-4 w-4" />
              Team Directory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              {requiredDisciplines.map((discipline) => {
                const status = getAppointmentStatus(discipline.id);
                const appointment = appointmentMatrix.appointments[discipline.id];
                
                return (
                  <EnhancedCard key={discipline.id} variant="consultant" className="group">
                    <EnhancedCardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          {/* Discipline Icon */}
                          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-info/10 rounded-2xl flex items-center justify-center text-2xl border border-primary/20">
                            {discipline.icon}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {discipline.name}
                              </h3>
                              <EnhancedBadge variant={getStatusColor(status)} icon={getStatusIcon(status)}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </EnhancedBadge>
                            </div>
                            
                            <p className="text-muted-foreground mb-3 leading-relaxed">
                              {discipline.description}
                            </p>
                            
                            {appointment ? (
                              <div className="space-y-3">
                                {/* Appointed Consultant Info */}
                                <div className="flex items-center gap-4 p-4 bg-success/5 rounded-lg border border-success/20">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={appointment.consultant.avatar} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {appointment.consultant.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="font-semibold text-foreground">
                                      {appointment.consultant.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {appointment.consultant.company}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="font-medium">{appointment.consultant.rating}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatCurrency(appointment.appointment.contractValue)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                                <h4 className="font-semibold text-warning mb-2">Required Qualifications:</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {discipline.requiredQualifications.slice(0, 3).map((qual, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-warning rounded-full" />
                                      {qual}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          {status === 'required' ? (
                            <EnhancedButton 
                              variant="gradient"
                              onClick={() => {
                                setSelectedDiscipline(discipline.id);
                                setActiveTab('disciplines');
                              }}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Find {discipline.name}
                            </EnhancedButton>
                          ) : (
                            <>
                              <EnhancedButton variant="outline" size="sm" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Message
                              </EnhancedButton>
                              <EnhancedButton variant="outline" size="sm" className="gap-2">
                                <FileText className="h-4 w-4" />
                                Contract
                              </EnhancedButton>
                              <EnhancedButton variant="outline" size="sm" className="gap-2">
                                <Eye className="h-4 w-4" />
                                Profile
                              </EnhancedButton>
                            </>
                          )}
                        </div>
                      </div>
                    </EnhancedCardContent>
                  </EnhancedCard>
                );
              })}
            </div>

            {/* Readiness Check */}
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-success to-info rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Approval Readiness Check</h3>
                    <p className="text-muted-foreground">Verify all requirements before proceeding</p>
                  </div>
                </div>
              </EnhancedCardHeader>
              
              <EnhancedCardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 ${appointmentMatrix.completionPercentage === 100 ? 'text-success' : 'text-muted-foreground'}`} />
                      <span className="font-medium">All required consultants appointed</span>
                    </div>
                    <EnhancedBadge variant={appointmentMatrix.completionPercentage === 100 ? 'success' : 'warning'}>
                      {appointedCount}/{requiredDisciplines.length}
                    </EnhancedBadge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-warning" />
                      <span className="font-medium">Consultant contracts executed</span>
                    </div>
                    <EnhancedBadge variant="warning">In Progress</EnhancedBadge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="font-medium">Project brief distributed to team</span>
                    </div>
                    <EnhancedBadge variant="success">Complete</EnhancedBadge>
                  </div>
                </div>
                
                {appointmentMatrix.readyForApprovals ? (
                  <div className="p-6 bg-gradient-to-r from-success/10 to-info/10 rounded-xl border border-success/20">
                    <div className="flex items-center gap-3 text-success mb-2">
                      <CheckCircle className="h-6 w-6" />
                      <span className="text-lg font-bold">Ready to Proceed</span>
                    </div>
                    <p className="text-success/80 mb-4">
                      All consultants are appointed and ready to begin the design and approval process.
                    </p>
                    <EnhancedButton variant="success" className="gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Start Design Phase
                    </EnhancedButton>
                  </div>
                ) : (
                  <div className="p-6 bg-gradient-to-r from-warning/10 to-orange/10 rounded-xl border border-warning/20">
                    <div className="flex items-center gap-3 text-warning mb-2">
                      <Clock className="h-6 w-6" />
                      <span className="text-lg font-bold">Appointments Pending</span>
                    </div>
                    <p className="text-warning/80 mb-4">
                      Complete all consultant appointments before proceeding to design and approvals.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      {requiredDisciplines.length - appointedCount} more consultant(s) needed
                    </div>
                  </div>
                )}
              </EnhancedCardContent>
            </EnhancedCard>
          </TabsContent>

          <TabsContent value="disciplines">
            <div className="space-y-6">
              {/* Discipline Selection */}
              <EnhancedCard>
                <EnhancedCardHeader>
                  <h2 className="text-xl font-bold text-foreground">Select Consultant Discipline</h2>
                  <p className="text-muted-foreground">Choose a discipline to browse available consultants</p>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {requiredDisciplines.map((discipline) => {
                      const status = getAppointmentStatus(discipline.id);
                      const isSelected = selectedDiscipline === discipline.id;
                      
                      return (
                        <EnhancedButton
                          key={discipline.id}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`h-auto p-4 flex-col gap-2 ${status === 'appointed' ? 'border-success' : ''}`}
                          onClick={() => setSelectedDiscipline(discipline.id)}
                        >
                          <div className="text-2xl">{discipline.icon}</div>
                          <div className="text-sm font-medium text-center">{discipline.name}</div>
                          {status === 'appointed' && (
                            <EnhancedBadge variant="success" size="sm">
                              <CheckCircle className="h-3 w-3" />
                            </EnhancedBadge>
                          )}
                        </EnhancedButton>
                      );
                    })}
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>

              {selectedDiscipline && (
                <DisciplineMarketplace
                  discipline={selectedDiscipline}
                  projectType={projectType}
                  projectLocation={projectLocation}
                  projectBudget={projectBudget}
                  onConsultantAppointed={(consultantId) => 
                    onConsultantAppointed(selectedDiscipline, consultantId)
                  }
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="matrix">
            <AppointmentMatrixView 
              appointmentMatrix={appointmentMatrix}
              onEditAppointment={(discipline) => {
                setSelectedDiscipline(discipline);
                setActiveTab('disciplines');
              }}
            />
          </TabsContent>

          <TabsContent value="directory">
            <ConsultantDirectory 
              appointments={appointmentMatrix.appointments}
              onMessageConsultant={(consultantId) => {
                console.log('Message consultant:', consultantId);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MultiDisciplinaryMarketplace;