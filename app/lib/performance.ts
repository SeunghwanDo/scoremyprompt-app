'use client';

/**
 * Performance monitoring utilities for ScoreMyPrompt
 * Collects Web Vitals and custom performance metrics, forwarding to PostHog.
 *
 * Usage:
 *   import { reportWebVitals, measureApiCall } from '@/app/lib/performance';
 *   reportWebVitals(); // call once in root layout / client init
 *   const data = await measureApiCall('analyze', () => fetch('/api/analyze', ...));
 */

// ─── Types ───
interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

interface PerfEntry {
  metric: string;
  value: number;
  rating?: string;
  page: string;
  timestamp: string;
}

// ─── PostHog capture helper ───
function capturePerf(eventName: string, properties: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    window.posthog?.capture(eventName, properties);
  } catch {
    // PostHog not loaded — silent fallback
  }
}

// ─── Web Vitals ───
// Uses PerformanceObserver API (no dependency on web-vitals library)

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    FID: [100, 300],
    INP: [200, 500],
    CLS: [0.1, 0.25],
    TTFB: [800, 1800],
    FCP: [1800, 3000],
  };
  const [good, poor] = thresholds[name] || [Infinity, Infinity];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

function createEntry(name: string, value: number): PerfEntry {
  return {
    metric: name,
    value: Math.round(name === 'CLS' ? value * 1000 : value), // CLS is unitless, multiply for readability
    rating: getRating(name, value),
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Collect Core Web Vitals and other performance metrics via PerformanceObserver.
 * Sends each metric to PostHog as `web_vital` event.
 * Call once on app mount.
 */
export function reportWebVitals(): void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  // LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      if (lastEntry) {
        const entry = createEntry('LCP', lastEntry.startTime);
        capturePerf('web_vital', entry);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}

  // FCP (First Contentful Paint)
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          const e = createEntry('FCP', entry.startTime);
          capturePerf('web_vital', e);
        }
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch {}

  // CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page hide
    const reportCLS = () => {
      const entry = createEntry('CLS', clsValue);
      capturePerf('web_vital', entry);
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') reportCLS();
    });
  } catch {}

  // INP (Interaction to Next Paint) — replaces FID
  try {
    let worstINP = 0;
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const eventEntry = entry as PerformanceEntry & { duration: number };
        if (eventEntry.duration > worstINP) {
          worstINP = eventEntry.duration;
        }
      }
    });
    inpObserver.observe({ type: 'event', buffered: true });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && worstINP > 0) {
        const entry = createEntry('INP', worstINP);
        capturePerf('web_vital', entry);
      }
    });
  } catch {}

  // TTFB (Time to First Byte)
  try {
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const navEntry = entry as PerformanceNavigationTiming;
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        if (ttfb >= 0) {
          const e = createEntry('TTFB', ttfb);
          capturePerf('web_vital', e);
        }
      }
    });
    navObserver.observe({ type: 'navigation', buffered: true });
  } catch {}
}

// ─── API Call Measurement ───

interface ApiMeasurement<T> {
  data: T;
  durationMs: number;
}

/**
 * Wraps an async API call and measures its duration.
 * Sends `api_performance` event to PostHog.
 *
 * @param endpoint - API endpoint name (e.g. 'analyze', 'export')
 * @param fn - Async function to measure
 * @returns The original return value plus duration metadata
 */
export async function measureApiCall<T>(
  endpoint: string,
  fn: () => Promise<T>
): Promise<ApiMeasurement<T>> {
  const start = performance.now();
  try {
    const data = await fn();
    const durationMs = Math.round(performance.now() - start);

    capturePerf('api_performance', {
      endpoint,
      duration_ms: durationMs,
      status: 'success',
      page: typeof window !== 'undefined' ? window.location.pathname : '',
    });

    return { data, durationMs };
  } catch (error) {
    const durationMs = Math.round(performance.now() - start);

    capturePerf('api_performance', {
      endpoint,
      duration_ms: durationMs,
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      page: typeof window !== 'undefined' ? window.location.pathname : '',
    });

    throw error;
  }
}

// ─── Page Load Performance ───

/**
 * Report page load performance metrics.
 * Call after the page has fully loaded.
 */
export function reportPageLoad(): void {
  if (typeof window === 'undefined') return;

  // Wait for load event to ensure all resources are available
  const report = () => {
    try {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!nav) return;

      const metrics = {
        dns_ms: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
        tcp_ms: Math.round(nav.connectEnd - nav.connectStart),
        ttfb_ms: Math.round(nav.responseStart - nav.requestStart),
        download_ms: Math.round(nav.responseEnd - nav.responseStart),
        dom_interactive_ms: Math.round(nav.domInteractive - nav.fetchStart),
        dom_complete_ms: Math.round(nav.domComplete - nav.fetchStart),
        load_event_ms: Math.round(nav.loadEventEnd - nav.fetchStart),
        transfer_size: nav.transferSize,
        page: window.location.pathname,
      };

      capturePerf('page_load_performance', metrics);
    } catch {}
  };

  if (document.readyState === 'complete') {
    // Small delay to ensure loadEventEnd is populated
    setTimeout(report, 100);
  } else {
    window.addEventListener('load', () => setTimeout(report, 100));
  }
}
