import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { ApprovalStatus } from '@/types';

interface ApprovalItem {
  id: string;
  name: string;
  status: ApprovalStatus;
  submittedDate?: Date;
  approvalDate?: Date;
  estimatedDays: number;
  authority: string;
}

interface ApprovalTimelineViewProps {
  approvals: ApprovalItem[];
}

const ApprovalTimelineView: React.FC<ApprovalTimelineViewProps> = ({ approvals }) => {
  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-200';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-200';
      case 'rejected':
        return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200';
    }
  };

  const getConnectorColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-400';
    }
  };

  const calculateProjectedDate = (approval: ApprovalItem) => {
    if (approval.approvalDate) return approval.approvalDate;
    if (approval.submittedDate) {
      const projected = new Date(approval.submittedDate);
      projected.setDate(projected.getDate() + approval.estimatedDays);
      return projected;
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Approval Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-6">
            {approvals.map((approval, index) => {
              const projectedDate = calculateProjectedDate(approval);
              const isLast = index === approvals.length - 1;
              
              return (
                <div key={approval.id} className="relative flex items-start gap-4">
                  {/* Timeline node */}
                  <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 bg-background ${getStatusColor(approval.status)}`}>
                    {getStatusIcon(approval.status)}
                  </div>
                  
                  {/* Connector line to next item */}
                  {!isLast && (
                    <div className={`absolute left-8 top-16 w-0.5 h-6 ${getConnectorColor(approval.status)}`}></div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{approval.name}</h3>
                      <Badge className={getStatusColor(approval.status)}>
                        {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      Authority: {approval.authority}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {approval.submittedDate && (
                        <div>
                          <span className="font-medium">Submitted:</span> {approval.submittedDate.toLocaleDateString()}
                        </div>
                      )}
                      
                      {approval.approvalDate && (
                        <div>
                          <span className="font-medium">Approved:</span> {approval.approvalDate.toLocaleDateString()}
                        </div>
                      )}
                      
                      {projectedDate && !approval.approvalDate && (
                        <div>
                          <span className="font-medium">Expected:</span> {projectedDate.toLocaleDateString()}
                        </div>
                      )}
                      
                      <div>
                        <span className="font-medium">Duration:</span> {approval.estimatedDays} days
                      </div>
                    </div>
                    
                    {/* Progress indicator for pending items */}
                    {approval.status === 'pending' && approval.submittedDate && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-muted-foreground">Processing progress</span>
                          <span className="text-muted-foreground">
                            {Math.min(
                              Math.round(
                                ((new Date().getTime() - approval.submittedDate.getTime()) / 
                                (1000 * 60 * 60 * 24)) / approval.estimatedDays * 100
                              ), 
                              100
                            )}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                ((new Date().getTime() - approval.submittedDate.getTime()) / 
                                (1000 * 60 * 60 * 24)) / approval.estimatedDays * 100, 
                                100
                              )}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Summary */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-medium mb-3">Timeline Summary</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>
                {approvals.filter(a => a.status === 'approved').length} Approved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span>
                {approvals.filter(a => a.status === 'pending').length} In Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-600" />
              <span>
                {approvals.filter(a => a.status === 'not-started').length} Pending Start
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalTimelineView;