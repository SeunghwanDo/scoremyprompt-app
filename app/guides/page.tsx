import { GUIDES_CONTENT } from './content';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.com';

export const metadata: Metadata = {
  title: 'AI Prompt Engineering Guides | ScoreMyPrompt',
  description: 'Learn prompt engineering with our comprehensive guides. Master ChatGPT, Claude, and AI techniques with practical tutorials and best practices.',
  keywords: 'prompt engineering guide, ChatGPT guide, AI prompts, prompt writing, prompt engineering tutorial, how to write prompts, prompt techniques, PROMPT framework',
  alternates: { canonical: `${baseUrl}/guides` },
  openGraph: {
    title: 'AI Prompt Engineering Guides | ScoreMyPrompt',
    description: 'Learn prompt engineering with our comprehensive guides. Master ChatGPT, Claude, and AI techniques with practical tutorials and best practices.',
    url: `${baseUrl}/guides`,
    siteName: 'ScoreMyPrompt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Engineering Guides | ScoreMyPrompt',
    description: 'Learn prompt engineering with our comprehensive guides. Master ChatGPT, Claude, and AI techniques with practical tutorials and best practices.',
    creator: '@scoremyprompt',
  },
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-emerald-900/30 text-emerald-300 border border-emerald-800';
    case 'Intermediate':
      return 'bg-blue-900/30 text-blue-300 border border-blue-800';
    case 'Advanced':
      return 'bg-purple-900/30 text-purple-300 border border-purple-800';
    default:
      return 'bg-gray-900/30 text-gray-300 border border-gray-800';
  }
};

export default function GuidesHub() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold text-white">ScoreMyPrompt</h1>
          </a>
          <div className="flex items-center gap-4">
            <a href="/guides" className="text-sm text-white font-medium hover:text-gray-200 transition-colors hidden sm:block">
              Guides
            </a>
            <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              Score a Prompt →
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            AI Prompt Engineering
            <span className="block text-gradient">Guides</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Master the art of prompt engineering with comprehensive guides for every skill level and use case.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 animate-slide-in">
          {GUIDES_CONTENT.map((guide) => (
            <a
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="card hover:border-primary hover:bg-slate-800/50 transition-all duration-200 group"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors pr-2">
                      {guide.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {guide.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{guide.readingTime} min read</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Improve Your Prompts?
          </h2>
          <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
            Read our guides to understand best practices, then score your prompts to identify improvement areas.
          </p>
          <a
            href="/"
            className="btn-primary text-lg inline-block"
          >
            Score your prompt now →
          </a>
        </div>

        {/* Guide Categories */}
        <div className="mt-16 pt-16 border-t border-border">
          <h2 className="text-3xl font-bold text-white mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-3">Foundations</h3>
              <p className="text-gray-400 text-sm mb-4">
                Start here if you're new to prompt engineering. Learn fundamental concepts and best practices.
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="/guides/prompt-engineering-for-beginners" className="text-primary hover:text-accent transition-colors text-sm">
                    → Prompt Engineering for Beginners
                  </a>
                </li>
                <li>
                  <a href="/guides/how-to-write-better-ai-prompts" className="text-primary hover:text-accent transition-colors text-sm">
                    → How to Write Better AI Prompts
                  </a>
                </li>
                <li>
                  <a href="/guides/prompt-score-framework" className="text-primary hover:text-accent transition-colors text-sm">
                    → Understanding the PROMPT Score
                  </a>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-white mb-3">Practical Applications</h3>
              <p className="text-gray-400 text-sm mb-4">
                Learn how to apply prompt engineering to your specific field with templates and examples.
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="/guides/prompt-engineering-for-marketers" className="text-primary hover:text-accent transition-colors text-sm">
                    → AI Prompts for Marketers
                  </a>
                </li>
                <li>
                  <a href="/guides/prompt-engineering-for-designers" className="text-primary hover:text-accent transition-colors text-sm">
                    → AI Prompt Guide for Designers
                  </a>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-white mb-3">Advanced Techniques</h3>
              <p className="text-gray-400 text-sm mb-4">
                Deepen your skills with advanced strategies and 15+ battle-tested ChatGPT techniques.
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="/guides/chatgpt-prompt-tips" className="text-primary hover:text-accent transition-colors text-sm">
                    → 15 ChatGPT Prompt Tips
                  </a>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-white mb-3">Deep Dives</h3>
              <p className="text-gray-400 text-sm mb-4">
                Master the details. Comprehensive guides exploring specific topics in depth.
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="/guides/prompt-score-framework" className="text-primary hover:text-accent transition-colors text-sm">
                    → The PROMPT Score Framework
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>© 2025 ScoreMyPrompt. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
