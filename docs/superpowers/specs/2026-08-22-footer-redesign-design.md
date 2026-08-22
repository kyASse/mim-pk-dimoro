# Desain Redesain Footer Halaman Publik (Modern Editorial & Brand Hub)

**Tanggal**: 2026-08-22  
**Status**: Draft (Approved Concept)  
**Topik**: Public Footer Redesign & Brand Enhancement

---

## 1. Latar Belakang & Masalah

Footer halaman publik saat ini memiliki beberapa kekurangan:
1. **Redundansi Konten**: Tagline sekolah terulang 2 kali di kolom pertama.
2. **Missing Links**: Rute `/berita` (Arsip Berita) belum ada di daftar navigasi footer, begitu juga shortcut menuju Portal Wali Murid (`/auth/login`).
3. **Kontak Non-Interaktif**: Nomor WhatsApp, email, dan alamat sekolah berupa teks biasa, tidak dapat langsung diklik oleh pengguna.
4. **Visual & Interactivity yang Flat**: Ikon sosial media dan tautan navigasi kurang memiliki *motion polish* dan *micro-interactions*.
5. **Brand Hub Kurang Kuat**: Belum ada penegasan identitas keunggulan (Program Khusus, Jenjang Madrasah Ibtidaiyah Terpadu, CTA langsung ke WhatsApp).

---

## 2. Sasaran & Tujuan Redesain

1. **Brand Authority**: Menampilkan identitas MIM PK Dimoro secara profesional, modern, dan bernuansa Islami edukatif yang hangat.
2. **Actionable & Connected**: Semua kontak (WhatsApp, Email, Maps, Social Media) bersifat interaktif dengan satu sentuhan/klik.
3. **Navigasi Lengkap & Terstruktur**: Memuat seluruh rute utama (termasuk `/berita`, `/kalender-akademik`, `/pendaftaran`, `/portal`).
4. **Responsive & Accessible**: Semantik HTML (`<address>`, `<footer>`, `<nav>`), contrast ratio terjaga, micro-interactions responsif terhadap `prefers-reduced-motion`.

---

## 3. Rincian Desain & Layout (3+1 Grid Hierarchy)

```
+----------------------------------------------------------------------------------------------------+
|  [BRAND HUB (4 Col)]      | [JELAJAH (2 Col)]     | [LAYANAN & AKADEMIK]  | [KONTAK & SOSMED (3 Col)]  |
|  - Logo + Nama Sekolah    | - Beranda             | - Pendaftaran (PPDB)  | - Alamat (Maps click)      |
|  - Badge "Program Khusus" | - Tentang Kami        | - Portal Wali Murid   | - WhatsApp Hotline (Click) |
|  - Deskripsi Visi         | - Program & Kurikulum | - Kalender Akademik   | - Email Resmi (Mailto)     |
|  - Quick WA Consultation  | - Galeri              | - Prestasi Siswa      | - Jam Sekolah Card         |
|                           | - Berita & Kegiatan   | - Kontak Madrasah     | - Social Media Badges      |
+----------------------------------------------------------------------------------------------------+
| [BOTTOM BAR]: Copyright (c) 2026 MIM PK Dimoro. Hak Cipta Dilindungi. | Back to Top Button          |
+----------------------------------------------------------------------------------------------------+
```

### A. Seksi Utama Footer
1. **Kolom 1: Brand & Identity Hub**
   - Logo madrasah berukuran proporsional dengan latar belakang kartu halus dan badge *"Program Khusus"*.
   - Nama lengkap sekolah: `{SCHOOL_FULL_NAME}` dengan tipografi tegas (*font-extrabold*).
   - Deskripsi profil ringkas sekolah mengenai integrasi Kurikulum Merdeka dan nilai ISMUBA.
   - Tombol Quick Action WhatsApp Hotline dengan icon WhatsApp dan hover spring effect.
2. **Kolom 2: Jelajah Madrasah (Quick Navigation)**
   - Link: Beranda (`/`), Tentang Kami (`/tentang-kami`), Program & Kurikulum (`/program`), Galeri Kegiatan (`/galeri`), Berita & Aktivitas (`/berita`).
   - Efek hover dengan indikator geser lembut (`group-hover:translate-x-1 transition-transform`).
3. **Kolom 3: Layanan & Informasi Akademik**
   - Link: Pendaftaran Siswa Baru (`/pendaftaran`), Kalender Akademik (`/kalender-akademik`), Portal Wali Murid (`/auth/login`), Kontak & Lokasi (`/kontak`).
4. **Kolom 4: Hubungi Kami & Jam Sekolah**
   - Alamat sekolah dengan icon MapPin yang membuka Google Maps via link.
   - Jam Operasional sekolah dalam card micro-layout yang rapi (Senin-Kamis & Jumat).
   - Barisan media sosial (Facebook, Instagram, YouTube) berbentuk kartu interaktif dengan ikon berwarna, hover scale, dan fallback dinamis dari database `kontak_sekolah`.

### B. Seksi Bottom Bar
- Garis pembatas halus (*border-t border-border/40*).
- Teks hak cipta tahun dinamis (`&copy; {currentYear} {SCHOOL_FULL_NAME}. Semua Hak Dilindungi.`).
- Tombol *Scroll to Top* interaktif dengan animasi smooth scroll ke atas halaman.

---

## 4. Rencana Verifikasi & Testing

1. **Unit Testing (`Footer.test.tsx`)**:
   - Memastikan seluruh link navigasi utama (termasuk `/berita`, `/tentang-kami`, `/kalender-akademik`, `/pendaftaran`, `/auth/login`) ter-render dengan benar.
   - Memastikan kontak WhatsApp dan Email memiliki link aktif `https://wa.me/...` dan `mailto:...`.
   - Memastikan media sosial merender link dinamis dengan `target="_blank"` dan `rel="noopener noreferrer"`.
2. **Regression Testing (`npm test`)**:
   - Memastikan 100% test suite berjalan sukses tanpa breaking changes.
3. **Visual & Responsive Testing**:
   - Memastikan layout rapi di mobile (1 kolom), tablet (2 kolom), dan desktop (grid 4 kolom).
