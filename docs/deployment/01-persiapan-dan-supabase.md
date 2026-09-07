# Modul 01: Persiapan Kredensial dan Konfigurasi Supabase Cloud

[Kembali ke Index Panduan Deployment](./README.md) | [Lanjut ke Modul 02: Deployment Vercel](./02-deployment-vercel.md)

---

## Tujuan Modul

Menyiapkan instance Supabase Cloud untuk kebutuhan lingkungan produksi. Supabase menangani otentikasi admin, basis data PostgreSQL, dan penyimpanan media publik (berita, galeri, formulir PPDB).

---

## Langkah 1: Ekstraksi Kunci API dan Environment Variables

Aplikasi Next.js 15 membutuhkan tiga variabel lingkungan dari Supabase:

1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard).
2. Pilih proyek produksi MIM PK Dimoro.
3. Buka menu **Project Settings** (ikon gerigi di bilah navigasi bawah) lalu pilih menu **API** (`https://supabase.com/project/<project-ref>/settings/api`).
4. Salin tiga nilai berikut:

| Nama Variabel | Lokasi di Supabase | Sifat Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Publik | Endpoint REST API Supabase (contoh: `https://<project-ref>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project API Keys -> `anon public` | Publik | Kunci client yang dibatasi oleh aturan RLS (Row Level Security). |
| `SUPABASE_SERVICE_ROLE_KEY` | Project API Keys -> `service_role secret` | Rahasia | Kunci server level dengan hak bypass RLS. Tidak boleh dipublikasikan ke browser. |

> [!WARNING]
> Nilai `SUPABASE_SERVICE_ROLE_KEY` memiliki hak akses penuh ke seluruh tabel database. Kunci ini hanya boleh dimasukkan pada dashboard Vercel sebagai environment variable server-only dan tidak boleh diberi prefix `NEXT_PUBLIC_`.

---

## Langkah 2: Konfigurasi Supabase Authentication

Supabase Auth memerlukan pengaturan URL agar proses redirect callback setelah login admin tidak ditolak oleh sistem keamanan browser.

1. Buka menu **Authentication** lalu pilih **URL Configuration**.
2. **Ubah Site URL**:
   - Ganti `http://localhost:3000` dengan URL domain resmi menggunakan protokol HTTPS.
   - Contoh: `https://mimpkdimoro.sch.id`
3. **Daftarkan Redirect URLs**:
   Pada bagian *Redirect URLs*, klik **Add URL** dan masukkan endpoint callback berikut:
   - `https://mimpkdimoro.sch.id/auth/callback`
   - `https://www.mimpkdimoro.sch.id/auth/callback`
   - `https://*-<team-slug>.vercel.app/auth/callback` (untuk preview deployment Vercel)
   - `http://localhost:3000/auth/callback` (untuk pengembangan lokal)
4. Klik **Save changes**.

> [!IMPORTANT]
> Jika URL callback ini tidak didaftarkan, login admin pada rute `/admin/login` akan menghasilkan galat `redirect_uri_mismatch`.

---

## Langkah 3: Konfigurasi Supabase Storage dan Policies

Sistem informasi MIM PK Dimoro menggunakan Supabase Storage untuk menyimpan media publik (berita, galeri, foto prestasi) dan dokumen sensitif (berkas PPDB, dokumen siswa, rapor).

### 1. Daftar Bucket yang Digunakan Proyek

Berdasarkan skema proyek, terdapat 5 bucket penyimpanan:

| Nama Bucket | Sifat Akses | Batas Ukuran | Tipe MIME yang Diizinkan | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| `konten-publik` | Publik (`public = true`) | 5 MB | `image/jpeg`, `image/png`, `image/webp`, `image/gif` | Gambar berita, galeri, dan eskul |
| `dokumentasi-prestasi` | Publik (`public = true`) | 5 MB | `image/jpeg`, `image/png`, `image/webp` | Foto piagam/prestasi siswa |
| `dokumen-pendukung` | Privat (`public = false`) | 10 MB | `application/pdf`, `image/jpeg`, `image/png`, `image/webp` | Lampiran berkas pendaftar PPDB |
| `dokumen-pribadi` | Privat (`public = false`) | 10 MB | `application/pdf`, `image/jpeg`, `image/png`, `image/webp` | Berkas administrasi siswa |
| `dokumen-rapor` | Privat (`public = false`) | 20 MB | `application/pdf` | Berkas rapor siswa |

### 2. Jika Bucket Belum Ada di Supabase

Jika Anda membuka menu **Storage** -> **Buckets** dan mendapati bucket di atas belum tersedia, gunakan salah satu dari dua cara berikut untuk membuatnya:

#### Cara A: Otomatis Menggunakan SQL Editor (Rekomendasi)
Cara ini membuat seluruh bucket sekaligus memasang aturan keamanan (RLS Policies) secara presisi.

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) -> pilih proyek Anda.
2. Pada bilah samping kiri, buka menu **SQL Editor**.
3. Klik **New query**, lalu salin dan jalankan skrip SQL berikut:

