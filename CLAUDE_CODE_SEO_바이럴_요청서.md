# ScoreMyPrompt - SEO + Viral 강화 Claude Code 요청서

> 현재 상태: 메타데이터 우수, OG 이미지 우수, 공유 플로우 우수
> 부족한 것: sitemap 불완전, 구조화 데이터 부족, 공유 텍스트 최적화, 임베드 위젯 없음
> 외부 연동(Vercel, Supabase, Stripe) 없이 진행 가능한 작업만 포함

---

## 🔴 SEO 기본 인프라 (반드시 배포 전)

### 요청 1: Sitemap 확장

```
app/sitemap.js (또는 .ts)를 수정해서 모든 페이지를 포함시켜줘.

현재 home, result 2개만 있는데, 아래 전체를 포함해야 해:

export default function sitemap() {
  const baseUrl = 'https://scoremyprompt.com';

  // 정적 페이지
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/challenge`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // 가이드 페이지 동적 생성
  // app/guides/content.ts에서 guides 배열을 import해서 slug 목록 가져오기
  const guidePages = guides.map(guide => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...guidePages];
}

guides/content.ts에서 guides를 export하고 있는지 확인하고,
안 하고 있으면 export 추가해줘.
```

### 요청 2: 각 페이지 Canonical URL 명시

```
현재 share 페이지만 canonical이 있고 나머지는 없어.
주요 페이지에 canonical URL을 추가해줘.

1. app/page.tsx의 metadata에 추가:
   alternates: { canonical: 'https://scoremyprompt.com' }

2. app/pricing/page.tsx:
   alternates: { canonical: 'https://scoremyprompt.com/pricing' }

3. app/guides/page.tsx:
   alternates: { canonical: 'https://scoremyprompt.com/guides' }

4. app/guides/[slug]/page.tsx의 generateMetadata에:
   alternates: { canonical: `https://scoremyprompt.com/guides/${slug}` }

5. app/challenge/page.tsx:
   alternates: { canonical: 'https://scoremyprompt.com/challenge' }

baseUrl은 process.env.NEXT_PUBLIC_BASE_URL || 'https://scoremyprompt.com'으로
환경변수에서 가져오도록 해줘.
```

### 요청 3: Pricing 페이지 FAQ Schema 추가

```
app/pricing/page.tsx에 FAQ 구조화 데이터(JSON-LD)를 추가해줘.

현재 FAQ 아코디언이 있는데 구조화 데이터가 없어.
이걸 추가하면 구글 검색결과에 FAQ 리치 스니펫으로 노출돼.

페이지 컴포넌트 안에 <script type="application/ld+json"> 추가:

{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    // pricing 페이지의 기존 FAQ 항목들을 모두 포함
    // 각각 { "@type": "Question", "name": "질문", "acceptedAnswer": { "@type": "Answer", "text": "답변" } }
  ]
}

기존 FAQ 데이터 배열에서 자동으로 JSON-LD를 생성하는 방식으로 해줘.
하드코딩 말고.
```

### 요청 4: Guides 페이지 Breadcrumb Schema 추가

```
app/guides/[slug]/page.tsx에 BreadcrumbList 구조화 데이터를 추가해줘.

{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://scoremyprompt.com" },
    { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://scoremyprompt.com/guides" },
    { "@type": "ListItem", "position": 3, "name": guide.title, "item": `https://scoremyprompt.com/guides/${slug}` }
  ]
}

기존 Article JSON-LD 옆에 추가하면 돼.
그리고 UI에도 실제 breadcrumb 네비게이션을 추가해줘:
Home > Guides > {Guide Title}
nav 태그 안에 넣고 aria-label="Breadcrumb" 추가.
```

### 요청 5: 홈페이지 구조화 데이터 보강

```
app/layout.tsx의 JSON-LD를 보강해줘.

현재 WebApplication 스키마만 있는데, 추가로:

1. Organization 스키마 추가:
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ScoreMyPrompt",
  "url": "https://scoremyprompt.com",
  "logo": "https://scoremyprompt.com/favicon.svg",
  "sameAs": []  // 소셜 계정 생기면 여기 추가
}

2. 기존 WebApplication에 aggregateRating 추가:
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "ratingCount": "1200",
  "bestRating": "5"
}

3. SoftwareApplication offers 추가:
"offers": [
  { "@type": "Offer", "price": "0", "priceCurrency": "USD", "name": "Free" },
  { "@type": "Offer", "price": "9.99", "priceCurrency": "USD", "name": "Pro" }
]

