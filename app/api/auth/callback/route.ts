import { getSupabaseClient } from '@/app/lib/supabase';
import { logger } from '@/app/lib/logger';
import { NextResponse } from 'next/server';

// Open Redirect prevention — only allow relative paths or known origins
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_BASE_URL,
  'http://localhost:3000',
].filter(Boolean) as string[];

function getSafeRedirect(raw: string | null): string {
  if (!raw) return '/';
  // Allow relative paths (must start with / and not //)
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw;
  // Allow known origins
  if (ALLOWED_ORIGINS.some((origin) => raw.startsWith(origin))) return raw;
  return '/';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const redirectTo = getSafeRedirect(searchParams.get('redirectTo'));

  if (error) {
    logger.error('OAuth error', { error, errorDescription: errorDescription || undefined });
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    logger.warn('No authorization code provided to callback');
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      logger.error('Failed to exchange code for session', { error: sessionError.message });
      return NextResponse.redirect(new URL('/?error=session_error', request.url));
    }

    if (!data?.session) {
      logger.warn('No session created after code exchange');
      return NextResponse.redirect(new URL('/?error=no_session', request.url));
    }

    const response = NextResponse.redirect(new URL(redirectTo, request.url), { status: 302 });

    const cookieOptions = {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    };

    const { access_token, refresh_token } = data.session;

    if (access_token) {
      response.cookies.set('sb-access-token', access_token, cookieOptions);
    }

    if (refresh_token) {
      response.cookies.set('sb-refresh-token', refresh_token, cookieOptions);
    }

    return response;
  } catch (err) {
    logger.error('Callback handler error', { error: String(err) });
    return NextResponse.redirect(new URL('/?error=callback_error', request.url));
  }
}
