-- Supabase Seed File
-- Insert default required contents here

-- ============================================================
-- SEED DATA: Konten Halaman
-- ============================================================
INSERT INTO public.konten_halaman (slug, judul, isi) 
VALUES 
  ('persyaratan-pendaftaran', 'Persyaratan Pendaftaran', '{"blocks": [{"text": "1. Mengisi formulir pendaftaran\n2. Fotokopi Akta Kelahiran\n3. Fotokopi Kartu Keluarga\n4. Pas foto 3x4 berwarna (2 lembar)"}]}'),
  ('catatan-spp', 'Catatan SPP', '{"blocks": [{"text": "SPP bulanan sudah termasuk biaya makan siang dan ekstrakurikuler wajib."}]}'),
  ('jadwal-pendaftaran', 'Jadwal Pendaftaran', '{"blocks": [{"text": "Gelombang 1: Jan - Feb 2026\nGelombang 2: Mar - Apr 2026"}]}')
ON CONFLICT (slug) DO UPDATE SET judul = EXCLUDED.judul, isi = EXCLUDED.isi;

-- ============================================================
-- SEED DATA: Biaya Pendaftaran
-- ============================================================
TRUNCATE public.biaya_pendaftaran CASCADE;
INSERT INTO public.biaya_pendaftaran (komponen_biaya, biaya_putra, biaya_putri)
VALUES
  ('Biaya Formulir', 200000, 200000),
  ('Dana Pendidikan', 1500000, 1500000),
  ('Seragam', 600000, 650000);

-- ============================================================
-- SEED DATA: Kontak Sekolah
-- ============================================================
TRUNCATE public.kontak_sekolah CASCADE;
INSERT INTO public.kontak_sekolah (alamat, whatsapp, email_utama, email_admin, jam_operasional, maps_embed_url)
VALUES (
  'Sudimoro, RT.003/RW.X, Parangjoro, Grogol, Sukoharjo, Jawa Tengah',
  '+62 821-3388-1991',
  'info@mimpkdimoro.sch.id',
  'admin@mimpkdimoro.sch.id',
  E'Senin - Kamis: 07.30 - 14.00 WIB\nJumat: 07.30 - 11.00 WIB',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.6!2d110.8!3d-7.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzY''MDAuMCJTIDExMMKwNDgnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890'
);

-- ============================================================
-- SEED DATA: Statistik Utama
-- ============================================================
TRUNCATE public.statistik_utama CASCADE;
INSERT INTO public.statistik_utama (kunci, nilai, deskripsi)
VALUES
  ('jumlah_siswa', '201', 'Total siswa aktif'),
  ('jumlah_guru', '18', 'Total tenaga pengajar'),
  ('tahun_berdiri', '1967', 'Tahun sekolah berdiri'),
  ('akreditasi', 'A', 'Nilai akreditasi sekolah');

-- ============================================================
-- SEED DATA: Berita / Beranda News
-- ============================================================
-- Clean existing data first to avoid duplicates during repeated seeds
TRUNCATE public.berita RESTART IDENTITY CASCADE;
INSERT INTO public.berita (judul, ringkasan, isi_lengkap, status, image_url, tanggal_terbit)
VALUES 
  ('Penerimaan Siswa Baru 2026/2027', 'MIM PK Dimoro membuka pendaftaran siswa baru gelombang pertama.', 'Isi lengkap berita pendaftaran...', 'terbit', 'https://placehold.co/800x600/059669/ffffff.png?text=PPDB+2026', now()),
  ('Kegiatan Outbound Kelas 5', 'Keseruan siswa kelas 5 saat mengikuti kegiatan luar ruangan di Tawangmangu.', 'Isi lengkap berita outbound...', 'terbit', 'https://placehold.co/800x600/10b981/ffffff.png?text=Outbound+MIM', now());

-- ============================================================
-- SEED DATA: Testimoni
-- ============================================================
TRUNCATE public.testimoni RESTART IDENTITY CASCADE;
INSERT INTO public.testimoni (nama_orang_tua, isi_testimoni, is_featured)
VALUES 
  ('Bpk. Budi', 'Alhamdulillah anak saya betah dan perkembangan tahfidznya sangat pesat di MIM PK Dimoro.', true),
  ('Ibu Siti', 'Kurikulumnya sangat seimbang antara IPTEK dan IMTAQ.', true);

-- ============================================================
-- SEED DATA: Galeri
-- ============================================================
TRUNCATE public.galeri RESTART IDENTITY CASCADE;
INSERT INTO public.galeri (keterangan, kategori, image_url)
VALUES 
  ('Gedung Utama', 'fasilitas', 'https://placehold.co/800x600/059669/ffffff.png?text=Gedung+Utama'),
  ('Upacara Bendera', 'kegiatan', 'https://placehold.co/800x600/10b981/ffffff.png?text=Upacara'),
  ('Laboratorium Komputer', 'fasilitas', 'https://placehold.co/800x600/34d399/ffffff.png?text=Lab+Komputer');

-- ============================================================
-- SEED DATA: Pelajaran / Ekstrakurikuler
-- ============================================================
TRUNCATE public.ekstrakurikuler RESTART IDENTITY CASCADE;
INSERT INTO public.ekstrakurikuler (nama_eskul, deskripsi, image_url)
VALUES 
  ('Tapak Suci', 'Beladiri khas Muhammadiyah', 'https://placehold.co/600x400/059669/ffffff.png?text=Tapak+Suci'),
  ('Hizbul Wathan', 'Kepanduan Muhammadiyah', 'https://placehold.co/600x400/10b981/ffffff.png?text=Hizbul+Wathan'),
  ('Seni Musik', 'Pelatihan rebana dan seni suara', 'https://placehold.co/600x400/34d399/ffffff.png?text=Seni+Musik');

-- Buat Akun Admin Default (admin@mimpkdimoro.sch.id / admin123)
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'admin@mimpkdimoro.sch.id',
            crypt ('admin123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
    );
