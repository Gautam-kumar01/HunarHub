-- Enable RLS for Storage (It is usually enabled by default, but good to be sure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Allow Uploads (INSERT)
CREATE POLICY "Authenticated users can upload project assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-assets' AND
  auth.uid() = owner
);

-- 2. Allow Updates (for replacing file)
CREATE POLICY "Users can update their own project assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-assets' AND
  auth.uid() = owner
);

-- 3. Allow Deletes
CREATE POLICY "Users can delete their own project assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-assets' AND
  auth.uid() = owner
);

-- 4. Allow Public Read (Explicitly, although Public Bucket setting mostly handles this)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-assets' );
