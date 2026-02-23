'use client';

import type { Grade, GradeConfig } from '../types';

interface ExtendedGradeConfig extends GradeConfig {
  bg: string;
}

interface ScoreCircleProps {
  score: number;
  grade: Grade;
  size?: number;
  mobileSize?: number;
  config: ExtendedGradeConfig;
}

export default function ScoreCircle({ score, grade, size = 220, mobileSize = 160, config }: ScoreCircleProps) {
  const renderCircle = (s: number) => {
    const radius = (s - 24) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return (
      <div className="flex flex-col items-center justify-center relative" style={{ width: s, height: s }}>
        <svg width={s} height={s} className="transform -rotate-90" role="img" aria-label={`PROMPT Score: ${score} out of 100, Grade ${grade}`}>
          <circle cx={s / 2} cy={s / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx={s / 2} cy={s / 2} r={radius} fill="none"
            stroke={config.color} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className={`font-bold ${s < 200 ? 'text-4xl' : 'text-5xl'}`} style={{ color: config.color }}>{score}</p>
          <p className="text-sm text-gray-400 mt-1">PROMPT Score</p>
          <div
            className="mt-2 px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: config.color + '22', color: config.color }}
          >
            Grade {grade}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="hidden sm:block">{renderCircle(size)}</div>
      <div className="block sm:hidden">{renderCircle(mobileSize)}</div>
    </>
  );
}
