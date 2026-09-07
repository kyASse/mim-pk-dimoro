-- ============================================================
-- Migration: Stage 1 - Security Hardening, Multi-Role RBAC & Audit Trail
-- Date: 2026-08-24
-- Description: Locks down RLS for administrative tables, adds new
--              profile role constraints, creates audit_logs table
--              with automatic database triggers, and establishes
--              security-definer helper functions.
-- ============================================================

-- ------------------------------------------------------------
-- 1. ROLE CONSTRAINT & INDEXES ON PROFILES
-- ------------------------------------------------------------
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN (
    'super_admin',
    'admin_tu',
    'kepala_madrasah',
    'bendahara',
    'wali_kelas',
    'guru_mapel',
    'orang_tua',
    'admin'
  ));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_id_role ON public.profiles (id, role);

-- ------------------------------------------------------------
-- 2. HELPER FUNCTIONS (SECURITY DEFINER WITH SEARCH_PATH)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = p_user_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = p_user_id 
    AND role IN ('super_admin', 'admin', 'admin_tu')
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role(p_user_id uuid, VARIADIC allowed_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = p_user_id 
    AND role = ANY(allowed_roles)
  );
$$;

-- ------------------------------------------------------------
-- 3. AUDIT LOGS TABLE & TRIGGERS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_created ON public.audit_logs (table_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON public.audit_logs (user_id, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read audit_logs" ON public.audit_logs;
CREATE POLICY "Admin read audit_logs" ON public.audit_logs
  FOR SELECT USING (
    public.has_role((SELECT auth.uid()), 'super_admin', 'admin', 'kepala_madrasah')
  );

DROP POLICY IF EXISTS "Authenticated insert audit_logs" ON public.audit_logs;
CREATE POLICY "Authenticated insert audit_logs" ON public.audit_logs
  FOR INSERT WITH CHECK (
    (SELECT auth.role()) = 'authenticated' OR (SELECT auth.role()) = 'service_role'
  );

-- Trigger Function for Database Mutations
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_record_id TEXT;
  v_old JSONB := NULL;
  v_new JSONB := NULL;
BEGIN
  v_user_id := auth.uid();

  IF (TG_OP = 'DELETE') THEN
    v_old := to_jsonb(OLD);
    v_record_id := COALESCE(v_old->>'id', v_old->>'slug', v_old->>'kunci', '');
    INSERT INTO public.audit_logs (user_id, table_name, action, record_id, old_data, new_data)
    VALUES (v_user_id, TG_TABLE_NAME, 'DELETE', v_record_id, v_old, NULL);
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
    v_record_id := COALESCE(v_new->>'id', v_new->>'slug', v_new->>'kunci', '');
    INSERT INTO public.audit_logs (user_id, table_name, action, record_id, old_data, new_data)
    VALUES (v_user_id, TG_TABLE_NAME, 'UPDATE', v_record_id, v_old, v_new);
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    v_new := to_jsonb(NEW);
    v_record_id := COALESCE(v_new->>'id', v_new->>'slug', v_new->>'kunci', '');
    INSERT INTO public.audit_logs (user_id, table_name, action, record_id, old_data, new_data)
    VALUES (v_user_id, TG_TABLE_NAME, 'INSERT', v_record_id, NULL, v_new);
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- ------------------------------------------------------------
-- 4. HARDENING RLS POLICIES FOR ADMIN TABLES
-- ------------------------------------------------------------

-- BERITA
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.berita;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.berita;
DROP POLICY IF EXISTS "Public read berita" ON public.berita;
DROP POLICY IF EXISTS "All write berita" ON public.berita;
DROP POLICY IF EXISTS "Admin insert berita" ON public.berita;
DROP POLICY IF EXISTS "Admin update berita" ON public.berita;
DROP POLICY IF EXISTS "Admin delete berita" ON public.berita;

CREATE POLICY "Public read berita" ON public.berita FOR SELECT USING (true);
CREATE POLICY "Admin insert berita" ON public.berita FOR INSERT WITH CHECK (public.is_admin((SELECT auth.uid())));
CREATE POLICY "Admin update berita" ON public.berita FOR UPDATE USING (public.is_admin((SELECT auth.uid()))) WITH CHECK (public.is_admin((SELECT auth.uid())));
CREATE POLICY "Admin delete berita" ON public.berita FOR DELETE USING (public.is_admin((SELECT auth.uid())));

DROP TRIGGER IF EXISTS audit_berita_trigger ON public.berita;
CREATE TRIGGER audit_berita_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.berita
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- GALERI
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.galeri;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.galeri;
DROP POLICY IF EXISTS "Public read galeri" ON public.galeri;
DROP POLICY IF EXISTS "All write galeri" ON public.galeri;
DROP POLICY IF EXISTS "Admin insert galeri" ON public.galeri;
DROP POLICY IF EXISTS "Admin update galeri" ON public.galeri;
DROP POLICY IF EXISTS "Admin delete galeri" ON public.galeri;

CREATE POLICY "Public read galeri" ON public.galeri FOR SELECT USING (true);
CREATE POLICY "Admin insert galeri" ON public.galeri FOR INSERT WITH CHECK (public.is_admin((SELECT auth.uid())));
CREATE POLICY "Admin update galeri" ON public.galeri FOR UPDATE USING (public.is_admin((SELECT auth.uid()))) WITH CHECK (public.is_admin((SELECT auth.uid())));
CREATE POLICY "Admin delete galeri" ON public.galeri FOR DELETE USING (public.is_admin((SELECT auth.uid())));

DROP TRIGGER IF EXISTS audit_galeri_trigger ON public.galeri;
CREATE TRIGGER audit_galeri_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.galeri
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- KONTEN HALAMAN
ALTER TABLE public.konten_halaman ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.konten_halaman;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.konten_halaman;
DROP POLICY IF EXISTS "Public read konten_halaman" ON public.konten_halaman;
DROP POLICY IF EXISTS "Admin insert konten_halaman" ON public.konten_halaman;
DROP POLICY IF EXISTS "Admin update konten_halaman" ON public.konten_halaman;
DROP POLICY IF EXISTS "Admin delete konten_halaman" ON public.konten_halaman;

CREATE POLICY "Public read konten_halaman" ON public.konten_halaman FOR SELECT USING (true);
CREATE POLICY "Admin insert konten_halaman" ON public.konten_halaman FOR INSERT WITH CHECK (public.is_admin((SELECT auth.uid())));
CREATE POLICY "Admin update konten_halaman" ON public.konten_halaman FOR UPDATE USING (public.is_admin((SELECT auth.uid()))) WITH CHECK (public.is_admin((SELECT auth.uid())));
CREATE POLICY "Admin delete konten_halaman" ON public.konten_halaman FOR DELETE USING (public.is_admin((SELECT auth.uid())));

DROP TRIGGER IF EXISTS audit_konten_halaman_trigger ON public.konten_halaman;
CREATE TRIGGER audit_konten_halaman_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.konten_halaman
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- BIAYA PENDAFTARAN
ALTER TABLE public.biaya_pendaftaran ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.biaya_pendaftaran;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.biaya_pendaftaran;
DROP POLICY IF EXISTS "Public read biaya_pendaftaran" ON public.biaya_pendaftaran;
DROP POLICY IF EXISTS "Admin insert biaya_pendaftaran" ON public.biaya_pendaftaran;
DROP POLICY IF EXISTS "Admin update biaya_pendaftaran" ON public.biaya_pendaftaran;
DROP POLICY IF EXISTS "Admin delete biaya_pendaftaran" ON public.biaya_pendaftaran;

CREATE POLICY "Public read biaya_pendaftaran" ON public.biaya_pendaftaran FOR SELECT USING (true);
CREATE POLICY "Admin insert biaya_pendaftaran" ON public.biaya_pendaftaran FOR INSERT WITH CHECK (public.has_role((SELECT auth.uid()), 'super_admin', 'admin', 'bendahara'));
CREATE POLICY "Admin update biaya_pendaftaran" ON public.biaya_pendaftaran FOR UPDATE USING (public.has_role((SELECT auth.uid()), 'super_admin', 'admin', 'bendahara')) WITH CHECK (public.has_role((SELECT auth.uid()), 'super_admin', 'admin', 'bendahara'));
CREATE POLICY "Admin delete biaya_pendaftaran" ON public.biaya_pendaftaran FOR DELETE USING (public.has_role((SELECT auth.uid()), 'super_admin', 'admin', 'bendahara'));

DROP TRIGGER IF EXISTS audit_biaya_pendaftaran_trigger ON public.biaya_pendaftaran;
CREATE TRIGGER audit_biaya_pendaftaran_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.biaya_pendaftaran
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- PRESTASI
ALTER TABLE public.prestasi ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.prestasi;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.prestasi;
DROP POLICY IF EXISTS "Public read prestasi" ON public.prestasi;
DROP POLICY IF EXISTS "Admin insert prestasi" ON public.prestasi;
DROP POLICY IF EXISTS "Admin update prestasi" ON public.prestasi;
DROP POLICY IF EXISTS "Admin delete prestasi" ON public.prestasi;

CREATE POLICY "Public read prestasi" ON public.prestasi FOR SELECT USING (true);
CREATE POLICY "Admin insert prestasi" ON public.prestasi FOR INSERT WITH CHECK (public.is_admin((SELECT auth.uid())));
CREATE POLICY "Admin update prestasi" ON public.prestasi FOR UPDATE USING (public.is_admin((SELECT auth.uid()))) WITH CHECK (public.is_admin((SELECT auth.uid())));
CREATE POLICY "Admin delete prestasi" ON public.prestasi FOR DELETE USING (public.is_admin((SELECT auth.uid())));

DROP TRIGGER IF EXISTS audit_prestasi_trigger ON public.prestasi;
CREATE TRIGGER audit_prestasi_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.prestasi
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- PENDAFTAR
ALTER TABLE public.pendaftar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.pendaftar;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.pendaftar;
DROP POLICY IF EXISTS "Admin read pendaftar" ON public.pendaftar;
DROP POLICY IF EXISTS "Public insert pendaftar" ON public.pendaftar;
DROP POLICY IF EXISTS "Admin update pendaftar" ON public.pendaftar;
DROP POLICY IF EXISTS "Admin delete pendaftar" ON public.pendaftar;

CREATE POLICY "Admin read pendaftar" ON public.pendaftar FOR SELECT USING (public.is_admin((SELECT auth.uid())));
CREATE POLICY "Public insert pendaftar" ON public.pendaftar FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update pendaftar" ON public.pendaftar FOR UPDATE USING (public.is_admin((SELECT auth.uid()))) WITH CHECK (public.is_admin((SELECT auth.uid())));
CREATE POLICY "Admin delete pendaftar" ON public.pendaftar FOR DELETE USING (public.is_admin((SELECT auth.uid())));

DROP TRIGGER IF EXISTS audit_pendaftar_trigger ON public.pendaftar;
CREATE TRIGGER audit_pendaftar_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pendaftar
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
