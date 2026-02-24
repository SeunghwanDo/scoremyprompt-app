# ScoreMyPrompt D-Day Launch Checklist
## D-Day: March 1 (Sunday) — All times EST

---

### ✅ Pre-Launch (Completed by D-1)
- [ ] Vercel production deployed and accessible
- [ ] All env vars set (Anthropic, Supabase, Stripe, PostHog, Sentry)
- [ ] `node scripts/go-nogo-check.js https://scoremyprompt.com` → ALL PASS
- [ ] OG image tested on X Card Validator
- [ ] OG image tested on LinkedIn Post Inspector
- [ ] X @scoremyprompt account ready (profile, header, bio, website)
- [ ] LinkedIn company page ready
- [ ] YouTube channel ready
- [ ] Bluesky account ready
- [ ] X tweets #1-#3 natively scheduled
- [ ] LinkedIn post #1 natively scheduled
- [ ] YouTube long-form uploaded + scheduled
- [ ] YouTube Shorts #1 uploaded + scheduled
- [ ] Emergency templates bookmarked
- [ ] PostHog dashboard open in browser tab

---

### 🚀 D-Day Sequence (EST)

**7:00 AM — Health Check**
- [ ] Visit `https://scoremyprompt.com/api/health` → status: "ok"
- [ ] Test full flow: homepage → enter prompt → get score → share page
- [ ] Mobile test: iOS Safari + Android Chrome

**8:00 AM — Monitoring Start**
- [ ] PostHog real-time dashboard OPEN
- [ ] Sentry alerts dashboard OPEN
- [ ] X @scoremyprompt notifications ON

**9:00 AM — Launch Tweet #1 Goes Live** ⚡
- [ ] Verify tweet published and link clickable
- [ ] Click the link yourself — confirm it works
- [ ] Like + retweet from personal account

**9:05 AM — Post-Launch Verify**
- [ ] PostHog: page_view events appearing?
- [ ] Sentry: any errors?
- [ ] OG card preview looks correct in tweet?

**10:00 AM — LinkedIn Post Goes Live**
- [ ] Verify post published
- [ ] React from personal LinkedIn account

**10:30 AM — YouTube Long-form Goes Live**
- [ ] Verify video is public and playable
- [ ] Title, description, tags all correct

**11:00 AM — Bluesky Manual Post**
- [ ] Post launch message from Bluesky app
- [ ] Verify link works

**1:00 PM — Tweet #2 (Score Card Visual)**
- [ ] Verify auto-published
- [ ] Engage with any early replies

**2:00 PM — YouTube Shorts #1 Goes Live**
- [ ] Verify published
- [ ] Check TikTok repost (if ready)

**3:00 PM — First Engagement Round**
- [ ] Reply to all X mentions
- [ ] Reply to LinkedIn comments
- [ ] Reply to YouTube comments

**6:00 PM — Day 1 Report**
- [ ] PostHog: total page views
- [ ] PostHog: total grades completed
- [ ] PostHog: share clicks
- [ ] PostHog: waitlist signups
- [ ] Sentry: error count
- [ ] Screenshot PostHog dashboard → team share

---

### 📊 D-Day Success Metrics
| Metric | Target | Actual |
|---|---|---|
| Page Views | 100-300 | |
| Grades Completed | 30-100 | |
| Share Clicks | 10-30 | |
| Waitlist Signups | 5-20 | |
| X Impressions | 500-2000 | |
| X Followers | 10-30 | |

---

### 🚨 Emergency Procedures
| Issue | Action |
|---|---|
| Site down | Set `MAINTENANCE_MODE=true` in Vercel env vars → Redeploy |
| API timeout | Check Vercel function logs, consider edge migration |
| OG broken | Test `/api/og` directly, check vercel.json headers |
| Zero traffic | Normal for Day 1 — Reddit D+2, PH D+14 are real sources |
