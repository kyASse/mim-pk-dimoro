# Panduan Deployment Vercel & Hostinger DNS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menulis 5 modul dokumen panduan deployment komprehensif untuk proyek MIM PK Dimoro ke Vercel dan DNS Hostinger di folder `docs/deployment/`.

**Architecture:** Dokumentasi modular berbahasa Indonesia berstandar SOP yang memecah alur deployment menjadi 4 tahapan logis (Supabase, Vercel, Hostinger DNS, Troubleshooting & Verifikasi) ditambah 1 modul index pusat kendali (`README.md`). Dilengkapi checklist interaktif, tabel konfigurasi presisi, dan alur penanganan masalah umum.

**Tech Stack:** Markdown (GFM), Mermaid diagrams, Next.js 15 App Router, Supabase, Vercel, Hostinger hPanel DNS.

---

### Task 1: Modul Indeks Utama & Panduan Arsitektur (`docs/deployment/README.md`)

**Files:**
- Create: `docs/deployment/README.md`

- [ ] **Step 1: Tulis isi file `docs/deployment/README.md`**
Buat dokumen index yang mencakup:
1. Ringkasan arsitektur sistem (Browser $\rightarrow$ Hostinger DNS $\rightarrow$ Vercel Edge $\rightarrow$ Next.js 15 $\rightarrow$ Supabase Cloud).
2. Diagram alur interaksi.
3. Prasyarat akun & perizinan (GitHub, Vercel, Hostinger, Supabase).
4. Peta navigasi dokumen (Modul 01 s.d. 04).
5. Checklist global progres deployment (`[ ] Belum`, `[-] Sedang`, `[x] Selesai`).

- [ ] **Step 2: Verifikasi file terbuat dan format markdown valid**
Pastikan tidak ada link rusak, struktur heading rapi, dan tabel checklist lengkap.

- [ ] **Step 3: Commit file**
```bash
git add -f docs/deployment/README.md docs/superpowers/specs/2026-09-07-deployment-guide-design.md
git commit -m "docs: add deployment guide index and architecture overview"
```

---

### Task 2: Modul 01 - Persiapan Kredensial & Supabase Cloud (`docs/deployment/01-persiapan-dan-supabase.md`)

**Files:**
- Create: `docs/deployment/01-persiapan-dan-supabase.md`

- [ ] **Step 1: Tulis isi file `docs/deployment/01-persiapan-dan-supabase.md`**
Buat panduan lengkap konfigurasi Supabase produksi yang mencakup:
1. Ekstraksi Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Anon public key)
   - `SUPABASE_SERVICE_ROLE_KEY` (Service role secret key - server only)
2. Konfigurasi Authentication di Supabase Dashboard:
   - *Site URL*: Setting domain produksi resmi (misal: `https://mimpkdimoro.sch.id`).
   - *Additional Redirect URLs*: Daftarkan callback URL (`https://mimpkdimoro.sch.id/auth/callback`, `https://www.mimpkdimoro.sch.id/auth/callback`, `http://localhost:3000/auth/callback`).
3. Konfigurasi Storage & Policy:
   - Verifikasi bucket publik (berita, galeri, aset PPDB) dengan akses `SELECT` publik.
   - Penjelasan `next.config.ts` `remotePatterns` untuk domain storage Supabase.
4. Verifikasi Database Schema & RLS:
   - Memastikan tabel produksi sinkron dan RLS aktif.
5. Checklist mandiri Modul 01.

- [ ] **Step 2: Verifikasi isi dokumen dan kejelasan langkah teknis**
Pastikan instruksi mudah dipahami dan tidak ada placeholder/TODO.

- [ ] **Step 3: Commit file**
```bash
git add -f docs/deployment/01-persiapan-dan-supabase.md
git commit -m "docs: add supabase production configuration module"
```

---

### Task 3: Modul 02 - Setup Repository & Deployment Vercel (`docs/deployment/02-deployment-vercel.md`)

**Files:**
- Create: `docs/deployment/02-deployment-vercel.md`

- [ ] **Step 1: Tulis isi file `docs/deployment/02-deployment-vercel.md`**
Buat panduan deployment Vercel yang mencakup:
1. Persiapan lokal & Git:
   - Verifikasi branch `main` atau `production`.
   - Validasi lokal via `npm run build` dan `npm run lint`.
2. Import Proyek di Vercel:
   - Login ke Vercel via akun GitHub.
   - *Add New Project* $\rightarrow$ Pilih repository `mim-pk-dimoro`.
   - Konfigurasi Framework Preset (`Next.js`), Root Directory (`./`), Build Command (`next build`).
3. Pengisian Environment Variables di Vercel Dashboard:
   - Input 3 variabel Supabase ke environment `Production` & `Preview`.
4. Trigger First Deployment:
   - Klik *Deploy* dan monitor *Build Logs*.
   - Verifikasi preview URL bawaan (`<project>.vercel.app`).
5. Checklist mandiri Modul 02.

