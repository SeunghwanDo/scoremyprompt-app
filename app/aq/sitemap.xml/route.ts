// aq.ai.kr/sitemap.xml — served via middleware rewrite (/sitemap.xml → /aq/sitemap.xml).
// Only public, indexable AQ pages. /result, /share, /certificate are session-
// or query-bound and excluded (see /aq/robots.txt).
export const dynamic = 'force-static';

const BASE = 'https://aq.ai.kr';
const LAST_MOD = '2026-08-17';

const URLS: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/test', priority: '0.9', changefreq: 'monthly' },
];

export function GET(): Response {
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    URLS.map(
      (u) =>
        `  <url><loc>${BASE}${u.path}</loc><lastmod>${LAST_MOD}</lastmod>` +
        `<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
    ).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
