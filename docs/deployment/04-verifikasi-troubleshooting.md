# Modul 04: Verifikasi Pasca-Deploy dan Troubleshooting

[Sebelumnya: Modul 03 - Konfigurasi DNS Hostinger](./03-konfigurasi-dns-hostinger.md) | [Index Panduan](./README.md)

---

## Tujuan Modul

Melakukan audit fungsional menyeluruh pada sistem produksi MIM PK Dimoro setelah domain terhubung, serta memberikan referensi teknis pemecahan masalah jika terjadi kendala operasional.

---

## Bagian 1: Checklist Audit Fungsional Pasca-Deploy

Jalankan pengujian operasional berikut setelah status domain di Vercel berstatus *Valid Configuration* dan sertifikat SSL aktif:

### 1. Keamanan dan Routing Domain
- [ ] Buka `http://mimpkdimoro.sch.id`. Pastikan browser mengalihkan secara otomatis ke `https://mimpkdimoro.sch.id`.
- [ ] Buka `https://www.mimpkdimoro.sch.id`. Pastikan diarahkan ke domain kanonikal tanpa peringatan sertifikat SSL.
- [ ] Periksa status gembok keamanan pada bilah alamat browser untuk memastikan sertifikat SSL valid.

### 2. Halaman Publik
- [ ] Beranda: Banner hero, profil sekolah, dan program unggulan termuat dengan benar.
- [ ] Profil Sekolah: Halaman tentang kami, visi misi, data guru, dan fasilitas sekolah dapat diakses.
- [ ] Berita: Daftar artikel dari Supabase termuat dan halaman detail `/berita/[slug]` dapat dibaca.
- [ ] Galeri: Foto dokumentasi kegiatan termuat tanpa gambar rusak.

### 3. Otentikasi Admin Dashboard (`/admin`)
- [ ] Buka halaman login admin di `/admin/login`.
- [ ] Masukkan kredensial akun administrator.
- [ ] Pastikan sistem berhasil masuk ke dashboard `/admin` tanpa redirect loop.
- [ ] Pastikan cookie sesi Supabase (`sb-...-auth-token`) terdaftar pada browser.
- [ ] Uji tombol Logout dan pastikan rute terproteksi tidak dapat dibuka kembali tanpa login.

### 4. Pengunggahan Media dan Storage
- [ ] Masuk ke form pembuatan berita di dashboard admin.
- [ ] Unggah gambar sampul dan tambahkan gambar pada editor Tiptap.
- [ ] Simpan dan publikasikan artikel.
- [ ] Buka artikel tersebut pada tab incognito untuk memvalidasi akses publik gambar via CDN Supabase.

### 5. Formulir Pendaftaran PPDB Online
- [ ] Buka halaman pendaftaran siswa baru pada web publik.
- [ ] Isi data pengujian dan unggah dokumen persyaratan.
- [ ] Kirim formulir dan pastikan sistem memberikan nomor pendaftaran.
- [ ] Periksa data pendaftar baru pada dashboard Admin PPDB dan uji ekspor data Excel.

### 6. Pengujian Tampilan Mobile
- [ ] Buka situs menggunakan perangkat smartphone.
- [ ] Pastikan navigasi, tombol kontak WhatsApp, dan menu navigasi responsif dan tidak terpotong.

---

## Bagian 2: Panduan Pemecahan Masalah (Troubleshooting)

### Kasus 1: Status DNS di Vercel Menunjukkan "Invalid Configuration" atau SSL "Pending"

#### Gejala
Domain tidak dapat diakses, peramban menampilkan pesan `DNS_PROBE_FINISHED_NXDOMAIN` atau `ERR_SSL_VERSION_OR_CIPHER_MISMATCH`. Di Vercel, status domain tetap berwarna kuning atau merah.

#### Penyebab
1. Propagasi DNS di server Hostinger masih berjalan.
2. Terdapat record `A` lama di Hostinger hPanel yang masih mengarah ke IP hosting lama.
3. Nilai Host pada record tidak sesuai (menggunakan nama domain lengkap alih-alih `@`).

