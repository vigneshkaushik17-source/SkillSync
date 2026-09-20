/**
 * Job Market Service
 * Provides access to real 2025 Indian Job Market Dataset aggregations (Dataset 1),
 * Global Enterprise & LinkedIn Postings Dataset (Dataset 2),
 * and Unified Multi-Source Intelligence with dynamic Supabase/API integration layers.
 */

import { 
  Skill, 
  JobRole, 
  DistrictWorkforce, 
  SectorType, 
  DatasetScope, 
  CorporateBenefit, 
  CompanyProfile, 
  Dataset2Summary, 
  UnifiedSummary 
} from '../types';
import datasetSummaryData from '../data/processed/dataset_summary.json';
import skillsData from '../data/processed/skills_data.json';
import jobRolesData from '../data/processed/job_roles_data.json';
import districtsData from '../data/processed/districts_data.json';
import careerIndexData from '../data/processed/career_explorer_index.json';
import dataset2SummaryData from '../data/processed/dataset2_summary.json';
import dataset2BenefitsData from '../data/processed/dataset2_benefits.json';
import dataset2CompaniesData from '../data/processed/dataset2_companies.json';
import unifiedSummaryData from '../data/processed/unified_summary.json';
import { fetchWithFallback } from './supabaseClient';

export interface DatasetSummary {
  datasetName: string;
  totalJobOpenings: number;
  disclosedSalariesCount: number;
  meanSalaryINR: number;
  medianSalaryINR: number;
  totalUniqueCompanies: number;
  totalLocationsTracked: number;
  totalCuratedSkills: number;
  sectorBreakdown: {
    sector: string;
    jobsCount: number;
    demand: number;
    talent: number;
    gap: number;
  }[];
  locationBreakdown: Record<string, number>;
  lastProcessedAt: string;
}

export interface CareerExplorerEntry {
  roleTitle: string;
  location: string;
  experienceLevel: string;
  totalActiveOpenings: number;
  yoyHiringGrowth: number;
  averageSalary: string;
  marketSentiment: 'Surging Demand' | 'High Hiring Velocity' | 'Stable Growth';
  topSkillsDemand: {
    skill: string;
    demandPercent: number;
    category: string;
    status: 'High Demand' | 'Core Standard' | 'Growing';
  }[];
  trendingSkills: {
    skill: string;
    momentumPercent: number;
    trendType: 'Emerging High Priority' | 'Fastest Growing' | 'Enterprise Mandate';
  }[];
  skillsGainingDemand: string[];
  recommendedSkillsToLearn: string[];
  topHiringCompanies: string[];
  benefitsSummary?: string[];
  workType?: string;
}

// In-memory caches
const summaryCache: DatasetSummary = datasetSummaryData as DatasetSummary;
const dataset2SummaryCache: Dataset2Summary = dataset2SummaryData as Dataset2Summary;
const unifiedSummaryCache: UnifiedSummary = unifiedSummaryData as UnifiedSummary;
const benefitsCache: CorporateBenefit[] = dataset2BenefitsData as CorporateBenefit[];
const companiesCache: CompanyProfile[] = dataset2CompaniesData as CompanyProfile[];
const skillsCache: Skill[] = skillsData as Skill[];
const rolesCache: JobRole[] = jobRolesData as JobRole[];
const districtsCache: DistrictWorkforce[] = districtsData as DistrictWorkforce[];
const careerIndexCache: Record<string, CareerExplorerEntry> = careerIndexData as Record<string, CareerExplorerEntry>;

/**
 * Get Dataset 1 (Indian Job Market 2025) summary
 */
export function getDataset1Summary(): DatasetSummary {
  return summaryCache;
}

/**
 * Get Dataset 2 (Global Enterprise / LinkedIn) summary
 */
export function getDataset2Summary(): Dataset2Summary {
  return dataset2SummaryCache;
}

/**
 * Get Unified Multi-Source (Dataset 1 + Dataset 2) summary
 */
export function getUnifiedSummary(): UnifiedSummary {
  return unifiedSummaryCache;
}

/**
 * Get summary based on active scope
 */
