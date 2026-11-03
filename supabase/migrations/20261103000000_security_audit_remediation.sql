-- ============================================================
-- Migration: Security Audit Remediation & RLS Hardening
-- Date: 2026-11-03
-- Description: Closes critical privilege escalation on profiles,
--              secures siswa, kalender_akademik, testimoni,
--              laporan_perkembangan, and pesan_masuk.
-- ============================================================

-- ------------------------------------------------------------
-- 1. HARDEN PROFILES (Prevent unauthorized role escalation)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Enable all access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile or admin read all" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile non-role" ON public.profiles;
DROP POLICY IF EXISTS "Super admin full access profiles" ON public.profiles;

CREATE POLICY "Users can read own profile or admin read all" ON public.profiles
  FOR SELECT USING (
    id = (SELECT auth.uid()) OR public.is_admin((SELECT auth.uid()))
  );

CREATE POLICY "Users can update own profile non-role" ON public.profiles
  FOR UPDATE USING (id = (SELECT auth.uid()))
  WITH CHECK (
    id = (SELECT auth.uid()) AND 
    role = (SELECT p.role FROM public.profiles p WHERE p.id = (SELECT auth.uid()))
  );

CREATE POLICY "Super admin full access profiles" ON public.profiles
  FOR ALL USING (
    public.has_role((SELECT auth.uid()), 'super_admin', 'admin')
  );

-- ------------------------------------------------------------
-- 2. HARDEN SISWA (Prevent unauthorized read/mutation)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Enable all access for all users" ON public.siswa;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.siswa;
DROP POLICY IF EXISTS "Admin full access siswa" ON public.siswa;
DROP POLICY IF EXISTS "Parent read own child siswa" ON public.siswa;

CREATE POLICY "Admin full access siswa" ON public.siswa
  FOR ALL USING (public.is_admin((SELECT auth.uid())));

CREATE POLICY "Parent read own child siswa" ON public.siswa
  FOR SELECT USING (profile_orang_tua_id = (SELECT auth.uid()));

-- ------------------------------------------------------------
-- 3. HARDEN KALENDER AKADEMIK (Prevent defacement)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "All write kalender_akademik" ON public.kalender_akademik;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.kalender_akademik;
DROP POLICY IF EXISTS "Public read kalender_akademik" ON public.kalender_akademik;
DROP POLICY IF EXISTS "Admin write kalender_akademik" ON public.kalender_akademik;

CREATE POLICY "Public read kalender_akademik" ON public.kalender_akademik
  FOR SELECT USING (true);

CREATE POLICY "Admin write kalender_akademik" ON public.kalender_akademik
  FOR ALL USING (public.is_admin((SELECT auth.uid())));

-- ------------------------------------------------------------
-- 4. HARDEN TESTIMONI (Scoped public read & verified creation)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Enable all access for all users" ON public.testimoni;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.testimoni;
DROP POLICY IF EXISTS "Public read testimoni" ON public.testimoni;
DROP POLICY IF EXISTS "Admin manage testimoni" ON public.testimoni;
DROP POLICY IF EXISTS "Parent create own testimoni" ON public.testimoni;

CREATE POLICY "Public read testimoni" ON public.testimoni
  FOR SELECT USING (true);

CREATE POLICY "Admin manage testimoni" ON public.testimoni
  FOR ALL USING (public.is_admin((SELECT auth.uid())));

CREATE POLICY "Parent create own testimoni" ON public.testimoni
  FOR INSERT WITH CHECK (
    created_by = (SELECT auth.uid()) AND
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'orang_tua'
  );

-- ------------------------------------------------------------
-- 5. HARDEN LAPORAN PERKEMBANGAN (Cross-tenant parent protection)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated read laporan_perkembangan" ON public.laporan_perkembangan;
DROP POLICY IF EXISTS "Authenticated insert laporan_perkembangan" ON public.laporan_perkembangan;
DROP POLICY IF EXISTS "Authenticated update laporan_perkembangan" ON public.laporan_perkembangan;
DROP POLICY IF EXISTS "Authenticated delete laporan_perkembangan" ON public.laporan_perkembangan;
DROP POLICY IF EXISTS "Admin manage laporan_perkembangan" ON public.laporan_perkembangan;
DROP POLICY IF EXISTS "Parent read own child laporan" ON public.laporan_perkembangan;

CREATE POLICY "Admin manage laporan_perkembangan" ON public.laporan_perkembangan
  FOR ALL USING (public.is_admin((SELECT auth.uid())));

CREATE POLICY "Parent read own child laporan" ON public.laporan_perkembangan
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.siswa s
      WHERE s.id = laporan_perkembangan.siswa_id
      AND s.profile_orang_tua_id = (SELECT auth.uid())
    )
  );

-- ------------------------------------------------------------
-- 6. HARDEN PESAN MASUK (Protect submitter privacy)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated read pesan_masuk" ON public.pesan_masuk;
DROP POLICY IF EXISTS "Authenticated update pesan_masuk" ON public.pesan_masuk;
DROP POLICY IF EXISTS "Authenticated delete pesan_masuk" ON public.pesan_masuk;
DROP POLICY IF EXISTS "Admin manage pesan_masuk" ON public.pesan_masuk;

CREATE POLICY "Admin manage pesan_masuk" ON public.pesan_masuk
  FOR ALL USING (public.is_admin((SELECT auth.uid())));
