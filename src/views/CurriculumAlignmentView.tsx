import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateCurriculumAlignmentChecker, SAMPLE_SYLLABUS_PRESET, CurriculumAnalysisResult } from '../services/alignmentIntelligence';
import { Course, CurriculumActionType } from '../types';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  MinusCircle, 
  PlusCircle, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  TrendingUp, 
  Check, 
  RefreshCw, 
  BarChart3, 
  FileText, 
  AlertTriangle, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { ScoreMeter } from '../components/common/ScoreMeter';

export const CurriculumAlignmentView: React.FC = () => {
  const { courses, filters, applyCurriculumAction, addToast } = useApp();

  // Mode: 'checker' (Interactive Syllabus Checker) vs 'audit' (Existing Courses Benchmark Audit)
  const [activeTabSub, setActiveTabSub] = useState<'checker' | 'audit'>('checker');

  // Interactive Curriculum Checker Inputs
  const [degreeName, setDegreeName] = useState<string>('B.Tech in Computer Science & Engineering');
  const [specialization, setSpecialization] = useState<string>('Data Analytics & AI Systems');
  const [semester, setSemester] = useState<string>('Semester 5');
  const [subjects, setSubjects] = useState<string>('Database Systems, Software Engineering, Web Technologies');
  const [syllabusText, setSyllabusText] = useState<string>(SAMPLE_SYLLABUS_PRESET);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [checkerResult, setCheckerResult] = useState<CurriculumAnalysisResult | null>(() => {
    return calculateCurriculumAlignmentChecker({
      degreeName: 'B.Tech in Computer Science & Engineering',
      specialization: 'Data Analytics & AI Systems',
      semester: 'Semester 5',
      subjects: 'Database Systems, Software Engineering, Web Technologies',
      syllabusText: SAMPLE_SYLLABUS_PRESET
    });
  });

  // Selected course for the benchmark audit tab
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'crs-1');
  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const handleRunCurriculumAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusText.trim()) {
      addToast('warning', 'Syllabus Required', 'Please enter or paste curriculum syllabus modules.');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const result = calculateCurriculumAlignmentChecker({
        degreeName,
        specialization,
        semester,
        subjects,
        syllabusText
      });
      setCheckerResult(result);
      setIsAnalyzing(false);
      addToast('success', 'Curriculum Analyzed', `Evaluated syllabus alignment against industry requirements. Score: ${result.curriculumAlignmentScore}%`);
    }, 600);
  };

  const handleLoadSampleSyllabus = () => {
    setSyllabusText(SAMPLE_SYLLABUS_PRESET);
    addToast('info', 'Preset Loaded', 'Sample CS & Data Analytics syllabus preset loaded.');
  };

  const getActionBadge = (type: CurriculumActionType) => {
    switch (type) {
      case 'Keep':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><CheckCircle2 className="w-3 h-3 mr-1" /> Keep</span>;
      case 'Update':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"><AlertCircle className="w-3 h-3 mr-1" /> Update</span>;
      case 'Remove':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"><MinusCircle className="w-3 h-3 mr-1" /> Reduce / Remove</span>;
      case 'Add':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"><PlusCircle className="w-3 h-3 mr-1" /> Add Emerging</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner & Tab Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Curriculum-Industry Alignment Checker
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Interactive syllabus audit tool for universities and students to verify course alignment with hiring standards, detect outdated topics, and generate syllabus update actions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTabSub('checker')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTabSub === 'checker'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Interactive Syllabus Checker</span>
          </button>
          <button
            onClick={() => setActiveTabSub('audit')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTabSub === 'audit'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Course Catalog Alignment</span>
          </button>
        </div>
      </div>

      {activeTabSub === 'checker' ? (
        /* FEATURE 3: CURRICULUM-INDUSTRY ALIGNMENT CHECKER */
        <div className="space-y-6">
          {/* Syllabus Input Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Enter University Course Details & Paste Syllabus Content
                </h3>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleSyllabus}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Load Sample Syllabus Preset</span>
              </button>
            </div>

            <form onSubmit={handleRunCurriculumAnalysis} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Degree / Course Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Computer Science, BCA"
                    value={degreeName}
                    onChange={(e) => setDegreeName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Data Analytics, Cloud Systems"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Semester *
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none cursor-pointer"
                  >
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Final Year (Sem 7/8)">Final Year (Sem 7/8)</option>
                    <option value="All Semesters Aggregate">All Semesters Aggregate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subjects / Course Modules Included
                </label>
                <input
                  type="text"
                  placeholder="e.g. Database Systems, Web Programming, Data Warehousing"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Syllabus Content Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Syllabus Content / Module Breakdown *
                  </label>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Paste module lecture outlines, textbook topics, or lab lists
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste syllabus modules here..."
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs outline-none"
                  required
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-700 hover:to-brand-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center space-x-2 text-xs"
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-brand-200" />
                  )}
                  <span>{isAnalyzing ? 'Auditing Syllabus...' : 'Analyze Curriculum'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Checker Results Output */}
          {checkerResult && !isAnalyzing && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-3">
              {/* Scorecard & Macro Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Radial Scorecard (4 Columns) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Curriculum Alignment Score
                  </span>
                  <ScoreMeter score={checkerResult.curriculumAlignmentScore} size="lg" />

                  <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 block">
                      {checkerResult.degreeName}
                    </span>
                    <p className="text-slate-500 text-[11px]">
                      {checkerResult.specialization} • {checkerResult.semester}
                    </p>
                  </div>
                </div>

                {/* Status Pillars: Covered, Missing, Outdated (8 Columns) */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Covered */}
                  <div className="bg-emerald-50/50 dark:bg-slate-850 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-bold text-xs">Industry Skills Covered</span>
                      </div>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        {checkerResult.industrySkillsCovered.length} Topics
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {checkerResult.industrySkillsCovered.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-slate-800">
                            ✓ {c.skill.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">Meets market threshold</span>
                  </div>

                  {/* High Demand Missing */}
                  <div className="bg-rose-50/50 dark:bg-slate-850 p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 text-rose-700 dark:text-rose-300">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-bold text-xs">High-Demand Missing</span>
                      </div>
                      <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                        {checkerResult.highDemandSkillsMissing.length} Modules
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {checkerResult.highDemandSkillsMissing.map((m, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-[11px] font-bold text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-slate-800">
                            + {m.skill.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-rose-700 font-semibold">Immediate addition needed</span>
                  </div>

                  {/* Outdated Topics */}
                  <div className="bg-amber-50/50 dark:bg-slate-850 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-300">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-bold text-xs">Potentially Outdated</span>
                      </div>
                      <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                        {checkerResult.outdatedTopicsDetected.length} Detected
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {checkerResult.outdatedTopicsDetected.map((o, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-[11px] font-bold text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-slate-800">
                            ⚠ {o.topic.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-700 font-semibold">Recommend deprecation</span>
                  </div>
                </div>
              </div>

              {/* Visual Side-by-Side Comparison: INDUSTRY DEMAND vs CURRENT CURRICULUM */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Visual Comparison: INDUSTRY DEMAND vs CURRENT CURRICULUM
                    </h3>
                    <p className="text-xs text-slate-500">
                      Comparing market hiring benchmark demand against course credit depth
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-semibold">
                    <span className="flex items-center text-brand-600 dark:text-brand-400">
                      <span className="w-3 h-3 rounded bg-brand-500 mr-1.5" /> Industry Demand
                    </span>
                    <span className="flex items-center text-teal-600 dark:text-teal-400">
                      <span className="w-3 h-3 rounded bg-teal-500 mr-1.5" /> Current Curriculum
                    </span>
                  </div>
                </div>

                {/* Comparison Bars */}
                <div className="space-y-4">
                  {checkerResult.visualSkillComparison.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-900 dark:text-white">{item.skill}</span>
                        <div className="flex items-center space-x-3 text-[11px]">
                          <span className="text-brand-600 dark:text-brand-400">Industry: {item.industryDemand}%</span>
                          <span className="text-teal-600 dark:text-teal-400">Curriculum: {item.curriculumCoverage}%</span>
                          <span className={item.industryDemand - item.curriculumCoverage > 30 ? 'text-rose-500 font-black' : 'text-slate-400'}>
                            Deficit: -{Math.max(0, item.industryDemand - item.curriculumCoverage)}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {/* Industry Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-500 h-full rounded-full transition-all duration-700"
                            style={{ width: `${item.industryDemand}%` }}
                          />
                        </div>

                        {/* Curriculum Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-teal-500 h-full rounded-full transition-all duration-700"
                            style={{ width: `${item.curriculumCoverage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Curriculum Updates */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-brand-400" />
                    <h3 className="text-base font-black tracking-tight text-white">
                      Recommended Curriculum Updates & Additions
                    </h3>
                  </div>
                  <span className="text-xs text-indigo-300 font-mono">
                    Board of Studies Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {checkerResult.recommendedCurriculumAdditions.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-emerald-300">{rec.moduleName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/30 text-brand-200">
                          {rec.creditsRecommended}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-100 font-medium">
                        {rec.targetCompetency}
                      </p>
                      <p className="text-[11px] text-indigo-200/70 italic">
                        💡 {rec.justification}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* EXISTING COURSE CATALOG BENCHMARK AUDIT TAB */
        currentCourse && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Course Alignment Score
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {currentCourse.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">{currentCourse.institution}</p>
                <ScoreMeter score={currentCourse.alignmentScore} size="lg" />
              </div>
            </div>

            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Skill-by-Skill Syllabus Depth Breakdown
              </h3>
              <div className="space-y-3">
                {currentCourse.skillsTaught.map((st, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>{st.skillName}</span>
                      {getActionBadge(st.status)}
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Industry: {st.industryRequirement}%</span>
                      <span>Curriculum: {st.curriculumCoverage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
