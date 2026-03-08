'use client';

import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  /** Whether the browser is online */
  isOnline: boolean;
  /** Effective connection type (4g, 3g, 2g, slow-2g) */
  effectiveType: string | null;
  /** Whether connection is slow (2g or slow-2g) */
  isSlow: boolean;
  /** Timestamp of last status change */
  lastChanged: number;
}

/**
 * Hook to monitor network connectivity status.
 * Shows toast notifications on connection changes.
 *
 * Usage:
 *   const { isOnline, isSlow } = useNetworkStatus();
 *   if (!isOnline) return <OfflineBanner />;
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: null,
    isSlow: false,
    lastChanged: Date.now(),
  });

  const updateStatus = useCallback(() => {
    const connection = (navigator as Navigator & {
      connection?: { effectiveType?: string };
    }).connection;

    const effectiveType = connection?.effectiveType || null;
    const isSlow = effectiveType === '2g' || effectiveType === 'slow-2g';

    setStatus({
      isOnline: navigator.onLine,
      effectiveType,
      isSlow,
      lastChanged: Date.now(),
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => updateStatus();
    const handleOffline = () => updateStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection quality changes
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { effectiveType?: string };
    }).connection;

    if (connection) {
      connection.addEventListener('change', updateStatus);
    }

    // Initial check
    updateStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, [updateStatus]);

  return status;
}
