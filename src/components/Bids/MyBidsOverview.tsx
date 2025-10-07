import React, { useState } from 'react';
import { formatCurrency } from '@/utils/formatters';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  DollarSign,
  Calendar,
  AlertCircle,
  Eye,
  Edit,
  MessageSquare,
  Star,
  Building,
  User
} from 'lucide-react';

interface MyBidsOverviewProps {
  userRole: 'developer' | 'consultant' | 'contractor' | 'cpm';
}

const MyBidsOverview: React.FC<MyBidsOverviewProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock bids data based on user role
  const getBidsData = () => {
    if (userRole === 'developer') {
      return {
        received: [
          {
            id: '1',
            type: 'consultant',
            bidder: 'Urban Design Solutions',
            project: 'Tropicana Heights Development',
            amount: 125000,
            status: 'pending',
            submittedAt: '2024-02-20',
            timeline: '3 months',
            proposal: 'Comprehensive architectural and planning services for residential development...',
            rating: 4.8,
            documents: ['Portfolio.pdf', 'Proposal.pdf'],
            discipline: 'Architecture'
          },
          {
            id: '2',
            type: 'contractor',
            bidder: 'Premier Construction',
            project: 'Tropicana Heights Development',
            amount: 2800000,
            status: 'under-review',
            submittedAt: '2024-02-18',
            timeline: '18 months',
            proposal: 'Full construction services including foundation, structure, and finishing...',
            rating: 4.6,
            documents: ['Company-Profile.pdf', 'Technical-Proposal.pdf']
          },
          {
            id: '3',
            type: 'cpm',
            bidder: 'Project Masters Sdn Bhd',
            project: 'Selangor Mixed Development',
            amount: 180000,
            status: 'accepted',
            submittedAt: '2024-02-15',
            timeline: '24 months',
            proposal: 'End-to-end project management for mixed development project...',
            rating: 4.9,
            documents: ['Credentials.pdf', 'Methodology.pdf']
          }
        ],
        submitted: []
      };
    } else {
      return {
        submitted: [
          {
            id: '1',
            type: userRole,
            project: 'Tropicana Heights Development',
            client: 'Sunrise Development Group',
            amount: userRole === 'consultant' ? 125000 : userRole === 'contractor' ? 2800000 : 180000,
            status: 'pending',
            submittedAt: '2024-02-20',
            timeline: userRole === 'consultant' ? '3 months' : userRole === 'contractor' ? '18 months' : '24 months',
            proposal: `${userRole} services proposal for residential development project...`,
            documents: ['Proposal.pdf', 'Company-Profile.pdf'],
            discipline: userRole === 'consultant' ? 'Architecture' : undefined
          },
          {
            id: '2',
            type: userRole,
            project: 'KL Commercial Tower',
            client: 'Metro Properties',
            amount: userRole === 'consultant' ? 95000 : userRole === 'contractor' ? 3200000 : 220000,
            status: 'under-review',
            submittedAt: '2024-02-18',
            timeline: userRole === 'consultant' ? '4 months' : userRole === 'contractor' ? '20 months' : '20 months',
            proposal: `${userRole} services for commercial tower development...`,
            documents: ['Technical-Proposal.pdf', 'Portfolio.pdf']
          },
          {
            id: '3',
            type: userRole,
            project: 'Penang Resort Development',
            client: 'Coastal Development Ltd',
            amount: userRole === 'consultant' ? 150000 : userRole === 'contractor' ? 4500000 : 280000,
            status: 'rejected',
            submittedAt: '2024-02-10',
            timeline: userRole === 'consultant' ? '5 months' : userRole === 'contractor' ? '24 months' : '24 months',
            proposal: `${userRole} services for luxury resort development...`,
            documents: ['Proposal.pdf', 'Experience.pdf'],
            feedback: 'Thank you for your proposal. We have selected another candidate with more resort experience.'
          }
        ],
        received: []
      };
    }
  };

  const bidsData = getBidsData();

  const getBidMetrics = () => {
    const allBids = [...bidsData.submitted, ...bidsData.received];
    const totalBids = allBids.length;
    const acceptedBids = allBids.filter(bid => bid.status === 'accepted').length;
    const pendingBids = allBids.filter(bid => bid.status === 'pending').length;
    const successRate = totalBids > 0 ? (acceptedBids / totalBids) * 100 : 0;

    return { totalBids, acceptedBids, pendingBids, successRate };
  };

  const metrics = getBidMetrics();

  const filterBids = (bids: any[]) => {
    return bids.filter(bid => {
      const matchesSearch = 
        bid.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.bidder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.client?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bid.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const getBidTypeIcon = (type: string) => {
    switch (type) {
      case 'consultant': return Building;
      case 'contractor': return Building;
      case 'cpm': return User;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Bids & Proposals</h1>
              <p className="text-lg text-muted-foreground">
                {userRole === 'developer' 
                  ? 'Manage bids received for your projects' 
                  : 'Track your submitted bids and applications'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EnhancedCard variant="metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Bids</h3>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{metrics.totalBids}</div>
            <div className="text-sm text-muted-foreground">All submissions</div>
          </EnhancedCard>

          <EnhancedCard variant="metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Accepted</h3>
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div className="text-3xl font-bold text-success">{metrics.acceptedBids}</div>
            <div className="text-sm text-muted-foreground">Successful bids</div>
          </EnhancedCard>

          <EnhancedCard variant="metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div className="text-3xl font-bold text-warning">{metrics.pendingBids}</div>
            <div className="text-sm text-muted-foreground">Under review</div>
          </EnhancedCard>

          <EnhancedCard variant="metric">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
              <TrendingUp className="h-5 w-5 text-info" />
            </div>
            <div className="text-3xl font-bold text-info">{metrics.successRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Win percentage</div>
          </EnhancedCard>
        </div>

        {/* Filters */}
        <EnhancedCard variant="elevated" className="mb-8">
          <EnhancedCardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <EnhancedInput
                  placeholder="Search bids by project, client, or bidder..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  variant="search"
                  inputSize="lg"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="amount">Highest Amount</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>

        {/* Bids Tabs */}
        <Tabs defaultValue={userRole === 'developer' ? 'received' : 'submitted'} className="space-y-6">
          <TabsList className="bg-white border border-border">
            {userRole === 'developer' && (
              <TabsTrigger value="received" className="gap-2">
                <FileText className="h-4 w-4" />
                Bids Received ({bidsData.received.length})
              </TabsTrigger>
            )}
            {userRole !== 'developer' && (
              <TabsTrigger value="submitted" className="gap-2">
                <FileText className="h-4 w-4" />
                My Submissions ({bidsData.submitted.length})
              </TabsTrigger>
            )}
          </TabsList>

          {userRole === 'developer' && (
            <TabsContent value="received" className="space-y-6">
              <div className="grid gap-6">
                {filterBids(bidsData.received).map((bid) => {
                  const BidIcon = getBidTypeIcon(bid.type);
                  
                  return (
                    <EnhancedCard key={bid.id} variant="elevated" className="group hover:shadow-lg transition-all duration-300">
                      <EnhancedCardContent className="p-6">
                        <div className="flex gap-6">
                          {/* Bid Type Icon */}
                          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-info/10 rounded-2xl flex items-center justify-center border border-primary/20">
                            <BidIcon className="h-8 w-8 text-primary" />
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {bid.bidder}
                                  </h3>
                                  {bid.discipline && (
                                    <EnhancedBadge variant="info" size="sm">
                                      {bid.discipline}
                                    </EnhancedBadge>
                                  )}
                                </div>
                                <p className="text-muted-foreground font-medium">{bid.project}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{bid.rating}</span>
                                  <span className="text-muted-foreground">rating</span>
                                </div>
                              </div>
                              <StatusBadge status={bid.status} />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-surface-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <DollarSign className="h-4 w-4 text-success" />
                                  <span className="text-sm font-medium text-muted-foreground">Amount</span>
                                </div>
                                <div className="font-bold text-foreground">{formatCurrency(bid.amount)}</div>
                              </div>
                              <div className="bg-surface-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock className="h-4 w-4 text-info" />
                                  <span className="text-sm font-medium text-muted-foreground">Timeline</span>
                                </div>
                                <div className="font-bold text-foreground">{bid.timeline}</div>
                              </div>
                              <div className="bg-surface-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <Star className="h-4 w-4 text-warning" />
                                  <span className="text-sm font-medium text-muted-foreground">Rating</span>
                                </div>
                                <div className="font-bold text-foreground">{bid.rating}/5.0</div>
                              </div>
                              <div className="bg-surface-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium text-muted-foreground">Submitted</span>
                                </div>
                                <div className="font-bold text-foreground">{bid.submittedAt}</div>
                              </div>
                            </div>

                            <p className="text-muted-foreground line-clamp-2 leading-relaxed">{bid.proposal}</p>

                            <div className="flex gap-3 pt-4 border-t border-border">
                              <EnhancedButton variant="outline" className="gap-2">
                                <Eye className="h-4 w-4" />
                                Review Details
                              </EnhancedButton>
                              {bid.status === 'pending' && (
                                <>
                                  <EnhancedButton variant="success" className="gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Accept Bid
                                  </EnhancedButton>
                                  <EnhancedButton variant="outline" className="gap-2">
                                    <XCircle className="h-4 w-4" />
                                    Decline
                                  </EnhancedButton>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  );
                })}
              </div>
            </TabsContent>
          )}

          {userRole !== 'developer' && (
            <TabsContent value="submitted" className="space-y-6">
              <div className="grid gap-6">
                {filterBids(bidsData.submitted).map((bid) => (
                  <EnhancedCard key={bid.id} variant="elevated" className="group hover:shadow-lg transition-all duration-300">
                    <EnhancedCardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Project Icon */}
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-info/10 rounded-2xl flex items-center justify-center border border-primary/20">
                          <Building className="h-8 w-8 text-primary" />
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                  {bid.project}
                                </h3>
                                {bid.discipline && (
                                  <EnhancedBadge variant="info" size="sm">
                                    {bid.discipline}
                                  </EnhancedBadge>
                                )}
                              </div>
                              <p className="text-muted-foreground font-medium">{bid.client}</p>
                            </div>
                            <StatusBadge status={bid.status} />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-surface-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="h-4 w-4 text-success" />
                                <span className="text-sm font-medium text-muted-foreground">Bid Amount</span>
                              </div>
                              <div className="font-bold text-foreground">{formatCurrency(bid.amount)}</div>
                            </div>
                            <div className="bg-surface-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-4 w-4 text-info" />
                                <span className="text-sm font-medium text-muted-foreground">Timeline</span>
                              </div>
                              <div className="font-bold text-foreground">{bid.timeline}</div>
                            </div>
                            <div className="bg-surface-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-muted-foreground">Submitted</span>
                              </div>
                              <div className="font-bold text-foreground">{bid.submittedAt}</div>
                            </div>
                          </div>

                          <p className="text-muted-foreground line-clamp-2 leading-relaxed">{bid.proposal}</p>
                          
                          {bid.feedback && (
                            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-warning mb-1">Client Feedback</h4>
                                  <p className="text-sm text-warning/80">{bid.feedback}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-3 pt-4 border-t border-border">
                            <EnhancedButton variant="outline" className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </EnhancedButton>
                            {bid.status === 'pending' && (
                              <EnhancedButton variant="outline" className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Proposal
                              </EnhancedButton>
                            )}
                            <EnhancedButton variant="outline" className="gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Contact Client
                            </EnhancedButton>
                          </div>
                        </div>
                      </div>
                    </EnhancedCardContent>
                  </EnhancedCard>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default MyBidsOverview;