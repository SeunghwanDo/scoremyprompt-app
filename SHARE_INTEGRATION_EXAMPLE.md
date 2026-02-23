# ScoreMyPrompt Share Integration Example

## Quick Integration Guide

### Step 1: Update Your Result Page Share Button

In `/app/result/page.js`, update the `handleShare` function:

```javascript
const handleShare = async () => {
  if (!result) return;

  // Generate unique ID (use user ID, timestamp, or UUID)
  const shareId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Build share URL with all parameters
  const params = new URLSearchParams({
    score: result.overallScore,
    grade: getGrade(result.overallScore), // Convert score to grade (S/A/B/C/D)
    gradeLabel: result.scoreLevel || 'Skilled Prompter',
    jobRole: result.jobRole || 'Marketing',
    percentile: result.benchmarks.percentile || 50,
    p: Math.round(result.dimensions.precision.score),
    r: Math.round(result.dimensions.relevance.score),
    o: Math.round(result.dimensions.organization.score),
    m: Math.round(result.dimensions.methodology.score),
    s: Math.round(result.dimensions.personalization.score),
    t: Math.round(result.dimensions.timeframe.score),
  });

  const shareUrl = `${window.location.origin}/share/${shareId}?${params.toString()}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My PROMPT Score on ScoreMyPrompt',
        text: `I got a ${result.overallScore} PROMPT Score! See how you compare.`,
        url: shareUrl,
      });
    } catch (err) {
      console.log('Share cancelled');
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
};

// Helper function to convert score to grade
function getGrade(score) {
  if (score >= 85) return 'S';
  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 45) return 'C';
  return 'D';
}
```

### Step 2: Environment Variable

In `.env.local`:

```bash
NEXT_PUBLIC_BASE_URL=https://scoremyprompt.com
```

(During development, use `http://localhost:3000`)

## API Response Example

### Request:
```
GET /api/og?score=78&grade=A&gradeLabel=Skilled+Prompter&jobRole=Marketing&percentile=23&p=80&r=75&o=80&m=78&s=70&t=75
```

### Response:
- Content-Type: `image/png`
- Dimensions: 1200x630px
- A PNG image with the score card design

## Social Share Examples

### Share to X/Twitter

Users can copy the share link and paste it:
```
Check out my PROMPT Score! I ranked in the top 23% of Marketing professionals on ScoreMyPrompt: https://scoremyprompt.com/share/abc123?score=78&grade=A...
```

When users paste this link in a tweet, X will show the OG image as a card preview.

### Share to LinkedIn

The same URL can be pasted on LinkedIn, and it will show:
- The dynamic OG image
- Title: "I got a 78 PROMPT Score on ScoreMyPrompt!"
- Description: Grade level and percentile info

### Share to Facebook

Facebook will use the OG meta tags to display the card with the image.

## Parameters Reference

| Parameter | Type | Range | Example | Description |
|-----------|------|-------|---------|-------------|
| `score` | number | 0-100 | 78 | Overall PROMPT Score |
| `grade` | string | S/A/B/C/D | A | Letter grade |
| `gradeLabel` | string | any text | Skilled Prompter | Grade description |
| `jobRole` | string | any text | Marketing | Profession/industry |
| `percentile` | number | 0-100 | 23 | Ranking percentile |
| `p` | number | 0-100 | 80 | Precision dimension |
| `r` | number | 0-100 | 75 | Relevance dimension |
| `o` | number | 0-100 | 80 | Organization dimension |
| `m` | number | 0-100 | 78 | Methodology dimension |
| `s` | number | 0-100 | 70 | Personalization dimension |
| `t` | number | 0-100 | 75 | Timeframe dimension |

## Grade Color Mapping

| Grade | Color | Hex | Meaning |
|-------|-------|-----|---------|
| S | Green | #10b981 | Exceptional (85+) |
| A | Blue | #3b82f6 | Skilled (75-84) |
| B | Amber | #f59e0b | Competent (60-74) |
| C | Orange | #f97316 | Developing (45-59) |
| D | Red | #ef4444 | Needs Work (<45) |

## Testing the Share Feature

### Test URL Pattern:
```
http://localhost:3000/share/test-12345?score=78&grade=A&gradeLabel=Skilled+Prompter&jobRole=Marketing&percentile=23&p=80&r=75&o=80&m=78&s=70&t=75
```

### Check Generated Meta Tags:

1. View page source (Ctrl+U)
2. Look for `<meta property="og:*" ...>` tags
3. Verify the image URL points to `/api/og?...`

### Preview on Social Media:

- **LinkedIn:** Paste URL in a post
- **X/Twitter:** Use the Tweet Composer
- **Facebook:** Use the Sharing Debugger: https://developers.facebook.com/tools/debug/og/object/
- **Generic:** Use metatags.io - just paste the URL

## Advanced: Storing Results

If you want to store results and create persistent share links:

```javascript
// Store result in database
async function storeResult(result) {
  const response = await fetch('/api/store-result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result)
  });
  const { id } = await response.json();
  return id;
}

// In handleShare:
const resultId = await storeResult(result);
const shareUrl = `${window.location.origin}/share/${resultId}`;
```

Then in `/app/share/[id]/page.js`, you can fetch the result from your database:

```javascript
export async function generateMetadata({ params }) {
  const { id } = params;

  // Fetch from database or get from searchParams
  const result = await fetchResultById(id);

  // Build OG URL with stored data...
}
```

## Troubleshooting

### OG Image Not Showing

1. Check that `/api/og` route is accessible
2. Verify all parameters are properly URL-encoded
3. Ensure `NEXT_PUBLIC_BASE_URL` is set correctly
4. Test directly: `http://localhost:3000/api/og?score=78...`

### Meta Tags Not Appearing

1. Run `npm run build` (meta tags are generated at build time)
2. Verify `generateMetadata` export exists in `/app/share/[id]/page.js`
3. Check browser console for errors
4. Use metatags.io to verify tag generation

### Image Not Showing on Social Media

1. Social platforms cache OG images - use their debugging tools to clear cache
2. Ensure the image URL is publicly accessible
3. Wait 10-15 minutes for social media to refresh cache
4. Try a fresh URL with different parameters

## Performance Tips

- Generate unique IDs efficiently (avoid UUID library if possible)
- Cache the OG image URL in session storage to avoid regeneration
- Set appropriate cache headers on the `/api/og` route
- Consider rate limiting if storing results in database

## Security Considerations

- Validate all URL parameters in `/api/og` route (already done with clampScore)
- Sanitize job role and grade label if displaying user-generated content
- Set Content Security Policy headers if needed
- Rate limit the OG image generation endpoint if public
