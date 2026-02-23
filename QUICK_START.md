# ScoreMyPrompt Quick Start Guide

## 30-Second Setup

```bash
# 1. Navigate to project
cd /sessions/optimistic-brave-babbage/mnt/aiservice/scoremyprompt-app

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local

# 4. Add your API key to .env.local
# ANTHROPIC_API_KEY=your_api_key_here

# 5. Start development server
npm run dev
```

Then open http://localhost:3000 in your browser.

## Project Structure at a Glance

```
scoremyprompt-app/
├── app/
│   ├── page.js              ← Landing page (hero + form)
│   ├── layout.js            ← Root layout with metadata
│   ├── globals.css          ← Tailwind + animations
│   ├── api/
│   │   └── analyze/
│   │       └── route.js     ← POST /api/analyze endpoint
│   └── result/
│       └── page.js          ← Results visualization
├── package.json             ← Dependencies
├── tailwind.config.js       ← Dark theme colors
└── .env.example             ← Environment template
```

## Key Pages

### Landing Page (`app/page.js`)
- Hero section with gradient text
- Job role selector (Marketing, Design, Product, Finance, Freelance, Other)
- Prompt textarea input
- "Analyze My Prompt" button
- Example prompts to try
- Social proof stats

### Results Page (`app/result/page.js`)
- Circular PROMPT Score (0-100)
- 6 dimension breakdown (P-R-O-M-P-T)
- Strengths and improvements
- Actionable suggestions
- Share functionality
- Join PromptTribe CTA

## API Endpoint

### POST /api/analyze

**Request:**
```json
{
  "prompt": "Your prompt text here",
  "jobRole": "Marketing"
}
```

**Response:**
```json
{
  "overallScore": 76,
  "dimensions": {
    "precision": { "score": 82, "feedback": "..." },
    "relevance": { "score": 78, "feedback": "..." },
    "organization": { "score": 74, "feedback": "..." },
    "methodology": { "score": 72, "feedback": "..." },
    "personalization": { "score": 76, "feedback": "..." },
    "timeframe": { "score": 72, "feedback": "..." }
  },
  "strengths": [...],
  "improvements": [...],
  "scoreLevel": "Great",
  "suggestions": "..."
}
```

## Color Palette

- **Primary Blue**: `#3b82f6`
- **Accent Purple**: `#8b5cf6`
- **Dark Background**: `#0a0f1a`
- **Surface**: `#0f172a`
- **Border**: `#1e293b`

## Important: Adding Claude API

The mock endpoint currently returns a hardcoded response. To integrate the actual Claude API:

### 1. Install SDK
```bash
npm install @anthropic-ai/sdk
```

### 2. Update `app/api/analyze/route.js`

Replace this:
```javascript
// Mock PROMPT Score result for demonstration
const mockResult = {
  overallScore: 76,
  // ...
};
return Response.json(mockResult, { status: 200 });
```

With this:
```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: PROMPT_SCORE_SYSTEM,
  messages: [
    {
      role: 'user',
      content: `Analyze this prompt from a ${jobRole} professional:\n\n${prompt}`,
    },
  ],
});

const result = JSON.parse(message.content[0].text);
return Response.json(result, { status: 200 });
```

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Add `ANTHROPIC_API_KEY` in environment variables
4. Deploy!

## Troubleshooting

**Port 3000 already in use:**
```bash
npm run dev -- -p 3001
```

**Environment variable not working:**
```bash
# Make sure you created .env.local (not .env)
cat .env.local
```

**Build errors:**
```bash
rm -rf .next
npm run build
```

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Project Files

### Configuration (9 files)
- `package.json` - Dependencies
- `next.config.js` - Next.js config
- `tailwind.config.js` - Tailwind setup
- `postcss.config.js` - CSS processing
- `jsconfig.json` - Path aliases
- `.eslintrc.json` - Linting rules
- `.env.example` - Environment template
- `.gitignore` - Git exclusions
- `STRUCTURE.txt` - File structure

### Application (3 files)
- `app/page.js` - Landing page (680 lines)
- `app/result/page.js` - Results page (337 lines)
- `app/api/analyze/route.js` - API endpoint (150 lines)
- `app/layout.js` - Root layout
- `app/globals.css` - Global styles

### Documentation (4 files)
- `README.md` - Full documentation
- `PROJECT_SUMMARY.md` - Overview
- `CHECKLIST.md` - Completion tracking
- `QUICK_START.md` - This file

## Features

- ✅ Dark theme design
- ✅ Responsive mobile layout
- ✅ PROMPT Score framework (6 dimensions)
- ✅ Job role-based analysis
- ✅ Benchmark comparison
- ✅ Share functionality
- ✅ Example prompts
- ✅ Social proof stats
- ✅ Error handling
- ✅ Loading states
- ✅ No signup required
- ✅ Production-ready code

## Next Steps

1. Run `npm install`
2. Create `.env.local` with your API key
3. Run `npm run dev`
4. Test the landing page
5. Integrate Claude API
6. Deploy to production

## Support

See README.md for full documentation, or check CHECKLIST.md to verify all features.

---

Ready to analyze prompts? Let's go! 🚀
