-- Supabase Seed File
-- Insert default required contents here

INSERT INTO public.konten_halaman (slug, judul, isi) 
VALUES 
  ('persyaratan-pendaftaran', 'Persyaratan Pendaftaran', '{"blocks": [{"text": "Daftar persyaratan pendaftaran..."}]}'),
  ('catatan-spp', 'Catatan SPP', '{"blocks": [{"text": "Info dan detail catatan beban biaya bulanan atau SPP."}]}'),
  ('jadwal-pendaftaran', 'Jadwal Pendaftaran', '{"blocks": [{"text": "Pendaftaran gelombang 1 dibuka bulan..."}]}')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.biaya_pendaftaran (komponen_biaya, biaya_putra, biaya_putri)
VALUES
  ('Biaya Formulir', 200000, 200000),
  ('Dana Pendidikan', 1500000, 1500000),
  ('Seragam', 600000, 650000)
ON CONFLICT DO NOTHING;
