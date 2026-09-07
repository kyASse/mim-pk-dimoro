# Modul 03: Konfigurasi DNS Hostinger & Custom Domain Vercel

> **Bagian dari Alur Deployment MIM PK Dimoro**  
> ⬅️ Sebelumnya ke [Modul 02: Deployment Vercel](./02-deployment-vercel.md) | 🏠 [Index Panduan](./README.md) | ➡️ Lanjut ke [Modul 04: Verifikasi & Troubleshooting](./04-verifikasi-troubleshooting.md)

---

## 🎯 Tujuan Modul
Modul ini memandu Anda dalam menghubungkan domain resmi sekolah (contoh: `mimpkdimoro.sch.id` atau domain yang dibeli di **Hostinger**) ke aplikasi Next.js 15 yang berjalan di **Vercel**. Di akhir modul ini, situs web sekolah akan dapat diakses secara publik melalui domain resmi lengkap dengan sertifikat keamanan SSL/HTTPS otomatis.

---

## 🌐 Memahami Konsep DNS: Apex Domain vs Subdomain WWW

Domain tingkat atas memiliki 2 bentuk akses utama yang umum digunakan pengunjung:
1. **Apex Domain (Root Domain)**: Alamat tanpa awalan `www`, contoh: `mimpkdimoro.sch.id`.
   - Standar DNS mengharuskan Apex Domain menggunakan **A Record** yang mengarah ke alamat IP server (dalam hal ini IP Anycast Vercel).
2. **Subdomain WWW**: Alamat dengan awalan `www`, contoh: `www.mimpkdimoro.sch.id`.
   - Standar DNS merekomendasikan penggunaan **CNAME Record** yang mengarah ke alias domain Vercel.

Kedua entri ini wajib dikonfigurasi bersamaan agar pengunjung yang mengetik dengan atau tanpa `www` tetap masuk ke situs sekolah yang sama tanpa pesan error.

---

## 🛠️ Langkah 1: Mendaftarkan Domain di Dashboard Vercel

