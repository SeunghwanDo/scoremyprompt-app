/**
 * @jest-environment node
 */

const mockGetUser = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockGte = jest.fn();
const mockOrder = jest.fn();
const mockLimit = jest.fn();
const mockFrom = jest.fn();

jest.mock('@/app/lib/supabase', () => ({
  getSupabaseAdmin: jest.fn(() => {
    const chain = {
      select: mockSelect,
      eq: mockEq,
      gte: mockGte,
      order: mockOrder,
      limit: mockLimit,
    };

    // Each method returns the chain for chaining
    mockSelect.mockReturnValue(chain);
    mockEq.mockReturnValue(chain);
    mockGte.mockReturnValue(chain);
    mockOrder.mockReturnValue(chain);
    mockLimit.mockReturnValue(chain);
    mockFrom.mockReturnValue(chain);

    return {
      from: mockFrom,
      auth: { getUser: mockGetUser },
    };
  }),
}));

import { GET } from '@/app/api/dashboard/route';

function makeRequest(token?: string): Request {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return new Request('http://localhost:3000/api/dashboard', { headers });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/dashboard', () => {
  it('returns 401 without auth header', async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid' } });

    const res = await GET(makeRequest('invalid-token'));
    expect(res.status).toBe(401);
  });

  it('returns empty response for user with no analyses', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });

    // allAnalyses query returns empty array
    mockEq.mockResolvedValueOnce({ data: [], error: null });

    const res = await GET(makeRequest('valid-token'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.stats.totalAnalyses).toBe(0);
    expect(json.trend).toEqual([]);
    expect(json.recent).toEqual([]);
  });

  it('computes stats from analysis data', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });

    // allAnalyses query
    mockEq.mockResolvedValueOnce({
      data: [
        { overall_score: 80, grade: 'A', job_role: 'Marketing' },
        { overall_score: 60, grade: 'B', job_role: 'Marketing' },
        { overall_score: 90, grade: 'S', job_role: 'Design' },
      ],
      error: null,
    });

    // trend query
    mockOrder.mockResolvedValueOnce({ data: [], error: null });

    // recent query
    mockLimit.mockResolvedValueOnce({ data: [], error: null });

    const res = await GET(makeRequest('valid-token'));
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.stats.totalAnalyses).toBe(3);
    expect(json.stats.bestScore.value).toBe(90);
    expect(json.stats.bestScore.grade).toBe('S');
    expect(json.stats.averageScore).toBe(77);
    expect(json.stats.mostUsedRole).toBe('Marketing');
  });
});
