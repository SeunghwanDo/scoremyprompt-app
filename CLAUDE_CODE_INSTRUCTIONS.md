# ScoreMyPrompt — Claude Code 실행 가이드

## 프로젝트 개요
AI 프롬프트 채점 서비스. PROMPT Score 프레임워크(6차원, 100점)로 프롬프트 품질을 분석.
글로벌 영어 서비스. 커뮤니티명: PromptTribe.

## 현재 상태
- Next.js 14 App Router 프로젝트 (코드 완성)
- Claude Haiku 4.5 API 연동 완료 (fetch 기반, SDK 불필요)
- API 키 없으면 Mock 모드 자동 전환
- 모든 UI 완성: Landing, Result, DemoMode, Leaderboard, Waitlist
- SEO: sitemap, robots.txt, JSON-LD, OG image generator 완성
- Vercel 배포 설정 완료 (vercel.json)
- Supabase 스키마 준비됨 (supabase/schema.sql)

## Sprint 순서 (이 순서대로 실행)

### Sprint 1: Launch MVP
```bash
cd scoremyprompt-app
npm install
npm run dev  # localhost:3000에서 테스트
```
1. 로컬에서 정상 동작 확인
2. Supabase 프로젝트 생성 → SQL Editor에서 supabase/schema.sql 실행
3. .env.local 생성 (ANTHROPIC_API_KEY + Supabase 키)
4. API route에 Supabase 연동 (분석 결과 저장)
   - app/api/analyze/route.js에서 분석 완료 후 analyses 테이블에 INSERT
   - share_id 자동 생성 (generate_share_id 함수 사용)
5. Waitlist API 연동 (app/api/waitlist/route.js 생성)
6. `npx vercel` 배포

### Sprint 2: Auth + Value Gate
참고: FEATURE_SPEC.md 섹션 1, 2

1. `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs`
2. app/lib/auth.js 구현
3. app/components/AuthModal.jsx 구현
4. app/lib/gate.js 구현 (Guest 3회, Free 10회, Pro 무제한)
5. result/page.js에 블러 효과 적용 (Guest는 1개 차원만 상세)
6. Supabase에 user_profiles 테이블 + trigger 생성

### Sprint 3: 결제 + 광고
참고: FEATURE_SPEC.md 섹션 4, 5

1. `npm install stripe`
2. Stripe 대시보드에서 Product + Price 생성 ($9.99/mo recurring)
3. app/api/stripe/checkout/route.js
4. app/api/stripe/webhook/route.js
5. app/api/stripe/portal/route.js
6. app/pricing/page.js
7. app/components/AdBanner.jsx (Google AdSense)
8. Landing + Result 페이지에 AdBanner 배치

### Sprint 4: Growth
참고: FEATURE_SPEC.md 섹션 6, 7

1. app/guides/ 페이지 6개 생성 (SEO 콘텐츠)
2. app/api/leaderboard/route.js (Supabase 실데이터)
3. app/dashboard/page.js
4. app/compare/page.js

### Sprint 5: Retention
참고: FEATURE_SPEC.md 섹션 3, 7

1. app/history/page.js
2. app/api/analyze-bulk/route.js
3. app/api/export/route.js (PDF)
4. app/components/Toast.jsx
5. app/components/UpgradeBanner.jsx

## 핵심 파일 위치
- API 엔진: app/api/analyze/route.js
- PROMPT 시스템 프롬프트: route.js 상단 PROMPT_SCORE_SYSTEM 상수
- DB 스키마: supabase/schema.sql
- 기능 스펙: FEATURE_SPEC.md
- 환경변수 템플릿: .env.local.example
- Vercel 설정: vercel.json

## 기술 스택
- Next.js 14 (App Router)
- React 18
- Tailwind CSS (dark theme: bg-dark #0a0f1a, primary #3b82f6, accent #8b5cf6)
- Claude Haiku 4.5 (fetch API 직접 호출)
- Supabase (PostgreSQL + Auth + RLS)
- Stripe (결제)
- PostHog (애널리틱스)
- Google AdSense (광고)
- Vercel (배포)

## 디자인 가이드
- 다크 모드 전용
- 카드: bg-surface, border-border, rounded-xl
- 버튼: btn-primary (gradient blue→purple), btn-secondary (border only)
- 폰트: Inter (Google Fonts)
- 그라디언트 텍스트: text-gradient (blue→purple)
- 애니메이션: animate-fade-in, animate-slide-in
