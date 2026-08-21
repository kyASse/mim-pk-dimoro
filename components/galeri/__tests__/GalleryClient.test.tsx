import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import React from 'react';
import GalleryClient, { GalleryItem } from '@/components/galeri/GalleryClient';

// Mock useRouter
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/galeri',
}));

// Mock framer-motion & motion/react stripping motion-specific props
vi.mock('framer-motion', () => {
  const createMock = (Tag: string) => {
    const MockComponent = ({
      children,
      layout: _layout,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      whileInView: _whileInView,
      ...props
    }: any) => React.createElement(Tag, props, children);
    MockComponent.displayName = `MockMotion${Tag}`;
    return MockComponent;
  };

  return {
    motion: {
      div: createMock('div'),
      button: createMock('button'),
      section: createMock('section'),
      article: createMock('article'),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useReducedMotion: () => true,
  };
});

vi.mock('motion/react', () => {
  const createMock = (Tag: string) => {
    const MockComponent = ({
      children,
      layout: _layout,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      whileInView: _whileInView,
      ...props
    }: any) => React.createElement(Tag, props, children);
    MockComponent.displayName = `MockMotionReact${Tag}`;
    return MockComponent;
  };

  return {
    motion: {
      div: createMock('div'),
      button: createMock('button'),
      section: createMock('section'),
      article: createMock('article'),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useReducedMotion: () => true,
  };
});

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const sampleGaleriData: GalleryItem[] = [
  {
    id: 1,
    src: '/images/galeri/tahfidz-1.jpg',
    title: 'Wisuda Santri Tahfidz Juz 30',
    description: 'Kegiatan wisuda santri tahfidz juz 30 angkatan ke-5',
    category: 'Tahfidz',
    created_at: '2025-01-15T08:00:00Z',
  },
  {
    id: 2,
    src: '/images/galeri/kegiatan-1.jpg',
    title: 'Praktik Sains di Laboratorium',
    description: 'Siswa kelas 5 melakukan eksperimen fisika sederhana',
    category: 'Kegiatan Belajar',
    created_at: '2025-02-10T09:30:00Z',
  },
  {
    id: 3,
    src: '/images/galeri/prestasi-1.jpg',
    title: 'Juara 1 Lomba Robotik Nasional',
    description: 'Tim robotik MIM PK Dimoro meraih medali emas',
    category: 'Prestasi',
    created_at: '2025-03-01T10:00:00Z',
  },
];

const sampleKategoriList = ['Tahfidz', 'Kegiatan Belajar', 'Prestasi'];

describe('GalleryClient Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  describe('Rendering & Hero Spotlight', () => {
    it('renders hero spotlight card with featured image, category badge, and title', () => {
      render(
        <GalleryClient
          galeriData={sampleGaleriData}
          kategoriList={sampleKategoriList}
        />
      );

      // Hero Spotlight label & title
      expect(screen.getByText(/Sorotan Momen/i)).toBeDefined();
      expect(screen.getAllByText('Wisuda Santri Tahfidz Juz 30').length).toBeGreaterThan(0);
      expect(screen.getAllByText(/15 Januari 2025/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /buka foto|lihat foto penuh/i })).toBeDefined();
    });

    it('renders category filter chips with item counts', () => {
      render(
        <GalleryClient
          galeriData={sampleGaleriData}
          kategoriList={sampleKategoriList}
        />
      );

      expect(screen.getByRole('button', { name: /Semua Foto \(3\)/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Tahfidz \(1\)/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Kegiatan Belajar \(1\)/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Prestasi \(1\)/i })).toBeDefined();
    });

    it('renders empty state when galeriData is empty', () => {
      render(
        <GalleryClient
          galeriData={[]}
          kategoriList={[]}
        />
      );

      expect(screen.getByText(/Belum ada foto yang tersedia saat ini/i)).toBeDefined();
    });
  });

  describe('Live Search & Category Filtering', () => {
    it('filters gallery items in real-time when searching by title or description', () => {
      render(
        <GalleryClient
          galeriData={sampleGaleriData}
          kategoriList={sampleKategoriList}
        />
      );

      const searchInput = screen.getByPlaceholderText(/cari foto, tema, atau kegiatan/i);
      fireEvent.change(searchInput, { target: { value: 'Robotik' } });

      // Should show only the robotik item
      expect(screen.getAllByText('Juara 1 Lomba Robotik Nasional').length).toBeGreaterThan(0);
      expect(screen.queryByText('Praktik Sains di Laboratorium')).toBeNull();
    });

    it('clears search input with clear button and restores full list', () => {
      render(
        <GalleryClient
          galeriData={sampleGaleriData}
          kategoriList={sampleKategoriList}
        />
      );

      const searchInput = screen.getByPlaceholderText(/cari foto, tema, atau kegiatan/i);
      fireEvent.change(searchInput, { target: { value: 'Robotik' } });

      const clearBtn = screen.getByRole('button', { name: /hapus pencarian/i });
      fireEvent.click(clearBtn);

      expect((searchInput as HTMLInputElement).value).toBe('');
      expect(screen.getAllByText('Praktik Sains di Laboratorium').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Juara 1 Lomba Robotik Nasional').length).toBeGreaterThan(0);
    });

    it('filters items when clicking a category chip', () => {
      render(
        <GalleryClient
          galeriData={sampleGaleriData}
          kategoriList={sampleKategoriList}
        />
      );

      const tahfidzChip = screen.getByRole('button', { name: /Tahfidz \(1\)/i });
      fireEvent.click(tahfidzChip);

      expect(screen.getAllByText('Wisuda Santri Tahfidz Juz 30').length).toBeGreaterThan(0);
      expect(screen.queryByText('Praktik Sains di Laboratorium')).toBeNull();
    });

    it('renders friendly empty state with reset button when no results match', () => {
      render(
        <GalleryClient
          galeriData={sampleGaleriData}
          kategoriList={sampleKategoriList}
        />
      );

      const searchInput = screen.getByPlaceholderText(/cari foto, tema, atau kegiatan/i);
      fireEvent.change(searchInput, { target: { value: 'TidakAdaKataKunciIni' } });

      expect(screen.getByText(/Tidak Ada Foto Ditemukan/i)).toBeDefined();

      const resetBtn = screen.getByRole('button', { name: /reset filter & pencarian|reset filter/i });
      fireEvent.click(resetBtn);

      expect(screen.getAllByText('Wisuda Santri Tahfidz Juz 30').length).toBeGreaterThan(0);
    });
  });

  describe('Cinematic Lightbox Modal', () => {
    it('opens lightbox when clicking a gallery card', () => {
      render(
        <GalleryClient
          galeriData={sampleGaleriData}
          kategoriList={sampleKategoriList}
        />
      );

      const card = screen.getByTestId('gallery-card-2');
      fireEvent.click(card);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeDefined();

      const dialogWithin = within(dialog);
      expect(dialogWithin.getByText('Praktik Sains di Laboratorium')).toBeDefined();
      expect(dialogWithin.getByText('Siswa kelas 5 melakukan eksperimen fisika sederhana')).toBeDefined();
      expect(dialogWithin.getByText('2 / 3')).toBeDefined();
    });

    it('navigates next and previous in lightbox', () => {
      render(
        <GalleryClient
          galeriData={sampleGaleriData}
          kategoriList={sampleKategoriList}
        />
      );

      // Open first item
      const card = screen.getByTestId('gallery-card-1');
      fireEvent.click(card);

      let dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('1 / 3')).toBeDefined();

      // Click Next
      const nextBtn = screen.getByRole('button', { name: /foto berikutnya/i });
      fireEvent.click(nextBtn);

      dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('2 / 3')).toBeDefined();
      expect(within(dialog).getByText('Praktik Sains di Laboratorium')).toBeDefined();

      // Click Prev
      const prevBtn = screen.getByRole('button', { name: /foto sebelumnya/i });
      fireEvent.click(prevBtn);

      dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('1 / 3')).toBeDefined();
      expect(within(dialog).getByText('Wisuda Santri Tahfidz Juz 30')).toBeDefined();
    });

    it('supports keyboard navigation (ArrowRight, ArrowLeft, Escape)', () => {
      render(
        <GalleryClient
          galeriData={sampleGaleriData}
          kategoriList={sampleKategoriList}
        />
      );

      // Open first item
      const card = screen.getByTestId('gallery-card-1');
      fireEvent.click(card);

      let dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('1 / 3')).toBeDefined();

      // Press ArrowRight
      act(() => {
        fireEvent.keyDown(window, { key: 'ArrowRight' });
      });
      dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('2 / 3')).toBeDefined();

      // Press ArrowLeft
      act(() => {
        fireEvent.keyDown(window, { key: 'ArrowLeft' });
      });
      dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('1 / 3')).toBeDefined();

      // Press Escape to close
      act(() => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('copies photo link to clipboard on share button click', async () => {
      render(
        <GalleryClient
          galeriData={sampleGaleriData}
          kategoriList={sampleKategoriList}
        />
      );

      const card = screen.getByTestId('gallery-card-1');
      fireEvent.click(card);

      const shareBtn = screen.getByRole('button', { name: /bagikan foto|salin tautan/i });
      await act(async () => {
        fireEvent.click(shareBtn);
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });
});
