import { getSupabaseAdmin } from '@/app/lib/supabase';
import { AppError, errorResponse } from '@/app/lib/errors';
import { rateLimit, LIMITS } from '@/app/lib/rate-limit';

/**
 * GET /api/aq/certificate/[code]
 * Public verification lookup. Returns a deliberately narrow projection —
 * score, grade, domain scores, dates. Never user_id or ip hash.
 */

const CODE_RE = /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const rl = await rateLimit(request, LIMITS.READ);
  if (!rl.ok) return rl.response;

  try {
    const code = (params.code || '').toUpperCase();
    if (!CODE_RE.test(code)) {
      throw new AppError('인증 코드 형식이 올바르지 않습니다.', 'INVALID_CODE', 400);
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new AppError('서비스를 사용할 수 없습니다.', 'DB_NOT_CONFIGURED', 500);

    const { data, error } = await supabase
      .from('aq_certificates')
      .select('code, total_score, grade, domains, percentile, tested_at, issued_at')
      .eq('code', code)
      .maybeSingle();

    if (error) throw new AppError('조회에 실패했습니다.', 'LOOKUP_FAILED', 500);
    if (!data) {
      return Response.json({ valid: false, code }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }

    return Response.json(
      {
        valid: true,
        code: data.code,
        totalScore: data.total_score,
        grade: data.grade,
        domains: data.domains,
        percentile: data.percentile,
        testedAt: data.tested_at,
        issuedAt: data.issued_at,
      },
      { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600' } },
    );
  } catch (err) {
    return errorResponse(err as Error);
  }
}
