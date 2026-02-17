-- Create storage bucket for scenario videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scenario-videos',
  'scenario-videos',
  true, -- Public for viewing
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska']
)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow admins to upload videos
CREATE POLICY "Admins can upload scenario videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'scenario-videos'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Policy to allow everyone to read videos (public bucket)
CREATE POLICY "Anyone can read scenario videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'scenario-videos');

-- Policy to allow admins to delete videos
CREATE POLICY "Admins can delete scenario videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'scenario-videos'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Policy to allow admins to update videos
CREATE POLICY "Admins can update scenario videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'scenario-videos'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
