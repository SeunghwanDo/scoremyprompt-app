import type { JobRole } from '../types';

export interface PromptTemplate {
  id: string;
  title: string;
  jobRole: JobRole;
  prompt: string;
  score: number;
  grade: string;
  description: string;
  tags: string[];
}

export const TEMPLATES: PromptTemplate[] = [
  // Marketing (3)
  {
    id: 'mkt-1',
    title: 'Go-to-Market Strategy',
    jobRole: 'Marketing',
    prompt: 'You are a senior growth marketer with 10+ years of SaaS experience. Create a comprehensive go-to-market strategy for a new B2B project management tool targeting small businesses (10-50 employees) in the US market. Include: 1) Target persona analysis with demographics, psychographics, and pain points, 2) Positioning statement using the "For [target], [product] is [category] that [key benefit] unlike [competitor] because [reason]" framework, 3) Pricing strategy with 3 tiers and justification, 4) A 90-day launch plan with weekly milestones and KPIs. Format as a structured document with an executive summary.',
    score: 92,
    grade: 'S',
    description: 'Complete GTM strategy framework with persona analysis, positioning, pricing, and a 90-day launch roadmap.',
    tags: ['SaaS', 'B2B', 'launch', 'strategy'],
  },
  {
    id: 'mkt-2',
    title: 'Email Drip Campaign',
    jobRole: 'Marketing',
    prompt: 'Act as an email marketing specialist who has managed campaigns with 40%+ open rates. Design a 5-email nurture sequence for SaaS trial users who signed up but haven\'t activated their account within 3 days. For each email provide: subject line (A/B variants), preview text, body copy (under 150 words), CTA button text, and optimal send timing. The tone should be helpful, not pushy. Include personalization variables like {{first_name}} and {{company_name}}. Output as a numbered list with clear formatting for each email.',
    score: 88,
    grade: 'A',
    description: 'High-converting 5-email nurture sequence for SaaS trial activation with A/B subject lines.',
    tags: ['email', 'nurture', 'SaaS', 'activation'],
  },
  {
    id: 'mkt-3',
    title: 'Content Calendar Generator',
    jobRole: 'Marketing',
    prompt: 'You are a content strategist managing a B2B fintech blog targeting CFOs and finance leaders. Create a 4-week content calendar with 3 posts per week (12 total). For each post, include: title, target keyword (with estimated monthly search volume), content type (how-to, listicle, thought leadership, case study), word count target, internal linking opportunities, and a 2-sentence outline. Organize by week with a mix of top-of-funnel and bottom-of-funnel content. Output as a markdown table.',
    score: 85,
    grade: 'A',
    description: 'Strategic 4-week B2B content calendar with SEO keywords, content types, and linking strategy.',
    tags: ['content', 'SEO', 'B2B', 'fintech'],
  },

  // Design (3)
  {
    id: 'des-1',
    title: 'Mobile App Onboarding Flow',
    jobRole: 'Design',
    prompt: 'As a senior UX designer with expertise in mobile-first design, create a detailed onboarding flow for a personal finance app targeting millennials (25-35). Design 4 onboarding screens with: 1) Screen layout description (header, body, footer areas), 2) Copy for headline and body text (under 20 words each), 3) Visual elements (illustrations, icons, animations), 4) Interaction pattern (swipe, tap, skip options), 5) Accessibility considerations (contrast, font size, screen reader labels). Follow iOS HIG and Material Design 3 guidelines. Include a progress indicator pattern and skip-to-main option. Output as detailed wireframe specifications.',
    score: 90,
    grade: 'S',
    description: 'Detailed mobile onboarding wireframe specs with accessibility, copy, and interaction patterns.',
    tags: ['mobile', 'onboarding', 'UX', 'fintech'],
  },
  {
    id: 'des-2',
    title: 'Design System Component Spec',
    jobRole: 'Design',
    prompt: 'You are a design systems lead at a enterprise SaaS company. Create a comprehensive component specification for a "DataTable" component that needs to support: sorting, filtering, pagination, row selection, inline editing, and responsive behavior. Include: 1) Component anatomy with all sub-components, 2) Props/variants table (size: sm/md/lg, density: compact/default/comfortable), 3) State definitions (default, hover, selected, loading, empty, error), 4) Accessibility requirements (ARIA roles, keyboard navigation, screen reader announcements), 5) Responsive breakpoint behavior. Format as a design specification document with sections.',
    score: 87,
    grade: 'A',
    description: 'Enterprise-grade DataTable component specification with variants, states, and accessibility.',
    tags: ['design system', 'component', 'enterprise', 'accessibility'],
  },
  {
    id: 'des-3',
    title: 'User Research Interview Guide',
    jobRole: 'Design',
    prompt: 'Act as a UX researcher planning a discovery study for a healthcare appointment booking platform. Create a 30-minute semi-structured interview guide for 8 participants (patients aged 30-60). Include: 1) 3 warm-up questions, 2) 5 core questions exploring current booking behavior and pain points, 3) 3 concept testing questions for a new AI-powered scheduling feature, 4) 2 closing questions. For each question, add follow-up probes and note what insight it maps to. Include a facilitator script for introduction and consent. Output with timing estimates per section.',
    score: 84,
    grade: 'A',
    description: 'Semi-structured interview guide with probes, consent script, and insight mapping.',
    tags: ['research', 'interview', 'healthcare', 'discovery'],
  },

  // Product (3)
  {
    id: 'prod-1',
    title: 'PRD for AI Feature',
    jobRole: 'Product',
    prompt: 'You are a senior product manager at a B2B analytics platform. Write a Product Requirements Document (PRD) for an "AI Insights" feature that automatically generates weekly business insights from user data. Structure the PRD with: 1) Problem statement with user quotes, 2) Success metrics (north star + 3 supporting metrics), 3) User stories in "As a [role], I want [action] so that [benefit]" format (5 stories), 4) Functional requirements with priority (P0/P1/P2), 5) Non-functional requirements (performance, security, data privacy), 6) Out of scope items, 7) Launch plan (alpha/beta/GA). Target audience: data analysts and business leaders at companies with 100-500 employees.',
    score: 91,
    grade: 'S',
    description: 'Complete PRD with user stories, success metrics, requirements prioritization, and launch plan.',
    tags: ['PRD', 'AI', 'B2B', 'analytics'],
  },
  {
    id: 'prod-2',
    title: 'Feature Prioritization Framework',
    jobRole: 'Product',
    prompt: 'Act as a VP of Product managing a backlog of 20+ feature requests. Create a prioritization framework that combines RICE scoring (Reach, Impact, Confidence, Effort) with strategic alignment. For the following 6 features, calculate a composite priority score and rank them: 1) SSO integration, 2) Mobile app, 3) API v2, 4) Dashboard redesign, 5) Bulk import tool, 6) Real-time collaboration. For each feature, estimate RICE components on a 1-10 scale, add a strategic alignment multiplier (0.5-2.0), and calculate the final score. Output as a ranked table with reasoning for each score.',
    score: 86,
    grade: 'A',
    description: 'RICE + strategic alignment prioritization framework with scored feature ranking.',
    tags: ['prioritization', 'RICE', 'roadmap', 'strategy'],
  },
  {
    id: 'prod-3',
    title: 'Competitive Analysis Matrix',
    jobRole: 'Product',
    prompt: 'You are a product strategist analyzing the project management tool market. Create a competitive analysis matrix comparing 4 products: Asana, Monday.com, ClickUp, and Linear. Evaluate across these dimensions: 1) Core features (task management, timeline, automation, reporting), 2) Target market and pricing, 3) Integrations ecosystem, 4) UX complexity score (1-10), 5) Best for use case. For each dimension, rate on a 1-5 scale. Identify 3 market gaps and 2 differentiation opportunities for a new entrant. Output as a comparison table followed by strategic recommendations.',
    score: 83,
    grade: 'A',
    description: 'Structured competitive matrix with gap analysis and differentiation opportunities.',
    tags: ['competitive analysis', 'market research', 'strategy'],
  },

  // Finance (3)
  {
    id: 'fin-1',
    title: 'Quarterly Financial Review',
    jobRole: 'Finance',
    prompt: 'Act as a CFO advisor analyzing a SaaS company\'s quarterly performance. Given these metrics — Revenue: $2.4M (+12% QoQ), COGS: 45%, OpEx: $1.1M, ARR: $9.2M, Net Revenue Retention: 108%, CAC: $450, LTV: $5,400, Runway: 18 months — provide: 1) Executive summary (3 bullet points), 2) 5 key findings with trend analysis, 3) Unit economics health check (LTV/CAC ratio, payback period, magic number), 4) Cash flow improvement recommendations (3 actionable items with expected impact), 5) Risk factors for Q4 considering seasonal trends. Format with clear headers, use bold for critical numbers.',
    score: 89,
    grade: 'A',
    description: 'Comprehensive quarterly review with unit economics, cash flow recommendations, and risk analysis.',
    tags: ['SaaS metrics', 'financial analysis', 'CFO', 'quarterly review'],
  },
  {
    id: 'fin-2',
    title: 'Financial Model Assumptions',
    jobRole: 'Finance',
    prompt: 'You are a financial analyst building a 3-year revenue projection model for a Series A SaaS startup. Current state: $500K ARR, 50 customers, $10K ACV, 5% monthly churn, 20% annual price increase planned. Define and justify assumptions for: 1) Customer acquisition rate by quarter (consider sales team scaling), 2) Expansion revenue from existing customers, 3) Churn scenarios (optimistic/base/pessimistic), 4) Pricing tier migration patterns, 5) Seasonality adjustments. For each assumption, provide the number, rationale, and sensitivity range. Output as a structured assumptions document suitable for a board presentation.',
    score: 85,
    grade: 'A',
    description: '3-year SaaS financial model assumptions with sensitivity ranges and board-ready formatting.',
    tags: ['financial model', 'SaaS', 'Series A', 'projections'],
  },
  {
    id: 'fin-3',
    title: 'Budget Variance Analysis',
    jobRole: 'Finance',
    prompt: 'Act as a FP&A manager. Analyze the following budget vs. actual variances for Q3 and create a variance report: Marketing spend: budgeted $200K, actual $245K (+22%); Engineering: budgeted $400K, actual $380K (-5%); Sales: budgeted $150K, actual $175K (+17%); G&A: budgeted $100K, actual $95K (-5%). Total revenue was 8% above forecast. For each line item: 1) Calculate dollar and percentage variance, 2) Classify as favorable/unfavorable, 3) Provide root cause analysis, 4) Recommend corrective action if unfavorable. Include a summary table and an overall assessment of budget discipline. Output in a professional report format.',
    score: 82,
    grade: 'A',
    description: 'Professional budget variance report with root cause analysis and corrective recommendations.',
    tags: ['budget', 'variance', 'FP&A', 'reporting'],
  },

  // Freelance (3)
  {
    id: 'free-1',
    title: 'Client Proposal Template',
    jobRole: 'Freelance',
    prompt: 'You are a freelance consultant who has won $500K+ in project bids. Write a compelling project proposal for a website redesign project. The client is a mid-size e-commerce company doing $2M/year wanting to improve conversion rates. Include: 1) Project understanding section showing you researched their pain points, 2) Proposed solution with 3 phases (audit, design, development), 3) Deliverables list with timeline, 4) Investment section with 3 pricing options (good/better/best), 5) Why choose me section with relevant social proof, 6) Next steps with a clear CTA. Keep the tone confident but not arrogant. Total length: under 800 words.',
    score: 88,
    grade: 'A',
    description: 'Winning freelance proposal with 3-tier pricing, phased deliverables, and persuasive structure.',
    tags: ['proposal', 'client', 'web design', 'e-commerce'],
  },
  {
    id: 'free-2',
    title: 'Discovery Call Script',
    jobRole: 'Freelance',
    prompt: 'Act as a freelance business coach. Create a 20-minute discovery call script for freelancers selling website development services to small business owners. Structure with: 1) Opening (build rapport, set agenda — 2 min), 2) Discovery questions to uncover budget, timeline, and decision process — 8 min, 3) Pain point amplification questions — 3 min, 4) Brief solution overview tailored to their answers — 4 min, 5) Close with next steps and booking proposal call — 3 min. For each section, provide exact phrases, transition sentences, and notes on tone. Include objection handling for "I need to think about it" and "That\'s too expensive."',
    score: 84,
    grade: 'A',
    description: 'Structured discovery call script with exact phrases, transitions, and objection handling.',
    tags: ['sales', 'discovery call', 'freelance', 'web development'],
  },
  {
    id: 'free-3',
    title: 'LinkedIn Profile Optimization',
    jobRole: 'Freelance',
    prompt: 'You are a personal branding expert who has helped 200+ freelancers optimize their LinkedIn presence. Rewrite my LinkedIn profile to attract high-ticket clients for UX design consulting. Current role: "UX Designer | Freelancer." Target clients: SaaS startups (Series A-B). Create: 1) Headline (under 120 chars, keyword-optimized), 2) About section (3 paragraphs: hook, proof, CTA — under 300 words), 3) Featured section suggestions (3 items), 4) Experience bullet points for top 2 roles using the CAR framework (Challenge, Action, Result), 5) Skills to endorse (top 10, ordered by priority). Include SEO keywords naturally.',
    score: 86,
    grade: 'A',
    description: 'Complete LinkedIn profile rewrite for high-ticket freelance positioning with SEO optimization.',
    tags: ['LinkedIn', 'personal branding', 'UX', 'freelance'],
  },

  // Engineering (3)
  {
    id: 'eng-1',
    title: 'System Design Document',
    jobRole: 'Engineering',
    prompt: 'You are a senior software architect designing a real-time notification system for a social media platform with 10M+ DAU. Create a system design document covering: 1) Requirements (functional and non-functional with SLAs), 2) High-level architecture diagram (describe components and data flow), 3) Technology stack choices with justification (message queue, database, caching layer), 4) API design (3 key endpoints with request/response schemas), 5) Scalability strategy (horizontal scaling, sharding, CDN), 6) Failure modes and mitigation (at least 3 scenarios), 7) Monitoring and alerting strategy. Consider WebSocket vs SSE for real-time delivery. Format with clear sections and bullet points.',
    score: 93,
    grade: 'S',
    description: 'Complete system design for real-time notifications with scalability, failure modes, and monitoring.',
    tags: ['system design', 'architecture', 'real-time', 'scalability'],
  },
  {
    id: 'eng-2',
    title: 'Code Review Checklist',
    jobRole: 'Engineering',
    prompt: 'Act as a staff engineer leading code quality initiatives. Create a comprehensive code review checklist for a TypeScript/React project that the team can reference during PR reviews. Organize by category: 1) Correctness (logic errors, edge cases, null handling), 2) Performance (re-renders, memoization, bundle size), 3) Security (XSS, injection, auth checks), 4) Maintainability (naming, DRY, complexity), 5) Testing (coverage expectations, test quality), 6) Accessibility (ARIA, keyboard nav, contrast). For each item, provide a one-line description and severity level (blocker/warning/suggestion). Include 15-20 total items. Output as a markdown checklist.',
    score: 85,
    grade: 'A',
    description: 'Comprehensive PR review checklist for TypeScript/React with severity levels and categories.',
    tags: ['code review', 'TypeScript', 'React', 'quality'],
  },
  {
    id: 'eng-3',
    title: 'Database Migration Plan',
    jobRole: 'Engineering',
    prompt: 'You are a database engineer planning a migration from PostgreSQL to a multi-region setup for a fintech application processing 50K transactions/day. Create a detailed migration plan with: 1) Pre-migration checklist (backup verification, rollback plan, stakeholder communication), 2) Schema changes needed for multi-region support (partitioning strategy, conflict resolution), 3) Data migration steps with zero-downtime approach (dual-write, shadow reads, cutover), 4) Testing phases (unit, integration, load, chaos), 5) Monitoring during migration (key metrics, alerting thresholds), 6) Rollback procedures for each phase. Include estimated timeline and team responsibilities. Format as a step-by-step runbook.',
    score: 87,
    grade: 'A',
    description: 'Zero-downtime database migration runbook with rollback procedures and testing phases.',
    tags: ['database', 'migration', 'PostgreSQL', 'fintech'],
  },

  // Other (3)
  {
    id: 'oth-1',
    title: 'Meeting Summary & Action Items',
    jobRole: 'Other',
    prompt: 'You are an executive assistant who creates clear, actionable meeting notes. Summarize the following meeting transcript into a structured format: 1) Meeting overview (date, attendees, duration, objective — 2 lines), 2) Key decisions made (numbered list, include who decided and rationale), 3) Action items table with columns: Task, Owner, Due Date, Priority (High/Medium/Low), 4) Open questions requiring follow-up, 5) Next meeting agenda suggestions (3 items). Keep the summary under 300 words. Use bullet points for quick scanning. Highlight any blockers or risks mentioned. Apply the MECE principle to ensure nothing overlaps or is missed.',
    score: 84,
    grade: 'A',
    description: 'MECE meeting summary template with decisions, action items, and follow-up tracking.',
    tags: ['meetings', 'productivity', 'action items', 'summary'],
  },
  {
    id: 'oth-2',
    title: 'Job Description Writer',
    jobRole: 'Other',
    prompt: 'Act as a talent acquisition specialist who has written job descriptions that attract 3x more qualified candidates than average. Write a job description for a "Senior Frontend Engineer" role at a Series B healthtech startup. Include: 1) A compelling opening paragraph (not generic "we\'re looking for" — tell a story), 2) What you\'ll do section (5-7 bullet points with impact, not just tasks), 3) What you bring (must-haves vs nice-to-haves, clearly separated), 4) What we offer (specific benefits, not generic "competitive salary"), 5) Our tech stack, 6) Interview process overview (4 steps with duration). Avoid jargon like "rockstar" or "ninja." Use inclusive language throughout. Under 600 words.',
    score: 82,
    grade: 'A',
    description: 'Compelling job description with inclusive language, clear requirements, and transparent process.',
    tags: ['hiring', 'job description', 'HR', 'healthtech'],
  },
  {
    id: 'oth-3',
    title: 'Process Documentation',
    jobRole: 'Other',
    prompt: 'You are a technical writer creating internal documentation for an engineering team. Document the "Incident Response Procedure" for a SaaS platform. Include: 1) Severity classification matrix (SEV1-SEV4 with examples and response times), 2) Step-by-step response workflow from detection to resolution, 3) RACI matrix for each severity level (Responsible, Accountable, Consulted, Informed), 4) Communication templates for status updates (internal Slack, external status page, customer email), 5) Post-incident review template with 5 Whys analysis, 6) Escalation paths with on-call rotation guidelines. Use clear headings, numbered steps, and decision trees where appropriate. Target audience: new engineers joining the on-call rotation.',
    score: 88,
    grade: 'A',
    description: 'Complete incident response documentation with severity matrix, RACI, and communication templates.',
    tags: ['documentation', 'incident response', 'SaaS', 'on-call'],
  },
];

export const ALL_ROLES: JobRole[] = ['Marketing', 'Design', 'Product', 'Finance', 'Freelance', 'Engineering', 'Other'];
