import { 
  Skill, 
  JobRole, 
  Course, 
  DistrictWorkforce, 
  LearningPathwayItem, 
  EmployerValidation,
  CandidateProfileState 
} from '../types';
import skillsData from './processed/skills_data.json';
import jobRolesData from './processed/job_roles_data.json';
import districtsData from './processed/districts_data.json';

// Real Dataset Backed Exports
export const MOCK_SKILLS: Skill[] = skillsData as Skill[];
export const MOCK_JOB_ROLES: JobRole[] = jobRolesData as JobRole[];
export const MOCK_DISTRICTS: DistrictWorkforce[] = districtsData as DistrictWorkforce[];

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs-1',
    code: 'CS-401',
    title: 'B.Tech Computer Science & Engineering',
    institution: 'State Technical University',
    sector: 'IT & Tech',
    level: 'Undergraduate',
    alignmentScore: 78,
    healthStatus: 'Needs Update',
    enrolledStudents: 14200,
    graduatesAnnual: 3400,
    placementRate: 74,
    employerSatisfaction: 4.1,
    durationWeeks: 192,
    skillsTaught: [
      { skillName: 'Python & Data Engineering', industryRequirement: 94, curriculumCoverage: 85, gap: 9, status: 'Keep', recommendationNote: 'Solid core coverage; enrich with distributed streaming libraries' },
      { skillName: 'SQL & Relational Databases', industryRequirement: 91, curriculumCoverage: 88, gap: 3, status: 'Keep', recommendationNote: 'Align with window functions and query optimization' },
      { skillName: 'AWS Cloud Infrastructure', industryRequirement: 89, curriculumCoverage: 40, gap: 49, status: 'Update', recommendationNote: 'Severely outdated: currently covers basic virtualization only' },
      { skillName: 'Docker & Containerization', industryRequirement: 88, curriculumCoverage: 30, gap: 58, status: 'Add', recommendationNote: 'Introduce mandatory 6-week hands-on container orchestration lab' },
      { skillName: 'Generative AI & LLMs', industryRequirement: 96, curriculumCoverage: 15, gap: 81, status: 'Add', recommendationNote: 'Add module on RAG architectures and transformer fine-tuning' },
      { skillName: 'Legacy C++ Desktop GUI (MFC/Win32)', industryRequirement: 14, curriculumCoverage: 65, gap: -51, status: 'Remove', recommendationNote: 'Deprecate obsolete Win32 MFC coursework; replace with modern web' }
    ],
    recommendedActions: [
      { type: 'Add', skill: 'Generative AI & LLMs', reason: 'Industry demand +42% YoY; 0 credit hours currently allocated.' },
      { type: 'Update', skill: 'AWS Cloud Infrastructure', reason: 'Shift from theoretical networking to real AWS/GCP sandbox labs.' },
      { type: 'Remove', skill: 'Legacy MFC / Win32 GUI', reason: 'Employer demand down 86%; curriculum over-allocating 45 lecture hours.' }
    ]
  },
  {
    id: 'crs-2',
    code: 'DIP-EV-201',
    title: 'Diploma in Electric Vehicle Engineering & Powertrain',
    institution: 'National Skill Training Institute (NSTI)',
    sector: 'Manufacturing & EV',
    level: 'Vocational/Diploma',
    alignmentScore: 89,
    healthStatus: 'High Demand',
    enrolledStudents: 3200,
    graduatesAnnual: 950,
    placementRate: 88,
    employerSatisfaction: 4.6,
    durationWeeks: 48,
    skillsTaught: [
      { skillName: 'EV Battery Diagnostics & BMS', industryRequirement: 88, curriculumCoverage: 85, gap: 3, status: 'Keep', recommendationNote: 'Excellent industry alignment with Tata Motors & Ather specs' },
      { skillName: 'PLC & Industrial Robotics Automation', industryRequirement: 82, curriculumCoverage: 78, gap: 4, status: 'Keep', recommendationNote: 'Certified to industry automation standard' },
      { skillName: 'CAN Bus & Electronic Telemetry', industryRequirement: 81, curriculumCoverage: 62, gap: 19, status: 'Update', recommendationNote: 'Upgrade oscilloscope diagnostic simulators' }
    ],
    recommendedActions: [
      { type: 'Keep', skill: 'EV Battery Diagnostics & BMS', reason: 'Direct hire placement pipeline with OEMs.' },
      { type: 'Update', skill: 'CAN Bus Telemetry', reason: 'Add high-speed CAN-FD and Automotive Ethernet.' }
    ]
  },
  {
    id: 'crs-3',
    code: 'DIP-DTP-101',
    title: 'Certificate in Desktop Publishing & Basic Office Tools',
    institution: 'Community Vocational Centre',
    sector: 'IT & Tech',
    level: 'Certification',
    alignmentScore: 32,
    healthStatus: 'Obsolete',
    enrolledStudents: 5400,
    graduatesAnnual: 2200,
    placementRate: 28,
    employerSatisfaction: 2.3,
    durationWeeks: 24,
    skillsTaught: [
      { skillName: 'PageMaker 7.0 & CorelDraw 11', industryRequirement: 12, curriculumCoverage: 95, gap: -83, status: 'Remove', recommendationNote: 'Obsolete proprietary software discontinued by industry' },
      { skillName: 'Basic Word Processing Typing', industryRequirement: 30, curriculumCoverage: 90, gap: -60, status: 'Remove', recommendationNote: 'Oversupplied skill; minimal standalone hiring' }
    ],
    recommendedActions: [
      { type: 'Remove', skill: 'PageMaker 7.0', reason: 'Zero corporate job postings in past 18 months.' },
      { type: 'Add', skill: 'UI/UX & Product Design', reason: 'Pivot institute facilities toward high-demand digital design.' }
    ]
  },
  {
    id: 'crs-4',
    code: 'DIP-AG-302',
    title: 'Diploma in Precision Farming & Agricultural Technology',
    institution: 'Regional Agricultural University',
    sector: 'Agriculture & AgriTech',
    level: 'Vocational/Diploma',
    alignmentScore: 81,
    healthStatus: 'High Demand',
    enrolledStudents: 1800,
    graduatesAnnual: 420,
    placementRate: 79,
    employerSatisfaction: 4.3,
    durationWeeks: 52,
    skillsTaught: [
      { skillName: 'Precision Agriculture & Drone Telemetry', industryRequirement: 78, curriculumCoverage: 70, gap: 8, status: 'Keep', recommendationNote: 'Includes DGCA Drone Pilot certification module' },
      { skillName: 'Soil Sensor & IoT Calibration', industryRequirement: 74, curriculumCoverage: 60, gap: 14, status: 'Update', recommendationNote: 'Add telemetry solar-powered sensors' }
    ],
    recommendedActions: [
      { type: 'Keep', skill: 'Drone Telemetry', reason: '79% placement in FPOs and Agri-startups.' }
    ]
  }
];