```sql
-- 1. Buat bucket penyimpanan
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('konten-publik', 'konten-publik', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('dokumentasi-prestasi', 'dokumentasi-prestasi', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('dokumen-pendukung', 'dokumen-pendukung', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('dokumen-pribadi', 'dokumen-pribadi', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('dokumen-rapor', 'dokumen-rapor', false, 20971520, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- 2. Kebijakan RLS untuk konten-publik
CREATE POLICY "Public read konten-publik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'konten-publik');

CREATE POLICY "Authenticated upload konten-publik"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'konten-publik' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete konten-publik"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'konten-publik' AND auth.role() = 'authenticated');

-- 3. Kebijakan RLS untuk dokumentasi-prestasi
CREATE POLICY "Public read dokumentasi-prestasi"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'dokumentasi-prestasi');

CREATE POLICY "Authenticated upload dokumentasi-prestasi"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'dokumentasi-prestasi' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete dokumentasi-prestasi"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'dokumentasi-prestasi' AND auth.role() = 'authenticated');

-- 4. Kebijakan RLS untuk dokumen-pendukung (PPDB)
CREATE POLICY "Authenticated upload dokumen-pendukung"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'dokumen-pendukung' AND auth.role() = 'authenticated');
```
4. Klik tombol **Run** (atau tekan `Ctrl + Enter`).
5. Buka kembali menu **Storage** -> **Buckets** untuk memverifikasi kelima bucket telah muncul.

#### Cara B: Manual Melalui Antarmuka Dashboard (UI)
Jika memilih membuat secara manual:
1. Buka menu **Storage** -> **Buckets** -> klik tombol **New bucket**.
2. Masukkan **Name of bucket** sesuai tabel di atas (contoh: `konten-publik`).
3. Sesuaikan opsi **Public bucket**:
   - Untuk `konten-publik` dan `dokumentasi-prestasi`: aktifkan toggle **Public bucket** (ON).
   - Untuk `dokumen-pendukung`, `dokumen-pribadi`, dan `dokumen-rapor`: biarkan nonaktif (OFF).
4. Klik **Save**.
5. Ulangi untuk bucket lainnya.
6. Untuk bucket publik, buka menu **Policies** di tab Storage untuk memastikan operasi `SELECT` diizinkan bagi umum (`anon`).

### 4. Integrasi dengan Next.js Image
Proyek ini mengonfigurasi `next.config.ts` untuk memetakan domain storage secara otomatis saat `NEXT_PUBLIC_SUPABASE_URL` diisi:
```typescript
remotePatterns: [
  ...(supabaseUrlConfig
    ? [
        {
          protocol: supabaseUrlConfig.protocol,
          hostname: supabaseUrlConfig.hostname,
          port: supabaseUrlConfig.port,
          pathname: '/storage/v1/object/public/**',
        },
      ]
    : []),
]
```

---

## Langkah 4: Verifikasi Skema Database dan RLS

Pastikan tabel dan kebijakan keamanan telah diterapkan sebelum aplikasi menerima lalu lintas publik:

1. Buka menu **Table Editor** di Supabase.
2. Pastikan tabel berikut telah dibuat:
   - `profiles` (data administrator)
   - `articles` / `news` (konten artikel dan berita)
   - `registrations` / `ppdb_registrations` (data formulir pendaftaran)
   - `school_profile` (identitas dan profil madrasah)
   - `messages` / `contact_messages` (pesan formulir kontak)
3. Pastikan indikator **RLS Enabled** aktif pada tabel-tabel tersebut.

---

## Checklist Modul 01

- [ ] Nilai `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` sudah dicatat.
- [ ] Kolom *Site URL* pada Supabase Auth telah disesuaikan ke domain produksi.
- [ ] Alamat callback `/auth/callback` untuk domain resmi telah terdaftar di *Redirect URLs*.
- [ ] Bucket media berstatus *Public* dengan aturan baca terbuka.
- [ ] Seluruh tabel database produksi memiliki skema lengkap dengan RLS aktif.

---

[Lanjut ke Modul 02: Setup Repository dan Deployment Vercel](./02-deployment-vercel.md)
