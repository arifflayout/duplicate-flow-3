import React, { useState } from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  DollarSign, 
  Clock, 
  FileText, 
  Star, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Calendar,
  Award,
  Building,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Bid, User as UserType } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Mock bid data
const mockBids: (Bid & { 
  bidder: UserType & { 
    rating: number;
    completedProjects: number;
    specializations: string[];
    avatar?: string;
    phone?: string;
    yearsExperience?: number;
  };
})[] = [
  {
    id: '1',
    projectId: 'proj-1',
    bidderId: 'user-1',
    bidder: {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@consultancy.com',
      role: 'consultant',
      avatar: '/placeholder.svg',
      company: 'Chen Architecture & Design',
      certifications: ['RIBA', 'PAM'],
      location: 'Kuala Lumpur',
      phone: '+60 12-345-6789',
      rating: 4.8,
      completedProjects: 23,
      yearsExperience: 8,
      specializations: ['Residential', 'Sustainable Design', 'Urban Planning']
    },
    amount: 850000,
    timeline: 14,
    proposal: 'Our team specializes in luxury residential developments with a focus on sustainable design principles. We propose a comprehensive design approach that integrates modern architecture with Malaysian tropical climate considerations. Our portfolio includes award-winning residential projects with similar scale and complexity.',
    documents: ['portfolio.pdf', 'certifications.pdf', 'project_timeline.pdf'],
    status: 'submitted',
    submittedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    projectId: 'proj-1',
    bidderId: 'user-2',
    bidder: {
      id: 'user-2',
      name: 'Ahmad Rahman',
      email: 'ahmad@urbandesign.my',
      role: 'consultant',
      avatar: '/placeholder.svg',
      company: 'Urban Design Solutions',
      certifications: ['PAM', 'MGBC'],
      location: 'Petaling Jaya',
      phone: '+60 12-345-6790',
      rating: 4.6,
      completedProjects: 31,
      yearsExperience: 12,
      specializations: ['Commercial', 'Mixed Development', 'HVAC Systems']
    },
    amount: 920000,
    timeline: 16,
    proposal: 'With over 15 years of experience in Malaysian property development, we offer comprehensive architectural and engineering consultation. Our team has successfully delivered 30+ projects with a focus on cost optimization and regulatory compliance. We guarantee timely delivery and full compliance with local building codes.',
    documents: ['company_profile.pdf', 'past_projects.pdf', 'cost_breakdown.pdf'],
    status: 'submitted',
    submittedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    projectId: 'proj-1',
    bidderId: 'user-3',
    bidder: {
      id: 'user-3',
      name: 'Lisa Wong',
      email: 'lisa@innovarch.com',
      role: 'consultant',
      avatar: '/placeholder.svg',
      company: 'InnovArch Consultancy',
      certifications: ['RIBA', 'PAM', 'LEED AP'],
      location: 'Kuala Lumpur',
      phone: '+60 12-345-6791',
      rating: 4.9,
      completedProjects: 18,
      yearsExperience: 6,
      specializations: ['Luxury Residential', 'Smart Buildings', 'Interior Design']
    },
    amount: 780000,
    timeline: 12,
    proposal: 'We propose an innovative design approach combining luxury aesthetics with smart home technology integration. Our team has expertise in high-end residential projects and can deliver a premium development that exceeds market expectations. We offer integrated interior design services at no additional cost.',
    documents: ['portfolio_luxury.pdf', 'smart_tech_proposal.pdf', 'interior_samples.pdf'],
    status: 'submitted',
    submittedAt: new Date('2024-01-22')
  }
];

interface BidReviewPanelProps {
  projectId: string;
  onBidAccepted?: (bidId: string) => void;
}

