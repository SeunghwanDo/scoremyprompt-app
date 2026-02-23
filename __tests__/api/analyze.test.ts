/**
 * @jest-environment node
 */

/**
 * API Route Tests: /api/analyze
 * Tests mock mode response, validation, and error cases
 */

// Import the route handler directly
import { POST } from '@/app/api/analyze/route';

function makeRequest(body: Record<string, unknown>, ip = '127.0.0.1') {
  return new Request('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

describe('/api/analyze', () => {
  describe('Mock Mode (no ANTHROPIC_API_KEY)', () => {
    it('should return 200 with valid mock result', async () => {
      const request = makeRequest({
        prompt: 'Write me a marketing plan for Q1 targeting small businesses with 10-50 employees',
        jobRole: 'Marketing',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('overallScore');
      expect(data).toHaveProperty('grade');
      expect(data).toHaveProperty('dimensions');
      expect(data).toHaveProperty('strengths');
      expect(data).toHaveProperty('improvements');
      expect(data).toHaveProperty('rewriteSuggestion');
      expect(data).toHaveProperty('jobRole', 'Marketing');
      expect(data).toHaveProperty('benchmarks');
    });

    it('should return valid score ranges', async () => {
      const request = makeRequest({
        prompt: 'Create a detailed product roadmap for our SaaS application with milestones',
        jobRole: 'Product',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.overallScore).toBeGreaterThanOrEqual(0);
      expect(data.overallScore).toBeLessThanOrEqual(100);
      expect(['S', 'A', 'B', 'C', 'D']).toContain(data.grade);
    });

    it('should return 6 dimension scores', async () => {
      const request = makeRequest({
        prompt: 'You are an expert data analyst. Analyze quarterly revenue trends and forecast next year growth.',
        jobRole: 'Finance',
      });

      const response = await POST(request);
      const data = await response.json();
      const dims = data.dimensions;

      expect(dims).toHaveProperty('precision');
      expect(dims).toHaveProperty('role');
      expect(dims).toHaveProperty('outputFormat');
      expect(dims).toHaveProperty('missionContext');
      expect(dims).toHaveProperty('promptStructure');
      expect(dims).toHaveProperty('tailoring');
    });
  });

  describe('Validation (Zod)', () => {
    it('should reject prompt shorter than 10 characters', async () => {
      const request = makeRequest({ prompt: 'Hi', jobRole: 'Marketing' });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should reject missing prompt field', async () => {
      const request = makeRequest({ jobRole: 'Marketing' });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should reject invalid jobRole', async () => {
      const request = makeRequest({
        prompt: 'Write me a comprehensive marketing plan for Q1',
        jobRole: 'InvalidRole',
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should accept all valid job roles', async () => {
      const roles = ['Marketing', 'Design', 'Product', 'Finance', 'Freelance', 'Engineering', 'Other'];

      for (let i = 0; i < roles.length; i++) {
        const request = makeRequest(
          { prompt: 'Write me a comprehensive plan for our project with clear milestones', jobRole: roles[i] },
          `10.0.0.${i + 1}`,
        );
        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });
  });
});
