'use client';

import Link from 'next/link';

function getErrorCategory(error: Error) {
  const msg = error?.message?.toLowerCase() || '';
  if (msg.includes('network') || msg.includes('fetch'))
    return { label: 'Network Error', hint: 'Check your internet connection and try again.', icon: 'network' as const };
  if (msg.includes('auth') || msg.includes('unauthorized') || msg.includes('401'))
    return { label: 'Authentication Error', hint: 'You may need to sign in again.', icon: 'auth' as const };
  if (msg.includes('not found') || msg.includes('404'))
    return { label: 'Not Found', hint: 'The requested resource could not be found.', icon: 'notfound' as const };
  return { label: 'Something went wrong', hint: 'An unexpected error occurred. Please try again.', icon: 'generic' as const };
}

function ErrorIcon({ type }: { type: 'network' | 'auth' | 'notfound' | 'generic' }) {
  const iconClass = 'w-16 h-16 mx-auto text-gray-500';
  switch (type) {
    case 'network':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" className="text-red-500" />
        </svg>
      );
    case 'auth':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    case 'notfound':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
  }
}

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const category = getErrorCategory(error);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <ErrorIcon type={category.icon} />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">{category.label}</h2>
        <p className="text-gray-400 mb-6 text-sm">
          {process.env.NODE_ENV === 'production' ? category.hint : error?.message || category.hint}
        </p>

        {error?.digest && process.env.NODE_ENV !== 'production' && (
          <p className="text-xs text-gray-600 mb-4 font-mono">Error ID: {error.digest}</p>
        )}

        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
          <Link href="/" className="btn-secondary inline-flex items-center gap-2">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
