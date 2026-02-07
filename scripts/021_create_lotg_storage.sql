-- Create storage bucket for LOTG PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lotg-documents',
  'lotg-documents',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow admins to upload
CREATE POLICY "Admins can upload LOTG documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lotg-documents'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Policy to allow admins to read
CREATE POLICY "Admins can read LOTG documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'lotg-documents'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Policy to allow admins to delete
CREATE POLICY "Admins can delete LOTG documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'lotg-documents'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
