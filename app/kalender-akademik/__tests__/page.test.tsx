import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import KalenderAkademikPage, { metadata, dynamic } from '../page';
import { SCHOOL_NAME, SCHOOL_FULL_NAME, SCHOOL_DOMAIN } from '@/lib/school-config';

// Mock Supabase Server Client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Mock Supabase Client Client in case child component triggers it
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        or: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        gte: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
  }),
}));

import { createClient } from '@/lib/supabase/server';

describe('Public Kalender Akademik Page (app/kalender-akademik/page.tsx)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 7, 15, 8, 0, 0)); // 15 Agustus 2025
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockEvents = [
    {
      id: 1,
      judul: 'Upacara Kemerdekaan RI ke-80',
      tanggal: '2025-08-17',
      kategori: 'Kegiatan Sekolah',
      deskripsi: 'Upacara bendera bersama seluruh siswa dan dewan guru.',
      waktu: '07:00 - 09:30 WIB',
      warna: '#16a34a',
    },
    {
      id: 2,
      judul: 'Penilaian Akhir Semester',
      tanggal: '2025-12-01',
      tanggal_berakhir: '2025-12-06',
      kategori: 'Kegiatan Sekolah',
      deskripsi: 'Pelaksanaan PAS Gasal seluruh tingkat kelas.',
      waktu: '07:30 - 11:30 WIB',
      warna: '#f59e0b',
    },
  ];

  const setupMockSupabase = (data: any[] | null, error: any = null) => {
    const orderMock = vi.fn().mockResolvedValue({ data, error });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    const mockSupabase = {
      from: fromMock,
      selectMock,
      orderMock,
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    return mockSupabase;
  };

  describe('Configuration & Metadata', () => {
    it('exports dynamic = "force-dynamic"', () => {
      expect(dynamic).toBe('force-dynamic');
    });

    it('exports SEO metadata with correct title, description, canonical, and OpenGraph', () => {
      expect(metadata.title).toBe(`Kalender Akademik - ${SCHOOL_NAME}`);
      expect(metadata.description).toBe(
        'Jadwal kegiatan belajar mengajar, asesmen, libur semester, dan agenda penting madrasah'
      );
      expect(metadata.alternates?.canonical).toBe('/kalender-akademik');
      expect(metadata.openGraph).toEqual({
        title: `Kalender Akademik - ${SCHOOL_NAME}`,
        description: 'Jadwal kegiatan belajar mengajar, asesmen, libur semester, dan agenda penting madrasah',
        url: '/kalender-akademik',
        siteName: SCHOOL_NAME,
        locale: 'id_ID',
        type: 'website',
      });
    });
  });

  describe('Server-Side Data Fetching & Page Rendering', () => {
    it('queries kalender_akademik table ordered by tanggal ascending', async () => {
      const mockSupabase = setupMockSupabase(mockEvents);

      const jsx = await KalenderAkademikPage();
      render(jsx);

      expect(mockSupabase.from).toHaveBeenCalledWith('kalender_akademik');
      expect(mockSupabase.selectMock).toHaveBeenCalledWith('*');
      expect(mockSupabase.orderMock).toHaveBeenCalledWith('tanggal', { ascending: true });
    });

    it('renders PageHeader with correct title and description', async () => {
      setupMockSupabase(mockEvents);

      const jsx = await KalenderAkademikPage();
      render(jsx);

      expect(screen.getByRole('heading', { name: 'Kalender Akademik', level: 1 })).toBeInTheDocument();
      expect(
        screen.getByText('Jadwal kegiatan belajar mengajar, asesmen, libur semester, dan agenda penting madrasah')
      ).toBeInTheDocument();
    });

    it('renders Schema.org JSON-LD structured data with educational events', async () => {
      setupMockSupabase(mockEvents);

      const jsx = await KalenderAkademikPage();
      const { container } = render(jsx);

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();

      const jsonLd = JSON.parse(script!.textContent || '{}');
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('ItemList');
      expect(jsonLd.name).toContain('Kalender Akademik');
      expect(jsonLd.itemListElement).toHaveLength(2);

      // Verify item 1
      expect(jsonLd.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'EducationEvent',
          name: 'Upacara Kemerdekaan RI ke-80',
          description: 'Upacara bendera bersama seluruh siswa dan dewan guru.',
          startDate: '2025-08-17',
          endDate: '2025-08-17',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: SCHOOL_FULL_NAME,
            url: SCHOOL_DOMAIN,
          },
          organizer: {
            '@type': 'EducationalOrganization',
            name: SCHOOL_FULL_NAME,
            url: SCHOOL_DOMAIN,
          },
        },
      });

      // Verify item 2 with date range
      expect(jsonLd.itemListElement[1].item.startDate).toBe('2025-12-01');
      expect(jsonLd.itemListElement[1].item.endDate).toBe('2025-12-06');
    });

    it('renders initial calendar events within responsive container', async () => {
      setupMockSupabase(mockEvents);

      const jsx = await KalenderAkademikPage();
      const { container } = render(jsx);

      // Verify responsive container class
      const contentContainer = container.querySelector('.container.mx-auto.px-4.pb-16');
      expect(contentContainer).not.toBeNull();

      // Check that events are passed to KalenderAkademik component
      const matches = screen.getAllByText('Upacara Kemerdekaan RI ke-80');
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Error & Fallback Handling', () => {
    it('handles empty events array from Supabase gracefully', async () => {
      setupMockSupabase([]);

      const jsx = await KalenderAkademikPage();
      const { container } = render(jsx);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script!.textContent || '{}');
      expect(jsonLd.itemListElement).toEqual([]);
      expect(screen.getByRole('heading', { name: 'Kalender Akademik', level: 1 })).toBeInTheDocument();
    });

    it('handles Supabase fetch error gracefully without crashing', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      setupMockSupabase(null, new Error('Database connection failed'));

      const jsx = await KalenderAkademikPage();
      const { container } = render(jsx);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching kalender akademik:',
        expect.any(Error)
      );

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script!.textContent || '{}');
      expect(jsonLd.itemListElement).toEqual([]);
      expect(screen.getByRole('heading', { name: 'Kalender Akademik', level: 1 })).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });
  });
});
