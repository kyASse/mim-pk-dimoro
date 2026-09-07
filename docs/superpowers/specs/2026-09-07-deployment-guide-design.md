# Spesifikasi Desain: Panduan Deployment Modular (Vercel & Hostinger DNS)

- **Tanggal**: 2026-09-07
- **Topik**: Dokumentasi Alur Deployment Proyek MIM PK Dimoro ke Vercel dengan DNS Hostinger
- **Status**: Disetujui (Approved)

---

## 1. Latar Belakang & Tujuan
Proyek MIM PK Dimoro dibangun menggunakan Next.js 15+ (App Router), TypeScript, Tailwind CSS, dan Supabase sebagai backend/database/auth/storage. Untuk menjalankan sistem ini di lingkungan produksi, aplikasi di-deploy pada platform Vercel (Edge Network & Serverless) dan dihubungkan ke domain kustom sekolah yang dikelola melalui DNS Zone di Hostinger hPanel.

Tujuan dari dokumentasi ini adalah menyediakan panduan langkah-demi-langkah (SOP) yang modular, mudah dipahami, akurat, dan bebas ambigu bagi developer maupun tim IT sekolah untuk:
1. Menyiapkan kredensial dan konfigurasi Supabase untuk domain produksi.
2. Mengonfigurasi dan men-deploy repositori GitHub ke platform Vercel.
3. Memetakan catatan DNS (A Record untuk Apex domain dan CNAME untuk subdomain `www`) di Hostinger hPanel.
4. Memverifikasi propagasi DNS, penerbitan SSL gratis otomatis dari Vercel, serta melakukan pengujian fungsional dan troubleshooting.

---

## 2. Struktur Direktori Dokumentasi
Dokumentasi disusun secara modular di dalam folder `docs/deployment/`:

```text
docs/deployment/
├── README.md                      # Index, diagram alur arsitektur, prasyarat akses & checklist global
├── 01-persiapan-dan-supabase.md   # Setup kredensial API, Site URL Auth, Redirect URLs, Storage Bucket & RLS
├── 02-deployment-vercel.md        # Pengaturan repo GitHub, import proyek Vercel, Environment Variables, & Build
├── 03-konfigurasi-dns-hostinger.md # Konfigurasi DNS Zone Hostinger (A & CNAME) + Domain Vercel + SSL
└── 04-verifikasi-troubleshooting.md # Post-deploy checklist, audit fitur kritis, & panduan perbaikan error umum
```

---

## 3. Rincian Muatan Teknis Modul

### 3.1. `docs/deployment/README.md`
- **Diagram Arsitektur**:
  ```text
  [Pengguna / Browser]
          │
          ▼ (HTTPS)
  [Hostinger DNS Zone] ──(A: 76.76.21.21 / CNAME: cname.vercel-dns.com)──► [Vercel Edge Network]
                                                                                   │
                                                                                   ▼ (Next.js 15 App)
                                                                           [Supabase Cloud Platform]
                                                                           (Auth, Database, Storage)
  ```
- **Daftar Prasyarat Akses & Akun**:
  - Akun GitHub dengan akses tulis ke repository `mim-pk-dimoro`.
  - Akun Vercel (dihubungkan ke akun GitHub).
  - Akun Hostinger hPanel dengan kepemilikan domain aktif.
  - Akun Supabase dengan proyek aktif (database, auth, storage).
- **Checklist Global Deployment**: Tabel tahapan dengan status pelacakan (`[ ] Belum`, `[-] Sedang`, `[x] Selesai`).

### 3.2. `docs/deployment/01-persiapan-dan-supabase.md`
- **Ekstraksi Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Project URL (`https://<project-ref>.supabase.co`).
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public client key.
  - `SUPABASE_SERVICE_ROLE_KEY`: Secret server key (bukan untuk browser).
- **Konfigurasi Supabase Authentication**:
  - **Site URL**: Diganti dari `http://localhost:3000` menjadi domain resmi (contoh: `https://mimpkdimoro.sch.id`).
  - **Additional Redirect URLs**:
    - `https://mimpkdimoro.sch.id/auth/callback`
    - `https://www.mimpkdimoro.sch.id/auth/callback`
    - `http://localhost:3000/auth/callback` (untuk pengujian lokal)
- **Konfigurasi Storage Bucket**:
  - Memastikan bucket publik (misal untuk gambar berita, galeri, foto PPDB) memiliki policy `SELECT` publik.
  - Penjelasan sinkronisasi domain gambar di `next.config.ts` (`remotePatterns`).
- **Verifikasi Skema Database & RLS**:
  - Memastikan migrasi tabel berjalan dan RLS diaktifkan sesuai standar keamanan.

