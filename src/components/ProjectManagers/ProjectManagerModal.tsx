import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, FileText, DollarSign, Clock, AlertCircle, Users, Award, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectManager {
  id: string;
  name: string;
  company: string;
  rating: number;
  dailyRate: number;
  specialties: string[];
  experience: number;
  projectsManaged: number;
  successRate: number;
  certifications: string[];
}

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  manager: ProjectManager;
  onSubmit: () => void;
  mode: 'engagement' | 'application';
}

const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  manager,
  onSubmit,
  mode
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    projectType: '',
    projectValue: '',
    timeline: '',
    startDate: '',
    projectDescription: '',
    managementScope: '',
    teamRequirements: '',
    specialRequirements: '',
    budgetForPM: '',
    paymentStructure: 'monthly',
    urgency: 'normal'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = mode === 'engagement' 
      ? ['projectType', 'projectValue', 'timeline', 'projectDescription', 'budgetForPM']
      : ['projectType', 'projectValue', 'timeline', 'projectDescription'];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const actionText = mode === 'engagement' ? 'Engagement proposal' : 'Application';
    toast({
      title: `${actionText} Submitted`,
      description: `Your ${actionText.toLowerCase()} has been sent to ${manager.name}. They will respond within 24 hours.`,
    });
    
    onSubmit();
  };

  const estimatedProjectCost = formData.projectValue ? 
    parseInt(formData.projectValue.replace(/[^0-9]/g, '')) : 0;

  const estimatedPMCost = Math.round(estimatedProjectCost * 0.08); // Typical PM cost is 5-10% of project value

  const modalTitle = mode === 'engagement' 
    ? `Engage ${manager.name} for Project Management`
    : `Apply for Project Management Position`;

  const modalDescription = mode === 'engagement'
    ? `Provide project details to engage ${manager.company} for professional project management services`
    : `Submit your application and project management proposal`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Manager Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{manager.company}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <span>★ {manager.rating}</span>
                    <span>•</span>
                    <span>₦{manager.dailyRate.toLocaleString()}/day</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Experience:</span>
                    <p className="text-muted-foreground">{manager.experience} years</p>
                  </div>
                  <div>
                    <span className="font-semibold">Success Rate:</span>
                    <p className="text-muted-foreground">{manager.successRate}%</p>
                  </div>
                  <div>
                    <span className="font-semibold">Projects:</span>
                    <p className="text-muted-foreground">{manager.projectsManaged} managed</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {manager.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Certifications</h4>
                  <div className="space-y-1">
                    {manager.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Award className="h-3 w-3 text-blue-600" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Response Time</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Typically responds within 2-4 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type *</Label>
                  <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential-complex">Residential Complex</SelectItem>
                      <SelectItem value="commercial-building">Commercial Building</SelectItem>
                      <SelectItem value="mixed-use">Mixed-Use Development</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure Project</SelectItem>
                      <SelectItem value="industrial-facility">Industrial Facility</SelectItem>
                      <SelectItem value="hospitality">Hospitality Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectValue">Total Project Value *</Label>
                  <Input
                    id="projectValue"
                    placeholder="₦150,000,000"
                    value={formData.projectValue}
                    onChange={(e) => handleInputChange('projectValue', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeline">Project Timeline *</Label>
                  <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6-12months">6-12 months</SelectItem>
                      <SelectItem value="12-18months">12-18 months</SelectItem>
                      <SelectItem value="18-24months">18-24 months</SelectItem>
                      <SelectItem value="24-36months">24-36 months</SelectItem>
                      <SelectItem value="36months+">36+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Project Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description *</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe your project in detail, including scope, size, complexity, and key objectives..."
                  rows={4}
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="managementScope">Management Scope & Responsibilities</Label>
                <Textarea
                  id="managementScope"
                  placeholder="Define the specific management responsibilities, oversight areas, and deliverables expected..."
                  rows={3}
                  value={formData.managementScope}
                  onChange={(e) => handleInputChange('managementScope', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamRequirements">Team Requirements</Label>
                  <Textarea
                    id="teamRequirements"
                    placeholder="Specify team size, roles, and any specific expertise needed..."
                    rows={3}
                    value={formData.teamRequirements}
                    onChange={(e) => handleInputChange('teamRequirements', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Any specific certifications, compliance requirements, or special considerations..."
                    rows={3}
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  />
                </div>
              </div>

              {mode === 'engagement' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetForPM">Project Management Budget *</Label>
                    <Input
                      id="budgetForPM"
                      placeholder="₦12,000,000"
                      value={formData.budgetForPM}
                      onChange={(e) => handleInputChange('budgetForPM', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentStructure">Payment Structure</Label>
                    <Select value={formData.paymentStructure} onValueChange={(value) => handleInputChange('paymentStructure', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly payments</SelectItem>
                        <SelectItem value="milestone">Milestone-based</SelectItem>
                        <SelectItem value="phase">Phase-based</SelectItem>
                        <SelectItem value="retainer">Retainer + performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="urgency">Project Urgency</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Flexible timeline</SelectItem>
                    <SelectItem value="normal">Normal - Standard timeline</SelectItem>
                    <SelectItem value="high">High - Need to start soon</SelectItem>
                    <SelectItem value="urgent">Urgent - Immediate start</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {estimatedProjectCost > 0 && mode === 'engagement' && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Estimated Management Costs</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Daily rate estimate:</span>
                        <p className="font-semibold">₦{manager.dailyRate.toLocaleString()}/day</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Typical PM cost (8%):</span>
                        <p className="font-semibold">₦{estimatedPMCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success rate:</span>
                        <p className="font-semibold text-green-600">{manager.successRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {mode === 'engagement' ? 'Send Engagement Proposal' : 'Submit Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectManagerModal;