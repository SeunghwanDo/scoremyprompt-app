import { z } from 'zod';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import { AppError, errorResponse } from '@/app/lib/errors';
import { logger } from '@/app/lib/logger';

const WaitlistSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  source: z.string().optional().default('unknown'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = WaitlistSchema.safeParse(body);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 'VALIDATION_ERROR', 400);
    }

    const { email, source } = parsed.data;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      logger.warn('Supabase not configured — waitlist signup skipped');
      return Response.json({ success: true, message: "You're on the list!", email: email.toLowerCase() }, { status: 200 });
    }

    const { error } = await supabase
      .from('waitlist')
      .upsert(
        { email: email.toLowerCase(), source },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      logger.error('Waitlist DB error', { error: error.message });
      throw new AppError('Failed to join waitlist. Please try again.', 'DB_ERROR', 500);
    }

    return Response.json({ success: true, message: "You're on the list!", email: email.toLowerCase() }, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    logger.error('Waitlist request error', { error: String(error) });
    return errorResponse(error as Error);
  }
}