이건 하나의 script 태그 안에 @graph로 묶거나,
별도 script 태그 두 개로 분리해도 돼.
```

---

## 🟡 공유 텍스트 & 바이럴 최적화

### 요청 6: 공유 텍스트 플랫폼별 최적화

```
app/result/page.tsx의 공유 기능에서 현재 하나의 텍스트로 모든 플랫폼에 공유하고 있는데,
플랫폼별로 최적화된 텍스트를 만들어줘.

공유 텍스트 함수를 만들어:

function getShareText(platform: 'twitter' | 'linkedin' | 'copy', data: ShareData) {
  const { score, grade, gradeLabel, jobRole, percentile } = data;
  const url = shareUrl;

  switch(platform) {
    case 'twitter':
      return `My AI prompt just scored ${score}/100 (${grade}-Tier) on ScoreMyPrompt! 🎯\n\nTop ${100-percentile}% among ${jobRole} professionals.\n\nWhat's your PROMPT Score? 👇\n${url}`;

    case 'linkedin':
      return `I just discovered my AI prompting skill level.\n\nUsing ScoreMyPrompt's PROMPT Framework, my prompt scored ${score}/100 — ${gradeLabel}.\n\nAs a ${jobRole} professional, this puts me in the top ${100-percentile}%.\n\nThe 6 dimensions measured: Precision, Role, Output Format, Mission Context, Prompt Structure, and Tailoring.\n\nCurious about your score? Try it free: ${url}`;

    case 'copy':
      return `I scored ${score}/100 (Grade ${grade}) on ScoreMyPrompt! Can you beat my score? ${url}`;
  }
}

그리고 공유 버튼들을 플랫폼별로 분리해줘:
- Twitter/X 버튼: intent URL https://twitter.com/intent/tweet?text={encoded}
- LinkedIn 버튼: https://www.linkedin.com/sharing/share-offsite/?url={encoded}
- Copy Link 버튼: 기존 clipboard 기능 유지
- navigator.share() 버튼: 모바일에서만 표시

각 버튼에 해당 플랫폼 아이콘 SVG를 넣어줘 (간단한 인라인 SVG).
```

### 요청 7: Challenge 페이지 공유 강화

```
app/challenge/page.tsx에 챌린지를 받은 사람이
자기 결과를 다시 공유할 수 있는 "역 챌린지" 플로우를 추가해줘.

현재: A가 B에게 챌린지 → B가 분석 → 끝

개선: A가 B에게 챌린지 → B가 분석 → B의 결과 페이지에서
"Beat {A's name}! I scored {B's score}!" 텍스트로 재공유 가능

구현:
1. challenge 페이지에서 원래 도전자 정보를 sessionStorage에 저장:
   sessionStorage.setItem('challenger', JSON.stringify({ name, score, grade }))

2. result 페이지에서 sessionStorage 체크:
   const challenger = sessionStorage.getItem('challenger')

3. challenger가 있으면 추가 공유 버튼 표시:
   "I beat {name}'s score! 🏆" (본인 점수가 높을 때)
   "So close! {name} beat me by {diff} points 😤" (낮을 때)

4. 이 텍스트로 새로운 challenge URL 생성해서 공유

이러면 A→B→C→D 체인 바이럴이 가능해져.
```

### 요청 8: 임베드 위젯 (Score Badge)

```
두 가지를 만들어줘:

1. app/api/embed/route.tsx 신규 생성:
   iframe용 경량 HTML을 반환하는 API 엔드포인트.
   query params: score, grade, gradeLabel
   반환: 작은 카드 HTML (200x80px 정도)
   - 어두운 배경에 점수 + 등급 + "Scored on ScoreMyPrompt" 링크
   - 클릭하면 scoremyprompt.com으로 이동