### 3.3. `docs/deployment/02-deployment-vercel.md`
- **Pra-syarat Repository**:
  - Memastikan kode branch `main` bersih, tanpa error TypeScript atau lint (`npm run build` lokal sukses).
- **Langkah Pembuatan Proyek di Vercel**:
  1. Buka Vercel Dashboard $\rightarrow$ *Add New...* $\rightarrow$ *Project*.
  2. Impor repositori Git proyek.
  3. Framework Preset: Pilih `Next.js`.
  4. Root Directory: `./`.
  5. Build Command: `next build` (bawaan).
  6. Output Directory: `.next` (bawaan).
- **Konfigurasi Environment Variables di Vercel**:
  - Input `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY`.
  - Mengaktifkan checklist untuk environment `Production`, `Preview`, dan `Development`.
- **Deploy & Validasi Awal**:
  - Klik *Deploy*, pantau logs hingga status *Ready*.
  - Uji domain bawaan `*.vercel.app`.

### 3.4. `docs/deployment/03-konfigurasi-dns-hostinger.md`
- **Pendaftaran Custom Domain di Vercel**:
  1. Masuk ke Project Vercel $\rightarrow$ *Settings* $\rightarrow$ *Domains*.
  2. Tambahkan domain Apex (contoh: `mimpkdimoro.sch.id`) dan subdomain `www.mimpkdimoro.sch.id`.
  3. Atur opsi redirect bawaan (misal: redirect `www` ke apex domain atau sebaliknya).
- **Konfigurasi DNS Zone di Hostinger hPanel**:
  - Buka hPanel $\rightarrow$ *Domains* $\rightarrow$ Pilih domain $\rightarrow$ *DNS / Nameservers* $\rightarrow$ *DNS Records*.
  - **Record 1 (Apex Domain)**:
    - Type: `A`
    - Name: `@`
    - Points to: `76.76.21.21`
    - TTL: `300` (atau default 14400)
  - **Record 2 (Subdomain WWW)**:
    - Type: `CNAME`
    - Name: `www`
    - Points to: `cname.vercel-dns.com`
    - TTL: `300`
- **Catatan Konflik Record**:
  - Hapus A Record lama yang mengarah ke IP hosting Hostinger untuk nama `@` jika website sebelumnya di-hosting di Hostinger.
  - Hapus CNAME Record lama untuk `www` jika masih mengarah ke `@` atau server lain.
- **Penerbitan Sertifikat SSL**:
  - Vercel secara otomatis memvalidasi kepemilikan domain dan menerbitkan sertifikat SSL Let's Encrypt gratis (HTTPS).
  - Waktu propagasi rata-rata: 5 menit hingga 24 jam.

### 3.5. `docs/deployment/04-verifikasi-troubleshooting.md`
- **Checklist Verifikasi Pasca-Deployment**:
  - [ ] Domain utama dan `www` dapat diakses dengan protokol `https://` tanpa peringatan sertifikat.
  - [ ] Redirect otomatis dari HTTP ke HTTPS dan WWW ke non-WWW (atau sebaliknya).
  - [ ] Login Admin Dashboard `/admin` berhasil dan callback diarahkan dengan benar.
  - [ ] Pengunggahan gambar di admin/berita berhasil dan gambar tampil di halaman publik (`next/image`).
  - [ ] Formulir pendaftaran PPDB berhasil mengirim data ke database Supabase.
- **Panduan Troubleshooting Masalah Umum**:
  1. **DNS Status "Invalid Configuration" di Vercel**:
     - Cek propagasi via tool online (e.g. `whatsmydns.net`).
     - Pastikan tidak ada duplikasi A record pada `@`.
  2. **Supabase Auth Redirect Loop / 400 Bad Request**:
     - Periksa *Site URL* dan *Redirect URLs* di Supabase Dashboard agar persis sama dengan domain produksi.
  3. **Gambar Tidak Tampil (`hostname is not configured under images in your next.config.ts`)**:
     - Cek apakah `NEXT_PUBLIC_SUPABASE_URL` di Vercel sudah terisi dengan benar saat build time.
  4. **Build Failed di Vercel**:
     - Cek build log di Vercel tab Deployments, identifikasi apakah ada error linter, TypeScript strict, atau dependency yang hilang.

---

## 4. Rencana Implementasi Selanjutnya
Setelah spesifikasi ini ditinjau, langkah selanjutnya adalah:
1. Menjalankan skill `writing-plans` untuk merinci tahapan pembuatan file-file dokumentasi secara sistematis.
2. Mengeksekusi penulisan seluruh modul dokumen di dalam `docs/deployment/`.
3. Melakukan verifikasi kelengkapan isi dokumen terhadap standar proyek.
