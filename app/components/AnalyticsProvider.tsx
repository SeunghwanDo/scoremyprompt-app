'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/app/lib/analytics';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <>{children}</>;
}
