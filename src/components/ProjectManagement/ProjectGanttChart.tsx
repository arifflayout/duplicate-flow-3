import React from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectGanttChartProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const ProjectGanttChart: React.FC<ProjectGanttChartProps> = ({ project }) => {
  // Mock timeline data based on project milestones
  const timelineItems = [
    {
      id: '1',
      name: 'Project Planning',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      progress: 100,
      status: 'completed',
      dependencies: []
    },
    {
      id: '2',
      name: 'Design Development',
      startDate: '2024-02-01',
      endDate: '2024-03-30',
      progress: 85,
      status: 'in-progress',
      dependencies: ['1']
    },
    {
      id: '3',
      name: 'Permit Applications',
      startDate: '2024-03-15',
      endDate: '2024-05-15',
      progress: 40,
      status: 'in-progress',
      dependencies: ['2']
    },
    {
      id: '4',
      name: 'Construction Phase 1',
      startDate: '2024-05-01',
      endDate: '2024-08-30',
      progress: 0,
      status: 'pending',
      dependencies: ['3']
    },
    {
      id: '5',
      name: 'Construction Phase 2',
      startDate: '2024-08-15',
      endDate: '2024-12-31',
      progress: 0,
      status: 'pending',
      dependencies: ['4']
    },
    {
      id: '6',
      name: 'Final Inspections',
      startDate: '2024-12-15',
      endDate: '2025-01-31',
      progress: 0,
      status: 'pending',
      dependencies: ['5']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'neutral';
      case 'delayed': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Project Timeline</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <EnhancedBadge variant="primary">Gantt Chart</EnhancedBadge>
        </div>
      </div>

      {/* Timeline Overview */}
      <EnhancedCard variant="elevated">
        <EnhancedCardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Project Phases</h3>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Start Date</div>
                <div className="font-semibold">
                  {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">End Date</div>
                <div className="font-semibold">
                  {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}
                </div>
              </div>
            </div>
          </div>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-6">
            {timelineItems.map((item, index) => (
              <div key={item.id} className="relative">
                {/* Timeline connector */}
                {index < timelineItems.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-8 bg-border"></div>
                )}
                
                <div className="flex items-start gap-4">
                  {/* Status indicator */}
                  <div className={`w-12 h-12 rounded-full border-4 border-background flex items-center justify-center ${
                    item.status === 'completed' ? 'bg-success text-white' :
                    item.status === 'in-progress' ? 'bg-warning text-white' :
                    'bg-surface-100 text-muted-foreground'
                  }`}>
                    {getStatusIcon(item.status)}
                  </div>
                  
                  {/* Phase details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                      <EnhancedBadge variant={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </EnhancedBadge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Start:</span>
                        <div className="font-medium">{new Date(item.startDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End:</span>
                        <div className="font-medium">{new Date(item.endDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">{calculateDuration(item.startDate, item.endDate)} days</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>

                    {/* Dependencies */}
                    {item.dependencies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          Depends on: {item.dependencies.map(dep => 
                            timelineItems.find(t => t.id === dep)?.name
                          ).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Timeline Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{timelineItems.length}</div>
            <div className="text-sm text-muted-foreground">Total Phases</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {timelineItems.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {timelineItems.filter(t => t.status === 'in-progress').length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-info">
              {Math.round(timelineItems.reduce((sum, t) => sum + t.progress, 0) / timelineItems.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </div>
        </EnhancedCard>
      </div>
    </div>
  );
};

export default ProjectGanttChart;