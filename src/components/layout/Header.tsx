import React, { useState, useRef, useEffect } from 'react';
import { useApp, UserPersona } from '../../context/AppContext';
import { useAuth, UserRole } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { 
  Bell, 
  Moon, 
  Sun, 
  Database, 
  Download, 
  Layers, 
  UserCircle2, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  X,
  LogIn,
  LogOut,
  ChevronDown,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    persona, 
    setPersona, 
    darkMode, 
    toggleDarkMode, 
    toasts, 
    removeToast, 
    addToast,
    setActiveTab
  } = useApp();

  const { user, isAuthenticated, signOut, isLoading, isAdmin, currentRole, setRole } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Map user role to persona label
  const roleToPersona = (role: UserRole): UserPersona => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'policymaker': return 'Policy Maker';
      case 'institution': return 'Institution / Education Provider';
      case 'candidate': return 'Candidate';
      default: return 'Policy Maker';
    }
  };

  const personaToRole = (p: UserPersona): UserRole => {
    switch (p) {
      case 'Administrator': return 'admin';
      case 'Policy Maker': return 'policymaker';
      case 'Institution / Education Provider': return 'institution';
      case 'Candidate': return 'candidate';
      default: return 'policymaker';
    }
  };

  const allowedPersonas: UserPersona[] = [
    'Policy Maker',
    'Administrator',
    'Institution / Education Provider',
    'Candidate'
  ];

  const currentDisplayPersona: UserPersona = persona;

  const handleRoleChange = (selected: UserPersona) => {
    const targetRole = personaToRole(selected);
    setRole(targetRole);
    setPersona(selected);
    addToast('info', 'Active Perspective Switched', `Dashboard adjusted for: ${selected}`);
  };

  const handleExportSummary = () => {
    const report = {
      title: 'SkillSync Labour-Market & Skill Intelligence Report',
      generatedAt: new Date().toISOString(),
      personaScope: currentDisplayPersona,
      keyFindings: [
        'Top 3 Critical Gaps: Generative AI & LLMs, EV Battery Diagnostics, Cloud Architecture',
        'State District Focus: Bengaluru Urban (95 Demand), Pune (92 Demand), Jaipur (76 Demand)',
        'Curriculum Recommendation: Add 14 vocational modules in EV & AI, sunset legacy MFC & PageMaker',
        'Placement Impact Index: Projecting +12.4% uplift post curriculum realignments'
      ]
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillSync_Market_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast('success', 'Report Exported', 'Executive Labour-Market summary downloaded successfully.');
  };

  const handleSignOut = async () => {
    setShowUserMenu(false);
    try {
      await signOut();
      addToast('info', 'Signed Out', 'You have been successfully signed out.');
      setActiveTab('sign-in');
    } catch (err: any) {
      console.error('Error signing out:', err);
      addToast('warning', 'Sign Out Error', 'Encountered an issue while signing out.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
          {/* Left Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('market-overview')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  SkillSync
                </h1>
                {isAdmin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Labour Market & Skill Intelligence Platform
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Supabase Status: Admins ONLY */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin-console')}
                className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                title="Admin Console & Database Architecture"
              >
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isSupabaseConfigured ? 'Supabase Live' : 'Data Engine'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

            {/* Role / Perspective Switcher */}
            <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <UserCircle2 className="w-4 h-4 text-brand-500 ml-1.5 hidden sm:block" />
              <select
                aria-label="Current Role Perspective"
                value={currentDisplayPersona}
                onChange={(e) => handleRoleChange(e.target.value as UserPersona)}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer py-0.5 px-1 pr-2"
              >
                {allowedPersonas.map((p) => (
                  <option key={p} value={p} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportSummary}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition"
              title="Download Market Summary"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
                title="Intelligence Alerts"
              >
                <Bell className="w-4 h-4" />
                {toasts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Recent Signals & Alerts</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                    <div className="p-2 bg-brand-50 dark:bg-brand-950/40 rounded-lg text-xs border border-brand-100 dark:border-brand-900">
                      <p className="font-bold text-brand-900 dark:text-brand-300">🔥 Generative AI Demand Surged</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">+42.5% increase across Bengaluru and Pune enterprise postings.</p>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-xs border border-amber-100 dark:border-amber-900">
                      <p className="font-bold text-amber-900 dark:text-amber-300">⚠️ Trainer Bottleneck Alert</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">EV Powertrain training batch deficits detected in Pune & Coimbatore.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu (if authenticated) */}
            {isAuthenticated && user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 sm:pr-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
                  title="View User Account & Details"
                >
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.full_name} 
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-brand-500/30"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[11px]">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[110px] truncate hidden sm:inline-block">
                    {user.full_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* User profile card */}
                    <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.full_name} 
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-500/30"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold text-base shadow-md">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        <div className="inline-flex items-center space-x-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                          <span>Google Verified • {currentDisplayPersona}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick navigation actions */}
                    <div className="py-2 space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab('candidate-profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-2"
                      >
                        <UserCircle2 className="w-3.5 h-3.5 text-brand-500" />
                        <span>Candidate Profile & Skills</span>
                      </button>

                      {/* Admin Console Link */}
                      <button
                        onClick={() => {
                          setActiveTab('admin-console');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition flex items-center space-x-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Admin Console & Architecture</span>
                      </button>
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleSignOut}
                        disabled={isLoading}
                        className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition disabled:opacity-50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Interactive Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-lg border flex items-start space-x-3 transition-all transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700 backdrop-blur-md'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 text-white border-amber-700 backdrop-blur-md'
                : 'bg-slate-900/90 text-white border-slate-700 backdrop-blur-md'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs">
              <p className="font-bold">{toast.title}</p>
              <p className="text-slate-200 mt-0.5">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
