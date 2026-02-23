/**
 * @jest-environment node
 */

/**
 * API Route Tests: /api/waitlist
 * Tests email validation and mock Supabase behavior
 */

describe('/api/waitlist', () => {
  const ENDPOINT = 'http://localhost:3000/api/waitlist';

  async function postWaitlist(body: Record<string, unknown>) {
    const { POST } = await import('@/app/api/waitlist/route');
    const request = new Request(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return POST(request);
  }

  it('should accept valid email', async () => {
    const response = await postWaitlist({
      email: 'test@example.com',
      source: 'homepage',
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
  });

  it('should reject invalid email', async () => {
    const response = await postWaitlist({
      email: 'not-an-email',
      source: 'homepage',
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('should reject missing email', async () => {
    const response = await postWaitlist({
      source: 'homepage',
    });

    expect(response.status).toBe(400);
  });
});
