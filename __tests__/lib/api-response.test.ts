import { apiSuccess, apiPaginated, withApiHandler } from '@/app/lib/api-response';
import { AppError } from '@/app/lib/errors';
import { NextRequest } from 'next/server';

// Mock logger
jest.mock('@/app/lib/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

describe('API Response Helpers', () => {
  describe('apiSuccess', () => {
    it('wraps data in success envelope', async () => {
      const response = apiSuccess({ id: 1, name: 'test' });
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual({ id: 1, name: 'test' });
    });

    it('defaults to 200 status', () => {
      const response = apiSuccess('ok');
      expect(response.status).toBe(200);
    });

    it('accepts custom status', () => {
      const response = apiSuccess(null, { status: 201 });
      expect(response.status).toBe(201);
    });

    it('includes meta when provided', async () => {
      const response = apiSuccess([], { meta: { cached: true } });
      const body = await response.json();
      expect(body.meta).toEqual({ cached: true });
    });

    it('omits meta when not provided', async () => {
      const response = apiSuccess([]);
      const body = await response.json();
      expect(body.meta).toBeUndefined();
    });
  });

  describe('apiPaginated', () => {
    it('includes pagination info', async () => {
      const items = [{ id: 1 }, { id: 2 }];
      const response = apiPaginated(items, { page: 1, pageSize: 10, total: 25 });
      const body = await response.json();

      expect(body.success).toBe(true);
      expect(body.data).toEqual(items);
      expect(body.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      });
    });

    it('calculates hasNext and hasPrev correctly', async () => {
      const response = apiPaginated([], { page: 2, pageSize: 10, total: 25 });
      const body = await response.json();
      expect(body.pagination.hasNext).toBe(true);
      expect(body.pagination.hasPrev).toBe(true);
    });

    it('last page has no next', async () => {
      const response = apiPaginated([], { page: 3, pageSize: 10, total: 25 });
      const body = await response.json();
      expect(body.pagination.hasNext).toBe(false);
      expect(body.pagination.hasPrev).toBe(true);
    });
  });

  describe('withApiHandler', () => {
    function makeRequest(path = '/api/test') {
      return new NextRequest(new URL(path, 'http://localhost:3000'));
    }

    it('passes request to handler and returns response', async () => {
      const handler = withApiHandler(async () => {
        return apiSuccess({ ok: true });
      });

      const response = await handler(makeRequest());
      expect(response.status).toBe(200);
      expect(response.headers.get('x-request-id')).toBeTruthy();
    });

    it('catches AppError and returns formatted response', async () => {
      const handler = withApiHandler(async () => {
        throw new AppError('Not found', 'NOT_FOUND', 404);
      });

      const response = await handler(makeRequest());
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.code).toBe('NOT_FOUND');
    });

    it('catches unknown errors as 500', async () => {
      const handler = withApiHandler(async () => {
        throw new Error('Something broke');
      });

      const response = await handler(makeRequest());
      expect(response.status).toBe(500);
    });

    it('adds x-request-id to response', async () => {
      const handler = withApiHandler(async () => apiSuccess('ok'));
      const response = await handler(makeRequest());
      expect(response.headers.get('x-request-id')).toBeTruthy();
    });
  });
});
