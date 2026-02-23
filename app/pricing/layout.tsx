import type { Metadata } from 'next';
import { FAQ_ITEMS } from './data';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.com';

export const metadata: Metadata = {
  title: 'Pricing — Free & Pro Plans | ScoreMyPrompt',
  description: 'Score your AI prompts for free or upgrade to Pro for unlimited analyses, auto-rewrite, and more. Plans starting at $9.99/month.',
  keywords: ['ScoreMyPrompt pricing', 'AI prompt tool pricing', 'prompt grading pro plan', 'free AI prompt checker'],
  alternates: { canonical: `${baseUrl}/pricing` },
  openGraph: {
    title: 'Pricing — Free & Pro Plans | ScoreMyPrompt',
    description: 'Score your AI prompts for free or upgrade to Pro for unlimited analyses, auto-rewrite, and more.',
    url: `${baseUrl}/pricing`,
    siteName: 'ScoreMyPrompt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — Free & Pro Plans | ScoreMyPrompt',
    description: 'Score your AI prompts for free or upgrade to Pro for unlimited analyses, auto-rewrite, and more.',
    creator: '@scoremyprompt',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
      {children}
    </>
  );
}
