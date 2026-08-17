import type { Metadata } from 'next';
import Link from 'next/link';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import { AQ_GRADE_CONFIG, AQ_DOMAIN_META, AQ_MAX_SCORE } from '../../constants';
import type { AQGrade, AQDomain } from '../../types';

/**
 * aq.ai.kr/cert/[code] — public certificate verification.
 * Server component: looks the code up with the service role and renders a
 * narrow projection (score/grade/domains/dates). Never user_id or ip hash.
 * The URL is printed on every issued certificate, so this page must exist
 * and answer honestly (valid / not found) — that's the whole point.
 */

export const dynamic = 'force-dynamic';

const CODE_RE = /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

interface CertRow {
  code: string;
  total_score: number;
  grade: AQGrade;
  domains: { domain: AQDomain; rawScore: number; weightedScore: number; grade: AQGrade }[];
  percentile: number | null;
  tested_at: string;
  issued_at: string;
}

async function lookup(code: string): Promise<CertRow | null | 'unavailable'> {
  if (!CODE_RE.test(code)) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return 'unavailable';
  const { data, error } = await supabase
    .from('aq_certificates')
    .select('code, total_score, grade, domains, percentile, tested_at, issued_at')
    .eq('code', code)
    .maybeSingle();
  if (error) return 'unavailable';
  return (data as CertRow | null) ?? null;
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const code = params.code.toUpperCase();
  return {
    title: `AQ 인증서 확인 — ${code}`,
    description: 'AQ(AI Quotient) 인증서의 진위를 인증 코드로 확인합니다.',
    robots: { index: false, follow: false },
    alternates: { canonical: `https://aq.ai.kr/cert/${code}` },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default async function AQCertVerifyPage({ params }: { params: { code: string } }) {
  const code = params.code.toUpperCase();
  const cert = await lookup(code);

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      <nav className="border-b border-border backdrop-blur-sm sticky top-0 z-50 bg-dark/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/aq" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">AQ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">AQ</h1>
              <p className="text-[10px] text-gray-500 leading-tight">AI Quotient</p>
            </div>
          </Link>
          <span className="text-sm text-gray-400">인증서 확인</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-gray-500 text-xs mb-1">인증 코드</p>
        <p className="text-white font-mono text-2xl font-bold tracking-wider mb-8">{code}</p>

        {cert === 'unavailable' ? (
          <div className="card border-yellow-500/30 py-8 text-center">
            <p className="text-yellow-300 font-semibold">지금은 확인할 수 없습니다</p>
            <p className="text-gray-400 text-sm mt-2">잠시 후 다시 시도해 주세요.</p>
          </div>
        ) : cert === null ? (
          <div className="card border-red-500/30 py-8 text-center">
            <p className="text-red-300 font-semibold text-lg">등록되지 않은 인증 코드입니다</p>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              이 코드로 발급된 AQ 인증서가 없습니다. 코드를 다시 확인하거나,
              인증서 소지자에게 원본 이미지를 요청하세요.
            </p>
            <p className="text-gray-600 text-xs mt-4">
              2026-08-17 이전에 발급된 인증서의 코드는 서버에 기록되지 않아 확인이 불가능합니다.
            </p>
          </div>
        ) : (
          <>
            <div className="card border-green-500/30 py-8 text-center mb-6">
              <p className="text-green-300 font-semibold text-lg">✓ 유효한 AQ 인증서입니다</p>
              <div className="mt-6 flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-white">{cert.total_score}</span>
                <span className="text-gray-500">/ {AQ_MAX_SCORE}</span>
              </div>
              <p className="mt-2 text-xl font-semibold" style={{ color: AQ_GRADE_CONFIG[cert.grade].color }}>
                {AQ_GRADE_CONFIG[cert.grade].label}등급 · {AQ_GRADE_CONFIG[cert.grade].title}
              </p>
              <p className="text-gray-500 text-xs mt-3">
                측정 {formatDate(cert.tested_at)} · 발급 {formatDate(cert.issued_at)}
              </p>
            </div>

            <div className="card py-5">
              <p className="text-gray-400 text-xs mb-3">영역별 점수 (원점수 0~100)</p>
              <ul className="space-y-2">
                {cert.domains.map((d) => {
                  const meta = AQ_DOMAIN_META[d.domain];
                  return (
                    <li key={d.domain} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        {meta?.icon} {meta?.label ?? d.domain}
                      </span>
                      <span className="text-white font-mono">
                        {Math.round(d.rawScore)} <span className="text-gray-500">· {d.grade}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="text-gray-600 text-[11px] mt-6 leading-relaxed">
              이 페이지는 해당 코드로 기록된 측정 결과가 존재함을 확인합니다. AQ 측정은
              브라우저에서 진행되며 응시자 본인 확인 절차는 포함하지 않습니다.
            </p>
          </>
        )}

        <div className="mt-8 text-center">
          <Link href="/aq" className="text-sm text-purple-300 hover:text-purple-200">
            나도 AQ 측정하기 →
          </Link>
        </div>
      </div>
    </main>
  );
}
