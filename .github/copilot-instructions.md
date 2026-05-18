# Copilot Instructions — Revamp TK ABA Mertosanan -> MIM PK Dimoro

## Source of truth (wajib diikuti)

Gunakan dokumen berikut sebagai referensi utama implementasi:

- `.kiro/specs/mim-pk-dimoro-revamp/requirements.md`
- `.kiro/specs/mim-pk-dimoro-revamp/design.md`
- `.kiro/specs/mim-pk-dimoro-revamp/tasks.md`
- `docs/MI_Muhammadiyah_Dimoro_Revamp_Plan.md`
- `docs/data-yang-diperlukan.md`
- `docs/database_schema.md`

Jika ada konflik, prioritaskan urutan ini: **requirements.md -> design.md -> tasks.md -> docs/**.

## Scope revamp (MVP)

Yang diubah:

1. Identitas sekolah, metadata SEO, tema warna, aset visual.
2. Konten halaman publik: Beranda, Tentang Kami, Program, Kontak.

Yang **tidak** diubah:

1. Struktur arsitektur Next.js + Supabase.
2. Fitur `/berita`, `/galeri`, `/kalender-akademik`, `/auth`, `/admin`, `/portal` (hanya pastikan tidak regresi).
3. Skema database (tidak ada migration baru untuk revamp ini).

## Aturan implementasi inti

1. **Single source of truth identitas sekolah** ada di `lib/school-config.ts`. Jangan hardcode nama/logo/domain sekolah di komponen.
2. **Tanpa redesign layout**: pertahankan struktur komponen yang sudah ada; ubah konten dan konfigurasi.
3. **Tema warna** cukup di `app/globals.css` melalui token CSS (`--primary`, dst), bukan edit warna per komponen.
4. **Placeholder konsisten** untuk data belum final: format `[NAMA_FIELD]` kapital dalam kurung siku.
5. **Tidak boleh ada referensi TK/PAUD** di halaman publik setelah revamp.
6. Halaman Kontak wajib aman: jika `maps_embed_url` tidak valid/tidak trusted, render placeholder, bukan `iframe` dengan src invalid.

## Pemetaan file target per fase

### Fase 1 — Identitas & metadata

- `lib/school-config.ts`
- `app/layout.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/globals.css`
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`
- `public/logo-mim-pk-dimoro.*`
- `app/favicon.ico`
- `app/opengraph-image.png`
- `app/twitter-image.png`

### Fase 2 — Konten halaman publik

- Beranda:
  - `components/home/HomeHero.tsx`
  - `components/home/AboutSection.tsx`
  - `components/home/ProgramSection.tsx`
  - `components/home/StatsSection.tsx`
  - `components/home/CTASection.tsx`
- Tentang Kami:
  - `app/tentang-kami/page.tsx`
  - `components/tentang-kami/SchoolIdentity.tsx`
- Program:
  - `app/program/page.tsx`
- Kontak:
  - `app/kontak/page.tsx`

## Data referensi yang sudah siap pakai (docs/data-yang-diperlukan.md)

Nilai berikut boleh langsung dipakai menggantikan placeholder:

- Nama singkat: `MIM Dimoro`
- Nama resmi: `Madrasah Ibtidaiyah Muhammadiyah Dimoro`
- NPSN: `60711720`
- NSM: `111233110050`
- Akreditasi: `A`
- Berdiri: `1 September 1967`
- Alamat: `Sudimoro, RT.003/RW.X, Parangjoro, Grogol, Sukoharjo, Jawa Tengah`
- Statistik: `201 siswa`, `18 guru/staf`

Data yang belum tersedia harus tetap placeholder/fallback netral (WhatsApp, email, jam operasional, embed maps, visi-misi final, daftar prestasi, foto resmi).

## Quality gates sebelum selesai

Jalankan dari root project:

```bash
npm run lint
npm run test
npm run build
```

Kriteria selesai revamp:

1. Tidak ada string "TK ABA Mertosanan" atau referensi jenjang TK di halaman publik.
2. Metadata, sitemap, robots, dan aset visual mencerminkan MIM PK Dimoro.
3. Warna primer hijau aktif via token CSS.
4. Halaman Kontak menampilkan fallback aman untuk data kosong/URL maps invalid.
5. Fitur non-scope tetap berfungsi.
