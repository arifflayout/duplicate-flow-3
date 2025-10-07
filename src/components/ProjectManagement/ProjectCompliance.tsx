import React, { useState } from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';
import { Project, ComplianceChecklist } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

interface ProjectComplianceProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const ProjectCompliance: React.FC<ProjectComplianceProps> = ({ project, onUpdate }) => {
  const { toast } = useToast();
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ComplianceChecklist | null>(null);
  const [complianceForm, setComplianceForm] = useState({
    item: '',
    dueDate: '',
    authority: '',
    documents: [] as string[]
  });

  const resetComplianceForm = () => {
    setComplianceForm({
      item: '',
      dueDate: '',
      authority: '',
      documents: []
    });
    setEditingItem(null);
  };

  const handleComplianceSubmit = () => {
    if (!complianceForm.item.trim()) {
      toast({
        title: "Item Required",
        description: "Please enter a compliance item.",
        variant: "destructive"
      });
      return;
    }

    const complianceData: ComplianceChecklist = {
      id: editingItem?.id || crypto.randomUUID(),
      item: complianceForm.item,
      completed: false,
      dueDate: complianceForm.dueDate,
      authority: complianceForm.authority,
      documents: complianceForm.documents
    };

    const updatedCompliance = editingItem
      ? project.compliance.map(c => c.id === editingItem.id ? complianceData : c)
      : [...project.compliance, complianceData];

    onUpdate({ compliance: updatedCompliance });

    toast({
      title: editingItem ? "Compliance Item Updated" : "Compliance Item Added",
      description: `Compliance item has been ${editingItem ? 'updated' : 'added'} successfully.`
    });

    setShowComplianceModal(false);
    resetComplianceForm();
  };

  const handleEditItem = (item: ComplianceChecklist) => {
    setEditingItem(item);
    setComplianceForm({
      item: item.item,
      dueDate: item.dueDate || '',
      authority: item.authority || '',
      documents: item.documents || []
    });
    setShowComplianceModal(true);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedCompliance = project.compliance.filter(c => c.id !== itemId);
    onUpdate({ compliance: updatedCompliance });
    
    toast({
      title: "Compliance Item Deleted",
      description: "Compliance item has been removed."
    });
  };

  const handleToggleCompleted = (itemId: string, completed: boolean) => {
    const updatedCompliance = project.compliance.map(c => 
      c.id === itemId 
        ? { 
            ...c, 
            completed,
            completedDate: completed ? new Date().toISOString() : undefined
          }
        : c
    );
    
    onUpdate({ compliance: updatedCompliance });
    
    toast({
      title: completed ? "Item Completed" : "Item Reopened",
      description: `Compliance item has been ${completed ? 'marked as completed' : 'reopened'}.`
    });
  };

  const completedCount = project.compliance.filter(c => c.completed).length;
  const pendingCount = project.compliance.filter(c => !c.completed).length;
  const overdue = project.compliance.filter(c => 
    !c.completed && c.dueDate && new Date(c.dueDate) < new Date()
  ).length;
  
  const completionPercentage = project.compliance.length > 0 
    ? Math.round((completedCount / project.compliance.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Compliance & Approvals</h2>
        <Dialog open={showComplianceModal} onOpenChange={setShowComplianceModal}>
          <DialogTrigger asChild>
            <EnhancedButton className="gap-2" onClick={resetComplianceForm}>
              <Plus className="h-4 w-4" />
              Add Compliance Item
            </EnhancedButton>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Compliance Item' : 'Add Compliance Item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item">Compliance Item *</Label>
                <Input
                  id="item"
                  placeholder="e.g., Building Permit Application"
                  value={complianceForm.item}
                  onChange={(e) => setComplianceForm(prev => ({ ...prev, item: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={complianceForm.dueDate}
                    onChange={(e) => setComplianceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authority">Authority</Label>
                  <Input
                    id="authority"
                    placeholder="e.g., Local Planning Authority"
                    value={complianceForm.authority}
                    onChange={(e) => setComplianceForm(prev => ({ ...prev, authority: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <EnhancedButton variant="outline" onClick={() => setShowComplianceModal(false)}>
                  Cancel
                </EnhancedButton>
                <EnhancedButton onClick={handleComplianceSubmit}>
                  {editingItem ? 'Update Item' : 'Add Item'}
                </EnhancedButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Compliance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{pendingCount}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-error">{overdue}</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </div>
        </EnhancedCard>
      </div>

      {/* Progress Overview */}
      <EnhancedCard variant="elevated">
        <EnhancedCardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Compliance Progress</h3>
          </div>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Overall Compliance</span>
              <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completedCount} completed</span>
              <span>{project.compliance.length} total items</span>
            </div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Compliance Checklist */}
      <EnhancedCard variant="elevated">
        <EnhancedCardHeader>
          <h3 className="text-lg font-bold text-foreground">Compliance Checklist</h3>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-3">
            {project.compliance.length > 0 ? (
              project.compliance.map((item) => {
                const isOverdue = item.dueDate && !item.completed && new Date(item.dueDate) < new Date();
                
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow group">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) => handleToggleCompleted(item.id, checked as boolean)}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {item.item}
                        </h4>
                        <div className="flex items-center gap-2">
                          {isOverdue && (
                            <EnhancedBadge variant="error" size="sm">
                              <AlertTriangle className="h-3 w-3" />
                              Overdue
                            </EnhancedBadge>
                          )}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <EnhancedButton 
                              variant="ghost" 
                              size="icon-sm"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="h-3 w-3" />
                            </EnhancedButton>
                            <EnhancedButton 
                              variant="ghost" 
                              size="icon-sm"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </EnhancedButton>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {item.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {item.completedDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-success" />
                            <span>Completed: {new Date(item.completedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {item.authority && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>Authority: {item.authority}</span>
                          </div>
                        )}
                        
                        {item.documents && item.documents.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{item.documents.length} documents</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Compliance Items</h3>
                <p className="text-muted-foreground mb-4">
                  Add compliance items to track regulatory requirements and approvals.
                </p>
                <EnhancedButton onClick={() => setShowComplianceModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Item
                </EnhancedButton>
              </div>
            )}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  );
};

export default ProjectCompliance;