# Design Spec: Manajemen Pesan Masuk Admin Dashboard (`/admin/pesan`)

- **Tanggal**: 2026-08-21
- **Status**: Disetujui (Approved)
- **Topik**: Halaman Manajemen Pesan Masuk di Dashboard Admin MIM PK Dimoro

---

## 1. Latar Belakang & Tujuan
Website MIM PK Dimoro memiliki formulir kontak publik (`/kontak`) di mana masyarakat/orang tua dapat mengirimkan pesan, pertanyaan PPDB, atau masukan. Pesan-pesan tersebut tersimpan dalam tabel `pesan_masuk` di Supabase.

Fitur ini menyediakan antarmuka terpusat bagi admin di Dashboard (`/admin/pesan`) untuk:
1. Melihat dan membaca semua pesan masuk dari publik.
2. Memfilter pesan berdasarkan status (`belum_dibaca`, `dibaca`, `dibalas`).
3. Mencari pesan berdasarkan nama pengirim, subjek, email, atau nomor telepon.
4. Membalas pesan secara langsung melalui WhatsApp atau Email menggunakan template standar madrasah yang dapat disesuaikan sebelum dikirim.
5. Mengelola status pesan (otomatis maupun manual) dan menghapus pesan jika diperlukan.

---

## 2. Arsitektur & Struktur Komponen

### 2.1 Navigasi & Routing
- **URL Route**: `/admin/pesan`
- **Sidebar Integration**: `components/app-sidebar.tsx`
  - Menu item: "Pesan Masuk"
  - Ikon: `Inbox` / `Mail` dari `lucide-react`
  - URL target: `/admin/pesan`

### 2.2 Komponen File
```
app/admin/pesan/
├── page.tsx                       # Server Component: Auth check & initial Supabase fetch
├── actions.ts                     # Server Actions: updatePesanStatus, deletePesan, markAllAsRead
└── __tests__/
    └── actions.test.ts            # Unit test untuk server actions

components/admin/pesan/
├── PesanManagement.tsx            # Client Component: State filter, search, metric cards, table & sheet container
├── PesanTable.tsx                 # Client Component: Data table daftar pesan dengan status highlight
├── PesanDetailSheet.tsx           # Client Component: Slide-over Drawer detail pesan, preview balasan & aksi
├── PesanStatusBadge.tsx           # Komponen badge status warna konsisten
└── __tests__/
    └── PesanManagement.test.tsx   # Test interaksi filtering, search, & sheet trigger

lib/utils/
├── pesan-utils.ts                 # Helper normalisasi WhatsApp number, template generator, stats calculator
└── __tests__/
    └── pesan-utils.test.ts        # Test utility normalisasi nomor & template
```

---

## 3. Alur Pengguna (User Flow) & Interaksi

### 3.1 Ringkasan Metrik & Filter
- Di bagian atas halaman `/admin/pesan`, terdapat 3 kartu ringkasan:
  1. **Total Pesan Masuk**: Total seluruh record di `pesan_masuk`.
  2. **Belum Dibaca**: Total pesan dengan status `belum_dibaca` (warna aksen kuning/oranye).
  3. **Sudah Dibalas**: Total pesan dengan status `dibalas` (warna aksen emerald/hijau).
- Tab filter status: `Semua`, `Belum Dibaca`, `Dibaca`, `Dibalas`.
- Input pencarian (Search bar): Mencari kecocokan nama, email, subjek, isi pesan, dan telepon secara real-time di sisi client.

### 3.2 Tabel Pesan
- Menampilkan daftar pesan dalam bentuk tabel responsif.
- Baris dengan status `belum_dibaca` memiliki aksen visual penanda pesan baru (font semi-bold, badge kuning, indicator dot).
- Kolom tabel:
  1. **Pengirim**: Nama pengirim + avatar inisial.
  2. **Kontak**: Badge nomor WhatsApp (jika ada) dan Email.
  3. **Subjek & Pesan**: Judul subjek tebal + potongan isi pesan (truncated).
  4. **Tanggal**: Format tanggal relatif / tanggal Indonesia (misal: `21 Agt 2026, 10:45 WIB`).
  5. **Status**: Badge status (`Belum Dibaca`, `Dibaca`, `Dibalas`).
  6. **Aksi**: Tombol buka detail (ikon `Eye` / `ChevronRight`).

