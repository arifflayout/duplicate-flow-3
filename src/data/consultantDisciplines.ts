import { ConsultantDisciplineInfo, ProjectType } from '@/types/consultant';

export const CONSULTANT_DISCIPLINES: ConsultantDisciplineInfo[] = [
  {
    id: 'architect',
    name: 'Architect',
    icon: '🏛️',
    description: 'Design and planning of buildings, ensuring aesthetic, functional, and regulatory compliance',
    requiredQualifications: [
      'Board of Architects Malaysia (LAM) Registration',
      'Pertubuhan Akitek Malaysia (PAM) Membership',
      'Minimum 5 years experience'
    ],
    typicalDeliverables: [
      'Schematic Design',
      'Design Development',
      'Construction Documents',
      'Development Order Submission',
      'Building Plan Submission',
      'Site Supervision'
    ],
    scopeTemplate: 'Standard PAM Contract 2006',
    requiredForProjectTypes: ['residential', 'commercial', 'strata', 'mixed-use'],
    regulatoryRole: 'Development Order (DO) and Building Plan (BP) submissions'
  },
  {
    id: 'town-planner',
    name: 'Town Planner',
    icon: '🏙️',
    description: 'Land use planning, zoning compliance, and development strategy',
    requiredQualifications: [
      'Malaysian Institute of Planners (MIP) Membership',
      'Town Planning Degree',
      'Minimum 3 years experience'
    ],
    typicalDeliverables: [
      'Planning Report',
      'Land Use Analysis',
      'Development Proposal',
      'Planning Permission Application',
      'Zoning Compliance Report'
    ],
    requiredForProjectTypes: ['commercial', 'mixed-use', 'strata'],
    regulatoryRole: 'Planning permission and zoning compliance'
  },
  {
    id: 'civil-structural',
    name: 'Civil & Structural Engineer',
    icon: '🧱',
    description: 'Structural design, foundation engineering, and civil infrastructure',
    requiredQualifications: [
      'Board of Engineers Malaysia (BEM) Registration',
      'Institution of Engineers Malaysia (IEM) Membership',
      'Professional Engineer (Ir.) Status',
      'Minimum 7 years experience'
    ],
    typicalDeliverables: [
      'Structural Design',
      'Foundation Design',
      'Structural Calculations',
      'Construction Drawings',
      'Site Supervision',
      'Structural Inspection Reports'
    ],
    scopeTemplate: 'Standard IEM Contract',
    requiredForProjectTypes: ['residential', 'commercial', 'strata', 'mixed-use', 'industrial'],
    regulatoryRole: 'Building Plan (BP) submission and structural compliance'
  },
  {
    id: 'mep-engineer',
    name: 'M&E Engineer',
    icon: '💡',
    description: 'Mechanical, electrical, and plumbing systems design and installation',
    requiredQualifications: [
      'Board of Engineers Malaysia (BEM) Registration',
      'Institution of Engineers Malaysia (IEM) Membership',
      'Electrical/Mechanical Engineering Degree',
      'Minimum 5 years experience'
    ],
    typicalDeliverables: [
      'Electrical System Design',
      'Mechanical System Design',
      'Plumbing Design',
      'Fire Protection Systems',
      'ACMV Design',
      'Energy Efficiency Report'
    ],
    requiredForProjectTypes: ['residential', 'commercial', 'strata', 'mixed-use', 'industrial'],
    regulatoryRole: 'TNB connection, BOMBA approval, and MEP compliance'
  },
  {
    id: 'quantity-surveyor',
    name: 'Quantity Surveyor',
    icon: '📐',
    description: 'Cost estimation, bill of quantities, and project cost management',
    requiredQualifications: [
      'Royal Institution of Surveyors Malaysia (RISM) Membership',
      'Quantity Surveying Degree',
      'Minimum 5 years experience'
    ],
    typicalDeliverables: [
      'Cost Estimation',
      'Bill of Quantities (BOQ)',
      'Tender Documentation',
      'Cost Control Reports',
      'Variation Orders',
      'Final Account'
    ],
    requiredForProjectTypes: ['residential', 'commercial', 'strata', 'mixed-use', 'industrial'],
    regulatoryRole: 'Cost certification and tender preparation'
  },
  {
    id: 'landscape-architect',
    name: 'Landscape Architect',
    icon: '🌳',
    description: 'Landscape design, environmental planning, and outdoor space development',
    requiredQualifications: [
      'Malaysian Institute of Landscape Architects (MILA) Membership',
      'Landscape Architecture Degree',
      'Minimum 3 years experience'
    ],
    typicalDeliverables: [
      'Landscape Master Plan',
      'Planting Design',
      'Hardscape Design',
      'Irrigation System Design',
      'Environmental Impact Assessment',
      'Landscape Maintenance Plan'
    ],
    requiredForProjectTypes: ['residential', 'commercial', 'strata', 'mixed-use'],
    regulatoryRole: 'Landscape compliance and environmental approvals'
  },
  {
    id: 'land-surveyor',
    name: 'Land Surveyor',
    icon: '📍',
    description: 'Land measurement, boundary determination, and topographical surveys',
    requiredQualifications: [
      'Board of Surveyors Malaysia Registration',
      'Licensed Land Surveyor Status',
      'Surveying Degree',
      'Minimum 5 years experience'
    ],
    typicalDeliverables: [
      'Topographical Survey',
      'Boundary Survey',
      'As-Built Survey',
      'Setting Out Survey',
      'Subdivision Plan',
      'Strata Survey'
    ],
    requiredForProjectTypes: ['residential', 'commercial', 'strata', 'mixed-use', 'industrial'],
    regulatoryRole: 'Land boundary verification and strata subdivision'
  },
  {
    id: 'environmental',
    name: 'Environmental Consultant',
    icon: '🌿',
    description: 'Environmental impact assessment and sustainability consulting',
    requiredQualifications: [
      'Environmental Impact Assessment (EIA) Certification',
      'Environmental Science/Engineering Degree',
      'DOE Approved Consultant Status'
    ],
    typicalDeliverables: [
      'Environmental Impact Assessment',
      'Environmental Management Plan',
      'Sustainability Report',
      'Green Building Certification',
      'Waste Management Plan'
    ],
    requiredForProjectTypes: ['commercial', 'mixed-use', 'industrial'],
    regulatoryRole: 'Environmental approvals and DOE submissions'
  },
  {
    id: 'traffic',
    name: 'Traffic Consultant',
    icon: '🚦',
    description: 'Traffic impact assessment and transportation planning',
    requiredQualifications: [
      'Traffic Engineering Certification',
      'Transportation Planning Experience',
      'JKR/Local Authority Approved Consultant'
    ],
    typicalDeliverables: [
      'Traffic Impact Assessment',
      'Transportation Study',
      'Parking Analysis',
      'Traffic Management Plan',
      'Road Safety Audit'
    ],
    requiredForProjectTypes: ['commercial', 'mixed-use'],
    regulatoryRole: 'Traffic impact approvals and road access permits'
  }
];

export const getRequiredDisciplinesForProject = (projectType: ProjectType): ConsultantDisciplineInfo[] => {
  return CONSULTANT_DISCIPLINES.filter(discipline => 
    discipline.requiredForProjectTypes.includes(projectType)
  );
};

export const getDisciplineById = (id: string): ConsultantDisciplineInfo | undefined => {
  return CONSULTANT_DISCIPLINES.find(discipline => discipline.id === id);
};