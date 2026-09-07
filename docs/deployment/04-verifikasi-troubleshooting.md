# Modul 04: Verifikasi Pasca-Deploy & Troubleshooting

> **Bagian dari Alur Deployment MIM PK Dimoro**  
> ⬅️ Sebelumnya ke [Modul 03: Konfigurasi DNS Hostinger](./03-konfigurasi-dns-hostinger.md) | 🏠 [Index Panduan](./README.md)

---

## 🎯 Tujuan Modul
Modul ini adalah tahapan penutup dalam alur deployment. Di sini Anda akan menjalankan audit fungsional menyeluruh pada sistem produksi **MIM PK Dimoro** untuk memastikan seluruh fitur berjalan dengan sempurna, serta menyediakan pedoman penanganan cepat (*troubleshooting guide*) jika terjadi kendala teknis.

---

## 🔍 Bagian 1: Checklist Audit Fungsional Pasca-Deploy

Setelah status domain di Vercel berubah menjadi hijau (**Valid Configuration**) dan sertifikat SSL aktif, lakukan serangkaian pengujian operasional berikut:

### 1. Uji Keamanan & Routing Domain
- [ ] Buka domain menggunakan protokol HTTP biasa: `http://mimpkdimoro.sch.id`. Pastikan browser otomatis mengalihkan (*redirect*) ke **`https://mimpkdimoro.sch.id`**.
- [ ] Buka domain dengan awalan WWW: `https://www.mimpkdimoro.sch.id`. Pastikan otomatis diarahkan ke domain kanonikal pilihan Anda tanpa peringatan sertifikat.
- [ ] Periksa ikon gembok aman di bilah alamat browser (*Connection is secure - Valid Certificate*).

### 2. Uji Halaman Publik
- [ ] **Beranda**: Seluruh banner hero, statistik sekolah, program unggulan, dan testimoni termuat dengan rapi.
- [ ] **Tentang Kami / Profil**: Informasi sejarah, visi misi, struktur guru, dan fasilitas sekolah dapat dibaca dengan jelas.
- [ ] **Berita & Artikel**: Daftar artikel berita termuat dari database Supabase, dan halaman detail berita (`/berita/[slug]`) dapat dibuka.
- [ ] **Galeri & Ekstrakurikuler**: Foto-foto kegiatan termuat tanpa gambar rusak (*broken image*).

### 3. Uji Otentikasi Admin Dashboard (`/admin`)
- [ ] Buka halaman login admin di `https://mimpkdimoro.sch.id/admin/login`.
- [ ] Masukkan email dan password akun administrator sekolah.
- [ ] Klik **Masuk** dan pastikan sistem berhasil mengarahkan ke dashboard utama `/admin` tanpa mengalami *infinite loading* atau mental kembali ke login.
- [ ] Periksa bahwa cookie otentikasi Supabase (`sb-...-auth-token`) tersimpan aman di browser.
- [ ] Uji tombol **Keluar (Logout)** dan pastikan sesi terhapus serta rute `/admin` tidak dapat diakses kembali tanpa login.

### 4. Uji Pengunggahan Media (Storage & Editor Tiptap)
- [ ] Masuk ke menu admin pembuatan berita baru.
- [ ] Unggah gambar sampul (*featured image*) dan sisipkan gambar di dalam editor konten Tiptap.
- [ ] Simpan berita dan publikasikan.
- [ ] Buka berita tersebut di tab incognito publik untuk memastikan gambar dapat dimuat oleh pengunjung luar melalui CDN Supabase.

### 5. Uji Formulir Pendaftaran PPDB Online
- [ ] Buka menu formulir pendaftaran siswa baru di web publik (`/pendaftaran` atau `/ppdb`).
- [ ] Isi data formulir percobaan lengkap dengan upload berkas/foto yang diminta.
- [ ] Klik tombol submit dan pastikan muncul notifikasi keberhasilan serta bukti nomor pendaftaran.
- [ ] Buka menu **Admin PPDB** di dashboard admin untuk memastikan data pendaftar baru muncul di tabel dan dapat diunduh (ekspor Excel) atau diverifikasi statusnya.

