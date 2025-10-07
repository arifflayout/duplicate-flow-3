import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText,
  Calendar,
  Star,
  Building,
  Users
} from 'lucide-react';
import { AppointmentMatrix } from '@/types/consultant';
import { CONSULTANT_DISCIPLINES } from '@/data/consultantDisciplines';
import { formatCurrency } from '@/utils/formatters';

interface ConsultantDirectoryProps {
  appointments: AppointmentMatrix['appointments'];
  onMessageConsultant: (consultantId: string) => void;
}

const ConsultantDirectory: React.FC<ConsultantDirectoryProps> = ({
  appointments,
  onMessageConsultant
}) => {
  const appointedConsultants = Object.entries(appointments).filter(([_, appointment]) => appointment);

  if (appointedConsultants.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Consultants Appointed</h3>
          <p className="text-muted-foreground">
            Appoint consultants from the marketplace to see them in your project directory.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Project Consultant Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{appointedConsultants.length}</div>
              <div className="text-sm text-muted-foreground">Appointed Consultants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatCurrency(
                  appointedConsultants.reduce((sum, [_, appointment]) => 
                    sum + (appointment?.appointment.contractValue || 0), 0
                  )
                )}
              </div>
              <div className="text-sm text-muted-foreground">Total Contract Value</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {appointedConsultants.map(([disciplineId, appointment]) => {
          if (!appointment) return null;
          
          const disciplineInfo = CONSULTANT_DISCIPLINES.find(d => d.id === disciplineId);
          const { consultant, appointment: appointmentDetails } = appointment;

          return (
            <Card key={disciplineId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{disciplineInfo?.icon}</div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={consultant.avatar} />
                    <AvatarFallback>
                      {consultant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{consultant.name}</h3>
                      <Badge variant="secondary">{disciplineInfo?.name}</Badge>
                      <Badge 
                        variant={appointmentDetails.status === 'active' ? 'default' : 'outline'}
                      >
                        {appointmentDetails.status}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-2">{consultant.company}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{consultant.rating}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Experience:</span>
                        <div className="font-medium">{consultant.yearsExperience} years</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contract Value:</span>
                        <div className="font-medium">{formatCurrency(appointmentDetails.contractValue)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Appointed:</span>
                        <div className="font-medium">
                          {appointmentDetails.appointmentDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground">Approval Access:</span>
                      {appointmentDetails.approvalAccess.map((access, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {access.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Mail className="h-4 w-4" />
                      <span>{consultant.email}</span>
                      <Phone className="h-4 w-4 ml-4" />
                      <span>{consultant.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onMessageConsultant(consultant.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Contract
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>

                {/* Deliverables Status */}
                {appointmentDetails.deliverables.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Current Deliverables</h4>
                    <div className="space-y-2">
                      {appointmentDetails.deliverables.slice(0, 3).map((deliverable) => (
                        <div key={deliverable.id} className="flex items-center justify-between text-sm">
                          <span>{deliverable.name}</span>
                          <Badge 
                            variant={deliverable.status === 'approved' ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {deliverable.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ConsultantDirectory;