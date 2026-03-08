import type { MetadataRoute } from 'next';
import { GUIDES_CONTENT } from './guides/content';

/**
 * Dynamic sitemap generator.
 * Uses fixed dates to avoid signaling false "freshness" to crawlers on every request.
 * Update these dates when actual page content changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: '2025-06-01', changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: '2025-06-01', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: '2025-06-01', changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/templates`, lastModified: '2025-06-01', changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/leaderboard`, lastModified: '2025-06-01', changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/challenge`, lastModified: '2025-06-01', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/compare`, lastModified: '2025-06-01', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: '2025-03-01', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: '2025-03-01', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const guidePages: MetadataRoute.Sitemap = GUIDES_CONTENT.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: '2025-06-01',
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...guidePages];
}