### 6. Uji Responsivitas Perangkat Mobile
- [ ] Buka situs menggunakan ponsel Android / iPhone.
- [ ] Pastikan navigasi bilah bawah (*dock*), floating action button WhatsApp, dan hamburger menu bekerja dengan nyaman sesuai standar mobile-first.

---

## 🛠️ Bagian 2: Panduan Pemecahan Masalah (Troubleshooting)

Berikut adalah daftar masalah yang paling sering ditemui saat proses deployment Next.js + Supabase + Vercel + Hostinger beserta solusinya:

---

### Masalah 1: Status DNS di Vercel "Invalid Configuration" atau SSL "Pending"

#### 📌 Gejala:
Situs tidak dapat diakses dengan pesan browser `DNS_PROBE_FINISHED_NXDOMAIN` atau peringatan sertifikat `ERR_SSL_VERSION_OR_CIPHER_MISMATCH`. Di dashboard Vercel, domain berstatus peringatan kuning atau merah.

#### 🔍 Penyebab:
1. Catatan DNS di Hostinger belum selesai menyebar (propagasi masih berjalan).
2. Masih ada record `A` lama di Hostinger hPanel yang mengarah ke server hosting lama sehingga Vercel mendeteksi IP ganda (*conflicting A records*).
3. Penulisan nama host salah (misal menuliskan nama domain lengkap alih-alih `@`).

