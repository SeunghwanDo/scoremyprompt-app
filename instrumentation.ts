import * as Sentry from '@sentry/nextjs';

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (dsn && process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      environment: process.env.NODE_ENV,
      // D-Day monitoring: capture all errors, sample 10% of transactions
      beforeSend(event) {
        // Tag API route errors for alert filtering in Sentry dashboard
        if (event.request?.url?.includes('/api/analyze')) {
          event.tags = { ...event.tags, api_route: 'analyze', critical: 'true' };
        }
        if (event.request?.url?.includes('/api/')) {
          event.tags = { ...event.tags, api_route: 'general' };
        }
        return event;
      },
      // Ignore known non-critical errors
      ignoreErrors: [
        'AbortError',
        'ResizeObserver loop',
        'Non-Error promise rejection',
      ],
    });
  }
}
