# ScoreMyPrompt — Feature Specification v1.0
## For Claude Code Implementation

---

## 1. Authentication System (Supabase Auth)

### Overview
Supabase Auth with magic link (email) + Google OAuth. No password needed.

### User Tiers
| Tier | Cost | Daily Limit | Features |
|------|------|-------------|----------|
| Guest | Free | 3 analyses/day | 1 dimension detail only, no history |
| Free Member | Free | 10 analyses/day | All 6 dimensions, history, leaderboard |
| Pro | $9.99/mo | Unlimited | Auto-rewrite, bulk, ad-free, export, API access |

### Implementation Files

**`app/lib/auth.js`** — Auth utility
```js
// Wraps Supabase Auth
// getUser() — returns current user or null
// signInWithMagicLink(email) — sends magic link
// signInWithGoogle() — OAuth redirect
// signOut()
// getUserTier() — returns 'guest' | 'free' | 'pro'
```

**`app/components/AuthModal.jsx`** — Login/Signup modal
- Triggered when guest hits limit or clicks "Sign in"
- Two options: Magic Link (email input) or Google button
- After login, redirect back to current page
- Design: dark modal overlay, matches existing card style

**`app/api/auth/callback/route.js`** — OAuth callback handler

**Supabase Schema Addition:**
```sql
-- Add to existing schema.sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  display_name TEXT,
  avatar_url TEXT,
  job_role TEXT DEFAULT 'Other',
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  analyses_today INT DEFAULT 0,
  analyses_today_reset DATE DEFAULT CURRENT_DATE,
  total_analyses INT DEFAULT 0,
  best_score INT DEFAULT 0,
  best_grade CHAR(1)
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 2. Value Gate Logic (Rate Limiting by Tier)

### Overview
Controls access based on user tier. Implemented as middleware + API check.

**`app/lib/gate.js`** — Value Gate utility
```js
// checkGate(userId, tier) → { allowed: bool, remaining: int, message: string }
//
// Logic:
// Guest (no userId):
//   - 3 analyses/day (tracked by IP hash in analyses table)
//   - Result page shows only 1 random dimension detail
//   - Other 5 dimensions show score bar but feedback is blurred
//   - CTA: "Sign up free to see all 6 dimensions"
//
// Free member:
//   - 10 analyses/day (tracked by user_profiles.analyses_today)
//   - Reset daily via analyses_today_reset date check
//   - All 6 dimensions visible
//   - Shows ads
//   - CTA after 8th analysis: "Go Pro for unlimited analyses"
//
// Pro member:
//   - Unlimited analyses
//   - No ads
//   - Auto-rewrite visible immediately
//   - Bulk analysis enabled
//   - Export to PDF enabled
```

**Result Page Blur Effect (Guest):**
```jsx
// In result/page.js, for guest users:
// Show first dimension fully
// Other 5 dimensions: show the progress bar but blur the feedback text
// CSS: filter: blur(4px); pointer-events: none;
// Overlay CTA: "Sign up free to unlock all insights"
```

---

## 3. Pro Features

### 3a. Auto-Rewrite (Pro Only)
Already in API response as `rewriteSuggestion`. Currently behind a toggle.

**Changes for Pro:**
- Guest/Free: Show "Upgrade to Pro" button instead of rewrite
- Pro: Auto-expand rewrite section, add "Copy" and "Re-analyze rewritten prompt" buttons

### 3b. Analysis History (`app/history/page.js`)
```
Route: /history
Auth: Free + Pro only

UI:
- Table/card list of past analyses
- Columns: Date, Prompt preview (50 chars), Score, Grade, Job Role
- Click to expand full result
- Filter by: job role, grade, date range
- Sort by: date (default), score

Data: Query analyses table WHERE user_id = current user
```

### 3c. Bulk Analysis (Pro Only, `app/api/analyze-bulk/route.js`)
```
Route: POST /api/analyze-bulk
Auth: Pro only
Input: { prompts: string[], jobRole: string } (max 5 at once)
Output: { results: AnalysisResult[] }

