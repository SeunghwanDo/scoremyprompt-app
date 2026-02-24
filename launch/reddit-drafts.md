# Reddit Post Drafts — ScoreMyPrompt Launch

## Post #1: r/ChatGPT (D+2: March 3, Tue)
**Flair:** Show & Tell

### Title
I analyzed 50 ChatGPT prompts across 6 dimensions — here's what actually separates good prompts from bad ones

### Body
I've been working on a tool that grades AI prompts, and to test it I ran 50 real ChatGPT prompts through it. The results were pretty eye-opening.

**The scoring system uses 6 dimensions (PROMPT framework):**
- **P**urpose — Is the goal clear?
- **R**ole — Did you tell the AI who to be?
- **O**utput — Did you specify the format?
- **M**odifiers — Any constraints, tone, or style?
- **S**pecificity — How precise is the request?
- **T**esting — Can you iterate/improve?

**Key findings:**
- Average score: 47/100 (yikes)
- 82% of prompts scored lowest on Specificity
- The gap between a 40 and a 90 isn't creativity — it's structure
- Adding just a role + output format to a basic prompt boosted scores by 25-30 points on average

**Example:**
- Bad (scored 34): "Write me an email about our new product"
- Good (scored 89): "You are a senior B2B SaaS copywriter. Write a product launch email for [product]. Target audience: CTOs at mid-market companies. Tone: professional but conversational. Format: subject line + 3 paragraphs + CTA button text."

The tool is free, no signup required. Would love to hear what patterns you all see in your own prompts.

**Link:** scoremyprompt.com

---

## Post #2: r/PromptEngineering (D+3: March 4, Wed)

### Title
Data analysis: What makes a 90+ prompt vs a 30-point prompt (scored 50 real prompts)

### Body
I built a prompt grading tool and ran 50 real prompts through it to see what patterns emerge. Sharing the data since this community would find it interesting.

**Methodology:**
Each prompt scored on 6 dimensions (0-100 each), using Claude as the evaluation engine. Dimensions: Purpose, Role, Output format, Modifiers, Specificity, Testing potential.

**Results summary:**

| Score Range | Count | Common Pattern |
|---|---|---|
| 80-100 | 6 | All 6 dimensions addressed, specific constraints |
| 60-79 | 12 | Good purpose but missing output format or modifiers |
| 40-59 | 18 | Basic intent clear, lacks role/specificity |
| 20-39 | 14 | Google-search style, single sentence |

**Top 3 insights:**

1. **Specificity is the #1 differentiator.** 82% of low-scoring prompts were vague. "Write about X" vs "Write a 500-word analysis of X focusing on Y for audience Z" — that's easily a 30-point swing.

2. **Role assignment is underused.** Only 12% of prompts assigned a role to the AI. Those that did scored 20+ points higher on average.

3. **Output format is free points.** Simply adding "format as [bullet list / table / email]" added 10-15 points. Most people skip this entirely.

**The tool:** scoremyprompt.com — free, no signup, instant results with dimensional breakdown.

Happy to discuss methodology or share more specific examples if anyone's interested.

---

## Post #3: r/artificial (D+5: March 6, Thu) — Optional

### Title
Built a free tool to score AI prompts — sharing interesting patterns from early user data

### Body
[Shorter version of Post #1, focused on the data patterns rather than the tool itself. Lead with value, mention tool naturally at the end.]

---

## Reddit Posting Rules (IMPORTANT)
1. **Never link-spam.** Lead with genuine value and analysis.
2. **Engage authentically** in comments for 24-48 hours after posting.
3. **Don't cross-post** the same content to multiple subreddits.
4. **Wait 2-3 days** between posts on different subreddits.
5. **If a post gets removed**, don't repost. Message mods politely.
6. **Respond to criticism** humbly and constructively.