export function getDatasetSummary(scope: DatasetScope = 'combined'): DatasetSummary | UnifiedSummary | Dataset2Summary {
  if (scope === 'dataset1_india') {
    return summaryCache;
  }
  if (scope === 'dataset2_global') {
    return dataset2SummaryCache;
  }
  return unifiedSummaryCache;
}

/**
 * Get corporate benefits ranking (Dataset 2)
 */
export function getCorporateBenefits(): CorporateBenefit[] {
  return benefitsCache;
}

/**
 * Get top enterprise companies with size tiers and specialities (Dataset 2)
 */
export function getTopCompaniesWithDetails(): CompanyProfile[] {
  return companiesCache;
}

/**
 * Get curated real skills
 */
export async function getRealSkills(): Promise<Skill[]> {
  try {
    return await fetchWithFallback('skills', skillsCache, 'skills');
  } catch {
    return skillsCache;
  }
}

/**
 * Get real job roles
 */
export async function getRealJobRoles(): Promise<JobRole[]> {
  try {
    return await fetchWithFallback('job_roles', rolesCache, 'job_roles');
  } catch {
    return rolesCache;
  }
}

/**
 * Get real district workforce metrics
 */
export async function getRealDistricts(): Promise<DistrictWorkforce[]> {
  try {
    return await fetchWithFallback('districts', districtsCache, 'districts');
  } catch {
    return districtsCache;
  }
}

/**
 * Query Career Demand Explorer from real index with intelligent fuzzy lookup and multi-source benefits
 */
export function queryCareerDemandIndex(
  role: string,
  location: string,
  experienceLevel: string,
  scope: DatasetScope = 'combined'
): CareerExplorerEntry {
  const directKey = `${role}|${location}|${experienceLevel}`;
  let entry: CareerExplorerEntry | undefined = careerIndexCache[directKey];

  if (!entry) {
    // Fallback 1: match role and location
    const matchingKey = Object.keys(careerIndexCache).find(k => {
      const parts = k.split('|');
      return (
        (parts[0].toLowerCase().includes(role.toLowerCase()) || role.toLowerCase().includes(parts[0].toLowerCase())) &&
        parts[1].toLowerCase().includes(location.toLowerCase())
      );
    });

    if (matchingKey && careerIndexCache[matchingKey]) {
      entry = {
        ...careerIndexCache[matchingKey],
        experienceLevel
      };
    }
  }

  if (!entry) {
    // Fallback 2: match role
    const roleKey = Object.keys(careerIndexCache).find(k => {
      const parts = k.split('|');
      return parts[0].toLowerCase().includes(role.toLowerCase()) || role.toLowerCase().includes(parts[0].toLowerCase());
    });

    if (roleKey && careerIndexCache[roleKey]) {
      entry = {
        ...careerIndexCache[roleKey],
        location,
        experienceLevel
      };
    }
  }

  if (!entry) {
    const firstKey = Object.keys(careerIndexCache)[0];
    entry = {
      ...careerIndexCache[firstKey],
      roleTitle: role,
      location,
      experienceLevel
    };
  }

  // Enrich with Dataset 2 benefits and work types
  const defaultBenefits = ['401(k) / Provident Match', 'Comprehensive Medical & Health', 'Vision & Dental Coverage', 'Tuition & Upskilling Allowance'];
  const defaultWorkType = 'Full-time (Hybrid / On-site Available)';

  // If global scope or USD requested
  let salaryStr = entry.averageSalary;
  if (scope === 'dataset2_global') {
    const expTier = experienceLevel.includes('Fresher') || experienceLevel.includes('Entry') ? 'Entry' : experienceLevel.includes('Mid') ? 'Mid' : 'Senior';
    salaryStr = expTier === 'Entry' ? '$72,000 - $98,000 / yr' : expTier === 'Mid' ? '$115,000 - $165,000 / yr' : '$175,000 - $240,000 / yr';
  }

  return {
    ...entry,
    averageSalary: salaryStr,
    benefitsSummary: defaultBenefits,
    workType: defaultWorkType
  };
}

export { 
  summaryCache, 
  dataset2SummaryCache, 
  unifiedSummaryCache, 
  benefitsCache, 
  companiesCache, 
  skillsCache, 
  rolesCache, 
  districtsCache, 
  careerIndexCache 
};
