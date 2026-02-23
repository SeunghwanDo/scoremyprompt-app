// Lightweight wrapper for PostHog analytics
// Falls back to console.log in development

declare global {
  interface Window {
    posthog?: {
      init: (key: string, config: Record<string, unknown>) => void;
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!posthogKey) {
    console.log('[Analytics] PostHog key not set — tracking disabled');
    return;
  }

  // PostHog snippet loader (minified vendor code)
  // @ts-expect-error - minified PostHog IIFE snippet
  !function(t: Document, e: Record<string, unknown>){let o: string,n: number,p: HTMLScriptElement,r: HTMLScriptElement;(e as Record<string,unknown>).__SV||(window.posthog=e as Window['posthog'],((e as Record<string,unknown>)._i as unknown[])=[],((e as Record<string,unknown>).init as Function)=function(i: string,s: Record<string,unknown>,a?: string){function g(t: Record<string,unknown>,e: string){const o=e.split(".");2==o.length&&(t=t[o[0]] as Record<string,unknown>,e=o[1]),t[e]=function(){(t as Record<string,unknown[]>).push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=(s.api_host as string)+"/static/array.js",(r=t.getElementsByTagName("script")[0] as HTMLScriptElement).parentNode!.insertBefore(p,r);const u=void 0!==a?((e as Record<string,unknown[]>)[a]=[]):e;for(void 0!==a||(a="posthog"),(u as Record<string,unknown>).people=(u as Record<string,unknown>).people||[],(u as Record<string,unknown>).toString=function(t: boolean){let e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u as Record<string,unknown>,o[n]);((e as Record<string,unknown>)._i as unknown[]).push([i,s,a])},(e as Record<string,unknown>).__SV=1)}(document,window.posthog as unknown as Record<string, unknown>||[]);

  window.posthog?.init(posthogKey, {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
  });
}

interface AnalysisEvent {
  jobRole: string;
  score: number;
  grade: string;
}

export function trackAnalysis({ jobRole, score, grade }: AnalysisEvent): void {
  if (typeof window === 'undefined') return;

  const event = { job_role: jobRole, score, grade, timestamp: new Date().toISOString() };

  window.posthog?.capture('prompt_analyzed', event);

  if (!isProd) {
    console.log('[Analytics] prompt_analyzed', event);
  }
}

interface ShareEvent {
  method: string;
  score: number;
  grade: string;
}

export function trackShare({ method, score, grade }: ShareEvent): void {
  if (typeof window === 'undefined') return;

  const event = { method, score, grade };
  window.posthog?.capture('score_shared', event);

  if (!isProd) {
    console.log('[Analytics] score_shared', event);
  }
}

export function trackWaitlistSignup({ source }: { source: string }): void {
  if (typeof window === 'undefined') return;

  window.posthog?.capture('waitlist_signup', { source });

  if (!isProd) {
    console.log('[Analytics] waitlist_signup', { source });
  }
}

export function trackDemoClick({ exampleId, difficulty }: { exampleId: string; difficulty: string }): void {
  if (typeof window === 'undefined') return;
  window.posthog?.capture('demo_example_clicked', { example_id: exampleId, difficulty });
}
