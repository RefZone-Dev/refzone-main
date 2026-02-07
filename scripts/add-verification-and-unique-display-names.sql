-- Add unique constraint to display_name and add verification fields
ALTER TABLE profiles 
ADD CONSTRAINT unique_display_name UNIQUE (display_name);

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_requested_at TIMESTAMP WITH TIME ZONE;

-- Store friend request ID in notifications for accepting/declining
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS related_friendship_id UUID REFERENCES friendships(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(is_verified, verification_requested);
