import * as Sentry from '@sentry/nextjs';

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (dsn && process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
    });
  }
}
