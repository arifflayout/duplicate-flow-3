import { Project, Participant, Milestone, FinancingDetails, MonitoringReport, ComplianceChecklist } from "@/types/project";

export function migrateToProjectSchema(oldData: any): Project {
  const now = new Date().toISOString();

  return {
    id: oldData.id || crypto.randomUUID(),
    title: oldData.title || oldData.name || oldData.projectName || "Untitled Project",
    description: oldData.description || oldData.projectDescription || "",
    location: oldData.location || oldData.landListing?.location || "",
    type: oldData.type || oldData.projectType || oldData.brief?.projectType || "development",
    status: oldData.status || "draft",

    startDate: oldData.startDate || oldData.brief?.timelineStart || undefined,
    endDate: oldData.endDate || oldData.brief?.timelineCompletion || undefined,
    budget: oldData.budget || parseFloat(oldData.brief?.estimatedBudget || '0') || undefined,
    deadline: oldData.deadline || undefined,
    ltv: oldData.ltv || undefined,

    participants: mapParticipants(oldData.participants || oldData.team),
    milestones: mapMilestones(oldData.milestones),
    financing: mapFinancing(oldData.financing || oldData.financials),
    monitoring: mapMonitoring(oldData.monitoring || oldData.reports),
    compliance: mapCompliance(oldData.compliance || oldData.approvals),

    createdAt: oldData.createdAt || now,
    updatedAt: oldData.updatedAt || now,
  };
}

function mapParticipants(data: any): Participant[] {
  if (!data) return [];
  
  // Handle both array and object formats
  if (Array.isArray(data)) {
    return data.map((p) => ({
      id: p.id || crypto.randomUUID(),
      name: p.name || "Unknown",
      role: p.role || "developer",
      email: p.email,
      company: p.company,
      avatar: p.avatar,
    }));
  }
  
  // Handle object format (e.g., { developer: {...}, consultant: {...} })
  return Object.entries(data).map(([role, person]: [string, any]) => ({
    id: person?.id || crypto.randomUUID(),
    name: person?.name || "Unknown",
    role: role as any,
    email: person?.email,
    company: person?.company,
    avatar: person?.avatar,
  })).filter(p => p.name !== "Unknown");
}

function mapMilestones(data: any[]): Milestone[] {
  if (!Array.isArray(data)) return [];
  return data.map((m) => ({
    id: m.id || crypto.randomUUID(),
    title: m.title || m.name || "Untitled Milestone",
    description: m.description,
    dueDate: m.dueDate || m.targetDate || "",
    completedDate: m.completedDate,
    status: m.status || "pending",
    assignedTo: m.assignedTo,
    dependencies: m.dependencies || [],
  }));
}

function mapFinancing(data: any): FinancingDetails | undefined {
  if (!data) return undefined;
  return {
    budget: data.budget || data.totalBudget || 0,
    approvedAmount: data.approvedAmount || data.secured,
    ltv: data.ltv,
    status: data.status || "pending",
    lender: data.lender,
    interestRate: data.interestRate,
    term: data.term,
  };
}

function mapMonitoring(data: any[]): MonitoringReport[] {
  if (!Array.isArray(data)) return [];
  return data.map((r) => ({
    id: r.id || crypto.randomUUID(),
    date: r.date || new Date().toISOString(),
    summary: r.summary || r.description || "",
    status: r.status || "ok",
    progress: r.progress,
    photos: r.photos || [],
    issues: r.issues || [],
  }));
}

function mapCompliance(data: any[]): ComplianceChecklist[] {
  if (!Array.isArray(data)) return [];
  return data.map((c) => ({
    id: c.id || crypto.randomUUID(),
    item: c.item || c.name || "Untitled Checklist Item",
    completed: !!c.completed || c.status === 'approved',
    dueDate: c.dueDate,
    completedDate: c.completedDate || c.approvedDate,
    authority: c.authority,
    documents: c.documents || [],
  }));
}

// Helper to merge project data safely
export function mergeProjectData(existing: Project, updates: Partial<Project>): Project {
  return {
    ...existing,
    ...updates,
    participants: updates.participants || existing.participants,
    milestones: updates.milestones || existing.milestones,
    monitoring: updates.monitoring || existing.monitoring,
    compliance: updates.compliance || existing.compliance,
    updatedAt: new Date().toISOString(),
  };
}

// Helper to validate project data
export function validateProject(project: Project): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!project.title?.trim()) errors.push("Project title is required");
  if (!project.location?.trim()) errors.push("Project location is required");
  if (!project.type) errors.push("Project type is required");
  if (project.budget && project.budget <= 0) errors.push("Budget must be positive");
  
  return {
    isValid: errors.length === 0,
    errors
  };
}