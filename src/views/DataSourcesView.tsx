import React from 'react';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { 
  Database, 
  Layers, 
  Server, 
  CheckCircle2, 
  Terminal, 
  ArrowDown, 
  Key, 
  Code,
  ShieldCheck,
  RefreshCw,
  Cpu
} from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  const { addToast } = useApp();

  const supabaseEntities = [
    { source: 'Dataset 1 (India)', table: 'job_postings_in', records: '97,929 Postings', purpose: 'Indian Job Market Dataset 2025 with salary bands, experience tiers & location telemetry' },
    { source: 'Dataset 2 (Global)', table: 'postings_global', records: '123,849 Postings', purpose: 'Global enterprise job postings, work type classifications & compensation records' },
    { source: 'Dataset 2 (Global)', table: 'companies', records: '24,473 Enterprises', purpose: 'Company metadata, headquarters, description, and company URL profiles' },
    { source: 'Dataset 2 (Global)', table: 'benefits', records: '67,943 Records', purpose: 'Corporate perks taxonomy (401k, Medical, Dental, Vision, Tuition Assistance, Paid Time Off)' },
    { source: 'Dataset 2 (Global)', table: 'salaries', records: '40,785 Records', purpose: 'Standardized compensation data, pay periods, minimum, maximum and median USD salaries' },
    { source: 'Dataset 2 (Global)', table: 'job_skills', records: '213,768 Mappings', purpose: 'Relational skill-to-posting links across 55 standardized industry skill codes' },
    { source: 'Dataset 2 (Global)', table: 'employee_counts', records: '35,787 Snapshots', purpose: 'Enterprise headcount records, LinkedIn follower growth, and corporate scale tiers' },
    { source: 'Dataset 1 (India)', table: 'employers_in', records: '18,668 Enterprises', purpose: 'Indian corporate partners validating skill frameworks and providing hiring telemetry' },
    { source: 'Unified Intelligence', table: 'skills_taxonomy', records: '55 Curated / 213k Mappings', purpose: 'Cross-market competency definitions, demand/supply percentiles & signal weights' },
    { source: 'Unified Intelligence', table: 'job_roles', records: '10 Standard Roles', purpose: 'Cross-market occupational taxonomy with salary benchmarks & skill requirements' },
    { source: 'Regional Intelligence', table: 'districts', records: '11 Regional Hubs', purpose: 'District workforce planning nodes, trainer counts & hardware equipment inventories' },
    { source: 'Academic Intelligence', table: 'courses & curriculums', records: '15 Curriculums', purpose: 'Vocational diploma, polytechnic & university syllabus repository and credit mappings' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Data Architecture & Supabase Intelligence Pipeline
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Enterprise data flow connecting raw labour signals to automated curriculum and district planning decision support engines.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 ${
            isSupabaseConfigured
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{isSupabaseConfigured ? 'Live Supabase Cloud Connected' : 'Hybrid Local Storage & Fallback Engine'}</span>
          </span>
        </div>
      </div>

      {/* End-to-End Pipeline Architecture Flowchart */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60">
          <h3 className="text-base font-bold text-white flex items-center">
            <Cpu className="w-5 h-5 text-brand-400 mr-2" />
            Modular Intelligence Pipeline Architecture
          </h3>
          <span className="text-xs text-indigo-300 font-mono">Telemetry Layer v2.4</span>
        </div>

        {/* Visual Pipeline Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase text-indigo-300 block">1. Signal Ingestion</span>
            <h4 className="text-sm font-extrabold text-white">Multi-Source Ingestion</h4>
            <p className="text-[11px] text-indigo-200/70">
              Scraped Job Postings (45%) • Employer Surveys (25%) • Industry SSCs (15%) • Sector FDI Growth (10%)
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase text-indigo-300 block">2. Scoring Core</span>
            <h4 className="text-sm font-extrabold text-white">Labour Market Model</h4>
            <p className="text-[11px] text-indigo-200/70">
              Demand Score • Supply Indices • Net Gap Severity Matrix • Priority Ranking Multiplier
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase text-indigo-300 block">3. Alignment Engine</span>
            <h4 className="text-sm font-extrabold text-white">Curriculum Audit</h4>
            <p className="text-[11px] text-indigo-200/70">
              Course Health Index • Keep / Update / Remove / Add Action Prescriptions
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase text-indigo-300 block">4. Action Output</span>
            <h4 className="text-sm font-extrabold text-white">Decision Support</h4>
            <p className="text-[11px] text-indigo-200/70">
              District Training Batches • Lab Equipment Procurement • Student Career Pathways
            </p>
          </div>
        </div>
      </div>

      {/* Supabase Schema Entity Catalog */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
            <Server className="w-4 h-4 text-emerald-500 mr-2" />
            Supabase Relational Entities & Data Schema
          </h3>
          <span className="text-xs text-slate-500">PostgreSQL Schema Ready</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pr-4">Origin Layer</th>
                <th className="pb-3 pr-4">Table Name</th>
                <th className="pb-3 pr-4">Active Volume</th>
                <th className="pb-3">Engine Purpose & Entity Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {supabaseEntities.map((ent) => (
                <tr key={ent.table} className="hover:bg-slate-50 dark:hover:bg-slate-850/60">
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ent.source.includes('Dataset 1') 
                        ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50' 
                        : ent.source.includes('Dataset 2')
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50'
                        : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50'
                    }`}>
                      {ent.source}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                    public.{ent.table}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-slate-200">
                    {ent.records}
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">
                    {ent.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
