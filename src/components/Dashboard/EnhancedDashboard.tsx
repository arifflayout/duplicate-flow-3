import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowUp,
  ArrowRight,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  Plus,
  Eye,
  MessageSquare,
  BarChart3,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();

  const metrics = [
    {
      title: 'Active Projects',
      value: '3',
      change: '+12%',
      trend: 'up',
      icon: Building,
      color: 'primary',
      description: 'Currently in progress'
    },
    {
      title: 'Total Investment',
      value: formatCurrency(75000000),
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'success',
      description: 'Portfolio value'
    },
    {
      title: 'ROI Performance',
      value: '23.4%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'info',
      description: 'Year over year'
    },
    {
      title: 'Team Members',
      value: '24',
      change: '+6',
      trend: 'up',
      icon: Users,
      color: 'warning',
      description: 'Active collaborators'
    }
  ];

  const projects = [
    {
      id: '1',
      name: 'Sunrise Residences',
      location: 'Shah Alam, Selangor',
      progress: 75,
      status: 'construction',
      budget: 25000000,
      completion: '2024-12-15',
      team: 8,
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      risk: 'low'
    },
    {
      id: '2',
      name: 'Metro Plaza',
      location: 'Kuala Lumpur',
      progress: 45,
      status: 'design-approval',
      budget: 35000000,
      completion: '2025-06-30',
      team: 12,
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      risk: 'medium'
    },
    {
      id: '3',
      name: 'Eco Gardens',
      location: 'Penang',
      progress: 20,
      status: 'planning',
      budget: 15000000,
      completion: '2025-12-31',
      team: 6,
      image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
      risk: 'low'
    }
  ];

  const activities = [
    {
      id: '1',
      title: 'Milestone Completed',
      description: 'Foundation work completed for Sunrise Residences',
      time: '2 hours ago',
      type: 'success',
      icon: CheckCircle
    },
    {
      id: '2',
      title: 'Approval Pending',
      description: 'Environmental impact assessment under review',
      time: '4 hours ago',
      type: 'warning',
      icon: AlertCircle
    },
    {
      id: '3',
      title: 'New Proposal',
      description: 'Architectural proposal received from Sarah Chen',
      time: '1 day ago',
      type: 'info',
      icon: MessageSquare
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgZmlsbC1vcGFjaXR5PSIwLjEiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <EnhancedBadge variant="gradient-cool" className="text-primary">
                Live Dashboard
              </EnhancedBadge>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome back, {user?.name?.split(' ')[0]}! 🚀
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Your development empire is thriving. Track progress, manage projects, 
              and grow your portfolio with intelligent insights.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <EnhancedButton variant="glass" size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Start New Project
              </EnhancedButton>
              <EnhancedButton variant="outline" size="lg" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <BarChart3 className="h-5 w-5" />
                View Analytics
              </EnhancedButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-16 relative z-10">
          {metrics.map((metric, index) => (
            <EnhancedCard key={index} variant="elevated" className="glass-effect border-border/20 hover:shadow-xl transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${metric.color}/10 to-${metric.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <metric.icon className={`h-6 w-6 text-${metric.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-success text-sm font-medium">
                    <ArrowUp className="h-4 w-4" />
                    {metric.change}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-foreground">{metric.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Projects Section */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Active Projects</h2>
                <p className="text-muted-foreground">Monitor your development portfolio</p>
              </div>
              <EnhancedButton variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                View All
              </EnhancedButton>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <EnhancedCard key={project.id} variant="interactive" className="group overflow-hidden">
                  <div className="flex">
                    {/* Project Image */}
                    <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-2 left-2">
                        <EnhancedBadge 
                          variant={project.risk === 'low' ? 'success' : project.risk === 'medium' ? 'warning' : 'error'}
                          size="sm"
                        >
                          {project.risk} risk
                        </EnhancedBadge>
                      </div>
                    </div>
                    
                    {/* Project Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {project.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {project.team} members
                            </div>
                          </div>
                        </div>
                        
                        <EnhancedBadge variant="info">
                          {project.status.replace('-', ' ')}
                        </EnhancedBadge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-surface-50 rounded-lg">
                          <div className="font-semibold text-primary">{project.progress}%</div>
                          <div className="text-xs text-muted-foreground">Complete</div>
                        </div>
                        <div className="text-center p-3 bg-surface-50 rounded-lg">
                          <div className="font-semibold text-success">{formatCurrency(project.budget)}</div>
                          <div className="text-xs text-muted-foreground">Budget</div>
                        </div>
                        <div className="text-center p-3 bg-surface-50 rounded-lg">
                          <div className="font-semibold text-info">{new Date(project.completion).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">Target</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                  <EnhancedBadge variant="neutral">Live</EnhancedBadge>
                </div>
              </EnhancedCardHeader>
              <EnhancedCardContent className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 p-3 rounded-lg hover:bg-surface-50 transition-colors group">
                    <div className={`w-10 h-10 rounded-full bg-${activity.type}/10 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <activity.icon className={`h-5 w-5 text-${activity.type}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </EnhancedCardContent>
            </EnhancedCard>

            {/* Quick Actions */}
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
              </EnhancedCardHeader>
              <EnhancedCardContent className="space-y-3">
                <EnhancedButton variant="gradient-cool" className="w-full justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5" />
                    Find Land
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </EnhancedButton>
                
                <EnhancedButton variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5" />
                    AI Insights
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </EnhancedButton>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;