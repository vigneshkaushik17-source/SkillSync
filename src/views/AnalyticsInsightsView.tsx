import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LineChart as LineChartIcon, 
  TrendingUp, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Globe2, 
  Sparkles 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';

export const AnalyticsInsightsView: React.FC = () => {
  const { filters } = useApp();

  const outcomeTrendData = [
    { month: 'Q1 2025', placement: 62, employerSat: 3.8, skillMatch: 58, skillGap: 42 },
    { month: 'Q2 2025', placement: 64, employerSat: 3.9, skillMatch: 63, skillGap: 37 },
    { month: 'Q3 2025', placement: 67, employerSat: 4.1, skillMatch: 70, skillGap: 30 },
    { month: 'Q4 2025', placement: 70, employerSat: 4.2, skillMatch: 74, skillGap: 26 },
    { month: 'Q1 2026', placement: 72, employerSat: 4.3, skillMatch: 78, skillGap: 22 },
    { month: 'Q2 2026', placement: 74.8, employerSat: 4.5, skillMatch: 81.2, skillGap: 18.8 },
  ];

  const emergingTechRadar = [
    { tech: 'Agentic AI Workflows & Tool Calling', horizon: 'Immediate (6 Mos)', adoption: 92, impact: 'High' },
    { tech: 'Solid-State & Sodium-Ion Battery Chemistry', horizon: 'Near Term (12 Mos)', adoption: 84, impact: 'High' },
    { tech: 'Autonomous Field Drones with Edge AI', horizon: 'Near Term (18 Mos)', adoption: 78, impact: 'Medium' },
    { tech: 'Quantum-Resistant Post-Quantum Cryptography', horizon: 'Medium Term (24 Mos)', adoption: 65, impact: 'High' },
    { tech: 'Digital Twin Robotics Emulation', horizon: 'Medium Term (24 Mos)', adoption: 71, impact: 'Medium' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <LineChartIcon className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Longitudinal Outcome Analytics & Emerging Tech Radar
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          Tracking the real-world employment impact of curriculum realignments: verifying whether syllabus modernizations correlate with accelerated job placements and employer satisfaction.
        </p>
      </div>

      {/* Before / After Impact Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placement Rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Placement Rate
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-400">62.0%</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">74.8%</span>
          </div>
          <p className="text-[11px] font-bold text-emerald-600 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12.8% Total Uplift
          </p>
        </div>

        {/* Employer Satisfaction */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Employer Satisfaction
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-400">3.8 / 5.0</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-2xl font-black text-amber-500">4.5 / 5.0</span>
          </div>
          <p className="text-[11px] font-bold text-amber-500 flex items-center">
            <Star className="w-3.5 h-3.5 mr-1 fill-amber-500" /> +0.7 ⭐ Index Gain
          </p>
        </div>

        {/* Skill Match Index */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Candidate Skill Match
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-400">58.0%</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-2xl font-black text-brand-600 dark:text-brand-400">81.2%</span>
          </div>
          <p className="text-[11px] font-bold text-brand-600 dark:text-brand-400 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> +23.2% Relevancy
          </p>
        </div>

        {/* Skill Gap Reduction */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Systemic Skill Mismatch
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-400">42.0%</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-2xl font-black text-rose-500">18.8%</span>
          </div>
          <p className="text-[11px] font-bold text-emerald-600 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1 rotate-180" /> -23.2% Gap Reduction
          </p>
        </div>
      </div>

      {/* Longitudinal Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement & Relevancy Trend */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Placement Rate & Candidate Match Trajectory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Quarterly trajectory post-curriculum interventions (2025 - 2026)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outcomeTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="placement" name="Placement Rate (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="skillMatch" name="Skill Match Index (%)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Gap Reduction Curve */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Skill Mismatch Compression Curve
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Demonstrating progressive convergence between industry demand & talent supply
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={outcomeTrendData}>
                <defs>
                  <linearGradient id="colorGap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 50]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="skillGap" name="Skill Gap Deficit (%)" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGap)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Emerging Technology Radar Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Emerging Technology Horizon Radar (24-Month Forecast)
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            For University Board of Studies & Curriculum Committees
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergingTechRadar.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {tech.horizon}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  tech.impact === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {tech.impact} Impact
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {tech.tech}
              </h4>

              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                  <span>Adoption Velocity</span>
                  <span className="text-brand-600 dark:text-brand-400">{tech.adoption}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-500 h-full rounded-full"
                    style={{ width: `${tech.adoption}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