1. Buka browser dan masuk ke [Vercel Dashboard](https://vercel.com).
2. Pilih proyek **`mim-pk-dimoro`**.
3. Klik tab menu **Settings** di navigasi atas $\rightarrow$ pilih submenu **Domains** di bilah kiri.
4. Pada kolom isian **Domain**, ketikkan nama domain utama sekolah Anda (contoh: `mimpkdimoro.sch.id`).
5. Klik tombol **Add**.
6. Vercel akan menampilkan pop-up rekomendasi redirect:
   - Pilih opsi rekomendasi: **Add `mimpkdimoro.sch.id` and redirect `www.mimpkdimoro.sch.id` to it** (atau sebaliknya sesuai preferensi branding sekolah).
7. Setelah ditambahkan, Vercel akan menampilkan kedua domain tersebut dalam daftar dengan status peringatan berwarna biru/kuning (**Invalid Configuration**) karena DNS di Hostinger belum diarahkan.
8. Catat instruksi DNS yang diminta Vercel (seperti yang dirangkum pada langkah berikutnya).

---

## 🧭 Langkah 2: Konfigurasi DNS Zone di Hostinger hPanel

Sekarang kita akan memasukkan catatan DNS tersebut ke dalam penyedia domain Hostinger.

1. Buka tab baru dan login ke [Hostinger hPanel](https://hpanel.hostinger.com).
2. Di navbar atas, klik menu **Domains** (Domain) $\rightarrow$ klik tombol **Manage** (Kelola) pada domain sekolah Anda.
3. Pada sidebar sebelah kiri, klik menu **DNS / Nameservers**.
4. Pastikan Anda berada pada tab **DNS Records**.

```text
Hostinger hPanel
└── Domains
    └── [mimpkdimoro.sch.id]
        └── DNS / Nameservers
            └── Tab: DNS Records
```

---

## 🧹 Langkah 3: Membersihkan Record DNS Lama yang Konflik

> [!CAUTION]
> **PENTING**: Jika domain ini sebelumnya pernah terhubung ke paket hosting web Hostinger, biasanya sudah terdapat record `A` bawaan yang mengarah ke server Hostinger. Jika tidak dihapus/diubah, lalu lintas pengunjung akan bentrok dan situs tidak akan terbuka di Vercel!

1. Gulir ke bawah ke tabel daftar DNS Records yang sedang aktif.
2. Cari record dengan parameter berikut:
   - Tipe: **A** dan Nama: **`@`** yang mengarah ke IP hosting Hostinger lama.
   - Tipe: **CNAME** dan Nama: **`www`** yang mengarah ke server lama.
3. Klik ikon tempat sampah (**Delete / Hapus**) pada record lama tersebut, atau klik **Edit** untuk mengubah nilainya ke konfigurasi Vercel di bawah ini.

---

## ✍️ Langkah 4: Menambahkan DNS Records Vercel di Hostinger

Di bagian atas halaman DNS Records, gunakan formulir **Manage DNS records** untuk menambahkan 2 record berikut:

### Record 1: Untuk Apex Domain (`@`)
- **Tipe**: Pilih `A`
- **Nama (Name)**: Ketik `@` *(artinya domain utama tanpa subdomain)*
- **Mengarah ke (Points to)**: `76.76.21.21`
- **TTL**: Pilih `300` detik (atau `14400` jika opsi 300 tidak tersedia)
- Klik tombol **Tambah Record** (*Add Record*).

### Record 2: Untuk Subdomain `www`
- **Tipe**: Pilih `CNAME`
- **Nama (Name)**: Ketik `www`
- **Mengarah ke (Points to)**: `cname.vercel-dns.com`
- **TTL**: Pilih `300` detik (atau `14400`)
- Klik tombol **Tambah Record** (*Add Record*).

---

## 📋 Tabel Ringkasan DNS Hostinger

Pastikan tabel DNS di Hostinger hPanel Anda memiliki dua entri aktif seperti tabel berikut:

| Tipe | Nama (Host) | Target / Points to | TTL | Fungsi |
| :---: | :---: | :--- | :---: | :--- |
| **A** | `@` | `76.76.21.21` | `300` | Mengarahkan `mimpkdimoro.sch.id` ke IP Vercel Edge |
| **CNAME** | `www` | `cname.vercel-dns.com` | `300` | Mengarahkan `www.mimpkdimoro.sch.id` ke alias DNS Vercel |

*(Catatan: Jangan ubah record lain yang tidak berhubungan seperti MX Record email madrasah atau TXT Record verifikasi Google jika ada).*

---

## ⏳ Langkah 5: Propagasi DNS & Penerbitan Sertifikat SSL

### 1. Apa itu Waktu Propagasi?
Propagasi DNS adalah waktu yang dibutuhkan server DNS di seluruh dunia untuk memperbarui catatan alamat IP baru Anda.
- Menggunakan TTL 300 detik biasanya memerlukan waktu **5 hingga 30 menit**.
- Dalam kasus tertentu pada domain ekstensi Indonesia (`.sch.id`, `.id`), propagasi lengkap dapat memakan waktu hingga **12–24 jam**.

### 2. Memantau Status Propagasi
Anda dapat memeriksa apakah DNS Hostinger sudah terbaca oleh server global dengan mengunjungi situs:
👉 [WhatsMyDNS.net](https://www.whatsmydns.net)
- Masukkan nama domain Anda: `mimpkdimoro.sch.id`
- Pilih tipe **A** $\rightarrow$ Klik **Search**.
- Jika mayoritas negara menampilkan centang hijau dengan IP `76.76.21.21`, berarti propagasi telah sukses!

### 3. Otomatisasi Sertifikat SSL di Vercel
1. Kembali ke Vercel Dashboard $\rightarrow$ *Settings* $\rightarrow$ *Domains*.
2. Klik tombol **Refresh** di samping nama domain Anda.
3. Begitu Vercel mendeteksi catatan DNS sudah sesuai, status akan berubah menjadi:
   - ✅ **Valid Configuration** (Ikon centang hijau).
   - 🔒 Status SSL otomatis beralih dari *Generating* menjadi *Issued* (diterbitkan oleh Let's Encrypt secara gratis).
4. Vercel secara otomatis memperbarui (*auto-renew*) sertifikat SSL ini setiap 90 hari tanpa memerlukan tindakan manual dari pengurus sekolah.

---

## ✅ Checklist Selesai Modul 03

Sebelum melanjutkan ke Modul 04, pastikan Anda telah mencentang:
- [ ] Domain utama dan `www` didaftarkan di menu *Settings > Domains* proyek Vercel.
- [ ] Record A lama yang bentrok di hPanel Hostinger telah dibersihkan.
- [ ] Record A (`@` $\rightarrow$ `76.76.21.21`) berhasil ditambahkan di Hostinger.
- [ ] Record CNAME (`www` $\rightarrow$ `cname.vercel-dns.com`) berhasil ditambahkan di Hostinger.
- [ ] Status domain di dashboard Vercel telah menampilkan indikator centang hijau (**Valid Configuration**).
- [ ] Sertifikat SSL berhasil diterbitkan dan domain dapat dibuka menggunakan awalan `https://`.

---

➡️ **Langkah Selanjutnya:** Lanjut ke [**Modul 04: Verifikasi Pasca-Deploy & Troubleshooting**](./04-verifikasi-troubleshooting.md) untuk melakukan audit menyeluruh pada seluruh fitur web sekolah.
