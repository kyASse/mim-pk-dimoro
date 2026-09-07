# Spesifikasi Desain: Manajemen Konten Halaman Publik (CMS Page Hub)
**Cabang**: `feature/admin-content-management`  
**Tanggal**: 2026-09-07  
**Status**: Disetujui (Approved)  
**Target Rute**: `/admin/konten`, `/`, `/tentang-kami`, `/program`, `/kontak`, `/pendaftaran`

---

## 1. Latar Belakang & Tujuan

Saat ini, beberapa bagian penting dari halaman publik MI Muhammadiyah Program Khusus Dimoro (MIM PK Dimoro) masih bersifat statis (*hardcoded*) di dalam berkas kode TypeScript (`lib/school-data.ts`, `lib/school-config.ts`) atau menggunakan gambar lokal secara berulang (`/images/mim_hero_main.jpg`, `/images/mim_tahfidz_learning.jpg`). 

Meskipun modul berita (`/admin/berita`), galeri (`/admin/galeri`), kalender (`/admin/kalender`), dan testimoni (`/admin/testimoni`) sudah dinamis, **konten halaman utama** (Hero banner, statistik madrasah, sambutan & foto kepala madrasah, visi-misi, profil lulusan, jam KBM fase kelas, daftar ekstrakurikuler, FAQ kontak, dan formulir cetak PPDB) belum memiliki pusat manajemen mandiri bagi admin sekolah.

### Tujuan Utama:
1. **Pusat Manajemen Terpadu (Modular Page Hub CMS)**: Mentransformasi `/admin/konten` menjadi dashboard modern berbasis 5 Tab yang terorganisir rapi sesuai struktur halaman publik.
2. **Manajemen Media & Aset Visual**: Memungkinkan admin mengunggah, mengganti, dan mempratinjau gambar utama (banner hero, foto resmi kepsek, cover kegiatan program, foto ekskul) serta berkas PDF formulir PPDB ke Supabase Storage bucket `konten-publik`.
3. **Pola Pertahanan Berlapis (Graceful Fallback)**: Memastikan halaman publik tetap 100% aman, cepat, dan tidak akan pernah mengalami tampilan rusak (*broken layout*) bila data database belum terisi atau koneksi mengalami kendala.
4. **On-Demand Cache Revalidation**: Perubahan konten oleh admin langsung tampil secara instan di sisi publik menggunakan `revalidatePath` Next.js App Router tanpa butuh proses deploy ulang.

---

## 2. Matriks Audit Konten Seluruh Halaman Publik

