import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Sliders, Database, Moon, Sun, Save, RotateCcw, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { darkMode, toggleDarkMode, addToast } = useApp();

  const [weights, setWeights] = useState({
    jobPostings: 45,
    employerSurveys: 25,
    consultations: 15,
    sectorGrowth: 10,
    emergingTech: 5
  });

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      addToast('warning', 'Invalid Weights', `Signal weights must sum to exactly 100%. Current sum: ${sum}%.`);
      return;
    }
    addToast('success', 'Model Recalibrated', 'Demand signal weights updated across all intelligence pipelines.');
  };

  const handleResetWeights = () => {
    setWeights({
      jobPostings: 45,
      employerSurveys: 25,
      consultations: 15,
      sectorGrowth: 10,
      emergingTech: 5
    });
    addToast('info', 'Weights Restored', 'Reverted to standard empirically verified signal weights.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Settings className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            System Settings & Algorithmic Parameters
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          Configure signal calculation weights, appearance, regional data sync frequencies, and telemetry endpoints.
        </p>
      </div>

      {/* Signal Weights Calibration Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <Sliders className="w-4 h-4 text-brand-500 mr-2" />
              Skill Demand Score Formula Calibration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust the weight allocated to each telemetry signal layer (Total must equal 100%)
            </p>
          </div>
          <button
            onClick={handleResetWeights}
            className="text-xs text-slate-500 hover:text-brand-600 font-bold flex items-center"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Defaults
          </button>
        </div>

        <form onSubmit={handleSaveWeights} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Job Postings (Online & ATS Scrapes)</span>
                <span className="text-brand-600 dark:text-brand-400">{weights.jobPostings}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weights.jobPostings}
                onChange={(e) => setWeights({ ...weights, jobPostings: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Employer Surveys & Board Feedback</span>
                <span className="text-brand-600 dark:text-brand-400">{weights.employerSurveys}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weights.employerSurveys}
                onChange={(e) => setWeights({ ...weights, employerSurveys: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Industry SSC Consultations</span>
                <span className="text-brand-600 dark:text-brand-400">{weights.consultations}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weights.consultations}
                onChange={(e) => setWeights({ ...weights, consultations: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Sector Growth & FDI Allocations</span>
                <span className="text-brand-600 dark:text-brand-400">{weights.sectorGrowth}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weights.sectorGrowth}
                onChange={(e) => setWeights({ ...weights, sectorGrowth: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5 sm:col-span-2">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Emerging Tech Horizon Signals</span>
                <span className="text-brand-600 dark:text-brand-400">{weights.emergingTech}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weights.emergingTech}
                onChange={(e) => setWeights({ ...weights, emergingTech: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-slate-500">
              Total Weight Sum: <strong className={Object.values(weights).reduce((a, b) => a + b, 0) === 100 ? 'text-emerald-600 font-black' : 'text-rose-600 font-black'}>
                {Object.values(weights).reduce((a, b) => a + b, 0)}%
              </strong>
            </span>

            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow transition flex items-center space-x-1"
            >
              <Save className="w-4 h-4 mr-1" />
              <span>Save & Apply Scoring Model</span>
            </button>
          </div>
        </form>
      </div>

      {/* Appearance & Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Display & Appearance
        </h3>

        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Dark Mode</span>
            <p className="text-slate-500">Enable high-contrast dark dashboard theme</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1.5"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{darkMode ? 'Dark Enabled' : 'Light Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
