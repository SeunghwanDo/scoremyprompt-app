# ScoreMyPrompt OG Image / Share Card Setup

Two files have been created to enable social sharing with rich preview cards:

## Files Created

### 1. `/app/api/og/route.jsx` - OG Image Generator API Route

A Next.js API route that dynamically generates a 1200x630 PNG image for social sharing using `@vercel/og` (ImageResponse).

**URL Pattern:**
```
/api/og?score=78&grade=A&gradeLabel=Skilled+Prompter&jobRole=Marketing&percentile=23&p=16&r=11&o=12&m=18&s=9&t=12
```

**Query Parameters:**
- `score` (number 0-100) - Overall PROMPT Score
- `grade` (S/A/B/C/D) - Letter grade
- `gradeLabel` (text) - Grade description (e.g., "Skilled Prompter")
- `jobRole` (text) - Job role category (e.g., "Marketing")
- `percentile` (number) - Percentile ranking (0-100)
- `p` (number 0-100) - Precision score
- `r` (number 0-100) - Relevance score
- `o` (number 0-100) - Organization score
- `m` (number 0-100) - Methodology score
- `s` (number 0-100) - Personalization/Structure score
- `t` (number 0-100) - Timeframe score

**Features:**
- Dark gradient background (#0a0f1a → #0f172a)
- Score displayed prominently with color-coded grade
- PROMPT dimension bars showing all 6 dimensions
- Job role benchmark info
- CTA pointing to scoremyprompt.com
- Grade color mapping:
  - S = Green (#10b981) - Exceptional
  - A = Blue (#3b82f6) - Skilled
  - B = Amber (#f59e0b) - Competent
  - C = Orange (#f97316) - Developing
  - D = Red (#ef4444) - Needs Work
- Premium dark theme with gradient accents

### 2. `/app/share/[id]/page.js` - Dynamic Share Page with Meta Tags

A Next.js dynamic page that sets up OpenGraph and Twitter meta tags for proper social media sharing.

**URL Pattern:**
```
/share/[id]?score=78&grade=A&gradeLabel=Skilled+Prompter&jobRole=Marketing&percentile=23&p=16&r=11&o=12&m=18&s=9&t=12
```

**Features:**
- Extracts all score parameters from URL
- Generates server-side metadata with `generateMetadata()`
- Sets OpenGraph meta tags for LinkedIn sharing
- Sets Twitter Card meta tags for X/Twitter sharing
- Dynamically constructs OG image URL with all parameters
- Client-side component shows brief loading state before redirect
- Uses `NEXT_PUBLIC_BASE_URL` environment variable (defaults to https://scoremyprompt.com)

**Meta Tags Generated:**
- `og:title` - "I got a {score} PROMPT Score on ScoreMyPrompt!"
- `og:description` - Grade level and percentile ranking
- `og:image` - Dynamically generated PNG from `/api/og`
- `twitter:card` - "summary_large_image" for rich preview
- `twitter:image` - OG image URL

## How to Use

### In Your Result Page

After user completes the analysis, generate a share link:

```javascript
const generateShareLink = (result) => {
  const params = new URLSearchParams({
    score: result.overallScore,
    grade: result.grade, // S/A/B/C/D
    gradeLabel: result.scoreLevel,
    jobRole: result.jobRole,
    percentile: result.benchmarks.percentile,
    p: result.dimensions.precision.score,
    r: result.dimensions.relevance.score,
    o: result.dimensions.organization.score,
    m: result.dimensions.methodology.score,
    s: result.dimensions.personalization.score,
    t: result.dimensions.timeframe.score,
  });

  const uniqueId = generateUniqueId(); // or use user ID, timestamp, etc.
  return `/share/${uniqueId}?${params.toString()}`;
};
```

### Share Button Integration

Update your "Share Your Score" button to:

```javascript
const handleShare = async () => {
  const shareLink = generateShareLink(result);

  if (navigator.share) {
    await navigator.share({
      title: 'My PROMPT Score',
      text: `I got a ${result.overallScore} PROMPT Score on ScoreMyPrompt!`,
      url: shareLink,
    });
  } else {
    // Copy to clipboard
    await navigator.clipboard.writeText(shareLink);
  }
};
```

## Environment Setup

Add to `.env.local`:
```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

If not set, defaults to `https://scoremyprompt.com`.

## Testing

### Test OG Image Generation

Visit the API directly:
```
http://localhost:3000/api/og?score=78&grade=A&gradeLabel=Skilled+Prompter&jobRole=Marketing&percentile=23&p=16&r=11&o=12&m=18&s=9&t=12
```

Should return a 1200x630 PNG image.

### Test Meta Tags

1. Visit the share page:
```
http://localhost:3000/share/test-123?score=78&grade=A&gradeLabel=Skilled+Prompter&jobRole=Marketing&percentile=23&p=16&r=11&o=12&m=18&s=9&t=12
```

2. View page source to verify meta tags are set correctly

3. Use tools to preview:
   - LinkedIn: https://www.linkedin.com/feed/
   - X/Twitter: https://twitter.com/compose/tweet
   - Facebook: https://developers.facebook.com/tools/debug/og/object
   - General: https://metatags.io/

## Design Specifications

**Card Dimensions:** 1200x630px (standard OG image size)

**Layout:**
- Header: ScoreMyPrompt logo + branding
- Main section: Score display with grade
- Dimensions: 6 PROMPT dimension bars (P, R, O, M, P, T)
- Benchmark info: Percentile + job role
- CTA: "What's your score? → scoremyprompt.com"
- Footer: "ScoreMyPrompt by PromptTribe"

**Colors:**
- Background: `#0a0f1a` to `#0f172a` gradient
- Accent colors vary by grade

**Typography:**
- All text in English (global product)
- System fonts (no custom font loading needed for @vercel/og)
- Sans-serif, modern, clean design