| Rute Halaman | Komponen / Seksi | Elemen Data Statis | Gambar / Media Statis | Target Dinamisasi & Integrasi DB |
|---|---|---|---|---|
| **Beranda (`/`)** | Hero Section | Eyebrow, Headline, Subtext Tagline, Badge "59 Tahun", Trust Badges | `/images/mim_hero_main.jpg` | Tabel `konten_halaman` slug `beranda-hero` + upload foto banner |
| | Counter Statistik | 201 Siswa, 18 Guru, 59 Thn, 10+ Ekskul | Ikon Lucide | Tabel `statistik_utama` (CRUD angka di admin) |
| | Sambutan Singkat | Ringkasan kutipan kepsek, 3 kartu poin keunggulan | `/images/mim_tahfidz_learning.jpg` | Tabel `konten_halaman` slug `tentang-sambutan` |
| | Bento Keunggulan | 4 kartu bento keunggulan madrasah | Gradient styling | Tabel `konten_halaman` slug `beranda-keunggulan` |
| | Program Preview | 3 kartu program unggulan (Tahfidz, Klinik, Ekskul) | Foto berulang | Terhubung ke master program & foto cover |
| | CTA PPDB | Teks ajakan daftar & status tombol | Background pattern | Tabel `konten_halaman` slug `beranda-hero` (seksi CTA) |
| **Tentang Kami (`/tentang-kami`)** | Sambutan Lengkap | Nama Kepsek, Gelar, Jabatan, 5 paragraf pidato sambutan | `/images/headmaster.jpg` (belum ada file fisik) | Tabel `konten_halaman` slug `tentang-sambutan` + upload foto formal kepsek |
| | Visi, Misi & Motto | Motto, Visi, 7 Indikator Visi, 8 Misi Utama | Ikon & badges | Tabel `konten_halaman` slug `tentang-visi-misi` (list editor dinamis) |
| | Profil Lulusan | 6 Butir Standar Kompetensi Lulusan | Badges & icons | Tabel `konten_halaman` slug `tentang-profil-lulusan` |
| | Identitas Legalitas | NPSN, NSM, Akreditasi A, Tgl Berdiri, Alamat | Bento cards | Tabel `konten_halaman` slug `tentang-identitas` |
| | Pendidik | Narasi pengantar, program mutu & komitmen guru | Ikon program | Tabel `konten_halaman` slug `tentang-pendidik` |
| **Program (`/program`)** | Ikhtisar Kurikulum | Narasi pengantar, 3 pilar nilai highlight | `/images/mim_hero_main.jpg` | Tabel `konten_halaman` slug `program-kurikulum` + foto showcase |
| | Struktur Fase | Jam KBM harian (Fase 1-3 & 4-6) serta daftar fokus KBM | `/images/mim_tahfidz_learning.jpg` & `/images/mim_hero_main.jpg` | Tabel `konten_halaman` slug `program-kurikulum` + foto kegiatan fase |
| | Detail Program Unggulan | Target capaian juz Tahfidz, sasaran & pendekatan Klinik Belajar | Layout cards | Tabel `konten_halaman` slug `program-tahfidz-klinik` |
| | Ekstrakurikuler | 4 kegiatan ekskul (Tapak Suci, HW, Tahfidz, Seni Drumband) | Foto berulang | **Tabel `ekstrakurikuler` Supabase** (CRUD lengkap nama, jadwal, deskripsi, upload foto) |
| **Kontak (`/kontak`)** | Kontak & Medsos | Alamat, WA, Email, Jam Operasional, Maps Embed | Ikon kontak | Tabel `kontak_sekolah` (sudah dinamis, disatukan ke Tab 5) |
| | FAQ (Tanya Jawab) | 5 Pasang pertanyaan dan jawaban seputar madrasah & PPDB | Accordion UI | Tabel `konten_halaman` slug `faq-list` (CRUD tanya-jawab dinamis) |
| **Pendaftaran (`/pendaftaran`)** | Dokumen Formulir PDF | Link unduh statis `/Formulir Pendaftaran MIM PK Dimoro.pdf` | Berkas PDF di `public/` | Upload PDF formulir ke `konten-publik/dokumen/` via Tab 4 PPDB |
| | Alur Pendaftaran | 5 Langkah Online & 4 Langkah Offline | Stepper UI | Tabel `konten_halaman` slug `ppdb-alur-berkas` |

---

## 3. Arsitektur Basis Data & Skema Penyimpanan

### 3.1. Skema `JSONB` pada `public.konten_halaman`

Tabel `konten_halaman` (`slug` VARCHAR PRIMARY KEY, `judul` TEXT, `isi` JSONB, `created_at` TIMESTAMPTZ, `updated_at` TIMESTAMPTZ) menggunakan struktur TypeScript berikut:

```typescript
// 1. Beranda Hero
export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  hero_image_url: string;
  floating_stat_number: string;
  floating_stat_text: string;
  trust_badges: string[];
}

// 2. Sambutan Kepala Madrasah
export interface HeadmasterContent {
  nama: string;
  gelar?: string;
  jabatan: string;
  foto_url: string;
  summary: string;
  paragraphs: string[];
}

// 3. Visi Misi & Motto
export interface VisionMissionContent {
  motto: string;
  visi: string;
  indikator_visi: string[];
  misi: string[];
}

// 4. Identitas Resmi Madrasah
export interface SchoolIdentityContent {
  npsn: string;
  nsm: string;
  akreditasi: string;
  tanggal_berdiri: string;
  status_sekolah: string;
  bentuk_pendidikan: string;
  alamat_lengkap: string;
  desa_kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
}

// 5. Program & Kurikulum
export interface ProgramContent {
  showcase_image_url: string;
  fase_bawah: {
    judul: string;
    deskripsi: string;
    image_url: string;
    jam_senin_kamis: string;
    jam_jumat: string;
  };
  fase_atas: {
    judul: string;
    deskripsi: string;
    image_url: string;
    jam_senin_kamis: string;
    jam_jumat: string;
  };
  tahfidz_target: string;
  tahfidz_objective: string;
  klinik_description: string;
}

// 6. FAQ
export interface FAQContentItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// 7. PPDB Alur & Dokumen
export interface PPDBFlowContent {
  formulir_pdf_url: string;
  alur_online: { title: string; desc: string }[];
  alur_offline: { title: string; desc: string }[];
}
```

