'use client';

import { useMemo } from 'react';

interface Props {
  prompt: string;
}

interface QualityCheck {
  label: string;
  passed: boolean;
}

type Level = 'empty' | 'weak' | 'moderate' | 'strong';

const LEVEL_CONFIG: Record<Level, { label: string; color: string; barColor: string; bars: number }> = {
  empty:    { label: '',           color: 'text-gray-500',  barColor: 'bg-gray-700', bars: 0 },
  weak:     { label: 'Basic',     color: 'text-red-400',   barColor: 'bg-red-400',  bars: 1 },
  moderate: { label: 'Good',      color: 'text-amber-400', barColor: 'bg-amber-400', bars: 2 },
  strong:   { label: 'Detailed',  color: 'text-emerald-400', barColor: 'bg-emerald-400', bars: 3 },
};

function analyzePrompt(text: string): { level: Level; checks: QualityCheck[] } {
  const trimmed = text.trim();
  if (trimmed.length < 10) return { level: 'empty', checks: [] };

  const checks: QualityCheck[] = [
    { label: 'Has context or role',  passed: /(?:you are|act as|as a|role|context|background)/i.test(trimmed) },
    { label: 'Specifies output',     passed: /(?:format|output|structure|bullet|list|table|json|markdown|paragraph)/i.test(trimmed) },
    { label: 'Sufficient detail',    passed: trimmed.length >= 100 },
    { label: 'Clear objective',      passed: /(?:create|write|analyze|design|build|generate|develop|explain|summarize|compare)/i.test(trimmed) },
  ];

  const passed = checks.filter((c) => c.passed).length;

  if (passed >= 3) return { level: 'strong', checks };
  if (passed >= 2) return { level: 'moderate', checks };
  return { level: 'weak', checks };
}

export default function PromptQualityIndicator({ prompt }: Props) {
  const { level, checks } = useMemo(() => analyzePrompt(prompt), [prompt]);
  const config = LEVEL_CONFIG[level];

  if (level === 'empty') return null;

  return (
    <div className="flex items-center gap-3 mt-2" aria-live="polite">
      {/* Strength bars */}
      <div className="flex items-center gap-1" aria-label={`Prompt quality: ${config.label}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-5 sm:w-6 rounded-full transition-all duration-300 ${
              i <= config.bars ? config.barColor : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${config.color} transition-colors duration-300`}>
        {config.label}
      </span>

      {/* Micro tips — show first failing check as a hint */}
      {level !== 'strong' && (
        <span className="text-xs text-gray-500 hidden sm:inline">
          {checks.find((c) => !c.passed)
            ? `Tip: ${checks.find((c) => !c.passed)!.label.toLowerCase()}`
            : ''}
        </span>
      )}
    </div>
  );
}
