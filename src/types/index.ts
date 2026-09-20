export type SectorType = 
  | 'All Sectors'
  | 'IT & Tech'
  | 'Manufacturing & EV'
  | 'Healthcare'
  | 'Agriculture & AgriTech'
  | 'Tourism & Hospitality'
  | 'BFSI'
  | 'Retail & E-commerce'
  | 'Logistics & Supply Chain';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type GapSeverity = 'Aligned' | 'Needs Improvement' | 'Critical Gap';

export type CourseHealthStatus = 'High Demand' | 'Needs Update' | 'Oversupplied' | 'Obsolete';

export type CurriculumActionType = 'Keep' | 'Update' | 'Remove' | 'Add';

export interface Skill {
  id: string;
  name: string;
  category: 'Technical' | 'AI & Data' | 'Cloud & DevOps' | 'Domain Specific' | 'Soft Skills' | 'Emerging Tech';
  sector: SectorType;
  demandScore: number; // 0 - 100
  supplyScore: number; // 0 - 100
  growthRate: number; // e.g. +18.5%
  jobOpenings: number;
  requiredProficiency: ProficiencyLevel;
  associatedRoles: string[];
  associatedIndustries: string[];
  topDistricts: string[];
  signals: {
    jobPostingsWeight: number;      // 45%
    employerSurveysWeight: number;   // 25%
    consultationsWeight: number;     // 15%
    sectorGrowthWeight: number;      // 10%
    emergingTechWeight: number;      // 5%
  };
  validatedByEmployersCount: number;
  lastUpdated: string;
}

export interface JobRole {
  id: string;
  title: string;
  sector: SectorType;
  openings: number;
  growthRate: number;
  matchScore: number; // benchmark
  avgSalary: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  requiredSkills: {
    skillName: string;
    importance: 'Essential' | 'Important' | 'Nice to have';
    proficiency: ProficiencyLevel;
    status: 'Matched' | 'Partial' | 'Missing';
  }[];
  locations: string[];
  validatedByIndustry: boolean;
  activeHiringCompanies: string[];
}

export interface CurriculumSkillComparison {
  skillName: string;
  industryRequirement: number; // 0-100
  curriculumCoverage: number;   // 0-100
  gap: number;
  status: CurriculumActionType;
  recommendationNote: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  institution: string;
  sector: SectorType;
  level: 'Vocational/Diploma' | 'Undergraduate' | 'Postgraduate' | 'Certification';
  alignmentScore: number; // 0-100
  healthStatus: CourseHealthStatus;
  enrolledStudents: number;
  graduatesAnnual: number;
  placementRate: number; // %
  employerSatisfaction: number; // 1-5
  durationWeeks: number;
  skillsTaught: CurriculumSkillComparison[];
  recommendedActions: {
    type: CurriculumActionType;
    skill: string;
    reason: string;
  }[];
}

export interface DistrictWorkforce {
  id: string;
  name: string;
  state: string;
  sector: SectorType;
  demandScore: number;
  talentSupplyScore: number;
  skillGapScore: number;
  activeJobDemand: number;
  unemployedTrainedYouth: number;
  trainingCapacity: number;
  placementRate: number;
  trainersRequired: number;
  trainersAvailable: number;
  labsRequired: number;
  labsAvailable: number;
  equipmentShortageItems: string[];
  highDemandRoles: string[];
  prioritySkills: string[];
  recommendedPlan: {
    batchesToAdd: number;
    trainersToRecruit: number;
    equipmentPrescriptions: string[];
    partnerIndustries: string[];
  };
}

export interface LearningPathwayItem {
  id: string;
  skillName: string;
  requiredQualification: string;
  recommendedCourse: string;
  courseProvider: string;
  estimatedDuration: string;
  difficulty: ProficiencyLevel;
  completionRate: number;
  placementOutcomeRate: number;
  associatedSector: SectorType;
}

export interface EmployerValidation {
  id: string;
  companyName: string;
  representative: string;
  role: string;
  industry: SectorType;
  action: 'Validate Skill' | 'Validate Role' | 'Suggest Skill' | 'Report Outdated Skill';
  targetItem: string;
  comment: string;
  timestamp: string;
  status: 'Approved' | 'Under Review' | 'Verified';
}

export interface AIPredictionResult {
  currentMarketValue: string;
  projected1YearSalary: string;
  projected3YearSalary: string;
  potentialSalaryUpliftPercent: number;
  marketReadinessScore: number;
  urgencyLevel: 'High ROI Growth' | 'Immediate Upskilling Needed' | 'Strong Market Premium';
  criticalSkillsToLearn: {
    skill: string;
    category: string;
    impactOnSalary: string;
    estimatedTimeToMaster: string;
    reason: string;
  }[];
  strategicAdvice: string;
  recommendedCertifications: string[];
  careerTrajectorySummary: string;
  generatedAt: string;
}

export interface CandidateProfileState {
  fullName: string;
  email: string; // Candidate Gmail / Work email
  age: number;
  education: string;
  experienceYears: number;
  industryDomain: string;
  internships: string;
  salaryExpectation: string; // e.g. "₹12,00,000 / yr" or "₹12 LPA"
  desiredRole: string;
  preferredLocation: string;
  skills: {
    name: string;
    proficiency: ProficiencyLevel;
    verified: boolean;
  }[];
  certifications: string[];
  aiPrediction?: AIPredictionResult;
}

export type DatasetScope = 'combined' | 'dataset1_india' | 'dataset2_global';

export interface CorporateBenefit {
  benefit: string;
  count: number;
  percentage: number;
}

export interface CompanyProfile {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  sizeCategory: string;
  employeeCount: number;
  followerCount: number;
  specialities: string[];
  industries: string[];
}

export interface Dataset2Summary {
  datasetId: string;
  datasetName: string;
  totalJobOpenings: number;
  totalUniqueCompanies: number;
  disclosedSalariesCount: number;
  meanSalaryUSD: number;
  medianSalaryUSD: number;
  topLocations: { location: string; postings: number }[];
  workTypeDistribution: { type: string; count: number; percentage: number }[];
  experienceLevelDistribution: { level: string; count: number; percentage: number }[];
  topBenefits: CorporateBenefit[];
  companySizeDistribution: { tier: string; percentage: number; description: string }[];
  lastProcessedAt: string;
}

export interface UnifiedSummary {
  datasetName: string;
  totalJobOpenings: number;
  totalUniqueCompanies: number;
  disclosedSalariesCount: number;
  dataSources: {
    id: string;
    name: string;
    postingsCount: number;
    companiesCount: number;
    primaryCurrency: string;
    avgSalary: string;
    coverage: string;
  }[];
  workTypeDistribution: { type: string; count: number; percentage: number }[];
  topBenefits: CorporateBenefit[];
  companySizeDistribution: { tier: string; percentage: number; description: string }[];
  lastProcessedAt: string;
}

export interface UserFilterState {
  sector: SectorType;
  stateDistrict: string;
  timeframe: 'Current Quarter' | 'Past 12 Months' | 'Next 2 Years Projection';
  searchQuery: string;
  datasetScope: DatasetScope;
}
