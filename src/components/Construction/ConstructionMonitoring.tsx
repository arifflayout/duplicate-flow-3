import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  MessageSquare,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StatusBadge from '@/components/common/StatusBadge';
import { useProject } from '@/contexts/ProjectContext';

interface ConstructionPhase {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  progress: number;
  startDate?: Date;
  endDate?: Date;
  estimatedDuration: number;
  dependencies: string[];
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'completed' | 'overdue';
  dueDate: Date;
  completedDate?: Date;
  photos: string[];
  notes: string;
  inspector?: string;
}

interface ProgressUpdate {
  id: string;
  phase: string;
  milestone: string;
  description: string;
  photos: string[];
  updatedBy: string;
  updatedAt: Date;
  issues?: string;
}

const ConstructionMonitoring: React.FC = () => {
  const { toast } = useToast();
  const { currentProject, updateProject } = useProject();
  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    milestone: '',
    description: '',
    photos: [] as string[],
    issues: ''
  });

  // Mock construction phases data
  const constructionPhases: ConstructionPhase[] = [
    {
      id: 'earthworks',
      name: 'Earthworks & Foundation',
      description: 'Site preparation, excavation, and foundation work',
      status: 'completed',
      progress: 100,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-28'),
      estimatedDuration: 45,
      dependencies: [],
      milestones: [
        {
          id: 'site-clearing',
          name: 'Site Clearing',
          description: 'Clear vegetation and prepare site',
          status: 'completed',
          dueDate: new Date('2024-01-20'),
          completedDate: new Date('2024-01-18'),
          photos: ['site_clearing_1.jpg', 'site_clearing_2.jpg'],
          notes: 'Site cleared ahead of schedule. Good weather conditions.',
          inspector: 'John Site Engineer'
        },
        {
          id: 'excavation',
          name: 'Excavation',
          description: 'Excavate for foundation and utilities',
          status: 'completed',
          dueDate: new Date('2024-02-05'),
          completedDate: new Date('2024-02-03'),
          photos: ['excavation_1.jpg', 'excavation_2.jpg'],
          notes: 'Excavation completed. Soil conditions as expected.',
          inspector: 'Sarah Geotechnical'
        },
        {
          id: 'foundation',
          name: 'Foundation Pour',
          description: 'Pour concrete foundation',
          status: 'completed',
          dueDate: new Date('2024-02-25'),
          completedDate: new Date('2024-02-24'),
          photos: ['foundation_1.jpg', 'foundation_2.jpg'],
          notes: 'Foundation poured successfully. Concrete strength tests passed.',
          inspector: 'Mike Structural'
        }
      ]
    },
    {
      id: 'superstructure',
      name: 'Superstructure',
      description: 'Main building structure construction',
      status: 'in-progress',
      progress: 65,
      startDate: new Date('2024-03-01'),
      estimatedDuration: 90,
      dependencies: ['earthworks'],
      milestones: [
        {
          id: 'ground-floor',
          name: 'Ground Floor Structure',
          description: 'Complete ground floor columns and beams',
          status: 'completed',
          dueDate: new Date('2024-03-20'),
          completedDate: new Date('2024-03-18'),
          photos: ['ground_floor_1.jpg'],
          notes: 'Ground floor structure completed on schedule.',
          inspector: 'Mike Structural'
        },
        {
          id: 'first-floor',
          name: 'First Floor Structure',
          description: 'Complete first floor structure',
          status: 'completed',
          dueDate: new Date('2024-04-10'),
          completedDate: new Date('2024-04-08'),
          photos: ['first_floor_1.jpg'],
          notes: 'First floor completed. Minor adjustments made to beam alignment.',
          inspector: 'Mike Structural'
        },
        {
          id: 'roof-structure',
          name: 'Roof Structure',
          description: 'Install roof trusses and covering',
          status: 'pending',
          dueDate: new Date('2024-04-30'),
          photos: [],
          notes: 'Waiting for roof materials delivery.',
          inspector: 'Mike Structural'
        }
      ]
    },
    {
      id: 'finishing',
      name: 'Finishing Works',
      description: 'Interior and exterior finishing',
      status: 'not-started',
      progress: 0,
      estimatedDuration: 60,
      dependencies: ['superstructure'],
      milestones: [
        {
          id: 'electrical-rough',
          name: 'Electrical Rough-in',
          description: 'Install electrical wiring and outlets',
          status: 'pending',
          dueDate: new Date('2024-05-15'),
          photos: [],
          notes: ''
        },
        {
          id: 'plumbing-rough',
          name: 'Plumbing Rough-in',
          description: 'Install plumbing pipes and fixtures',
          status: 'pending',
          dueDate: new Date('2024-05-20'),
          photos: [],
          notes: ''
        },
        {
          id: 'interior-finishing',
          name: 'Interior Finishing',
          description: 'Flooring, painting, and interior work',
          status: 'pending',
          dueDate: new Date('2024-06-30'),
          photos: [],
          notes: ''
        }
      ]
    }
  ];

  // Mock recent updates
  const recentUpdates: ProgressUpdate[] = [
    {
      id: '1',
      phase: 'Superstructure',
      milestone: 'First Floor Structure',
      description: 'First floor concrete pour completed successfully. All columns and beams are in place.',
      photos: ['first_floor_pour.jpg', 'beam_alignment.jpg'],
      updatedBy: 'Mike Builder',
      updatedAt: new Date('2024-04-08'),
      issues: 'Minor beam alignment adjustment required'
    },
    {
      id: '2',
      phase: 'Superstructure',
      milestone: 'Ground Floor Structure',
      description: 'Ground floor structure inspection completed. All structural elements meet specifications.',
      photos: ['ground_inspection.jpg'],
      updatedBy: 'Sarah Inspector',
      updatedAt: new Date('2024-03-18')
    }
  ];

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'delayed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProgressUpdate = () => {
    if (!updateForm.milestone || !updateForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Add monitoring report to current project
    if (currentProject) {
      const newReport = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        summary: `${updateForm.milestone}: ${updateForm.description}`,
        status: updateForm.issues ? 'warning' : 'ok' as const,
        photos: updateForm.photos,
        issues: updateForm.issues ? [updateForm.issues] : []
      };

      updateProject(currentProject.id, {
        monitoring: [...currentProject.monitoring, newReport]
      });
    }
    toast({
      title: "Progress Updated",
      description: "Construction progress has been updated successfully.",
    });

    setShowUpdateModal(false);
    setUpdateForm({
      milestone: '',
      description: '',
      photos: [],
      issues: ''
    });
  };

  const handlePhotoUpload = () => {
    // Mock photo upload
    const newPhoto = `photo_${Date.now()}.jpg`;
    setUpdateForm(prev => ({
      ...prev,
      photos: [...prev.photos, newPhoto]
    }));
    
    toast({
      title: "Photo Uploaded",
      description: "Progress photo uploaded successfully.",
    });
  };

  const overallProgress = Math.round(
    constructionPhases.reduce((sum, phase) => sum + phase.progress, 0) / constructionPhases.length
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Construction Monitoring</h1>
          <p className="text-muted-foreground">Track construction progress and milestones</p>
        </div>
        <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Update Progress
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Update Construction Progress</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="milestone">Milestone</Label>
                <Input
                  id="milestone"
                  placeholder="e.g., Ground Floor Structure"
                  value={updateForm.milestone}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, milestone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">Progress Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the progress made..."
                  value={updateForm.description}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <Label>Progress Photos</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Button variant="outline" onClick={handlePhotoUpload}>
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                  {updateForm.photos.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {updateForm.photos.length} photo(s) uploaded
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="issues">Issues or Notes (Optional)</Label>
                <Textarea
                  id="issues"
                  placeholder="Any issues or important notes..."
                  value={updateForm.issues}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, issues: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleProgressUpdate}>
                  Update Progress
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Construction Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{overallProgress}% Complete</span>
              <Badge variant="secondary">On Schedule</Badge>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">
                  {constructionPhases.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-muted-foreground">Completed Phases</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">
                  {constructionPhases.filter(p => p.status === 'in-progress').length}
                </div>
                <div className="text-muted-foreground">Active Phases</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-600">
                  {constructionPhases.filter(p => p.status === 'not-started').length}
                </div>
                <div className="text-muted-foreground">Upcoming Phases</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList>
          <TabsTrigger value="phases">Construction Phases</TabsTrigger>
          <TabsTrigger value="updates">Recent Updates</TabsTrigger>
          <TabsTrigger value="photos">Photo Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-4">
          {constructionPhases.map((phase) => (
            <Card key={phase.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {phase.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {phase.status === 'in-progress' && <Clock className="h-5 w-5 text-blue-600" />}
                      {phase.status === 'delayed' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                      {phase.status === 'not-started' && <Clock className="h-5 w-5 text-gray-400" />}
                      {phase.name}
                    </CardTitle>
                    <CardDescription>{phase.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{phase.progress}%</div>
                    <StatusBadge status={phase.status} size="sm" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={phase.progress} className="h-2" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {phase.startDate && (
                    <div>
                      <span className="text-muted-foreground">Started:</span>
                      <p className="font-medium">{phase.startDate.toLocaleDateString()}</p>
                    </div>
                  )}
                  {phase.endDate && (
                    <div>
                      <span className="text-muted-foreground">Completed:</span>
                      <p className="font-medium">{phase.endDate.toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium">{phase.estimatedDuration} days</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Milestones:</span>
                    <p className="font-medium">{phase.milestones.length}</p>
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h4 className="font-medium mb-3">Milestones</h4>
                  <div className="space-y-2">
                    {phase.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{milestone.name}</h5>
                            <Badge className={getMilestoneStatusColor(milestone.status)}>
                              {milestone.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>Due: {milestone.dueDate.toLocaleDateString()}</span>
                            {milestone.completedDate && (
                              <span>Completed: {milestone.completedDate.toLocaleDateString()}</span>
                            )}
                            {milestone.inspector && (
                              <span>Inspector: {milestone.inspector}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {milestone.photos.length > 0 && (
                            <Badge variant="outline">
                              <Camera className="h-3 w-3 mr-1" />
                              {milestone.photos.length}
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          {recentUpdates.map((update) => (
            <Card key={update.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{update.phase} - {update.milestone}</h4>
                      <Badge variant="secondary">{update.updatedBy}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{update.description}</p>
                    {update.issues && (
                      <div className="bg-yellow-50 p-2 rounded text-sm">
                        <span className="font-medium text-yellow-800">Issues: </span>
                        <span className="text-yellow-700">{update.issues}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{update.updatedAt.toLocaleDateString()}</span>
                      {update.photos.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          {update.photos.length} photos
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Construction Photo Gallery</CardTitle>
              <CardDescription>Visual progress documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Mock photo gallery */}
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConstructionMonitoring;