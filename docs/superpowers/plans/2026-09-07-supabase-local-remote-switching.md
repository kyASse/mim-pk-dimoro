# Supabase Local & Remote Switching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun sistem peralihan environment Supabase (Lokal Docker vs Remote Cloud) yang aman, otomatis, dan praktis menggunakan Node.js switcher script dan npm script.

**Architecture:** Menggunakan file profil terisolasi yang diabaikan git (`.env.local.supabase-local` dan `.env.local.supabase-remote`), script atomic copy cross-platform (`scripts/switch-env.mjs`), serta perintah npm (`npm run env:local`, `npm run env:remote`, `npm run env:status`). Vercel deployment tetap terisolasi penuh dengan membaca variabel lingkungan langsung dari Vercel Dashboard.

**Tech Stack:** Node.js (ESM), TypeScript, Vitest, Next.js 15, Supabase CLI / Cloud.

---

## File Map

- **Config & Env:**
  - Modify: [.gitignore](file:///c:/Chill/Sanbercode/Project/mim-pk-dimoro/.gitignore)
  - Modify: [.env.example](file:///c:/Chill/Sanbercode/Project/mim-pk-dimoro/.env.example)
  - Create: `.env.local.supabase-local` *(Git-ignored)*
  - Create: `.env.local.supabase-remote` *(Git-ignored)*
  - Modify: [package.json](file:///c:/Chill/Sanbercode/Project/mim-pk-dimoro/package.json)
- **Script & Tests:**
  - Create: `scripts/switch-env.mjs`
  - Create: `tests/scripts/switch-env.test.ts`
- **Documentation:**
  - Create: `docs/deployment/05-switching-local-remote.md`
  - Modify: [docs/deployment/README.md](file:///c:/Chill/Sanbercode/Project/mim-pk-dimoro/docs/deployment/README.md)

---

### Task 1: Konfigurasi Gitignore & Template Environment

**Files:**
- Modify: `.gitignore:33-36`
- Modify: `.env.example:1-8`
- Create: `.env.local.supabase-local`
- Create: `.env.local.supabase-remote`

- [ ] **Step 1: Pastikan `.gitignore` memproteksi semua varian `.env*.local`**
Verifikasi baris berikut pada `.gitignore`:
```gitignore
# env files (can opt-in for committing if needed)
.env*.local
.env
```

- [ ] **Step 2: Perbarui `.env.example` dengan dokumentasi profil switcher**
Tulis instruksi penggunaan switcher dan format variabel Supabase pada `.env.example`:
```env
# ==============================================================================
# MIM PK Dimoro - Environment Variables Template
# ==============================================================================
# File ini adalah referensi. Jangan letakkan kredensial rahasia di sini.
# Gunakan script switcher untuk beralih antara Supabase Local dan Remote:
#   npm run env:local   -> Menyalin .env.local.supabase-local ke .env.local
#   npm run env:remote  -> Menyalin .env.local.supabase-remote ke .env.local
#   npm run env:status  -> Cek target Supabase yang sedang aktif di .env.local
# ==============================================================================

# Supabase REST endpoint URL
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321

# Supabase Anon Public Key (Aman di browser, dibatasi RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY=use-anon-key

# Supabase Service Role Key (Server-only, TIDAK BOLEH berawalan NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=use-service-role-key
```

- [ ] **Step 3: Buat profil `.env.local.supabase-local`**
Isi dengan kredensial default Supabase CLI lokal:
```env
# Kredensial Supabase Lokal (Docker / Supabase CLI)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM0MTI4MDB9.CRXPXRX_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzQxMjgwMH0.CRXPXRX_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X
```

- [ ] **Step 4: Buat profil `.env.local.supabase-remote`**
Salin dari nilai `.env.local` saat ini (yang mengarah ke Supabase Cloud).

- [ ] **Step 5: Verifikasi status git**
Jalankan `git status` untuk memastikan `.env.local.supabase-local` dan `.env.local.supabase-remote` tidak muncul sebagai untracked files.

- [ ] **Step 6: Commit perubahan template**
```bash
git add .gitignore .env.example
git commit -m "chore(env): configure environment templates and gitignore for supabase switching"
```

---

### Task 2: Implementasi Script Switcher & Unit Test

**Files:**
- Create: `tests/scripts/switch-env.test.ts`
- Create: `scripts/switch-env.mjs`

- [ ] **Step 1: Tulis unit test untuk logika fungsi switcher**
Buat file `tests/scripts/switch-env.test.ts` untuk menguji:
1. `parseTarget`: mengenali argumen `local`, `remote`, dan `status`.
2. `detectCurrentTarget`: membaca isi `.env` dan mendeteksi apakah `127.0.0.1` (local) atau URL cloud (remote).
3. Pembuatan file default otomatis jika belum ada.

- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan (Red phase)**
```bash
npm run test tests/scripts/switch-env.test.ts
```
Expected: FAIL karena modul `scripts/switch-env.mjs` belum diimplementasikan.

- [ ] **Step 3: Implementasikan `scripts/switch-env.mjs`**
Buat script Node.js ESM lengkap dengan fungsi:
- `parseTarget(arg)`
- `detectTargetFromContent(content)`
- `switchEnv(target)`
- `showStatus()`
- Output konsol interaktif dan informatif.

- [ ] **Step 4: Jalankan test kembali untuk memverifikasi kelulusan (Green phase)**
```bash
npm run test tests/scripts/switch-env.test.ts
```
Expected: PASS seluruh assertions.

- [ ] **Step 5: Commit script switcher dan test**
```bash
git add scripts/switch-env.mjs tests/scripts/switch-env.test.ts
git commit -m "feat(scripts): add cross-platform supabase env switcher script with tests"
```

---

### Task 3: Integrasi NPM Scripts & Pengujian End-to-End

**Files:**
- Modify: `package.json:3-13`

- [ ] **Step 1: Tambahkan perintah ke `package.json`**
Tambahkan pada blok `"scripts"`:
```json
"env:local": "node scripts/switch-env.mjs local",
"env:remote": "node scripts/switch-env.mjs remote",
"env:status": "node scripts/switch-env.mjs status"
```

- [ ] **Step 2: Uji coba eksekusi `npm run env:local`**
```bash
npm run env:local
```
Verifikasi bahwa output menunjukkan peralihan ke Supabase LOCAL dan `.env.local` berisi URL `http://127.0.0.1:54321`.

- [ ] **Step 3: Uji coba eksekusi `npm run env:status`**
```bash
npm run env:status
```
Verifikasi output mengidentifikasi status aktif LOCAL.

- [ ] **Step 4: Uji coba eksekusi `npm run env:remote`**
```bash
npm run env:remote
```
Verifikasi bahwa output menunjukkan peralihan ke Supabase REMOTE dan `.env.local` berisi URL Cloud.

- [ ] **Step 5: Jalankan seluruh test suite dan lint**
```bash
npm run test
npm run lint
```
Expected: Seluruh test pass tanpa error.

- [ ] **Step 6: Commit integrasi package.json**
```bash
git add package.json
git commit -m "feat(npm): add env:local, env:remote, and env:status scripts"
```

---

### Task 4: Dokumentasi Panduan Pengembang

**Files:**
- Create: `docs/deployment/05-switching-local-remote.md`
- Modify: `docs/deployment/README.md`

- [ ] **Step 1: Buat modul `docs/deployment/05-switching-local-remote.md`**
Tulis panduan ringkas dan komprehensif berisi:
1. Cara memulai pengembangan lokal (`npm run env:local`, `npx supabase start`).
2. Cara beralih ke remote saat perlu testing data cloud (`npm run env:remote`).
3. Cara deploy ke Vercel (push langsung tanpa perlu switch manual).
4. FAQ & Troubleshooting jika env tidak berubah (ingatkan restart dev server).

- [ ] **Step 2: Perbarui index `docs/deployment/README.md`**
Tambahkan Modul 05 pada daftar modul panduan deployment.

- [ ] **Step 3: Commit dokumentasi**
```bash
git add -f docs/deployment/05-switching-local-remote.md docs/deployment/README.md
git commit -m "docs(deployment): add module 05 for supabase local and remote switching guide"
```
