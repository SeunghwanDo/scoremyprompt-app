-- ScoreMyPrompt Database Schema
-- Step 3: Triggers
-- Run this in Supabase SQL Editor (after 02_functions.sql)

-- Auto-create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
