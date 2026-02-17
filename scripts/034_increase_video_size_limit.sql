-- Increase the file size limit for scenario-videos bucket to 250MB
UPDATE storage.buckets
SET file_size_limit = 262144000
WHERE id = 'scenario-videos';
