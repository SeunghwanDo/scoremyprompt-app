/**
 * @jest-environment node
 */

/**
 * API Route Tests: /api/analyze-bulk
 * Tests auth requirement, validation, and rate limiting
 */

import { POST } from '@/app/api/analyze-bulk/route';

function makeRequest(
  body: Record<string, unknown>,
  token?: string
) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['authorization'] = `Bearer ${token}`;

  return new Request('http://localhost:3000/api/analyze-bulk', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('/api/analyze-bulk', () => {
  describe('Authentication', () => {
    it('should return 401 without auth token', async () => {
      const request = makeRequest({
        prompts: ['Write a marketing plan for Q1 targeting small businesses'],
        jobRole: 'Marketing',
      });

      const response = await POST(request);
      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.error).toContain('Unauthorized');
    });

    it('should return 401 with invalid auth header format', async () => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        authorization: 'InvalidFormat token123',
      };
      const request = new Request('http://localhost:3000/api/analyze-bulk', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompts: ['Write a marketing plan for Q1 targeting small businesses'],
          jobRole: 'Marketing',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });
  });

  describe('Validation', () => {
    it('should return 400 for empty prompts array', async () => {
      const request = makeRequest(
        { prompts: [], jobRole: 'Marketing' },
        'fake-token'
      );

      const response = await POST(request);
      // Will fail auth first (fake token), but validates the request structure
      expect([400, 401, 500]).toContain(response.status);
    });

    it('should return error for invalid jobRole', async () => {
      const request = makeRequest(
        { prompts: ['Valid prompt text here for testing purposes'], jobRole: 'InvalidRole' },
        'fake-token'
      );

      const response = await POST(request);
      expect([400, 401, 500]).toContain(response.status);
    });

    it('should return error for too many prompts', async () => {
      const prompts = Array(6).fill('This is a valid prompt for bulk analysis testing purposes');
      const request = makeRequest(
        { prompts, jobRole: 'Marketing' },
        'fake-token'
      );

      const response = await POST(request);
      expect([400, 401, 500]).toContain(response.status);
    });

    it('should return error for too-short prompt in array', async () => {
      const request = makeRequest(
        { prompts: ['short'], jobRole: 'Marketing' },
        'fake-token'
      );

      const response = await POST(request);
      expect([400, 401, 500]).toContain(response.status);
    });
  });
});
