import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to Pro! | ScoreMyPrompt',
  robots: 'noindex, nofollow',
};

export default function ProSuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
