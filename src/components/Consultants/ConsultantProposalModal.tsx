import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Upload, 
  Calendar, 
  DollarSign, 
  Clock,
  Star,
  Award,
  Building
} from 'lucide-react';
import { ConsultantProfile, ConsultantDiscipline, ProjectType } from '@/types/consultant';
import { getDisciplineById } from '@/data/consultantDisciplines';
import { formatCurrency } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';

interface ConsultantProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: ConsultantProfile;
  discipline: ConsultantDiscipline;
  projectType: ProjectType;
  projectBudget: number;
  onProposalRequested: () => void;
}

const ConsultantProposalModal: React.FC<ConsultantProposalModalProps> = ({
  isOpen,
  onClose,
  consultant,
  discipline,
  projectType,
  projectBudget,
  onProposalRequested
}) => {
  const { toast } = useToast();
  const [requestData, setRequestData] = useState({
    projectDescription: '',
    specificRequirements: '',
    timeline: '',
    budgetRange: '',
    preferredFeeStructure: '',
    urgency: 'normal',
    additionalServices: [] as string[],
    meetingPreference: 'virtual'
  });

  const disciplineInfo = getDisciplineById(discipline);

  const handleInputChange = (field: string, value: any) => {
    setRequestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (service: string) => {
    setRequestData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter(s => s !== service)
        : [...prev.additionalServices, service]
    }));
  };

  const handleSubmit = () => {
    if (!requestData.projectDescription || !requestData.timeline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Proposal Request Sent",
      description: `Your request has been sent to ${consultant.name}. They will respond within 48 hours with a detailed proposal.`,
    });

    onProposalRequested();
  };

  const estimatedFee = () => {
    if (consultant.feeStructure === 'percentage') {
      const avgPercentage = (consultant.typicalFeeRange.min + consultant.typicalFeeRange.max) / 2;
      return (projectBudget * avgPercentage) / 100;
    }
    return consultant.typicalFeeRange.max * 10000; // Mock lump sum
  };

  const additionalServices = [
    'Site Supervision',
    'Project Management',
    'Tender Documentation',
    'Contract Administration',
    'Post-Construction Services',
    'Sustainability Consulting',
    'BIM Modeling',
    'Value Engineering'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{disciplineInfo?.icon}</span>
            Request Proposal - {disciplineInfo?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Consultant Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={consultant.avatar} />
                  <AvatarFallback>
                    {consultant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{consultant.name}</h3>
                  <p className="text-sm text-muted-foreground">{consultant.company}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{consultant.rating}</span>
                <span className="text-muted-foreground">({consultant.reviewCount})</span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Experience:</span>
                  <span className="ml-2">{consultant.yearsExperience} years</span>
                </div>
                <div>
                  <span className="font-medium">Projects:</span>
                  <span className="ml-2">{consultant.projectsCompleted} completed</span>
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{consultant.location}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-1">
                  {consultant.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Certifications</h4>
                <div className="space-y-1">
                  {consultant.certifications.slice(0, 3).map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <Award className="h-3 w-3 text-blue-600" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Estimated Fee Range</h4>
                <p className="text-lg font-bold">
                  {consultant.feeStructure === 'percentage' 
                    ? `${consultant.typicalFeeRange.min}-${consultant.typicalFeeRange.max}%`
                    : formatCurrency(estimatedFee())
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  {consultant.feeStructure === 'percentage' ? 'of project value' : 'estimated total'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Request Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="projectDescription">Project Description *</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Describe your project in detail..."
                    value={requestData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="specificRequirements">Specific Requirements</Label>
                  <Textarea
                    id="specificRequirements"
                    placeholder="Any specific requirements for this discipline..."
                    value={requestData.specificRequirements}
                    onChange={(e) => handleInputChange('specificRequirements', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeline">Expected Timeline *</Label>
                    <Select value={requestData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                      <SelectTrigger>
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
                  </div>

                  <div>
                    <Label htmlFor="budgetRange">Budget Range</Label>
                    <Input
                      id="budgetRange"
                      placeholder="e.g., RM 50,000 - 100,000"
                      value={requestData.budgetRange}
                      onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredFeeStructure">Preferred Fee Structure</Label>
                    <Select value={requestData.preferredFeeStructure} onValueChange={(value) => handleInputChange('preferredFeeStructure', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select structure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lump-sum">Lump Sum</SelectItem>
                        <SelectItem value="percentage">Percentage of Project Value</SelectItem>
                        <SelectItem value="staged">Staged Payments</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Fixed + Performance)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="urgency">Project Urgency</Label>
                    <Select value={requestData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                      <SelectTrigger>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {additionalServices.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={service}
                        checked={requestData.additionalServices.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={service} className="text-sm">{service}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meeting Preference</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={requestData.meetingPreference} onValueChange={(value) => handleInputChange('meetingPreference', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual Meeting (Zoom/Teams)</SelectItem>
                    <SelectItem value="site-visit">Site Visit</SelectItem>
                    <SelectItem value="office-meeting">Office Meeting</SelectItem>
                    <SelectItem value="phone-call">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Send Proposal Request
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultantProposalModal;