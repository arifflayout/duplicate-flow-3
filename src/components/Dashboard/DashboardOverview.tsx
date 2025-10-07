import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { PROJECT_STAGES } from '@/utils/constants';
import StatusBadge from '@/components/common/StatusBadge';
import MetricCard from '@/components/common/MetricCard';
import ProgressIndicator from '@/components/common/ProgressIndicator';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building, 
  Users, 
  Hammer, 
  TrendingUp, 
  MapPin, 
  FileText,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Bell,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProject } from '@/contexts/ProjectContext';
import { migrateToProjectSchema } from '@/utils/projectMigration';
import { useNavigate } from 'react-router-dom';

const calculateDaysRemaining = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

const navigate = (path: string) => {
  window.dispatchEvent(new CustomEvent('app:navigateView', { detail: path }));
};

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const { projects } = useProject();
  const navigate = useNavigate();

  // Use projects from context, or create mock data if empty
  const projectsToShow = projects.length > 0 ? projects : (() => {
    const mockData = [
    {
      id: '1',
      name: 'Sunshine Residences',
      stage: 'design-approval',
      progress: 65,
      status: 'active',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      location: 'Shah Alam, Selangor',
      budget: 15000000,
      daysRemaining: 180
    },
    {
      id: '2',
      name: 'Metro Commercial Plaza',
      stage: 'construction',
      progress: 40,
      status: 'active',
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      location: 'Kuala Lumpur',
      budget: 25000000,
      daysRemaining: 365
    },
    {
      id: '3',
      name: 'Eco Gardens Strata',
      stage: 'consultant-selection',
      progress: 25,
      status: 'active',
      image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
      location: 'George Town, Penang',
      budget: 35000000,
      daysRemaining: 730
    }
  ];
    
    return mockData.map(p => migrateToProjectSchema(p));
  })();
  
  const mockProjects = projectsToShow;

  const recentActivity = [
    {
      id: '1',
      type: 'milestone',
      title: 'Construction Milestone Completed',
      description: 'Ground floor structure completed ahead of schedule',
      time: '2 hours ago',
      project: 'Metro Commercial Plaza',
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      id: '2',
      type: 'approval',
      title: 'Development Order Approved',
      description: 'Planning authority approved the development order',
      time: '1 day ago',
      project: 'Sunshine Residences',
      icon: FileText,
      color: 'text-info'
    },
    {
      id: '3',
      type: 'consultant',
      title: 'New Consultant Proposal',
      description: 'Sarah Chen submitted architectural proposal',
      time: '2 days ago',
      project: 'Eco Gardens Strata',
      icon: Users,
      color: 'text-warning'
    }
  ];

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

  const totalInvestment = mockProjects.reduce((sum, project) => sum + project.budget, 0);
  const avgProgress = Math.round(mockProjects.reduce((sum, project) => {
    const completed = project.milestones.filter(m => m.status === 'completed').length;
    return sum + (project.milestones.length > 0 ? (completed / project.milestones.length) * 100 : 0);
  }, 0) / mockProjects.length);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-info text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-xl text-white/90">
                Here's what's happening with your development projects
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <EnhancedButton variant="secondary" className="gap-2">
                <Bell className="h-4 w-4" />
                3 New Updates
              </EnhancedButton>
              <EnhancedButton variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Plus className="h-4 w-4" />
                Start New Project
              </EnhancedButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Projects"
            value={mockProjects.length.toString()}
            change={{ value: '+12% from last month', type: 'positive' }}
            icon={Building}
            variant="default"
          />
          <MetricCard
            title="Total Investment"
            value={formatCurrency(totalInvestment)}
            change={{ value: '+8% from last month', type: 'positive' }}
            icon={TrendingUp}
            variant="success"
          />
          <MetricCard
            title="Average Progress"
            value={`${avgProgress}%`}
            change={{ value: '+5% this week', type: 'positive' }}
            icon={Clock}
            variant="info"
          />
          <MetricCard
            title="Team Members"
            value="12"
            change={{ value: '+3 this month', type: 'positive' }}
            icon={Users}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Active Projects */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Active Projects</h2>
              <EnhancedButton variant="outline" size="sm">
                View All Projects
              </EnhancedButton>
            </div>

            <div className="space-y-4">
              {mockProjects.map((project) => (
                <EnhancedCard key={project.id} variant="project" className="group">
                  <EnhancedCardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Project Image */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Project Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {project.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {project.endDate ? calculateDaysRemaining(project.endDate) : 'TBD'} days remaining
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={project.status} size="sm" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-semibold text-foreground">
                              {project.milestones.length > 0 
                                ? Math.round((project.milestones.filter(m => m.status === 'completed').length / project.milestones.length) * 100)
                                : 0
                              }% Complete
                            </span>
                            <span className="text-muted-foreground ml-2">• {project.budget ? formatCurrency(project.budget) : 'Budget TBD'}</span>
                          </div>
                          <EnhancedButton 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1 group/btn"
                            onClick={() => navigate(`/project/${project.id}`)}
                          >
                            View Details
                            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                          </EnhancedButton>
                        </div>

                        <ProgressIndicator 
                          value={project.milestones.length > 0 
                            ? Math.round((project.milestones.filter(m => m.status === 'completed').length / project.milestones.length) * 100)
                            : 0
                          } 
                          variant="default"
                          size="sm"
                        />
                      </div>
                    </div>
                  </EnhancedCardContent>
                </EnhancedCard>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                  <EnhancedButton variant="ghost" size="sm">
                    View All
                  </EnhancedButton>
                </div>
              </EnhancedCardHeader>
              <EnhancedCardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3 p-3 rounded-lg hover:bg-surface-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center ${activity.color}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-primary">{activity.project}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </EnhancedCardContent>
            </EnhancedCard>

            {/* Quick Actions */}
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
              </EnhancedCardHeader>
              <EnhancedCardContent className="space-y-3">
                <EnhancedButton variant="outline" className="w-full justify-start gap-3 h-auto p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Browse Land</div>
                    <div className="text-sm text-muted-foreground">Find your next development site</div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </EnhancedButton>

                <EnhancedButton 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-auto p-4"
                  onClick={() => window.dispatchEvent(new CustomEvent('app:navigateView', { detail: 'land-marketplace' }))}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Browse Land</div>
                    <div className="text-sm text-muted-foreground">Find your next development site</div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </EnhancedButton>
                <EnhancedButton 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-auto p-4"
                  onClick={() => window.dispatchEvent(new CustomEvent('app:navigateView', { detail: 'consultants' }))}
                >
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Find Consultants</div>
                    <div className="text-sm text-muted-foreground">Connect with professionals</div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </EnhancedButton>

                <EnhancedButton 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-auto p-4"
                  onClick={() => window.dispatchEvent(new CustomEvent('app:navigateView', { detail: 'financing' }))}
                >
                  <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-info" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Apply for Financing</div>
                    <div className="text-sm text-muted-foreground">Secure project funding</div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </EnhancedButton>
              </EnhancedCardContent>
            </EnhancedCard>

            {/* Messages Preview */}
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">Messages</h3>
                  <EnhancedBadge variant="error">3</EnhancedBadge>
                </div>
              </EnhancedCardHeader>
              <EnhancedCardContent className="space-y-3">
                {[
                  { name: 'Sarah Chen', message: 'Architectural plans ready for review', time: '1h ago', avatar: '' },
                  { name: 'Mike Builder', message: 'Construction progress update', time: '3h ago', avatar: '' },
                  { name: 'Lisa Manager', message: 'Weekly project report available', time: '1d ago', avatar: '' }
                ].map((msg, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {msg.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{msg.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{msg.message}</div>
                      <div className="text-xs text-muted-foreground">{msg.time}</div>
                    </div>
                  </div>
                ))}
                
                <EnhancedButton variant="outline" size="sm" className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" />
                  View All Messages
                </EnhancedButton>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;