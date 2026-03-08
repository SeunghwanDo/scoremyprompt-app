-- Migration 002: Performance indexes
-- Composite indexes for common query patterns

-- Dashboard: user analyses sorted by date (trend + recent queries)
CREATE INDEX IF NOT EXISTS idx_analyses_user_created
  ON analyses(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

-- Leaderboard: weekly top scores by role
CREATE INDEX IF NOT EXISTS idx_analyses_score_created
  ON analyses(overall_score DESC, created_at ASC)
  WHERE overall_score >= 50;

-- Share page lookups
CREATE INDEX IF NOT EXISTS idx_analyses_share_lookup
  ON analyses(share_id)
  INCLUDE (overall_score, grade, job_role, prompt_preview, result_json)
  WHERE share_id IS NOT NULL;

-- User profiles: Stripe customer lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe
  ON user_profiles(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- Daily stats: date range queries for admin dashboard
CREATE INDEX IF NOT EXISTS idx_daily_stats_date_range
  ON daily_stats(date DESC);

-- Analyses: anonymous user tracking
CREATE INDEX IF NOT EXISTS idx_analyses_anon_created
  ON analyses(anonymous_id, created_at DESC)
  WHERE anonymous_id IS NOT NULL;
