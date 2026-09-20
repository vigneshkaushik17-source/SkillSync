import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Skill, ProficiencyLevel } from '../types';
import { 
  Cpu, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  Building2, 
  Layers, 
  PieChart as PieIcon, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const SkillIntelligenceView: React.FC = () => {
  const { skills, filters, setSelectedSkillForModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'demand' | 'growth' | 'openings'>('demand');

  const categories = ['All', 'AI & Data', 'Cloud & DevOps', 'Technical', 'Domain Specific', 'Emerging Tech'];

  const filteredSkills = skills
    .filter(s => {
      const matchesSector = filters.sector === 'All Sectors' || s.sector === filters.sector;
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchesSearch = !filters.searchQuery || 
        s.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        s.associatedRoles.some(r => r.toLowerCase().includes(filters.searchQuery.toLowerCase()));
      return matchesSector && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'demand') return b.demandScore - a.demandScore;
      if (sortBy === 'growth') return b.growthRate - a.growthRate;
      return b.jobOpenings - a.jobOpenings;
    });

  const aggregateSignalData = [
    { name: 'Job Postings (Online & Enterprise)', value: 45, color: '#6366f1' },
    { name: 'Employer Surveys & Board Feedback', value: 25, color: '#3b82f6' },
    { name: 'Industry Consultations & SSCs', value: 15, color: '#10b981' },
    { name: 'Sector Growth & FDI Allocations', value: 10, color: '#f59e0b' },
    { name: 'Emerging Tech Radar & Patents', value: 5, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner & Demand Methodology Explanation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Labour-Market Skill Intelligence Engine
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Our explainable intelligence framework synthesizes 5 verified signal sources to map dynamic demand by: 
              <strong className="text-slate-900 dark:text-slate-100"> Role → Skill → Location → Proficiency → Industry</strong>.
              Every score reflects empirical employer hiring indicators and forward-looking sector investments.
            </p>

            {/* Quick Filter Pills */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Demand Decomposition Donut */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="w-32 h-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aggregateSignalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={52}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {aggregateSignalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val}% Signal Weight`, 'Layer']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="ml-3 space-y-1 text-[11px] flex-1">
              <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                Demand Signal Weights
              </span>
              {aggregateSignalData.map(sig => (
                <div key={sig.name} className="flex items-center justify-between">
                  <span className="flex items-center text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                    <span className="w-2 h-2 rounded-full mr-1.5 flex-shrink-0" style={{ backgroundColor: sig.color }} />
                    {sig.name.split(' ')[0]} {sig.name.split(' ')[1]}
                  </span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-300">{sig.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sorting & Results Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Showing {filteredSkills.length} Verified Competencies
          </span>
          {filters.sector !== 'All Sectors' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              {filters.sector}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="demand">Demand Score (High → Low)</option>
            <option value="growth">Growth Velocity (% YoY)</option>
            <option value="openings">Job Openings Volume</option>
          </select>
        </div>
      </div>

      {/* Granular Skill Demand Explorer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            onClick={() => setSelectedSkillForModal(skill)}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-400 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Card Top Pill */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {skill.category}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {skill.sector}
                </span>
              </div>

              {/* Title & Level */}
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                {skill.name}
              </h3>

              {/* Demand Score & Growth Ribbon */}
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Demand Index</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-black text-brand-600 dark:text-brand-400">{skill.demandScore}</span>
                    <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Hiring Growth</span>
                  <div className="flex items-center space-x-0.5 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{skill.growthRate}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Proficiency</span>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {skill.requiredProficiency}
                  </span>
                </div>
              </div>

              {/* Associated Roles & Top Locations */}
              <div className="mt-3.5 space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center mb-1">
                    <Briefcase className="w-3 h-3 mr-1 text-slate-400" />
                    Key Roles:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {skill.associatedRoles.slice(0, 2).map((role) => (
                      <span key={role} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {role}
                      </span>
                    ))}
                    {skill.associatedRoles.length > 2 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{skill.associatedRoles.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center mb-1">
                    <MapPin className="w-3 h-3 mr-1 text-rose-400" />
                    High Demand In:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 font-medium truncate">
                    {skill.topDistricts.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">
                💼 {skill.jobOpenings.toLocaleString()} Active Openings
              </span>
              <span className="text-brand-600 dark:text-brand-400 font-bold group-hover:underline">
                View Breakdown →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
