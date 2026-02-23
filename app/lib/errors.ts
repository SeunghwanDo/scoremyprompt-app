export class AppError extends Error {
  public code: string;
  public status: number;
  public details?: unknown;

  constructor(message: string, code: string, status: number = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function errorResponse(error: AppError | Error) {
  if (error instanceof AppError) {
    return Response.json(
      { error: error.message, code: error.code, ...(error.details ? { details: error.details } : {}) },
      { status: error.status }
    );
  }
  console.error('Unhandled error:', error);
  return Response.json(
    { error: 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  );
}
