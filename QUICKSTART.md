# ScoreMyPrompt — Quick Start Guide

## 1. Install dependencies
```bash
cd scoremyprompt-app
npm install
```

## 2. Set up environment
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and add your Claude API key:
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```
> Without the API key, the app runs in **mock mode** (returns sample scores).

## 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

## 4. Deploy to Vercel
```bash
npx vercel
```
Set `ANTHROPIC_API_KEY` in Vercel dashboard → Settings → Environment Variables.

---

## Architecture Overview

```
app/
├── page.js                  # Landing page (Hero + Form + DemoMode + Leaderboard + Waitlist)
├── result/page.js           # Results page (PROMPT Score breakdown)
├── share/[id]/page.js       # Share page (OG meta tags + redirect)
├── api/
│   ├── analyze/route.js     # POST /api/analyze → Claude Haiku 4.5
│   └── og/route.jsx         # OG image generator (1200x630)
└── components/
    ├── DemoMode.jsx          # Interactive demo (Beginner/Intermediate/Advanced)
    ├── Leaderboard.jsx       # Weekly leaderboard
    └── Waitlist.jsx          # Newsletter signup
```

## PROMPT Score Framework
| Dimension | Max | What It Measures |
|-----------|-----|-----------------|
| **P** — Precision | 20 | Clarity and specificity |
| **R** — Role | 15 | AI persona assignment |
| **O** — Output Format | 15 | Format/structure specs |
| **M** — Mission Context | 20 | Background and goals |
| **P** — Structure | 15 | Organization and flow |
| **T** — Tailoring | 15 | Domain customization |
| **Total** | **100** | |

Grades: S (90+), A (80-89), B (65-79), C (50-64), D (0-49)

## API Cost
- Claude Haiku 4.5: ~$0.005-0.01 per analysis
- Rate limit: 5 requests/minute per IP
- Monthly estimate: ~$5-50 for 1,000-10,000 analyses

## Key Features
- Real-time Claude AI analysis (mock mode fallback)
- Job-role weight adjustments (Marketing, Design, Product, Finance, Freelance, Engineering)
- AI rewrite suggestion
- Interactive demo mode
- Weekly leaderboard
- Newsletter waitlist
- OG image generation for social sharing
- Rate limiting built-in