#### 💡 Solusi Langkah-demi-Langkah:
1. Buka [Hostinger hPanel](https://hpanel.hostinger.com) $\rightarrow$ **Domains** $\rightarrow$ **DNS / Nameservers**.
2. Periksa tabel DNS Records:
   - Pastikan **hanya ada 1 record A** untuk Name `@` yang bernilai `76.76.21.21`. Hapus record A lain yang bernilai selain IP tersebut.
   - Pastikan **hanya ada 1 record CNAME** untuk Name `www` yang bernilai `cname.vercel-dns.com`.
3. Buka [WhatsMyDNS.net](https://www.whatsmydns.net) dan cari domain Anda untuk tipe **A**. Pastikan IP `76.76.21.21` sudah mulai menyebar.
4. Buka Vercel Dashboard $\rightarrow$ **Settings** $\rightarrow$ **Domains** $\rightarrow$ klik tombol **Refresh**.
5. Bersihkan cache DNS lokal komputer Anda (di Windows Command Prompt: ketik `ipconfig /flushdns`).

---

### Masalah 2: Login Admin Mental / Redirect Loop / Error 400 `redirect_uri_mismatch`

#### 📌 Gejala:
Ketika login di `/admin/login`, setelah submit halaman kembali lagi ke login, atau browser menampilkan error halaman Supabase bertuliskan:  
`error: redirect_uri_mismatch` atau `URL not allowed`.

#### 🔍 Penyebab:
Fitur keamanan Supabase Auth menolak proses redirect karena domain produksi Anda belum terdaftar di whitelist Supabase Dashboard (masih bernilai `localhost:3000`).

#### 💡 Solusi Langkah-demi-Langkah:
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) $\rightarrow$ pilih proyek Anda.
2. Buka menu **Authentication** $\rightarrow$ **URL Configuration**.
3. Pastikan kolom **Site URL** diisi dengan domain resmi lengkap dengan protokol `https://`:
   ```text
   https://mimpkdimoro.sch.id
   ```
4. Pada bagian **Redirect URLs**, klik **Add URL** dan daftarkan:
   ```text
   https://mimpkdimoro.sch.id/auth/callback
   https://www.mimpkdimoro.sch.id/auth/callback
   ```
5. Klik **Save changes** di bagian bawah.
6. Coba login kembali di browser (gunakan mode *Private/Incognito* untuk membersihkan cache sesi lama).

---

### Masalah 3: Gambar Pecah / Error `hostname is not configured under images in your next.config.ts`

#### 📌 Gejala:
Gambar berita atau banner tidak muncul dan console browser menampilkan error:
```text
Error: Invalid src prop on `next/image`, hostname "xyz.supabase.co" is not configured under images in your `next.config.ts`
```

#### 🔍 Penyebab:
Variabel `NEXT_PUBLIC_SUPABASE_URL` belum diisi di Vercel atau proses build berjalan sebelum variabel tersebut ditambahkan, sehingga Next.js tidak dapat mendaftarkan hostname Supabase Storage ke whitelist optimasi gambar secara dinamis.

#### 💡 Solusi Langkah-demi-Langkah:
1. Buka [Vercel Dashboard](https://vercel.com) $\rightarrow$ Proyek `mim-pk-dimoro` $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**.
2. Pastikan variabel `NEXT_PUBLIC_SUPABASE_URL` terdaftar dengan nilai yang benar (misal: `https://xyzprojectref.supabase.co`).
3. Buka tab **Deployments** di Vercel.
4. Klik tanda titik tiga (`...`) pada deployment produksi paling atas $\rightarrow$ pilih **Redeploy**.
5. *PENTING*: Pastikan opsi **Use existing Build Cache** tidak dicentang agar Vercel membaca ulang environment variable saat proses kompilasi.
6. Tunggu hingga redeploy selesai dan buka kembali halaman web.

---

### Masalah 4: Deployment Gagal di Vercel (*Build Failed / Exit Code 1*)

#### 📌 Gejala:
Proses deployment di Vercel terhenti dengan status merah bertuliskan **Error** atau **Failed**.

#### 🔍 Penyebab:
1. Adanya kesalahan tipe data TypeScript atau aturan linter yang tidak lolos pengecekan otomatis Next.js.
2. Variabel environment penting kosong saat kompilasi static page.

#### 💡 Solusi Langkah-demi-Langkah:
1. Di Vercel Dashboard, buka deployment yang gagal dan klik menu tab **Building Logs**.
2. Gulir ke baris paling bawah untuk melihat pesan error spesifik dari compiler Next.js.
3. Buka terminal lokal Anda dan jalankan:
   ```bash
   npm run build
   ```
4. Perbaiki baris kode atau tipe data yang dilaporkan error oleh terminal lokal.
5. Lakukan commit dan push perbaikan ke branch GitHub:
   ```bash
   git add .
   git commit -m "fix: resolve build error for deployment"
   git push origin <nama-branch>
   ```
6. Vercel akan secara otomatis mendeteksi commit baru dan memulai ulang build.

---

## 🔒 Bagian 3: Panduan Pemeliharaan Rutin

Untuk menjaga performa dan keandalan sistem sekolah dalam jangka panjang:
1. **Backup Database Supabase**: Lakukan pencadangan database PostgreSQL secara berkala melalui menu *Database > Backups* di Supabase Dashboard (atau unduh dump via CLI).
2. **Monitoring Kuota Vercel**: Pantau penggunaan bandwidth dan serverless execution di tab *Usage* Vercel untuk memastikan pemakaian tetap berada dalam batas wajar.
3. **Pembaruan Dependensi**: Periksa pembaruan paket keamanan secara periodik dengan menjalankan `npm audit` di komputer pengembang.

---

## ✅ Checklist Selesai Modul 04

Sebelum menyerahkan sistem ke pihak sekolah, pastikan Anda telah mencentang:
- [ ] Akses HTTPS berfungsi dengan sertifikat SSL valid di browser.
- [ ] Redirect otomatis HTTP $\rightarrow$ HTTPS dan WWW $\rightarrow$ non-WWW berhasil.
- [ ] Login Admin, proteksi dashboard `/admin`, dan fungsi Logout teruji normal.
- [ ] Upload gambar dan penampilan artikel berita berfungsi tanpa error.
- [ ] Formulir PPDB berhasil menyimpan pendaftaran ke database.
- [ ] Tampilan mobile responsif dan ramah sentuhan.
- [ ] Tim pengelola telah dibekali akses login dan nomor kontak bantuan darurat jika ada kendala.

---

🎉 **Selamat!** Seluruh rangkaian deployment sistem informasi sekolah **MIM PK Dimoro** telah rampung dan siap melayani masyarakat.
