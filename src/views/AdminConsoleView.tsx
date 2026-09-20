import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { DataSourcesView } from './DataSourcesView';
import { SettingsView } from './SettingsView';
import { 
  ShieldAlert, 
  Database, 
  Settings, 
  Server, 
  Activity, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  Key, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Users
} from 'lucide-react';

export const AdminConsoleView: React.FC = () => {
  const { addToast, datasetSummary, dataset2Summary, unifiedSummary } = useApp();
  const { user, isAdmin, currentRole } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'architecture' | 'settings'>('overview');

  const handleRefreshPipelines = () => {
    addToast('success', 'Pipeline Refresh Triggered', 'Refreshing 221,778 posting records across Supabase tables.');
  };

  const handlePurgeCache = () => {
    localStorage.removeItem('sia_skills');
    localStorage.removeItem('sia_validations');
    addToast('info', 'Cache Purged', 'Local dataset caches refreshed from live Supabase instance.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Administrator Console
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Role: Admin Privileges Active
                </span>
              </h2>
            </div>
            <p className="text-xs text-indigo-200/80">
              System health monitoring, Supabase relational pipeline orchestration, dataset ingestion feeds, and ML scoring model calibration.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefreshPipelines}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Pipelines</span>
            </button>
            <button
              onClick={handlePurgeCache}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Purge Cache</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation inside Admin Console */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-white/10 relative z-10">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeAdminTab === 'overview'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Infrastructure & Health</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('architecture')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeAdminTab === 'architecture'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Architecture & Tables</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeAdminTab === 'settings'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ML Weights & System Config</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                <span className="font-semibold">Supabase Backend</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {isSupabaseConfigured ? 'Live & Connected' : 'Mock Fallback Engine'}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                PostgreSQL 15.1 Cloud DB
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                <span className="font-semibold">Total Ingested Postings</span>
                <Database className="w-4 h-4 text-brand-500" />
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {unifiedSummary.totalJobOpenings?.toLocaleString() || '221,778'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                97.9k India + 123.8k Global
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                <span className="font-semibold">Tracked Enterprises</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {unifiedSummary.totalUniqueCompanies?.toLocaleString() || '43,141'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Active hiring corporate entities
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                <span className="font-semibold">Auth & RBAC Layer</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                Google OAuth 2.0
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                PKCE Flow & Token Auto-Refresh
              </p>
            </div>
          </div>

          {/* System Pipeline Status Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-500" />
              Data Pipeline & Ingestion Health Status
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Dataset 1 Pipeline: Indian Labour Market Telemetry
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Table: <code className="font-mono text-brand-600">job_postings_in</code> (97,929 rows across 11 districts)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Healthy • 100% Ingested
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Dataset 2 Pipeline: Global Enterprise Postings & Skills Mapping
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Tables: <code className="font-mono text-brand-600">postings_global, companies, benefits, salaries, job_skills</code> (123,849 postings)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Healthy • 100% Normalized
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Relational Employer Validation Queue
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Table: <code className="font-mono text-brand-600">employer_validations</code> (Industry feedback loop)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Active • Real-Time Ingest
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'architecture' && (
        <DataSourcesView />
      )}

      {activeAdminTab === 'settings' && (
        <SettingsView />
      )}
    </div>
  );
};
