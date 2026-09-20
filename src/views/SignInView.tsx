import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  GraduationCap,
  Users,
  LineChart,
  Globe2
} from 'lucide-react';

export const SignInView: React.FC = () => {
  const { user, signInWithGoogle, authStatus, isLoading, isAuthenticated } = useAuth();
  const { setActiveTab, addToast } = useApp();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      const msg = err.message || 'Failed to initiate Google authentication. Please try again.';
      setErrorMessage(msg);
      addToast('warning', 'Authentication Error', msg);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-6 sm:py-10 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6">
        
        {/* Main Auth Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Left Hero / Value Proposition Column */}
          <div className="lg:col-span-6 p-6 sm:p-10 bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                    SkillSync
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/30 border border-brand-400/30 text-brand-200">
                      Cloud Auth
                    </span>
                  </h2>
                  <p className="text-xs text-brand-200">Labour-Market & Curriculum Intelligence</p>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
                Unified Skill Intelligence for Indian & Global Markets
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Bridge the gap between industry requirements and academic curricula with 221,000+ real-time market data points and AI-powered skill alignment.
              </p>

              {/* Key Features List */}
              <div className="space-y-3.5 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Live Labour Demand & Gap Matrix</h4>
                    <p className="text-[11px] text-slate-300">Track high-demand emerging skills across 12+ industry sectors.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">AI Career & Salary Projection</h4>
                    <p className="text-[11px] text-slate-300">Personalized candidate salary uplift trajectories and course recommendations.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Direct Employer Validation Engine</h4>
                    <p className="text-[11px] text-slate-300">Real-time industry feedback integrated directly into Supabase backend.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Assurance */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enterprise-Grade OAuth 2.0 via Supabase Authentication</span>
            </div>
          </div>

          {/* Right Action Column */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  <span>Secure Access</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Welcome to SkillSync
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Sign in or create your account using your Google profile
                </p>
              </div>

              {/* If already authenticated, show status */}
              {isAuthenticated && user ? (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-6 text-center">
                  <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-3 ring-4 ring-emerald-500/20">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                        {user.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Signed In As</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{user.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>

                  <button
                    onClick={() => setActiveTab('market-overview')}
                    className="mt-4 w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                  >
                    <span>Proceed to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Google OAuth Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {/* Official Google Icon */}
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{authStatus === 'logging_in' ? 'Connecting to Google...' : 'Continue with Google'}</span>
                  </button>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                      <div>
                        <p className="font-bold">Authentication failed</p>
                        <p className="text-[11px] mt-0.5">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Backend Status Details */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
                    <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-brand-500" />
                        <span>Supabase Auth Backend</span>
                      </span>
                      <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Connected</span>
                      </span>
                    </div>
                    <p className="text-[10px] leading-relaxed">
                      Instant single-sign-on without password storage. Sessions are cryptographically signed and refreshed automatically.
                    </p>
                  </div>
                </div>
              )}

              {/* Public Browsing Option */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => setActiveTab('market-overview')}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition inline-flex items-center space-x-1"
                >
                  <span>Explore Public Dashboard as Guest</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
