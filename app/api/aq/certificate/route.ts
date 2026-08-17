import { createHash, randomInt } from 'crypto';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import { AppError, errorResponse } from '@/app/lib/errors';
import { logger } from '@/app/lib/logger';
import { rateLimit, LIMITS } from '@/app/lib/rate-limit';
import { AQ_CERTIFICATE_MIN_SCORE, AQ_MAX_SCORE } from '@/app/aq/constants';
import type { AQGrade } from '@/app/aq/types';

/**
 * POST /api/aq/certificate
 * Issues a verifiable AQ certificate: stores the result server-side and
 * returns a code the certificate page prints and /cert/[code] can look up.
 *
 * No login required (the test itself doesn't require it). Abuse controls:
 * strict rate limit + a hashed issuer IP kept for review only.
 *
 * Trust boundary note: the score arrives from the client (test runs in the
 * browser). This endpoint therefore certifies "a result with these numbers was
 * recorded on this date", not that the numbers are unforgeable — same trust
 * level as the client-side certificate had, but now the code actually resolves.
 * Moving scoring server-side is a separate ticket.
 */

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
const GRADES: readonly AQGrade[] = ['S', 'A', 'B', 'C', 'D'];
const DOMAINS = ['prompt', 'tool', 'ethics', 'concept'] as const;

function generateCode(): string {
  let code = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-';
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

function hashIp(request: Request): string | null {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (!ip) return null;
  return createHash('sha256').update(ip).digest('hex');
}

interface IssueBody {
  totalScore: number;
  grade: AQGrade;
  percentile?: number;
  domains: { domain: string; rawScore: number; weightedScore: number; grade: AQGrade }[];
  durationSeconds?: number;
  testedAt: string;
}

function validate(body: unknown): IssueBody {
  if (!body || typeof body !== 'object') throw new AppError('잘못된 요청입니다.', 'INVALID_BODY', 400);
  const b = body as Record<string, unknown>;

  const totalScore = Number(b.totalScore);
  if (!Number.isInteger(totalScore) || totalScore < 0 || totalScore > AQ_MAX_SCORE) {
    throw new AppError('점수가 올바르지 않습니다.', 'INVALID_SCORE', 400);
  }
  if (totalScore < AQ_CERTIFICATE_MIN_SCORE) {
    throw new AppError(`인증서는 ${AQ_CERTIFICATE_MIN_SCORE}점 이상부터 발급됩니다.`, 'BELOW_THRESHOLD', 400);
  }
  if (!GRADES.includes(b.grade as AQGrade)) {
    throw new AppError('등급이 올바르지 않습니다.', 'INVALID_GRADE', 400);
  }
  if (!Array.isArray(b.domains) || b.domains.length !== DOMAINS.length) {
    throw new AppError('영역 점수가 올바르지 않습니다.', 'INVALID_DOMAINS', 400);
  }
  const domains = b.domains.map((d) => {
    const dd = d as Record<string, unknown>;
    if (!DOMAINS.includes(dd.domain as (typeof DOMAINS)[number]) || !GRADES.includes(dd.grade as AQGrade)) {
      throw new AppError('영역 점수가 올바르지 않습니다.', 'INVALID_DOMAINS', 400);
    }
    const rawScore = Number(dd.rawScore);
    const weightedScore = Number(dd.weightedScore);
    if (!Number.isFinite(rawScore) || rawScore < 0 || rawScore > 100 || !Number.isFinite(weightedScore)) {
      throw new AppError('영역 점수가 올바르지 않습니다.', 'INVALID_DOMAINS', 400);
    }
    return { domain: dd.domain as string, rawScore, weightedScore, grade: dd.grade as AQGrade };
  });
  const testedAt = typeof b.testedAt === 'string' && !Number.isNaN(Date.parse(b.testedAt)) ? b.testedAt : null;
  if (!testedAt) throw new AppError('테스트 시각이 올바르지 않습니다.', 'INVALID_DATE', 400);

  const percentile = b.percentile == null ? undefined : Number(b.percentile);
  const durationSeconds = b.durationSeconds == null ? undefined : Number(b.durationSeconds);

  return {
    totalScore,
    grade: b.grade as AQGrade,
    percentile: percentile != null && Number.isFinite(percentile) ? Math.round(percentile) : undefined,
    domains,
    durationSeconds: durationSeconds != null && Number.isFinite(durationSeconds) ? Math.round(durationSeconds) : undefined,
    testedAt,
  };
}

export async function POST(request: Request) {
  const rl = await rateLimit(request, LIMITS.SUBMIT);
  if (!rl.ok) return rl.response;

  try {
    const body = validate(await request.json().catch(() => null));

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new AppError('서비스를 사용할 수 없습니다.', 'DB_NOT_CONFIGURED', 500);

    // Optional: attach user if a bearer token is present (not required)
    let userId: string | null = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const { data } = await supabase.auth.getUser(authHeader.substring(7));
      userId = data.user?.id ?? null;
    }

    // Retry on the (astronomically rare) code collision
    for (let attempt = 0; attempt < 3; attempt++) {
      const code = generateCode();
      const { error } = await supabase.from('aq_certificates').insert({
        code,
        total_score: body.totalScore,
        grade: body.grade,
        domains: body.domains,
        percentile: body.percentile ?? null,
        duration_seconds: body.durationSeconds ?? null,
        tested_at: body.testedAt,
        user_id: userId,
        issuer_ip_hash: hashIp(request),
      });
      if (!error) {
        return Response.json({ code, issuedAt: new Date().toISOString() }, { status: 201 });
      }
      if (error.code !== '23505') {
        logger.error('[aq/certificate] insert failed', { error: error.message });
        throw new AppError('인증서 발급에 실패했습니다.', 'INSERT_FAILED', 500);
      }
    }
    throw new AppError('인증서 코드 생성에 실패했습니다. 다시 시도해 주세요.', 'CODE_COLLISION', 500);
  } catch (err) {
    return errorResponse(err as Error);
  }
}
