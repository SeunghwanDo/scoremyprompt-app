import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/history', '/pro/', '/offline'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      // AI crawlers are intentionally NOT blocked (removed 2026-08-17).
      // A prompt-engineering / AI-literacy site that hides from ChatGPT search,
      // Claude, and Perplexity is invisible exactly where its audience asks
      // questions. Training-opt-out, if wanted later, belongs in per-bot rules
      // (e.g. Google-Extended) — not a blanket disallow of the search agents.
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
