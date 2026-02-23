-- ScoreMyPrompt Database Schema
-- Step 6: Indexes
-- Run this in Supabase SQL Editor (after 01_tables.sql)

-- analyses indexes
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_overall_score ON analyses(overall_score DESC);
CREATE INDEX idx_analyses_job_role ON analyses(job_role);
CREATE INDEX idx_analyses_grade ON analyses(grade);
CREATE INDEX idx_analyses_share_id ON analyses(share_id) WHERE share_id IS NOT NULL;
CREATE INDEX idx_analyses_user_id ON analyses(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_analyses_anonymous_id ON analyses(anonymous_id) WHERE anonymous_id IS NOT NULL;

-- waitlist indexes
CREATE INDEX idx_waitlist_email ON waitlist(email);
