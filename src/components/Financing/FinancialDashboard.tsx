import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart,
  BarChart3
} from 'lucide-react';

interface FinancialDashboardProps {
  projectId: string;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ projectId }) => {
  // Mock financial data
  const budgetBreakdown = {
    landAcquisition: { budgeted: 800000, spent: 800000, percentage: 32 },
    construction: { budgeted: 1200000, spent: 450000, percentage: 48 },
    permits: { budgeted: 150000, spent: 120000, percentage: 6 },
    professional: { budgeted: 200000, spent: 180000, percentage: 8 },
    contingency: { budgeted: 150000, spent: 25000, percentage: 6 }
  };

  const cashFlow = [
    { month: 'Jan 2024', inflow: 500000, outflow: 200000, net: 300000 },
    { month: 'Feb 2024', inflow: 300000, outflow: 450000, net: -150000 },
    { month: 'Mar 2024', inflow: 800000, outflow: 380000, net: 420000 },
    { month: 'Apr 2024', inflow: 200000, outflow: 520000, net: -320000 },
    { month: 'May 2024', inflow: 600000, outflow: 290000, net: 310000 }
  ];

  const paymentSchedule = [
    { 
      id: '1', 
      description: 'Construction Loan Installment', 
      amount: 125000, 
      dueDate: '2024-03-15', 
      status: 'paid',
      type: 'loan'
    },
    { 
      id: '2', 
      description: 'Contractor Progress Payment', 
      amount: 280000, 
      dueDate: '2024-03-25', 
      status: 'pending',
      type: 'expense'
    },
    { 
      id: '3', 
      description: 'Development Loan Interest', 
      amount: 18750, 
      dueDate: '2024-04-01', 
      status: 'upcoming',
      type: 'loan'
    },
    { 
      id: '4', 
      description: 'Professional Fees', 
      amount: 45000, 
      dueDate: '2024-04-10', 
      status: 'upcoming',
      type: 'expense'
    }
  ];

  const totalBudget = Object.values(budgetBreakdown).reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = Object.values(budgetBreakdown).reduce((sum, item) => sum + item.spent, 0);
  const spentPercentage = (totalSpent / totalBudget) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Financial Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive financial overview and budget tracking</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Project budget allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent to Date</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{spentPercentage.toFixed(1)}% of budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {(totalBudget - totalSpent).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{(100 - spentPercentage).toFixed(1)}% remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM 287K</div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Budget Breakdown
          </CardTitle>
          <CardDescription>Category-wise budget allocation and spending</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(budgetBreakdown).map(([category, data]) => {
            const spentPercentage = (data.spent / data.budgeted) * 100;
            const isOverBudget = data.spent > data.budgeted;
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({data.percentage}% of total)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      RM {data.spent.toLocaleString()} / RM {data.budgeted.toLocaleString()}
                    </div>
                    <div className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      {spentPercentage.toFixed(1)}% spent
                    </div>
                  </div>
                </div>
                <Progress 
                  value={Math.min(spentPercentage, 100)} 
                  className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : ''}`}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Cash Flow & Payment Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cash Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Cash Flow</CardTitle>
            <CardDescription>Monthly inflow and outflow summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cashFlow.map((flow) => (
                <div key={flow.month} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{flow.month}</div>
                    <div className="text-sm text-muted-foreground">
                      In: RM {flow.inflow.toLocaleString()} | Out: RM {flow.outflow.toLocaleString()}
                    </div>
                  </div>
                  <div className={`font-bold ${flow.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {flow.net >= 0 ? '+' : ''}RM {flow.net.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Scheduled payments and obligations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentSchedule.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{payment.description}</div>
                    <div className="text-sm text-muted-foreground">Due: {payment.dueDate}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-bold">RM {payment.amount.toLocaleString()}</div>
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Payments
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;