-- ============================================================
-- Supabase Local Seed File - MIM PK Dimoro
-- Includes:
-- 1. Konten Halaman, Biaya PPDB, Kontak, Statistik
-- 2. Berita, Testimoni, Galeri, Ekstrakurikuler, Kalender
-- 3. Akun Pengguna & Profil RBAC (Super Admin, Admin TU, Kepala Madrasah, Wali Murid)
-- 4. Sample Siswa & Laporan Perkembangan
-- 5. Sample Data Pendaftar PPDB (Berbagai Status & NIK)
-- ============================================================

-- ============================================================
-- 1. SEED DATA: Konten Halaman
-- ============================================================
INSERT INTO public.konten_halaman (slug, judul, isi) 
VALUES 
  ('persyaratan-pendaftaran', 'Persyaratan Pendaftaran', '{"blocks": [{"text": "1. Mengisi formulir pendaftaran online\n2. Fotokopi Akta Kelahiran\n3. Fotokopi Kartu Keluarga\n4. Pas foto 3x4 berwarna (2 lembar)\n5. Surat keterangan dari TK/RA asal (bila ada)"}]}'),
  ('catatan-spp', 'Catatan SPP & Pembiayaan', '{"blocks": [{"text": "SPP bulanan sudah mencakup seluruh program unggulan (Tahfidz, Klinik Belajar, makan siang, dan ekstrakurikuler wajib)."}]}'),
  ('jadwal-pendaftaran', 'Jadwal Pendaftaran PPDB', '{"blocks": [{"text": "Gelombang 1: Januari - Maret 2026\nGelombang 2: April - Juni 2026\nTes Observasi: Setiap hari Sabtu pada akhir bulan"}]}')
ON CONFLICT (slug) DO UPDATE SET judul = EXCLUDED.judul, isi = EXCLUDED.isi;

-- ============================================================
-- 2. SEED DATA: Biaya Pendaftaran
-- ============================================================
TRUNCATE public.biaya_pendaftaran CASCADE;
INSERT INTO public.biaya_pendaftaran (komponen_biaya, biaya_putra, biaya_putri)
VALUES
  ('Biaya Formulir & Observasi', 200000, 200000),
  ('Dana Pengembangan Pendidikan (DPP)', 1500000, 1500000),
  ('Paket Seragam & Atribut Madrasah', 600000, 650000),
  ('Kegiatan & Ekstrakurikuler 1 Tahun', 450000, 450000);

-- ============================================================
-- 3. SEED DATA: Kontak Sekolah
-- ============================================================
TRUNCATE public.kontak_sekolah CASCADE;
INSERT INTO public.kontak_sekolah (alamat, whatsapp, email_utama, email_admin, jam_operasional, maps_embed_url)
VALUES (
  'Sudimoro, RT.003/RW.X, Parangjoro, Grogol, Sukoharjo, Jawa Tengah 57552',
  '+62 821-3388-1991',
  'info@mimpkdimoro.sch.id',
  'admin@mimpkdimoro.sch.id',
  E'Senin - Kamis: 07.30 - 14.00 WIB\nJumat: 07.30 - 11.00 WIB\nSabtu: 07.30 - 12.00 WIB',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.6!2d110.8!3d-7.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzY''MDAuMCJTIDExMMKwNDgnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890'
);

-- ============================================================
-- 4. SEED DATA: Statistik Utama
-- ============================================================
TRUNCATE public.statistik_utama CASCADE;
INSERT INTO public.statistik_utama (kunci, nilai, deskripsi)
VALUES
  ('jumlah_siswa', '215', 'Total siswa aktif MIM PK Dimoro'),
  ('jumlah_guru', '18', 'Total tenaga pendidik & ustadz/ustadzah'),
  ('tahun_berdiri', '1967', 'Tahun madrasah didirikan'),
  ('akreditasi', 'A', 'Peringkat akreditasi BAN-S/M');

