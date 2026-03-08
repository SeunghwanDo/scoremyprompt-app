import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  requestId?: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Try to read the X-Request-Id header set by middleware.
 * Returns undefined if called outside a request context (e.g. build time).
 */
function getRequestId(): string | undefined {
  try {
    const headerStore = headers();
    return headerStore.get('x-request-id') || undefined;
  } catch {
    // Not in a request context — return undefined
    return undefined;
  }
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const requestId = getRequestId();

  const entry: LogEntry = {
    level,
    message,
    ...(requestId && { requestId }),
    timestamp: new Date().toISOString(),
    ...(context && { context }),
  };

  const output = JSON.stringify(entry);

  if (level === 'error') {
    console.error(output);
    // Forward errors to Sentry when configured
    try {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: { ...context, requestId },
      });
    } catch {
      // Sentry not initialized — silent fallback
    }
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
};
