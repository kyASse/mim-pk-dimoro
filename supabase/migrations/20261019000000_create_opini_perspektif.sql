-- Migration: Create public.opini_perspektif
CREATE TABLE IF NOT EXISTS public.opini_perspektif (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  judul TEXT NOT NULL,
  ringkasan TEXT NOT NULL,
  isi_lengkap TEXT NOT NULL,
  kategori TEXT NOT NULL DEFAULT 'Pendidikan & Karakter',
  
  nama_penulis TEXT NOT NULL,
  peran_penulis TEXT NOT NULL CHECK (peran_penulis IN ('guru', 'wali_murid', 'alumni', 'umum')),
  keterangan_peran TEXT,
  foto_penulis_url TEXT,
  gambar_sampul_url TEXT,
  
  kontak_wa TEXT NOT NULL,
  email TEXT,
  
  status TEXT NOT NULL DEFAULT 'menunggu_kurasi' CHECK (status IN ('menunggu_kurasi', 'terbit', 'ditolak', 'arsip')),
  catatan_redaksi TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  waktu_terbit TIMESTAMPTZ,
  dibaca_count INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_opini_status_terbit ON public.opini_perspektif (status, waktu_terbit DESC) WHERE status = 'terbit';
CREATE INDEX IF NOT EXISTS idx_opini_featured ON public.opini_perspektif (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_opini_slug ON public.opini_perspektif (slug);

ALTER TABLE public.opini_perspektif ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'opini_perspektif' AND policyname = 'Public can view published opinions'
  ) THEN
    CREATE POLICY "Public can view published opinions" 
    ON public.opini_perspektif FOR SELECT 
    USING (status = 'terbit');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'opini_perspektif' AND policyname = 'Public can submit draft opinion'
  ) THEN
    CREATE POLICY "Public can submit draft opinion" 
    ON public.opini_perspektif FOR INSERT 
    WITH CHECK (status = 'menunggu_kurasi' AND is_featured = false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'opini_perspektif' AND policyname = 'Admin full access on opini_perspektif'
  ) THEN
    CREATE POLICY "Admin full access on opini_perspektif" 
    ON public.opini_perspektif FOR ALL 
    TO authenticated 
    USING (true);
  END IF;
END $$;

-- -----------------------------------------------
-- FUNCTION: increment_opini_reads (SECURITY DEFINER)
-- Allows public readers to increment view counter safely
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_opini_reads(opini_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.opini_perspektif
  SET dibaca_count = dibaca_count + 1
  WHERE slug = opini_slug AND status = 'terbit';
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_opini_reads(TEXT) TO anon, authenticated;

-- -----------------------------------------------
-- STORAGE: opini bucket for cover & author pictures
-- -----------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'opini',
  'opini',
  true,
  3145728, -- 3 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read opini storage" ON storage.objects;
CREATE POLICY "Public read opini storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'opini');

DROP POLICY IF EXISTS "Public upload opini storage" ON storage.objects;
CREATE POLICY "Public upload opini storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'opini');

DROP POLICY IF EXISTS "Authenticated manage opini storage" ON storage.objects;
CREATE POLICY "Authenticated manage opini storage"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'opini');
