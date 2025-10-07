import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Upload,
  Calendar,
  User,
  MessageSquare,
  Download
} from 'lucide-react';
import { ApprovalStatus, ProjectStage } from '@/types';
import DocumentUploadModal from './DocumentUploadModal';
import ApprovalTimelineView from './ApprovalTimelineView';
import { useToast } from '@/hooks/use-toast';

interface ApprovalItem {
  id: string;
  name: string;
  description: string;
  status: ApprovalStatus;
  submittedDate?: Date;
  approvalDate?: Date;
  estimatedDays: number;
  documents: string[];
  authority: string;
  requirements: string[];
  feedback?: string;
}

const mockApprovals: ApprovalItem[] = [
  {
    id: 'green-form',
    name: 'Green Form Approval',
    description: 'Environmental impact assessment and green building compliance',
    status: 'approved',
    submittedDate: new Date('2024-01-15'),
    approvalDate: new Date('2024-02-01'),
    estimatedDays: 21,
    documents: ['environmental_impact.pdf', 'green_building_plan.pdf'],
    authority: 'Department of Environment',
    requirements: ['Environmental Impact Assessment', 'Green Building Index certification'],
    feedback: 'Approved with minor conditions for water conservation measures.'
  },
  {
    id: 'development-order',
    name: 'Development Order',
    description: 'Planning permission for the proposed development',
    status: 'pending',
    submittedDate: new Date('2024-02-05'),
    estimatedDays: 45,
    documents: ['site_plan.pdf', 'development_proposal.pdf', 'traffic_impact.pdf'],
    authority: 'Local Planning Authority',
    requirements: ['Site Plan', 'Development Proposal', 'Traffic Impact Assessment']
  },
  {
    id: 'building-plan',
    name: 'Building Plan Approval',
    description: 'Structural and architectural plan approval',
    status: 'not-started',
    estimatedDays: 30,
    documents: [],
    authority: 'Local Authority Building Department',
    requirements: ['Architectural Drawings', 'Structural Calculations', 'MEP Drawings']
  },
  {
    id: 'bomba',
    name: 'BOMBA Approval',
    description: 'Fire safety and emergency access approval',
    status: 'not-started',
    estimatedDays: 14,
    documents: [],
    authority: 'Fire and Rescue Department',
    requirements: ['Fire Safety Plan', 'Emergency Exit Layout', 'Fire Fighting Systems']
  },
  {
    id: 'tnb',
    name: 'TNB Connection',
    description: 'Electrical supply and connection approval',
    status: 'not-started',
    estimatedDays: 21,
    documents: [],
    authority: 'Tenaga Nasional Berhad',
    requirements: ['Electrical Load Calculation', 'Substation Plan', 'Cable Routing']
  },
  {
    id: 'strata',
    name: 'Strata Title',
    description: 'Individual unit title registration',
    status: 'not-started',
    estimatedDays: 60,
    documents: [],
    authority: 'Land Office',
    requirements: ['Strata Plan', 'Management Corporation Setup', 'Unit Allocation']
  },
  {
    id: 'ccc',
    name: 'Certificate of Completion and Compliance (CCC)',
    description: 'Building completion certification',
    status: 'not-started',
    estimatedDays: 14,
    documents: [],
    authority: 'Local Authority',
    requirements: ['Final Inspection Report', 'Compliance Certificates', 'Quality Assurance']
  },
  {
    id: 'cpc',
    name: 'Certificate of Practical Completion (CPC)',
    description: 'Practical completion certification',
    status: 'not-started',
    estimatedDays: 7,
    documents: [],
    authority: 'Project Consultant',
    requirements: ['Defects List', 'Handover Documentation', 'Warranty Information']
  }
];

const DesignApprovalWorkflow: React.FC = () => {
  const { toast } = useToast();
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-500/10 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const calculateProgress = () => {
    const totalApprovals = mockApprovals.length;
    const completedApprovals = mockApprovals.filter(a => a.status === 'approved').length;
    return Math.round((completedApprovals / totalApprovals) * 100);
  };

  const handleDocumentUpload = (approvalId: string, documents: string[]) => {
    toast({
      title: "Documents Uploaded",
      description: `${documents.length} document(s) uploaded successfully.`,
    });
    setShowUploadModal(false);
    setSelectedApproval(null);
  };

  const handleSubmitForApproval = (approvalId: string) => {
    toast({
      title: "Submitted for Approval",
      description: "Your application has been submitted and is now under review.",
    });
  };

  const approvedCount = mockApprovals.filter(a => a.status === 'approved').length;
  const pendingCount = mockApprovals.filter(a => a.status === 'pending').length;
  const notStartedCount = mockApprovals.filter(a => a.status === 'not-started').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Design & Approval Workflow</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage all project approvals and permits
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{calculateProgress()}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress value={calculateProgress()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Not Started</p>
                <p className="text-2xl font-bold text-gray-600">{notStartedCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Approval Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="documents">Document Center</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {mockApprovals.map((approval) => (
            <Card key={approval.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(approval.status)}
                    <div>
                      <CardTitle className="text-lg">{approval.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{approval.description}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(approval.status)}>
                    {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Authority: {approval.authority}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Est. {approval.estimatedDays} days</span>
                  </div>
                  {approval.submittedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Submitted: {approval.submittedDate.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {approval.approvalDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">
                        Approved: {approval.approvalDate.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Required Documents:</h4>
                  <div className="flex flex-wrap gap-2">
                    {approval.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                {approval.documents.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Uploaded Documents:</h4>
                    <div className="space-y-1">
                      {approval.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{doc}</span>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {approval.feedback && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">Authority Feedback:</h4>
                    <p className="text-sm text-muted-foreground">{approval.feedback}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  {approval.status === 'not-started' && (
                    <Button
                      onClick={() => {
                        setSelectedApproval(approval);
                        setShowUploadModal(true);
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                  )}
                  {approval.status === 'pending' && (
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Authority
                    </Button>
                  )}
                  {approval.documents.length > 0 && approval.status === 'not-started' && (
                    <Button 
                      variant="default"
                      onClick={() => handleSubmitForApproval(approval.id)}
                    >
                      Submit for Approval
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="timeline">
          <ApprovalTimelineView approvals={mockApprovals} />
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Management Center</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage all project documents and approvals in one place.
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload New Document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedApproval && (
        <DocumentUploadModal
          isOpen={showUploadModal}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedApproval(null);
          }}
          approval={selectedApproval}
          onUpload={(documents) => handleDocumentUpload(selectedApproval.id, documents)}
        />
      )}
    </div>
  );
};

export default DesignApprovalWorkflow;