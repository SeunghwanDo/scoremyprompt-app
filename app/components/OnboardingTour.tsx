'use client';

import { useState, useEffect, useCallback } from 'react';

interface TourStep {
  target: string; // CSS selector or element ID
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '#analyze',
    title: 'Paste Your Prompt',
    description: 'Drop any AI prompt here — ChatGPT, Claude, Gemini, or any LLM. We\'ll score it across 6 dimensions.',
    position: 'top',
  },
  {
    target: '[data-tour="role-selector"]',
    title: 'Pick Your Role',
    description: 'Select your job role so we can benchmark your prompt against peers in the same field.',
    position: 'bottom',
  },
  {
    target: '[data-tour="analyze-btn"]',
    title: 'Get Your Score',
    description: 'Hit this button and get your PROMPT Score in under 5 seconds — completely free, no signup needed.',
    position: 'top',
  },
];

const STORAGE_KEY = 'smp_tour_completed';

export default function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    try {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (!completed) {
        // Delay to let page render
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const positionTooltip = useCallback(() => {
    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    const el = document.querySelector(step.target);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollY = window.scrollY;

    let top = 0;
    let left = rect.left + rect.width / 2;

    switch (step.position) {
      case 'top':
        top = rect.top + scrollY - 16;
        break;
      case 'bottom':
        top = rect.bottom + scrollY + 16;
        break;
      default:
        top = rect.top + scrollY + rect.height / 2;
    }

    // Clamp left position
    left = Math.max(180, Math.min(left, window.innerWidth - 180));

    setTooltipPos({ top, left });

    // Scroll element into view
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentStep]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(positionTooltip, 300);
      window.addEventListener('resize', positionTooltip);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', positionTooltip);
      };
    }
  }, [isVisible, currentStep, positionTooltip]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // localStorage unavailable
    }
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const isAbove = step.position === 'top';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300"
        onClick={handleDismiss}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[61] w-80 transition-all duration-300 ease-out"
        style={{
          top: isAbove ? tooltipPos.top : tooltipPos.top,
          left: tooltipPos.left,
          transform: `translate(-50%, ${isAbove ? '-100%' : '0'})`,
        }}
      >
        <div className="bg-surface border border-primary/40 rounded-xl p-5 shadow-2xl shadow-primary/10">
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-surface border-primary/40 rotate-45 ${
              isAbove
                ? 'bottom-[-7px] border-r border-b'
                : 'top-[-7px] border-l border-t'
            }`}
          />

          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mb-3">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-6 bg-primary'
                    : i < currentStep
                    ? 'w-3 bg-primary/40'
                    : 'w-3 bg-slate-700'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-auto">
              {currentStep + 1}/{TOUR_STEPS.length}
            </span>
          </div>

          <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={handleDismiss}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Skip tour
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              {isLast ? 'Got it!' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
