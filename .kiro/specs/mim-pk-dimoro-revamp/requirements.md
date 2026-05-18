# Requirements Document

## Introduction

Proyek ini adalah revamp website profil sekolah dari TK ABA Mertosanan menjadi **Madrasah Ibtidaiyah Muhammadiyah Program Khusus Dimoro (MIM PK Dimoro)**. Codebase yang ada (Next.js + Tailwind CSS + Supabase) dipertahankan strukturnya; yang berubah adalah identitas visual, metadata, dan konten halaman publik.

Scope MVP ini mencakup dua fase yang dikerjakan oleh satu developer dalam 1–2 minggu:
- **Fase 1**: Penyesuaian identitas utama & metadata (hardcoded text, SEO, tema warna, aset visual)
- **Fase 2**: Penyesuaian konten halaman publik (Beranda, Tentang Kami, Program, Kontak)

Fitur di luar scope MVP (PPDB online, portal orang tua, keuangan, rapor) tidak dikerjakan dalam iterasi ini.

---

## Glossary

- **Website**: Aplikasi Next.js yang berjalan di domain `mimpkdimoro.sch.id`
- **MIM PK Dimoro**: Madrasah Ibtidaiyah Muhammadiyah Program Khusus Dimoro — nama resmi sekolah
- **[NAMA SEKOLAH]**: Placeholder untuk nama tampilan sekolah di UI, diisi saat data final tersedia
- **Halaman Publik**: Halaman yang dapat diakses tanpa autentikasi: Beranda, Tentang Kami, Program, Kontak, Berita, Galeri, Kalender Akademik
- **Hardcoded Text**: Teks yang ditulis langsung di dalam kode komponen (bukan dari database)
- **Tema Warna**: Palet warna yang didefinisikan melalui CSS custom properties di `globals.css` dan dikonsumsi oleh Tailwind
- **Metadata SEO**: Tag `<title>`, `<meta description>`, Open Graph, dan Twitter Card yang dihasilkan oleh `app/layout.tsx`
- **Sitemap**: File `sitemap.xml` yang dihasilkan oleh `app/sitemap.ts`
- **Robots**: File `robots.txt` yang dihasilkan oleh `app/robots.ts`
- **Placeholder**: Teks atau aset sementara yang digunakan ketika data final belum tersedia
- **Konten Dinamis**: Konten yang disimpan di Supabase dan dapat diedit melalui admin panel tanpa perubahan kode
- **Konten Statis**: Konten yang ditulis langsung di kode dan hanya dapat diubah oleh developer
- **Admin Panel**: Halaman `/admin` yang sudah ada, digunakan untuk mengelola konten dinamis
- **Developer**: Satu orang yang mengerjakan seluruh revamp ini

---

## Requirements


### Requirement 1: Penggantian Identitas Teks Sekolah

**User Story:** Sebagai pengunjung website, saya ingin melihat nama dan identitas MIM PK Dimoro di seluruh halaman, sehingga saya tahu bahwa website ini adalah milik MIM PK Dimoro dan bukan TK ABA Mertosanan.

#### Acceptance Criteria

1. THE Website SHALL menampilkan `[NAMA SEKOLAH]` sebagai nama tampilan sekolah di seluruh komponen UI yang sebelumnya menampilkan "TK ABA Mertosanan".
2. THE Website SHALL menggunakan "Madrasah Ibtidaiyah Muhammadiyah Program Khusus Dimoro" sebagai nama resmi sekolah pada teks formal (footer, halaman Tentang Kami, identitas sekolah).
3. WHEN Developer mengganti nilai placeholder `[NAMA SEKOLAH]` di satu lokasi konfigurasi terpusat, THE Website SHALL memperbarui nama tampilan di seluruh komponen yang mereferensikan konfigurasi tersebut.
4. THE Website SHALL tidak menampilkan teks "TK ABA Mertosanan", "TK", atau referensi ke jenjang taman kanak-kanak di halaman publik mana pun.

---

### Requirement 2: Pembaruan Metadata SEO

**User Story:** Sebagai developer, saya ingin metadata SEO website mencerminkan identitas MIM PK Dimoro dan domain yang benar, sehingga mesin pencari mengindeks website dengan informasi yang akurat.

#### Acceptance Criteria

