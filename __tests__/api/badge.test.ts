/**
 * @jest-environment node
 */

/**
 * API Route Tests: /api/badge
 * Tests badge image generation with various parameters
 */

import { GET } from '@/app/api/badge/route';

function makeRequest(params: Record<string, string>) {
  const url = new URL('http://localhost:3000/api/badge');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new Request(url.toString());
}

describe('/api/badge', () => {
  it('should return 200 with valid score and grade', async () => {
    const request = makeRequest({ score: '85', grade: 'A' });
    const response = await GET(request);
    expect(response.status).toBe(200);

    const contentType = response.headers.get('content-type');
    expect(contentType).toContain('image');
  });

  it('should handle S grade', async () => {
    const request = makeRequest({ score: '95', grade: 'S' });
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it('should handle D grade', async () => {
    const request = makeRequest({ score: '20', grade: 'D' });
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it('should handle score of 0', async () => {
    const request = makeRequest({ score: '0', grade: 'D' });
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it('should handle score of 100', async () => {
    const request = makeRequest({ score: '100', grade: 'S' });
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it('should set cache headers', async () => {
    const request = makeRequest({ score: '75', grade: 'B' });
    const response = await GET(request);
    const cacheControl = response.headers.get('cache-control');
    // Badge images should be cached
    if (cacheControl) {
      expect(cacheControl).toContain('public');
    }
  });
});
