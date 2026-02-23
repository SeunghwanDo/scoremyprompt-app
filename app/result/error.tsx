'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';
import { getErrorCategory, ErrorIcon } from '../error';

export default function ResultError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const category = getErrorCategory(error);

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <ErrorIcon type={category.icon} />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Analysis Error</h2>
        <p className="text-gray-400 mb-6 text-sm">
          {process.env.NODE_ENV === 'production'
            ? 'Failed to load analysis results. Please try again.'
            : error?.message || category.hint}
        </p>

        {error?.digest && (
          <p className="text-xs text-gray-600 mb-4 font-mono">Ref: {error.digest}</p>
        )}

        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary inline-flex items-center gap-2">
            Try Again
          </button>
          <Link href="/" className="btn-secondary inline-flex items-center gap-2">
            Analyze Another Prompt
          </Link>
        </div>
      </div>
    </div>
  );
}