2. result 페이지에 "Embed Your Score" 섹션 추가:
   접이식(collapsible) 패널로:

   a) HTML embed 코드:
   <iframe src="https://scoremyprompt.com/api/embed?score=85&grade=A&gradeLabel=A-Tier"
     width="220" height="80" frameborder="0"></iframe>

   b) Markdown badge 코드:
   [![My PROMPT Score](https://scoremyprompt.com/api/badge?score=85&grade=A)](https://scoremyprompt.com)

   각각 "Copy" 버튼과 미리보기 포함.

블로거, 개발자가 자기 블로그/GitHub README에 뱃지를 달 수 있게 하는 거야.
```

### 요청 9: OG 이미지 개선 — 경쟁 유도 문구

```
app/api/og/route.tsx(또는 .jsx)의 OG 이미지에
바이럴 유도 문구를 추가해줘.

현재: 점수 + 등급 + 차원별 바 표시

추가할 것:
1. 이미지 하단에 CTA 문구:
   "What's YOUR score? → scoremyprompt.com"
   폰트 크기 20px, 색상 text-gray-400

2. 등급별 맞춤 한 줄 카피:
   S: "Prompt Master 🏆 Can anyone beat this?"
   A: "Top tier! 🌟 Think you can do better?"
   B: "Solid score! 💪 Challenge accepted?"
   C: "Room to grow! 🎯 Beat this score!"
   D: "Just getting started! 📝 Show me how it's done!"

3. percentile 표시를 좀 더 강조:
   "Top {x}% among {role} professionals"를
   강조 색상(grade color)으로 표시

이미지를 봤을 때 "나도 해봐야겠다" 심리를 자극하는 게 목표.
```

---

## 🟢 콘텐츠 SEO 강화

### 요청 10: 가이드 내부 링크 강화

```
app/guides/content.ts의 가이드 콘텐츠에서
가이드 간 상호 링크를 강화해줘.

현재 relatedGuides로 연결은 되어 있는데,
가이드 본문 텍스트 안에서 다른 가이드로 자연스럽게 연결하는 인라인 링크가 없어.

각 가이드의 sections 콘텐츠에서:
1. "prompt engineering"이 언급되면 → /guides/prompt-engineering-for-beginners 링크
2. "PROMPT Score" 또는 "PROMPT Framework"이 언급되면 → /guides/prompt-score-framework 링크
3. "ChatGPT tips"가 언급되면 → /guides/chatgpt-prompt-tips 링크
4. "marketers"가 언급되면 → /guides/ai-prompts-for-marketers 링크
5. "designers"가 언급되면 → /guides/ai-prompt-guide-designers 링크

content.ts의 텍스트에 <a> 태그를 직접 넣는 게 아니라,
가이드 렌더링 컴포넌트([slug]/page.tsx)에서
텍스트를 파싱해서 키워드를 자동으로 링크로 바꿔주는
autoLinkGuides() 유틸 함수를 만들어줘.

같은 가이드 내에서 자기 자신으로의 링크는 제외.
한 단락에 최대 2개 링크까지만.
```

### 요청 11: 가이드 하단 CTA + 관련 콘텐츠 강화

```
app/guides/[slug]/page.tsx의 각 가이드 하단에
더 강력한 CTA와 관련 콘텐츠 섹션을 추가해줘.

1. "Test What You Learned" CTA 박스:
   - 가이드 읽은 후 바로 프롬프트 분석하게 유도
   - 해당 가이드의 dimension과 연관된 예시 프롬프트 제공
   예: "Precision" 관련 가이드 → precision이 높은 예시 프롬프트 미리 채워서
       "Try this prompt" 클릭하면 홈페이지 textarea에 자동 입력

2. "Related Guides" 개선:
   - 현재: 단순 카드 3개
   - 개선: "If you liked this, read next:" 헤딩 + 간단한 이유 텍스트
   - "This guide covers Precision. Want to improve your Role dimension too?"

3. Newsletter CTA:
   - 가이드 하단에 인라인 이메일 수집:
   - "Get weekly prompt tips. Join 5K+ professionals."
   - 기존 Waitlist 컴포넌트를 compact 버전으로 재사용
```

### 요청 12: 프롬프트 템플릿 허브 페이지 생성

```
app/templates/page.tsx를 새로 만들어줘.

직군별 고득점 프롬프트 템플릿을 모아놓은 페이지:

구조:
- 히어로: "Prompt Templates That Score 80+"
- 직군 필터 (기존 JOB_ROLES 재사용)
- 템플릿 카드 그리드:
  각 카드에:
  - 템플릿 제목
  - 직군 태그
  - 예상 점수 범위 (80-90 등)
  - 프롬프트 텍스트 (3줄 미리보기)
  - "Use This Template" 버튼 → 홈페이지로 이동 + textarea 자동 채움
  - "Score This Template" 버튼 → 바로 분석 실행

초기 데이터: app/templates/data.ts에 직군별 3개씩, 총 21개 템플릿.
각 템플릿은 실제로 80점 이상 나올 수 있는 고품질 프롬프트로 작성해줘.

metadata:
- title: "AI Prompt Templates - High-Scoring Examples | ScoreMyPrompt"
- description: "Browse 20+ proven AI prompt templates scored 80+. Copy, customize, and use for Marketing, Design, Product, Engineering and more."

이 페이지를 sitemap.ts에도 추가해줘.
layout.tsx 네비게이션에 "Templates" 링크도 추가.
```

---

## 🔵 기술 SEO 마무리

### 요청 13: Web App Manifest 추가

```
app/manifest.ts를 생성해줘 (Next.js App Router 방식):

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ScoreMyPrompt - AI Prompt Grading Tool',
    short_name: 'ScoreMyPrompt',
    description: 'Score your AI prompts on 6 dimensions. Get instant feedback and improve.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1a',
    theme_color: '#3b82f6',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}

그리고 public/ 폴더에 icon-192.png와 icon-512.png를 생성해줘.
기존 favicon.svg의 디자인(파란-보라 그라데이션 배경에 흰색 "S")을
PNG로 변환해서 두 사이즈로 만들어줘.
Canvas API나 sharp 라이브러리 사용.
```

### 요청 14: 메타 키워드 & Open Graph 보강

```
아래 페이지들의 metadata를 보강해줘:

1. app/page.tsx:
   keywords 추가: ['AI prompt grader', 'prompt score', 'ChatGPT prompt checker',
     'prompt engineering tool', 'AI prompt quality', 'prompt optimizer',
     'free prompt grader', 'PROMPT framework', 'prompt feedback']

2. app/pricing/page.tsx:
   keywords: ['ScoreMyPrompt pricing', 'AI prompt tool pricing',
     'prompt grading pro plan', 'free AI prompt checker']

3. app/templates/page.tsx (새로 만든 페이지):
   keywords: ['AI prompt templates', 'ChatGPT prompt examples',
     'high scoring prompts', 'prompt engineering templates',
     'best AI prompts for marketing', 'prompt examples for designers']

4. 모든 페이지에 openGraph.siteName 추가:
   openGraph: { ...existing, siteName: 'ScoreMyPrompt' }

5. 모든 페이지에 twitter.creator 추가 (추후 계정 생성 시):
   twitter: { ...existing, creator: '@scoremyprompt' }
```

### 요청 15: robots.ts 업데이트 + 크롤링 최적화

```
app/robots.ts를 업데이트해줘:

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/history', '/pro/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
        // Googlebot에는 dashboard, history 접근 가능
        // (메타태그 noindex로 처리할 거니까)
      },
    ],
    sitemap: 'https://scoremyprompt.com/sitemap.xml',
  };
}

