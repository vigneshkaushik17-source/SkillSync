import React from 'react';
import { ProficiencyLevel } from '../../types';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface SkillChipProps {
  name: string;
  demandScore?: number;
  proficiency?: ProficiencyLevel;
  status?: 'Matched' | 'Partial' | 'Missing' | 'Keep' | 'Update' | 'Add' | 'Remove';
  onClick?: () => void;
  selected?: boolean;
}

export const SkillChip: React.FC<SkillChipProps> = ({
  name,
  demandScore,
  proficiency,
  status,
  onClick,
  selected = false
}) => {
  let statusBadge = null;

  if (status === 'Matched' || status === 'Keep') {
    statusBadge = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1 flex-shrink-0" />;
  } else if (status === 'Partial' || status === 'Update') {
    statusBadge = <AlertCircle className="w-3.5 h-3.5 text-amber-500 mr-1 flex-shrink-0" />;
  } else if (status === 'Missing' || status === 'Remove') {
    statusBadge = <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5 flex-shrink-0" />;
  } else if (status === 'Add') {
    statusBadge = <Sparkles className="w-3.5 h-3.5 text-blue-500 mr-1 flex-shrink-0" />;
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        selected
          ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/60 dark:border-brand-500 dark:text-brand-300 shadow-sm'
          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
      } ${onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-600' : ''}`}
    >
      {statusBadge}
      <span className="font-medium truncate max-w-[200px]">{name}</span>

      {demandScore !== undefined && (
        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          {demandScore}
        </span>
      )}

      {proficiency && (
        <span className="ml-1.5 text-[10px] opacity-70 text-slate-500 dark:text-slate-400">
          • {proficiency}
        </span>
      )}
    </div>
  );
};
