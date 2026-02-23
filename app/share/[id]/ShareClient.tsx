'use client';

import Link from 'next/link';
import { GRADE_CONFIG, DIMENSION_META } from '@/app/constants';
import type { Grade } from '@/app/types';

interface ShareCardData {
  score: number;
  grade: Grade;
  gradeLabel: string;
  jobRole: string;
  percentile: number;
  dimensions: { p: number; r: number; o: number; m: number; s: number; t: number };
}

interface ShareClientProps {
  shareId: string;
  data: ShareCardData;
}

const DIMENSION_KEYS = ['p', 'r', 'o', 'm', 's', 't'] as const;

export default function ShareClient({ data }: ShareClientProps) {
  const gradeConfig = GRADE_CONFIG[data.grade];

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      {/* Minimal nav */}
      <nav className="border-b border-border py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" aria-label="ScoreMyPrompt Home">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-white">ScoreMyPrompt</span>
          </Link>
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        {/* Score Card */}
        <div className="bg-surface border border-border rounded-lg p-8 text-center mb-8 animate-fade-in">
          <p className="text-sm text-gray-400 mb-6">Shared PROMPT Score</p>

          {/* Score Circle (inline simplified version) */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200" role="img" aria-label={`PROMPT Score: ${data.score} out of 100, Grade ${data.grade}`}>
              <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-700/30" />
              <circle
                cx="100" cy="100" r="85"
                stroke={gradeConfig.color}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(data.score / 100) * 534} 534`}
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white">{data.score}</span>
              <span className="text-xs text-gray-400 tracking-widest mt-1">PROMPT</span>
              <span
                className="mt-2 px-3 py-0.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: `${gradeConfig.color}20`, color: gradeConfig.color }}
              >
                {data.grade}
              </span>
            </div>
          </div>

          <p className="text-xl font-bold text-white mb-1">{data.gradeLabel}</p>
          <p className="text-gray-400 text-sm mb-8">
            Top {data.percentile}% among {data.jobRole} professionals
          </p>

          {/* Mini dimension scores */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 pt-6 border-t border-border">
            {DIMENSION_KEYS.map((key) => {
              const meta = DIMENSION_META[key];
              const score = data.dimensions[key];
              return (
                <div key={key} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: gradeConfig.color }}>
                    {score}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{meta?.label || key.toUpperCase()}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-gray-400 mb-6 text-lg">Think you can beat this score?</p>
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 rounded-xl"
          >
            Try It Yourself
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-xs text-gray-500 mt-4">Free, no signup required</p>
        </div>
      </section>
    </main>
  );
}
