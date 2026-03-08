import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.com';

export const metadata: Metadata = {
  title: 'Bulk Prompt Analysis — Pro | ScoreMyPrompt',
  description:
    'Analyze multiple AI prompts at once with ScoreMyPrompt Pro. Get PROMPT Scores, dimension breakdowns, and improvement tips for up to 10 prompts in one go.',
  alternates: { canonical: `${baseUrl}/bulk` },
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Bulk Prompt Analysis — Pro | ScoreMyPrompt',
    description:
      'Analyze multiple AI prompts at once. Pro feature for power users.',
    url: `${baseUrl}/bulk`,
    siteName: 'ScoreMyPrompt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Prompt Analysis — Pro | ScoreMyPrompt',
    description: 'Analyze multiple AI prompts at once. Pro feature for power users.',
    creator: '@scoremyprompt',
  },
};

export default function BulkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
