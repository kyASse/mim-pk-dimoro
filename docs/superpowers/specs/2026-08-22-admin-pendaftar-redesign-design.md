# Desain Redesain Halaman Pendaftar Admin (Modern Interactive Command Center)

**Tanggal**: 2026-08-22  
**Status**: Draft (Approved Concept)  
**Topik**: Admin PPDB / Pendaftar Redesign & Workflow Optimization

---

## 1. Latar Belakang & Masalah

Halaman Kelola Pendaftar (`/admin/pendaftar`) saat ini memiliki beberapa keterbatasan:
1. **Hardcoded Kode Registrasi**: Baris tabel masih menampilkan kode `TK25-` (sisa template lama) bukan format resmi `MIM-`.
2. **Kartu Statistik Pasif**: 5 kotak metrik di bagian atas tidak dapat diklik untuk memfilter data dan tidak responsif terhadap Dark Mode.
3. **Filter & Navigasi Terbatas**: Belum ada tab filter status (*Semua, Menunggu, Diterima, Revisi, Ditolak*), belum ada filter jenis kelamin, dan belum ada fitur pagination.
4. **Kurangnya Aksi Cepat**: Admin harus membuka halaman detail untuk sekadar mengirim WhatsApp atau mencetak formulir.
5. **Ketiadaan Export Data**: Belum ada tombol Export Data (CSV/Excel) untuk rekapitulasi rapat PPDB.

---

## 2. Sasaran & Tujuan Redesain

1. **Efisiensi Kerja Admin (Command Center)**: Memungkinkan admin mencari, memfilter status dalam 1-klik melalui kartu metrik atau tab status, dan melakukan aksi cepat langsung dari baris tabel.
2. **Identitas & Data Resmi**: Format registrasi pendaftar konsisten (`MIM-${tahun}-${id_singkat}`), informasi orang tua, dan status pendaftaran jelas.
3. **Visual Polish & Dark Mode Parity**: Kartu metrik dan tabel memiliki kedalaman visual, ikon tematik, badge status terstandarisasi, dan kontras nyaman di Light & Dark Mode.
4. **Fitur Ekspor & Manajemen**: Kemudahan mengekspor data pendaftar ke format CSV untuk arsip offline.

---

## 3. Rincian Desain & Arsitektur Komponen

### A. Kartu Metrik Interaktif (`PendaftarMetricCards.tsx` / `page.tsx`)
- 5 Kartu Status interaktif:
  1. **Total Pendaftar**: Ikon `Users`, tema netral/primary.
  2. **Menunggu Persetujuan**: Ikon `Clock`, tema biru / amber.
  3. **Pendaftaran Disetujui (Diterima)**: Ikon `CheckCircle2`, tema emerald.
  4. **Validasi Ulang (Revisi)**: Ikon `AlertCircle`, tema kuning / oranye.
  5. **Ditolak**: Ikon `XCircle`, tema rose / merah.
- **Interaksi**: Mengklik kartu otomatis mengaktifkan filter status tabel yang bersangkutan (dengan indikator *active ring/border*).
- **Dark Mode Support**: Menggunakan variabel tema `bg-card border-border` dengan aksen warna halus di dark mode.

### B. Tabel Pendaftar Tingkat Lanjut (`PendaftarTable.tsx`)
- **Status Tabs**: Baris tab di atas tabel (`Semua`, `Menunggu`, `Diterima`, `Revisi`, `Ditolak`) dengan badge hitungan data.
- **Toolbar Pencarian & Filter**:
  - Input pencarian (Nama calon siswa, Nama Ayah/Ibu, ID Registrasi).
  - Filter dropdown Jenis Kelamin (Semua / Laki-laki / Perempuan).
  - Tombol **Export Data (.csv)** dengan format UTF-8 rapi.
- **Kolom Tabel**:
  1. **ID Registrasi**: Format resmi `MIM-${tahun}-${index/kode}`.
  2. **Nama Siswa**: Nama lengkap dengan badge gender (L/P) dan inisial avatar.
  3. **Orang Tua**: Nama Ayah & Ibu serta nomor kontak.
  4. **Tanggal Daftar**: Format tanggal Indonesia (`DD/MM/YYYY`).
  5. **Status**: Badge status pendaftaran dengan warna semantik.
  6. **Aksi Cepat**:
     - Tombol *Detail* (`/admin/pendaftar/detail/[id]`).
     - Tombol *Chat WA* (membuka WhatsApp web jika ada nomor telepon).
     - Tombol *Cetak Formulir* (PDF print).
- **Pagination**: Pagination klien (10 item per halaman) dengan tombol *Sebelumnya / Selanjutnya* dan ringkasan *"Menampilkan X dari Y data"*.

---

## 4. Rencana Verifikasi & Testing

1. **Unit Testing (`components/admin/__tests__/PendaftarTable.test.tsx`)**:
   - Memastikan kartu metrik menghitung statistik dengan benar dan memfilter tabel saat diklik.
   - Memastikan tab filter status menyaring data sesuai status (`Diterima`, `Revisi`, `Ditolak`, `Menunggu`).
   - Memastikan fitur pencarian berfungsi untuk nama siswa dan orang tua.
   - Memastikan format ID registrasi tidak lagi menggunakan `TK25-`.
2. **Regression Testing**:
   - Menjalankan seluruh test suite Vitest (`npm test`).
   - Memeriksa TypeScript typecheck (`npx tsc --noEmit`).
   - Memastikan build produksi (`npm run build`) berjalan sukses.
