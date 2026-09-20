import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSkillGap, getGapSeverity } from '../../services/scoringEngine';
import { X, Sparkles, Building2, MapPin, Briefcase, TrendingUp, CheckCircle, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const SkillDetailModal: React.FC = () => {
  const { selectedSkillForModal, setSelectedSkillForModal, addEmployerValidation, addToast } = useApp();

  if (!selectedSkillForModal) return null;

  const skill = selectedSkillForModal;
  const gap = calculateSkillGap(skill.demandScore, skill.supplyScore);
  const severity = getGapSeverity(gap);

  const signalData = [
    { name: 'Job Postings', value: skill.signals.jobPostingsWeight, color: '#6366f1' },
    { name: 'Employer Surveys', value: skill.signals.employerSurveysWeight, color: '#3b82f6' },
    { name: 'Industry Consultations', value: skill.signals.consultationsWeight, color: '#10b981' },
    { name: 'Sector Growth', value: skill.signals.sectorGrowthWeight, color: '#f59e0b' },
    { name: 'Emerging Tech', value: skill.signals.emergingTechWeight, color: '#ec4899' },
  ];

  const handleQuickValidate = () => {
    addEmployerValidation({
      companyName: 'Validated via Intelligence Console',
      representative: 'Verified Industry Panel Member',
      role: skill.associatedRoles[0] || 'Technical Specialist',
      industry: skill.sector,
      action: 'Validate Skill',
      targetItem: skill.name,
      comment: `Confirmed as a high-priority requirement with ${skill.requiredProficiency} proficiency expected.`
    });
    setSelectedSkillForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {skill.category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sector: <strong className="text-slate-700 dark:text-slate-200">{skill.sector}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5 flex items-center">
              {skill.name}
            </h2>
          </div>
          <button
            onClick={() => setSelectedSkillForModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Demand Score</span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400">{skill.demandScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Supply Score</span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-slate-700 dark:text-slate-300">{skill.supplyScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Net Gap</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{gap}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  severity === 'Critical Gap' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300' :
                  severity === 'Needs Improvement' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300' :
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                }`}>
                  {severity}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Growth Momentum</span>
              <div className="flex items-center space-x-1 mt-1 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                <TrendingUp className="w-4 h-4" />
                <span>+{skill.growthRate}%</span>
              </div>
            </div>
          </div>

          {/* Explainable Signals Breakdown */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/40 dark:bg-slate-850/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-brand-500 mr-1.5" />
              Demand Calculation Signals Breakdown
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-40 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={signalData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {signalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${val}% Weight`, 'Contribution']}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs">
                {signalData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roles & Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center mb-2">
                <Briefcase className="w-3.5 h-3.5 mr-1.5 text-brand-500" />
                Associated Job Roles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skill.associatedRoles.map(role => (
                  <span key={role} className="px-2 py-1 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center mb-2">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                Top Demand Districts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skill.topDistricts.map(dst => (
                  <span key={dst} className="px-2 py-1 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">
                    {dst}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center text-xs text-slate-500">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
            <span>Validated by {skill.validatedByEmployersCount} verified enterprise partners</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleQuickValidate}
              className="px-3.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 rounded-lg hover:bg-brand-100 transition"
            >
              + Endorse / Validate
            </button>
            <button
              onClick={() => setSelectedSkillForModal(null)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
