'use client';

import { useState } from 'react';
import { GRADE_COLORS } from '@/app/constants';
import type { Grade } from '@/app/types';

interface DemoDimensionScore {
  score: number;
  maxScore: number;
}

interface DemoDimensionMeta {
  label: string;
  letter: string;
  maxScore: number;
}

interface DemoExample {
  id: string;
  text: string;
  difficulty: string;
  score: number;
  grade: Grade;
  description: string;
  dimensions: Record<string, DemoDimensionScore>;
}

const DIMENSION_META: Record<string, DemoDimensionMeta> = {
  precision: { label: 'Precision', letter: 'P', maxScore: 20 },
  role: { label: 'Role', letter: 'R', maxScore: 15 },
  outputFormat: { label: 'Output Format', letter: 'O', maxScore: 15 },
  missionContext: { label: 'Mission Context', letter: 'M', maxScore: 20 },
  promptStructure: { label: 'Structure', letter: 'P', maxScore: 15 },
  tailoring: { label: 'Tailoring', letter: 'T', maxScore: 15 },
};

const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: 'beginner',
    text: 'Write me an email about our product',
    difficulty: 'Beginner',
    score: 22,
    grade: 'D',
    description: 'Missing role, context, format, and clear objectives',
    dimensions: {
      precision: { score: 5, maxScore: 20 },
      role: { score: 0, maxScore: 15 },
      outputFormat: { score: 4, maxScore: 15 },
      missionContext: { score: 6, maxScore: 20 },
      promptStructure: { score: 3, maxScore: 15 },
      tailoring: { score: 4, maxScore: 15 },
    },
  },
  {
    id: 'intermediate',
    text: 'Create a marketing email campaign for our Q1 product launch. Target audience: small business owners. Include subject line, body copy, and CTA. Format: email template.',
    difficulty: 'Intermediate',
    score: 65,
    grade: 'B',
    description: 'Good structure and format hints, but missing role assignment and deeper context',
    dimensions: {
      precision: { score: 14, maxScore: 20 },
      role: { score: 5, maxScore: 15 },
      outputFormat: { score: 12, maxScore: 15 },
      missionContext: { score: 13, maxScore: 20 },
      promptStructure: { score: 11, maxScore: 15 },
      tailoring: { score: 10, maxScore: 15 },
    },
  },
  {
    id: 'advanced',
    text: 'You are a conversion-focused B2B copywriter with 10 years in SaaS. Write a professional email marketing campaign for our project management tool launch. Target: CTOs and VPs of Engineering at tech companies (50-200 employees). Goals: 25% open rate, 5% CTR. Include: compelling subject line under 50 chars, persuasive body emphasizing ROI and time-saving, clear CTA with urgency, mobile-friendly HTML template. Tone: professional but approachable.',
    difficulty: 'Advanced',
    score: 91,
    grade: 'S',
    description: 'Expert-level: clear role, specific context, measurable goals, detailed format requirements',
    dimensions: {
      precision: { score: 18, maxScore: 20 },
      role: { score: 14, maxScore: 15 },
      outputFormat: { score: 14, maxScore: 15 },
      missionContext: { score: 18, maxScore: 20 },
      promptStructure: { score: 14, maxScore: 15 },
      tailoring: { score: 13, maxScore: 15 },
    },
  },
];

const DimensionBar = ({ dimKey, data }: { dimKey: string; data: DemoDimensionScore }) => {
  const meta = DIMENSION_META[dimKey];
  if (!meta || !data) return null;
  const pct = (data.score / meta.maxScore) * 100;
  const color = pct >= 85 ? '#10b981' : pct >= 70 ? '#3b82f6' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="mb-2.5">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-300">{meta.letter} — {meta.label}</span>
        <span className="text-xs font-bold" style={{ color }}>{data.score}/{meta.maxScore}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

const ScoreCircle = ({ score, grade }: { score: number; grade: Grade }) => {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  const color = GRADE_COLORS[grade] || '#f59e0b';

  return (
    <div className="relative w-28 h-28 flex items-center justify-center mx-auto mb-4">
      <svg className="transform -rotate-90 w-28 h-28">
        <circle cx="56" cy="56" r="42" fill="none" stroke="#1e293b" strokeWidth="4" />
        <circle cx="56" cy="56" r="42" fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-xs font-bold mt-0.5" style={{ color }}>Grade {grade}</span>
      </div>
    </div>
  );
};

export default function DemoMode() {
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const example = selectedExample ? DEMO_EXAMPLES.find((e) => e.id === selectedExample) : null;

  const getDifficultyColor = (d: string) => {
    if (d === 'Beginner') return 'bg-red-900/30 text-red-300 border-red-700';
    if (d === 'Intermediate') return 'bg-amber-900/30 text-amber-300 border-amber-700';
    return 'bg-green-900/30 text-green-300 border-green-700';
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">See It In Action</h2>
          <p className="text-gray-400 text-lg">Click any example to see how PROMPT Score works</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {DEMO_EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setSelectedExample(ex.id)}
                className={`w-full card text-left transition-all duration-200 ${
                  selectedExample === ex.id
                    ? 'border-primary bg-slate-800/50'
                    : 'hover:border-primary/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed flex-1">{ex.text}</p>
                  <span className="text-2xl font-bold whitespace-nowrap" style={{ color: GRADE_COLORS[ex.grade] }}>
                    {ex.score}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(ex.difficulty)}`}>
                    {ex.difficulty}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: GRADE_COLORS[ex.grade], backgroundColor: GRADE_COLORS[ex.grade] + '22' }}>
                    Grade {ex.grade}
                  </span>
                </div>
              </button>
            ))}

            {!selectedExample && (
              <div className="mt-6 card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <p className="text-gray-300 text-center text-sm">
                  Click an example above, or scroll up to analyze your own prompt
                </p>
              </div>
            )}
          </div>

          {example && (
            <div className="card animate-fade-in sticky top-24 h-fit">
              <h3 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wide text-center">
                Analysis Result
              </h3>
              <ScoreCircle score={example.score} grade={example.grade} />
              <p className="text-xs text-gray-400 mb-5 italic text-center">{example.description}</p>

              <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                PROMPT Dimensions
              </h4>
              {Object.keys(DIMENSION_META).map((key) => (
                <DimensionBar key={key} dimKey={key} data={example.dimensions[key]} />
              ))}

              <div className="mt-5 pt-4 border-t border-border text-center">
                <p className="text-xs text-gray-400 mb-3">Want to analyze your own prompt?</p>
                <a href="#analyze" className="btn-primary w-full text-sm inline-block text-center">
                  Try Your Own Prompt
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
