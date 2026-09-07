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

Sistem berita dan PPDB menyimpan berkas dan gambar di Supabase Storage. Agar gambar dapat dioptimasi oleh Next.js Image Optimization (`next/image`), bucket harus dapat dibaca secara publik.

### 1. Verifikasi Keberadaan Bucket
Buka menu **Storage** -> **Buckets**. Pastikan bucket berikut tersedia:
- `news` (konten gambar berita)
- `gallery` (dokumentasi kegiatan)
- `facilities` (foto sarana prasarana)
- `ppdb` (berkas lampiran formulir pendaftaran)

### 2. Pengaturan Akses Publik
1. Klik menu titik tiga pada bucket `news`, `gallery`, dan `facilities`.
2. Pilih **Edit bucket** lalu pastikan opsi **Public bucket** aktif.
3. Simpan perubahan.

### 3. Kebijakan Akses (Storage Policies)
- Operasi `SELECT`: Terbuka untuk umum (`anon` dan `authenticated`) agar aset gambar dapat ditampilkan ke publik.
- Operasi `INSERT`, `UPDATE`, `DELETE`: Dibatasi hanya untuk akun terotentikasi (`authenticated` admin).

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
