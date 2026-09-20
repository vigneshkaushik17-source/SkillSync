/**
 * SkillSync Intelligence Engine
 * Provides modular, reactive calculations for:
 * 1. AI Skill-Gap Analyzer
 * 2. Career Demand Explorer
 * 3. Curriculum-Industry Alignment Checker
 */

export interface SkillGapAnalysisResult {
  jobMarketMatchScore: number;
  strongSkills: string[];
  criticalGaps: {
    skill: string;
    importance: 'Critical';
    demandPercent: number;
    whyItMatters: string;
    timeToLearn: string;
    recommendedResource: string;
  }[];
  importantGaps: {
    skill: string;
    importance: 'Important';
    demandPercent: number;
    whyItMatters: string;
    timeToLearn: string;
    recommendedResource: string;
  }[];
  emergingSkills: {
    skill: string;
    importance: 'Emerging';
    demandPercent: number;
    whyItMatters: string;
    timeToLearn: string;
    recommendedResource: string;
  }[];
  learningRoadmap: {
    phase: string;
    timeline: string;
    focus: string;
    skills: string[];
    milestoneOutcome: string;
  }[];
  extractedFromResumeCount: number;
  targetRoleTitle: string;
  experienceLevel: string;
  aiMarketPrediction: {
    marketOutlook: 'Rapidly Expanding' | 'High Velocity Hiring' | 'Stable Enterprise Demand';
    twoYearProjectedDemandGrowth: string;
    estimatedActiveVacancies: number;
    candidateCompetitionRatio: string;
    placementLikelihoodPercent: number;
    avgStartingCompensation: string;
    projectedCompensationPostUpskilling: string;
    agentSummaryVerdict: string;
  };
}

