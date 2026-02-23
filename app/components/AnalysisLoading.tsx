'use client';
import { useState, useEffect } from 'react';

const STEPS = [
  { label: 'Reading your prompt...', duration: 1500 },
  { label: 'Analyzing 6 dimensions...', duration: 3000 },
  { label: 'Calculating PROMPT Score...', duration: 2000 },
  { label: 'Generating feedback...', duration: 2000 },
];

const TIPS = [
  'Did you know? 85% of top-scoring prompts include a specific Role.',
  'Pro tip: Adding output format can boost your score by 15 points.',
  'Fun fact: The average prompt scores 62 points. Can you beat it?',
  'Tip: Context-rich prompts score 2x higher on Mission Context.',
];

export default function AnalysisLoading() {
  const [step, setStep] = useState(0);
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);

  useEffect(() => {
    const timers = STEPS.map((s, i) =>
      setTimeout(() => setStep(i), STEPS.slice(0, i).reduce((a, b) => a + b.duration, 0))
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-3">
        {STEPS.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 transition-opacity ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-700 text-slate-500'
            }`}>
              {i < step ? '\u2713' : i + 1}
            </div>
            <span className={`text-sm ${i === step ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
        <div className="h-20 w-20 mx-auto rounded-full bg-slate-700 animate-pulse" />
        <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 bg-slate-700 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
          ))}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-blue-300 text-sm">{tip}</p>
      </div>
    </div>
  );
}