-- ============================================================
-- 5. SEED DATA: Berita / Beranda News
-- ============================================================
TRUNCATE public.berita RESTART IDENTITY CASCADE;
INSERT INTO public.berita (judul, ringkasan, isi_lengkap, status, image_url, tanggal_terbit)
VALUES 
  ('Penerimaan Siswa Baru (PPDB) 2026/2027 Telah Dibuka', 'MIM PK Dimoro resmi membuka pendaftaran calon peserta didik baru dengan program unggulan Tahfidz Al-Qur''an dan Klinik Belajar.', 'Penerimaan Peserta Didik Baru (PPDB) MIM PK Dimoro Tahun Ajaran 2026/2027 telah resmi dibuka. Para orang tua dapat mendaftarkan putra-putrinya secara online maupun langsung ke kantor madrasah.', 'terbit', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800', now()),
  ('Prestasi Gemilang Siswa MIM PK Dimoro pada Festival Anak Sholeh', 'Siswa-siswi MIM PK Dimoro berhasil memborong trofi pada cabang lomba Tahfidz Juz 30 dan Pidato Bahasa Arab.', 'Alhamdulillah, puji syukur ke hadirat Allah SWT. Delegasi MIM PK Dimoro menorehkan prestasi gemilang dalam ajang Festival Anak Sholeh tingkat Kabupaten.', 'terbit', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800', now()),
  ('Outbound & Edukasi Karakter Islami di Tawangmangu', 'Menumbuhkan jiwa kemandirian, kepemimpinan, dan kebersamaan santri madrasah melalui kegiatan alam terbuka.', 'Kegiatan outbound tahunan diikuti oleh seluruh siswa kelas 4, 5, dan 6 bertempat di kawasan sejuk Tawangmangu Karanganyar.', 'terbit', 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800', now());

-- ============================================================
-- 6. SEED DATA: Testimoni
-- ============================================================
TRUNCATE public.testimoni RESTART IDENTITY CASCADE;
INSERT INTO public.testimoni (nama_orang_tua, isi_testimoni, is_featured)
VALUES 
  ('Bpk. Hendra Wijaya', 'Alhamdulillah, anak saya hafalan Qur''annya berkembang sangat pesat dan memiliki akhlak mulia sejak sekolah di MIM PK Dimoro.', true),
  ('Ibu Siti Aminah', 'Program Klinik Belajar sangat membantu mendampingi kesulitan belajar anak dengan pendekatan yang sabar dan menyenangkan.', true),
  ('Bpk. Bambang Sutrisno', 'Fasilitas madrasah sangat memadai dan para ustadz/ustadzah sangat dekat dengan wali murid melalui portal komunikasi.', true);

-- ============================================================
-- 7. SEED DATA: Galeri Foto
-- ============================================================
TRUNCATE public.galeri RESTART IDENTITY CASCADE;
INSERT INTO public.galeri (keterangan, kategori, image_url)
VALUES 
  ('Gedung dan Halaman Utama MIM PK Dimoro', 'fasilitas', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800'),
  ('Kegiatan Sholat Dhuha dan Muraja''ah Pagi', 'kegiatan', 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80&w=800'),
  ('Laboratorium Komputer & Media Pembelajaran Digital', 'fasilitas', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'),
  ('Latihan Tapak Suci Putra Muhammadiyah', 'prestasi', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800');

-- ============================================================
-- 8. SEED DATA: Ekstrakurikuler
-- ============================================================
TRUNCATE public.ekstrakurikuler RESTART IDENTITY CASCADE;
INSERT INTO public.ekstrakurikuler (nama_eskul, deskripsi, image_url)
VALUES 
  ('Tapak Suci Putera Muhammadiyah', 'Seni bela diri islami untuk melatih ketangkasan, kedisiplinan, dan kebugaran jasmani santri.', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600'),
  ('Gerakan Kepanduan Hizbul Wathan (HW)', 'Pendidikan kepanduan untuk membentuk generasi muda yang mandiri, cinta tanah air, dan berakhlak karimah.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600'),
  ('Seni Hadroh & Tilawatil Qur''an', 'Pengembangan bakat seni islami, shalawat rebana, dan seni baca Al-Qur''an bernada merdu.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600'),
  ('Klub Sains & Robotika Cilik', 'Eksplorasi eksperimen sains sederhana dan pengenalan logika pemrograman dasar untuk anak.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600');

-- ============================================================
-- 9. SEED DATA: AKUN AUTH & PROFIL RBAC RESMI
-- ============================================================
-- Bersihkan auth users demo terdahulu agar idempotence
DELETE FROM auth.users WHERE email IN (
  'admin@mimpkdimoro.sch.id',
  'tu@mimpkdimoro.sch.id',
  'kepala@mimpkdimoro.sch.id',
  'orangtua@example.com'
);

-- 9.1 Super Admin (admin@mimpkdimoro.sch.id / admin123)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'admin@mimpkdimoro.sch.id',
  crypt('admin123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"nama_lengkap":"Administrator Utama"}',
  now(), now(), '', '', '', ''
);

-- 9.2 Admin Tata Usaha (tu@mimpkdimoro.sch.id / admin123)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000002',
  'authenticated', 'authenticated',
  'tu@mimpkdimoro.sch.id',
  crypt('admin123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"nama_lengkap":"Staf Tata Usaha"}',
  now(), now(), '', '', '', ''
);

-- 9.3 Kepala Madrasah (kepala@mimpkdimoro.sch.id / admin123)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000003',
  'authenticated', 'authenticated',
  'kepala@mimpkdimoro.sch.id',
  crypt('admin123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"nama_lengkap":"Kepala Madrasah MIM PK Dimoro"}',
  now(), now(), '', '', '', ''
);

-- 9.4 Wali Murid / Orang Tua Demo (orangtua@example.com / orangtua123)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b0000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'orangtua@example.com',
  crypt('orangtua123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"nama_lengkap":"Bpk. Hendra Wijaya"}',
  now(), now(), '', '', '', ''
);

-- Sinkronisasi ke tabel profiles dengan role RBAC yang valid
INSERT INTO public.profiles (id, nama_lengkap, role)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Administrator Utama', 'super_admin'),
  ('a0000000-0000-0000-0000-000000000002', 'Staf Tata Usaha MIM', 'admin_tu'),
  ('a0000000-0000-0000-0000-000000000003', 'Kepala Madrasah MIM PK Dimoro', 'kepala_madrasah'),
  ('b0000000-0000-0000-0000-000000000001', 'Bpk. Hendra Wijaya', 'orang_tua')
ON CONFLICT (id) DO UPDATE SET 
  nama_lengkap = EXCLUDED.nama_lengkap, 
  role = EXCLUDED.role;

-- ============================================================
-- 10. SEED DATA: Siswa & Laporan Perkembangan (Untuk Portal Wali)
-- ============================================================
DELETE FROM public.siswa WHERE profile_orang_tua_id = 'b0000000-0000-0000-0000-000000000001';

INSERT INTO public.siswa (id, profile_orang_tua_id, nama_lengkap, tanggal_lahir, kelompok)
VALUES 
  (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Fatimah Zahra',
    '2019-08-20',
    'Kelas 1A'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'Abdullah Al-Ghazi',
    '2017-03-15',
    'Kelas 3A'
  );

INSERT INTO public.laporan_perkembangan (siswa_id, semester, tahun_ajaran, catatan_guru, dokumen_rapor_url)
VALUES 
  (
    'c0000000-0000-0000-0000-000000000001',
    'Semester 1 (Ganjil)',
    '2026/2027',
    'Ananda Fatimah memiliki perkembangan hafalan yang sangat baik, tartil tajwid tepat, serta aktif dalam kegiatan madrasah.',
    NULL
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'Semester 1 (Ganjil)',
    '2026/2027',
    'Ananda Abdullah menunjukkan kepemimpinan yang baik di kelas, berprestasi di bidang sains dan tahfidz juz 29.',
    NULL
  );

-- ============================================================
-- 11. SEED DATA: Calon Siswa Baru (PPDB) Lengkap Format EMIS 4.0
-- ============================================================
TRUNCATE public.pendaftar CASCADE;
INSERT INTO public.pendaftar (
  id, nomor_induk, nama_lengkap, nama_panggilan, jenis_kelamin,
  tempat_lahir, tanggal_lahir, agama, kewarganegaraan,
  anak_ke, jumlah_saudara_kandung, status_anak, bahasa_sehari_hari,
  berat_badan, tinggi_badan, golongan_darah, tk_asal,
  memiliki_kebutuhan_khusus, alamat_lengkap, jarak_tempat_tinggal,
  transportasi, nomor_telepon, email, nama_ayah_kandung,
  pendidikan_ayah, pekerjaan_ayah, nama_ibu_kandung,
  pendidikan_ibu, pekerjaan_ibu, gaji_orang_tua, alamat_orang_tua,
  hobi, cita_cita, status_pendaftaran, diterima_di_kelas,
  diterima_pada_tanggal, created_at
) VALUES 
(
  'd0000000-0000-0000-0000-000000000001',
  '3311091205190001',
  'Muhammad Al-Fatih',
  'Fatih',
  'L',
  'Sukoharjo',
  '2019-05-12',
  'Islam',
  'WNI',
  1, 2, 'Anak Kandung', 'Indonesia, Jawa',
  19, 115, 'O', 'TK Aisyiyah Bustanul Athfal Dimoro',
  false, 'Sudimoro RT 01 RW 03, Parangjoro, Grogol, Sukoharjo', '< 1 km',
  'Jalan Kaki', '081234567890', 'fatih.parents@example.com',
  'Bambang Sutrisno, S.Pd.', 'S1', 'Guru',
  'Siti Aminah, S.E.', 'S1', 'Wiraswasta',
  'Rp 4.000.000 - Rp 6.000.000', 'Sudimoro RT 01 RW 03',
  'Membaca & Berkuda', 'Ulama & Arsitek',
  'Menunggu Persetujuan', NULL, NULL,
  now() - interval '3 days'
),
(
  'd0000000-0000-0000-0000-000000000002',
  '3311095508190002',
  'Fatimah Az-Zahra',
  'Zahra',
  'P',
  'Surakarta',
  '2019-08-20',
  'Islam',
  'WNI',
  2, 3, 'Anak Kandung', 'Indonesia',
  18, 112, 'A', 'TK ABA 2 Solo Baru',
  false, 'Jl. Palm Raya No. 12, Grogol, Sukoharjo', '2 - 3 km',
  'Sepeda Motor', '089876543210', 'orangtua@example.com',
  'Hendra Wijaya, S.T.', 'S1', 'Karyawan Swasta',
  'Nurul Hidayah, S.Pd.', 'S1', 'PNS',
  'Rp 6.000.000 - Rp 10.000.000', 'Jl. Palm Raya No. 12',
  'Menggambar & Mewarnai', 'Dokter Spesialis Anak',
  'Diterima', 'Kelas 1A', '2026-08-20',
  now() - interval '5 days'
),
(
  'd0000000-0000-0000-0000-000000000003',
  '3311091501190003',
  'Tariq Bin Ziyad',
  'Tariq',
  'L',
  'Boyolali',
  '2019-01-15',
  'Islam',
  'WNI',
  1, 1, 'Anak Kandung', 'Indonesia, Jawa',
  21, 118, 'B', 'PAUD Terpadu Aisyiyah',
  false, 'Gatak RT 02 RW 01, Sukoharjo', '1 - 2 km',
  'Antar Jemput', '085566778899', 'tariq@example.com',
  'Supriyanto', 'SMA/SMK', 'Pedagang',
  'Hartini', 'SMA/SMK', 'Ibu Rumah Tangga',
  'Rp 2.500.000 - Rp 4.000.000', 'Gatak RT 02 RW 01',
  'Bermain Sepeda & Robot', 'Polisi / Tentara',
  'Revisi', NULL, NULL,
  now() - interval '7 days'
),
(
  'd0000000-0000-0000-0000-000000000004',
  '3311096503190004',
  'Aisyah Khumaira',
  'Aisyah',
  'P',
  'Sukoharjo',
  '2019-03-25',
  'Islam',
  'WNI',
  3, 3, 'Anak Kandung', 'Indonesia',
  17, 109, 'AB', 'TK Islam Permata Hati',
  false, 'Parangjoro Indah Blok C-4, Sukoharjo', '< 1 km',
  'Jalan Kaki', '082233445566', 'aisyah@example.com',
  'Joko Prasetyo, M.Eng.', 'S2', 'Dosen',
  'Endang Lestari, M.Si.', 'S2', 'Peneliti',
  '> Rp 10.000.000', 'Parangjoro Indah Blok C-4',
  'Bercerita & Tilawah', 'Guru / Dosen',
  'Diterima', 'Kelas 1B', '2026-08-21',
  now() - interval '10 days'
),
(
  'd0000000-0000-0000-0000-000000000005',
  '3311090407190005',
  'Hamzah Abdul Aziz',
  'Hamzah',
  'L',
  'Karanganyar',
  '2019-07-04',
  'Islam',
  'WNI',
  2, 2, 'Anak Kandung', 'Indonesia',
  20, 114, 'O', 'TK Pertiwi Sudimoro',
  false, 'Sudimoro RT 04 RW 02, Sukoharjo', '< 1 km',
  'Sepeda Motor', '087788990011', 'hamzah@example.com',
  'Abdul Aziz', 'D3', 'Wiraswasta',
  'Khadijah', 'SMA/SMK', 'Ibu Rumah Tangga',
  'Rp 3.000.000 - Rp 5.000.000', 'Sudimoro RT 04 RW 02',
  'Olahraga Futsal', 'Atlet & Pengusaha',
  'Ditolak', NULL, NULL,
  now() - interval '14 days'
);
