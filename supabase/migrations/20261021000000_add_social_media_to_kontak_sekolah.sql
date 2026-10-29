-- Migration: Add social media URL columns to kontak_sekolah table
-- Resolves PGRST204 error when saving or retrieving social media handles

ALTER TABLE public.kontak_sekolah
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Reload schema cache in PostgREST
NOTIFY pgrst, 'reload schema';
