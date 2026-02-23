import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analysis History | ScoreMyPrompt',
  robots: 'noindex, nofollow',
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
