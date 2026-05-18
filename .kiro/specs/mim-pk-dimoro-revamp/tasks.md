# Implementation Plan: MIM PK Dimoro Website Revamp

## Overview

Revamp website profil sekolah dari TK ABA Mertosanan menjadi MIM PK Dimoro. Pendekatan: konfigurasi terpusat di `lib/school-config.ts`, CSS token propagation untuk tema warna, dan file-based asset swap untuk logo/favicon. Tidak ada perubahan skema database.

Implementasi dibagi dua fase: **Fase 1** (identitas & metadata) harus selesai sebelum **Fase 2** (konten halaman publik) dimulai.

---

## Tasks

- [-] 1. Fase 1 — Identitas, Metadata, Warna, dan Aset

  - [x] 1.1 Buat `lib/school-config.ts` — konfigurasi terpusat identitas sekolah
    - Buat file baru `lib/school-config.ts` dengan semua konstanta yang didefinisikan di design: `SCHOOL_NAME`, `SCHOOL_FULL_NAME`, `SCHOOL_SHORT_NAME`, `SCHOOL_DESCRIPTION`, `SCHOOL_ABOUT_DESCRIPTION`, `SCHOOL_LOGO_PATH`, `SCHOOL_LOGO_ALT`, `SCHOOL_DOMAIN`, `SCHOOL_LEVEL`, `SCHOOL_TAGLINE`
    - Nilai `SCHOOL_NAME` diisi `"[NAMA SEKOLAH]"` sebagai placeholder
    - Semua konstanta menggunakan `export const` (named exports) agar TypeScript mendeteksi typo saat build
    - _Requirements: 1.1, 1.2, 1.3, 9.1_

  - [x] 1.2 Update `app/globals.css` — tema warna hijau (light + dark mode)
    - Ganti nilai `--primary` di `:root` dari kuning (`49 100% 75%`) ke hijau sedang (`142 70% 40%`)
    - Set `--primary-foreground` ke `0 0% 100%` (putih) untuk kontras 7.2:1
    - Update `--secondary`, `--secondary-foreground`, `--accent`, `--accent-foreground`, `--ring` sesuai tabel di design
    - Update dark mode (`.dark`): `--primary` ke `142 60% 50%`, `--secondary` ke `142 30% 20%`, `--secondary-foreground` ke `142 50% 85%`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [-] 1.3 Tulis property test untuk rasio kontras WCAG AA (Property 2)
    - Install `fast-check` jika belum ada: `npm install --save-dev fast-check`
    - Buat `lib/__tests__/color-contrast.test.ts`
    - Implementasi helper `calculateContrastRatio(hsl1, hsl2)` di `lib/color-utils.ts`
    - Tulis test yang memverifikasi `--primary` (`142 70% 40%`) vs `--primary-foreground` (`0 0% 100%`) menghasilkan rasio ≥ 4.5:1
    - **Property 2: Rasio kontras warna memenuhi WCAG AA**
    - **Validates: Requirements 3.3**

  - [x] 1.4 Update `app/layout.tsx` — metadata SEO dan metadataBase
    - Ganti `defaultUrl` dari `VERCEL_URL` ke `process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"`
    - Import `SCHOOL_NAME`, `SCHOOL_DESCRIPTION` dari `lib/school-config.ts`
    - Update `metadata.title` menggunakan `SCHOOL_NAME`
    - Update `metadata.description` menggunakan `SCHOOL_DESCRIPTION`
    - Set `metadataBase` menggunakan `new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")`
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 1.5 Update `app/sitemap.ts` dan `app/robots.ts` — base URL domain baru
    - Di `app/sitemap.ts`: ganti base URL hardcoded ke `process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"`
    - Di `app/robots.ts`: ganti base URL hardcoded ke `process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"`
    - Pertahankan aturan `disallow` yang sudah ada untuk `/admin`, `/portal`, `/auth`, `/api`
    - _Requirements: 2.4, 2.5, 2.6_

  - [x] 1.6 Buat aset visual placeholder — logo, favicon, OG image
    - Buat `public/logo-mim-pk-dimoro.png`: SVG/PNG placeholder hijau dengan inisial "MIM" (minimal 200×200px)
    - Ganti `app/favicon.ico`: favicon hijau 32×32 dengan inisial "M"
    - Ganti `app/opengraph-image.png`: placeholder hijau dengan nama sekolah (1200×630px)
    - Ganti `app/twitter-image.png`: placeholder hijau dengan nama sekolah (1200×600px)
    - File `public/Logo-TK-ABA.png` dipertahankan (tidak dihapus)
    - _Requirements: 4.1, 4.2, 4.5_

  - [-] 1.7 Update `components/layout/Navbar.tsx` — logo dan nama sekolah
    - Import `SCHOOL_NAME`, `SCHOOL_LOGO_PATH`, `SCHOOL_LOGO_ALT` dari `lib/school-config.ts`
    - Ganti `src="/Logo-TK-ABA.png"` → `src={SCHOOL_LOGO_PATH}`
    - Ganti `alt` logo → `SCHOOL_LOGO_ALT`
    - Ganti teks hardcoded "TK ABA" dan "Mertosanan" → `SCHOOL_NAME`
    - _Requirements: 1.1, 1.4, 4.3, 4.4_

  - [-] 1.8 Update `components/layout/Footer.tsx` — logo, nama, jam MI, fallback kontak
    - Import konstanta dari `lib/school-config.ts`
    - Ganti logo `src`, `alt`, nama sekolah, tagline menggunakan konstanta
    - Ganti jam sekolah hardcoded (07:30–11:00) → jam MI (07:00–13:00)
    - Ganti fallback teks kontak: "Alamat tidak tersedia" → "Informasi alamat segera tersedia", dst. (sesuai `FALLBACK_MESSAGES` di design)
    - Ganti copyright text: "TK ABA Mertosanan" → `SCHOOL_FULL_NAME`
    - _Requirements: 1.1, 1.2, 1.4, 4.3, 4.4, 8.2_

  - [~] 1.9 Checkpoint Fase 1 — verifikasi identitas dan build
    - Pastikan semua import dari `lib/school-config.ts` tidak ada TypeScript error
    - Pastikan file `public/logo-mim-pk-dimoro.png` ada
    - Jalankan `next build` — harus sukses tanpa error
    - Verifikasi tidak ada teks "TK ABA Mertosanan" di Navbar dan Footer
    - Ensure all tests pass, ask the user if questions arise.

