import type { Metadata } from 'next';
import { Suspense } from 'react';
import HomeClient from './HomeClient';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.com';

export const metadata: Metadata = {
  title: 'ScoreMyPrompt — Grade Your AI Prompt in 30 Seconds',
  description: 'Get your PROMPT Score across 6 dimensions and see how you compare with professionals in your field. Free, no signup required.',
  keywords: [
    'AI prompt grader', 'prompt score', 'ChatGPT prompt checker',
    'prompt engineering tool', 'AI prompt quality', 'prompt optimizer',
    'free prompt grader', 'PROMPT framework', 'prompt feedback',
    'score my prompt', 'prompt analysis', 'Claude prompt', 'AI writing',
  ],
  alternates: { canonical: baseUrl },
  openGraph: {
    title: 'ScoreMyPrompt — Grade Your AI Prompt in 30 Seconds',
    description: 'Get your PROMPT Score across 6 dimensions and see how you compare with professionals in your field.',
    url: baseUrl,
    siteName: 'ScoreMyPrompt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScoreMyPrompt — Grade Your AI Prompt in 30 Seconds',
    description: 'Get your PROMPT Score across 6 dimensions and see how you compare with professionals in your field.',
    creator: '@scoremyprompt',
  },
};

export default function Page() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
