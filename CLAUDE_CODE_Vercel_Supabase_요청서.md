# ScoreMyPrompt - Vercel + Supabase 연동 요청서

> Phase F-1: 외부 연동 첫 단계
> Stripe, Anthropic API는 이번에 제외 — 별도 Phase F-2에서 진행
> 목표: Vercel 배포 + Supabase DB 연결 + Auth 플로우 정상 작동

---

## 사전 준비 (Luke이 직접 해야 할 것)

아래는 Claude Code가 아니라 직접 웹사이트에서 해야 합니다:

### A. Supabase 프로젝트 생성
1. https://supabase.com 접속 → 무료 계정 생성/로그인
2. "New Project" 클릭
3. 설정:
   - Name: `scoremyprompt`
   - Database Password: 안전한 비번 설정 (메모해두기)
   - Region: `US East (N. Virginia)` — Vercel iad1 리전과 동일
4. 프로젝트 생성 후 Settings > API에서 복사:
   - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
   - `anon public` 키 → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - `service_role` 키 → SUPABASE_SERVICE_ROLE_KEY (비밀!)

### B. Supabase Auth 설정
1. Authentication > Providers에서:
   - Email 활성화 (기본 ON)
   - Google OAuth 설정 (선택사항, 나중에 해도 됨)
2. Authentication > URL Configuration:
   - Site URL: `https://scoremyprompt.com` (또는 Vercel 임시 URL)
   - Redirect URLs에 추가:
     - `https://scoremyprompt.com/api/auth/callback`
     - `https://scoremyprompt-app.vercel.app/api/auth/callback` (Vercel 기본 도메인)
     - `http://localhost:3000/api/auth/callback` (로컬 개발)

