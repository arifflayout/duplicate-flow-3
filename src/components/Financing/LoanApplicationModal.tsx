import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileUp, 
  Building2, 
  DollarSign, 
  Calendar, 
  Percent,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    loanType: '',
    amount: '',
    purpose: '',
    term: '',
    preferredRate: '',
    collateral: '',
    businessPlan: '',
    financialStatements: '',
    projectDetails: '',
    developerExperience: '',
    additionalDocuments: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const loanTypes = [
    { 
      value: 'development', 
      label: 'Development Loan', 
      description: 'For land development and construction',
      icon: Building2,
      features: ['Progressive disbursement', 'Interest during construction', 'Flexible terms']
    },
    { 
      value: 'bridging', 
      label: 'Bridging Loan', 
      description: 'Short-term financing between phases',
      icon: Calendar,
      features: ['Quick approval', 'Short term', 'Higher interest']
    },
    { 
      value: 'construction', 
      label: 'Construction Loan', 
      description: 'For building construction costs',
      icon: Building2,
      features: ['Stage-based release', 'Progress monitoring', 'Competitive rates']
    },
    { 
      value: 'end-financing', 
      label: 'End Financing', 
      description: 'Long-term financing upon completion',
      icon: CheckCircle,
      features: ['Long term', 'Lower rates', 'Stable payments']
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.loanType) newErrors.loanType = 'Loan type is required';
        if (!formData.amount) newErrors.amount = 'Loan amount is required';
        if (!formData.term) newErrors.term = 'Loan term is required';
        break;
      case 2:
        if (!formData.purpose) newErrors.purpose = 'Loan purpose is required';
        if (!formData.projectDetails) newErrors.projectDetails = 'Project details are required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: "Please complete required fields",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(2)) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Loan Application Submitted",
      description: "Your application has been submitted and will be reviewed within 3-5 business days.",
    });
    
    onSubmit(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Loan Type & Amount</h3>
              <p className="text-muted-foreground">Select the type of financing you need</p>
            </div>

            <div className="grid gap-4">
              {loanTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.loanType === type.value;
                
                return (
                  <EnhancedCard
                    key={type.value}
                    variant={isSelected ? "interactive" : "default"}
                    className={cn(
                      "cursor-pointer transition-all duration-300",
                      isSelected ? "ring-2 ring-primary bg-primary/5 shadow-lg" : "hover:shadow-md"
                    )}
                    onClick={() => handleInputChange('loanType', type.value)}
                  >
                    <EnhancedCardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                          isSelected 
                            ? "bg-gradient-to-br from-primary to-info text-white shadow-lg" 
                            : "bg-surface-100 text-muted-foreground"
                        )}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{type.label}</h4>
                            {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">{type.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {type.features.map((feature, index) => (
                              <span key={index} className="text-xs bg-surface-100 text-muted-foreground px-2 py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </EnhancedCardContent>
                  </EnhancedCard>
                );
              })}
            </div>
            {errors.loanType && <p className="text-sm text-destructive">{errors.loanType}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="font-semibold">Loan Amount (RM) *</Label>
                <EnhancedInput
                  id="amount"
                  placeholder="1,500,000"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  icon={<DollarSign className="h-4 w-4" />}
                  error={errors.amount}
                  inputSize="lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="term" className="font-semibold">Loan Term *</Label>
                <Select value={formData.term} onValueChange={(value) => handleInputChange('term', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                  </SelectContent>
                </Select>
                {errors.term && <p className="text-sm text-destructive">{errors.term}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredRate" className="font-semibold">Preferred Interest Rate (%)</Label>
              <EnhancedInput
                id="preferredRate"
                type="number"
                step="0.1"
                placeholder="4.5"
                value={formData.preferredRate}
                onChange={(e) => handleInputChange('preferredRate', e.target.value)}
                icon={<Percent className="h-4 w-4" />}
                inputSize="lg"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Project & Business Information</h3>
              <p className="text-muted-foreground">Provide details about your development project</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose" className="font-semibold">Loan Purpose *</Label>
              <Textarea
                id="purpose"
                placeholder="Describe how the loan will be used..."
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                rows={3}
                className="resize-none"
              />
              {errors.purpose && <p className="text-sm text-destructive">{errors.purpose}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDetails" className="font-semibold">Project Details *</Label>
              <Textarea
                id="projectDetails"
                placeholder="Provide comprehensive details about your development project..."
                value={formData.projectDetails}
                onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                rows={4}
                className="resize-none"
              />
              {errors.projectDetails && <p className="text-sm text-destructive">{errors.projectDetails}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="developerExperience" className="font-semibold">Developer Experience</Label>
              <Textarea
                id="developerExperience"
                placeholder="Describe your experience in property development..."
                value={formData.developerExperience}
                onChange={(e) => handleInputChange('developerExperience', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collateral" className="font-semibold">Collateral Details</Label>
              <Textarea
                id="collateral"
                placeholder="Describe the collateral you can provide..."
                value={formData.collateral}
                onChange={(e) => handleInputChange('collateral', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Required Documents</h3>
              <p className="text-muted-foreground">Upload supporting documents for your application</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="font-semibold">Business Plan</Label>
                <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                  <FileUp className="h-12 w-12 mx-auto text-primary mb-3" />
                  <p className="font-medium text-foreground mb-1">Upload Business Plan</p>
                  <p className="text-sm text-muted-foreground">PDF, DOC up to 10MB</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="font-semibold">Financial Statements</Label>
                <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                  <FileUp className="h-12 w-12 mx-auto text-primary mb-3" />
                  <p className="font-medium text-foreground mb-1">Upload Financial Statements</p>
                  <p className="text-sm text-muted-foreground">PDF, XLS up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Additional Documents</Label>
              <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <FileUp className="h-12 w-12 mx-auto text-primary mb-3" />
                <p className="font-medium text-foreground mb-1">Upload Additional Supporting Documents</p>
                <p className="text-sm text-muted-foreground">Land title, permits, approvals, etc.</p>
              </div>
            </div>

            <EnhancedCard className="bg-gradient-to-r from-warning/10 to-orange/10 border-warning/20">
              <EnhancedCardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-warning mb-2">Document Requirements</h4>
                    <ul className="text-sm text-warning/80 space-y-1">
                      <li>• All documents must be in PDF format</li>
                      <li>• File size should not exceed 10MB per document</li>
                      <li>• Ensure all documents are clearly readable</li>
                      <li>• Include all required signatures and stamps</li>
                    </ul>
                  </div>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { id: 1, title: 'Loan Details', description: 'Type and amount' },
    { id: 2, title: 'Project Info', description: 'Business details' },
    { id: 3, title: 'Documents', description: 'Supporting files' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-6 w-6 text-primary" />
            Loan Application
          </DialogTitle>
          <DialogDescription>
            Submit a comprehensive loan application for your development project
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  currentStep >= step.id 
                    ? "bg-gradient-to-br from-primary to-info text-white shadow-lg" 
                    : "bg-surface-100 text-muted-foreground"
                )}>
                  {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                </div>
                <div className="text-center mt-2">
                  <div className={cn(
                    "text-sm font-medium",
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-4 transition-all duration-300",
                  currentStep > step.id ? "bg-gradient-to-r from-primary to-info" : "bg-surface-200"
                )} />
              )}
            </div>
          ))}
        </div>

        <EnhancedCard variant="elevated">
          <EnhancedCardContent className="p-6">
            {renderStepContent()}
          </EnhancedCardContent>
        </EnhancedCard>

        <div className="flex justify-between">
          <EnhancedButton 
            variant="outline" 
            onClick={currentStep === 1 ? onClose : prevStep}
            className="gap-2"
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </EnhancedButton>
          
          <EnhancedButton 
            variant="gradient"
            onClick={currentStep === 3 ? handleSubmit : nextStep}
            className="gap-2"
          >
            {currentStep === 3 ? (
              <>
                <Upload className="h-4 w-4" />
                Submit Application
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </EnhancedButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanApplicationModal;