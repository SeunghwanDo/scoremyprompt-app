/**
 * Standardized API response helpers
 *
 * Usage:
 *   import { apiSuccess, apiPaginated, withApiHandler } from '@/app/lib/api-response';
 *
 *   // Simple success
 *   return apiSuccess(data);
 *
 *   // Paginated
 *   return apiPaginated(items, { page: 1, pageSize: 20, total: 100 });
 *
 *   // Wrapped handler with automatic error handling
 *   export const GET = withApiHandler(async (req) => { ... });
 */

import { NextRequest } from 'next/server';
import { errorResponse, AppError } from './errors';
import { logger } from './logger';
import type { CachePreset } from './cache';

/** Standard success response envelope */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

/** Standard paginated response */
export interface ApiPaginatedResponse<T = unknown> extends ApiSuccessResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/** Standard error response envelope */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: unknown;
}

/**
 * Return a successful JSON response
 */
export function apiSuccess<T>(
  data: T,
  options: {
    status?: number;
    headers?: HeadersInit | CachePreset;
    meta?: Record<string, unknown>;
  } = {}
): Response {
  const { status = 200, headers = {}, meta } = options;
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (meta) body.meta = meta;

  return Response.json(body, { status, headers });
}

/**
 * Return a paginated JSON response
 */
export function apiPaginated<T>(
  items: T[],
  pagination: { page: number; pageSize: number; total: number },
  options: { headers?: HeadersInit | CachePreset } = {}
): Response {
  const { page, pageSize, total } = pagination;
  const totalPages = Math.ceil(total / pageSize);

  const body: ApiPaginatedResponse<T> = {
    success: true,
    data: items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };

  return Response.json(body, { headers: options.headers });
}

type ApiHandler = (req: NextRequest, context?: { params?: Record<string, string> }) => Promise<Response>;

/**
 * Wrap an API route handler with consistent error handling and request logging
 */
export function withApiHandler(handler: ApiHandler): ApiHandler {
  return async (req, context) => {
    const start = Date.now();
    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    try {
      const response = await handler(req, context);

      logger.info('API request completed', {
        method: req.method,
        url: req.nextUrl.pathname,
        status: response.status,
        duration: Date.now() - start,
        requestId,
      });

      // Inject request ID into response headers
      const headers = new Headers(response.headers);
      headers.set('x-request-id', requestId);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      const duration = Date.now() - start;

      if (error instanceof AppError) {
        logger.warn('API error', {
          method: req.method,
          url: req.nextUrl.pathname,
          code: error.code,
          status: error.status,
          duration,
          requestId,
        });
      } else {
        logger.error('Unhandled API error', {
          method: req.method,
          url: req.nextUrl.pathname,
          error: error instanceof Error ? error.message : String(error),
          duration,
          requestId,
        });
      }

      const response = errorResponse(error instanceof Error ? error : new Error(String(error)));
      const headers = new Headers(response.headers);
      headers.set('x-request-id', requestId);

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
  };
}
