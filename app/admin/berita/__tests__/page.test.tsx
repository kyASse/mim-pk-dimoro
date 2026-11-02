import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import KelolaBeritaPage from '../page';
import * as serverLib from '@/lib/supabase/server';

// Mock redirect
const mockRedirect = vi.fn();
vi.mock('next/navigation', () => ({
  redirect: (path: string) => mockRedirect(path),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock BeritaTable
vi.mock('@/components/admin/berita/BeritaTable', () => ({
  default: ({ berita }: { berita: any[] }) => (
    <div data-testid="mock-berita-table" data-count={berita.length}>
      BeritaTable Mock ({berita.length} items)
    </div>
  ),
}));

describe('KelolaBeritaPage (app/admin/berita/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login when user is not authenticated', async () => {
    vi.spyOn(serverLib, 'createClient').mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValueOnce({ data: { user: null } }),
      },
    } as any);

    await KelolaBeritaPage();
    expect(mockRedirect).toHaveBeenCalledWith('/auth/login');
  });

  it('renders header, breadcrumbs, and BeritaTable when authenticated', async () => {
    const mockData = [
      {
        id: 1,
        judul: 'Berita Sekolah 1',
        ringkasan: 'Ringkasan 1',
        tanggal_terbit: '2026-03-01',
        image_url: 'https://test.com/1.jpg',
        status: 'terbit',
      },
    ];

    vi.spyOn(serverLib, 'createClient').mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: 'user-1' } } }),
      },
      from: vi.fn().mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          order: vi.fn().mockResolvedValueOnce({ data: mockData, error: null }),
        }),
      }),
    } as any);

    const jsx = await KelolaBeritaPage();
    render(jsx as React.ReactElement);

    expect(screen.getByText('Kelola Berita & Artikel')).toBeDefined();
    expect(screen.getByRole('link', { name: /Tambah Berita/i })).toBeDefined();
    const tableEl = screen.getByTestId('mock-berita-table');
    expect(tableEl).toBeDefined();
    expect(tableEl.getAttribute('data-count')).toBe('1');
  });
});