### 3.3 Slide-Over Drawer (PesanDetailSheet)
Saat admin mengklik baris pesan:
1. Sheet terbuka dari sisi kanan layar.
2. Jika pesan berstatus `belum_dibaca`, sistem secara otomatis memicu `updatePesanStatus(id, 'dibaca')` dengan pembaruan UI optimistik.
3. Menampilkan:
   - Header info pengirim, tanggal lengkap, email, nomor HP.
   - Kotak isi pesan lengkap dengan kontras dan tipografi yang jelas.
   - **Tab Balas WhatsApp**:
     - Memformat nomor telepon otomatis (misal `0812...` -> `62812...`).
     - Menampilkan textarea draf balasan dengan template madrasah otomatis.
     - Tombol "Kirim via WhatsApp" membuka tautan `https://wa.me/...` atau `https://web.whatsapp.com/...` di tab baru dan otomatis mengupdate status pesan menjadi `dibalas`.
     - Pesan fallback jika pengirim tidak menyertakan nomor HP.
   - **Tab Balas Email**:
     - Template subjek `Re: [Subjek] - MIM PK Dimoro`.
     - Textarea draf isi email.
     - Tombol "Buka Aplikasi Email" membuka tautan `mailto:...` dan mengupdate status menjadi `dibalas`.
   - **Aksi Tambahan**:
     - Tombol dropdown ganti status manual.
     - Tombol "Hapus Pesan" dengan dialog konfirmasi (*Alert Dialog*).

---

## 4. Model Data & Server Actions

### 4.1 Type Definitions
```typescript
export type StatusPesan = 'belum_dibaca' | 'dibaca' | 'dibalas';

export interface PesanMasuk {
  id: number;
  nama_pengirim: string;
  email_pengirim: string;
  telepon: string | null;
  subjek: string | null;
  isi_pesan: string;
  status: StatusPesan;
  created_at: string;
  updated_at: string;
}
```

### 4.2 Server Actions (`app/admin/pesan/actions.ts`)
- `updatePesanStatusAction(id: number, status: StatusPesan)`: Memperbarui kolom `status` dan `updated_at` di tabel `pesan_masuk`, kemudian memanggil `revalidatePath('/admin/pesan')`.
- `deletePesanAction(id: number)`: Menghapus baris dari `pesan_masuk` dan `revalidatePath('/admin/pesan')`.
- `markAllAsReadAction()`: Memperbarui semua pesan berstatus `belum_dibaca` menjadi `dibaca`.

---

## 5. Rencana Pengujian (Testing & Verification)

1. **Unit Test (`lib/utils/__tests__/pesan-utils.test.ts`)**:
   - `formatWhatsAppNumber`: Menguji konversi berbagai format nomor (`0812...`, `+62812...`, `62812...`, format spasi/dash).
   - `generateWhatsAppReplyUrl`: Menguji pembentukan URL wa.me dengan teks ter-encode.
   - `generateMailtoUrl`: Menguji pembentukan URL mailto dengan subject & body.
   - `calculatePesanStats`: Menguji perhitungan jumlah pesan berdasarkan status.

2. **Component Test (`components/admin/pesan/__tests__/PesanManagement.test.tsx`)**:
   - Memverifikasi filter tab status berfungsi menyaring baris tabel yang relevan.
   - Memverifikasi pencarian nama/subjek memperbarui daftar secara real-time.
   - Memverifikasi pembukaan detail sheet saat baris tabel diklik.

3. **Server Action Test (`app/admin/pesan/__tests__/actions.test.ts`)**:
   - Menguji pemanggilan `updatePesanStatusAction` dan `deletePesanAction` dengan mock Supabase server client.

---

## 6. Checklist Verifikasi Akhir
- [ ] TypeScript type-check lulus tanpa error (`npm run type-check` atau `npx tsc --noEmit`).
- [ ] Linter lulus tanpa error (`npm run lint`).
- [ ] Seluruh unit test Vitest lulus (`npm test`).
- [ ] Sidebar navigasi admin menampilkan menu "Pesan Masuk" dan aktif saat berada di `/admin/pesan`.
- [ ] Fitur balas WhatsApp dan Email membuka URL yang benar dan memperbarui status menjadi `dibalas`.
