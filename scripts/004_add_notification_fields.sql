-- Add notification preference fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS daily_scenario_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS weekly_quiz_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS reminder_notifications BOOLEAN DEFAULT TRUE;