const BidReviewPanel: React.FC<BidReviewPanelProps> = ({ 
  projectId, 
  onBidAccepted 
}) => {
  const { toast } = useToast();
  const [selectedBid, setSelectedBid] = useState<string | null>(null);

  const handleAcceptBid = (bidId: string, bidderName: string) => {
    toast({
      title: "Bid Accepted",
      description: `You have accepted the bid from ${bidderName}. They will be notified shortly.`,
    });
    onBidAccepted?.(bidId);
  };

  const handleRejectBid = (bidId: string, bidderName: string) => {
    toast({
      title: "Bid Rejected",
      description: `You have rejected the bid from ${bidderName}.`,
      variant: "destructive",
    });
  };

  const handleContactBidder = (bidderEmail: string, bidderName: string) => {
    toast({
      title: "Message Sent",
      description: `A message has been sent to ${bidderName} at ${bidderEmail}.`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const sortedBids = [...mockBids].sort((a, b) => a.amount - b.amount);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Consultant Proposals</h1>
              <p className="text-lg text-muted-foreground">
                Review and compare consultant bids for your project
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mockBids.length}</div>
                <div className="text-sm text-muted-foreground">Proposals Received</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white border border-border">
            <TabsTrigger value="overview" className="gap-2">
              <FileText className="h-4 w-4" />
              Detailed Review
            </TabsTrigger>
            <TabsTrigger value="comparison" className="gap-2">
              <Building className="h-4 w-4" />
              Compare Bids
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {sortedBids.map((bid) => (
              <EnhancedCard key={bid.id} variant="elevated" className="group hover:shadow-lg transition-all duration-300">
                <EnhancedCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src={bid.bidder.avatar} alt={bid.bidder.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-info/10 text-primary font-semibold">
                          {bid.bidder.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {bid.bidder.name}
                        </h3>
                        <p className="text-muted-foreground font-medium">{bid.bidder.company}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{bid.bidder.rating}</span>
                            <span className="text-muted-foreground">({bid.bidder.completedProjects} projects)</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{bid.bidder.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{formatCurrency(bid.amount)}</div>
                      <div className="text-sm text-muted-foreground">{bid.timeline} weeks timeline</div>
                      <EnhancedBadge variant="info" className="mt-2">{bid.status}</EnhancedBadge>
                    </div>
                  </div>
                </EnhancedCardHeader>

                <EnhancedCardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-surface-50 rounded-lg p-4 text-center">
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-success" />
                      <div className="font-bold text-foreground">{formatCurrency(bid.amount)}</div>
                      <div className="text-xs text-muted-foreground">Total Fee</div>
                    </div>
                    <div className="bg-surface-50 rounded-lg p-4 text-center">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-info" />
                      <div className="font-bold text-foreground">{bid.timeline} weeks</div>
                      <div className="text-xs text-muted-foreground">Timeline</div>
                    </div>
                    <div className="bg-surface-50 rounded-lg p-4 text-center">
                      <Building className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-bold text-foreground">{bid.bidder.completedProjects}</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    <div className="bg-surface-50 rounded-lg p-4 text-center">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-warning" />
                      <div className="font-bold text-foreground">{bid.bidder.yearsExperience}+ years</div>
                      <div className="text-xs text-muted-foreground">Experience</div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="flex items-center gap-6 p-4 bg-surface-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{bid.bidder.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{bid.bidder.phone}</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {bid.bidder.specializations.map((spec, index) => (
                        <EnhancedBadge key={index} variant="info" size="sm">
                          {spec}
                        </EnhancedBadge>
                      ))}
                    </div>
                  </div>

                  {/* Proposal */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Proposal Details
                    </h4>
                    <div className="p-4 bg-surface-50 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed">
                        {bid.proposal}
                      </p>
                    </div>
                  </div>

                  {/* Supporting Documents */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Supporting Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {bid.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-surface-50 transition-colors">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium">{doc}</span>
                          <EnhancedButton variant="ghost" size="sm" className="ml-auto">
                            View
                          </EnhancedButton>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Certifications & Qualifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {bid.bidder.certifications?.map((cert, index) => (
                        <EnhancedBadge key={index} variant="success" size="sm" icon={<Award className="h-3 w-3" />}>
                          {cert}
                        </EnhancedBadge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-border">
                    <EnhancedButton
                      variant="outline"
                      onClick={() => handleContactBidder(bid.bidder.email, bid.bidder.name)}
                      className="gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Contact Consultant
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      onClick={() => handleRejectBid(bid.id, bid.bidder.name)}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Decline Proposal
                    </EnhancedButton>
                    <EnhancedButton
                      variant="success"
                      onClick={() => handleAcceptBid(bid.id, bid.bidder.name)}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept & Appoint
                    </EnhancedButton>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            ))}
          </TabsContent>

          <TabsContent value="comparison">
            <EnhancedCard variant="elevated">
              <EnhancedCardHeader>
                <h2 className="text-xl font-bold text-foreground">Bid Comparison Matrix</h2>
                <p className="text-muted-foreground">Compare all proposals side by side</p>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-semibold">Consultant</th>
                        <th className="text-left p-4 font-semibold">Fee</th>
                        <th className="text-left p-4 font-semibold">Timeline</th>
                        <th className="text-left p-4 font-semibold">Rating</th>
                        <th className="text-left p-4 font-semibold">Experience</th>
                        <th className="text-left p-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedBids.map((bid) => (
                        <tr key={bid.id} className="border-b border-border hover:bg-surface-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={bid.bidder.avatar} alt={bid.bidder.name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                  {bid.bidder.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-foreground">{bid.bidder.name}</div>
                                <div className="text-sm text-muted-foreground">{bid.bidder.company}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-foreground">{formatCurrency(bid.amount)}</div>
                            <div className="text-sm text-muted-foreground">Total fee</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-foreground">{bid.timeline} weeks</div>
                            <div className="text-sm text-muted-foreground">Estimated duration</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{bid.bidder.rating}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">{bid.bidder.completedProjects} projects</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-foreground">{bid.bidder.yearsExperience}+ years</div>
                            <div className="text-sm text-muted-foreground">Professional experience</div>
                          </td>
                          <td className="p-4">
                            <EnhancedButton
                              size="sm"
                              onClick={() => handleAcceptBid(bid.id, bid.bidder.name)}
                              className="gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Accept
                            </EnhancedButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BidReviewPanel;