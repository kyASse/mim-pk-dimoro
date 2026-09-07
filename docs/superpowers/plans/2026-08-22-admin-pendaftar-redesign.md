# Admin Pendaftar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Meredesain halaman kelola pendaftar (`/admin/pendaftar`) menjadi Modern Interactive Command Center dengan kartu metrik filter interaktif, toolbar status tabs, filter gender, export CSV, penggantian format ID `TK25-` ke format resmi `MIM-`, aksi cepat baris tabel, dan pagination.

**Architecture:** Client Components (`components/admin/PendaftarTable.tsx`, `components/admin/PendaftarSearch.tsx`) dan Server Component Page (`app/admin/pendaftar/page.tsx`) dengan pengelolaan state filter terpadu, kompatibilitas Dark Mode, dan utility ekspor CSV.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons, Shadcn UI Components, Vitest.

---

### Task 1: Update Test Suite for Admin Pendaftar Table & Metrics

**Files:**
- Create: `components/admin/__tests__/PendaftarTable.test.tsx`

- [ ] **Step 1: Write comprehensive test for PendaftarTable component**

Create `components/admin/__tests__/PendaftarTable.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PendaftarTable from '@/components/admin/PendaftarTable';

const mockPendaftar = [
  {
    id: 'pendaftar-1',
    nama_lengkap: 'Ahmad Faiz',
    nama_ayah_kandung: 'Bambang Sutrisno',
    nama_ibu_kandung: 'Siti Aminah',
    jenis_kelamin: 'L',
    tanggal_lahir: '2019-05-12',
    nomor_telepon: '081234567890',
    status_pendaftaran: 'Menunggu Persetujuan',
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'pendaftar-2',
    nama_lengkap: 'Fatimah Zahra',
    nama_ayah_kandung: 'Hendra Wijaya',
    nama_ibu_kandung: 'Nurul Hidayah',
    jenis_kelamin: 'P',
    tanggal_lahir: '2019-08-20',
    nomor_telepon: '089876543210',
    status_pendaftaran: 'Diterima',
    created_at: '2026-08-02T11:00:00Z',
  },
  {
    id: 'pendaftar-3',
    nama_lengkap: 'Budi Santoso',
    nama_ayah_kandung: 'Supri',
    nama_ibu_kandung: 'Hartini',
    jenis_kelamin: 'L',
    tanggal_lahir: '2019-01-15',
    nomor_telepon: '081122334455',
    status_pendaftaran: 'Revisi',
    created_at: '2026-08-03T12:00:00Z',
  },
  {
    id: 'pendaftar-4',
    nama_lengkap: 'Citra Dewi',
    nama_ayah_kandung: 'Joko',
    nama_ibu_kandung: 'Endang',
    jenis_kelamin: 'P',
    tanggal_lahir: '2019-03-25',
    nomor_telepon: '082233445566',
    status_pendaftaran: 'Ditolak',
    created_at: '2026-08-04T13:00:00Z',
  },
];

describe('Admin PendaftarTable Component', () => {
  it('renders metric cards with correct counts', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    expect(screen.getByText('Total Pendaftar')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined(); // Total count
  });

  it('filters data when metric card or status tab is clicked', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    
    // Click on Diterima filter tab
    const diterimaTab = screen.getByRole('tab', { name: /diterima/i });
    fireEvent.click(diterimaTab);

    expect(screen.getByText('Fatimah Zahra')).toBeDefined();
    expect(screen.queryByText('Ahmad Faiz')).toBeNull();
  });

  it('filters data by search query', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const searchInput = screen.getByPlaceholderText(/cari nama siswa/i);
    fireEvent.change(searchInput, { target: { value: 'Bambang' } });

    expect(screen.getByText('Ahmad Faiz')).toBeDefined();
    expect(screen.queryByText('Fatimah Zahra')).toBeNull();
  });

  it('uses MIM official registration code and not TK25 prefix', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    expect(screen.queryByText(/TK25-/i)).toBeNull();
    expect(screen.getAllByText(/MIM-/i).length).toBeGreaterThan(0);
  });

  it('renders quick action buttons (Detail, WhatsApp)', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const detailLinks = screen.getAllByRole('link', { name: /detail/i });
    expect(detailLinks.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify failure against current table**

Run: `npx vitest run components/admin/__tests__/PendaftarTable.test.tsx`
Expected: FAIL due to `TK25-` presence, missing status tabs, or missing metric click-to-filter.

---

### Task 2: Implement Redesigned `PendaftarTable.tsx`, `PendaftarSearch.tsx`, and `app/admin/pendaftar/page.tsx`

**Files:**
- Modify: `components/admin/PendaftarTable.tsx`
- Modify: `components/admin/PendaftarSearch.tsx`
- Modify: `app/admin/pendaftar/page.tsx`

- [ ] **Step 1: Update `components/admin/PendaftarTable.tsx`**

Features to implement:
1. **Interactive Top Metric Cards**:
   - Total Pendaftar, Menunggu Persetujuan, Diterima, Validasi Ulang (Revisi), Ditolak.
   - Click card to instantly set `selectedStatus` filter with ring-2 active indicator.
   - Visual icons (`Users`, `Clock`, `CheckCircle2`, `AlertCircle`, `XCircle`).
2. **Status Tabs & Toolbar**:
   - Tab list with counts: `Semua (4)`, `Menunggu (1)`, `Diterima (1)`, `Revisi (1)`, `Ditolak (1)`.
   - Gender Filter: `Semua Gender`, `Laki-laki (L)`, `Perempuan (P)`.
   - Search input for student name, parent names, registration ID.
   - Export CSV button (`exportToCSV(filteredData)`).
3. **Table Row Design**:
   - Registration code format: `MIM-${tahun}-${index.padStart(3, '0')}` or short ID.
   - Student initials avatar + Name + Gender Badge (L/P).
   - Parent Names with icon.
   - Formatted registration date (`DD MMM YYYY`).
   - Semantic Status Badge with consistent styling.
   - Quick Action buttons:
     - `Detail` (`/admin/pendaftar/detail/[id]`)
     - `WhatsApp` quick link (`https://wa.me/...`)
4. **Pagination**:
   - 10 items per page with Prev/Next buttons and page numbers.
   - Empty state illustration with Reset Filter button.

- [ ] **Step 2: Clean up `app/admin/pendaftar/page.tsx`**

In `app/admin/pendaftar/page.tsx`:
- Pass the full `pendaftar` list to `PendaftarTable` so the metric cards and table are unified in one responsive, interactive client component.
- Ensure page header has clean typography, breadcrumb or Back button, and school context.

- [ ] **Step 3: Run tests to verify they pass**

Run: `npx vitest run components/admin/__tests__/PendaftarTable.test.tsx`
Expected: PASS (100%).

- [ ] **Step 4: Commit**

```bash
git add components/admin/PendaftarTable.tsx components/admin/PendaftarSearch.tsx app/admin/pendaftar/page.tsx components/admin/__tests__/PendaftarTable.test.tsx
git commit -m "feat(admin): redesign pendaftar page into modern interactive command center"
```

---

### Task 3: Full Validation (Unit Tests, Types & Build)

**Files:**
- All touched files

- [ ] **Step 1: Run all unit tests**

Run: `npx vitest run`
Expected: All tests pass.

- [ ] **Step 2: Run TypeScript typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: Build succeeds.
