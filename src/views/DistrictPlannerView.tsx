import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DistrictWorkforce } from '../types';
import { 
  MapPin, 
  Users, 
  GraduationCap, 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  Building, 
  Wrench,
  Download
} from 'lucide-react';

export const DistrictPlannerView: React.FC = () => {
  const { districts, filters, addToast } = useApp();
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(districts[0]?.id || 'dst-1');

  const currentDistrict = districts.find(d => d.id === selectedDistrictId) || districts[0];

  const handleExportPlan = () => {
    addToast('success', 'Plan Exported', `District Action Plan for ${currentDistrict.name} compiled for State Skill Mission.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & District Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              District-Level Workforce & Infrastructure Planner
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Synthesizes regional employer hiring density, local skill center training capacity, trainer deficits, and hardware lab shortages.
          </p>
        </div>

        {/* District Selector & Action Button */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400">Target Region:</span>
            <select
              aria-label="Select Target Region"
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state}) • {d.sector}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportPlan}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Action Brief</span>
          </button>
        </div>
      </div>

      {currentDistrict && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: District Workforce Snapshot & Equipment Deficit (6 Columns) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Workforce Snapshot Metric Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Regional Labour Snapshot
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {currentDistrict.name}, {currentDistrict.state}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {currentDistrict.sector}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Active Demand</span>
                  <span className="text-base font-black text-brand-600 dark:text-brand-400">{currentDistrict.activeJobDemand.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Trained Supply</span>
                  <span className="text-base font-black text-slate-700 dark:text-slate-200">{currentDistrict.unemployedTrainedYouth.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Placement Rate</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{currentDistrict.placementRate}%</span>
                </div>
              </div>

              {/* Roles in High Demand in District */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  High-Demand Roles in District:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentDistrict.highDemandRoles.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-1 bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 rounded-lg text-xs font-semibold text-brand-700 dark:text-brand-300"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Priority Skills in District */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Priority Skills Required by Local Industry:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentDistrict.prioritySkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 12: Equipment & Trainer Planning Module */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Trainer & Physical Lab Capacity Audit
                </h3>
              </div>

              {/* Trainers comparison */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Certified Master Trainers</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    Deficit: -{currentDistrict.trainersRequired - currentDistrict.trainersAvailable} Trainers
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Available: {currentDistrict.trainersAvailable}</span>
                  <span>Required: {currentDistrict.trainersRequired}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${(currentDistrict.trainersAvailable / currentDistrict.trainersRequired) * 100}%` }}
                  />
                </div>
              </div>

              {/* Labs comparison */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Equipped Vocational Labs</span>
                  <span className="text-amber-600 dark:text-amber-400">
                    Deficit: -{currentDistrict.labsRequired - currentDistrict.labsAvailable} Centres
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Available: {currentDistrict.labsAvailable}</span>
                  <span>Required: {currentDistrict.labsRequired}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${(currentDistrict.labsAvailable / currentDistrict.labsRequired) * 100}%` }}
                  />
                </div>
              </div>

              {/* Hardware shortage tags */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Critical Equipment Shortages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentDistrict.equipmentShortageItems.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Automated Training Plan Generator (6 Columns) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-black tracking-tight text-white">
                    Automated District Training Plan Generator
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready for Sanction
                </span>
              </div>

              <p className="text-xs text-indigo-200/80 leading-relaxed">
                Algorithmic resource allocation plan designed to eradicate regional skill bottlenecks in <strong>{currentDistrict.name}</strong> over the next 2 fiscal quarters.
              </p>

              {/* Visual Action Cards */}
              <div className="space-y-3">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-500/30 text-indigo-300 mt-0.5">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">
                      Sanction +{currentDistrict.recommendedPlan.batchesToAdd} New Accelerated Training Batches
                    </span>
                    <p className="text-xs text-indigo-200/70 mt-0.5">
                      Targeting high-velocity recruitment across local industrial parks.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-amber-500/30 text-amber-300 mt-0.5">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">
                      Recruit & Empanel +{currentDistrict.recommendedPlan.trainersToRecruit} Domain Trainers
                    </span>
                    <p className="text-xs text-indigo-200/70 mt-0.5">
                      Sourced via industry guest-faculty co-op agreements.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/30 text-emerald-300 mt-0.5">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-white">
                      Hardware & Lab Procurement Prescriptions:
                    </span>
                    <ul className="text-xs text-indigo-200/80 list-disc list-inside space-y-1">
                      {currentDistrict.recommendedPlan.equipmentPrescriptions.map((eq, idx) => (
                        <li key={idx}>{eq}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Partner Industries */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  Anchor Placement Employers in District:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentDistrict.recommendedPlan.partnerIndustries.map((ind) => (
                    <span
                      key={ind}
                      className="px-2.5 py-1 bg-white/15 rounded-lg text-xs font-semibold text-white"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                addToast('success', 'Plan Sanctioned', `Training plan for ${currentDistrict.name} queued for administrative signoff.`);
              }}
              className="w-full py-3 bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg transition"
            >
              Confirm & Sanction District Budget Allocation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
