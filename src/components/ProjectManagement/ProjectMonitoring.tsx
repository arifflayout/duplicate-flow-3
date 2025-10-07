import React, { useState } from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Activity, 
  Camera, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Upload
} from 'lucide-react';
import { Project, MonitoringReport } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

interface ProjectMonitoringProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const ProjectMonitoring: React.FC<ProjectMonitoringProps> = ({ project, onUpdate }) => {
  const { toast } = useToast();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    summary: '',
    status: 'ok' as MonitoringReport['status'],
    progress: 0,
    issues: [] as string[],
    photos: [] as string[]
  });

  const handleReportSubmit = () => {
    if (!reportForm.summary.trim()) {
      toast({
        title: "Summary Required",
        description: "Please enter a report summary.",
        variant: "destructive"
      });
      return;
    }

    const reportData: MonitoringReport = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      summary: reportForm.summary,
      status: reportForm.status,
      progress: reportForm.progress,
      photos: reportForm.photos,
      issues: reportForm.issues
    };

    const updatedReports = [...project.monitoring, reportData];
    onUpdate({ monitoring: updatedReports });

    toast({
      title: "Report Added",
      description: "Monitoring report has been added successfully."
    });

    setShowReportModal(false);
    setReportForm({
      summary: '',
      status: 'ok',
      progress: 0,
      issues: [],
      photos: []
    });
  };

  const getStatusColor = (status: MonitoringReport['status']) => {
    switch (status) {
      case 'ok': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status: MonitoringReport['status']) => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const latestReports = [...project.monitoring]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const criticalIssues = project.monitoring.filter(r => r.status === 'critical').length;
  const warningIssues = project.monitoring.filter(r => r.status === 'warning').length;
  const avgProgress = project.monitoring.length > 0 
    ? Math.round(project.monitoring.reduce((sum, r) => sum + (r.progress || 0), 0) / project.monitoring.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Construction Monitoring</h2>
        <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
          <DialogTrigger asChild>
            <EnhancedButton className="gap-2">
              <Plus className="h-4 w-4" />
              Add Report
            </EnhancedButton>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Monitoring Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="summary">Report Summary *</Label>
                <Textarea
                  id="summary"
                  placeholder="Describe the current status and progress..."
                  value={reportForm.summary}
                  onChange={(e) => setReportForm(prev => ({ ...prev, summary: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={reportForm.status} onValueChange={(value: MonitoringReport['status']) => 
                    setReportForm(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ok">All Good</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={reportForm.progress}
                    onChange={(e) => setReportForm(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Photos</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload progress photos</p>
                  <EnhancedButton variant="outline" size="sm" className="mt-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </EnhancedButton>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <EnhancedButton variant="outline" onClick={() => setShowReportModal(false)}>
                  Cancel
                </EnhancedButton>
                <EnhancedButton onClick={handleReportSubmit}>
                  Add Report
                </EnhancedButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Monitoring Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{project.monitoring.length}</div>
            <div className="text-sm text-muted-foreground">Total Reports</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-error">{criticalIssues}</div>
            <div className="text-sm text-muted-foreground">Critical Issues</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{warningIssues}</div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-2xl font-bold text-info">{avgProgress}%</div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </div>
        </EnhancedCard>
      </div>

      {/* Recent Reports */}
      <EnhancedCard variant="elevated">
        <EnhancedCardHeader>
          <h3 className="text-lg font-bold text-foreground">Recent Monitoring Reports</h3>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-4">
            {latestReports.length > 0 ? (
              latestReports.map((report) => (
                <div key={report.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    report.status === 'ok' ? 'bg-success/10' :
                    report.status === 'warning' ? 'bg-warning/10' :
                    'bg-error/10'
                  }`}>
                    {getStatusIcon(report.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">
                        Report - {new Date(report.date).toLocaleDateString()}
                      </h4>
                      <EnhancedBadge variant={getStatusColor(report.status)}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </EnhancedBadge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{report.summary}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {report.progress !== undefined && (
                        <span>Progress: {report.progress}%</span>
                      )}
                      {report.photos && report.photos.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          {report.photos.length} photos
                        </span>
                      )}
                      {report.issues && report.issues.length > 0 && (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {report.issues.length} issues
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding monitoring reports to track construction progress.
                </p>
                <EnhancedButton onClick={() => setShowReportModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Report
                </EnhancedButton>
              </div>
            )}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  );
};

export default ProjectMonitoring;