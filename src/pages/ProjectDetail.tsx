import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { migrateToProjectSchema } from '@/utils/projectMigration';
import { ArrowLeft, Calendar, DollarSign, Users, FileText, CheckCircle, Clock, AlertTriangle, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/Layout/AppLayout';
import PageLayout from '@/components/Layout/PageLayout';
import Breadcrumb from '@/components/Layout/Breadcrumb';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, updateProject } = useProject();
  const { user } = useAuth();
  
  // Try to get project from context first, fallback to mock data
  let project = id ? getProjectById(id) : null;
  
  // If not found in context, create mock data and migrate it
  if (!project) {
    const mockProject = {
      id: id || '1',
      name: 'Skyline Residences',
      status: 'active',
      stage: 'design-approval',
      progress: 45,
      location: 'Kuala Lumpur, Malaysia',
      budget: 2500000,
      spent: 1125000,
      startDate: '2024-01-15',
      expectedCompletion: '2025-06-30',
      description: 'A modern 24-unit residential development featuring sustainable design and premium amenities.',
      landDetails: {
        size: '2.5 acres',
        zoning: 'Residential',
        address: 'Jalan Ampang, 50450 Kuala Lumpur'
      },
      team: [
        { id: '1', name: 'John Developer', role: 'Developer', avatar: '', email: 'john@example.com' },
        { id: '2', name: 'Sarah Architect', role: 'Consultant', avatar: '', email: 'sarah@example.com' },
        { id: '3', name: 'Mike Builder', role: 'Contractor', avatar: '', email: 'mike@example.com' },
        { id: '4', name: 'Lisa Manager', role: 'Project Manager', avatar: '', email: 'lisa@example.com' }
      ],
      milestones: [
        { id: '1', name: 'Land Acquisition', status: 'completed', dueDate: '2024-01-30', completedDate: '2024-01-28' },
        { id: '2', name: 'Project Brief', status: 'completed', dueDate: '2024-02-15', completedDate: '2024-02-10' },
        { id: '3', name: 'Design Development', status: 'completed', dueDate: '2024-04-01', completedDate: '2024-03-28' },
        { id: '4', name: 'Approval Submissions', status: 'in-progress', dueDate: '2024-05-15', completedDate: null },
        { id: '5', name: 'Construction Start', status: 'pending', dueDate: '2024-07-01', completedDate: null },
        { id: '6', name: 'Project Completion', status: 'pending', dueDate: '2025-06-30', completedDate: null }
      ],
      approvals: [
        { name: 'Green Form', status: 'approved', submittedDate: '2024-02-20', approvedDate: '2024-03-05' },
        { name: 'Development Order', status: 'in-review', submittedDate: '2024-03-15', approvedDate: null },
        { name: 'Building Plan', status: 'pending', submittedDate: null, approvedDate: null },
        { name: 'BOMBA Approval', status: 'pending', submittedDate: null, approvedDate: null }
      ],
      documents: [
        { id: '1', name: 'Site Survey Report.pdf', type: 'PDF', size: '2.3 MB', uploadedBy: 'Sarah Architect', uploadedAt: '2024-02-15' },
        { id: '2', name: 'Architectural Plans v2.dwg', type: 'AutoCAD', size: '15.7 MB', uploadedBy: 'Sarah Architect', uploadedAt: '2024-03-20' },
        { id: '3', name: 'Environmental Impact Assessment.pdf', type: 'PDF', size: '4.1 MB', uploadedBy: 'John Developer', uploadedAt: '2024-02-28' },
        { id: '4', name: 'Structural Engineering Report.pdf', type: 'PDF', size: '3.8 MB', uploadedBy: 'Sarah Architect', uploadedAt: '2024-03-10' }
      ],
      recentActivity: [
        { id: '1', action: 'Document uploaded', detail: 'Architectural Plans v2.dwg', user: 'Sarah Architect', timestamp: '2024-03-20 14:30' },
        { id: '2', action: 'Milestone completed', detail: 'Design Development', user: 'Sarah Architect', timestamp: '2024-03-28 09:15' },
        { id: '3', action: 'Approval submitted', detail: 'Development Order application', user: 'John Developer', timestamp: '2024-03-15 16:45' }
      ]
    };
    
    // Migrate mock data to new schema
    project = migrateToProjectSchema(mockProject);
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-gray-400" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-review': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in-progress':
      case 'in-review': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout currentView="projects" onViewChange={() => {}}>
      <PageLayout
        title={project.name}
        description={project.location}
        breadcrumbs={[
          { label: 'Dashboard', href: '/', icon: LayoutDashboard },
          { label: 'Projects', href: '/?view=projects' },
          { label: project.name, current: true }
        ]}
        backButton={{
          label: 'Back to Projects',
          onClick: () => navigate('/')
        }}
        actions={[
          {
            label: 'Manage Project',
            onClick: () => navigate(`/project/${id}/manage`),
            variant: 'default',
            icon: LayoutDashboard
          }
        ]}
        headerContent={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(project.status || 'active')}>
              {project.status}
            </Badge>
            <Badge variant="secondary">{project.type.replace('-', ' ')}</Badge>
          </div>
        }
      >

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {project.milestones.length > 0 
                  ? Math.round((project.milestones.filter(m => m.status === 'completed').length / project.milestones.length) * 100)
                  : 0
                }%
              </div>
              <Progress value={project.milestones.length > 0 
                ? Math.round((project.milestones.filter(m => m.status === 'completed').length / project.milestones.length) * 100)
                : 0
              } className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {project.budget ? `RM ${(project.budget / 1000000).toFixed(1)}M` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Total project budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.participants.length}</div>
              <p className="text-xs text-muted-foreground">
                Active stakeholders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.compliance.length}</div>
              <p className="text-xs text-muted-foreground">
                Compliance items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones ({project.milestones.length})</TabsTrigger>
            <TabsTrigger value="approvals">Compliance ({project.compliance.length})</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="financing">Financing</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{project.description || 'No description available'}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm">Start Date</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Expected Completion</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm">Type</h4>
                      <p className="text-sm text-muted-foreground capitalize">{project.type}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Status</h4>
                      <p className="text-sm text-muted-foreground capitalize">{project.status}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-sm">Location</h4>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Track progress through key project phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.length > 0 ? project.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      {getStatusIcon(milestone.status || 'pending')}
                      <div className="flex-1">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          {milestone.completedDate && ` • Completed: ${new Date(milestone.completedDate).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Badge className={getStatusColor(milestone.status || 'pending')}>
                        {(milestone.status || 'pending').replace('-', ' ')}
                      </Badge>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">No milestones defined yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Approvals</CardTitle>
                <CardDescription>Track regulatory requirements and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.compliance.length > 0 ? project.compliance.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.completed ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-yellow-600" />}
                        <div>
                          <h4 className="font-medium">{item.item}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.dueDate ? `Due: ${new Date(item.dueDate).toLocaleDateString()}` : 'No due date'}
                            {item.completedDate && ` • Completed: ${new Date(item.completedDate).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <Badge className={item.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {item.completed ? 'completed' : 'pending'}
                      </Badge>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">No compliance items yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
                <CardDescription>Key stakeholders and team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.participants.length > 0 ? project.participants.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={member.avatar || ''} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full text-center py-8">
                      <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">No team members assigned</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financing">
            <Card>
              <CardHeader>
                <CardTitle>Project Financing</CardTitle>
                <CardDescription>Budget and financing information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm">Total Budget</h4>
                      <p className="text-lg font-bold">
                        {project.budget ? `RM ${project.budget.toLocaleString()}` : 'Not set'}
                      </p>
                    </div>
                    {project.financing && (
                      <div>
                        <h4 className="font-medium text-sm">Financing Status</h4>
                        <Badge className={getStatusColor(project.financing.status)}>
                          {project.financing.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {project.ltv && (
                    <div>
                      <h4 className="font-medium text-sm">Loan-to-Value Ratio</h4>
                      <p className="text-lg font-bold text-info">{project.ltv}%</p>
                    </div>
                  )}
                  
                  {!project.financing && (
                    <div className="text-center py-8">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">No financing information available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest project updates and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.monitoring.length > 0 ? project.monitoring.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex gap-4 p-4 border-l-2 border-blue-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">Monitoring Report</h4>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">System</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{report.summary}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(report.date).toLocaleString()}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </AppLayout>
  );
};

export default ProjectDetail;