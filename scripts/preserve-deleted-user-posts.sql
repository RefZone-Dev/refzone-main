-- Allow user_id to be nullable in forum_posts and forum_replies
-- so posts can be preserved when users are deleted

-- First, drop the existing foreign key constraint
ALTER TABLE forum_posts
DROP CONSTRAINT IF EXISTS forum_posts_user_id_fkey;

-- Make user_id nullable
ALTER TABLE forum_posts
ALTER COLUMN user_id DROP NOT NULL;

-- Re-add foreign key with ON DELETE SET NULL
ALTER TABLE forum_posts
ADD CONSTRAINT forum_posts_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Do the same for forum_replies
ALTER TABLE forum_replies
DROP CONSTRAINT IF EXISTS forum_replies_user_id_fkey;

ALTER TABLE forum_replies
ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE forum_replies
ADD CONSTRAINT forum_replies_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS policies to allow viewing posts with null user_id
DROP POLICY IF EXISTS "Users can view approved posts or own posts" ON forum_posts;

CREATE POLICY "Users can view approved posts or own posts" ON forum_posts
FOR SELECT USING (
  moderation_status = 'approved' 
  OR (user_id IS NOT NULL AND auth.uid() = user_id)
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);
