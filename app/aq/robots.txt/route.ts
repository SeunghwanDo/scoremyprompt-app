// aq.ai.kr/robots.txt — served via middleware rewrite (/robots.txt → /aq/robots.txt).
// The app-level app/robots.ts is ScoreMyPrompt's and would advertise the wrong
// sitemap on this host. AI crawlers are intentionally allowed: an "AI literacy"
// site that blocks AI search would be self-defeating.
export const dynamic = 'force-static';

export function GET(): Response {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /result',
    'Disallow: /certificate',
    'Disallow: /share',
    '',
    'Sitemap: https://aq.ai.kr/sitemap.xml',
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
