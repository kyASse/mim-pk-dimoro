-- Migration: Add MIM PK Dimoro Registration Fields
ALTER TABLE public.pendaftar
  ADD COLUMN IF NOT EXISTS nomor_induk TEXT,
  ADD COLUMN IF NOT EXISTS tk_asal TEXT,
  ADD COLUMN IF NOT EXISTS diterima_di_kelas TEXT,
  ADD COLUMN IF NOT EXISTS diterima_pada_tanggal DATE,
  ADD COLUMN IF NOT EXISTS alamat_orang_tua TEXT,
  ADD COLUMN IF NOT EXISTS wali_alamat TEXT,
  ADD COLUMN IF NOT EXISTS wali_telepon TEXT,
  ADD COLUMN IF NOT EXISTS hobi TEXT,
  ADD COLUMN IF NOT EXISTS transportasi TEXT,
  ADD COLUMN IF NOT EXISTS gaji_orang_tua TEXT;
