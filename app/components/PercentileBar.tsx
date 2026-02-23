'use client';

interface PercentileBarProps {
  score: number;
  average: number;
  excellent: number;
  percentile: number;
}

export default function PercentileBar({ score, average, excellent, percentile }: PercentileBarProps) {
  const scorePos = Math.min(Math.max(score, 0), 100);
  const avgPos = Math.min(Math.max(average, 0), 100);
  const exPos = Math.min(Math.max(excellent, 0), 100);

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-white">Percentile Ranking</p>
        <span className="text-sm font-bold text-primary">Top {percentile}%</span>
      </div>
      <div
        className="relative w-full h-3 bg-slate-700 rounded-full overflow-visible"
        role="progressbar"
        aria-valuenow={percentile}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Top ${100 - percentile}% among professionals`}
      >
        {/* Gradient fill up to score position */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 transition-all duration-1000 ease-out"
          style={{ width: `${scorePos}%` }}
        />
        {/* Average marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-gray-400"
          style={{ left: `${avgPos}%` }}
          title="Average"
        />
        {/* Excellent marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-emerald-400"
          style={{ left: `${exPos}%` }}
          title="Excellent"
        />
        {/* Score indicator dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white bg-primary shadow-lg transition-all duration-1000 ease-out"
          style={{ left: `${scorePos}%`, marginLeft: '-8px' }}
        />
      </div>
      {/* Labels */}
      <div className="relative w-full mt-2 text-xs text-gray-400">
        <span className="absolute" style={{ left: `${avgPos}%`, transform: 'translateX(-50%)' }}>
          Avg ({average})
        </span>
        <span className="absolute" style={{ left: `${exPos}%`, transform: 'translateX(-50%)' }}>
          Excellent ({excellent})
        </span>
      </div>
    </div>
  );
}
