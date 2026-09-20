import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CourseHealthStatus } from '../types';
import { 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  HelpCircle,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export const LearningCoursesView: React.FC = () => {
  const { courses, pathways, filters, setActiveTab } = useApp();
  const [activeTabSub, setActiveTabSub] = useState<'health' | 'pathways'>('health');

  const filteredCourses = courses.filter(c => 
    (filters.sector === 'All Sectors' || c.sector === filters.sector) &&
    (!filters.searchQuery || c.title.toLowerCase().includes(filters.searchQuery.toLowerCase()))
  );

  const filteredPathways = pathways.filter(p =>
    (filters.sector === 'All Sectors' || p.associatedSector === filters.sector) &&
    (!filters.searchQuery || p.skillName.toLowerCase().includes(filters.searchQuery.toLowerCase()))
  );

  const getHealthBadge = (status: CourseHealthStatus) => {
    switch (status) {
      case 'High Demand':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> High Demand</span>;
      case 'Needs Update':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Needs Update</span>;
      case 'Oversupplied':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 flex items-center"><TrendingDown className="w-3.5 h-3.5 mr-1" /> Oversupplied</span>;
      case 'Obsolete':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Obsolete</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Course Health, Obsolescence & Learning Pathways
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Detects oversupplied or obsolete training programs and maps identified skill gaps to accredited qualifications and accelerated vocational courses.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTabSub('health')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTabSub === 'health'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Course Health & Obsolescence
          </button>
          <button
            onClick={() => setActiveTabSub('pathways')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTabSub === 'pathways'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Skill → Qualification Pathways
          </button>
        </div>
      </div>

      {activeTabSub === 'health' ? (
        /* Course Health Radar & Obsolescence Section */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {course.level} • {course.sector}
                    </span>
                    {getHealthBadge(course.healthStatus)}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">{course.institution}</p>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Alignment</span>
                      <span className="text-xs font-black text-brand-600 dark:text-brand-400">{course.alignmentScore}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Graduates</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200">{course.graduatesAnnual}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Placement</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{course.placementRate}%</span>
                    </div>
                  </div>

                  {/* Recommendation summary */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Institutional Prescription:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      {course.healthStatus === 'Obsolete' ? (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">
                          Critical: Deprecate obsolete proprietary syllabus. Pivot facilities toward modern high-demand digital skills.
                        </span>
                      ) : course.healthStatus === 'Needs Update' ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          Incorporate high-velocity industry modules (GenAI, Cloud Orchestration, MLOps) to boost placement.
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Optimal market alignment. Scale student intake batches and expand industry co-op placements.
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Duration: {course.durationWeeks} Weeks</span>
                  <button
                    onClick={() => setActiveTab('curriculum-alignment')}
                    className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                  >
                    View Curriculum Audit →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Skill -> Qualification -> Course -> Pathway Section */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPathways.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                    {item.associatedSector}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    Difficulty: {item.difficulty}
                  </span>
                </div>

                {/* Step Flow Visual */}
                <div className="space-y-3 relative pl-4 border-l-2 border-brand-500/30">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Target Skill Gap
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {item.skillName}
                    </h4>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Recognized Qualification / Standard
                    </span>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center mt-0.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 mr-1.5 flex-shrink-0" />
                      {item.requiredQualification}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Recommended Training Program & Provider
                    </span>
                    <p className="text-xs font-extrabold text-brand-600 dark:text-brand-400">
                      {item.recommendedCourse}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.courseProvider}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.estimatedDuration.split(' ')[0]} {item.estimatedDuration.split(' ')[1]}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Completion</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.completionRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Placement</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">{item.placementOutcomeRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
