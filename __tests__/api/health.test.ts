/**
 * @jest-environment node
 */

const mockSelect = jest.fn();
const mockLimit = jest.fn();
const mockFrom = jest.fn();

jest.mock('@/app/lib/supabase', () => ({
  getSupabaseAdmin: jest.fn(() => {
    const chain = {
      select: mockSelect,
      limit: mockLimit,
    };

    mockSelect.mockReturnValue(chain);
    mockLimit.mockReturnValue(chain);
    mockFrom.mockReturnValue(chain);

    return { from: mockFrom };
  }),
}));

jest.mock('@/app/lib/env', () => ({
  getEnvStatus: jest.fn(() => ({
    supabase: true,
    supabaseAdmin: true,
    anthropic: true,
    stripe: true,
    baseUrl: 'http://localhost:3000',
  })),
}));

import { GET } from '@/app/api/health/route';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/health', () => {
  it('returns 200 when all services are ok', async () => {
    mockLimit.mockResolvedValueOnce({ error: null });

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('ok');
    expect(json.timestamp).toBeDefined();
  });

  it('includes service details in non-production', async () => {
    mockLimit.mockResolvedValueOnce({ error: null });

    const res = await GET();
    const json = await res.json();

    // In test environment, should include version/environment
    expect(json.services).toBeDefined();
  });

  it('returns degraded when supabase connection fails', async () => {
    mockLimit.mockResolvedValueOnce({ error: { message: 'Connection refused' } });

    const res = await GET();
    const json = await res.json();
    expect(json.status).toBe('degraded');
  });
});
