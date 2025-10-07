import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Download,
  Upload,
  Award,
  Key,
  Clipboard,
  Building,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StatusBadge from '@/components/common/StatusBadge';
import { useProject } from '@/contexts/ProjectContext';

interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'pending-review';
  authority: string;
  documents: string[];
  dueDate: Date;
  completedDate?: Date;
  notes?: string;
  required: boolean;
}

interface HandoverItem {
  id: string;
  category: string;
  item: string;
  status: 'pending' | 'completed';
  responsible: string;
  notes?: string;
}

const ComplianceHandover: React.FC = () => {
  const { toast } = useToast();
  const { currentProject, updateProject } = useProject();
  const [selectedCompliance, setSelectedCompliance] = useState<string>('');

  // Mock compliance data
  const complianceItems: ComplianceItem[] = [
    {
      id: 'ccc',
      name: 'Certificate of Completion and Compliance (CCC)',
      description: 'Final building completion certificate from local authority',
      status: 'in-progress',
      authority: 'Local Authority Building Department',
      documents: ['final_inspection_report.pdf', 'compliance_checklist.pdf'],
      dueDate: new Date('2024-06-15'),
      notes: 'Final inspection scheduled for next week',
      required: true
    },
    {
      id: 'cpc',
      name: 'Certificate of Practical Completion (CPC)',
      description: 'Consultant certification of practical completion',
      status: 'completed',
      authority: 'Project Consultant',
      documents: ['cpc_certificate.pdf', 'defects_list.pdf'],
      dueDate: new Date('2024-06-01'),
      completedDate: new Date('2024-05-28'),
      notes: 'Minor defects identified and rectified',
      required: true
    },
    {
      id: 'bomba-final',
      name: 'BOMBA Final Approval',
      description: 'Fire safety final inspection and approval',
      status: 'completed',
      authority: 'Fire and Rescue Department',
      documents: ['fire_safety_final.pdf', 'emergency_systems_test.pdf'],
      dueDate: new Date('2024-05-20'),
      completedDate: new Date('2024-05-18'),
      required: true
    },
    {
      id: 'tnb-final',
      name: 'TNB Final Connection',
      description: 'Electrical supply final connection and testing',
      status: 'completed',
      authority: 'Tenaga Nasional Berhad',
      documents: ['electrical_test_report.pdf', 'connection_certificate.pdf'],
      dueDate: new Date('2024-05-25'),
      completedDate: new Date('2024-05-22'),
      required: true
    },
    {
      id: 'strata-final',
      name: 'Strata Title Registration',
      description: 'Individual unit title registration completion',
      status: 'pending-review',
      authority: 'Land Office',
      documents: ['strata_plan_final.pdf', 'unit_allocation.pdf'],
      dueDate: new Date('2024-07-01'),
      notes: 'Submitted for final review',
      required: true
    },
    {
      id: 'water-connection',
      name: 'Water Supply Connection',
      description: 'Final water supply connection and testing',
      status: 'completed',
      authority: 'Water Supply Department',
      documents: ['water_test_report.pdf', 'connection_approval.pdf'],
      dueDate: new Date('2024-05-30'),
      completedDate: new Date('2024-05-25'),
      required: true
    }
  ];

  // Mock handover checklist
  const handoverChecklist: HandoverItem[] = [
    {
      id: '1',
      category: 'Documentation',
      item: 'As-built drawings and specifications',
      status: 'completed',
      responsible: 'Consultant',
      notes: 'All drawings updated and delivered'
    },
    {
      id: '2',
      category: 'Documentation',
      item: 'Warranty certificates for all systems',
      status: 'completed',
      responsible: 'Contractor',
      notes: '5-year structural warranty, 2-year MEP warranty'
    },
    {
      id: '3',
      category: 'Documentation',
      item: 'Operation and maintenance manuals',
      status: 'pending',
      responsible: 'Contractor',
      notes: 'MEP manuals pending'
    },
    {
      id: '4',
      category: 'Keys & Access',
      item: 'Master keys and access cards',
      status: 'pending',
      responsible: 'Contractor'
    },
    {
      id: '5',
      category: 'Keys & Access',
      item: 'Security system codes and manuals',
      status: 'pending',
      responsible: 'Security Contractor'
    },
    {
      id: '6',
      category: 'Testing',
      item: 'Final MEP systems testing',
      status: 'completed',
      responsible: 'MEP Contractor',
      notes: 'All systems tested and commissioned'
    },
    {
      id: '7',
      category: 'Testing',
      item: 'Fire safety systems testing',
      status: 'completed',
      responsible: 'Fire Safety Contractor',
      notes: 'BOMBA witnessed testing completed'
    },
    {
      id: '8',
      category: 'Defects',
      item: 'Defects rectification completion',
      status: 'pending',
      responsible: 'Contractor',
      notes: '3 minor defects remaining'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
      case 'pending-review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
      case 'pending-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateComplianceProgress = () => {
    const completed = complianceItems.filter(item => item.status === 'completed').length;
    return Math.round((completed / complianceItems.length) * 100);
  };

  const calculateHandoverProgress = () => {
    const completed = handoverChecklist.filter(item => item.status === 'completed').length;
    return Math.round((completed / handoverChecklist.length) * 100);
  };

  const handleDocumentUpload = (complianceId: string) => {
    // Add compliance item to current project
    if (currentProject) {
      const complianceItem = complianceItems.find(c => c.id === complianceId);
      if (complianceItem) {
        const newComplianceItem = {
          id: complianceItem.id,
          item: complianceItem.name,
          completed: false,
          dueDate: complianceItem.dueDate.toISOString(),
          authority: complianceItem.authority,
          documents: complianceItem.documents
        };

        const existingIndex = currentProject.compliance.findIndex(c => c.id === complianceId);
        const updatedCompliance = existingIndex >= 0
          ? currentProject.compliance.map(c => c.id === complianceId ? newComplianceItem : c)
          : [...currentProject.compliance, newComplianceItem];

        updateProject(currentProject.id, {
          compliance: updatedCompliance
        });
      }
    }

    toast({
      title: "Document Uploaded",
      description: "Compliance document uploaded successfully.",
    });
  };

  const handleGenerateHandoverPack = () => {
    toast({
      title: "Handover Pack Generated",
      description: "Complete handover documentation package has been generated and is ready for download.",
    });
  };

  const toggleHandoverItem = (itemId: string) => {
    toast({
      title: "Handover Item Updated",
      description: "Handover checklist item status updated.",
    });
  };

  const complianceProgress = calculateComplianceProgress();
  const handoverProgress = calculateHandoverProgress();
  const overallProgress = Math.round((complianceProgress + handoverProgress) / 2);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compliance & Handover</h1>
          <p className="text-muted-foreground">Final compliance checks and project handover</p>
        </div>
        <Button onClick={handleGenerateHandoverPack}>
          <Download className="h-4 w-4 mr-2" />
          Generate Handover Pack
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{overallProgress}%</span>
                <StatusBadge status={overallProgress === 100 ? 'completed' : 'in-progress'} size="sm" />
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {overallProgress === 100 ? 'Ready for handover' : 'Compliance in progress'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{complianceProgress}%</span>
                <span className="text-sm text-muted-foreground">
                  {complianceItems.filter(i => i.status === 'completed').length}/{complianceItems.length}
                </span>
              </div>
              <Progress value={complianceProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">Regulatory approvals</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Handover Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{handoverProgress}%</span>
                <span className="text-sm text-muted-foreground">
                  {handoverChecklist.filter(i => i.status === 'completed').length}/{handoverChecklist.length}
                </span>
              </div>
              <Progress value={handoverProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">Handover checklist</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compliance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="compliance">Compliance Certificates</TabsTrigger>
          <TabsTrigger value="handover">Handover Checklist</TabsTrigger>
          <TabsTrigger value="documentation">Final Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-4">
          {complianceItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Authority:</span>
                    <p className="font-medium">{item.authority}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>
                    <p className="font-medium">{item.dueDate.toLocaleDateString()}</p>
                  </div>
                  {item.completedDate && (
                    <div>
                      <span className="text-muted-foreground">Completed:</span>
                      <p className="font-medium text-green-600">{item.completedDate.toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {item.documents.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Documents:</h4>
                    <div className="space-y-1">
                      {item.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.notes && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Notes:</h4>
                    <p className="text-sm text-blue-800">{item.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {item.status !== 'completed' && (
                    <Button variant="outline" onClick={() => handleDocumentUpload(item.id)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                  )}
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="handover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Handover Checklist</CardTitle>
              <CardDescription>Complete all items before final handover</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Documentation', 'Keys & Access', 'Testing', 'Defects'].map((category) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Clipboard className="h-4 w-4" />
                      {category}
                    </h3>
                    <div className="space-y-2 ml-6">
                      {handoverChecklist
                        .filter(item => item.category === category)
                        .map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={item.status === 'completed'}
                                onCheckedChange={() => toggleHandoverItem(item.id)}
                              />
                              <div>
                                <h4 className="font-medium">{item.item}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Responsible: {item.responsible}
                                </p>
                                {item.notes && (
                                  <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                                )}
                              </div>
                            </div>
                            <StatusBadge status={item.status} size="sm" />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>Final Project Documentation</CardTitle>
              <CardDescription>Complete documentation package for handover</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Technical Documents</h3>
                  <div className="space-y-2">
                    {[
                      'As-built architectural drawings',
                      'As-built structural drawings',
                      'As-built MEP drawings',
                      'Specifications and material lists',
                      'Test certificates and reports'
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{doc}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Legal & Compliance</h3>
                  <div className="space-y-2">
                    {[
                      'Certificate of Completion (CCC)',
                      'Certificate of Practical Completion (CPC)',
                      'Strata title documents',
                      'Warranty certificates',
                      'Insurance documentation'
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{doc}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Complete Handover Package</h3>
                    <p className="text-sm text-muted-foreground">
                      All documents, certificates, and handover materials
                    </p>
                  </div>
                  <Button onClick={handleGenerateHandoverPack}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Complete Package
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceHandover;