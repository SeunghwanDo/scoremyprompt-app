'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import type { Grade, DimensionMeta } from '@/app/types';

type DimensionKey = 'precision' | 'role' | 'outputFormat' | 'missionContext' | 'promptStructure' | 'tailoring';

interface HistoryDimensionScore {
  score: number;
  feedback: string;
}

interface HistoryAnalysis {
  id: number;
  date: string;
  prompt: string;
  score: number;
  grade: Grade;
  jobRole: string;
  dimensions: Record<DimensionKey, HistoryDimensionScore>;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

interface DimensionBarProps {
  dimKey: string;
  data: HistoryDimensionScore;
}

// TODO: Replace with Supabase query
const MOCK_ANALYSES: HistoryAnalysis[] = [
  {
    id: 1,
    date: '2025-02-20',
    prompt:
      'Create a comprehensive go-to-market strategy for a new SaaS product targeting small businesses with detailed pricing and launch plan.',
    score: 92,
    grade: 'S',
    jobRole: 'Marketing',
    dimensions: {
      precision: { score: 18, feedback: 'Excellent specificity' },
      role: { score: 14, feedback: 'Strong role-specific context' },
      outputFormat: { score: 15, feedback: 'Clear output structure' },
      missionContext: { score: 19, feedback: 'Mission context well defined' },
      promptStructure: { score: 14, feedback: 'Well organized' },
      tailoring: { score: 12, feedback: 'Good tailoring' },
    },
  },
  {
    id: 2,
    date: '2025-02-19',
    prompt: 'Design a mobile app interface for meditation with user flows and wireframes following iOS guidelines.',
    score: 78,
    grade: 'A',
    jobRole: 'Design',
    dimensions: {
      precision: { score: 15, feedback: 'Good clarity' },
      role: { score: 13, feedback: 'Role context present' },
      outputFormat: { score: 14, feedback: 'Clear format' },
      missionContext: { score: 16, feedback: 'Context defined' },
      promptStructure: { score: 12, feedback: 'Organized' },
      tailoring: { score: 8, feedback: 'Could be more specific' },
    },
  },
  {
    id: 3,
    date: '2025-02-18',
    prompt: 'Analyze quarterly financial performance and provide recommendations for improving cash flow.',
    score: 65,
    grade: 'B',
    jobRole: 'Finance',
    dimensions: {
      precision: { score: 12, feedback: 'Moderate specificity' },
      role: { score: 12, feedback: 'Role mentioned' },
      outputFormat: { score: 13, feedback: 'Fair structure' },
      missionContext: { score: 14, feedback: 'Context present' },
      promptStructure: { score: 11, feedback: 'Could be better organized' },
      tailoring: { score: 3, feedback: 'Needs more tailoring' },
    },
  },
  {
    id: 4,
    date: '2025-02-17',
    prompt: 'Write a blog post about AI trends in 2025.',
    score: 42,
    grade: 'C',
    jobRole: 'Marketing',
    dimensions: {
      precision: { score: 8, feedback: 'Too vague' },
      role: { score: 6, feedback: 'Role not specified' },
      outputFormat: { score: 10, feedback: 'Unclear output' },
      missionContext: { score: 9, feedback: 'Context missing' },
      promptStructure: { score: 7, feedback: 'Poor structure' },
      tailoring: { score: 2, feedback: 'No tailoring' },
    },
  },
  {
    id: 5,
    date: '2025-02-16',
    prompt: 'Create a product roadmap for a new feature.',
    score: 35,
    grade: 'D',
    jobRole: 'Product',
    dimensions: {
      precision: { score: 5, feedback: 'Very vague' },
      role: { score: 4, feedback: 'Missing role' },
      outputFormat: { score: 6, feedback: 'Unclear format' },
      missionContext: { score: 5, feedback: 'Missing context' },
      promptStructure: { score: 4, feedback: 'Poorly structured' },
      tailoring: { score: 11, feedback: 'Some specifics' },
    },
  },
];

const GRADE_CONFIG: Record<Grade, { color: string }> = {
  S: { color: '#10b981' },
  A: { color: '#3b82f6' },
  B: { color: '#f59e0b' },
  C: { color: '#f97316' },
  D: { color: '#ef4444' },
};

const DIMENSION_META: Record<DimensionKey, DimensionMeta> = {
  precision: { label: 'P — Precision', letter: 'P', maxScore: 20 },
  role: { label: 'R — Role', letter: 'R', maxScore: 15 },
  outputFormat: { label: 'O — Output Format', letter: 'O', maxScore: 15 },
  missionContext: { label: 'M — Mission Context', letter: 'M', maxScore: 20 },
  promptStructure: { label: 'P — Structure', letter: 'P', maxScore: 15 },
  tailoring: { label: 'T — Tailoring', letter: 'T', maxScore: 15 },
};

const DimensionBar = ({ dimKey, data }: DimensionBarProps) => {
  const meta = DIMENSION_META[dimKey as DimensionKey];
  if (!meta || !data) return null;

  const pct = (data.score / meta.maxScore) * 100;
  const color = pct >= 85 ? '#10b981' : pct >= 70 ? '#3b82f6' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: color + '22', color }}
          >
            {meta.letter}
          </span>
          <span className="font-medium text-white text-xs">{meta.label}</span>
        </div>
        <span className="text-xs font-bold" style={{ color }}>
          {data.score}/{meta.maxScore}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const JOB_ROLES = ['All', 'Marketing', 'Design', 'Product', 'Finance', 'Freelance', 'Engineering'];
const GRADES = ['All', 'S', 'A', 'B', 'C', 'D'];

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading, setShowAuth, setAuthMessage } = useAuth();
  const [analyses, setAnalyses] = useState<HistoryAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<HistoryAnalysis[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [jobRoleFilter, setJobRoleFilter] = useState<string>('All');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [page, setPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    if (!loading && !user) {
      setAuthMessage('Sign in to view your analysis history.');
      setShowAuth(true);
      router.push('/');
    }
  }, [user, loading, router, setShowAuth, setAuthMessage]);

  useEffect(() => {
    setAnalyses(MOCK_ANALYSES);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = analyses.filter((a) => {
      const jobMatch = jobRoleFilter === 'All' || a.jobRole === jobRoleFilter;
      const gradeMatch = gradeFilter === 'All' || a.grade === gradeFilter;
      return jobMatch && gradeMatch;
    });

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'lowest') {
      filtered.sort((a, b) => a.score - b.score);
    }

    setFilteredAnalyses(filtered);
    setPage(1);
  }, [analyses, jobRoleFilter, gradeFilter, sortBy]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-gray-400 mt-4">Loading history...</p>
        </div>
      </main>
    );
  }

  const paginatedAnalyses = filteredAnalyses.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const hasMore = page * ITEMS_PER_PAGE < filteredAnalyses.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold text-white">ScoreMyPrompt</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
              Home
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              PromptTribe →
            </a>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-4xl font-bold text-white mb-12">Analysis History</h2>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {/* Job Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Role
              </label>
              <select
                value={jobRoleFilter}
                onChange={(e) => setJobRoleFilter(e.target.value)}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {JOB_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Grade
              </label>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Score</option>
                <option value="lowest">Lowest Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Analyses List */}
        {paginatedAnalyses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No analyses yet.</p>
            <a href="/" className="btn-primary inline-block">
              Score your first prompt →
            </a>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {paginatedAnalyses.map((analysis) => (
                <div key={analysis.id} className="card">
                  {/* Summary Row */}
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === analysis.id ? null : analysis.id)
                    }
                    className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Score Circle */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <svg width={64} height={64} className="transform -rotate-90">
                          <circle cx={32} cy={32} r={28} fill="none" stroke="#1e293b" strokeWidth="6" />
                          <circle
                            cx={32}
                            cy={32}
                            r={28}
                            fill="none"
                            stroke={GRADE_CONFIG[analysis.grade].color}
                            strokeWidth="6"
                            strokeDasharray={Math.PI * 56}
                            strokeDashoffset={
                              Math.PI * 56 - (analysis.score / 100) * Math.PI * 56
                            }
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-xs font-bold" style={{ color: GRADE_CONFIG[analysis.grade].color }}>
                            {analysis.score}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-left">
                        <p className="text-sm text-gray-400 mb-1">
                          {new Date(analysis.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-white line-clamp-1">
                          {analysis.prompt.substring(0, 60)}...
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span
                            className="inline-block px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: GRADE_CONFIG[analysis.grade].color + '22',
                              color: GRADE_CONFIG[analysis.grade].color,
                            }}
                          >
                            Grade {analysis.grade}
                          </span>
                          <span className="inline-block px-2 py-1 rounded text-xs bg-slate-800 text-gray-400">
                            {analysis.jobRole}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-primary transition-transform ml-4 flex-shrink-0 ${
                        expandedId === analysis.id ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Expanded Details */}
                  {expandedId === analysis.id && (
                    <div className="mt-6 pt-6 border-t border-border animate-fade-in">
                      {/* Dimensions */}
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-white mb-4">PROMPT Dimensions</h4>
                        <div className="grid sm:grid-cols-2 gap-x-6">
                          {(Object.keys(DIMENSION_META) as DimensionKey[]).map((key) => (
                            <DimensionBar key={key} dimKey={key} data={analysis.dimensions[key]} />
                          ))}
                        </div>
                      </div>

                      {/* Re-analyze Button */}
                      <button className="btn-secondary w-full text-sm font-medium">
                        Re-analyze
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={() => setPage(page + 1)}
                  className="btn-secondary font-semibold px-8 py-3"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>© 2025 ScoreMyPrompt. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
