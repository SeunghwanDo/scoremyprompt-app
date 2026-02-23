import { NextRequest } from 'next/server';

const GRADE_COLORS: Record<string, string> = {
  S: '#10B981',
  A: '#3B82F6',
  B: '#8B5CF6',
  C: '#F59E0B',
  D: '#EF4444',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const score = Math.min(100, Math.max(0, parseInt(searchParams.get('score') || '0', 10)));
  const grade = searchParams.get('grade') || 'B';
  const gradeLabel = searchParams.get('gradeLabel') || `${grade}-Tier`;
  const gradeColor = GRADE_COLORS[grade] || GRADE_COLORS.B;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.com';

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0f172a;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:80px}
.badge{display:flex;align-items:center;gap:12px;padding:12px 16px;background:linear-gradient(135deg,#1e293b,#0f172a);border:1px solid #334155;border-radius:12px;text-decoration:none;color:#f8fafc;transition:border-color .2s}
.badge:hover{border-color:${gradeColor}}
.score{font-size:28px;font-weight:800;color:${gradeColor};line-height:1}
.info{display:flex;flex-direction:column;gap:2px}
.grade{font-size:12px;font-weight:600;color:${gradeColor}}
.label{font-size:11px;color:#94a3b8}
.brand{font-size:10px;color:#64748b}
</style>
</head>
<body>
<a class="badge" href="${baseUrl}" target="_blank" rel="noopener noreferrer">
  <div class="score">${score}</div>
  <div class="info">
    <span class="grade">${gradeLabel}</span>
    <span class="label">PROMPT Score</span>
    <span class="brand">scoremyprompt.com</span>
  </div>
</a>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Frame-Options': 'ALLOWALL',
    },
  });
}
