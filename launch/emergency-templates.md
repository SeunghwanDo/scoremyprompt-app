# Emergency Response Templates — D-Day

## 🔴 Server Down
**X/Social:**
> We're experiencing high traffic right now! 🚀 Our servers are working overtime.
> Working on it — try again in 5 minutes.
> Follow this thread for updates.

**In-app (maintenance page auto-activates via MAINTENANCE_MODE=true):**
Set `MAINTENANCE_MODE=true` in Vercel → Environment Variables → Redeploy

## 🟡 Slow Site / Timeout
**X/Social:**
> Lots of prompts being scored right now! 📈 Bear with us — response times might be a bit longer than usual.
> Tip: Shorter prompts grade faster. We're scaling up!

## 🔵 Bug Report
**X/Social:**
> Thanks for catching this! 🙏 We're looking into it right now.
> DM us the details and we'll get it fixed ASAP.

**Follow-up (after fix):**
> Fixed! Thanks to [username] for the heads-up. Your prompts should score correctly now. 🎯

## 🟢 Claude API Outage
**X/Social:**
> Our AI grading engine is temporarily down for maintenance.
> We'll be back shortly — your prompts will still be here when we return! 🔧

**In-app:** Health endpoint auto-detects → error boundary shows graceful message

## 📊 Positive Response Templates
**First user share:**
> 🎉 Love seeing this! What dimension surprised you the most?

**High score:**
> 🏆 Impressive! You're in the top 5% of prompt engineers we've scored. Keep it up!

**Low score (encouraging):**
> Great first step! 💪 Check out our free guides to boost your score: scoremyprompt.com/guides

**Feature request:**
> Great idea! 🎯 We're building in public — added to our roadmap. Follow for updates!

## ⚡ Quick Actions
| Situation | Action |
|---|---|
| Vercel down | Check vercel.com/status + team Slack |
| API timeout > 30s | Enable MAINTENANCE_MODE, investigate |
| Sentry spike | Check error dashboard, hotfix or rollback |
| Reddit backlash | Respond humbly, accept feedback, don't delete |
| OG image broken | Check /api/og endpoint, verify vercel.json cache |