export const MOCK_LEARNING_PATHWAYS: LearningPathwayItem[] = [
  {
    id: 'lp-1',
    skillName: 'AWS Cloud Infrastructure & Kubernetes',
    requiredQualification: 'AWS Solutions Architect / CKA Certification',
    recommendedCourse: 'Applied Cloud & Container Orchestration Masterclass',
    courseProvider: 'National Skill Development Corp (NSDC) + AWS Academy',
    estimatedDuration: '8 Weeks (160 Hours)',
    difficulty: 'Advanced',
    completionRate: 84,
    placementOutcomeRate: 89,
    associatedSector: 'IT & Tech'
  },
  {
    id: 'lp-2',
    skillName: 'EV Battery Diagnostics & BMS',
    requiredQualification: 'Automotive Electrician Level 4 (ASDC Certified)',
    recommendedCourse: 'Comprehensive EV High Voltage Safety & BMS Troubleshooting',
    courseProvider: 'Automotive Skills Development Council (ASDC) + NSTI',
    estimatedDuration: '10 Weeks (200 Hours)',
    difficulty: 'Advanced',
    completionRate: 91,
    placementOutcomeRate: 92,
    associatedSector: 'Manufacturing & EV'
  },
  {
    id: 'lp-3',
    skillName: 'Generative AI & LLM Engineering',
    requiredQualification: 'Applied AI Practitioner Diploma',
    recommendedCourse: 'Building Production-Ready LLM & RAG Systems',
    courseProvider: 'IIT Madras Pravartak & Industry Sandbox',
    estimatedDuration: '12 Weeks (180 Hours)',
    difficulty: 'Expert',
    completionRate: 79,
    placementOutcomeRate: 94,
    associatedSector: 'IT & Tech'
  },
  {
    id: 'lp-4',
    skillName: 'Precision Agriculture & Drone Telemetry',
    requiredQualification: 'DGCA Certified Remote Pilot Licence (RPL-Agri)',
    recommendedCourse: 'Drone Telemetry & Precision Crop Sensing Workshop',
    courseProvider: 'Agriculture Skill Council of India (ASCI)',
    estimatedDuration: '6 Weeks (120 Hours)',
    difficulty: 'Intermediate',
    completionRate: 88,
    placementOutcomeRate: 82,
    associatedSector: 'Agriculture & AgriTech'
  },
  {
    id: 'lp-5',
    skillName: 'Digital Telehealth & EHR Compliance',
    requiredQualification: 'Healthcare Sector Skill Council (HSSC) Level 5',
    recommendedCourse: 'Health Informatics & Telemedicine Operations',
    courseProvider: 'HSSC + AIIMS Skill Training Consortium',
    estimatedDuration: '8 Weeks (140 Hours)',
    difficulty: 'Intermediate',
    completionRate: 87,
    placementOutcomeRate: 86,
    associatedSector: 'Healthcare'
  }
];

