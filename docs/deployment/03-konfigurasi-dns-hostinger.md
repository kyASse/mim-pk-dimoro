# Modul 03: Konfigurasi DNS Hostinger dan Custom Domain Vercel

[Sebelumnya: Modul 02 - Deployment Vercel](./02-deployment-vercel.md) | [Index Panduan](./README.md) | [Lanjut ke Modul 04: Verifikasi dan Troubleshooting](./04-verifikasi-troubleshooting.md)

---

## Tujuan Modul

Menghubungkan domain resmi sekolah yang dikelola di Hostinger ke aplikasi Next.js pada Vercel, mengatur pemetaan A Record dan CNAME, serta memverifikasi penerbitan sertifikat SSL (HTTPS).

---

## Konsep DNS: Apex Domain dan Subdomain WWW

Situs web modern membutuhkan dua jenis entri domain agar dapat diakses tanpa galat:
1. **Apex Domain (Root Domain)**: Alamat tanpa awalan `www` (contoh: `mimpkdimoro.sch.id`). Menggunakan **A Record** yang mengarah ke alamat IP Anycast Vercel.
2. **Subdomain WWW**: Alamat dengan awalan `www` (contoh: `www.mimpkdimoro.sch.id`). Menggunakan **CNAME Record** yang mengarah ke domain alias Vercel.

Keduanya dikonfigurasi bersamaan dengan pengalihan otomatis (*redirect*) dari salah satu domain ke domain kanonikal pilihan.

---

## Langkah 1: Mendaftarkan Domain di Dashboard Vercel

1. Masuk ke [Vercel Dashboard](https://vercel.com) lalu buka proyek `mim-pk-dimoro`.
2. Buka tab **Settings** lalu pilih menu **Domains** di bilah kiri.
3. Masukkan domain utama pada kolom input (contoh: `mimpkdimoro.sch.id`).
4. Klik **Add**.
5. Pilih opsi pengalihan yang direkomendasikan Vercel:
   - Tambahkan `mimpkdimoro.sch.id` dan arahkan `www.mimpkdimoro.sch.id` ke domain utama (atau sebaliknya).
6. Domain akan tercatat dengan status *Invalid Configuration* hingga catatan DNS di Hostinger selesai dipetakan.

---

## Langkah 2: Mengakses DNS Zone di Hostinger hPanel

1. Masuk ke [Hostinger hPanel](https://hpanel.hostinger.com).
2. Buka menu **Domains** lalu pilih domain yang akan dikonfigurasi.
3. Pada bilah samping, klik menu **DNS / Nameservers**.
4. Buka tab **DNS Records**.

```text
Hostinger hPanel
└── Domains
    └── [mimpkdimoro.sch.id]
        └── DNS / Nameservers
            └── Tab: DNS Records
```

---

## Langkah 3: Membersihkan Record DNS Lama yang Bentrok

> [!CAUTION]
> Jika domain sebelumnya diarahkan ke server hosting bawaan Hostinger, hapus atau ubah record A lama untuk host `@` dan record CNAME lama untuk host `www`. Keberadaan IP ganda akan menyebabkan kegagalan routing ke Vercel.

1. Periksa daftar DNS Records yang aktif.
2. Cari record tipe `A` dengan nama `@` yang mengarah ke IP server Hostinger lama, lalu hapus atau ubah nilainya.
3. Cari record tipe `CNAME` dengan nama `www` yang mengarah ke server lama, lalu hapus atau ubah nilainya.

---

## Langkah 4: Menambahkan DNS Records Vercel di Hostinger

Tambahkan dua entri DNS baru melalui formulir kelola DNS:

### 1. Record Apex Domain
- Tipe: `A`
- Nama (Name): `@`
- Mengarah ke (Points to): `76.76.21.21`
- TTL: `300` detik (atau `14400`)
- Klik **Tambah Record**.

### 2. Record Subdomain WWW
- Tipe: `CNAME`
- Nama (Name): `www`
- Mengarah ke (Points to): `cname.vercel-dns.com`
- TTL: `300` detik (atau `14400`)
- Klik **Tambah Record**.

---

## Tabel Konfigurasi DNS Hostinger

| Tipe | Nama (Host) | Target / Points To | TTL Rekomendasi | Fungsi |
| :--- | :--- | :--- | :--- | :--- |
| A | `@` | `76.76.21.21` | 300 detik | Mengarahkan root domain ke IP Vercel Edge |
| CNAME | `www` | `cname.vercel-dns.com` | 300 detik | Mengarahkan subdomain www ke alias DNS Vercel |

Jangan mengubah record yang tidak berkaitan, seperti MX Record untuk operasional email institusi.

---

## Langkah 5: Propagasi DNS dan Sertifikat SSL

### 1. Estimasi Waktu Propagasi
Perubahan catatan DNS memerlukan waktu propagasi antara 5 hingga 30 menit untuk TTL 300 detik. Pada domain berakhiran `.sch.id` atau `.id`, propagasi penuh antar-ISP dapat memerlukan waktu hingga 24 jam.

### 2. Pemantauan Propagasi
Pemeriksaan propagasi global dapat dilakukan melalui layanan pihak ketiga seperti [whatsmydns.net](https://www.whatsmydns.net) dengan memasukkan nama domain dan memilih tipe `A`.

### 3. Otomatisasi Sertifikat SSL di Vercel
1. Kembali ke Vercel Dashboard -> **Settings** -> **Domains**.
2. Klik tombol **Refresh** pada baris domain terkait.
3. Setelah DNS terdeteksi valid:
   - Status domain berubah menjadi **Valid Configuration**.
   - Vercel menerbitkan sertifikat SSL Let's Encrypt secara otomatis.
   - Sertifikat diperbarui secara otomatis setiap 90 hari oleh Vercel.

---

## Checklist Modul 03

- [ ] Domain utama dan `www` didaftarkan pada menu Domains di Vercel.
- [ ] Catatan DNS lama yang bentrok di Hostinger telah dihapus.
- [ ] Record A (`@` -> `76.76.21.21`) aktif di Hostinger.
- [ ] Record CNAME (`www` -> `cname.vercel-dns.com`) aktif di Hostinger.
- [ ] Status domain di Vercel menunjukkan *Valid Configuration*.
- [ ] Domain dapat diakses menggunakan protokol HTTPS tanpa peringatan keamanan.

---

[Lanjut ke Modul 04: Verifikasi Pasca-Deploy dan Troubleshooting](./04-verifikasi-troubleshooting.md)
