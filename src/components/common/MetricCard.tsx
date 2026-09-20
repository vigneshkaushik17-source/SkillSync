import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBgColor?: string;
  badge?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive',
  icon,
  iconBgColor = 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400',
  badge,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {value}
            </h3>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${iconBgColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          {change && (
            <div className="flex items-center space-x-1 font-medium">
              {changeType === 'positive' && (
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  {change}
                </span>
              )}
              {changeType === 'negative' && (
                <span className="flex items-center text-rose-600 dark:text-rose-400">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {change}
                </span>
              )}
              {changeType === 'neutral' && (
                <span className="flex items-center text-slate-500 dark:text-slate-400">
                  <Minus className="w-3.5 h-3.5 mr-0.5" />
                  {change}
                </span>
              )}
              <span className="text-slate-400 dark:text-slate-500">vs last period</span>
            </div>
          )}
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
