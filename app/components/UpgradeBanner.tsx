'use client';

import { useState } from 'react';
import Link from 'next/link';

interface UpgradeBannerProps {
  used: number;
  limit: number;
  onDismiss?: () => void;
}

export default function UpgradeBanner({ used, limit, onDismiss }: UpgradeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Show when used >= limit - 2 (e.g., 8/10 for free tier)
  const shouldShow = used >= limit - 2;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!shouldShow || !isVisible) {
    return null;
  }

  const progressPercent = (used / limit) * 100;

  return (
    <div className="card bg-gradient-to-r from-primary/5 via-surface to-accent/5 border-primary/60 relative overflow-hidden mb-6">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Main message */}
            <h3 className="text-lg font-semibold text-white mb-2">
              You've used {used} of {limit} free analyses today.
            </h3>

            {/* Subtext */}
            <p className="text-gray-400 text-sm mb-4">
              Upgrade to Pro for unlimited analyses, auto-rewrite, and more.
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-700/40 rounded-full h-2 overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>

            {/* CTA Button */}
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 text-sm"
            >
              Upgrade to Pro
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-300 transition-colors pt-1"
            aria-label="Dismiss upgrade banner"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
