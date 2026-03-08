import { test, expect } from '@playwright/test';

/**
 * ScoreMyPrompt Infrastructure E2E Tests
 * Sprint 9 (#49): Security headers, API endpoints, SEO, PWA, Offline
 */

// ─── Security Headers ───
test.describe('Security Headers', () => {
  test('homepage returns security headers', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();

    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('origin-when-cross-origin');
    expect(headers['x-dns-prefetch-control']).toBe('on');
    expect(headers['cross-origin-opener-policy']).toBe('same-origin');
  });

  test('API routes have no-cache headers', async ({ request }) => {
    const response = await request.get('/api/health');
    const headers = response.headers();

    expect(headers['cache-control']).toContain('no-store');
    expect(headers['x-content-type-options']).toBe('nosniff');
  });

  test('API routes have X-Robots-Tag noindex', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.headers()['x-robots-tag']).toBe('noindex');
  });

  test('static assets have long cache headers', async ({ request }) => {
    const response = await request.get('/manifest.json');
    if (response.ok()) {
      expect(response.headers()['cache-control']).toContain('public');
    }
  });

  test('HSTS header is set', async ({ request }) => {
    const response = await request.get('/');
    const hsts = response.headers()['strict-transport-security'];
    expect(hsts).toContain('max-age=');
  });
});

// ─── API Endpoints ───
test.describe('API Endpoints', () => {
  test('health endpoint returns structured response', async ({ request }) => {
    const response = await request.get('/api/health');
    const data = await response.json();

    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(['ok', 'degraded', 'critical']).toContain(data.status);
  });

  test('health response includes request ID', async ({ request }) => {
    const response = await request.get('/api/health');
    const requestId = response.headers()['x-request-id'];
    // Request ID should be a valid UUID
    if (requestId) {
      expect(requestId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    }
  });

  test('badge endpoint returns SVG image', async ({ request }) => {
    const response = await request.get('/api/badge?score=85&grade=A');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('image');
  });

  test('badge with edge case scores', async ({ request }) => {
    const zero = await request.get('/api/badge?score=0&grade=D');
    expect(zero.status()).toBe(200);

    const hundred = await request.get('/api/badge?score=100&grade=S');
    expect(hundred.status()).toBe(200);
  });

  test('embed endpoint returns image', async ({ request }) => {
    const response = await request.get('/api/embed?score=75&grade=B');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image');
  });

  test('OG endpoint handles missing params gracefully', async ({ request }) => {
    const response = await request.get('/api/og');
    // Should return 200 with defaults or 400 for missing params
    expect([200, 400]).toContain(response.status());
  });

  test('export requires authentication', async ({ request }) => {
    const response = await request.post('/api/export', {
      data: { analysisId: '00000000-0000-0000-0000-000000000000', format: 'html' },
    });
    // Should return 401 or 403 for unauthenticated
    expect([401, 403]).toContain(response.status());
  });

  test('history requires authentication', async ({ request }) => {
    const response = await request.get('/api/history');
    expect([401, 403]).toContain(response.status());
  });

  test('dashboard requires authentication', async ({ request }) => {
    const response = await request.get('/api/dashboard');
    expect([401, 403]).toContain(response.status());
  });
});

// ─── SEO ───
test.describe('SEO', () => {
  test('sitemap.xml is accessible and valid', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('scoremyprompt.com');
  });

  test('robots.txt is accessible and valid', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('User-agent');
    expect(body).toContain('Sitemap');
    // Should block dashboard and API
    expect(body).toContain('/api/');
    expect(body).toContain('/dashboard');
  });

  test('homepage has meta description', async ({ page }) => {
    await page.goto('/');
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(30);
  });

  test('homepage has og:title and og:description', async ({ page }) => {
    await page.goto('/');
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    expect(ogDesc).toBeTruthy();
  });

  test('homepage has canonical URL', async ({ page }) => {
    await page.goto('/');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
  });
});

// ─── PWA ───
test.describe('PWA', () => {
  test('manifest.json is valid', async ({ request }) => {
    const response = await request.get('/manifest.json');
    expect(response.status()).toBe(200);
    const manifest = await response.json();

    expect(manifest).toHaveProperty('name');
    expect(manifest).toHaveProperty('short_name');
    expect(manifest).toHaveProperty('start_url');
    expect(manifest).toHaveProperty('display');
    expect(manifest).toHaveProperty('icons');
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test('homepage links to manifest', async ({ page }) => {
    await page.goto('/');
    const manifestLink = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestLink).toBeTruthy();
  });

  test('service worker file is accessible', async ({ request }) => {
    const response = await request.get('/sw.js');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('smp-v2');
  });
});

// ─── Offline Page ───
test.describe('Offline Page', () => {
  test('offline page loads with proper content', async ({ page }) => {
    const response = await page.goto('/offline');
    expect(response?.status()).toBe(200);
    await expect(page.locator('text=/offline/i')).toBeVisible();
    await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
  });

  test('offline page has tips section', async ({ page }) => {
    await page.goto('/offline');
    await expect(page.locator('text=/while you wait/i')).toBeVisible();
    await expect(page.locator('text=/Wi-Fi/i')).toBeVisible();
  });
});

// ─── Maintenance Page ───
test.describe('Maintenance Page', () => {
  test('maintenance page loads with proper content', async ({ page }) => {
    const response = await page.goto('/maintenance');
    expect(response?.status()).toBe(200);
    await expect(page.locator('text=/right back/i')).toBeVisible();
  });

  test('maintenance page has auto-refresh countdown', async ({ page }) => {
    await page.goto('/maintenance');
    // Should show countdown number
    await expect(page.locator('text=/auto-checking/i')).toBeVisible();
  });

  test('maintenance page has check now button', async ({ page }) => {
    await page.goto('/maintenance');
    await expect(page.getByRole('button', { name: /check now/i })).toBeVisible();
  });

  test('maintenance page has follow updates link', async ({ page }) => {
    await page.goto('/maintenance');
    const link = page.locator('a:has-text("Follow Updates")');
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toContain('x.com/scoremyprompt');
  });
});

// ─── Error Handling ───
test.describe('Error Handling', () => {
  test('404 page for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345');
    expect(response?.status()).toBe(404);
  });

  test('API returns JSON error for invalid POST', async ({ request }) => {
    const response = await request.post('/api/analyze', {
      data: { prompt: '' },
    });
    // Should return error, not crash
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('Zod validation rejects invalid export format', async ({ request }) => {
    const response = await request.post('/api/export', {
      data: { analysisId: 'not-a-uuid', format: 'exe' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

// ─── Performance Basics ───
test.describe('Performance', () => {
  test('homepage loads within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });

  test('health endpoint responds within 500ms', async ({ request }) => {
    const start = Date.now();
    await request.get('/api/health');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(500);
  });
});