UI: Textarea with line-separated prompts or CSV upload
Result: Side-by-side comparison table
```

### 3d. Export to PDF (Pro Only)
```
Route: POST /api/export/route.js
Input: { analysisId: string }
Output: PDF file download

Content: Score circle, all 6 dimensions, strengths, improvements, rewrite
Uses: @react-pdf/renderer or html-pdf
```

### 3e. API Access (Pro Only, Future)
```
Route: /api/v1/analyze
Auth: API key (generated in user dashboard)
Rate limit: 100 requests/day
Same input/output as /api/analyze
```

---

## 4. Stripe Payment Integration

### Setup
- Stripe Checkout for subscription
- Webhook for payment events
- Monthly billing: $9.99/mo

### Implementation Files

**`app/api/stripe/checkout/route.js`** — Create checkout session
```js
// POST /api/stripe/checkout
// Auth: must be logged in (free tier)
// Creates Stripe Checkout Session with:
//   - price: process.env.STRIPE_PRICE_ID (recurring $9.99/mo)
//   - customer_email: user's email
//   - success_url: /pro/success?session_id={CHECKOUT_SESSION_ID}
//   - cancel_url: /pricing
//   - metadata: { userId: user.id }
// Returns: { url: checkout_session.url }
```

**`app/api/stripe/webhook/route.js`** — Handle Stripe events
```js
// POST /api/stripe/webhook
// Verify signature with STRIPE_WEBHOOK_SECRET
// Handle events:
//   checkout.session.completed → Update user_profiles.tier = 'pro'
//   customer.subscription.deleted → Update user_profiles.tier = 'free'
//   customer.subscription.updated → Handle plan changes
//   invoice.payment_failed → Send warning, keep pro for 3 days grace
```

**`app/api/stripe/portal/route.js`** — Customer portal (manage/cancel)
```js
// POST /api/stripe/portal
// Creates Stripe Billing Portal session
// User can cancel, update payment method, view invoices
```

**`app/pricing/page.js`** — Pricing page
```
Design: Two-column comparison

FREE                          PRO $9.99/mo
────                          ────────────
✓ 10 analyses/day            ✓ Unlimited analyses
✓ All 6 dimensions           ✓ Auto-rewrite suggestions
✓ Weekly leaderboard         ✓ Analysis history
✓ Share your score           ✓ Bulk analysis (5 at once)
✗ Ads shown                  ✓ Ad-free experience
✗ No history                 ✓ Export to PDF
✗ No rewrite                 ✓ API access (coming soon)
                              ✓ Priority support

[Sign Up Free]               [Start Pro Trial — 7 days free]
```

**`app/pro/success/page.js`** — Post-purchase success page
```
"Welcome to Pro! 🎉"
- Confirm subscription active
- Quick tour of Pro features
- CTA: "Analyze your first prompt with Pro"
```

### Environment Variables
```
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

---

## 5. Ad System (Google AdSense)

### Overview
Ads shown to Guest and Free users. Pro users see no ads.

### Ad Placements (3 slots)

**Slot 1: Result Page — Below score circle, above dimensions**
```jsx
// app/components/AdBanner.jsx
// Shows only if user tier !== 'pro'
// Size: 728x90 leaderboard (desktop) / 320x100 (mobile)
// Google AdSense responsive ad unit
```

**Slot 2: Landing Page — Between DemoMode and Leaderboard**
```jsx
// Size: 728x90 leaderboard
// Only renders after DemoMode interaction (delay load)
```

**Slot 3: Result Page — Below improvements, above share section**
```jsx
// Size: 336x280 medium rectangle
// Higher value placement (user is engaged)
```

### Implementation

**`app/components/AdBanner.jsx`**
```jsx
// Props: slot ('leaderboard' | 'rectangle'), className
// Checks user tier — returns null if Pro
// Loads Google AdSense script once
// Renders responsive ad unit
// Shows subtle "Remove ads → Go Pro" link below ad
//
// Environment: NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxx
```

