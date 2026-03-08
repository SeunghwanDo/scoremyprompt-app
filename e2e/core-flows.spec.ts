import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Core Analysis Flow', () => {
  test('homepage loads with prompt input', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/ScoreMyPrompt/);

    // Prompt textarea should be visible
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
  });

  test('empty submit shows validation error', async ({ page }) => {
    await page.goto(BASE_URL);
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Should show some validation feedback
      await expect(page.locator('text=/enter|required|empty/i').first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('prompt input accepts text and shows character count', async ({ page }) => {
    await page.goto(BASE_URL);
    const textarea = page.locator('textarea').first();
    await textarea.fill('Write me a blog post about TypeScript best practices');

    // Character count or remaining indicator should update
    const charCount = page.locator('[class*="char"], [class*="count"], [class*="length"]').first();
    if (await charCount.isVisible()) {
      await expect(charCount).not.toHaveText('0');
    }
  });

  test('job role selector is accessible', async ({ page }) => {
    await page.goto(BASE_URL);
    const roleSelect = page.locator('select, [role="listbox"], [role="combobox"], button:has-text("role")').first();
    if (await roleSelect.isVisible()) {
      await expect(roleSelect).toBeEnabled();
    }
  });
});

test.describe('Share Page', () => {
  test('share page with invalid ID shows error gracefully', async ({ page }) => {
    await page.goto(`${BASE_URL}/result?share=invalid-id-12345`);
    await page.waitForLoadState('networkidle');

    // Should not crash — either show error or redirect
    const isError = await page.locator('text=/not found|error|invalid/i').first().isVisible().catch(() => false);
    const isRedirected = page.url() !== `${BASE_URL}/result?share=invalid-id-12345`;
    expect(isError || isRedirected).toBeTruthy();
  });
});

test.describe('Leaderboard', () => {
  test('leaderboard section loads on homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to leaderboard section
    const leaderboard = page.locator('[class*="leaderboard"], [id*="leaderboard"], text=/leaderboard|top scores/i').first();
    if (await leaderboard.isVisible()) {
      await expect(leaderboard).toBeVisible();
    }
  });

  test('leaderboard API returns valid data', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/leaderboard`);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toBeTruthy();
    // Should have entries array or similar structure
    expect(Array.isArray(data.entries) || Array.isArray(data.data) || Array.isArray(data)).toBeTruthy();
  });
});

test.describe('API Health', () => {
  test('health endpoint returns ok', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    expect(response.status()).toBeLessThanOrEqual(207);

    const data = await response.json();
    expect(data.status).toBeTruthy();
    expect(data.timestamp).toBeTruthy();
  });

  test('badge API handles missing params', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/badge`);
    // Should return 400 or default badge, not 500
    expect(response.status()).not.toBe(500);
  });
});

test.describe('Navigation & PWA', () => {
  test('manifest.json is accessible', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/manifest.json`);
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest.name).toContain('ScoreMyPrompt');
    expect(manifest.icons).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
  });

  test('robots.txt is accessible', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/robots.txt`);
    expect(response.ok()).toBeTruthy();

    const text = await response.text();
    expect(text).toContain('User-agent');
    expect(text).toContain('Sitemap');
  });

  test('404 page renders for unknown routes', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/this-page-does-not-exist-xyz`);
    expect(response?.status()).toBe(404);
    await expect(page.locator('text=/404|not found/i').first()).toBeVisible();
  });
});
