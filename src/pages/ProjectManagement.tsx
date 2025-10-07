import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import AppLayout from '@/components/Layout/AppLayout';
import PageLayout from '@/components/Layout/PageLayout';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard,
  Calendar,
  CheckSquare,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  AlertTriangle,
  Plus,
  Settings,
  Eye,
  Edit,
  Clock,
  Target,
  Building
} from 'lucide-react';
import ProjectTaskBoard from '@/components/ProjectManagement/ProjectTaskBoard';
import ProjectGanttChart from '@/components/ProjectManagement/ProjectGanttChart';
import ProjectMilestones from '@/components/ProjectManagement/ProjectMilestones';
import ProjectTeam from '@/components/ProjectManagement/ProjectTeam';
import ProjectFinancing from '@/components/ProjectManagement/ProjectFinancing';
import ProjectMonitoring from '@/components/ProjectManagement/ProjectMonitoring';
import ProjectCompliance from '@/components/ProjectManagement/ProjectCompliance';

const ProjectManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById, updateProject } = useProject();
  const [activeTab, setActiveTab] = useState('overview');
  
  const project = id ? getProjectById(id) : null;

  useEffect(() => {
    if (!project) {
      navigate('/');
    }
  }, [project, navigate]);

  if (!project) {
    return (
      <AppLayout currentView="projects" onViewChange={() => {}}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
            <EnhancedButton onClick={() => navigate('/')}>
              Back to Dashboard
            </EnhancedButton>
          </div>
        </div>
      </AppLayout>
    );
  }

  const calculateProgress = () => {
    if (!project.milestones.length) return 0;
    const completed = project.milestones.filter(m => m.status === 'completed').length;
    return Math.round((completed / project.milestones.length) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'neutral';
    }
  };

  const progress = calculateProgress();

  return (
    <AppLayout currentView="projects" onViewChange={() => {}}>
      <PageLayout
        title={project.title}
        description={`${project.type.charAt(0).toUpperCase() + project.type.slice(1)} Development • ${project.location}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/', icon: LayoutDashboard },
          { label: 'Projects', href: '/?view=projects' },
          { label: project.title, current: true }
        ]}
        backButton={{
          label: 'Back to Project Details',
          onClick: () => navigate(`/project/${id}`)
        }}
        headerContent={
          <div className="flex items-center gap-4">
            <EnhancedBadge variant={getStatusColor(project.status)}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </EnhancedBadge>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Progress:</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="w-32" />
          </div>
        }
        actions={[
          {
            label: 'Project Settings',
            onClick: () => {},
            variant: 'outline',
            icon: Settings
          },
          {
            label: 'View Details',
            onClick: () => navigate(`/project/${id}`),
            variant: 'outline',
            icon: Eye
          }
        ]}
      >
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <EnhancedCard variant="metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{progress}%</div>
            <div className="text-sm text-muted-foreground">Overall completion</div>
          </EnhancedCard>

          <EnhancedCard variant="metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {project.budget ? `RM ${(project.budget / 1000000).toFixed(1)}M` : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Total budget</div>
          </EnhancedCard>

          <EnhancedCard variant="metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Team</h3>
              <Users className="h-5 w-5 text-info" />
            </div>
            <div className="text-3xl font-bold text-foreground">{project.participants.length}</div>
            <div className="text-sm text-muted-foreground">Active members</div>
          </EnhancedCard>

          <EnhancedCard variant="metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Milestones</h3>
              <Target className="h-5 w-5 text-warning" />
            </div>
            <div className="text-3xl font-bold text-foreground">{project.milestones.length}</div>
            <div className="text-sm text-muted-foreground">Total milestones</div>
          </EnhancedCard>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white border border-border">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="milestones" className="gap-2">
              <Target className="h-4 w-4" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="financing" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Financing
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="gap-2">
              <Building className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Summary */}
              <EnhancedCard variant="elevated">
                <EnhancedCardHeader>
                  <h3 className="text-lg font-bold text-foreground">Project Summary</h3>
                </EnhancedCardHeader>
                <EnhancedCardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{project.description || 'No description available'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm">Type</h4>
                      <p className="text-sm text-muted-foreground capitalize">{project.type}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Location</h4>
                      <p className="text-sm text-muted-foreground">{project.location}</p>
                    </div>
                    {project.startDate && (
                      <div>
                        <h4 className="font-medium text-sm">Start Date</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(project.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {project.endDate && (
                      <div>
                        <h4 className="font-medium text-sm">Target Completion</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(project.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>

              {/* Recent Activity */}
              <EnhancedCard variant="elevated">
                <EnhancedCardHeader>
                  <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="space-y-3">
                    {project.monitoring.slice(0, 5).map((report) => (
                      <div key={report.id} className="flex gap-3 p-3 rounded-lg hover:bg-surface-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{report.summary}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(report.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {project.monitoring.length === 0 && (
                      <div className="text-center py-6">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </div>

            {/* Team Overview */}
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">Project Team</h3>
                  <EnhancedButton variant="outline" size="sm" onClick={() => setActiveTab('team')}>
                    Manage Team
                  </EnhancedButton>
                </div>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {project.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{participant.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{participant.role}</p>
                        {participant.company && (
                          <p className="text-xs text-muted-foreground truncate">{participant.company}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {project.participants.length === 0 && (
                    <div className="col-span-full text-center py-6">
                      <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No team members assigned</p>
                      <EnhancedButton variant="outline" size="sm" className="mt-2" onClick={() => setActiveTab('team')}>
                        Add Team Members
                      </EnhancedButton>
                    </div>
                  )}
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </TabsContent>

          <TabsContent value="tasks">
            <ProjectTaskBoard project={project} onUpdate={(updates) => updateProject(project.id, updates)} />
          </TabsContent>

          <TabsContent value="timeline">
            <ProjectGanttChart project={project} onUpdate={(updates) => updateProject(project.id, updates)} />
          </TabsContent>

          <TabsContent value="milestones">
            <ProjectMilestones project={project} onUpdate={(updates) => updateProject(project.id, updates)} />
          </TabsContent>

          <TabsContent value="team">
            <ProjectTeam project={project} onUpdate={(updates) => updateProject(project.id, updates)} />
          </TabsContent>

          <TabsContent value="financing">
            <ProjectFinancing project={project} onUpdate={(updates) => updateProject(project.id, updates)} />
          </TabsContent>

          <TabsContent value="monitoring">
            <ProjectMonitoring project={project} onUpdate={(updates) => updateProject(project.id, updates)} />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </AppLayout>
  );
};

export default ProjectManagement;