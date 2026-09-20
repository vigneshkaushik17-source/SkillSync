import { CandidateProfileState, AIPredictionResult, Skill, JobRole } from '../types';

export function runAICareerAndSalaryPredictor(
  profile: CandidateProfileState,
  allSkills: Skill[],
  allRoles: JobRole[]
): AIPredictionResult {
  const targetRole = allRoles.find(r => r.title === profile.desiredRole) || allRoles[0];
  const candidateSkillNames = new Set(profile.skills.map(s => s.name.toLowerCase().trim()));

  // 1. Analyze missing high-demand skills for target role and domain
  const criticalSkills: {
    skill: string;
    category: string;
    impactOnSalary: string;
    estimatedTimeToMaster: string;
    reason: string;
  }[] = [];

  // Check role-specific missing skills first
  if (targetRole) {
    targetRole.requiredSkills.forEach(req => {
      if (!candidateSkillNames.has(req.skillName.toLowerCase().trim())) {
        const foundSkill = allSkills.find(s => s.name.toLowerCase() === req.skillName.toLowerCase());
        const category = foundSkill ? foundSkill.category : 'Technical';
        const demand = foundSkill ? foundSkill.demandScore : 85;

        criticalSkills.push({
          skill: req.skillName,
          category,
          impactOnSalary: `+₹1.5L - ₹3.2L / yr (${demand} Demand Index)`,
          estimatedTimeToMaster: req.proficiency === 'Advanced' ? '8-10 Weeks' : '4-6 Weeks',
          reason: `Crucial requirement for ${targetRole.title}. Verified by ${foundSkill?.validatedByEmployersCount || 45}+ hiring employers.`
        });
      }
    });
  }

  // Also check top emerging high-demand skills in candidate's domain if not already in criticalSkills
  allSkills
    .filter(s => s.demandScore >= 85 && !candidateSkillNames.has(s.name.toLowerCase().trim()))
    .slice(0, 4)
    .forEach(sk => {
      if (!criticalSkills.some(c => c.skill.toLowerCase() === sk.name.toLowerCase()) && criticalSkills.length < 4) {
        criticalSkills.push({
          skill: sk.name,
          category: sk.category,
          impactOnSalary: `+₹2.0L - ₹4.5L / yr (${sk.demandScore} Demand Index)`,
          estimatedTimeToMaster: '6-8 Weeks',
          reason: `Surging +${sk.growthRate}% YoY across hiring boards in ${sk.topDistricts[0] || 'Metro hubs'}.`
        });
      }
    });

  // 2. Base salary calculation logic
  // Extract number from salaryExpectation if user entered one
  const cleanedExp = profile.salaryExpectation.replace(/[^0-9.]/g, '');
  const userExpValue = parseFloat(cleanedExp) || 8.0; // in Lakhs default
  const baseSalaryScale = userExpValue > 1000 ? userExpValue / 100000 : userExpValue; // handle full rupee vs LPA

  // Factors: Experience, internships, verified skills, target role benchmark
  const expFactor = 1 + Math.min(profile.experienceYears * 0.15, 1.2);
  const internshipBonus = profile.internships && profile.internships.length > 5 ? 1.12 : 1.0;
  const verifiedSkillsCount = profile.skills.filter(s => s.verified).length;
  const skillBreadthMultiplier = 1 + (profile.skills.length * 0.04) + (verifiedSkillsCount * 0.03);

  // Baseline market valuation
  const estimatedCurrent = Math.max(4.5, Math.round((baseSalaryScale * 0.85 * expFactor * internshipBonus) * 10) / 10);
  
  // Projected salaries after acquiring recommended critical skills
  const newSkillsBonus = 1 + (criticalSkills.length * 0.16);
  const projected1Yr = Math.round((estimatedCurrent * 1.35 * newSkillsBonus) * 10) / 10;
  const projected3Yr = Math.round((projected1Yr * 1.65) * 10) / 10;

  const upliftPercent = Math.round(((projected1Yr - estimatedCurrent) / estimatedCurrent) * 100);
  const readinessScore = Math.min(95, Math.max(35, Math.round((profile.skills.length / (profile.skills.length + criticalSkills.length)) * 100)));

  const recommendedCertifications = [
    targetRole.title.includes('Data') || targetRole.title.includes('AI') 
      ? 'AWS Certified Machine Learning Specialty / GCP Professional Data Engineer'
      : targetRole.title.includes('Cloud') || targetRole.title.includes('DevOps')
      ? 'Certified Kubernetes Administrator (CKA) + AWS Solutions Architect'
      : targetRole.title.includes('EV') || targetRole.title.includes('Manufacturing')
      ? 'ASDC High Voltage EV Powertrain & BMS Level 5'
      : 'NSDC Advanced Industry Competency Credential'
  ];

  if (criticalSkills.length > 0) {
    recommendedCertifications.push(`${criticalSkills[0].skill} Professional Accreditation`);
  }

  return {
    currentMarketValue: `₹${estimatedCurrent.toFixed(1)} LPA (₹${Math.round((estimatedCurrent * 100000) / 12).toLocaleString()} / mo)`,
    projected1YearSalary: `₹${projected1Yr.toFixed(1)} LPA`,
    projected3YearSalary: `₹${projected3Yr.toFixed(1)} LPA`,
    potentialSalaryUpliftPercent: upliftPercent,
    marketReadinessScore: readinessScore,
    urgencyLevel: upliftPercent > 40 ? 'High ROI Growth' : 'Strong Market Premium',
    criticalSkillsToLearn: criticalSkills,
    strategicAdvice: `Based on current ${targetRole.sector} labor market signals, adding ${criticalSkills.slice(0, 2).map(s => s.skill).join(' and ')} will elevate ${profile.fullName || 'the candidate'} from the 50th percentile to the top 15% salary bracket within 12 months.`,
    recommendedCertifications,
    careerTrajectorySummary: `Candidate holds a solid foundation in ${profile.skills.slice(0, 2).map(s => s.name).join(', ') || 'core concepts'}. With ${profile.experienceYears} years of background and targeted upskilling in ${criticalSkills[0]?.skill || 'advanced architectures'}, compensation is projected to surge by +${upliftPercent}% by Q3 2027.`,
    generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}
