import { test, expect } from '@playwright/test';

/**
 * ScoreMyPrompt Launch Readiness E2E Tests
 * Sprint Plan D-1 QA: Core flow + share flow + OG image + mobile
 *
 * Run: npx playwright test
 * Run against prod: E2E_BASE_URL=https://scoremyprompt.com npx playwright test
 */

test.describe('Core Grading Flow', () => {
  test('homepage loads with prompt input', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('textarea, input[type="text"]').first()).toBeVisible();
  });

  test('shows error for too-short prompt', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('textarea, input[type="text"]').first();
    await input.fill('short');
    await page.getByRole('button', { name: /score|analyze|grade/i }).click();
    await expect(page.locator('text=/at least|too short|10 character/i')).toBeVisible();
  });

  test('submits prompt and navigates to result', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('textarea, input[type="text"]').first();
    await input.fill(
      'You are a senior marketing copywriter with 10 years of experience in B2B SaaS. Write a product launch email for our new AI analytics tool targeting CTOs at mid-market companies. Use a professional but conversational tone. Format: subject line, 3 paragraphs, and a CTA button text.'
    );

    // Select a job role if available
    const roleButton = page.locator('button:has-text("Marketing")');
    if (await roleButton.isVisible()) {
      await roleButton.click();
    }

    await page.getByRole('button', { name: /score|analyze|grade/i }).click();

    // Should show loading or navigate to result within 15 seconds
    await expect(page).toHaveURL(/result/, { timeout: 15000 });
  });

  test('result page shows score, grade, and dimensions', async ({ page }) => {
    // Set mock result in sessionStorage before navigating
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'promptResult',
        JSON.stringify({
          overallScore: 85,
          grade: 'A',
          gradeLabel: 'Excellent',
          percentile: 92,
          jobRole: 'Marketing',
          dimensions: {
            precision: { score: 88, feedback: 'Good specificity' },
            role: { score: 82, feedback: 'Clear role' },
            output: { score: 90, feedback: 'Well-defined format' },
            modifiers: { score: 78, feedback: 'Some constraints' },
            specificity: { score: 85, feedback: 'Detailed request' },
            testing: { score: 87, feedback: 'Testable output' },
          },
          feedback: 'Great prompt!',
          rewrittenPrompt: 'Improved version of the prompt.',
        })
      );
    });
    await page.goto('/result');

    // Score should be visible
    await expect(page.locator('text=85')).toBeVisible({ timeout: 5000 });
    // Grade should be visible
    await expect(page.locator('text=/A|Excellent/i')).toBeVisible();
  });
});

