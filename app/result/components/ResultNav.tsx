'use client';

import type { User } from '@supabase/supabase-js';

interface ResultNavProps {
  user: User | null;
  onNewAnalysis: () => void;
  onSignIn: () => void;
}

export default function ResultNav({ user, onNewAnalysis, onSignIn }: ResultNavProps) {
  return (
    <nav className="border-b border-border backdrop-blur-sm sticky top-0 z-50" aria-label="Result page navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <button onClick={onNewAnalysis} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold text-white">ScoreMyPrompt</span>
        </button>
        {user ? (
          <span className="text-sm text-gray-300">{user.email?.split('@')[0]}</span>
        ) : (
          <button
            onClick={onSignIn}
            className="text-sm px-4 py-1.5 bg-primary/20 border border-primary/40 text-primary rounded-lg hover:bg-primary/30 transition-colors min-h-[44px]"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
