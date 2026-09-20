import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalFilterBar } from './components/common/GlobalFilterBar';
import { SkillDetailModal } from './components/common/SkillDetailModal';

// Views
import { MarketOverviewView } from './views/MarketOverviewView';
import { SkillIntelligenceView } from './views/SkillIntelligenceView';
import { SkillGapAnalysisView } from './views/SkillGapAnalysisView';
import { JobsDemandView } from './views/JobsDemandView';
import { CurriculumAlignmentView } from './views/CurriculumAlignmentView';
import { LearningCoursesView } from './views/LearningCoursesView';
import { DistrictPlannerView } from './views/DistrictPlannerView';
import { AnalyticsInsightsView } from './views/AnalyticsInsightsView';
import { CandidateProfileView } from './views/CandidateProfileView';
import { AdminConsoleView } from './views/AdminConsoleView';
import { DataSourcesView } from './views/DataSourcesView';
import { SettingsView } from './views/SettingsView';
import { SignInView } from './views/SignInView';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, candidateProfile, updateCandidateProfile, addToast } = useApp();
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Route Protection: Prevent non-admin users from accessing admin routes
  useEffect(() => {
    const adminRoutes = ['admin-console', 'data-sources', 'settings'];
    if (adminRoutes.includes(activeTab) && !isAdmin) {
      setActiveTab('market-overview');
      addToast('warning', 'Access Restricted', 'Administrator authorization (vigneshkaushik17@gmail.com) required to access system and data architecture console.');
    }
  }, [activeTab, isAdmin, setActiveTab, addToast]);

  // Redirect to Home "/" (market-overview) after successful sign in
  useEffect(() => {
    if (isAuthenticated && activeTab === 'sign-in') {
      setActiveTab('market-overview');
      if (user) {
        addToast('success', `Welcome, ${user.full_name}!`, 'Authenticated with Google via Supabase.');
      }
    }
  }, [isAuthenticated, activeTab, setActiveTab, user, addToast]);

  // Sync Google user credentials with Candidate profile when logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (
        (candidateProfile.fullName === 'Arjun Verma' || !candidateProfile.fullName) &&
        user.full_name
      ) {
        updateCandidateProfile({
          ...candidateProfile,
          fullName: user.full_name,
          email: user.email || candidateProfile.email,
        });
      }
    }
  }, [isAuthenticated, user]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'market-overview':
        return <MarketOverviewView />;
      case 'skill-intelligence':
        return <SkillIntelligenceView />;
      case 'skill-gap':
        return <SkillGapAnalysisView />;
      case 'jobs-demand':
        return <JobsDemandView />;
      case 'curriculum-alignment':
        return <CurriculumAlignmentView />;
      case 'learning-courses':
        return <LearningCoursesView />;
      case 'district-planning':
        return <DistrictPlannerView />;
      case 'analytics-insights':
        return <AnalyticsInsightsView />;
      case 'candidate-profile':
        return <CandidateProfileView />;
      case 'admin-console':
        return isAdmin ? <AdminConsoleView /> : <MarketOverviewView />;
      case 'data-sources':
        return isAdmin ? <DataSourcesView /> : <MarketOverviewView />;
      case 'settings':
        return isAdmin ? <SettingsView /> : <MarketOverviewView />;
      case 'sign-in':
        return <SignInView />;
      default:
        return <MarketOverviewView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Global Reactive Filter Bar across views except admin, settings, data sources, and sign-in */}
            {activeTab !== 'settings' && 
             activeTab !== 'data-sources' && 
             activeTab !== 'admin-console' && 
             activeTab !== 'sign-in' && (
              <GlobalFilterBar />
            )}

            {/* Dynamic View Component */}
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Interactive Skill Deep-Dive Modal */}
      <SkillDetailModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
