# Public Footer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Meredesain footer halaman publik menjadi Modern Editorial & Brand Hub yang interaktif, elegan, kaya informasi, dan terhubung penuh dengan kontak dinamis sekolah.

**Architecture:** Client Component (`components/layout/Footer.tsx`) dengan pengambilan data `kontak_sekolah` dari Supabase, animasi spring halus via `motion/react`, interaksi link kontak langsung (WhatsApp, Mailto, Google Maps), dan struktur grid 4 kolom modern.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion/React, Supabase Client, Vitest.

---

### Task 1: Update Test Suite for New Footer Design & Features

**Files:**
- Modify: `components/layout/__tests__/Footer.test.tsx`

- [ ] **Step 1: Write comprehensive failing tests for the redesigned Footer**

Update `components/layout/__tests__/Footer.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Footer from '@/components/layout/Footer';
import { SCHOOL_FULL_NAME, SCHOOL_NAME } from '@/lib/school-config';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        maybeSingle: () => Promise.resolve({
          data: {
            alamat: 'Jl. Raya Dimoro No. 12, Sukoharjo',
            whatsapp: '081234567890',
            email_utama: 'info@mimpkdimoro.sch.id',
            jam_operasional: '07:00 - 13:30 WIB',
            facebook_url: 'https://facebook.com/mimpkdimoro',
            instagram_url: 'https://instagram.com/mimpkdimoro',
            youtube_url: 'https://youtube.com/@mimpkdimoro',
          },
          error: null,
        }),
      }),
    }),
  }),
}));

// Mock motion/react to avoid jsdom animation issues
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, whileInView, viewport, transition, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, whileHover, whileTap, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => true,
}));

describe('Redesigned Footer Component', () => {
  it('renders brand identity, school name, and program badge', async () => {
    render(<Footer />);
    expect(screen.getAllByText(new RegExp(SCHOOL_FULL_NAME, 'i')).length).toBeGreaterThan(0);
    expect(screen.getByText(/Program Khusus/i)).toBeDefined();
  });

  it('renders all key navigation links including /berita and /tentang-kami', async () => {
    render(<Footer />);
    
    // Core explore links
    expect(screen.getByRole('link', { name: /beranda/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /tentang kami/i }).getAttribute('href')).toBe('/tentang-kami');
    expect(screen.getByRole('link', { name: /program & kurikulum/i }).getAttribute('href')).toBe('/program');
    expect(screen.getByRole('link', { name: /galeri/i }).getAttribute('href')).toBe('/galeri');
    expect(screen.getByRole('link', { name: /berita & kegiatan/i }).getAttribute('href')).toBe('/berita');

    // Service & Academic links
    expect(screen.getByRole('link', { name: /pendaftaran/i }).getAttribute('href')).toBe('/pendaftaran');
    expect(screen.getByRole('link', { name: /kalender akademik/i }).getAttribute('href')).toBe('/kalender-akademik');
    expect(screen.getByRole('link', { name: /portal wali murid/i }).getAttribute('href')).toBe('/auth/login');
  });

  it('renders interactive contact links with proper hrefs', async () => {
    render(<Footer />);
    
    // WhatsApp interactive link
    const waLinks = screen.getAllByRole('link', { name: /whatsapp|081234567890|konsultasi/i });
    expect(waLinks.some(link => link.getAttribute('href')?.includes('wa.me'))).toBe(true);

    // Email mailto link
    const mailLinks = screen.getAllByRole('link', { name: /email|info@mimpkdimoro.sch.id/i });
    expect(mailLinks.some(link => link.getAttribute('href')?.startsWith('mailto:'))).toBe(true);
  });

  it('renders dynamic social media links with target="_blank"', async () => {
    render(<Footer />);
    const fbLink = screen.getByRole('link', { name: /facebook/i });
    const igLink = screen.getByRole('link', { name: /instagram/i });
    const ytLink = screen.getByRole('link', { name: /youtube/i });

    expect(fbLink.getAttribute('href')).toBe('https://facebook.com/mimpkdimoro');
    expect(igLink.getAttribute('href')).toBe('https://instagram.com/mimpkdimoro');
    expect(ytLink.getAttribute('href')).toBe('https://youtube.com/@mimpkdimoro');
    expect(fbLink.getAttribute('target')).toBe('_blank');
  });

  it('handles back to top click smoothly', () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<Footer />);
    const topButton = screen.getByRole('button', { name: /kembali ke atas|ke atas/i });
    fireEvent.click(topButton);

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails against the old Footer**

Run: `npx vitest run components/layout/__tests__/Footer.test.tsx`
Expected: FAIL due to missing "Program Khusus", "Berita & Kegiatan", and "Portal Wali Murid" links.

---

### Task 2: Implement Redesigned Footer Component (`components/layout/Footer.tsx`)

**Files:**
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Write implementation of `Footer.tsx`**

Implement `components/layout/Footer.tsx` with:
- Warm, elegant background with subtle gradient glow (`bg-gradient-to-b from-card to-secondary/30 dark:from-card dark:to-background border-t border-border/60`).
- 4-Column Grid:
  1. **Brand Hub**: Logo container with glow, `{SCHOOL_FULL_NAME}`, badge `"Madrasah Ibtidaiyah Program Khusus"`, mission statement, and quick WhatsApp consultation CTA button.
  2. **Jelajah Madrasah**: Clean vertical links with chevron indicators and subtle slide animations (`group-hover:translate-x-1`).
  3. **Layanan & Akademik**: Quick links to PPDB Online, Kalender Akademik, Portal Wali Murid, and Kontak.
  4. **Kontak & Jam Operasional**: Clickable address with Maps icon, WhatsApp link with phone icon, Email mailto link, school operating hours card, and social media icons with spring hover effects.
- **Bottom Bar**: Copyright text, school name, and "Ke Atas" (Back to Top) button.

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run components/layout/__tests__/Footer.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/layout/Footer.tsx components/layout/__tests__/Footer.test.tsx
git commit -m "feat(footer): redesign public footer into modern editorial and brand hub"
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
