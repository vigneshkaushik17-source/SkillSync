import React from 'react';

interface ScoreMeterProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showNumeric?: boolean;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  size = 'md',
  label,
  showNumeric = true
}) => {
  // Determine color based on threshold
  let strokeColor = '#10b981'; // green (>= 75)
  let bgFill = 'bg-emerald-500';
  let textColor = 'text-emerald-600 dark:text-emerald-400';

  if (score < 40) {
    strokeColor = '#ef4444'; // red
    bgFill = 'bg-rose-500';
    textColor = 'text-rose-600 dark:text-rose-400';
  } else if (score < 75) {
    strokeColor = '#f59e0b'; // amber
    bgFill = 'bg-amber-500';
    textColor = 'text-amber-600 dark:text-amber-400';
  }

  const radius = size === 'sm' ? 18 : size === 'lg' ? 42 : 28;
  const strokeWidth = size === 'sm' ? 3.5 : size === 'lg' ? 6 : 4.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg
          width={svgSize}
          height={svgSize}
          className="transform -rotate-90 transition-all duration-700 ease-out"
        >
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Active progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {showNumeric && (
          <div className="absolute flex flex-col items-center justify-center">
            <span
              className={`font-bold tracking-tight ${
                size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-xl' : 'text-sm'
              } text-slate-800 dark:text-slate-100`}
            >
              {score}
              <span className="text-[10px] opacity-70">%</span>
            </span>
          </div>
        )}
      </div>

      {label && (
        <span className="mt-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 text-center">
          {label}
        </span>
      )}
    </div>
  );
};
