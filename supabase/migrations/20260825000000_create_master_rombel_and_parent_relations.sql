-- ====================================================================
-- Migration: Create Master Rombel and Student Relations
-- Description: Master Rombel (1A s.d. 6B), Homeroom Teachers, and Student link
-- Date: 2026-08-25
-- ====================================================================

-- 1. Create Rombel Table
CREATE TABLE IF NOT EXISTS public.rombel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  tingkat INTEGER NOT NULL CHECK (tingkat BETWEEN 1 AND 6),
  tahun_ajaran TEXT NOT NULL DEFAULT '2026/2027',
  wali_kelas_nama TEXT,
  wali_kelas_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  kapasitas INTEGER DEFAULT 28 CHECK (kapasitas > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add rombel_id to siswa table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'siswa' 
    AND column_name = 'rombel_id'
  ) THEN
    ALTER TABLE public.siswa 
    ADD COLUMN rombel_id UUID REFERENCES public.rombel(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Enable RLS on rombel
ALTER TABLE public.rombel ENABLE ROW LEVEL SECURITY;

-- 4. Policies for rombel
DROP POLICY IF EXISTS "Allow authenticated read for rombel" ON public.rombel;
CREATE POLICY "Allow authenticated read for rombel" 
ON public.rombel FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow admin full access for rombel" ON public.rombel;
CREATE POLICY "Allow admin full access for rombel" 
ON public.rombel FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin_tu', 'kepala_madrasah')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin_tu', 'kepala_madrasah')
  )
);

-- 5. Grant permissions to authenticated & anon roles
GRANT SELECT ON public.rombel TO anon, authenticated;
GRANT ALL ON public.rombel TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.rombel TO authenticated;

-- 6. Insert 12 standard Rombel records (Kelas 1A s.d. 6B)
INSERT INTO public.rombel (nama, tingkat, tahun_ajaran, wali_kelas_nama, kapasitas)
VALUES
  ('Kelas 1A', 1, '2026/2027', 'Ustz. Siti Rahmawati, S.Pd.I', 28),
  ('Kelas 1B', 1, '2026/2027', 'Ustz. Nur Hidayah, S.Pd.', 28),
  ('Kelas 2A', 2, '2026/2027', 'Ust. Ahmad Fauzi, S.Pd.', 28),
  ('Kelas 2B', 2, '2026/2027', 'Ustz. Fatimah Zahra, S.Pd.I', 28),
  ('Kelas 3A', 3, '2026/2027', 'Ust. Muhammad Ridwan, M.Pd.', 28),
  ('Kelas 3B', 3, '2026/2027', 'Ustz. Aisyah Khairunnisa, S.Pd.', 28),
  ('Kelas 4A', 4, '2026/2027', 'Ust. Budi Santoso, S.Pd.I', 28),
  ('Kelas 4B', 4, '2026/2027', 'Ustz. Dewi Sartika, S.Pd.', 28),
  ('Kelas 5A', 5, '2026/2027', 'Ust. Hendra Wijaya, S.Pd.', 28),
  ('Kelas 5B', 5, '2026/2027', 'Ustz. Sri Wahyuni, M.Pd.I', 28),
  ('Kelas 6A', 6, '2026/2027', 'Ust. Joko Prasetyo, S.Pd.', 28),
  ('Kelas 6B', 6, '2026/2027', 'Ustz. Endang Sulastri, S.Pd.I', 28)
ON CONFLICT (nama) DO UPDATE SET
  wali_kelas_nama = EXCLUDED.wali_kelas_nama,
  tingkat = EXCLUDED.tingkat,
  tahun_ajaran = EXCLUDED.tahun_ajaran,
  kapasitas = EXCLUDED.kapasitas;

-- 7. Sync existing siswa.kelompok to rombel_id if matching
UPDATE public.siswa s
SET rombel_id = r.id
FROM public.rombel r
WHERE s.kelompok = r.nama
AND s.rombel_id IS NULL;
