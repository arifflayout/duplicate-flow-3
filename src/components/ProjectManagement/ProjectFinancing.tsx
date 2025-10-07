import React, { useState } from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart,
  Plus,
  Edit
} from 'lucide-react';
import { Project } from '@/types/project';
import { formatCurrency } from '@/utils/formatters';

interface ProjectFinancingProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const ProjectFinancing: React.FC<ProjectFinancingProps> = ({ project, onUpdate }) => {
  // Mock financial data
  const financialData = {
    totalBudget: project.budget || 0,
    approvedFunding: project.financing?.approvedAmount || 0,
    disbursed: Math.round((project.financing?.approvedAmount || 0) * 0.6),
    remaining: (project.financing?.approvedAmount || 0) - Math.round((project.financing?.approvedAmount || 0) * 0.6),
    ltv: project.ltv || 75,
    interestRate: project.financing?.interestRate || 4.5,
    monthlyPayment: Math.round(((project.financing?.approvedAmount || 0) * 0.045) / 12)
  };

  const budgetBreakdown = [
    { category: 'Land Acquisition', budgeted: financialData.totalBudget * 0.3, spent: financialData.totalBudget * 0.3 },
    { category: 'Construction', budgeted: financialData.totalBudget * 0.5, spent: financialData.totalBudget * 0.2 },
    { category: 'Professional Fees', budgeted: financialData.totalBudget * 0.1, spent: financialData.totalBudget * 0.08 },
    { category: 'Permits & Approvals', budgeted: financialData.totalBudget * 0.05, spent: financialData.totalBudget * 0.04 },
    { category: 'Contingency', budgeted: financialData.totalBudget * 0.05, spent: 0 }
  ];

  const paymentSchedule = [
    { 
      id: '1', 
      description: 'Development Loan Disbursement', 
      amount: 500000, 
      date: '2024-03-15', 
      status: 'completed',
      type: 'inflow'
    },
    { 
      id: '2', 
      description: 'Construction Progress Payment', 
      amount: 280000, 
      date: '2024-03-25', 
      status: 'pending',
      type: 'outflow'
    },
    { 
      id: '3', 
      description: 'Loan Interest Payment', 
      amount: 18750, 
      date: '2024-04-01', 
      status: 'upcoming',
      type: 'outflow'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'upcoming': return 'info';
      case 'overdue': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Project Financing</h2>
        <div className="flex gap-2">
          <EnhancedButton variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Budget
          </EnhancedButton>
          <EnhancedButton className="gap-2">
            <Plus className="h-4 w-4" />
            Apply for Loan
          </EnhancedButton>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedCard variant="metric">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Budget</h3>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {formatCurrency(financialData.totalBudget)}
          </div>
          <div className="text-sm text-muted-foreground">Project budget</div>
        </EnhancedCard>

        <EnhancedCard variant="metric">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Approved Funding</h3>
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <div className="text-3xl font-bold text-success">
            {formatCurrency(financialData.approvedFunding)}
          </div>
          <div className="text-sm text-muted-foreground">
            {financialData.totalBudget > 0 ? 
              Math.round((financialData.approvedFunding / financialData.totalBudget) * 100) : 0
            }% of budget
          </div>
        </EnhancedCard>

        <EnhancedCard variant="metric">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">LTV Ratio</h3>
            <TrendingUp className="h-5 w-5 text-info" />
          </div>
          <div className="text-3xl font-bold text-info">{financialData.ltv}%</div>
          <div className="text-sm text-muted-foreground">Loan-to-value</div>
        </EnhancedCard>

        <EnhancedCard variant="metric">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Interest Rate</h3>
            <TrendingDown className="h-5 w-5 text-warning" />
          </div>
          <div className="text-3xl font-bold text-warning">{financialData.interestRate}%</div>
          <div className="text-sm text-muted-foreground">Per annum</div>
        </EnhancedCard>
      </div>

      {/* Budget Breakdown */}
      <EnhancedCard variant="elevated">
        <EnhancedCardHeader>
          <div className="flex items-center gap-3">
            <PieChart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Budget Breakdown</h3>
          </div>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-4">
            {budgetBreakdown.map((item, index) => {
              const spentPercentage = item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
              const isOverBudget = item.spent > item.budgeted;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({Math.round((item.budgeted / financialData.totalBudget) * 100)}% of total)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(item.spent)} / {formatCurrency(item.budgeted)}
                      </div>
                      <div className={`text-sm ${isOverBudget ? 'text-error' : 'text-success'}`}>
                        {spentPercentage.toFixed(1)}% spent
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(spentPercentage, 100)} 
                    className={`h-2 ${isOverBudget ? '[&>div]:bg-error' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Payment Schedule */}
      <EnhancedCard variant="elevated">
        <EnhancedCardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Payment Schedule</h3>
            <EnhancedButton variant="outline" size="sm">
              View All Payments
            </EnhancedButton>
          </div>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-3">
            {paymentSchedule.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payment.type === 'inflow' ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    {payment.type === 'inflow' ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-warning" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{payment.description}</h4>
                    <p className="text-sm text-muted-foreground">Due: {payment.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold">
                      {payment.type === 'inflow' ? '+' : '-'}{formatCurrency(payment.amount)}
                    </div>
                    <EnhancedBadge variant={getStatusColor(payment.status)} size="sm">
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </EnhancedBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Financing Status */}
      {project.financing && (
        <EnhancedCard variant="elevated">
          <EnhancedCardHeader>
            <h3 className="text-lg font-bold text-foreground">Loan Details</h3>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-muted-foreground">Loan Status</h4>
                <EnhancedBadge variant={getStatusColor(project.financing.status)} className="mt-1">
                  {project.financing.status.charAt(0).toUpperCase() + project.financing.status.slice(1)}
                </EnhancedBadge>
              </div>
              
              {project.financing.lender && (
                <div>
                  <h4 className="font-medium text-muted-foreground">Lender</h4>
                  <p className="font-semibold">{project.financing.lender}</p>
                </div>
              )}
              
              {project.financing.term && (
                <div>
                  <h4 className="font-medium text-muted-foreground">Loan Term</h4>
                  <p className="font-semibold">{project.financing.term} months</p>
                </div>
              )}
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      )}
    </div>
  );
};

export default ProjectFinancing;