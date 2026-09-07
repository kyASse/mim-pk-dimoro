import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import AboutSection from '@/components/home/AboutSection';
import ProgramSection from '@/components/home/ProgramSection';
import GalleryPreview, { FALLBACK_GALLERY_IMAGES } from '@/components/home/GalleryPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { HEADMASTER_WELCOME, EXCELLENT_PROGRAMS } from '@/lib/school-data';

// Setup IntersectionObserver mock for Vitest test environment
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock framer-motion & motion/react to avoid IntersectionObserver errors in test environment
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, whileInView, initial, viewport, transition, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, whileInView, initial, viewport, transition, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, whileInView, initial, viewport, transition, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => true,
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, whileInView, initial, viewport, transition, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, whileInView, initial, viewport, transition, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, whileInView, initial, viewport, transition, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => true,
}));

// Mock Supabase Client & Server
const mockBrowserSupabase = {
  from: vi.fn(),
};

const mockServerSupabase = {
  from: vi.fn(),
};

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockBrowserSupabase),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockServerSupabase),
}));

describe('Home Page Components Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AboutSection', () => {
    it('renders Headmaster Welcome title, name, summary, and link to /tentang-kami', () => {
      render(<AboutSection />);

      expect(screen.getByText(HEADMASTER_WELCOME.name)).toBeDefined();
      expect(screen.getByText(HEADMASTER_WELCOME.title)).toBeDefined();
      expect(screen.getByText(new RegExp(HEADMASTER_WELCOME.summary, 'i'))).toBeDefined();

      const link = screen.getByRole('link', { name: /baca sambutan selengkapnya/i });
      expect(link).toBeDefined();
      expect(link.getAttribute('href')).toBe('/tentang-kami');
    });
  });

  describe('ProgramSection', () => {
    it('renders Tahfidz Al-Qur\'an and Klinik Belajar details accurately from school-data', () => {
      render(<ProgramSection />);

      expect(screen.getByText(EXCELLENT_PROGRAMS.tahfidz.title)).toBeDefined();
      expect(screen.getByText(EXCELLENT_PROGRAMS.tahfidz.target)).toBeDefined();
      expect(screen.getByText(EXCELLENT_PROGRAMS.klinikBelajar.title)).toBeDefined();
      expect(screen.getByText(EXCELLENT_PROGRAMS.klinikBelajar.description)).toBeDefined();
    });
  });

  describe('GalleryPreview', () => {
    it('fetches 6 latest photos from Supabase galeri table and renders them', async () => {
      const mockPhotos = [
        {
          id: 101,
          image_url: '/images/test1.jpg',
          keterangan: 'Kegiatan Robotik Siswa',
          kategori: 'Teknologi',
          created_at: '2026-03-01T08:00:00Z',
        },
        {
          id: 102,
          image_url: '/images/test2.jpg',
          keterangan: 'Pawai Budaya Nusantara',
          kategori: 'Budaya',
          created_at: '2026-03-02T08:00:00Z',
        },
      ];

      const mockLimit = vi.fn().mockResolvedValue({
        data: mockPhotos,
        error: null,
      });
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });

      mockBrowserSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      render(<GalleryPreview />);

      await waitFor(() => {
        expect(mockBrowserSupabase.from).toHaveBeenCalledWith('galeri');
        expect(mockSelect).toHaveBeenCalledWith('*');
        expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
        expect(mockLimit).toHaveBeenCalledWith(6);
        expect(screen.getByText('Kegiatan Robotik Siswa')).toBeDefined();
        expect(screen.getByText('Pawai Budaya Nusantara')).toBeDefined();
        expect(screen.getByText('Teknologi')).toBeDefined();
        expect(screen.getByText('Budaya')).toBeDefined();
      });
    });

    it('opens lightbox preview modal on photo click and closes when clicking dismiss', async () => {
      const mockPhotos = [
        {
          id: 101,
          image_url: '/images/test-modal.jpg',
          keterangan: 'Foto Spesial Modal',
          kategori: 'Prestasi',
          created_at: '2026-03-01T08:00:00Z',
        },
      ];

      const mockLimit = vi.fn().mockResolvedValue({
        data: mockPhotos,
        error: null,
      });
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });

      mockBrowserSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      render(<GalleryPreview />);

      await waitFor(() => {
        expect(screen.getByText('Foto Spesial Modal')).toBeDefined();
      });

      // Click photo to open lightbox
      const photoCard = screen.getByText('Foto Spesial Modal');
      fireEvent.click(photoCard);

      // Modal close button should be in the document
      const closeBtn = screen.getByRole('button', { name: /tutup pratinjau/i });
      expect(closeBtn).toBeDefined();
      expect(screen.getByText('Kategori: Prestasi')).toBeDefined();

      // Close modal
      fireEvent.click(closeBtn);
      expect(screen.queryByRole('button', { name: /tutup pratinjau/i })).toBeNull();
    });

    it('falls back gracefully to default images array if Supabase query returns empty or errors', async () => {
      const mockLimit = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });

      mockBrowserSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      render(<GalleryPreview />);

      // Should show fallback array photos
      expect(screen.getByText(FALLBACK_GALLERY_IMAGES[0].alt)).toBeDefined();
      expect(screen.getByText(FALLBACK_GALLERY_IMAGES[1].alt)).toBeDefined();
    });
  });

  describe('TestimonialsSection', () => {
    it('fetches testimonials filtered by is_featured = true and limits to 6', async () => {
      const mockFeaturedTestimonials = [
        {
          id: 1,
          nama_orang_tua: 'Ahmad Fauzi',
          status_orang_tua: 'Wali Murid Kelas 4',
          isi_testimoni: 'Pendidikan karakter di madrasah ini sangat luar biasa.',
          avatar_url: '/avatar1.jpg',
          is_featured: true,
          created_at: '2026-01-01T00:00:00Z',
        },
        {
          id: 2,
          nama_orang_tua: 'Siti Rahma',
          status_orang_tua: 'Wali Murid Kelas 2',
          isi_testimoni: 'Anak saya semakin rajin shalat dan murojaah hafalan.',
          avatar_url: '/avatar2.jpg',
          is_featured: true,
          created_at: '2026-01-02T00:00:00Z',
        },
      ];

      const mockFeaturedLimit = vi.fn().mockResolvedValue({
        data: mockFeaturedTestimonials,
        error: null,
      });
      const mockFeaturedOrder = vi.fn().mockReturnValue({ limit: mockFeaturedLimit });
      const mockEq = vi.fn().mockReturnValue({ order: mockFeaturedOrder });

      mockServerSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      });

      const jsx = await TestimonialsSection();
      render(jsx);

      expect(mockServerSupabase.from).toHaveBeenCalledWith('testimoni');
      expect(mockEq).toHaveBeenCalledWith('is_featured', true);
      expect(mockFeaturedOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockFeaturedLimit).toHaveBeenCalledWith(6);

      expect(screen.getByText('Ahmad Fauzi')).toBeDefined();
      expect(screen.getByText('Wali Murid Kelas 4')).toBeDefined();
      expect(screen.getByText(/Pendidikan karakter di madrasah ini sangat luar biasa/i)).toBeDefined();
      expect(screen.getByText('Siti Rahma')).toBeDefined();
    });

    it('falls back to fetching latest 3 testimonials if no featured testimonials exist', async () => {
      const mockFallbackTestimonials = [
        {
          id: 10,
          nama_orang_tua: 'Budi Santoso',
          status_orang_tua: 'Orang Tua Siswa Kelas 1',
          isi_testimoni: 'Guru-guru sangat sabar dan telaten membimbing siswa.',
          avatar_url: '',
          is_featured: false,
          created_at: '2026-02-01T00:00:00Z',
        },
      ];

      // 1. Featured query returns empty array
      const mockFeaturedLimit = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });
      const mockFeaturedOrder = vi.fn().mockReturnValue({ limit: mockFeaturedLimit });
      const mockEq = vi.fn().mockReturnValue({ order: mockFeaturedOrder });

      // 2. Fallback query returns 3 latest
      const mockFallbackLimit = vi.fn().mockResolvedValue({
        data: mockFallbackTestimonials,
        error: null,
      });
      const mockFallbackOrder = vi.fn().mockReturnValue({ limit: mockFallbackLimit });

      mockServerSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: mockEq,
          order: mockFallbackOrder,
        }),
      });

      const jsx = await TestimonialsSection();
      render(jsx);

      expect(mockEq).toHaveBeenCalledWith('is_featured', true);
      expect(mockFallbackOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockFallbackLimit).toHaveBeenCalledWith(3);

      expect(screen.getByText('Budi Santoso')).toBeDefined();
      expect(screen.getByText('Orang Tua Siswa Kelas 1')).toBeDefined();
    });

    it('renders empty state when no testimonials are found at all', async () => {
      // 1. Featured query returns empty
      const mockFeaturedLimit = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });
      const mockFeaturedOrder = vi.fn().mockReturnValue({ limit: mockFeaturedLimit });
      const mockEq = vi.fn().mockReturnValue({ order: mockFeaturedOrder });

      // 2. Fallback query returns empty
      const mockFallbackLimit = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });
      const mockFallbackOrder = vi.fn().mockReturnValue({ limit: mockFallbackLimit });

      mockServerSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: mockEq,
          order: mockFallbackOrder,
        }),
      });

      const jsx = await TestimonialsSection();
      render(jsx);

      expect(screen.getByText('Belum ada testimoni yang ditampilkan saat ini.')).toBeDefined();
    });
  });
});
