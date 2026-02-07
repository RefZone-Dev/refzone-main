-- Add tutorial_completed column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tutorial_completed boolean DEFAULT false;

-- Update existing users to have tutorial completed (they're not new)
UPDATE profiles SET tutorial_completed = true WHERE tutorial_completed IS NULL;
