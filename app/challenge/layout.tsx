import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.com';

export const metadata: Metadata = {
  title: 'Challenge — Beat This Prompt Score | ScoreMyPrompt',
  description: 'Can you beat this PROMPT Score? Take the challenge and see how your AI prompting skills stack up.',
  alternates: { canonical: `${baseUrl}/challenge` },
  openGraph: {
    title: 'Challenge — Beat This Prompt Score | ScoreMyPrompt',
    description: 'Can you beat this PROMPT Score? Take the challenge and see how your AI prompting skills stack up.',
    url: `${baseUrl}/challenge`,
    siteName: 'ScoreMyPrompt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Challenge — Beat This Prompt Score | ScoreMyPrompt',
    description: 'Can you beat this PROMPT Score? Take the challenge and see how your AI prompting skills stack up.',
    creator: '@scoremyprompt',
  },
};

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