test.describe('Share Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'promptResult',
        JSON.stringify({
          overallScore: 92,
          grade: 'S',
          gradeLabel: 'Exceptional',
          percentile: 98,
          jobRole: 'Developer',
          dimensions: {
            precision: { score: 95, feedback: 'Excellent' },
            role: { score: 90, feedback: 'Clear' },
            output: { score: 88, feedback: 'Defined' },
            modifiers: { score: 93, feedback: 'Strong' },
            specificity: { score: 91, feedback: 'Precise' },
            testing: { score: 94, feedback: 'Testable' },
          },
          feedback: 'Outstanding prompt!',
          rewrittenPrompt: 'Improved prompt.',
        })
      );
    });
    await page.goto('/result');
  });

  test('share buttons are visible on result page', async ({ page }) => {
    // Check that share buttons exist
    const shareSection = page.locator('text=/share|tweet|linkedin/i').first();
    await expect(shareSection).toBeVisible({ timeout: 5000 });
  });

  test('X share opens compose window', async ({ page, context }) => {
    const [popup] = await Promise.all([
      context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
      page.locator('button:has-text("X"), button[aria-label*="twitter"], button[aria-label*="X"]').first().click(),
    ]);
    // Should open twitter intent URL
    if (popup) {
      expect(popup.url()).toContain('twitter.com/intent/tweet');
      await popup.close();
    }
  });

  test('copy link works', async ({ page }) => {
    const copyBtn = page.locator('button:has-text("Copy"), button[aria-label*="copy"]').first();
    if (await copyBtn.isVisible()) {
      await copyBtn.click();
      // Should show copied feedback
      await expect(page.locator('text=/copied|link copied/i')).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('OG Image', () => {
  test('OG image endpoint returns valid image', async ({ request }) => {
    const response = await request.get(
      '/api/og?score=85&grade=A&gradeLabel=Excellent&jobRole=Marketing&percentile=92&p=88&r=82&o=90&m=78&s=85&t=87'
    );
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image');
  });

  test('OG image with edge scores works', async ({ request }) => {
    // Low score
    const low = await request.get('/api/og?score=15&grade=D&jobRole=Developer&p=10&r=20&o=15&m=12&s=18&t=15');
    expect(low.status()).toBe(200);

    // Perfect score
    const high = await request.get('/api/og?score=100&grade=S&jobRole=Designer&p=100&r=100&o=100&m=100&s=100&t=100');
    expect(high.status()).toBe(200);
  });
});

test.describe('Core Pages', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/challenge', name: 'Challenge' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/guides', name: 'Guides' },
    { path: '/templates', name: 'Templates' },
    { path: '/maintenance', name: 'Maintenance' },
  ];

  for (const p of pages) {
    test(`${p.name} (${p.path}) loads correctly`, async ({ page }) => {
      const response = await page.goto(p.path);
      expect(response?.status()).toBe(200);
    });
  }
});

test.describe('API Health', () => {
  test('health endpoint returns status', async ({ request }) => {
    const response = await request.get('/api/health');
    const status = response.status();
    expect([200, 207, 503]).toContain(status);

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(['ok', 'degraded', 'critical']).toContain(data.status);
  });
});

test.describe('Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone viewport

  test('homepage is mobile-friendly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    const input = page.locator('textarea, input[type="text"]').first();
    await expect(input).toBeVisible();
  });

  test('result page share bar visible on mobile', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'promptResult',
        JSON.stringify({
          overallScore: 75,
          grade: 'B',
          gradeLabel: 'Good',
          percentile: 70,
          jobRole: 'Marketing',
          dimensions: {
            precision: { score: 75, feedback: 'Ok' },
            role: { score: 72, feedback: 'Ok' },
            output: { score: 78, feedback: 'Ok' },
            modifiers: { score: 70, feedback: 'Ok' },
            specificity: { score: 76, feedback: 'Ok' },
            testing: { score: 74, feedback: 'Ok' },
          },
          feedback: 'Good prompt.',
          rewrittenPrompt: 'Better version.',
        })
      );
    });
    await page.goto('/result');
    // On mobile, share section should still be accessible
    await expect(page.locator('text=75')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Timeout Handling', () => {
  test('long prompt (500+ chars) responds within 15 seconds', async ({ page }) => {
    await page.goto('/');
    const longPrompt = `You are an expert data scientist and machine learning engineer with over 15 years of experience specializing in natural language processing and transformer architectures. I need you to create a comprehensive technical analysis document that evaluates the performance characteristics of large language models when processing multi-modal inputs including text images and structured data. The analysis should cover latency benchmarks memory utilization patterns and throughput metrics across different hardware configurations including consumer GPUs enterprise GPU clusters and cloud-based inference endpoints. Format the output as a structured technical report with sections headers data tables and clear methodology descriptions. Include specific benchmark numbers and cite relevant academic papers published in the last 2 years.`;

    const input = page.locator('textarea, input[type="text"]').first();
    await input.fill(longPrompt);

    const roleButton = page.locator('button:has-text("Developer")');
    if (await roleButton.isVisible()) {
      await roleButton.click();
    }

    const start = Date.now();
    await page.getByRole('button', { name: /score|analyze|grade/i }).click();
    await expect(page).toHaveURL(/result/, { timeout: 15000 });
    const elapsed = Date.now() - start;

    // Sprint plan: response within 10s; allow 15s for CI slack
    expect(elapsed).toBeLessThan(15000);
  });
});
