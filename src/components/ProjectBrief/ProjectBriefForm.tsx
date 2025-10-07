import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, ArrowRight, CheckCircle, Building, Home, Building2, MapPin, DollarSign, Clock, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '@/contexts/ProjectContext';
import type { ProjectBrief, ProjectType, UserType } from '@/types';

interface ProjectBriefFormProps {
  selectedLand?: {
    id: string;
    title: string;
    location: string;
    size: string;
    price: string;
    zoning: string;
  };
  onComplete: (projectBrief: ProjectBrief) => void;
  onBack: () => void;
}

const ProjectBriefForm: React.FC<ProjectBriefFormProps> = ({ 
  selectedLand, 
  onComplete, 
  onBack 
}) => {
  const { toast } = useToast();
  const { addProject } = useProject();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProjectBrief>>({
    landId: selectedLand?.id,
    projectName: '',
    projectType: undefined,
    userType: undefined,
    projectDescription: '',
    estimatedBudget: '',
    timelineStart: undefined,
    timelineCompletion: undefined,
    units: 1,
    features: [],
    financialDetails: {
      annualIncome: '',
      existingLoans: '',
      downPayment: '',
      creditScore: ''
    }
  });

  const steps = [
    { 
      id: 1, 
      title: 'Project Type', 
      description: 'Define your development type',
      icon: Building
    },
    { 
      id: 2, 
      title: 'Project Details', 
      description: 'Describe your vision',
      icon: Building2
    },
    { 
      id: 3, 
      title: 'Timeline & Budget', 
      description: 'Set your parameters',
      icon: Clock
    },
    { 
      id: 4, 
      title: 'Financial Information', 
      description: 'For loan calculation (if applicable)',
      icon: DollarSign
    },
    { 
      id: 5, 
      title: 'Review & Submit', 
      description: 'Confirm your project brief',
      icon: CheckCircle
    }
  ];

  const projectTypes: { 
    value: ProjectType; 
    label: string; 
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    features: string[];
  }[] = [
    { 
      value: 'residential', 
      label: 'Residential Development', 
      description: 'Single family homes, terraces, bungalows',
      icon: Home,
      features: ['Individual titles', 'Landed properties', 'Gated communities']
    },
    { 
      value: 'strata', 
      label: 'Strata Development', 
      description: 'Condominiums, apartments, mixed-use towers',
      icon: Building,
      features: ['Strata titles', 'Shared facilities', 'Management corporation']
    },
    { 
      value: 'commercial', 
      label: 'Commercial Development', 
      description: 'Offices, retail, industrial buildings',
      icon: Building2,
      features: ['Commercial zoning', 'Business facilities', 'Investment properties']
    }
  ];

  const userTypes: { 
    value: UserType; 
    label: string; 
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    benefits: string[];
  }[] = [
    { 
      value: 'developer', 
      label: 'Property Developer', 
      description: 'Building for sale/investment',
      icon: Users,
      benefits: ['Multiple projects', 'Investment focus', 'Sales-oriented']
    },
    { 
      value: 'individual', 
      label: 'Individual Self-Build', 
      description: 'Building for personal use',
      icon: User,
      benefits: ['Personal residence', 'Custom design', 'Financing assistance']
    }
  ];

  const availableFeatures = [
    { name: 'Swimming Pool', category: 'Recreation' },
    { name: 'Gymnasium', category: 'Recreation' },
    { name: 'Children\'s Playground', category: 'Recreation' },
    { name: 'Covered Parking', category: 'Parking' },
    { name: 'Security System', category: 'Security' },
    { name: 'Landscaped Gardens', category: 'Landscape' },
    { name: 'Clubhouse', category: 'Recreation' },
    { name: 'Retail Space', category: 'Commercial' },
    { name: 'Green Building Features', category: 'Sustainability' },
    { name: 'Smart Home Integration', category: 'Technology' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFinancialChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      financialDetails: {
        ...prev.financialDetails,
        [field]: value
      }
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }));
  };

  const calculateLTV = () => {
    if (!formData.financialDetails?.annualIncome || !formData.estimatedBudget) return null;
    
    const income = parseFloat(formData.financialDetails.annualIncome);
    const budget = parseFloat(formData.estimatedBudget);
    const downPayment = parseFloat(formData.financialDetails?.downPayment || '0');
    
    const loanAmount = budget - downPayment;
    const ltv = (loanAmount / budget) * 100;
    const dsr = (loanAmount * 0.05) / (income / 12); // Assuming 5% interest for calculation
    
    return { ltv: ltv.toFixed(1), dsr: dsr.toFixed(1), loanAmount, estimatedProjectValue: budget };
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.projectType && formData.userType;
      case 2:
        return formData.projectName && formData.projectDescription;
      case 3:
        return formData.estimatedBudget && formData.timelineStart && formData.timelineCompletion;
      case 4:
        return formData.userType === 'developer' || 
               (formData.financialDetails?.annualIncome && formData.financialDetails?.downPayment);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Please complete required fields",
        description: "All required information must be filled before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(4)) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create project in the new unified schema
    const newProject = addProject({
      title: formData.projectName!,
      description: formData.projectDescription!,
      location: selectedLand?.location || '',
      type: formData.projectType!,
      status: 'active',
      startDate: formData.timelineStart?.toISOString(),
      endDate: formData.timelineCompletion?.toISOString(),
      budget: parseFloat(formData.estimatedBudget!),
      participants: [],
      milestones: [],
      monitoring: [],
      compliance: []
    });

    // Create legacy project brief for backward compatibility
    const projectBrief: ProjectBrief = {
      id: newProject.id,
      landId: selectedLand?.id || '',
      projectName: formData.projectName!,
      projectType: formData.projectType!,
      userType: formData.userType!,
      projectDescription: formData.projectDescription!,
      estimatedBudget: formData.estimatedBudget!,
      timelineStart: formData.timelineStart!,
      timelineCompletion: formData.timelineCompletion!,
      units: formData.units || 1,
      features: formData.features || [],
      financialDetails: formData.financialDetails,
      createdAt: new Date().toISOString(),
      status: 'submitted'
    };

    toast({
      title: "Project Brief Created Successfully!",
      description: "Your project has been created and is ready for team collaboration."
    });

    onComplete(projectBrief);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">What type of project are you developing?</h2>
              <p className="text-muted-foreground">Choose the development type that best matches your vision</p>
            </div>

            <div className="grid gap-6">
              {projectTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.projectType === type.value;
                
                return (
                  <EnhancedCard 
                    key={type.value}
                    variant={isSelected ? "interactive" : "default"}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg",
                      isSelected ? "ring-2 ring-primary bg-primary/5 shadow-lg" : "hover:shadow-md"
                    )}
                    onClick={() => handleInputChange('projectType', type.value)}
                  >
                    <EnhancedCardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                          isSelected 
                            ? "bg-gradient-to-br from-primary to-info text-white shadow-lg" 
                            : "bg-surface-100 text-muted-foreground"
                        )}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground">{type.label}</h3>
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">{type.description}</p>
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

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">Are you a developer or building for yourself?</h3>
                <p className="text-muted-foreground">This helps us customize your experience</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.userType === type.value;
                  
                  return (
                    <EnhancedCard 
                      key={type.value}
                      variant={isSelected ? "interactive" : "default"}
                      className={cn(
                        "cursor-pointer transition-all duration-300",
                        isSelected ? "ring-2 ring-primary bg-primary/5 shadow-lg" : "hover:shadow-md"
                      )}
                      onClick={() => handleInputChange('userType', type.value)}
                    >
                      <EnhancedCardContent className="p-6 text-center">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300",
                          isSelected 
                            ? "bg-gradient-to-br from-primary to-info text-white shadow-lg" 
                            : "bg-surface-100 text-muted-foreground"
                        )}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-foreground">{type.label}</h3>
                          {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                        </div>
                        <p className="text-muted-foreground mb-3">{type.description}</p>
                        <div className="space-y-1">
                          {type.benefits.map((benefit, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              • {benefit}
                            </div>
                          ))}
                        </div>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Tell us about your project</h2>
              <p className="text-muted-foreground">Provide details to help consultants understand your vision</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="projectName" className="text-base font-semibold">Project Name *</Label>
                <EnhancedInput
                  id="projectName"
                  placeholder="e.g., Sunshine Residences Phase 1"
                  value={formData.projectName || ''}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  icon={<Building className="h-4 w-4" />}
                  inputSize="lg"
                />
                <p className="text-sm text-muted-foreground">Choose a memorable name for your development</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="projectDescription" className="text-base font-semibold">Project Description *</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe your project vision, target market, and key features..."
                  rows={5}
                  value={formData.projectDescription || ''}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">Help consultants understand your vision and requirements</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="units" className="text-base font-semibold">Number of Units</Label>
                  <EnhancedInput
                    id="units"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.units || ''}
                    onChange={(e) => handleInputChange('units', parseInt(e.target.value) || 1)}
                    icon={<Home className="h-4 w-4" />}
                    inputSize="lg"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Project Category</Label>
                  <div className="p-4 bg-surface-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {formData.projectType && (() => {
                        const selectedType = projectTypes.find(t => t.value === formData.projectType);
                        const Icon = selectedType?.icon || Building;
                        return (
                          <>
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">{selectedType?.label}</div>
                              <div className="text-sm text-muted-foreground">{selectedType?.description}</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Desired Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableFeatures.map((feature) => (
                    <div key={feature.name} className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-surface-50 transition-colors">
                        <Checkbox
                          id={feature.name}
                          checked={formData.features?.includes(feature.name) || false}
                          onCheckedChange={() => handleFeatureToggle(feature.name)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={feature.name} className="font-medium cursor-pointer">
                            {feature.name}
                          </Label>
                          <div className="text-xs text-muted-foreground">{feature.category}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Timeline & Budget Planning</h2>
              <p className="text-muted-foreground">Set realistic timelines and budget expectations</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="estimatedBudget" className="text-base font-semibold">Estimated Total Budget (RM) *</Label>
                <EnhancedInput
                  id="estimatedBudget"
                  placeholder="e.g., 2,500,000"
                  value={formData.estimatedBudget || ''}
                  onChange={(e) => handleInputChange('estimatedBudget', e.target.value)}
                  icon={<DollarSign className="h-4 w-4" />}
                  inputSize="lg"
                />
                <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                  <p className="text-sm text-info-foreground">
                    <strong>Include:</strong> Land cost, construction, professional fees, permits, and contingency (10-15%)
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Expected Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <EnhancedButton
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !formData.timelineStart && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4" />
                        {formData.timelineStart ? format(formData.timelineStart, "PPP") : "Select start date"}
                      </EnhancedButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.timelineStart}
                        onSelect={(date) => handleInputChange('timelineStart', date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Expected Completion Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <EnhancedButton
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !formData.timelineCompletion && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4" />
                        {formData.timelineCompletion ? format(formData.timelineCompletion, "PPP") : "Select completion date"}
                      </EnhancedButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.timelineCompletion}
                        onSelect={(date) => handleInputChange('timelineCompletion', date)}
                        disabled={(date) => date < new Date() || (formData.timelineStart && date <= formData.timelineStart)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {formData.timelineStart && formData.timelineCompletion && (
                <EnhancedCard variant="elevated" className="bg-gradient-to-r from-primary/5 to-info/5 border-primary/20">
                  <EnhancedCardContent className="p-6">
                    <h4 className="font-semibold text-primary mb-3">Project Timeline Summary</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-semibold">
                          {Math.ceil((formData.timelineCompletion.getTime() - formData.timelineStart.getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Start:</span>
                        <div className="font-semibold">{format(formData.timelineStart, "MMM yyyy")}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completion:</span>
                        <div className="font-semibold">{format(formData.timelineCompletion, "MMM yyyy")}</div>
                      </div>
                    </div>
                  </EnhancedCardContent>
                </EnhancedCard>
              )}
            </div>
          </div>
        );

      case 4:
        if (formData.userType === 'developer') {
          return (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-success to-info rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Financial Details Not Required</h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                As a property developer, you can proceed directly to the consultant marketplace.
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Financial Information</h2>
              <p className="text-muted-foreground">Help us calculate your financing options and loan eligibility</p>
            </div>

            <EnhancedCard variant="elevated" className="bg-gradient-to-r from-info/10 to-primary/10 border-info/20">
              <EnhancedCardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-info mb-2">Why do we need this information?</h3>
                    <p className="text-sm text-info/80">
                      This information helps calculate your Loan-to-Value (LTV) ratio and debt service ratio for financing options.
                      All information is kept confidential and used only for loan calculations.
                    </p>
                  </div>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="annualIncome" className="text-base font-semibold">Annual Income (RM) *</Label>
                <EnhancedInput
                  id="annualIncome"
                  placeholder="e.g., 120,000"
                  value={formData.financialDetails?.annualIncome || ''}
                  onChange={(e) => handleFinancialChange('annualIncome', e.target.value)}
                  icon={<DollarSign className="h-4 w-4" />}
                  inputSize="lg"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="downPayment" className="text-base font-semibold">Available Down Payment (RM) *</Label>
                <EnhancedInput
                  id="downPayment"
                  placeholder="e.g., 500,000"
                  value={formData.financialDetails?.downPayment || ''}
                  onChange={(e) => handleFinancialChange('downPayment', e.target.value)}
                  icon={<DollarSign className="h-4 w-4" />}
                  inputSize="lg"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="existingLoans" className="text-base font-semibold">Existing Monthly Loan Commitments (RM)</Label>
                <EnhancedInput
                  id="existingLoans"
                  placeholder="e.g., 3,000"
                  value={formData.financialDetails?.existingLoans || ''}
                  onChange={(e) => handleFinancialChange('existingLoans', e.target.value)}
                  icon={<DollarSign className="h-4 w-4" />}
                  inputSize="lg"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="creditScore" className="text-base font-semibold">Credit Score (Optional)</Label>
                <Select 
                  value={formData.financialDetails?.creditScore || ''} 
                  onValueChange={(value) => handleFinancialChange('creditScore', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select credit score range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent (750+)</SelectItem>
                    <SelectItem value="good">Good (650-749)</SelectItem>
                    <SelectItem value="fair">Fair (550-649)</SelectItem>
                    <SelectItem value="poor">Poor (Below 550)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.financialDetails?.annualIncome && formData.estimatedBudget && (
              <EnhancedCard variant="elevated" className="bg-gradient-to-r from-success/10 to-info/10 border-success/20">
                <EnhancedCardContent className="p-6">
                  <h3 className="font-semibold text-success mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Loan Calculation Estimate
                  </h3>
                  {(() => {
                    const calc = calculateLTV();
                    return calc ? (
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success">{calc.ltv}%</div>
                          <div className="text-sm text-muted-foreground">Loan-to-Value Ratio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success">{calc.dsr}%</div>
                          <div className="text-sm text-muted-foreground">Debt Service Ratio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success">RM {calc.loanAmount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Estimated Loan Amount</div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </EnhancedCardContent>
              </EnhancedCard>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Project Brief</h2>
              <p className="text-muted-foreground">Confirm all details before submitting to consultants</p>
            </div>

            <div className="space-y-6">
              <EnhancedCard variant="elevated">
                <EnhancedCardHeader>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">Selected Land</h3>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><span className="font-semibold">Property:</span> {selectedLand?.title}</div>
                    <div><span className="font-semibold">Location:</span> {selectedLand?.location}</div>
                    <div><span className="font-semibold">Size:</span> {selectedLand?.size}</div>
                    <div><span className="font-semibold">Zoning:</span> {selectedLand?.zoning}</div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>

              <EnhancedCard variant="elevated">
                <EnhancedCardHeader>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">Project Overview</h3>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><span className="font-semibold">Project Name:</span> {formData.projectName}</div>
                      <div><span className="font-semibold">Type:</span> {formData.projectType} ({formData.userType})</div>
                      <div><span className="font-semibold">Budget:</span> RM {parseFloat(formData.estimatedBudget || '0').toLocaleString()}</div>
                      <div><span className="font-semibold">Units:</span> {formData.units}</div>
                    </div>
                    
                    <div>
                      <span className="font-semibold">Timeline:</span> 
                      <span className="ml-2">
                        {formData.timelineStart ? format(formData.timelineStart, "PP") : ''} to {formData.timelineCompletion ? format(formData.timelineCompletion, "PP") : ''}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-semibold">Description:</span>
                      <p className="text-muted-foreground mt-1">{formData.projectDescription}</p>
                    </div>
                    
                    {formData.features && formData.features.length > 0 && (
                      <div>
                        <span className="font-semibold">Features:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.features.map((feature, index) => (
                            <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>

              <EnhancedCard variant="elevated" className="bg-gradient-to-r from-primary/10 to-info/10 border-primary/20">
                <EnhancedCardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-2">Next Steps</h3>
                      <p className="text-sm text-primary/80 mb-3">
                        After submitting your project brief, it will be posted to our consultant marketplace where qualified professionals can submit proposals for your project.
                      </p>
                      <ul className="text-sm text-primary/70 space-y-1">
                        <li>• Consultants will review your requirements</li>
                        <li>• You'll receive detailed proposals within 48-72 hours</li>
                        <li>• Compare and select the best consultants for your project</li>
                      </ul>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <EnhancedButton 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Land Selection
          </EnhancedButton>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Project Brief</h1>
              <p className="text-lg text-muted-foreground">
                Tell us about your development project to connect with the right consultants
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</div>
              <div className="text-2xl font-bold text-primary">{Math.round((currentStep / steps.length) * 100)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Steps */}
        <EnhancedCard variant="elevated" className="mb-8">
          <EnhancedCardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                        isCompleted 
                          ? "bg-gradient-to-br from-success to-info text-white shadow-lg" 
                          : isActive
                          ? "bg-gradient-to-br from-primary to-info text-white shadow-lg"
                          : "bg-surface-100 text-muted-foreground"
                      )}>
                        {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                      </div>
                      <div className="text-center mt-3">
                        <div className={cn(
                          "text-sm font-medium",
                          isActive ? "text-primary" : isCompleted ? "text-success" : "text-muted-foreground"
                        )}>
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground hidden md:block">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "flex-1 h-0.5 mx-4 transition-all duration-300",
                        currentStep > step.id ? "bg-gradient-to-r from-success to-info" : "bg-surface-200"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </EnhancedCardContent>
        </EnhancedCard>

        {/* Form Content */}
        <EnhancedCard variant="elevated">
          <EnhancedCardContent className="p-8">
            {renderStepContent()}
          </EnhancedCardContent>
        </EnhancedCard>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <EnhancedButton 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </EnhancedButton>
          
          <div className="flex space-x-3">
            {currentStep < steps.length ? (
              <EnhancedButton 
                variant="gradient" 
                onClick={nextStep}
                className="gap-2"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </EnhancedButton>
            ) : (
              <EnhancedButton 
                variant="gradient" 
                onClick={handleSubmit} 
                className="gap-2"
              >
                Submit Project Brief
                <CheckCircle className="h-4 w-4" />
              </EnhancedButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBriefForm;