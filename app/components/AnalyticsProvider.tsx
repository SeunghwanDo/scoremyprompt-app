'use client';

import { useEffect } from 'react';
import { initAnalytics, captureUTMParams } from '@/app/lib/analytics';
import { reportWebVitals, reportPageLoad } from '@/app/lib/performance';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
    captureUTMParams();
    reportWebVitals();
    reportPageLoad();
  }, []);

  return <>{children}</>;
}
