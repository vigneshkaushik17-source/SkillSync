import React from 'react';
import { useApp, NavSection } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Cpu, 
  TrendingDown, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  MapPin, 
  LineChart, 
  UserCircle, 
  Database, 
  Settings,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Server
} from 'lucide-react';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const { isAdmin } = useAuth();

  // Clean Core Modules for all users (no internal technical badges)
  const coreSections: NavItem[] = [
    { id: 'market-overview', label: 'Market Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'skill-intelligence', label: 'Skill Intelligence', icon: <Cpu className="w-4 h-4" /> },
    { id: 'skill-gap', label: 'Skill Gap Analysis', icon: <TrendingDown className="w-4 h-4" /> },
    { id: 'jobs-demand', label: 'Jobs & Employer Demand', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'curriculum-alignment', label: 'Curriculum Alignment', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'learning-courses', label: 'Learning & Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'district-planning', label: 'District Planning', icon: <MapPin className="w-4 h-4" /> },
    { id: 'analytics-insights', label: 'Analytics & Outcomes', icon: <LineChart className="w-4 h-4" /> },
  ];

  // Career Tools for normal users
  const careerSections: NavItem[] = [
    { id: 'candidate-profile', label: 'Candidate Profile & Career', icon: <UserCircle className="w-4 h-4" /> },
  ];

  // Admin-Only Sections
  const adminSections: NavItem[] = [
    { id: 'admin-console', label: 'Admin Console', icon: <ShieldAlert className="w-4 h-4 text-indigo-500" />, badge: 'Console' },
    { id: 'data-sources', label: 'Data Architecture & Engine', icon: <Database className="w-4 h-4" /> },
    { id: 'settings', label: 'System Settings & Config', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 transition-colors">
      {/* Platform Sub-Tagline */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Labour Intelligence</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            Active
          </span>
        </div>
      </div>

      {/* Nav Section Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Core Modules Header */}
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Core Modules
        </p>

        {coreSections.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <span className={`transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
            </button>
          );
        })}

        {/* Career Tools Section */}
        <div className="pt-3 pb-1">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Career Tools
          </p>

          {careerSections.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </button>
            );
          })}
        </div>

        {/* Admin & System Architecture */}
        <div className="pt-3 pb-1 border-t border-slate-100 dark:border-slate-800 mt-2">
          <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              Administration
            </p>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              System
            </span>
          </div>

          {adminSections.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Status Banner: Clean SkillSync Message */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200">Better Skills</p>
          <p className="text-slate-600 dark:text-slate-400">Brighter Opportunities</p>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">A Stronger India</p>
        </div>
      </div>
    </aside>
  );
};
