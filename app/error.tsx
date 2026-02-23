'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark flex items-center justify-center p-4">
      <div className="card max-w-md text-center">
        <div className="text-4xl mb-4">&#x26A0;&#xFE0F;</div>
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-6 text-sm">{error?.message || 'An unexpected error occurred.'}</p>
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  );
}