1. THE Website SHALL menggunakan `[NAMA SEKOLAH]` sebagai nilai `title` default di `app/layout.tsx`.
2. THE Website SHALL menggunakan deskripsi yang merujuk pada MIM PK Dimoro sebagai nilai `description` di `app/layout.tsx`.
3. THE Website SHALL menggunakan `https://mimpkdimoro.sch.id` sebagai `metadataBase` ketika environment variable `NEXT_PUBLIC_SITE_URL` bernilai `https://mimpkdimoro.sch.id`.
4. THE Website SHALL menggunakan `https://mimpkdimoro.sch.id` sebagai base URL di `app/sitemap.ts` ketika environment variable `NEXT_PUBLIC_SITE_URL` bernilai `https://mimpkdimoro.sch.id`.
5. THE Website SHALL menggunakan `https://mimpkdimoro.sch.id` sebagai base URL di `app/robots.ts` ketika environment variable `NEXT_PUBLIC_SITE_URL` bernilai `https://mimpkdimoro.sch.id`.
6. THE Website SHALL mempertahankan aturan `disallow` yang sudah ada di `robots.ts` untuk path `/admin`, `/portal`, `/auth`, dan `/api`.

---

### Requirement 3: Penggantian Tema Warna ke Hijau

**User Story:** Sebagai pengunjung website, saya ingin melihat tampilan website dengan warna hijau sebagai warna utama, sehingga website mencerminkan identitas visual MIM PK Dimoro.

#### Acceptance Criteria

1. THE Website SHALL menggunakan warna hijau sebagai nilai CSS custom property `--primary` di `app/globals.css`.
2. THE Website SHALL mendefinisikan nilai `--primary` dalam format HSL yang kompatibel dengan Tailwind CSS (contoh: `142 70% 40%` untuk hijau sedang).
3. THE Website SHALL mempertahankan keterbacaan teks dengan rasio kontras minimum 4.5:1 antara `--primary-foreground` dan `--primary` sesuai standar WCAG AA.
4. THE Website SHALL memperbarui warna-warna pendukung (`--secondary`, `--accent`, `--highlight`) agar harmonis dengan warna hijau utama.
5. WHEN Tema warna diperbarui di `globals.css`, THE Website SHALL menerapkan perubahan warna tersebut ke seluruh komponen yang menggunakan token warna Tailwind (`bg-primary`, `text-primary`, `border-primary`, dll.) tanpa perubahan kode komponen individual.
6. THE Website SHALL menerapkan tema warna secara konsisten di seluruh komponen pada setiap saat, bukan hanya saat terjadi pembaruan tema.

---

### Requirement 4: Penggantian Aset Visual (Favicon dan Logo)

**User Story:** Sebagai pengunjung website, saya ingin melihat favicon dan logo MIM PK Dimoro di browser dan halaman website, sehingga saya dapat mengidentifikasi website ini secara visual.

#### Acceptance Criteria

1. THE Website SHALL menampilkan favicon MIM PK Dimoro di tab browser menggantikan favicon TK ABA Mertosanan.
2. WHEN File logo final MIM PK Dimoro belum tersedia, THE Website SHALL menggunakan file placeholder (misalnya logo generik atau inisial "MIM") di `public/` agar tidak ada broken image.
3. THE Website SHALL menampilkan logo placeholder di komponen navigasi (header/navbar) dan footer.
4. WHEN File logo final tersedia dan Developer menempatkannya di `public/`, THE Website SHALL segera menampilkan logo final tersebut di seluruh komponen yang mereferensikannya tanpa perubahan kode komponen.
5. THE Website SHALL mengganti file `app/opengraph-image.png` dan `app/twitter-image.png` dengan versi yang mencerminkan identitas MIM PK Dimoro atau menggunakan placeholder yang netral.

---

### Requirement 5: Penyesuaian Konten Halaman Beranda

**User Story:** Sebagai pengunjung website, saya ingin melihat konten beranda yang relevan dengan MIM PK Dimoro, sehingga saya mendapatkan gambaran yang benar tentang sekolah ini.

#### Acceptance Criteria

