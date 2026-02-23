-- ScoreMyPrompt Database Schema
-- Step 2: Functions
-- Run this in Supabase SQL Editor (after 01_tables.sql)

-- Refresh leaderboard materialized view
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_weekly;
END;
$$ LANGUAGE plpgsql;

-- Generate a short share ID
CREATE OR REPLACE FUNCTION generate_share_id()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Increment share count
CREATE OR REPLACE FUNCTION increment_share_count(analysis_share_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE analyses
  SET share_count = share_count + 1
  WHERE share_id = analysis_share_id;
END;
$$ LANGUAGE plpgsql;

-- Get role percentile (last 30 days)
CREATE OR REPLACE FUNCTION get_role_percentile(p_score INT, p_job_role TEXT)
RETURNS INT AS $$
DECLARE
  total_count INT;
  below_count INT;
BEGIN
  SELECT COUNT(*) INTO total_count
  FROM analyses
  WHERE job_role = p_job_role
    AND created_at >= now() - INTERVAL '30 days';

  IF total_count = 0 THEN
    RETURN 50;
  END IF;

  SELECT COUNT(*) INTO below_count
  FROM analyses
  WHERE job_role = p_job_role
    AND overall_score < p_score
    AND created_at >= now() - INTERVAL '30 days';

  RETURN LEAST(99, GREATEST(1, (below_count * 100 / total_count)));
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
