import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SectorType } from '../../types';
import { Filter, Search, MapPin, Calendar, RefreshCw, Compass } from 'lucide-react';

const SECTORS: SectorType[] = [
  'All Sectors',
  'IT & Tech',
  'Manufacturing & EV',
  'Healthcare',
  'Agriculture & AgriTech',
  'Tourism & Hospitality',
  'BFSI',
  'Retail & E-commerce',
  'Logistics & Supply Chain'
];

const DISTRICTS = [
  'All Districts',
  'Bengaluru Urban (KA)',
  'Pune (MH)',
  'Hyderabad (TS)',
  'Chennai (TN)',
  'Coimbatore (TN)',
  'Jaipur (RJ)',
  'Noida (UP)',
  'Ahmedabad (GJ)',
  'Kochi (KL)',
  'Bhubaneswar (OR)'
];

export const GlobalFilterBar: React.FC = () => {
  const { filters, setFilters, addToast } = useApp();
  const { isAdmin } = useAuth();

  const handleReset = () => {
    setFilters({
      sector: 'All Sectors',
      stateDistrict: 'All Districts',
      timeframe: 'Current Quarter',
      searchQuery: '',
      datasetScope: 'combined'
    });
    addToast('info', 'Filters Reset', 'Displaying aggregate pan-industry labour market intelligence.');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm mb-6 space-y-3">
      {/* User-Focused Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-950/80 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Explore Labour Market
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            221,000+ Active Verified Postings
          </span>
          {isAdmin && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Admin Mode: Multi-Source Active
            </span>
          )}
        </div>
      </div>

      {/* Main Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0 w-full lg:w-auto">
          {/* Sector Selector */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex-1 sm:flex-initial min-w-[130px]">
            <Filter className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
            <select
              aria-label="Filter by Sector"
              value={filters.sector}
              onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value as SectorType }))}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1 w-full"
            >
              {SECTORS.map((sec) => (
                <option key={sec} value={sec} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex-1 sm:flex-initial min-w-[130px]">
            <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <select
              aria-label="Filter by District or State"
              value={filters.stateDistrict}
              onChange={(e) => setFilters(prev => ({ ...prev, stateDistrict: e.target.value }))}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1 w-full"
            >
              {DISTRICTS.map((dst) => (
                <option key={dst} value={dst} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  {dst}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex-1 sm:flex-initial min-w-[130px]">
            <Calendar className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <select
              aria-label="Filter by Time Period"
              value={filters.timeframe}
              onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value as any }))}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1 w-full"
            >
              <option value="Current Quarter" className="bg-white dark:bg-slate-900">Current Q3/Q4 2026</option>
              <option value="Past 12 Months" className="bg-white dark:bg-slate-900">Past 12 Months (Trailing)</option>
              <option value="Next 2 Years Projection" className="bg-white dark:bg-slate-900">2027-2028 Projection</option>
            </select>
          </div>
        </div>

        {/* Right Search Input & Reset Button */}
        <div className="flex items-center space-x-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills, roles, courses or districts..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {(filters.sector !== 'All Sectors' || filters.stateDistrict !== 'All Districts' || filters.searchQuery) && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
