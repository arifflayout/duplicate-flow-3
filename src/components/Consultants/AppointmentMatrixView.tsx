import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Star,
  Edit,
  MessageSquare,
  FileText,
  Calendar
} from 'lucide-react';
import { AppointmentMatrix, ConsultantDiscipline } from '@/types/consultant';
import { CONSULTANT_DISCIPLINES } from '@/data/consultantDisciplines';
import { formatCurrency } from '@/utils/formatters';

interface AppointmentMatrixViewProps {
  appointmentMatrix: AppointmentMatrix;
  onEditAppointment: (discipline: ConsultantDiscipline) => void;
}

const AppointmentMatrixView: React.FC<AppointmentMatrixViewProps> = ({
  appointmentMatrix,
  onEditAppointment
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'appointed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'required':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'appointed':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'required':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDisciplineInfo = (disciplineId: ConsultantDiscipline) => {
    return CONSULTANT_DISCIPLINES.find(d => d.id === disciplineId);
  };

  const totalContractValue = Object.values(appointmentMatrix.appointments)
    .reduce((sum, appointment) => sum + (appointment?.appointment.contractValue || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Appointment Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{appointmentMatrix.completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Object.values(appointmentMatrix.appointments).length}</div>
              <div className="text-sm text-muted-foreground">Appointed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(totalContractValue)}</div>
              <div className="text-sm text-muted-foreground">Total Contract Value</div>
            </div>
          </div>

          <div className="space-y-4">
            {appointmentMatrix.requiredDisciplines.map((disciplineId) => {
              const disciplineInfo = getDisciplineInfo(disciplineId);
              const appointment = appointmentMatrix.appointments[disciplineId];
              const status = appointment?.status || 'required';

              return (
                <Card key={disciplineId} className="border-l-4 border-l-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{disciplineInfo?.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{disciplineInfo?.name}</h3>
                            <Badge className={getStatusColor(status)}>
                              {getStatusIcon(status)}
                              <span className="ml-1 capitalize">{status}</span>
                            </Badge>
                          </div>
                          
                          {appointment ? (
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={appointment.consultant.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {appointment.consultant.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{appointment.consultant.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {appointment.consultant.company}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{appointment.consultant.rating}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Contract Value:</span>
                                  <div className="font-medium">{formatCurrency(appointment.appointment.contractValue)}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Contract Type:</span>
                                  <div className="font-medium">{appointment.appointment.contractType}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Appointed:</span>
                                  <div className="font-medium">
                                    {appointment.appointment.appointmentDate.toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {disciplineInfo?.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {appointment ? (
                          <>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Contract
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onEditAppointment(disciplineId)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={() => onEditAppointment(disciplineId)}
                          >
                            Appoint {disciplineInfo?.name}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Readiness Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Approval Readiness Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>All required consultants appointed</span>
              {appointmentMatrix.completionPercentage === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-600" />
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Consultant contracts executed</span>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Project brief distributed to team</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
          
          {appointmentMatrix.readyForApprovals ? (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Ready to Proceed</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                All consultants are appointed and ready to begin the design and approval process.
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Appointments Pending</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Complete all consultant appointments before proceeding to design and approvals.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentMatrixView;