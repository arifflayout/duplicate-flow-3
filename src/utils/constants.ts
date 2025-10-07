export const PROJECT_STAGES = {
  LAND_SELECTION: 'land-selection',
  PROJECT_BRIEF: 'project-brief',
  CONSULTANT_SELECTION: 'consultant-selection',
  DESIGN_APPROVAL: 'design-approval',
  CONTRACTOR_SELECTION: 'contractor-selection',
  CONSTRUCTION: 'construction',
  COMPLIANCE: 'compliance',
  HANDOVER: 'handover'
} as const;

export const APPROVAL_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NOT_STARTED: 'not-started'
} as const;

export const USER_ROLES = {
  DEVELOPER: 'developer',
  CONSULTANT: 'consultant',
  CONTRACTOR: 'contractor',
  CPM: 'cpm',
  LENDER: 'lender',
  ADMIN: 'admin'
} as const;

export const PROJECT_TYPES = {
  RESIDENTIAL: 'residential',
  COMMERCIAL: 'commercial',
  STRATA: 'strata',
  MIXED: 'mixed'
} as const;

export const CURRENCY_FORMAT = {
  LOCALE: 'en-MY',
  CURRENCY: 'MYR',
  OPTIONS: {
    style: 'currency' as const,
    currency: 'MYR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }
};

export const DATE_FORMAT = {
  SHORT: 'PP',
  LONG: 'PPP',
  WITH_TIME: 'PPp'
};