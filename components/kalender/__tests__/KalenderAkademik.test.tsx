import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CalendarEvent } from '@/lib/utils/calendar-query';
import CalendarHeaderBar from '../CalendarHeaderBar';
import UpcomingEventsSection from '../UpcomingEventsSection';
import CalendarGridView from '../CalendarGridView';
import CalendarAgendaView from '../CalendarAgendaView';
import EventDetailModal from '../EventDetailModal';
import KalenderAkademik from '../KalenderAkademik';
import * as calendarExport from '@/lib/utils/calendar-export';

// Mock Supabase client
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

describe('Academic Calendar Revamp (Task 2)', () => {
  const mockEvents: CalendarEvent[] = [
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
      judul: 'Libur Maulid Nabi Muhammad SAW',
      tanggal: '2025-09-05',
      kategori: 'Libur Umum',
      deskripsi: 'Hari libur nasional memperingati Maulid Nabi.',
      warna: '#e11d48',
    },
    {
      id: 3,
      judul: 'Penilaian Tengah Semester Gasal',
      tanggal: '2025-09-15',
      tanggal_berakhir: '2025-09-20',
      kategori: 'Kegiatan Sekolah',
      deskripsi: 'PTS Gasal untuk kelas 1 sampai kelas 6.',
      waktu: '07:30 - 11:30 WIB',
      warna: '#16a34a',
    },
    {
      id: 4,
      judul: 'Parenting & Komite Sekolah',
      tanggal: '2025-08-17',
      kategori: 'Parenting',
      deskripsi: 'Pertemuan wali murid dan parenting santai.',
      waktu: '10:00 - 12:00 WIB',
      warna: '#2563eb',
    },
    {
      id: 5,
      judul: 'Pemeriksaan Kesehatan Anak',
      tanggal: '2025-08-17',
      kategori: 'Kegiatan Sekolah',
      deskripsi: 'Screening kesehatan oleh Puskesmas.',
      waktu: '08:00 - 10:00 WIB',
      warna: '#16a34a',
    },
  ];

  describe('1. CalendarHeaderBar Component', () => {
    it('renders search input, category chips, view switcher, and sync button', () => {
      const onSearchChange = vi.fn();
      const onCategoryChange = vi.fn();
      const onViewChange = vi.fn();
      const onSyncAll = vi.fn();

      render(
        <CalendarHeaderBar
          searchQuery=""
          onSearchChange={onSearchChange}
          selectedCategory={null}
          onCategoryChange={onCategoryChange}
          activeView="grid"
          onViewChange={onViewChange}
          categories={['Kegiatan Sekolah', 'Libur Umum', 'Parenting']}
          onSyncAll={onSyncAll}
        />
      );

      // Search input
      const searchInput = screen.getByPlaceholderText(/Cari agenda atau kegiatan/i);
      expect(searchInput).toBeInTheDocument();

      // Category chips
      expect(screen.getByRole('button', { name: /^Semua$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Kegiatan Sekolah/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Libur Umum/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Parenting/i })).toBeInTheDocument();

      // View switcher
      expect(screen.getByRole('button', { name: /Kalender/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Agenda/i })).toBeInTheDocument();

      // Sync button
      const syncBtn = screen.getByRole('button', { name: /Sync|Unduh|\.ics/i });
      expect(syncBtn).toBeInTheDocument();
      fireEvent.click(syncBtn);
      expect(onSyncAll).toHaveBeenCalled();
    });

    it('handles search input change and clearing search query', () => {
      const onSearchChange = vi.fn();
      render(
        <CalendarHeaderBar
          searchQuery="Upacara"
          onSearchChange={onSearchChange}
          selectedCategory={null}
          onCategoryChange={vi.fn()}
          activeView="grid"
          onViewChange={vi.fn()}
          categories={['Kegiatan Sekolah']}
        />
      );

      const searchInput = screen.getByPlaceholderText(/Cari agenda atau kegiatan/i);
      expect(searchInput).toHaveValue('Upacara');

      // Clear button should be visible when searchQuery is not empty
      const clearBtn = screen.getByLabelText(/Hapus pencarian|Clear search/i);
      fireEvent.click(clearBtn);
      expect(onSearchChange).toHaveBeenCalledWith('');
    });

    it('triggers onCategoryChange and onViewChange correctly', () => {
      const onCategoryChange = vi.fn();
      const onViewChange = vi.fn();

      render(
        <CalendarHeaderBar
          searchQuery=""
          onSearchChange={vi.fn()}
          selectedCategory="Kegiatan Sekolah"
          onCategoryChange={onCategoryChange}
          activeView="grid"
          onViewChange={onViewChange}
          categories={['Kegiatan Sekolah', 'Libur Umum']}
        />
      );

      // Clicking 'Libur Umum' should select it
      fireEvent.click(screen.getByRole('button', { name: /Libur Umum/i }));
      expect(onCategoryChange).toHaveBeenCalledWith('Libur Umum');

      // Clicking 'Semua' should set category to null
      fireEvent.click(screen.getByRole('button', { name: /^Semua$/i }));
      expect(onCategoryChange).toHaveBeenCalledWith(null);

      // Switching view
      fireEvent.click(screen.getByRole('button', { name: /Agenda/i }));
      expect(onViewChange).toHaveBeenCalledWith('agenda');
    });
  });

  describe('2. UpcomingEventsSection Component', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 7, 15, 8, 0, 0)); // 15 Agustus 2025
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('renders upcoming Bento cards with countdown badges and sync links', () => {
      render(<UpcomingEventsSection events={mockEvents} />);

      // Upacara is on 17 Aug -> 2 days away -> "H-2 (2 hari lagi)"
      expect(screen.getByText('Upacara Kemerdekaan RI ke-80')).toBeInTheDocument();
      const countdowns = screen.getAllByText(/H-2/i);
      expect(countdowns.length).toBeGreaterThan(0);

      // Check category badge
      expect(screen.getAllByText('Kegiatan Sekolah').length).toBeGreaterThan(0);

      // Check Google Calendar link
      const gcalLinks = screen.getAllByRole('link', { name: /Google Calendar|Google/i });
      expect(gcalLinks.length).toBeGreaterThan(0);
      expect(gcalLinks[0]).toHaveAttribute('href');
      expect(gcalLinks[0].getAttribute('href')).toContain('calendar.google.com');
    });

    it('returns null or empty message when no upcoming events exist', () => {
      const { container } = render(<UpcomingEventsSection events={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('3. CalendarGridView Component', () => {
    it('renders month title, day headers (Monday-first), and day cells', () => {
      const onNavigateMonth = vi.fn();
      const onToday = vi.fn();
      const onSelectDate = vi.fn();
      const date = new Date(2025, 7, 1); // Agustus 2025

      render(
        <CalendarGridView
          currentDate={date}
          onNavigateMonth={onNavigateMonth}
          onToday={onToday}
          events={mockEvents}
          selectedDate={null}
          onSelectDate={onSelectDate}
        />
      );

      // Header title
      expect(screen.getByText(/Agustus 2025/i)).toBeInTheDocument();

      // Monday-first days
      expect(screen.getByText('Sen')).toBeInTheDocument();
      expect(screen.getByText('Min')).toBeInTheDocument();

      // Navigation
      const prevBtn = screen.getByLabelText(/Bulan Sebelumnya/i);
      fireEvent.click(prevBtn);
      expect(onNavigateMonth).toHaveBeenCalledWith('prev');

      const nextBtn = screen.getByLabelText(/Bulan Berikutnya/i);
      fireEvent.click(nextBtn);
      expect(onNavigateMonth).toHaveBeenCalledWith('next');

      const todayBtn = screen.getByRole('button', { name: /Hari Ini/i });
      fireEvent.click(todayBtn);
      expect(onToday).toHaveBeenCalled();

      // On 17 Aug there are 3 events (1, 4, 5). Should show +1 lagi badge
      expect(screen.getByText('+1 lagi')).toBeInTheDocument();

      // Clicking a day cell triggers onSelectDate
      const dayCell = screen.getByText('17').closest('button, [role="button"], div[tabindex]');
      if (dayCell) {
        fireEvent.click(dayCell);
        expect(onSelectDate).toHaveBeenCalled();
      }
    });
  });

  describe('4. CalendarAgendaView Component', () => {
    it('groups events by Month & Year and displays large date badges and action buttons', () => {
      const downloadSpy = vi.spyOn(calendarExport, 'downloadICalFile').mockImplementation(() => {});

      render(<CalendarAgendaView events={mockEvents} />);

      // Month headers
      expect(screen.getByText(/Agustus 2025/i)).toBeInTheDocument();
      expect(screen.getByText(/September 2025/i)).toBeInTheDocument();

      // Event titles
      expect(screen.getByText('Upacara Kemerdekaan RI ke-80')).toBeInTheDocument();
      expect(screen.getByText('Libur Maulid Nabi Muhammad SAW')).toBeInTheDocument();

      // Multi-day date range badge
      expect(screen.getByText(/15 Sep 2025 - 20 Sep 2025/i)).toBeInTheDocument();

      // Download .ics button
      const icsButtons = screen.getAllByRole('button', { name: /Unduh \.ics|Download \.ics|\.ics/i });
      expect(icsButtons.length).toBeGreaterThan(0);
      fireEvent.click(icsButtons[0]);
      expect(downloadSpy).toHaveBeenCalled();
    });

    it('renders empty state when events list is empty', () => {
      const onResetFilter = vi.fn();
      render(<CalendarAgendaView events={[]} onResetFilter={onResetFilter} />);

      expect(screen.getByText(/Tidak ada kegiatan ditemukan/i)).toBeInTheDocument();
      const resetBtn = screen.getByRole('button', { name: /Reset Filter/i });
      fireEvent.click(resetBtn);
      expect(onResetFilter).toHaveBeenCalled();
    });
  });

  describe('5. EventDetailModal Component', () => {
    it('renders event details inside dialog for selected date', () => {
      const onClose = vi.fn();
      const date = new Date(2025, 7, 17); // 17 Agustus 2025

      render(
        <EventDetailModal
          date={date}
          events={mockEvents}
          isOpen={true}
          onClose={onClose}
        />
      );

      // Dialog title with formatted date
      expect(screen.getByText(/17 Agustus 2025/i)).toBeInTheDocument();

      // Events on this date
      expect(screen.getByText('Upacara Kemerdekaan RI ke-80')).toBeInTheDocument();
      expect(screen.getByText('Parenting & Komite Sekolah')).toBeInTheDocument();
      expect(screen.getByText('Pemeriksaan Kesehatan Anak')).toBeInTheDocument();

      // Description and time
      expect(screen.getByText(/Upacara bendera bersama seluruh siswa/i)).toBeInTheDocument();
      expect(screen.getByText(/07:00 - 09:30 WIB/i)).toBeInTheDocument();
    });
  });

  describe('6. KalenderAkademik Orchestrator Integration', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 7, 15, 8, 0, 0)); // 15 Agustus 2025
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('integrates header, search filter, category filter, view switcher, and detail modal', async () => {
      render(<KalenderAkademik initialEvents={mockEvents} />);

      // Initial render shows header and grid view for current mocked month
      expect(screen.getByPlaceholderText(/Cari agenda atau kegiatan/i)).toBeInTheDocument();
      expect(screen.getByText(/Agustus 2025/i)).toBeInTheDocument();

      // Filter by search query
      const searchInput = screen.getByPlaceholderText(/Cari agenda atau kegiatan/i);
      fireEvent.change(searchInput, { target: { value: 'Maulid' } });

      // Switch to Agenda View to inspect filtered results
      const agendaBtn = screen.getByRole('button', { name: /Agenda/i });
      fireEvent.click(agendaBtn);

      // Only Maulid should be displayed in results
      expect(screen.getAllByText('Libur Maulid Nabi Muhammad SAW').length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText('Upacara Kemerdekaan RI ke-80')).not.toBeInTheDocument();

      // Filter by category
      const categoryChip = screen.getByRole('button', { name: /Parenting/i });
      fireEvent.click(categoryChip);
      // Query "Maulid" + Category "Parenting" should return 0 items
      expect(screen.getByText(/Tidak ada kegiatan ditemukan/i)).toBeInTheDocument();

      // Reset search by clicking clear
      const clearSearchBtn = screen.getByLabelText(/Hapus pencarian|Clear search/i);
      fireEvent.click(clearSearchBtn);

      // Now "Parenting & Komite Sekolah" should appear under Parenting category
      expect(screen.getAllByText('Parenting & Komite Sekolah').length).toBeGreaterThanOrEqual(1);
    });
  });
});
