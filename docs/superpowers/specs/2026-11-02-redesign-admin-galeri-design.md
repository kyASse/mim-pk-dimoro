# Redesign View Page /admin/galeri dan /admin/galeri/tambah (Media Gallery Hub & Studio)

## 1. Executive Summary & Purpose
Perombakan komprehensif antarmuka pengguna (UI/UX) pada halaman utama manajemen galeri foto (`/admin/galeri`) dan studio penambahan foto (`/admin/galeri/tambah`). Desain baru mentransformasikan halaman ini menjadi *Media Gallery Hub & Studio* yang modern, memiliki 4 kartu metrik kategori, pencarian interaktif (keterangan foto), filter pill tabs responsif dengan pelindung teks mobile, grid visual galeri yang kaya metadata dengan modal preview resolusi penuh, studio upload 2-kolom dengan live file inspector dan drag-and-drop adaptif, serta *Sticky Floating Bottom Action Dock* untuk akses sentuh mobile yang ergonomis. Seluruh antarmuka dikalibrasi penuh untuk tema terang dan tema gelap (*dark mode*) dengan standar WCAG AA.

## 2. Design System & Dials (design-taste-frontend)
- **Design Read**: Admin School Media & Gallery Management Dashboard for MIM PK Dimoro administrators, with a clean editorial Islamic-modern admin language, leaning toward Tailwind CSS + shadcn/ui + dark theme contrast calibration + mobile action ergonomics.
- **Three Dials**:
  - `DESIGN_VARIANCE: 6` (Tata letak terstruktur, ritme visual bento & kartu galeri proporsional).
  - `MOTION_INTENSITY: 4` (Transisi tab halus, hover thumbnail preview, feedback drag & drop yang taktil tanpa animasi berlebihan).
  - `VISUAL_DENSITY: 6` (Kepadatan seimbang: touch targets `h-10 text-sm sm:h-8 sm:text-xs`, metadata informatif).
- **Dark Mode Principle**:
  - Nol raw color leaks (tidak ada `text-gray-900`, `text-gray-600`, `bg-white`, `border-gray-200` statis).
  - Memanfaatkan token semantik Shadcn: `bg-card`, `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border/80`, `bg-muted/40`.
  - Tombol aksi dialog dan modal tidak menyilaukan di tema gelap.

## 3. Scope & Arsitektur Komponen

### A. View Page: `/admin/galeri` (`page.tsx`) & `GaleriAdminHub.tsx`
1. **Navigasi & Header**:
   - Breadcrumb: `Dasbor Admin / Galeri Foto`.
   - Judul: "Manajemen Galeri Madrasah".
   - Subtitle: "Kelola dokumentasi visual, album kegiatan, dan foto publikasi MIM PK Dimoro".
   - Action Buttons:
     - Shortcut tombol outline *"Lihat Galeri Publik"* membuka `/galeri` dengan icon `ExternalLink`.
     - Tombol primer *"+ Tambah Foto"* menuju `/admin/galeri/tambah`.
2. **Statistik Metrik (4 Summary Cards)**:
   - *Total Foto*: Seluruh foto dalam galeri.
   - *Kegiatan Belajar*: Dokumentasi KBM & akademik.
   - *Ibadah & Karakter*: Dokumentasi keagamaan dan pembiasaan.
   - *Acara & Prestasi*: Gabungan kegiatan khusus, seni, dan lomba.
3. **Controls Toolbar**:
   - Kategori Tabs: `Semua`, `Kegiatan Belajar`, `Bermain`, `Seni & Kreativitas`, `Ibadah`, `Acara Khusus` dengan safeguard mobile `shrink-0 whitespace-nowrap min-w-max px-4`.
   - Live Search Input: Mencari keterangan/judul foto dengan icon Search dan tombol clear `X`.
   - View Toggle: Grid Card View vs List Table View.
4. **Galeri Visual Grid & Card (`GaleriCard.tsx`)**:
   - Aspect ratio gambar persegi (`aspect-square`) dengan object-cover dan hover zoom halus.
   - Badge kategori tematik (`Kegiatan Belajar` -> Sky, `Ibadah` -> Emerald, `Acara Khusus` -> Amber, dll).
   - Tombol Quick Preview untuk membuka modal lightbox gambar resolusi tinggi.
   - Tombol Edit (`EditImageButton`) dan Hapus (`DeleteImageButton`) yang telah diselaraskan dengan token tema gelap.
5. **Modal Preview Lightbox (`GaleriPreviewDialog.tsx`)**:
   - Menampilkan foto ukuran penuh, keterangan, kategori, dan tombol aksi cepat.

### B. View Page: `/admin/galeri/tambah` (`page.tsx`) & `GaleriUploadForm.tsx`
1. **Navigasi & Header**:
   - Breadcrumb: `Dasbor Admin / Galeri Foto / Tambah Foto`.
   - Judul: "Studio Unggah Foto".
   - Subtitle: "Tambahkan dokumentasi baru ke galeri publik sekolah".
2. **Studio Layout 2-Kolom (Desktop) / Linear Stack (Mobile)**:
   - **Kolom Kiri (Visual Dropzone & Inspector)**:
     - Area drag-and-drop luas dengan feedback drag-over yang taktil.
     - Live preview gambar begitu file dipilih.
     - Badge metadata (ukuran file, tipe mime, nama file).
     - Tombol ganti/hapus file langsung dari preview.
   - **Kolom Kanan (Informasi & Metadata)**:
     - Input keterangan/judul foto (`h-10 text-sm sm:h-8 sm:text-xs`).
     - Selector kategori pilihan (`Kegiatan Belajar`, `Bermain`, `Seni & Kreativitas`, `Ibadah`, `Acara Khusus`).
     - Kartu panduan format file & tips foto terbaik.
3. **Sticky Floating Bottom Action Dock (Mobile Safeguard)**:
   - Khusus layar mobile (`fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-md border-t border-border z-40 lg:hidden`), tombol *Batal* dan *Simpan Foto* tetap mengapung di bagian bawah layar agar ramah sentuhan satu tangan.

### C. Refactor `EditImageButton.tsx` & `DeleteImageButton.tsx`
- Menghapus hardcoded class seperti `bg-amber-50 text-amber-700 border-amber-200` pada tombol trigger edit.
- Menyesuaikan dialog edit dan delete dengan `bg-card border-border text-foreground` agar 100% konsisten di tema gelap.

## 4. Testing & Verifikasi
- Unit test untuk perhitungan metrik, filter kategori, dan pencarian foto pada `GaleriAdminHub`.
- Unit test untuk `GaleriUploadForm` memverifikasi preview, validasi form, dan handling drag-and-drop.
- Verifikasi kompilasi TypeScript (`npx tsc --noEmit`) dan rangkaian test suite Vitest (`npm test`).
