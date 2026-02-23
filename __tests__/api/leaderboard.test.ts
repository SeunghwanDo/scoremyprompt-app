/**
 * @jest-environment node
 */

let resolveData: { data: unknown; error: unknown };

const mockEq = jest.fn();
const mockFrom = jest.fn();

jest.mock('@/app/lib/supabase', () => ({
  getSupabaseAdmin: jest.fn(() => {
    // Thenable chain: all methods return `chain`, `await chain` resolves to `resolveData`
    const chain: Record<string, unknown> = {};
    chain.select = jest.fn().mockReturnValue(chain);
    chain.eq = mockEq.mockReturnValue(chain);
    chain.order = jest.fn().mockReturnValue(chain);
    chain.limit = jest.fn().mockReturnValue(chain);
    chain.then = (resolve: (v: unknown) => void) => resolve(resolveData);

    mockFrom.mockReturnValue(chain);
    return { from: mockFrom };
  }),
}));

import { GET } from '@/app/api/leaderboard/route';

function makeRequest(params: Record<string, string> = {}): Request {
  const url = new URL('http://localhost:3000/api/leaderboard');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new Request(url.toString());
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/leaderboard', () => {
  it('returns 200 with entries from database', async () => {
    resolveData = {
      data: [
        { rank: 1, overall_score: 95, grade: 'S', job_role: 'Marketing', prompt_preview: 'Test prompt...' },
      ],
      error: null,
    };

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.entries).toHaveLength(1);
    expect(json.entries[0].score).toBe(95);
    expect(json.entries[0].grade).toBe('S');
  });

  it('falls back to mock data on database error', async () => {
    resolveData = { data: null, error: { message: 'Connection failed' } };

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.entries.length).toBeGreaterThan(0);
  });

  it('filters by valid role parameter', async () => {
    resolveData = {
      data: [
        { rank: 1, overall_score: 90, grade: 'S', job_role: 'Design', prompt_preview: 'Design prompt...' },
      ],
      error: null,
    };

    const res = await GET(makeRequest({ role: 'Design' }));
    expect(res.status).toBe(200);

    // Verify eq was called with role filter
    expect(mockEq).toHaveBeenCalledWith('job_role', 'Design');
  });

  it('ignores invalid role parameter', async () => {
    resolveData = { data: [], error: null };

    const res = await GET(makeRequest({ role: 'InvalidRole' }));
    expect(res.status).toBe(200);

    // eq should NOT be called with invalid role
    const eqCalls = mockEq.mock.calls.filter(
      (call: unknown[]) => call[0] === 'job_role'
    );
    expect(eqCalls).toHaveLength(0);
  });
});