#### Solusi
1. Buka Hostinger hPanel -> **Domains** -> **DNS / Nameservers** -> **DNS Records**.
2. Pastikan hanya terdapat satu record `A` untuk nama `@` dengan nilai `76.76.21.21`. Hapus record `A` lama yang bernilai lain.
3. Pastikan record `CNAME` untuk nama `www` bernilai `cname.vercel-dns.com`.
4. Periksa penyebaran IP global melalui [whatsmydns.net](https://www.whatsmydns.net).
5. Pada Vercel Dashboard -> **Settings** -> **Domains**, klik tombol **Refresh**.
6. Bersihkan DNS cache lokal komputer menggunakan perintah `ipconfig /flushdns`.

---

### Kasus 2: Login Admin Mental / Redirect Loop / Galat `redirect_uri_mismatch`

#### Gejala
Setelah mengirimkan formulir login di `/admin/login`, halaman terus berputar (*loading loop*), kembali ke form login, atau menampilkan galat Supabase `error: redirect_uri_mismatch`.

#### Penyebab
Pengaturan URL pada Supabase Auth masih mengarah ke `http://localhost:3000` dan belum mendaftarkan URL callback domain produksi.

#### Solusi
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) lalu pilih proyek terkait.
2. Buka menu **Authentication** -> **URL Configuration**.
3. Pastikan kolom **Site URL** menggunakan domain resmi:
   ```text
   https://mimpkdimoro.sch.id
   ```
4. Pada bagian **Redirect URLs**, tambahkan endpoint berikut:
   ```text
   https://mimpkdimoro.sch.id/auth/callback
   https://www.mimpkdimoro.sch.id/auth/callback
   ```
5. Simpan perubahan (*Save changes*) dan coba login kembali menggunakan jendela peramban penyamaran (*Incognito*).

---

### Kasus 3: Gambar Pecah / Galat `hostname is not configured under images in next.config.ts`

#### Gejala
Gambar dari Supabase Storage tidak muncul dan konsol browser mencatat galat:
```text
Error: Invalid src prop on `next/image`, hostname "xyz.supabase.co" is not configured under images in your `next.config.ts`
```

#### Penyebab
Variabel `NEXT_PUBLIC_SUPABASE_URL` belum terdaftar saat proses build dijalankan di Vercel, sehingga konfigurasi dinamis `remotePatterns` pada `next.config.ts` tidak membaca domain storage Supabase.

#### Solusi
1. Buka Vercel Dashboard -> **Settings** -> **Environment Variables**.
2. Pastikan variabel `NEXT_PUBLIC_SUPABASE_URL` terdaftar dengan nilai valid (contoh: `https://xyz.supabase.co`).
3. Buka tab **Deployments** di Vercel.
4. Klik tombol titik tiga pada deployment terbaru lalu pilih **Redeploy**.
5. Pastikan opsi **Use existing Build Cache** tidak dicentang agar Vercel membaca ulang environment variables saat kompilasi.

---

### Kasus 4: Deployment Gagal di Vercel (Build Failed / Exit Code 1)

#### Gejala
Deployment Vercel menghasilkan status *Failed* atau *Error*.

#### Penyebab
1. Terdapat galat TypeScript atau aturan linting yang tidak terpenuhi.
2. Dependensi hilang atau gagal diinstal.

#### Solusi
1. Buka log deployment pada tab **Building Logs** di Vercel untuk membaca pesan error kompilator.
2. Jalankan perintah verifikasi secara lokal:
   ```bash
   npm run build
   npm run lint
   ```
3. Perbaiki baris kode yang menyebabkan galat.
4. Lakukan commit dan push perubahan kode ke branch repositori remote.

---

## Bagian 3: Pemeliharaan Sistem

1. **Pencadangan Basis Data**: Lakukan backup database berkala melalui menu *Database > Backups* di Supabase Dashboard.
2. **Monitoring Penggunaan Vercel**: Tinjau penggunaan bandwidth, invocation, dan build minutes pada tab *Usage* di Vercel.
3. **Pembaruan Dependensi**: Jalankan `npm audit` secara berkala untuk memantau keamanan pustaka pendukung aplikasi.

---

## Checklist Modul 04

- [ ] Pengalihan protokol HTTPS dan subdomain WWW berjalan normal.
- [ ] Navigasi halaman publik dapat diakses tanpa hambatan.
- [ ] Login administrator, proteksi rute `/admin`, dan sesi logout berfungsi baik.
- [ ] Pengunggahan dan penampilan media berita/galeri berjalan normal.
- [ ] Alur pendaftaran PPDB online dan pencatatan database terverifikasi.
- [ ] Tampilan responsif pada perangkat seluler teruji.
