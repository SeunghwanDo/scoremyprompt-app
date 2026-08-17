import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_PAGES = ['/dashboard', '/history', '/compare', '/pro'];

// API routes that require Authorization header
const PROTECTED_API_ROUTES = ['/api/analyze-bulk', '/api/export', '/api/stripe/checkout', '/api/stripe/portal'];

// API routes exempt from CSRF check (read-only GET endpoints, webhooks)
const CSRF_EXEMPT_ROUTES = ['/api/stripe/webhook', '/api/og', '/api/health'];

function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // No origin header = same-origin navigation or non-browser client
  if (!origin) return true;

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

// Maintenance mode: set MAINTENANCE_MODE=true in Vercel env vars to redirect all traffic
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true';
const MAINTENANCE_BYPASS_PATHS = ['/maintenance', '/api/health', '/api/og', '/favicon.svg'];

// AQ host whitelist: aq.ai.kr + optional extras via env
const AQ_HOSTS = new Set([
  'aq.ai.kr',
  ...(process.env.AQ_HOSTS?.split(',').map(h => h.trim()).filter(Boolean) ?? []),
]);

function isAqHost(host: string | null): boolean {
  if (!host) return false;
  // Strip port for localhost testing
  const hostname = host.split(':')[0];
  return AQ_HOSTS.has(hostname);
}

// Main-app origin that AQ host falls back to for non-AQ paths (guides, pricing, …).
const MAIN_ORIGIN = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.app';

// Paths that exist under app/aq/* — the only things aq.ai.kr serves natively.
// Anything else the global Header links to (/guides, /pricing, /templates, …)
// used to be rewritten to /aq/guides etc. and 404'd. Now it redirects to the
// main app instead. Keep in sync with app/aq/ route segments.
const AQ_NATIVE_PATHS = ['/test', '/result', '/share', '/certificate', '/cert'];

// Paths served as-is on the AQ host (static, api, PWA bits).
const AQ_PASSTHROUGH_PREFIXES = ['/api/', '/_next', '/.well-known'];
const AQ_PASSTHROUGH_EXACT = new Set(['/manifest.json', '/manifest.webmanifest', '/sw.js', '/offline']);
// AQ has its own robots/sitemap under app/aq/ (the app-level ones are ScoreMyPrompt's).
const AQ_OWN_WELL_KNOWN = new Set(['/robots.txt', '/sitemap.xml']);

function isAqNativePath(pathname: string): boolean {
  return AQ_NATIVE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  // ── AQ host routing: aq.ai.kr ──
  //  /            → rewrite /aq
  //  /test, /cert/… (native AQ paths) → rewrite /aq/…
  //  /aq/*        → 308 to clean URL (avoid duplicate URLs across hosts)
  //  robots/sitemap/api/_next → pass through
  //  everything else (/guides, /pricing, …) → 307 to main app
  if (isAqHost(host)) {
    if (pathname === '/aq' || pathname.startsWith('/aq/')) {
      const stripped = pathname === '/aq' ? '/' : pathname.slice('/aq'.length);
      const url = new URL(stripped, request.url);
      url.search = request.nextUrl.search;
      return NextResponse.redirect(url, 308);
    }
    if (pathname === '/' || isAqNativePath(pathname) || AQ_OWN_WELL_KNOWN.has(pathname)) {
      const aqPath = pathname === '/' ? '/aq' : `/aq${pathname}`;
      const url = new URL(aqPath, request.url);
      url.search = request.nextUrl.search;
      return NextResponse.rewrite(url);
    }
    const passthrough =
      AQ_PASSTHROUGH_EXACT.has(pathname) ||
      AQ_PASSTHROUGH_PREFIXES.some((p) => pathname.startsWith(p));
    if (!passthrough) {
      const url = new URL(pathname, MAIN_ORIGIN);
      url.search = request.nextUrl.search;
      return NextResponse.redirect(url, 307);
    }
  }

  // ── Path-based i18n: extract locale prefix and rewrite ──
  // /ko/pricing → rewrite to /pricing, set locale cookie + header
  const localeMatch = pathname.match(/^\/(ko|ja|zh-CN|zh-TW|es|fr|de|pt|hi)(\/.*)?$/);
  if (localeMatch) {
    const locale = localeMatch[1]!;
    const strippedPath = localeMatch[2] || '/';
    const url = new URL(strippedPath, request.url);
    // Preserve query string
    url.search = request.nextUrl.search;
    const response = NextResponse.rewrite(url);
    response.cookies.set('smp_locale', locale, { path: '/', maxAge: 365 * 24 * 60 * 60 });
    response.headers.set('Content-Language', locale);
    return response;
  }

  const isApiRoute = pathname.startsWith('/api/');

  // Emergency maintenance mode — redirect all non-exempt traffic
  if (MAINTENANCE_MODE && !MAINTENANCE_BYPASS_PATHS.some((p) => pathname.startsWith(p))) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable', maintenance: true },
        { status: 503 }
      );
    }
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  // CSRF protection: validate Origin header on state-changing API requests
  if (isApiRoute && request.method !== 'GET' && request.method !== 'HEAD') {
    const isExempt = CSRF_EXEMPT_ROUTES.some((route) => pathname.startsWith(route));
    if (!isExempt && !isValidOrigin(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }
  }

  // Check protected API routes for Authorization header
  if (PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }
  }

  // Check protected pages — use cookie-based session detection
  if (PROTECTED_PAGES.some((route) => pathname.startsWith(route))) {
    const hasSession =
      request.cookies.has('sb-access-token') ||
      request.cookies.has('sb-refresh-token') ||
      Array.from(request.cookies.getAll()).some(
        (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
      );

    if (!hasSession) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('auth', 'required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // API routes: inject X-Request-Id into request + response headers
  if (isApiRoute) {
    const requestId = crypto.randomUUID();
    const response = NextResponse.next({
      request: {
        headers: new Headers([...request.headers.entries(), ['x-request-id', requestId]]),
      },
    });
    response.headers.set('x-request-id', requestId);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg (favicon files)
     * - public folder files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
