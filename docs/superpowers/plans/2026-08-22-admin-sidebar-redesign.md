# Admin Sidebar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Meredesain sidebar dashboard admin menjadi Modern Grouped Navigation dengan deteksi rute aktif pintar (`usePathname()`), auto-expand sub-menu, shortcut ke web publik, dan perapian dropdown profil.

**Architecture:** Client Components (`components/app-sidebar.tsx`, `components/nav-main.tsx`, `components/nav-user.tsx`) menggunakan Shadcn UI Sidebar primitives, Next.js `usePathname()` untuk dynamic routing state, dan struktur data menu terkategori.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons, Shadcn UI Sidebar, Vitest.

---

### Task 1: Update Test Suite for Admin Sidebar & Navigation

**Files:**
- Create: `components/admin/__tests__/app-sidebar.test.tsx`

- [ ] **Step 1: Write test verifying grouped menu structure, active route highlighting, and header link**

Create `components/admin/__tests__/app-sidebar.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/pendaftar',
}));

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: () => Promise.resolve({
        data: {
          user: {
            id: 'admin-123',
            email: 'admin@mimpkdimoro.sch.id',
          },
        },
        error: null,
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: {
              nama_lengkap: 'Ustadz Admin',
              role: 'admin',
              avatar_url: '/avatar-man-placeholder.png',
            },
            error: null,
          }),
        }),
      }),
    }),
  }),
}));

describe('Admin AppSidebar Component', () => {
  it('renders categorized menu groups', async () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    );

    // Verify group labels
    expect(await screen.findByText(/Utama/i)).toBeDefined();
    expect(screen.getByText(/Kesiswaan & PPDB/i)).toBeDefined();
    expect(screen.getByText(/Akademik & Agenda/i)).toBeDefined();
    expect(screen.getByText(/Publikasi & Media/i)).toBeDefined();
    expect(screen.getByText(/Komunikasi & Pengaturan/i)).toBeDefined();
  });

  it('renders quick link to public website in sidebar header', async () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    );

    const publicWebLink = await screen.findByRole('link', { name: /lihat website|kunjungi website|ke web publik/i });
    expect(publicWebLink.getAttribute('href')).toBe('/');
  });

  it('renders user name and email in footer', async () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    );

    expect(await screen.findByText('Ustadz Admin')).toBeDefined();
    expect(screen.getByText('admin@mimpkdimoro.sch.id')).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails against current sidebar**

Run: `npx vitest run components/admin/__tests__/app-sidebar.test.tsx`
Expected: FAIL due to missing group labels like "Kesiswaan & PPDB" and missing link to public website.

---

### Task 2: Implement Redesigned `nav-main.tsx`, `app-sidebar.tsx`, and `nav-user.tsx`

**Files:**
- Modify: `components/nav-main.tsx`
- Modify: `components/app-sidebar.tsx`
- Modify: `components/nav-user.tsx`

- [ ] **Step 1: Update `components/nav-main.tsx` to support grouped menus and active route detection**

In `components/nav-main.tsx`:
- Use `usePathname()` to check if a menu item or any of its children matches the current path.
- Apply active style `bg-sidebar-accent text-sidebar-accent-foreground font-semibold` when active.
- Automatically set `defaultOpen={true}` if any sub-item is active.
- Support `groups` schema:
```tsx
export interface NavGroup {
  label: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: string | number;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}
```

- [ ] **Step 2: Update `components/app-sidebar.tsx` with 5 functional menu groups and header public link**

In `components/app-sidebar.tsx`:
- Replace old `navMainData` with categorized `navGroupsData` (Utama, Kesiswaan & PPDB, Akademik & Agenda, Publikasi & Media, Komunikasi & Pengaturan).
- Remove repetitive "Kelola" prefixes for clean, scannable labels.
- In `SidebarHeader`, add a clean badge container for logo, school name, and a small button linking to `/` with tooltip *"Lihat Website Publik"*.

- [ ] **Step 3: Update `components/nav-user.tsx`**

In `components/nav-user.tsx`:
- Remove duplicate `<DropdownMenuSeparator />`.
- Add an "Administrator" role indicator badge.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/admin/__tests__/app-sidebar.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/nav-main.tsx components/app-sidebar.tsx components/nav-user.tsx components/admin/__tests__/app-sidebar.test.tsx
git commit -m "feat(admin): redesign admin sidebar with categorized navigation and smart active highlighting"
```

---

### Task 3: Full Validation (Unit Tests, Types & Build)

**Files:**
- All touched files

- [ ] **Step 1: Run all unit tests**

Run: `npx vitest run`
Expected: All test files pass.

- [ ] **Step 2: Run TypeScript typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: Build succeeds.
