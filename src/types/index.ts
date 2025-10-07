
export type UserRole = 'developer' | 'consultant' | 'contractor' | 'cpm' | 'lender' | 'admin';
export type ProjectType = 'residential' | 'commercial' | 'strata' | 'mixed';
export type UserType = 'developer' | 'individual';
export type BidStatus = 'submitted' | 'under-review' | 'accepted' | 'rejected';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'cancelled';

export type ProjectStage = 
  | 'land-selection' 
  | 'project-brief' 
  | 'consultant-selection' 
  | 'design-approval' 
  | 'contractor-selection' 
  | 'construction' 
  | 'compliance' 
  | 'handover';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'not-started';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  certifications?: string[];
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LandListing {
  id: string;
  title: string;
  location: string;
  coordinates: { lat: number; lng: number };
  price: number;
  size: number; // in acres or square feet
  zoning: string;
  description: string;
  images: string[];
  documents: string[];
  ownerId: string;
  features: string[];
  isActive: boolean;
}

export interface ProjectBrief {
  id: string;
  landId: string;
  developerId?: string;
  projectName: string;
  projectType: ProjectType;
  userType: UserType;
  projectDescription: string;
  estimatedBudget: string;
  timelineStart: Date;
  timelineCompletion: Date;
  units: number;
  features: string[];
  financialDetails?: {
    annualIncome: string;
    existingLoans?: string;
    downPayment: string;
    creditScore?: string;
  };
  createdAt: string;
  status: 'draft' | 'submitted' | 'under-review';
}

export interface Project {
  id: string;
  name: string;
  landListing: LandListing;
  brief: ProjectBrief;
  stage: ProjectStage;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  participants: {
    developer: User;
    consultant?: User;
    contractor?: User;
    cpm?: User;
    lender?: User;
  };
  approvals: {
    greenForm: ApprovalStatus;
    developmentOrder: ApprovalStatus;
    buildingPlan: ApprovalStatus;
    bomba: ApprovalStatus;
    tnb: ApprovalStatus;
    strata: ApprovalStatus;
    ccc: ApprovalStatus;
    cpc: ApprovalStatus;
  };
  milestones: ProjectMilestone[];
  documents: ProjectDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  dependencies?: string[];
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  version: number;
  category: 'design' | 'approval' | 'legal' | 'financial' | 'construction';
}

export interface Bid {
  id: string;
  projectId: string;
  bidderId: string;
  bidder: User;
  amount: number;
  timeline: number;
  proposal: string;
  documents: string[];
  status: BidStatus;
  submittedAt: Date;
  updatedAt?: Date;
  feedback?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface SearchFilters {
  query?: string;
  status?: string;
  type?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}