### C. Vercel 프로젝트 생성
1. https://vercel.com 접속 → GitHub 연동
2. scoremyprompt-app 레포지토리 Import
3. 환경변수 입력 (Settings > Environment Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL = (A에서 복사)
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (A에서 복사)
   SUPABASE_SERVICE_ROLE_KEY = (A에서 복사)
   NEXT_PUBLIC_BASE_URL = https://scoremyprompt.com
   NEXT_PUBLIC_APP_URL = https://scoremyprompt.com
   ANTHROPIC_API_KEY = (있으면 입력, 없으면 mock 모드로 작동)
   ```

위 3가지가 완료되면 Claude Code 작업을 시작합니다.

---

## 🔴 CRITICAL: 버그 수정 (배포 전 반드시)

### 요청 1: Leaderboard API 쿼리 필드명 버그 수정

```
app/api/leaderboard/route.ts에 버그가 있어.

leaderboard_weekly 뷰의 실제 컬럼명과 코드의 select 필드가 불일치해.

schema.sql의 leaderboard_weekly 뷰 정의를 확인하고,
route.ts의 select 쿼리를 실제 뷰 컬럼명과 일치시켜줘.

예상 수정:
- 뷰에는 overall_score인데 코드에서 score로 접근하고 있을 수 있음
- display_name은 뷰에 없고 user_profiles 테이블에 있음
  → user_profiles JOIN이 필요하거나, prompt_preview 첫 부분을 대신 사용

뷰 컬럼 확인 후 정확한 필드명으로 수정하고,
빈 결과일 때도 빈 배열을 정상 반환하도록 해줘.
Supabase 없을 때(env 미설정) mock 데이터 fallback도 유지.
```

### 요청 2: Waitlist API 스키마 불일치 수정

```
app/api/waitlist/route.ts에서 joined_at 필드를 insert하는데,
supabase/schema.sql에는 joined_at이 없고 created_at만 있어.

수정:
1. insert 객체에서 joined_at 제거
   (created_at은 DB의 default now()가 자동 처리)
2. 또는 schema.sql에 joined_at 컬럼이 있는지 한번 더 확인하고,
   코드와 스키마를 일치시켜줘.

추가로 waitlist route 전체를 점검해서
다른 필드명 불일치가 없는지도 확인해줘.
```

### 요청 3: Export API 인증 수정

```
app/api/export/route.ts의 인증 로직에 버그가 있어.

현재 Bearer 토큰을 받아서 supabase.auth.admin.getUserById(token)으로
호출하는데, 토큰은 JWT이지 user ID가 아니야.

수정 방법:
1. Bearer 토큰(JWT)을 받으면 supabase.auth.getUser(token)으로 검증
   (admin.getUserById가 아닌 getUser)
2. 또는 토큰에서 user를 추출:
   const { data: { user }, error } = await supabase.auth.getUser(token);
3. user가 없거나 error면 401 반환
4. user.id로 해당 사용자의 analyses만 조회

middleware.ts에서 이미 인증 체크를 하고 있다면
route에서는 간소화된 검증만 해도 돼. 현재 middleware 상태도 확인해줘.
```

---

## 🟡 Supabase 연동 코드 정비

### 요청 4: Supabase 클라이언트 정리 및 환경변수 검증

```
Supabase 관련 코드를 정리해줘.

1. app/lib/supabase.ts (또는 해당 파일)에서
   클라이언트 초기화 코드를 확인하고 정리:

   // 서버용 클라이언트 (service_role key 사용, API routes에서만)
   export function createServerSupabase() {
     const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
     const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
     if (!url || !key) return null;  // 환경변수 없으면 null 반환
     return createClient(url, key);
   }

   // 브라우저용 클라이언트 (anon key 사용, 컴포넌트에서)
   export function createBrowserSupabase() {
     const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
     const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
     if (!url || !key) return null;
     return createClient(url, key);
   }

2. 모든 API route에서 Supabase를 사용하는 곳에
   null 체크를 추가:
   const supabase = createServerSupabase();
   if (!supabase) {
     // Supabase 미설정 시 mock 데이터 반환 또는 graceful skip
   }

3. 현재 코드에서 createClient를 직접 호출하는 곳이 있으면
   위 팩토리 함수로 통일해줘.
```

### 요청 5: 스키마 배포 스크립트 분리

```
supabase/schema.sql이 하나의 큰 파일인데,
Supabase SQL Editor에서 순서대로 실행할 수 있도록
단계별로 분리해줘.

supabase/ 폴더에:
1. 01_tables.sql — CREATE TABLE 문만 (analyses, waitlist, user_profiles)
2. 02_functions.sql — CREATE FUNCTION 문만 (generate_share_id, get_role_percentile, handle_new_user 등)
3. 03_triggers.sql — CREATE TRIGGER 문만
4. 04_views.sql — 뷰 및 materialized view
5. 05_rls.sql — ALTER TABLE ... ENABLE RLS + 모든 policy 문
6. 06_indexes.sql — CREATE INDEX 문
7. 00_run_all.sql — 위 파일들을 순서대로 \i 하는 마스터 파일
   (또는 각 파일 내용을 순서대로 합친 파일)

각 파일 상단에 주석으로 설명 추가:
-- ScoreMyPrompt Database Schema
-- Step 1: Tables
-- Run this in Supabase SQL Editor

기존 schema.sql은 삭제하지 말고 백업으로 유지.
```

### 요청 6: Auth Callback 안전성 강화

```
app/api/auth/callback/route.ts를 점검해줘.

확인/수정 사항:
1. code exchange 실패 시 에러 페이지로 리다이렉트 (현재 동작 확인)
2. redirectTo URL이 allowed list에 있는지 검증:
   const allowedRedirects = [
     process.env.NEXT_PUBLIC_APP_URL,
     'http://localhost:3000',
   ].filter(Boolean);

   // Open Redirect 방지
   const redirectTo = searchParams.get('redirectTo') || '/';
   const isAllowed = allowedRedirects.some(url =>
     redirectTo.startsWith(url!) || redirectTo.startsWith('/')
   );
   const safeRedirect = isAllowed ? redirectTo : '/';

3. 쿠키 설정에서 production 환경에서만 Secure 플래그:
   secure: process.env.NODE_ENV === 'production'

4. PKCE 플로우 지원 확인:
   Supabase의 exchangeCodeForSession이 PKCE를 사용하는지 확인하고,
   code_verifier 처리가 필요하면 추가.
```

### 요청 7: Rate Limiter Supabase 전환 준비

```
현재 app/api/analyze/route.ts의 in-memory Map 기반 rate limiter는
Vercel serverless에서 인스턴스 간 공유가 안 돼.

두 가지 옵션 중 하나로 구현해줘:

Option A (추천 — Supabase 활용):
Supabase의 analyses 테이블 기반으로 카운트:
  const today = new Date().toISOString().split('T')[0];
  const { count } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId || null)
    .eq('ip_hash', ipHash)
    .gte('created_at', `${today}T00:00:00Z`);

이러면 별도 rate limit 저장소 없이 실제 분석 횟수로 게이팅 가능.
gate.ts의 getGuestUsageCount가 이미 이 패턴이니까 통일.

Option B (Redis — 나중에):
Upstash Redis는 Phase F-2에서 필요 시 추가.

기존 in-memory limiter는 개발 환경 fallback으로 유지하되,
NEXT_PUBLIC_SUPABASE_URL이 있으면 Supabase 기반으로 전환해줘.
```

---

## 🟢 Vercel 배포 최적화

### 요청 8: 환경변수 검증 유틸 생성

```
app/lib/env.ts 파일을 새로 만들어줘.

앱 시작 시 필수 환경변수가 있는지 검증하는 유틸:

type EnvConfig = {
  // Required for DB
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  // Required for AI
  ANTHROPIC_API_KEY?: string;
  // Required for payment
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  // App URLs
  NEXT_PUBLIC_BASE_URL?: string;
  NEXT_PUBLIC_APP_URL?: string;
};

export function getEnvStatus() {
  return {
    supabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseAdmin: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    stripe: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  };
}

export function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env: ${name}`);
  return val;
}

그리고 각 API route에서 사용:
- analyze: getEnvStatus().anthropic 없으면 mock
- leaderboard, waitlist: getEnvStatus().supabase 없으면 mock
- stripe/*: getEnvStatus().stripe 없으면 503 반환

개발 환경에서는 console.warn으로 누락된 환경변수를 알려주고,
production에서는 silent하게 처리.
```

### 요청 9: Vercel 빌드 최적화

```
next.config.js에 Vercel 배포 최적화를 추가해줘:

1. 이미지 최적화 도메인 추가:
   images: {
     domains: [],  // 외부 이미지 사용 시 추가
     formats: ['image/avif', 'image/webp'],
   },

2. 번들 분석 (개발용):
   package.json에 추가:
   "@next/bundle-analyzer": "^14.0.0" (devDependencies)

   next.config.js:
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });
   module.exports = withBundleAnalyzer(nextConfig);

   scripts에 추가:
   "analyze": "ANALYZE=true next build"

3. 서버리스 함수 리전 최적화:
   vercel.json의 regions를 확인하고 iad1 유지 (Supabase와 같은 리전).

4. Edge Runtime 검토:
   analyze, leaderboard 같은 자주 호출되는 API는
   export const runtime = 'edge';를 추가할 수 있는지 검토.
   단, Supabase 서버 클라이언트가 Edge에서 동작하는지 확인 필요.
   동작하면 edge로 전환, 안 하면 nodejs 유지.
```

### 요청 10: 배포 전 빌드 검증 스크립트

```
package.json의 scripts에 배포 전 검증 스크립트를 추가해줘:

"scripts": {
  ...기존,
  "prebuild": "node scripts/check-env.js",
  "typecheck": "tsc --noEmit",
  "verify": "npm run typecheck && npm run lint && npm run build",
  "deploy:check": "npm run verify && echo 'Ready to deploy!'"
}

scripts/check-env.js 파일 생성:
- 필수 환경변수 존재 확인
- 없는 것들은 WARNING으로 표시 (빌드는 막지 않음)
- 출력 예:
  ✅ NEXT_PUBLIC_SUPABASE_URL: Set
  ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Set
  ⚠️ ANTHROPIC_API_KEY: Not set (mock mode)
  ⚠️ STRIPE_SECRET_KEY: Not set (payments disabled)
  ✅ NEXT_PUBLIC_BASE_URL: Set

WARNING만 있으면 빌드 진행, ERROR가 있으면 빌드 중단.
(현재 시점에서는 전부 WARNING 처리 — Supabase/Stripe 없어도 빌드 가능하도록)
```

---

## 🔵 추가 안전장치

### 요청 11: Supabase 연결 테스트 엔드포인트

```
app/api/health/route.ts를 새로 만들어줘.

배포 후 연결 상태를 확인할 수 있는 health check 엔드포인트:

GET /api/health 응답:
{
  "status": "ok",
  "timestamp": "2026-02-23T...",
  "services": {
    "supabase": { "connected": true, "latency_ms": 45 },
    "anthropic": { "configured": true },
    "stripe": { "configured": false }
  },
  "version": "1.0.0",
  "environment": "production"
}

Supabase 연결 테스트:
- 간단한 쿼리 실행 (SELECT 1) 후 latency 측정
- 실패 시 { "connected": false, "error": "Connection timeout" }

Anthropic은 키 존재만 확인 (API 호출은 하지 않음).
Stripe도 키 존재만 확인.

production에서는 서비스 상세 정보 숨기기:
API_KEY가 있으면 true만, 실제 키값은 절대 노출 안 함.

robots.ts에 /api/health도 disallow 추가.
```

### 요청 12: 에러 로깅 유틸 강화

```
app/lib/logger.ts를 새로 만들어줘.

production에서 구조화된 로그를 남기는 간단한 유틸:

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
}

export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
};

Vercel은 console.log를 자동으로 캡처하니까
JSON 형태로 찍어두면 Vercel Dashboard > Logs에서 필터링 가능.

주요 API route (analyze, leaderboard, waitlist, auth/callback)에서
기존 console.log/error를 logger로 교체해줘.
```

---

## 실행 순서 권장

| 순서 | 요청 # | 작업 | 예상 시간 | 비고 |
|------|--------|------|-----------|------|
| 1 | #1 | Leaderboard 쿼리 버그 | 15분 | 🔴 배포 차단 |
| 2 | #2 | Waitlist 스키마 불일치 | 10분 | 🔴 배포 차단 |
| 3 | #3 | Export API 인증 수정 | 15분 | 🔴 배포 차단 |
| 4 | #4 | Supabase 클라이언트 정리 | 20분 | 🟡 안정성 |
| 5 | #8 | 환경변수 검증 유틸 | 20분 | 🟡 DX |
| 6 | #6 | Auth callback 안전성 | 15분 | 🟡 보안 |
| 7 | #5 | 스키마 파일 분리 | 20분 | 🟡 배포 편의 |
| 8 | #7 | Rate limiter 전환 준비 | 30분 | 🟢 프로덕션 |
| 9 | #12 | Logger 유틸 생성 | 20분 | 🟢 운영 |
| 10 | #10 | 빌드 검증 스크립트 | 15분 | 🟢 CI/CD |
| 11 | #11 | Health check 엔드포인트 | 15분 | 🔵 모니터링 |
| 12 | #9 | Vercel 빌드 최적화 | 20분 | 🔵 성능 |

총 예상: 약 3.5시간

---

## 배포 플로우 (코드 작업 완료 후)

```
1. GitHub에 push
2. Vercel에서 자동 빌드 시작
3. 빌드 성공 확인
4. Supabase SQL Editor에서 스키마 실행:
   - 01_tables.sql
   - 02_functions.sql
   - 03_triggers.sql
   - 04_views.sql
   - 05_rls.sql
   - 06_indexes.sql
5. /api/health 접속해서 연결 상태 확인
6. 홈페이지에서 프롬프트 분석 테스트 (mock 모드)
7. Auth 플로우 테스트 (Magic Link)
8. 완료!
```
