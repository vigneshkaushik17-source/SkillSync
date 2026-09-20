import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateCandidateJobMatch } from '../services/scoringEngine';
import { runAICareerAndSalaryPredictor } from '../services/aiCareerPredictor';
import { ProficiencyLevel, AIPredictionResult } from '../types';
import { 
  UserCircle, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  Award, 
  Plus, 
  Trash2, 
  Edit3,
  TrendingUp,
  MapPin,
  Mail,
  Calendar,
  DollarSign,
  Building,
  BookOpen,
  Bot,
  Zap,
  Save,
  X,
  RefreshCw,
  Check
} from 'lucide-react';
import { ScoreMeter } from '../components/common/ScoreMeter';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const CandidateProfileView: React.FC = () => {
  const { candidateProfile, updateCandidateProfile, jobRoles, skills, pathways, addToast } = useApp();

  // Profile Edit Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: candidateProfile.fullName || '',
    email: candidateProfile.email || '',
    age: candidateProfile.age || 23,
    education: candidateProfile.education || '',
    experienceYears: candidateProfile.experienceYears || 0,
    industryDomain: candidateProfile.industryDomain || 'IT & Tech',
    internships: candidateProfile.internships || '',
    salaryExpectation: candidateProfile.salaryExpectation || '₹8.5 LPA',
    desiredRole: candidateProfile.desiredRole || 'Data Analyst & BI Specialist',
    preferredLocation: candidateProfile.preferredLocation || 'Bengaluru Urban'
  });

  // New Skill / Cert Inputs
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState<ProficiencyLevel>('Intermediate');
  const [newCert, setNewCert] = useState('');

  // AI Predictor State
  const [isAiPredicting, setIsAiPredicting] = useState(false);
  const [aiResult, setAiResult] = useState<AIPredictionResult | null>(
    candidateProfile.aiPrediction || null
  );

  // Sync edit form data if profile changes externally
  useEffect(() => {
    setEditFormData({
      fullName: candidateProfile.fullName || '',
      email: candidateProfile.email || '',
      age: candidateProfile.age || 23,
      education: candidateProfile.education || '',
      experienceYears: candidateProfile.experienceYears || 0,
      industryDomain: candidateProfile.industryDomain || 'IT & Tech',
      internships: candidateProfile.internships || '',
      salaryExpectation: candidateProfile.salaryExpectation || '₹8.5 LPA',
      desiredRole: candidateProfile.desiredRole || 'Data Analyst & BI Specialist',
      preferredLocation: candidateProfile.preferredLocation || 'Bengaluru Urban'
    });
  }, [candidateProfile]);

  // Run initial AI prediction if not yet run
  useEffect(() => {
    if (!aiResult) {
      const pred = runAICareerAndSalaryPredictor(candidateProfile, skills, jobRoles);
      setAiResult(pred);
    }
  }, []);

  const targetJobRole = jobRoles.find(r => r.title === candidateProfile.desiredRole) || jobRoles[0];

  const matchDiagnostics = calculateCandidateJobMatch(
    candidateProfile.skills,
    targetJobRole
  );

  // Handle Save Profile Details
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.email.includes('@')) {
      addToast('warning', 'Invalid Email', 'Please enter a valid Gmail or work email address.');
      return;
    }

    const updatedProfile = {
      ...candidateProfile,
      fullName: editFormData.fullName,
      email: editFormData.email,
      age: Number(editFormData.age),
      education: editFormData.education,
      experienceYears: Number(editFormData.experienceYears),
      industryDomain: editFormData.industryDomain,
      internships: editFormData.internships,
      salaryExpectation: editFormData.salaryExpectation,
      desiredRole: editFormData.desiredRole,
      preferredLocation: editFormData.preferredLocation
    };

    // Recalculate AI Prediction with newly updated profile
    const freshPrediction = runAICareerAndSalaryPredictor(updatedProfile, skills, jobRoles);
    updatedProfile.aiPrediction = freshPrediction;

    updateCandidateProfile(updatedProfile);
    setAiResult(freshPrediction);
    setIsEditingProfile(false);
    addToast('success', 'Profile Updated', 'Candidate metadata and AI salary projections updated.');
  };

  // Trigger Manual AI Recalibration
  const handleRunAiPredictor = () => {
    setIsAiPredicting(true);
    setTimeout(() => {
      const freshPrediction = runAICareerAndSalaryPredictor(candidateProfile, skills, jobRoles);
      setAiResult(freshPrediction);
      updateCandidateProfile({ ...candidateProfile, aiPrediction: freshPrediction });
      setIsAiPredicting(false);
      addToast('success', 'AI Prediction Complete', 'Synthesized hiring demand and projected future salary trajectory.');
    }, 600);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    if (candidateProfile.skills.some(s => s.name.toLowerCase() === newSkillName.toLowerCase())) {
      addToast('warning', 'Skill Exists', 'This skill is already in your profile.');
      return;
    }

    const updated = {
      ...candidateProfile,
      skills: [...candidateProfile.skills, { name: newSkillName.trim(), proficiency: newSkillProf, verified: false }]
    };
    const freshPred = runAICareerAndSalaryPredictor(updated, skills, jobRoles);
    updated.aiPrediction = freshPred;
    setAiResult(freshPred);
    updateCandidateProfile(updated);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillNameToRemove: string) => {
    const updated = {
      ...candidateProfile,
      skills: candidateProfile.skills.filter(s => s.name !== skillNameToRemove)
    };
    const freshPred = runAICareerAndSalaryPredictor(updated, skills, jobRoles);
    updated.aiPrediction = freshPred;
    setAiResult(freshPred);
    updateCandidateProfile(updated);
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.trim()) return;

    const updated = {
      ...candidateProfile,
      certifications: [...candidateProfile.certifications, newCert.trim()]
    };
    updateCandidateProfile(updated);
    setNewCert('');
  };

  const handleRemoveCertification = (index: number) => {
    const updated = {
      ...candidateProfile,
      certifications: candidateProfile.certifications.filter((_, i) => i !== index)
    };
    updateCandidateProfile(updated);
  };

  // Salary projection chart data
  const salaryTimelineData = aiResult ? [
    { period: 'Current (2026)', salary: parseFloat(aiResult.currentMarketValue.replace(/[^0-9.]/g, '')) || 8.5 },
    { period: 'In 12 Months (2027)', salary: parseFloat(aiResult.projected1YearSalary.replace(/[^0-9.]/g, '')) || 14.0 },
    { period: 'In 36 Months (2029)', salary: parseFloat(aiResult.projected3YearSalary.replace(/[^0-9.]/g, '')) || 23.5 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Candidate Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand-500/20">
            {candidateProfile.fullName ? candidateProfile.fullName.charAt(0) : 'A'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {candidateProfile.fullName || 'Candidate Profile'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Verified Candidate
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                <Mail className="w-3.5 h-3.5 text-brand-500 mr-1" />
                {candidateProfile.email || 'user@gmail.com'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1" />
                {candidateProfile.age || 23} Yrs Old
              </span>
              <span>•</span>
              <span>{candidateProfile.education}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {candidateProfile.experienceYears} Yrs Experience ({candidateProfile.industryDomain || 'IT & Tech'})
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile & Run AI Prediction Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditingProfile(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={handleRunAiPredictor}
            disabled={isAiPredicting}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition flex items-center space-x-1.5"
          >
            {isAiPredicting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Bot className="w-4 h-4 text-brand-200" />
            )}
            <span>{isAiPredicting ? 'AI Analyzing...' : 'Run AI Career Predictor'}</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-850/60">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Edit Candidate Profile & Career Preferences
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={e => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gmail / Work Email *
                  </label>
                  <input
                    type="email"
                    placeholder="candidate@gmail.com"
                    value={editFormData.email}
                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    min={16}
                    max={75}
                    value={editFormData.age}
                    onChange={e => setEditFormData({ ...editFormData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Industry Domain / Sector *
                  </label>
                  <select
                    value={editFormData.industryDomain}
                    onChange={e => setEditFormData({ ...editFormData, industryDomain: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none font-semibold"
                  >
                    <option value="IT & Tech">IT & Tech</option>
                    <option value="Manufacturing & EV">Manufacturing & EV</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="BFSI">BFSI</option>
                    <option value="Agriculture & AgriTech">Agriculture & AgriTech</option>
                    <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                    <option value="Tourism & Hospitality">Tourism & Hospitality</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Educational Qualifications
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Computer Science, Diploma in Mechanical, B.Sc"
                    value={editFormData.education}
                    onChange={e => setEditFormData({ ...editFormData, education: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Industry Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={editFormData.experienceYears}
                    onChange={e => setEditFormData({ ...editFormData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Salary Expectations (e.g. ₹8.5 LPA or ₹12L)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹8.5 LPA or ₹12,00,000 / yr"
                    value={editFormData.salaryExpectation}
                    onChange={e => setEditFormData({ ...editFormData, salaryExpectation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none font-bold text-brand-600 dark:text-brand-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Internships, Project Fellowships & Practicums
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 6 Months Data Engineering Intern at Flipkart Labs; EV Powertrain Diagnostics Capstone Project"
                    value={editFormData.internships}
                    onChange={e => setEditFormData({ ...editFormData, internships: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Desired Career Role
                  </label>
                  <select
                    value={editFormData.desiredRole}
                    onChange={e => setEditFormData({ ...editFormData, desiredRole: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none font-semibold"
                  >
                    {jobRoles.map(r => (
                      <option key={r.id} value={r.title}>{r.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Location / District
                  </label>
                  <input
                    type="text"
                    value={editFormData.preferredLocation}
                    onChange={e => setEditFormData({ ...editFormData, preferredLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow flex items-center space-x-1"
                >
                  <Save className="w-4 h-4 mr-1" />
                  <span>Save & Recalibrate AI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Career & Salary Intelligence Predictor Dashboard (Feature Focus) */}
      {aiResult && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-indigo-800/60">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-300 shadow-inner">
                <Bot className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-black tracking-tight text-white">
                    AI Career & Future Salary Intelligence Engine
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-300 border border-purple-400/40">
                    Active ML Model
                  </span>
                </div>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  Predicting high-ROI skills to learn and multi-year salary trajectories based on labor market supply/demand elasticity.
                </p>
              </div>
            </div>

            <span className="text-[11px] text-indigo-300 font-mono">
              Calibrated: {aiResult.generatedAt}
            </span>
          </div>

          {/* AI Salary Projections Scorecards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                Current Market Valuation
              </span>
              <p className="text-2xl font-black text-white">{aiResult.currentMarketValue.split(' ')[0]}</p>
              <span className="text-[11px] text-indigo-200/70 block">
                {candidateProfile.salaryExpectation ? `Target Expectation: ${candidateProfile.salaryExpectation}` : 'Based on current skills'}
              </span>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                1-Year Projected Salary (2027)
              </span>
              <p className="text-2xl font-black text-emerald-400">{aiResult.projected1YearSalary}</p>
              <span className="text-[11px] font-bold text-emerald-300 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +{aiResult.potentialSalaryUpliftPercent}% Uplift with AI skills
              </span>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                3-Year Senior Projection (2029)
              </span>
              <p className="text-2xl font-black text-purple-300">{aiResult.projected3YearSalary}</p>
              <span className="text-[11px] text-indigo-200/70 block">
                With advanced leadership competencies
              </span>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                Target Role Readiness Index
              </span>
              <p className="text-2xl font-black text-brand-300">{aiResult.marketReadinessScore}%</p>
              <span className="text-[11px] font-semibold text-amber-300">
                {aiResult.urgencyLevel}
              </span>
            </div>
          </div>

          {/* Salary Growth Curve Chart & AI Strategic Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Chart (5 Columns) */}
            <div className="lg:col-span-5 bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-xs font-bold text-white block mb-2">
                Projected Compensation Acceleration (LPA)
              </span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salaryTimelineData}>
                    <defs>
                      <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="period" tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                    <YAxis domain={[0, 30]} tick={{ fill: '#cbd5e1', fontSize: 10 }} unit="L" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="salary" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#salaryGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strategic Advice (7 Columns) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1" />
                  AI Executive Strategy Advice
                </span>
                <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                  {aiResult.strategicAdvice}
                </p>
                <p className="text-[11px] text-indigo-200/70 italic pt-1">
                  "{aiResult.careerTrajectorySummary}"
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  AI Recommended Industry Certifications:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {aiResult.recommendedCertifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-500/20 text-brand-200 border border-brand-400/30 flex items-center"
                    >
                      <Award className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Critical Skills to Learn Next (High ROI Modules) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center">
                <BookOpen className="w-4 h-4 text-emerald-400 mr-1.5" />
                AI Priority Learning Plan: What You Should Learn Next
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                High Salary Impact Modules
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {aiResult.criticalSkillsToLearn.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/30 text-brand-200">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-300">
                        ⏱ {item.estimatedTimeToMaster}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white mt-1.5">
                      {item.skill}
                    </h4>

                    <p className="text-[11px] text-indigo-200/80 leading-relaxed mt-1">
                      {item.reason}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">
                      {item.impactOnSalary}
                    </span>
                    <button
                      onClick={() => {
                        const updated = {
                          ...candidateProfile,
                          skills: [...candidateProfile.skills, { name: item.skill, proficiency: 'Intermediate' as ProficiencyLevel, verified: false }]
                        };
                        const freshPred = runAICareerAndSalaryPredictor(updated, skills, jobRoles);
                        updated.aiPrediction = freshPred;
                        setAiResult(freshPred);
                        updateCandidateProfile(updated);
                        addToast('success', 'Skill Added to Learning Plan', `${item.skill} added to candidate skill inventory.`);
                      }}
                      className="px-2 py-0.5 bg-brand-500 hover:bg-brand-600 text-white rounded text-[11px] font-bold transition"
                    >
                      + Add to Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Target Role Readiness & Skill Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Role Match & Connected Career Pathway (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Role Match Scorecard */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap sm:flex-nowrap items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Target Role Readiness Assessment
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {targetJobRole.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Matches <strong>{matchDiagnostics.matchedCount} of {matchDiagnostics.totalRequired}</strong> essential industry criteria.
                Average benchmark compensation: <strong className="text-brand-600 dark:text-brand-400">{targetJobRole.avgSalary}</strong>.
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                {matchDiagnostics.missingSkills.length > 0 && (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    Missing: {matchDiagnostics.missingSkills.join(', ')}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center">
              <ScoreMeter score={matchDiagnostics.matchPercent} size="lg" label="Skill Match %" />
            </div>
          </div>

          {/* Connected Visual Career Progression Map */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Visual Career Pathway Roadmap
              </h3>
            </div>

            {/* Step-by-step visual roadmap */}
            <div className="space-y-4 relative pl-4 border-l-2 border-brand-500/30 ml-2">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Step 1 • Current Baseline</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {candidateProfile.skills.length} Validated Competencies • {candidateProfile.education}
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-900" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Step 2 • Priority Gaps to Close</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {matchDiagnostics.missingSkills.length > 0
                    ? matchDiagnostics.missingSkills.join(' + ')
                    : 'Target baseline aligned'}
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-brand-500 ring-4 ring-white dark:ring-slate-900" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Step 3 • Recommended Certification</span>
                <p className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  {aiResult?.recommendedCertifications[0] || 'AWS Solutions Architect / NSDC Masterclass (8-10 Weeks)'}
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-purple-500 ring-4 ring-white dark:ring-slate-900" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Step 4 • Target Placement Opportunity</span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {targetJobRole.title} ({targetJobRole.openings.toLocaleString()} Openings across {targetJobRole.locations[0]})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Manage Skills & Certifications (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skills Management */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Current Skill Inventory ({candidateProfile.skills.length})
              </h4>
            </div>

            {/* List of current skills */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {candidateProfile.skills.map((sk) => (
                <div
                  key={sk.name}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    {sk.verified ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
                    )}
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{sk.name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {sk.proficiency}
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(sk.name)}
                      className="text-slate-400 hover:text-rose-500 transition"
                      title="Remove Skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Skill Form */}
            <form onSubmit={handleAddSkill} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Add New Competency</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Skill name (e.g. Docker, Tableau)..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-200"
                />
                <select
                  value={newSkillProf}
                  onChange={(e) => setNewSkillProf(e.target.value as any)}
                  className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-semibold"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="submit"
                  className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Certifications Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Verified Certifications ({candidateProfile.certifications.length})
            </h4>

            <div className="space-y-2">
              {candidateProfile.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{cert}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveCertification(idx)}
                    className="text-slate-400 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Certification */}
            <form onSubmit={handleAddCertification} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <input
                type="text"
                placeholder="Add certificate (e.g. AWS Certified Developer)..."
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
