# Modul 01: Persiapan Kredensial & Konfigurasi Supabase Cloud

> **Bagian dari Alur Deployment MIM PK Dimoro**  
> ⬅️ Kembali ke [Index Panduan Deployment](./README.md) | ➡️ Lanjut ke [Modul 02: Deployment Vercel](./02-deployment-vercel.md)

---

## 🎯 Tujuan Modul
Modul ini memandu Anda dalam menyiapkan dan mengamankan instance **Supabase Cloud** untuk kebutuhan produksi. Supabase bertindak sebagai backend utama sistem MIM PK Dimoro, menangani:
- **Authentication**: Sesi login administrator dan proteksi rute `/admin`.
- **Database (PostgreSQL)**: Penyimpanan data sekolah, berita, data PPDB, galeri, dan pesan masuk.
- **Storage**: Media penyimpanan gambar berita, banner, dokumentasi fasilitas, dan berkas pendaftaran.

---

## 🔑 Langkah 1: Ekstraksi Kunci API & Environment Variables

Aplikasi Next.js 15 memerlukan 3 variabel lingkungan utama untuk berkomunikasi dengan Supabase.

1. Buka browser dan login ke [Supabase Dashboard](https://supabase.com/dashboard).
2. Pilih proyek produksi **MIM PK Dimoro** Anda.
3. Pada bilah navigasi sebelah kiri (sidebar bawah), klik ikon gerigi **Project Settings** $\rightarrow$ pilih menu **API** (atau akses URL: `https://supabase.com/project/<your-project-id>/settings/api`).
4. Catat dan amankan 3 variabel berikut:

| Nama Variabel | Lokasi di Supabase | Tipe Kunci | Deskripsi |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** | Publik | URL REST API proyek (contoh: `https://xyzprojectref.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project API Keys** $\rightarrow$ `anon` / `public` | Publik | Kunci client aman-browser untuk request yang dibatasi oleh RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Project API Keys** $\rightarrow$ `service_role` / `secret` | **Rahasia (Secret)** | Kunci server level bypass RLS. **Dilarang keras** disebarkan atau dipublikasikan ke klien! |

> [!WARNING]
> **PENTING**: Kunci `SUPABASE_SERVICE_ROLE_KEY` memiliki hak akses penuh ke seluruh database tanpa filter RLS. Pastikan hanya dimasukkan pada environment Vercel dan **tidak pernah** memiliki prefix `NEXT_PUBLIC_`.

---

## 🔐 Langkah 2: Konfigurasi Supabase Authentication

Supabase Auth membutuhkan konfigurasi URL yang tepat agar proses login admin dan pengalihan (*redirect callback*) tidak diblokir oleh browser.

1. Pada sidebar kiri Supabase, buka menu **Authentication** $\rightarrow$ pilih submenu **URL Configuration**.
2. **Ubah Site URL**:
   - Ganti `http://localhost:3000` menjadi domain produksi utama Anda (gunakan protokol `https://`).
   - Contoh: `https://mimpkdimoro.sch.id`
   - *Tujuan*: Menjadi URL rujukan utama ketika Supabase mengirimkan tautan konfirmasi atau reset kata sandi.
3. **Tambahkan Redirect URLs (Whitelist Callback)**:
   Klik tombol **Add URL** pada bagian *Redirect URLs* dan daftarkan endpoint callback berikut:
   - `https://mimpkdimoro.sch.id/auth/callback`
   - `https://www.mimpkdimoro.sch.id/auth/callback`
   - `https://*-<team-or-username>.vercel.app/auth/callback` *(Opsional: untuk mendukung Preview Deployment Vercel)*
   - `http://localhost:3000/auth/callback` *(Tetap simpan untuk pengujian di komputer lokal)*
4. Klik **Save changes**.

> [!IMPORTANT]
> Jika URL callback ini tidak didaftarkan, login admin akan mengalami error:  
> `error: redirect_uri_mismatch` atau tertahan pada halaman kosong setelah menekan tombol login.

---

## 🗄️ Langkah 3: Konfigurasi Supabase Storage & Policy

Sistem berita dan PPDB MIM PK Dimoro menyimpan gambar serta dokumen di Supabase Storage. Agar gambar dapat dioptimasi oleh Next.js (`next/image`), bucket harus memiliki hak baca publik.

### 1. Periksa Ketersediaan Bucket
Buka menu **Storage** $\rightarrow$ **Buckets** di dashboard Supabase. Pastikan bucket berikut telah dibuat:
- `news` (untuk gambar sampul dan konten berita)
- `gallery` (untuk dokumentasi kegiatan sekolah)
- `facilities` (untuk foto sarana prasarana sekolah)
- `ppdb` (untuk lampiran berkas pendaftaran calon siswa)

### 2. Pengaturan Public Access pada Bucket
1. Klik tanda titik tiga (`...`) pada masing-masing bucket publik (`news`, `gallery`, `facilities`).
2. Pilih **Edit bucket** $\rightarrow$ Pastikan toggle **Public bucket** dalam kondisi **ON / Aktif**.
3. Simpan perubahan.

### 3. Kebijakan RLS Storage (Storage Policies)
Pastikan aturan berikut aktif pada storage policies:
- **SELECT (Read)**: Diizinkan untuk umum (`anon` & `authenticated`) agar foto berita dapat tampil pada pengunjung situs.
- **INSERT/UPDATE/DELETE**: Hanya diizinkan untuk pengguna dengan sesi login terotentikasi (`authenticated` admin).

### 4. Integrasi dengan Next.js Image Optimization
Proyek MIM PK Dimoro telah diprogram di file [`next.config.ts`](../../next.config.ts) untuk mendeteksi `NEXT_PUBLIC_SUPABASE_URL` secara otomatis:
```typescript
// next.config.ts
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
  // ...
]
```
Dengan konfigurasi ini, ketika variabel `NEXT_PUBLIC_SUPABASE_URL` dimasukkan ke Vercel, Next.js akan secara otomatis mengizinkan dan mengompresi gambar dari Supabase Storage Anda.

---

## 📊 Langkah 4: Verifikasi Skema Database & RLS

Pastikan seluruh tabel database produksi telah sinkron sebelum aplikasi Next.js online.

1. Buka menu **Table Editor** di Supabase.
2. Periksa keberadaan tabel utama:
   - `profiles` (data administrator / user)
   - `articles` / `news` (data postingan berita)
   - `registrations` / `ppdb_registrations` (data formulir pendaftaran siswa baru)
   - `school_profile` (profil identitas sekolah)
   - `messages` / `contact_messages` (pesan dari form kontak)
3. Pastikan indikator **RLS Enabled** berwarna hijau pada seluruh tabel sensitif untuk menjamin integritas data.

---

## ✅ Checklist Selesai Modul 01

Sebelum melanjutkan ke Modul 02, pastikan Anda telah mencentang:
- [ ] Menyalin 3 kunci API (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- [ ] Mengubah *Site URL* ke domain `https://<domain-resmi>`.
- [ ] Menambahkan daftar *Redirect URLs* termasuk endpoint `/auth/callback`.
- [ ] Memverifikasi bucket storage publik berstatus *Public* dengan kebijakan SELECT terbuka.
- [ ] Memastikan database produksi memiliki skema tabel yang lengkap dan RLS aktif.

---

➡️ **Langkah Selanjutnya:** Lanjut ke [**Modul 02: Setup Repository & Deployment Vercel**](./02-deployment-vercel.md) untuk menghubungkan kode sumber dan mendeploy aplikasi.