- [ ] 2. Fase 2 — Konten Halaman Publik (Beranda)

  - [~] 2.1 Update `components/home/HomeHero.tsx` — judul dan subtitle
    - Import `SCHOOL_NAME`, `SCHOOL_TAGLINE` dari `lib/school-config.ts`
    - Ganti judul "TK ABA Mertosanan" → `SCHOOL_NAME`
    - Ganti subtitle "Pendidikan Anak Berkualitas dengan Nilai Islami" → `SCHOOL_TAGLINE`
    - Ganti slide images dari domain `tk-aba-mertosanan.sch.id` → gambar Pexels generik (sekolah/madrasah)
    - Ganti alt text slide images agar relevan untuk MI
    - _Requirements: 5.1, 5.2, 5.7_

  - [~] 2.2 Update `components/home/AboutSection.tsx` — deskripsi sekolah
    - Import `SCHOOL_NAME`, `SCHOOL_ABOUT_DESCRIPTION` dari `lib/school-config.ts`
    - Ganti judul "Selamat Datang di TK ABA Mertosanan" → `"Selamat Datang di " + SCHOOL_NAME`
    - Ganti deskripsi PAUD → `SCHOOL_ABOUT_DESCRIPTION`
    - Ganti gambar dari domain TK lama → gambar Pexels generik
    - _Requirements: 5.3, 5.7_

  - [~] 2.3 Update `components/home/StatsSection.tsx` — nilai placeholder MI
    - Ganti nilai stats dummy menjadi placeholder yang lebih netral untuk MI
    - Nilai tetap sebagai hardcoded placeholder yang dapat diubah developer di kode
    - _Requirements: 5.5, 9.1, 9.2_

  - [~] 2.4 Update `components/home/CTASection.tsx` — teks CTA MI
    - Import `SCHOOL_NAME` dari `lib/school-config.ts`
    - Ganti "Mari bergabung bersama TK ABA Mertosanan" → `"Mari Bergabung Bersama " + SCHOOL_NAME`
    - Ganti teks deskripsi PAUD → teks MI yang mengarahkan ke halaman Kontak
    - _Requirements: 5.6, 5.7_

  - [~] 2.5 Update `components/home/ProgramSection.tsx` — 3 program MI
    - Ganti 3 program cards TK (Kreativitas, Bahasa Asing, Kesehatan) → 3 program MI:
      - Program Tahfidz Al-Qur'an
      - Program Sains & Teknologi
      - Program Pengembangan Karakter
    - _Requirements: 5.4, 5.7_