- [ ] **Step 2: Verifikasi isi dokumen dan instruksi konfigurasi Vercel**
Pastikan nama setting dan tombol di dashboard Vercel akurat.

- [ ] **Step 3: Commit file**
```bash
git add -f docs/deployment/02-deployment-vercel.md
git commit -m "docs: add vercel deployment and build module"
```

---

### Task 4: Modul 03 - Konfigurasi DNS Hostinger & Custom Domain Vercel (`docs/deployment/03-konfigurasi-dns-hostinger.md`)

**Files:**
- Create: `docs/deployment/03-konfigurasi-dns-hostinger.md`

- [ ] **Step 1: Tulis isi file `docs/deployment/03-konfigurasi-dns-hostinger.md`**
Buat panduan pemetaan DNS Hostinger dan Custom Domain Vercel yang mencakup:
1. Penambahan Domain di Vercel:
   - *Project Settings* $\rightarrow$ *Domains*.
   - Input domain apex (`domain.sch.id`) dan subdomain `www.domain.sch.id`.
   - Pengaturan redirect preferensi (`www` diarahkan ke apex atau sebaliknya).
2. Konfigurasi DNS Zone di Hostinger hPanel:
   - Navigasi ke hPanel $\rightarrow$ *Domains* $\rightarrow$ *DNS / Nameservers*.
   - Tabel konfigurasi DNS:
     - **A Record**: Name `@`, Target `76.76.21.21`, TTL `300` / `14400`.
     - **CNAME Record**: Name `www`, Target `cname.vercel-dns.com`, TTL `300` / `14400`.
3. Pembersihan DNS Record Konflik:
   - Menghapus A Record bawaan Hostinger lama pada `@`.
   - Menghapus CNAME lama untuk `www` yang mengarah ke server hosting lama.
4. Verifikasi Propagasi & SSL Let's Encrypt:
   - Waktu propagasi dan pemantauan status centang hijau di Vercel.
   - Otomatisasi sertifikat SSL tanpa perlu konfigurasi manual.
5. Checklist mandiri Modul 03.

- [ ] **Step 2: Verifikasi tabel DNS dan panduan hPanel Hostinger**
Pastikan parameter IP dan CNAME Vercel tepat dan mudah disalin.

- [ ] **Step 3: Commit file**
```bash
git add -f docs/deployment/03-konfigurasi-dns-hostinger.md
git commit -m "docs: add hostinger dns and vercel custom domain module"
```

---

### Task 5: Modul 04 - Verifikasi Pasca-Deploy & Troubleshooting Error Populer (`docs/deployment/04-verifikasi-troubleshooting.md`)

**Files:**
- Create: `docs/deployment/04-verifikasi-troubleshooting.md`

- [ ] **Step 1: Tulis isi file `docs/deployment/04-verifikasi-troubleshooting.md`**
Buat panduan pengujian dan troubleshooting yang mencakup:
1. Checklist Audit Pasca-Deploy:
   - Verifikasi HTTPS & SSL badge di browser.
   - Verifikasi redirect WWW $\leftrightarrow$ non-WWW.
   - Uji alur otentikasi login Admin Dashboard (`/admin/login`).
   - Uji pengunggahan media gambar (Tiptap berita & galeri).
   - Uji submit formulir pendaftaran PPDB publik.
2. Panduan Troubleshooting Solutif:
   - Kasus 1: *DNS Invalid Configuration / SSL Stuck* di Vercel (cek propagasi via `whatsmydns.net`, purge DNS cache).
   - Kasus 2: *Supabase Auth Error / 400 Bad Request / Redirect Loop* (sinkronisasi Site URL & Callback).
   - Kasus 3: *Image Error: Hostname is not configured under images in next.config.ts* (penyesuaian remotePatterns Supabase).
   - Kasus 4: *Build Failed saat Deploy di Vercel* (cek Node.js version, TypeScript errors, missing env vars).
3. Checklist mandiri Modul 04.

- [ ] **Step 2: Verifikasi kelengkapan kasus error dan langkah solusinya**
Pastikan solusi bersifat teknis, dapat langsung dieksekusi, dan to the point.

- [ ] **Step 3: Commit file**
```bash
git add -f docs/deployment/04-verifikasi-troubleshooting.md
git commit -m "docs: add post-deployment verification and troubleshooting module"
```

---

### Task 6: Validasi Kelengkapan, Konsistensi Tautan Antar-Modul, & Finalisasi

**Files:**
- Modify: `docs/deployment/README.md` (jika ada update link atau status)
- Check: Semua file di `docs/deployment/`

- [ ] **Step 1: Uji seluruh tautan relatif antar dokumen modul**
Pastikan dari `README.md` bisa mengklik ke modul `01`, `02`, `03`, `04`, dan setiap modul memiliki link kembali ke `README.md` atau modul selanjutnya.

- [ ] **Step 2: Commit finalisasi rencana implementasi dan dokumentasi**
```bash
git add -f docs/deployment/ docs/superpowers/plans/2026-09-07-deployment-guide.md
git commit -m "docs: finalize deployment guide documentation suite"
```
