-- Allow admins to delete any forum post
DROP POLICY IF EXISTS "Admins can delete any post" ON forum_posts;
CREATE POLICY "Admins can delete any post" ON forum_posts
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow admins to update any forum post (for moderation status changes)
DROP POLICY IF EXISTS "Admins can update any post" ON forum_posts;
CREATE POLICY "Admins can update any post" ON forum_posts
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
