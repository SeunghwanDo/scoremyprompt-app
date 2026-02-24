'use client';

import Footer from '../components/Footer';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-6">🔧</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            We&apos;ll be right back!
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            ScoreMyPrompt is experiencing high traffic right now.
            We&apos;re working on it and will be back shortly.
          </p>
          <div className="bg-dark-card border border-border rounded-xl p-6 mb-8">
            <p className="text-gray-300 text-sm">
              ⏱️ Estimated downtime: <span className="text-primary font-semibold">~5 minutes</span>
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Follow{' '}
              <a
                href="https://x.com/scoremyprompt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @scoremyprompt
              </a>{' '}
              for live updates.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all"
          >
            Try Again
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
