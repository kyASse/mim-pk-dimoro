import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

// Mock matchMedia for jsdom
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock Next.js navigation with /admin/pendaftar as active route
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

    // Verify all 5 group labels
    expect(await screen.findByText(/Utama/i)).toBeDefined();
    expect(screen.getByText(/Kesiswaan & PPDB/i)).toBeDefined();
    expect(screen.getByText(/Akademik & Agenda/i)).toBeDefined();
    expect(screen.getByText(/Publikasi & Media/i)).toBeDefined();
    expect(screen.getByText(/Komunikasi & Pengaturan/i)).toBeDefined();

    // Verify key menu items
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Pendaftar PPDB')).toBeDefined();
    expect(screen.getByText('Data Siswa')).toBeDefined();
    expect(screen.getByText('Biaya & SPP')).toBeDefined();
    expect(screen.getByText('E-Rapor & Akademik')).toBeDefined();
    expect(screen.getByText('Kalender Akademik')).toBeDefined();
    expect(screen.getByText('Prestasi Siswa')).toBeDefined();
    expect(screen.getByText('Berita & Artikel')).toBeDefined();
    expect(screen.getByText('Galeri Foto')).toBeDefined();
    expect(screen.getByText('Testimoni Wali')).toBeDefined();
    expect(screen.getByText('Pesan Masuk')).toBeDefined();
    expect(screen.getByText('Konten Halaman & Kontak')).toBeDefined();
    expect(screen.getByText('Generator Akun / Tools')).toBeDefined();
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

  it('highlights the active route matching pathname', async () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    );

    const pendaftarTrigger = await screen.findByRole('button', { name: /pendaftar ppdb/i });
    expect(pendaftarTrigger.getAttribute('data-active')).toBe('true');
  });
});