- [ ] 3. Fase 2 — Konten Halaman Tentang Kami

  - [~] 3.1 Update `app/tentang-kami/page.tsx` — metadata dan teks halaman
    - Import `SCHOOL_NAME`, `SCHOOL_FULL_NAME` dari `lib/school-config.ts`
    - Ganti `description` PageHeader agar merujuk pada MIM PK Dimoro
    - Ganti teks Visi → `[VISI SEKOLAH]` (placeholder)
    - Ganti teks Misi → 5 poin placeholder MI (kurikulum Kemenag, nilai Islam, dll.)
    - Perbaiki typo "bberakhlak" → "berakhlak"
    - Ganti teks CTA
    - Pastikan tidak ada referensi ke jenjang TK, usia 3–6 tahun, atau PAUD
    - _Requirements: 6.1, 6.2, 6.4, 6.6, 6.7_

  - [~] 3.2 Update `components/tentang-kami/SchoolIdentity.tsx` — data placeholder MI
    - Ganti `identityData` array dengan data placeholder MI sesuai design:
      - NPSN: `[NPSN]`, NSM: `[NSM]`, Tanggal Berdiri: `[TANGGAL BERDIRI]`
      - Status Sekolah: Swasta, Akreditasi: `[AKREDITASI]`
      - Bentuk Pendidikan: Madrasah Ibtidaiyah
      - Alamat: `[ALAMAT SEKOLAH]`, Desa/Kelurahan: Dimoro
      - Kecamatan: `[KECAMATAN]`, Kabupaten: `[KABUPATEN]`, Provinsi: `[PROVINSI]`
    - _Requirements: 6.3, 9.1, 9.2_

