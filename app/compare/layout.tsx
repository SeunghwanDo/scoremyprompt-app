import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.com';

export const metadata: Metadata = {
  title: 'Compare Prompts Side-by-Side | ScoreMyPrompt',
  description:
    'Compare two AI prompts head-to-head across all 6 PROMPT dimensions. See which prompt scores higher and why.',
  keywords: [
    'compare AI prompts',
    'prompt comparison tool',
    'side-by-side prompt analysis',
    'PROMPT score comparison',
  ],
  alternates: { canonical: `${baseUrl}/compare` },
  openGraph: {
    title: 'Compare Prompts Side-by-Side | ScoreMyPrompt',
    description:
      'Compare two AI prompts head-to-head across all 6 PROMPT dimensions. See which prompt scores higher and why.',
    url: `${baseUrl}/compare`,
    siteName: 'ScoreMyPrompt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Prompts Side-by-Side | ScoreMyPrompt',
    description:
      'Compare two AI prompts head-to-head across all 6 PROMPT dimensions.',
    creator: '@scoremyprompt',
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
