# Modul 02: Setup Repository dan Deployment Vercel

[Sebelumnya: Modul 01 - Persiapan Supabase](./01-persiapan-dan-supabase.md) | [Index Panduan](./README.md) | [Lanjut ke Modul 03: DNS Hostinger](./03-konfigurasi-dns-hostinger.md)

---

## Tujuan Modul

Menghubungkan repository GitHub proyek MIM PK Dimoro ke Vercel, memasang environment variables produksi, menjalankan proses build Next.js, dan memverifikasi aplikasi pada domain sementara (`*.vercel.app`).

---

## Langkah 1: Persiapan Lokal dan Verifikasi Git

Pastikan kode sumber tidak memiliki galat kompilasi sebelum dikirim ke remote repository.

### 1. Uji Build Lokal
Jalankan perintah build di terminal lokal:
```bash
npm run build
```
Pastikan proses menghasilkan status sukses:
```text
- Generating static pages
- Finalizing page optimization
- (Static)  prerendered as static content
- (Server)  server-rendered on demand
```

### 2. Push Kode ke GitHub
Pastikan seluruh commit terbaru sudah terdorong ke remote repository pada branch target (misal `main` atau `development`):
```bash
git push origin <nama-branch>
```

---

## Langkah 2: Import Proyek di Vercel Dashboard

1. Masuk ke dashboard [Vercel](https://vercel.com) menggunakan akun yang memiliki akses ke organisasi/repositori GitHub.
2. Klik tombol **Add New...** di sudut kanan atas lalu pilih **Project**.
3. Cari repository `mim-pk-dimoro` pada daftar *Import Git Repository*.
4. Klik tombol **Import**.

---

## Langkah 3: Konfigurasi Project Settings di Vercel

Pada halaman **Configure Project**, pastikan parameter berikut sesuai:

| Pengaturan | Nilai | Keterangan |
| :--- | :--- | :--- |
| Project Name | `mim-pk-dimoro` | Nama proyek di dashboard Vercel |
| Framework Preset | Next.js | Terdeteksi otomatis oleh Vercel |
| Root Directory | `./` | Lokasi file package.json |
| Build Command | `next build` | Default preset Next.js |
| Output Directory | `.next` | Default build output Next.js |
| Install Command | `npm install` | Default dependency installer |

---

## Langkah 4: Pengisian Environment Variables di Vercel

Buka accordion **Environment Variables** sebelum menjalankan deployment. Masukkan tiga variabel Supabase yang telah disiapkan pada Modul 01:

### 1. `NEXT_PUBLIC_SUPABASE_URL`
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://<project-ref>.supabase.co`
- Environment: Aktifkan untuk **Production**, **Preview**, dan **Development**.
- Klik **Add**.

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `<anon-public-key>`
- Environment: Aktifkan untuk **Production**, **Preview**, dan **Development**.
- Klik **Add**.

### 3. `SUPABASE_SERVICE_ROLE_KEY`
- Key: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `<service-role-secret-key>`
- Environment: Aktifkan untuk **Production** dan **Preview**.
- Klik **Add**.

---

## Langkah 5: Eksekusi Deploy dan Monitoring

1. Klik tombol **Deploy**.
2. Monitor log kompilasi pada tab *Building*. Vercel akan mengunduh dependencies, menjalankan compiler TypeScript, dan menghasilkan halaman statis serta serverless functions.
3. Tunggu hingga status deployment berubah menjadi **Ready**.
4. Catat URL deployment bawaan yang diberikan (contoh: `https://mim-pk-dimoro.vercel.app`).

---

## Langkah 6: Validasi Domain Sementara Vercel

Buka URL deployment bawaan pada browser untuk memverifikasi fungsionalitas dasar:
1. Pastikan tata letak CSS Tailwind, font, dan elemen interaktif termuat dengan benar.
2. Pastikan tidak ada pesan error koneksi ke Supabase pada console browser.
3. Uji responsivitas layout pada mode tampilan ponsel.

---

## Checklist Modul 02

- [ ] Perintah `npm run build` sukses dijalankan di lingkungan lokal.
- [ ] Repository terhubung di akun Vercel.
- [ ] Tiga Environment Variables terdaftar pada pengaturan proyek Vercel.
- [ ] Status build Vercel menghasilkan status *Ready*.
- [ ] Halaman depan situs dapat diakses melalui domain `*.vercel.app`.

---

[Lanjut ke Modul 03: Konfigurasi DNS Hostinger dan Custom Domain](./03-konfigurasi-dns-hostinger.md)
