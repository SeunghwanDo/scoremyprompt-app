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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Emergency maintenance mode — redirect all non-exempt traffic
  if (MAINTENANCE_MODE && !MAINTENANCE_BYPASS_PATHS.some((p) => pathname.startsWith(p))) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable', maintenance: true },
        { status: 503 }
      );
    }
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  // CSRF protection: validate Origin header on state-changing API requests
  if (pathname.startsWith('/api/') && request.method !== 'GET' && request.method !== 'HEAD') {
    const isExempt = CSRF_EXEMPT_ROUTES.some((route) => pathname.startsWith(route));
    if (!isExempt && !isValidOrigin(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }
  }

  // Add X-Request-Id to all API requests (both request and response)
  if (pathname.startsWith('/api/')) {
    const requestId = crypto.randomUUID();
    response.headers.set('X-Request-Id', requestId);
    // Make request ID available to API routes via custom header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-Request-Id', requestId);
  }

  // Check protected pages — use cookie-based session detection
  if (PROTECTED_PAGES.some((route) => pathname.startsWith(route))) {
    // Supabase stores the session in cookies with this pattern
    const hasSession =
      request.cookies.has('sb-access-token') ||
      request.cookies.has('sb-refresh-token') ||
      // Supabase v2 PKCE cookies use a project-ref based name
      Array.from(request.cookies.getAll()).some(
        (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
      );

    if (!hasSession) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('auth', 'required');
      return NextResponse.redirect(loginUrl);
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

  return response;
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