1. THE Website SHALL menampilkan `[NAMA SEKOLAH]` sebagai judul utama di seksi Hero halaman Beranda.
2. THE Website SHALL menampilkan teks deskripsi singkat sekolah di seksi Hero menggunakan placeholder yang merujuk pada MIM PK Dimoro sebagai madrasah ibtidaiyah (jenjang SD/MI).
3. THE Website SHALL menampilkan seksi Tentang Kami di Beranda dengan teks placeholder yang merujuk pada identitas MIM PK Dimoro.
4. THE Website SHALL menampilkan seksi Program di Beranda dengan konten yang relevan untuk jenjang MI (kelas 1–6), bukan jenjang TK.
5. THE Website SHALL menampilkan seksi Statistik (StatsSection) dengan nilai placeholder yang dapat diperbarui oleh Developer di kode.
6. THE Website SHALL menampilkan seksi CTA (Call to Action) dengan teks yang merujuk pada MIM PK Dimoro dan mengarahkan ke halaman Kontak.
7. THE Website SHALL mempertahankan struktur komponen Beranda yang sudah ada (`HomeHero`, `StatsSection`, `AboutSection`, `FeaturesSection`, `NewsSection`, `ProgramSection`, `GalleryPreview`, `TestimonialsSection`, `CTASection`) tanpa redesign layout.

---

### Requirement 6: Penyesuaian Konten Halaman Tentang Kami

**User Story:** Sebagai pengunjung website, saya ingin membaca informasi profil MIM PK Dimoro di halaman Tentang Kami, sehingga saya dapat mengenal sekolah ini lebih dalam.

#### Acceptance Criteria

1. THE Website SHALL menampilkan judul halaman "Tentang Kami" dengan deskripsi yang merujuk pada MIM PK Dimoro.
2. THE Website SHALL menampilkan seksi Visi & Misi dengan teks placeholder (misalnya `[VISI SEKOLAH]` dan `[MISI SEKOLAH]`) yang dapat diganti Developer saat data final tersedia.
3. THE Website SHALL menampilkan seksi Identitas Sekolah (`SchoolIdentity`) dengan data placeholder untuk NPSN, NSM, Akreditasi, dan Alamat yang dapat diganti Developer saat data final tersedia.
4. THE Website SHALL menampilkan seksi Nilai-Nilai dengan konten yang relevan untuk madrasah ibtidaiyah berbasis nilai Islam.
5. THE Website SHALL menampilkan seksi Prestasi (`Achievements`) dengan data placeholder yang dapat diperbarui Developer.
6. THE Website SHALL tidak menampilkan referensi ke jenjang TK, usia 3–6 tahun, program Kelompok Bermain, atau konten pendidikan anak usia dini lainnya di halaman ini.
7. THE Website SHALL mempertahankan struktur layout halaman Tentang Kami yang sudah ada tanpa redesign.

---

### Requirement 7: Penyesuaian Konten Halaman Program

**User Story:** Sebagai calon wali murid, saya ingin melihat program pendidikan yang ditawarkan MIM PK Dimoro, sehingga saya dapat memahami kurikulum dan kegiatan yang tersedia untuk anak saya.

#### Acceptance Criteria

1. THE Website SHALL menampilkan program kelas yang relevan untuk jenjang MI, yaitu Kelas 1 hingga Kelas 6, menggantikan program Kelompok Bermain, TK A, dan TK B.
2. THE Website SHALL menampilkan deskripsi program kelas menggunakan teks placeholder yang merujuk pada kurikulum MI (misalnya kurikulum Kemenag, muatan lokal, program tahfidz) yang dapat diperbarui Developer.
3. THE Website SHALL menampilkan seksi Kegiatan Harian dengan jadwal placeholder yang relevan untuk jenjang MI (misalnya jam masuk 07.00, jam pulang 13.00–14.00).
4. THE Website SHALL menampilkan seksi Ekstrakurikuler dengan daftar placeholder yang relevan untuk jenjang MI (misalnya Tapak Suci, Hizbul Wathan, Tahfidz, Pramuka) yang dapat diperbarui Developer.
5. THE Website SHALL tidak menampilkan konten yang spesifik untuk jenjang TK (misalnya "bermain sambil belajar untuk usia 3–4 tahun", "persiapan masuk SD").
6. THE Website SHALL mempertahankan struktur layout halaman Program yang sudah ada (termasuk komponen Tabs, KalenderAkademik) tanpa redesign.

---

### Requirement 8: Penyesuaian Konten Halaman Kontak

**User Story:** Sebagai pengunjung website, saya ingin melihat informasi kontak MIM PK Dimoro yang benar, sehingga saya dapat menghubungi sekolah dengan mudah.

