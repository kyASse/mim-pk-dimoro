# Design Specification: Pembaharuan Data & Informasi Sekolah MIM Dimoro

**Date**: 2026-08-07  
**Branch**: `feat/pembaharuan-data-sekolah`  
**Status**: Approved by User  

---

## 1. Overview & Context

MI Muhammadiyah Dimoro telah memperbarui dokumen resmi madrasah melalui 5 PDF terbaru:
1. **Program Unggulan** (Tahfidz Al-Qur'an & Klinik Belajar)
2. **VISI MISI** (Visi, 7 Indikator Visi, 8 Misi)
3. **Kurikulum Terpadu** (8 Pilar Penguatan: Akademik, Al-Islam, Kemuhammadiyahan, Karakter Islami, Kepemimpinan, Life Skill, Ekstrakurikuler, Pembiasaan Harian)
4. **Sambutan Kepala Madrasah** (Hj. Anik Sulityowati, S.Ag.)
5. **Pendidik Berkompeten** (8 Program Pendidik & 5 Komitmen Guru)

Tujuan dari proyek ini adalah mengintegrasikan seluruh informasi terbaru secara terpusat, terstruktur, dan modern ke dalam website MIM Dimoro pada branch `feat/pembaharuan-data-sekolah`.

---

## 2. Architecture & Data Structure (`lib/school-data.ts`)

Seluruh data sekolah bersumber dari 5 PDF akan dikelola secara terpusat di `lib/school-data.ts` dengan *TypeScript Interfaces*:

```typescript
export interface HeadmasterWelcome {
  name: string;
  title: string;
  greeting: string;
  paragraphs: string[];
  summary: string[];
  photoUrl: string;
}

export interface VisionMissionData {
  vision: string;
  visionIndicators: string[];
  missions: string[];
}

export interface ExcellentProgram {
  id: string;
  title: string;
  tagline?: string;
  objective: string;
  targetsOrTargetGraduates?: string[];
  targetAudience?: string[];
  programList?: string[];
  activities?: string[];
  expectations?: string;
  learningApproaches?: string[];
}

export interface IntegratedCurriculumPillar {
  id: string;
  title: string;
  description?: string;
  items: string[];
}

export interface EducatorsData {
  title: string;
  description: string;
  programs: { id: number; title: string; description: string }[];
  commitments: string[];
}
```

---

## 3. UI Component & Page Integration

### A. Beranda (`app/page.tsx` & `components/home/`)
1. **Sambutan Kepala Sekolah Section**:
   - Menampilkan ringkasan Sambutan Kepala Madrasah Hj. Anik Sulityowati, S.Ag.
   - Foto resmi/placeholder berkualitas dan link *"Baca Sambutan Selengkapnya"* ke `/tentang-kami`.
2. **Program Unggulan Preview**:
   - Memperbarui kartu Tahfidz Al-Qur'an (Target 1 Juz) & Klinik Belajar (Pendampingan Intensif).

### B. Halaman Tentang Kami (`app/tentang-kami/page.tsx`)
1. **Sambutan Kepala Madrasah Section**:
   - Menampilkan teks sambutan lengkap 6 paragraf beserta gelar Hj. Anik Sulityowati, S.Ag.
2. **Visi & Misi Section**:
   - Menampilkan Teks Visi Utama.
   - Menggunakan Grid / Accordion interaktif untuk 7 Indikator Visi dan 8 Misi Sekolah.
3. **Profil Lulusan Section**:
   - Card grid 6 Poin Dampak & Profil Lulusan (Beriman & Bertakwa, Hafalan min 1 Juz, Akhlakul Karimah, Kompetensi Akademik, Mandiri, Siap Jenjang Berikutnya).
4. **Pendidik Berkompeten Section**:
   - Menampilkan 8 Program Pendidik Berkompeten dan 5 Komitmen Guru MIM Dimoro.

### C. Halaman Program & Pendidikan (`app/program/page.tsx`)
1. **Kurikulum Terpadu Section**:
   - Menggunakan Tabs / Accordion interaktif untuk 8 Pilar Penguatan:
     - Akademik (7 poin)
     - Al-Islam (12 poin)
     - Kemuhammadiyahan (9 poin)
     - Karakter Islami (11 poin)
     - Kepemimpinan (7 poin)
     - Life Skill (8 poin)
     - Ekstrakurikuler (9 poin)
     - Pembiasaan Harian (11 poin)
2. **Program Unggulan Detail Section**:
   - Penjelasan mendalam Tahfidz Al-Qur'an (Metode, Setoran, Murajaah, Tasmi', Wisuda, Buku Kontrol Ortu).
   - Penjelasan mendalam Klinik Belajar (Identifikasi, Remedial, Kelompok Kecil, Penguatan Literasi/Numerasi, Kolaborasi Ortu).

---

## 4. Verification Plan

1. **Type Checking & Linting**:
   - Jalankan `npx tsc --noEmit` untuk memastikan semua interface dan import bertipe valid.
   - Jalankan `npm run lint` / ESLint verification.
2. **Testing**:
   - Jalankan unit test `npm test` / Vitest untuk memastikan tidak ada pengujian yang terpengaruh.
3. **Visual & Browser Verification**:
   - Jalankan dev server (`npm run dev`) dan verifikasi halaman `/`, `/tentang-kami`, dan `/program` menampilkan data dengan sempurna tanpa error layout.
