# Desain Redesain Sidebar Dashboard Admin (Modern Grouped & Smart Route Highlighting)

**Tanggal**: 2026-08-22  
**Status**: Draft (Approved Concept)  
**Topik**: Admin Dashboard Sidebar Redesign & UX Polish

---

## 1. Latar Belakang & Masalah

Sidebar Dashboard Admin saat ini memiliki beberapa kelemahan arsitektur UI/UX:
1. **Flat Ungrouped Menu**: Semua 9 modul ditumpuk dalam 1 grup label panjang tanpa pengelompokan fungsional.
2. **Redundansi Penamaan**: Menggunakan awalan *"Kelola X"* berulang kali yang menambah *visual clutter*.
3. **Hardcoded Active Route**: Properti `isActive: true` di-hardcode pada item Dashboard, tidak mendeteksi URL browser (`usePathname()`), sehingga menu yang sedang dibuka tidak tersorot.
4. **Submenu Tidak Auto-Expand**: Submenu tidak otomatis terbuka saat pengguna mengakses rute anak (misal `/admin/akademik/prestasi`).
5. **Kurangnya Shortcut & Quick Actions**: Belum ada tombol pintas menuju Website Publik (`/`) dari dalam sidebar admin.
6. **Double Separator di Dropdown User**: Terdapat 2 separator berurutan di `NavUser`.

---

## 2. Sasaran & Tujuan Redesain

1. **Struktur Hirarki Fungsional**: Mengelompokkan modul admin ke dalam kategori logis (Utama, Kesiswaan & PPDB, Akademik & Agenda, Publikasi & Media, Komunikasi & Pengaturan).
2. **Dynamic Active Route Highlighting**: Menggunakan Next.js `usePathname()` untuk memberikan highlight visual tegas pada menu aktif dan membuka submenu secara otomatis.
3. **Peningkatan Branding & Shortcut Publik**: Header sidebar memuat identitas madrasah terpadu dan tombol akses cepat *"Kunjungi Website"* (`/`).
4. **Pembersihan & Polishing Komponen**: Memperbaiki `NavUser` dropdown, meningkatkan estetika icon, dan memastikan tampilan rapi saat sidebar dalam kondisi *collapsed*.

---

## 3. Rincian Arsitektur & Perubahan Komponen

### A. Pengelompokan Data Menu (`components/app-sidebar.tsx`)
Menu dikelompokkan ke dalam kategori terstruktur:
1. **Utama (Overview)**
   - Dashboard (`/admin`, icon: `LayoutDashboard`)
2. **Kesiswaan & PPDB**
   - Pendaftar Baru (`/admin/pendaftar`, icon: `UserPlus`, sub: Daftar Pendaftar)
   - Data Siswa Aktif (`/admin/siswa`, icon: `Users`, sub: Daftar Siswa)
   - Biaya Masuk & SPP (`/admin/akademik/edit-biaya`, icon: `CreditCard`)
3. **Akademik & Agenda**
   - E-Rapor & Akademik (`/admin/akademik`, icon: `GraduationCap`, sub: Manajemen Nilai, Laporan Perkembangan)
   - Kalender Akademik (`/admin/kalender`, icon: `Calendar`, sub: Agenda Kalender, Tambah Event)
   - Prestasi & Piagam (`/admin/akademik/prestasi`, icon: `Trophy`, sub: Daftar Prestasi, Tambah Prestasi)
4. **Publikasi & Media**
   - Berita & Artikel (`/admin/berita`, icon: `BookOpen`, sub: Daftar Berita, Tulis Berita)
   - Galeri Foto (`/admin/galeri`, icon: `ImageIcon`, sub: Album Galeri, Unggah Foto)
   - Testimoni Wali (`/admin/testimoni`, icon: `MessageSquare`)
5. **Komunikasi & Pengaturan**
   - Pesan Masuk (`/admin/pesan`, icon: `Inbox`)
   - Konten Halaman & Kontak (`/admin/konten`, icon: `FileText`, sub: Konten Halaman, Kontak Sekolah)
   - Generator Akun / Tools (`/admin/tools`, icon: `Wrench`)

### B. Komponen Navigasi Pintar (`components/nav-main.tsx`)
- Mendeteksi `pathname` saat ini dengan `usePathname()`.
- Menandai item aktif dengan kelas `bg-sidebar-accent text-sidebar-accent-foreground font-semibold`.
- Mengatur `defaultOpen` pada `Collapsible` jika `pathname` diawali dengan URL sub-item tersebut.
- Menyediakan label kategori terpisah menggunakan `<SidebarGroup>` dan `<SidebarGroupLabel>` untuk setiap grup menu.

### C. Header & Footer Sidebar
- **Header (`SidebarHeader`)**:
  - Container logo sekolah elegan dengan rounded corners.
  - Nama `{SCHOOL_NAME}` dan badge *"Admin Panel"*.
  - Tombol mini *"Lihat Web Publik"* yang membuka `/` di tab baru/navigasi langsung.
- **Footer (`NavUser`)**:
  - Menghapus separator ganda.
  - Menampilkan badge *"Administrator"* / role profil.
  - Tombol logout terintegrasi dengan aksi aman.

---

## 4. Rencana Verifikasi & Testing

1. **Unit Testing (`components/admin/__tests__/app-sidebar.test.tsx` / `nav-main.test.tsx`)**:
   - Memastikan semua kelompok menu ter-render.
   - Memastikan `usePathname()` menyorot item aktif dan membuka collapsible yang sesuai.
   - Memastikan link "Lihat Web Publik" dan data user ter-render dengan baik.
2. **Regression Testing**:
   - Menjalankan seluruh test suite Vitest (`npm test`).
   - Memeriksa TypeScript typecheck (`npx tsc --noEmit`).
   - Memastikan production build Next.js (`npm run build`) sukses tanpa kendala.
