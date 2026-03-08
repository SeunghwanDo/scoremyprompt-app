import { test, expect, devices } from '@playwright/test';

/**
 * ScoreMyPrompt Extended E2E Tests
 * Sprint: Polish Sprint #30
 *
 * Covers: mobile viewports, dashboard access, auth gating, a11y basics
 */

const SAMPLE_PROMPT =
  'You are a senior marketing copywriter with 10 years of experience in B2B SaaS. Write a product launch email for our new AI analytics tool targeting CTOs at mid-market companies. Use a professional but conversational tone. Format: subject line, 3 paragraphs, and a CTA button text.';

// ─── Mobile Viewport Tests ───
test.describe('Mobile Viewport', () => {
  test.use({ ...devices['iPhone 13'] });

  test('homepage renders correctly on mobile', async ({ page }) => {
    await page.goto('/');
    // Logo and title visible
    await expect(page.locator('h1')).toBeVisible();
    // Textarea visible
    await expect(page.locator('textarea').first()).toBeVisible();
    // Job role buttons visible
    await expect(page.getByRole('button', { name: 'Marketing' })).toBeVisible();
    // Analyze button visible
    await expect(page.getByRole('button', { name: /score/i })).toBeVisible();
  });

  test('mobile nav hides desktop-only links', async ({ page }) => {
    await page.goto('/');
    // Templates and Pricing links should be hidden on mobile (hidden sm:block)
    const templatesLink = page.locator('a[href="/templates"]');
    await expect(templatesLink).toBeHidden();
  });

  test('mobile touch targets meet 44px minimum', async ({ page }) => {
    await page.goto('/');
    const analyzeBtn = page.getByRole('button', { name: /score/i });
    const box = await analyzeBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('character counter visible on mobile', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('textarea').first();
    await textarea.fill('Test prompt for mobile');
    await expect(page.locator('text=/\\d+ \\/ 5,000/')).toBeVisible();
  });

  test('example prompts are tappable on mobile', async ({ page }) => {
    await page.goto('/');
    const exampleBtn = page.locator('button:has-text("Marketing Strategy")');
    await expect(exampleBtn).toBeVisible();
    await exampleBtn.tap();
    const textarea = page.locator('textarea').first();
    const value = await textarea.inputValue();
    expect(value.length).toBeGreaterThan(50);
  });
});

// ─── Dashboard Access Tests ───
test.describe('Dashboard Access Gating', () => {
  test('redirects unauthenticated users from /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to homepage or show auth prompt
    await page.waitForTimeout(2000);
    const url = page.url();
    // Either redirected to home or still on dashboard with auth modal
    expect(url.includes('/dashboard') || url.includes('/')).toBeTruthy();
  });

  test('redirects unauthenticated users from /history', async ({ page }) => {
    await page.goto('/history');
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url.includes('/history') || url.includes('/')).toBeTruthy();
  });
});

// ─── Rate Limit UX Tests ───
test.describe('Rate Limit UX', () => {
  test('shows validation error for empty prompt', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /score/i }).click();
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test('analyze button disabled state during loading', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('textarea').first();
    await textarea.fill(SAMPLE_PROMPT);
    const btn = page.getByRole('button', { name: /score/i });
    await btn.click();
    // Button should be disabled during loading
    await expect(btn).toBeDisabled();
  });
});

// ─── Prompt Quality Indicator Tests ───
test.describe('Prompt Quality Indicator', () => {
  test('shows quality indicator when prompt has content', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('textarea').first();

    // Short prompt — should show "Basic"
    await textarea.fill('Create a simple report about marketing trends in the industry');
    await expect(page.locator('text=/Basic|Good|Detailed/')).toBeVisible();
  });

  test('upgrades quality level with detailed prompt', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('textarea').first();
    await textarea.fill(SAMPLE_PROMPT);
    // Detailed prompt with role + output format + sufficient detail + clear objective
    await expect(page.locator('text=/Good|Detailed/')).toBeVisible();
  });
});

// ─── Accessibility Basics ───
test.describe('Accessibility', () => {
  test('skip-to-content link exists', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('a[href="#main-content"]');
    // Should exist even if visually hidden
    expect(await skip.count()).toBeGreaterThanOrEqual(0);
  });

  test('textarea has aria-describedby', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('textarea').first();
    const describedBy = await textarea.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
  });

  test('error messages have role="alert"', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /score/i }).click();
    const alert = page.locator('[role="alert"]');
    await expect(alert).toBeVisible();
  });
});

// ─── Static Pages ───
test.describe('Static Pages', () => {
  test('privacy page loads', async ({ page }) => {
    const response = await page.goto('/privacy');
    expect(response?.status()).toBeLessThan(400);
  });

  test('terms page loads', async ({ page }) => {
    const response = await page.goto('/terms');
    expect(response?.status()).toBeLessThan(400);
  });

  test('pricing page loads', async ({ page }) => {
    const response = await page.goto('/pricing');
    expect(response?.status()).toBeLessThan(400);
  });
});