#### Acceptance Criteria

1. THE Website SHALL menampilkan informasi kontak (alamat, nomor WhatsApp, email, jam operasional) yang diambil dari tabel `kontak_sekolah` di Supabase.
2. WHEN Data kontak di tabel `kontak_sekolah` belum diisi, THE Website SHALL menampilkan teks fallback yang netral (misalnya "Informasi kontak segera tersedia") menggantikan teks fallback lama yang merujuk ke TK ABA Mertosanan.
3. THE Website SHALL menampilkan embed Google Maps dengan URL yang diambil dari kolom `maps_embed_url` di tabel `kontak_sekolah`.
4. WHEN Kolom `maps_embed_url` kosong, tidak valid, atau tidak lolos validasi `isTrustedDomain`, THE Website SHALL menampilkan pesan placeholder "Peta lokasi segera tersedia" di area embed maps.
5. THE Website SHALL selalu menampilkan seksi FAQ di halaman Kontak, termasuk ketika data FAQ belum diisi, dengan menampilkan setidaknya satu pertanyaan dan jawaban placeholder yang relevan untuk MIM PK Dimoro.
6. THE Website SHALL mempertahankan komponen `ContactForm` yang sudah ada tanpa perubahan fungsionalitas.
7. THE Website SHALL mempertahankan validasi domain tepercaya (`isTrustedDomain`) untuk URL embed Google Maps yang sudah ada.

---

### Requirement 9: Konsistensi Placeholder di Seluruh Halaman Publik

**User Story:** Sebagai Developer, saya ingin semua data yang belum tersedia ditandai dengan placeholder yang konsisten, sehingga saya dapat dengan mudah menemukan dan mengisi data tersebut saat sudah siap.

#### Acceptance Criteria

1. THE Website SHALL menggunakan format placeholder yang konsisten untuk data yang belum tersedia, yaitu teks dalam kurung siku kapital (contoh: `[NAMA SEKOLAH]`, `[VISI SEKOLAH]`, `[NPSN]`).
2. THE Website SHALL menampilkan placeholder tersebut secara visual di halaman publik sehingga Developer dapat memverifikasi posisi data yang perlu diisi.
3. WHEN Developer mengganti teks placeholder dengan data final di kode, THE Website SHALL menampilkan data final tersebut. IF Placeholder belum diganti, THEN THE Website SHALL tetap menampilkan teks placeholder, bukan data final.
4. WHERE Data final memiliki kebutuhan format yang berbeda dari placeholder, THE Developer SHALL dapat memodifikasi layout atau styling komponen selama struktur halaman keseluruhan tetap dipertahankan.
5. THE Website SHALL tidak menampilkan placeholder dalam format yang dapat membingungkan pengunjung sebagai konten nyata (misalnya placeholder tidak boleh berupa angka acak atau teks yang terlihat seperti data asli).

---

### Requirement 10: Tidak Ada Regresi pada Fitur yang Dipertahankan

**User Story:** Sebagai Developer, saya ingin memastikan bahwa fitur-fitur yang tidak diubah dalam revamp ini tetap berfungsi dengan benar, sehingga revamp tidak merusak fungsionalitas yang sudah ada.

#### Acceptance Criteria

1. THE Website SHALL mempertahankan fungsionalitas halaman Berita (`/berita` dan `/berita/[id]`) tanpa perubahan.
2. THE Website SHALL mempertahankan fungsionalitas halaman Galeri (`/galeri`) tanpa perubahan.
3. THE Website SHALL mempertahankan fungsionalitas halaman Kalender Akademik (`/kalender-akademik`) tanpa perubahan.
4. THE Website SHALL mempertahankan fungsionalitas Admin Panel (`/admin`) tanpa perubahan.
5. THE Website SHALL mempertahankan fungsionalitas autentikasi (`/auth`) tanpa perubahan.
6. THE Website SHALL mempertahankan fungsionalitas Portal Orang Tua (`/portal`) tanpa perubahan.
7. THE Website SHALL menerapkan tema warna secara konsisten di Admin Panel dan Portal Orang Tua pada setiap saat, termasuk ketika tidak ada pembaruan tema yang sedang berlangsung.
8. THE Website SHALL berhasil di-build (`next build`) tanpa error setelah seluruh perubahan Fase 1 dan Fase 2 diterapkan.
