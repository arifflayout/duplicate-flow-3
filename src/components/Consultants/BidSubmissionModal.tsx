import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { 
  FileText, 
  Upload, 
  X, 
  DollarSign, 
  Clock, 
  Calendar,
  Star,
  Award,
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface BidSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: any;
  project: any;
  onSubmit: (bidData: any) => void;
}

const BidSubmissionModal: React.FC<BidSubmissionModalProps> = ({
  isOpen,
  onClose,
  consultant,
  project,
  onSubmit
}) => {
  const { toast } = useToast();
  const [bidData, setBidData] = useState({
    amount: '',
    timeline: '',
    proposal: '',
    documents: [] as File[],
    serviceType: '',
    paymentStructure: '',
    urgency: 'normal',
    meetingPreference: 'virtual'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleInputChange = (field: string, value: any) => {
    setBidData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!bidData.amount) newErrors.amount = 'Budget amount is required';
    if (!bidData.timeline) newErrors.timeline = 'Timeline is required';
    if (!bidData.proposal) newErrors.proposal = 'Project details are required';
    if (!bidData.serviceType) newErrors.serviceType = 'Service type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Proposal Request Sent Successfully!",
      description: `Your request has been sent to ${consultant.name}. They will respond within 48 hours.`
    });

    onSubmit(bidData);
  };

  const estimatedFee = bidData.amount ? parseFloat(bidData.amount.replace(/[^0-9]/g, '')) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Request Proposal from Consultant</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Consultant Info Sidebar */}
          <div className="md:col-span-1">
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={consultant.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/10 to-info/10 text-primary">
                      {getInitials(consultant.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-foreground">{consultant.name}</h3>
                    <p className="text-sm text-muted-foreground">{consultant.company}</p>
                  </div>
                </div>
              </EnhancedCardHeader>
              
              <EnhancedCardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{consultant.rating}</span>
                  <span className="text-muted-foreground">({consultant.reviewCount} reviews)</span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Experience:</span>
                    <div className="font-semibold">{consultant.yearsExperience} years</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Projects Completed:</span>
                    <div className="font-semibold">{consultant.projectsCompleted}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Location:</span>
                    <div className="font-semibold">{consultant.location}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {consultant.specializations?.map((spec: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
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
                    Typically responds within 4-6 hours with detailed proposal
                  </p>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>

          {/* Request Form */}
          <div className="md:col-span-2 space-y-6">
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <h3 className="text-lg font-bold text-foreground">Project Requirements</h3>
                <p className="text-muted-foreground">Provide details to get an accurate proposal</p>
              </EnhancedCardHeader>
              
              <EnhancedCardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="font-semibold">Proposed Budget (RM) *</Label>
                    <EnhancedInput
                      id="amount"
                      placeholder="e.g., 50,000"
                      value={bidData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      icon={<DollarSign className="h-4 w-4" />}
                      error={errors.amount}
                      inputSize="lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline" className="font-semibold">Expected Timeline *</Label>
                    <Select value={bidData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4-6weeks">4-6 weeks</SelectItem>
                        <SelectItem value="6-8weeks">6-8 weeks</SelectItem>
                        <SelectItem value="8-12weeks">8-12 weeks</SelectItem>
                        <SelectItem value="3-4months">3-4 months</SelectItem>
                        <SelectItem value="4-6months">4-6 months</SelectItem>
                        <SelectItem value="6months+">6+ months</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.timeline && <p className="text-sm text-destructive">{errors.timeline}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType" className="font-semibold">Service Type Required *</Label>
                  <Select value={bidData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="architectural-design">Architectural Design</SelectItem>
                      <SelectItem value="structural-engineering">Structural Engineering</SelectItem>
                      <SelectItem value="mep-engineering">M&E Engineering</SelectItem>
                      <SelectItem value="quantity-surveying">Quantity Surveying</SelectItem>
                      <SelectItem value="project-management">Project Management</SelectItem>
                      <SelectItem value="full-consultation">Full Consultation Package</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposal" className="font-semibold">Project Details & Requirements *</Label>
                  <Textarea
                    id="proposal"
                    placeholder="Describe your project requirements, scope of work, specific needs, and any special considerations..."
                    rows={6}
                    value={bidData.proposal}
                    onChange={(e) => handleInputChange('proposal', e.target.value)}
                    className="resize-none"
                  />
                  {errors.proposal && <p className="text-sm text-destructive">{errors.proposal}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentStructure" className="font-semibold">Preferred Payment Structure</Label>
                    <Select value={bidData.paymentStructure} onValueChange={(value) => handleInputChange('paymentStructure', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select payment structure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lump-sum">Lump Sum</SelectItem>
                        <SelectItem value="milestone">Milestone-based</SelectItem>
                        <SelectItem value="percentage">Percentage of Project Value</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                        <SelectItem value="hybrid">Hybrid Structure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency" className="font-semibold">Project Urgency</Label>
                    <Select value={bidData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
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

                <div className="space-y-2">
                  <Label htmlFor="meetingPreference" className="font-semibold">Meeting Preference</Label>
                  <Select value={bidData.meetingPreference} onValueChange={(value) => handleInputChange('meetingPreference', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual Meeting (Zoom/Teams)</SelectItem>
                      <SelectItem value="site-visit">Site Visit</SelectItem>
                      <SelectItem value="office-meeting">Office Meeting</SelectItem>
                      <SelectItem value="phone-call">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {estimatedFee > 0 && (
                  <EnhancedCard className="bg-gradient-to-r from-success/10 to-info/10 border-success/20">
                    <EnhancedCardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <h4 className="font-semibold text-success">Budget Estimate</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Your Budget:</span>
                          <div className="font-bold text-foreground">{formatCurrency(estimatedFee)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Consultant Rate:</span>
                          <div className="font-bold text-foreground">RM {consultant.hourlyRate || 150}/hour</div>
                        </div>
                      </div>
                    </EnhancedCardContent>
                  </EnhancedCard>
                )}
              </EnhancedCardContent>
            </EnhancedCard>

            <div className="flex gap-4">
              <EnhancedButton variant="outline" onClick={onClose} className="flex-1">
                Cancel Request
              </EnhancedButton>
              <EnhancedButton variant="gradient" onClick={handleSubmit} className="flex-1 gap-2">
                <FileText className="h-4 w-4" />
                Send Proposal Request
              </EnhancedButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BidSubmissionModal;