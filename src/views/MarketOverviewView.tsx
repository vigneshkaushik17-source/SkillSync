import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SectorType, DistrictWorkforce } from '../types';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker 
} from 'react-simple-maps';
import indiaTopo from '../data/india-topo.json';
import { 
  Search, 
  MapPin, 
  ArrowRight,
  TrendingUp, 
  TrendingDown,
  Briefcase,
  Building,
  AlertTriangle,
  Filter,
  Calendar,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

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

type MapDimension = 'demand' | 'gap' | 'supply';

interface HoveredLocationInfo {
  stateName: string;
  district?: DistrictWorkforce;
}

// Exact geographic coordinates [Longitude, Latitude] for existing telemetry hubs
const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  'dst-1': [77.5946, 12.9716], // Bengaluru Urban (Karnataka)
  'dst-2': [78.4867, 17.3850], // Hyderabad (Telangana)
  'dst-3': [73.8567, 18.5204], // Pune (Maharashtra)
  'dst-4': [80.2707, 13.0827], // Chennai (Tamil Nadu)
  'dst-5': [77.1025, 28.7041], // Delhi NCR (Delhi / UP)
  'dst-6': [72.8777, 19.0760], // Mumbai MMR (Maharashtra)
  'dst-7': [72.5714, 23.0225], // Ahmedabad (Gujarat)
  'dst-8': [76.9558, 11.0168], // Coimbatore (Tamil Nadu)
  'dst-9': [75.7873, 26.9124], // Jaipur (Rajasthan)
  'dst-10': [88.3639, 22.5726], // Kolkata (West Bengal)
  'dst-11': [76.2673, 9.9312], // Kochi (Kerala)
};

