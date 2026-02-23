'use client';

import type { DimensionScore } from '../types';

interface DimensionMeta {
  label: string;
  letter: string;
  maxScore: number;
}

interface DimensionBarProps {
  dimKey: string;
  data: DimensionScore | undefined;
  meta: DimensionMeta | undefined;
  feedback?: { low: string; high: string };
  blurred?: boolean;
  index?: number;
}

function getBarColor(pct: number): string {
  if (pct >= 85) return '#10b981';
  if (pct >= 70) return '#3b82f6';
  if (pct >= 50) return '#f59e0b';
  return '#ef4444';
}

export default function DimensionBar({ data, meta, feedback, blurred = false, index = 0 }: DimensionBarProps) {
  if (!meta || !data) return null;

  const pct = (data.score / meta.maxScore) * 100;
  const color = getBarColor(pct);
  const emotionalHint = feedback ? (pct < 60 ? feedback.low : feedback.high) : null;

  return (
    <div
      className="mb-5 animate-bar-grow"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: color + '22', color }}
          >
            {meta.letter}
          </span>
          <span className="font-medium text-white text-sm">{meta.label}</span>
        </div>
        <span className={`text-sm font-bold ${blurred ? 'blur-sm select-none' : ''}`} style={{ color }}>
          {data.score}/{meta.maxScore}
        </span>
      </div>
      <div
        className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden"
        role="progressbar"
        aria-valuenow={data.score}
        aria-valuemin={0}
        aria-valuemax={meta.maxScore}
        aria-label={`${meta.label}: ${data.score} out of ${meta.maxScore}`}
      >
        <div
          className="h-full transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className={`text-xs text-gray-400 mt-1.5 ${blurred ? 'blur-sm select-none pointer-events-none' : ''}`}>
        {data.feedback}
      </p>
      {emotionalHint && (
        <p
          className={`text-xs mt-1 font-medium ${blurred ? 'blur-sm select-none pointer-events-none' : ''}`}
          style={{ color: pct < 60 ? '#f59e0b' : '#10b981' }}
        >
          {emotionalHint}
        </p>
      )}
    </div>
  );
}
