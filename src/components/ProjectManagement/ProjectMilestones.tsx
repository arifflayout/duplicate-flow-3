import React, { useState } from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Edit,
  Trash2,
  Flag
} from 'lucide-react';
import { Project, Milestone } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

interface ProjectMilestonesProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({ project, onUpdate }) => {
  const { toast } = useToast();
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending' as Milestone['status'],
    assignedTo: ''
  });

  const resetMilestoneForm = () => {
    setMilestoneForm({
      title: '',
      description: '',
      dueDate: '',
      status: 'pending',
      assignedTo: ''
    });
    setEditingMilestone(null);
  };

  const handleMilestoneSubmit = () => {
    if (!milestoneForm.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a milestone title.",
        variant: "destructive"
      });
      return;
    }

    const milestoneData: Milestone = {
      id: editingMilestone?.id || crypto.randomUUID(),
      title: milestoneForm.title,
      description: milestoneForm.description,
      dueDate: milestoneForm.dueDate,
      status: milestoneForm.status,
      assignedTo: milestoneForm.assignedTo,
      completedDate: milestoneForm.status === 'completed' ? new Date().toISOString() : undefined
    };

    const updatedMilestones = editingMilestone
      ? project.milestones.map(m => m.id === editingMilestone.id ? milestoneData : m)
      : [...project.milestones, milestoneData];

    onUpdate({ milestones: updatedMilestones });

    toast({
      title: editingMilestone ? "Milestone Updated" : "Milestone Created",
      description: `Milestone has been ${editingMilestone ? 'updated' : 'added'} successfully.`
    });

    setShowMilestoneModal(false);
    resetMilestoneForm();
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setMilestoneForm({
      title: milestone.title,
      description: milestone.description || '',
      dueDate: milestone.dueDate,
      status: milestone.status,
      assignedTo: milestone.assignedTo || ''
    });
    setShowMilestoneModal(true);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    const updatedMilestones = project.milestones.filter(m => m.id !== milestoneId);
    onUpdate({ milestones: updatedMilestones });
    
    toast({
      title: "Milestone Deleted",
      description: "Milestone has been removed from the project."
    });
  };

  const handleStatusChange = (milestoneId: string, newStatus: Milestone['status']) => {
    const updatedMilestones = project.milestones.map(m => 
      m.id === milestoneId 
        ? { 
            ...m, 
            status: newStatus,
            completedDate: newStatus === 'completed' ? new Date().toISOString() : undefined
          }
        : m
    );
    
    onUpdate({ milestones: updatedMilestones });
    
    toast({
      title: "Milestone Updated",
      description: "Milestone status has been updated."
    });
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-warning" />;
      case 'delayed': return <AlertTriangle className="h-5 w-5 text-error" />;
      default: return <Target className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'delayed': return 'error';
      default: return 'neutral';
    }
  };

  const sortedMilestones = [...project.milestones].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const completedCount = project.milestones.filter(m => m.status === 'completed').length;
  const inProgressCount = project.milestones.filter(m => m.status === 'in-progress').length;
  const pendingCount = project.milestones.filter(m => m.status === 'pending').length;
  const delayedCount = project.milestones.filter(m => m.status === 'delayed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Project Milestones</h2>
        <Dialog open={showMilestoneModal} onOpenChange={setShowMilestoneModal}>
          <DialogTrigger asChild>
            <EnhancedButton className="gap-2" onClick={resetMilestoneForm}>
              <Plus className="h-4 w-4" />
              Add Milestone
            </EnhancedButton>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMilestone ? 'Edit Milestone' : 'Create New Milestone'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Milestone Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter milestone title"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the milestone..."
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={milestoneForm.dueDate}
                    onChange={(e) => setMilestoneForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={milestoneForm.status} onValueChange={(value: Milestone['status']) => 
                    setMilestoneForm(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select value={milestoneForm.assignedTo} onValueChange={(value) => 
                  setMilestoneForm(prev => ({ ...prev, assignedTo: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {project.participants.map((participant) => (
                      <SelectItem key={participant.id} value={participant.name}>
                        {participant.name} ({participant.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <EnhancedButton variant="outline" onClick={() => setShowMilestoneModal(false)}>
                  Cancel
                </EnhancedButton>
                <EnhancedButton onClick={handleMilestoneSubmit}>
                  {editingMilestone ? 'Update Milestone' : 'Create Milestone'}
                </EnhancedButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Milestone Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{inProgressCount}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-info">{pendingCount}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-error">{delayedCount}</div>
            <div className="text-sm text-muted-foreground">Delayed</div>
          </div>
        </EnhancedCard>
      </div>

      {/* Milestones List */}
      <EnhancedCard variant="elevated">
        <EnhancedCardHeader>
          <h3 className="text-lg font-bold text-foreground">Milestone Timeline</h3>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-4">
            {sortedMilestones.length > 0 ? (
              sortedMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow group">
                  <div className="flex-shrink-0">
                    {getStatusIcon(milestone.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                      <div className="flex items-center gap-2">
                        <EnhancedBadge variant={getStatusColor(milestone.status)}>
                          {milestone.status.replace('-', ' ')}
                        </EnhancedBadge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <EnhancedButton 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleEditMilestone(milestone)}
                          >
                            <Edit className="h-3 w-3" />
                          </EnhancedButton>
                          <EnhancedButton 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleDeleteMilestone(milestone.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </EnhancedButton>
                        </div>
                      </div>
                    </div>
                    
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {milestone.completedDate && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-success">
                            Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {milestone.assignedTo && (
                        <div className="flex items-center gap-1">
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Assigned to: {milestone.assignedTo}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Status Actions */}
                    {milestone.status !== 'completed' && (
                      <div className="flex gap-2 mt-3">
                        {milestone.status === 'pending' && (
                          <EnhancedButton 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(milestone.id, 'in-progress')}
                          >
                            Start
                          </EnhancedButton>
                        )}
                        {milestone.status === 'in-progress' && (
                          <EnhancedButton 
                            variant="success" 
                            size="sm"
                            onClick={() => handleStatusChange(milestone.id, 'completed')}
                          >
                            Mark Complete
                          </EnhancedButton>
                        )}
                        {milestone.status !== 'delayed' && (
                          <EnhancedButton 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(milestone.id, 'delayed')}
                          >
                            Mark Delayed
                          </EnhancedButton>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Milestones Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create milestones to track important project achievements and deadlines.
                </p>
                <EnhancedButton onClick={() => setShowMilestoneModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Milestone
                </EnhancedButton>
              </div>
            )}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  );
};

export default ProjectMilestones;