export const MarketOverviewView: React.FC = () => {
  const { 
    skills, 
    districts, 
    filters, 
    setFilters,
    datasetSummary, 
    dataset2Summary, 
    unifiedSummary, 
    setActiveTab, 
    setSelectedSkillForModal,
    updateDistrictFilter,
    addToast
  } = useApp();

  // Active Map Dimension tab
  const [mapDimension, setMapDimension] = useState<MapDimension>('demand');
  const [hoveredLocation, setHoveredLocation] = useState<HoveredLocationInfo | null>(null);

  // Selected district / state
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(() => {
    if (filters.stateDistrict !== 'All Districts') {
      const match = districts.find(d => filters.stateDistrict.includes(d.name) || d.name.includes(filters.stateDistrict.split(' ')[0]));
      if (match) return match.id;
    }
    return districts[0]?.id || 'dst-1';
  });

  const selectedDistrict: DistrictWorkforce = districts.find(d => d.id === selectedDistrictId) || districts[0];

  // Dynamic Skill Gap ranking for "Top Skills Needing Attention"
  const filteredSkills = skills.filter(s => 
    (filters.sector === 'All Sectors' || s.sector === filters.sector) &&
    (!filters.searchQuery || s.name.toLowerCase().includes(filters.searchQuery.toLowerCase()))
  );

  const skillsWithGap = filteredSkills.map(s => {
    const gap = Math.max(0, s.demandScore - s.supplyScore);
    let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'BALANCED' = 'MEDIUM';
    if (gap >= 28 || s.demandScore >= 88) severity = 'CRITICAL';
    else if (gap >= 18 || s.demandScore >= 75) severity = 'HIGH';
    else if (gap >= 8) severity = 'MEDIUM';
    else severity = 'BALANCED';

    return {
      ...s,
      calculatedGap: gap,
      severity
    };
  }).sort((a, b) => b.calculatedGap - a.calculatedGap);

  const topSkillsNeedingAttention = skillsWithGap.slice(0, 5);

  // Dynamic metrics from existing datasets
  const isCombined = filters.datasetScope === 'combined';
  const isGlobal = filters.datasetScope === 'dataset2_global';

  const totalPostings = isCombined
    ? (unifiedSummary.totalJobOpenings || 221778)
    : isGlobal
    ? (dataset2Summary.totalJobOpenings || 123849)
    : (datasetSummary.totalJobOpenings || 97929);

  const totalEmployers = isCombined
    ? (unifiedSummary.totalUniqueCompanies || 43141)
    : isGlobal
    ? (dataset2Summary.totalUniqueCompanies || 24473)
    : (datasetSummary.totalUniqueCompanies || 18668);

  const salaryDisplay = isCombined
    ? '₹7.6L'
    : isGlobal
    ? `$${Math.round((dataset2Summary.meanSalaryUSD || 98500) / 1000)}k`
    : `₹${((datasetSummary.meanSalaryINR || 757354) / 100000).toFixed(1)}L`;

  // Map state name from TopoJSON (geo.properties.st_nm) to valid district telemetry without fabricating missing data
  const findDistrictForState = (stateName: string): DistrictWorkforce | undefined => {
    if (!stateName) return undefined;
    const norm = stateName.toLowerCase().trim();

    if (norm === 'karnataka') return districts.find(d => d.id === 'dst-1');
    if (norm === 'telangana') return districts.find(d => d.id === 'dst-2');
    if (norm === 'maharashtra') {
      if (selectedDistrict?.id === 'dst-6') return districts.find(d => d.id === 'dst-6');
      return districts.find(d => d.id === 'dst-3') || districts.find(d => d.id === 'dst-6');
    }
    if (norm === 'tamil nadu') {
      if (selectedDistrict?.id === 'dst-8') return districts.find(d => d.id === 'dst-8');
      return districts.find(d => d.id === 'dst-4') || districts.find(d => d.id === 'dst-8');
    }
    if (norm === 'delhi' || norm === 'uttar pradesh' || norm === 'nct of delhi') {
      return districts.find(d => d.id === 'dst-5');
    }
    if (norm === 'gujarat') return districts.find(d => d.id === 'dst-7');
    if (norm === 'rajasthan') return districts.find(d => d.id === 'dst-9');
    if (norm === 'west bengal') return districts.find(d => d.id === 'dst-10');
    if (norm === 'kerala') return districts.find(d => d.id === 'dst-11');

    return districts.find(d => {
      const ds = d.state.toLowerCase();
      return ds.includes(norm) || norm.includes(ds);
    });
  };

  // Dynamic data-driven state fill color based on active dimension
  const getStateFillColor = (dist: DistrictWorkforce | undefined) => {
    if (!dist) {
      return '#E2E8F0'; // Clean neutral light slate for unmapped regions
    }
    const gap = dist.demandScore - dist.talentSupplyScore;

    if (mapDimension === 'gap') {
      if (gap >= 21) return '#EF4444'; // Critical gap
      if (gap >= 16) return '#F97316'; // High gap
      if (gap >= 10) return '#3B82F6'; // Moderate gap
      if (gap >= 5) return '#60A5FA';  // Balanced
      return '#10B981';                // Surplus
    } else if (mapDimension === 'supply') {
      if (dist.talentSupplyScore >= 70) return '#10B981';
      if (dist.talentSupplyScore >= 62) return '#059669';
      if (dist.talentSupplyScore >= 55) return '#0EA5E9';
      return '#3B82F6';
    } else {
      // Demand Intensity
      if (dist.demandScore >= 90) return '#EF4444';
      if (dist.demandScore >= 80) return '#F97316';
      if (dist.demandScore >= 65) return '#3B82F6';
      return '#60A5FA';
    }
  };

  const handleSelectDistrict = (dist: DistrictWorkforce) => {
    setSelectedDistrictId(dist.id);
    updateDistrictFilter(`${dist.name} (${dist.state.slice(0, 2).toUpperCase()})`);
  };

  const handleInvestigateGap = () => {
    if (selectedDistrict) {
      updateDistrictFilter(`${selectedDistrict.name} (${selectedDistrict.state.slice(0, 2).toUpperCase()})`);
    }
    setActiveTab('skill-gap');
    addToast('info', 'Investigating Skill Gap', `Loaded Skill Gap Matrix for ${selectedDistrict?.name || 'Selected Region'}.`);
  };

  // Top skills in currently selected state/district
  const topSkillsInSelectedDistrict = skills.filter(s => 
    s.sector === selectedDistrict.sector || s.topDistricts?.some(td => td.toLowerCase().includes(selectedDistrict.name.toLowerCase()))
  ).slice(0, 5);

  const fallbackSkills = topSkillsInSelectedDistrict.length >= 3 ? topSkillsInSelectedDistrict : skills.slice(0, 5);

  return (
    <div className="space-y-4 font-sans text-[#101828] dark:text-slate-100 max-w-[1400px] mx-auto pb-8">
      
      {/* 2. TOP SEARCH / COMMAND BAR */}
      <div className="bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 rounded-lg p-2.5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 flex-1">
          <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#667085] dark:text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Ask SkillSync or search skills, roles, industries, districts..."
            className="w-full bg-transparent text-xs font-semibold text-[#101828] dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {filters.searchQuery && (
          <button
            onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
            className="text-[11px] font-bold text-[#667085] hover:text-[#101828] dark:hover:text-slate-200 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. MARKET OVERVIEW HEADER & FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F46E5]">
              Market Overview
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <h1 className="text-base font-bold text-[#101828] dark:text-white">
              India's Labour Market at a Glance
            </h1>
          </div>
          <p className="text-xs text-[#667085] dark:text-slate-400 mt-0.5 max-w-2xl">
            Real-time insights from job postings, employer signals and education data to support a future-ready workforce.
          </p>
        </div>

        {/* Existing Filters on Right */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Sector Selector */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 px-2.5 py-1.5 rounded-lg shadow-xs">
            <Filter className="w-3.5 h-3.5 text-[#4F46E5]" />
            <select
              aria-label="Sector Filter"
              value={filters.sector}
              onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value as SectorType }))}
              className="bg-transparent font-semibold text-[#101828] dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {SECTORS.map((sec) => (
                <option key={sec} value={sec} className="bg-white dark:bg-slate-900 text-[#101828] dark:text-slate-100">
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* District / Geography Selector */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 px-2.5 py-1.5 rounded-lg shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <select
              aria-label="District Filter"
              value={filters.stateDistrict}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, stateDistrict: e.target.value }));
                const match = districts.find(d => e.target.value.includes(d.name) || d.name.includes(e.target.value.split(' ')[0]));
                if (match) setSelectedDistrictId(match.id);
              }}
              className="bg-transparent font-semibold text-[#101828] dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="All Districts">All Districts</option>
              {districts.map((d) => (
                <option key={d.id} value={`${d.name} (${d.state.slice(0, 2).toUpperCase()})`}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Time Period Selector */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 px-2.5 py-1.5 rounded-lg shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <select
              aria-label="Timeframe Filter"
              value={filters.timeframe}
              onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value as any }))}
              className="bg-transparent font-semibold text-[#101828] dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="Current Quarter">Current Q3/Q4 2026</option>
              <option value="Past 12 Months">Past 12 Months</option>
              <option value="Next 2 Years Projection">2027-2028 Projection</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. PRIMARY METRIC STRIP (ONE UNIFIED HORIZONTAL PANEL WITH SUBTLE DIVIDERS) */}
      <div className="bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 rounded-lg shadow-xs grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E4E7EC] dark:divide-slate-800">
        
        {/* Metric 1: Active Job Postings */}
        <div className="p-3.5 sm:p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-[#4F46E5] flex-shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#101828] dark:text-white tracking-tight">
              {totalPostings.toLocaleString()}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">
              Active Job Postings
            </p>
            <div className="text-[11px] font-semibold text-[#10B981] flex items-center mt-0.5">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              <span>↑ 14.2% vs last period</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Hiring Enterprises */}
        <div className="p-3.5 sm:p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-[#3B82F6] flex-shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#101828] dark:text-white tracking-tight">
              {totalEmployers.toLocaleString()}+
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">
              Hiring Enterprises
            </p>
            <div className="text-[11px] font-semibold text-[#10B981] flex items-center mt-0.5">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              <span>↑ 18.9% vs last period</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Skill Mismatch Index */}
        <div className="p-3.5 sm:p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900 flex items-center justify-center text-amber-500 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#101828] dark:text-white tracking-tight">
              24.6%
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">
              Skill Mismatch Index
            </p>
            <div className="text-[11px] font-semibold text-[#10B981] flex items-center mt-0.5">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              <span>↓ 4.2% vs last period</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Avg. Disclosed Salary */}
        <div className="p-3.5 sm:p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-[#10B981] flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#101828] dark:text-white tracking-tight">
              {salaryDisplay}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400">
              Avg. Disclosed Salary
            </p>
            <div className="text-[11px] font-semibold text-[#10B981] flex items-center mt-0.5">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              <span>↑ 12.5% vs last period</span>
            </div>
          </div>
        </div>

      </div>

      {/* 5. LABOUR MARKET PULSE (HORIZONTAL STREAM) */}
      <div className="bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 rounded-lg px-4 py-2.5 shadow-xs flex items-center space-x-3 overflow-x-auto text-xs">
        <div className="flex items-center space-x-1.5 flex-shrink-0 pr-3 border-r border-[#E4E7EC] dark:border-slate-800 font-extrabold text-[10px] tracking-wider uppercase text-[#4F46E5]">
          <Activity className="w-3.5 h-3.5" />
          <span>Labour Market Pulse</span>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold whitespace-nowrap">
          <span className="flex items-center text-[#10B981]">
            <span className="mr-1 font-bold">↑</span> Generative AI demand +42%
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>

          <span className="flex items-center text-[#10B981]">
            <span className="mr-1 font-bold">↑</span> Cloud Computing +31%
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>

          <span className="flex items-center text-[#EF4444]">
            <span className="mr-1 font-bold">!</span> EV & Robotics trainer shortage
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>

          <span className="flex items-center text-[#3B82F6]">
            <span className="mr-1 font-bold">↑</span> Bengaluru Urban 26,019 openings
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>

          <span className="flex items-center text-[#10B981]">
            <span className="mr-1 font-bold">↑</span> Pune Automotive Tech +28%
          </span>
        </div>
      </div>

      {/* 6, 7 & 9. MAIN CONTENT AREA: LARGE HERO MAP (68%) + TOP SKILLS NEEDING ATTENTION (32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* 7 & 8. LEFT COLUMN: LABOUR DEMAND ACROSS INDIA (68% width) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 rounded-lg p-4 shadow-xs flex flex-col justify-between min-h-[500px]">
          
          {/* Header & View Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E4E7EC] dark:border-slate-800">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#101828] dark:text-white">
                Labour Demand Across India
              </h2>
              <p className="text-[11px] text-[#667085] dark:text-slate-400 mt-0.5">
                Explore demand intensity and talent supply balance by state.
              </p>
            </div>

            {/* Dimension Toggles */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setMapDimension('demand')}
                className={`px-3 py-1 rounded-md transition ${
                  mapDimension === 'demand'
                    ? 'bg-white dark:bg-slate-900 text-[#4F46E5] shadow-xs'
                    : 'text-[#667085] dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Demand Intensity
              </button>
              <button
                onClick={() => setMapDimension('gap')}
                className={`px-3 py-1 rounded-md transition ${
                  mapDimension === 'gap'
                    ? 'bg-white dark:bg-slate-900 text-[#4F46E5] shadow-xs'
                    : 'text-[#667085] dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Skill Gap
              </button>
              <button
                onClick={() => setMapDimension('supply')}
                className={`px-3 py-1 rounded-md transition ${
                  mapDimension === 'supply'
                    ? 'bg-white dark:bg-slate-900 text-[#4F46E5] shadow-xs'
                    : 'text-[#667085] dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Talent Supply
              </button>
            </div>
          </div>

          {/* Large Hero Geographic Map of India Canvas (occupies ~75% of height) */}
          <div className="relative flex-1 py-2 flex items-center justify-center overflow-hidden min-h-[380px] bg-slate-50/50 dark:bg-slate-950/20 rounded-md">
            
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 1050,
                center: [82.8, 22.2]
              }}
              viewBox="0 0 800 680"
              className="w-full h-full max-h-[440px] select-none"
            >
              {/* Real State/UT Boundary Geographies */}
              <Geographies geography={indiaTopo as any}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const props = (geo.properties || {}) as Record<string, string>;
                    const stateName = props.st_nm || props.NAME_1 || props.name || '';
                    const mappedDistrict = findDistrictForState(stateName);
                    const isSelectedState = selectedDistrict && mappedDistrict && (
                      selectedDistrict.id === mappedDistrict.id || 
                      selectedDistrict.state.toLowerCase().includes(stateName.toLowerCase()) ||
                      stateName.toLowerCase().includes(selectedDistrict.state.toLowerCase())
                    );
                    const fillColor = getStateFillColor(mappedDistrict);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        fillOpacity={mappedDistrict ? (isSelectedState ? 0.95 : 0.72) : 0.35}
                        stroke={isSelectedState ? '#4F46E5' : '#FFFFFF'}
                        strokeWidth={isSelectedState ? 1.6 : 0.6}
                        style={{
                          default: { outline: 'none', transition: 'all 200ms' },
                          hover: {
                            fill: mappedDistrict ? fillColor : '#CBD5E1',
                            fillOpacity: 0.95,
                            stroke: '#4F46E5',
                            strokeWidth: 1.4,
                            outline: 'none',
                            cursor: mappedDistrict ? 'pointer' : 'default',
                          },
                          pressed: { outline: 'none' },
                        } as any}
                        onClick={() => {
                          if (mappedDistrict) handleSelectDistrict(mappedDistrict);
                        }}
                        onMouseEnter={() => {
                          setHoveredLocation({
                            stateName: stateName || (mappedDistrict ? mappedDistrict.state : 'Unknown'),
                            district: mappedDistrict
                          });
                        }}
                        onMouseLeave={() => setHoveredLocation(null)}
                      />
                    );
                  })
                }
              </Geographies>

              {/* City / District Markers */}
              {districts.map((d) => {
                const coords = DISTRICT_COORDINATES[d.id];
                if (!coords) return null;
                const isSelected = selectedDistrict?.id === d.id;
                const markerColor = getStateFillColor(d);

                return (
                  <Marker
                    key={d.id}
                    coordinates={coords}
                    onClick={() => handleSelectDistrict(d)}
                    onMouseEnter={() => setHoveredLocation({ stateName: d.state, district: d })}
                    onMouseLeave={() => setHoveredLocation(null)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring on selected city */}
                    {isSelected && (
                      <circle
                        r={8}
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth={1.5}
                        className="animate-ping opacity-60"
                      />
                    )}
                    {isSelected && (
                      <circle
                        r={5.5}
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth={1.2}
                        opacity={0.8}
                      />
                    )}

                    {/* Small circular marker */}
                    <circle
                      r={isSelected ? 4 : 2.8}
                      fill={isSelected ? '#4F46E5' : '#FFFFFF'}
                      stroke={isSelected ? '#FFFFFF' : markerColor}
                      strokeWidth={isSelected ? 1.5 : 2}
                      className="transition-all duration-150"
                    />

                    {/* Labels for selected city and major hub locations */}
                    {(isSelected || ['dst-1', 'dst-2', 'dst-3', 'dst-4', 'dst-5', 'dst-7', 'dst-10'].includes(d.id)) && (
                      <text
                        textAnchor="start"
                        x={5.5}
                        y={2}
                        fontSize={isSelected ? 10.5 : 8.5}
                        fontWeight={isSelected ? 'bold' : '600'}
                        fill={isSelected ? '#101828' : '#334155'}
                        className="select-none pointer-events-none drop-shadow-xs dark:fill-white font-sans"
                      >
                        {d.name.split(' ')[0]}
                      </text>
                    )}
                  </Marker>
                );
              })}
            </ComposableMap>

            {/* Compact Hover Tooltip */}
            {hoveredLocation && (
              <div className="absolute top-2 right-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-[#E4E7EC] dark:border-slate-800 rounded-lg p-3 text-xs shadow-lg max-w-[220px] pointer-events-none animate-in fade-in duration-150 z-10">
                <div className="flex items-center justify-between font-bold text-[#101828] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1.5">
                  <span className="uppercase text-[11px] tracking-wide">{hoveredLocation.stateName}</span>
                  {hoveredLocation.district && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300 font-bold">
                      {hoveredLocation.district.name.split(' ')[0]}
                    </span>
                  )}
                </div>
                {hoveredLocation.district ? (
                  <div className="space-y-1 text-[11px] text-[#667085] dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Demand Index:</span>
                      <strong className="text-[#101828] dark:text-slate-200">{hoveredLocation.district.demandScore}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Talent Supply:</span>
                      <strong className="text-[#101828] dark:text-slate-200">{hoveredLocation.district.talentSupplyScore}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Skill Gap:</span>
                      <strong className="text-[#EF4444] font-bold">+{hoveredLocation.district.demandScore - hoveredLocation.district.talentSupplyScore}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Jobs:</span>
                      <strong className="text-[#101828] dark:text-slate-200">{hoveredLocation.district.activeJobDemand.toLocaleString()}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic">No direct telemetry data for this state</p>
                )}
              </div>
            )}
          </div>

          {/* Map Legend & Quick Hub Selection */}
          <div className="pt-2.5 border-t border-[#E4E7EC] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-[#667085] dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" />
                <span>Critical</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F97316]" />
                <span>High</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" />
                <span>Moderate</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#60A5FA]" />
                <span>Balanced</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
                <span>Surplus</span>
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-bold text-[#667085]">Region:</span>
              <div className="flex flex-wrap gap-1">
                {districts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelectDistrict(d)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${
                      selectedDistrict?.id === d.id
                        ? 'bg-[#4F46E5] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {d.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* 9. RIGHT COLUMN: TOP SKILLS NEEDING ATTENTION (32% width) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] dark:border-slate-800">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#101828] dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>Top Skills Needing Attention</span>
                </h2>
                <p className="text-[11px] text-[#667085] dark:text-slate-400 mt-0.5">
                  Ranked by national demand-supply gap
                </p>
              </div>
            </div>

            {/* Clean Ranked Rows */}
            <div className="divide-y divide-[#E4E7EC] dark:divide-slate-800 mt-1">
              {topSkillsNeedingAttention.map((skill, index) => {
                const rankNumber = String(index + 1).padStart(2, '0');
                
                let badgeStyle = 'text-[#3B82F6] bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900';
                let barColor = 'bg-[#3B82F6]';
                if (skill.severity === 'CRITICAL') {
                  badgeStyle = 'text-[#EF4444] bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900';
                  barColor = 'bg-[#EF4444]';
                } else if (skill.severity === 'HIGH') {
                  badgeStyle = 'text-[#F59E0B] bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900';
                  barColor = 'bg-[#F59E0B]';
                } else if (skill.severity === 'BALANCED') {
                  badgeStyle = 'text-[#10B981] bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900';
                  barColor = 'bg-[#10B981]';
                }

                return (
                  <div
                    key={skill.id}
                    onClick={() => setSelectedSkillForModal(skill)}
                    className="py-3 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 px-1.5 rounded transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2.5 flex-1 pr-2">
                        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 pt-0.5">
                          {rankNumber}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-[#101828] dark:text-white group-hover:text-[#4F46E5] transition leading-snug">
                            {skill.name}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badgeStyle}`}>
                              {skill.severity}
                            </span>
                            <span className="text-[10px] text-[#667085] dark:text-slate-400">
                              Demand {skill.demandScore} / Supply {skill.supplyScore}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-black text-[#EF4444] dark:text-rose-400 block">
                          GAP {skill.calculatedGap}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`${barColor} h-full rounded-full`} 
                        style={{ width: `${Math.min(100, skill.calculatedGap * 2)}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('skill-gap')}
            className="mt-3 w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-[#4F46E5] dark:text-indigo-400 border border-[#E4E7EC] dark:border-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1"
          >
            <span>View All Skills →</span>
          </button>

        </div>

      </div>

      {/* 7 & 8. SELECTED LOCATION SECTION & TOP SKILLS FOR SELECTED LOCATION */}
      {selectedDistrict && (
        <div className="bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-[#E4E7EC] dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#4F46E5]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#101828] dark:text-white">
                  Selected Location: {selectedDistrict.name.toUpperCase()} ({selectedDistrict.state.toUpperCase()})
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-[#4F46E5] dark:text-indigo-300">
                  {selectedDistrict.sector}
                </span>
              </div>
            </div>

            <button
              onClick={handleInvestigateGap}
              className="px-3.5 py-1.5 bg-[#4F46E5] hover:bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
            >
              <span>Investigate Skill Gap →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            {/* 7. Selected Location 4 Metrics (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              
              {/* Demand Index */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-[#E4E7EC] dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400 block">
                  Demand Index
                </span>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-lg font-black text-[#101828] dark:text-white">{selectedDistrict.demandScore}</span>
                  <span className="text-[10px] text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#4F46E5] h-full rounded-full" style={{ width: `${selectedDistrict.demandScore}%` }} />
                </div>
              </div>

              {/* Talent Supply */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-[#E4E7EC] dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400 block">
                  Talent Supply
                </span>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-lg font-black text-[#101828] dark:text-white">{selectedDistrict.talentSupplyScore}</span>
                  <span className="text-[10px] text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#10B981] h-full rounded-full" style={{ width: `${selectedDistrict.talentSupplyScore}%` }} />
                </div>
              </div>

              {/* Skill Gap */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-[#E4E7EC] dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EF4444] block">
                  Skill Gap
                </span>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-lg font-black text-[#EF4444]">
                    +{selectedDistrict.demandScore - selectedDistrict.talentSupplyScore}
                  </span>
                  <span className="text-[10px] text-slate-400">Index</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#EF4444] h-full rounded-full" style={{ width: `${Math.min(100, (selectedDistrict.demandScore - selectedDistrict.talentSupplyScore) * 3)}%` }} />
                </div>
              </div>

              {/* Active Jobs */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-[#E4E7EC] dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400 block">
                  Active Jobs
                </span>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-lg font-black text-[#101828] dark:text-white">
                    {selectedDistrict.activeJobDemand.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 text-[10px] font-bold text-[#10B981] flex items-center">
                  <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                  <span>↑ 31% YoY Hiring</span>
                </div>
              </div>

            </div>

            {/* 8. Top Skills in Selected Location Table (7 cols) */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-850 rounded-lg border border-[#E4E7EC] dark:border-slate-800 p-3">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E4E7EC] dark:border-slate-800">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#101828] dark:text-white">
                  Top Skills in {selectedDistrict.name}
                </span>
                <span className="text-[10px] text-[#667085] dark:text-slate-400">
                  {selectedDistrict.sector} Focus
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-slate-400 border-b border-[#E4E7EC] dark:border-slate-800">
                      <th className="pb-1.5 font-bold">Skill</th>
                      <th className="pb-1.5 text-center font-bold">Demand</th>
                      <th className="pb-1.5 text-center font-bold">Supply</th>
                      <th className="pb-1.5 text-right font-bold">Gap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E7EC] dark:divide-slate-800 font-medium">
                    {fallbackSkills.map((sk) => {
                      const gap = Math.max(0, sk.demandScore - sk.supplyScore);
                      return (
                        <tr key={sk.id} className="hover:bg-white dark:hover:bg-slate-800 transition">
                          <td className="py-1.5 font-bold text-[#101828] dark:text-white truncate max-w-[200px]">
                            {sk.name}
                          </td>
                          <td className="py-1.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                            {sk.demandScore}
                          </td>
                          <td className="py-1.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                            {sk.supplyScore}
                          </td>
                          <td className="py-1.5 text-right font-black">
                            <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              gap >= 25 
                                ? 'bg-rose-50 text-[#EF4444] dark:bg-rose-950/60'
                                : gap >= 15
                                ? 'bg-amber-50 text-[#F59E0B] dark:bg-amber-950/60'
                                : 'bg-emerald-50 text-[#10B981] dark:bg-emerald-950/60'
                            }`}>
                              +{gap}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 12. FROM DATA TO DECISIONS (SLIM WORKFLOW STRIP) */}
      <div className="bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 rounded-lg p-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#101828] dark:text-white">
              From Data to Decisions
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-[#667085] dark:text-slate-400">
            
            <div className="flex items-center space-x-1">
              <span className="font-mono font-bold text-[#4F46E5]">1</span>
              <span className="font-bold text-[#101828] dark:text-white">Evidence:</span>
              <span className="text-[11px] text-[#667085]">Explore market signals</span>
            </div>

            <span className="text-slate-300 dark:text-slate-600">→</span>

            <div className="flex items-center space-x-1">
              <span className="font-mono font-bold text-[#4F46E5]">2</span>
              <span className="font-bold text-[#101828] dark:text-white">Insight:</span>
              <span className="text-[11px] text-[#667085]">Identify gaps & causes</span>
            </div>

            <span className="text-slate-300 dark:text-slate-600">→</span>

            <div className="flex items-center space-x-1">
              <span className="font-mono font-bold text-[#4F46E5]">3</span>
              <span className="font-bold text-[#101828] dark:text-white">Action:</span>
              <span className="text-[11px] text-[#667085]">Design interventions</span>
            </div>

            <span className="text-slate-300 dark:text-slate-600">→</span>

            <div className="flex items-center space-x-1">
              <span className="font-mono font-bold text-[#4F46E5]">4</span>
              <span className="font-bold text-[#101828] dark:text-white">Outcome:</span>
              <span className="text-[11px] text-[#667085]">Track impact</span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
