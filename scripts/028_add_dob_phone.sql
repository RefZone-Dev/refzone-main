-- Add date_of_birth and phone_number columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_prompt_shown boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_agreed boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privacy_agreed_at timestamp with time zone;
