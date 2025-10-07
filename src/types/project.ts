export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  type: 'residential' | 'commercial' | 'strata' | 'mixed' | 'development';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  
  startDate?: string;
  endDate?: string;
  budget?: number;
  deadline?: string;
  ltv?: number;
  
  participants: Participant[];
  milestones: Milestone[];
  financing?: FinancingDetails;
  monitoring: MonitoringReport[];
  compliance: ComplianceChecklist[];
  
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  name: string;
  role: 'developer' | 'consultant' | 'contractor' | 'cpm' | 'lender';
  email?: string;
  company?: string;
  avatar?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  assignedTo?: string;
  dependencies?: string[];
}

export interface FinancingDetails {
  budget: number;
  approvedAmount?: number;
  ltv?: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  lender?: string;
  interestRate?: number;
  term?: number;
}

export interface MonitoringReport {
  id: string;
  date: string;
  summary: string;
  status: 'ok' | 'warning' | 'critical';
  progress?: number;
  photos?: string[];
  issues?: string[];
}

export interface ComplianceChecklist {
  id: string;
  item: string;
  completed: boolean;
  dueDate?: string;
  completedDate?: string;
  authority?: string;
  documents?: string[];
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
  tags?: string[];
  dependencies?: string[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  tasks: ProjectTask[];
  milestones: string[]; // milestone IDs
}