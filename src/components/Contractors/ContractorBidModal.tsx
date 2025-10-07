import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  FileText, 
  DollarSign, 
  Clock, 
  AlertCircle,
  Star,
  Award,
  CheckCircle,
  Building,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contractor {
  id: string;
  name: string;
  company: string;
  rating: number;
  hourlyRate: number;
  specialties: string[];
  experience?: number;
  projectsCompleted?: number;
}

interface ContractorBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractor: Contractor;
  onSubmit: () => void;
}

const ContractorBidModal: React.FC<ContractorBidModalProps> = ({
  isOpen,
  onClose,
  contractor,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    projectType: '',
    totalBudget: '',
    timeline: '',
    startDate: '',
    description: '',
    specialRequirements: '',
    paymentTerms: 'milestone',
    urgency: 'normal',
    siteLocation: '',
    projectSize: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.projectType) newErrors.projectType = 'Project type is required';
    if (!formData.totalBudget) newErrors.totalBudget = 'Budget is required';
    if (!formData.timeline) newErrors.timeline = 'Timeline is required';
    if (!formData.description) newErrors.description = 'Project description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Quote Request Sent",
      description: `Your request has been sent to ${contractor.name}. They will respond within 24 hours.`,
    });
    
    onSubmit();
  };

  const estimatedCost = formData.totalBudget ? 
    parseInt(formData.totalBudget.replace(/[^0-9]/g, '')) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Request Quote from {contractor.name}</DialogTitle>
          <DialogDescription>
            Provide project details to get an accurate quote from {contractor.company}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Contractor Info Sidebar */}
          <div className="md:col-span-1">
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-info/10 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{contractor.company}</h3>
                    <p className="text-sm text-muted-foreground">{contractor.name}</p>
                  </div>
                </div>
              </EnhancedCardHeader>
              
              <EnhancedCardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{contractor.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Hourly Rate:</span>
                    <div className="font-bold text-foreground">RM {contractor.hourlyRate}/hour</div>
                  </div>
                  {contractor.experience && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Experience:</span>
                      <div className="font-semibold">{contractor.experience} years</div>
                    </div>
                  )}
                  {contractor.projectsCompleted && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Projects:</span>
                      <div className="font-semibold">{contractor.projectsCompleted} completed</div>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {contractor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-info/10 to-primary/10 p-4 rounded-lg border border-info/20">
                  <div className="flex items-center gap-2 text-info mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium text-sm">Response Time</span>
                  </div>
                  <p className="text-sm text-info/80">
                    Typically responds within 4-6 hours
                  </p>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>

          {/* Quote Request Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <EnhancedCard variant="elevated">
                <EnhancedCardHeader>
                  <h3 className="text-lg font-bold text-foreground">Project Information</h3>
                </EnhancedCardHeader>
                
                <EnhancedCardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectType" className="font-semibold">Project Type *</Label>
                      <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential-new">New Residential Construction</SelectItem>
                          <SelectItem value="residential-renovation">Residential Renovation</SelectItem>
                          <SelectItem value="commercial-new">New Commercial Building</SelectItem>
                          <SelectItem value="commercial-renovation">Commercial Renovation</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure Project</SelectItem>
                          <SelectItem value="industrial">Industrial Construction</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.projectType && <p className="text-sm text-destructive">{errors.projectType}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalBudget" className="font-semibold">Total Budget *</Label>
                      <EnhancedInput
                        id="totalBudget"
                        placeholder="RM 25,000,000"
                        value={formData.totalBudget}
                        onChange={(e) => handleInputChange('totalBudget', e.target.value)}
                        icon={<DollarSign className="h-4 w-4" />}
                        error={errors.totalBudget}
                        inputSize="lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeline" className="font-semibold">Project Timeline *</Label>
                      <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3months">1-3 months</SelectItem>
                          <SelectItem value="3-6months">3-6 months</SelectItem>
                          <SelectItem value="6-12months">6-12 months</SelectItem>
                          <SelectItem value="12-18months">12-18 months</SelectItem>
                          <SelectItem value="18months+">18+ months</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.timeline && <p className="text-sm text-destructive">{errors.timeline}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="font-semibold">Preferred Start Date</Label>
                      <EnhancedInput
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        icon={<Calendar className="h-4 w-4" />}
                        inputSize="lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-semibold">Project Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project in detail, including size, specifications, and any special requirements..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="resize-none"
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements" className="font-semibold">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      placeholder="Any specific materials, techniques, certifications, or compliance requirements..."
                      rows={3}
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms" className="font-semibold">Payment Terms</Label>
                      <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="milestone">Milestone-based</SelectItem>
                          <SelectItem value="monthly">Monthly payments</SelectItem>
                          <SelectItem value="completion">Payment on completion</SelectItem>
                          <SelectItem value="custom">Custom terms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgency" className="font-semibold">Project Urgency</Label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Flexible timeline</SelectItem>
                          <SelectItem value="normal">Normal - Standard timeline</SelectItem>
                          <SelectItem value="high">High - Need to start soon</SelectItem>
                          <SelectItem value="urgent">Urgent - ASAP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {estimatedCost > 0 && (
                    <EnhancedCard className="bg-gradient-to-r from-success/10 to-info/10 border-success/20">
                      <EnhancedCardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <h4 className="font-semibold text-success">Estimated Quote Range</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Based on hourly rate:</span>
                            <div className="font-bold text-foreground">
                              RM {(estimatedCost * 0.8).toLocaleString()} - RM {(estimatedCost * 1.2).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Timeline estimate:</span>
                            <div className="font-bold text-foreground">
                              {Math.ceil(estimatedCost / (contractor.hourlyRate * 40))} weeks
                            </div>
                          </div>
                        </div>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  )}
                </EnhancedCardContent>
              </EnhancedCard>
            </form>
          </div>
        </div>

        <DialogFooter>
          <EnhancedButton variant="outline" onClick={onClose}>
            Cancel
          </EnhancedButton>
          <EnhancedButton variant="gradient" onClick={handleSubmit} className="gap-2">
            <FileText className="h-4 w-4" />
            Send Quote Request
          </EnhancedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractorBidModal;