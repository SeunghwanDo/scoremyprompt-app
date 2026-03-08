/**
 * Centralized UI messages for consistent microcopy across the app.
 * All user-facing strings should be referenced from here.
 */

// ─── Validation ─────────────────────────────────────────────────────
export const VALIDATION = {
  PROMPT_EMPTY: 'Please enter a prompt to analyze.',
  PROMPT_TOO_SHORT: 'Your prompt needs to be at least 10 characters.',
  EMAIL_EMPTY: 'Please enter your email address.',
  EMAIL_INVALID: 'Please enter a valid email address.',
  BOTH_PROMPTS_REQUIRED: 'Please enter both prompts.',
  BOTH_PROMPTS_MIN_LENGTH: 'Both prompts need to be at least 10 characters.',
  BULK_MIN_PROMPT: 'Enter at least one prompt (minimum 10 characters each).',
} as const;

// ─── Errors ─────────────────────────────────────────────────────────
export const ERRORS = {
  GENERIC: 'Something went wrong. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  ANALYZE_FAILED: 'Failed to analyze prompt. Please try again.',
  ANALYZE_GENERIC: 'An error occurred while analyzing your prompt. Please try again.',
  COMPARE_FAILED: 'Failed to analyze prompts. Please try again.',
  COMPARE_GENERIC: 'An error occurred while comparing prompts. Please try again.',
  BULK_FAILED: 'Analysis failed. Please try again.',
  BULK_GENERIC: 'An error occurred. Please try again.',
  DASHBOARD_LOAD: 'Failed to load dashboard. Please try again.',
  LEADERBOARD_LOAD: 'Could not load leaderboard. Please try again later.',
  AUTH_FAILED: 'Failed to sign in. Please try again.',
  AUTH_GOOGLE_FAILED: 'Failed to sign in with Google. Please try again.',
  CHECKOUT_FAILED: 'Failed to initiate checkout. Please try again.',
  PORTAL_FAILED: 'Failed to open billing portal. Please try again.',
  SUBSCRIBE_FAILED: 'Failed to subscribe. Please try again.',
  EXPORT_FAILED: 'Failed to export report. Please try again.',
  SHARE_FAILED: 'Please try again.',
} as const;

// ─── Loading States ─────────────────────────────────────────────────
export const LOADING = {
  ANALYZING: 'Analyzing with AI...',
  DASHBOARD: 'Loading dashboard...',
  DASHBOARD_DATA: 'Loading your data...',
  HISTORY: 'Loading history...',
  HISTORY_DATA: 'Loading analyses...',
  CHALLENGE: 'Loading challenge...',
  AUTH_SENDING: 'Sending...',
  SUBSCRIBING: 'Subscribing...',
  JOINING: 'Joining...',
  EXPORTING: 'Exporting...',
} as const;

// ─── Empty States ───────────────────────────────────────────────────
export const EMPTY = {
  DASHBOARD_TITLE: 'No analyses yet',
  DASHBOARD_DESC: 'Score your first prompt to start tracking your progress.',
  HISTORY_TITLE: 'No analyses yet',
  HISTORY_DESC: 'Score your first prompt to start building your history.',
  LEADERBOARD_NO_ENTRIES: (role: string) => `No entries found for ${role}.`,
  LEADERBOARD_CTA: 'Be the first to submit a prompt and claim the top spot!',
} as const;

// ─── Auth Messages ──────────────────────────────────────────────────
export const AUTH = {
  SIGN_IN_FEATURES: 'Sign in to unlock all features and save your history.',
  SIGN_IN_DIMENSIONS: 'Sign up free to unlock all 6 dimension insights.',
  SIGN_IN_DASHBOARD: 'Sign in to view your dashboard.',
  SIGN_IN_HISTORY: 'Sign in to view your analysis history.',
  SIGN_IN_BULK: 'Sign in to analyze multiple prompts at once.',
  MAGIC_LINK_HINT: "No password needed. We'll send you a login link.",
  CHECK_EMAIL_TITLE: 'Check your email!',
  CHECK_EMAIL_DESC: "We've sent you a login link. Click it to sign in to ScoreMyPrompt.",
  SUBSCRIBED_SUCCESS: "You're in! Check your inbox.",
} as const;

// ─── Placeholders ───────────────────────────────────────────────────
export const PLACEHOLDERS = {
  PROMPT_INPUT: 'Paste your AI prompt here to get a free score with improvement tips...',
  PROMPT_BULK: 'Enter your prompt here (minimum 10 characters)...',
  PROMPT_COMPARE_A: 'Paste your first prompt here...',
  PROMPT_COMPARE_B: 'Paste your second prompt here...',
  EMAIL: 'your@email.com',
} as const;

// ─── Hints & Helper Text ────────────────────────────────────────────
export const HINTS = {
  PROMPT_MIN_CHARS: 'Min 10 characters',
  NO_SPAM: 'No spam. Unsubscribe anytime.',
  FREE_NO_SIGNUP: 'Free, no signup required.',
  BULK_LIMIT: 'Analyze up to 5 prompts at once.',
  PRO_REQUIRED_BULK: 'This feature requires a Pro subscription.',
} as const;

// ─── CTA Button Labels ─────────────────────────────────────────────
export const CTA = {
  SCORE_PROMPT_FREE: 'Score My Prompt — Free',
  SCORE_FIRST_PROMPT: 'Score My First Prompt',
  ANALYZE_ANOTHER: 'Analyze Another Prompt',
  SCORE_A_PROMPT: 'Score a Prompt',
  TRY_AGAIN: 'Try Again',
  GO_HOME: 'Go Home',
  SEND_MAGIC_LINK: 'Send Magic Link',
  SUBSCRIBE: 'Subscribe',
  START_FREE_TRIAL: 'Start Free Trial',
  VIEW_PLANS: 'View Plans',
  LOAD_MORE: 'Load More',
} as const;
