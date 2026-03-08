'use client';

import { useState, useEffect } from 'react';

interface ProfilePromptProps {
  onDismiss: () => void;
  onComplete: (data: ProfileData) => void;
}

interface ProfileData {
  experienceLevel?: string;
  primaryUseCase?: string;
  aiToolUsed?: string;
}

const STORAGE_KEY = 'smp_profile_prompted';
const ANALYSIS_COUNT_KEY = 'smp_analysis_count';

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Just getting started', icon: '🌱' },
  { value: 'intermediate', label: 'Use AI weekly', icon: '⚡' },
  { value: 'advanced', label: 'Power user / daily', icon: '🚀' },
];

const USE_CASES = [
  { value: 'content', label: 'Content & Writing' },
  { value: 'code', label: 'Code & Development' },
  { value: 'analysis', label: 'Data & Analysis' },
  { value: 'strategy', label: 'Strategy & Planning' },
  { value: 'creative', label: 'Creative & Design' },
  { value: 'other', label: 'Other' },
];

const AI_TOOLS = [
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'copilot', label: 'Copilot' },
  { value: 'multiple', label: 'Multiple tools' },
];

/**
 * Shows a lightweight profile prompt after the user's 3rd analysis.
 * Collects experience level, use case, and AI tool preference.
 */
export function useProfilePrompt(): { shouldShow: boolean; dismiss: () => void } {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    try {
      const prompted = localStorage.getItem(STORAGE_KEY);
      if (prompted) return;

      const count = parseInt(localStorage.getItem(ANALYSIS_COUNT_KEY) || '0', 10);
      if (count >= 3) {
        setShouldShow(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const dismiss = () => {
    setShouldShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // localStorage unavailable
    }
  };

  return { shouldShow, dismiss };
}

export default function ProfilePrompt({ onDismiss, onComplete }: ProfilePromptProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ProfileData>({});

  const handleSelect = (field: keyof ProfileData, value: string) => {
    const updated = { ...data, [field]: value };
    setData(updated);

    if (step < 2) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      // All done
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem('smp_profile', JSON.stringify(updated));
      } catch {
        // localStorage unavailable
      }
      onComplete(updated);
    }
  };

  const handleSkip = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // localStorage unavailable
    }
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSkip} role="button" tabIndex={-1} aria-label="Close" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSkip(); }} />

      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-primary' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <>
            <h3 className="text-lg font-bold text-white mb-2">
              How experienced are you with AI?
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              This helps us personalize your feedback.
            </p>
            <div className="space-y-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleSelect('experienceLevel', level.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                    data.experienceLevel === level.value
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-border hover:border-primary/50 text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{level.icon}</span>
                  <span className="text-sm font-medium">{level.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="text-lg font-bold text-white mb-2">
              What do you mainly use AI for?
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              We&apos;ll tailor improvement tips to your workflow.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {USE_CASES.map((uc) => (
                <button
                  key={uc.value}
                  onClick={() => handleSelect('primaryUseCase', uc.value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    data.primaryUseCase === uc.value
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-border hover:border-primary/50 text-gray-300 hover:text-white'
                  }`}
                >
                  {uc.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-bold text-white mb-2">
              Which AI tool do you use most?
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              Almost done! This is the last question.
            </p>
            <div className="space-y-2">
              {AI_TOOLS.map((tool) => (
                <button
                  key={tool.value}
                  onClick={() => handleSelect('aiToolUsed', tool.value)}
                  className={`w-full p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    data.aiToolUsed === tool.value
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-border hover:border-primary/50 text-gray-300 hover:text-white'
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Skip */}
        <button
          onClick={handleSkip}
          className="mt-4 w-full text-center text-xs text-gray-500 hover:text-gray-300 transition-colors py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