### 3.2. Tabel Relasional Terhubung
1. **`public.statistik_utama`**:
   - Kolom: `id`, `kunci` (UNIQUE), `nilai`, `deskripsi`.
   - Kunci yang digunakan: `jumlah_siswa`, `jumlah_guru`, `tahun_pengalaman`, `jumlah_ekskul`.
2. **`public.ekstrakurikuler`**:
   - Kolom: `id`, `nama_eskul`, `deskripsi`, `jadwal`, `image_url`, `created_at`.
   - Digunakan penuh oleh rute `/program`.
3. **`public.kontak_sekolah`**:
   - Kolom: `id`, `alamat`, `whatsapp`, `email_utama`, `email_admin`, `jam_operasional`, `maps_embed_url`, `facebook_url`, `instagram_url`, `youtube_url`.

### 3.3. Supabase Storage: Bucket `konten-publik`
- Akses: Publik dapat membaca (`SELECT`), hanya user terautentikasi (admin) yang dapat mengunggah/mengubah (`INSERT`, `UPDATE`, `DELETE`).
- Struktur Path:
  - `konten/hero/{filename}.webp`
  - `konten/kepsek/{filename}.webp`
  - `konten/program/{filename}.webp`
  - `konten/ekskul/{filename}.webp`
  - `konten/dokumen/{filename}.pdf`
- Validasi:
  - Gambar: Maksimal 5 MB, otomatis dikonversi ke `.webp` di client sebelum upload.
  - Dokumen: Maksimal 10 MB, tipe `application/pdf`.

---

## 4. Desain UI/UX Dashboard Admin (`/admin/konten`)

Sesuai arahan `/design-taste-frontend`, `/high-end-visual-design`, dan panduan `GEMINI.md`:

### 4.1. Navigasi 5 Tab (Mobile-Safe Pill Tabs)
Menggunakan horizontal swipeable pill tabs dengan kelas pembatas:  
`shrink-0 whitespace-nowrap min-w-max px-4`

1. **Tab 1: Beranda**
   - Kartu Hero Banner: Input Headline, Subtext, Eyebrow, dan unggah foto banner hero utama (aspect ratio 4:3).
   - Kartu 4 Angka Statistik: Form edit nilai metrik siswa, guru, pengalaman, dan ekskul.
   - Kartu Bento Keunggulan: Editor teks 4 kartu keunggulan.
2. **Tab 2: Profil & Sambutan**
   - Kartu Kepala Madrasah: Input nama, gelar, jabatan, unggah foto profil kepsek (aspect ratio 1:1), ringkasan kutipan, dan textarea paragraf sambutan.
   - Kartu Visi, Misi & Motto: Textarea visi & motto, serta dinamisasi butir indikator visi & misi.
   - Kartu Legalitas Sekolah: NPSN, NSM, Akreditasi, Tanggal Berdiri, dll.
3. **Tab 3: Program & Ekskul**
   - Kartu Showcase Program: Unggah foto kegiatan kurikulum.
   - Kartu Fase Belajar: Pengaturan jam operasional dan foto kelas Fase 1–3 & Fase 4–6.
   - Kartu Ekstrakurikuler: Tabel interaktif CRUD data ekskul (tambah, edit, hapus, upload foto eskul).
   - Kartu Tahfidz & Klinik Belajar: Editor target juz dan sasaran klinik belajar.
4. **Tab 4: PPDB & Dokumen**
   - Editor Persyaratan Dokumen & Catatan SPP.
   - Editor Jadwal Gelombang Pendaftaran.
   - Upload Berkas PDF Formulir Pendaftaran Offline (dengan tombol uji unduh langsung).
   - Editor Butir Alur Pendaftaran (Online & Offline).