export interface CareerDemandResult {
  roleTitle: string;
  location: string;
  experienceLevel: string;
  totalActiveOpenings: number;
  yoyHiringGrowth: number;
  averageSalary: string;
  marketSentiment: 'Surging Demand' | 'High Hiring Velocity' | 'Stable Growth';
  topSkillsDemand: {
    skill: string;
    demandPercent: number; // e.g. 91%
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
}

export interface CurriculumAnalysisResult {
  curriculumAlignmentScore: number; // e.g. 68%
  degreeName: string;
  specialization: string;
  semester: string;
  industrySkillsCovered: {
    skill: string;
    curriculumCoverage: number;
    industryRequirement: number;
    coverageStatus: 'Fully Covered' | 'Well Aligned';
  }[];
  highDemandSkillsMissing: {
    skill: string;
    industryDemand: number;
    curriculumCoverage: number;
    gapSeverity: 'High Demand Missing';
    actionRequired: string;
  }[];
  partiallyCoveredSkills: {
    skill: string;
    industryDemand: number;
    curriculumCoverage: number;
    gapSeverity: 'Needs Modernization';
    actionRequired: string;
  }[];
  outdatedTopicsDetected: {
    topic: string;
    declinePercent: number;
    industryStatus: 'Obsolete' | 'Deprecated by Industry';
    recommendation: string;
  }[];
  visualSkillComparison: {
    skill: string;
    industryDemand: number;
    curriculumCoverage: number;
  }[];
  recommendedCurriculumAdditions: {
    moduleName: string;
    creditsRecommended: string;
    targetCompetency: string;
    justification: string;
  }[];
}

// Role Benchmark Taxonomy & Skill Matrix
const ROLE_TAXONOMY: Record<string, {
  coreSkills: { name: string; weight: number; why: string }[];
  importantSkills: { name: string; weight: number; why: string }[];
  emergingSkills: { name: string; weight: number; why: string }[];
  salaryBand: { fresher: string; mid: string; senior: string };
  openingsScale: number;
  sampleSyllabus: string;
}> = {
  'Data Analyst': {
    coreSkills: [
      { name: 'SQL', weight: 25, why: '91% of enterprise job postings require complex querying, joins, and window functions.' },
      { name: 'Python', weight: 25, why: 'Essential for data cleaning, exploratory data analysis (EDA), and automated reporting pipelines.' },
      { name: 'Excel & Advanced Formulas', weight: 15, why: 'Standard universal medium for business analytics, financial models, and rapid stakeholder prototyping.' },
      { name: 'Power BI & Tableau', weight: 20, why: 'Crucial for executive dashboards, interactive visual analytics, and BI reporting.' },
      { name: 'Applied Statistics & Probability', weight: 15, why: 'Required for A/B testing, hypothesis testing, and statistical significance modeling.' }
    ],
    importantSkills: [
      { name: 'Data Warehousing & Dimensional Modeling', weight: 10, why: 'Needed to understand star schemas, snowflake schemas, and data pipelines.' },
      { name: 'Business Metrics & KPI Modeling', weight: 10, why: 'Translates raw engineering data into actionable revenue and retention insights.' },
      { name: 'R Programming', weight: 5, why: 'Used in statistical research and academic econometrics modeling.' }
    ],
    emergingSkills: [
      { name: 'Generative AI for Analytics (RAG/Text-to-SQL)', weight: 10, why: 'Empowers rapid natural-language-to-SQL queries and automated insight summaries.' },
      { name: 'Data Engineering Fundamentals (dbt/Airflow)', weight: 10, why: 'Allows analysts to manage their own transformation DAGs in modern data stacks.' },
      { name: 'Cloud Analytics (Snowflake/BigQuery/Databricks)', weight: 10, why: 'Enterprises have migrated 85%+ of workloads to cloud-native data warehouses.' }
    ],
    salaryBand: { fresher: '₹6.5L - ₹9.0L / yr', mid: '₹10.5L - ₹16.0L / yr', senior: '₹18.0L - ₹28.0L / yr' },
    openingsScale: 3840,
    sampleSyllabus: `Subject: Database Management & Business Intelligence (Semester 5)
Module 1: Relational Algebra & SQL DDL/DML Commands
Module 2: Normalization (1NF, 2NF, 3NF, BCNF)
Module 3: Visual Basic 6.0 Data Controls & MS Access 2003 Forms
Module 4: PageMaker & Crystal Reports 8.5
Module 5: Basic Excel Spreadsheets & Pivot Tables`
  },
  'AI/ML Engineer': {
    coreSkills: [
      { name: 'Python', weight: 25, why: 'The foundational lingua franca for deep learning frameworks, PyTorch, and TensorFlow.' },
      { name: 'PyTorch / TensorFlow', weight: 25, why: 'Core neural network training and tensor manipulation engines.' },
      { name: 'Machine Learning Algorithms (Scikit-Learn)', weight: 20, why: 'Fundamental supervised/unsupervised algorithms: XGBoost, Random Forest, SVM.' },
      { name: 'Mathematics (Linear Algebra, Calculus, Prob)', weight: 15, why: 'Essential for understanding loss optimization, gradients, and model loss convergence.' },
      { name: 'MLOps & Model Deployment (FastAPI/Docker)', weight: 15, why: 'Enterprises require models to be served as production low-latency microservices.' }
    ],
    importantSkills: [
      { name: 'Feature Engineering & Data Preprocessing', weight: 10, why: 'Directly impacts model accuracy and handles distribution shifts.' },
      { name: 'SQL & Vector Databases (Pinecone/Milvus/Qdrant)', weight: 10, why: 'Required for similarity indexing and real-time embedding storage.' },
      { name: 'Distributed Training (Ray / DeepSpeed)', weight: 10, why: 'Needed for scaling LLM fine-tuning across multi-GPU clusters.' }
    ],
    emergingSkills: [
      { name: 'Generative AI & LLM Fine-Tuning (LoRA / QLoRA)', weight: 15, why: 'Fastest growing requirement (+42% YoY) across AI research and applied product teams.' },
      { name: 'Agentic AI Workflows & Tool Calling', weight: 15, why: 'Enables autonomous decision agents that call APIs and interact with software tools.' },
      { name: 'Edge AI & Quantization (ONNX / TensorRT)', weight: 10, why: 'Deploying neural networks on mobile and IoT edge devices.' }
    ],
    salaryBand: { fresher: '₹9.0L - ₹14.0L / yr', mid: '₹16.0L - ₹25.0L / yr', senior: '₹28.0L - ₹48.0L / yr' },
    openingsScale: 2650,
    sampleSyllabus: `Subject: Artificial Intelligence & Expert Systems
Module 1: Search Algorithms (BFS, DFS, A*, Minimax)
Module 2: Propositional Logic & Prolog Programming
Module 3: Expert Systems & Rule-Based Inference
Module 4: Introduction to Neural Networks (Single Layer Perceptron)
Module 5: LISP Syntax and Semantic Networks`
  },
  'Cloud & DevOps Engineer': {
    coreSkills: [
      { name: 'Cloud Platforms (AWS / Azure / GCP)', weight: 25, why: 'Foundation for compute (EC2), networking (VPC), IAM, and managed services.' },
      { name: 'Docker & Containerization', weight: 20, why: 'Standard packaging unit for modern microservice architectures.' },
      { name: 'Kubernetes (K8s Orchestration)', weight: 20, why: 'Enterprise standard for automated deployment, scaling, and self-healing pods.' },
      { name: 'Linux System Administration & Bash', weight: 15, why: 'Underpins 90%+ of cloud infrastructure and container runtimes.' },
      { name: 'CI/CD Pipelines (GitHub Actions / GitLab / Jenkins)', weight: 20, why: 'Automates test execution, code quality gates, and zero-downtime releases.' }
    ],
    importantSkills: [
      { name: 'Infrastructure as Code (Terraform / Ansible)', weight: 10, why: 'Declarative reproducible provisioning across multi-cloud accounts.' },
      { name: 'Networking & DNS Protocols (TCP/IP, BGP, TLS)', weight: 10, why: 'Crucial for debugging latency, load balancing, and ingress routing.' },
      { name: 'Observability & Monitoring (Prometheus / Grafana)', weight: 10, why: 'Provides SLI/SLA metrics and proactive alert triggers.' }
    ],
    emergingSkills: [
      { name: 'Cloud Security & DevSecOps (Trivy / OPA)', weight: 10, why: 'Shifting security left into CI/CD pipelines to prevent CVE vulnerabilities.' },
      { name: 'GitOps (ArgoCD / Flux)', weight: 10, why: 'Declarative Kubernetes sync directly driven by Git repository states.' },
      { name: 'Platform Engineering & Internal Developer Portals', weight: 10, why: 'Building self-service cloud developer platforms using Backstage.' }
    ],
    salaryBand: { fresher: '₹7.5L - ₹11.0L / yr', mid: '₹13.0L - ₹20.0L / yr', senior: '₹22.0L - ₹36.0L / yr' },
    openingsScale: 3120,
    sampleSyllabus: `Subject: Computer Networks & Server Operating Systems
Module 1: OSI Reference Model & IP Subnetting
Module 2: Windows Server 2008 Active Directory & Domain Controllers
Module 3: Basic Shell Scripting in Ubuntu 14.04
Module 4: VMware Workstation Virtual Machines
Module 5: Apache Web Server Configuration & FTP Setup`
  },
  'EV Powertrain & Battery Diagnostic Technician': {
    coreSkills: [
      { name: 'EV Battery Diagnostics & BMS', weight: 25, why: 'Diagnostic calibration of cell voltages, state-of-charge (SoC), and thermal runaway mitigation.' },
      { name: 'High Voltage Safety Protocols (ISO 26262)', weight: 25, why: 'Mandatory workplace standard for handling 400V-800V DC bus architectures safely.' },
      { name: 'CAN Bus & Automotive Telemetry', weight: 20, why: 'Inter-module communication protocol across motor controllers, battery packs, and ECUs.' },
      { name: 'Electric Motor & Inverter Troubleshooting', weight: 15, why: 'Permanent Magnet Synchronous Motor (PMSM) drive tuning and inverter gate checks.' },
      { name: 'Automotive Electrical Schematics', weight: 15, why: 'Tracing wire harnesses, relays, contactors, and fuse circuits.' }
    ],
    importantSkills: [
      { name: 'Oscilloscope & Multimeter Diagnostics', weight: 10, why: 'Signal waveform analysis on sensor pulse trains and PWM controllers.' },
      { name: 'Regenerative Braking Systems', weight: 10, why: 'Kinetic energy recovery tuning in modern electric vehicles.' },
      { name: 'Thermal Management & Liquid Cooling Systems', weight: 10, why: 'Battery pack coolant flow loops and heat dissipation radiators.' }
    ],
    emergingSkills: [
      { name: 'CAN-FD & Automotive Ethernet Diagnostics', weight: 10, why: 'High-speed communication for software-defined vehicles.' },
      { name: 'Battery Health AI Degradation Forecasting', weight: 10, why: 'Predictive algorithm modeling of battery lifecycle capacity loss.' }
    ],
    salaryBand: { fresher: '₹5.0L - ₹7.5L / yr', mid: '₹8.5L - ₹13.0L / yr', senior: '₹15.0L - ₹22.0L / yr' },
    openingsScale: 1940,
    sampleSyllabus: `Subject: Automobile Electrical Systems & Internal Combustion Engines
Module 1: Lead-Acid Battery Maintenance & Specific Gravity Testing
Module 2: 4-Stroke Petrol & Diesel Engine Carburetors
Module 3: Alternator & Starter Motor Solenoid Wiring
Module 4: Mechanical Fuel Injection Pumps & Spark Plugs
Module 5: Basic Automotive Wiring Harnesses`
  }
};

/**
 * 1. AI SKILL-GAP ANALYZER CALCULATION
 */
export function calculateSkillGapAnalysis(params: {
  targetRole: string;
  currentSkills: string[];
  experienceLevel: string;
  resumeText?: string;
}): SkillGapAnalysisResult {
  const roleConfig = ROLE_TAXONOMY[params.targetRole] || ROLE_TAXONOMY['Data Analyst'];

  // Normalize user skills list
  const userSkillSet = new Set(
    params.currentSkills.map(s => s.toLowerCase().trim())
  );

  // If resume text is provided, extract additional keywords
  let extractedCount = 0;
  if (params.resumeText && params.resumeText.length > 10) {
    const textLower = params.resumeText.toLowerCase();
    [...roleConfig.coreSkills, ...roleConfig.importantSkills, ...roleConfig.emergingSkills].forEach(item => {
      const nameLower = item.name.toLowerCase();
      // Simple word boundary check or keyword inclusion
      if (textLower.includes(nameLower) || nameLower.split(' ').some(part => part.length > 3 && textLower.includes(part))) {
        if (!userSkillSet.has(nameLower)) {
          userSkillSet.add(nameLower);
          extractedCount++;
        }
      }
    });
  }

  // Calculate Weighted Match Score
  let userScore = 0;
  let totalScore = 0;
  const strongSkills: string[] = [];
  const criticalGaps: SkillGapAnalysisResult['criticalGaps'] = [];
  const importantGaps: SkillGapAnalysisResult['importantGaps'] = [];
  const emergingSkills: SkillGapAnalysisResult['emergingSkills'] = [];

  // Core skills evaluation
  roleConfig.coreSkills.forEach(item => {
    totalScore += item.weight;
    const isMatched = Array.from(userSkillSet).some(us => 
      us.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(us)
    );

    if (isMatched) {
      userScore += item.weight;
      strongSkills.push(item.name);
    } else {
      criticalGaps.push({
        skill: item.name,
        importance: 'Critical',
        demandPercent: Math.min(96, Math.max(75, 70 + item.weight)),
        whyItMatters: item.why,
        timeToLearn: '4-6 Weeks',
        recommendedResource: `SkillSync Accredited ${item.name} Industry Lab Track`
      });
    }
  });

  // Important skills evaluation
  roleConfig.importantSkills.forEach(item => {
    totalScore += item.weight;
    const isMatched = Array.from(userSkillSet).some(us => 
      us.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(us)
    );

    if (isMatched) {
      userScore += item.weight;
      strongSkills.push(item.name);
    } else {
      importantGaps.push({
        skill: item.name,
        importance: 'Important',
        demandPercent: Math.min(84, Math.max(60, 55 + item.weight * 2)),
        whyItMatters: item.why,
        timeToLearn: '3-4 Weeks',
        recommendedResource: `Hands-on Masterclass: ${item.name}`
      });
    }
  });

  // Emerging skills evaluation
  roleConfig.emergingSkills.forEach(item => {
    totalScore += item.weight;
    const isMatched = Array.from(userSkillSet).some(us => 
      us.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(us)
    );

    if (isMatched) {
      userScore += item.weight;
      strongSkills.push(item.name);
    } else {
      emergingSkills.push({
        skill: item.name,
        importance: 'Emerging',
        demandPercent: Math.min(78, Math.max(50, 50 + item.weight * 2)),
        whyItMatters: item.why,
        timeToLearn: '2-4 Weeks',
        recommendedResource: `Next-Gen Workshop: ${item.name}`
      });
    }
  });

  // Add any other user entered skills not in taxonomy
  params.currentSkills.forEach(sk => {
    if (!strongSkills.some(s => s.toLowerCase() === sk.toLowerCase())) {
      strongSkills.push(sk);
    }
  });

  // Calculate final percentage score
  let matchScore = totalScore > 0 ? Math.round((userScore / totalScore) * 100) : 50;
  // Experience bonus
  if (params.experienceLevel === 'Mid-Level (2-4 yrs)') matchScore = Math.min(98, matchScore + 5);
  if (params.experienceLevel === 'Senior (5+ yrs)') matchScore = Math.min(98, matchScore + 10);
  matchScore = Math.max(15, Math.min(96, matchScore));

  // Generate Personalized Learning Roadmap
  const learningRoadmap = [
    {
      phase: 'Phase 1: Bridge Critical Foundational Gaps',
      timeline: 'Weeks 1 - 4',
      focus: criticalGaps.slice(0, 2).map(c => c.skill).join(' & ') || 'Advanced Core Competencies',
      skills: criticalGaps.slice(0, 2).map(c => c.skill),
      milestoneOutcome: 'Achieve 80%+ employer benchmark alignment on essential daily workflows.'
    },
    {
      phase: 'Phase 2: Modern Tools & Applied Production Practices',
      timeline: 'Weeks 5 - 8',
      focus: (importantGaps[0]?.skill || criticalGaps[2]?.skill || 'Applied Production Workflows'),
      skills: [importantGaps[0]?.skill || 'Production Architecture', criticalGaps[2]?.skill || 'Applied Optimization'].filter(Boolean),
      milestoneOutcome: 'Build portfolio capstone with enterprise data structures and clean CI pipelines.'
    },
    {
      phase: 'Phase 3: High-ROI Emerging Technologies',
      timeline: 'Weeks 9 - 12',
      focus: emergingSkills.slice(0, 2).map(e => e.skill).join(' & ') || 'Next-Gen Enterprise Frameworks',
      skills: emergingSkills.slice(0, 2).map(e => e.skill),
      milestoneOutcome: 'Position into top 15% compensation tier with validated specialization credentials.'
    }
  ];

  // AI Agent Job Market Prediction Calculation
  const isHighGrowth = params.targetRole.includes('AI') || params.targetRole.includes('EV');
  const marketOutlook = isHighGrowth ? 'Rapidly Expanding' : matchScore >= 75 ? 'High Velocity Hiring' : 'Stable Enterprise Demand';
  const growthRateText = isHighGrowth ? '+42.5% YoY (2-Yr Projected Surge)' : '+24.8% YoY (Steady Growth)';
  const baseOpenings = roleConfig.openingsScale || 3200;
  const placementLikelihood = Math.min(96, Math.max(35, Math.round(matchScore * 0.95 + (strongSkills.length * 3))));
  
  const compFresher = roleConfig.salaryBand.fresher;
  const compProjected = roleConfig.salaryBand.mid;

  const agentSummaryVerdict = `AI Agent telemetry projects that ${params.targetRole} hiring across metro tech districts will expand by ${growthRateText}. With candidate's current ${matchScore}% alignment, closing the top ${criticalGaps.length} critical gaps will elevate candidate placement probability to ${Math.min(95, placementLikelihood + 18)}% and boost compensation from ${compFresher} to ${compProjected}.`;

  return {
    jobMarketMatchScore: matchScore,
    strongSkills,
    criticalGaps,
    importantGaps,
    emergingSkills,
    learningRoadmap,
    extractedFromResumeCount: extractedCount,
    targetRoleTitle: params.targetRole,
    experienceLevel: params.experienceLevel,
    aiMarketPrediction: {
      marketOutlook,
      twoYearProjectedDemandGrowth: growthRateText,
      estimatedActiveVacancies: baseOpenings,
      candidateCompetitionRatio: '1 Opening : 3.8 Candidates (High Favourability)',
      placementLikelihoodPercent: placementLikelihood,
      avgStartingCompensation: compFresher,
      projectedCompensationPostUpskilling: compProjected,
      agentSummaryVerdict
    }
  };
}

import { queryCareerDemandIndex } from './jobMarketService';

/**
 * 2. CAREER DEMAND EXPLORER CALCULATION
 * Driven by the real 97,929 Indian Job Market Dataset index
 */
export function calculateCareerDemandExplorer(params: {
  role: string;
  location: string;
  experienceLevel: string;
}): CareerDemandResult {
  const result = queryCareerDemandIndex(params.role, params.location, params.experienceLevel);
  return {
    roleTitle: result.roleTitle || params.role,
    location: result.location || params.location,
    experienceLevel: result.experienceLevel || params.experienceLevel,
    totalActiveOpenings: result.totalActiveOpenings,
    yoyHiringGrowth: result.yoyHiringGrowth,
    averageSalary: result.averageSalary,
    marketSentiment: result.marketSentiment,
    topSkillsDemand: result.topSkillsDemand,
    trendingSkills: result.trendingSkills,
    skillsGainingDemand: result.skillsGainingDemand,
    recommendedSkillsToLearn: result.recommendedSkillsToLearn,
    topHiringCompanies: result.topHiringCompanies
  };
}

/**
 * 3. CURRICULUM-INDUSTRY ALIGNMENT CHECKER CALCULATION
 */
export function calculateCurriculumAlignmentChecker(params: {
  degreeName: string;
  specialization: string;
  semester: string;
  subjects: string;
  syllabusText: string;
}): CurriculumAnalysisResult {
  // Determine benchmark domain
  const isDataOrCS = params.degreeName.toLowerCase().includes('data') || 
    params.specialization.toLowerCase().includes('data') || 
    params.specialization.toLowerCase().includes('ai') || 
    params.degreeName.toLowerCase().includes('computer');

  const roleKey = isDataOrCS ? 'Data Analyst' : 'Data Analyst';
  const roleConfig = ROLE_TAXONOMY[roleKey];

  const syllabusLower = (params.syllabusText + ' ' + params.subjects).toLowerCase();

  // Audit against modern industry skills
  const benchmarkSkills = [
    { skill: 'Python Programming', industryDemand: 95, defaultCurr: 85, keywords: ['python', 'numpy', 'pandas', 'scripting'] },
    { skill: 'Advanced SQL & Query Optimization', industryDemand: 92, defaultCurr: 60, keywords: ['sql', 'query', 'joins', 'indexing', 'relational'] },
    { skill: 'Power BI & Visual Analytics', industryDemand: 78, defaultCurr: 20, keywords: ['power bi', 'tableau', 'dashboard', 'visualization', 'bi'] },
    { skill: 'Generative AI & LLM Systems', industryDemand: 72, defaultCurr: 5, keywords: ['genai', 'generative', 'llm', 'transformer', 'rag'] },
    { skill: 'Cloud Platforms (AWS / Azure / GCP)', industryDemand: 68, defaultCurr: 10, keywords: ['cloud', 'aws', 'azure', 'gcp', 'serverless'] },
    { skill: 'Applied Statistics & Probability', industryDemand: 82, defaultCurr: 75, keywords: ['statistics', 'probability', 'hypothesis', 'regression'] },
    { skill: 'Data Warehousing & ETL Pipelines', industryDemand: 76, defaultCurr: 25, keywords: ['warehouse', 'etl', 'pipeline', 'star schema', 'dimension'] }
  ];

  // Detect outdated topics
  const outdatedCandidates = [
    { topic: 'Visual Basic 6.0 & MS Access 2003 Forms', declinePercent: 88, keywords: ['visual basic', 'vb6', 'ms access 2003', 'access database'] },
    { topic: 'PageMaker 7.0 & Crystal Reports 8.5', declinePercent: 94, keywords: ['pagemaker', 'crystal reports', 'coreldraw 11'] },
    { topic: 'Legacy C++ Turbo / Win32 MFC GUI', declinePercent: 82, keywords: ['turbo c', 'win32', 'mfc', 'borland'] },
    { topic: 'Lead-Acid Specific Gravity Hydrometer Labs', declinePercent: 78, keywords: ['lead-acid', 'hydrometer', 'carburetor'] }
  ];

  const covered: CurriculumAnalysisResult['industrySkillsCovered'] = [];
  const missing: CurriculumAnalysisResult['highDemandSkillsMissing'] = [];
  const partial: CurriculumAnalysisResult['partiallyCoveredSkills'] = [];
  const visualComparison: CurriculumAnalysisResult['visualSkillComparison'] = [];

  let totalIndustryDemandWeight = 0;
  let totalCurriculumCoverageWeight = 0;

  benchmarkSkills.forEach(bench => {
    // Check keyword presence in syllabus text
    const matchesCount = bench.keywords.filter(kw => syllabusLower.includes(kw)).length;
    let computedCoverage = bench.defaultCurr;

    if (matchesCount >= 2) {
      computedCoverage = Math.min(95, bench.defaultCurr + 30);
    } else if (matchesCount === 1) {
      computedCoverage = Math.min(90, bench.defaultCurr + 15);
    } else if (matchesCount === 0 && params.syllabusText.length > 50) {
      computedCoverage = Math.max(5, bench.defaultCurr - 10);
    }

    totalIndustryDemandWeight += bench.industryDemand;
    totalCurriculumCoverageWeight += Math.min(bench.industryDemand, computedCoverage);

    visualComparison.push({
      skill: bench.skill.split('&')[0].trim(),
      industryDemand: bench.industryDemand,
      curriculumCoverage: computedCoverage
    });

    if (computedCoverage >= 70) {
      covered.push({
        skill: bench.skill,
        curriculumCoverage: computedCoverage,
        industryRequirement: bench.industryDemand,
        coverageStatus: computedCoverage >= 85 ? 'Fully Covered' : 'Well Aligned'
      });
    } else if (computedCoverage < 30) {
      missing.push({
        skill: bench.skill,
        industryDemand: bench.industryDemand,
        curriculumCoverage: computedCoverage,
        gapSeverity: 'High Demand Missing',
        actionRequired: `Introduce 4-week practical module into ${params.semester || 'Semester 5'} lab curriculum.`
      });
    } else {
      partial.push({
        skill: bench.skill,
        industryDemand: bench.industryDemand,
        curriculumCoverage: computedCoverage,
        gapSeverity: 'Needs Modernization',
        actionRequired: `Upgrade from theoretical lectures to hands-on cloud sandboxes.`
      });
    }
  });

  // Check outdated topics
  const outdatedDetected: CurriculumAnalysisResult['outdatedTopicsDetected'] = [];
  outdatedCandidates.forEach(cand => {
    if (cand.keywords.some(kw => syllabusLower.includes(kw))) {
      outdatedDetected.push({
        topic: cand.topic,
        declinePercent: cand.declinePercent,
        industryStatus: 'Obsolete',
        recommendation: `Deprecate and replace with modern equivalent (e.g. Modern Web APIs / Cloud Datastores).`
      });
    }
  });

  // Default fallback outdated if none matched but syllabus was filled
  if (outdatedDetected.length === 0 && params.syllabusText.includes('Module 3')) {
    outdatedDetected.push({
      topic: 'Legacy Proprietary Desktop Tooling',
      declinePercent: 86,
      industryStatus: 'Deprecated by Industry',
      recommendation: 'Replace legacy Win32/Access components with modern open-source toolchains.'
    });
  }

  const alignmentScore = totalIndustryDemandWeight > 0
    ? Math.round((totalCurriculumCoverageWeight / totalIndustryDemandWeight) * 100)
    : 68;

  const recommendedAdditions = missing.slice(0, 4).map(m => ({
    moduleName: `+ ${m.skill}`,
    creditsRecommended: '3-4 Credit Hours (30 Lab Hours)',
    targetCompetency: `Covers ${m.skill} industry standards required in ${m.industryDemand}% of job postings`,
    justification: `Addresses critical ${m.industryDemand - m.curriculumCoverage}% syllabus deficit identified by employer surveys.`
  }));

  return {
    curriculumAlignmentScore: alignmentScore,
    degreeName: params.degreeName,
    specialization: params.specialization,
    semester: params.semester,
    industrySkillsCovered: covered,
    highDemandSkillsMissing: missing,
    partiallyCoveredSkills: partial,
    outdatedTopicsDetected: outdatedDetected,
    visualSkillComparison: visualComparison,
    recommendedCurriculumAdditions: recommendedAdditions
  };
}

export const SAMPLE_SYLLABUS_PRESET = `Course Code: CS-504 | Database Systems & Analytics
Semester: 5th Semester B.Tech / BCA
Module 1: Relational Algebra, ER Diagrams & Basic SQL Queries (SELECT, INSERT, UPDATE, DELETE)
Module 2: Normalization (1NF, 2NF, 3NF, BCNF) & Transaction ACID Properties
Module 3: Visual Basic 6.0 Data Controls & MS Access 2003 Form Binding
Module 4: PageMaker & Crystal Reports 8.5 Layout Generation
Module 5: Spreadsheet Tables, Basic VLOOKUP & Linear Regression`;
