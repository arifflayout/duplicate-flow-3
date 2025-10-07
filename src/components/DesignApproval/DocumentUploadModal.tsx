import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApprovalItem {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  authority: string;
}

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  approval: ApprovalItem;
  onUpload: (documents: string[]) => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  approval,
  onUpload
}) => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleFileUpload = (requirement: string) => {
    // Mock file upload
    const fileName = `${requirement.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    setUploadedFiles(prev => [...prev, fileName]);
    
    toast({
      title: "File Uploaded",
      description: `${requirement} document uploaded successfully.`,
    });
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f !== fileName));
  };

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Documents",
        description: "Please upload at least one document before submitting.",
        variant: "destructive",
      });
      return;
    }

    onUpload(uploadedFiles);
    setUploadedFiles([]);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload Documents - {approval.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Approval Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Approval Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground">{approval.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{approval.description}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Approving Authority</Label>
                <p className="text-sm text-muted-foreground">{approval.authority}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Required Documents</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {approval.requirements.map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Important Notes
                    </h4>
                    <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                      <li>• All documents must be in PDF format</li>
                      <li>• File size should not exceed 10MB</li>
                      <li>• Ensure all plans are to scale and clearly readable</li>
                      <li>• Include all required signatures and stamps</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {approval.requirements.map((requirement, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm font-medium">{requirement}</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFileUpload(requirement)}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                    
                    {/* Show uploaded files for this requirement */}
                    {uploadedFiles
                      .filter(file => file.includes(requirement.toLowerCase().replace(/\s+/g, '_')))
                      .map((file, fileIndex) => (
                        <div key={fileIndex} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-2 rounded text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-green-600" />
                            <span className="text-green-700 dark:text-green-300">{file}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(file)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or comments for the approval authority..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="border rounded-lg p-3 bg-muted/50">
                  <h4 className="font-medium text-sm mb-2">Uploaded Files Summary:</h4>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Upload Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;