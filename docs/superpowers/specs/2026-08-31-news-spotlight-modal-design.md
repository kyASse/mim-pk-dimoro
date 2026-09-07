# Design Document: Floating Glass News Spotlight Modal (MIM PK Dimoro)

## 1. Overview
Fitur **News Spotlight Modal** dirancang untuk menampilkan berita terbaru atau pengumuman penting madrasah ketika pengunjung pertama kali membuka halaman beranda (*homepage*) [MIM PK Dimoro](file:///c:/Chill/Sanbercode/Project/mim-pk-dimoro/lib/school-config.ts). Mengusung estetika *High-End Agency & Anti-Slop* dengan teknik *Double-Bezel (Doppelrand)*, efek *Frosted Glass (Backdrop-Blur)*, dan koreografi gerak halus *Spring Physics*, modal ini memberikan daya tarik visual instan tanpa mengorbankan kenyamanan penjelajahan (*anti-spam frequency capping*).

## 2. Requirements & UX Principles

### 2.1 Functional Requirements
1. **Server-Side Data Fetching:** Mengambil 1 berita berstatus `terbit` terbaru dari tabel Supabase `berita`.
2. **Frequency Capping (LocalStorage):**
   - Tidak muncul kembali jika pengunjung sudah menutup berita yang sama pada sesi aktif.
   - Opsi *"Jangan tampilkan lagi hari ini"* yang menyimpan timestamp kedaluwarsa 24 jam (`mim_dismissed_until`).
3. **Smooth Entrance Trigger:** Memiliki delay `700ms` setelah halaman selesai dimuat agar transisi hero utama tetap stabil.
4. **Multiple Dismiss Channels:**
   - Tombol close silang (X) di pojok modal.
   - Tombol sekunder "Tutup" / "Nanti Saja".
   - Tombol keyboard `Escape` (ESC).
   - Klik di luar area modal (backdrop overlay).
   - Klik pada tombol aksi "Baca Selengkapnya ↗".
5. **Reduced Motion Support:** Otomatis mematikan efek gerak berlebih jika pengguna mengaktifkan preferensi `prefers-reduced-motion`.

### 2.2 Non-Functional & A11y Requirements
- Kontras warna teks memenuhi standar WCAG AA (min 4.5:1).
- Touch target tombol minimal 44x44px untuk kenyamanan perangkat mobile.
- Zero layout shift pada LCP/FCP beranda.

## 3. Visual & Architectural Design

### 3.1 Design Tokens & Dials
- **Design Variance:** `7` (Asymmetric accents, refined typography)
- **Motion Intensity:** `6` (Spring physics, entrance interpolation)
- **Visual Density:** `4` (Spacious, airy padding)

### 3.2 Double-Bezel Hierarchy
```
┌─────────────────────────────────────────────────────────────┐
│ Outer Shell (bg-background/80, backdrop-blur-2xl, p-2.5)    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Inner Core (bg-card, rounded-[calc(2rem-0.625rem)])   │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Media Thumbnail (Aspect 16:9 + Badge "Terbaru") │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Content (Date + Title H3 + Summary Snippet)     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Footer Actions (Button-in-Button CTA + Checkbox)│  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Motion Choreography
- **Overlay Fade:** `opacity: 0` -> `1` (durasi 0.3s).
- **Modal Scale & Float:** `opacity: 0, scale: 0.94, y: 20` -> `opacity: 1, scale: 1, y: 0` dengan easing `cubic-bezier(0.16, 1, 0.3, 1)`.

## 4. Components & File Structure

1. **`components/home/NewsSpotlightModal.tsx`** (NEW)
   - Client Component (`'use client'`).
   - Menerima prop `news: NewsSpotlightItem | null`.
   - Mengelola state visibilitas, timer 700ms, dan interaksi localStorage.
2. **`app/page.tsx`** (MODIFY)
   - Melakukan query berita spotlight secara server-side dan menyematkan `<NewsSpotlightModal />`.
3. **`components/home/__tests__/NewsSpotlightModal.test.tsx`** (NEW)
   - Unit test pengujian rendering, delay timer, localStorage persistence, dismiss interactions.

## 5. Testing & Verification Plan
- **Unit Tests:** `npm test -- components/home/__tests__/NewsSpotlightModal.test.tsx`
- **Lint & Type Check:** `npm run lint` & `npx tsc --noEmit`
- **Manual Verification:** Buka beranda di browser, verifikasi kemunculan modal setelah delay, navigasi tombol, dan persistensi localStorage setelah ditutup.
