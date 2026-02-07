-- Add has_set_username column to profiles to track if user has explicitly chosen a username
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_set_username BOOLEAN DEFAULT FALSE;

-- Mark all existing users who have a display_name that doesn't look like an email part as having set their username
UPDATE public.profiles SET has_set_username = TRUE WHERE display_name IS NOT NULL AND display_name != '' AND display_name NOT LIKE '%@%';
