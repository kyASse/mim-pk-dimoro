import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import GaleriPublikPage, { metadata } from '../page';
import Loading from '../loading';
import { SCHOOL_NAME } from '@/lib/school-config';

// Mock Supabase Server Client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Mock GalleryClient to easily inspect props passed
vi.mock('@/components/galeri/GalleryClient', () => ({
  default: ({ galeriData, kategoriList, currentKategori }: any) => (
    <div data-testid="gallery-client">
      <div data-testid="gallery-count">{galeriData.length}</div>
      <div data-testid="kategori-list">{kategoriList.join(',')}</div>
      <div data-testid="current-kategori">{currentKategori || 'none'}</div>
      {galeriData.map((item: any) => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          {item.title} - {item.category}
        </div>
      ))}
    </div>
  ),
}));

import { createClient } from '@/lib/supabase/server';

describe('Public Galeri Page & Skeleton', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Page Metadata', () => {
    it('exports SEO metadata with correct title and OpenGraph info', () => {
      expect(metadata.title).toContain('Galeri Kegiatan');
      expect(metadata.title).toContain(SCHOOL_NAME);
      expect(metadata.description).toBeDefined();
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toContain('Galeri Kegiatan');
      expect(metadata.openGraph?.siteName).toBe(SCHOOL_NAME);
    });
  });

  describe('GaleriPublikPage Server Component', () => {
    it('fetches gallery data ordered by created_at desc, extracts unique categories, and renders GalleryClient', async () => {
      const mockGaleriRecords = [
        {
          id: 1,
          image_url: '/images/galeri/tahfidz-1.jpg',
          keterangan: 'Wisuda Tahfidz',
          kategori: 'Tahfidz',
          created_at: '2025-01-15T08:00:00Z',
        },
        {
          id: 2,
          image_url: '/images/galeri/kegiatan-1.jpg',
          keterangan: 'Praktik Sains',
          kategori: 'Kegiatan Belajar',
          created_at: '2025-02-10T09:30:00Z',
        },
        {
          id: 3,
          image_url: '/images/galeri/tahfidz-2.jpg',
          keterangan: 'Murojaah Pagi',
          kategori: 'Tahfidz',
          created_at: '2025-03-01T10:00:00Z',
        },
      ];

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockGaleriRecords,
              error: null,
            }),
          }),
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const searchParams = Promise.resolve({ kategori: 'Tahfidz' });
      const jsx = await GaleriPublikPage({ searchParams });
      render(jsx);

      expect(screen.getByTestId('gallery-client')).toBeDefined();
      expect(screen.getByTestId('gallery-count').textContent).toBe('3');
      expect(screen.getByTestId('kategori-list').textContent).toBe('Tahfidz,Kegiatan Belajar');
      expect(screen.getByTestId('current-kategori').textContent).toBe('Tahfidz');
      expect(screen.getAllByText(/Galeri Kegiatan/i).length).toBeGreaterThan(0);
    });

    it('renders thematic Islamic Oasis error state when Supabase database query fails', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: new Error('Postgres connection timeout'),
            }),
          }),
        }),
      };

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const searchParams = Promise.resolve({});
      const jsx = await GaleriPublikPage({ searchParams });
      render(jsx);

      expect(screen.getByText(/Gagal Memuat Galeri/i)).toBeDefined();
      expect(screen.queryByTestId('gallery-client')).toBeNull();
    });

    it('handles unexpected exceptions and renders error state', async () => {
      vi.mocked(createClient).mockRejectedValue(new Error('Fatal Client Crash'));

      const searchParams = Promise.resolve({});
      const jsx = await GaleriPublikPage({ searchParams });
      render(jsx);

      expect(screen.getByRole('heading', { name: /Terjadi Kesalahan/i })).toBeDefined();
    });
  });

  describe('Galeri Loading Skeleton', () => {
    it('renders skeleton elements for header, spotlight card, control bar, and masonry grid', () => {
      const { container } = render(<Loading />);
      
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(10);
    });
  });
});
