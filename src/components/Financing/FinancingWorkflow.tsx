import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, FileText, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, Building2, Calculator, TrendingUp } from 'lucide-react';

interface FinancingOption {
  id: string;
  lenderName: string;
  loanType: string;
  interestRate: number;
  maxAmount: number;
  term: number;
  processingTime: string;
  requirements: string[];
  status: 'available' | 'pending' | 'approved' | 'rejected';
}

interface FinancingWorkflowProps {
  projectId?: string;
  projectValue?: number;
}

export const FinancingWorkflow: React.FC<FinancingWorkflowProps> = ({
  projectId,
  projectValue = 0
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const financingOptions: FinancingOption[] = [
    {
      id: '1',
      lenderName: 'First National Bank',
      loanType: 'Construction Loan',
      interestRate: 6.5,
      maxAmount: 5000000,
      term: 24,
      processingTime: '14-21 days',
      requirements: ['Credit Score 680+', 'Down Payment 20%', 'Construction Experience'],
      status: 'available'
    },
    {
      id: '2',
      lenderName: 'Development Finance Corp',
      loanType: 'Bridge Financing',
      interestRate: 8.2,
      maxAmount: 3000000,
      term: 12,
      processingTime: '7-10 days',
      requirements: ['Asset Collateral', 'Exit Strategy', 'Project Timeline'],
      status: 'available'
    },
    {
      id: '3',
      lenderName: 'Green Building Lenders',
      loanType: 'Sustainable Construction',
      interestRate: 5.8,
      maxAmount: 4000000,
      term: 30,
      processingTime: '21-30 days',
      requirements: ['LEED Certification', 'Environmental Impact Study', 'Green Building Plan'],
      status: 'pending'
    }
  ];

  const workflowSteps = [
    { id: 1, title: 'Financing Assessment', description: 'Evaluate project financing needs' },
    { id: 2, title: 'Lender Selection', description: 'Choose from available financing options' },
    { id: 3, title: 'Application Submission', description: 'Submit loan application and documents' },
    { id: 4, title: 'Review & Approval', description: 'Lender review and approval process' },
    { id: 5, title: 'Funding', description: 'Receive approved financing' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplyForFinancing = (optionId: string) => {
    setSelectedOption(optionId);
    setActiveStep(3);
    // Here you would typically navigate to the application form
    window.dispatchEvent(new CustomEvent('app:navigateView', { 
      detail: 'loan-application',
      bubbles: true 
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Financing</h1>
          <p className="text-gray-600 mt-1">
            Secure funding for your construction project
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Project Value</p>
            <p className="text-2xl font-bold text-gray-900">
              ${projectValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Financing Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${activeStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {step.id}
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className={`
                    w-16 h-1 mx-2
                    ${activeStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-medium text-gray-900">
              {workflowSteps[activeStep - 1]?.title}
            </h3>
            <p className="text-sm text-gray-500">
              {workflowSteps[activeStep - 1]?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="options" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="options">Financing Options</TabsTrigger>
          <TabsTrigger value="calculator">Loan Calculator</TabsTrigger>
          <TabsTrigger value="documents">Required Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="options" className="space-y-4">
          <div className="grid gap-4">
            {financingOptions.map((option) => (
              <Card key={option.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{option.lenderName}</CardTitle>
                        <CardDescription>{option.loanType}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(option.status)}
                      <Badge className={getStatusColor(option.status)}>
                        {option.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="font-semibold">{option.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Max Amount</p>
                      <p className="font-semibold">${(option.maxAmount / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Term</p>
                      <p className="font-semibold">{option.term} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Processing Time</p>
                      <p className="font-semibold">{option.processingTime}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Requirements:</p>
                    <div className="flex flex-wrap gap-2">
                      {option.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleApplyForFinancing(option.id)}
                      disabled={option.status !== 'available'}
                      className="flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Loan Calculator
              </CardTitle>
              <CardDescription>
                Calculate your monthly payments and total interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Loan calculator coming soon</p>
                <p className="text-sm text-gray-400 mt-2">
                  Calculate payments, interest rates, and amortization schedules
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Required Documents
              </CardTitle>
              <CardDescription>
                Documents typically required for construction financing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {[
                  'Project Plans and Specifications',
                  'Construction Budget and Timeline',
                  'Contractor Agreements',
                  'Property Appraisal',
                  'Financial Statements',
                  'Credit Reports',
                  'Insurance Documentation',
                  'Environmental Reports'
                ].map((doc, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{doc}</span>
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

export default FinancingWorkflow;