5. **Tab 5: Kontak & FAQ**
   - Editor Alamat, WhatsApp, Email, dan Jam Buka Madrasah.
   - Editor URL Google Maps Embed & Akun Media Sosial.
   - Editor Daftar FAQ (Tambah/Ubah/Hapus tanya-jawab publik).

### 4.2. Ergonomi & Touch Safety
- **Mobile Sticky Action Dock**:  
  `fixed bottom-0 inset-x-0 z-40 lg:hidden bg-card/90 backdrop-blur-md border-t border-border p-3` menyediakan tombol simpan yang mudah ditekan dengan satu tangan.
- **Form Touch Target**:  
  Seluruh input memiliki tinggi standar `h-10 text-sm sm:h-8 sm:text-xs` (minimum 40px touch safety).
- **Komponen ImageUploader**:  
  Menyediakan drag-and-drop, preview gambar seketika, indikator kompresi, dan tombol *"Gunakan Default Sistem"*.

---

## 5. Integrasi Halaman Publik & Fallback Safety

Untuk menjamin keandalan 100% tanpa error regresi:

### 5.1. Fungsi Fetcher dengan Defensive Fallback
Setiap komponen publik memanggil helper terpusat (contoh: `getHeroContent()`, `getHeadmasterContent()`, `getExtracurriculars()`, dll.):
1. Mencoba mengambil data dari Supabase.
2. Jika tabel kosong, bernilai `null`, atau koneksi gagal, helper otomatis menggabungkannya dengan nilai default dari [school-data.ts](file:///c:/Chill/Sanbercode/Project/mim-pk-dimoro/lib/school-data.ts) atau [school-config.ts](file:///c:/Chill/Sanbercode/Project/mim-pk-dimoro/lib/school-config.ts).
3. Halaman publik tidak akan pernah memunculkan error 500 atau gambar pecah (*broken image*).

### 5.2. Server Action & On-Demand Revalidation
Ketika admin menyimpan perubahan di tab manapun:
```typescript
"use server";
import { revalidatePath } from "next/cache";

export async function updateContentSection(slug: string, data: any) {
  // 1. Simpan ke database Supabase
  // ...
  // 2. Revalidasi path publik terkait
  revalidatePath("/");
  revalidatePath("/tentang-kami");
  revalidatePath("/program");
  revalidatePath("/kontak");
  revalidatePath("/pendaftaran");
  return { success: true };
}
```
Hasil pembaruan admin langsung tampil seketika bagi pengunjung publik.

---

## 6. Rencana Pengujian (Testing Plan)

1. **Unit Testing (`vitest`)**:
   - `lib/utils/content-parsers.test.ts`: Memvalidasi parsing data JSONB dan fallback ketika data tidak lengkap.
   - `lib/utils/image-compression.test.ts`: Memvalidasi kompresi WebP pada canvas browser.
2. **Component Testing**:
   - Pengujian `HomeHero.test.tsx`, `AboutSection.test.tsx`, `ProgramSection.test.tsx`, `Achievements.test.tsx` dengan mock data dinamis dan kondisi fallback `null`.
   - Pengujian komponen tab form admin `/admin/konten`.
3. **End-to-End Verification**:
   - Pengujian unggah gambar ke Supabase Storage.
   - Pengujian pembaruan teks dari admin dan memastikan teks berubah di halaman publik.

---

## 7. Kriteria Selesai (Acceptance Criteria)
1. Seluruh tes unit eksisting tetap **PASSED** (zero regression).
2. Admin dapat mengubah teks hero, statistik, sambutan kepsek, visi-misi, program, ekskul, FAQ, dan alur pendaftaran secara mandiri.
3. Admin dapat mengunggah gambar baru untuk hero, foto kepsek, program, ekskul, dan berkas PDF formulir pendaftaran.
4. Halaman publik menampilkan data dinamis dari database, namun tetap aman dan indah bila data database kosong.
5. Antarmuka admin di `/admin/konten` responsif, nyaman digunakan di ponsel/tablet, dan memenuhi standar desain premium.