export const MOCK_EMPLOYER_VALIDATIONS: EmployerValidation[] = [
  {
    id: 'val-1',
    companyName: 'Tata Motors EV Division',
    representative: 'Anand Kulkarni (VP, Powertrain)',
    role: 'EV Powertrain & Battery Diagnostic Technician',
    industry: 'Manufacturing & EV',
    action: 'Validate Skill',
    targetItem: 'EV Battery Diagnostics & BMS',
    comment: 'Crucial requirement. We need candidates who can diagnose thermal runaway and balancing issues on CAN-FD.',
    timestamp: '2 hours ago',
    status: 'Verified'
  },
  {
    id: 'val-2',
    companyName: 'Infosys Limited',
    representative: 'Priya Narayanan (Head of Cloud Practice)',
    role: 'Cloud & DevOps Infrastructure Engineer',
    industry: 'IT & Tech',
    action: 'Suggest Skill',
    targetItem: 'Terraform & Infrastructure-as-Code',
    comment: 'All new cloud hires must have hands-on declarative IaC experience in CI pipelines.',
    timestamp: '5 hours ago',
    status: 'Approved'
  },
  {
    id: 'val-3',
    companyName: 'Apollo Healthways',
    representative: 'Dr. S. Ranganathan (Chief Medical Informatics)',
    role: 'Digital Health Technician',
    industry: 'Healthcare',
    action: 'Validate Role',
    targetItem: 'Telehealth Systems & EHR Compliance',
    comment: 'NABH and ABDM digital health compliance makes this role indispensable across 70+ hospitals.',
    timestamp: '1 day ago',
    status: 'Verified'
  },
  {
    id: 'val-4',
    companyName: 'Kotak Mahindra Bank',
    representative: 'Sanjay Deshmukh (Head of Risk Analytics)',
    role: 'BFSI Risk & Fraud Prevention Analyst',
    industry: 'BFSI',
    action: 'Validate Skill',
    targetItem: 'Fraud Analytics & AML Compliance',
    comment: 'Real-time transaction anomaly detection requires hands-on SQL and fraud scoring models.',
    timestamp: '1 day ago',
    status: 'Verified'
  },
  {
    id: 'val-5',
    companyName: 'DeHaat Agro Technologies',
    representative: 'Vikas Sharma (Director, Talent)',
    role: 'Smart AgriTech Operations Specialist',
    industry: 'Agriculture & AgriTech',
    action: 'Report Outdated Skill',
    targetItem: 'Manual Field Nitrogen Testing Strips',
    comment: 'Outdated method. We have completely transitioned to digital spectrometry sensors and drone NDVI maps.',
    timestamp: '2 days ago',
    status: 'Approved'
  }
];

export const INITIAL_CANDIDATE_PROFILE: CandidateProfileState = {
  fullName: 'Arjun Verma',
  email: 'arjun.verma.dev@gmail.com',
  age: 23,
  education: 'B.Tech in Information Technology (Graduated 2025)',
  experienceYears: 1,
  industryDomain: 'IT & Tech',
  internships: '6 Months Data Engineering Intern at Flipkart Labs & AI Analytics Fellow',
  salaryExpectation: '₹8.5 LPA',
  desiredRole: 'Data Analyst & BI Specialist',
  preferredLocation: 'Bengaluru Urban',
  skills: [
    { name: 'Python & Data Engineering', proficiency: 'Advanced', verified: true },
    { name: 'SQL & Relational Databases', proficiency: 'Advanced', verified: true },
    { name: 'Power BI & Dashboard Analytics', proficiency: 'Intermediate', verified: true },
    { name: 'React.js & Modern Frontend', proficiency: 'Intermediate', verified: false },
    { name: 'AWS Cloud Infrastructure', proficiency: 'Beginner', verified: false }
  ],
  certifications: [
    'Microsoft Certified: Power BI Data Analyst Associate',
    'Python for Data Science (Coursera)'
  ]
};