그리고 인증 필요한 페이지에 noindex 메타태그 추가:
- app/dashboard/page.tsx: metadata에 robots: 'noindex, nofollow'
- app/history/page.tsx: metadata에 robots: 'noindex, nofollow'
- app/pro/success/page.tsx: metadata에 robots: 'noindex, nofollow'
```

---

## 실행 순서 권장

| 순서 | 요청 # | 작업 | 예상 시간 | 영향도 |
|------|--------|------|-----------|--------|
| 1 | #1 | Sitemap 확장 | 15분 | 🔴 크롤링 |
| 2 | #2 | Canonical URL | 15분 | 🔴 중복 방지 |
| 3 | #15 | robots.ts + noindex | 10분 | 🔴 크롤링 |
| 4 | #5 | 홈 구조화 데이터 보강 | 15분 | 🔴 리치 스니펫 |
| 5 | #3 | FAQ Schema | 15분 | 🟡 리치 스니펫 |
| 6 | #4 | Breadcrumb Schema | 20분 | 🟡 검색 표시 |
| 7 | #6 | 공유 텍스트 플랫폼별 | 30분 | 🟡 바이럴 |
| 8 | #9 | OG 이미지 CTA 문구 | 20분 | 🟡 바이럴 |
| 9 | #7 | Challenge 역공유 | 30분 | 🟢 바이럴 |
| 10 | #8 | 임베드 위젯 | 45분 | 🟢 바이럴 |
| 11 | #10 | 가이드 내부링크 | 30분 | 🟢 SEO |
| 12 | #11 | 가이드 CTA 강화 | 30분 | 🟢 전환율 |
| 13 | #13 | Manifest + 아이콘 | 20분 | 🔵 PWA |
| 14 | #14 | 메타 키워드 보강 | 15분 | 🔵 SEO |
| 15 | #12 | 프롬프트 템플릿 허브 | 1.5시간 | 🔵 콘텐츠 SEO |

총 예상: 약 6~7시간 (1일 스프린트)
