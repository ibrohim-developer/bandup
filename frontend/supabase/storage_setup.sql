-- ============================================
-- Supabase Storage Setup for Listening Audio Files
-- Run this in Supabase SQL Editor
-- ============================================

-- Create the storage bucket for listening audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listening-audio',
  'listening-audio',
  true, -- Make bucket public so audio URLs work without authentication
  52428800, -- 50MB file size limit per file
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm']
);

-- ============================================
-- Storage Policies
-- ============================================

-- Allow anyone to read/download audio files (needed for audio player)
CREATE POLICY "Public can view listening audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'listening-audio');

-- Only authenticated users can upload audio files
CREATE POLICY "Authenticated users can upload listening audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listening-audio');

-- Only authenticated users can update their own uploads
CREATE POLICY "Authenticated users can update listening audio"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'listening-audio')
WITH CHECK (bucket_id = 'listening-audio');

-- Only authenticated users can delete audio files
CREATE POLICY "Authenticated users can delete listening audio"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listening-audio');

-- ============================================
-- Verify setup
-- ============================================
-- You can verify the bucket was created by running:
-- SELECT * FROM storage.buckets WHERE id = 'listening-audio';
