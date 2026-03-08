import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.com';

export const metadata: Metadata = {
  title: 'Your PROMPT Score Results | ScoreMyPrompt',
  description:
    'View your detailed AI prompt analysis across 6 PROMPT dimensions — Precision, Role, Output Format, Mission Context, Structure, and Tailoring.',
  alternates: { canonical: `${baseUrl}/result` },
  openGraph: {
    title: 'Your PROMPT Score Results | ScoreMyPrompt',
    description:
      'View your detailed AI prompt analysis across 6 PROMPT dimensions with actionable improvement tips.',
    url: `${baseUrl}/result`,
    siteName: 'ScoreMyPrompt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your PROMPT Score Results | ScoreMyPrompt',
    description:
      'View your detailed AI prompt analysis across 6 PROMPT dimensions with actionable improvement tips.',
    creator: '@scoremyprompt',
  },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
