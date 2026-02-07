-- Add pwa_installed field to profiles table to track PWA installation status
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS pwa_installed BOOLEAN DEFAULT false;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_pwa_installed ON profiles(pwa_installed);
