# Modul 05: Alur Kerja Switching Supabase Lokal & Remote Cloud

[Kembali ke Index Panduan Deployment](./README.md)

---

## Tujuan Modul

Menjelaskan alur kerja bagi pengembang (*developer workflow*) untuk berpindah secara aman dan instan antara instance **Supabase Lokal (Docker / Supabase CLI)** dan **Supabase Remote (Cloud Produksi / Staging)** tanpa risiko merusak data produksi atau membocorkan kredensial saat melakukan deployment ke Vercel.

---

## 1. Konsep Arsitektur Switching

Next.js membaca variabel lingkungan dari `.env.local` saat berjalan di komputer lokal. Proyek ini menggunakan arsitektur **Profile Copy Atomik**:

```text
.env.local.supabase-local   ──(npm run env:local)───► .env.local ──► Next.js Local Dev
.env.local.supabase-remote  ──(npm run env:remote)──► .env.local ──► Next.js Local Dev

Git Tracking: DIABAIKAN (.gitignore: .env*.local*)
Vercel Production: Sepenuhnya membaca dari Vercel Dashboard Environment Variables
```

* **Keamanan Mutlak**: Semua file berformat `.env*.local*` diabaikan oleh `.gitignore`. Kredensial tidak akan pernah terdorong ke GitHub.
* **Isolasi Deployment**: Vercel tidak bergantung pada file lokal Anda. Di server Vercel, variabel diambil dari pengaturan dashboard Vercel, sehingga deployment selalu terhubung ke Supabase Cloud secara otomatis.

---

## 2. Perintah CLI Praktis

Tersedia tiga perintah bawaan di `package.json`:

### 1. Beralih ke Supabase Lokal (Default untuk Pengembangan)
```bash
npm run env:local
```
* **Efek**: Menyalin `.env.local.supabase-local` ke `.env.local`.
* **Output**:
  ```text
  [BERHASIL] Berhasil beralih ke Supabase: LOCAL
  Endpoint URL : http://127.0.0.1:54321
  Disalin dari : .env.local.supabase-local -> .env.local
  ```

### 2. Beralih ke Supabase Remote (Cloud)
```bash
npm run env:remote
```
* **Efek**: Menyalin `.env.local.supabase-remote` ke `.env.local`.
* **Output**:
  ```text
  [BERHASIL] Berhasil beralih ke Supabase: REMOTE
  Endpoint URL : https://<project-ref>.supabase.co
  Disalin dari : .env.local.supabase-remote -> .env.local
  ```

### 3. Memeriksa Target Environment yang Aktif
```bash
npm run env:status
```
* **Efek**: Membaca file `.env.local` saat ini tanpa melakukan perubahan.
* **Output**:
  ```text
  === STATUS SUPABASE ENVIRONMENT ===
  Target Aktif : [LOCAL]
  Endpoint URL : http://127.0.0.1:54321
  File Sumber  : .env.local
  ```

> [!IMPORTANT]
> **Penting**: Setelah berpindah environment dengan `npm run env:local` atau `npm run env:remote`, Anda **harus me-restart server Next.js** (`Ctrl + C` lalu jalankan kembali `npm run dev`) agar Next.js memuat nilai variabel lingkungan yang baru.

---

## 3. Alur Kerja Harian Pengembang

### Skenario A: Pengembangan Fitur Baru / Eksperimen Lokal
Gunakan alur ini saat membuat tabel baru, menambah kolom, menguji formulir PPDB, atau mencoba upload foto berita:
1. Pastikan target aktif adalah lokal:
   ```bash
   npm run env:local
   ```
2. Jalankan instance Supabase lokal (memerlukan Docker Desktop):
   ```bash
   npx supabase start
   ```
3. Jalankan server Next.js:
   ```bash
   npm run dev
   ```
4. Semua perubahan data, pendaftar fiktif, atau file upload hanya tersimpan di komputer lokal Anda. Database Cloud tetap 100% steril.

### Skenario B: Menguji Bug / Verifikasi Data Cloud di Komputer Lokal
Gunakan alur ini jika Anda perlu memeriksa tampilan berita atau data riil dari Supabase Cloud langsung di browser lokal:
1. Beralih ke remote:
   ```bash
   npm run env:remote
   ```
2. Jalankan server Next.js:
   ```bash
   npm run dev
   ```
3. Setelah selesai memeriksa, kembalikan ke lokal agar tidak sengaja memodifikasi data riil:
   ```bash
   npm run env:local
   ```

---

## 4. Alur Kerja Saat Melakukan Deployment

**Anda tidak perlu melakukan switch apapun sebelum deployment.**

1. Cukup commit kode sumber fitur baru seperti biasa:
   ```bash
   git add .
   git commit -m "feat: implementasi fitur baru"
   git push origin development
   ```
2. Vercel akan otomatis mendeteksi perubahan git commit dan melakukan build.
3. Karena file `.env.local` tidak diikutkan dalam git, Vercel secara otomatis menggunakan variabel lingkungan produksi yang sudah dikonfigurasi di **Vercel Dashboard &rarr; Project Settings &rarr; Environment Variables** (lihat [Modul 02: Deployment Vercel](./02-deployment-vercel.md)).

---

## 5. Sinkronisasi Perubahan Skema Database ke Cloud

Jika fitur baru Anda menambahkan tabel baru atau kebijakan RLS baru di `supabase/migrations/`:

1. Buat dan uji migrasi di lokal terlebih dahulu.
2. Hubungkan CLI ke proyek Supabase Cloud (cukup sekali):
   ```bash
   npx supabase link --project-ref <project-ref-anda>
   ```
3. Dorong migrasi ke Supabase Cloud secara aman:
   ```bash
   npx supabase db push
   ```
4. Verifikasi bahwa tabel baru telah muncul di Dashboard Supabase Cloud.

---

## 6. Pertanyaan Umum & Troubleshooting

### Q: Kenapa setelah `npm run env:remote`, aplikasi masih terhubung ke local?
* **Penyebab**: Server `next dev` membaca `.env.local` hanya saat pertama kali proses dijalankan (*process startup*).
* **Solusi**: Matikan dev server di terminal (`Ctrl + C`), lalu jalankan `npm run dev` kembali.

### Q: Kredensial apa saja yang perlu diisi di `.env.local.supabase-remote`?
* Buka [Supabase Dashboard](https://supabase.com/dashboard) &rarr; pilih proyek &rarr; **Project Settings** &rarr; **API**:
  * `NEXT_PUBLIC_SUPABASE_URL` = Project URL
  * `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon / public key
  * `SUPABASE_SERVICE_ROLE_KEY` = service_role secret key
