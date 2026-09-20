import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Skill, 
  JobRole, 
  Course, 
  DistrictWorkforce, 
  LearningPathwayItem, 
  EmployerValidation, 
  CandidateProfileState, 
  UserFilterState,
  SectorType,
  DatasetScope,
  CorporateBenefit,
  CompanyProfile,
  Dataset2Summary,
  UnifiedSummary
} from '../types';
import { 
  MOCK_SKILLS, 
  MOCK_JOB_ROLES, 
  MOCK_COURSES, 
  MOCK_DISTRICTS, 
  MOCK_LEARNING_PATHWAYS, 
  MOCK_EMPLOYER_VALIDATIONS, 
  INITIAL_CANDIDATE_PROFILE 
} from '../data/mockData';
import { fetchWithFallback, saveWithFallback } from '../services/supabaseClient';
import { 
  getDatasetSummary, 
  getDataset1Summary, 
  getDataset2Summary, 
  getUnifiedSummary, 
  getCorporateBenefits, 
  getTopCompaniesWithDetails,
  DatasetSummary 
} from '../services/jobMarketService';

export type NavSection = 
  | 'market-overview'
  | 'skill-intelligence'
  | 'skill-gap'
  | 'jobs-demand'
  | 'curriculum-alignment'
  | 'learning-courses'
  | 'district-planning'
  | 'analytics-insights'
  | 'candidate-profile'
  | 'admin-console'
  | 'data-sources'
  | 'settings'
  | 'sign-in';

