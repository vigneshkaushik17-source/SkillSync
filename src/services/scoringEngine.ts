import { Skill, Course, JobRole, GapSeverity, CourseHealthStatus } from '../types';

/**
 * Skill Demand Score (0 - 100)
 * Weighted linear combination of signal layers:
 * - Job Postings: 45%
 * - Employer Surveys: 25%
 * - Industry Consultations: 15%
 * - Sector Growth Trend: 10%
 * - Emerging Tech Indicators: 5%
 */
export function calculateSkillDemandScore(signals: {
  jobPostings: number;
  employerSurveys: number;
  consultations: number;
  sectorGrowth: number;
  emergingTech: number;
}): number {
  const score = 
    signals.jobPostings * 0.45 +
    signals.employerSurveys * 0.25 +
    signals.consultations * 0.15 +
    signals.sectorGrowth * 0.10 +
    signals.emergingTech * 0.05;
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Skill Gap Score (0 - 100)
 * Gap = Industry Requirement - Available Candidate Talent
 */
export function calculateSkillGap(demandScore: number, supplyScore: number): number {
  return Math.max(0, demandScore - supplyScore);
}

/**
 * Determine Severity Classification
 */
export function getGapSeverity(gapScore: number): GapSeverity {
  if (gapScore < 15) return 'Aligned';
  if (gapScore < 35) return 'Needs Improvement';
  return 'Critical Gap';
}

/**
 * Priority Gap Ranking Score
 * Combines Demand, Gap Magnitude, Role Importance, and Proficiency Weight
 */
export function calculatePriorityGapScore(skill: Skill): number {
  const gap = calculateSkillGap(skill.demandScore, skill.supplyScore);
  const proficiencyMultiplier = 
    skill.requiredProficiency === 'Expert' ? 1.3 :
    skill.requiredProficiency === 'Advanced' ? 1.15 :
    skill.requiredProficiency === 'Intermediate' ? 1.0 : 0.85;

  return Math.round((skill.demandScore * 0.4 + gap * 0.6) * proficiencyMultiplier);
}

/**
 * Curriculum Alignment Score (0 - 100%)
 * Measures overlap between industry benchmark skills and syllabus depth
 */
export function calculateCurriculumAlignment(course: Course): number {
  if (!course.skillsTaught || course.skillsTaught.length === 0) return 0;
  
  const totalWeight = course.skillsTaught.reduce((acc, curr) => {
    // Proportional match: 1 - (|Industry - Curriculum| / 100)
    const match = 100 - Math.abs(curr.industryRequirement - curr.curriculumCoverage);
    return acc + Math.max(0, match);
  }, 0);

  return Math.round(totalWeight / course.skillsTaught.length);
}

/**
 * Course Health & Obsolescence Status
 * Based on Industry Demand, Graduate Supply, Placement Rate & Growth Trend
 */
export function evaluateCourseHealth(
  demandTrendPercent: number,
  placementRatePercent: number,
  alignmentScore: number,
  graduateOversupplyRatio: number // e.g. > 1.4 means oversupply
): CourseHealthStatus {
  if (demandTrendPercent < -5 && placementRatePercent < 45) {
    return 'Obsolete';
  }
  if (graduateOversupplyRatio > 1.3 && placementRatePercent < 60) {
    return 'Oversupplied';
  }
  if (alignmentScore < 65 || demandTrendPercent < 5) {
    return 'Needs Update';
  }
  return 'High Demand';
}

/**
 * Candidate Job Match Percentage
 */
export function calculateCandidateJobMatch(
  candidateSkills: { name: string; proficiency: string }[],
  jobRole: JobRole
): {
  matchPercent: number;
  matchedCount: number;
  totalRequired: number;
  missingSkills: string[];
  partialSkills: string[];
} {
  const candidateSkillMap = new Map(
    candidateSkills.map(s => [s.name.toLowerCase().trim(), s.proficiency])
  );

  let scoreSum = 0;
  let totalWeight = 0;
  const missing: string[] = [];
  const partial: string[] = [];
  let matchedCount = 0;

  jobRole.requiredSkills.forEach(req => {
    const weight = req.importance === 'Essential' ? 3 : req.importance === 'Important' ? 2 : 1;
    totalWeight += weight;

    const candProf = candidateSkillMap.get(req.skillName.toLowerCase().trim());
    if (candProf) {
      if (candProf === req.proficiency || candProf === 'Expert') {
        scoreSum += weight * 1.0;
        matchedCount++;
      } else {
        scoreSum += weight * 0.6; // partial proficiency
        partial.push(req.skillName);
        matchedCount++;
      }
    } else {
      missing.push(req.skillName);
    }
  });

  const matchPercent = totalWeight > 0 ? Math.round((scoreSum / totalWeight) * 100) : 0;

  return {
    matchPercent,
    matchedCount,
    totalRequired: jobRole.requiredSkills.length,
    missingSkills: missing,
    partialSkills: partial,
  };
}
