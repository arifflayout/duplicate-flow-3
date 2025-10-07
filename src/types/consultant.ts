export type ConsultantDiscipline = 
  | 'architect'
  | 'town-planner'
  | 'civil-structural'
  | 'mep-engineer'
  | 'quantity-surveyor'
  | 'landscape-architect'
  | 'land-surveyor'
  | 'environmental'
  | 'traffic'
  | 'acoustic'
  | 'other';

export type ProjectType = 'residential' | 'commercial' | 'strata' | 'mixed-use' | 'industrial';

export interface ConsultantDisciplineInfo {
  id: ConsultantDiscipline;
  name: string;
  icon: string;
  description: string;
  requiredQualifications: string[];
  typicalDeliverables: string[];
  scopeTemplate?: string;
  requiredForProjectTypes: ProjectType[];
  regulatoryRole?: string;
}

export interface ConsultantProfile {
  id: string;
  name: string;
  company: string;
  discipline: ConsultantDiscipline;
  email: string;
  phone: string;
  location: string;
  coordinates: { lat: number; lng: number };
  avatar?: string;
  rating: number;
  reviewCount: number;
  projectsCompleted: number;
  yearsExperience: number;
  
  // Qualifications
  licenses: string[];
  certifications: string[];
  memberships: string[];
  
  // Portfolio
  portfolio: ProjectPortfolio[];
  specializations: string[];
  
  // Availability
  availability: 'available' | 'limited' | 'busy';
  preferredProjectTypes: ProjectType[];
  minProjectValue: number;
  maxProjectValue: number;
  
  // Pricing
  feeStructure: 'lump-sum' | 'percentage' | 'hourly' | 'hybrid';
  typicalFeeRange: { min: number; max: number };
  
  // Documents
  companyProfile?: string;
  sampleContracts: string[];
}

export interface ProjectPortfolio {
  id: string;
  name: string;
  type: ProjectType;
  value: number;
  location: string;
  completedDate: Date;
  role: string;
  images: string[];
  description: string;
}

export interface ConsultantProposal {
  id: string;
  consultantId: string;
  projectId: string;
  discipline: ConsultantDiscipline;
  
  // Proposal details
  scopeOfWork: string;
  deliverables: string[];
  timeline: number; // weeks
  
  // Pricing
  feeStructure: 'lump-sum' | 'percentage' | 'staged';
  feeAmount?: number;
  feePercentage?: number;
  paymentSchedule: string;
  
  // Documents
  proposalDocument?: string;
  feeProposalLetter?: string;
  contractTemplate?: string;
  tor?: string; // Terms of Reference
  
  // Status
  status: 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: Date;
  validUntil: Date;
  
  // Additional info
  teamMembers?: string[];
  subConsultants?: string[];
  assumptions: string[];
  exclusions: string[];
  notes?: string;
}

export interface ConsultantAppointment {
  id: string;
  projectId: string;
  consultantId: string;
  discipline: ConsultantDiscipline;
  proposalId: string;
  
  // Contract details
  contractType: string; // PAM, IEM, LAM, etc.
  appointmentDate: Date;
  contractValue: number;
  
  // Status
  status: 'appointed' | 'active' | 'completed' | 'terminated';
  
  // Access permissions
  dashboardAccess: boolean;
  approvalAccess: string[]; // Which approvals they can submit
  
  // Performance tracking
  deliverables: ConsultantDeliverable[];
  performanceRating?: number;
  feedback?: string;
}

export interface ConsultantDeliverable {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'submitted' | 'approved' | 'rejected';
  submittedDate?: Date;
  approvedDate?: Date;
  documents: string[];
  feedback?: string;
  revisionCount: number;
}

export interface AppointmentMatrix {
  projectId: string;
  projectName: string;
  requiredDisciplines: ConsultantDiscipline[];
  appointments: {
    [key in ConsultantDiscipline]?: {
      consultant: ConsultantProfile;
      appointment: ConsultantAppointment;
      status: 'required' | 'appointed' | 'active' | 'completed';
    };
  };
  completionPercentage: number;
  readyForApprovals: boolean;
}