-- ============================================================
-- Migration: Fix Table Grants and RLS Policies for Admin Tables
-- Date: 2026-08-08
-- Description: Ensures explicit table grants and RLS write permissions
--              for public.berita, public.galeri, public.kalender_akademik, etc.
-- ============================================================

-- Grant schema and table permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 1. BERITA
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.berita;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.berita;
DROP POLICY IF EXISTS "Public read berita" ON public.berita;
DROP POLICY IF EXISTS "All write berita" ON public.berita;

CREATE POLICY "Public read berita" ON public.berita FOR SELECT USING (true);
CREATE POLICY "All write berita" ON public.berita FOR ALL USING (true) WITH CHECK (true);

-- 2. GALERI
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.galeri;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.galeri;
DROP POLICY IF EXISTS "Public read galeri" ON public.galeri;
DROP POLICY IF EXISTS "All write galeri" ON public.galeri;

CREATE POLICY "Public read galeri" ON public.galeri FOR SELECT USING (true);
CREATE POLICY "All write galeri" ON public.galeri FOR ALL USING (true) WITH CHECK (true);

-- 3. KALENDER AKADEMIK
ALTER TABLE public.kalender_akademik ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.kalender_akademik;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.kalender_akademik;
DROP POLICY IF EXISTS "Public read kalender_akademik" ON public.kalender_akademik;
DROP POLICY IF EXISTS "All write kalender_akademik" ON public.kalender_akademik;

CREATE POLICY "Public read kalender_akademik" ON public.kalender_akademik FOR SELECT USING (true);
CREATE POLICY "All write kalender_akademik" ON public.kalender_akademik FOR ALL USING (true) WITH CHECK (true);
