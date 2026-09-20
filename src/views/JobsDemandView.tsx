import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateCareerDemandExplorer, CareerDemandResult } from '../services/alignmentIntelligence';
import { JobRole } from '../types';
import { 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Building2, 
  MapPin, 
  PlusCircle, 
  Check, 
  Edit3, 
  AlertTriangle,
  BadgeCheck,
  Send,
  Sparkles,
  Compass,
  ArrowRight,
  DollarSign,
  Users,
  Search,
  RefreshCw,
  Flame,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const JobsDemandView: React.FC = () => {
  const { jobRoles, validations, addEmployerValidation, filters, setActiveTab, addToast } = useApp();

  // Mode: 'explorer' (Career Demand Explorer) vs 'directory' (Job Directory & Employer Validations)
  const [activeTabSub, setActiveTabSub] = useState<'explorer' | 'directory'>('explorer');

  // Career Demand Explorer State
  const [selectedRole, setSelectedRole] = useState<string>('Data Analyst');
  const [selectedLocation, setSelectedLocation] = useState<string>('Bengaluru Urban');
  const [selectedExp, setSelectedExp] = useState<string>('Fresher / Entry (0-1 yrs)');
  const [isExploring, setIsExploring] = useState<boolean>(false);
  const [explorerResult, setExplorerResult] = useState<CareerDemandResult | null>(() => {
    return calculateCareerDemandExplorer({
      role: 'Data Analyst',
      location: 'Bengaluru Urban',
      experienceLevel: 'Fresher / Entry (0-1 yrs)'
    });
  });

  // Employer validation form state
  const [showValidationForm, setShowValidationForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    representative: '',
    role: 'Data Analyst & BI Specialist',
    industry: 'IT & Tech' as any,
    action: 'Validate Skill' as const,
    targetItem: '',
    comment: ''
  });

  const filteredRoles = jobRoles.filter(r => 
    (filters.sector === 'All Sectors' || r.sector === filters.sector) &&
    (!filters.searchQuery || r.title.toLowerCase().includes(filters.searchQuery.toLowerCase()))
  );

  const handleRunExplorer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExploring(true);

    setTimeout(() => {
      const result = calculateCareerDemandExplorer({
        role: selectedRole,
        location: selectedLocation,
        experienceLevel: selectedExp
      });
      setExplorerResult(result);
      setIsExploring(false);
      addToast('success', 'Market Explored', `Loaded live demand telemetry for ${selectedRole} in ${selectedLocation}.`);
    }, 550);
  };

  const handleSubmitValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.targetItem || !formData.comment) {
      addToast('warning', 'Incomplete Form', 'Please complete company name, competency item, and validation comment.');
      return;
    }

    await addEmployerValidation(formData);
    setFormData({
      companyName: '',
      representative: '',
      role: 'Data Analyst & BI Specialist',
      industry: 'IT & Tech',
      action: 'Validate Skill',
      targetItem: '',
      comment: ''
    });
    setShowValidationForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tabs Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              <Compass className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Career Demand Explorer & Jobs Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Real-time employer demand percentages, location hiring velocity, salary benchmarks, and trending skills gaining industry momentum.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTabSub('explorer')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTabSub === 'explorer'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Career Demand Explorer</span>
          </button>
          <button
            onClick={() => setActiveTabSub('directory')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTabSub === 'directory'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>Roles & Employer Validation Feed</span>
          </button>
        </div>
      </div>

      {activeTabSub === 'explorer' ? (
        /* FEATURE 2: CAREER DEMAND EXPLORER */
        <div className="space-y-6">
          {/* Market Exploration Filter Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-brand-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Explore Live Employer Demand by Role, Location & Tier
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Synthesized across 221,778 Postings (97.9k Indian Market + 123.8k Global Enterprise)
              </span>
            </div>

            <form onSubmit={handleRunExplorer} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Job Role *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-extrabold focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                >
                  <option value="Data Analyst">Data Analyst & BI Specialist</option>
                  <option value="AI/ML Engineer">AI/ML Applied Engineer</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps Infrastructure Engineer</option>
                  <option value="EV Powertrain & Battery Diagnostic Technician">EV Powertrain & Battery Diagnostic Technician</option>
                  <option value="Software Engineer">Software Development Engineer</option>
                  <option value="Full Stack Developer">Full Stack Java Application Developer</option>
                  <option value="Business Analyst">BFSI Risk & Business Analyst</option>
                  <option value="Cybersecurity Specialist">Cybersecurity & Threat Analyst</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Region *
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                >
                  <optgroup label="India Regional Hubs">
                    <option value="Bengaluru Urban">Bengaluru Urban (KA) - 26,019 Postings</option>
                    <option value="Delhi NCR">Delhi NCR (Noida/Gurugram) - 11,323 Postings</option>
                    <option value="Hyderabad">Hyderabad (TS) - 10,274 Postings</option>
                    <option value="Pune">Pune (MH) - 9,731 Postings</option>
                    <option value="Mumbai MMR">Mumbai MMR (MH) - 9,599 Postings</option>
                    <option value="Chennai">Chennai (TN) - 6,433 Postings</option>
                    <option value="Ahmedabad">Ahmedabad (GJ) - 2,598 Postings</option>
                    <option value="Kolkata">Kolkata (WB) - 1,486 Postings</option>
                    <option value="Jaipur">Jaipur (RJ) - 1,088 Postings</option>
                    <option value="Kochi">Kochi (KL) - 938 Postings</option>
                    <option value="Coimbatore">Coimbatore (TN) - 841 Postings</option>
                  </optgroup>
                  <optgroup label="Global Enterprise Hubs">
                    <option value="New York, NY">New York, NY (Global Hub)</option>
                    <option value="San Francisco Bay Area, CA">San Francisco Bay Area, CA (US Tech)</option>
                    <option value="Chicago, IL">Chicago, IL (US)</option>
                    <option value="London, UK">London, UK (Europe Tech)</option>
                    <option value="Remote / Distributed">Remote / Distributed (Global)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Experience Level *
                </label>
                <select
                  value={selectedExp}
                  onChange={(e) => setSelectedExp(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                >
                  <option value="Fresher / Entry (0-1 yrs)">Fresher / Entry (0-1 yrs)</option>
                  <option value="Mid-Level (2-4 yrs)">Mid-Level (2-4 yrs)</option>
                  <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isExploring}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center space-x-2 text-xs"
                >
                  {isExploring ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Compass className="w-4 h-4" />
                  )}
                  <span>{isExploring ? 'Exploring Market...' : 'Explore Market'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Results Dashboard */}
          {explorerResult && !isExploring && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-3">
              {/* Macro Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Active Vacancies</span>
                  <p className="text-2xl font-black text-brand-600 dark:text-brand-400">
                    {explorerResult.totalActiveOpenings.toLocaleString()}+ Openings
                  </p>
                  <span className="text-[11px] text-slate-500">In {explorerResult.location}</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">YoY Hiring Velocity</span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-1" /> +{explorerResult.yoyHiringGrowth}%
                  </p>
                  <span className="text-[11px] text-emerald-600 font-semibold">{explorerResult.marketSentiment}</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Salary Benchmark</span>
                  <p className="text-xl font-black text-slate-900 dark:text-white">
                    {explorerResult.averageSalary}
                  </p>
                  <span className="text-[11px] text-slate-500">For {explorerResult.experienceLevel}</span>
                </div>

                <div className="bg-gradient-to-br from-brand-600 to-indigo-600 p-5 rounded-2xl text-white shadow-md flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-200 block">Next Action Step</span>
                    <p className="text-sm font-black mt-0.5">Analyze Your Skill Gap</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('skill-gap')}
                    className="mt-3 w-full py-1.5 bg-white text-brand-700 hover:bg-brand-50 rounded-lg font-extrabold text-xs transition flex items-center justify-center space-x-1"
                  >
                    <span>Run Gap Analysis →</span>
                  </button>
                </div>
              </div>

              {/* Skills Demand Percentage List & Trending Skills Side-by-Side */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Top Skills Employers Demand Percentage (7 Columns) */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Top Skills Employers Demand (% of Job Postings)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Evaluated across hiring requisitions for {explorerResult.roleTitle}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded">
                      Live Telemetry
                    </span>
                  </div>

                  <div className="space-y-3">
                    {explorerResult.topSkillsDemand.slice(0, 6).map((sk, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-black text-[11px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{sk.skill}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-black text-brand-600 dark:text-brand-400 text-sm">
                              {sk.demandPercent}%
                            </span>
                          </div>
                        </div>

                        {/* Demand Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full rounded-full transition-all duration-700"
                            style={{ width: `${sk.demandPercent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Skills Gaining Demand (5 Columns) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Trending Skills Card */}
                  <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-5 h-5 text-rose-400" />
                        <h3 className="text-base font-black tracking-tight text-white">
                          Trending Skills Gaining Fast Demand
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Surging
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {explorerResult.trendingSkills.map((trend, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-xs text-white block">{trend.skill} ↑</span>
                            <span className="text-[10px] text-indigo-300">{trend.trendType}</span>
                          </div>
                          <span className="text-xs font-black text-emerald-400">
                            +{trend.momentumPercent}% YoY
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-indigo-800/60">
                      <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                        Recommended Next-Gen Skills to Learn:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {explorerResult.recommendedSkillsToLearn.map((rec) => (
                          <span
                            key={rec}
                            className="px-2 py-0.5 rounded bg-white/15 text-[11px] font-semibold text-white"
                          >
                            + {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Hiring Enterprises */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center">
                      <Building2 className="w-4 h-4 text-brand-500 mr-1.5" />
                      Active Hiring Companies in {explorerResult.location}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {explorerResult.topHiringCompanies.map((comp) => (
                        <span
                          key={comp}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* JOB ROLES DIRECTORY & LIVE EMPLOYER VALIDATIONS FEED */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Occupational Standards & Live Employer Endorsement Feed
            </h3>
            <button
              onClick={() => setShowValidationForm(!showValidationForm)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Employer Endorsement</span>
            </button>
          </div>

          {/* Validation Form */}
          {showValidationForm && (
            <div className="bg-brand-50/50 dark:bg-slate-900 border-2 border-brand-500/30 rounded-2xl p-6 shadow-xl animate-in fade-in">
              <form onSubmit={handleSubmitValidation} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Infosys, Tata Motors, Apollo"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Representative Title</label>
                  <input
                    type="text"
                    placeholder="e.g. VP Engineering"
                    value={formData.representative}
                    onChange={e => setFormData({ ...formData, representative: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Action</label>
                  <select
                    value={formData.action}
                    onChange={e => setFormData({ ...formData, action: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Validate Skill">✓ Validate High-Demand Skill</option>
                    <option value="Validate Role">✓ Validate Role Framework</option>
                    <option value="Suggest Skill">✎ Suggest Emerging Skill</option>
                    <option value="Report Outdated Skill">⚠ Report Obsolete Skill</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Skill or Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Databricks, GenAI, CAN-FD"
                    value={formData.targetItem}
                    onChange={e => setFormData({ ...formData, targetItem: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Comment</label>
                  <textarea
                    rows={2}
                    placeholder="Explain the industry justification..."
                    value={formData.comment}
                    onChange={e => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowValidationForm(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg font-bold">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-lg font-bold">Submit Record</button>
                </div>
              </form>
            </div>
          )}

          {/* Validation Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validations.map((val) => (
              <div
                key={val.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{val.companyName}</span>
                    <p className="text-[11px] text-slate-400">{val.representative}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    val.action === 'Validate Skill' || val.action === 'Validate Role' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                    val.action === 'Suggest Skill' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                    'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {val.action}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Target: {val.targetItem}</span>
                  <p className="text-slate-600 dark:text-slate-400 italic">"{val.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