export type UserPersona = 'Policy Maker' | 'Institution / Education Provider' | 'Candidate' | 'Administrator';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  activeTab: NavSection;
  setActiveTab: (tab: NavSection) => void;
  persona: UserPersona;
  setPersona: (p: UserPersona) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  filters: UserFilterState;
  setFilters: React.Dispatch<React.SetStateAction<UserFilterState>>;
  updateSectorFilter: (sector: SectorType) => void;
  updateDistrictFilter: (district: string) => void;
  updateDatasetScope: (scope: DatasetScope) => void;
  skills: Skill[];
  jobRoles: JobRole[];
  courses: Course[];
  districts: DistrictWorkforce[];
  pathways: LearningPathwayItem[];
  validations: EmployerValidation[];
  candidateProfile: CandidateProfileState;
  updateCandidateProfile: (profile: CandidateProfileState) => void;
  addEmployerValidation: (validation: Omit<EmployerValidation, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  applyCurriculumAction: (courseId: string, skillName: string, actionType: string) => void;
  selectedSkillForModal: Skill | null;
  setSelectedSkillForModal: (skill: Skill | null) => void;
  datasetSummary: DatasetSummary;
  dataset2Summary: Dataset2Summary;
  unifiedSummary: UnifiedSummary;
  corporateBenefits: CorporateBenefit[];
  companyProfiles: CompanyProfile[];
  isLoadingData: boolean;
  dataError: string | null;
  toasts: Toast[];
  addToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavSection>('market-overview');
  const [persona, setPersona] = useState<UserPersona>('Policy Maker');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sia_theme') === 'dark';
  });

  const [filters, setFilters] = useState<UserFilterState>({
    sector: 'All Sectors',
    stateDistrict: 'All Districts',
    timeframe: 'Current Quarter',
    searchQuery: '',
    datasetScope: 'combined'
  });

  const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS);
  const [jobRoles, setJobRoles] = useState<JobRole[]>(MOCK_JOB_ROLES);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [districts, setDistricts] = useState<DistrictWorkforce[]>(MOCK_DISTRICTS);
  const [pathways, setPathways] = useState<LearningPathwayItem[]>(MOCK_LEARNING_PATHWAYS);
  const [validations, setValidations] = useState<EmployerValidation[]>(MOCK_EMPLOYER_VALIDATIONS);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfileState>(INITIAL_CANDIDATE_PROFILE);
  const [selectedSkillForModal, setSelectedSkillForModal] = useState<Skill | null>(null);
  
  // Real datasets state
  const [datasetSummary, setDatasetSummary] = useState<DatasetSummary>(getDataset1Summary());
  const [dataset2Summary, setDataset2Summary] = useState<Dataset2Summary>(getDataset2Summary());
  const [unifiedSummary, setUnifiedSummary] = useState<UnifiedSummary>(getUnifiedSummary());
  const [corporateBenefits, setCorporateBenefits] = useState<CorporateBenefit[]>(getCorporateBenefits());
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>(getTopCompaniesWithDetails());

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load initial persistence
  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      setDataError(null);
      try {
        const loadedSkills = await fetchWithFallback('skills', MOCK_SKILLS, 'skills');
        setSkills(loadedSkills);
        const loadedValidations = await fetchWithFallback('employer_validations', MOCK_EMPLOYER_VALIDATIONS, 'validations');
        setValidations(loadedValidations);
        setDatasetSummary(getDataset1Summary());
        setDataset2Summary(getDataset2Summary());
        setUnifiedSummary(getUnifiedSummary());
        setCorporateBenefits(getCorporateBenefits());
        setCompanyProfiles(getTopCompaniesWithDetails());
      } catch (err: any) {
        console.error('Error loading dataset:', err);
        setDataError('Could not sync with remote telemetry. Using local real-dataset cache.');
      } finally {
        setIsLoadingData(false);
      }
      
      const savedProfile = localStorage.getItem('sia_candidate_profile');
      if (savedProfile) {
        try {
          setCandidateProfile(JSON.parse(savedProfile));
        } catch {
          // ignore
        }
      }
    }
    loadData();
  }, []);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sia_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sia_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const addToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateSectorFilter = (sector: SectorType) => {
    setFilters(prev => ({ ...prev, sector }));
    addToast('info', 'Filter Applied', `Filtering analytics by sector: ${sector}`);
  };

  const updateDistrictFilter = (district: string) => {
    setFilters(prev => ({ ...prev, stateDistrict: district }));
    addToast('info', 'Location Filter Applied', `Focusing region: ${district}`);
  };

  const updateDatasetScope = (scope: DatasetScope) => {
    setFilters(prev => ({ ...prev, datasetScope: scope }));
    const label = scope === 'combined' ? 'Combined Multi-Source (221.7k Postings)' :
      scope === 'dataset1_india' ? 'Dataset 1: Indian Job Market (97.9k Postings)' :
      'Dataset 2: Global Enterprise Market (123.8k Postings)';
    addToast('success', 'Dataset Scope Updated', `Analytics scope set to: ${label}`);
  };

  const updateCandidateProfile = (profile: CandidateProfileState) => {
    setCandidateProfile(profile);
    localStorage.setItem('sia_candidate_profile', JSON.stringify(profile));
    addToast('success', 'Profile Updated', 'Candidate skills and target career path recalibrated.');
  };

  const addEmployerValidation = async (
    validationData: Omit<EmployerValidation, 'id' | 'timestamp' | 'status'>
  ) => {
    const newRecord: EmployerValidation = {
      ...validationData,
      id: `val-${Date.now()}`,
      timestamp: 'Just now',
      status: 'Verified'
    };

    const updated = await saveWithFallback('employer_validations', newRecord, 'validations', validations);
    setValidations(updated);

    setSkills(prev => prev.map(s => {
      if (s.name.toLowerCase() === validationData.targetItem.toLowerCase()) {
        return {
          ...s,
          validatedByEmployersCount: s.validatedByEmployersCount + 1,
          demandScore: Math.min(100, s.demandScore + 1)
        };
      }
      return s;
    }));

    addToast('success', 'Employer Signal Captured', `Validation recorded for "${validationData.targetItem}". Intelligence models updated.`);
  };

  const applyCurriculumAction = (courseId: string, skillName: string, actionType: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updatedSkills = c.skillsTaught.map(st => {
          if (st.skillName === skillName) {
            return {
              ...st,
              curriculumCoverage: actionType === 'Add' || actionType === 'Update' ? Math.min(95, st.industryRequirement) : 10,
              gap: 0
            };
          }
          return st;
        });
        return {
          ...c,
          alignmentScore: Math.min(98, c.alignmentScore + 12),
          healthStatus: 'High Demand',
          skillsTaught: updatedSkills
        };
      }
      return c;
    }));

    addToast('success', 'Curriculum Updated', `Simulated ${actionType} action for ${skillName}. Course alignment score boosted!`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        persona,
        setPersona,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        filters,
        setFilters,
        updateSectorFilter,
        updateDistrictFilter,
        updateDatasetScope,
        skills,
        jobRoles,
        courses,
        districts,
        pathways,
        validations,
        candidateProfile,
        updateCandidateProfile,
        addEmployerValidation,
        applyCurriculumAction,
        selectedSkillForModal,
        setSelectedSkillForModal,
        datasetSummary,
        dataset2Summary,
        unifiedSummary,
        corporateBenefits,
        companyProfiles,
        isLoadingData,
        dataError,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
