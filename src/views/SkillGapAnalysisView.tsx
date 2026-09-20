import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateSkillGap, getGapSeverity, calculatePriorityGapScore } from '../services/scoringEngine';
import { calculateSkillGapAnalysis, SkillGapAnalysisResult } from '../services/alignmentIntelligence';
import { 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  SlidersHorizontal, 
  ArrowUpRight, 
  ShieldAlert, 
  Zap, 
  Bot, 
  FileText, 
  Plus, 
  X, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  RefreshCw, 
  Flame, 
  Award, 
  Layers, 
  Briefcase, 
  Check,
  TrendingUp,
  BarChart2,
  DollarSign,
  Users
} from 'lucide-react';
import { ScoreMeter } from '../components/common/ScoreMeter';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip 
} from 'recharts';

export const SkillGapAnalysisView: React.FC = () => {
  const { skills, jobRoles, filters, setSelectedSkillForModal, setActiveTab, addToast } = useApp();

  // Mode: 'analyzer' (Interactive AI Analyzer) vs 'matrix' (Aggregate Pan-Industry Radar Matrix)
  const [activeMode, setActiveMode] = useState<'analyzer' | 'matrix'>('analyzer');

  // Analyzer Form State
  const [targetRole, setTargetRole] = useState<string>('Data Analyst');
  const [currentSkills, setCurrentSkills] = useState<string[]>(['Python', 'Excel', 'Tableau']);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('Fresher (0-1 yrs)');
  const [resumeText, setResumeText] = useState<string>('');
  const [showResumeInput, setShowResumeInput] = useState<boolean>(false);

  // Loading & Results State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SkillGapAnalysisResult | null>(() => {
    return calculateSkillGapAnalysis({
      targetRole: 'Data Analyst',
      currentSkills: ['Python', 'Excel', 'Tableau'],
      experienceLevel: 'Fresher (0-1 yrs)'
    });
  });

  // Severity Filter for aggregate matrix view
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical Gap' | 'Needs Improvement' | 'Aligned'>('All');

  // Preset skill suggestions
  const PRESET_SKILL_SUGGESTIONS = [
    'Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Machine Learning', 
    'Docker', 'AWS', 'PyTorch', 'Statistics', 'React.js', 'Git', 'Kubernetes',
    'EV Diagnostics', 'BMS Testing', 'R Programming'
  ];

  // Handle Add Skill
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (currentSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      addToast('info', 'Skill already added', `"${trimmed}" is already in your skill list.`);
      return;
    }
    setCurrentSkills(prev => [...prev, trimmed]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // Run AI Skill-Gap Analysis
  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSkills.length === 0 && !resumeText.trim()) {
      addToast('warning', 'Skills Required', 'Please select or add at least one current skill or paste resume text.');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const result = calculateSkillGapAnalysis({
        targetRole,
        currentSkills,
        experienceLevel,
        resumeText: resumeText.trim() ? resumeText : undefined
      });

      setAnalysisResult(result);
      setIsAnalyzing(false);
      addToast('success', 'AI Agent Analysis Complete', `Evaluated skills & predicted job market for ${targetRole}. Match: ${result.jobMarketMatchScore}%`);
    }, 600);
  };

  // Macro view calculations
  const filteredSkills = skills.filter(s => {
    const matchesSector = filters.sector === 'All Sectors' || s.sector === filters.sector;
    const gap = calculateSkillGap(s.demandScore, s.supplyScore);
    const severity = getGapSeverity(gap);
    const matchesSeverity = severityFilter === 'All' || severity === severityFilter;
    const matchesSearch = !filters.searchQuery || s.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
    return matchesSector && matchesSeverity && matchesSearch;
  });

  const priorityRankedSkills = [...skills]
    .map(s => ({
      ...s,
      gap: calculateSkillGap(s.demandScore, s.supplyScore),
      priorityScore: calculatePriorityGapScore(s),
      severity: getGapSeverity(calculateSkillGap(s.demandScore, s.supplyScore))
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const radarData = skills.slice(0, 6).map(s => ({
    subject: s.name.length > 18 ? s.name.substring(0, 16) + '...' : s.name,
    demand: s.demandScore,
    supply: s.supplyScore,
    fullMark: 100
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner & Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              <Bot className="w-5 h-5 text-rose-500" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              AI Skill-Gap Analyzer & Job Market Predictor Agent
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Autonomous AI agent that evaluates your candidate skills against employer demand, identifies prioritized competency gaps, and predicts future job market trajectories.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveMode('analyzer')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeMode === 'analyzer'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>AI Skill-Gap Analyzer</span>
          </button>
          <button
            onClick={() => setActiveMode('matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeMode === 'matrix'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Pan-Industry Gap Matrix</span>
          </button>
        </div>
      </div>

      {activeMode === 'analyzer' ? (
        /* INTERACTIVE AI SKILL-GAP ANALYZER */
        <div className="space-y-6">
          {/* User Inputs Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Enter Your Career Target & Existing Competencies
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Autonomous AI Evaluation
              </span>
            </div>

            <form onSubmit={handleRunAnalysis} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Job Role Input */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Job Role (Select Your Desired Career) *
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-extrabold focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                  >
                    <option value="Data Analyst">Data Analyst (SQL, Python, Power BI, Statistics)</option>
                    <option value="AI/ML Engineer">AI/ML Engineer (Python, PyTorch, GenAI, MLOps)</option>
                    <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer (AWS, Docker, K8s, CI/CD)</option>
                    <option value="EV Powertrain & Battery Diagnostic Technician">EV Powertrain & Battery Diagnostic Technician (BMS, High Voltage, CAN Bus)</option>
                  </select>
                </div>

                {/* Experience Level Input */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Experience Level *
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                  >
                    <option value="Student / College Learner">Student / College Learner</option>
                    <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
                    <option value="1–3 Years Experience">1–3 Years Experience</option>
                    <option value="3–5 Years Experience">3–5 Years Experience</option>
                    <option value="5+ Years Senior Professional">5+ Years Senior Professional</option>
                  </select>
                </div>
              </div>

              {/* Current Skills Multi-Select Input */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Current Skills (Enter or select your existing skills) *
                </label>

                {/* Selected Skills Badges Container */}
                <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[50px] flex flex-wrap gap-2 items-center">
                  {currentSkills.length === 0 ? (
                    <span className="text-slate-400 italic text-xs">No skills selected yet. Click suggestions below or type custom skills...</span>
                  ) : (
                    currentSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5 text-brand-500 mr-1.5" />
                        <span>{sk}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(sk)}
                          className="ml-2 text-brand-400 hover:text-rose-500 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Custom Skill & Preset Suggestions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="flex items-center space-x-1.5 flex-1 max-w-sm">
                    <input
                      type="text"
                      placeholder="Add custom skill (e.g. Pandas, Scikit-Learn)..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(newSkillInput);
                        }
                      }}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill(newSkillInput)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 font-medium">Suggestions:</span>
                    {PRESET_SKILL_SUGGESTIONS.slice(0, 8).map((preset) => {
                      const isSelected = currentSkills.some(s => s.toLowerCase() === preset.toLowerCase());
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => isSelected ? handleRemoveSkill(preset) : handleAddSkill(preset)}
                          className={`px-2 py-0.5 rounded-md font-semibold transition ${
                            isSelected
                              ? 'bg-brand-500 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Optional Resume Text Input */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowResumeInput(!showResumeInput)}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showResumeInput ? 'Hide Resume Text Box' : '+ Paste Resume Text to Auto-Detect Skills (Optional)'}</span>
                </button>

                {showResumeInput && (
                  <div className="mt-2 space-y-1 animate-in fade-in">
                    <textarea
                      rows={3}
                      placeholder="Paste your resume summary or project descriptions here. The AI Agent will automatically extract and evaluate skills..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 via-brand-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center space-x-2 text-xs"
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-rose-200" />
                  )}
                  <span>{isAnalyzing ? 'Comparing your skills with industry demand...' : 'Analyze My Skills & Predict Market'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Loading Animation Card */}
          {isAnalyzing && (
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-brand-200 dark:border-brand-900 shadow-md text-center space-y-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Comparing your skills with real-time industry demand...
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                AI Agent is cross-referencing {targetRole} job postings, employer surveys, and forecasting hiring trajectories.
              </p>
            </div>
          )}

          {/* AI Analysis & Job Market Prediction Output */}
          {analysisResult && !isAnalyzing && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-3">
              {/* AI Job Market Prediction Strip */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-800/60">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-brand-400" />
                    <h3 className="text-base font-black tracking-tight text-white">
                      AI Agent Job Market Forecast & Career Outlook
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {analysisResult.aiMarketPrediction.marketOutlook}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 block">2-Yr Demand Surge</span>
                    <p className="text-base font-black text-emerald-400 mt-1">{analysisResult.aiMarketPrediction.twoYearProjectedDemandGrowth}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 block">Active Hiring Vacancies</span>
                    <p className="text-base font-black text-white mt-1">{analysisResult.aiMarketPrediction.estimatedActiveVacancies.toLocaleString()}+ Openings</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 block">Placement Likelihood</span>
                    <p className="text-base font-black text-brand-300 mt-1">{analysisResult.aiMarketPrediction.placementLikelihoodPercent}% Probability</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 block">Starting Compensation</span>
                    <p className="text-base font-black text-amber-300 mt-1">{analysisResult.aiMarketPrediction.avgStartingCompensation}</p>
                  </div>
                </div>

                <p className="text-xs text-indigo-200/90 leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/10">
                  🤖 "{analysisResult.aiMarketPrediction.agentSummaryVerdict}"
                </p>
              </div>

              {/* Match Score & Strong Skills Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Match Score Card (5 Columns) */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        AI Skill Match Score
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        {analysisResult.experienceLevel}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {analysisResult.targetRoleTitle}
                    </h3>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2">
                    <ScoreMeter score={analysisResult.jobMarketMatchScore} size="lg" label="Industry Requirement Match" />
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>Requirement Match</span>
                      <span className="text-brand-600 dark:text-brand-400 font-extrabold">{analysisResult.jobMarketMatchScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${analysisResult.jobMarketMatchScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Strong Skills Profile (7 Columns) */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Skills You Already Have ({analysisResult.strongSkills.length})
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        Existing Strengths
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-3">
                      These competencies match verified hiring requisitions for {analysisResult.targetRoleTitle}:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {analysisResult.strongSkills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          <span>{sk}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      View employer demand volume across metro clusters:
                    </span>
                    <button
                      onClick={() => setActiveTab('jobs-demand')}
                      className="text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center"
                    >
                      <span>Explore Market Demand</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Missing Skills Prioritization Grid */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                      <Flame className="w-4 h-4 text-rose-500 mr-2" />
                      Skill Gap Detection & Prioritization (Critical, Important, Emerging)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Shows industry demand % and contextual rationale for every missing competency
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-semibold">
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">🔴 Critical</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold">🟡 Important</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold">🔵 Emerging</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Critical Gaps */}
                  {analysisResult.criticalGaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-rose-50/40 dark:bg-slate-850 rounded-2xl border border-rose-200 dark:border-rose-900/50 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                            Critical Gap
                          </span>
                          <span className="font-extrabold text-xs text-rose-600 dark:text-rose-400">
                            {gap.demandPercent}% Industry Demand
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900 dark:text-white mt-2">
                          {gap.skill}
                        </h4>

                        <div className="mt-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-rose-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                            Why This Skill Matters:
                          </span>
                          <p className="italic text-[11px] leading-relaxed">
                            {gap.whyItMatters}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-rose-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {gap.timeToLearn}
                        </span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          Mandatory
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Important Gaps */}
                  {analysisResult.importantGaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-amber-50/40 dark:bg-slate-850 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                            Important Gap
                          </span>
                          <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">
                            {gap.demandPercent}% Industry Demand
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900 dark:text-white mt-2">
                          {gap.skill}
                        </h4>

                        <div className="mt-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                            Why This Skill Matters:
                          </span>
                          <p className="italic text-[11px] leading-relaxed">
                            {gap.whyItMatters}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-amber-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {gap.timeToLearn}
                        </span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          Core Standard
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Emerging Skills */}
                  {analysisResult.emergingSkills.map((gap, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-blue-50/40 dark:bg-slate-850 rounded-2xl border border-blue-200 dark:border-blue-900/50 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">
                            Emerging Skill
                          </span>
                          <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">
                            {gap.demandPercent}% Industry Demand
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900 dark:text-white mt-2">
                          {gap.skill}
                        </h4>

                        <div className="mt-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                            Why This Skill Matters:
                          </span>
                          <p className="italic text-[11px] leading-relaxed">
                            {gap.whyItMatters}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-blue-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {gap.timeToLearn}
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          Fast Growing ↑
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalized Step-by-Step Learning Roadmap */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-brand-400" />
                    <h3 className="text-base font-black tracking-tight text-white">
                      Personalized Learning Roadmap: What to Learn Next
                    </h3>
                  </div>
                  <span className="text-xs text-indigo-300 font-mono">
                    Milestone-Driven Action Plan
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisResult.learningRoadmap.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                            {step.timeline}
                          </span>
                          <span className="w-5 h-5 rounded-full bg-brand-500/30 text-brand-200 font-black text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-white">
                          {step.phase}
                        </h4>

                        <div className="space-y-1">
                          <span className="text-[10px] text-indigo-300 font-bold block">Target Competencies:</span>
                          <div className="flex flex-wrap gap-1">
                            {step.skills.map(s => (
                              <span key={s} className="px-2 py-0.5 rounded bg-white/15 text-[11px] font-semibold text-white">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="text-[11px] text-indigo-200/80 italic pt-1">
                          🎯 {step.milestoneOutcome}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PAN-INDUSTRY AGGREGATE RADAR & GAP MATRIX VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                  <Zap className="w-4 h-4 text-brand-500 mr-1.5" />
                  Industry Demand ↔ Supply Radar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Multi-dimensional divergence matrix across 6 top sectors
                </p>

                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Industry Demand" dataKey="demand" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} />
                      <Radar name="Candidate Supply" dataKey="supply" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center font-bold text-brand-600 dark:text-brand-400">
                  <span className="w-3 h-3 rounded-full bg-brand-500 mr-1.5 opacity-80" /> Industry Demand
                </span>
                <span className="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5 opacity-80" /> Available Candidate Talent
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                  <Sparkles className="w-4 h-4 text-rose-500 mr-1.5" />
                  Priority Ranked Gaps (Weighted Impact)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Calculated via: <code>Demand + Role Relevance + Proficiency Gap + Location Density</code>
                </p>

                <div className="space-y-3">
                  {priorityRankedSkills.slice(0, 4).map((skill, index) => (
                    <div
                      key={skill.id}
                      onClick={() => setSelectedSkillForModal(skill)}
                      className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-brand-400 transition"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className={`w-5 h-5 rounded-full font-black text-[11px] flex items-center justify-center ${
                            skill.severity === 'Critical Gap' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                            skill.severity === 'Needs Improvement' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            #{index + 1}
                          </span>
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {skill.name}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          skill.severity === 'Critical Gap' ? 'bg-rose-500 text-white' :
                          skill.severity === 'Needs Improvement' ? 'bg-amber-500 text-white' :
                          'bg-emerald-500 text-white'
                        }`}>
                          {skill.severity}
                        </span>
                      </div>

                      <div className="space-y-1 mt-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                          <span>Industry: {skill.demandScore}</span>
                          <span>Talent: {skill.supplyScore}</span>
                          <span className="text-rose-500 font-bold">Deficit: -{skill.gap} pts</span>
                        </div>
                        <div className="relative w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-brand-500 rounded-full"
                            style={{ width: `${skill.demandScore}%` }}
                          />
                          <div
                            className="absolute top-0 left-0 h-full bg-emerald-500/80 rounded-full"
                            style={{ width: `${skill.supplyScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Critical deficits require institutional training capacity expansion</span>
                <button
                  onClick={() => setActiveTab('district-planning')}
                  className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                >
                  Generate District Plan →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
