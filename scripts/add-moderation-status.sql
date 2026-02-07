-- Add moderation status to forum_posts
ALTER TABLE forum_posts
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS moderation_reason TEXT;

-- Create index for faster moderation queries
CREATE INDEX IF NOT EXISTS idx_forum_posts_moderation ON forum_posts(moderation_status);

-- Update RLS policy to only show approved posts (or user's own posts)
DROP POLICY IF EXISTS "Anyone can view forum posts" ON forum_posts;

CREATE POLICY "Users can view approved posts or own posts" ON forum_posts
FOR SELECT USING (
  moderation_status = 'approved' 
  OR auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);