**`app/layout.js` addition:**
```jsx
// Add AdSense script to <head> only if NEXT_PUBLIC_ADSENSE_ID exists
// <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
//   crossOrigin="anonymous" data-ad-client={adsenseId} />
```

---

## 6. SEO Landing Pages

### Overview
Static/ISR pages targeting high-intent keywords. Each page has a unique angle.

### Pages to Create

**`app/guides/page.js`** — Hub page `/guides`
```
Title: "AI Prompt Engineering Guides | ScoreMyPrompt"
Content: Card grid linking to individual guides
```

**`app/guides/[slug]/page.js`** — Individual guide pages
```
Slugs and titles:

1. /guides/how-to-write-better-ai-prompts
   "How to Write Better AI Prompts: Complete Guide (2025)"
   Target: "how to write AI prompts" (2.4K monthly searches)

2. /guides/chatgpt-prompt-tips
   "15 ChatGPT Prompt Tips That Actually Work"
   Target: "chatgpt prompt tips" (5.1K monthly searches)

3. /guides/prompt-engineering-for-beginners
   "Prompt Engineering for Beginners: Start Here"
   Target: "prompt engineering for beginners" (3.8K monthly searches)

4. /guides/prompt-engineering-for-marketers
   "Prompt Engineering for Marketers: Templates & Strategies"
   Target: "AI prompts for marketing" (1.9K monthly searches)

5. /guides/prompt-engineering-for-designers
   "AI Prompt Guide for Designers: Midjourney, DALL-E & More"
   Target: "AI prompts for designers" (2.1K monthly searches)

6. /guides/prompt-score-framework
   "The PROMPT Score Framework: How We Grade Your Prompts"
   Target: "prompt scoring" / brand authority page

Each page:
- 1,500-2,000 words of original content
- Internal CTAs: "Score your prompt now →" (links to /)
- Schema markup: Article type
- OG images per page
- Related guides sidebar
```

### Implementation Pattern
```jsx
// app/guides/[slug]/page.js
// generateStaticParams() → list of all slugs
// generateMetadata() → per-page SEO meta
// Content stored in: app/guides/content/ as MDX or JSON
// ISR revalidation: 86400 (daily)
```

---

## 7. Additional Components

### 7a. Upgrade CTA Banner (`app/components/UpgradeBanner.jsx`)
```
Shown to Free users after 8th analysis of the day
"You've used 8 of 10 free analyses today. Go Pro for unlimited."
[Upgrade to Pro →]
Dismissible, but reappears next session
```

### 7b. Toast Notification System (`app/components/Toast.jsx`)
```
Global toast for: copy success, share success, error messages, upgrade prompts
Position: bottom-right
Auto-dismiss: 3 seconds
Types: success (green), error (red), info (blue), warning (amber)
```

### 7c. User Dashboard (`app/dashboard/page.js`)
```
Route: /dashboard
Auth: Free + Pro

Sections:
- My Stats: total analyses, best score, average score, favorite job role
- Score Trend: line chart (last 30 days)
- Recent Analyses: last 10 with quick re-analyze
- Pro section: manage subscription, API key (future)
```

### 7d. Compare Mode (`app/compare/page.js`)
```
Route: /compare
Auth: Free + Pro

UI: Two textarea side-by-side
Analyze both → show comparison table
Dimensions shown in radar chart (recharts)
"Which prompt is better?" verdict from AI
```

---

## 8. File Structure (New Files to Create)

```
app/
├── lib/
│   ├── auth.js              ← Auth utility
│   ├── gate.js              ← Value gate logic
│   ├── supabase.js          ← Already exists
│   └── analytics.js         ← Already exists
├── components/
│   ├── AuthModal.jsx         ← Login modal
│   ├── AdBanner.jsx          ← Ad component
│   ├── UpgradeBanner.jsx     ← Pro upgrade CTA
│   ├── Toast.jsx             ← Notification system
│   ├── DemoMode.jsx          ← Already exists
│   ├── Leaderboard.jsx       ← Already exists
│   └── Waitlist.jsx          ← Already exists
├── pricing/
│   └── page.js               ← Pricing comparison page
├── history/
│   └── page.js               ← Analysis history
├── dashboard/
│   └── page.js               ← User dashboard
├── compare/
│   └── page.js               ← Side-by-side compare
├── pro/
│   └── success/page.js       ← Post-purchase page
├── guides/
│   ├── page.js               ← Guides hub
│   ├── [slug]/page.js        ← Individual guide
│   └── content/              ← Guide content (MDX/JSON)
├── api/
│   ├── analyze/route.js      ← Already exists
│   ├── analyze-bulk/route.js ← Bulk analysis (Pro)
│   ├── export/route.js       ← PDF export (Pro)
│   ├── auth/callback/route.js← OAuth callback
│   ├── stripe/
│   │   ├── checkout/route.js ← Create checkout
│   │   ├── webhook/route.js  ← Handle events
│   │   └── portal/route.js   ← Customer portal
│   ├── leaderboard/route.js  ← Real leaderboard data
│   └── waitlist/route.js     ← Newsletter signup
└── api/og/route.jsx           ← Already exists
```

---

## 9. Environment Variables (Complete)

```env
# ─── Required ───
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# ─── Supabase ───
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# ─── Stripe ───
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# ─── Analytics ───
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx

# ─── Ads ───
NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxx

# ─── Optional ───
NEXT_PUBLIC_BASE_URL=https://scoremyprompt.com
```

---

## 10. Implementation Priority for Claude Code

### Sprint 1 (Launch MVP) — Do First
1. `npm install && npm run dev` — verify everything works
2. Supabase project → run schema.sql
3. Connect API route to Supabase (save analyses)
4. Deploy to Vercel
5. Buy & connect scoremyprompt.com domain

### Sprint 2 (Auth + Gate) — Week 1
1. Supabase Auth setup (magic link + Google)
2. AuthModal component
3. Value Gate logic (guest 3/day, free 10/day)
4. Result page blur effect for guests
5. User profiles auto-creation

### Sprint 3 (Monetization) — Week 2
1. Pricing page
2. Stripe Checkout integration
3. Stripe Webhook handler
4. AdSense integration (3 slots)
5. Pro feature unlocks (auto-rewrite, history)

### Sprint 4 (Growth) — Week 3
1. SEO guide pages (6 pages)
2. Real leaderboard (Supabase query)
3. Waitlist API (Supabase insert)
4. Dashboard page
5. Compare mode

### Sprint 5 (Retention) — Week 4
1. Analysis history page
2. Bulk analysis (Pro)
3. PDF export (Pro)
4. Toast notifications
5. Upgrade banners

---

## 11. Revenue Projection

| Month | Users | Free | Pro ($9.99) | Ad Revenue | Total |
|-------|-------|------|-------------|------------|-------|
| 1 | 500 | 490 | 10 | $15 | $115 |
| 2 | 1,500 | 1,440 | 60 | $45 | $645 |
| 3 | 4,000 | 3,800 | 200 | $120 | $2,118 |
| 6 | 15,000 | 14,000 | 1,000 | $450 | $10,440 |

**Break-even:** Month 2-3 (API cost ~$50-150/mo)

---

## 12. Monthly Operating Cost

| Service | Free Tier | Paid Estimate |
|---------|-----------|---------------|
| Vercel | Free (hobby) | $0-20/mo |
| Claude Haiku 4.5 | Pay per use | $5-150/mo |
| Supabase | Free (500MB) | $0-25/mo |
| PostHog | Free (1M events) | $0 |
| Stripe | 2.9% + $0.30/txn | ~$30-300/mo |
| Domain | $12/year | $1/mo |
| **Total** | | **$6-496/mo** |
