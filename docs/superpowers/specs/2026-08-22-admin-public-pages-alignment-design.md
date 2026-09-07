# Desain Ketersesuaian Fitur Dashboard Admin dan Halaman Publik

**Tanggal**: 2026-08-22  
**Status**: Draft (Approved Concept)  
**Topik**: Admin & Public Pages Alignment and Fixes

---

## 1. Latar Belakang & Masalah

Berdasarkan audit komprehensif antara **Dashboard Admin** (`/admin/*`) dan **Halaman Publik** (`/`, `/berita`, `/galeri`, `/kalender-akademik`, `/kontak`, `/pendaftaran`, `/program`, `/tentang-kami`), ditemukan beberapa celah, bug, dan inkonsistensi:

1. **Bug Kritis 404 pada Arsip Berita**: Tombol "Lihat Semua Berita" pada homepage mengarah ke `/berita`, namun rute `app/berita/page.tsx` belum tersedia (hanya ada detail `app/berita/[id]/page.tsx`).
2. **Broken Link di Footer**: Tautan menu "Tentang Kami" di `Footer.tsx` mengarah ke `/tentang` (404), padahal rute yang benar adalah `/tentang-kami`.
3. **Inkonsistensi Identitas Sekolah pada Kalender Publik**: Header `app/kalender-akademik/page.tsx` masih memuat teks template lama (*"TK ABA Mertosanan Tahun Ajaran 2024/2025"*) alih-alih identitas madrasah (*"MIM PK Dimoro"*).
4. **Gallery Preview di Beranda Masih Statis**: Komponen `GalleryPreview.tsx` di Beranda menggunakan array foto dummy statis, sehingga foto baru yang diunggah Admin di `/admin/galeri` tidak tampil di beranda.
5. **Filter Testimoni Beranda Mengabaikan `is_featured`**: Admin memiliki opsi *Featured/Tampil di Beranda*, tetapi query di `TestimonialsSection.tsx` mengambil semua testimoni tanpa memfilter `is_featured = true`.
6. **Navigasi Kalender Akademik Tersembunyi**: Menu `Kalender Akademik` belum tersedia pada Navbar maupun Footer publik.
7. **Tautan Media Sosial Statis**: Ikon Facebook, Instagram, dan YouTube di Footer masih mengarah ke `#` dan belum dapat dikelola oleh Admin.

---

## 2. Sasaran & Tujuan Desain

1. **Memastikan zero 404 error** pada navigasi publik utama (`/berita`, `/tentang-kami`, `/kalender-akademik`).
2. **Sinkronisasi 100% data dinamis** antara apa yang dikelola admin (Berita, Galeri, Testimoni, Kalender, Kontak/Medsos) dengan apa yang tampil di halaman publik.
3. **Mengikuti standar arsitektur proyek**: Next.js 15 App Router Server Component, TypeScript strict typing, Tailwind CSS, Lucide icons, dan Supabase client patterns.

---

## 3. Rincian Arsitektur & Perubahan Komponen

### A. Halaman Publik Daftar Berita (`app/berita/page.tsx`) [NEW]
* **Tipe Komponen**: Async Server Component.
* **Fitur**:
  * Mengambil berita dari Supabase: `.from('berita').select('*').eq('status', 'terbit').order('tanggal_terbit', { ascending: false })`.
  * Fitur pencarian berita berdasarkan query `searchParams.q`.
  * Menampilkan `PageHeader` ("Berita & Kegiatan Madrasah").
  * Grid kartu artikel berita interaktif dengan thumbnail gambar, badge tanggal, ringkasan, dan tombol baca selengkapnya menuju `/berita/[id]`.
  * State kosong (*Empty State*) yang rapi jika belum ada berita atau hasil pencarian nihil.

### B. Sinkronisasi Komponen Beranda (`components/home/`)
1. **`GalleryPreview.tsx`**:
   * Ubah cara penyediaan data: Mengambil 6 foto terbaru dari tabel Supabase `galeri` (`order('created_at', { ascending: false }).limit(6)`).
   * Menampilkan foto asli madrasah beserta lightbox modal interaktif. Fallback gracefully jika data galeri masih kosong.
2. **`TestimonialsSection.tsx`**:
   * Perbarui query data fetcher: Filter `.eq('is_featured', true)` dan urutkan berdasarkan `created_at` menurun.
   * Tambahkan fallback jika belum ada yang ditandai *featured*, tampilkan testimoni terbaru agar halaman beranda tetap elegan.

### C. Navigasi & Footer (`components/layout/`)
1. **`Navbar.tsx`**:
   * Tambahkan menu nav item: `{ name: 'Kalender', href: '/kalender-akademik', icon: <Calendar className="w-5 h-5" /> }` pada desktop & mobile menu.
2. **`Footer.tsx`**:
   * Koreksi tautan: Ganti `/tentang` menjadi `/tentang-kami`.
   * Tambahkan tautan `Kalender Akademik` pada seksi Halaman.
   * Ambil data link media sosial (`facebook_url`, `instagram_url`, `youtube_url`) dari `kontak_sekolah` atau `konten_halaman` untuk mengisi `href` pada ikon medsos (fallback ke official handle/website jika belum diisi).

### D. Perbaikan Kalender Akademik Publik (`app/kalender-akademik/page.tsx`)
* Ganti subtitle teks template menjadi dinamis menggunakan `SCHOOL_NAME` dari `@/lib/school-config`.

### E. Penambahan Pengelolaan Media Sosial di Admin (`app/admin/konten/EditContactPage.tsx`)
* Tambahkan field input form untuk:
  * URL Facebook (`facebook_url`)
  * URL Instagram (`instagram_url`)
  * URL YouTube (`youtube_url`)
* Simpan data dan update preview kontak sekolah.

---

## 4. Rencana Verifikasi & Testing

1. **Automated Testing**:
   * Menjalankan unit tests dengan `npm test` untuk memastikan tidak ada regresi pada komponen layout, home, atau admin.
   * Menambahkan unit test baru untuk `app/berita/page.tsx` atau komponen terkait.
2. **Manual & Build Verification**:
   * Verifikasi `npm run build` / type-checking (`npx tsc --noEmit`) berjalan tanpa error.
   * Verifikasi navigasi: klik tombol "Lihat Semua Berita" dari beranda memastikan menuju `/berita` dan menampilkan berita.
   * Verifikasi link footer "Tentang Kami" menuju `/tentang-kami`.
   * Verifikasi galeri beranda menampilkan foto asli dari tabel `galeri`.
