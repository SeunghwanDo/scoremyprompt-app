/**
 * @jest-environment node
 */

import { AppError, errorResponse } from '@/app/lib/errors';

describe('AppError', () => {
  it('creates error with message, code, and status', () => {
    const err = new AppError('Not found', 'NOT_FOUND', 404);
    expect(err.message).toBe('Not found');
    expect(err.code).toBe('NOT_FOUND');
    expect(err.status).toBe(404);
    expect(err).toBeInstanceOf(Error);
  });

  it('defaults to status 400', () => {
    const err = new AppError('Bad input', 'VALIDATION_ERROR');
    expect(err.status).toBe(400);
  });

  it('accepts optional details', () => {
    const details = { field: 'email', reason: 'invalid' };
    const err = new AppError('Validation failed', 'VALIDATION_ERROR', 400, details);
    expect(err.details).toEqual(details);
  });
});

describe('errorResponse', () => {
  it('returns proper JSON response for AppError', async () => {
    const err = new AppError('Rate limit exceeded', 'RATE_LIMIT', 429);
    const res = errorResponse(err);

    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toBe('Rate limit exceeded');
    expect(json.code).toBe('RATE_LIMIT');
  });

  it('includes details when present in AppError', async () => {
    const err = new AppError('Validation failed', 'VALIDATION_ERROR', 400, { field: 'prompt' });
    const res = errorResponse(err);

    const json = await res.json();
    expect(json.details).toEqual({ field: 'prompt' });
  });

  it('returns 500 for generic Error', async () => {
    const err = new Error('Something broke');
    const res = errorResponse(err);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Internal server error');
    expect(json.code).toBe('INTERNAL_ERROR');
  });
});
