-- ScoreMyPrompt Database Schema
-- Step 5: Row Level Security (RLS)
-- Run this in Supabase SQL Editor (after 01_tables.sql)

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- === analyses policies ===

CREATE POLICY "Public can read shared analyses"
  ON analyses FOR SELECT
  USING (share_id IS NOT NULL);

CREATE POLICY "Users can read own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert analyses"
  ON analyses FOR INSERT
  WITH CHECK (true);

-- === waitlist policies ===

CREATE POLICY "Service can manage waitlist"
  ON waitlist FOR ALL
  USING (true)
  WITH CHECK (true);

-- === user_profiles policies ===

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service can manage profiles"
  ON user_profiles FOR ALL
  USING (true)
  WITH CHECK (true);
