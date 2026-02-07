-- Add new_quiz_notifications column to profiles table
-- This replaces daily_scenario_notifications and weekly_quiz_notifications

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS new_quiz_notifications BOOLEAN DEFAULT true;

-- Update existing users to have this enabled by default
UPDATE profiles SET new_quiz_notifications = true WHERE new_quiz_notifications IS NULL;
