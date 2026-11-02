import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import KelolaGaleriPage from '../page';

// Mock Supabase Server Client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Mock GaleriAdminHub
vi.mock('@/components/admin/galeri/GaleriAdminHub', () => ({
  default: ({ items }: { items: any[] }) => (
    <div data-testid="galeri-admin-hub" data-item-count={items.length}>
      GaleriAdminHub Mock
    </div>
  ),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { createClient } from '@/lib/supabase/server';

describe('KelolaGaleriPage Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumbs, title, public gallery shortcut link, and GaleriAdminHub', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'admin-123' } },
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [
              { id: 1, image_url: 'https://example.com/1.jpg', keterangan: 'Foto 1', kategori: 'Ibadah' },
            ],
            error: null,
          }),
        }),
      }),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const jsx = await KelolaGaleriPage();
    render(jsx);

    expect(screen.getByText('Dasbor')).toBeDefined();
    expect(screen.getByText('Manajemen Galeri Madrasah')).toBeDefined();
    expect(screen.getByText('Lihat Galeri Publik')).toBeDefined();

    const hub = screen.getByTestId('galeri-admin-hub');
    expect(hub.getAttribute('data-item-count')).toBe('1');
  });
});