- [ ] 4. Fase 2 — Konten Halaman Program

  - [~] 4.1 Update `app/program/page.tsx` — 6 tabs kelas MI, jadwal, dan ekskul
    - Ganti `description` PageHeader agar merujuk pada program MI
    - Ganti Tabs: 3 tabs (KB, TK A, TK B) → 6 tabs (Kelas 1–6) dengan `grid-cols-6`
    - Isi konten setiap tab dengan `ProgramDetails` untuk masing-masing kelas MI (kurikulum Kemenag, muatan lokal, program tahfidz) sebagai placeholder
    - Ganti Kegiatan Harian: jam 07:30–11:00 → jam 07:00–13:00
    - Ganti Ekstrakurikuler: 4 ekskul TK → 4 ekskul MI (Tapak Suci, Hizbul Wathan, Tahfidz, Pramuka)
    - Ganti teks CTA
    - Pastikan tidak ada konten spesifik jenjang TK
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 5. Fase 2 — Konten Halaman Kontak

  - [~] 5.1 Update `app/kontak/page.tsx` — fallback netral, maps conditional render, FAQ MI
    - Ganti semua fallback teks lama yang merujuk TK → format "Informasi ... segera tersedia" (sesuai `FALLBACK_MESSAGES` di design)
    - Ganti pola `<iframe src={undefined}>` → conditional render: jika `isTrustedDomain(url)` false, render `<div>` dengan pesan "Peta lokasi segera tersedia"
    - Ganti 4 FAQ hardcoded TK → 4 FAQ MI yang relevan (pendaftaran, kurikulum, jam sekolah, dll.)
    - Ganti `title` iframe: "Lokasi TK ABA Mertosanan" → "Lokasi MIM PK Dimoro"
    - Pertahankan `ContactForm` dan validasi `isTrustedDomain` tanpa perubahan fungsionalitas
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 5.2 Tulis property test untuk fallback kontak (Property 3)
    - Buat `app/__tests__/kontak-fallback.test.ts`
    - Gunakan `fast-check` untuk generate kombinasi field kontak (`alamat`, `whatsapp`, `email_utama`) yang bernilai `null`, `undefined`, atau string kosong
    - Verifikasi output tidak mengandung "TK ABA Mertosanan" atau "tidak tersedia" (format lama)
    - Verifikasi output menggunakan format "Informasi ... segera tersedia"
    - **Property 3: Fallback kontak tidak mengandung referensi TK lama**
    - **Validates: Requirements 8.2**

  - [ ]* 5.3 Tulis property test untuk maps embed safety (Property 4)
    - Buat `app/__tests__/maps-embed.test.ts`
    - Gunakan `fast-check` untuk generate URL tidak tepercaya: `null`, `undefined`, string kosong, `fc.webUrl()`, `fc.string()`
    - Untuk setiap URL yang tidak lolos `isTrustedDomain`, verifikasi tidak ada `<iframe>` di output render
    - Verifikasi teks "segera tersedia" muncul sebagai pengganti
    - **Property 4: Maps embed aman untuk semua URL tidak tepercaya**
    - **Validates: Requirements 8.4**

- [ ] 6. Verifikasi Akhir

  - [~] 6.1 Verifikasi tidak ada teks "TK ABA Mertosanan" di halaman publik
    - Jalankan `grep -r "TK ABA Mertosanan" components/ app/ lib/` — harus tidak ada hasil di file yang dimodifikasi
    - Verifikasi manual di Navbar, Footer, HomeHero, AboutSection, CTASection, ProgramSection, halaman Tentang Kami, Program, dan Kontak
    - _Requirements: 1.4, 6.6, 7.5_

  - [~] 6.2 Jalankan `next build` — harus sukses tanpa error
    - Jalankan `next build` di root project
    - Pastikan tidak ada TypeScript error, missing import, atau broken image reference
    - Pastikan semua halaman publik berhasil di-generate
    - _Requirements: 10.8_

  - [~] 6.3 Verifikasi fitur yang dipertahankan tidak regresi
    - Verifikasi halaman `/berita`, `/galeri`, `/kalender-akademik` masih dapat diakses
    - Verifikasi halaman `/admin` masih dapat diakses dan berfungsi
    - Verifikasi halaman `/auth` dan `/portal` masih dapat diakses
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [~] 6.4 Final checkpoint — Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Task bertanda `*` adalah opsional dan dapat dilewati untuk MVP yang lebih cepat
- **Fase 1 (task 1.x) harus selesai sebelum Fase 2 (task 2.x–5.x) dimulai** — komponen halaman publik bergantung pada `lib/school-config.ts` dan aset visual
- Setiap task mereferensikan requirement spesifik untuk traceability
- Placeholder format `[NAMA_FIELD_KAPITAL]` digunakan secara konsisten untuk data yang belum tersedia
- File `public/Logo-TK-ABA.png` dipertahankan (tidak dihapus) sesuai design
- Property tests menggunakan `fast-check` — install dengan `npm install --save-dev fast-check`

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.4", "1.5", "1.6"] },
    { "id": 2, "tasks": ["1.3", "1.7", "1.8"] },
    { "id": 3, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "3.1", "3.2", "4.1", "5.1"] },
    { "id": 4, "tasks": ["5.2", "5.3"] },
    { "id": 5, "tasks": ["6.1", "6.2", "6.3"] }
  ]
}
```
