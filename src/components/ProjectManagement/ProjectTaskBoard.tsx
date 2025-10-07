import React, { useState } from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Calendar, 
  User, 
  Flag, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';
import { Project, ProjectTask } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

interface ProjectTaskBoardProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const ProjectTaskBoard: React.FC<ProjectTaskBoardProps> = ({ project, onUpdate }) => {
  const { toast } = useToast();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo' as ProjectTask['status'],
    priority: 'medium' as ProjectTask['priority'],
    assignedTo: '',
    dueDate: '',
    tags: [] as string[]
  });

  // Mock tasks data - in real app this would be part of project data
  const [tasks, setTasks] = useState<ProjectTask[]>([
    {
      id: '1',
      title: 'Site Survey Completion',
      description: 'Complete topographical and boundary survey',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Sarah Chen',
      dueDate: '2024-03-15',
      tags: ['survey', 'planning']
    },
    {
      id: '2',
      title: 'Architectural Plans Review',
      description: 'Review and approve initial architectural drawings',
      status: 'in-progress',
      priority: 'high',
      assignedTo: 'John Developer',
      dueDate: '2024-03-25',
      tags: ['design', 'approval']
    },
    {
      id: '3',
      title: 'Contractor Selection',
      description: 'Evaluate and select main contractor',
      status: 'todo',
      priority: 'medium',
      assignedTo: '',
      dueDate: '2024-04-10',
      tags: ['procurement', 'contractor']
    },
    {
      id: '4',
      title: 'Building Permit Application',
      description: 'Submit building permit application to local authority',
      status: 'todo',
      priority: 'high',
      assignedTo: 'Sarah Chen',
      dueDate: '2024-04-01',
      tags: ['permit', 'legal']
    }
  ]);

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
      tags: []
    });
    setEditingTask(null);
  };

  const handleTaskSubmit = () => {
    if (!taskForm.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a task title.",
        variant: "destructive"
      });
      return;
    }

    const taskData: ProjectTask = {
      id: editingTask?.id || crypto.randomUUID(),
      title: taskForm.title,
      description: taskForm.description,
      status: taskForm.status,
      priority: taskForm.priority,
      assignedTo: taskForm.assignedTo,
      dueDate: taskForm.dueDate,
      tags: taskForm.tags
    };

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? taskData : t));
      toast({
        title: "Task Updated",
        description: "Task has been updated successfully."
      });
    } else {
      setTasks(prev => [...prev, taskData]);
      toast({
        title: "Task Created",
        description: "New task has been added to the project."
      });
    }

    setShowTaskModal(false);
    resetTaskForm();
  };

  const handleEditTask = (task: ProjectTask) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate || '',
      tags: task.tags || []
    });
    setShowTaskModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "Task has been removed from the project."
    });
  };

  const handleStatusChange = (taskId: string, newStatus: ProjectTask['status']) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
    
    toast({
      title: "Task Updated",
      description: "Task status has been updated."
    });
  };

  const getStatusIcon = (status: ProjectTask['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'neutral';
    }
  };

  const getStatusColor = (status: ProjectTask['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'neutral';
    }
  };

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Task Board</h2>
        <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
          <DialogTrigger asChild>
            <EnhancedButton className="gap-2" onClick={resetTaskForm}>
              <Plus className="h-4 w-4" />
              Add Task
            </EnhancedButton>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the task..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={taskForm.status} onValueChange={(value: ProjectTask['status']) => 
                    setTaskForm(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={taskForm.priority} onValueChange={(value: ProjectTask['priority']) => 
                    setTaskForm(prev => ({ ...prev, priority: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select value={taskForm.assignedTo} onValueChange={(value) => 
                    setTaskForm(prev => ({ ...prev, assignedTo: value }))
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

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <EnhancedButton variant="outline" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </EnhancedButton>
                <EnhancedButton onClick={handleTaskSubmit}>
                  {editingTask ? 'Update Task' : 'Create Task'}
                </EnhancedButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <EnhancedCard key={status} variant="elevated">
            <EnhancedCardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold capitalize flex items-center gap-2">
                  {getStatusIcon(status as ProjectTask['status'])}
                  {status.replace('-', ' ')}
                </h3>
                <EnhancedBadge variant={getStatusColor(status as ProjectTask['status'])}>
                  {statusTasks.length}
                </EnhancedBadge>
              </div>
            </EnhancedCardHeader>
            <EnhancedCardContent className="space-y-3">
              {statusTasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <EnhancedButton 
                        variant="ghost" 
                        size="icon-sm"
                        onClick={() => handleEditTask(task)}
                      >
                        <Edit className="h-3 w-3" />
                      </EnhancedButton>
                      <EnhancedButton 
                        variant="ghost" 
                        size="icon-sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </EnhancedButton>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <EnhancedBadge variant={getPriorityColor(task.priority)} size="sm">
                        <Flag className="h-3 w-3" />
                        {task.priority}
                      </EnhancedBadge>
                      
                      {task.dueDate && (
                        <EnhancedBadge variant="neutral" size="sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </EnhancedBadge>
                      )}
                    </div>

                    {task.assignedTo && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{task.assignedTo}</span>
                      </div>
                    )}
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-surface-100 text-muted-foreground px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Status Change Buttons */}
                  {status !== 'completed' && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex gap-2">
                        {status === 'todo' && (
                          <EnhancedButton 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                          >
                            Start Task
                          </EnhancedButton>
                        )}
                        {status === 'in-progress' && (
                          <>
                            <EnhancedButton 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleStatusChange(task.id, 'todo')}
                            >
                              Move to Todo
                            </EnhancedButton>
                            <EnhancedButton 
                              variant="success" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleStatusChange(task.id, 'completed')}
                            >
                              Complete
                            </EnhancedButton>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {statusTasks.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No tasks in this column</p>
                </div>
              )}
            </EnhancedCardContent>
          </EnhancedCard>
        ))}
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{tasks.length}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{tasksByStatus.completed.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{tasksByStatus['in-progress'].length}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-info">
              {tasks.length > 0 ? Math.round((tasksByStatus.completed.length / tasks.length) * 100) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
        </EnhancedCard>
      </div>
    </div>
  );
};

export default ProjectTaskBoard;