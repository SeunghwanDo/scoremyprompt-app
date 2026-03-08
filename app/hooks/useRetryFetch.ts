'use client';

import { useState, useCallback, useRef } from 'react';

interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay in ms for exponential backoff (default: 1000) */
  baseDelay?: number;
  /** Maximum delay in ms (default: 10000) */
  maxDelay?: number;
  /** HTTP status codes to retry on (default: [408, 429, 500, 502, 503, 504]) */
  retryOnStatus?: number[];
  /** Callback on each retry attempt */
  onRetry?: (attempt: number, error: Error) => void;
  /** Callback on final failure */
  onFinalError?: (error: Error) => void;
}

interface RetryState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  retryCount: number;
  /** Manually trigger a retry */
  retry: () => void;
  /** Reset state */
  reset: () => void;
}

const DEFAULT_RETRY_STATUS = [408, 429, 500, 502, 503, 504];

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBackoffDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter (±25%)
  const jitter = delay * 0.25 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}

/**
 * Hook for fetch with automatic retry and exponential backoff.
 *
 * Usage:
 *   const { data, error, loading, retry } = useRetryFetch<AnalysisResult>();
 *   const analyze = () => executeFetch('/api/analyze', { method: 'POST', body: ... });
 */
export function useRetryFetch<T = unknown>(config: RetryConfig = {}): RetryState<T> & {
  executeFetch: (url: string, options?: RequestInit) => Promise<T | null>;
} {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    retryOnStatus = DEFAULT_RETRY_STATUS,
    onRetry,
    onFinalError,
  } = config;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const lastFetchRef = useRef<{ url: string; options?: RequestInit } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const executeFetch = useCallback(
    async (url: string, options?: RequestInit): Promise<T | null> => {
      lastFetchRef.current = { url, options };
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      setRetryCount(0);

      let lastError: Error = new Error('Unknown error');

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (controller.signal.aborted) break;

        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });

          if (!response.ok) {
            if (retryOnStatus.includes(response.status) && attempt < maxRetries) {
              const err = new Error(`HTTP ${response.status}: ${response.statusText}`);
              lastError = err;
              setRetryCount(attempt + 1);
              onRetry?.(attempt + 1, err);

              const delay = getBackoffDelay(attempt, baseDelay, maxDelay);
              await wait(delay);
              continue;
            }

            // Non-retryable error or final attempt
            const errorBody = await response.json().catch(() => null);
            throw new Error(
              errorBody?.error || `Request failed with status ${response.status}`
            );
          }

          const result = (await response.json()) as T;
          setData(result);
          setLoading(false);
          return result;
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            setLoading(false);
            return null;
          }

          lastError = err instanceof Error ? err : new Error(String(err));

          // Network error — retry if we have attempts left
          if (attempt < maxRetries && !(err instanceof SyntaxError)) {
            setRetryCount(attempt + 1);
            onRetry?.(attempt + 1, lastError);

            const delay = getBackoffDelay(attempt, baseDelay, maxDelay);
            await wait(delay);
            continue;
          }
        }
      }

      // All retries exhausted
      setError(lastError);
      setLoading(false);
      onFinalError?.(lastError);
      return null;
    },
    [maxRetries, baseDelay, maxDelay, retryOnStatus, onRetry, onFinalError]
  );

  const retry = useCallback(() => {
    if (lastFetchRef.current) {
      executeFetch(lastFetchRef.current.url, lastFetchRef.current.options);
    }
  }, [executeFetch]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setData(null);
    setError(null);
    setLoading(false);
    setRetryCount(0);
  }, []);

  return { data, error, loading, retryCount, retry, reset, executeFetch };
}
