/**
 * ScoreMyPrompt — Service Worker v2
 * Provides: offline fallback, static asset caching, network-first page strategy,
 *           navigation preload, SW update signaling.
 */

const CACHE_NAME = 'smp-v2';
const OFFLINE_URL = '/offline';

// Static assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

// Install — pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate — clean old caches, enable navigation preload
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Purge stale caches
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
      // Enable navigation preload if supported
      self.registration.navigationPreload
        ? self.registration.navigationPreload.enable()
        : Promise.resolve(),
    ])
  );
  self.clients.claim();
});

// Notify all clients of a new SW version
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch — network-first for pages, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== self.location.origin) return;

  // API routes — network only (no caching)
  if (url.pathname.startsWith('/api/')) return;

  // Static assets (images, fonts, CSS, JS) — cache-first
  if (
    url.pathname.match(/\.(svg|png|jpg|jpeg|webp|avif|ico|woff2?|css|js)$/) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Navigation requests — use preload response if available, then network, then cache
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try navigation preload first
          const preloadResponse = event.preloadResponse
            ? await event.preloadResponse
            : undefined;

          if (preloadResponse) return preloadResponse;

          // Fall back to network
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        } catch {
          // Offline — try cache, then offline page
          const cached = await caches.match(request);
          return cached || (await caches.match(OFFLINE_URL)) || new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // Other same-origin GET — network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)))
  );
});
