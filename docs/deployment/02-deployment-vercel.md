# Modul 02: Setup Repository & Deployment Vercel

> **Bagian dari Alur Deployment MIM PK Dimoro**  
> ⬅️ Sebelumnya ke [Modul 01: Persiapan Supabase](./01-persiapan-dan-supabase.md) | 🏠 [Index Panduan](./README.md) | ➡️ Lanjut ke [Modul 03: DNS Hostinger](./03-konfigurasi-dns-hostinger.md)

---

## 🎯 Tujuan Modul
Modul ini memandu Anda dalam menghubungkan repositori GitHub proyek **MIM PK Dimoro** ke platform hosting **Vercel**, mengonfigurasi variabel lingkungan (*environment variables*) produksi, menjalankan kompilasi (*build*), serta memperoleh domain sementara (`*.vercel.app`) yang siap diuji sebelum dipetakan ke domain resmi sekolah.

---

## 💻 Langkah 1: Persiapan Lokal & Verifikasi Git

Sebelum melakukan deployment ke Vercel, sangat disarankan untuk memvalidasi bahwa aplikasi tidak memiliki kesalahan kompilasi pada komputer lokal Anda.

### 1. Uji Build Lokal
Buka terminal proyek Anda dan jalankan perintah:
```bash
npm run build
```
Pastikan proses build menghasilkan output sukses tanpa error TypeScript ataupun lint:
```text
✓ Generating static pages
✓ Finalizing page optimization
○ (Static)  prerendered as static content
λ (Server)  server-rendered on demand
```

### 2. Push Kode Terbaru ke GitHub
Pastikan seluruh perubahan kode telah tersimpan dan di-push ke remote repository branch target (biasanya `main` atau `development`):
```bash
git status
git push origin <nama-branch>
```

---

## 🚀 Langkah 2: Import Proyek di Vercel Dashboard

1. Buka browser dan login ke akun [Vercel](https://vercel.com). Disarankan login menggunakan opsi **Continue with GitHub** agar izin akses repositori terintegrasi otomatis.
2. Pada halaman dashboard Vercel, klik tombol **Add New...** di sudut kanan atas $\rightarrow$ pilih **Project**.
3. Pada bagian **Import Git Repository**, cari nama repositori proyek Anda: `mim-pk-dimoro`.
   *(Jika repositori belum muncul, klik dropdown akun GitHub Anda dan pilih **Configure GitHub App** untuk memberikan izin akses ke repo tersebut).*
4. Klik tombol **Import** di samping nama repositori.

---

## ⚙️ Langkah 3: Konfigurasi Project Settings di Vercel

Setelah menekan tombol *Import*, Anda akan diarahkan ke halaman **Configure Project**:

```text
┌────────────────────────────────────────────────────────┐
│ Project Name: mim-pk-dimoro                           │
│ Framework Preset: Next.js                             │
│ Root Directory: ./                                    │
│ Build Command: next build (Default)                   │
│ Output Directory: .next (Default)                     │
│ Install Command: npm install (Default)                │
└────────────────────────────────────────────────────────┘
```

1. **Project Name**: Biarkan nama bawaan (misal: `mim-pk-dimoro`) atau sesuaikan sesuai preferensi.
2. **Framework Preset**: Vercel secara otomatis mendeteksi **Next.js**. Pastikan preset ini terpilih.
3. **Root Directory**: Biarkan `./` (karena file `package.json` berada di root direktori).
4. **Build and Output Settings**: Biarkan toggle dalam kondisi default (*Next.js preset handles this automatically*).
5. **Node.js Version**: Secara default Vercel menggunakan Node.js versi 20.x atau 18.x yang sepenuhnya kompatibel dengan spesifikasi `package.json` (`node >= 18.17`).

---

## 🔑 Langkah 4: Pengisian Environment Variables di Vercel

Ini adalah langkah paling krusial. Tanpa variabel lingkungan ini, Next.js tidak akan dapat terhubung ke database dan halaman yang memerlukan data Supabase akan mengalami kegagalan saat build time.

1. Pada halaman konfigurasi yang sama, scroll ke bawah ke bagian accordion **Environment Variables**.
2. Masukkan 3 kunci yang telah dicatat dari [Modul 01](./01-persiapan-dan-supabase.md):

### Variabel 1: Supabase URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://<your-project-ref>.supabase.co`
- **Environments**: Centang **Production**, **Preview**, dan **Development**.
- Klik tombol **Add**.

### Variabel 2: Supabase Anon Public Key
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Environments**: Centang **Production**, **Preview**, dan **Development**.
- Klik tombol **Add**.

### Variabel 3: Supabase Service Role Secret Key
- **Key**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Environments**: Centang **Production** dan **Preview**. *(Jangan centang Development jika ingin melindungi server lokal).*
- Klik tombol **Add**.

> [!NOTE]
> Nilai variabel di atas akan disimpan secara terenkripsi oleh Vercel dan hanya diinjeksikan saat aplikasi dieksekusi di serverless edge.

---

## 🏗️ Langkah 5: Eksekusi Deploy Pertama & Monitoring

1. Setelah ketiga variabel environment di atas ditambahkan ke tabel, klik tombol biru **Deploy**.
2. Layar akan berpindah ke mode visualisasi proses deployment:
   - **Cloning Repository**: Vercel mengunduh source code.
   - **Building**: Vercel menjalankan `npm install` dan `next build`.
   - **Checking Serverless Functions**: Mengemas route API dan Server Actions.
3. Tunggu sekitar 1–3 menit hingga muncul animasi kembang api dan pesan:  
   🎉 **"Congratulations! You just deployed a new Next.js project to Vercel."**
4. Klik tombol **Continue to Dashboard** atau klik jendela pratinjau (*preview screenshot*) untuk membuka URL bawaan proyek Anda (misal: `https://mim-pk-dimoro.vercel.app`).

---

## 🧪 Langkah 6: Validasi Cepat Domain Sementara Vercel

Buka URL bawaan Vercel tersebut di tab peramban baru dan lakukan pemeriksaan awal:
1. **Tampilan Beranda**: Pastikan landing page sekolah, navigasi menu, dan styling Tailwind termuat sempurna tanpa broken CSS.
2. **Gambar Awal**: Pastikan ikon dan logo termuat normal.
3. **Responsive Mobile**: Tekan `F12` untuk memeriksa tampilan pada mode perangkat layar sentuh/ponsel.

> [!TIP]
> Jika URL bawaan Vercel sudah berhasil diakses tanpa error, berarti kode dan backend Supabase telah terintegrasi dengan baik! Sekarang kita siap menghubungkannya dengan domain resmi sekolah yang ada di Hostinger.

---

## ✅ Checklist Selesai Modul 02

Sebelum melanjutkan ke Modul 03, pastikan Anda telah mencentang:
- [ ] Berhasil melakukan build lokal tanpa error (`npm run build`).
- [ ] Repositori terhubung dan ter-import di akun Vercel.
- [ ] Ketiga variabel environment Supabase terisi lengkap di Vercel Settings.
- [ ] Status build Vercel berhasil (*Ready*) dengan warna hijau.
- [ ] Domain bawaan `*.vercel.app` dapat diakses dan menampilkan beranda MIM PK Dimoro secara normal.

---

➡️ **Langkah Selanjutnya:** Lanjut ke [**Modul 03: Konfigurasi DNS Hostinger & Custom Domain**](./03-konfigurasi-dns-hostinger.md) untuk memetakan domain resmi sekolah.
