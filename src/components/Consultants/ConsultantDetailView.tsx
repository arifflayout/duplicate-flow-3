import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  Award, 
  Building, 
  Calendar,
  DollarSign,
  FileText,
  Phone,
  Mail
} from 'lucide-react';
import { ConsultantProfile } from '@/types/consultant';
import { formatCurrency } from '@/utils/formatters';

interface ConsultantDetailViewProps {
  consultant: ConsultantProfile;
}

const ConsultantDetailView: React.FC<ConsultantDetailViewProps> = ({ consultant }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={consultant.avatar} />
          <AvatarFallback className="text-lg">
            {consultant.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{consultant.name}</h2>
          <p className="text-lg text-muted-foreground">{consultant.company}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{consultant.rating}</span>
              <span className="text-muted-foreground">({consultant.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{consultant.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{consultant.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{consultant.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{consultant.projectsCompleted}</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{consultant.yearsExperience}</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{consultant.licenses.length}</div>
            <div className="text-sm text-muted-foreground">Active Licenses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {consultant.feeStructure === 'percentage' 
                ? `${consultant.typicalFeeRange.min}-${consultant.typicalFeeRange.max}%`
                : 'Variable'
              }
            </div>
            <div className="text-sm text-muted-foreground">Fee Range</div>
          </CardContent>
        </Card>
      </div>

      {/* Qualifications */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Licenses & Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {consultant.licenses.map((license, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{license}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {consultant.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Specializations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {consultant.specializations.map((spec, index) => (
              <Badge key={index} variant="secondary">
                {spec}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consultant.portfolio.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {project.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {project.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {project.completedDate.getFullYear()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(project.value)}</div>
                      <div className="text-sm text-muted-foreground">Project Value</div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {project.role}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Memberships */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Memberships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {consultant.memberships.map((membership, index) => (
              <Badge key={index} variant="outline">
                {membership}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultantDetailView;