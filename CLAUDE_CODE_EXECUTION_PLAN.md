# ScoreMyPrompt — Claude Code 실행 계획 v2

> **전략 변경**: 외부 연동(Vercel, Supabase, Stripe, API)은 마지막에 진행.
> 먼저 코드 품질, UX, 디자인, 보안, 성능, SEO, 마케팅 작업을 완료한다.

---

## 실행 순서 총괄

| Phase | 내용 | 예상 공수 | 병렬 가능 |
|-------|------|----------|----------|
| **Phase A** | 코드 기반 정비 (타입, 에러, 보안) | ~12시간 | 일부 가능 |
| **Phase B** | UX/디자인 개선 | ~11시간 | 대부분 가능 |
| **Phase C** | 성능 + SEO 최적화 | ~10시간 | 대부분 가능 |
| **Phase D** | 마케팅 기능 구현 | ~9시간 | 일부 가능 |
| **Phase E** | 테스트 작성 | ~10시간 | Phase A 이후 |
| **Phase F** | 외부 연동 (마지막) | ~14시간 | 순차 진행 |

---

## Phase A: 코드 기반 정비 (최우선)

### A-1. TypeScript 기반 세팅 (병렬 불가 — 다른 작업의 기반)

```bash
# 1. tsconfig.json 생성
npx tsc --init --strict --jsx preserve --module esnext --target es2017 --moduleResolution bundler --allowJs --noEmit

# 2. 타입 정의 파일 생성
mkdir -p app/types
```

**`app/types/index.ts`** 생성:
```typescript
// PROMPT Score 관련 타입
export interface DimensionScore {
  precision: number;     // 0-20
  role: number;          // 0-15
  outputFormat: number;  // 0-15
  missionContext: number;// 0-20
  promptStructure: number;// 0-15
  tailoring: number;     // 0-15
}

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface AnalysisResult {
  totalScore: number;
  grade: Grade;
  dimensions: DimensionScore;
  feedback: string;
  rewriteSuggestion?: string;
  jobRole: string;
  timestamp: string;
}

export type Tier = 'guest' | 'free' | 'pro';

export interface UserProfile {
  id: string;
  email?: string;
  tier: Tier;
  stripeCustomerId?: string;
  dailyAnalysisCount: number;
  bestScore: number;
}

export interface GateCheck {
  allowed: boolean;
  remaining: number;
  limit: number;
  tier: Tier;
  visibleDimensions: number;
}

export type JobRole = 'Marketing' | 'Design' | 'Product' | 'Finance' | 'Freelance' | 'Engineering' | 'Other';

export interface APIErrorResponse {
  error: string;
  code: string;
  details?: unknown;
}

// Grade config
export const GRADE_CONFIG: Record<Grade, { min: number; color: string; label: string; emoji: string; message: string }> = {
  S: { min: 90, color: '#10B981', label: 'S-Tier', emoji: '🏆', message: 'Prompt Master! Exceptional quality.' },
  A: { min: 80, color: '#3B82F6', label: 'A-Tier', emoji: '⭐', message: 'Great job! Minor tweaks possible.' },
  B: { min: 65, color: '#8B5CF6', label: 'B-Tier', emoji: '👍', message: 'Good foundation. Room to grow.' },
  C: { min: 50, color: '#F59E0B', label: 'C-Tier', emoji: '💡', message: 'Has potential. Key areas need work.' },
  D: { min: 0,  color: '#EF4444', label: 'D-Tier', emoji: '📝', message: 'Just getting started. Let\'s improve!' },
};

export const DIMENSION_META = {
  precision:      { label: 'Precision',        letter: 'P', maxScore: 20 },
  role:           { label: 'Role',             letter: 'R', maxScore: 15 },
  outputFormat:   { label: 'Output Format',    letter: 'O', maxScore: 15 },
  missionContext: { label: 'Mission Context',  letter: 'M', maxScore: 20 },
  promptStructure:{ label: 'Prompt Structure', letter: 'P', maxScore: 15 },
  tailoring:      { label: 'Tailoring',        letter: 'T', maxScore: 15 },
} as const;

export const JOB_ROLES: JobRole[] = ['Marketing', 'Design', 'Product', 'Finance', 'Freelance', 'Engineering', 'Other'];
```

### A-2. lib/ 파일 TypeScript 전환

순서: `types/index.ts` → `lib/gate.ts` → `lib/auth.ts` → `lib/analytics.ts` → `lib/supabase.ts`

각 파일에 타입 import 추가하고, 함수 시그니처에 타입 적용.

### A-3. API route TypeScript 전환

순서: `api/analyze/route.ts` → `api/stripe/*/route.ts` → 나머지

- **핵심**: `analyze/route.ts`에서 Zod 스키마 검증 추가

```bash
npm install zod
```

```typescript
// api/analyze/route.ts 상단에 추가
import { z } from 'zod';

const AnalyzeRequestSchema = z.object({
  prompt: z.string().min(10).max(5000),
  jobRole: z.enum(['Marketing', 'Design', 'Product', 'Finance', 'Freelance', 'Engineering', 'Other']),
});
```

### A-4. Error Boundary 추가 (병렬 가능)

**`app/error.js`** 생성:
```jsx
'use client';
export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl p-8 max-w-md text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-slate-400 mb-6">{error?.message || 'An unexpected error occurred.'}</p>
        <button onClick={reset} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Try Again
        </button>
      </div>
    </div>
  );
}
```

**`app/not-found.js`** 생성:
```jsx
import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">404</div>
        <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
}
```

### A-5. Security Headers (병렬 가능)

**`next.config.js`** 에 추가:
```javascript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};
```

### A-6. API 에러 응답 표준화

**`app/lib/errors.ts`** 생성:
```typescript
export class AppError extends Error {
  constructor(public message: string, public code: string, public status: number = 400, public details?: unknown) {
    super(message);
  }
}

export function errorResponse(error: AppError | Error) {
  if (error instanceof AppError) {
    return Response.json({ error: error.message, code: error.code, details: error.details }, { status: error.status });
  }
  return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, { status: 500 });
}
```

### A-7. Constants 중앙화 (병렬 가능)

**`app/constants/index.ts`** — GRADE_CONFIG, JOB_ROLES, DIMENSION_META를 types/index.ts에서 export하되, 각 컴포넌트에서 중복 정의된 것들을 이 중앙 파일의 import로 교체.

### A-8. System Prompt 분리

**`app/constants/system-prompt.ts`** — analyze/route.js 내부의 PROMPT_SCORE_SYSTEM 상수를 별도 파일로 분리. 버전 관리 가능하게.

---

## Phase B: UX/디자인 개선

### B-1. 모바일 반응형 (P0)

**page.js (Landing)**:
- textarea: `min-h-[200px]` + `text-base` (모바일 오토줌 방지, 16px 이상)
- Job role selector: 모바일에서 2열 그리드
- Submit 버튼: 모바일에서 full-width

**result/page.js**:
- DimensionBar: 모바일에서 세로 스택 (`flex-col` on `sm:` breakpoint)
- ScoreCircle: 모바일에서 크기 축소 (width/height 150px → 120px)
- Share 버튼: 하단 고정 (`fixed bottom-0`)

### B-2. 분석 로딩 UX (P0)

**Skeleton UI 컴포넌트** `app/components/AnalysisLoading.jsx`:
```jsx
'use client';
import { useState, useEffect } from 'react';

const STEPS = [
  { label: 'Reading your prompt...', duration: 1500 },
  { label: 'Analyzing 6 dimensions...', duration: 3000 },
  { label: 'Calculating PROMPT Score...', duration: 2000 },
  { label: 'Generating feedback...', duration: 2000 },
];

const TIPS = [
  'Did you know? 85% of top-scoring prompts include a specific Role.',
  'Pro tip: Adding output format can boost your score by 15 points.',
  'Fun fact: The average prompt scores 62 points. Can you beat it?',
  'Tip: Context-rich prompts score 2x higher on Mission Context.',
];

export default function AnalysisLoading() {
  const [step, setStep] = useState(0);
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);

  useEffect(() => {
    const timers = STEPS.map((s, i) =>
      setTimeout(() => setStep(i), STEPS.slice(0, i).reduce((a, b) => a + b.duration, 0))
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-6 animate-pulse">
      {/* Step progress */}
      <div className="space-y-3">
        {STEPS.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 transition-opacity ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-700 text-slate-500'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-sm ${i === step ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Skeleton result preview */}
      <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
        <div className="h-20 w-20 mx-auto rounded-full bg-slate-700 animate-pulse" />
        <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 bg-slate-700 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-blue-300 text-sm">💡 {tip}</p>
      </div>
    </div>
  );
}
```

### B-3. Design Token (병렬 가능)

**`app/styles/tokens.css`**:
```css
:root {
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-bg: #0F172A;
  --color-surface: #1E293B;
  --color-surface-hover: #334155;
  --color-text: #F8FAFC;
  --color-text-muted: #94A3B8;
  --color-border: #334155;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.3);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.4);
}
```

### B-4. 버튼 스타일 통일 (병렬 가능)

**`app/components/Button.jsx`**:
```jsx
const VARIANTS = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white',
  ghost: 'text-slate-400 hover:text-white hover:bg-slate-800',
};
const SIZES = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export default function Button({ variant = 'primary', size = 'md', children, className = '', ...props }) {
  return (
    <button className={`font-medium transition-all ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
```

### B-5. 결과 페이지 감정적 피드백 (병렬 가능)

result/page.js 수정:
- 등급별 이모지/메시지: GRADE_CONFIG에서 가져오기
- 차원별 한줄 코멘트:
```javascript
const DIMENSION_FEEDBACK = {
  precision:      { low: 'Be more specific about what you want.', high: 'Crystal clear instructions!' },
  role:           { low: 'Try adding a specific role (e.g., "Act as a...").', high: 'Great role definition!' },
  outputFormat:   { low: 'Specify the desired output format.', high: 'Output format is well defined!' },
  missionContext: { low: 'Add more context about your goal.', high: 'Excellent context provided!' },
  promptStructure:{ low: 'Structure your prompt with clear sections.', high: 'Well-structured prompt!' },
  tailoring:      { low: 'Customize for your specific use case.', high: 'Perfectly tailored!' },
};
```

### B-6. 점수 백분율 위치 표시

결과 페이지에 "Top X% of all prompts analyzed" 메시지 추가 (목데이터 기반, 추후 Supabase 연동).

---

## Phase C: 성능 + SEO 최적화

### C-1. Dynamic Import (병렬 가능)

```javascript
// app/page.js
import dynamic from 'next/dynamic';
const DemoMode = dynamic(() => import('./components/DemoMode'), { ssr: false });
const Leaderboard = dynamic(() => import('./components/Leaderboard'), { ssr: false });
const Waitlist = dynamic(() => import('./components/Waitlist'), { ssr: false });
```

### C-2. SEO 가이드 SSG (병렬 가능)

```javascript
// app/guides/[slug]/page.js
export async function generateStaticParams() {
  return [
    { slug: 'how-to-write-better-prompts' },
    { slug: 'prompt-engineering-for-marketers' },
    { slug: 'chatgpt-prompt-tips' },
    { slug: 'ai-prompt-frameworks' },
    { slug: 'prompt-optimization-guide' },
    { slug: 'advanced-prompting-techniques' },
  ];
}
```

### C-3. next/font + Script Optimization (병렬 가능)

```javascript
// app/layout.js
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

// AdSense lazy load
import Script from 'next/script';
<Script src="https://pagead2.googlesyndication.com/..." strategy="lazyOnload" />
```

### C-4. Internal Linking 강화 (병렬 가능)

가이드 페이지 하단에 "Related Guides" 섹션 추가. 결과 페이지에서 낮은 점수 차원 → 해당 가이드로 연결.

### C-5. OG Image 고도화 (병렬 가능)

api/og/route.jsx 개선: 더 눈에 띄는 디자인, 그라데이션 배경, 등급 뱃지 포함.

---

## Phase D: 마케팅 기능 구현

### D-1. Hero Copy 개선

page.js Hero 섹션:
```
기존: "Score Your AI Prompts Instantly"
변경: "Your prompts have a hidden score. Find out in 5 seconds."
```
+ A/B 테스트용 두 번째 카피 준비.

### D-2. Score Badge 공유 이미지

**`app/api/badge/route.jsx`** — OG 이미지와 별도로, SNS 공유용 정사각형 뱃지:
- "My Prompt Score: A (85/100)"
- ScoreMyPrompt 로고 + URL
- 다운로드/공유 가능

### D-3. Challenge Mode 링크

결과 페이지에 "Challenge a friend" 버튼:
- `/challenge?score=85&grade=A` 형태 URL 생성
- 해당 URL 방문 시 "Can you beat 85 points?" 메시지 표시 → 바로 분석 유도

---

## Phase E: 테스트 작성

### E-1. Jest + RTL 설정

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @types/jest ts-jest jest-environment-jsdom
```

**`jest.config.js`** 생성.

### E-2. API Route 테스트

- `__tests__/api/analyze.test.ts` — Mock Mode 응답 검증, 입력 검증 (Zod), 에러 케이스
- `__tests__/api/stripe-webhook.test.ts` — 시그니처 검증, 이벤트 핸들링

### E-3. 컴포넌트 테스트

- `__tests__/components/DemoMode.test.tsx`
- `__tests__/components/Button.test.tsx`

### E-4. E2E 테스트 (Playwright)

```bash
npm install -D @playwright/test
```

핵심 플로우: Landing → 입력 → 분석 → 결과 → 공유

---

## Phase F: 외부 연동 (마지막)

> ⚠️ Phase A~E 완료 후 진행

### F-1. Vercel 배포 (15분)
1. `vercel` CLI로 프로젝트 연결
2. 환경변수 12개 설정
3. 커스텀 도메인 연결
4. vercel.json rewrite 확인

### F-2. Supabase 연동 (2시간)
1. 프로젝트 생성
2. `schema.sql` 실행
3. RLS 정책 확인
4. Auth 설정 (Magic Link + Google OAuth)
5. 환경변수 적용

### F-3. Claude API 실연동 (10분)
1. ANTHROPIC_API_KEY 설정
2. Mock → Real 전환 확인
3. 응답 시간 측정

### F-4. Stripe 연동 (1시간)
1. Stripe 계정 + 상품 생성 ($9.99/mo)
2. Webhook endpoint 등록
3. Checkout → Webhook → Portal 플로우 테스트

### F-5. 모니터링 설정 (30분)
1. Sentry 에러 트래킹
2. Vercel Analytics 활성화
3. PostHog 이벤트 확인

---

## 에이전트 오케스트레이션 가이드

### 병렬 실행 그룹 (동시 진행 가능)

**Group 1** (Phase A 독립 작업):
- Agent 1: A-4 Error Boundary + A-5 Security Headers
- Agent 2: A-7 Constants 중앙화 + A-8 System Prompt 분리

**Group 2** (Phase A 타입 작업 — 순차):
- Agent 3: A-1 → A-2 → A-3 → A-6 (TypeScript 전환 체인)

**Group 3** (Phase B — Group 1,2 완료 후):
- Agent 4: B-1 모바일 반응형 + B-2 로딩 UX
- Agent 5: B-3 Design Token + B-4 버튼 통일
- Agent 6: B-5 감정 피드백 + B-6 백분율 표시

**Group 4** (Phase C — 독립 실행):
- Agent 7: C-1 Dynamic Import + C-2 SSG + C-3 Font
- Agent 8: C-4 Internal Linking + C-5 OG Image

**Group 5** (Phase D — 독립 실행):
- Agent 9: D-1 Hero Copy + D-2 Score Badge
- Agent 10: D-3 Challenge Mode

**Group 6** (Phase E — Phase A 이후):
- Agent 11: E-1 Jest 설정 + E-2 API 테스트
- Agent 12: E-3 컴포넌트 테스트 + E-4 E2E

**Group 7** (Phase F — 전부 완료 후):
- 순차 진행: F-1 → F-2 → F-3 → F-4 → F-5

---

## 검증 체크리스트

Phase 완료 시마다 아래 확인:

- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 0
- [ ] TypeScript 컴파일 에러 0
- [ ] 테스트 통과 (Phase E 이후)
- [ ] Lighthouse Performance 90+
- [ ] 모바일 반응형 확인 (375px, 768px)
- [ ] Mock Mode 전체 플로우 동작

---

*Generated: 2026-02-23 | ScoreMyPrompt PM Agent*
